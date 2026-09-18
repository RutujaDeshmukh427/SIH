from sqlalchemy.orm import Session
from app.models.legal_document import LegalDocument

class DocumentRepository:
    @staticmethod
    def create_document(db: Session, document_data: dict) -> LegalDocument:
        doc = LegalDocument(**document_data)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc
    
    @staticmethod
    def get_document_by_checksum(db: Session, checksum: str) -> LegalDocument:
        return db.query(LegalDocument).filter(LegalDocument.checksum == checksum).first()
        
    @staticmethod
    def get_document_by_id(db: Session, doc_id: str) -> LegalDocument:
        return db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
