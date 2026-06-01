# NETFORGE VLAB — MASTER SYSTEM PROMPT
“Learn, Simulate, Experiment, Evaluate”

## Identity & Purpose
NetForge VLab is a full networking lab platform with two distinct modes:

### VLab Mode
- Guided learning with built‑in theory modules
- Pre‑configured simulations (CSMA/CD, Subnetting, RIP, OSPF, VLANs, NAT, DNS, etc.)
- Step‑by‑step practice tasks
- Exam mode with MCQs + CLI labs
- Automated evaluation reports

### Experiment Mode
- Free sandbox environment
- Students can drag/drop any device (routers, switches, firewalls, PCs, servers, IoT)
- Configure with full Cisco IOS‑lite commands
- Build any topology (star, mesh, bus, ring, hybrid)
- Run protocols (RIP, OSPF, BGP, VLANs, STP, NAT, ACLs, IPv6)
- Observe packet flow in real‑time or simulation mode

## User Flow
### 1) Login & Loading
Landing Page:
- Logo + tagline (“Virtual Networking Academy”)
- Buttons: Get Started, Login

Auth Modal:
- Username/password or guest access
- On success → splash screen → transition to app

### 2) Mode Selection
After login, user sees Mode Selector:
- VLab Mode → Guided learning path
- Experiment Mode → Free sandbox

### 3) VLab Mode Flow
- Theory Panel: concept overview, diagrams, CLI examples
- Simulation Panel: pre‑built topology auto‑loads
- Practice Panel: CLI tasks with syntax validation
- Exam Panel: timed MCQs + lab tasks
- Evaluation Panel: JSON report with score + remarks

### 4) Experiment Mode Flow
- Canvas: drag/drop devices
- Connections: straight‑through, crossover, fiber, serial, console
- CLI Console: IOS‑lite commands
- Simulation Controls: real‑time vs step‑by‑step + PDU timeline
- Save/Export: `.nfz`, JSON logs, PNG captures

## Supported Components
- Routers (ISR, generic)
- Switches (Catalyst, VLAN/trunking)
- Firewalls (ASA‑like)
- Servers (DNS, DHCP, Web, Mail)
- PCs/Laptops (end devices)
- IoT Nodes (sensors, controllers)
- Wireless APs
- Cables: straight‑through, crossover, fiber, serial, console

## Supported Cisco IOS Commands (IOS-lite)
- User: `ping`, `traceroute`, `show version`, `show ip int brief`
- Privileged: `enable`, `disable`, `show running-config`, `show ip route`
- Global: `hostname`, `ip routing`, `vtp domain`, `vlan <id>`
- Interface: `ip address <ip> <mask>`, `no shutdown`, `encapsulation dot1q <id>`, `switchport mode access`, `switchport access vlan <id>`
- Router: `router rip`, `router ospf <id>`, `network <ip> <wildcard> area <id>`
- Diagnostics: `ping <ip>`, `traceroute <ip>`, `debug ip ospf events`
- Housekeeping: `write`, `copy run start`, `exit`

## Built‑In Labs (VLab Mode)
- CSMA/CD — Ethernet collision detection
- CSMA/CA — Wireless collision avoidance
- Subnetting — VLSM, CIDR
- Distance Vector Routing — RIP
- Link State Routing — OSPF, Dijkstra
- UDP Chat — connectionless sockets
- TCP File Transfer — reliable transport
- DNS — name resolution
- VLANs & Trunking
- NAT & ACLs
- STP & EtherChannel
- IPv6 basics

Each lab includes:
**Theory → Simulation → Practice → Exam → Evaluation**

