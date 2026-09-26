---
title: AI agent for financial covenant compliance checks
client: Banking AI challenge
description: The agent reads a corpus of credit documentation and a transaction ledger and, for every covenant of every borrower, returns a verdict, the actual value and the evidence transaction.
industries:
- fintech
status: pilot
order: 3
featured: true
stack:
- Python
- Anthropic SDK
- Claude vision
- PyMuPDF
- JSON Schema
- Prompt caching
metrics:
- value: "97.2%"
  label: 'match with the reference: 35 of 36 cells'
- value: "84"
  label: cells in the hidden set with no critical findings
- value: "6"
  label: pipeline stages
challenge: 'Covenant testing is manual and costly work for a credit analyst: find the agreement version in force, extract the formula, gather figures from financial statements and transactions, compute and justify the conclusion. A wrong number is expensive, so the AI''s output has to be reproducible and verifiable.'
solution:
- 'A six-stage pipeline: PDF ingestion, document routing, extraction of covenants, facts and transaction categories, computation and self-audit'
- Scanned pages without a text layer are read by a vision model
- The model turns each covenant into an expression over a fixed vocabulary of aggregates, and a Python engine evaluates it — all arithmetic is deterministic
- Strict JSON schemas at every stage and an on-disk cache of model responses keyed by request hash
- 'A full trace: document type, extracted facts, the category of every transaction, formula inputs and evidence candidates'
results:
- 97.2% match with the reference on the public set — 35 of 36 cells
- A hidden set with a different structure — 27 borrowers, 84 cells — with zero critical findings
- Self-audit blocks the submission if any cell is not justified
- Re-runs are almost free thanks to the cache
---
