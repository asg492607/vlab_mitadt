window.VLAB_COURSE_SEQUENCE = [
    'intro_tools',
    'net_commands',
    'topologies',
    'ip_class',
    'lan_cables',
    'subnetting',
    'vlan',
    'routing_rip',
    'routing_ospf',
    'routing_eigrp',
    'static_routing',
    'udp_tcp',
    'dhcp_config',
    'static_nat',
    'dynamic_nat'
];

window.VLAB_DATA = {
    'intro_tools': {
        title: "Practical 1: Introduction to Computer Networking Tools, Devices & Transmission Media",
        aim: "To study and understand the fundamentals of computer networks, networking devices (Hub, Switch, Router, Bridge, Repeater, Gateway, Modem, Firewall, WAP, Server, Client), transmission media (Twisted Pair, Coaxial, Fiber Optic), connectors (RJ45, RJ11, BNC, LC, SC, ST), ports, MAC addressing, status LEDs, and real-world data transmission.",
        intro: {
            summary: "Computer networks have become an essential part of modern life. Every time we browse a website, send an email, attend an online class, stream a video, or transfer files between computers, we are using a computer network. A computer network allows two or more computing devices to communicate, exchange data, and share resources efficiently.",
            importance: "A network can be as small as two computers connected by a cable or as large as the Internet, connecting billions of devices worldwide. The primary goal of networking is to enable communication, resource sharing, collaboration, and centralized management. Before learning IP addressing, routing, switching, or network security, it is essential to master basic hardware components.",
            applications: [
                "File Sharing between users across local & remote subnets",
                "High-Speed Internet Access & Cloud Resource Access",
                "Shared Hardware Resources (Printers, Centralized Servers, Storage)",
                "Real-Time Email, Instant Messaging & Video Conferencing",
                "Enterprise Remote Work, Online Banking & E-Learning Platforms",
                "Centralized Network Security Audit & Firewall Telemetry Monitoring"
            ],
            outcome: "After completing this practical, students will be able to identify, inspect, and differentiate all primary networking devices, copper and optical transmission cables, physical connectors, MAC hardware addressing, and LED status indicators."
        },
        prerequisites: [
            "Basic Computer Fundamentals & Operating System navigation.",
            "Understanding of Client-Server and Peer-to-Peer communication models.",
            "Basic concepts of Binary, Decimal, and Hexadecimal numbering systems.",
            "Familiarity with computer hardware ports and peripheral connections."
        ],
        outcomes: [
            "Differentiate between Layer 1 (Hub/Repeater), Layer 2 (Switch/Bridge), and Layer 3 (Router/Gateway) devices.",
            "Identify network types: Personal Area Network (PAN), Local Area Network (LAN), Metropolitan Area Network (MAN), and Wide Area Network (WAN).",
            "Select appropriate transmission media: Straight-Through, Crossover, Coaxial, and Single-Mode/Multi-Mode Fiber Optic cables.",
            "Identify physical connectors: RJ45, RJ11, BNC, LC, SC, ST, and SFP transceiver modules.",
            "Decode 48-bit MAC physical hardware addresses and manufacturer Organizationally Unique Identifiers (OUI).",
            "Interpret status LEDs (Power, Link, Activity, Speed, PoE) on switches, routers, and Network Interface Cards (NICs)."
        ],
        theory: {
            intro: "A computer network is a collection of interconnected computing devices that communicate with each other using standard communication protocols (OSI and TCP/IP models). Interconnected nodes exchange information over physical copper cables, glass optical fibers, or wireless radio frequencies.",
            cards: [
                {
                    title: "Chapter 1: Introduction to Computer Networking",
                    content: "Computer networks have become an essential part of modern life. Every time we browse a website, send an email, attend an online class, stream a video, or transfer files between computers, we are using a computer network. A computer network allows two or more computing devices to communicate, exchange data, and share resources efficiently.\n\nA network can be as small as two computers connected by a cable or as large as the Internet, connecting billions of devices worldwide. The primary goal of networking is to enable communication, resource sharing, collaboration, and centralized management.\n\nBefore learning IP addressing, routing, switching, or network security, it is important to understand the basic hardware components used to build a network. This experiment introduces networking devices, cables, connectors, ports, and their practical applications."
                },
                {
                    title: "Chapter 2: What is a Computer Network?",
                    content: "A computer network is a collection of interconnected devices that communicate with each other using standard communication protocols (OSI & TCP/IP models).\n\nThe interconnected devices include:\n• Desktop Computers & Laptops\n• Mobile Phones & Tablets\n• Centralized Enterprise Servers\n• Layer 2 Switches & Layer 3 Routers\n• Network Printers & Storage Systems\n• Wireless Access Points (WAPs)\n• Stateful Hardware Firewalls\n• IoT (Internet of Things) Smart Devices\n\nThese devices exchange information through physical copper cables, glass optical fibers, or wireless radio frequency channels."
                },
                {
                    title: "Chapter 3: Why Computer Networks are Important",
                    content: "Computer networks provide indispensable advantages across educational institutions, businesses, hospitals, industries, and government organizations:\n\n1. File Sharing: Seamless file & database transfer between users across local and remote subnets.\n2. Internet Access: High-speed Internet & Cloud resource access for multi-user environments.\n3. Hardware Resource Sharing: Centralized sharing of expensive hardware like printers, high-performance servers, and NAS storage.\n4. Communication Tools: Real-time email, instant messaging, and voice over IP (VoIP).\n5. Video Conferencing: High-definition real-time digital video meetings and webinars.\n6. Cloud Computing: Scalable cloud storage, virtual machines, and SaaS platforms.\n7. E-Commerce & Banking: Secure online banking, digital payments, and global e-commerce.\n8. Remote Work & VPNs: Secure enterprise access for remote employees over Virtual Private Networks.\n9. E-Learning: Digital learning management systems, online courses, and digital Virtual Labs.\n10. Security & Auditing: Centralized network security telemetry monitoring and audit logging."
                },
                {
                    title: "Chapter 4: Types of Computer Networks (PAN, LAN, MAN, WAN)",
                    content: "• Personal Area Network (PAN):\n  - Connects personal devices within a very short distance.\n  - Typical Range: 1–10 meters.\n  - Examples: Bluetooth headset, smartwatch, wireless keyboard, mobile hotspot.\n\n• Local Area Network (LAN):\n  - Connects computers inside a limited geographical area.\n  - Examples: Computer laboratory, school, office building, library.\n  - Characteristics: High speed, low latency, privately owned.\n\n• Metropolitan Area Network (MAN):\n  - Connects multiple LANs across a city or metropolitan region.\n  - Examples: University campuses, municipal office networks, cable television providers.\n\n• Wide Area Network (WAN):\n  - Connects computers across countries or continents.\n  - Example: The Internet.\n  - Characteristics: Large geographical coverage, uses routers, interconnects multiple LANs."
                },
                {
                    title: "Chapter 5: Network Topology Overview",
                    content: "A network topology describes the physical layout and logical path of interconnected nodes in a network:\n\n• Bus Topology: All nodes connect to a single central backbone cable with terminators at both ends.\n• Star Topology: All nodes connect directly to a central Switch or Hub. Offers high fault tolerance.\n• Ring Topology: Closed loop where data travels in one direction using token passing.\n• Mesh Topology: Every node has dedicated point-to-point links to every other node (Full Mesh = N*(N-1)/2 links).\n• Tree Topology: Hierarchical arrangement combining star and bus topologies.\n• Hybrid Topology: Combination of two or more different topologies (e.g. Star-Ring).\n\n(Note: Network topologies, packet flow, and fault tolerance will be studied in detail in Practical 3)."
                },
                {
                    title: "Chapter 6A: Layer 1 Devices — Hub & Repeater",
                    content: "• Hub (Layer 1 Physical Device):\n  - Definition: A multiport Layer-1 device that repeats incoming electrical signals to EVERY connected port.\n  - Working: Receives signal on one port and broadcasts it to all other ports without learning MAC addresses.\n  - Advantages: Cheap, simple to install.\n  - Disadvantages: Creates a single collision domain, highly inefficient, insecure.\n  - Applications: Small legacy networks.\n\n• Repeater (Layer 1 Physical Device):\n  - Definition: A 2-port Layer-1 device that regenerates attenuated electrical or optical signals to extend maximum physical cable distance."
                },
                {
                    title: "Chapter 6B: Layer 2 Devices — Switch & Bridge",
                    content: "• Switch (Layer 2 Data Link Device):\n  - Definition: A multiport Layer-2 device that forwards Ethernet frames using MAC addresses.\n  - Working: Learns source MAC addresses, maintains a dynamic MAC Address Table, and sends frames ONLY to the destination port.\n  - Advantages: Faster forwarding, zero collision domain per port, high security, full-duplex support.\n  - Applications: Enterprise & Campus LANs.\n\n• Bridge (Layer 2 Data Link Device):\n  - Definition: A 2-port Layer-2 device used to connect and filter traffic between two LAN segments based on MAC addresses."
                },
                {
                    title: "Chapter 6C: Layer 3 & Core Devices — Router, Gateway, Modem, Firewall, WAP",
                    content: "• Router (Layer 3 Network Device):\n  - Definition: Connects different networks using IP addresses. Handles routing, packet forwarding, Internet connectivity, NAT, and DHCP. Applications: Home Wi-Fi routers, Enterprise routers, ISP core routers.\n\n• Gateway:\n  - Definition: Connects networks that use different communication protocols (e.g., IPv4 ↔ IPv6 or SNA ↔ TCP/IP).\n\n• Modem:\n  - Definition: Performs Modulation (Digital → Analog) and Demodulation (Analog → Digital) for ISP connectivity over telephone/coaxial lines.\n\n• Firewall:\n  - Definition: Inspects incoming/outgoing traffic and permits or blocks packets based on defined security rules. Types: Hardware Firewalls & Software Firewalls.\n\n• Wireless Access Point (WAP):\n  - Definition: Provides wireless Wi-Fi connectivity (IEEE 802.11) to a wired Ethernet LAN."
                },
                {
                    title: "Chapter 6D: End-Node Hosts — Server & Client",
                    content: "• Server:\n  - Definition: A powerful central computer or software program that provides services, resources, or data to client devices.\n  - Examples:\n    - Web Server (HTTP/HTTPS websites)\n    - Database Server (SQL data storage)\n    - DNS Server (Domain Name resolution)\n    - DHCP Server (Automatic IP address leases)\n    - Mail Server (SMTP/IMAP email handling)\n    - File Server (FTP/SMB file storage)\n\n• Client:\n  - Definition: An end-user device that requests and consumes services provided by servers.\n  - Examples: Desktop PCs, Laptops, Mobile Smartphones, Tablets."
                },
                {
                    title: "Chapter 7A: Networking Cables — Twisted Pair Cables",
                    content: "Twisted pair cables consist of pairs of insulated copper wires twisted around each other to minimize electromagnetic interference (EMI) and crosstalk.\n\nCategories & Speed Specifications:\n• Cat5: Up to 100 Mbps, 100 MHz frequency.\n• Cat5e: Up to 1 Gbps (1000 Mbps), 100 MHz frequency (Standard Ethernet).\n• Cat6: Up to 1 Gbps (10 Gbps up to 55 meters), 250 MHz frequency.\n• Cat6A: Up to 10 Gbps at 100 meters, 500 MHz frequency.\n• Cat7: Up to 10 Gbps with individually shielded pairs (S/FTP), 600 MHz frequency.\n• Cat8: Up to 40 Gbps for data centers up to 30 meters, 2000 MHz frequency."
                },
                {
                    title: "Chapter 7B: Cable Wiring Pinouts — Straight-Through vs Crossover",
                    content: "Ethernet cables use the TIA/EIA-568 wiring standards:\n\n• Straight-Through Cable:\n  - Definition: Identical pinout wiring arrangement on both ends (T568B to T568B or T568A to T568A).\n  - Wiring Standard (T568B): Pin 1: White-Orange, Pin 2: Orange, Pin 3: White-Green, Pin 4: Blue, Pin 5: White-Blue, Pin 6: Green, Pin 7: White-Brown, Pin 8: Brown.\n  - Used Between: DIFFERENT device types (e.g. PC → Switch, Switch → Router).\n\n• Crossover Cable:\n  - Definition: Swapped pinout wiring arrangement on one end (Pin 1&3 TX/RX swapped, Pin 2&6 swapped).\n  - Used Between: SIMILAR device types (e.g. PC → PC, Switch → Switch, Router → Router)."
                },
                {
                    title: "Chapter 7C: Transmission Media — Coaxial & Fiber Optic Cables",
                    content: "• Coaxial Cable:\n  - Structure: Central copper conductor surrounded by dielectric insulator, woven copper shield, and outer jacket.\n  - Applications: Cable TV networks, ADSL broadband, older BNC Ethernet LANs.\n\n• Fiber Optic Cable:\n  - Working: Transmits data as pulses of light through ultra-pure glass or plastic cores using Total Internal Reflection.\n  - Advantages: Immune to EMI/RFI, extremely high bandwidth, ultra-long transmission distance.\n  - Types:\n    - Single-Mode Fiber (SMF): Thin core (~9 microns), uses laser light, long distance up to 40 km.\n    - Multi-Mode Fiber (MMF): Thicker core (~50–62.5 microns), uses LED light, short distance up to 550 meters (data centers & campus backbones)."
                },
                {
                    title: "Chapter 8: Physical Connectors",
                    content: "Physical connectors terminate cables to plug securely into hardware ports:\n\n• RJ45 (Registered Jack 45): 8P8C modular connector used for Ethernet twisted pair cables (Cat5e/Cat6).\n• RJ11 (Registered Jack 11): 6P4C connector used for telephone lines and ADSL modems.\n• BNC (Bayonet Neill–Concelman): Push-and-twist connector used for coaxial cables.\n• LC (Lucent Connector): Small form-factor push-pull optical fiber connector.\n• SC (Subscriber Connector): Square snap-in optical fiber connector.\n• ST (Straight Tip): Bayonet mount optical fiber connector.\n• USB Ethernet Adapter: External USB-to-RJ45 dongle providing Ethernet ports to modern laptops."
                },
                {
                    title: "Chapter 9: Network Interface Card (NIC)",
                    content: "A Network Interface Card (NIC) is a hardware circuit board installed inside a computing device that provides a physical connection to a network:\n\n• Key Functions:\n  1. Converts internal parallel digital data into serial electrical or optical signals for transmission.\n  2. Provides a permanent 48-bit MAC physical address burned into ROM.\n  3. Controls physical frame transmission, reception, and error detection (FCS).\n• Speed Ratings: 10 Mbps, 100 Mbps (Fast Ethernet), 1000 Mbps (Gigabit Ethernet), 10 Gbps.\n• Transmission Duplex:\n  - Half-Duplex: Device can send OR receive data, but NOT at the same time (e.g. Hubs, Walkie-Talkies).\n  - Full-Duplex: Device can send AND receive data simultaneously (e.g. Switches, Telephones)."
                },
                {
                    title: "Chapter 10: Hardware Interfaces & Ports",
                    content: "Hardware ports on Routers, Switches, and Workstations facilitate physical connections:\n\n• Ethernet Port (10 Mbps): Legacy copper RJ-45 interface.\n• Fast Ethernet Port (100 Mbps): Standard 100Base-TX interface (labeled Fa0/1).\n• Gigabit Ethernet Port (1000 Mbps): High-speed 1000Base-T interface (labeled Gi0/1).\n• Serial Port (Smart Serial / DB-60): Used for point-to-point WAN router connections.\n• Console Port (RJ-45 / USB): Used for out-of-band initial CLI configuration of Cisco routers & switches.\n• Fiber SFP Port (Small Form-factor Pluggable): Modular transceiver slot for optical fiber links."
                },
                {
                    title: "Chapter 11: MAC Address (Media Access Control)",
                    content: "A MAC address is a 48-bit (6-byte) physical hardware address unique to every Network Interface Card worldwide:\n\n• Format: 12 Hexadecimal digits grouped in 6 pairs separated by colons or hyphens.\n• Example: 00:1A:2B:3C:4D:5E\n\n• Address Structure Breakdown:\n  - First 24 Bits (00:1A:2B): Organizationally Unique Identifier (OUI) assigned by IEEE to the manufacturer (e.g. Cisco, Intel, Apple).\n  - Last 24 Bits (3C:4D:5E): Network Interface Controller (NIC) serial number assigned by the manufacturer."
                },
                {
                    title: "Chapter 12: Device Status LEDs",
                    content: "Status LED indicators on Switches, Routers, and NICs provide real-time hardware diagnostics:\n\n• Power LED: Solid Green = Power ON; Dark = Power OFF.\n• Link LED: Solid Green = Physical link established (Carrier Detect); Dark = Disconnected/Link Down.\n• Activity LED: Flashing Green = Packets currently being transmitted or received.\n• Speed LED: Solid Green = Gigabit speed (1000 Mbps); Amber = Fast Ethernet speed (100 Mbps); Dark = 10 Mbps.\n• PoE LED: Green = Power over Ethernet actively supplied to IP phone or WAP."
                },
                {
                    title: "Chapter 13 & 14: Data Transmission & Real-World Network Example",
                    content: "Data Transmission Path:\nSender Workstation → CAT6 Cable → Layer 2 Switch → Layer 3 Router → ISP WAN → Destination Server\n\nReal-World Enterprise Network Architecture:\nInternet Gateway\n      │\nEnterprise Router\n      │\nCore Switch\n  ├── PC1 (Sales)\n  ├── PC2 (HR)\n  ├── Laptop (Wi-Fi WAP)\n  ├── Network Printer\n  └── Central File Server\n\nData Flow Example: PC1 sends a file to the File Server. PC1 encapsulates data into an IP packet and Ethernet frame. The Switch receives the frame on Port Fa0/1, inspects the destination MAC address in its MAC Address Table, and forwards the frame directly out Port Fa0/24 to the File Server without broadcasting."
                },
                {
                    title: "Chapter 15 & 16: Safety Precautions & Comprehensive Summary",
                    content: "Safety Precautions:\n1. Handle fiber optic cables carefully; NEVER look directly into a live optical fiber port (Laser radiation hazard).\n2. Observe cable minimum bending radius; do not kink, pinch, or crush Ethernet cables.\n3. Power off hardware devices before installing or removing HWIC expansion modules.\n4. Use correct cable types (Straight-Through vs Crossover).\n5. Verify status LED indicators before running network diagnostic tests.\n6. Clearly label both ends of every cable during network installation.\n\nSummary:\nStudents now possess a foundational understanding of computer networking, network classifications (PAN, LAN, MAN, WAN), Layer 1/2/3 hardware devices, copper and optical cabling, connectors, ports, MAC addressing, status LEDs, and end-to-end data flow. This foundation prepares students for Practical 2 (CLI Commands), Practical 3 (Topologies), and all subsequent routing & switching modules."
                }
            ],
            formulas: [
                "Full Mesh Links Required = N * (N - 1) / 2",
                "MAC Address Length = 48 Bits = 6 Bytes = 12 Hexadecimal Digits",
                "Max CAT5e/CAT6 Copper Segment Length = 100 Meters (328 Feet)",
                "Full-Duplex Bandwidth = 2 * Speed (e.g. 2 x 100 Mbps = 200 Mbps)"
            ],
            standards: [
                "IEEE 802.3 - Ethernet Standard",
                "IEEE 802.11 - Wireless LAN (Wi-Fi) Standard",
                "TIA/EIA-568-B - Commercial Building Telecommunications Cabling Standard",
                "ISO/IEC 7498-1 - Open Systems Interconnection (OSI) Reference Model"
            ]
        },
        tools: [
            {
                name: "Cisco 2911 Enterprise Router",
                layer: "Layer 3 (Network)",
                ports: "3x GE 10/100/1000, 2x HWIC Serial slots, 1x Console RJ-45",
                usage: "Inter-VLAN routing, WAN interconnection, NAT, and DHCP service hosting",
                statusLED: "Green (Link UP), Amber (Boot/Fault)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="10" y="20" width="360" height="80" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/><rect x="25" y="32" width="90" height="24" rx="4" fill="#0f172a"/><text x="70" y="48" fill="#38bdf8" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">CISCO 2911</text><rect x="130" y="32" width="225" height="56" rx="4" fill="#0f172a" stroke="#334155"/><rect x="140" y="42" width="22" height="16" rx="2" fill="#334155" stroke="#64748b"/><text x="151" y="54" fill="#94a3b8" font-size="7" font-family="monospace" text-anchor="middle">GE0/0</text><rect x="168" y="42" width="22" height="16" rx="2" fill="#334155" stroke="#64748b"/><text x="179" y="54" fill="#94a3b8" font-size="7" font-family="monospace" text-anchor="middle">GE0/1</text><rect x="196" y="42" width="22" height="16" rx="2" fill="#334155" stroke="#64748b"/><text x="207" y="54" fill="#94a3b8" font-size="7" font-family="monospace" text-anchor="middle">GE0/2</text><rect x="230" y="40" width="55" height="40" rx="3" fill="#1e293b" stroke="#3b82f6"/><text x="257" y="63" fill="#60a5fa" font-size="8" font-family="monospace" text-anchor="middle">HWIC-1T</text><rect x="292" y="40" width="55" height="40" rx="3" fill="#1e293b" stroke="#3b82f6"/><text x="319" y="63" fill="#60a5fa" font-size="8" font-family="monospace" text-anchor="middle">HWIC-2T</text><circle cx="35" cy="75" r="4" fill="#22c55e"/><circle cx="48" cy="75" r="4" fill="#22c55e"/><circle cx="61" cy="75" r="4" fill="#f59e0b"/><text x="75" y="78" fill="#94a3b8" font-size="8" font-family="monospace">PWR/SYS</text></svg>`
            },
            {
                name: "Cisco 2960 Enterprise Switch",
                layer: "Layer 2 (Data Link)",
                ports: "24x FastEthernet 10/100, 2x Gigabit SFP Fiber Uplinks",
                usage: "Dedicated port aggregation, MAC table forwarding, and VLAN creation",
                statusLED: "Green (Solid = Link, Flashing = Activity)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="10" y="25" width="360" height="70" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/><rect x="20" y="35" width="70" height="18" rx="3" fill="#0f172a"/><text x="55" y="47" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">CISCO 2960</text><g fill="#334155" stroke="#64748b"><rect x="100" y="35" width="14" height="12" rx="1"/><rect x="118" y="35" width="14" height="12" rx="1"/><rect x="136" y="35" width="14" height="12" rx="1"/><rect x="154" y="35" width="14" height="12" rx="1"/><rect x="172" y="35" width="14" height="12" rx="1"/><rect x="190" y="35" width="14" height="12" rx="1"/><rect x="208" y="35" width="14" height="12" rx="1"/><rect x="226" y="35" width="14" height="12" rx="1"/><rect x="244" y="35" width="14" height="12" rx="1"/><rect x="262" y="35" width="14" height="12" rx="1"/><rect x="280" y="35" width="14" height="12" rx="1"/><rect x="298" y="35" width="14" height="12" rx="1"/><rect x="100" y="52" width="14" height="12" rx="1"/><rect x="118" y="52" width="14" height="12" rx="1"/><rect x="136" y="52" width="14" height="12" rx="1"/><rect x="154" y="52" width="14" height="12" rx="1"/><rect x="172" y="52" width="14" height="12" rx="1"/><rect x="190" y="52" width="14" height="12" rx="1"/><rect x="208" y="52" width="14" height="12" rx="1"/><rect x="226" y="52" width="14" height="12" rx="1"/><rect x="244" y="52" width="14" height="12" rx="1"/><rect x="262" y="52" width="14" height="12" rx="1"/><rect x="280" y="52" width="14" height="12" rx="1"/><rect x="298" y="52" width="14" height="12" rx="1"/></g><rect x="322" y="35" width="18" height="28" rx="2" fill="#0284c7" stroke="#38bdf8"/><rect x="344" y="35" width="18" height="28" rx="2" fill="#0284c7" stroke="#38bdf8"/><text x="342" y="75" fill="#38bdf8" font-size="7" font-family="monospace" text-anchor="middle">SFP UPLINKS</text><circle cx="107" cy="31" r="2" fill="#22c55e"/><circle cx="125" cy="31" r="2" fill="#22c55e"/><circle cx="161" cy="31" r="2" fill="#22c55e"/><circle cx="215" cy="31" r="2" fill="#22c55e"/><circle cx="269" cy="31" r="2" fill="#22c55e"/></svg>`
            },
            {
                name: "Ethernet Hub (Multiport Repeater)",
                layer: "Layer 1 (Physical)",
                ports: "8x FastEthernet RJ-45",
                usage: "Broadcast signal repetition across all connected nodes (Legacy)",
                statusLED: "Solid Green Power, Flashing Collision Amber",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="30" y="30" width="320" height="60" rx="8" fill="#334155" stroke="#64748b" stroke-width="2"/><text x="50" y="52" fill="#f59e0b" font-size="11" font-family="sans-serif" font-weight="bold">8-PORT ETHERNET HUB</text><g fill="#1e293b" stroke="#94a3b8"><rect x="160" y="45" width="16" height="16" rx="2"/><rect x="182" y="45" width="16" height="16" rx="2"/><rect x="204" y="45" width="16" height="16" rx="2"/><rect x="226" y="45" width="16" height="16" rx="2"/><rect x="248" y="45" width="16" height="16" rx="2"/><rect x="270" y="45" width="16" height="16" rx="2"/><rect x="292" y="45" width="16" height="16" rx="2"/><rect x="314" y="45" width="16" height="16" rx="2"/></g><circle cx="50" cy="72" r="3" fill="#22c55e"/><text x="58" y="75" fill="#cbd5e1" font-size="8" font-family="monospace">PWR</text><circle cx="90" cy="72" r="3" fill="#f59e0b"/><text x="98" y="75" fill="#f59e0b" font-size="8" font-family="monospace">COL</text></svg>`
            },
            {
                name: "Network Interface Card (NIC)",
                layer: "Layer 1 & Layer 2",
                ports: "RJ-45 Copper / SFP Fiber",
                usage: "Provides 48-bit MAC hardware address and converts data into serial signals",
                statusLED: "Green (Link UP), Amber (1000Mbps Speed)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="50" y="20" width="260" height="75" rx="6" fill="#15803d" stroke="#166534" stroke-width="2"/><rect x="25" y="10" width="20" height="95" rx="2" fill="#94a3b8" stroke="#64748b"/><rect x="30" y="40" width="24" height="28" rx="3" fill="#334155" stroke="#475569"/><rect x="34" y="46" width="16" height="16" fill="#0f172a"/><g fill="#eab308"><rect x="60" y="90" width="6" height="10"/><rect x="70" y="90" width="6" height="10"/><rect x="80" y="90" width="6" height="10"/><rect x="90" y="90" width="6" height="10"/><rect x="100" y="90" width="6" height="10"/><rect x="110" y="90" width="6" height="10"/><rect x="120" y="90" width="6" height="10"/><rect x="130" y="90" width="6" height="10"/></g><rect x="160" y="35" width="50" height="40" rx="4" fill="#1e293b" stroke="#334155"/><text x="185" y="58" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">REALTEK</text><circle cx="27" cy="32" r="3" fill="#22c55e"/><circle cx="27" cy="74" r="3" fill="#eab308"/></svg>`
            },
            {
                name: "CAT6 Twisted Pair Cable (RJ-45)",
                layer: "Layer 1 (Physical)",
                ports: "8P8C Modular RJ-45 Connector",
                usage: "Transmits electrical signals up to 100 meters at 1 Gbps / 10 Gbps",
                statusLED: "8-Pin Continuity LED",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><path d="M 20 60 Q 80 20 160 60 T 300 60 L 330 60" fill="none" stroke="#2563eb" stroke-width="16" stroke-linecap="round"/><path d="M 20 60 Q 80 20 160 60 T 300 60 L 330 60" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round"/><rect x="325" y="42" width="35" height="36" rx="4" fill="rgba(255,255,255,0.7)" stroke="#cbd5e1" stroke-width="2"/><g fill="#d97706"><rect x="330" y="46" width="3" height="10"/><rect x="335" y="46" width="3" height="10"/><rect x="340" y="46" width="3" height="10"/><rect x="345" y="46" width="3" height="10"/><rect x="350" y="46" width="3" height="10"/><rect x="355" y="46" width="3" height="10"/></g><text x="180" y="105" fill="#2563eb" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">CAT6 UTP 4-PAIR TWISTED CABLE</text></svg>`
            },
            {
                name: "Single-Mode / Multi-Mode Fiber Optic",
                layer: "Layer 1 (Physical)",
                ports: "LC, SC, ST Connectors",
                usage: "High-speed light transmission for campus backbones and data centers",
                statusLED: "Laser / LED Optical Tx/Rx",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><path d="M 30 45 L 290 45" stroke="#06b6d4" stroke-width="10" stroke-linecap="round"/><path d="M 30 75 L 290 75" stroke="#3b82f6" stroke-width="10" stroke-linecap="round"/><rect x="285" y="35" width="40" height="20" rx="3" fill="#2563eb" stroke="#1d4ed8"/><rect x="285" y="65" width="40" height="20" rx="3" fill="#2563eb" stroke="#1d4ed8"/><rect x="325" y="41" width="15" height="8" rx="1" fill="#f8fafc" stroke="#cbd5e1"/><rect x="325" y="71" width="15" height="8" rx="1" fill="#f8fafc" stroke="#cbd5e1"/><circle cx="345" cy="45" r="4" fill="#22c55e"/><circle cx="345" cy="75" r="4" fill="#ef4444"/><text x="180" y="105" fill="#0284c7" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">DUPLEX LC FIBER OPTIC PATCH CORD</text></svg>`
            },
            {
                name: "Stateful Hardware Firewall",
                layer: "Layer 3 to Layer 7",
                ports: "WAN, LAN, DMZ Gigabit Ports",
                usage: "Inspects packets and enforces access control rules to block malicious traffic",
                statusLED: "Green (Active Rule Match)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="20" y="25" width="340" height="70" rx="8" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/><rect x="35" y="38" width="90" height="22" rx="4" fill="#450a0a"/><text x="80" y="53" fill="#fca5a5" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">SECURITY ASA</text><g fill="#450a0a" stroke="#7f1d1d"><rect x="150" y="45" width="22" height="18" rx="2"/><text x="161" y="58" fill="#fca5a5" font-size="7" font-family="monospace" text-anchor="middle">WAN</text><rect x="180" y="45" width="22" height="18" rx="2"/><text x="191" y="58" fill="#fca5a5" font-size="7" font-family="monospace" text-anchor="middle">LAN</text><rect x="210" y="45" width="22" height="18" rx="2"/><text x="221" y="58" fill="#fca5a5" font-size="7" font-family="monospace" text-anchor="middle">DMZ</text></g><path d="M 285 40 L 305 32 L 325 40 L 325 60 Q 305 78 285 60 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="2"/><circle cx="45" cy="72" r="4" fill="#22c55e"/><text x="56" y="75" fill="#fca5a5" font-size="8" font-family="monospace">PROTECTED</text></svg>`
            }
        ],
        procedure: [
            "Step 1: Inspect the workspace canvas and identify the Cisco 2911 Router, Cisco 2960 Switch, Server, and Client Workstations.",
            "Step 2: Drag a Cisco 2960 Switch and 4 Client PCs to the workspace canvas.",
            "Step 3: Connect PC1 to Switch Port FastEthernet0/1 using a Copper Straight-Through cable (T568B pinout).",
            "Step 4: Connect PC2 to Switch Port FastEthernet0/2 and observe the Switch port LED transition from Amber (Spanning Tree learning) to Solid Green (Forwarding).",
            "Step 5: Inspect the NIC MAC address on PC1 by executing `ipconfig /all` or `getmac` in the CLI terminal.",
            "Step 6: Assign static IP address 192.168.1.10/24 to PC1 and 192.168.1.11/24 to PC2.",
            "Step 7: Execute `ping 192.168.1.11` from PC1 to verify end-to-end Layer-2 and Layer-3 ICMP communication.",
            "Step 8: Execute `arp -a` on PC1 to inspect the populated ARP table mapping IP 192.168.1.11 to PC2's physical MAC address."
        ],
        troubleshooting: {
            problem: "PC1 cannot ping PC2 connected to the same Layer-2 Switch. Switch port LED remains dark.",
            hints: [
                "Check if the physical cable is inserted into the correct NIC port on both ends.",
                "Verify whether a Straight-Through cable is used (Crossover cable may fail on non-Auto-MDIX ports).",
                "Verify if IP addresses are in the same subnet (192.168.1.0/24).",
                "Check if the Network Interface Card (NIC) is enabled in OS network settings."
            ],
            fix: "Ensure a CAT6 Straight-Through cable is connected between PC1 NIC and Switch Port Fa0/1, and assign valid IP 192.168.1.11/24 to PC2."
        },
        posttest: [
            {
                q: "What is the primary operational difference between an Ethernet Hub and a Layer-2 Switch?",
                options: [
                    "A Hub forwards frames using MAC addresses, while a Switch broadcasts to all ports.",
                    "A Hub operates at Layer 1 and broadcasts signals to ALL connected ports, whereas a Switch operates at Layer 2 and forwards frames ONLY to the destination port.",
                    "A Switch operates at Layer 3 and routes packets, while a Hub operates at Layer 2.",
                    "There is no difference; Hub and Switch are identical devices."
                ],
                correct: 1,
                answer: 1,
                explanation: "Hubs are Layer-1 devices that repeat electrical signals to all ports (shared collision domain). Switches are Layer-2 devices that learn MAC addresses to unicast frames (zero collision domain)."
            },
            {
                q: "Which OSI Layers does a Network Interface Card (NIC) operate at?",
                options: [
                    "Layer 7 (Application Layer)",
                    "Layer 4 (Transport Layer)",
                    "Layer 1 (Physical) & Layer 2 (Data Link)",
                    "Layer 3 (Network Layer)"
                ],
                correct: 2,
                answer: 2,
                explanation: "The NIC handles physical signaling (Layer 1) and frames data with 48-bit MAC hardware addresses (Layer 2)."
            },
            {
                q: "How many bits are contained in a standard Ethernet MAC address?",
                options: [
                    "32 bits (4 bytes)",
                    "48 bits (6 bytes)",
                    "64 bits (8 bytes)",
                    "128 bits (16 bytes)"
                ],
                correct: 1,
                answer: 1,
                explanation: "An Ethernet MAC address is a 48-bit (6-byte) hexadecimal hardware address."
            },
            {
                q: "Which cable pinout configuration connects two SIMILAR networking devices directly (e.g. PC to PC)?",
                options: [
                    "Straight-Through Cable",
                    "Crossover Cable",
                    "Rollover Console Cable",
                    "Coaxial BNC Cable"
                ],
                correct: 1,
                answer: 1,
                explanation: "A Crossover cable swaps Pins 1&3 and Pins 2&6 to connect transmit (Tx) to receive (Rx) between similar MDI devices."
            },
            {
                q: "What is the maximum standard segment length for CAT6 copper twisted pair cabling?",
                options: [
                    "50 meters (164 feet)",
                    "100 meters (328 feet)",
                    "500 meters (1640 feet)",
                    "1000 meters (3280 feet)"
                ],
                correct: 1,
                answer: 1,
                explanation: "Standard TIA/EIA-568 Ethernet copper cable segments are limited to 100 meters (90m solid horizontal + 10m patch cables)."
            },
            {
                q: "A technician connects a Router GigabitEthernet port directly to a PC NIC without Auto-MDIX. Which cable type is required?",
                options: [
                    "Straight-Through Cable",
                    "Crossover Cable",
                    "Single-Mode Fiber Cable",
                    "Rollover Console Cable"
                ],
                correct: 1,
                answer: 1,
                explanation: "Routers and PC NICs are both MDI devices (transmit on Pins 1 & 2). Connecting them directly requires a Crossover cable to map Tx to Rx."
            },
            {
                q: "Which fiber optic cable type utilizes a thin 9-micron core and laser light for long-distance campus links (up to 40 km)?",
                options: [
                    "Multi-Mode Fiber (MMF)",
                    "Single-Mode Fiber (SMF)",
                    "Cat6A Shielded Twisted Pair",
                    "Thick Coaxial Cable"
                ],
                correct: 1,
                answer: 1,
                explanation: "Single-Mode Fiber (SMF) has a 9-micron core and uses laser light to eliminate modal dispersion over long distances up to 40 km."
            },
            {
                q: "In the MAC address 00:1A:2B:3C:4D:5E, what do the first 24 bits (00:1A:2B) represent?",
                options: [
                    "The IP Subnet Mask",
                    "The Organizationally Unique Identifier (OUI) assigned to the manufacturer",
                    "The NIC product serial number",
                    "The VLAN Identification tag"
                ],
                correct: 1,
                answer: 1,
                explanation: "The first 24 bits (3 bytes) of a MAC address are the OUI (Organizationally Unique Identifier) assigned by IEEE to the hardware manufacturer."
            },
            {
                q: "What occurs when two PCs connected to an Ethernet Hub transmit data simultaneously?",
                options: [
                    "The Hub buffers both frames and forwards them sequentially.",
                    "A data collision occurs, corrupting the signals and triggering a Jam Signal.",
                    "The Hub routes the packets using IP addresses.",
                    "The Hub automatically switches to full-duplex mode."
                ],
                correct: 1,
                answer: 1,
                explanation: "Hubs operate in half-duplex on a single collision domain. Simultaneous transmission causes a collision, corrupting data and sending a Jam signal."
            },
            {
                q: "Which layer of the OSI model does a Cisco 2911 Router operate at, and what header info does it inspect?",
                options: [
                    "Layer 1 — Inspects electrical voltage levels",
                    "Layer 2 — Inspects Source MAC addresses",
                    "Layer 3 — Inspects Destination IP addresses and TTL",
                    "Layer 4 — Inspects TCP Port numbers"
                ],
                correct: 2,
                answer: 2,
                explanation: "Routers operate at Layer 3 (Network Layer). They inspect Destination IP addresses in packet headers and decrement Time-To-Live (TTL) before routing."
            }
        ],
        viva: [
            { q: "What is the primary difference between a Hub and a Switch?", a: "A Hub is a Layer-1 device that broadcasts incoming electrical signals to ALL ports, creating a single shared collision domain. A Switch is a Layer-2 device that reads MAC addresses and forwards frames ONLY to the destination port, providing dedicated bandwidth per port and zero collisions." },
            { q: "Which OSI layer does a Router operate at, and how does it differ from a Switch?", a: "A Router operates at Layer 3 (Network Layer) and routes packets between DIFFERENT networks using IP addresses. A Switch operates at Layer 2 (Data Link Layer) and forwards frames within the SAME local network using MAC addresses." },
            { q: "What is the difference between a Straight-Through cable and a Crossover cable?", a: "A Straight-Through cable uses identical T568B pinouts on both ends and connects DIFFERENT device types (e.g., PC to Switch). A Crossover cable swaps Pins 1&3 and Pins 2&6 and connects SIMILAR device types (e.g., PC to PC, Switch to Switch)." },
            { q: "What is a MAC address, how many bits does it contain, and how is it formatted?", a: "A MAC (Media Access Control) address is a permanent 48-bit (6-byte) physical hardware address burned into a NIC. It is formatted as 12 hexadecimal digits grouped in 6 pairs (e.g., 00:1A:2B:3C:4D:5E), where the first 24 bits identify the manufacturer (OUI)." },
            { q: "What do the Link and Activity LEDs on a switch or NIC port indicate?", a: "A solid Green Link LED indicates physical layer continuity (carrier detect). A flashing Green Activity LED indicates active data frame transmission and reception." },
            { q: "What is the difference between Single-Mode and Multi-Mode Fiber Optic cables?", a: "Single-Mode Fiber has a very thin core (~9 microns), uses laser light, and transmits data over long distances (up to 40 km) with minimal dispersion. Multi-Mode Fiber has a thicker core (~50-62.5 microns), uses LED light, and is designed for shorter distances (up to 550 meters) inside buildings." }
        ],
        assignment: "Construct a real-world enterprise office topology: Internet Gateway Router → Core Switch → 1 Web Server, 1 Printer, and 3 Client PCs. Assign IP addresses in 10.0.0.0/8 range, record all NIC MAC addresses, and verify ICMP reachability across all nodes.",
        references: [
            { title: "Computer Networking: A Top-Down Approach (8th Edition) by Kurose & Ross", link: "https://www.pearson.com" },
            { title: "Data Communications and Networking (5th Edition) by Behrouz A. Forouzan", link: "https://www.mheducation.com" },
            { title: "IEEE 802.3 Ethernet Working Group Standards", link: "https://standards.ieee.org" },
            { title: "RFC 791 - Internet Protocol Specification", link: "https://datatracker.ietf.org/doc/html/rfc791" },
            { title: "Cisco Enterprise Networking & Cabling Guide", link: "https://www.cisco.com" }
        ],
        simType: "pkt_tracer"
    },
    'net_commands': {
        title: "Practical 2: Network Commands & CLI Utilities",
        aim: "To master, execute, and verify core network diagnostic CLI utilities including ipconfig/ifconfig, ping, tracert/traceroute, arp, netstat, nslookup, route, pathping, and Cisco IOS verification commands.",
        intro: {
            summary: "Command-Line Interface (CLI) diagnostic utilities enable network engineers to inspect L3 connectivity, trace packet paths, view active socket connections, and troubleshoot DNS resolutions.",
            importance: "CLI diagnostic tools are essential for diagnosing network latency, packet loss, DNS lookup failures, and address resolution issues.",
            applications: ["ISP Network Diagnostics", "Enterprise Helpdesk Troubleshooting", "Server Socket Audit"],
            outcome: "Students will become proficient in terminal commands `ping`, `tracert`, `ipconfig`, `netstat`, `nslookup`, `arp`, and Cisco IOS verification utilities."
        },
        prerequisites: ["Practical 1: Introduction to Networking Tools, Devices & Media", "Understanding of IP Addresses and Domain Names"],
        outcomes: [
            "Execute ipconfig/ifconfig to inspect IPv4, IPv6, Subnet Mask, Default Gateway, and MAC address.",
            "Execute ping to test L3 reachability, measure RTT latency, and calculate packet loss %.",
            "Execute tracert / traceroute to discover hop-by-hop packet path using TTL decrementing.",
            "Inspect local ARP cache (`arp -a`) mapping IP addresses to physical MAC addresses.",
            "Monitor active TCP/UDP sockets and listening ports using `netstat -an`.",
            "Resolve domain names and test DNS record types using `nslookup`.",
            "Inspect local IPv4/IPv6 routing tables using `route print` / `ip route`.",
            "Execute Cisco IOS verification commands (`show ip interface brief`, `show mac address-table`, `show ip route`)."
        ],
        theory: {
            intro: "Network diagnostic utilities leverage ICMP, ARP, and DNS protocols to inspect connectivity, routing hops, domain resolution, active socket connections, and Cisco IOS device states.",
            cards: [
                {
                    title: "1. Introduction to Network CLI Commands",
                    content: "A computer network is managed, monitored, and troubleshooted using command-line utilities. Network administrators use these commands every day to verify connectivity, diagnose problems, view configurations, and monitor device communications across Windows, Linux, and Cisco IOS environments."
                },
                {
                    title: "2. Learning Objectives",
                    content: "After completing this practical, students will be able to display network configurations, test reachability, trace packet paths, resolve domain names, inspect ARP/routing tables, monitor socket connections, and execute Cisco IOS verification commands."
                },
                {
                    title: "3. What is CLI (Command Line Interface)?",
                    content: "CLI is a text-based environment where users interact with networking devices by typing commands instead of graphical menus. CLI provides faster administration, greater control, remote management via SSH/Telnet, script automation, and detailed diagnostic logs unavailable in GUIs."
                },
                {
                    title: "4. Why Network Commands Are Important",
                    content: "Network commands allow engineers to verify L1-L3 connectivity, identify IP configuration errors, check default gateway reachability, diagnose routing loops or slow links, monitor active TCP/UDP sockets, troubleshoot DNS resolution failures, and inspect physical MAC address mappings."
                },
                {
                    title: "5. Command Prompt, Terminal & Cisco IOS Environments",
                    content: "Commands vary slightly by OS: Windows uses Command Prompt (CMD) & PowerShell; Linux uses Terminal & Bash Shell; Cisco routers and switches use Cisco IOS CLI (User EXEC `Router>`, Privileged EXEC `Router#`, Global Config `Router(config)#`)."
                },
                {
                    title: "6. Network Configuration Commands (ipconfig / ifconfig / ip addr)",
                    content: "Windows `ipconfig` displays IPv4 Address, IPv6 Address, Subnet Mask, and Default Gateway. `ipconfig /all` displays MAC Address, DHCP Status, DNS Servers, and Lease Info. Linux `ifconfig` or `ip addr` displays IP, MAC, MTU, and interface flags."
                },
                {
                    title: "7. Hostname Command",
                    content: "The `hostname` command displays the computer's network identification name (e.g. `LAB-PC-01`). Used for device identification, Active Directory domain joins, and network inventory management."
                },
                {
                    title: "8. Ping Command (ICMP Echo Request & Reply)",
                    content: "Tests L3 reachability using ICMP. Sends ICMP Echo Request (Type 8); destination replies with Echo Reply (Type 0). Measures RTT (Round Trip Time) in ms and packet loss %. Options: `ping -t` (continuous), `ping -n 10` (count), `ping -l 1000` (buffer size)."
                },
                {
                    title: "9. Tracert / Traceroute (Hop-by-Hop Path Discovery)",
                    content: "Reveals packet path from source to destination. Sends packets with sequentially incrementing TTL (TTL=1, 2, 3...). Intermediate routers decrement TTL and return ICMP Time Exceeded (Type 11) when TTL reaches zero, identifying every hop IP."
                },
                {
                    title: "10. ARP Command (Address Resolution Protocol Cache)",
                    content: "`arp -a` displays the local ARP cache table mapping 32-bit IPv4 addresses to 48-bit physical MAC addresses. `arp -d` flushes stale ARP entries. Used for verifying MAC mappings and detecting duplicate IP conflicts."
                },
                {
                    title: "11. Netstat (Network Statistics & Socket Inspection)",
                    content: "Displays active TCP/UDP network connections. `netstat -a` shows all connections & listening ports; `netstat -n` displays numeric IP:Port addresses; `netstat -r` shows routing table; `netstat -e` displays Ethernet packet statistics."
                },
                {
                    title: "12. NSLookup (Domain Name System Query)",
                    content: "`nslookup google.com` queries configured DNS server to resolve domain names to IP addresses. Displays Domain Name, IP Address, and DNS Server. Supports querying A, AAAA, MX, and CNAME records (`nslookup -type=mx domain.com`)."
                },
                {
                    title: "13. Route Command (Routing Table Inspection)",
                    content: "`route print` (Windows) or `ip route` (Linux) displays the OS routing table, showing Destination Subnets, Subnet Masks, Gateway IPs, Interface IPs, and Route Metrics."
                },
                {
                    title: "14. PathPing Utility (Windows Packet Loss Diagnostic)",
                    content: "Combines `ping` and `tracert`. Traces path to destination then sends 100 pings to each intermediate router hop over 25 seconds to pinpoint exact link packet loss % and latency bottlenecks."
                },
                {
                    title: "15. Cisco IOS Verification Commands",
                    content: "Essential Cisco IOS status commands: `show ip interface brief` (summary status UP/DOWN & IPs), `show running-config` (active RAM config), `show version` (IOS version & serials), `show interfaces` (detailed L1/L2 stats & CRC errors), `show mac address-table` (switch MAC table), `show ip route` (router routing table), `show arp` (Cisco ARP cache)."
                },
                {
                    title: "16. Common Network Problems & Diagnostic Command Matrix",
                    content: "No Internet → `ping 8.8.8.8` | Wrong IP → `ipconfig /all` | DNS Failure → `nslookup` | Gateway Unreachable → `ping gateway` | Slow Path → `tracert` | Routing Problem → `route print` | MAC Issue → `arp -a` | Open Ports → `netstat -an`."
                },
                {
                    title: "17. Best Practices in CLI Troubleshooting",
                    content: "1. Verify local IP with `ipconfig`, 2. Test local loopback (`ping 127.0.0.1`), 3. Ping local default gateway, 4. Ping external IP (`8.8.8.8`), 5. Test DNS with `nslookup`, 6. Trace path with `tracert`, 7. Record command outputs for documentation."
                },
                {
                    title: "18. Real-World Enterprise Scenario Walkthrough",
                    content: "User reports 'Internet Down'. Engineer sequence: 1. `ipconfig /all` (check IP & Gateway), 2. `ping 192.168.1.1` (test Gateway), 3. `ping 8.8.8.8` (test WAN L3), 4. `nslookup google.com` (test DNS), 5. `tracert 8.8.8.8` (isolate drop hop), 6. `ipconfig /flushdns` & fix DNS server."
                },
                {
                    title: "19. Practical 2 Summary",
                    content: "Students learned essential CLI tools to inspect configurations, test connectivity, trace routing paths, query DNS, view ARP/MAC tables, and run Cisco IOS verification commands. These form the foundation for all subsequent practicals on VLANs, Routing, DHCP, and NAT."
                }
            ],
            formulas: [
                "Packet Loss % = ((Packets Sent - Packets Received) / Packets Sent) * 100",
                "Default Initial TTL = 64 (Linux / macOS), 128 (Windows), 255 (Cisco IOS)",
                "Round Trip Time (RTT) Average = (RTT_min + RTT_max) / 2"
            ],
            standards: [
                "RFC 792 - Internet Control Message Protocol (ICMP Specification)",
                "RFC 826 - An Ethernet Address Resolution Protocol (ARP Specification)",
                "RFC 1034 / 1035 - Domain Names Concepts and Facilities (DNS Specification)"
            ]
        },
        tools: [
            {
                name: "Windows Command Prompt (cmd.exe)",
                layer: "Application Layer CLI",
                ports: "Virtual Terminal TTY",
                usage: "Executing ipconfig, ping, tracert, arp -a, netstat -an, nslookup, route print",
                statusLED: "Active Cursor Prompt (C:\\>",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="10" y="15" width="360" height="90" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2"/><rect x="10" y="15" width="360" height="20" rx="6" fill="#1e293b"/><circle cx="24" cy="25" r="4" fill="#ef4444"/><circle cx="36" cy="25" r="4" fill="#f59e0b"/><circle cx="48" cy="25" r="4" fill="#22c55e"/><text x="180" y="28" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Command Prompt - ipconfig /all</text><text x="25" y="52" fill="#38bdf8" font-size="10" font-family="monospace">C:\\Users\\Student&gt; ipconfig /all</text><text x="25" y="68" fill="#cbd5e1" font-size="9" font-family="monospace">IPv4 Address . . . : 192.168.1.10</text><text x="25" y="82" fill="#cbd5e1" font-size="9" font-family="monospace">Subnet Mask . . . . : 255.255.255.0</text><text x="25" y="96" fill="#cbd5e1" font-size="9" font-family="monospace">Default Gateway . . : 192.168.1.1</text></svg>`
            },
            {
                name: "Linux Bash Terminal",
                layer: "Application Layer Shell",
                ports: "Pseudo-Terminal (pty/pts)",
                usage: "Executing ifconfig, ip addr, ping -c 4, traceroute, arp -n, netstat -tulpn, dig",
                statusLED: "Active Shell Prompt ($)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="10" y="15" width="360" height="90" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="2"/><rect x="10" y="15" width="360" height="20" rx="6" fill="#27272a"/><circle cx="24" cy="25" r="4" fill="#ef4444"/><circle cx="36" cy="25" r="4" fill="#f59e0b"/><circle cx="48" cy="25" r="4" fill="#22c55e"/><text x="180" y="28" fill="#a1a1aa" font-size="9" font-family="monospace" text-anchor="middle">bash - user@vlab-terminal:~</text><text x="25" y="52" fill="#22c55e" font-size="10" font-family="monospace">student@vlab:~$ ping -c 4 8.8.8.8</text><text x="25" y="68" fill="#e4e4e7" font-size="9" font-family="monospace">64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms</text><text x="25" y="82" fill="#e4e4e7" font-size="9" font-family="monospace">64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms</text><text x="25" y="96" fill="#22c55e" font-size="9" font-family="monospace">--- 8.8.8.8 ping statistics --- 0% packet loss</text></svg>`
            },
            {
                name: "Cisco IOS CLI Console Shell",
                layer: "Network OS Management",
                ports: "Console Serial RS-232 / SSH",
                usage: "Executing show ip interface brief, show running-config, show mac address-table, show ip route",
                statusLED: "Privileged EXEC Prompt (#)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="10" y="15" width="360" height="90" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><rect x="10" y="15" width="360" height="20" rx="6" fill="#1e293b"/><text x="180" y="28" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">Cisco IOS Software - 2911 Router Console</text><text x="25" y="50" fill="#f59e0b" font-size="10" font-family="monospace">Router# show ip interface brief</text><text x="25" y="65" fill="#cbd5e1" font-size="8" font-family="monospace">Interface      IP-Address      OK? Method Status   Protocol</text><text x="25" y="78" fill="#22c55e" font-size="8" font-family="monospace">GigabitEthernet0/0 192.168.1.1 YES NVRAM  up       up</text><text x="25" y="91" fill="#22c55e" font-size="8" font-family="monospace">GigabitEthernet0/1 10.0.0.1    YES NVRAM  up       up</text></svg>`
            },
            {
                name: "ICMP Ping & RTT Packet Analyzer",
                layer: "Layer 3 (Network Layer)",
                ports: "ICMP Protocol 1 (Type 8/0)",
                usage: "Measuring round-trip latency, jitter, and reachability between nodes",
                statusLED: "Green (ICMP Echo Reply OK)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="30" y="30" width="70" height="50" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="65" y="60" fill="#1e40af" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">PC1</text><rect x="280" y="30" width="70" height="50" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/><text x="315" y="60" fill="#166534" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">Server</text><path d="M 105 45 L 275 45" stroke="#2563eb" stroke-width="3" stroke-dasharray="4,4"/><polygon points="275,45 265,40 265,50" fill="#2563eb"/><text x="190" y="40" fill="#2563eb" font-size="8" font-family="monospace" text-anchor="middle">Echo Request (Type 8)</text><path d="M 275 65 L 105 65" stroke="#16a34a" stroke-width="3" stroke-dasharray="4,4"/><polygon points="105,65 115,60 115,70" fill="#16a34a"/><text x="190" y="78" fill="#16a34a" font-size="8" font-family="monospace" text-anchor="middle">Echo Reply (Type 0) RTT=2ms</text></svg>`
            },
            {
                name: "Traceroute Hop Path Discovery Engine",
                layer: "Layer 3 (Network Layer)",
                ports: "ICMP Type 11 (Time Exceeded)",
                usage: "Tracing hop-by-hop router paths by incrementing TTL (TTL=1, 2, 3...)",
                statusLED: "Yellow (Hop Discovered)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><circle cx="40" cy="60" r="22" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="40" y="64" fill="#1d4ed8" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">Host</text><circle cx="140" cy="60" r="22" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="140" y="64" fill="#b45309" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Rtr 1</text><circle cx="240" cy="60" r="22" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="240" y="64" fill="#b45309" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Rtr 2</text><circle cx="340" cy="60" r="22" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/><text x="340" y="64" fill="#15803d" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Dest</text><path d="M 62 60 L 118 60" stroke="#cbd5e1" stroke-width="2"/><path d="M 162 60 L 218 60" stroke="#cbd5e1" stroke-width="2"/><path d="M 262 60 L 318 60" stroke="#cbd5e1" stroke-width="2"/><text x="90" y="52" fill="#d97706" font-size="8" font-family="monospace">TTL=1</text><text x="190" y="52" fill="#d97706" font-size="8" font-family="monospace">TTL=2</text><text x="290" y="52" fill="#16a34a" font-size="8" font-family="monospace">TTL=3</text></svg>`
            },
            {
                name: "ARP & MAC Cache Table Inspector",
                layer: "Layer 2 & Layer 3 Bridge",
                ports: "Ethernet Type 0x0806",
                usage: "Inspecting dynamic IP-to-MAC hardware address mappings in RAM",
                statusLED: "Green (Active Binding)",
                image: `<svg viewBox="0 0 380 120" style="width:100%; height:100%;"><rect x="20" y="20" width="340" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><rect x="20" y="20" width="340" height="24" rx="6" fill="#f1f5f9"/><text x="35" y="36" fill="#334155" font-size="10" font-family="monospace" font-weight="bold">Internet Address</text><text x="170" y="36" fill="#334155" font-size="10" font-family="monospace" font-weight="bold">Physical Address (MAC)</text><text x="300" y="36" fill="#334155" font-size="10" font-family="monospace" font-weight="bold">Type</text><text x="35" y="60" fill="#0f172a" font-size="9" font-family="monospace">192.168.1.1</text><text x="170" y="60" fill="#2563eb" font-size="9" font-family="monospace">00-1A-2B-3C-4D-01</text><text x="300" y="60" fill="#16a34a" font-size="9" font-family="monospace">dynamic</text><text x="35" y="80" fill="#0f172a" font-size="9" font-family="monospace">192.168.1.11</text><text x="170" y="80" fill="#2563eb" font-size="9" font-family="monospace">00-1A-2B-3C-4D-02</text><text x="300" y="80" fill="#16a34a" font-size="9" font-family="monospace">dynamic</text></svg>`
            }
        ],
        procedure: [
            "Step 1: Open the CLI terminal window on the virtual workstation.",
            "Step 2: Execute `ipconfig /all` (Windows) or `ip addr` (Linux) to display local IP, Subnet Mask, Default Gateway, and MAC address.",
            "Step 3: Execute `ping 192.168.1.1` to verify connectivity to the local Default Gateway.",
            "Step 4: Execute `ping 8.8.8.8` to test L3 reachability to an external WAN server and observe RTT latency.",
            "Step 5: Execute `tracert google.com` to discover all intermediate router hop IP addresses.",
            "Step 6: Execute `arp -a` to inspect the local ARP table mapping IP addresses to physical MAC addresses.",
            "Step 7: Execute `nslookup google.com` to test DNS domain name resolution.",
            "Step 8: Execute `netstat -an` to inspect active TCP/UDP socket connections and listening ports.",
            "Step 9: Execute `route print` to view the local IPv4/IPv6 operating system routing table.",
            "Step 10: Log into the Cisco 2911 Router CLI and execute `show ip interface brief` and `show ip route` to verify hardware interfaces."
        ],
        troubleshooting: {
            problem: "Ping returns 'Request timed out' for external domain names (e.g. google.com), but pinging external IP 8.8.8.8 succeeds.",
            hints: [
                "Verify if L3 WAN connectivity is working (ping 8.8.8.8 returns replies).",
                "Check whether DNS server IP address is correctly assigned in `ipconfig /all`.",
                "Execute `nslookup google.com` to test domain name resolution."
            ],
            fix: "Execute `ipconfig /flushdns` to clear stale DNS cache and configure primary DNS server IP to 8.8.8.8."
        },
        posttest: [
            {
                q: "Which command displays the computer's IPv4 address, Subnet Mask, Default Gateway, and physical MAC address in Windows?",
                options: [
                    "ipconfig",
                    "ipconfig /all",
                    "netstat -a",
                    "arp -a"
                ],
                correct: 1,
                answer: 1,
                explanation: "`ipconfig /all` displays detailed configuration including Physical Address (MAC), DHCP status, DNS servers, and lease details."
            },
            {
                q: "Which ICMP message types are utilized by the `ping` utility to test Layer-3 reachability?",
                options: [
                    "Type 8 (Echo Request) & Type 0 (Echo Reply)",
                    "Type 3 (Destination Unreachable)",
                    "Type 11 (Time Exceeded)",
                    "Type 5 (Redirect)"
                ],
                correct: 0,
                answer: 0,
                explanation: "Ping sends ICMP Type 8 (Echo Request) and expects destination to reply with ICMP Type 0 (Echo Reply)."
            },
            {
                q: "How does the `tracert` / `traceroute` command discover intermediate router hops along a network path?",
                options: [
                    "By sending ARP broadcasts to all routers",
                    "By sending packets with sequentially incrementing TTL values and catching ICMP Time Exceeded replies",
                    "By querying DNS MX records",
                    "By establishing TCP connections on port 80"
                ],
                correct: 1,
                answer: 1,
                explanation: "Tracert sends packets with incrementing TTL (TTL=1, 2, 3...). Each router decrements TTL, returning ICMP Time Exceeded (Type 11) when TTL reaches zero."
            },
            {
                q: "What command displays the local Address Resolution Protocol (ARP) cache table mapping IP addresses to physical MAC addresses?",
                options: [
                    "netstat -r",
                    "arp -a",
                    "route print",
                    "nslookup -a"
                ],
                correct: 1,
                answer: 1,
                explanation: "`arp -a` displays the current ARP cache entries mapping 32-bit IP addresses to 48-bit physical MAC addresses."
            },
            {
                q: "Which `netstat` command option displays all active TCP/UDP connections and listening ports in numeric format (IP:Port)?",
                options: [
                    "netstat -n",
                    "netstat -an",
                    "netstat -r",
                    "netstat -e"
                ],
                correct: 1,
                answer: 1,
                explanation: "`netstat -an` displays all active sockets (-a) in numeric format (-n) showing local and foreign IP:Port pairs."
            },
            {
                q: "A user cannot open websites by domain name but CAN ping IP 8.8.8.8 successfully. Which CLI command should be executed to test DNS resolution?",
                options: [
                    "arp -a",
                    "nslookup google.com",
                    "route print",
                    "netstat -a"
                ],
                correct: 1,
                answer: 1,
                explanation: "`nslookup` queries DNS servers to test domain-to-IP resolution and verify DNS server responsiveness."
            },
            {
                q: "Which Cisco IOS CLI command provides a concise summary of all router interfaces, assigned IP addresses, and their UP/DOWN status?",
                options: [
                    "show running-config",
                    "show ip interface brief",
                    "show version",
                    "show mac address-table"
                ],
                correct: 1,
                answer: 1,
                explanation: "`show ip interface brief` displays a compact table of all interfaces, IP addresses, OK method, and L1/L2 status."
            },
            {
                q: "What command combines `ping` and `tracert` by sending 100 pings per hop to measure exact packet loss percentage across intermediate routers in Windows?",
                options: [
                    "traceroute",
                    "pathping",
                    "netstat",
                    "ipconfig /renew"
                ],
                correct: 1,
                answer: 1,
                explanation: "`pathping` traces the path to a destination then pings each intermediate router 100 times over 25 seconds to quantify hop packet loss %."
            },
            {
                q: "Which Cisco IOS command displays the Layer-2 switch table mapping learned MAC addresses to specific physical switch ports?",
                options: [
                    "show ip route",
                    "show mac address-table",
                    "show arp",
                    "show interfaces"
                ],
                correct: 1,
                answer: 1,
                explanation: "`show mac address-table` displays the dynamic MAC table mapping learned source MAC addresses to specific switch ports."
            },
            {
                q: "Which command displays the local operating system routing table showing destination subnets, gateway IPs, and metrics?",
                options: [
                    "route print (Windows) / ip route (Linux)",
                    "ipconfig /all",
                    "nslookup",
                    "ping 127.0.0.1"
                ],
                correct: 0,
                answer: 0,
                explanation: "`route print` in Windows or `ip route` in Linux displays the operating system IPv4/IPv6 routing table."
            }
        ],
        viva: [
            { q: "What ICMP message type is sent by ping, and what is the expected response?", a: "Ping sends an ICMP Type 8 (Echo Request) message. The destination host responds with an ICMP Type 0 (Echo Reply) message." },
            { q: "How does traceroute discover intermediate routers along a network path?", a: "Traceroute sends IP packets with sequentially incrementing Time-To-Live (TTL = 1, 2, 3...). Each intermediate router decrements TTL by 1. When TTL reaches 0, the router drops the packet and returns an ICMP Time Exceeded (Type 11) message, revealing its IP." },
            { q: "What is the purpose of the ARP cache and why is it needed?", a: "The ARP cache stores dynamic mappings between 32-bit IPv4 addresses and 48-bit physical MAC addresses. It prevents devices from having to broadcast ARP requests for every single packet transmitted." },
            { q: "What does `netstat -an` display?", a: "It displays all active TCP and UDP socket connections and listening ports in numeric IP:Port format." },
            { q: "What is the difference between `ipconfig` and `ipconfig /all`?", a: "`ipconfig` displays basic IPv4, Subnet Mask, and Gateway info. `ipconfig /all` displays detailed info including Physical MAC address, DHCP lease timestamps, and DNS server IPs." },
            { q: "What Cisco IOS command displays the router's Layer 3 routing table?", a: "`show ip route` displays the active IP routing table showing Connected (C), Static (S), RIP (R), and OSPF (O) routes." }
        ],
        assignment: "Execute `ipconfig /all`, `arp -a`, `netstat -an`, `nslookup google.com`, and `tracert 8.8.8.8` in your workstation CLI terminal. Record the outputs and analyze your network topology.",
        references: [
            { title: "RFC 792 - Internet Control Message Protocol (ICMP Specification)", link: "https://datatracker.ietf.org/doc/html/rfc792" },
            { title: "RFC 826 - An Ethernet Address Resolution Protocol (ARP Specification)", link: "https://datatracker.ietf.org/doc/html/rfc826" },
            { title: "RFC 1035 - Domain Names - Implementation and Specification", link: "https://datatracker.ietf.org/doc/html/rfc1035" },
            { title: "Cisco IOS Command Reference - Verification Commands", link: "https://www.cisco.com" }
        ],
        simType: "cli"
    },
    'topologies': {
        title: "Practical 3: Network Topologies (Bus, Star, Ring, Mesh, Tree & Hybrid)",
        aim: "To understand, construct, analyze, and compare physical and logical network topologies (Bus, Star, Ring, Full/Partial Mesh, Tree, and Hybrid) and evaluate failure scenarios and fault tolerance.",
        intro: {
            summary: "A network topology defines the physical and logical arrangement of computing devices, switches, routers, and transmission links. Choosing the correct topology dictates network performance, cabling cost, fault tolerance, maintenance complexity, and scalability.",
            importance: "Topology choice directly impacts network latency, single points of failure, administrative cost, and traffic collision domains in both enterprise LANs and global ISP backbones.",
            applications: ["Enterprise Office LANs (Star Topology)", "ISP Core Backbones (Mesh Topology)", "Campus Infrastructure (Tree Architecture)", "Industrial Control Loops (Ring Topology)", "Multi-Cloud Enterprises (Hybrid Topology)"],
            outcome: "Students will master physical vs logical topologies, compare 6 major topologies with exact link formulas, construct topologies in the interactive simulator, and conduct failure analysis tests."
        },
        prerequisites: [
            "Practical 1: Introduction to Computer Networking Tools, Devices & Transmission Media",
            "Practical 2: Network Commands & CLI Utilities",
            "Basic understanding of Ethernet switches, routers, MAC addresses, and transmission media"
        ],
        outcomes: [
            "Understand physical vs logical network topologies.",
            "Analyze structure, working principles, advantages, disadvantages, and applications of Bus, Star, Ring, Mesh (Full/Partial), Tree, and Hybrid topologies.",
            "Calculate link requirements: Full Mesh = N(N-1)/2, Star = N, Ring = N, Bus = 1 backbone + N drop lines.",
            "Construct topologies using the interactive topology simulator.",
            "Perform failure analysis (link cut, switch crash, backbone break, ring disconnect) and observe traffic rerouting.",
            "Select optimal network topologies for schools, enterprises, ISPs, and banks."
        ],
        theory: {
            intro: "Network topology is the physical cabling arrangement and logical data path traversal of a computer network. Topologies are categorized into Physical (hardware cables & switches) and Logical (frame forwarding & token passing protocols).",
            cards: [
                {
                    title: "1. Physical vs Logical Topology",
                    content: "• Physical Topology: Represents the actual geometric arrangement of physical cables, patch panels, switches, and routers.\n• Logical Topology: Defines how data frames physically or virtually travel across the medium from source to destination.\nExample: A legacy Ethernet hub network is physically wired as a Star, but logically functions as a shared Bus where frames broadcast to all ports."
                },
                {
                    title: "2. Factors Affecting Topology Selection",
                    content: "1. Node Density & Count: Total workstations and servers requiring interconnections.\n2. Installation & Cable Cost: Medium budget (UTP vs Fiber Optic vs Redundant links).\n3. Fault Tolerance & Reliability: Ability to maintain connectivity during cable or switch failures.\n4. Scalability: Ease of expanding the network without disrupting existing users.\n5. Maintenance Complexity: Overhead required to diagnose and isolate faulty cables."
                },
                {
                    title: "3. Bus Topology (Shared Backbone Cable)",
                    content: "Structure:\nPC1 -----+\n          |\nPC2 -----+========== Backbone Cable (50Ω Terminators) =========+\n          |\nPC3 -----+\n\nWorking Principle: All devices connect to a single central coaxial backbone cable via BNC T-connectors. 50-ohm terminators at both ends absorb signals to prevent reflection.\nAdvantages: Simple design, minimal cable length, low initial installation cost.\nDisadvantages: Single point of failure (backbone break Downs entire network), high collision probability under heavy traffic, difficult fault isolation."
                },
                {
                    title: "4. Star Topology (Central Switch Node)",
                    content: "Structure:\n          PC1\n           |\nPC2 ---- Switch ---- PC3\n           |\n          PC4\n\nWorking Principle: Every end-host has a dedicated point-to-point cable connected to a central Layer-2 switch. The switch inspects destination MAC addresses and forwards frames only to the target port.\nAdvantages: High fault tolerance (individual cable failure only isolates 1 PC), zero collision in full-duplex mode, easy to add/remove nodes, simple maintenance.\nDisadvantages: Central switch failure downs all connected nodes, higher cabling requirement than Bus."
                },
                {
                    title: "5. Ring Topology (Token Passing Loop)",
                    content: "Structure:\nPC1 ----> PC2\n ^         |\n |         v\nPC4 <---- PC3\n\nWorking Principle: Nodes connect in a closed circular loop. A 3-byte Token frame circulates continuously. Only the host holding the token is permitted to transmit data, eliminating packet collisions.\nAdvantages: Deterministic transmission delay, equal network access for all nodes, zero packet collisions.\nDisadvantages: A single cable cut or node crash breaks the token loop (unless Dual Ring FDDI is used), difficult troubleshooting."
                },
                {
                    title: "6. Mesh Topology (Full & Partial Redundancy)",
                    content: "Structure (Full Mesh - 4 Nodes, 6 Links):\nPC1 -------- PC2\n |\\          /|\n | \\        / |\n |  \\      /  |\n |   \\    /   |\n |    \\  /    |\n |     \\/     |\nPC3 -------- PC4\n\nWorking Principle: Full Mesh connects every node directly to every other node with a dedicated link. Partial Mesh interconnects only mission-critical core nodes.\nFull Mesh Link Formula: L = N * (N - 1) / 2\nPorts per Node: P = N - 1\nAdvantages: Ultimate fault tolerance, maximum bandwidth, instant automatic failover rerouting.\nDisadvantages: Exponential cabling cost, extreme port density requirements, complex setup."
                },
                {
                    title: "7. Tree Topology (Hierarchical 3-Tier)",
                    content: "Structure:\n                    Core Switch (Root)\n                     /             \\\n             Distribution Switch   Distribution Switch\n               /           \\         /           \\\n            Access PC1   Access PC2 Access PC3   Access PC4\n\nWorking Principle: Combines Star topologies into a multi-level hierarchy (Core, Distribution, Access tiers).\nAdvantages: Highly scalable, structured management, isolates faults within specific subtrees.\nDisadvantages: Failure of a distribution or core switch affects all dependent access nodes."
                },
                {
                    title: "8. Hybrid Topology (Multi-Topology Integration)",
                    content: "Structure: Combines two or more distinct topologies (e.g., Star-Bus, Star-Ring, Mesh-Tree).\nApplications: Multinational corporate WANs, university campuses, enterprise banking networks.\nAdvantages: Highly flexible, tailored to specific departmental requirements, maximum scalability.\nDisadvantages: Complex design, costly maintenance, requires specialized network administrators."
                }
            ],
            formulas: [
                "Full Mesh Physical Links: L = N * (N - 1) / 2",
                "Full Mesh Ports Required per Device: P = N - 1",
                "Star Topology Cable Links: L = N",
                "Ring Topology Cable Links: L = N",
                "Bus Topology Cable Links: L = 1 Backbone + N Drop Cables",
                "Tree Topology Links: L = (Number of Switches - 1) + N Host Links"
            ],
            standards: [
                "IEEE 802.3 Standard for Ethernet CSMA/CD (Star & Bus Topologies)",
                "IEEE 802.5 Standard for Token Ring Architecture",
                "ANSI X3T9.5 / ISO 9314 Fiber Distributed Data Interface (FDDI Dual Ring)",
                "IEEE 802.1D Spanning Tree Protocol (STP) for Redundant Loop Protection in Mesh/Tree"
            ]
        },
        tools: [
            { name: "50-Ohm BNC Bus Terminator", layer: "Layer 1 Physical", ports: "BNC Male Connector", usage: "Absorbs RF signal reflections at coaxial backbone ends", statusLED: "Passive Resistance 50Ω" },
            { name: "Cisco Catalyst 2960 24-Port L2 Star Switch", layer: "Layer 2 Switching", ports: "24x 10/100 Mbps + 2x GbE Uplinks", usage: "Central node for Star Topology LANs", statusLED: "Green (Link UP / Active)" },
            { name: "Token-Ring Multistation Access Unit (MAU)", layer: "Layer 2 Data Link", ports: "8x Ring Ports + Ring-In/Ring-Out", usage: "Relays token passing loop in Ring Topologies", statusLED: "Relay Active LED" },
            { name: "Cisco ASR 9000 Mesh Core Router Matrix", layer: "Layer 3 Routing", ports: "100 GbE / 400 GbE Dense Linecards", usage: "High-availability ISP Full Mesh backbone router", statusLED: "Redundant Power / Active" },
            { name: "3-Tier Hierarchical Switch Stack", layer: "Layer 2 / Layer 3", ports: "Core, Distribution, Access Stack", usage: "Enterprise Tree Topology distribution tier", statusLED: "Stack Master Green" },
            { name: "Hybrid Enterprise WAN Gateway", layer: "Layer 3 Multi-Protocol", ports: "Fiber, Serial, Ethernet Multi-FX", usage: "Interconnects Star LANs to ISP Mesh WAN", statusLED: "WAN Link Active" }
        ],
        procedure: [
            "Open the Interactive Network Topologies Simulator tab.",
            "Select a topology type from the toolbar: Bus, Star, Ring, Full Mesh, Partial Mesh, Tree, or Hybrid.",
            "Adjust the Node Count slider (N = 4 to 8 nodes) and inspect the automatically calculated link requirements (L = N(N-1)/2 for Mesh, L = N for Star/Ring).",
            "Click 'Simulate Transmission' to observe packet flow from Source (PC1) to Destination (PC3).",
            "Perform Failure Analysis: Click any cable link or central switch to sever the connection.",
            "Observe the impact of the cut link on data packet traversal and record fault tolerance behavior."
        ],
        troubleshooting: {
            problem: "Bus topology drops all packets and shows 100% signal collision.",
            hints: ["Check if 50-ohm BNC cable terminators are missing at either end of the backbone cable."],
            fix: "Attach 50-ohm BNC terminators to both ends of the coaxial backbone cable to prevent signal bounce."
        },
        questions: [
            {
                q: "How many physical transmission links are required to build a Full Mesh network connecting 6 computers?",
                options: [
                    "6 links",
                    "12 links",
                    "15 links",
                    "30 links"
                ],
                correct: 2,
                answer: 2,
                explanation: "Using the Full Mesh link formula L = N(N - 1) / 2: for N = 6, L = 6 * (6 - 1) / 2 = 6 * 5 / 2 = 15 physical links."
            },
            {
                q: "Which network topology suffers from a total network outage if a single central networking device fails?",
                options: [
                    "Full Mesh Topology",
                    "Star Topology",
                    "Bus Topology",
                    "Dual Ring Topology"
                ],
                correct: 1,
                answer: 1,
                explanation: "In a Star Topology, all end-hosts connect to a single central switch or hub. If the central switch fails, all communication between connected nodes collapses."
            },
            {
                q: "What mechanism is used in Ring Topology to prevent packet collisions on the shared transmission loop?",
                options: [
                    "CSMA/CD Backoff Timer",
                    "Token Passing Mechanism",
                    "Spanning Tree Protocol (STP)",
                    "Wavelength Division Multiplexing"
                ],
                correct: 1,
                answer: 1,
                explanation: "Ring networks (such as IEEE 802.5 Token Ring) use a 3-byte Token frame that circulates around the loop. Only the host currently holding the token is allowed to transmit, guaranteeing zero collisions."
            },
            {
                q: "What component must be attached to both ends of a Bus Topology backbone cable to prevent signal reflection?",
                options: [
                    "RJ-45 Keystone Jack",
                    "50-Ohm BNC Cable Terminator",
                    "SFP Transceiver Module",
                    "Fiber Optic Splice Protector"
                ],
                correct: 1,
                answer: 1,
                explanation: "In Bus Topology, 50-ohm BNC terminators are installed at both ends of the coaxial cable to absorb electrical signals and prevent signal bounce/reflection."
            },
            {
                q: "Which hierarchical topology organizes networking devices into Core, Distribution, and Access tiers?",
                options: [
                    "Tree Topology",
                    "Ring Topology",
                    "Bus Topology",
                    "Single Mesh Topology"
                ],
                correct: 0,
                answer: 0,
                explanation: "Tree Topology (also called Hierarchical Topology) organizes switches into a root Core tier, intermediate Distribution tier, and end-host Access tier."
            },
            {
                q: "Which topology provides the maximum fault tolerance and highest redundancy for mission-critical ISP backbones?",
                options: [
                    "Bus Topology",
                    "Star Topology",
                    "Full Mesh Topology",
                    "Simple Ring Topology"
                ],
                correct: 2,
                answer: 2,
                explanation: "Full Mesh Topology provides direct dedicated links between all nodes. If any single cable breaks, traffic instantly reroutes through alternative redundant paths."
            }
        ],
        viva: [
            { q: "What is the key difference between Physical Topology and Logical Topology?", a: "Physical topology is the actual geometric arrangement of physical cables and hardware devices. Logical topology is the path data frames take to travel across the network." },
            { q: "How many network ports does each computer require in a Full Mesh network of N nodes?", a: "Each computer requires P = N - 1 network interface ports." },
            { q: "What happens if one workstation cable breaks in a Star Topology?", a: "Only that specific workstation loses network connectivity. All other workstations connected to the switch continue communicating normally." },
            { q: "What happens if the backbone cable breaks in a Bus Topology?", a: "The entire network fails completely because signal reflection occurs at the break point and the bus becomes un-terminated." },
            { q: "Why do ISPs and Data Centers use Mesh Topology despite its high cost?", a: "Because Mesh Topology provides redundant communication paths. If a fiber cable is cut, traffic automatically fails over to alternate paths without any service downtime." },
            { q: "What is a Hybrid Topology? Give an example.", a: "A Hybrid Topology combines two or more different topologies (e.g. Star-Bus, Star-Ring, Mesh-Tree). An example is a university campus using Star topology in computer labs connected via a Tree structure to a Mesh data center." }
        ],
        assignment: "Calculate the total link count and port requirement for 8 nodes in Full Mesh vs Star topology. Draw the structural diagrams for both and analyze the impact of severing 1 link in each.",
        references: [
            { title: "IEEE 802.3 Ethernet Standards Overview", link: "https://standards.ieee.org" },
            { title: "Cisco Campus Network Architecture & Topology Design Guide", link: "https://www.cisco.com" },
            { title: "RFC 791 - Internet Protocol Specification", link: "https://datatracker.ietf.org/doc/html/rfc791" }
        ],
        simType: "topologies"
    },
    'ip_class': {
    "title": "Practical 4: IPv4 & IPv6 Address Classification",
    "aim": "To study, analyze, and classify IPv4 address classes (A, B, C, D, E), determine Network ID and Host ID boundary divisions, calculate subnet masks, evaluate RFC 1918 private vs public ranges, examine special IP addresses, and master IPv6 128-bit hexadecimal notation and zero-compression rules.",
    "intro": {
        "summary": "Every device connected to a computer network requires a unique address to communicate with other devices. Just as every house has a unique postal address for receiving mail, every computer, smartphone, server, printer, router, and IoT device requires a unique network address called an Internet Protocol (IP) Address. An IP address identifies a device and enables data packets to be delivered to the correct destination across local networks and the global Internet.",
        "importance": "Without IP addressing, communication between devices on local or global networks would be impossible. Understanding IP addressing, subnet masking, and address classification is essential for network engineering, router configuration, firewall policy definition, and transition to modern IPv6 infrastructure.",
        "applications": [
            "Global Internet Routing & ISP Address Allocation",
            "Local Area Network (LAN) Device Addressing & DHCP Pools",
            "Network Address Translation (NAT) & Private RFC 1918 Intranets",
            "Next-Generation IPv6 Deployment for IoT & Mobile Core Networks",
            "Firewall Rules, Access Control Lists (ACLs), and Subnet Security Masking"
        ],
        "outcome": "Students will be able to convert between decimal and binary octets, classify IPv4 addresses into Classes A–E, extract Network ID and Host ID using subnet masks, differentiate public and private IP ranges, identify special addresses (Loopback, APIPA, Broadcast), and compress/expand 128-bit IPv6 hexadecimal addresses."
    },
    "prerequisites": [
        "Basic understanding of computer networks and OSI Layer 3 (Network Layer)",
        "Binary number system (Bits, Bytes, Octets, Powers of 2 up to 2^128)",
        "Concept of source and destination addressing in packet switching"
    ],
    "outcomes": [
        "Understand the core purpose and structure of IP addresses in packet-switched networks.",
        "Differentiate between IPv4 (32-bit) and IPv6 (128-bit) specifications.",
        "Identify the five IPv4 address classes (Class A, B, C, D, E) from first-octet binary prefixes.",
        "Determine Network ID and Host ID boundaries using default and custom subnet masks.",
        "Differentiate public IP addresses from RFC 1918 private address ranges.",
        "Identify special addresses including Loopback (127.0.0.1), APIPA (169.254.x.x), Limited Broadcast (255.255.255.255), and Unspecified (0.0.0.0).",
        "Master IPv6 8-hextet colon-hexadecimal notation and apply zero compression rules.",
        "Diagnose IP configuration errors such as duplicate IPs, subnet mismatches, and invalid gateway settings."
    ],
    "theory": {
        "intro": "Internet Protocol (IP) is the principal communications protocol in the Internet protocol suite for relaying datagrams across network boundaries. Its routing function enables internetworking and essentially establishes the Internet.",
        "cards": [
            {
                "title": "1. What is an IP Address & Why is it Required?",
                "content": "An Internet Protocol (IP) address is a unique numerical identifier assigned to every device on a network. Its primary functions are: Device Identification, Location Identification, and Packet Routing.\n\nAnalogy: Just as sending a physical postal letter requires a Source Postal Address and a Destination Postal Address, every network packet contains a 32-bit Source IP and Destination IP in its Layer 3 header. Without IP addresses, routers cannot forward packets across subnets."
            },
            {
                "title": "2. Structure of IPv4 Address & Binary System",
                "content": "IPv4 uses a 32-bit binary address space divided into 4 octets (8 bits per octet), separated by dots (dotted-decimal format).\n\nExample: 192.168.10.25\nBinary: 11000000.10101000.00001010.00011001\n\nEach octet ranges from 0 to 255 (since 2^8 = 256 possible values per octet). Total IPv4 address space = 2^32 = 4,294,967,296 addresses."
            },
            {
                "title": "3. Network ID vs Host ID",
                "content": "Every IPv4 address contains two logical parts:\n1. Network ID: Identifies the specific network segment (like a street name).\n2. Host ID: Identifies the specific device on that network segment (like a house number).\n\nThe Subnet Mask determines where the Network ID ends and the Host ID begins. Bits set to 1 in the mask represent Network bits; bits set to 0 represent Host bits."
            },
            {
                "title": "4. Classful IPv4 Addressing Scheme (Classes A–E)",
                "content": "Classful addressing divides the 32-bit address space into 5 distinct classes based on the high-order bits of the first octet:\n\n• Class A (1.0.0.0 to 126.255.255.255 | Prefix: 0 | Mask: 255.0.0.0 /8): Used for massive networks. Supports 126 networks and 16,777,214 hosts per network.\n• Class B (128.0.0.0 to 191.255.255.255 | Prefix: 10 | Mask: 255.255.0.0 /16): Used for medium-large networks. Supports 16,384 networks and 65,534 hosts per network.\n• Class C (192.0.0.0 to 223.255.255.255 | Prefix: 110 | Mask: 255.255.255.0 /24): Used for small LANs. Supports 2,097,152 networks and 254 hosts per network.\n• Class D (224.0.0.0 to 239.255.255.255 | Prefix: 1110): Reserved for Multicast group communication (OSPF, EIGRP, IPTV).\n• Class E (240.0.0.0 to 255.255.255.255 | Prefix: 1111): Reserved for Experimental and Research purposes."
            },
            {
                "title": "5. Private IP Addresses (RFC 1918) vs Public IP Addresses",
                "content": "Public IP Addresses: Globally unique addresses assigned by IANA/RIs/ISPs. Routable across the global public Internet.\n\nPrivate IP Addresses (RFC 1918): Reserved non-routable address space for internal LANs (homes, offices, schools). Routers drop private IPs on public links. Requires Network Address Translation (NAT) to access the Internet.\n\nRFC 1918 Private Ranges:\n• Class A: 10.0.0.0 – 10.255.255.255 (10.0.0.0/8)\n• Class B: 172.16.0.0 – 172.31.255.255 (172.16.0.0/12)\n• Class C: 192.168.0.0 – 192.168.255.255 (192.168.0.0/16)"
            },
            {
                "title": "6. Special Reserved IPv4 Addresses",
                "content": "• Loopback Address (127.0.0.0/8): 127.0.0.1 is used by host OS to test internal TCP/IP protocol stack without network card hardware.\n• APIPA (Automatic Private IP Addressing | 169.254.0.0/16): Windows/DHCP fallback address assigned automatically when DHCP server fails.\n• Limited Broadcast (255.255.255.255): Sends data to all hosts on the local subnet.\n• Default Route / Unspecified (0.0.0.0): Represents any network or unknown route.\n• Network Address (Host bits all 0s): Identifies the network itself (e.g. 192.168.1.0/24). Cannot be assigned to a host.\n• Direct Broadcast Address (Host bits all 1s): Used to broadcast to all hosts on a specific subnet (e.g. 192.168.1.255/24). Cannot be assigned to a host."
            },
            {
                "title": "7. IPv6 Structure, Hex Notation & Zero Compression",
                "content": "IPv6 was developed to replace IPv4 due to address exhaustion (4.3B IPv4 vs 3.4×10^38 IPv6 addresses).\n\nIPv6 Structure:\n• 128-bit total length, divided into 8 hextets (16 bits each).\n• Written in Hexadecimal separated by colons (:).\nExample: 2001:0db8:85a3:0000:0000:8a2e:0370:7334\n\nCompression Rules:\n1. Rule 1 (Leading Zero Omission): Omit leading zeros in any hextet (0db8 → db8, 0000 → 0).\n2. Rule 2 (Double Colon Compression): Replace single contiguous sequence of all-zero hextets with '::'. Allowed ONLY ONCE per address to prevent ambiguity!\n\nCompressed IPv6: 2001:db8:85a3::8a2e:370:7334"
            },
            {
                "title": "8. IPv6 Address Types & Comparison Matrix",
                "content": "IPv6 Categories:\n• Global Unicast Address (2000::/3): Globally routable public IPv6 address.\n• Link-Local Address (fe80::/10): Automatically configured on all interfaces for local link communication.\n• Unique Local Address (fc00::/7): Private IPv6 equivalent of RFC 1918.\n• Multicast Address (ff00::/8): Replaces IPv4 broadcast.\n• Loopback Address (::1/128): Equivalent to IPv4 127.0.0.1."
            }
        ],
        "formulas": [
            "Total IPv4 Hosts = 2^(Host Bits)",
            "Usable IPv4 Hosts = 2^(32 - Prefix Length) - 2",
            "Network Address = IP AND Subnet Mask",
            "Broadcast Address = Network Address OR (NOT Subnet Mask)",
            "IPv6 Address Space = 2^128 = 340,282,366,920,938,463,463,374,607,431,768,211,456"
        ],
        "standards": [
            "RFC 791 - Internet Protocol Version 4 Specification",
            "RFC 1918 - Address Allocation for Private Internets",
            "RFC 4291 - IP Version 6 Addressing Architecture",
            "RFC 5952 - Recommendation for IPv6 Address Text Representation"
        ]
    },
    "tools": [
        {
            "name": "32-Bit Binary Octet Inspector",
            "layer": "Layer 3 Tool",
            "ports": "Bit-Weight Matrix",
            "usage": "Live binary bit-flipping and octet summation",
            "statusLED": "Bit Array Active"
        },
        {
            "name": "Subnet Mask Boundary Calculator",
            "layer": "Layer 3 Tool",
            "ports": "CIDR /8 to /30",
            "usage": "Extracts Network ID & Host ID boundaries",
            "statusLED": "Mask Boundary Set"
        },
        {
            "name": "IPv6 Zero Compression Engine",
            "layer": "Layer 3 Utility",
            "ports": "128-Bit Hex Syntax",
            "usage": "Applies leading-zero omission and double-colon compression",
            "statusLED": "Hex Standardized"
        },
        {
            "name": "Packet Delivery & Gateway Router Sim",
            "layer": "Layer 3 Topology",
            "ports": "Switch / Router Hops",
            "usage": "Simulates local vs remote subnet packet delivery",
            "statusLED": "Route Verified"
        }
    ],
    "procedure": [
        "Launch the Interactive IP Classifier & Bit Converter in the Simulation tab.",
        "Use the 32-bit Bit-Flipper to toggle individual binary bits and observe live decimal octet updates.",
        "Adjust the Subnet Mask slider from /8 to /30 to visualize Network bits (Green) vs Host bits (Orange).",
        "Enter test IPv4 addresses into the Class Identifier Game to classify A, B, C, D, E, Private, and Special IPs.",
        "Test IPv6 address expansion and double-colon (::) compression rules in the IPv6 Visualizer.",
        "Execute Packet Delivery Simulation to observe direct L2 delivery vs L3 Gateway Router hops."
    ],
    "troubleshooting": {
        "problem": "PC A cannot communicate with PC B even though both are connected to the same switch.",
        "hints": [
            "Check if both PCs have IP addresses in the same Network ID.",
            "Verify that neither PC is using a Network ID (host bits all 0s) or Broadcast Address (host bits all 1s).",
            "Ensure subnet masks match on both devices."
        ],
        "fix": "Assign IP 192.168.1.10/24 to PC A and 192.168.1.20/24 to PC B."
    },
    "pretest": [
        {
            "q": "How many bits are in an IPv4 address?",
            "options": [
                "16 bits",
                "32 bits",
                "64 bits",
                "128 bits"
            ],
            "correct": 1,
            "explanation": "IPv4 uses a 32-bit binary addressing scheme divided into 4 octets of 8 bits each."
        },
        {
            "q": "What is the default subnet mask for a Class B IPv4 address?",
            "options": [
                "255.0.0.0",
                "255.255.0.0",
                "255.255.255.0",
                "255.255.255.255"
            ],
            "correct": 1,
            "explanation": "Class B uses 16 network bits, giving a default mask of 255.255.0.0 (/16)."
        },
        {
            "q": "Which of the following is an RFC 1918 private IPv4 address?",
            "options": [
                "8.8.8.8",
                "172.20.5.10",
                "200.100.50.1",
                "127.0.0.1"
            ],
            "correct": 1,
            "explanation": "172.20.5.10 falls within the Class B private range (172.16.0.0 to 172.31.255.255)."
        },
        {
            "q": "What is the purpose of the loopback IP address 127.0.0.1?",
            "options": [
                "To assign an IP to the router default gateway",
                "To test local TCP/IP stack without sending packets over physical NIC",
                "To broadcast to all hosts on local LAN",
                "To assign automatic IP when DHCP fails"
            ],
            "correct": 1,
            "explanation": "127.0.0.1 loops traffic back internally inside the operating system to test protocol software."
        },
        {
            "q": "How many bits are in an IPv6 address?",
            "options": [
                "32 bits",
                "64 bits",
                "128 bits",
                "256 bits"
            ],
            "correct": 2,
            "explanation": "IPv6 uses a 128-bit address space represented as 8 hexadecimal blocks of 16 bits each."
        }
    ],
    "posttest": [
        {
            "q": "A host has IP address 192.168.10.50 with mask 255.255.255.0. What is its Network ID?",
            "options": [
                "192.0.0.0",
                "192.168.0.0",
                "192.168.10.0",
                "192.168.10.255"
            ],
            "correct": 2,
            "explanation": "With a /24 mask (255.255.255.0), the first 3 octets form the Network ID: 192.168.10.0."
        },
        {
            "q": "Why are 2 host addresses subtracted when calculating usable hosts per subnet?",
            "options": [
                "One for DHCP and one for DNS",
                "One for Network ID and one for Direct Broadcast Address",
                "One for Loopback and one for Default Gateway",
                "One for MAC address and one for IPv6 bridge"
            ],
            "correct": 1,
            "explanation": "The address with all host bits set to 0 is the Network ID, and all host bits set to 1 is the Broadcast Address. Neither can be assigned to a host."
        },
        {
            "q": "What is the decimal first octet range for Class C IPv4 addresses?",
            "options": [
                "1 – 126",
                "128 – 191",
                "192 – 223",
                "224 – 239"
            ],
            "correct": 2,
            "explanation": "Class C first octet ranges from 192 to 223 (binary prefix 110)."
        },
        {
            "q": "Which special IP address is assigned by APIPA when DHCP fails?",
            "options": [
                "127.0.0.1",
                "169.254.x.x",
                "192.168.1.1",
                "0.0.0.0"
            ],
            "correct": 1,
            "explanation": "APIPA (Automatic Private IP Addressing) uses the 169.254.0.0/16 range when no DHCP server responds."
        },
        {
            "q": "Compress the following IPv6 address correctly: 2001:0db8:0000:0000:0000:0000:1428:57ab",
            "options": [
                "2001:db8::1428:57ab",
                "2001:db8:0:1428:57ab",
                "2001:db8:::1428:57ab",
                "2001:db8:0000::1428:57ab"
            ],
            "correct": 0,
            "explanation": "Leading zero in 0db8 is removed (db8), and the 4 consecutive all-zero hextets are replaced by double colon '::'."
        },
        {
            "q": "Can the double-colon '::' be used multiple times in a single IPv6 address?",
            "options": [
                "Yes, up to 2 times",
                "Yes, as many times as needed",
                "No, allowed ONLY ONCE per IPv6 address",
                "Only in Link-Local addresses"
            ],
            "correct": 2,
            "explanation": "Using '::' more than once creates ambiguity because a parser cannot determine how many zero blocks belong to each '::'."
        },
        {
            "q": "What class of IPv4 address is 225.10.1.5?",
            "options": [
                "Class A",
                "Class B",
                "Class C",
                "Class D (Multicast)"
            ],
            "correct": 3,
            "explanation": "Addresses from 224.0.0.0 to 239.255.255.255 belong to Class D, reserved for Multicasting."
        },
        {
            "q": "What is the maximum number of usable hosts on a Class C default subnet (/24)?",
            "options": [
                "128",
                "254",
                "256",
                "65,534"
            ],
            "correct": 1,
            "explanation": "Class C has 8 host bits. 2^8 - 2 = 256 - 2 = 254 usable host addresses."
        },
        {
            "q": "Which IPv6 address type is equivalent to the IPv4 private RFC 1918 range?",
            "options": [
                "Global Unicast (2000::/3)",
                "Link-Local (fe80::/10)",
                "Unique Local Address (fc00::/7)",
                "Multicast (ff00::/8)"
            ],
            "correct": 2,
            "explanation": "Unique Local Addresses (ULA) starting with fc00::/7 are non-routable private IPv6 addresses."
        },
        {
            "q": "If PC A (192.168.1.10/24) sends a packet to PC B (192.168.2.20/24), where must PC A send the packet first?",
            "options": [
                "Directly to PC B via L2 Switch",
                "To the Default Gateway (Router)",
                "To the Loopback 127.0.0.1 address",
                "To the Limited Broadcast 255.255.255.255"
            ],
            "correct": 1,
            "explanation": "Since PC B is on a different subnet (192.168.2.0/24 != 192.168.1.0/24), PC A must forward the packet to its Default Gateway router."
        }
    ],
    "viva": [
        {
            "q": "What is the difference between Classful and Classless (CIDR) addressing?",
            "a": "Classful addressing assigns fixed default masks (/8, /16, /24) based on strict address classes (A, B, C). Classless Inter-Domain Routing (CIDR) allows variable length subnet masks (VLSM) to prevent IP address wastage."
        },
        {
            "q": "Why can't 192.168.1.0 and 192.168.1.255 be assigned to host computers on a /24 subnet?",
            "a": "192.168.1.0 is the Network Address (identifies the subnet), and 192.168.1.255 is the Direct Broadcast Address (reaches all hosts on the subnet). Assigning either to a host breaks routing."
        },
        {
            "q": "Explain how Network Address Translation (NAT) saves IPv4 address space.",
            "a": "NAT allows multiple devices on a private LAN (using RFC 1918 IPs like 192.168.x.x) to share a single public IP address assigned to the router when accessing the Internet."
        },
        {
            "q": "What is an APIPA address and when is it generated?",
            "a": "APIPA (169.254.0.0/16) is a self-assigned link-local IPv4 address generated automatically by an OS when DHCP server fails to respond."
        },
        {
            "q": "How does IPv6 simplify router header processing compared to IPv4?",
            "a": "IPv6 features a fixed 40-byte header length, removes checksum calculation at each hop, and eliminates broadcast packets (using multicast instead)."
        }
    ],
    "assignment": "1. Convert IP 172.16.50.12 into 32-bit binary and identify its Class, Default Subnet Mask, Network ID, and Private/Public status.\n2. Expand the compressed IPv6 address 'fe80::1' into its full 8-hextet 128-bit colon-hexadecimal notation.\n3. Explain why PC A (10.0.1.5/16) can ping PC B (10.0.50.10/16) without a router, but PC C (10.1.1.5/24) requires a router to reach PC C.",
    "references": [
        {
            "title": "RFC 791 - IPv4 Protocol Specification",
            "link": "https://datatracker.ietf.org/doc/html/rfc791"
        },
        {
            "title": "RFC 1918 - Private IP Addressing Standards",
            "link": "https://datatracker.ietf.org/doc/html/rfc1918"
        },
        {
            "title": "RFC 4291 - IPv6 Addressing Architecture",
            "link": "https://datatracker.ietf.org/doc/html/rfc4291"
        },
        {
            "title": "RFC 5952 - IPv6 Text Representation Rules",
            "link": "https://datatracker.ietf.org/doc/html/rfc5952"
        }
    ],
    "simType": "ip_class"
},
    'lan_cables': {
    "title": "Practical 5: LAN Setup & Cabling (Straight-Through & Crossover)",
    "aim": "To build a Local Area Network (LAN), understand Ethernet physical media standards, crimp RJ-45 connectors using T568A and T568B standards, select correct Straight-Through vs Crossover cables for device combinations, analyze Auto-MDI/MDIX operation, configure IPv4 addresses, test communication using the ping command, and troubleshoot physical layer cabling faults.",
    "intro": {
        "summary": "A Local Area Network (LAN) connects computers and devices within a limited geographical area such as a classroom, laboratory, office building, or home. One of the most important steps in building a LAN is selecting and terminating the correct network cable. Modern Ethernet uses 4 twisted pairs (8 wires) terminated with RJ-45 connectors. Understanding T568A/T568B pinouts, Straight-Through vs Crossover cabling, and Layer 2 Ethernet frame forwarding is foundational for network installation and troubleshooting.",
        "importance": "Incorrect cable wiring causes physical link drops, excessive collision rates, late collisions, and total loss of communication. Although modern switches feature Auto-MDI/MDIX auto-sensing, understanding physical pinouts (Pins 1, 2, 3, 6) is mandatory for network engineers, structured cabling technicians, and Cisco certification exams.",
        "applications": [
            "Structured Building Cabling & Office LAN Deployment",
            "Patch Panel to Layer 2/3 Switch Interconnections",
            "Data Center Server Rack Cabling & High-Density Switches",
            "Direct PC-to-PC Data Migration & Cross-Connect Links",
            "Industrial Ethernet & Power-over-Ethernet (PoE) Wiring"
        ],
        "outcome": "Students will be able to identify LAN components, construct T568A and T568B RJ-45 cable terminations, choose between Straight-Through and Crossover cables, evaluate Link/Activity LED states, execute Ping connectivity tests, and systematically troubleshoot physical layer network faults."
    },
    "prerequisites": [
        "Basic understanding of OSI Model Layer 1 (Physical) and Layer 2 (Data Link)",
        "Concept of MAC addressing and Ethernet network interface cards (NICs)",
        "IPv4 addressing basics (IP address and Subnet Mask)"
    ],
    "outcomes": [
        "Explain the architecture, characteristics, and hardware components of a Local Area Network (LAN).",
        "Differentiate between Cat5e, Cat6, Cat6A Ethernet media standards.",
        "Arrange the 8 color-coded conductors according to T568A and T568B standards.",
        "Differentiate Straight-Through cables (T568B-T568B) from Crossover cables (T568A-T568B).",
        "Identify correct cable selection rules for similar vs dissimilar network devices.",
        "Understand Auto-MDI/MDIX automatic transmit/receive pair sensing.",
        "Trace Layer 2 Ethernet frame flow through a switch using MAC address tables.",
        "Assign IPv4 parameters and verify Layer 3 connectivity using the Ping utility.",
        "Diagnose cabling failures, broken conductors, duplicate IPs, and disabled interface ports."
    ],
    "theory": {
        "intro": "Ethernet (IEEE 802.3) is the dominant local area network technology. It relies on unshielded twisted pair (UTP) copper cabling and RJ-45 modular connectors to transmit electrical signals at rates from 10 Mbps up to 10 Gbps.",
        "cards": [
            {
                "title": "1. What is a Local Area Network (LAN)?",
                "content": "A Local Area Network (LAN) is a high-speed, low-latency computer network spanning a restricted geographical area (labs, offices, homes).\n\nKey Characteristics:\n• Limited Geographical Boundary (up to 100 meters per copper cable segment)\n• High Bandwidth (100 Mbps, 1 Gbps, 10 Gbps)\n• Low Latency (<1 ms) & Low Error Rates\n• Shared Resources (Files, Printers, Internet Gateways, Servers)"
            },
            {
                "title": "2. Essential Components of a LAN",
                "content": "• End Devices: Workstations, Laptops, Servers, Printers (contain Network Interface Cards - NICs).\n• Intermediary Devices: Layer 2 Ethernet Switches (micro-segmentation) and Layer 3 Routers (inter-subnet forwarding).\n• Media: Unshielded Twisted Pair (UTP) Cat5e/Cat6/Cat6A cables.\n• Connectors: 8-pin RJ-45 modular plugs."
            },
            {
                "title": "3. Ethernet Cable Categories & Twisted Pair Physics",
                "content": "Ethernet copper cables contain 4 twisted wire pairs (8 color-coded conductors).\nTwisting wires reduces Electromagnetic Interference (EMI) and Crosstalk (NEXT).\n\nCategories:\n• Cat5e: Up to 1 Gbps (100 MHz bandwidth, 100m max distance)\n• Cat6: Up to 10 Gbps (250 MHz bandwidth, 55m max for 10G, 100m for 1G)\n• Cat6A: Up to 10 Gbps (500 MHz bandwidth, 100m max distance)"
            },
            {
                "title": "4. RJ-45 Connector & Wiring Standards (T568A vs T568B)",
                "content": "An RJ-45 connector has 8 gold-plated pins numbered 1 to 8 from left to right (clip facing down).\n\nT568A Wire Order:\n1: White-Green | 2: Green | 3: White-Orange | 4: Blue | 5: White-Blue | 6: Orange | 7: White-Brown | 8: Brown\n\nT568B Wire Order (Most Popular):\n1: White-Orange | 2: Orange | 3: White-Green | 4: Blue | 5: White-Blue | 6: Green | 7: White-Brown | 8: Brown"
            },
            {
                "title": "5. Straight-Through Cable Specification",
                "content": "A Straight-Through Cable uses the SAME wiring standard on both ends (T568B–T568B or T568A–T568A).\n\nWorking Principle: Pin 1 connects to Pin 1, Pin 2 to Pin 2, etc. Transmit (Tx) pins on an MDI host (PC) connect to Receive (Rx) pins on an MDI-X switch port.\n\nUsed Between Dissimilar Devices:\n• PC / Workstation ↔ Ethernet Switch / Hub\n• Router (MDI) ↔ Ethernet Switch (MDI-X)\n• Switch ↔ Server / Wireless Access Point"
            },
            {
                "title": "6. Crossover Cable Specification",
                "content": "A Crossover Cable uses DIFFERENT wiring standards on each end (T568A on End 1 and T568B on End 2).\n\nWorking Principle: Pins 1 & 2 (Tx pair of T568A) connect to Pins 3 & 6 (Rx pair of T568B), swapping transmit and receive pairs so two MDI devices can communicate directly.\n\nUsed Between Similar Devices:\n• PC ↔ PC (Direct Host Link without switch)\n• Switch ↔ Switch (Uplink without dedicated MDI-X port)\n• Router ↔ Router\n• Hub ↔ Hub"
            },
            {
                "title": "7. Auto-MDI/MDIX Feature",
                "content": "Auto-MDI/MDIX (Automatic Medium Dependent Interface Crossover) is a hardware feature on modern switch and NIC PHY chips.\n\nFunction: The PHY chip automatically detects required transmit and receive pin pairs and electronically swaps them internally if needed.\nResult: Allows modern devices to communicate successfully regardless of whether a Straight-Through or Crossover cable is plugged in!"
            },
            {
                "title": "8. Layer 2 Ethernet Communication & Ping Diagnostics",
                "content": "When PC1 sends data to PC2 on the same LAN:\n1. PC1 encapsulates IP packet inside Ethernet Frame with Source MAC and Destination MAC.\n2. Frame travels across physical UTP cable to Switch port.\n3. Switch learns PC1 MAC address on ingress port and checks internal MAC Table.\n4. Switch forwards frame out exclusively to PC2 egress port.\n5. PC2 receives frame and sends ICMP Echo Reply back.\n\nPing Diagnostics:\n• Reply from 192.168.1.20: Successful L1/L2/L3 connection!\n• Request Timed Out: Physical cable break, firewall blocking, or host powered off.\n• Destination Host Unreachable: Subnet mismatch or missing default gateway route."
            }
        ],
        "formulas": [
            "Ethernet 10/100 Mbps Pins Used = Pins 1, 2 (Tx) & Pins 3, 6 (Rx)",
            "Gigabit 1000BASE-T Pins Used = All 8 Pins (4 Pairs Bidirectional)",
            "Max Copper Segment Length = 100 Meters (90m Solid Horizontal + 10m Stranded Patch)",
            "Crossover Swapped Pins = Pin 1 ↔ Pin 3 and Pin 2 ↔ Pin 6"
        ],
        "standards": [
            "ANSI/TIA-568.2-D - Balanced Twisted-Pair Telecommunications Cabling Standard",
            "IEEE 802.3 - Ethernet Physical Layer Specification",
            "ISO/IEC 11801 - Generic Cabling for Customer Premises"
        ]
    },
    "tools": [
        {
                "name": "32-Bit Binary Octet Inspector",
                "layer": "Layer 3 Tool",
                "ports": "Bit-Weight Matrix",
                "usage": "Live binary bit-flipping and octet summation",
                "statusLED": "Bit Array Active",
                "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"30\" fill=\"#60a5fa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">32-BIT BINARY OCTET INSPECTOR</text>\n  \n  <!-- 4 Octets Box -->\n  <g transform=\"translate(20, 45)\">\n    <!-- Octet 1 -->\n    <rect x=\"0\" y=\"0\" width=\"80\" height=\"40\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\" rx=\"4\"/>\n    <text x=\"40\" y=\"20\" fill=\"#10b981\" font-size=\"12\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">11000000</text>\n    <text x=\"40\" y=\"34\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">(192)</text>\n\n    <!-- Octet 2 -->\n    <rect x=\"90\" y=\"0\" width=\"80\" height=\"40\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\" rx=\"4\"/>\n    <text x=\"130\" y=\"20\" fill=\"#10b981\" font-size=\"12\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">10101000</text>\n    <text x=\"130\" y=\"34\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">(168)</text>\n\n    <!-- Octet 3 -->\n    <rect x=\"180\" y=\"0\" width=\"80\" height=\"40\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\" rx=\"4\"/>\n    <text x=\"220\" y=\"20\" fill=\"#10b981\" font-size=\"12\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">00001010</text>\n    <text x=\"220\" y=\"34\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">(10)</text>\n\n    <!-- Octet 4 -->\n    <rect x=\"270\" y=\"0\" width=\"80\" height=\"40\" fill=\"#1e293b\" stroke=\"#f97316\" stroke-width=\"1.5\" rx=\"4\"/>\n    <text x=\"310\" y=\"20\" fill=\"#f97316\" font-size=\"12\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">00011001</text>\n    <text x=\"310\" y=\"34\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">(25)</text>\n  </g>\n\n  <!-- Bit Weights Bar -->\n  <rect x=\"50\" y=\"105\" width=\"300\" height=\"24\" rx=\"6\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1\"/>\n  <text x=\"200\" y=\"121\" fill=\"#38bdf8\" font-size=\"10\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">128  64  32  16  8  4  2  1 = 255 MAX</text>\n</svg>"
        },
        {
                "name": "Subnet Mask Boundary Calculator",
                "layer": "Layer 3 Tool",
                "ports": "CIDR /8 to /30",
                "usage": "Extracts Network ID & Host ID boundaries",
                "statusLED": "Mask Boundary Set",
                "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"30\" fill=\"#38bdf8\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">SUBNET MASK BOUNDARY DIVISION (/24)</text>\n\n  <!-- Network vs Host Bar -->\n  <rect x=\"30\" y=\"45\" width=\"250\" height=\"35\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#10b981\" stroke-width=\"2\" rx=\"4\"/>\n  <text x=\"155\" y=\"66\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">NETWORK BITS (24 BITS)</text>\n\n  <rect x=\"285\" y=\"45\" width=\"85\" height=\"35\" fill=\"rgba(249,115,22,0.2)\" stroke=\"#f97316\" stroke-width=\"2\" rx=\"4\"/>\n  <text x=\"327\" y=\"66\" fill=\"#f97316\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">HOST BITS (8 BITS)</text>\n\n  <!-- Stats Grid -->\n  <rect x=\"30\" y=\"95\" width=\"165\" height=\"40\" fill=\"#1e293b\" rx=\"6\"/>\n  <text x=\"112\" y=\"112\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">NET ID: 192.168.10.0</text>\n  <text x=\"112\" y=\"126\" fill=\"#10b981\" font-size=\"9\" font-family=\"sans-serif\" font-weight=\"bold\">MASK: 255.255.255.0</text>\n\n  <rect x=\"205\" y=\"95\" width=\"165\" height=\"40\" fill=\"#1e293b\" rx=\"6\"/>\n  <text x=\"287\" y=\"112\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">BROADCAST: 192.168.10.255</text>\n  <text x=\"287\" y=\"126\" fill=\"#f97316\" font-size=\"9\" font-family=\"sans-serif\" font-weight=\"bold\">HOSTS: 254 USABLE</text>\n</svg>"
        },
        {
                "name": "IPv6 Zero Compression Engine",
                "layer": "Layer 3 Utility",
                "ports": "128-Bit Hex Syntax",
                "usage": "Applies leading-zero omission and double-colon compression",
                "statusLED": "Hex Standardized",
                "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"30\" fill=\"#a78bfa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">IPV6 128-BIT ZERO COMPRESSION (RFC 5952)</text>\n\n  <!-- Uncompressed -->\n  <rect x=\"30\" y=\"45\" width=\"340\" height=\"30\" fill=\"#1e293b\" stroke=\"#64748b\" stroke-width=\"1\" rx=\"6\"/>\n  <text x=\"200\" y=\"64\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\" font-family=\"monospace\">2001:0db8:0000:0000:0000:0000:1428:57ab</text>\n\n  <!-- Compression Arrow -->\n  <path d=\"M 200,80 L 200,92\" stroke=\"#a78bfa\" stroke-width=\"2\" marker-end=\"url(#arrow)\"/>\n\n  <!-- Compressed -->\n  <rect x=\"30\" y=\"98\" width=\"340\" height=\"35\" fill=\"rgba(139,92,246,0.2)\" stroke=\"#8b5cf6\" stroke-width=\"2\" rx=\"6\"/>\n  <text x=\"200\" y=\"120\" fill=\"#a78bfa\" font-size=\"13\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">2001:db8::1428:57ab</text>\n</svg>"
        },
        {
                "name": "Packet Delivery & Gateway Router Sim",
                "layer": "Layer 3 Topology",
                "ports": "Switch / Router Hops",
                "usage": "Simulates local vs remote subnet packet delivery",
                "statusLED": "Route Verified",
                "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  \n  <!-- Local Switch Hops -->\n  <rect x=\"30\" y=\"40\" width=\"150\" height=\"90\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\"/>\n  <text x=\"105\" y=\"60\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">SAME SUBNET</text>\n  <text x=\"105\" y=\"80\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">PC A → L2 Switch → PC B</text>\n  <rect x=\"55\" y=\"95\" width=\"100\" height=\"20\" rx=\"4\" fill=\"rgba(16,185,129,0.2)\"/>\n  <text x=\"105\" y=\"109\" fill=\"#10b981\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">DIRECT L2 ARP</text>\n\n  <!-- Remote Gateway Router Hops -->\n  <rect x=\"220\" y=\"40\" width=\"150\" height=\"90\" rx=\"8\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/>\n  <text x=\"295\" y=\"60\" fill=\"#60a5fa\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">REMOTE SUBNET</text>\n  <text x=\"295\" y=\"80\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">PC A → L3 Router → PC B</text>\n  <rect x=\"245\" y=\"95\" width=\"100\" height=\"20\" rx=\"4\" fill=\"rgba(59,130,246,0.2)\"/>\n  <text x=\"295\" y=\"109\" fill=\"#60a5fa\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">GATEWAY HOPS</text>\n</svg>"
        }
],
        procedure: [
            "Open Switch CLI terminal and enter configuration mode (`enable`, `config t`).",
            "Create VLANs: `vlan 10` (name Sales), `vlan 20` (name HR).",
            "Assign ports: `interface FastEthernet0/1`, `switchport mode access`, `switchport access vlan 10`.",
            "Configure Trunk: `interface FastEthernet0/24`, `switchport mode trunk`."
        ],
        troubleshooting: {
            problem: "PC1 (VLAN 10) on Switch 1 cannot ping PC2 (VLAN 10) on Switch 2.",
            hints: ["Verify if interconnect port between Switch 1 and Switch 2 is set to Trunk mode.", "Check `show interfaces trunk`."],
            fix: "Execute `switchport mode trunk` on inter-switch interface Gi0/1."
        },
        viva: [
            { q: "What is the purpose of IEEE 802.1Q tagging?", a: "It inserts a 4-byte VLAN tag into Ethernet headers so trunks can multiplex traffic for multiple VLANs across a single physical link." },
            { q: "What is a Native VLAN?", a: "An un-tagged VLAN on an 802.1Q trunk port (defaults to VLAN 1)." }
        ],
        assignment: "Configure VLAN 10 (Engineering) and VLAN 20 (Marketing) across 2 Cisco switches. Verify traffic separation.",
        references: [{ title: "IEEE 802.1Q Standard", link: "https://standards.ieee.org" }],
        simType: "cli"
    },
    'subnetting': {
    "title": "Practical 6: Subnetting, VLSM & CIDR",
    "aim": "To study, analyze, and implement Classless Inter-Domain Routing (CIDR), Variable Length Subnet Masking (VLSM), and IPv4 subnetting to efficiently divide IP address space, minimize broadcast traffic, and design departmental networks.",
    "intro": {
        "summary": "In modern computer networks, efficient utilization of IP addresses is essential. Assigning a large unsegmented network to an entire organization wastes IP addresses and increases broadcast traffic. Subnetting divides a large network into smaller logical networks (subnets), enhancing performance, security, and administrative control. Variable Length Subnet Masking (VLSM) and Classless Inter-Domain Routing (CIDR) allow subnet sizes to be customized to exact department requirements without wasting IP space.",
        "importance": "Subnetting and VLSM are fundamental skills for network architecture, Cisco CCNA/CCNP certification, data center engineering, and cloud Virtual Private Cloud (VPC) subnet allocation. Mastering subnet calculation enables engineers to prevent IP address exhaustion, eliminate broadcast storms, and establish secure multi-tier network topologies.",
        "applications": [
            "University Campus Network Segmentation (Labs, Faculty, Administration, Hostels)",
            "Cloud Infrastructure (AWS VPC / Azure VNet Subnet & Security Group Isolation)",
            "Enterprise Corporate LAN Departmental Division (Sales, Finance, Engineering, Executive)",
            "Internet Service Provider (ISP) CIDR Route Summarization & Address Allocation",
            "Data Center Server Rack Subnetting & DMZ Perimeter Security Segments"
        ],
        "outcome": "Students will be able to convert subnet masks to CIDR prefix notation (/24 to /30), calculate Network ID, Broadcast ID, and usable host ranges, design custom VLSM subnet schemes for varying department sizes, and verify routing between subnets using Layer 3 switches and routers."
    },
    "prerequisites": [
        "Practical 4: IPv4 & IPv6 Address Classification",
        "Binary arithmetic & 32-bit dotted decimal representation",
        "Concept of Network ID, Host ID, and Default Subnet Masks"
    ],
    "outcomes": [
        "Understand why network segmentation and subnetting are required in modern networks.",
        "Borrow host bits to create custom subnets using the 2^b formula.",
        "Calculate Network Address, Broadcast Address, First Usable Host, and Last Usable Host for any CIDR prefix.",
        "Determine usable host capacity using the 2^h - 2 formula.",
        "Apply Variable Length Subnet Masking (VLSM) to allocate customized subnet sizes based on department host requirements.",
        "Understand Classless Inter-Domain Routing (CIDR) prefix notation (/8 to /30).",
        "Use the CIDR Prefix Conversion Table for fast network planning.",
        "Identify and fix common subnetting errors such as overlapping subnets or assigning broadcast IPs to hosts.",
        "Verify inter-subnet routing through Layer 3 Gateway Routers."
    ],
    "theory": {
        "intro": "Subnetting is the process of partitioning a single physical network into multiple smaller logical subnetworks. The subnet mask determines where the network portion ends and the host portion begins.",
        "cards": [
            {
                "title": "1. Why Subnetting is Required (University Scenario)",
                "content": "Suppose a university has 1000 computers divided among departments:\n• Computer Lab: 200 PCs\n• Library: 50 PCs\n• Faculty Offices: 80 PCs\n• Administration: 40 PCs\n• Hostels: 300 PCs\n\nIf the university assigns one massive Class B network (65,534 hosts) to everyone:\n1. Thousands of IP addresses remain unused and wasted.\n2. Broadcast messages from one PC reach all 1000 PCs, creating severe network congestion (Broadcast Storms).\n3. Security is compromised because any host can intercept traffic from any other department.\n\nSubnetting divides the large network into small isolated subnets, containing broadcast traffic and improving performance."
            },
            {
                "title": "2. What is a Subnet & How Bit Borrowing Works",
                "content": "A Subnet (Subnetwork) is created by 'borrowing' bits from the Host portion of an IP address and adding them to the Network portion.\n\nOriginal Class C Network: 192.168.1.0/24 (24 Network bits, 8 Host bits)\nMask: 255.255.255.0 | Total Hosts = 2^8 = 256 (254 Usable)\n\nBorrowing 2 Host Bits → New Mask: /26 (26 Network bits, 6 Host bits)\nNew Mask: 255.255.255.192\n• Number of Subnets = 2^b = 2^2 = 4 Subnets\n• Hosts per Subnet = 2^h = 2^6 = 64 (62 Usable Hosts)\n\nCreated Subnets:\n1. 192.168.1.0/26 (Hosts: 192.168.1.1 to 192.168.1.62 | Broadcast: 192.168.1.63)\n2. 192.168.1.64/26 (Hosts: 192.168.1.65 to 192.168.1.126 | Broadcast: 192.168.1.127)\n3. 192.168.1.128/26 (Hosts: 192.168.1.129 to 192.168.1.190 | Broadcast: 192.168.1.191)\n4. 192.168.1.192/26 (Hosts: 192.168.1.193 to 192.168.1.254 | Broadcast: 192.168.1.255)"
            },
            {
                "title": "3. Network Address vs Broadcast Address vs Usable Hosts",
                "content": "Every subnet contains 3 essential address components:\n\n1. Network Address (First IP): All host bits are set to 0. Identifies the subnet itself. Cannot be assigned to any device.\n2. Broadcast Address (Last IP): All host bits are set to 1. Used to broadcast data packets to all devices on the subnet. Cannot be assigned to any device.\n3. Usable Host Range: All IP addresses between the Network Address and Broadcast Address (First Usable = Network + 1, Last Usable = Broadcast - 1).\n\nFormula: Usable Hosts = 2^h - 2 (where h = number of remaining host bits)."
            },
            {
                "title": "4. Variable Length Subnet Masking (VLSM)",
                "content": "Traditional subnetting creates equal-sized subnets. However, different departments require different host counts:\n• Engineering Lab: 120 Hosts → Requires /25 (126 Usable Hosts)\n• Library: 40 Hosts → Requires /26 (62 Usable Hosts)\n• Faculty: 25 Hosts → Requires /27 (30 Usable Hosts)\n• Point-to-Point Router Link: 2 Hosts → Requires /30 (2 Usable Hosts)\n\nVLSM allows engineers to assign different subnet masks to different subnets within the same address space, conserving IP addresses and preventing wastage."
            },
            {
                "title": "5. Classless Inter-Domain Routing (CIDR)",
                "content": "CIDR replaces obsolete Class A, B, C addressing with prefix notation (/N).\n\nCIDR Prefix Table:\n• /24 = 255.255.255.0 (254 Usable Hosts, Block Size 256)\n• /25 = 255.255.255.128 (126 Usable Hosts, Block Size 128)\n• /26 = 255.255.255.192 (62 Usable Hosts, Block Size 64)\n• /27 = 255.255.255.224 (30 Usable Hosts, Block Size 32)\n• /28 = 255.255.255.240 (14 Usable Hosts, Block Size 16)\n• /29 = 255.255.255.248 (6 Usable Hosts, Block Size 8)\n• /30 = 255.255.255.252 (2 Usable Hosts - Router Links, Block Size 4)"
            },
            {
                "title": "6. Common Subnetting Errors & Troubleshooting",
                "content": "1. Assigning Network Address to a Host: E.g., setting PC IP to 192.168.1.0/24 causes driver configuration failure.\n2. Assigning Broadcast Address to a Host: E.g., setting PC IP to 192.168.1.255/24 causes broadcast loop errors.\n3. Subnet Overlap: Overlapping subnet boundaries (e.g. 192.168.1.0/25 and 192.168.1.64/26) corrupts router forwarding tables.\n4. Subnet Mask Mismatch: Setting PC1 to /24 and PC2 to /26 causes PC1 to attempt local L2 delivery while PC2 attempts L3 router routing."
            }
        ],
        "formulas": [
            "Number of Subnets = 2^b (where b = borrowed host bits)",
            "Total IP Addresses per Subnet = 2^h (where h = remaining host bits)",
            "Usable Hosts per Subnet = 2^h - 2",
            "Block Size (Magic Number) = 256 - Subnet Mask Octet"
        ],
        "standards": [
            "RFC 950 - Internet Standard Subnetting Procedure",
            "RFC 1519 - Classless Inter-Domain Routing (CIDR) Specification",
            "RFC 1878 - Variable Length Subnet Table Guidelines"
        ]
    },
    "tools": [
        {
            "name": "Binary Bit Borrowing & Subnet Mask Visualizer",
            "layer": "Layer 3 Tool",
            "ports": "CIDR Prefix /8 to /30",
            "usage": "Visualizes borrowed network bits vs host bits with live block size math",
            "statusLED": "Bits Allocated",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"28\" fill=\"#60a5fa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">BIT BORROWING SUBNET VISUALIZER (/26)</text>\n  \n  <!-- 26 Network Bits (Green) -->\n  <rect x=\"30\" y=\"45\" width=\"260\" height=\"35\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#10b981\" stroke-width=\"2\" rx=\"4\"/>\n  <text x=\"160\" y=\"66\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">26 NETWORK BITS (24 + 2 BORROWED)</text>\n\n  <!-- 6 Host Bits (Orange) -->\n  <rect x=\"295\" y=\"45\" width=\"75\" height=\"35\" fill=\"rgba(249,115,22,0.2)\" stroke=\"#f97316\" stroke-width=\"2\" rx=\"4\"/>\n  <text x=\"332\" y=\"66\" fill=\"#f97316\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">6 HOST BITS</text>\n\n  <!-- Math Summary Box -->\n  <rect x=\"30\" y=\"95\" width=\"165\" height=\"40\" fill=\"#1e293b\" rx=\"6\"/>\n  <text x=\"112\" y=\"112\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">2^2 = 4 CREATED SUBNETS</text>\n  <text x=\"112\" y=\"126\" fill=\"#10b981\" font-size=\"10\" font-family=\"sans-serif\" font-weight=\"bold\">MASK: 255.255.255.192</text>\n\n  <rect x=\"205\" y=\"95\" width=\"165\" height=\"40\" fill=\"#1e293b\" rx=\"6\"/>\n  <text x=\"287\" y=\"112\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">2^6 - 2 = 62 USABLE HOSTS</text>\n  <text x=\"287\" y=\"126\" fill=\"#f97316\" font-size=\"10\" font-family=\"sans-serif\" font-weight=\"bold\">BLOCK SIZE: 64</text>\n</svg>"
        },
        {
            "name": "Step-by-Step Subnet Range Table Generator",
            "layer": "Layer 3 Utility",
            "ports": "IPv4 Subnet Ranges",
            "usage": "Generates complete Network ID, First Host, Last Host & Broadcast tables",
            "statusLED": "Ranges Calculated",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#38bdf8\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">SUBNET RANGE TABLE GENERATOR</text>\n\n  <!-- Table Header -->\n  <rect x=\"20\" y=\"38\" width=\"360\" height=\"22\" fill=\"#1e293b\" rx=\"4\"/>\n  <text x=\"50\" y=\"53\" fill=\"#60a5fa\" font-size=\"9\" font-family=\"monospace\" font-weight=\"bold\">SUBNET #</text>\n  <text x=\"120\" y=\"53\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\" font-weight=\"bold\">NETWORK ID</text>\n  <text x=\"240\" y=\"53\" fill=\"#cbd5e1\" font-size=\"9\" font-family=\"monospace\" font-weight=\"bold\">USABLE HOST RANGE</text>\n  <text x=\"340\" y=\"53\" fill=\"#ef4444\" font-size=\"9\" font-family=\"monospace\" font-weight=\"bold\">BROADCAST</text>\n\n  <!-- Row 1 -->\n  <text x=\"50\" y=\"76\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\">Subnet 1</text>\n  <text x=\"120\" y=\"76\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\">192.168.1.0/26</text>\n  <text x=\"240\" y=\"76\" fill=\"#cbd5e1\" font-size=\"9\" font-family=\"monospace\">.1 → .62</text>\n  <text x=\"340\" y=\"76\" fill=\"#ef4444\" font-size=\"9\" font-family=\"monospace\">.63</text>\n\n  <!-- Row 2 -->\n  <text x=\"50\" y=\"96\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\">Subnet 2</text>\n  <text x=\"120\" y=\"96\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\">192.168.1.64/26</text>\n  <text x=\"240\" y=\"96\" fill=\"#cbd5e1\" font-size=\"9\" font-family=\"monospace\">.65 → .126</text>\n  <text x=\"340\" y=\"96\" fill=\"#ef4444\" font-size=\"9\" font-family=\"monospace\">.127</text>\n\n  <!-- Row 3 -->\n  <text x=\"50\" y=\"116\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\">Subnet 3</text>\n  <text x=\"120\" y=\"116\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\">192.168.1.128/26</text>\n  <text x=\"240\" y=\"116\" fill=\"#cbd5e1\" font-size=\"9\" font-family=\"monospace\">.129 → .190</text>\n  <text x=\"340\" y=\"116\" fill=\"#ef4444\" font-size=\"9\" font-family=\"monospace\">.191</text>\n</svg>"
        },
        {
            "name": "VLSM Variable Length Department Allocator",
            "layer": "Layer 3 Tool",
            "ports": "Department Subnets",
            "usage": "Allocates custom subnet sizes (Lab 120, Library 40, Faculty 25) without IP waste",
            "statusLED": "VLSM Optimized",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#a78bfa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">VLSM DEPARTMENT ALLOCATION</text>\n\n  <!-- Dept Blocks -->\n  <rect x=\"25\" y=\"42\" width=\"165\" height=\"40\" fill=\"rgba(139,92,246,0.2)\" stroke=\"#8b5cf6\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"107\" y=\"58\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">COMPUTER LAB (120 HOSTS)</text>\n  <text x=\"107\" y=\"73\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.0/25 (126 Usable)</text>\n\n  <rect x=\"210\" y=\"42\" width=\"165\" height=\"40\" fill=\"rgba(59,130,246,0.2)\" stroke=\"#3b82f6\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"292\" y=\"58\" fill=\"#60a5fa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">LIBRARY (40 HOSTS)</text>\n  <text x=\"292\" y=\"73\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.128/26 (62 Usable)</text>\n\n  <rect x=\"25\" y=\"95\" width=\"165\" height=\"40\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#10b981\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"107\" y=\"111\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">FACULTY (25 HOSTS)</text>\n  <text x=\"107\" y=\"126\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.192/27 (30 Usable)</text>\n\n  <rect x=\"210\" y=\"95\" width=\"165\" height=\"40\" fill=\"rgba(245,158,11,0.2)\" stroke=\"#f59e0b\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"292\" y=\"111\" fill=\"#fbbf24\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">ROUTER LINK (2 HOSTS)</text>\n  <text x=\"292\" y=\"126\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.224/30 (2 Usable)</text>\n</svg>"
        },
        {
            "name": "Inter-Subnet Gateway Router Simulator",
            "layer": "Layer 3 Topology",
            "ports": "Subnet Interfaces",
            "usage": "Simulates packet routing between Subnet 1, Subnet 2, and Subnet 3 across a Router",
            "statusLED": "Routing Active",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#38bdf8\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">INTER-SUBNET ROUTER FORWARDING</text>\n\n  <!-- Router Center -->\n  <circle cx=\"200\" cy=\"85\" r=\"28\" fill=\"#1e293b\" stroke=\"#0ea5e9\" stroke-width=\"2\"/>\n  <text x=\"200\" y=\"89\" fill=\"#0ea5e9\" font-size=\"11\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">ROUTER</text>\n\n  <!-- Subnet 1 Left -->\n  <rect x=\"25\" y=\"60\" width=\"110\" height=\"50\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\"/>\n  <text x=\"80\" y=\"80\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">SUBNET 1 (/26)</text>\n  <text x=\"80\" y=\"96\" fill=\"#94a3b8\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.0/26</text>\n  <line x1=\"135\" y1=\"85\" x2=\"172\" y2=\"85\" stroke=\"#10b981\" stroke-width=\"2\"/>\n\n  <!-- Subnet 2 Right -->\n  <rect x=\"265\" y=\"60\" width=\"110\" height=\"50\" rx=\"6\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/>\n  <text x=\"320\" y=\"80\" fill=\"#60a5fa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">SUBNET 2 (/26)</text>\n  <text x=\"320\" y=\"96\" fill=\"#94a3b8\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">192.168.1.64/26</text>\n  <line x1=\"228\" y1=\"85\" x2=\"265\" y2=\"85\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n</svg>"
        }
    ],
    "procedure": [
        "Launch the Subnetting, VLSM & CIDR Simulator in the Interactive Simulation tab.",
        "Use Module 1 (Bit Slider) to move the CIDR prefix slider from /24 to /30 and observe borrowed bits, mask, and host capacity math in real time.",
        "Use Module 2 (Subnet Range Calculator) to enter a base IP and target CIDR prefix to generate a complete table of Network IDs, Host Ranges, and Broadcast IDs.",
        "Open Module 3 (VLSM Department Planner) to allocate subnet masks for University Departments (Computer Lab 120, Library 40, Faculty 25, Server 10) and verify zero IP waste.",
        "Use Module 5 (Inter-Subnet Packet Router) to transmit packets from Subnet 1 to Subnet 2 and observe L3 Router forwarding.",
        "Test your knowledge using Module 6 (Subnet Puzzle Challenge) to design subnets for random host requirements."
    ],
    "troubleshooting": {
        "problem": "PC1 (192.168.1.63/26) cannot send or receive IP traffic on the network.",
        "hints": [
            "Calculate the Broadcast Address for 192.168.1.0/26 subnet.",
            "Subnet 192.168.1.0/26 spans from .0 (Network ID) to .63 (Broadcast ID)."
        ],
        "fix": "IP 192.168.1.63 is the reserved Direct Broadcast Address for Subnet 1 and cannot be assigned to a host interface. Reassign PC1 to a valid usable host IP like 192.168.1.10/26."
    },
    "pretest": [
        {
            "q": "What is the primary purpose of subnetting a large IP network?",
            "options": [
                "To convert IPv4 to IPv6",
                "To divide a network into smaller logical networks, reducing broadcast traffic",
                "To assign MAC addresses to network interfaces",
                "To increase Wi-Fi signal speed"
            ],
            "correct": 1,
            "explanation": "Subnetting divides large networks into smaller subnets, reducing broadcast domains and improving address efficiency."
        },
        {
            "q": "What is the total number of usable host IP addresses on a /26 subnet (mask 255.255.255.192)?",
            "options": [
                "254",
                "126",
                "62",
                "30"
            ],
            "correct": 2,
            "explanation": "A /26 subnet has 6 host bits. Total IPs = 2^6 = 64. Usable hosts = 64 - 2 = 62."
        },
        {
            "q": "Why are 2 IP addresses subtracted when calculating usable hosts in any subnet?",
            "options": [
                "One for DHCP and one for DNS",
                "One for Network ID and one for Direct Broadcast Address",
                "One for Loopback and one for Default Gateway",
                "One for Router and one for Switch"
            ],
            "correct": 1,
            "explanation": "The first IP (host bits all 0s) is the Network ID and the last IP (host bits all 1s) is the Broadcast ID. Neither can be assigned to a host."
        },
        {
            "q": "What is the main advantage of Variable Length Subnet Masking (VLSM)?",
            "options": [
                "Eliminates the need for routers",
                "Allows different subnet sizes based on actual host requirements, preventing IP waste",
                "Replaces IP addresses with MAC addresses",
                "Increases max cable distance beyond 100m"
            ],
            "correct": 1,
            "explanation": "VLSM allows customized subnet sizes (e.g. /25, /26, /30) for departments requiring different numbers of hosts."
        },
        {
            "q": "What CIDR prefix mask is standard for a point-to-point router link requiring only 2 usable host IPs?",
            "options": [
                "/24",
                "/27",
                "/29",
                "/30"
            ],
            "correct": 3,
            "explanation": "A /30 prefix provides 4 total IPs (2^2 = 4) and 2 usable host IPs (4 - 2 = 2), perfect for 2-router link connections."
        }
    ],
    "posttest": [
        {
            "q": "If you borrow 3 host bits from a Class C network (/24), what is the new CIDR prefix and subnet mask?",
            "options": [
                "/25 (255.255.255.128)",
                "/26 (255.255.255.192)",
                "/27 (255.255.255.224)",
                "/28 (255.255.255.240)"
            ],
            "correct": 2,
            "explanation": "Adding 3 borrowed bits to 24 gives /27. Mask: 128 + 64 + 32 = 224 (255.255.255.224)."
        },
        {
            "q": "What is the Network ID for the IP address 192.168.1.130/26?",
            "options": [
                "192.168.1.0",
                "192.168.1.64",
                "192.168.1.128",
                "192.168.1.192"
            ],
            "correct": 2,
            "explanation": "With block size 64 (/26), subnets start at .0, .64, .128, .192. 130 falls into the 192.168.1.128/26 subnet."
        },
        {
            "q": "What is the Direct Broadcast Address for the subnet 192.168.1.64/26?",
            "options": [
                "192.168.1.65",
                "192.168.1.126",
                "192.168.1.127",
                "192.168.1.255"
            ],
            "correct": 2,
            "explanation": "The /26 subnet starting at .64 has block size 64. The next subnet starts at .128, so broadcast for .64 is .127 (128 - 1)."
        },
        {
            "q": "What is the usable host range for the subnet 192.168.1.192/27?",
            "options": [
                "192.168.1.193 to 192.168.1.222",
                "192.168.1.192 to 192.168.1.223",
                "192.168.1.193 to 192.168.1.254",
                "192.168.1.192 to 192.168.1.224"
            ],
            "correct": 0,
            "explanation": "A /27 subnet has block size 32 (starts at .192, ends at .223 broadcast). Usable hosts: .193 to .222."
        },
        {
            "q": "A department needs 28 usable host IP addresses. Which CIDR mask should be allocated using VLSM?",
            "options": [
                "/28 (14 usable hosts)",
                "/27 (30 usable hosts)",
                "/26 (62 usable hosts)",
                "/25 (126 usable hosts)"
            ],
            "correct": 1,
            "explanation": "A /27 mask provides 30 usable hosts (2^5 - 2 = 30), which efficiently fits 28 hosts with minimal wastage."
        },
        {
            "q": "How do you calculate the Block Size (Magic Number) of a subnet from its subnet mask octet?",
            "options": [
                "256 - Subnet Mask Octet",
                "Subnet Mask Octet / 2",
                "Host Bits * 32",
                "255 + Subnet Mask Octet"
            ],
            "correct": 0,
            "explanation": "Block Size = 256 - Mask Octet. E.g. For mask 255.255.255.192: 256 - 192 = 64 block size."
        },
        {
            "q": "If PC1 is on subnet 192.168.1.0/26 and PC2 is on 192.168.1.64/26, what device is required for them to communicate?",
            "options": [
                "Layer 2 Switch",
                "Layer 3 Router (Default Gateway)",
                "Ethernet Hub",
                "RJ-45 Patch Panel"
            ],
            "correct": 1,
            "explanation": "Hosts on different IP subnets belong to different Layer 3 broadcast domains and require a Layer 3 Router to forward traffic between them."
        },
        {
            "q": "What error occurs if an administrator assigns 192.168.1.0/24 to a host interface?",
            "options": [
                "Duplicate IP error",
                "Network ID assignment error (host bits all 0s reserved for subnet name)",
                "MAC address loop",
                "DHCP timeout"
            ],
            "correct": 1,
            "explanation": "192.168.1.0 is the Network ID (host bits all 0s) and cannot be assigned to a host."
        },
        {
            "q": "In the CIDR notation 172.16.10.0/20, how many host bits remain for host addressing?",
            "options": [
                "8 bits",
                "12 bits",
                "16 bits",
                "20 bits"
            ],
            "correct": 1,
            "explanation": "Total IPv4 bits = 32. Host bits = 32 - 20 = 12 bits. Total hosts = 2^12 = 4,096 (4,094 usable)."
        },
        {
            "q": "What is the subnet mask for /28 in dotted decimal notation?",
            "options": [
                "255.255.255.224",
                "255.255.255.240",
                "255.255.255.248",
                "255.255.255.252"
            ],
            "correct": 1,
            "explanation": "/28 means 4 host bits borrowed in 4th octet: 128 + 64 + 32 + 16 = 240 (255.255.255.240)."
        }
    ],
    "viva": [
        {
            "q": "Explain the formula used to calculate the number of subnets and usable hosts.",
            "a": "Number of Subnets = 2^b (where b = borrowed host bits). Usable Hosts per Subnet = 2^h - 2 (where h = remaining host bits). Two addresses are subtracted because the first IP is the Network ID and the last IP is the Direct Broadcast Address."
        },
        {
            "q": "What is the difference between FLSM (Fixed Length Subnet Masking) and VLSM (Variable Length Subnet Masking)?",
            "a": "FLSM divides a network into subnets of equal size using a single subnet mask across all subnets, which causes IP address wastage when departments require different host counts. VLSM allows custom subnet masks of varying lengths (/25, /26, /30) tailored to specific department sizes."
        },
        {
            "q": "How does the 'Magic Number' (Block Size) method simplify subnet range calculations?",
            "a": "The Magic Number is calculated as 256 minus the interesting subnet mask octet. For example, for mask 255.255.255.224, 256 - 224 = 32. Subnet Network IDs increment by multiples of 32 (.0, .32, .64, .96, .128, etc.)."
        },
        {
            "q": "Why is a /30 subnet mask specifically recommended for WAN point-to-point router links?",
            "a": "A /30 mask has 2 host bits, yielding 4 total IP addresses (2^2 = 4). Subtracting 2 for Network and Broadcast IDs leaves exactly 2 usable host IPs, perfectly matching the 2 router interfaces on a serial link with zero wasted IPs."
        }
    ],
    "assignment": "1. Calculate all subnets for 192.168.10.0/24 divided into 8 subnets (/27). List Network ID, First Usable, Last Usable, and Broadcast ID for each.\n2. Apply VLSM for a enterprise: Engineering (100 hosts), Sales (50 hosts), HR (20 hosts), Router Link (2 hosts). Document the CIDR mask allocated for each department.\n3. Identify why a host configured with IP 10.0.1.255/23 IS a valid host IP and NOT a broadcast IP.",
    "references": [
        {
            "title": "RFC 950 - Internet Standard Subnetting Procedure",
            "link": "https://datatracker.ietf.org/doc/html/rfc950"
        },
        {
            "title": "RFC 1519 - Classless Inter-Domain Routing (CIDR)",
            "link": "https://datatracker.ietf.org/doc/html/rfc1519"
        },
        {
            "title": "Cisco IP Addressing & Subnetting Guide for CCNA",
            "link": "https://www.cisco.com"
        }
    ],
    "simType": "subnetting"
},
    'vlan_sim': {
    "title": "Practical 7: Virtual LANs (VLAN) & Trunking",
    "aim": "To study, configure, and analyze Virtual Local Area Networks (VLANs), IEEE 802.1Q trunking links, access ports, native VLANs, and Inter-VLAN Routing to logically segment enterprise networks and contain broadcast domains.",
    "intro": {
        "summary": "In traditional Local Area Networks (LANs), all devices connected to the same switch belong to a single physical broadcast domain. As networks grow, excessive broadcast traffic, security vulnerabilities, and management complexity become major obstacles. Virtual Local Area Networks (VLANs) logically divide a single physical switch into multiple independent broadcast domains. Devices can be grouped logically by department (e.g. Accounts, Sales, IT) regardless of their physical location. Communication between different VLANs requires Layer 3 routing (Inter-VLAN Routing).",
        "importance": "VLANs are the foundation of modern campus networks, corporate enterprise infrastructure, data centers, and Cloud Virtual Private Clouds (VPCs). Mastering VLAN configuration, IEEE 802.1Q frame tagging, trunking protocols, and Router-on-a-Stick (ROAS) architecture is essential for network engineers, system administrators, and Cisco CCNA/CCNP candidates.",
        "applications": [
            "University Campus Network Isolation (Students, Faculty, Guest Wi-Fi, Administration)",
            "Enterprise Corporate Departmental Security (Finance, HR, Executive, Engineering)",
            "Hospital Medical Infrastructure (Patient Data, Medical Equipment, Administrative Workstations)",
            "Data Center Server Multi-Tenancy & DMZ Perimeter Isolation",
            "Voice over IP (VoIP) Dedicated Quality of Service (QoS) Voice VLANs"
        ],
        "outcome": "Students will be able to create VLANs on Cisco Catalyst switches, assign Access Ports to specific VLANs, configure 802.1Q Trunk Links between switches, inspect 4-byte 802.1Q VLAN tags in Ethernet frames, configure Router-on-a-Stick subinterfaces, and troubleshoot native VLAN mismatches and trunking failures."
    },
    "prerequisites": [
        "Practical 5: LAN Setup & Ethernet Layer 2 Communication",
        "Practical 6: IPv4 Subnetting & CIDR Notation",
        "Understanding of Ethernet Frame headers and Layer 2 MAC address switching"
    ],
    "outcomes": [
        "Understand how VLANs logically partition a physical switch into multiple isolated broadcast domains.",
        "Configure VLAN IDs (1 to 4094) and descriptive names on Cisco switches.",
        "Differentiate between Access Ports (untagged single-VLAN) and Trunk Ports (multi-VLAN tagged).",
        "Explain IEEE 802.1Q frame tagging structure (TPID 0x8100, Priority, 12-bit VLAN ID).",
        "Understand Native VLAN operation and Untagged frame processing.",
        "Implement Inter-VLAN Routing using Router-on-a-Stick (ROAS) subinterfaces (G0/0.10, G0/0.20).",
        "Use Cisco IOS CLI commands (`vlan`, `switchport mode access`, `switchport mode trunk`, `show vlan brief`).",
        "Troubleshoot common VLAN errors including Native VLAN mismatches and blocked trunk ports."
    ],
    "theory": {
        "intro": "A Virtual LAN (VLAN) is a logical subnetwork that groups together a collection of devices on one or more physical LANs. VLANs provide network segmentation, enhanced security, broadcast control, and flexible host management.",
        "cards": [
            {
                "title": "1. What is a VLAN & Why is it Required?",
                "content": "Without VLANs:\n• All 48 ports on a switch belong to a single physical broadcast domain.\n• Broadcast messages (ARP requests, DHCP discovers) flood to EVERY single connected device, causing severe bandwidth degradation.\n• Devices in Finance can freely sniff or access traffic from Human Resources without authorization.\n\nWith VLANs:\n• A single physical switch is logically carved into multiple isolated virtual switches (VLAN 10 Accounts, VLAN 20 Sales, VLAN 30 IT).\n• Broadcast messages stay strictly contained within their assigned VLAN.\n• Security is enforced because traffic cannot cross between VLANs without passing through an authorized Layer 3 Firewall or Router."
            },
            {
                "title": "2. Broadcast Domain Containment",
                "content": "A Broadcast Domain consists of all devices that receive an Ethernet broadcast frame (Destination MAC: FF:FF:FF:FF:FF:FF).\n\n• Flat Network (No VLANs): 1 Switch with 100 PCs = 1 Large Broadcast Domain (100 PCs hit by every broadcast).\n• VLAN Segmented Network: 1 Switch with 4 VLANs (25 PCs each) = 4 Independent Broadcast Domains.\n\nWhen PC1 in VLAN 10 sends a broadcast, ONLY the 25 PCs in VLAN 10 receive it. The other 75 PCs in VLANs 20, 30, and 40 experience ZERO performance impact."
            },
            {
                "title": "3. Access Ports vs Trunk Ports",
                "content": "• Access Port:\n  - Belongs to exactly ONE VLAN.\n  - Connects to end-user devices (Desktop PCs, Laptops, Printers, IP Phones).\n  - Frames entering or leaving an access port are UNTAGGED (standard Ethernet frames).\n  - Command: `switchport mode access` | `switchport access vlan 10`.\n\n• Trunk Port:\n  - Carries traffic for MULTIPLE VLANs simultaneously across a single physical link.\n  - Connects Switch ↔ Switch, Switch ↔ Router, or Switch ↔ Hypervisor Server.\n  - Frames traveling across a trunk are tagged with IEEE 802.1Q headers to identify their source VLAN.\n  - Command: `switchport mode trunk` | `switchport trunk allowed vlan 10,20,30`."
            },
            {
                "title": "4. IEEE 802.1Q Frame Tagging Specification",
                "content": "When an Ethernet frame travels across a trunk link between switches, how does the receiving switch know which VLAN the frame belongs to?\n\nIEEE 802.1Q inserts a 4-byte (32-bit) VLAN Tag into the standard Ethernet header between the Source MAC field and the EtherType field:\n\n802.1Q Tag Fields:\n1. TPID (Tag Protocol Identifier - 16 bits): Value 0x8100 identifies frame as an 802.1Q tagged frame.\n2. Priority / PCP (3 bits): IEEE 802.1p Quality of Service (QoS) priority (0–7).\n3. DEI (Drop Eligible Indicator - 1 bit): Indicates packets that can be dropped during congestion.\n4. VID (VLAN Identifier - 12 bits): Identifies the exact VLAN number (Supports 2^12 = 4,096 VLANs)."
            },
            {
                "title": "5. Native VLAN Concept & Security",
                "content": "The Native VLAN is a special designated VLAN on an IEEE 802.1Q trunk port that handles UNTAGGED frames.\n\n• By Default: Native VLAN = VLAN 1 on Cisco Catalyst switches.\n• How it Works: If an untagged Ethernet frame enters a trunk port, the switch assumes it belongs to the Native VLAN.\n• Security Risk: Leaving Native VLAN as default VLAN 1 makes the network vulnerable to 'VLAN Hopping' attack exploits.\n• Best Practice: Change the Native VLAN on all trunk links to an unused dummy VLAN (e.g. VLAN 999) and ensure BOTH ends of the trunk match."
            },
            {
                "title": "6. Inter-VLAN Routing & Router-on-a-Stick (ROAS)",
                "content": "Because each VLAN is a separate broadcast domain and IP subnet, hosts in VLAN 10 (192.168.10.0/24) CANNOT communicate with hosts in VLAN 20 (192.168.20.0/24) using Layer 2 switching alone.\n\nInter-VLAN Routing Options:\n1. Router-on-a-Stick (ROAS):\n   - A single physical router interface (G0/0) connects to a switch trunk port.\n   - The physical router interface is logically divided into subinterfaces (G0/0.10, G0/0.20).\n   - Each subinterface is configured with `encapsulation dot1Q <vlan-id>` and serves as the Default Gateway IP for that VLAN.\n\n2. Layer 3 Switch (Multilayer Switching):\n   - Uses Switch Virtual Interfaces (SVIs: `interface vlan 10`, `interface vlan 20`) with IP routing enabled internally for wire-speed forwarding."
            }
        ],
        "formulas": [
            "Valid VLAN ID Range = 1 to 4094 (Standard: 1–1005, Extended: 1006–4094)",
            "802.1Q Tag Overhead = 4 Bytes (32 Bits inserted into Ethernet Frame)",
            "Max VLANs per 12-bit VID Field = 2^12 = 4,096 Total VLANs"
        ],
        "standards": [
            "IEEE 802.1Q - Virtual Bridged Local Area Networks & Tagging Standard",
            "IEEE 802.1p - Traffic Class Expediting & Dynamic Multicast Filtering (QoS)",
            "Cisco ISL - Inter-Switch Link (Legacy Proprietary Cisco Trunking Protocol)"
        ]
    },
    "tools": [
        {
            "name": "Broadcast Domain Containment Visualizer",
            "layer": "Layer 2 Switching",
            "ports": "Switch Ports 1-12",
            "usage": "Compares flat network broadcast flooding vs VLAN isolated broadcast domains",
            "statusLED": "VLAN Isolated",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#60a5fa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">BROADCAST DOMAIN CONTAINMENT VISUALIZER</text>\n\n  <!-- Switch Box -->\n  <rect x=\"30\" y=\"40\" width=\"340\" height=\"95\" rx=\"8\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/>\n  \n  <!-- VLAN 10 Block -->\n  <rect x=\"45\" y=\"55\" width=\"95\" height=\"65\" fill=\"rgba(59,130,246,0.2)\" stroke=\"#3b82f6\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"92\" y=\"75\" fill=\"#60a5fa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">VLAN 10</text>\n  <text x=\"92\" y=\"92\" fill=\"#cbd5e1\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">ACCOUNTS</text>\n  <circle cx=\"70\" cy=\"107\" r=\"5\" fill=\"#3b82f6\"/>\n  <circle cx=\"114\" cy=\"107\" r=\"5\" fill=\"#3b82f6\"/>\n\n  <!-- VLAN 20 Block -->\n  <rect x=\"152\" y=\"55\" width=\"95\" height=\"65\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#10b981\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"199\" y=\"75\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">VLAN 20</text>\n  <text x=\"199\" y=\"92\" fill=\"#cbd5e1\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">SALES</text>\n  <circle cx=\"177\" cy=\"107\" r=\"5\" fill=\"#10b981\"/>\n  <circle cx=\"221\" cy=\"107\" r=\"5\" fill=\"#10b981\"/>\n\n  <!-- VLAN 30 Block -->\n  <rect x=\"260\" y=\"55\" width=\"95\" height=\"65\" fill=\"rgba(168,85,247,0.2)\" stroke=\"#a855f7\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"307\" y=\"75\" fill=\"#c084fc\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">VLAN 30</text>\n  <text x=\"307\" y=\"92\" fill=\"#cbd5e1\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">HUMAN RES</text>\n  <circle cx=\"285\" cy=\"107\" r=\"5\" fill=\"#a855f7\"/>\n  <circle cx=\"329\" cy=\"107\" r=\"5\" fill=\"#a855f7\"/>\n</svg>"
        },
        {
            "name": "IEEE 802.1Q 4-Byte Tag Frame Inspector",
            "layer": "Layer 2 Protocol",
            "ports": "Trunk Interface",
            "usage": "Inspects inserted 4-byte 802.1Q VLAN Tag fields (TPID 0x8100, Priority, VID)",
            "statusLED": "802.1Q Tagged",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#38bdf8\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">IEEE 802.1Q ETHERNET FRAME TAG HEADER</text>\n\n  <!-- Frame Fields -->\n  <g transform=\"translate(20, 45)\">\n    <!-- Dest MAC -->\n    <rect x=\"0\" y=\"0\" width=\"60\" height=\"40\" fill=\"#1e293b\" stroke=\"#64748b\" stroke-width=\"1\" rx=\"4\"/>\n    <text x=\"30\" y=\"20\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">DST MAC</text>\n    <text x=\"30\" y=\"32\" fill=\"#94a3b8\" font-size=\"7\" text-anchor=\"middle\" font-family=\"monospace\">(6 Bytes)</text>\n\n    <!-- Src MAC -->\n    <rect x=\"65\" y=\"0\" width=\"60\" height=\"40\" fill=\"#1e293b\" stroke=\"#64748b\" stroke-width=\"1\" rx=\"4\"/>\n    <text x=\"95\" y=\"20\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\" font-family=\"sans-serif\">SRC MAC</text>\n    <text x=\"95\" y=\"32\" fill=\"#94a3b8\" font-size=\"7\" text-anchor=\"middle\" font-family=\"monospace\">(6 Bytes)</text>\n\n    <!-- 802.1Q Tag (Highlighted) -->\n    <rect x=\"130\" y=\"0\" width=\"110\" height=\"40\" fill=\"rgba(16,185,129,0.25)\" stroke=\"#10b981\" stroke-width=\"2\" rx=\"4\"/>\n    <text x=\"185\" y=\"18\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">802.1Q TAG</text>\n    <text x=\"185\" y=\"32\" fill=\"#10b981\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">(4 Bytes - VID: 10)</text>\n\n    <!-- EtherType -->\n    <rect x=\"245\" y=\"0\" width=\"55\" height=\"40\" fill=\"#1e293b\" stroke=\"#64748b\" stroke-width=\"1\" rx=\"4\"/>\n    <text x=\"272\" y=\"20\" fill=\"#cbd5e1\" font-size=\"8\" text-anchor=\"middle\" font-family=\"sans-serif\">TYPE</text>\n    <text x=\"272\" y=\"32\" fill=\"#94a3b8\" font-size=\"7\" text-anchor=\"middle\" font-family=\"monospace\">0x0800</text>\n\n    <!-- Payload -->\n    <rect x=\"305\" y=\"0\" width=\"55\" height=\"40\" fill=\"#1e293b\" stroke=\"#64748b\" stroke-width=\"1\" rx=\"4\"/>\n    <text x=\"332\" y=\"20\" fill=\"#cbd5e1\" font-size=\"8\" text-anchor=\"middle\" font-family=\"sans-serif\">PAYLOAD</text>\n    <text x=\"332\" y=\"32\" fill=\"#94a3b8\" font-size=\"7\" text-anchor=\"middle\" font-family=\"monospace\">IP Data</text>\n  </g>\n\n  <!-- Tag Breakdown Box -->\n  <rect x=\"50\" y=\"100\" width=\"300\" height=\"38\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1\" rx=\"6\"/>\n  <text x=\"200\" y=\"116\" fill=\"#38bdf8\" font-size=\"9\" text-anchor=\"middle\" font-family=\"monospace\" font-weight=\"bold\">TPID: 0x8100 | PRIO: 0 | DEI: 0 | VLAN ID: 10 (12 Bits)</text>\n  <text x=\"200\" y=\"130\" fill=\"#a78bfa\" font-size=\"8\" text-anchor=\"middle\" font-family=\"sans-serif\">Identifies frame membership across multi-switch trunk links</text>\n</svg>"
        },
        {
            "name": "Router-on-a-Stick (ROAS) Inter-VLAN Engine",
            "layer": "Layer 3 Routing",
            "ports": "Router Subinterfaces",
            "usage": "Routes packets between VLAN 10 and VLAN 20 using G0/0.10 & G0/0.20 subinterfaces",
            "statusLED": "ROAS Active",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#0f172a\" rx=\"10\"/>\n  <text x=\"200\" y=\"25\" fill=\"#a78bfa\" font-size=\"12\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">ROUTER-ON-A-STICK (ROAS) ARCHITECTURE</text>\n\n  <!-- Router Top -->\n  <circle cx=\"200\" cy=\"55\" r=\"22\" fill=\"#1e293b\" stroke=\"#8b5cf6\" stroke-width=\"2\"/>\n  <text x=\"200\" y=\"59\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">ROUTER</text>\n\n  <!-- Trunk Link Line -->\n  <line x1=\"200\" y1=\"77\" x2=\"200\" y2=\"105\" stroke=\"#10b981\" stroke-width=\"4\" stroke-dasharray=\"6 3\"/>\n  <rect x=\"210\" y=\"82\" width=\"110\" height=\"18\" fill=\"#1e293b\" rx=\"4\"/>\n  <text x=\"265\" y=\"94\" fill=\"#10b981\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">TRUNK (802.1Q)</text>\n\n  <!-- Switch Bottom -->\n  <rect x=\"120\" y=\"105\" width=\"160\" height=\"40\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"1.5\" rx=\"6\"/>\n  <text x=\"200\" y=\"125\" fill=\"#60a5fa\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">LAYER 2 SWITCH</text>\n  <text x=\"200\" y=\"138\" fill=\"#94a3b8\" font-size=\"8\" text-anchor=\"middle\" font-family=\"monospace\">G0/0.10 &amp; G0/0.20</text>\n</svg>"
        },
        {
            "name": "Cisco IOS Switch CLI Terminal",
            "layer": "Management CLI",
            "ports": "Console / SSH",
            "usage": "Executes `vlan`, `switchport mode access`, `switchport mode trunk`, `show vlan brief`",
            "statusLED": "CLI Configured",
            "image": "<svg viewBox=\"0 0 400 160\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"400\" height=\"160\" fill=\"#090d16\" rx=\"10\" stroke=\"#334155\" stroke-width=\"2\"/>\n  \n  <!-- Terminal Bar -->\n  <rect x=\"0\" y=\"0\" width=\"400\" height=\"24\" fill=\"#1e293b\" rx=\"10\"/>\n  <circle cx=\"15\" cy=\"12\" r=\"4\" fill=\"#ef4444\"/>\n  <circle cx=\"28\" cy=\"12\" r=\"4\" fill=\"#f59e0b\"/>\n  <circle cx=\"41\" cy=\"12\" r=\"4\" fill=\"#10b981\"/>\n  <text x=\"200\" y=\"16\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"bold\">Cisco Catalyst Switch CLI - Putty Terminal</text>\n\n  <!-- CLI Lines -->\n  <text x=\"20\" y=\"45\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" font-weight=\"bold\">Switch(config)# vlan 10</text>\n  <text x=\"20\" y=\"62\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" font-weight=\"bold\">Switch(config-vlan)# name ACCOUNTS</text>\n  <text x=\"20\" y=\"79\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" font-weight=\"bold\">Switch(config)# interface fa0/1</text>\n  <text x=\"20\" y=\"96\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" font-weight=\"bold\">Switch(config-if)# switchport mode access</text>\n  <text x=\"20\" y=\"113\" fill=\"#10b981\" font-size=\"10\" font-family=\"monospace\" font-weight=\"bold\">Switch(config-if)# switchport access vlan 10</text>\n  <text x=\"20\" y=\"135\" fill=\"#a78bfa\" font-size=\"9\" font-family=\"monospace\">%VLAN 10 created and assigned to port FastEthernet0/1</text>\n</svg>"
        }
    ],
    "procedure": [
        "Launch the Virtual LANs & Trunking Simulator in the Interactive Simulation tab.",
        "Use Module 1 (Broadcast Visualizer) to compare broadcast frame propagation in a Flat Network vs a VLAN-segmented network.",
        "Use Module 2 (Access Port Configurator) to assign Switch Ports Fa0/1 to Fa0/12 to VLAN 10 (Accounts), VLAN 20 (Sales), and VLAN 30 (HR). Observe LED port colors changing.",
        "Open Module 3 (802.1Q Frame Tag Inspector) to inspect the 4-byte 802.1Q Tag header (TPID, Priority, VID) as frames travel over a inter-switch Trunk link.",
        "Use Module 4 (Router-on-a-Stick ROAS) to transmit packets from PC1 (VLAN 10) to PC2 (VLAN 20) and observe subinterface routing on G0/0.10 & G0/0.20.",
        "Open Module 5 (Cisco IOS Terminal) to issue `vlan 10`, `switchport mode access`, `switchport mode trunk`, and `show vlan brief` commands.",
        "Execute Module 6 (VLAN Troubleshooting Lab) to resolve Native VLAN mismatches and missing trunk VLANs."
    ],
    "troubleshooting": {
        "problem": "PC1 in VLAN 10 on Switch A cannot communicate with PC2 in VLAN 10 on Switch B across the interconnecting link.",
        "hints": [
            "Check if the link between Switch A and Switch B is configured as an Access Port or a Trunk Port.",
            "Verify Native VLAN match on both switches (`show interfaces trunk`).",
            "Check if VLAN 10 is listed in the Allowed VLAN list on the trunk."
        ],
        "fix": "Configure the link between Switch A and Switch B as an IEEE 802.1Q Trunk using `switchport mode trunk` and verify VLAN 10 is allowed."
    },
    "pretest": [
        {
            "q": "What is the primary purpose of creating Virtual LANs (VLANs) on an enterprise switch?",
            "options": [
                "To replace IP addressing with MAC addressing",
                "To logically divide a physical switch into multiple isolated broadcast domains",
                "To increase Wi-Fi signal range",
                "To convert copper cables into fiber optics"
            ],
            "correct": 1,
            "explanation": "VLANs divide a physical switch into logical subnets, isolating broadcast traffic and improving security."
        },
        {
            "q": "What type of switch port connects to an end-user device (such as a workstation PC or printer) and belongs to a single VLAN?",
            "options": [
                "Trunk Port",
                "Access Port",
                "Console Port",
                "Serial Port"
            ],
            "correct": 1,
            "explanation": "An Access port carries traffic for a single assigned VLAN to untagged end-host devices."
        },
        {
            "q": "Which international standard protocol is used to tag Ethernet frames on VLAN trunk links?",
            "options": [
                "IEEE 802.11",
                "IEEE 802.1Q",
                "IEEE 802.3u",
                "RFC 1918"
            ],
            "correct": 1,
            "explanation": "IEEE 802.1Q is the industry standard for 4-byte VLAN frame tagging on trunk links."
        },
        {
            "q": "How many bytes does an IEEE 802.1Q tag add to a standard Ethernet frame header?",
            "options": [
                "2 Bytes",
                "4 Bytes",
                "8 Bytes",
                "16 Bytes"
            ],
            "correct": 1,
            "explanation": "An 802.1Q tag is 4 bytes (32 bits) long, containing TPID, Priority, DEI, and 12-bit VLAN ID."
        },
        {
            "q": "Can hosts in VLAN 10 and VLAN 20 on the same switch communicate directly without a Layer 3 router or Layer 3 switch?",
            "options": [
                "Yes, through Layer 2 switching",
                "No, different VLANs belong to separate broadcast domains and require Layer 3 routing",
                "Yes, using a hub",
                "Yes, if they use the same cable color"
            ],
            "correct": 1,
            "explanation": "Each VLAN is an independent Layer 3 broadcast domain. Traffic between VLANs MUST be routed by a Layer 3 device."
        }
    ],
    "posttest": [
        {
            "q": "What is the valid VLAN ID range for standard and extended VLANs on Ethernet switches?",
            "options": [
                "1 to 255",
                "1 to 1024",
                "1 to 4094",
                "1 to 65535"
            ],
            "correct": 2,
            "explanation": "The 12-bit VID field in 802.1Q supports 2^12 = 4,096 total VLAN IDs (valid configurable range 1 to 4094)."
        },
        {
            "q": "What happens to untagged frames received on an IEEE 802.1Q trunk port?",
            "options": [
                "They are immediately dropped",
                "They are assigned to the Native VLAN",
                "They are sent to all VLANs",
                "They are converted to IPv6"
            ],
            "correct": 1,
            "explanation": "Untagged frames entering a trunk port are automatically associated with the Native VLAN (default VLAN 1)."
        },
        {
            "q": "What Cisco IOS command is used to configure a switch interface to carry traffic for multiple VLANs?",
            "options": [
                "switchport mode access",
                "switchport mode trunk",
                "ip routing",
                "vlan 10"
            ],
            "correct": 1,
            "explanation": "`switchport mode trunk` configures an interface as an 802.1Q trunk link."
        },
        {
            "q": "In Router-on-a-Stick (ROAS) architecture, what is configured on the router physical interface?",
            "options": [
                "Multiple physical NICs",
                "Logical subinterfaces with encapsulation dot1Q <vlan-id>",
                "DHCP relay agents",
                "BGP autonomous systems"
            ],
            "correct": 1,
            "explanation": "ROAS divides one physical router interface into subinterfaces (e.g. G0/0.10) running 802.1Q encapsulation."
        },
        {
            "q": "What error message occurs on Cisco Catalyst switches if Switch A has Native VLAN 1 and Switch B has Native VLAN 99?",
            "options": [
                "%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered",
                "IP Address Conflict Error",
                "Duplex Mismatch Warning",
                "Port Security Violation"
            ],
            "correct": 0,
            "explanation": "CDP detects Native VLAN mismatches and displays a `%CDP-4-NATIVE_VLAN_MISMATCH` alert."
        },
        {
            "q": "Which Cisco IOS command displays all configured VLANs and their assigned access ports?",
            "options": [
                "show ip route",
                "show vlan brief",
                "show interfaces trunk",
                "show running-config router"
            ],
            "correct": 1,
            "explanation": "`show vlan brief` lists all active VLAN IDs, names, status, and assigned switch ports."
        },
        {
            "q": "What is the purpose of the `switchport trunk allowed vlan 10,20` command?",
            "options": [
                "It deletes all other VLANs from the switch",
                "It restricts trunk link traffic to only VLAN 10 and VLAN 20, pruning unused VLANs",
                "It creates VLAN 10 and 20 automatically",
                "It sets port speed to 10/20 Mbps"
            ],
            "correct": 1,
            "explanation": "It prunes unneeded VLANs from the trunk, allowing only specified VLANs to pass across the link."
        },
        {
            "q": "What is the default Native VLAN on unconfigured Cisco Catalyst switches?",
            "options": [
                "VLAN 0",
                "VLAN 1",
                "VLAN 10",
                "VLAN 999"
            ],
            "correct": 1,
            "explanation": "VLAN 1 is the default Native VLAN and management VLAN on Cisco switches out of the box."
        },
        {
            "q": "Why should network administrators change the Native VLAN away from default VLAN 1?",
            "options": [
                "VLAN 1 cannot transmit data",
                "To mitigate VLAN Hopping security attacks",
                "VLAN 1 only supports 10 Mbps speed",
                "VLAN 1 disables STP"
            ],
            "correct": 1,
            "explanation": "Changing the Native VLAN away from VLAN 1 prevents double-tagging VLAN hopping exploits."
        },
        {
            "q": "What Layer 2 field in an 802.1Q tag specifies Quality of Service (QoS) priority for Voice over IP (VoIP)?",
            "options": [
                "TPID (Tag Protocol Identifier)",
                "PCP / Priority Bits (3 bits)",
                "DEI Drop Indicator",
                "VLAN ID (12 bits)"
            ],
            "correct": 1,
            "explanation": "The 3 Priority bits (802.1p) provide 8 QoS levels (0–7) for voice and video latency prioritization."
        }
    ],
    "viva": [
        {
            "q": "Explain how an 802.1Q trunk port handles tagged vs untagged Ethernet frames.",
            "a": "Tagged frames entering a trunk port have their 4-byte 802.1Q header inspected for the 12-bit VLAN ID and are forwarded to that specific VLAN. Untagged frames entering a trunk port do not contain an 802.1Q tag and are automatically processed on the Native VLAN."
        },
        {
            "q": "Describe the step-by-step frame path in Router-on-a-Stick (ROAS) when PC1 (VLAN 10) sends a packet to PC2 (VLAN 20).",
            "a": "1. PC1 sends untagged frame to Switch Access Port (VLAN 10).\n2. Switch forwards frame out Trunk link to Router, adding 802.1Q Tag (VLAN ID 10).\n3. Router receives frame on subinterface G0/0.10, strips VLAN 10 tag, inspects IP destination header, routes to subinterface G0/0.20.\n4. Router adds 802.1Q Tag (VLAN ID 20) and sends frame back out physical link to Switch.\n5. Switch receives frame on Trunk port, strips VLAN 20 tag, and delivers untagged frame to PC2 Access Port."
        },
        {
            "q": "What is a Switch Virtual Interface (SVI) on a Layer 3 switch?",
            "a": "An SVI (`interface vlan <id>`) is a logical Layer 3 interface on a Multilayer Switch configured with an IP address that acts as the Default Gateway for devices in that VLAN, enabling wire-speed Inter-VLAN routing inside the switch ASIC without requiring an external router."
        }
    ],
    "assignment": "1. Create VLAN 10 (SALES), VLAN 20 (MARKETING), and VLAN 30 (ENGINEERING) on a Cisco 2960 Switch. Assign ports Fa0/1-4 to VLAN 10, Fa0/5-8 to VLAN 20, and Fa0/9-12 to VLAN 30.\n2. Configure Gi0/1 as an 802.1Q Trunk port allowing only VLANs 10, 20, 30.\n3. Configure Router-on-a-Stick on Router R1 G0/0 interface with subinterfaces G0/0.10, G0/0.20, G0/0.30 and test ping connectivity between PC1 (VLAN 10) and PC2 (VLAN 20).",
    "references": [
        {
            "title": "IEEE 802.1Q Virtual LANs Standard",
            "link": "https://standards.ieee.org"
        },
        {
            "title": "Cisco Catalyst VLAN Configuration Guide",
            "link": "https://www.cisco.com"
        },
        {
            "title": "RFC 3069 - VLAN Aggregation for Efficient IP Address Allocation",
            "link": "https://datatracker.ietf.org/doc/html/rfc3069"
        }
    ],
    "simType": "vlan_sim"
},
    'routing_rip': {
    "title": "Practical 8: Distance Vector Routing Protocol (RIP)",
    "aim": "To understand dynamic routing principles, configure RIP Version 2 across a multi-router network, observe periodic routing updates, inspect hop count metric calculation, verify routing table convergence, and evaluate loop prevention mechanisms (Split Horizon, Poison Reverse, and Triggered Updates).",
    "intro": {
        "summary": "As computer networks grow larger, connecting multiple subnets across different geographical sites requires multiple routers exchanging routing tables dynamically. Routing Information Protocol (RIP) is one of the foundational Distance Vector Dynamic Routing Protocols in computer networking.",
        "importance": "RIP introduces core dynamic routing concepts including hop count distance metrics, periodic 30-second routing updates, convergence timers, and loop prevention mechanisms (Split Horizon, Poison Reverse, and Triggered Updates).",
        "applications": [
            "Small Enterprise Networks & Branch Office Interconnects",
            "Educational Computer Networking Labs",
            "Certification Practice for Cisco CCNA and Network+ Labs",
            "Legacy Network Routing Infrastructure"
        ],
        "outcome": "After completing this practical, students will be able to configure RIP Version 2 on Cisco routers, inspect multi-hop routing tables, analyze periodic update vectors, observe routing convergence during link failures, and troubleshoot routing loops."
    },
    "prerequisites": [
        "Practical 4: IPv4 & IPv6 Address Classification",
        "Practical 6: Subnetting, VLSM & CIDR",
        "Practical 7: Virtual LANs (VLAN) & Trunking"
    ],
    "outcomes": [
        "Explain the operation of Distance Vector Routing and the Routing Information Protocol (RIP).",
        "Configure RIP Version 2 on multi-router topologies using Cisco IOS CLI commands.",
        "Calculate Hop Count metric for paths across multi-router networks.",
        "Differentiate between RIP Version 1 (classful) and RIP Version 2 (classless with VLSM/CIDR).",
        "Analyze RIP timers: Update (30s), Invalid (180s), Hold-down (180s), and Flush (240s).",
        "Identify routing loop scenarios including the Count-to-Infinity problem.",
        "Demonstrate loop prevention techniques: Split Horizon, Poison Reverse, and Triggered Updates.",
        "Verify network convergence and troubleshoot RIP routing tables using Cisco show and debug commands."
    ],
    "theory": {
        "intro": "Every computer network requires a unique address and routing path for data delivery across multiple interconnected networks. When networks grow beyond a single local switch, multiple routers must make intelligent path determination decisions to forward IP packets from source to destination.",
        "sections": [
            {
                "heading": "1. Introduction to Dynamic Routing & RIP",
                "content": "As computer networks scale across departments, buildings, and ISPs, static routing becomes unmanageable. When a network path breaks or a new subnet is added, static routes require manual reconfiguration on every router. Dynamic routing protocols enable routers to communicate with adjacent neighbors, automatically discover networks, build routing tables, and adapt to network topology changes in real time. The Routing Information Protocol (RIP) is the primary Distance Vector routing protocol taught in computer networking to illustrate dynamic route discovery and metric calculation."
            },
            {
                "heading": "2. Learning Objectives",
                "content": "By completing this experiment, students will master:\n• The core principles of Distance Vector routing algorithms.\n• How routers build, maintain, and exchange routing tables periodic updates.\n• Hop Count metric calculation and path selection rules.\n• Configuring RIPv2 with router rip, version 2, network, and no auto-summary.\n• RIP convergence timers (Update: 30s, Invalid: 180s, Hold-down: 180s, Flush: 240s).\n• Detecting and preventing routing loops using Split Horizon and Poison Reverse."
            },
            {
                "heading": "3. What is Routing?",
                "content": "Routing is the Layer 3 process of examining the destination IP address of an incoming packet, consulting a local routing table, and forwarding the packet out the appropriate egress interface toward the next-hop router or destination network. Without routing, packets could never cross the boundary between distinct IP subnets."
            },
            {
                "heading": "4. Why Dynamic Routing Protocols are Required",
                "content": "In an enterprise network with 10 routers and 50 subnets, configuring static routes manually creates huge operational overhead and vulnerabilities. If a fiber link fails, a static router continues sending traffic into a dead end (black hole). Dynamic routing protocols solve this by:\n1. Automatically discovering reachable remote subnets.\n2. Dynamically selecting the shortest optimal path.\n3. Automatically re-routing traffic around link or router failures without human intervention."
            },
            {
                "heading": "5. Static Routing vs Dynamic Routing Comparison",
                "content": "• Configuration: Static routing is manually entered by admins; Dynamic routing is automatically learned via peer protocols.\n• Scalability: Static routing is limited to tiny networks (1-2 routers); Dynamic routing scales to medium and enterprise networks.\n• Topology Changes: Static routing requires manual updates on link failure; Dynamic routing automatically converges and re-routes traffic.\n• Overhead: Static routing consumes zero CPU/RAM/bandwidth; Dynamic routing uses background CPU, memory, and periodic update bandwidth."
            },
            {
                "heading": "6. What is Routing Information Protocol (RIP)?",
                "content": "RIP is a Distance Vector dynamic routing protocol defined in RFC 1058 (RIPv1) and RFC 2453 (RIPv2). It employs Hop Count as its distance metric to determine the best path to any remote destination IP network. RIP is widely studied because its simple Bellman-Ford algorithm clearly demonstrates how neighboring routers exchange distance vectors."
            },
            {
                "heading": "7. Distance Vector Routing Principles",
                "content": "Distance Vector routing is based on two concepts:\n• Distance: How far away a destination network is, measured in metric units (Hop Count for RIP).\n• Vector: Which direction (next-hop router IP address and outgoing interface) packets must be sent.\nEach router periodically sends its entire routing table vector to directly connected immediate neighbors."
            },
            {
                "heading": "8. What is Hop Count Metric?",
                "content": "Hop Count represents the total number of intermediate routers an IP packet must traverse to reach a target network. A directly connected subnet has a Hop Count of 0. Passing through one router increases the Hop Count to 1, two routers to 2, and so forth. RIP always prefers the path with the lowest Hop Count, even if a path with more hops has higher bandwidth."
            },
            {
                "heading": "9. Structure of a RIP Routing Table",
                "content": "A RIP routing table contains essential entries for every learned remote network:\n1. Destination Network IP & Subnet Mask (e.g., 192.168.4.0/24).\n2. Next-Hop IP Address (e.g., 10.0.1.2).\n3. Metric / Hop Count (e.g., 2 hops).\n4. Outgoing Interface (e.g., GigabitEthernet0/1).\n5. Route Administrative Distance (120 for RIP).\n6. Timer / Age (Time elapsed since last periodic update received)."
            },
            {
                "heading": "10. RIP Working Principle & Step-by-Step Operation",
                "content": "Step 1: Router boots and populates its routing table with directly connected networks (Hop Count = 0).\nStep 2: RIP timer triggers periodic update (every 30 seconds).\nStep 3: Router broadcasts/multicasts its complete routing table to all active neighbors.\nStep 4: Neighboring routers receive the update, increment the hop count of learned routes by 1, and add or update cheaper routes in their local tables.\nStep 5: Process repeats until all routers reach convergence (identical global network reachability view)."
            },
            {
                "heading": "11. RIP Version 1 vs RIP Version 2 Comparison",
                "content": "• Subnet Mask Support: RIPv1 is Classful (does not send subnet masks); RIPv2 is Classless (sends subnet masks with routes, fully supporting VLSM & CIDR).\n• Transmission Method: RIPv1 broadcasts to 255.255.255.255; RIPv2 multicasts to 224.0.0.9 (reducing CPU load on non-RIP hosts).\n• Security: RIPv1 lacks authentication; RIPv2 supports MD5 and plaintext authentication.\n• Summarization: RIPv1 forces auto-summarization at classful boundaries; RIPv2 permits disabling auto-summary (no auto-summary)."
            },
            {
                "heading": "12. RIP Timers",
                "content": "RIP relies on 4 critical timers to maintain table freshness:\n1. Update Timer (30 seconds): Frequency at which complete routing table updates are transmitted.\n2. Invalid Timer (180 seconds): Time a router waits before marking an unrefreshed route as Invalid (Hop Count set to 16).\n3. Hold-down Timer (180 seconds): Period during which lower-metric updates for a suspect route are ignored to prevent loops.\n4. Flush Timer (240 seconds): Total time before an invalid route is permanently purged from the routing table."
            },
            {
                "heading": "13. RIP Metric Limit (Max 15 Hops)",
                "content": "RIP imposes a strict maximum metric limit of 15 hops. Any destination network requiring 16 hops is defined as Unreachable (Infinity). This design choice caps the Count-to-Infinity problem but restricts RIP deployment to small networks with a maximum diameter of 15 router hops."
            },
            {
                "heading": "14. Network Routing Convergence",
                "content": "Convergence is the state where all routers in an internetwork have consistent, accurate routing table knowledge of the topology. Fast convergence is desirable so packets are not dropped or misrouted when links fail."
            },
            {
                "heading": "15. Routing Loops & The Count-to-Infinity Problem",
                "content": "A routing loop occurs when routers repeatedly pass a packet back and forth to each other due to outdated routing tables. When a network fails, two neighboring routers might continuously increment the hop count for that dead network (2 → 3 → 4 ... → 16) believing the other router still has a path. This is called the Count-to-Infinity problem."
            },
            {
                "heading": "16. Loop Prevention Mechanisms",
                "content": "RIP implements four key mechanisms to prevent routing loops:\n• Split Horizon: A router never advertises a route back out the same interface from which it learned it.\n• Poison Reverse: When a link breaks, the router advertises that route back to its neighbors with a metric of 16 (Poisoned/Unreachable) to immediately clear stale entries.\n• Triggered Updates: Routers immediately send an update when a topology change occurs rather than waiting 30 seconds for the periodic timer.\n• Hold-down Timers: Prevents routers from accepting bad updates while a network is stabilizing."
            },
            {
                "heading": "17. Cisco IOS Configuration Guide",
                "content": "Configuring RIPv2 on a Cisco router:\nRouter# configure terminal\nRouter(config)# router rip\nRouter(config-router)# version 2\nRouter(config-router)# no auto-summary\nRouter(config-router)# network 192.168.1.0\nRouter(config-router)# network 10.0.0.0\nRouter(config-router)# end"
            },
            {
                "heading": "18. Verification Commands",
                "content": "• show ip route - Displays the active IP routing table (RIP routes marked with 'R').\n• show ip protocols - Displays active routing protocol parameters, timers, and advertised networks.\n• show running-config - Displays router configuration file.\n• debug ip rip - Displays real-time RIP update packets being sent and received."
            },
            {
                "heading": "19. Real-World Applications, Best Practices & Summary",
                "content": "Best Practices:\n1. Always configure version 2 and no auto-summary on Cisco routers.\n2. Use passive-interface on LAN facing ports to prevent sending unnecessary RIP updates to user PCs.\n3. Keep network hop diameter below 15 hops.\nSummary: RIP is an essential Distance Vector protocol that teaches hop count path selection, periodic update mechanics, convergence, and loop prevention."
            }
        ]
    },
    "hardware_inspector": [
        {
            "id": "cisco_2911_rip_router",
            "name": "Cisco 2911 Integrated Services Router",
            "category": "Layer 3 Dynamic Router",
            "description": "Enterprise Layer 3 router capable of running RIPv2, OSPF, and EIGRP routing processes with dual GigabitEthernet and Serial WAN interfaces.",
            "svg": `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="40" width="360" height="160" rx="10" fill="#0f172a" stroke="#3b82f6" stroke-width="3"/>
                <rect x="35" y="55" width="330" height="40" rx="5" fill="#1e293b"/>
                <text x="50" y="80" fill="#38bdf8" font-size="16" font-weight="bold" font-family="monospace">CISCO 2911 ISR ROUTER [RIPv2 ACTIVE]</text>
                <circle cx="340" cy="75" r="7" fill="#10b981"/>
                <g transform="translate(40, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
                    <text x="32" y="25" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Gi0/0</text>
                </g>
                <g transform="translate(120, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
                    <text x="32" y="25" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Gi0/1</text>
                </g>
                <g transform="translate(200, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
                    <text x="32" y="25" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">Serial0/0</text>
                </g>
                <g transform="translate(280, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
                    <text x="32" y="25" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">Serial0/1</text>
                </g>
                <text x="200" y="185" fill="#cbd5e1" font-size="11" text-anchor="middle">Distance Vector RIPv2 - Periodic 30s Updates (Multicast 224.0.0.9)</text>
            </svg>`
        },
        {
            "id": "rip_routing_table_diagram",
            "name": "RIP Dynamic Routing Table Engine",
            "category": "Layer 3 Routing Table Structure",
            "description": "Internal structure of a RIP dynamic routing table displaying Network Subnets, Next-Hop IP addresses, and Hop Count Distance metrics.",
            "svg": `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="360" height="200" rx="8" fill="#0b0f19" stroke="#10b981" stroke-width="2"/>
                <text x="200" y="45" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">RIP DYNAMIC ROUTING TABLE [AD = 120]</text>
                <line x1="30" y1="55" x2="370" y2="55" stroke="#334155" stroke-width="2"/>
                <text x="40" y="75" fill="#38bdf8" font-size="11" font-weight="bold">Type</text>
                <text x="90" y="75" fill="#38bdf8" font-size="11" font-weight="bold">Destination Subnet</text>
                <text x="230" y="75" fill="#38bdf8" font-size="11" font-weight="bold">Next-Hop</text>
                <text x="320" y="75" fill="#38bdf8" font-size="11" font-weight="bold">Hop Metric</text>

                <text x="40" y="105" fill="#f59e0b" font-size="11" font-weight="bold">R</text>
                <text x="90" y="105" fill="#ffffff" font-size="11" font-family="monospace">192.168.4.0/24</text>
                <text x="230" y="105" fill="#ffffff" font-size="11" font-family="monospace">10.0.1.2</text>
                <text x="320" y="105" fill="#10b981" font-size="11" font-weight="bold">[120/2]</text>

                <text x="40" y="135" fill="#f59e0b" font-size="11" font-weight="bold">R</text>
                <text x="90" y="135" fill="#ffffff" font-size="11" font-family="monospace">192.168.3.0/24</text>
                <text x="230" y="135" fill="#ffffff" font-size="11" font-family="monospace">10.0.1.2</text>
                <text x="320" y="135" fill="#10b981" font-size="11" font-weight="bold">[120/1]</text>

                <text x="40" y="165" fill="#3b82f6" font-size="11" font-weight="bold">C</text>
                <text x="90" y="165" fill="#ffffff" font-size="11" font-family="monospace">192.168.1.0/24</text>
                <text x="230" y="165" fill="#ffffff" font-size="11" font-family="monospace">Directly Conn</text>
                <text x="320" y="165" fill="#10b981" font-size="11" font-weight="bold">[0/0]</text>
                <rect x="30" y="185" width="340" height="25" rx="4" fill="#1e293b"/>
                <text x="200" y="202" fill="#94a3b8" font-size="10" text-anchor="middle">R = Learned via RIP (AD 120) | C = Directly Connected Subnet</text>
            </svg>`
        }
    ],
    "evaluations": [
        {
            "id": "rip_pre_1",
            "type": "pre",
            "question": "What distance metric does the Routing Information Protocol (RIP) use to determine the best path?",
            "options": [
                "Interface Bandwidth",
                "Hop Count",
                "Link Delay",
                "Administrative Cost"
            ],
            "answer": "Hop Count",
            "explanation": "RIP uses Hop Count exclusively as its routing metric. The path with the fewest router hops to the destination subnet is selected as optimal."
        },
        {
            "id": "rip_pre_2",
            "type": "pre",
            "question": "What is the maximum valid Hop Count allowed in a RIP network?",
            "options": [
                "10 Hops",
                "15 Hops",
                "16 Hops",
                "255 Hops"
            ],
            "answer": "15 Hops",
            "explanation": "RIP caps maximum reachable distance at 15 hops. A metric of 16 hops defines a network as Unreachable (Infinity)."
        },
        {
            "id": "rip_pre_3",
            "type": "pre",
            "question": "What is the default periodic update timer interval for RIP?",
            "options": [
                "10 Seconds",
                "30 Seconds",
                "60 Seconds",
                "180 Seconds"
            ],
            "answer": "30 Seconds",
            "explanation": "RIP routers broadcast/multicast their entire routing table to directly connected neighbors every 30 seconds."
        },
        {
            "id": "rip_pre_4",
            "type": "pre",
            "question": "What key enhancement makes RIP Version 2 superior to RIP Version 1?",
            "options": [
                "Uses link-state Dijkstra algorithm",
                "Supports classless routing, VLSM, and subnet masks in updates",
                "Allows up to 100 hops",
                "Replaces hop count with bandwidth"
            ],
            "answer": "Supports classless routing, VLSM, and subnet masks in updates",
            "explanation": "RIPv2 is a classless routing protocol that carries subnet masks in update messages, supporting Variable Length Subnet Masking (VLSM) and CIDR."
        },
        {
            "id": "rip_pre_5",
            "type": "pre",
            "question": "Which loop prevention mechanism prevents a router from advertising a route back out the same interface it was learned from?",
            "options": [
                "Hold-down Timer",
                "Split Horizon",
                "Route Poisoning",
                "Poison Reverse"
            ],
            "answer": "Split Horizon",
            "explanation": "Split Horizon dictates that a router never advertises routing information back out the interface through which that information was originally received."
        },
        {
            "id": "rip_post_1",
            "type": "post",
            "question": "What IPv4 multicast address does RIP Version 2 use to transmit periodic routing updates?",
            "options": [
                "224.0.0.5",
                "224.0.0.9",
                "224.0.0.10",
                "255.255.255.255"
            ],
            "answer": "224.0.0.9",
            "explanation": "RIPv2 uses the reserved IPv4 multicast address 224.0.0.9 to send update messages to neighboring RIP routers without broadcasting to all hosts."
        },
        {
            "id": "rip_post_2",
            "type": "post",
            "question": "What is the Administrative Distance (AD) assigned to RIP routes by default in Cisco IOS?",
            "options": [
                "90",
                "110",
                "120",
                "170"
            ],
            "answer": "120",
            "explanation": "In Cisco IOS, RIP has an Administrative Distance of 120 (OSPF is 110, EIGRP is 90, Static is 1, Connected is 0)."
        },
        {
            "id": "rip_post_3",
            "type": "post",
            "question": "How long does a RIP router wait before marking an unrefreshed route as Invalid (Hop Count 16)?",
            "options": [
                "30 Seconds",
                "90 Seconds",
                "180 Seconds",
                "240 Seconds"
            ],
            "answer": "180 Seconds",
            "explanation": "The RIP Invalid Timer defaults to 180 seconds (6 missed 30-second update cycles). After 180s, the route metric is set to 16 (unreachable)."
        },
        {
            "id": "rip_post_4",
            "type": "post",
            "question": "What does 'Poison Reverse' do when a network link fails?",
            "options": [
                "Deletes the router configuration",
                "Immediately advertises the failed route with a metric of 16 (Infinity) back to neighbors",
                "Waits 240 seconds before notifying other routers",
                "Switches automatically to OSPF"
            ],
            "answer": "Immediately advertises the failed route with a metric of 16 (Infinity) back to neighbors",
            "explanation": "Poison Reverse explicitly advertises an unreachable route with a metric of 16 back out the interface, ensuring neighboring routers invalidate their entries immediately."
        },
        {
            "id": "rip_post_5",
            "type": "post",
            "question": "Which Cisco IOS command disables automatic summarization at classful network boundaries in RIPv2?",
            "options": [
                "no auto-summary",
                "disable summary",
                "version 2 classless",
                "no ip route summary"
            ],
            "answer": "no auto-summary",
            "explanation": "The no auto-summary router configuration command prevents RIPv2 from summarizing subnets to their classful boundaries (Class A, B, C) at router interfaces."
        },
        {
            "id": "rip_post_6",
            "type": "post",
            "question": "Why does the 'Count-to-Infinity' problem occur in Distance Vector protocols?",
            "options": [
                "Routers send update packets too fast",
                "Outdated routing table information is repeatedly passed back and forth between neighboring routers during link failure",
                "The router runs out of RAM memory",
                "IP packets lack TTL headers"
            ],
            "answer": "Outdated routing table information is repeatedly passed back and forth between neighboring routers during link failure",
            "explanation": "Count-to-Infinity occurs when slow convergence causes two routers to continuously increment the hop count metric for a failed network until it hits 16."
        },
        {
            "id": "rip_post_7",
            "type": "post",
            "question": "What Cisco command displays real-time RIP routing update transactions being sent and received?",
            "options": [
                "show ip rip",
                "debug ip rip",
                "trace ip route",
                "monitor rip log"
            ],
            "answer": "debug ip rip",
            "explanation": "The debug ip rip privileged EXEC command displays live diagnostic messages showing RIP update contents, metrics, and peer IP addresses."
        },
        {
            "id": "rip_post_8",
            "type": "post",
            "question": "What happens when two equal-cost RIP routes with the same hop count to a destination exist?",
            "options": [
                "The router drops all traffic",
                "The router performs equal-cost load balancing across both paths",
                "The router randomly deletes one route",
                "The router converts to static routing"
            ],
            "answer": "The router performs equal-cost load balancing across both paths",
            "explanation": "Cisco routers automatically perform equal-cost load balancing across up to 4 parallel paths with identical RIP hop count metrics."
        },
        {
            "id": "rip_post_9",
            "type": "post",
            "question": "What is the purpose of the passive-interface command in RIP configuration?",
            "options": [
                "Shuts down the router interface",
                "Stops sending RIP updates out the specified interface while still listening for incoming packets",
                "Disables IPv4 routing",
                "Enables OSPF on that interface"
            ],
            "answer": "Stops sending RIP updates out the specified interface while still listening for incoming packets",
            "explanation": "passive-interface suppresses outgoing periodic RIP updates on LAN-facing user ports, saving bandwidth and improving security."
        },
        {
            "id": "rip_post_10",
            "type": "post",
            "question": "In the command R1(config)# router rip, what is the next step to enable Version 2?",
            "options": [
                "type version 2",
                "type enable rip v2",
                "type ip rip version 2",
                "type mode classless"
            ],
            "answer": "type version 2",
            "explanation": "Under the router rip configuration sub-prompt, entering version 2 switches the router from legacy RIPv1 to RIPv2."
        }
    ],
    "viva": [
        {
            "q": "What is Distance Vector routing and how does RIP implement it?",
            "a": "Distance Vector routing determines path selection based on direction (vector - next-hop router) and distance (metric - hop count). RIP implements it by broadcasting/multicasting its entire routing table to directly connected neighbors every 30 seconds."
        },
        {
            "q": "Why is the maximum hop count in RIP restricted to 15?",
            "a": "The maximum metric of 15 hops places a limit on the Count-to-Infinity problem during network failure. A hop count of 16 signifies that the network is unreachable (Infinity)."
        },
        {
            "q": "Explain the difference between Split Horizon and Poison Reverse.",
            "a": "Split Horizon prevents a router from advertising a route back out the interface it was learned from. Poison Reverse explicitly advertises an unreachable route back out that interface with a metric of 16 (Infinity) to accelerate network convergence."
        },
        {
            "q": "What are the four primary RIP timers and their default values?",
            "a": "1. Update Timer: 30 seconds (periodic updates).\n2. Invalid Timer: 180 seconds (marks route as invalid/metric 16).\n3. Hold-down Timer: 180 seconds (stabilization period).\n4. Flush Timer: 240 seconds (removes route from routing table)."
        },
        {
            "q": "Why should no auto-summary always be configured under router rip in modern networks?",
            "a": "By default, RIPv2 automatically summarizes subnets to their classful boundaries (Class A, B, C) when advertising across network boundaries. no auto-summary preserves exact subnet masks, enabling proper routing for VLSM and CIDR subnets."
        }
    ],
    "assignment": "1. Build a 4-router line topology (R1 ⇹ R2 ⇹ R3 ⇹ R4) interconnecting subnets 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24, and 192.168.4.0/24.\n2. Configure RIPv2 with router rip, version 2, no auto-summary, and advertise all connected networks on each router.\n3. Issue show ip route on R1 and verify that 192.168.4.0/24 is learned via R2 with a Hop Count metric of 3 [120/3].\n4. Simulate a link failure between R2 and R3. Record the time required for RIP to converge and update the routing tables.",
    "references": [
        {
            "title": "RFC 2453 - RIP Version 2 Specification",
            "link": "https://datatracker.ietf.org/doc/html/rfc2453"
        },
        {
            "title": "RFC 1058 - Routing Information Protocol (RIPv1)",
            "link": "https://datatracker.ietf.org/doc/html/rfc1058"
        },
        {
            "title": "Cisco IOS IP Routing: RIP Configuration Guide",
            "link": "https://www.cisco.com"
        }
    ],
    "simType": "rip_sim"
},
    'routing_ospf': {
    "title": "Practical 9: Link State Routing Protocol (OSPF)",
    "aim": "To understand Link-State dynamic routing principles, configure Open Shortest Path First (OSPF Version 2 Area 0) across a multi-router enterprise network, analyze Hello neighbor discovery, inspect Link State Database (LSDB) synchronization, calculate OSPF Cost metrics using Dijkstra's Shortest Path First (SPF) algorithm, and verify DR/BDR elections.",
    "intro": {
        "summary": "As enterprise networks continue to grow in size and complexity, traditional routing protocols such as RIP become inefficient because they use only hop count as their routing metric and exchange complete routing tables periodically. Open Shortest Path First (OSPF) is the industry-standard Link-State Interior Gateway Protocol (IGP) engineered for high scalability and rapid convergence.",
        "importance": "OSPF is the foundational routing protocol deployed across enterprise campus networks, data centers, cloud infrastructure, and ISPs. Understanding OSPF teaches link cost calculation, Dijkstra's algorithm, LSA flooding, LSDB synchronization, and hierarchical area design.",
        "applications": [
            "Enterprise Campus Core & Access Routing",
            "Cloud Data Center Interconnect Fabric",
            "Hospital & University Multi-Building Networks",
            "Internet Service Provider (ISP) Core Routing"
        ],
        "outcome": "After completing this practical, students will be able to configure OSPF Version 2 Single-Area 0 on Cisco routers, calculate interface costs, verify OSPF 7 neighbor states, inspect the Link State Database (LSDB), and troubleshoot DR/BDR elections."
    },
    "prerequisites": [
        "Practical 6: Subnetting, VLSM & CIDR",
        "Practical 7: Virtual LANs (VLAN) & Trunking",
        "Practical 8: Distance Vector Routing Protocol (RIP)"
    ],
    "outcomes": [
        "Explain the operation of Link-State Routing and Open Shortest Path First (OSPF).",
        "Configure OSPF Version 2 Single-Area (Area 0) using Cisco IOS CLI commands.",
        "Calculate OSPF metric Cost using the formula: Cost = Reference Bandwidth / Interface Bandwidth.",
        "Differentiate Distance Vector (RIP) and Link State (OSPF) routing protocols.",
        "Trace the 7 OSPF neighbor states: Down ➔ Init ➔ Two-Way ➔ ExStart ➔ Exchange ➔ Loading ➔ Full.",
        "Analyze Link State Advertisements (LSAs) and Link State Database (LSDB) synchronization.",
        "Demonstrate Dijkstra's Shortest Path First (SPF) algorithm for dynamic path selection.",
        "Verify Designated Router (DR) and Backup Designated Router (BDR) elections on broadcast networks."
    ],
    "theory": {
        "intro": "Modern enterprise networks demand fast routing convergence, intelligent bandwidth-based path determination, and hierarchical scalability. Open Shortest Path First (OSPF) was developed to overcome the 15-hop limit and periodic table flooding limitations of Distance Vector protocols.",
        "sections": [
            {
                "heading": "1. Introduction to Link State Routing & OSPF",
                "content": "As corporate and campus networks expand across multiple buildings and data centers, legacy distance vector protocols like RIP become major performance bottlenecks. RIP evaluates paths using only router hop count regardless of whether a link is a 10 Mbps copper wire or a 10 Gbps fiber line. Open Shortest Path First (OSPF) addresses this by evaluating link bandwidth (Cost), flooding incremental Link State Advertisements (LSAs), building a complete network map (LSDB), and running Dijkstra's algorithm to compute the absolute shortest path."
            },
            {
                "heading": "2. Learning Objectives",
                "content": "By completing this practical, students will master:\n• Link-State routing principles vs Distance Vector.\n• OSPF Router ID (RID) assignment and Hello packet neighbor discovery.\n• Calculating OSPF interface Cost metrics (Cost = Reference Bandwidth / Bandwidth).\n• The 7 OSPF neighbor adjacency states: Down, Init, Two-Way, ExStart, Exchange, Loading, Full.\n• Configuring OSPF Area 0 with router ospf 1, router-id, and network wildcard masks.\n• Verifying LSDB synchronization and troubleshooting DR/BDR elections."
            },
            {
                "heading": "3. Why OSPF is Required",
                "content": "RIP has severe limitations:\n1. Maximum hop count limit of 15 (16 is unreachable).\n2. Slow convergence timers (30s periodic update, 180s invalid timer).\n3. Periodic full-table updates consume network bandwidth.\n4. Complete ignorance of interface bandwidth or link quality.\nOSPF overcomes all of these by supporting unlimited hops, computing paths based on bandwidth cost, flooding incremental updates only when topology changes, and converging in milliseconds."
            },
            {
                "heading": "4. What is OSPF?",
                "content": "Open Shortest Path First (OSPF) is an open-standard Link-State Interior Gateway Protocol (IGP) defined in RFC 2328 (OSPFv2 for IPv4) and RFC 5340 (OSPFv3 for IPv6). Instead of relying on neighbors for route calculations, every OSPF router builds an identical topology map called the Link State Database (LSDB) and independently calculates the shortest path tree using Dijkstra's SPF algorithm."
            },
            {
                "heading": "5. Distance Vector vs Link State Routing Comparison",
                "content": "• Metric: Distance Vector uses Hop Count; Link State uses Bandwidth Cost.\n• Algorithm: Distance Vector uses Bellman-Ford; Link State uses Dijkstra's Shortest Path First (SPF).\n• Updates: Distance Vector sends periodic full table broadcasts; Link State sends incremental LSA floods only on change.\n• Convergence: Distance Vector is slow (minutes); Link State is fast (milliseconds).\n• Scalability: Distance Vector is limited to small LANs (<15 hops); Link State scales to massive enterprise areas.\n• Loop Prevention: Distance Vector uses Split Horizon/Poison Reverse; Link State uses complete LSDB SPF graph calculation."
            },
            {
                "heading": "6. Basic OSPF Terminology",
                "content": "• Router ID (RID): Unique 32-bit identifier for each OSPF router.\n• Neighbor Router: Adjacent OSPF router connected on a shared link.\n• Link: Router interface connected to a network segment.\n• Link State Advertisement (LSA): Data packet containing interface status and cost.\n• Link State Database (LSDB): Complete network topology map stored by all routers in an area.\n• SPF Tree: Shortest path graph calculated with local router as root node.\n• Cost: Routing metric derived from interface bandwidth.\n• Area: Logical grouping of routers to restrict LSA flooding."
            },
            {
                "heading": "7. OSPF Router ID (RID)",
                "content": "Every OSPF router requires a unique 32-bit Router ID (formatted as an IP address, e.g., 1.1.1.1). Cisco routers determine the Router ID using the following priority:\n1. Explicitly configured command: router-id 1.1.1.1 under router ospf 1.\n2. Highest IP address among active Loopback interfaces.\n3. Highest IP address among active physical interfaces."
            },
            {
                "heading": "8. OSPF Neighbor Discovery Process",
                "content": "The step-by-step neighbor formation process:\nStep 1: Routers send periodic Hello Packets to multicast 224.0.0.5.\nStep 2: Discover adjacent OSPF neighbors and verify matching parameters (Area ID, Subnet Mask, Hello/Dead intervals, Authentication).\nStep 3: Establish 2-Way State.\nStep 4: Elect Designated Router (DR) and Backup Designated Router (BDR) on multi-access networks.\nStep 5: Exchange Database Description (DBD) packets.\nStep 6: Request missing LSAs using Link State Request (LSR) and Link State Update (LSU).\nStep 7: Reach FULL Adjacency State and run Dijkstra SPF."
            },
            {
                "heading": "9. Hello Packets & Dead Intervals",
                "content": "OSPF routers periodically transmit Hello packets (default: every 10 seconds on Ethernet, 30 seconds on Non-Broadcast Multi-Access). If a router fails to receive a Hello packet within the Dead Interval (default: 4 times Hello interval = 40 seconds), the neighbor is declared down."
            },
            {
                "heading": "10. Link State Advertisement (LSA)",
                "content": "An LSA is a data structure describing the state of a router's links, interface IP addresses, subnet masks, connected neighbors, and metric cost. Whenever an interface goes up or down, the router immediately floods an LSA update to all neighbors."
            },
            {
                "heading": "11. Link State Database (LSDB)",
                "content": "The LSDB is a repository of all LSAs received from every router within the OSPF area. Because all routers in an area flood and synchronize LSAs, every router possesses an identical LSDB map of the network topology."
            },
            {
                "heading": "12. Dijkstra's Shortest Path First (SPF) Algorithm",
                "content": "Dijkstra's SPF algorithm takes the LSDB network graph, places the local router at the root node, and calculates the lowest cumulative Cost path to every destination subnet. The resulting shortest-path tree dictates which routes are installed into the main IP routing table."
            },
            {
                "heading": "13. OSPF Cost Metric Formula",
                "content": "OSPF calculates link metric Cost using interface bandwidth:\nFormula: Cost = Reference Bandwidth / Interface Bandwidth\nDefault Reference Bandwidth = 100,000,000 bps (100 Mbps).\n• 10 Mbps (Ethernet): Cost = 100,000,000 / 10,000,000 = 100\n• 100 Mbps (FastEthernet): Cost = 100,000,000 / 100,000,000 = 1\n• 1 Gbps (GigabitEthernet): Cost = 1 (rounded up from 0.1)\nLower cost represents a faster, preferred path."
            },
            {
                "heading": "14. OSPF Areas & Hierarchical Design",
                "content": "Large enterprise networks divide routers into logical Areas to isolate LSA flooding, reduce LSDB memory footprint, and speed up SPF execution. All non-backbone areas (e.g., Area 1, Area 2) must connect to Area 0."
            },
            {
                "heading": "15. Backbone Area (Area 0)",
                "content": "Area 0 (0.0.0.0) is the central core of an OSPF network called the Backbone Area. All inter-area traffic between non-backbone areas must travel through Area 0 to prevent routing loops."
            },
            {
                "heading": "16. Designated Router (DR) & Backup Designated Router (BDR)",
                "content": "On multi-access broadcast networks (e.g., Ethernet switches with 10 routers), full mesh adjacencies require n*(n-1)/2 connections (45 adjacencies!). OSPF solves this by electing:\n• Designated Router (DR): Central hub router that collects and distributes LSAs.\n• Backup Designated Router (BDR): Standby router that takes over instantly if DR fails.\nElection is based on highest OSPF Priority (default: 1), then highest Router ID."
            },
            {
                "heading": "17. The 7 OSPF Neighbor States",
                "content": "1. Down: Initial state, no Hello packets received.\n2. Init: Hello received from neighbor, but bidirectional communication not confirmed.\n3. Two-Way: Bidirectional communication confirmed (Router ID seen in neighbor Hello list). DR/BDR election occurs.\n4. ExStart: Master/Slave relationship established for Database Description (DBD) exchange.\n5. Exchange: Routers exchange DBD summary packets listing LSDB contents.\n6. Loading: Routers request detailed LSAs using Link State Request (LSR) and receive Link State Updates (LSU).\n7. Full: LSDB is 100% synchronized. Full adjacency established!"
            },
            {
                "heading": "18. Structure of an OSPF Routing Table",
                "content": "An OSPF routing table entry contains:\n• Prefix Type: 'O' for Intra-Area, 'O IA' for Inter-Area.\n• Destination Subnet & Mask.\n• Administrative Distance (AD = 110 for OSPF).\n• Metric Cost: Cumulative path cost.\n• Next-Hop IP Address & Outgoing Interface."
            },
            {
                "heading": "19. Cisco IOS Configuration Guide",
                "content": "Configuring Single-Area OSPF Area 0 on a Cisco router:\nRouter# configure terminal\nRouter(config)# router ospf 1\nRouter(config-router)# router-id 1.1.1.1\nRouter(config-router)# network 192.168.1.0 0.0.0.255 area 0\nRouter(config-router)# network 10.0.1.0 0.0.0.3 area 0\nRouter(config-router)# end"
            },
            {
                "heading": "20. Verification Commands",
                "content": "• show ip route - Displays IP routing table (OSPF routes marked with 'O').\n• show ip ospf neighbor - Displays OSPF neighbors, state (FULL/DR/BDR), and interface.\n• show ip ospf database - Displays the Link State Database (LSDB).\n• show ip ospf interface - Displays OSPF cost, area, priority, and timer intervals.\n• show ip protocols - Displays active routing process details."
            },
            {
                "heading": "21. Advantages of OSPF",
                "content": "• Extremely fast convergence (milliseconds).\n• Cost metric accounts for link bandwidth.\n• No hop count limit (supports enterprise scale).\n• Hierarchical area design reduces CPU/memory load.\n• Loop-free routing verified by Dijkstra algorithm.\n• Classless routing (VLSM & CIDR support)."
            },
            {
                "heading": "22. Limitations of OSPF",
                "content": "• Complex configuration and troubleshooting compared to RIP.\n• Higher CPU and RAM requirements to store LSDB and run SPF calculations.\n• Strict hierarchical area design rules (all non-backbone areas must attach to Area 0)."
            },
            {
                "heading": "23. Real-World Applications",
                "content": "OSPF is deployed in enterprise campuses, universities, data centers, hospitals, financial institutions, and cloud provider networks."
            },
            {
                "heading": "24. Best Practices",
                "content": "1. Explicitly configure Router IDs (router-id 1.1.1.1).\n2. Design multi-building networks around Backbone Area 0.\n3. Adjust auto-cost reference-bandwidth 1000 for Gigabit and 10G networks.\n4. Use passive-interface on user LAN ports."
            },
            {
                "heading": "25. Summary",
                "content": "OSPF is the industry-standard Link-State protocol that calculates shortest path trees based on bandwidth Cost using Dijkstra's algorithm, maintaining rapid convergence and loop-free operation."
            }
        ]
    },
    "hardware_inspector": [
        {
            "id": "cisco_2911_ospf_router",
            "name": "Cisco 2911 ISR OSPF Enterprise Router",
            "category": "Layer 3 Link-State Router",
            "description": "Enterprise Layer 3 router running OSPF Area 0 process, executing Dijkstra's SPF algorithm and maintaining synchronized LSDB tables.",
            "svg": `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="40" width="360" height="160" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="3"/>
                <rect x="35" y="55" width="330" height="40" rx="5" fill="#1e293b"/>
                <text x="50" y="80" fill="#34d399" font-size="15" font-weight="bold" font-family="monospace">CISCO 2911 ISR [OSPF AREA 0 - FULL]</text>
                <circle cx="340" cy="75" r="7" fill="#10b981"/>
                <g transform="translate(40, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#10b981" stroke-width="2"/>
                    <text x="32" y="25" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Gi0/0</text>
                </g>
                <g transform="translate(120, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#10b981" stroke-width="2"/>
                    <text x="32" y="25" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Gi0/1</text>
                </g>
                <g transform="translate(200, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
                    <text x="32" y="25" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Gi0/2</text>
                </g>
                <g transform="translate(280, 110)">
                    <rect x="0" y="0" width="65" height="40" rx="4" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
                    <text x="32" y="25" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">Serial0/0</text>
                </g>
                <text x="200" y="185" fill="#cbd5e1" font-size="11" text-anchor="middle">OSPFv2 - Dijkstra SPF Engine (Multicast 224.0.0.5 / 224.0.0.6)</text>
            </svg>`
        },
        {
            "id": "dijkstra_spf_engine_diagram",
            "name": "Dijkstra SPF Shortest Path Calculation Engine",
            "category": "Layer 3 Algorithm & LSDB Graph",
            "description": "Visual representation of Dijkstra's Shortest Path First (SPF) tree computation evaluating bandwidth Cost metrics across nodes.",
            "svg": `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="360" height="200" rx="8" fill="#0b0f19" stroke="#3b82f6" stroke-width="2"/>
                <text x="200" y="45" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">DIJKSTRA SPF GRAPH COMPUTATION [AD = 110]</text>
                <line x1="30" y1="55" x2="370" y2="55" stroke="#334155" stroke-width="2"/>
                <circle cx="80" cy="130" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <text x="80" y="134" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">R1</text>

                <circle cx="200" cy="90" r="22" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
                <text x="200" y="94" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">R2 (1G)</text>

                <circle cx="200" cy="170" r="22" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
                <text x="200" y="174" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">R3 (10M)</text>

                <circle cx="320" cy="130" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <text x="320" y="134" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">R4</text>

                <line x1="100" y1="118" x2="180" y2="98" stroke="#10b981" stroke-width="4"/>
                <text x="135" y="100" fill="#10b981" font-size="10" font-weight="bold">Cost 1</text>

                <line x1="220" y1="98" x2="300" y2="118" stroke="#10b981" stroke-width="4"/>
                <text x="265" y="100" fill="#10b981" font-size="10" font-weight="bold">Cost 1</text>

                <line x1="100" y1="142" x2="180" y2="162" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
                <text x="135" y="170" fill="#ef4444" font-size="10">Cost 100</text>

                <rect x="30" y="200" width="340" height="15" rx="3" fill="#1e293b"/>
                <text x="200" y="211" fill="#10b981" font-size="9" text-anchor="middle">Dijkstra selects R1 ➔ R2 ➔ R4 (Total Cost = 2) over R1 ➔ R3 ➔ R4 (Cost = 200)</text>
            </svg>`
        }
    ],
    "evaluations": [
        {
            "id": "ospf_pre_1",
            "type": "pre",
            "question": "What metric does OSPF use to calculate the shortest path to a destination network?",
            "options": [
                "Hop Count",
                "Bandwidth Cost",
                "Delay Metric",
                "Reliability Weight"
            ],
            "answer": "Bandwidth Cost",
            "explanation": "OSPF uses Cost as its routing metric, calculated as Reference Bandwidth / Interface Bandwidth. Lower cost paths (higher bandwidth) are preferred."
        },
        {
            "id": "ospf_pre_2",
            "type": "pre",
            "question": "What algorithm does OSPF run to compute shortest path trees from the LSDB?",
            "options": [
                "Bellman-Ford Algorithm",
                "Dijkstra's Shortest Path First (SPF) Algorithm",
                "Spanning Tree Algorithm",
                "Diffusing Update Algorithm (DUAL)"
            ],
            "answer": "Dijkstra's Shortest Path First (SPF) Algorithm",
            "explanation": "OSPF executes Dijkstra's SPF algorithm on the Link State Database (LSDB) to compute loop-free, lowest-cost routing trees."
        },
        {
            "id": "ospf_pre_3",
            "type": "pre",
            "question": "What is the mandatory Backbone Area in an OSPF multi-area design?",
            "options": [
                "Area 1",
                "Area 0",
                "Area 100",
                "Backbone Area 10"
            ],
            "answer": "Area 0",
            "explanation": "Area 0 (or Area 0.0.0.0) is the mandatory Backbone Area. All non-backbone areas must physically or logically attach to Area 0."
        },
        {
            "id": "ospf_pre_4",
            "type": "pre",
            "question": "What IPv4 multicast address is used by OSPF routers to send Hello packets?",
            "options": [
                "224.0.0.5",
                "224.0.0.9",
                "224.0.0.10",
                "255.255.255.255"
            ],
            "answer": "224.0.0.5",
            "explanation": "OSPF routers transmit Hello packets and general updates to all OSPF routers using the IPv4 multicast address 224.0.0.5."
        },
        {
            "id": "ospf_pre_5",
            "type": "pre",
            "question": "Which OSPF neighbor state indicates that full database synchronization is achieved and adjacency is complete?",
            "options": [
                "Two-Way",
                "ExStart",
                "Loading",
                "Full"
            ],
            "answer": "Full",
            "explanation": "The FULL state signifies that neighbor routers have synchronized their Link State Databases (LSDB) completely."
        },
        {
            "id": "ospf_post_1",
            "type": "post",
            "question": "What is the Administrative Distance (AD) assigned to OSPF routes in Cisco IOS?",
            "options": [
                "90",
                "110",
                "120",
                "170"
            ],
            "answer": "110",
            "explanation": "In Cisco IOS, OSPF has an Administrative Distance of 110 (EIGRP is 90, RIP is 120, Static is 1)."
        },
        {
            "id": "ospf_post_2",
            "type": "post",
            "question": "What is the default OSPF Cost for a FastEthernet (100 Mbps) interface using a 100 Mbps reference bandwidth?",
            "options": [
                "1",
                "10",
                "100",
                "1000"
            ],
            "answer": "1",
            "explanation": "Cost = Reference Bandwidth (100 Mbps) / Interface Bandwidth (100 Mbps) = 1."
        },
        {
            "id": "ospf_post_3",
            "type": "post",
            "question": "What is the primary role of a Designated Router (DR) on a broadcast Ethernet segment?",
            "options": [
                "To block all broadcast traffic",
                "To serve as the central point for receiving and flooding LSAs, reducing full-mesh adjacencies",
                "To assign IP addresses via DHCP",
                "To encrypt all OSPF packets"
            ],
            "answer": "To serve as the central point for receiving and flooding LSAs, reducing full-mesh adjacencies",
            "explanation": "The DR collects LSAs from all routers on the multi-access segment and redistributes them, reducing n*(n-1)/2 adjacencies to n-1."
        },
        {
            "id": "ospf_post_4",
            "type": "post",
            "question": "How do routers determine the Designated Router (DR) on a broadcast network by default?",
            "options": [
                "Highest OSPF interface Priority, then highest Router ID",
                "Lowest IP address on physical interface",
                "Fastest CPU clock speed",
                "Random selection"
            ],
            "answer": "Highest OSPF interface Priority, then highest Router ID",
            "explanation": "The router with the highest OSPF interface priority (default: 1) is elected DR. Ties are broken by selecting the highest Router ID."
        },
        {
            "id": "ospf_post_5",
            "type": "post",
            "question": "What multicast address do non-DR routers use to send Link State Updates (LSU) to the DR and BDR?",
            "options": [
                "224.0.0.5",
                "224.0.0.6",
                "224.0.0.9",
                "224.0.0.10"
            ],
            "answer": "224.0.0.6",
            "explanation": "DROther routers send LSA updates to the DR and BDR using the AllDRouters multicast address 224.0.0.6."
        },
        {
            "id": "ospf_post_6",
            "type": "post",
            "question": "Which Cisco command displays OSPF neighbor adjacencies, interface roles (DR/BDR), and neighbor states?",
            "options": [
                "show ip ospf neighbor",
                "show ip ospf database",
                "show ip route ospf",
                "debug ip ospf hello"
            ],
            "answer": "show ip ospf neighbor",
            "explanation": "show ip ospf neighbor displays neighbor Router IDs, priority, current state (e.g. FULL/DR, FULL/BDR), and interface."
        },
        {
            "id": "ospf_post_7",
            "type": "post",
            "question": "What wildcard mask is used in an OSPF network command to match a 255.255.255.0 (/24) subnet exactly?",
            "options": [
                "0.0.0.0",
                "0.0.0.255",
                "255.255.255.0",
                "0.0.255.255"
            ],
            "answer": "0.0.0.255",
            "explanation": "Wildcard mask is the inverse of the subnet mask. For /24 (255.255.255.0), the inverse wildcard mask is 0.0.0.255."
        },
        {
            "id": "ospf_post_8",
            "type": "post",
            "question": "What happens when an OSPF Hello packet is received with mismatched Hello/Dead intervals or mismatched Area IDs?",
            "options": [
                "The routers form a partial adjacency",
                "The neighbor relationship fails and cannot reach Two-Way or Full state",
                "The router automatically changes its timers to match",
                "OSPF converts to RIP"
            ],
            "answer": "The neighbor relationship fails and cannot reach Two-Way or Full state",
            "explanation": "Mismatched Hello/Dead timers, Area IDs, or subnet masks cause OSPF neighbor discovery to fail."
        },
        {
            "id": "ospf_post_9",
            "type": "post",
            "question": "What is the purpose of the passive-interface command in OSPF configuration?",
            "options": [
                "Stops sending OSPF Hello packets out the specified interface while continuing to advertise its connected subnet",
                "Shuts down the physical port",
                "Disables IPv4 routing",
                "Forces the interface to become DR"
            ],
            "answer": "Stops sending OSPF Hello packets out the specified interface while continuing to advertise its connected subnet",
            "explanation": "passive-interface suppresses Hello packets on LAN interfaces facing user PCs, conserving bandwidth and securing the network."
        },
        {
            "id": "ospf_post_10",
            "type": "post",
            "question": "What Cisco command displays the contents of the local router's Link State Database (LSDB)?",
            "options": [
                "show ip ospf database",
                "show ip route ospf",
                "show ip ospf lsdb",
                "debug ip ospf lsdb"
            ],
            "answer": "show ip ospf database",
            "explanation": "show ip ospf database lists all LSA entries (Router LSAs, Network LSAs, Summary LSAs) stored in the router's LSDB."
        }
    ],
    "viva": [
        {
            "q": "What is Link-State routing and how does OSPF differ from RIP?",
            "a": "Link-State routing builds a complete topology map (LSDB) of the network by flooding LSAs. OSPF computes paths using Dijkstra's SPF algorithm based on bandwidth Cost, offering millisecond convergence, whereas RIP uses simple hop count (max 15) and slow 30-second periodic updates."
        },
        {
            "q": "How is OSPF metric Cost calculated and how can network admins customize it?",
            "a": "Cost = Reference Bandwidth / Interface Bandwidth (default reference = 100 Mbps). Admins can customize path selection by changing interface cost (ip ospf cost <value>) or raising the reference bandwidth (auto-cost reference-bandwidth 1000)."
        },
        {
            "q": "Explain the 7 OSPF neighbor states in sequence.",
            "a": "1. Down (no Hello received).\n2. Init (Hello received).\n3. Two-Way (bidirectional Hello confirmed, DR/BDR elected).\n4. ExStart (Master/Slave chosen for DBD exchange).\n5. Exchange (DBD summary packets exchanged).\n6. Loading (LSR and LSU packets request and receive missing LSAs).\n7. Full (LSDB fully synchronized, adjacency complete)."
        },
        {
            "q": "Why are Designated Routers (DR) and Backup Designated Routers (BDR) elected on Ethernet networks?",
            "a": "On multi-access broadcast networks, full mesh adjacencies create excessive LSA flooding. The DR acts as the central hub collecting and distributing LSAs, reducing adjacencies from n*(n-1)/2 to n-1. The BDR provides instant redundancy."
        },
        {
            "q": "Why must all non-backbone OSPF areas connect to Backbone Area 0?",
            "a": "OSPF uses a strict two-tier hierarchical design where Area 0 acts as the central backbone hub. Routing all inter-area traffic through Area 0 prevents routing loops between areas."
        }
    ],
    "assignment": "1. Configure OSPF Single-Area 0 across a 3-router triangle topology (R1 ⇹ R2 ⇹ R3).\n2. Assign explicit Router IDs (R1: 1.1.1.1, R2: 2.2.2.2, R3: 3.3.3.3).\n3. Issue show ip ospf neighbor and verify that all adjacencies reach FULL state.\n4. Change R2 GigabitEthernet interface cost to 50 (ip ospf cost 50) and observe how Dijkstra's algorithm dynamically re-routes traffic via R3.",
    "references": [
        {
            "title": "RFC 2328 - OSPF Version 2 Specification",
            "link": "https://datatracker.ietf.org/doc/html/rfc2328"
        },
        {
            "title": "RFC 5340 - OSPF for IPv6 (OSPFv3)",
            "link": "https://datatracker.ietf.org/doc/html/rfc5340"
        },
        {
            "title": "Cisco IOS OSPF Design & Configuration Guide",
            "link": "https://www.cisco.com"
        }
    ],
    "simType": "ospf_sim"
},
    'routing_eigrp': {
        title: "Dynamic Routing - EIGRP",
        aim: "To configure Cisco Enhanced Interior Gateway Routing Protocol (EIGRP AS 100) using DUAL algorithm.",
        intro: {
            summary: "EIGRP is an advanced distance-vector routing protocol utilizing the Diffusing Update Algorithm (DUAL) for ultra-fast convergence without routing loops.",
            importance: "EIGRP supports unequal-cost load balancing and instant failover using pre-calculated Feasible Successor backup paths.",
            applications: ["Cisco Enterprise WAN", "Branch Inter-Office Routing"],
            outcome: "Students will configure EIGRP Autonomous Systems, set K-value metrics, and inspect successor paths."
        },
        prerequisites: ["Practical 9: Link State Routing - OSPF"],
        outcomes: [
            "Configure EIGRP Autonomous System numbers.",
            "Understand EIGRP composite metric K-values (Bandwidth & Delay).",
            "Verify Successor and Feasible Successor routes in EIGRP Topology table."
        ],
        theory: {
            intro: "EIGRP is a hybrid routing protocol leveraging Diffusing Update Algorithm (DUAL). Metric is calculated using Bandwidth, Delay, Reliability, and Load (K-values).",
            cards: [
                { title: "Successor Route", content: "The primary routing path stored in the Routing Table with lowest metric." },
                { title: "Feasible Successor", content: "A backup loop-free path stored in the EIGRP Topology Table for instant failover." }
            ],
            formulas: ["EIGRP Metric = (256 * (10^7 / Min Bandwidth)) + (256 * Sum of Delays)"],
            standards: ["RFC 7868 - Cisco's Enhanced Interior Gateway Routing Protocol (EIGRP)"]
        },
        tools: [
            { name: "Cisco Router CLI", layer: "Layer 3 Router", ports: "Serial & Gigabit", usage: "DUAL calculation & AS neighbor formation", statusLED: "EIGRP Peer UP" }
        ],
        procedure: [
            "Enter EIGRP configuration mode: `router eigrp 100`.",
            "Disable auto-summarization: `no auto-summary`.",
            "Advertise networks: `network 172.16.0.0 0.0.255.255`.",
            "Verify neighbor adjacency: `show ip eigrp neighbors`."
        ],
        troubleshooting: {
            problem: "EIGRP neighbor relationship fails to form.",
            hints: ["Check if Autonomous System (AS) number matches on both routers.", "Verify K-values match."],
            fix: "Ensure `router eigrp 100` uses matching AS number on both routers."
        },
        viva: [
            { q: "What is a Feasible Successor in EIGRP?", a: "A backup route stored in the topology table that satisfies the Feasibility Condition, allowing zero-second convergence if the primary route fails." },
            { q: "What is the Administrative Distance of internal EIGRP?", a: "90." }
        ],
        assignment: "Configure EIGRP AS 100 on 3 routers. Force link failover and observe convergence time.",
        references: [{ title: "RFC 7868 - EIGRP Specification", link: "https://datatracker.ietf.org/doc/html/rfc7868" }],
        simType: "cli"
    },
    'static_routing': {
        title: "Static Routing Configuration",
        aim: "To configure static default routes and manual next-hop IP routing entries across multi-hop networks.",
        intro: {
            summary: "Static routing involves manual entry of destination network paths into a router's routing table, offering complete administrative control.",
            importance: "Static routes are secure, resource-light, and critical for default routes leading to an ISP gateway.",
            applications: ["Stub Network Connectivity", "ISP Default Gateway Route", "Secure Out-of-Band Management"],
            outcome: "Students will add static routes with next-hop IP addresses and configure default routes (`0.0.0.0/0`)."
        },
        prerequisites: ["Practical 4: IPv4 Address Classification", "Practical 1: Introduction to Networking Tools"],
        outcomes: [
            "Configure manual static routes (`ip route <net> <mask> <next-hop>`).",
            "Configure default static routes (`ip route 0.0.0.0 0.0.0.0 <next-hop>`).",
            "Inspect routing table code indicators ('S' for Static, 'C' for Connected)."
        ],
        theory: {
            intro: "Static routing involves manually entering routing paths into a router's routing table. It is resource-efficient and secure, but requires manual updates when network topology changes.",
            cards: [
                { title: "Next-Hop Address", content: "Specifies the IP address of the adjacent router interface." },
                { title: "Default Static Route", content: "`ip route 0.0.0.0 0.0.0.0 <next-hop>` matches all unmatched destination traffic." }
            ],
            formulas: ["Static Route AD = 1", "Default Route Matching = 0-bit prefix length (/0)"],
            standards: ["RFC 1812 - Requirements for IP Version 4 Routers"]
        },
        tools: [
            { name: "Cisco Router CLI", layer: "Layer 3 Router", ports: "Serial / Gigabit Interfaces", usage: "Manual route insertion", statusLED: "Active Route Added" }
        ],
        procedure: [
            "Access Router R1 configuration mode.",
            "Add static route to remote network 192.168.2.0/24: `ip route 192.168.2.0 255.255.255.0 10.0.0.2`.",
            "Configure default gateway route: `ip route 0.0.0.0 0.0.0.0 10.0.0.2`.",
            "Verify static route entry denoted by 'S' in `show ip route`."
        ],
        troubleshooting: {
            problem: "Static route entry does not appear in `show ip route`.",
            hints: ["Check if the exit interface / next-hop IP is in UP/UP state."],
            fix: "Ensure next-hop interface is configured and pingable."
        },
        viva: [
            { q: "What is the Administrative Distance of a static route pointing to a next-hop IP?", a: "1." },
            { q: "When should a Default Route (0.0.0.0 0.0.0.0) be configured?", a: "On stub networks connecting to an ISP, where all external internet traffic must be forwarded out a single egress link." }
        ],
        assignment: "Configure static routes between 3 branch offices. Verify reachability using ping and traceroute.",
        references: [{ title: "RFC 1812 - Router Requirements", link: "https://datatracker.ietf.org/doc/html/rfc1812" }],
        simType: "cli"
    },
    'udp_tcp': {
        title: "UDP & TCP Transport Protocols",
        aim: "To analyze 3-way handshake (SYN, SYN-ACK, ACK), TCP windowing, sequence numbers, and UDP connectionless header frames.",
        intro: {
            summary: "The Transport Layer (OSI Layer 4) manages end-to-end communication sessions using TCP (reliable) and UDP (connectionless).",
            importance: "Understanding TCP handshakes, windowing, and UDP port multiplexing is key to optimizing web and real-time streaming traffic.",
            applications: ["HTTP/HTTPS Web Traffic (TCP)", "VoIP & Video Streaming (UDP)", "DNS Lookups (UDP/53)"],
            outcome: "Students will analyze TCP 3-Way Handshake packets and compare TCP vs UDP frame headers in a Wireshark-style analyzer."
        },
        prerequisites: ["Practical 2: Network Commands & Utilities"],
        outcomes: [
            "Capture and decode TCP SYN, SYN-ACK, and ACK packets.",
            "Compare 20-byte TCP header vs 8-byte UDP header.",
            "Understand Sequence/Acknowledgement numbers and Flow Control."
        ],
        theory: {
            intro: "TCP is a reliable, connection-oriented Transport Layer protocol providing flow control and error recovery. UDP is a fast, connectionless protocol with 8-byte minimal header size.",
            cards: [
                { title: "3-Way Handshake", content: "Establishes reliable virtual circuit: 1. SYN -> 2. SYN-ACK -> 3. ACK." },
                { title: "TCP Windowing", content: "Controls how many bytes can be transmitted before receiving an acknowledgement." }
            ],
            formulas: ["TCP Header Size = 20 Bytes Minimum", "UDP Header Size = 8 Bytes Fixed"],
            standards: ["RFC 793 - Transmission Control Protocol (TCP)", "RFC 768 - User Datagram Protocol (UDP)"]
        },
        tools: [
            { name: "Wireshark Packet Inspector", layer: "Layer 4 Protocol Analyzer", ports: "Virtual Sniffer", usage: "Frame header decoding & TCP stream analysis", statusLED: "Packet Capture Active" }
        ],
        procedure: [
            "Launch Wireshark / Transport Packet Analyzer in simulator.",
            "Initiate HTTP TCP session from PC1 to Server1.",
            "Inspect SYN, SYN-ACK, and ACK frame headers.",
            "Compare TCP 20-byte header with UDP 8-byte header structure."
        ],
        troubleshooting: {
            problem: "TCP connection establishment hangs on SYN-SENT state.",
            hints: ["Check if firewall is blocking TCP Port 80/443 on target server."],
            fix: "Allow incoming TCP port 80 traffic on server firewall."
        },
        viva: [
            { q: "What are the flags set in the second step of a TCP 3-way handshake?", a: "SYN flag = 1 and ACK flag = 1 (SYN-ACK)." },
            { q: "Why is UDP preferred over TCP for Voice over IP (VoIP)?", a: "UDP has low overhead (8-byte header) and no retransmission delays, prioritizing real-time latency over packet loss recovery." }
        ],
        assignment: "Capture a TCP handshake and calculate Sequence Number progression across 3 packet exchanges.",
        references: [{ title: "RFC 793 - TCP Specification", link: "https://datatracker.ietf.org/doc/html/rfc793" }],
        simType: "packet_analyzer"
    },
    'dhcp_config': {
        title: "DHCP Configuration & IP Pools",
        aim: "To configure a Cisco Router as a DHCP Server issuing IP addresses, default gateways, and DNS server IPs to LAN clients.",
        intro: {
            summary: "DHCP (Dynamic Host Configuration Protocol) automates network IP address assignment, reducing manual configuration errors.",
            importance: "DHCP enables scalable device onboarding across enterprise LANs, Wi-Fi networks, and VPN tunnels.",
            applications: ["Corporate Wi-Fi Hotspots", "Enterprise Workstation Provisioning", "ISP Broadband Modems"],
            outcome: "Students will configure DHCP pools, exclude static IP ranges, and verify DORA lease processes."
        },
        prerequisites: ["Practical 4: IPv4 Address Classification", "Practical 11: Static Routing Configuration"],
        outcomes: [
            "Configure DHCP Server pools on Cisco routers.",
            "Reserve static IP ranges using `ip dhcp excluded-address`.",
            "Analyze DORA process: Discover, Offer, Request, Acknowledge."
        ],
        theory: {
            intro: "Dynamic Host Configuration Protocol (DHCP) automates IP address assignment using DORA process: Discover (Broadcast), Offer (Unicast), Request (Broadcast), Acknowledge (Unicast).",
            cards: [
                { title: "DORA Process", content: "1. Discover (UDP 67) -> 2. Offer (UDP 68) -> 3. Request -> 4. Acknowledge." },
                { title: "DHCP Pool Options", content: "Defines Default Gateway (Option 3), DNS Servers (Option 6), and Domain Name (Option 15)." }
            ],
            formulas: ["DHCP Server Port = UDP 67", "DHCP Client Port = UDP 68"],
            standards: ["RFC 2131 - Dynamic Host Configuration Protocol", "RFC 2132 - DHCP Options"]
        },
        tools: [
            { name: "Cisco Router CLI (DHCP Server)", layer: "Application/Layer 3", ports: "LAN FastEthernet Port", usage: "Leases IP pools to clients", statusLED: "Active DHCP Leases Granted" }
        ],
        procedure: [
            "Exclude gateway address: `ip dhcp excluded-address 192.168.1.1 192.168.1.10`.",
            "Create pool: `ip dhcp pool LAN_POOL`.",
            "Specify network: `network 192.168.1.0 255.255.255.0`.",
            "Set default gateway: `default-router 192.168.1.1`."
        ],
        troubleshooting: {
            problem: "Client PC receives APIPA address (169.254.x.x) instead of DHCP IP.",
            hints: ["Check if router interface in LAN is UP/UP.", "Verify `ip dhcp pool` subnet matches LAN."],
            fix: "Execute `ip dhcp pool LAN_POOL` and set `network 192.168.1.0 255.255.255.0`."
        },
        viva: [
            { q: "What does the DORA acronym stand for in DHCP?", a: "Discover, Offer, Request, Acknowledge." },
            { q: "Why is `ip dhcp excluded-address` necessary?", a: "To prevent the DHCP server from assigning statically configured IP addresses (like router gateways or servers), avoiding IP conflicts." }
        ],
        assignment: "Configure a Cisco router with 2 DHCP pools for VLAN 10 and VLAN 20. Verify client IP leases.",
        references: [{ title: "RFC 2131 - DHCP Specification", link: "https://datatracker.ietf.org/doc/html/rfc2131" }],
        simType: "cli"
    },
    'static_nat': {
        title: "Static NAT 1:1 Mapping",
        aim: "To configure Static Network Address Translation (Static NAT) mapping a private IP 1:1 to a public IP address.",
        intro: {
            summary: "Static NAT maps an internal private IPv4 address to an external public IPv4 address on a 1-to-1 permanent basis.",
            importance: "Static NAT allows external internet users to access internal servers while keeping internal topologies protected behind a gateway.",
            applications: ["Hosting Internal Web Servers", "Public DMZ Server Publishing", "Secure Partner B2B Links"],
            outcome: "Students will define inside/outside interfaces, configure 1:1 Static NAT rules, and inspect translation tables."
        },
        prerequisites: ["Practical 4: IPv4 Address Classification", "Practical 11: Static Routing Configuration"],
        outcomes: [
            "Define Inside and Outside NAT router interfaces.",
            "Configure 1:1 Static NAT mapping (`ip nat inside source static`).",
            "Inspect translation tables (`show ip nat translations`)."
        ],
        theory: {
            intro: "Static NAT translates a single private IP address to a single public IP address, allowing external internet hosts to access internal web/mail servers behind a firewall.",
            cards: [
                { title: "Inside Local", content: "The private IP address assigned to an internal host." },
                { title: "Inside Global", content: "The registered public IP address assigned by ISP for external routing." }
            ],
            formulas: ["Static NAT Ratio = 1 Private IP : 1 Public IP"],
            standards: ["RFC 3022 - Traditional IP Network Address Translator (NAT)"]
        },
        tools: [
            { name: "Cisco NAT Gateway Router", layer: "Layer 3 Router", ports: "Inside & Outside WAN Ports", usage: "1:1 IP Address Translation", statusLED: "NAT Active Translation" }
        ],
        procedure: [
            "Identify inside/outside interfaces: `interface FastEthernet0/0`, `ip nat inside`.",
            "Set outside interface: `interface Serial0/0`, `ip nat outside`.",
            "Create static mapping: `ip nat inside source static 192.168.1.10 203.0.113.10`.",
            "Verify NAT translation table: `show ip nat translations`."
        ],
        troubleshooting: {
            problem: "External users cannot ping static NAT public IP 203.0.113.10.",
            hints: ["Verify if `ip nat inside` and `ip nat outside` are configured on correct interfaces."],
            fix: "Execute `ip nat inside` on LAN interface Fa0/0."
        },
        viva: [
            { q: "What is the difference between Inside Local and Inside Global IP addresses?", a: "Inside Local is the private IP assigned inside the LAN. Inside Global is the public IP seen by external internet hosts." },
            { q: "Is Static NAT suitable for giving 100 internal PCs internet access?", a: "No, Static NAT requires 100 public IPs for 100 private PCs. PAT / Dynamic NAT Overload is required instead." }
        ],
        assignment: "Configure Static NAT for an internal Web Server (192.168.1.100 -> 203.0.113.50). Test HTTP access from external client.",
        references: [{ title: "RFC 3022 - Traditional NAT Specification", link: "https://datatracker.ietf.org/doc/html/rfc3022" }],
        simType: "cli"
    },
    'dynamic_nat': {
        title: "Dynamic NAT & PAT Overload",
        aim: "To implement Port Address Translation (PAT / NAT Overload) translating multiple internal hosts onto a single public IP address.",
        intro: {
            summary: "PAT (Port Address Translation) multiplexes thousands of private IP addresses onto a single public IP address using unique TCP/UDP port numbers.",
            importance: "PAT is the primary technology enabling internet connectivity for homes and enterprises worldwide despite IPv4 address depletion.",
            applications: ["Home Wi-Fi Routers", "Enterprise Internet Egress", "Mobile Cellular Carrier NAT (CGNAT)"],
            outcome: "Students will configure Access Control Lists (ACLs), NAT Overload rules, and inspect port multiplexing entries."
        },
        prerequisites: ["Practical 14: Static NAT 1:1 Mapping", "Practical 12: UDP & TCP Transport Protocols"],
        outcomes: [
            "Configure Standard ACLs to select LAN subnets for NAT.",
            "Configure PAT Overload (`ip nat inside source list 1 interface Serial0/0 overload`).",
            "Inspect active port translation mappings (`show ip nat translations`)."
        ],
        theory: {
            intro: "PAT (NAT Overload) assigns unique high-numbered source port numbers to distinguish concurrent internal host connections sharing a single public IP address.",
            cards: [
                { title: "NAT Pool", content: "Defines range of available public IP addresses provided by ISP." },
                { title: "Overload Keyword", content: "Enables port multiplexing so hundreds of internal hosts share one public IP." }
            ],
            formulas: ["Max PAT Concurrent Ports = 65,535 per Public IP"],
            standards: ["RFC 3022 - Traditional IP Network Address Translator (NAT / PAT)"]
        },
        tools: [
            { name: "Cisco PAT Edge Router", layer: "Layer 3 Router", ports: "Inside LAN & Outside WAN", usage: "Port Address Translation", statusLED: "PAT Multiplex Active" }
        ],
        procedure: [
            "Create Access List matching internal LAN: `access-list 1 permit 192.168.1.0 0.0.0.255`.",
            "Configure PAT Overload: `ip nat inside source list 1 interface Serial0/0 overload`.",
            "Simulate simultaneous web requests from PC1, PC2, and PC3.",
            "Inspect translated port numbers in `show ip nat translations`."
        ],
        troubleshooting: {
            problem: "Only the first PC can access internet; other PCs fail.",
            hints: ["Check if the `overload` keyword was omitted from `ip nat inside source` command."],
            fix: "Append `overload` to the end of the `ip nat inside source list 1 interface Serial0/0 overload` command."
        },
        viva: [
            { q: "How does PAT distinguish between traffic coming from two different internal PCs using the same public IP?", a: "By assigning a unique source port number to each connection." },
            { q: "How many maximum concurrent socket connections can PAT support on a single public IP?", a: "Approximately 65,535 concurrent connections (based on 16-bit port numbers)." }
        ],
        assignment: "Configure PAT Overload for LAN subnet 192.168.10.0/24 sharing public IP 203.0.113.1. Verify concurrent pings.",
        references: [{ title: "RFC 3022 - NAT/PAT Specification", link: "https://datatracker.ietf.org/doc/html/rfc3022" }],
        simType: "cli"
    }
};

