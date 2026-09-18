# Label-Lens — LMPC Legal Rules RAG Implementation Plan

## 1. Objective

Build a hybrid legal-compliance engine for Label-Lens that can process approximately **88 LMPC/legal-rule PDFs**, convert them into structured searchable knowledge, and use that knowledge during product-label validation.

The system must support:

- Deterministic validation for universal LMPC requirements
- PDF ingestion one document at a time
- Text extraction from PDFs
- Logical legal-document chunking
- Metadata extraction
- Embedding generation
- MongoDB Atlas Vector Search
- Semantic retrieval of relevant legal clauses
- LLM-based interpretation of retrieved clauses
- Exact legal citations in the final result
- PDF versioning and traceability
- Addition of new PDFs without changing application code
- Separation between legal source data and AI-generated conclusions

---

# 2. High-Level Architecture

```text
                         ┌─────────────────────────┐
                         │      User / Inspector   │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      Label-Lens UI      │
                         │   Image / Label Upload  │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       FastAPI API       │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌──────────────────────┐             ┌──────────────────────┐
        │ Deterministic Engine │             │ Product Classifier   │
        │                      │             │                      │
        │ MRP                  │             │ Product category     │
        │ Net quantity         │             │ Commodity type       │
        │ Date                 │             │ Packaging type       │
        │ Font size            │             │ Context              │
        │ Units                │             │                      │
        └──────────┬───────────┘             └──────────┬───────────┘
                   │                                    │
                   │                                    ▼
                   │                         ┌──────────────────────┐
                   │                         │ MongoDB Atlas        │
                   │                         │ Vector Search        │
                   │                         │                      │
                   │                         │ Legal Rule Chunks    │
                   │                         └──────────┬───────────┘
                   │                                    │
                   │                                    ▼
                   │                         ┌──────────────────────┐
                   │                         │ Retrieved Clauses    │
                   │                         └──────────┬───────────┘
                   │                                    │
                   └────────────────┬───────────────────┘
                                    ▼
                         ┌─────────────────────────┐
                         │      LLM Evaluator      │
                         │                         │
                         │ OCR + Rules + Clauses   │
                         │ → Legal Evaluation      │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ Compliance Result       │
                         │                         │
                         │ PASS / FAIL / REVIEW   │
                         │ Reason                  │
                         │ Citation               │
                         │ Source PDF              │
                         └─────────────────────────┘
```

---

# 3. Core Design Principle

Do **not** put everything into the LLM.

The system should have three layers:

```text
Layer 1 → Deterministic Rules
Layer 2 → Legal RAG
Layer 3 → LLM Reasoning
```

### Layer 1 — Deterministic

Used for rules that can be expressed mathematically or through exact conditions.

Examples:

- MRP exists
- Net quantity exists
- Manufacturer/importer information exists
- Date information exists
- Correct unit exists
- Font size meets threshold
- PDP area calculation
- Mandatory declaration exists

These checks should produce deterministic results.

---

### Layer 2 — Legal RAG

Used for retrieving relevant legal provisions from the 88 PDFs.

Examples:

- Product-specific exemptions
- Commodity-specific declarations
- Special packaging requirements
- Amendments
- Exceptions
- Conditional rules
- Special cases
- Industry-specific provisions

---

### Layer 3 — LLM

Used to interpret retrieved legal provisions.

The LLM should **not invent rules**.

It should only reason from:

```text
OCR Data
+
Deterministic Validation Results
+
Retrieved Legal Clauses
+
Product Category
```

---

# 4. Recommended Technology Stack

## Backend

```text
Python
FastAPI
Pydantic
PyMuPDF
MongoDB
Motor / PyMongo
```

## AI

```text
Embedding Model
LLM
OCR
Optional Product Classifier
```

## Vector Database

```text
MongoDB Atlas
MongoDB Atlas Vector Search
```

## Existing Deterministic Engine

```text
lmpcRules.json
```

---

# 5. MongoDB Database Structure

Use one MongoDB database.

Suggested database:

```text
label_lens
```

Collections:

```text
documents
legal_chunks
rules
validation_results
ingestion_jobs
```

---

# 6. Collection: documents

This collection represents each original legal PDF.

Example:

```json
{
  "_id": "ObjectId(...)",
  "document_id": "LMPC_001",
  "title": "Legal Metrology Packaged Commodities Rules",
  "file_name": "LMPC_Rules_2011.pdf",
  "document_type": "rules",
  "authority": "Department of Consumer Affairs",
  "jurisdiction": "India",
  "effective_date": "2011-04-01",
  "publication_date": "2011-04-01",
  "version": "1.0",
  "status": "active",
  "source": {
    "type": "government_pdf",
    "url": null
  },
  "page_count": 120,
  "language": "en",
  "checksum": "sha256...",
  "ingestion_status": "completed",
  "created_at": "2026-09-16T00:00:00Z",
  "updated_at": "2026-09-16T00:00:00Z"
}
```

---

# 7. Why Document Metadata Matters

Do not store only the extracted text.

Legal documents require provenance.

Every chunk must eventually answer:

> Where exactly did this information come from?

You should be able to show:

```text
Source:
LMPC_Rules_2011.pdf

Page:
24

Section:
6

Rule:
Rule 6(1)

Clause:
6(1)(a)

Text:
...
```

This is extremely important for the SIH demonstration.

