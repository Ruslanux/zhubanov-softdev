---
title: Linking completed quantities to the BIM model via estimates and certificates
client: Major construction group
description: The prototype links lines of cost estimates and completion certificates to specific BIM elements and tracks designed, claimed and accepted quantities with full traceability.
industries:
- construction
status: pilot
order: 6
featured: true
stack:
- Python
- IfcOpenShell
- Claude API
- three.js
- NumPy
- FastAPI
- openpyxl
- PyMuPDF
- SQLite
- Playwright
- pytest
metrics:
- value: "99.4%"
  label: link accuracy on the independent test (target ≥ 95%)
- value: "97.2%"
  label: lines linked automatically (target ≥ 70%)
- value: "0.30%"
  label: quantity allocation error (target ≤ 2%)
challenge: Estimates and completion certificates often contain aggregated items without element IDs. Linking only to a floor or a type of work makes it impossible to check which elements and quantities were counted, to prevent double claims or to rebuild the calculation after the model changes.
solution:
- 'Parsing of estimates and KS-2 completion certificates in XLSX and PDF: columns in any order, different units of measure'
- 'Rules and AI parse every line: type of work, floor, section, work zone, grid lines, thickness, concrete class; an AI value is accepted only if its fragment is found in the line text'
- Code selects the elements — by attributes, estimate item and the quantity remaining after earlier claims
- Many-to-many links, partial completion, duplicate and overrun control
- A corrected certificate replaces the links of the previous version; a new model version carries links over by GUID
- '3D model: highlight elements for an estimate line and lines for an element'
results:
- Link accuracy of 99.4% on the independent test and 100% on the control set
- Quantity allocation error of 0.30% against a target of at most 2%
- Re-uploading a certificate never double-counts; every link stores its source and model version
- All duplicates, overruns and estimate-model discrepancies were found
---
