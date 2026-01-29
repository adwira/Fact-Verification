from fastapi import APIRouter, Depends, HTTPException
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.services.cache_service import CacheService
from app.api.errors import AppBaseException

router = APIRouter()

def get_cache_service():
  return CacheService()

def get_agent_service():
    return FactCheckerCrew(experiment_type="cot")

@router.post("/verify", response_model=VerificationResponse)
async def verify_claim(
  request: VerificationRequest,
  cache_service: CacheService = Depends(get_cache_service),
  agent_service: FactCheckerCrew = Depends(get_agent_service)
):
  
  cache_result = await cache_service.find_similar_fact(request.claim)
  
  if cache_result:
    return cache_result
    # raise AppBaseException("Klaim belum pernah diverifikasi. Agent akan dijalankan di tahap berikutnya.", status_code=404)
  validation_output = agent_service.run_validation(inputs={'claim': request.claim})
  
try:
  val_data = json.loads(validation_output.raw)
  
  if not val_data.get("is_valid_claim", False):
    raise AppBaseException(
      message=f"Input Ditolak: {val_data.get('reason', 'Input Tidak Valid')}",
      status_code=400
    )

except json.JSONDecodeError:
  pass

crew_output = agent_service.run_verification(inputs={'claim': request.claim})

try:
  final_data = json.loads(crew_output.raw)
  
  response_data = VerificationResponse(
    claim=request.claim,
    verdict=final_data.get("verdict", "Tidak Terbukti"),
    confidence_score=final_data.get("confidence_score", 0.0),
    explanation=final_data.get("explanation", ""),
    sources=final_data.get("sources", [])
  )
  
  await cache_service.save_fact(response_data)
        
  return response_data

except json.JSONDecodeError:
  raise AppBaseException("Gagal memproses hasil dari AI Agent (Format Error).", status_code=500)
except Exception as e:
  raise AppBaseException(f"Terjadi kesalahan sistem: {str(e)}", status_code=500)