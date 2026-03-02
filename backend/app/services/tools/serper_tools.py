import httpx
import os
import json
from crewai.tools import BaseTool
from pydantic import Field
from urllib.parse import urlparse
from app.core.config import settings
from app.api.errors import AppBaseException


class SerperTool(BaseTool):
    """Tool untuk pencarian web via Serper API."""
    name: str = Field(default="serper_search", description="Search the web using Serper API")
    description: str = Field(
        default="Search the web for relevant URLs and snippets. Use for fact-checking and finding sources."
    )
    api_key: str = Field(default_factory=lambda: settings.SERPER_API_KEY)
    search_url: str = Field(default="https://google.serper.dev/search")
    whitelist: list = Field(default_factory=list)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.whitelist = self._load_whitelist()
    
    def _load_whitelist(self):
        try: 
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            file_path = os.path.join(base_path, 'whitelist.json')
            
            with open(file_path, 'r') as f:
                domains = json.load(f)
                
                return [d.lower().replace("www.", "").strip() for d in domains]
        except Exception as e:
            print(f"[WARNING] Gagal load whitelist.json: {e}")
            return []
    
    def _is_safe_domain(self, link: str) -> bool:
        if not self.whitelist:
            return True
        
        try:
            domain = urlparse(link).netloc.lower().replace("www.","")
            for trusted in self.whitelist:
                if domain == trusted or domain.endswith("." + trusted):
                    return True
            return False
        except:
            return False



    def _run(self, query: str, limit: int = 5) -> str:
        """Jalankan search secara sinkron (CrewAI memanggil run() dari dalam event loop)."""

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
        }
        payload = {"q": query, "gl": "id", "hl": "id", "num": limit}

        with httpx.Client() as client:
            try:
                response = client.post(
                    self.search_url,
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                organic = data.get("organic", [])
                filtered_results = []
                parts = []
                for item in organic:
                    if self._is_safe_domain(item.get("link", "")):
                        filtered_results.append({
                            "title": item.get("title"),
                            "link": item.get("link"),
                            "snippet": item.get('snippet'),
                            "date": item.get("date", "N/A")
                        })
                    
                if not filtered_results:
                    return json.dumps([{
                        "title": "Tidak ditemukan sumber terverifikasi",
                        "snippet": "Pencarian dilakukan namun tidak ditemukan artikel dari domain whitelist Dewan Pers yang relevan.",
                        "link": "N/A"
                    }])
                return json.dumps(filtered_results)
            except Exception as e:
                raise AppBaseException(f"Serper Error: {str(e)}", status_code=502)
