from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
from pgvector.sqlalchemy import Vector

class LegalChunk(Base):
    __tablename__ = "legal_chunks"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("legal_documents.id"), nullable=False, index=True)
    
    text = Column(String, nullable=False)
    
    # Sentence Transformers all-MiniLM-L6-v2 uses 384 dimensions
    embedding = Column(Vector(384))
    
    # Metadata
    page_start = Column(Integer)
    page_end = Column(Integer)
    section = Column(String)
    subsection = Column(String)
    clause = Column(String)
    heading = Column(String)
    
    topics = Column(JSON) # List of topics
    commodity = Column(JSON) # List of commodities
    rule_type = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
