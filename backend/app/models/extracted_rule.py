from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class ExtractedDocument(Base):
    __tablename__ = "extracted_documents"

    id = Column(String, primary_key=True, index=True) # document_id
    file_name = Column(String)
    title = Column(String)
    document_number = Column(String)
    authority = Column(String)
    ministry_department = Column(String)
    jurisdiction = Column(String)
    publication_date = Column(String)
    effective_date = Column(String)
    version = Column(String)
    document_type = Column(String)
    page_count = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExtractedRule(Base):
    __tablename__ = "extracted_rules"
    
    id = Column(String, primary_key=True, index=True) # rule_id
    document_id = Column(String, ForeignKey("extracted_documents.id"), nullable=False, index=True)
    rule_number = Column(String, index=True)
    rule_title = Column(String)
    original_text = Column(Text)
    chapter = Column(String)
    page_start = Column(Integer)
    page_end = Column(Integer)
    printed_page_start = Column(Integer)
    printed_page_end = Column(Integer)
    
    # JSONB columns for nested data
    subsections = Column(JSON, default=[])
    clauses = Column(JSON, default=[])
    explanations = Column(JSON, default=[])
    provisos = Column(JSON, default=[])
    exceptions = Column(JSON, default=[])
    conditions = Column(JSON, default=[])
    references = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExtractedDefinition(Base):
    __tablename__ = "extracted_definitions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id = Column(String, ForeignKey("extracted_documents.id"), nullable=False, index=True)
    term = Column(String, index=True)
    definition = Column(Text)
    printed_page = Column(Integer)
    reference = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
