---
title: Command center for a network of counter-UAV systems
client: Developer of site protection systems
description: Software for centralized monitoring and control of a network of stationary drone detection and jamming systems from a single command center — offline, 24/7.
industries:
- security
status: ready
order: 4
featured: true
stack:
- Go
- WebSocket
- SQLite
- MapLibre GL
- PMTiles
- MBTiles
- Excelize
- go-pdf
- Windows Service
- systemd
- Docker
metrics:
- value: "70–6000 MHz"
  label: detection and direction-finding range
- value: "24/7"
  label: operation without internet
- value: "Windows · Linux"
  label: builds and installers
challenge: 'Strategic sites need a single picture of the airspace: data from many systems must flow into a command center, targets must be identified and tracked, and jamming must be triggered automatically or by an operator. The system has to run around the clock, without internet, and keep protecting the site if the link to the center is lost.'
solution:
- 'A server in a single executable: data aggregation, a unified database, triangulation, jamming control, logs, reports, access control, a map server and the operator UI'
- 'An agent on every system: hardware polling through an abstraction layer, spectrum pre-processing, signature analysis, buffering on link loss and an autonomous mode'
- 'DroneID and Remote ID decoding: model, serial number, coordinates, altitude, speed, home point and operator location; bearing triangulation for other signals'
- Offline GIS with zones, tracks and jamming sectors; allow and deny lists
- A multi-window operator workstation with color and audio alerts; administrator, operator and analyst roles
- A simulator of an 8-system network for demos and load testing
results:
- 'A finished product: installers for Windows (service) and Linux (systemd, Docker)'
- An incident log with playback, PDF and Excel reports
- Administrator and operator guides, interface protocol and API documentation
- Self-recovery and action audit for 24/7/365 operation
deliverables:
- Server, agent, operator UI and simulator
- Windows and Linux distributions
- Offline maps
- Documentation and presentation
---