---

# 8. Collection: legal_chunks

Each logical chunk becomes one MongoDB document.

Example:

```json
{
  "_id": "ObjectId(...)",
  "chunk_id": "LMPC_001_CH_0042",

  "document_id": "LMPC_001",

  "text": "Every package shall bear ...",

  "embedding": [0.0123, -0.0234, 0.0456],

  "metadata": {
    "title": "Legal Metrology Packaged Commodities Rules",
    "page_start": 24,
    "page_end": 24,

    "section": "6",
    "subsection": "6(1)",
    "clause": "6(1)(a)",

    "heading": "Declarations to be made on every package",

    "document_type": "rules",
    "commodity": [
      "packaged commodities"
    ],

    "topics": [
      "mandatory declaration",
      "package labeling"
    ],

    "effective_date": "2011-04-01",

    "status": "active"
  },

  "created_at": "2026-09-16T00:00:00Z"
}
```

---

# 9. Important Rule: Preserve Legal Structure

Do not blindly split the PDF every 500 characters.

Legal documents have hierarchy:

```text
Chapter
    ↓
Section
    ↓
Subsection
    ↓
Clause
    ↓
Sub-clause
```

For example:

```text
Rule 6
    6(1)
        6(1)(a)
        6(1)(b)
        6(1)(c)
```

The chunking system should preserve this hierarchy.

---

# 10. PDF Ingestion Pipeline

Each PDF should follow this pipeline:

```text
PDF
 ↓
Validation
 ↓
Checksum
 ↓
PDF metadata extraction
 ↓
Text extraction
 ↓
Page segmentation
 ↓
Legal structure detection
 ↓
Chunking
 ↓
Metadata enrichment
 ↓
Embedding generation
 ↓
MongoDB insertion
 ↓
Vector index
 ↓
Validation
 ↓
Ready
```

---

# 11. Step 1 — Upload One PDF

Your backend should accept one PDF at a time.

Endpoint:

```text
POST /api/legal-documents/upload
```

Example:

```text
multipart/form-data

file = LMPC_Rules_2011.pdf
```

Do not immediately send the entire document to the LLM.

First save and validate it.

---

# 12. Step 2 — Validate the PDF

Check:

```text
Is file actually PDF?
Is file readable?
Is file empty?
How many pages?
Is text extractable?
Is document duplicated?
```

Calculate SHA-256:

```python
import hashlib

def calculate_checksum(file_path):
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)

    return sha256.hexdigest()
```

Use the checksum to detect duplicate PDFs.

---

# 13. Step 3 — Extract PDF Text

Use PyMuPDF.

```python
import fitz

def extract_pages(pdf_path):
    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text("text")

        pages.append({
            "page": page_number,
            "text": text
        })

    return pages
```

The result should retain page numbers.

Never create a single giant text string and discard page boundaries.

---

# 14. Step 4 — Detect Scanned PDFs

Some PDFs may contain images rather than selectable text.

Check:

```text
Extracted text length
```

If:

```text
text length ≈ 0
```

then classify it as:

```text
scanned_pdf
```

Route it through OCR.

Pipeline:

```text
PDF
 ↓
Text extraction
 ↓
No usable text
 ↓
Render pages
 ↓
OCR
 ↓
Text + page number
```

Possible OCR stack:

```text
Tesseract
PaddleOCR
Cloud OCR
```

For legal documents, OCR output should be manually sampled before ingestion.

---

# 15. Step 5 — Normalize Text

PDF extraction often creates problems:

```text
unnecessary whitespace
broken words
multiple newlines
headers
footers
page numbers
```

Normalize carefully.

Do not aggressively clean legal text.

For example, don't remove:

```text
(a)
(b)
(i)
(ii)
Provided that
Provided further that
Explanation
Exception
```

These words can completely change the legal meaning.

---

# 16. Step 6 — Detect Headers and Footers

Many PDFs repeat:

```text
Government of India
Department of Consumer Affairs
Page 15
```

on every page.

These should generally not become legal chunks.

Build a repeated-text detector.

Example approach:

```text
Text appearing on >70% of pages
+
same/similar location
=
probable header/footer
```

Flag it rather than automatically deleting it during your first implementation.

---

# 17. Step 7 — Detect Legal Sections

The parser should recognize patterns such as:

```text
Rule 1
Rule 2
Rule 3

Section 1
Section 2

6.
6(1)
6(1)(a)

(a)
(b)
(c)

Explanation
Provided that
Provided further that
```

Use regular expressions initially.

Example:

```python
import re

RULE_PATTERN = re.compile(
    r"^(?:Rule|RULE)\s+\d+[A-Za-z\-]*"
)

SECTION_PATTERN = re.compile(
    r"^(?:Section|SECTION)\s+\d+[A-Za-z\-]*"
)

CLAUSE_PATTERN = re.compile(
    r"^\(?[a-zA-Z0-9]+\)?[.)]"
)
```

Do not rely exclusively on regex.

Use the PDF's formatting and surrounding context where possible.

---

# 18. Step 8 — Legal-Aware Chunking

This is one of the most important parts of the system.

Bad:

```text
Chunk 1:
500 random tokens

Chunk 2:
500 random tokens

Chunk 3:
500 random tokens
```

Better:

```text
Rule 6
 ↓
6(1)
 ↓
6(1)(a)
 ↓
6(1)(b)
```

