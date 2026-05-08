import chromadb
from chromadb import EmbeddingFunction, Embeddings, Documents
from google import genai
from google.genai import types
from ..core.config import settings

# Inisialisasi Gemini Client sekali saja saat modul dimuat (Gen AI SDK terbaru)
_gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)


class GeminiEmbeddingFunction(EmbeddingFunction):
  """
  Custom embedding function menggunakan Google Gemini Embedding API.
  Menggunakan Gen AI SDK terbaru (google.genai) sesuai dokumentasi resmi.
  - Model: gemini-embedding-001
  - Task type: SEMANTIC_SIMILARITY (untuk pencarian cache klaim yang mirip)
  - Output dimensi: 3072 (default)
  Tidak memerlukan library berat seperti torch/sentence-transformers karena
  komputasi dilakukan sepenuhnya di sisi server Google.
  """
  def __call__(self, input: Documents) -> Embeddings:
    # Embed sekaligus dalam satu batch request untuk efisiensi
    result = _gemini_client.models.embed_content(
      model="gemini-embedding-001",
      contents=input,
      config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY"),
    )
    # Ambil nilai vektor dari setiap objek embedding
    return [embedding.values for embedding in result.embeddings]


# Instance embedding function (dibuat sekali, digunakan berulang)
embedding_function = GeminiEmbeddingFunction()


def get_chroma_client():
  return chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)


def get_cache_collection():
  client = get_chroma_client()
  return client.get_or_create_collection(
    name="verdict_cache",
    embedding_function=embedding_function,
    metadata={"hnsw:space": "cosine"}
  )