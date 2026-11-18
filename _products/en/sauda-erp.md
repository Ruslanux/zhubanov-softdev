---
title: "Sauda ERP"
kind: erp
order: 7
sector: "Distribution"
industries: [trade]
image: /assets/img/products/sauda-erp/1.jpg
tagline: "ERP for distribution and wholesale"
description: "Accounting for distributors: orders with credit control and shipment stop, batches and shelf life (FEFO), e-invoices, returns, receivables, reconciliation statements, retro bonuses for chains."
lead: "Sales, debts and goods with a shelf life — in one system. An order is checked against the credit limit, overdue debt and stock with the right shelf life before shipping, and e-invoices, reconciliation statements and retro bonuses are calculated without Excel."
highlights: ["Credit control and shipment stop", "Batches and FEFO for chains", "E-invoices within 15 days"]
pains:
  - "Goods go to a customer whose debt exceeds the limit or is long overdue"
  - "A chain rejects a delivery: the remaining shelf life is below the contract"
  - "E-invoices are issued late; reconciliation statements and retro bonuses are calculated by hand"
  - "Expiring batches are noticed when it is too late to sell them"
modules:
  - { title: "Orders and credit control", text: "Debt plus the order over the limit, or more than 30 days overdue — goes to the director for approval with a justification." }
  - { title: "Batches and shelf life", text: "Shipping by FEFO; chains get only batches with remaining shelf life not below the contract; expiring batches on the dashboard." }
  - { title: "E-invoices and marking", text: "E-invoice no later than 15 days after shipment; shipments without an e-invoice older than 10 days are listed; marked goods are flagged." }
  - { title: "Receivables and reconciliation", text: "Payments close the oldest shipments; debt by age; reconciliation statement for any period; returns." }
  - { title: "Retro bonuses", text: "Bonuses for chains under contract terms are calculated from actual shipments." }
roles: ["Director", "Branch manager", "Sales manager", "Buyer", "Storekeeper", "Accountant", "Administrator"]
shots:
  - { src: "1.jpg", caption: "Director's dashboard: sales, debts, approvals, shelf life" }
  - { src: "2.jpg", caption: "Shipment by batches with the nearest expiry and the remaining shelf life for a chain" }
  - { src: "3.jpg", caption: "A customer with overdue debt: debt by age and shipment stop" }
  - { src: "4.jpg", caption: "A new order from a sales rep's phone" }
demo: "Screens are from a working prototype on demo data of a fictional distributor, Sauda Trade: a warehouse in Almaty and a branch in Astana, 25 customers, 333 batches, 311 orders."
pilot:
  - "Store orders from WhatsApp — with the Qyzmet AI agent"
  - "E-invoices and goods transport documents via the e-invoicing API, marking codes"
  - "Sales rep supervisor and routes"
  - "Exchange with 1C via API and digital signatures"
---
