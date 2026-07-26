# 📘 MIT ADT VLAB PLATFORM: COMPLETE TECHNICAL DOCUMENTATION & ARCHITECTURAL REFERENCE MANUAL

**Platform Name:** MIT ADT University Virtual Laboratories (VLAB)  
**Version:** 2.5 (PWA Cache Build v72)  
**Repository:** asg492607/vlab_mitadt (Branch: main)  
**Deployment URL:** https://vlab-mitadt.onrender.com/  
**Primary Authors:** MIT ADT Department of Computer Science & Engineering  

---

## 📑 TABLE OF CONTENTS

1. Executive Overview & Platform Vision
2. System Architecture & Technology Stack
3. PWA Architecture, Service Worker Caching & Offline Capabilities
4. User Roles & Authentication System
5. Dashboard & Curriculum Navigation System
6. Core Engine Architecture (vlab.js & vlabData.js)
7. The 16 Computer Networks Practicals (Exhaustive Study)
   - 7.1 Practical 1: Introduction to Networking Tools, Devices & Media
   - 7.2 Practical 2: Network Communication Models (OSI & TCP/IP Digital Twin)
   - 7.3 Practical 3: Network Commands & CLI Utilities
   - 7.4 Practical 4: Network Topologies (Bus, Star, Ring, Mesh, Tree)
   - 7.5 Practical 5: IPv4 & IPv6 Address Classification
   - 7.6 Practical 6: LAN Setup & Cabling (Straight/Crossover & Crimping)
   - 7.7 Practical 7: Subnetting, VLSM & CIDR
   - 7.8 Practical 8: Virtual LANs (VLAN) & IEEE 802.1Q Trunking
   - 7.9 Practical 9: Distance Vector Routing Protocol (RIP)
   - 7.10 Practical 10: Link State Routing Protocol (OSPF)
   - 7.11 Practical 11: Dynamic Routing Protocol (EIGRP)
   - 7.12 Practical 12: Static Routing Configuration
   - 7.13 Practical 13: UDP & TCP Transport Protocols
   - 7.14 Practical 14: DHCP Configuration & IP Pools
   - 7.15 Practical 15: Static Network Address Translation (Static NAT 1:1)
   - 7.16 Practical 16: Dynamic NAT & PAT Overload
8. Multi-Disciplinary Virtual Laboratory Tracks
   - 8.1 Operating Systems Lab
   - 8.2 Computer Programming Lab (C, C++, Java, Python, NASM Assembly)
   - 8.3 Database Systems (DBMS) Lab & SQL Engine
   - 8.4 Theory of Computation (TOC) Lab & Finite Automata Simulators
   - 8.5 Artificial Intelligence (AI) Lab & Machine Learning Simulators
   - 8.6 Cloud Computing Lab & Virtualization Simulator
   - 8.7 Cybersecurity & Cryptography Lab
9. 2D HTML5 Canvas Topology Builder & Packet Tracer Engine
10. Stateful CLI Terminal & Command Processors
11. 11-Module Interactive Digital Twin Simulation Engines
12. AI Tutor Assistant & Voice Command Controller
13. Pre-Test & Post-Test Adaptive Assessment Systems
14. Layer-wise Network Fault Diagnoser & Troubleshooting Challenges
15. Viva Voce Interactive Oral Examination Engine
16. Mini-Assignment Tasks & Practical Review Checklists
17. Automated PDF Report Generation & Verified Certificate Engine
18. Teacher Management Workspace (teacher.html)
    - 18.1 Live Student Session Tracking & Monitoring
    - 18.2 Real-Time Timestamp Logging (Started When / Completed When)
    - 18.3 Curriculum Content Editor & Practical Customization
    - 18.4 Student Assessment Evaluation & Score Cards
19. Admin Control Center & System Governance (admin.html)
20. Firebase Firestore Synchronization & Cloud State Persistence
21. Design System, UI Aesthetics & Responsive UX Tokens
22. Data Models, Schemas & State Management
23. Security, Privacy & Data Protection
24. Deployment, Build Pipelines & Hosting Infrastructure
25. Future Roadmap & Maintenance Guidelines

---

## 1. EXECUTIVE OVERVIEW & PLATFORM VISION

