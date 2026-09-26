---
title: AI-assisted checking of BIM models against corporate standards
client: Major construction group
description: AI turns clauses of a standard into approved rules, while deterministic code checks the model — with 3D visualization of issues and BCF export.
industries:
- construction
status: pilot
order: 8
featured: false
stack:
- Python
- IfcOpenShell
- Claude API
- three.js
- NumPy
- FastAPI
- BCF 2.1
- IFC4
- Playwright
- pytest
metrics:
- value: "100%"
  label: issue precision on the control set
- value: "99%"
  label: of checks completed automatically
- value: "16 of 16"
  label: clauses mapped to the right template by AI
challenge: 'Checking design decisions against corporate standards takes engineers a lot of time and depends on the individual. The goal was to automate it so that every issue is justified: which clause is violated, which values and which model element.'
solution:
- 'Classification of requirements by what a check needs: geometry, parameters or relationships between BIM objects'
- 10 approved check templates, a language for context and exceptions, and an 'insufficient data' status
- Claude maps a clause of the standard to template parameters and asks the engineer questions; the engineer approves the rule with a version and a fingerprint of the clause text
- Only the template code performs the check — deterministically and reproducibly
- 'Web UI: a 3D model with highlighted elements, an issue card with values and their sources, and an issue review mode'
- Export to BCF 2.1 for Revit, Navisworks, Solibri and BIMcollab, plus a printable report
results:
- Issue precision of 92.2% on the independent test and 100% on the control set against a 90% target
- Violation recall of 98.5–100% against an 85% target
- 100% of issues are traceable to the clause and the model element
- The method, the prototype and the independent test report were delivered to the client
---
