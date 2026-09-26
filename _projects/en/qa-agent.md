---
title: AI agent that maintains end-to-end tests in CI
client: IT company, software developer
description: A portable agent in the CI pipeline runs E2E tests after deployment, triages failures, repairs outdated tests and files defects — all changes go through a reviewed pull request.
industries:
- devtools
status: ready
order: 12
featured: false
stack:
- TypeScript
- Node.js
- Playwright
- Zod
- Vitest
- GitHub Actions
- GitLab CI
- Azure DevOps
- bats
- ShellCheck
- Ruby on Rails
metrics:
- value: "3"
  label: 'CI systems: GitHub, GitLab, Azure DevOps'
- value: "24"
  label: UI changes in the control set
- value: "1 day"
  label: to onboard a new project
challenge: End-to-end tests break with every UI change, and the team spends hours telling real defects from stale selectors. The client needed an agent that maintains the tests on its own but never weakens assertions or touches product code.
solution:
- The core is CI-agnostic; an adapter handles only triggers, secrets and report publishing
- 'Two-level failure triage: heuristics and deterministic selector repair from a DOM snapshot; the model handles only ambiguous cases'
- 'Guardrails are enforced in code: the diff is checked for weakened assertions, product changes and secrets'
- A cumulative PR/MR, defect issues, Slack and Teams notifications, a test data registry
- 'A Rails dashboard: run history, metrics, per-project access and data retention'
results:
- A working implementation of every part of the specification
- 'A control set: 24 UI changes, defects and an infrastructure failure'
- Documentation for onboarding a project in one working day
---
