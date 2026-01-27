import chromadb
from chromadb.utils import embedding_functions
from ..core.config import settings

embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
  model_name="all-MiniLM-L6-v2"
)

def get_chroma_client():
  return chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

def get_cache_collection():
  client = get_chroma_client()
  return client.get_or_create_collection(
    name="verdict_cache",
    embedding_function=embedding_function,
    metadata={"hnsw:space": "cosine"}
  )