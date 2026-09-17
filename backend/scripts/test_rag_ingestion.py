import os
import requests

def test_ingestion():
    url = "http://localhost:8000/api/v1/legal/upload"
    
    # We create a dummy pdf file for testing
    pdf_path = "dummy_test.pdf"
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Rule 1: Testing\nThis is a test rule.")
    doc.save(pdf_path)
    
    try:
        with open(pdf_path, "rb") as f:
            files = {"file": (pdf_path, f, "application/pdf")}
            data = {"title": "Dummy Test Rules"}
            response = requests.post(url, files=files, data=data)
            
        print("Upload Status Code:", response.status_code)
        print("Upload Response:", response.json())
        
        # Test search
        search_url = "http://localhost:8000/api/v1/legal/search"
        search_res = requests.get(search_url, params={"q": "Testing rule"})
        print("Search Status Code:", search_res.status_code)
        print("Search Response:", search_res.json())
        
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

if __name__ == "__main__":
    test_ingestion()
