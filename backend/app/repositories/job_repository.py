from sqlalchemy.orm import Session
from app.models.ingestion_job import IngestionJob

class JobRepository:
    @staticmethod
    def create_job(db: Session, job_data: dict) -> IngestionJob:
        job = IngestionJob(**job_data)
        db.add(job)
        db.commit()
        db.refresh(job)
        return job
        
    @staticmethod
    def update_job(db: Session, job_id: str, updates: dict) -> IngestionJob:
        job = db.query(IngestionJob).filter(IngestionJob.id == job_id).first()
        if job:
            for key, value in updates.items():
                setattr(job, key, value)
            db.commit()
            db.refresh(job)
        return job
