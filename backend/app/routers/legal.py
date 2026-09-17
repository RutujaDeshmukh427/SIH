from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ingestion_service import IngestionService
from app.repositories.document_repository import DocumentRepository
from app.repositories.chunk_repository import ChunkRepository
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/legal", tags=["legal"])

@router.post("/upload")
async def upload_document(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    
    try:
        result = IngestionService.ingest_pdf(db, content, file.filename, title)
        return {"message": "Document ingested successfully", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    from app.models.legal_document import LegalDocument
    docs = db.query(LegalDocument).all()
    return {"data": docs}

@router.get("/search")
def search_legal_chunks(q: str, limit: int = 5, db: Session = Depends(get_db)):
    embedding = EmbeddingService.generate_embedding(q)
    chunks = ChunkRepository.search_similar_chunks(db, embedding, limit)
    
    results = []
    for chunk in chunks:
        results.append({
            "id": chunk.id,
            "document_id": chunk.document_id,
            "text": chunk.text,
            "page_start": chunk.page_start,
            "section": chunk.section,
            "clause": chunk.clause,
            # we shouldn't return the whole embedding array in the response to save bandwidth
        })
    return {"data": results}
