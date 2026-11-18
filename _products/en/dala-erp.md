---
title: "Dala ERP"
kind: erp
order: 2
sector: "Agriculture"
industries: [agro]
image: /assets/img/products/dala-erp/1.jpg
tagline: "ERP for agricultural holdings"
description: "Accounting for agricultural holdings: fields and harvest, field operations, crop budget per hectare and tonne, grain weighbridge, machinery and diesel reconciliation."
lead: "A farm's season — from sowing to threshing — in one system. The crop technology map becomes the budget, agronomists' requests are checked against it, and the weighbridge and diesel reconcile themselves: you see where the tonnes and litres went."
highlights: ["Crop map = budget", "Grain weighbridge", "Diesel checked against norms"]
pains:
  - "Yield and cost per hectare are calculated after the season, in Excel"
  - "Grain from the fields is accepted without checking the truck number and waybill"
  - "Diesel is written off as issued, not by machinery output"
  - "Agronomists' requests are not checked against the crop map"
modules:
  - { title: "Farms and fields", text: "Divisions per season; fields with area, crop, variety and previous crop; threshing and yield plan vs. actual." }
  - { title: "Field operations", text: "A calendar with area; progress is measured by machinery output in hectares." }
  - { title: "Crop map and budget", text: "Crop technology map from Excel; plan vs. actual for seeds, fertilizers, crop protection, fuel; cost per hectare and tonne." }
  - { title: "Weighbridge", text: "A trip from field to grain yard: gross, tare, moisture, impurities, credited weight; flags: number mismatch, truck not registered, repeat trip." }
  - { title: "Machinery and fuel", text: "Hours, hectares and fuel per shift; consumption per hectare against the norm; issued, recorded, allowed by norms, overspend." }
roles: ["Director", "Agronomist", "Procurement", "Storekeeper and grain yard manager", "Accountant", "Administrator"]
shots:
  - { src: "1.jpg", caption: "Director's dashboard: field operations, budget, threshing and deviations" }
  - { src: "2.jpg", caption: "Division fields and harvest: threshing, yield plan vs. actual" }
  - { src: "3.jpg", caption: "A weighbridge trip: credited weight and truck number deviations" }
  - { src: "4.jpg", caption: "Division on a phone, Kazakh interface" }
demo: "Screens are from a working prototype on demo data of a fictional agricultural holding, Dala Agro: three divisions, 31 fields, 34,100 ha, 3,200+ weighbridge trips."
pilot:
  - "Connection to the farm's weighbridge software and plate cameras via API"
  - "Fuel norms per operation and implement"
  - "Shipments to the elevator and grain sales"
  - "Exchange with 1C via API, digital signatures and e-invoicing"
---
