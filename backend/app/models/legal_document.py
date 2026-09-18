from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    document_type = Column(String)
    authority = Column(String)
    jurisdiction = Column(String)
    effective_date = Column(String)
    publication_date = Column(String)
    version = Column(String)
    status = Column(String, default="active")
    source_type = Column(String)
    source_url = Column(String)
    page_count = Column(Integer)
    language = Column(String, default="en")
    checksum = Column(String, unique=True, index=True, nullable=False)
    ingestion_status = Column(String, default="pending")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
