---
title: Reconciliation statements with e-signatures and 1C integration
client: IT company, accounting services
description: A section of a tax portal for creating, automatically matching, agreeing and signing reconciliation statements of mutual settlements with counterparties.
industries:
- fintech
- govtech
status: ready
order: 11
featured: false
stack:
- Ruby on Rails 8
- PostgreSQL
- PKI / X.509
- 1С API
- Hotwire
- Prawn
- caxlsx
- Solid Queue
metrics:
- value: "94"
  label: automated tests, including e-signing
- value: "2 parties"
  label: sign exactly the same document
- value: "0"
  label: manual re-entry from 1C
challenge: Reconciliation statements are produced in accounting software and sent by email, messengers or on paper. That means manual work, errors, duplicate documents and no single history of confirmed settlements.
solution:
- 'Automatic matching: mirrored comparison of both parties'' debits and credits and calculation of discrepancies'
- 'Agreement workflow: reasons for discrepancies, decisions and re-matching; any change resets both parties'' approvals'
- 'Only what both parties have seen gets signed: a canonical document, a hash and a lock after agreement'
- Digital signing with a single verification path
- 'An API for 1C:Accounting: export of settlements and retrieval of statuses'
- Permissions by organization role and statement side — identical in the UI and the API
results:
- A single electronic archive of reconciliation statements with full history
- No manual re-entry of data from the accounting system
- 94 automated tests, including signing with a training certificate authority
- A requirements compliance document and the 1C integration contract
---
