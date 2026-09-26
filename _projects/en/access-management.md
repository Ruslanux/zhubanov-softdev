---
title: Concept of a centralized IT access management platform
client: Energy company
description: A concept and a clickable prototype of a system where an employee with one corporate account and MFA connects to permitted servers in one click, and secrets never reach the user.
industries:
- security
status: concept
order: 14
featured: false
stack:
- Active Directory
- LDAP
- SSO
- MFA
- Vault
- SSH / RDP
- SIEM
metrics:
- value: "36"
  label: pages of the concept
- value: "58"
  label: slides for acceptance
- value: "7"
  label: key prototype screens
challenge: 'Server access was granted manually, passwords of technical accounts were handed to people and temporary rights were never revoked. The client needed a platform concept that brings order: who has access to what, on what basis and until when.'
solution:
- Sign-in with a corporate Active Directory account, MFA and single sign-on
- An access broker opens an SSH or RDP session on behalf of a technical account — the secret from the vault is never shown to the user
- Permissions are the intersection of role, department, server group, account type and resource policy
- Anything beyond standing rights is a time-boxed request with automatic revocation
- Every action is audited and events are forwarded to a SIEM
results:
- 'A concept covering the full specification: discovery, scenarios, UI concept, architecture, access matrix, security and roadmap'
- A clickable prototype of every screen with a role switcher
- Traceability to acceptance criteria; all materials open in a browser without installing anything
---
