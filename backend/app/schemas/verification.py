from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class VerificationRequest(BaseModel):
  claim: str = Field(..., min_length=50, description="Klaim berita yang ingin diverifikasi")
  bypass_cache: bool = Field(False, description="Membypass cache dan memaksa memverifikasi ulang dengan AI")

class VerificationResponse(BaseModel):
  claim: str
  verdict: str
  confidence_score: float
  explanation: str
  sources: List[str]
  verified_at: Optional[str] = None
  is_from_cache: bool= False