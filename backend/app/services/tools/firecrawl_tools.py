import re
import httpx
from crewai.tools import BaseTool
from pydantic import Field

from app.core.config import settings
from app.api.errors import AppBaseException

# Batas karakter untuk konten scrape (agar agent tidak kebanjiran teks)
MAX_CONTENT_CHARS = 14_000


def _clean_scraped_text(markdown: str) -> str:
    """
    Bersihkan konten dari pola yang biasanya bukan isi artikel:
    - Daftar link arsip/bulan berulang (e.g. [Januari 2020](url) per baris)
    - Blok yang didominasi link markdown berulang
    """
    if not markdown or not markdown.strip():
        return markdown

    lines = markdown.split("\n")
    cleaned: list[str] = []
    skip_until_empty = False
    consecutive_link_lines = 0

    for line in lines:
        stripped = line.strip()
        # Deteksi baris yang hanya berisi link markdown (arsip, navigasi)
        if re.match(r"^[\*\-\•]\s*\[.*?\]\(https?://[^\)]+\)\s*$", stripped):
            consecutive_link_lines += 1
            if consecutive_link_lines >= 5:
                skip_until_empty = True
            continue
        consecutive_link_lines = 0
        if skip_until_empty:
            if not stripped:
                skip_until_empty = False
            continue
        cleaned.append(line)

    result = "\n".join(cleaned)
    # Hapus blok kosong berlebihan
    result = re.sub(r"\n{4,}", "\n\n\n", result)
    return result.strip()


class FirecrawlTool(BaseTool):
    """Tool untuk scrape halaman web via Firecrawl API (hanya konten utama)."""

    name: str = Field(default="firecrawl_scrape", description="Scrape main content of a URL as markdown")
    description: str = Field(
        default="Scrape the main article/content of a web page (no nav, sidebar, footer). "
        "Use to fetch relevant text from a URL for fact-checking."
    )

    def _run(self, target_url: str) -> str:
        """Scrape hanya konten utama, dibersihkan dan dibatasi ukurannya."""
        headers = {
            "Authorization": f"Bearer {settings.FIRECRAWL_API_KEY}",
            "Content-Type": "application/json",
        }
        # onlyMainContent: hanya artikel/body utama, tanpa nav/sidebar/footer/arsip
        payload = {
            "url": target_url,
            "formats": ["markdown"],
            "onlyMainContent": True,
        }

        with httpx.Client(timeout=45) as client:
            try:
                response = client.post(
                    "https://api.firecrawl.dev/v1/scrape",
                    headers=headers,
                    json=payload,
                )
                # v1 bisa mengabaikan onlyMainContent; jika 422, coba tanpa onlyMainContent
                if response.status_code == 422:
                    payload.pop("onlyMainContent", None)
                    response = client.post(
                        "https://api.firecrawl.dev/v1/scrape",
                        headers=headers,
                        json=payload,
                    )
                response.raise_for_status()
                data = response.json()
                raw = data.get("data", {}) or data
                markdown = raw.get("markdown", "")
                if not markdown:
                    return "(Halaman tidak mengembalikan konten markdown.)"
            except httpx.HTTPStatusError as e:
                raise AppBaseException(
                    f"Firecrawl Error: {e.response.status_code} - {str(e.response.text[:200])}",
                    status_code=502,
                )
            except Exception as e:
                raise AppBaseException(f"Firecrawl Error: {str(e)}", status_code=502)

        cleaned = _clean_scraped_text(markdown)
        if len(cleaned) > MAX_CONTENT_CHARS:
            cleaned = cleaned[:MAX_CONTENT_CHARS] + "\n\n[... konten dipotong untuk efisiensi ...]"
        return cleaned or markdown[:MAX_CONTENT_CHARS]
