---
title: Digital platform for a learning center with an AI teaching assistant
client: Learning center, Kazakhstan
description: A website, a course catalog and four dashboards — student, parent, teacher and administrator — with AI generation of learning materials, live lessons and payments.
industries:
- edtech
status: ready
order: 1
featured: true
stack:
- Ruby on Rails 8.1
- Claude API
- PostgreSQL
- Hotwire
- Tailwind CSS
- Anthropic SDK
- Solid Queue
- Devise
- Pundit
- Halyk Epay
- Web Push
- Capybara
- Kamal 2
metrics:
- value: "805"
  label: automated tests
- value: "4"
  label: role-based dashboards
- value: "600+"
  label: questions in one grade's task bank
challenge: 'The learning center needed a single system instead of scattered spreadsheets and messengers: a public site with a catalog and enrollment requests, tracking of lessons and payments, transparency for parents and a tool that saves teachers time on preparing materials. The interface had to be in Kazakh and Russian and designed for phones first.'
solution:
- 'Public site: landing page, course catalog, teachers, reviews, enrollment requests and a placement test that determines the level and recommends a course'
- Student, parent, teacher and super-admin dashboards with role-aware mobile navigation
- 'AI teaching assistant: whole lessons, homework, tests, analysis of a student''s mistakes and a draft weekly report for parents'
- Live lesson room, group journal, grades, an in-app currency, levels and rewards
- Payment by link and QR through bank acquiring, email and web-push notifications, PWA
- 'Super-admin panel: metrics, funnel, a kanban lead CRM and an audit log'
results:
- MVP completed in 10 sprints; the second phase with AI and payments is implemented
- 'Course content moved into the system: lesson notes, interactive exercises and a bilingual task bank'
- Generation runs in the background, model output is sanitized and provider errors are shown as clear messages
- 805 automated tests, a clean security scan and a ready deployment configuration
deliverables:
- Web platform and PWA
- Content import and course builder
- Deployment configuration
- Demo data and instructions
---
