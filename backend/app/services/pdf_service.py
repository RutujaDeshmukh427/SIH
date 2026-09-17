import hashlib
import fitz # PyMuPDF
from typing import List, Dict

class PDFService:
    @staticmethod
    def calculate_checksum(file_content: bytes) -> str:
        sha256 = hashlib.sha256()
        sha256.update(file_content)
        return sha256.hexdigest()

    @staticmethod
    def extract_pages(file_content: bytes) -> List[Dict[str, any]]:
        document = fitz.open(stream=file_content, filetype="pdf")
        pages = []
        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text")
            pages.append({
                "page": page_number,
                "text": text
            })
        return pages
