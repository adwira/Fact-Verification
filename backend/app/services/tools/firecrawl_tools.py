import httpx
from app.core.config import settings
from app.api.errors import AppBaseException

class FirecrawlTool:
  def __init__(self):
    self.api_key = settings.FIRECRAWL_API_KEY
    self.url = "https://api.firecrawl.dev/v1/scrape"
  
  async def scrape(self, target_url: str):
    headers = {
      "Authorization": f"Bearer {self.api_key}",
      "Content-Type": "application/json"
    }
    payload = {"url": target_url, "formats": ["markdown"]}
    
    async with httpx.AsyncClient() as client:
      try:
        response = await client.post(self.url, headers=headers, json=payload)
        response.raise_for_stauts()
        return response.json().get("data", {}).get("markdown", "")
      except Exception as e:
        raise AppBaseException(f"Firecrawl Error {str(e)}", status_code=502)