Each chunk should contain enough context to understand the clause.

---

# 19. Recommended Chunk Strategy

Use a hierarchical strategy.

### Level 1

Document metadata.

### Level 2

Chapter/section.

### Level 3

Rule.

### Level 4

Subsection.

### Level 5

Clause.

Create a chunk around a legal clause.

For example:

```text
Document:
LMPC Rules

Rule:
6

Section:
Declarations

Clause:
6(1)(a)

Context:
Rule 6 — Declarations to be made on every package

Text:
Every package shall bear ...
```

This is much better than embedding only:

```text
Every package shall bear ...
```

---

# 20. Chunk Size

Start with approximately:

```text
300–800 tokens
```

with semantic boundaries.

Do not split a legal clause merely because it crossed 800 tokens.

For unusually long clauses:

```text
Parent context
+
Part 1
+
Part 2
```

Use overlap where necessary.

Suggested overlap:

```text
50–100 tokens
```

---

# 21. Handle Exceptions Carefully

Legal text often looks like:

```text
A applies.

Provided that B does not apply when C.

Provided further that D applies only when E.
```

Never separate these into unrelated chunks.

The chunk should contain:

```text
main rule
+
exception
+
condition
```

Example:

```text
Rule:
A declaration is mandatory.

Exception:
Except where ...

Condition:
Provided that ...
```

The retrieval system must be able to retrieve the complete logical unit.

---

# 22. Chunking Output

The chunking function should produce something like:

```python
{
    "chunk_id": "LMPC_001_CH_0042",
    "document_id": "LMPC_001",
    "text": "...",

    "page_start": 24,
    "page_end": 25,

    "section": "6",
    "subsection": "6(1)",
    "clause": "6(1)(a)",

    "heading": "Declarations to be made",

    "parent_context": "Rule 6",

    "topics": [
        "mandatory declarations"
    ]
}
```

---

# 23. Step 9 — Metadata Enrichment

Each chunk should have metadata.

Minimum:

```text
document_id
chunk_id
page_start
page_end
section
subsection
clause
heading
effective_date
status
```

Recommended:

```text
commodity
topics
rule_type
applicability
exceptions
definitions
```

---

# 24. Rule Type

Classify chunks into categories:

```text
mandatory
prohibition
exception
exemption
definition
calculation
procedure
penalty
authority
scope
documentation
```

Example:

```json
{
  "rule_type": "mandatory"
}
```

---

# 25. Commodity Classification

If possible, assign commodities.

Examples:

```text
food
cosmetics
electronics
textiles
packaged_goods
medical_devices
household_goods
general
```

A chunk can belong to multiple categories.

Example:

```json
"commodity": [
  "electronics",
  "packaged_goods"
]
```

Do not assume a category if the document does not establish one.

Use:

```text
unknown
```

when uncertain.

---

# 26. Step 10 — Generate Embeddings

For every chunk:

```text
chunk text
 ↓
embedding model
 ↓
vector
```

Example:

```python
embedding = embedding_model.embed(chunk["text"])
```

Store the resulting vector in MongoDB.

Important:

**Do not change embedding models halfway through the collection without re-indexing/re-embedding consistently.**

All vectors in a given vector index should use the same dimensionality/model configuration.

---

# 27. Step 11 — Store Embeddings in MongoDB Atlas

Store:

```json
{
  "text": "...",
  "embedding": [0.01, 0.02, -0.04],
  "metadata": {
    "document_id": "LMPC_001",
    "page_start": 24,
    "page_end": 25,
    "section": "6",
    "clause": "6(1)(a)",
    "commodity": ["packaged_goods"]
  }
}
```

---

# 28. Step 12 — Configure MongoDB Atlas Vector Search

Create a Vector Search index for:

```text
legal_chunks
```

Conceptually:

```text
embedding
    ↓
vector field
    ↓
MongoDB Atlas Vector Search
```

Configure:

```text
Path:
embedding

Dimensions:
match embedding model

Similarity:
cosine
```

Use the exact dimensions required by your selected embedding model.

---

# 29. Step 13 — Hybrid Retrieval

Do not rely only on vector similarity.

Legal search benefits from combining:

```text
Semantic search
+
Metadata filtering
+
Keyword matching
```

Example query:

```text
"Are special declarations required for Bluetooth speakers?"
```

First identify:

```text
commodity = electronics
product = Bluetooth speaker
```

Then retrieve:

```text
electronics
+
packaged commodity
+
declaration
+
labeling
```

---

# 30. Retrieval Pipeline

```text
OCR Text
 ↓
Product Classification
 ↓
Query Generation
 ↓
Embedding
 ↓
MongoDB Vector Search
 ↓
Metadata filtering
 ↓
Top K chunks
 ↓
Reranking
 ↓
Final legal context
```

---

# 31. Top-K Retrieval

Start with:

```text
Top K = 10
```

Then evaluate.

Possible pipeline:

```text
Vector search → 10–20 results
        ↓
Reranking → 5–8 results
        ↓
LLM context → 3–6 highly relevant clauses
```

Do not blindly send 50 legal chunks to the LLM.

---

# 32. Metadata Filtering

If the classifier identifies:

```text
product_category = electronics
```

you can prioritize:

```text
commodity = electronics
```

But do not completely eliminate general rules.

A product can be subject to:

