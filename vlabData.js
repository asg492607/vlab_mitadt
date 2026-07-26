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
                    title: "Chapter 1 & 2: Introduction & What is a Computer Network?",
                    content: "Computer networks have become an essential part of modern life. Every time we browse a website, send an email, attend an online class, stream a video, or transfer files between computers, we are using a computer network. A computer network allows two or more computing devices to communicate, exchange data, and share resources efficiently.\n\nA network can be as small as two computers connected by a cable or as large as the Internet, connecting billions of devices worldwide. The primary goal of networking is to enable communication, resource sharing, collaboration, and centralized management.\n\nInterconnected devices include: Desktop Computers, Laptops, Mobile Phones, Servers, Switches, Routers, Printers, Wireless Access Points, Firewalls, and IoT Devices."
                },
                {
                    title: "Chapter 3: Why Computer Networks are Important",
                    content: "Computer networks provide indispensable advantages across educational institutions, businesses, hospitals, industries, and government organizations:\n\n1. Sharing files & databases between users\n2. High-speed Internet & Cloud access\n3. Printer & Hardware resource sharing\n4. Email & Instant messaging communication\n5. Real-time Video conferencing\n6. Cloud computing & Distributed storage\n7. Online banking & E-commerce transactions\n8. Remote work & Enterprise VPNs\n9. E-learning platforms & Digital Virtual Labs\n10. Network security monitoring & Centralized audit"
                },
                {
                    title: "Chapter 4: Types of Computer Networks (PAN, LAN, MAN, WAN)",
                    content: "• Personal Area Network (PAN):\n  - Range: 1–10 meters.\n  - Connects personal devices within a short distance (Bluetooth headset, smartwatch, wireless keyboard, mobile hotspot).\n\n• Local Area Network (LAN):\n  - Connects computers inside a limited geographical area (Computer lab, school, office building, library).\n  - Characteristics: High speed, low latency, privately owned.\n\n• Metropolitan Area Network (MAN):\n  - Connects multiple LANs across a city or metropolitan region (University campus, municipal offices, cable TV networks).\n\n• Wide Area Network (WAN):\n  - Connects computers across countries or continents (e.g. The Internet).\n  - Characteristics: Large geographical coverage, uses routers, interconnects multiple LANs."
                },
                {
                    title: "Chapter 5: Network Topology Overview",
                    content: "A topology describes the physical layout and logical path of interconnected nodes in a network:\n\n• Bus Topology: Nodes connected to a single central backbone cable with terminators at both ends.\n• Star Topology: All nodes connect to a central Switch/Hub. High fault tolerance.\n• Ring Topology: Closed loop where data travels in one direction through token passing.\n• Mesh Topology: Every node has dedicated links to every other node (Full Mesh = N*(N-1)/2 links).\n• Tree Topology: Hierarchical arrangement combining star and bus topologies.\n• Hybrid Topology: Combination of two or more different topologies (e.g. Star-Ring).\n\n(Note: Topology design and fault tolerance will be studied in detail in Practical 3)."
                },
                {
                    title: "Chapter 6A: Layer 1 Devices — Hub & Repeater",
                    content: "• Hub (Layer 1 Physical Device):\n  - Definition: Multi-port Layer-1 device that repeats incoming electrical signals to EVERY connected port.\n  - Working: Receives signal on one port and broadcasts it to all other ports without learning MAC addresses.\n  - Advantages: Cheap, easy to install.\n  - Disadvantages: Creates a single collision domain, highly inefficient, insecure.\n  - Applications: Small legacy networks.\n\n• Repeater (Layer 1 Physical Device):\n  - Definition: 2-port Layer-1 device that regenerates attenuated electrical or optical signals to extend maximum physical cable distance."
                },
                {
                    title: "Chapter 6B: Layer 2 Devices — Switch & Bridge",
                    content: "• Switch (Layer 2 Data Link Device):\n  - Definition: Multi-port Layer-2 device that forwards Ethernet frames using MAC addresses.\n  - Working: Learns source MAC addresses, maintains a dynamic MAC Address Table, and forwards frames ONLY to the destination port.\n  - Advantages: Faster forwarding, zero collision domain per port, high security, full-duplex.\n  - Applications: Enterprise & Campus LANs.\n\n• Bridge (Layer 2 Data Link Device):\n  - Definition: 2-port Layer-2 device used to connect and filter traffic between two LAN segments based on MAC addresses."
                },
                {
                    title: "Chapter 6C: Layer 3 & Core Devices — Router, Gateway, Modem, Firewall, WAP",
                    content: "• Router (Layer 3 Network Device): Connects different subnets using IP addresses. Handles routing, packet forwarding, Internet access, NAT, and DHCP. Applications: Home Wi-Fi routers, Enterprise routers, ISP core routers.\n• Gateway: Connects networks with different protocols (e.g. IPv4 ↔ IPv6).\n• Modem: Performs Modulation (Digital → Analog) and Demodulation (Analog → Digital) for ISP connection.\n• Firewall: Filters incoming/outgoing traffic based on security rules (Hardware or Software).\n• Wireless Access Point (WAP): Provides wireless Wi-Fi connectivity to a wired LAN."
                },
                {
                    title: "Chapter 6D: End-Node Hosts — Server & Client",
                    content: "• Server: Powerful central computer that provides network services to clients.\n  - Examples: Web Server (HTTP/HTTPS), Database Server (SQL), DNS Server (Domain Name Resolution), DHCP Server (IP Lease), Mail Server (SMTP/IMAP), File Server (FTP/SMB).\n\n• Client: End-user computing device that requests services from servers.\n  - Examples: Desktop PC, Laptop, Mobile Smartphone, Tablet."
                },
                {
                    title: "Chapter 7: Networking Cables (Twisted Pair, Coaxial, Fiber Optic)",
                    content: "• Twisted Pair Cable:\n  - Categories: Cat5 (100Mbps), Cat5e (1Gbps), Cat6 (1Gbps/10Gbps up to 55m), Cat6A (10Gbps), Cat7 (10Gbps shielded), Cat8 (40Gbps).\n\n• Straight-Through Cable:\n  - Definition: Identical wiring standard on both ends (T568B to T568B).\n  - Used Between: Different device types (PC → Switch, Switch → Router).\n\n• Crossover Cable:\n  - Definition: Swapped wiring pinout on one end (Pin 1&3 TX/RX, Pin 2&6).\n  - Used Between: Similar device types (PC → PC, Switch → Switch, Router → Router).\n\n• Coaxial Cable: Copper core shielded by braided mesh. Used for Cable TV & old BNC Ethernet.\n\n• Fiber Optic Cable: Transmits data as light pulses inside glass cores.\n  - Single Mode: Thin core (~9µm), laser light source, long distance (up to 40km).\n  - Multi Mode: Thicker core (~50/62.5µm), LED light source, short distance (up to 550m inside buildings)."
                },
                {
                    title: "Chapter 8: Physical Connectors",
                    content: "• RJ45: 8P8C modular connector used for Ethernet twisted pair cables (Cat5e/Cat6).\n• RJ11: 6P4C connector used for telephone and ADSL modem lines.\n• BNC: Bayonet Neill–Concelman connector used for coaxial cabling.\n• LC (Lucent Connector): Small form-factor push-pull fiber optic connector.\n• SC (Subscriber Connector): Square push-pull fiber optic connector.\n• ST (Straight Tip): BNC-style bayonet fiber optic connector.\n• USB Ethernet Adapter: External dongle converting USB port to RJ45 Ethernet."
                },
                {
                    title: "Chapter 9: Network Interface Card (NIC)",
                    content: "A Network Interface Card (NIC) is a hardware circuit board installed in a device that enables connection to a network:\n\n• Functions: Converts digital parallel data into serial electrical or optical signals for transmission.\n• MAC Address: Permanent 48-bit physical address burned into NIC ROM.\n• Link LEDs: Visual indicators showing physical connection and data activity.\n• Speed: Supports 10 Mbps, 100 Mbps (Fast Ethernet), 1000 Mbps (Gigabit Ethernet), or 10 Gbps.\n• Duplex: Half-Duplex (Send OR Receive, like Walkie-Talkie) vs Full-Duplex (Send AND Receive simultaneously, like Telephone)."
                },
                {
                    title: "Chapter 10: Hardware Interfaces & Ports",
                    content: "• Ethernet Port (10 Mbps): Legacy copper interface.\n• Fast Ethernet Port (100 Mbps): Standard 100Base-TX interface (Fa0/1).\n• Gigabit Ethernet Port (1000 Mbps): High-speed 1000Base-T interface (Gi0/1).\n• Serial Port (DB-60 / Smart Serial): Used for point-to-point WAN router links.\n• Console Port (RJ-45 / USB): Used for out-of-band CLI initial configuration of Cisco routers/switches.\n• Fiber Port (SFP): Small Form-factor Pluggable slot for modular fiber transceivers."
                },
                {
                    title: "Chapter 11: MAC Address (Media Access Control)",
                    content: "A MAC address is a 48-bit (6-byte) physical hardware address unique to every Network Interface Card globally:\n\n• Format: 12 Hexadecimal digits grouped in pairs separated by colons or hyphens.\n• Example: 00:1A:2B:3C:4D:5E\n\n• Structure Breakdown:\n  - First 24 Bits (00:1A:2B): Organizationally Unique Identifier (OUI) assigned by IEEE to the manufacturer (e.g. Cisco, Intel, Apple).\n  - Last 24 Bits (3C:4D:5E): Unique Network Interface controller serial number assigned by the manufacturer."
                },
                {
                    title: "Chapter 12: Device Status LEDs",
                    content: "LED status indicators on Switches, Routers, and NICs provide real-time diagnostic information:\n\n• Power LED: Solid Green = Powered ON; Dark = No Power.\n• Link LED: Solid Green = Physical link established (Carrier Detect); Dark = Cable unplugged or link down.\n• Activity LED: Flashing Green = Data packets currently being transmitted or received.\n• Speed LED: Green = Gigabit speed (1000 Mbps); Amber = Fast Ethernet speed (100 Mbps); Dark = 10 Mbps.\n• PoE LED: Green = Power over Ethernet actively supplied to connected IP Phone or WAP."
                },
                {
                    title: "Chapter 13 & 14: Data Transmission & Real-World Network Example",
                    content: "Data Transmission Flow Path:\nSender Workstation → Cable → Layer 2 Switch → Layer 3 Router → ISP WAN → Destination Server\n\nReal-World Enterprise Topology Layout:\nInternet Gateway\n      │\nEnterprise Router\n      │\nCore Switch\n  ├── PC1 (Sales)\n  ├── PC2 (HR)\n  ├── Laptop (Wi-Fi)\n  ├── Network Printer\n  └── Central File Server\n\nData Flow Example: PC1 sends a file to the File Server. PC1 encapsulates data into an IP packet and Ethernet frame. The Switch receives the frame on Port Fa0/1, inspects the destination MAC address in its MAC Table, and forwards the frame directly out Port Fa0/24 to the File Server."
                },
                {
                    title: "Chapter 15 & 16: Safety Precautions & Summary",
                    content: "Safety Precautions:\n1. Handle fiber optic cables carefully; NEVER look directly into a live optical fiber port (Laser hazard).\n2. Observe cable minimum bending radius; do not kink or crush Ethernet cables.\n3. Power off hardware devices before installing or removing HWIC expansion modules.\n4. Use correct cable types (Straight-Through vs Crossover).\n5. Verify link LED status indicators before running network tests.\n6. Clearly label both ends of every cable during installation.\n\nSummary:\nStudents now understand what a computer network is, network classifications (PAN, LAN, MAN, WAN), L1/L2/L3 devices, copper/fiber cables, connectors, MAC addresses, status LEDs, and data flow. This foundation prepares students for Practical 2 (CLI Commands), Practical 3 (Topologies), and subsequent IP routing & switching labs."
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
            { name: "Cisco 2911 Enterprise Router", layer: "Layer 3 (Network)", ports: "3x GE 10/100/1000, 2x HWIC Serial slots, 1x Console RJ-45", usage: "Inter-VLAN routing, WAN interconnection, NAT, and DHCP service hosting", statusLED: "Green (Link UP), Amber (Boot/Fault)" },
            { name: "Cisco 2960 Enterprise Switch", layer: "Layer 2 (Data Link)", ports: "24x FastEthernet 10/100, 2x Gigabit SFP Fiber Uplinks", usage: "Dedicated port aggregation, MAC table forwarding, and VLAN creation", statusLED: "Green (Solid = Link, Flashing = Activity)" },
            { name: "Ethernet Hub (Multiport Repeater)", layer: "Layer 1 (Physical)", ports: "8x FastEthernet RJ-45", usage: "Broadcast signal repetition across all connected nodes (Legacy)", statusLED: "Solid Green Power, Flashing Collision Amber" },
            { name: "Network Interface Card (NIC)", layer: "Layer 1 & Layer 2", ports: "RJ-45 Copper / SFP Fiber", usage: "Provides 48-bit MAC hardware address and converts data into serial signals", statusLED: "Green (Link UP), Amber (1000Mbps Speed)" },
            { name: "CAT6 Twisted Pair Cable (RJ-45)", layer: "Layer 1 (Physical)", ports: "8P8C Modular RJ-45 Connector", usage: "Transmits electrical signals up to 100 meters at 1 Gbps / 10 Gbps", statusLED: "8-Pin Continuity LED" },
            { name: "Single-Mode / Multi-Mode Fiber Optic", layer: "Layer 1 (Physical)", ports: "LC, SC, ST Connectors", usage: "High-speed light transmission for campus backbones and data centers", statusLED: "Laser / LED Optical Tx/Rx" },
            { name: "Stateful Hardware Firewall", layer: "Layer 3 to Layer 7", ports: "WAN, LAN, DMZ Gigabit Ports", usage: "Inspects packets and enforces access control rules to block malicious traffic", statusLED: "Green (Active Rule Match)" }
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
        title: "Network Commands & CLI Utilities",
        aim: "To execute and master core network diagnostic CLI utilities including ping, traceroute, ipconfig, netstat, nslookup, and arp.",
        intro: {
            summary: "Command-Line Interface (CLI) diagnostic utilities enable network engineers to inspect L3 connectivity, trace packet paths, view active socket connections, and troubleshoot DNS resolutions.",
            importance: "CLI diagnostic tools are essential for diagnosing network latency, packet loss, DNS lookup failures, and address resolution issues.",
            applications: ["ISP Network Diagnostics", "Enterprise Helpdesk Troubleshooting", "Server Socket Audit"],
            outcome: "Students will become proficient in terminal commands `ping`, `tracert`, `ipconfig`, `netstat`, `nslookup`, and `arp`."
        },
        prerequisites: ["Practical 1: Introduction to Networking Tools", "Understanding of IP Addresses and Domain Names"],
        outcomes: [
            "Execute ping to measure packet loss and round-trip time (RTT).",
            "Trace hop-by-hop path using traceroute / tracert.",
            "Inspect local ARP cache and netstat active TCP sockets."
        ],
        theory: {
            intro: "Network diagnostic utilities leverage ICMP, ARP, and DNS protocols to inspect connectivity, routing hops, domain resolution, and active socket connections.",
            cards: [
                { title: "ICMP Ping", content: "Sends Echo Request packets to test L3 reachability and measure round-trip time." },
                { title: "Traceroute", content: "Decrements TTL values sequentially to discover all intermediate router hop IP addresses." },
                { title: "ARP Protocol", content: "Maps 32-bit IPv4 addresses to 48-bit physical MAC addresses." }
            ],
            formulas: ["Packet Loss % = ((Sent - Received) / Sent) * 100", "TTL Initial = 64 (Linux), 128 (Windows)"],
            standards: ["RFC 792 - Internet Control Message Protocol (ICMP)", "RFC 826 - An Ethernet Address Resolution Protocol (ARP)"]
        },
        tools: [
            { name: "Command Prompt / Bash Terminal", layer: "Application Layer CLI", ports: "Virtual Terminal TTY", usage: "CLI command execution", statusLED: "Active Cursor Prompt" }
        ],
        procedure: [
            "Open Command Prompt terminal on the virtual workstation.",
            "Type 'ping 8.8.8.8' and observe ICMP reply packet statistics.",
            "Type 'tracert google.com' to trace intermediate hop routers.",
            "Execute 'arp -a' to view local ARP cache table."
        ],
        troubleshooting: {
            problem: "Ping returns 'Request timed out' for external domain.",
            hints: ["Check default gateway IP configuration.", "Test DNS resolution using 'nslookup domain.com'."],
            fix: "Configure primary DNS server address to 8.8.8.8."
        },
        viva: [
            { q: "What ICMP message type is sent by ping?", a: "ICMP Type 8 (Echo Request) and ICMP Type 0 (Echo Reply)." },
            { q: "How does traceroute discover intermediate routers?", a: "By sending packets with incrementing Time-To-Live (TTL = 1, 2, 3...) and catching ICMP Time Exceeded messages." }
        ],
        assignment: "Execute `netstat -an` on your workstation. Document all active TCP connections in ESTABLISHED state.",
        references: [{ title: "RFC 792 - ICMP Specification", link: "https://datatracker.ietf.org/doc/html/rfc792" }],
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
