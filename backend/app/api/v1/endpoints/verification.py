import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.services.cache_service import CacheService
from app.services.agent_service import FactCheckerCrew
from app.api.errors import AppBaseException

router = APIRouter()

# Untuk menangani quota/rate limit Gemini API
def _is_gemini_quota_error(e: Exception) -> bool:
    if hasattr(e, "status_code") and getattr(e, "status_code") == 429:
        return True
    err_str = str(e).lower()
    return "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str

def extract_json_from_raw(raw_text: str) -> str:
    """Ekstrak JSON dari string   yang mungkin berisi blok markdown ```json ... ```"""
    if not raw_text:
        return "{}"
    
    # Cari pola ```json ... ``` atau ``` ... ```
    import re
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", raw_text, re.DOTALL)
    if match:
        return match.group(1).strip()
    
    return raw_text.strip()

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

  try:
    validation_output = agent_service.run_validation(inputs={'claim': request.claim})
  except Exception as e:
    if _is_gemini_quota_error(e):
      raise AppBaseException(
        message=(
          "Kuota Gemini API habis atau melebihi batas. "
          "Tunggu beberapa menit lalu coba lagi, atau periksa billing di Google AI Studio."
        ),
        status_code=503,
      )
    raise

  try:
    raw_val = extract_json_from_raw(validation_output.raw)
    val_data = json.loads(raw_val)

    if not val_data.get("is_valid_claim", False):
      raise AppBaseException(
        message=f"Input Ditolak: {val_data.get('reason', 'Input Tidak Valid')}",
        status_code=400
      )

  except json.JSONDecodeError:
    # Jika validator gagal memberikan JSON, kita log tapi mungkin lanjut jika darurat (atau stop jika ketat)
    # Untuk sekarang kita stop karena validator itu penting
    raise AppBaseException("Gagal memvalidasi input (Format Validator Error).", status_code=500)

  try:
    crew_output = agent_service.run_verification(inputs={'claim': request.claim})
  except Exception as e:
    if _is_gemini_quota_error(e):
      raise AppBaseException(
        message=(
          "Kuota Gemini API habis atau melebihi batas. "
          "Tunggu beberapa menit lalu coba lagi, atau periksa billing di Google AI Studio."
        ),
        status_code=503,
      )
    raise

  try:
    raw_final = extract_json_from_raw(crew_output.raw)
    final_data = json.loads(raw_final)

    response_data = VerificationResponse(
      claim=request.claim,
      verdict=final_data.get("verdict", "Tidak Terbukti"),
      confidence_score=final_data.get("confidence_score", 0.0),
      explanation=final_data.get("explanation", ""),
      sources=final_data.get("sources", []),
      verified_at=datetime.now().isoformat()
    )

    await cache_service.save_to_cache(response_data)

    return response_data

  except json.JSONDecodeError:
    raise AppBaseException("Gagal memproses hasil dari AI Agent (Format Error).", status_code=500)
  except Exception as e:
    raise AppBaseException(f"Terjadi kesalahan sistem: {str(e)}", status_code=500)

@router.delete("/cache")
async def delete_cache(
  cache_service: CacheService = Depends(get_cache_service)
):
  await cache_service.clear_all_cache()
  return {"message": "Seluruh cache berhasil dihapus"}