```text
general LMPC rules
+
commodity-specific rules
```

Therefore use metadata filtering as a retrieval aid, not as an absolute legal exclusion unless the applicability is explicitly established.

---

# 33. Query Expansion

The OCR may produce:

```text
Bluetooth Speaker
```

The legal document may use:

```text
electronic apparatus
audio equipment
electrical appliance
```

Therefore generate multiple retrieval concepts.

Example:

```text
Bluetooth speaker
electronic equipment
audio equipment
packaged electronic goods
mandatory declarations
```

This increases recall.

---

# 34. Step 14 — Product Classification

Before RAG retrieval, classify the product.

Input:

```text
OCR extracted label
```

Output:

```json
{
  "product_name": "Bluetooth Speaker",
  "category": "electronics",
  "subcategory": "audio equipment",
  "packaged": true,
  "confidence": 0.94
}
```

Do not let low-confidence classification automatically exclude rules.

Example:

```text
confidence >= 0.85
→ use category strongly

confidence < 0.85
→ broaden retrieval
```

---

# 35. Step 15 — Deterministic Validation

Run your existing `lmpcRules.json`.

Example:

```python
basic_result = validate_against_json(
    ocr_data,
    lmpc_rules
)
```

Check things such as:

```text
MRP
Net quantity
Manufacturer
Importer
Date
Consumer care details
Units
Font size
PDP area
```

Return structured output.

Example:

```json
{
  "passed": false,
  "checks": [
    {
      "rule": "MRP",
      "status": "PASS"
    },
    {
      "rule": "NET_QUANTITY",
      "status": "PASS"
    },
    {
      "rule": "FONT_SIZE",
      "status": "FAIL",
      "observed": 1.2,
      "required": 2.0
    }
  ]
}
```

---

# 36. Step 16 — Build the Legal Query

Combine:

```text
Product information
+
OCR
+
Deterministic failures
+
Product category
```

Example:

```text
Product:
Bluetooth Speaker

Category:
Electronics

Observed declarations:
MRP
Net Quantity
Importer
Country of Origin

Question:
What additional LMPC declarations or exemptions apply to this product?
```

---

# 37. Step 17 — Retrieve Legal Clauses

MongoDB returns:

```text
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
```

Each result must retain:

```text
document
page
section
rule
clause
text
```

Never pass anonymous text to the LLM.

Bad:

```text
"text": "Every package shall..."
```

Good:

```text
Source: LMPC_Rules_2011.pdf
Page: 24
Rule: 6
Clause: 6(1)(a)

Text:
Every package shall...
```

---

# 38. Step 18 — LLM Evaluation

The LLM receives:

```text
1. Product information
2. OCR result
3. Deterministic validation
4. Retrieved legal clauses
```

The LLM should return structured JSON.

Example:

```json
{
  "overall_verdict": "REVIEW",

  "checks": [
    {
      "requirement": "Country of origin",
      "status": "PASS",
      "reason": "Declaration detected in OCR.",
      "citation": {
        "document_id": "LMPC_001",
        "page": 24,
        "rule": "6",
        "clause": "6(1)(a)"
      }
    }
  ],

  "uncertain_items": [],

  "sources": [
    {
      "document_id": "LMPC_001",
      "page": 24,
      "rule": "6",
      "clause": "6(1)(a)"
    }
  ]
}
```

---

# 39. Never Let the LLM Invent Citations

The model should only cite retrieved chunks.

Every citation should map to an actual MongoDB document.

Validation rule:

```text
LLM citation
 ↓
Find chunk in MongoDB
 ↓
Verify document_id
 ↓
Verify page
 ↓
Verify clause
```

If citation does not exist:

```text
reject citation
```

---

# 40. LLM Prompt Structure

Use a strict system prompt.

Conceptually:

```text
You are a legal compliance analysis engine.

Use only the supplied legal sources.

Do not create legal requirements that are not present
in the supplied sources.

Do not assume that absence of evidence means legal
non-compliance unless the supplied rule establishes
that requirement.

For every legal conclusion, provide a source citation.

If the evidence is insufficient, return REVIEW.

Distinguish:
- explicit requirement
- explicit exemption
- conditional requirement
- interpretation
- uncertainty

Return JSON only.
```

---

# 41. Important Verdict Design

Do not force the model into only:

```text
PASS
FAIL
```

Use:

```text
PASS
FAIL
REVIEW
```

### PASS

Evidence supports compliance.

### FAIL

A deterministic or clearly applicable legal requirement is violated.

### REVIEW

The available evidence is insufficient or the legal applicability is ambiguous.

This is much safer for legal compliance.

---

# 42. Legal Reasoning Model

Every decision should follow:

```text
Rule
 ↓
Applicability
 ↓
Condition
 ↓
Observed evidence
 ↓
Comparison
 ↓
Conclusion
```

Example:

```text
Rule:
Declaration X is required.

Applicability:
Applies to product category Y.

Condition:
Unless exemption Z applies.

Observed:
Product is category Y.
No evidence of exemption Z.

Conclusion:
Requirement X should be reviewed / is potentially missing.
```

This structure prevents shallow LLM reasoning.

---

# 43. Conflict Resolution

The 88 PDFs may contain:

```text
Original rule
+
Amendment
+
Notification
+
Exemption
+
Later amendment
```

You must account for temporal precedence.

Store:

```text
effective_date
expiry_date
supersedes
amends
status
```

Example:

```json
{
  "effective_date": "2024-01-01",
  "status": "active",
  "supersedes": [
    "LMPC_003_CH_21"
  ]
}
```

---

# 44. Do Not Delete Old Legal Documents

If a rule becomes obsolete:

```text
status = inactive
```

Do not physically delete it.

Reason:

You need historical traceability.

A previous validation might have been performed under an older rule version.

---

# 45. Rule Precedence

Implement a precedence layer:

```text
Latest applicable amendment
        ↓
Specific commodity rule
        ↓
General LMPC rule
        ↓
Fallback/general interpretation
```

However, do not encode this hierarchy blindly.

The legal documents should establish whether one provision amends, overrides, exempts, or supplements another.

---

# 46. Ingestion Job Tracking

Create:

```text
ingestion_jobs
```

Example:

```json
{
  "job_id": "JOB_001",
  "document_id": "LMPC_001",

  "status": "completed",

  "steps": {
    "upload": "completed",
    "text_extraction": "completed",
    "chunking": "completed",
    "metadata": "completed",
    "embedding": "completed",
    "mongodb_insert": "completed",
    "vector_index": "completed",
    "validation": "completed"
  },

  "chunks_created": 183,
  "errors": [],

  "started_at": "...",
  "completed_at": "..."
}
```

This will make debugging much easier.

---

# 47. Ingestion Status

Use:

```text
uploaded
processing
extracting
chunking
embedding
indexing
validating
completed
failed
```

Frontend can display:

```text
Uploading PDF
      ↓
Extracting legal text
      ↓
Detecting sections
      ↓
Creating legal chunks
      ↓
Generating embeddings
      ↓
Indexing knowledge
      ↓
Validating
      ↓
Ready
```

---

# 48. One-PDF-at-a-Time Workflow

Your admin workflow should be:

```text
Admin uploads PDF #1
        ↓
System processes PDF
        ↓
System reports success
        ↓
Admin uploads PDF #2
        ↓
System processes PDF
        ↓
...
        ↓
PDF #88
```

Do not require all 88 PDFs to be uploaded simultaneously.

---

# 49. Admin Dashboard

Build an admin page:

```text
Legal Knowledge Base
```

Display:

| Document | Pages | Chunks | Status | Version |
|---|---:|---:|---|---|
| LMPC Rules | 120 | 183 | Active | 1.0 |
| Amendment 2023 | 18 | 31 | Active | 2.0 |
| Electronics Rules | 45 | 72 | Active | 1.0 |

Actions:

```text
Upload PDF
View
Reprocess
Deactivate
View chunks
View ingestion logs
```

---

# 50. PDF Detail Page

When an admin opens a PDF:

```text
Document Information

Title
Authority
Effective Date
Version
Pages
Checksum
Status

Processing Information

Chunks
Embedding Status
Last Processed

Legal Sections

Rule 1
Rule 2
Rule 3
...
```

---

# 51. Chunk Inspection

Allow administrators to inspect:

```text
Chunk ID
Source PDF
Page
Rule
Clause
Heading
Text
Embedding status
Topics
Commodity
```

This is very useful for debugging RAG.

---

# 52. Retrieval Debugging

Add a developer endpoint:

```text
GET /api/legal/search?q=...
```

Example:

```text
/api/legal/search?q=Bluetooth speaker declaration
```

Return:

```text
Result 1
Similarity: 0.91
Document: Electronics_Rules.pdf
Page: 17
Rule: 8
Clause: 8(2)

Result 2
Similarity: 0.87
Document: LMPC_Rules.pdf
Page: 24
Rule: 6
Clause: 6(1)
```

This lets your team test whether RAG is actually retrieving the correct law.

---

# 53. RAG Evaluation Dataset

Before trusting the system, create a small evaluation set.

Example:

```text
Question
Expected document
Expected rule
Expected clause
```

Create approximately:

```text
30–50 test queries
```

Examples:

```text
What declaration is required for imported packaged goods?

What are the applicable quantity declarations?

Which font-size requirement applies?

Are there exemptions for certain package sizes?
```

Measure:

```text
Retrieval Recall@K
Citation accuracy
Rule applicability accuracy
Final verdict accuracy
```

---

# 54. Retrieval Evaluation

For each test query:

```text
Expected chunk = X
```

Check whether X appears in:

```text
Top 3
Top 5
Top 10
```

Example:

```text
Recall@5 = 92%
```

The goal is to ensure the correct legal clause reaches the LLM.

---

# 55. LLM Evaluation

Evaluate separately.

Example:

```text
Correct rule retrieved?
        ↓
Yes

Correct applicability?
        ↓
Yes

Correct conclusion?
        ↓
Yes

Correct citation?
        ↓
Yes
```

This separation helps identify whether a failure came from:

```text
Retrieval
or
Reasoning
```

---

# 56. Hallucination Protection

Implement these safeguards:

### Rule 1

LLM receives only retrieved legal evidence.

### Rule 2

Every legal claim requires citation.

### Rule 3

Every citation must exist in MongoDB.

### Rule 4

Unknown/ambiguous cases return:

```text
REVIEW
```

### Rule 5

The LLM must not fabricate missing rules.

---

# 57. Confidence Handling

Do not use one generic confidence score.

Separate:

```text
OCR confidence
Classification confidence
Retrieval confidence
LLM reasoning confidence
```

Example:

```json
{
  "ocr_confidence": 0.97,
  "classification_confidence": 0.91,
  "retrieval_confidence": 0.88,
  "reasoning_confidence": 0.82
}
```

This makes the system explainable.

---

# 58. Recommended Final Validation Response

Your backend should return:

```json
{
  "verdict": "REVIEW",

  "product": {
    "name": "Bluetooth Speaker",
    "category": "electronics"
  },

  "deterministic_checks": [
    {
      "name": "MRP",
      "status": "PASS"
    },
    {
      "name": "Net Quantity",
      "status": "PASS"
    },
    {
      "name": "Font Size",
      "status": "FAIL"
    }
  ],

  "legal_checks": [
    {
      "requirement": "Applicable declaration",
      "status": "REVIEW",

      "reason": "...",

      "citation": {
        "document": "Electronics_Rules.pdf",
        "page": 17,
        "rule": "8",
        "clause": "8(2)"
      }
    }
  ],

  "sources": [
    {
      "document_id": "LMPC_007",
      "page": 17,
      "rule": "8",
      "clause": "8(2)"
    }
  ]
}
```

---

# 59. API Structure

Recommended endpoints:

```text
POST   /api/legal/upload
GET    /api/legal/documents
GET    /api/legal/documents/{id}
POST   /api/legal/documents/{id}/reprocess
PATCH  /api/legal/documents/{id}/status

GET    /api/legal/chunks/{id}

GET    /api/legal/search

POST   /api/validate-label
POST   /api/validate-label/legal
```

---

# 60. Suggested Backend Folder Structure

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── legal.py
│   │   ├── validation.py
│   │   └── documents.py
│   │
│   ├── models/
│   │   ├── legal_document.py
│   │   ├── legal_chunk.py
│   │   └── validation.py
│   │
│   ├── services/
│   │   ├── pdf_service.py
│   │   ├── chunking_service.py
│   │   ├── embedding_service.py
│   │   ├── vector_search_service.py
│   │   ├── classification_service.py
│   │   ├── legal_reasoning_service.py
│   │   └── validation_service.py
│   │
│   ├── repositories/
│   │   ├── document_repository.py
│   │   ├── chunk_repository.py
│   │   └── validation_repository.py
│   │
│   ├── rules/
│   │   └── lmpcRules.json
│   │
│   ├── utils/
│   │   ├── hashing.py
│   │   ├── text_cleaner.py
│   │   └── legal_parser.py
│   │
│   └── config.py
│
├── scripts/
│   └── test_rag.py
│
├── tests/
│   ├── test_chunking.py
│   ├── test_retrieval.py
│   ├── test_validation.py
│   └── test_legal_reasoning.py
│
├── requirements.txt
└── .env
```

---

# 61. Environment Variables

Use:

```text
MONGODB_URI=
MONGODB_DATABASE=label_lens

EMBEDDING_API_KEY=
LLM_API_KEY=

EMBEDDING_MODEL=
LLM_MODEL=
```

Never hardcode API keys.

Never commit `.env`.

---

# 62. MongoDB Collections Summary

```text
label_lens
│
├── documents
│
├── legal_chunks
│
├── rules
│
├── validation_results
│
└── ingestion_jobs
```

---

# 63. Relationship Between Collections

```text
documents
     │
     │ document_id
     ▼
legal_chunks
     │
     │ retrieved during validation
     ▼
validation_results
```

And:

```text
documents
     │
     ▼
ingestion_jobs
```

---

# 64. Keep Universal Rules Separate

Continue maintaining:

```text
lmpcRules.json
```

Do not migrate every PDF rule into this file.

The JSON should contain only rules that are:

```text
stable
general
deterministic
machine-checkable
```

Example:

```json
{
  "mandatory_fields": [
    "mrp",
    "net_quantity",
    "manufacturer"
  ],

  "font_size_rules": {
    "small_package": 1.0,
    "medium_package": 2.0,
    "large_package": 4.0
  }
}
```

---

# 65. What Goes Into RAG

Use RAG for:

```text
exceptions
exemptions
conditional rules
commodity-specific requirements
amendments
interpretations
special cases
definitions
complex legal relationships
```

---

# 66. What Should NOT Go Into RAG-Only

Do not rely on an LLM for:

```text
basic arithmetic
PDP area calculation
font measurement
OCR existence detection
unit conversion
simple threshold comparisons
```

These should remain deterministic.

---

# 67. Example Complete Validation Flow

Suppose OCR detects:

```text
Product:
Bluetooth Speaker

MRP:
₹1,999

Net Quantity:
1 N

Importer:
ABC Electronics Pvt Ltd

Country of Origin:
China
```

Pipeline:

```text
Image
 ↓
OCR
 ↓
Structured OCR data
 ↓
Deterministic checks
 ↓
Product classification
 ↓
"electronics"
 ↓
Generate legal search query
 ↓
MongoDB Vector Search
 ↓
Retrieve relevant clauses
 ↓
Rerank
 ↓
LLM legal evaluation
 ↓
Verify citations
 ↓
Combine deterministic + legal results
 ↓
Final compliance report
```

---

# 68. Final User-Facing Report

The UI should show:

```text
COMPLIANCE STATUS

⚠ REVIEW

