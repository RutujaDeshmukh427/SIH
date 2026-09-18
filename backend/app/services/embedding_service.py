from sentence_transformers import SentenceTransformer
from typing import List
import threading

class EmbeddingService:
    _model = None
    _lock = threading.Lock()
    
    @classmethod
    def get_model(cls):
        if cls._model is None:
            with cls._lock:
                if cls._model is None:
                    # Using all-MiniLM-L6-v2 which produces 384 dimensional embeddings
                    cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @staticmethod
    def generate_embedding(text: str) -> List[float]:
        model = EmbeddingService.get_model()
        embedding = model.encode(text)
        return embedding.tolist()
    
    @staticmethod
    def generate_embeddings(texts: List[str]) -> List[List[float]]:
        model = EmbeddingService.get_model()
        embeddings = model.encode(texts)
        return embeddings.tolist()
