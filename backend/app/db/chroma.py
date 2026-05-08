import chromadb
from chromadb import EmbeddingFunction, Embeddings, Documents
import google.generativeai as genai
from ..core.config import settings

# Inisialisasi Gemini API sekali saja saat modul dimuat
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiEmbeddingFunction(EmbeddingFunction):
  """
  Custom embedding function yang menggunakan Google Gemini Embedding API.
  Jauh lebih hemat memori dibandingkan model lokal (sentence-transformers + torch)
  karena komputasi dilakukan sepenuhnya di sisi Google.
  Model: text-embedding-004 (dimensi: 768)
  """
  def __call__(self, input: Documents) -> Embeddings:
    embeddings = []
    for text in input:
      response = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="SEMANTIC_SIMILARITY",
      )
      embeddings.append(response["embedding"])
    return embeddings


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