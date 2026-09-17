import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.pdf_service import PDFService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.repositories.document_repository import DocumentRepository
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.job_repository import JobRepository

class IngestionService:
    @staticmethod
    def ingest_pdf(db: Session, file_content: bytes, filename: str, title: str):
        # 1. Validation & Checksum
        checksum = PDFService.calculate_checksum(file_content)
        
        existing_doc = DocumentRepository.get_document_by_checksum(db, checksum)
        if existing_doc:
            raise ValueError("Duplicate PDF detected.")
            
        doc_id = f"DOC_{uuid.uuid4().hex[:8]}"
        
        # 2. Create document record
        document = DocumentRepository.create_document(db, {
            "id": doc_id,
            "title": title,
            "file_name": filename,
            "checksum": checksum,
            "ingestion_status": "processing",
            "page_count": 0
        })
        
        # 3. Create job record
        job_id = f"JOB_{uuid.uuid4().hex[:8]}"
        job = JobRepository.create_job(db, {
            "id": job_id,
            "document_id": doc_id,
            "steps": {"upload": "completed"}
        })
        
        try:
            # 4. Text Extraction
            pages = PDFService.extract_pages(file_content)
            
            # Update doc with page count
            document.page_count = len(pages)
            db.commit()
            
            JobRepository.update_job(db, job_id, {
                "steps": {**job.steps, "text_extraction": "completed"}
            })
            
            # 5. Chunking
            chunks_data = ChunkingService.chunk_document(doc_id, pages)
            JobRepository.update_job(db, job_id, {
                "steps": {**job.steps, "chunking": "completed"}
            })
            
            # 6. Embedding
            texts = [chunk["text"] for chunk in chunks_data]
            embeddings = EmbeddingService.generate_embeddings(texts)
            for i, chunk in enumerate(chunks_data):
                chunk["embedding"] = embeddings[i]
                
            JobRepository.update_job(db, job_id, {
                "steps": {**job.steps, "embedding": "completed"}
            })
            
            # 7. Store Chunks in DB
            ChunkRepository.create_chunks(db, chunks_data)
            
            JobRepository.update_job(db, job_id, {
                "steps": {**job.steps, "db_insert": "completed"},
                "chunks_created": len(chunks_data),
                "status": "completed",
                "completed_at": datetime.utcnow()
            })
            
            document.ingestion_status = "completed"
            db.commit()
            
            return {"job_id": job_id, "document_id": doc_id, "chunks_created": len(chunks_data)}
            
        except Exception as e:
            JobRepository.update_job(db, job_id, {
                "status": "failed",
                "errors": [{"stage": "processing", "error": str(e)}]
            })
            document.ingestion_status = "failed"
            db.commit()
            raise e