Deterministic Checks
────────────────────

✓ MRP
✓ Net Quantity
✓ Manufacturer
✗ Font Size

Legal Checks
────────────────────

⚠ Product-specific declaration

Source:
Electronics Rules
Rule 8(2)
Page 17

Why:
...
```

The user should be able to click:

```text
View Source
```

and see the exact legal PDF page.

---

# 69. Source Viewer

This is a strong SIH feature.

When the user clicks:

```text
Rule 8(2)
```

show:

```text
Source Document:
Electronics_Rules.pdf

Page:
17

Section:
8

Clause:
8(2)

Relevant Text:
...
```

Ideally highlight the relevant passage on the PDF.

This makes the system much more defensible than simply saying:

```text
AI says FAIL.
```

---

# 70. PDF Versioning

When a new PDF is uploaded:

```text
Calculate checksum
        ↓
Does checksum already exist?
        ↓
YES → duplicate
NO
        ↓
Create new document
        ↓
Process
```

For an amendment:

```text
Original Rule
     ↓
Amendment
     ↓
New active version
```

Keep both documents.

---

# 71. Reprocessing

Allow:

```text
Reprocess document
```

Useful when:

```text
chunking algorithm changes
embedding model changes
metadata extraction improves
OCR improves
```

The system should be able to delete/recreate the chunks belonging to that ingestion version without affecting unrelated documents.

---

# 72. Error Handling

Every stage should fail independently.

Example:

```text
PDF Upload       ✓
Text Extraction  ✓
Chunking          ✓
Metadata          ✓
Embedding         ✗
```

Status:

```text
FAILED_EMBEDDING
```

Store:

```json
{
  "stage": "embedding",
  "error": "...",
  "timestamp": "..."
}
```

Do not silently continue.

---

# 73. Testing Strategy

Create unit tests for:

```text
PDF extraction
text normalization
section detection
chunking
metadata extraction
embedding generation
MongoDB insertion
vector retrieval
citation verification
deterministic validation
LLM response validation
```

---

# 74. Critical Chunking Tests

Test documents containing:

```text
Rule 1
Rule 1(1)
Rule 1(1)(a)

Provided that

Provided further that

Explanation

Exception

Tables

Footnotes

Multi-page clauses
```

These are common failure points.

---

# 75. Table Handling

Legal PDFs may contain tables.

Do not flatten them blindly.

For example:

```text
Package size | Minimum font size
```

should become structured text such as:

```text
Package size: X
Minimum font size: Y
```

The original page/table reference should still be retained.

---

# 76. Footnotes

Footnotes may contain legally important information.

Do not automatically remove them.

Classify:

```text
main_text
footnote
annotation
header
footer
```

If a footnote modifies a rule, include it in the relevant chunk.

---

# 77. Definitions

Legal documents often contain:

```text
"package" means...
"retail sale price" means...
"pre-packaged commodity" means...
```

Definitions should receive their own chunks.

Add:

```json
{
  "rule_type": "definition",
  "defined_term": "package"
}
```

This makes retrieval much better.

---

# 78. Legal Applicability

One of the most important metadata fields:

```text
applicability
```

Example:

```json
{
  "applicability": {
    "commodity": ["electronics"],
    "package_type": ["retail"],
    "jurisdiction": "India"
  }
}
```

Do not automatically populate this with an LLM and treat it as fact.

If inferred by AI, mark:

```text
metadata_source = "ai_inferred"
```

and optionally require human verification.

---

# 79. Human Verification Layer

For SIH, add an admin review option.

Each document can have:

```text
AI processed
Human verified
```

Each chunk can have:

```text
verified = true/false
```

This creates a strong legal-governance story.

---

# 80. Recommended Trust Model

Use:

```text
Government PDF
      ↓
Extracted text
      ↓
Structured legal chunk
      ↓
Vector retrieval
      ↓
LLM interpretation
```

The source of truth remains:

```text
Original legal document
```

The LLM is an interpretation layer, not the source of law.

---

# 81. Security

Implement:

```text
Admin authentication
File type validation
Maximum PDF size
Virus/malware scanning if required
Rate limiting
API authentication
MongoDB authentication
Environment secrets
Audit logs
```

Do not allow arbitrary users to upload documents into the official legal knowledge base.

---

# 82. Audit Logging

For every legal validation, store:

```text
timestamp
document versions used
chunk IDs used
embedding model
LLM model
OCR result
deterministic results
LLM output
final verdict
```

Example:

```json
{
  "validation_id": "VAL_001",

  "knowledge_base": {
    "documents": [
      "LMPC_001",
      "LMPC_007"
    ]
  },

  "retrieved_chunks": [
    "LMPC_001_CH_0042",
    "LMPC_007_CH_0021"
  ],

  "model": {
    "embedding": "...",
    "llm": "..."
  }
}
```

This is valuable for reproducibility.

---

# 83. Performance Strategy

Do not run the entire 88-PDF knowledge base for every request.

Instead:

```text
OCR
 ↓
Product category
 ↓
Metadata filtering
 ↓
Vector retrieval
 ↓
Top relevant clauses
 ↓
