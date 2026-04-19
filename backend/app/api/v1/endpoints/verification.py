import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
from queue import Queue, Empty
from app.services.agent_event import agent_event_queue
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

@router.post("/verify")
async def verify_claim(
  request: VerificationRequest,
  cache_service: CacheService = Depends(get_cache_service),
  agent_service: FactCheckerCrew = Depends(get_agent_service)
):
    async def sse_generator():
        q = Queue()
        agent_event_queue.set(q)
        
        if not request.bypass_cache:
            cache_result = await cache_service.find_similar_fact(request.claim)
            if cache_result:
                yield f"data: {json.dumps({'type': 'result', 'payload': cache_result.model_dump()})}\n\n"
                return

        yield f"data: {json.dumps({'type': 'log', 'message': 'Menganalisis dan memvalidasi input...'})}\n\n"
        
        try:
            validation_output = await asyncio.to_thread(
                agent_service.run_validation, inputs={'claim': request.claim}
            )
        except Exception as e:
            if _is_gemini_quota_error(e):
                err = "Kuota Gemini API habis atau melebihi batas. Tunggu beberapa menit lalu coba lagi."
            else:
                err = f"Error validasi: {str(e)}"
            yield f"data: {json.dumps({'type': 'error', 'message': err})}\n\n"
            return
            
        try:
            raw_val = extract_json_from_raw(validation_output.raw)
            val_data = json.loads(raw_val)

            if not val_data.get("is_valid_claim", False):
                reason = val_data.get('reason', 'Input Tidak Valid')
                yield f"data: {json.dumps({'type': 'error', 'message': f'Input Ditolak: {reason}'})}\n\n"
                return
        except json.JSONDecodeError:
            yield f"data: {json.dumps({'type': 'error', 'message': 'Gagal memvalidasi input (Format Validator Error).'})}\n\n"
            return
            
        yield f"data: {json.dumps({'type': 'log', 'message': 'Input valid. AI Agent mulai melakukan riset...'})}\n\n"

        verification_task = asyncio.create_task(
            asyncio.to_thread(agent_service.run_verification, inputs={'claim': request.claim})
        )
        
        while not verification_task.done():
            try:
                while True:
                    msg = q.get_nowait()
                    yield f"data: {json.dumps(msg)}\n\n"
            except Empty:
                pass
            await asyncio.sleep(0.5)

        while not q.empty():
            msg = q.get_nowait()
            yield f"data: {json.dumps(msg)}\n\n"

        try:
            crew_output = verification_task.result()
        except Exception as e:
            if _is_gemini_quota_error(e):
                err = "Kuota Gemini API habis atau melebihi batas."
            else:
                err = f"Terjadi kesalahan saat memverifikasi: {str(e)}"
            yield f"data: {json.dumps({'type': 'error', 'message': err})}\n\n"
            return

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
            yield f"data: {json.dumps({'type': 'result', 'payload': response_data.model_dump()})}\n\n"

        except json.JSONDecodeError:
            yield f"data: {json.dumps({'type': 'error', 'message': 'Gagal memproses hasil dari AI Agent (Format Error).'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Terjadi kesalahan sistem: {str(e)}'})}\n\n"

    return StreamingResponse(sse_generator(), media_type="text/event-stream")

@router.delete("/cache")
async def delete_cache(
  cache_service: CacheService = Depends(get_cache_service)
):
  await cache_service.clear_all_cache()
  return {"message": "Seluruh cache berhasil dihapus"}