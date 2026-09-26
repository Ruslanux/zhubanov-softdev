---
title: Night-time license plate recognition on ordinary IP cameras
client: Operator of a parking SaaS platform
description: The module raises night-time recognition accuracy for Kazakhstan license plates from ~87% to 97.5% — without dedicated ANPR cameras and without the cloud.
industries:
- smartcity
- security
status: pilot
order: 5
featured: true
stack:
- Python
- PyTorch
- ONNX Runtime
- OpenCV
- NumPy
- YOLO
- CRNN · CTC
- FastAPI
- Pydantic
- Docker
metrics:
- value: "97.5%"
  label: night accuracy vs 86.5% for the baseline
- value: "0%"
  label: false reads
- value: "121 ms"
  label: from event to response
challenge: 'At night ordinary cameras struggle: auto-exposure adapts to headlights, IR illumination causes glare and motion blur. The client did not want to install expensive ANPR cameras at every gate, and the cloud was ruled out. Requirements: accuracy of at least 95%, no more than 0.5% false reads and no more than 500 ms per event.'
solution:
- 'A passage, not a frame: the plate is tracked across 10–40 frames, the best frames are selected by sharpness, exposure and glare, and the result is decided by voting'
- Brightness and contrast normalization inside the plate box, IR glare suppression, perspective correction
- 'A compact CRNN model — under 1M parameters — on CPU: about 4 ms per plate crop'
- 'The decoder knows the plate format: a letter cannot land in a digit position, and the region code is checked against a reference list'
- Doubtful results are not published — the operator gets a candidate and a hint
- 'API and webhooks for the platform: recognition, passages, event triggers'
results:
- 97.5% accuracy versus 86.5% for the standard best-frame approach
- 0% false reads across all difficulty groups
- 121 ms from event to response; 2 CPU cores serve 1–2 cameras
- Deployment with Docker or systemd directly on site
---