LLM
```

This reduces:

```text
latency
LLM tokens
cost
irrelevant context
```

---

# 84. Caching

Cache repeated queries.

Example:

```text
"LMPC rules for packaged cosmetics"
```

If the same request appears frequently, cache retrieval results.

However, invalidate cache when:

```text
new legal document
new amendment
document status change
```

---

# 85. Recommended Implementation Phases

## Phase 1 — Foundation

Implement:

```text
MongoDB connection
documents collection
legal_chunks collection
PDF upload
PDF text extraction
```

Goal:

```text
Upload PDF → Extract text
```

---

## Phase 2 — Legal Chunking

Implement:

```text
page preservation
section detection
rule detection
clause detection
legal-aware chunking
```

Goal:

```text
PDF → structured legal chunks
```

---

## Phase 3 — Embeddings

Implement:

```text
embedding service
embedding generation
MongoDB storage
```

Goal:

```text
chunks → vectors
```

---

## Phase 4 — Vector Search

Implement:

```text
MongoDB Atlas Vector Search
semantic search endpoint
metadata filtering
```

Goal:

```text
query → relevant legal clauses
```

---

## Phase 5 — RAG

Implement:

```text
product classification
query generation
retrieval
reranking
LLM evaluation
```

Goal:

```text
OCR → relevant legal reasoning
```

---

## Phase 6 — Citation System

Implement:

```text
document references
page references
rule references
clause references
citation verification
```

Goal:

```text
Every legal conclusion → source
```

---

## Phase 7 — Integration

Connect:

```text
Existing OCR
+
lmpcRules.json
+
RAG
+
LLM
```

Goal:

```text
Complete Label-Lens compliance pipeline
```

---

## Phase 8 — Admin Dashboard

Build:

```text
PDF upload
processing status
document list
document details
chunk viewer
search tester
reprocess
activate/deactivate
```

---

## Phase 9 — Evaluation

Build:

```text
retrieval test set
legal reasoning test set
citation test set
regression tests
```

---

# 86. Suggested MVP

For SIH, do not try to perfectly process all 88 PDFs immediately.

Build the complete pipeline with:

```text
5–10 representative PDFs
```

First.

Make this work:

```text
PDF
 ↓
Chunk
 ↓
Embed
 ↓
MongoDB
 ↓
Retrieve
 ↓
LLM
 ↓
Citation
 ↓
Result
```

Then scale to:

```text
88 PDFs
```

This is much safer than ingesting 88 PDFs and discovering later that your chunking strategy is wrong.

---

# 87. First 10 PDFs

Choose documents that cover different structures:

```text
1. Main LMPC Rules
2. Major amendment
3. Commodity-specific rules
4. Rules containing tables
5. Rules containing exemptions
6. Rules containing definitions
7. Scanned PDF
8. Multi-page clauses
9. Document with footnotes
10. Document with complex amendments
```

This creates a strong test set for the ingestion pipeline.

---

# 88. Definition of Done

The RAG system should not be considered complete until:

```text
[ ] PDF uploads successfully
[ ] Duplicate PDFs detected
[ ] Text extracted
[ ] Scanned PDFs identified
[ ] OCR fallback works
[ ] Page numbers preserved
[ ] Legal sections detected
[ ] Clauses preserved
[ ] Exceptions preserved
[ ] Tables handled
[ ] Metadata generated
[ ] Chunks stored
[ ] Embeddings generated
[ ] MongoDB Vector Search works
[ ] Metadata filtering works
[ ] Product classification works
[ ] Relevant clauses retrieved
[ ] LLM receives only retrieved evidence
[ ] LLM returns structured JSON
[ ] Citations are verified
[ ] PASS/FAIL/REVIEW works
[ ] Old documents remain auditable
[ ] Amendments supported
[ ] Ingestion failures logged
[ ] Admin can inspect chunks
[ ] Retrieval can be tested manually
[ ] Regression tests exist
```

---

# 89. Final Architecture

The final Label-Lens system should look like:

```text
                         LABEL-LENS
                             │
                             ▼
                           IMAGE
                             │
                             ▼
                            OCR
                             │
                             ▼
                    Structured Label Data
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       Deterministic Engine       Product Classifier
                │                         │
                │                         ▼
                │                  Legal Search Query
                │                         │
                │                         ▼
                │                 MongoDB Atlas
                │                 Vector Search
                │                         │
                │                         ▼
                │                  Relevant Clauses
                │                         │
                └────────────┬────────────┘
                             ▼
                       LLM Evaluator
                             │
                             ▼
                    Citation Verification
                             │
                             ▼
                     FINAL REPORT
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
            PASS            FAIL          REVIEW
                             │
                             ▼
                      Legal Citations
                             │
                             ▼
                       Original PDF
                       + Page + Rule
```

---

# 90. The Key Principle

The most important architectural decision is:

```text
                 SOURCE OF TRUTH
                       │
                       ▼
                Government PDFs
                       │
                       ▼
                Structured Chunks
                       │
                       ▼
                 Vector Search
                       │
                       ▼
                Retrieved Evidence
                       │
                       ▼
                 LLM Reasoning
                       │
                       ▼
                 Human-readable
                  Explanation
```

**Not:**

```text
PDF → LLM → Trust the answer
```

And not:

```text
88 PDFs → manually convert everything into JSON
```

Instead:

```text
Universal deterministic rules
        +
Legal RAG
        +
Controlled LLM reasoning
        +
Exact source citations
```

That gives Label-Lens a scalable architecture where adding **PDF #89** is primarily an ingestion operation rather than a software-development task.