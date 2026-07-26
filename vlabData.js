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
        title: "Network Topologies: Bus, Star, Ring, Mesh, Tree",
        aim: "To build and simulate physical and logical topologies (Bus, Star, Ring, Mesh, Tree) and evaluate fault tolerance.",
        intro: {
            summary: "Physical topology determines the layout of inter-device links, while logical topology defines data frame propagation.",
            importance: "Topology choice impacts network installation cost, scalability, cabling complexity, and fault tolerance.",
            applications: ["Data Center Spine-Leaf", "CAN Campus Networks", "Industrial Token Ring"],
            outcome: "Students will construct Bus, Star, Ring, Mesh, and Tree topologies and test single-point-of-failure scenarios."
        },
        prerequisites: ["Practical 1: Introduction to Networking Tools"],
        outcomes: [
            "Build Star, Bus, Ring, Mesh, and Hybrid topologies.",
            "Calculate total required cable links: N(N-1)/2 for full mesh.",
            "Analyze single-point-of-failure impact across topologies."
        ],
        theory: {
            intro: "Topology defines physical layout and logical data flow path between nodes. Star topology utilizes a central switch, Bus uses a backbone cable, Ring forms a closed loop, and Mesh provides redundant links.",
            cards: [
                { title: "Star Topology", content: "Central node failure collapses network, but individual link failure affects single node." },
                { title: "Full Mesh", content: "Provides maximum redundancy with N(N-1)/2 physical links for high fault tolerance." }
            ],
            formulas: ["Full Mesh Links = N * (N - 1) / 2", "Star Topology Links = N"],
            standards: ["IEEE 802.3 Star Ethernet", "IEEE 802.5 Token Ring"]
        },
        tools: [
            { name: "24-Port L2 Switch", layer: "Layer 2", ports: "24x FE Ports", usage: "Star topology hub/switch node", statusLED: "Green (Link Active)" }
        ],
        procedure: [
            "Select Star Topology mode in the simulator workspace.",
            "Connect 4 PCs to a central 24-Port Layer-2 Switch.",
            "Assign IP addresses 10.0.0.1 through 10.0.0.4 to the PCs.",
            "Simulate frame transmission from PC1 to PC3 and monitor ARP broadcast."
        ],
        troubleshooting: {
            problem: "Bus topology network drops all packets.",
            hints: ["Check if cable terminators are connected at both ends of backbone."],
            fix: "Attach 50-ohm BNC terminators to both ends of the bus cable."
        },
        viva: [
            { q: "How many links are required to connect 6 nodes in a Full Mesh topology?", a: "6 * (6 - 1) / 2 = 15 links." },
            { q: "What is the main advantage of a Star topology over a Bus topology?", a: "A cable failure in a Star topology only disconnects one computer, whereas in a Bus topology it downs the entire network." }
        ],
        assignment: "Calculate the total link count for 10 nodes in Full Mesh vs Star topology. Draw both layouts.",
        references: [{ title: "Cisco Campus Network Design Guide", link: "https://www.cisco.com" }],
        simType: "pkt_tracer"
    },
    'ip_class': {
        title: "IPv4 & IPv6 Address Classification",
        aim: "To analyze IPv4 address classes (A, B, C, D, E), network/host boundary bits, loopback ranges, and IPv6 128-bit hex notation.",
        intro: {
            summary: "IP addressing provides logical identification for network layer routing. IPv4 uses 32-bit addresses while IPv6 expands to 128 bits.",
            importance: "Proper IP classification is fundamental to designing subnets, routing tables, and firewall rules.",
            applications: ["Global Internet Routing", "Private Corporate Intranets", "IoT IPv6 Deployment"],
            outcome: "Students will classify IPv4 addresses, extract Network/Host IDs, and format IPv6 hexadecimal blocks."
        },
        prerequisites: ["Binary to Decimal conversion basics"],
        outcomes: [
            "Identify Class A, B, C, D, E from the first octet.",
            "Separate Network Portion and Host Portion bits.",
            "Recognize Private RFC 1918 address ranges."
        ],
        theory: {
            intro: "IPv4 uses 32-bit addresses divided into Class A (1-126), Class B (128-191), Class C (192-223), Class D Multicast (224-239), and Class E (240-254). IPv6 uses 128-bit hex notation.",
            cards: [
                { title: "Classful Subnetting", content: "Class A defaults to /8, Class B defaults to /16, and Class C defaults to /24." },
                { title: "Private IP Ranges (RFC 1918)", content: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 are non-routable on public internet." }
            ],
            formulas: ["Usable IPv4 Hosts = 2^(Host Bits) - 2", "Total IPv4 Space = 2^32 = 4,294,967,296"],
            standards: ["RFC 791 - Internet Protocol Specification", "RFC 1918 - Address Allocation for Private Internets"]
        },
        tools: [
            { name: "IP Classifier & Subnet Calculator", layer: "Layer 3 Utility", ports: "Software Tool", usage: "Binary conversion & Octet extraction", statusLED: "Calculated Output" }
        ],
        procedure: [
            "Enter target IP address into the IPv4 Classifier module.",
            "Determine First Octet value and identify Class type (A, B, C, D, E).",
            "Calculate Default Subnet Mask, Network ID, and Broadcast ID.",
            "Convert IPv4 address to 32-bit binary representation."
        ],
        troubleshooting: {
            problem: "IP 127.0.0.1 cannot be assigned to an Ethernet host card.",
            hints: ["127.0.0.0/8 is reserved for internal loopback testing."],
            fix: "Use a valid host address like 192.168.1.50."
        },
        viva: [
            { q: "Why are 2 addresses subtracted when calculating usable hosts?", a: "One address is reserved for the Network ID and one for the Direct Broadcast Address." },
            { q: "What is the range of Class C first octet in decimal?", a: "192 to 223." }
        ],
        assignment: "Classify 172.20.15.5, 10.50.1.100, 192.168.5.1, and 224.0.0.1 into Class, Subnet Mask, and Private/Public status.",
        references: [{ title: "RFC 791 - IPv4 Specification", link: "https://datatracker.ietf.org/doc/html/rfc791" }],
        simType: "interactive_calc"
    },
    'lan_cables': {
        title: "LAN Setup & Cabling",
        aim: "To construct EIA/TIA 568A and 568B RJ-45 twisted pair cabling standards (Straight-Through vs Crossover) for LAN connections.",
        intro: {
            summary: "Physical layer transmission depends on structured copper cabling. Pinout alignment dictates successful full-duplex Ethernet link establishment.",
            importance: "Incorrect cable wiring causes physical link drops, late collisions, and excessive packet error rates.",
            applications: ["Structured Building Cabling", "Patch Panel Wiring", "Data Center Interconnects"],
            outcome: "Students will learn T568A/T568B color pinouts and crimp Straight-Through vs Crossover cables."
        },
        prerequisites: ["Practical 1: Introduction to Networking Tools"],
        outcomes: [
            "Arrange T568B color-coded wires in order.",
            "Differentiate Straight-Through from Crossover pinouts.",
            "Perform cable continuity testing across 8 RJ-45 pins."
        ],
        theory: {
            intro: "Straight-Through cables connect different device types (PC to Switch), while Crossover cables connect similar device types (Switch to Switch, PC to PC).",
            cards: [
                { title: "T568B Standard", content: "Pinout order: Orange-White, Orange, Green-White, Blue, Blue-White, Green, Brown-White, Brown." },
                { title: "Crossover Cable", content: "Swaps Pins 1 & 3 (TX+ to RX+) and Pins 2 & 6 (TX- to RX-)." }
            ],
            formulas: ["Max CAT6 Distance = 100 Meters (328 Feet)", "Ethernet Pins Used = Pins 1, 2, 3, 6 for 10/100 Mbps"],
            standards: ["ANSI/TIA-568.2-D Balanced Twisted-Pair Cabling Standard"]
        },
        tools: [
            { name: "RJ-45 Crimping Tool & Cable Tester", layer: "Physical Layer 1", ports: "8P8C Modular Jack", usage: "Terminates CAT6 cable ends and verifies 8-pin electrical continuity", statusLED: "LEDs 1-8 Sequence Light" }
        ],
        procedure: [
            "Select T568B pinout arrangement on the interactive wiring crimping tool.",
            "Arrange 8 color-coded copper wires in correct order.",
            "Crimp RJ-45 connector onto CAT6 Ethernet cable.",
            "Test continuity across all 8 pins with the Virtual Cable Tester."
        ],
        troubleshooting: {
            problem: "Cable tester shows Pin 3 LED is dark.",
            hints: ["Pin 3 wire (Green-White) is broken or not fully crimped."],
            fix: "Strip cable, re-align wires to T568B, and recrimp RJ-45 connector."
        },
        viva: [
            { q: "What is the color sequence for T568B standard?", a: "White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown." },
            { q: "When do you use a Crossover cable?", a: "When connecting similar OSI layer devices directly (e.g. PC to PC, Switch to Switch)." }
        ],
        assignment: "Crimp both ends of a cable using T568B standard and document pin continuity test results.",
        references: [{ title: "TIA-568 Cabling Standard Documentation", link: "https://tiaonline.org" }],
        simType: "cable_crimp"
    },
    'subnetting': {
        title: "Subnetting, VLSM & CIDR",
        aim: "To divide network blocks using Variable Length Subnet Masking (VLSM) and Classless Inter-Domain Routing (CIDR) notation.",
        intro: {
            summary: "Subnetting divides large IP networks into smaller, manageable sub-networks to conserve IPv4 space and limit broadcast domains.",
            importance: "VLSM is essential for efficient IP allocation in corporate networks, avoiding wasted IP addresses.",
            applications: ["ISP IP Block Distribution", "Departmental Network Isolation", "Cloud VPC Subnetting"],
            outcome: "Students will calculate subnet masks, CIDR prefixes, block sizes, and custom host ranges."
        },
        prerequisites: ["Practical 4: IPv4 Address Classification"],
        outcomes: [
            "Calculate CIDR prefixes (/24 to /30).",
            "Perform VLSM allocation for varying departmental size requirements.",
            "Determine Network ID, First Usable IP, Last Usable IP, and Broadcast ID."
        ],
        theory: {
            intro: "Subnetting borrows host bits to create sub-networks, reducing broadcast domain sizes and preventing IPv4 address exhaustion.",
            cards: [
                { title: "VLSM Allocation", content: "Allocates custom subnet masks based on specific host count requirements per department." },
                { title: "Block Size Rule", content: "Block Size = 256 - Subnet Octet Value. Next network ID = Previous Network ID + Block Size." }
            ],
            formulas: ["Subnet Count = 2^(Borrowed Bits)", "Usable Hosts = 2^(Remaining Host Bits) - 2"],
            standards: ["RFC 1519 - Classless Inter-Domain Routing (CIDR)", "RFC 1878 - Variable Length Subnet Masks"]
        },
        tools: [
            { name: "VLSM Matrix Calculator", layer: "Layer 3 Tool", ports: "Software Engine", usage: "Computes subnets based on host demands", statusLED: "Subnet Table Rendered" }
        ],
        procedure: [
            "Enter base network address 192.168.1.0/24 in the Subnet Calculator.",
            "Specify host requirements for Sales (50 hosts), HR (20 hosts), and IT (10 hosts).",
            "Calculate custom subnet masks, network addresses, and usable host ranges.",
            "Verify VLSM address assignment table."
        ],
        troubleshooting: {
            problem: "Hosts in IT department (/28 mask) cannot ping Sales department (/26 mask).",
            hints: ["Check if subnets overlap in host range allocation.", "Ensure router subinterfaces have correct gateway IPs."],
            fix: "Adjust IT subnet starting IP to 192.168.1.64/28."
        },
        viva: [
            { q: "What is the subnet mask for a /27 prefix?", a: "255.255.255.224." },
            { q: "How many usable hosts does a /30 subnet provide?", a: "2 usable hosts (used for point-to-point router serial links)." }
        ],
        assignment: "Subnet 10.0.0.0/16 for 4 departments requiring 500, 200, 50, and 10 hosts using VLSM.",
        references: [{ title: "RFC 1519 - CIDR Specification", link: "https://datatracker.ietf.org/doc/html/rfc1519" }],
        simType: "interactive_calc"
    },
    'vlan': {
        title: "Virtual LANs & IEEE 802.1Q Trunking",
        aim: "To configure VLANs (VLAN 10, VLAN 20) on a Cisco switch and enable IEEE 802.1Q trunking links across switches.",
        intro: {
            summary: "VLANs partition a physical Layer-2 switch into multiple virtual broadcast domains, enhancing security and bandwidth management.",
            importance: "VLANs isolate sensitive network traffic (e.g. Finance vs Student WiFi) without requiring separate physical switches.",
            applications: ["Corporate Department Isolation", "VoIP Dedicated Voice VLANs", "Multi-Tenant Cloud Data Centers"],
            outcome: "Students will create VLANs, assign access ports, and configure IEEE 802.1Q trunking ports."
        },
        prerequisites: ["Practical 1: Introduction to Networking Tools", "Practical 6: Subnetting"],
        outcomes: [
            "Create VLAN IDs and names on Cisco switches.",
            "Assign switch ports to specific Access VLANs.",
            "Configure 802.1Q Trunk links between switch interconnects."
        ],
        theory: {
            intro: "VLANs logically segment a physical L2 switch into isolated broadcast domains. 802.1Q trunk ports append 4-byte VLAN tags to Ethernet frames sent across switch interconnects.",
            cards: [
                { title: "Access Port", content: "Carries traffic for a single assigned VLAN without frame tagging." },
                { title: "Trunk Port (802.1Q)", content: "Carries traffic for multiple VLANs by inserting a 4-byte Tag Protocol ID (TPID 0x8100)." }
            ],
            formulas: ["Max VLAN ID Range = 1 to 4094", "IEEE 802.1Q Tag Size = 4 Bytes"],
            standards: ["IEEE 802.1Q Virtual Bridged Local Area Networks", "IEEE 802.1p Traffic Class Expediting"]
        },
        tools: [
            { name: "Cisco 2960 L2 Switch CLI", layer: "Layer 2 Switch", ports: "Ports 1-24 FE, 2x GE Trunk", usage: "VLAN creation & port tagging", statusLED: "Amber/Green Tag Status" }
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
    'routing_rip': {
        title: "Distance Vector Routing - RIP",
        aim: "To configure Routing Information Protocol (RIP v2) on multi-router topologies and inspect hop-count routing tables.",
        intro: {
            summary: "RIP is a classic Distance-Vector routing protocol using Hop Count as its distance metric to route IP packets across subnets.",
            importance: "Understanding RIP introduces fundamental dynamic routing concepts including periodic updates, split horizon, and route poisoning.",
            applications: ["Small Enterprise Networks", "Legacy Branch Office Interconnects"],
            outcome: "Students will enable RIPv2, advertise network blocks, and analyze routing tables."
        },
        prerequisites: ["Practical 11: Static Routing Configuration"],
        outcomes: [
            "Enable RIPv2 process on Cisco Routers.",
            "Advertise directly connected network subnets.",
            "Verify convergence and inspect RIP route metric (hop count)."
        ],
        theory: {
            intro: "RIP is a Distance Vector routing protocol using Hop Count as its metric (maximum 15 hops). RIPv2 uses multicast 224.0.0.9 and supports CIDR/VLSM.",
            cards: [
                { title: "Split Horizon", content: "Prevents routing loops by not advertising a route back out the interface it was learned from." },
                { title: "RIP Updates", content: "Broadcasting complete routing tables every 30 seconds to neighboring routers." }
            ],
            formulas: ["Max RIP Hop Count = 15 (16 = Unreachable)", "Periodic Update Timer = 30 Seconds"],
            standards: ["RFC 2453 - RIP Version 2"]
        },
        tools: [
            { name: "Cisco 2911 Router CLI", layer: "Layer 3 Router", ports: "Serial & Gigabit Ports", usage: "Runs RIP v2 routing process", statusLED: "Routing Convergence Green" }
        ],
        procedure: [
            "Access Router R1 and R2 CLI terminals.",
            "Execute `router rip` and set version 2 using `version 2`.",
            "Advertise directly connected networks: `network 192.168.1.0`, `network 10.0.0.0`.",
            "Verify convergence by executing `show ip route`."
        ],
        troubleshooting: {
            problem: "R1 does not learn RIP routes from R2.",
            hints: ["Ensure `version 2` is set on both routers.", "Verify interface subnets match."],
            fix: "Execute `version 2` and `no auto-summary` on R1 and R2."
        },
        viva: [
            { q: "What is the maximum hop count allowed in RIP?", a: "15 hops (a hop count of 16 signifies infinity/unreachable)." },
            { q: "What multicast address does RIPv2 use?", a: "224.0.0.9." }
        ],
        assignment: "Build a 3-router topology running RIPv2. Document the routing table output of the center router.",
        references: [{ title: "RFC 2453 - RIP v2 Specification", link: "https://datatracker.ietf.org/doc/html/rfc2453" }],
        simType: "cli"
    },
    'routing_ospf': {
        title: "Link State Routing - OSPF",
        aim: "To implement Open Shortest Path First (OSPF Area 0) dynamic routing using Dijkstra's SPF algorithm.",
        intro: {
            summary: "OSPF is a high-performance Link-State Interior Gateway Protocol (IGP) widely deployed in enterprise networks for fast convergence.",
            importance: "OSPF scales efficiently to large multi-area networks using link-state advertisements (LSAs) and Dijkstra's algorithm.",
            applications: ["Enterprise Campus Core", "Data Center Fabric Routing", "Service Provider Core"],
            outcome: "Students will configure Single-Area OSPF Area 0, set Router IDs, wildcard masks, and inspect SPF neighbor states."
        },
        prerequisites: ["Practical 8: Distance Vector Routing - RIP"],
        outcomes: [
            "Configure Single-Area OSPF (Area 0).",
            "Calculate OSPF cost metric (Cost = Reference Bandwidth / Bandwidth).",
            "Verify Full OSPF Neighbor Adjacency."
        ],
        theory: {
            intro: "OSPF is an open-standard Link-State protocol. It maintains Link-State Advertisements (LSAs) in a topology table and calculates shortest path trees based on Interface Cost (Cost = 10^8 / Bandwidth).",
            cards: [
                { title: "Wildcard Mask", content: "Used in OSPF network commands (e.g. 0.0.0.255 for /24 network)." },
                { title: "Area 0 Backbone", content: "All OSPF non-backbone areas must connect to Backbone Area 0." }
            ],
            formulas: ["OSPF Cost = 10^8 / Bandwidth (bps)", "Default Reference Bandwidth = 100 Mbps"],
            standards: ["RFC 2328 - OSPF Version 2 Specification"]
        },
        tools: [
            { name: "Cisco 2911 Router CLI", layer: "Layer 3 Router", ports: "GigabitEthernet interfaces", usage: "OSPF process & Dijkstra computation", statusLED: "Neighbor FULL State LED" }
        ],
        procedure: [
            "Enter router configuration mode: `router ospf 1`.",
            "Configure network areas: `network 192.168.1.0 0.0.0.255 area 0`.",
            "Configure Router ID: `router-id 1.1.1.1`.",
            "Verify OSPF neighbor status: `show ip ospf neighbor`."
        ],
        troubleshooting: {
            problem: "OSPF neighbor state stuck in INIT / 2-WAY.",
            hints: ["Check if Hello/Dead timers match on both router ends.", "Ensure Area IDs match (Area 0)."],
            fix: "Verify wildcard mask and Area ID on interface configuration."
        },
        viva: [
            { q: "What algorithm does OSPF use to calculate shortest paths?", a: "Dijkstra's Shortest Path First (SPF) algorithm." },
            { q: "What is the administrative distance (AD) of OSPF?", a: "110." }
        ],
        assignment: "Configure OSPF Area 0 across 3 routers. Change reference bandwidth and record new interface costs.",
        references: [{ title: "RFC 2328 - OSPF v2", link: "https://datatracker.ietf.org/doc/html/rfc2328" }],
        simType: "cli"
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

