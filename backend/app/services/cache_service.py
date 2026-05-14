import uuid
import json
from ..db.chroma import get_cache_collection
from ..schemas.verification import VerificationResponse

class CacheService:
  def __init__(self):
    self.collection = get_cache_collection()
  
  async def find_similar_fact(self, claim: str, threshold: float = 0.5):
    """
    Mencari apakah klaim serupa sudah pernah diverifikasi sebelumnya.
    Semakin kecil nilai 'distance', semakin mirip maknanya.
    """
    results = self.collection.query(
      query_texts=[claim],
      n_results=1
    )
    
    if not results['ids'][0] or results['distances'][0][0] > threshold:
      return None
    
    metadata = results['metadatas'][0][0]
    sources = json.loads(metadata['sources'])
    
    return VerificationResponse(
      claim=claim,
      verdict=metadata['verdict'],
      confidence_score=metadata['confidence_score'],
      explanation=metadata['explanation'],
      sources=sources,
      verified_at=metadata.get('verified_at'),
      is_from_cache=True,
    )
  
  async def save_to_cache(self, fact: VerificationResponse):
    metadata = {
      "verdict": fact.verdict,
      "confidence_score": fact.confidence_score,
      "explanation": fact.explanation,
      "sources": json.dumps(fact.sources),
    }
    if fact.verified_at:
      metadata["verified_at"] = fact.verified_at

    self.collection.add(
      ids=[str(uuid.uuid4())],
      documents=[fact.claim],
      metadatas=[metadata]
    )

  async def clear_all_cache(self):
    """Menghapus seluruh cache yang tersimpan di koleksi."""
    results = self.collection.get()
    ids = results['ids']
    if ids:
      self.collection.delete(ids=ids)