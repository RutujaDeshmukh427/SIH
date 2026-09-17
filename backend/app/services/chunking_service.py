import re
import uuid
from typing import List, Dict

RULE_PATTERN = re.compile(r"^(?:Rule|RULE)\s+\d+[A-Za-z\-]*", re.IGNORECASE)
SECTION_PATTERN = re.compile(r"^(?:Section|SECTION)\s+\d+[A-Za-z\-]*", re.IGNORECASE)
CLAUSE_PATTERN = re.compile(r"^\(?[a-zA-Z0-9]+\)?[.)]")

class ChunkingService:
    @staticmethod
    def chunk_document(document_id: str, pages: List[Dict[str, any]]) -> List[Dict[str, any]]:
        chunks = []
        current_section = None
        current_rule = None
        
        # A simple hierarchical chunking for demonstration
        # For a production system, a more robust parser taking into account the exact structure would be needed
        for page_data in pages:
            page_num = page_data["page"]
            text = page_data["text"]
            lines = text.split("\n")
            
            current_chunk_text = []
            chunk_start_line = 0
            
            for i, line in enumerate(lines):
                line = line.strip()
                if not line:
                    continue
                
                # Check for headers
                if RULE_PATTERN.match(line):
                    current_rule = line
                    # Yield previous chunk if any
                    if current_chunk_text:
                        chunks.append(ChunkingService._create_chunk(document_id, page_num, current_section, current_rule, current_chunk_text))
                        current_chunk_text = []
                elif SECTION_PATTERN.match(line):
                    current_section = line
                    
                current_chunk_text.append(line)
                
                # Create a chunk every ~20 lines or when encountering a new rule
                if len(current_chunk_text) >= 20:
                    chunks.append(ChunkingService._create_chunk(document_id, page_num, current_section, current_rule, current_chunk_text))
                    # Overlap of 2 lines
                    current_chunk_text = current_chunk_text[-2:]
                    
            if current_chunk_text:
                 chunks.append(ChunkingService._create_chunk(document_id, page_num, current_section, current_rule, current_chunk_text))
                 
        return chunks
        
    @staticmethod
    def _create_chunk(document_id: str, page_num: int, section: str, rule: str, text_lines: List[str]) -> Dict[str, any]:
        return {
            "id": f"{document_id}_CH_{uuid.uuid4().hex[:8]}",
            "document_id": document_id,
            "text": " ".join(text_lines),
            "page_start": page_num,
            "page_end": page_num,
            "section": section,
            "clause": rule,
            "heading": rule if rule else section,
            "topics": [],
            "commodity": []
        }
