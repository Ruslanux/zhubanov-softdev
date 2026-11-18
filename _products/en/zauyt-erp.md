---
title: "Zauyt ERP"
kind: erp
order: 3
sector: "Plants and quarries"
industries: [industry]
image: /assets/img/products/zauyt-erp/1.jpg
tagline: "ERP for building-materials plants and quarries"
description: "Accounting for plants and quarries: shift output by grade, consumption norms per tonne, weighbridge for raw materials and shipments, sales and customer debt, machinery and fuel."
lead: "Output, shipments and customer money — in one system. The weighbridge will not ship beyond the order, the payment or the credit limit, and pit foremen's reports are reconciled with the weight received at the plant."
highlights: ["Consumption norms per tonne", "Weighbridge checks payment", "Pit reports vs. weighbridge"]
pains:
  - "Cost per tonne is calculated once a month, after the fact"
  - "A truck leaves with a load beyond the payment or credit limit"
  - "Pit reports and plant weights disagree — and nobody investigates"
  - "Material use is not compared with the norm for the tonnes produced"
modules:
  - { title: "Products and output", text: "Grades with plan, price and storage capacity; output from shift reports, shipments from the weighbridge, stock against capacity." }
  - { title: "Budget and norms", text: "Site budget from Excel with a norm per tonne; issued from stock vs. the norm; cost per tonne." }
  - { title: "Weighbridge", text: "Shipments by order and raw material intake; flags: number, tare, over the order, over payment or limit, repeat trip." }
  - { title: "Sales", text: "Customers with credit limits, orders with customer trucks, shipped and owed by weighbridge, payments." }
  - { title: "Quarry, machinery and fuel", text: "Pit foremen's reports vs. weight at the plant; engine hours, trips and fuel; consumption per engine hour vs. the norm." }
roles: ["Director", "Shop manager, foreman", "Procurement", "Storekeeper, weighbridge operator", "Accountant", "Sales manager", "Administrator"]
shots:
  - { src: "1.jpg", caption: "Director's dashboard: output against plan, shipments, debts, budget" }
  - { src: "2.jpg", caption: "Cement plant: output by grade, stock against storage capacity, consumption norms" }
  - { src: "3.jpg", caption: "Quarry: output per shift and reports against the weighbridge" }
  - { src: "4.jpg", caption: "Plant on a phone, Kazakh interface" }
demo: "Screens are from a working prototype on demo data of a fictional company, Zauyt Cement: a cement plant, a quarry and a crushing plant; 5,300 shift records, 71,000 weighbridge trips."
pilot:
  - "Connection to the customer's weighbridge software and cameras via API"
  - "Recipes by process stage and quality certificates"
  - "Rail shipments, e-invoices and goods transport documents"
  - "Exchange with 1C via API and digital signatures"
---
