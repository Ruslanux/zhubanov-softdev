---
title: Offline toolkit for instrumentation engineers
client: Own product · oil, gas and energy
description: 'A reference and a set of calculators for instrumentation and control engineers: it works in the field without connectivity and syncs when the network is back.'
industries:
- industry
status: live
order: 13
featured: false
stack:
- Ruby on Rails 8.1
- PostgreSQL
- Hotwire
- Phlex
- PWA
- pg_search
- Tesseract.js
- Prawn PDF
- Web Push
- Kamal 2
metrics:
- value: "10+"
  label: engineering modules
- value: "Offline"
  label: works without connectivity, then syncs
- value: "PDF"
  label: calibration and check protocols
challenge: Instrumentation engineers at oil, gas and energy sites calculate current loops, check intrinsic safety and look up instrument data in scattered references — often where there is no connectivity. They needed a single tool that works offline on a phone.
solution:
- A 4–20 mA loop calculator with NAMUR NE43 diagnostics
- 'An IEC 61508 SIL calculator: PFD and RRF for 1oo1, 1oo2, 2oo2 and 2oo3 architectures'
- Intrinsic safety checks, an IEC 60079 explosion-protection marking decoder and cable calculations
- An ISA-5.1 symbol reference, an instrument database from leading manufacturers and a bilingual glossary
- 'Tag recognition right in the browser: instrument tag and Ex marking from a photo'
- PDF protocols, team accounts, a shared site instrument database and a sync API
results:
- The app is in production, works offline and syncs reference data incrementally
- Automated tests, static security analysis and dependency audits in CI
- One-command deployment
---
