from fastapi import APIRouter, Depends, HTTPException
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.services.cache_service import CacheService
from app.api.errors import AppBaseException

router = APIRouter()

def get_cache_service():
  return CacheService()

@router.post("/verify", response_model=VerificationResponse)
async def verify_claim(
  request: VerificationRequest,
  cache_service: CacheService = Depends(get_cache_service)
):
  
  cache_result = await cache_service.find_similar_fact(request.claim)
  
  if not cache_result:
    raise AppBaseException("Klaim belum pernah diverifikasi. Agent akan dijalankan di tahap berikutnya.", status_code=404)
  
  return cache_result

  
  