The **MIT ADT Virtual Laboratory (VLAB) Platform** is an enterprise-grade, browser-native digital twin environment designed to transform computer engineering education. Built with modern web standards (ES Modules, HTML5 Canvas, Web Audio API, Service Worker PWA, and Firebase Cloud Synchronization), VLAB enables engineering students to perform complex, interactive laboratory experiments entirely in their web browser—without needing local software installation, heavy virtual machines, or physical networking hardware.

### 1.1 Core Vision & Objectives
1. **Interactive Experiential Learning:** Shift from static textbook reading to active manipulation of virtual network devices, routers, switches, signals, and protocol packets.
2. **Zero-Setup Accessibility:** Provide immediate access to Packet Tracer-style network topology builders, stateful CLI terminals, code execution environments, and dynamic simulations on any device (laptop, tablet, desktop).
3. **Comprehensive Multi-Disciplinary Coverage:** Support 8 full academic computer science disciplines, with Computer Networks containing a 16-practical sequence spanning Layer 1 to Layer 7.
4. **Real-Time Faculty Oversight:** Empower professors and teaching assistants to track student progress, observe live session timestamps (start time, duration, completion status), evaluate submitted assignments, and customize theory content dynamically.
5. **Progressive Web Application (PWA):** Ensure offline resilience, instant asset caching, and fast load times across low-bandwidth environments.

---

## 2. SYSTEM ARCHITECTURE & TECHNOLOGY STACK

VLAB is architected as a modular, client-heavy single-page application (SPA) supported by cloud persistence services.

```
+-----------------------------------------------------------------------------------+
|                                 USER BROWSER / PWA                                |
|                                                                                   |
|   +-------------------+   +-------------------+   +---------------------------+   |
|   |   Student UI      |   |   Teacher UI      |   |   Admin Control Panel     |   |
|   |  (vlab.html)      |   | (teacher.html)    |   |    (admin.html)           |   |
|   +---------+---------+   +---------+---------+   +-------------+-------------+   |
|             |                       |                           |                 |
|   +---------v-----------------------v---------------------------v-------------+   |
|   |                       Core Application Engine (vlab.js)                   |   |
|   |  - Router & Lab Switcher       - 2D Canvas Topology Builder               |   |
|   |  - Simulation Dispatcher       - Stateful CLI Processors                  |   |
|   |  - Speech Controller           - Certificate & PDF Report Generator       |   |
|   +---------------------------------+-----------------------------------------+   |
|                                     |                                             |
|   +---------------------------------v-----------------------------------------+   |
|   |                     Curriculum Data Corpus (vlabData.js)                |   |
|   |  - 16 Networking Datasets      - OS, DBMS, TOC, AI, Cloud, Cyber Datasets |   |
|   |  - Pre/Post Test Question Bank  - Hardware & Protocol Schemas            |   |
|   +---------------------------------+-----------------------------------------+   |
|                                     |                                             |
+-------------------------------------|---------------------------------------------+
                                      |
                      +---------------v---------------+
                      |   Cloud Backend Services      |
                      |  - Firebase Authentication    |
                      |  - Firestore Database Sync    |
                      |  - Service Worker PWA Cache   |
                      +-------------------------------+
```

### 2.1 Technology Stack Specifications
- **Frontend Core:** HTML5, CSS3 Custom Properties (Vanilla CSS for max performance), JavaScript ES2022 Modules.
- **Graphic Simulation Engine:** HTML5 2D Canvas API with custom particle animation physics.
- **Styling Architecture:** Glassmorphism, CSS Grid, Flexbox, Dynamic Light/Dark Mode CSS Tokens (`var(--primary)`, `var(--bg-page)`).
- **Client Persistence:** `localStorage`, `sessionStorage`, IndexedDB, PWA Cache Storage (`sw.js`).
- **Cloud Database:** Firebase Firestore (Real-time document sync for user progress, topology states, session tracking, teacher edits).
- **Speech & AI Integration:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) for voice commands and AI Tutor dialogue.
- **Document & Export Engine:** `jspdf.umd.min.js`, `jspdf.plugin.autotable.min.js`, `html2canvas.min.js`.

---

## 3. PWA ARCHITECTURE, SERVICE WORKER CACHING & OFFLINE CAPABILITIES

