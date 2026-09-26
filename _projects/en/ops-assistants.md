---
title: AI assistants for a maintenance operations platform
client: Developer of an industry ERP platform
description: Built-in AI assistants answer employees and managers using the platform's data and documents, analyze situations and prepare decisions — strictly within the user's permissions.
industries:
- operations
- logistics
status: ready
order: 10
featured: false
stack:
- Ruby on Rails 8.1
- RubyLLM
- PostgreSQL
- Tool calling
- Solid Queue
- Hotwire
- Roo
- caxlsx
- pdf-reader
metrics:
- value: "5 + 1"
  label: specialized assistants and a coordinator
- value: "150"
  label: control questions for acceptance
- value: "109"
  label: automated tests with no network calls
challenge: 'The platform brings together maintenance projects, equipment, deadlines, procurement, warehouse, contractors, payments and cost. Employees wasted time searching for data across sections, and managers lacked quick answers. The key requirements: the assistant must not see anything beyond the user''s rights and must never invent numbers.'
solution:
- Five specialized assistants and a coordinator for composite tasks; server-side agents call only permitted platform functions
- Permissions are computed in one place from the user's memberships; an out-of-scope request is refused, not silently narrowed
- Application code computes every number; the model only phrases the answer
- Permission checks are repeated in the API, in the background worker and in every tool
- A tool catalog, a job queue and monitoring of stuck runs
results:
- A control set of 150 questions for the acceptance run with the model
- 'Reproducible tests: a fixed date and control data, with the model replaced by a script'
- The delivery covers the common foundation and the first phase of the specification
---
