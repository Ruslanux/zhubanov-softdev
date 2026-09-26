---
title: Requirements register and link graph from a knowledge base
client: Major construction group
description: The service parses standards, regulations and spreadsheets, extracts verifiable requirements with a verbatim quote of the source and builds a graph linking requirements, standard solutions and checks.
industries:
- construction
status: pilot
order: 9
featured: false
stack:
- Python
- Claude API
- Cytoscape.js
- FastAPI
- PyMuPDF
- python-docx
- openpyxl
- SQLite
- Pydantic
- pytest
metrics:
- value: "94.8%"
  label: extraction precision on new documents (target ≥ 90%)
- value: "100%"
  label: extraction recall on new documents
- value: "235"
  label: reference requirements in testing
challenge: 'A design company''s knowledge base is hundreds of documents: standards, regulations, tables and diagrams. Requirements duplicate, refine and contradict each other, and when a new version of a document comes out there is no quick way to see which solutions and checks are affected.'
solution:
- 'Parsing of DOCX, PDF and XLSX into fragments with exact addresses: document, version, clause or cell'
- 'AI extracts verifiable requirements: object, metric, value, conditions, exceptions and a verbatim quote'
- Links between requirements — refines, depends on, duplicates, contradicts — and to standard solutions and checks
- A requirement or link enters the register only after an expert's decision; every change creates a new revision
- 'Document version comparison and impact analysis: affected solutions, checks, requirements and projects with an effort estimate'
- 'UI: a register with export, a document view with highlighted sources, a link graph and a review queue'
results:
- 'On new documents: extraction precision of 94.8% and recall of 100% against targets of 90% and 85%'
- On tuning documents and after refinement — 100% extraction precision and recall
- Contradictions between requirements are detected automatically and routed to an expert
- The method, a test report and a pilot-stage protocol template were delivered
---
