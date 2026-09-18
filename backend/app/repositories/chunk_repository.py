from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.legal_chunk import LegalChunk

class ChunkRepository:
    @staticmethod
    def create_chunks(db: Session, chunks_data: List[Dict[str, Any]]):
        chunks = [LegalChunk(**data) for data in chunks_data]
        db.add_all(chunks)
        db.commit()
        return chunks
        
    @staticmethod
    def search_similar_chunks(db: Session, embedding_vector: List[float], limit: int = 5) -> List[LegalChunk]:
        # Using cosine distance (<=>) with pgvector
        return db.query(LegalChunk).order_by(
            LegalChunk.embedding.cosine_distance(embedding_vector)
        ).limit(limit).all()
