import pytest
import asyncio
from app.services.cache_service import CacheService
from app.schemas.verification import VerificationResponse

# Fixture: Menyediakan instance CacheService yang bersih untuk setiap test
@pytest.fixture
def cache_service():
    service = CacheService()
    # Opsional: Kita bisa mengosongkan koleksi di sini jika diperlukan
    return service

@pytest.mark.asyncio
async def test_save_and_find_cache(cache_service):
    # 1. Siapkan data bohong (Mock Data)
    mock_fact = VerificationResponse(
        claim="Bumi itu berbentuk trapesium",
        verdict="Hoaks",
        confidence_score=0.99,
        explanation="Secara ilmiah bumi berbentuk oblate spheroid.",
        sources=["https://nasa.gov", "https://nationalgeographic.com"]
    )

    # 2. Simpan ke Cache
    await cache_service.save_to_cache(mock_fact)

    # 3. Test: Cari dengan kalimat yang SAMA PERSIS
    hit = await cache_service.find_similar_fact("Bumi itu berbentuk trapesium")
    assert hit is not None
    assert hit.verdict == "Hoaks"

    # 4. Test: Cari dengan kalimat yang MIRIP (Semantic Search)
    # ChromaDB harusnya tetap bisa menemukan ini karena maknanya serupa
    semantic_hit = await cache_service.find_similar_fact("Apakah bumi itu trapesium?")
    assert semantic_hit is not None
    assert semantic_hit.is_from_cache is True

@pytest.mark.asyncio
async def test_cache_miss(cache_service):
    # Test: Cari klaim yang sama sekali tidak ada di database
    miss = await cache_service.find_similar_fact("Warna langit adalah ungu")
    assert miss is None