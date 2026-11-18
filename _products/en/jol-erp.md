---
title: "Jol ERP"
kind: erp
order: 8
sector: "Transport and logistics"
industries: [logistics]
image: /assets/img/products/jol-erp/1.jpg
tagline: "ERP for carriers and forwarders"
description: "Accounting for carriers: orders with margin and credit control, trips by own and hired transport, driver permits, downtime with the party at fault, e-waybills and e-invoices."
lead: "Orders, trips and margin — in one system. A driver with an expiring medical certificate cannot be assigned to a trip, and downtime caused by the client above the norm goes straight into the order amount."
highlights: ["Order margin from actual trips", "Driver permits", "Downtime to invoice"]
pains:
  - "Order margin is known only after the month is closed"
  - "A driver leaves on a trip with an expired medical certificate or ADR licence"
  - "Downtime caused by the client is never invoiced — the hours are lost"
  - "From 1 January 2027 e-waybills in ESUTD are mandatory, while trips are tracked in spreadsheets"
modules:
  - { title: "Transport orders", text: "Route, cargo, mode of transport, rate and planned cost; margin below 10% or over the credit limit — goes for approval." }
  - { title: "Trips", text: "Own truck and driver, or a hired carrier and rail tariff; departure, arrival, e-waybill, delays." }
  - { title: "Driver permits", text: "Licence, medical certificate, tachograph card, passport, ADR — a driver cannot be assigned if a permit expires before delivery." }
  - { title: "Downtime", text: "Hours and the party at fault; above the norm through the client's fault — added to the order amount with a notice to accounting." }
  - { title: "Money and fleet", text: "Margin from actual trips, branch revenue, receivables, reconciliation statement, e-invoices; cost per kilometre and fuel per 100 km." }
roles: ["Director", "Branch manager", "Logistician", "Procurement", "Storekeeper", "Accountant", "Administrator"]
shots:
  - { src: "1.jpg", caption: "Director's dashboard: revenue and margin, debts, downtime, e-waybills, permits" }
  - { src: "2.jpg", caption: "A transport order: a driver without a valid medical certificate cannot be assigned" }
  - { src: "3.jpg", caption: "Downtime to invoice to clients above the order norm" }
  - { src: "4.jpg", caption: "Order economics on a logistician's phone" }
demo: "Screens are from a working prototype on demo data of a fictional carrier, Jol Logistics: Almaty and Uralsk, 15 clients, 243 orders, 433 trips."
pilot:
  - "Issuing and signing e-waybills and route sheets via the ESUTD API"
  - "Wagon and container tracking, GPS monitoring"
  - "E-invoices via the e-invoicing API"
  - "Exchange with 1C via API"
---