The platform includes a PWA Service Worker (`sw.js`) that caches critical application assets to guarantee offline availability.

### 3.1 Service Worker Mechanics (`sw.js`)
```javascript
const CACHE_NAME = 'mit-vlab-cache-v72';
const ASSETS_TO_CACHE = [
    '/',
    '/vlab.html',
    '/dashboard.html',
    '/teacher.html',
    '/admin.html',
    '/login.html',
    '/vlab.js',
    '/vlabData.js',
    '/sw.js',
    '/manifest.json'
];
```

### 3.2 Auto-Update & Cache Eviction Protocol
- Every release bumps the cache version query parameter (e.g., `vlab.js?v=72`).
- Upon registration, `reg.update()` triggers `sw.js` lifecycle event `activate`, deleting all stale cache stores (`caches.delete(key)`) and claiming clients immediately (`self.clients.claim()`).

---

## 4. USER ROLES & AUTHENTICATION SYSTEM

VLAB supports three role profiles stored in Firebase Authentication & Firestore:

1. **Student Profile:**
   - Access to all 8 laboratory tracks and 16 networking practicals.
   - Interactive simulation manipulation, CLI command execution, pre/post test submissions, report download, certificate generation.
2. **Teacher Profile:**
   - Access to `teacher.html` workspace.
   - Real-time student progress tracking, live session start/completion logs, manual evaluation grading, and content editing.
3. **Administrator Profile:**
   - Access to `admin.html`.
   - Global user management, institution-wide analytics, system log auditing, and database reset tools.

---

## 5. DASHBOARD & CURRICULUM NAVIGATION SYSTEM

The dashboard (`dashboard.html`) presents an intuitive grid of curriculum experiment cards.

### 5.1 Card Structure & Quick Navigation
- **Networking Track (16 Experiments):** P1 through P16 with status indicators (`NOT STARTED`, `IN PROGRESS`, `COMPLETED`).
- Clicking any card executes `localStorage.setItem('vlab_current_lab', labId)` and navigates to `vlab.html?lab=labId`.

---

## 6. CORE ENGINE ARCHITECTURE (`vlab.js` & `vlabData.js`)

The engine separates presentation and data into two main files:
- **`vlabData.js`:** Contains data structures for aims, objectives, prerequisites, outcomes, theory sections, hardware tools, pre-tests, post-tests, viva questions, troubleshooting scenarios, practice exercises, and mini-assignment tasks.
- **`vlab.js`:** Contains UI initialization, routing, sidebar tab switching, state management, 2D canvas drawing loops, simulation dispatchers, CLI command handlers, speech controller, and report generator.

---

## 7. THE 16 COMPUTER NETWORKS PRACTICALS (EXHAUSTIVE STUDY)

Here is a detailed breakdown of all 16 experiments in the Computer Networks track:

### 7.1 Practical 1: Introduction to Networking Tools, Devices & Media
- **Focus:** Physical layer equipment, cables, connectors, network interfaces, and basic diagnostics.
- **Hardware Inspected:** Twisted Pair (Cat5e/Cat6), Fiber Optic (Single-mode/Multi-mode), Coaxial Cables, RJ-45 Connectors, Repeaters, Hubs, Switches, Routers, NICs, Wireless Access Points.
- **Interactive Simulator:** Hardware 3D/2D Tools Inspector with pinout viewer (T568A vs T568B).

### 7.2 Practical 2: Network Communication Models (OSI & TCP/IP Digital Twin)
- **Focus:** 7-layer OSI reference model and 4-layer TCP/IP Internet model.
- **20 Theory Sections:** Detailed breakdown of Layer 1 to Layer 7 purpose, responsibilities, protocols, devices, PDUs, encapsulation, decapsulation, end-to-end trace (`www.google.com`), advantages, limitations, and best practices.
- **11-Module Interactive Digital Twin Simulator:**
  - 2D Canvas animation showing live packet pulses traveling along Client PC ➔ Switch ➔ Router ➔ Cloud WAN ➔ Server.
  - Live PDU Header Encapsulation Inspector updating L1-L7 headers in real time.
  - Speed Controls (`0.2x` Ultra Slow, `0.3x`, `0.4x`, `0.5x`, `1x`, `2x`, `4x`).
  - Layer-wise Fault Diagnoser (L1 cable cut, L2 ARP fail, L3 IP error, L4 port block, L7 DNS fail).
