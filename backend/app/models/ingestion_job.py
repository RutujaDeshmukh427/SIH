from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class IngestionJob(Base):
    __tablename__ = "ingestion_jobs"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("legal_documents.id"), nullable=False, index=True)
    
    status = Column(String, default="processing")
    
    steps = Column(JSON, default={})
    chunks_created = Column(Integer, default=0)
    errors = Column(JSON, default=[])
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
