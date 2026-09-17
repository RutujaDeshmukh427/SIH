import os
import json
import sys
from pathlib import Path

# Add backend directory to sys.path to allow imports
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.extracted_rule import ExtractedDocument, ExtractedRule, ExtractedDefinition

def ingest_json(file_path: str):
    print(f"Ingesting {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    db: Session = SessionLocal()
    
    try:
        # 1. Ingest Document
        doc_data = data.get("document", {})
        doc_id = doc_data.get("document_id")
        
        if not doc_id:
            print("No document_id found, skipping.")
            return
            
        existing_doc = db.query(ExtractedDocument).filter_by(id=doc_id).first()
        if existing_doc:
            print(f"Document {doc_id} already exists. Updating...")
            for key, value in doc_data.items():
                if key == "document_id":
                    continue
                setattr(existing_doc, key, value)
        else:
            print(f"Creating new document {doc_id}...")
            doc_data["id"] = doc_id
            del doc_data["document_id"]
            new_doc = ExtractedDocument(**doc_data)
            db.add(new_doc)
            
        # 2. Ingest Rules
        rules_data = data.get("rules", [])
        for rule in rules_data:
            rule_id = rule.get("rule_id")
            existing_rule = db.query(ExtractedRule).filter_by(id=rule_id).first()
            
            rule_kwargs = {
                "document_id": doc_id,
                "rule_number": rule.get("rule_number"),
                "rule_title": rule.get("rule_title"),
                "original_text": rule.get("original_text"),
                "chapter": rule.get("chapter"),
                "page_start": rule.get("page_start"),
                "page_end": rule.get("page_end"),
                "printed_page_start": rule.get("printed_page_start"),
                "printed_page_end": rule.get("printed_page_end"),
                "subsections": rule.get("subsections", []),
                "clauses": rule.get("clauses", []),
                "explanations": rule.get("explanations", []),
                "provisos": rule.get("provisos", []),
                "exceptions": rule.get("exceptions", []),
                "conditions": rule.get("conditions", []),
                "references": rule.get("references", []),
            }
            
            if existing_rule:
                for k, v in rule_kwargs.items():
                    setattr(existing_rule, k, v)
            else:
                rule_kwargs["id"] = rule_id
                db.add(ExtractedRule(**rule_kwargs))
                
        # 3. Ingest Definitions
        definitions_data = data.get("definitions", [])
        
        # We can clear existing definitions for this document and re-insert
        db.query(ExtractedDefinition).filter_by(document_id=doc_id).delete()
        
        for df in definitions_data:
            db.add(ExtractedDefinition(
                document_id=doc_id,
                term=df.get("term"),
                definition=df.get("definition"),
                printed_page=df.get("printed_page"),
                reference=df.get("reference")
            ))
            
        db.commit()
        print(f"Successfully ingested {len(rules_data)} rules and {len(definitions_data)} definitions for {doc_id}")
        
    except Exception as e:
        db.rollback()
        print(f"Error during ingestion: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", type=str, required=True, help="Path to the extracted JSON file")
    args = parser.parse_args()
    
    ingest_json(args.file)
