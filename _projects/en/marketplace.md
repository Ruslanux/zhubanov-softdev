---
title: Multi-vendor marketplace for the Kazakhstan market
client: E-commerce startup
description: A marketplace with seller dashboards, an order state machine, returns, commission and promotion engines and four payment gateways.
industries:
- ecommerce
- fintech
status: ready
order: 7
featured: false
stack:
- Ruby on Rails 8.1
- PostgreSQL
- Hotwire
- Phlex
- Tailwind CSS
- AASM
- CanCanCan
- money-rails
- pg_search
- Solid Queue
- Web Push
- RSpec
- PWA
metrics:
- value: "4"
  label: 'payment gateways: Kaspi, Halyk, Freedom and test'
- value: "50+"
  label: business-logic services
- value: "280+"
  label: UI and API routes
challenge: 'The client needed a platform where many sellers trade under one brand: with product moderation, flexible commissions, promotions, returns and payments through popular Kazakhstan payment systems — and with correct payment handling even when banks resend notifications.'
solution:
- Buyer, seller and administrator dashboards; product moderation and bulk approval
- An order state machine, returns and three invoice types
- A hierarchical commission engine, five types of promotion rules and promo codes
- Payment gateways with webhook deduplication and idempotent processing
- Full-text search, CSV product import and export, buyer-seller chat
- A PWA with push notifications and the tenge as the base currency
results:
- A payment is never processed twice, even when the bank repeats a notification
- Business logic lives in 50+ services, which makes it easy to evolve and test
- An app-like mobile experience without publishing to app stores
- Admin panel, reports and notifications are ready
---
