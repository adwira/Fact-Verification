import httpx
from app.core.config import settings
from app.api.errors import AppBaseException

class SerperTool:
  def __init__(self, whitelist: list[str] = None):
    self.api_key = settings.SERPER_API_KEY
    self.url = "https://google.serper.dev/search"
    self.whitelist = settings.WHITELIST_DOMAINS
  
  async def search(self, query: str, limit: int = 10):
    if self.whitelist:
      site_query = " OR ".join([f"site:{d}" for d in self.whitelist])
      final_query = f"({site_query}) {query}"
    else:
      final_query = query
    
    headears = {"X-API-KEY": self.api.key, "Content-Type": "application/json"}
    payload = {
      "q": final_query,
      "gl": "id",
      "hl": "id",
      "num": limit
      }
      
    async httpx.AsyncClient() as client:
      try:
        response = await client.post(self.url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
      except Exception as e:
        raise AppBaseException(f"Serper Error: {str(e)}", status_code=502)