---
title: Interactive web application architecture advisor
client: Own product · open tool
description: 'A static web app: from 12 questions about a project it recommends the stack, architecture and configuration for Ruby on Rails 8, justifying every decision and adding an implementation plan.'
industries:
- devtools
status: live
order: 19
featured: false
stack:
- Jekyll
- Liquid
- JavaScript
- YAML
- GitHub Pages
metrics:
- value: "12"
  label: questions about the project
- value: "20"
  label: layers of architectural decisions
- value: "92"
  label: options in the knowledge base
challenge: 'Choosing a stack for a new project means dozens of interrelated decisions: rendering, frontend, queues, authentication, testing, deployment. Early mistakes are expensive to fix, and advice online is contradictory.'
solution:
- 'A data-driven rules engine: every option has a base weight and rules that raise or lower it'
- Cross-layer rules keep the recommendations consistent with each other
- 'Every recommendation explains itself: reasons, pros, costs and scored alternatives'
- A project generator command with the right flags, a list of libraries and a phased implementation plan
- Head-to-head technology comparisons, a production-readiness checklist and a glossary
results:
- Published and free to use — no server and no database
- Report export to Markdown and PDF, plus a shareable configuration link
- Matching of similar real-world projects with a profile match percentage
---