- **Mini-Assignment Tasks:** Structured checklist tasks, hands-on CLI exercises (`ping`, `arp`, `nslookup`, `netstat`), and review questions.

### 7.3 Practical 3: Network Commands & CLI Utilities
- **Focus:** Command-line diagnostics for network engineers.
- **Commands Taught:** `ping`, `traceroute` / `tracert`, `arp`, `netstat`, `nslookup`, `ipconfig` / `ifconfig`, `route`.
- **Interactive Terminal:** Custom CLI shell processing commands and displaying synthetic ARP tables, DNS lookups, and routing tables.

### 7.4 Practical 4: Network Topologies (Bus, Star, Ring, Mesh, Tree)
- **Focus:** Physical and logical network arrangements, cost, fault tolerance, and performance.
- **Interactive Simulator:** Interactive topology layout builder allowing students to click nodes, test link failures, and analyze packet broadcast behavior across Bus, Star, Ring, Mesh, and Tree configurations.

### 7.5 Practical 5: IPv4 & IPv6 Address Classification
- **Focus:** IP addressing, octet structure, address classes (A, B, C, D, E), subnet masks, default gateways, and IPv6 128-bit hex notation.
- **Interactive Simulator:** Dynamic IP address classifier and binary converter tool.

### 7.6 Practical 6: LAN Setup & Cabling (Straight/Crossover & Crimping)
- **Focus:** Ethernet cabling standards, T568A and T568B color codes, straight-through vs crossover wiring logic.
- **Interactive Simulator:** Virtual cable crimping tool where students arrange individual wires in order before testing continuity.

### 7.7 Practical 7: Subnetting, VLSM & CIDR
- **Focus:** Subnet math, Variable Length Subnet Masking (VLSM), Classless Inter-Domain Routing (CIDR), network ID, broadcast address, and host ranges.
- **Interactive Simulator:** Subnet calculator and VLSM allocation engine.

### 7.8 Practical 8: Virtual LANs (VLAN) & IEEE 802.1Q Trunking
- **Focus:** Broadcast domain isolation, VLAN IDs, access ports, trunk ports, and IEEE 802.1Q frame tagging.
- **Interactive Simulator:** Dual-switch VLAN simulator demonstrating traffic isolation between Sales (VLAN 10) and HR (VLAN 20).

### 7.9 Practical 9: Distance Vector Routing Protocol (RIP)
- **Focus:** Distance vector algorithm, hop count metric (max 15), 30-second periodic updates, split horizon, and route poisoning.
- **Interactive Simulator:** 4-router line topology simulator displaying routing table exchange loops and convergence steps.

### 7.10 Practical 10: Link State Routing Protocol (OSPF)
- **Focus:** Link-state algorithm, Dijkstra's Shortest Path First (SPF), bandwidth cost metric, Areas (Area 0 Backbone), Hello packets, and Link State Advertisements (LSAs).
- **Interactive Simulator:** Multi-path mesh router topology displaying SPF cost calculations and automatic failover when a link is cut.

### 7.11 Practical 11: Dynamic Routing Protocol (EIGRP)
- **Focus:** Cisco hybrid routing protocol, DUAL (Diffusing Update Algorithm), Composite Metric (Bandwidth & Delay), Feasible Successors, and rapid convergence.
- **Interactive Simulator:** EIGRP topology visualizer displaying primary routing paths and instant fallback to Feasible Successors.

### 7.12 Practical 12: Static Routing Configuration
- **Focus:** Manual route entry, administrative distance (AD = 1), default routes (`0.0.0.0 0.0.0.0`), and next-hop IP specification.
- **Interactive Simulator:** Router CLI simulator for configuring static routes (`ip route <dst> <mask5> <next-hop>`).

### 7.13 Practical 13: UDP & TCP Transport Protocols
- **Focus:** Layer 4 transport mechanisms, TCP 3-Way Handshake (SYN, SYN-ACK, ACK), sliding window flow control, sequence numbers, and UDP connectionless datagram transmission.
- **Interactive Simulator:** Side-by-side comparative animation of TCP reliable packet stream vs UDP fast datagram flow.

