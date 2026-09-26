---
title: Mutual aid platform with verified organizations
client: Social project
description: People post requests for help and respond to others, while verified organizations — orphanages, nursing homes and charitable foundations — create requests on behalf of the people they care for.
industries:
- social
status: live
order: 16
featured: false
stack:
- Ruby on Rails 8
- PostgreSQL
- Hotwire
- Action Cable
- Tailwind CSS
- Devise
- Pundit
- Kaminari
- Sentry
- Kamal 2
metrics:
- value: "3"
  label: 'languages: Kazakh, Russian, English'
- value: "4"
  label: types of verified organizations
- value: "Real-time"
  label: chat and notifications
challenge: People who want to help find it hard to reach those who truly need it, and organizations struggle to earn trust. The goal was a platform where requests and offers follow a clear path, participants talk directly and abuse is stopped by moderation.
solution:
- 'Request lifecycle: open, in progress, pending confirmation, completed; disputes and cancellation'
- Offers from helpers; accepting one creates a chat and automatically declines the rest
- Real-time chat and notifications
- Verification of organizations by administrators
- Virtual points for helping, reviews, ratings and badges
- 'Moderation: reports, warnings and bans; filtering by regions of Kazakhstan'
results:
- The platform is in production
- Interface in Kazakh, Russian and English
- Google sign-in, email confirmation and brute-force protection
---
