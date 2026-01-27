from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  # Nama Project
  PROJECT_NAME: str = "Fact Verification AI"
  
  # API Keys
  SERPER_API_KEY: str
  FIRECRAWL_API_KEY: str
  OPENAI_API_KEY: str
  
  # Konfigurasi Database/Cache
  CHROMA_DB_PATH: str = "./chroma_db"
  
  model_config = SettingsConfigDict(env_file=".env")
  
  @property
  def WHITELIST_DOMAINS(self) -> list[str]:
    path = Path("whitelist.json")
    if path.exists():
      with open(path, "r") as f:
        data = json.load(f)
        return data.get("trusted_domains", [])
    return []
  
settings = Settings()  