### 7.14 Practical 14: DHCP Configuration & IP Pools
- **Focus:** Automatic IP allocation, DHCP DORA process (Discover, Offer, Request, Acknowledge), IP address pools, lease time, and default gateway distribution.
- **Interactive Simulator:** DHCP DORA packet handshake visualizer and IP pool allocation simulator.

### 7.15 Practical 15: Static Network Address Translation (Static NAT 1:1)
- **Focus:** One-to-one mapping between private IP address (`192.168.1.10`) and public IP address (`203.0.113.10`).
- **Interactive Simulator:** NAT table translation engine showing packet header modification at edge router interface.

### 7.16 Practical 16: Dynamic NAT & PAT Overload
- **Focus:** Many-to-one translation using Port Address Translation (PAT), source port multiplexing, and NAT overload pools.
- **Interactive Simulator:** Multi-client PAT simulator demonstrating how multiple internal PCs share a single public IP address via distinct source port numbers.

---

## 8. MULTI-DISCIPLINARY VIRTUAL LABORATORY TRACKS

In addition to Computer Networks, VLAB supports 7 other academic lab tracks:

1. **Operating Systems Lab:** CPU Scheduling (FCFS, SJF, RR, Priority), Process Synchronization (Semaphores, Producer-Consumer), Deadlock Avoidance (Banker's Algorithm), Page Replacement (FIFO, LRU, Optimal), Disk Scheduling (FCFS, SCAN, C-SCAN).
2. **Computer Programming Lab:** Browser-embedded code execution environment supporting C, C++, Java, Python, and NASM x86 Assembly.
3. **Database Systems (DBMS) Lab:** SQL Query Execution engine, relational table visualizer, transaction concurrency, and B-Tree indexing simulators.
4. **Theory of Computation (TOC) Lab:** DFA/NFA simulators, NFA-to-DFA converter, Thompson's regex-to-NFA engine, CFG parser trees, PDA stack visualizer, Turing Machine tape simulator, and DFA minimization.
5. **Artificial Intelligence (AI) Lab:** Search algorithms (BFS, DFS, A*), CSP N-Queens solver, Minimax with Alpha-Beta pruning, Naïve Bayes, K-NN, K-Means clustering, Perceptron ANN, Backpropagation, Fuzzy Logic, and Genetic Algorithms.
6. **Cloud Computing Lab:** Virtualization VM lifecycle, Docker container orchestration, Load Balancing algorithms, Auto-Scaling policies, Object Storage, CDN edge caching, IAM security, Serverless functions, SLA monitoring, MapReduce, and Kubernetes Pod scheduling.
7. **Cybersecurity & Cryptography Lab:** Caesar Cipher, Vigenère Cipher, RSA Public-Key Encryption, AES Block Cipher, Hashing (MD5, SHA-256), Firewall Rule Engine, Intrusion Detection System (IDS), SQL Injection attack simulator, Cross-Site Scripting (XSS), Man-in-the-Middle (MITM), Steganography, and Port Scanning.

---

## 9. 2D HTML5 CANVAS TOPOLOGY BUILDER & PACKET TRACER ENGINE

The free-form practice sandbox (`TopologySimulation`) allows students to construct custom networks:
- **Device Library:** PCs, Laptops, Switches, Routers, Servers, Hubs.
- **Wiring Tools:** Straight-Through Copper, Crossover Copper, Fiber Optic, Serial WAN cables.
- **Interactive Features:** Drag-and-drop node placement, link creation, CLI IP configuration, packet ping test animations across links.

---

## 10. STATEFUL CLI TERMINAL & COMMAND PROCESSORS

VLAB includes an embedded Cisco IOS / Linux-style terminal simulator (`handleNetCommand`, `handleOsCommand`, `handleSql`):
- Supports standard networking syntax: `ping <ip>`, `traceroute <ip>`, `arp -a`, `netstat`, `nslookup <domain>`, `show ip route`, `ip route <dst> <mask5> <next-hop>`, `show vlan`, `show ip ospf neighbor`.

---

## 11. 11-MODULE INTERACTIVE DIGITAL TWIN SIMULATION ENGINES

Every experiment features a dedicated simulation dispatcher (`initSimulation(id)`). In Practical 2, the 11-module engine provides:
1. **OSI Layer Explorer** (L1 to L7 inspector).
2. **Physical Layer Simulation** (Copper, Fiber, Wi-Fi bit signaling).
3. **Data Link Layer Simulation** (Switch MAC learning).
4. **Network Layer Simulation** (Router IP forwarding).
5. **Transport Layer Simulation** (TCP 3-way handshake & UDP stream).
6. **Session Layer Simulation** (Session state management).
7. **Presentation Layer Simulation** (TLS 1.3 encryption & UTF-8 encoding).
8. **Application Layer Simulation** (HTTP GET request generator).
9. **Encapsulation & Decapsulation Mechanics** (PDU header assembly).
10. **End-to-End Flow** (Live animated 2D Canvas packet journey from browser to Google server).
11. **Layer-wise Fault Diagnoser** (Diagnostic fault isolation).

---

## 12. AI TUTOR ASSISTANT & VOICE COMMAND CONTROLLER

### 12.1 Floating AI Tutor Assistant
- A floating chat bubble (`✨`) opens a drawer (`global-ai-drawer`) providing contextual academic assistance based on active lab, current code/topology state, and active section.

### 12.2 Voice Command Controller
- Utilizes Web Speech API (`webkitSpeechRecognition`) allowing hands-free voice commands: `"run code"`, `"audit code"`, `"toggle theme"`, `"open tutor"`, `"reset code"`.

---

## 13. PRE-TEST & POST-TEST ADAPTIVE ASSESSMENT SYSTEMS

Every experiment contains a 5-question Pre-Test and a 10-question Post-Test:
- Instant automated scoring, answer verification, and detailed academic explanations.
- Successful Pre-Test completion unlocks the Interactive Simulation and Experiment sections.
- Post-Test score feeds directly into completion tracking and certificate eligibility.

---

## 14. LAYER-WISE NETWORK FAULT DIAGNOSER & TROUBLESHOOTING CHALLENGES

Each practical includes real-world troubleshooting scenarios. For example, in Practical 2:
- Fault 1: Physical cable disconnected (L1 Physical).
- Fault 2: MAC address table mismatch (L2 Data Link).
- Fault 3: Default gateway IP unreachable (L3 Network).
- Fault 4: Firewall blocking TCP port 443 (L4 Transport).
- Fault 5: DNS server domain resolution failure (L7 Application).

---

## 15. VIVA VOCE INTERACTIVE ORAL EXAMINATION ENGINE

Provides curated oral examination questions with expandable sample answers to prepare students for university viva examinations.

---

## 16. MINI-ASSIGNMENT TASKS & PRACTICAL REVIEW CHECKLISTS

Inside `section-practice_tasks`:
- **Structured Mini-Assignment Checklist (`mini_tasks`):** Tasks with interactive completion checkboxes.
- **Hands-on CLI Exercises (`practice_commands`):** Executable command snippets.
- **Theoretical Review Questions (`practice_questions`):** Review prompts for lab notebooks.

---

## 17. AUTOMATED PDF REPORT GENERATION & VERIFIED CERTIFICATE ENGINE

Upon completing the Post-Test:
1. **Lab Manual PDF:** Auto-generates a complete PDF report incorporating student info, experiment title, aim, theory, CLI command output, simulation screenshot (`html2canvas`), pre/post test score cards, and teacher evaluation comments using `jspdf`.
2. **Verified Completion Certificate:** Renders a formal MIT ADT University certificate with student name, lab title, date, unique verification ID, and institutional signature.

---

## 18. TEACHER MANAGEMENT WORKSPACE (`teacher.html`)

The Teacher Workspace provides full institutional control:

```
+-----------------------------------------------------------------------------------+
|                            TEACHER MANAGEMENT WORKSPACE                           |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |  Live Student Session  |  |   Curriculum Content   |  | Manual Evaluation   |  |
|  |  Tracker & Timestamps  |  |    Customizer Engine   |  |    & Scorecards     |  |
|  +-----------+------------+  +-----------+------------+  +----------+----------+  |
|              |                           |                          |             |
|              +---------------------------+--------------------------+             |
|                                          |                                        |
|                              +-----------v------------+                           |
|                              |   Firestore Cloud DB   |                           |
|                              +------------------------+                           |
+-----------------------------------------------------------------------------------+
```

### 18.1 Live Student Session Tracking & Monitoring
- Displays real-time status for all enrolled students across all practicals.
- Logs exact session timestamps: **Started When** (e.g., `July 26, 2026, 05:14 PM`), **Completed When** (e.g., `July 26, 2026, 05:42 PM`), **Elapsed Time**, and **Current Score**.

### 18.2 Curriculum Content Editor
- Teachers can edit lab aims, add custom theory sections, adjust pre/post test questions, and customize mini-assignment tasks. Edits sync instantly via Firestore to all student sessions.

---

## 19. ADMIN CONTROL CENTER & SYSTEM GOVERNANCE (`admin.html`)

The Administrator workspace handles user account provisioning, institutional metrics, batch CSV student imports, and database maintenance.

---

## 20. FIREBASE FIRESTORE SYNCHRONIZATION & CLOUD STATE PERSISTENCE

- **User Progress Collection (`users/{uid}/progress`):** Stores completion flags, pretest/posttest scores, feedback, and certificate timestamps.
- **Topology Collection (`users/{uid}/topologies`):** Stores saved canvas node layouts and link configurations.
- **Curriculum Customizations Collection (`curriculum/{labId}`):** Stores teacher-edited curriculum overrides.

---

## 21. DESIGN SYSTEM, UI AESTHETICS & RESPONSIVE UX TOKENS

The design system enforces modern web design principles:
- Dark Mode Tokens: `--bg-page: #0f172a`, `--bg-card: #1e293b`, `--text-main: #f8fafc`, `--border: rgba(255,255,255,0.1)`.
- Accent Colors: Sky Blue (`#38bdf8`), Emerald Green (`#10b981`), Purple (`#a855f7`), Amber (`#f59e0b`), Rose (`#ef4444`).
- Typography: Inter / System UI with JetBrains Mono for CLI text.

---

## 22. DATA MODELS, SCHEMAS & STATE MANAGEMENT

### 22.1 Experiment Data Model (`VLAB_DATA[labId]`)
```json
{
    "title": "Practical 2: Network Communication Models (OSI & TCP/IP)",
    "theme": "From Bits to Browser – Understanding How Data Travels Across a Network",
    "aim": "...",
    "intro": { "summary": "...", "importance": "...", "applications": [...], "outcome": "..." },
    "prerequisites": [...],
    "outcomes": [...],
    "theory": { "intro": "...", "sections": [{ "heading": "...", "content": "..." }] },
    "hardware_inspector": [...],
    "troubleshooting": { "problem": "...", "hints": [...], "fix": "..." },
    "evaluations": { "pretest": [...], "posttest": [...] },
    "viva": [...],
    "practice_commands": [...],
    "practice_questions": [...],
    "mini_tasks": [...]
}
```

---

## 23. SECURITY, PRIVACY & DATA PROTECTION

- Firebase Auth with secure token refresh.
- Client-side data sanitization before DOM injection to prevent XSS.
- Stateful sandboxing for JavaScript/Python/C code execution.

---

## 24. DEPLOYMENT, BUILD PIPELINES & HOSTING INFRASTRUCTURE

- **Production Hosting:** Render (`https://vlab-mitadt.onrender.com/`) & GitHub Pages mirror (`asg492607/vlab_mitadt`).
- **CI/CD Pipeline:** PWA cache invalidation via Service Worker version incrementing (`sw.js`).
- **Automated V8 Syntax Verification:** Local pre-push testing with `node --experimental-vm-modules test_v8.js`.

---

## 25. FUTURE ROADMAP & MAINTENANCE GUIDELINES

1. **3D WebGL Device Inspection:** Integrating Three.js for 3D rack mounting and cable plugging.
2. **AI Automated Code & Topology Grading:** Deep Learning analysis of student topology designs and CLI logs.
3. **Multi-Player Collaborative Labs:** Real-time WebRTC multi-student group lab sessions.

---
*MIT ADT University Virtual Laboratories Platform • Complete Technical Manual*