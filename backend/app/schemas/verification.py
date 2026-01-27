from pydantic import BaseModel, Field
from typing import Optional, List

class VerificationRequest(BaseModel):
  claim: str = Field(..., min_length=100, description="Klaim berita yang ingin diverifikasi")

class VerificationResponse(BaseModel):
  claim: str
  verdict: str
  confidence_score: float
  explanation: str
  sources: List[str]
  is_from_cache: bool= False