// Legacy key alias mappings for 100% backwards compatibility with old bookmarks / localStorage keys
window.VLAB_DATA['cables_devices'] = window.VLAB_DATA['intro_tools'];
window.VLAB_DATA['modulation'] = window.VLAB_DATA['lan_cables'];
window.VLAB_DATA['csma'] = window.VLAB_DATA['topologies'];
window.VLAB_DATA['csma_ca'] = window.VLAB_DATA['topologies'];
window.VLAB_DATA['subnet'] = window.VLAB_DATA['subnetting'];
window.VLAB_DATA['routing_protocols'] = window.VLAB_DATA['routing_ospf'];
window.VLAB_DATA['routing_dv'] = window.VLAB_DATA['routing_rip'];
window.VLAB_DATA['routing_ls'] = window.VLAB_DATA['routing_eigrp'];
window.VLAB_DATA['udp'] = window.VLAB_DATA['udp_tcp'];
window.VLAB_DATA['tcp'] = window.VLAB_DATA['udp_tcp'];
window.VLAB_DATA['dns'] = window.VLAB_DATA['dhcp_config'];
window.VLAB_DATA['vlan'] = window.VLAB_DATA['vlan_sim'];
window.VLAB_DATA['rip_sim'] = window.VLAB_DATA['routing_rip'];
window.VLAB_DATA['rip'] = window.VLAB_DATA['routing_rip'];
window.VLAB_DATA['ospf_sim'] = window.VLAB_DATA['routing_ospf'];
window.VLAB_DATA['ospf'] = window.VLAB_DATA['routing_ospf'];

