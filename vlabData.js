window.VLAB_DATA = {
    csma: {
        title: "Carrier Sense Multiple Access with Collision Detection (CSMA/CD)",
        aim: "To simulate the Carrier Sense Multiple Access with Collision Detection (CSMA/CD) networking technique in order to demonstrate the mechanisms of carrier sensing, data transmission, collision detection via voltage monitoring, and the propagation of jamming signals in a shared network medium.",
        theory: {
            intro: "Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is a media access control method historically used in early Ethernet networks for local area networking. It uses carrier sensing to defer transmissions until no other station is transmitting. If a collision is detected during transmission, the station transmits a jam signal and waits a random time (using a backoff algorithm) before retrying.",
            cards: [
                { 
                    title: "1. The Collision Window & Slot Time", 
                    content: "The collision window is the maximum time required to detect a collision, equivalent to the round-trip propagation delay. The slot time in 10 Mbps Ethernet is defined as 512 bit times (51.2 microseconds). Any collision must be detected within this slot time. To ensure collision detection, the minimum frame size is set to 64 bytes (512 bits): \\n\\n$$\\text{Minimum Frame Size} \\ge 2 \\times \\text{Propagation Delay} \\times \\text{Bandwidth}$$" 
                },
                { 
                    title: "2. Binary Exponential Backoff (BEB) Algorithm", 
                    content: "After $n$ consecutive collisions (up to 10), a station waits a random number of slot times chosen dynamically from the interval $[0, 2^n - 1]$. The maximum backoff interval freezes at $2^{10}-1 = 1023$ for attempts between 10 and 15. If a station fails to transmit after 16 attempts, the frame is discarded, and an error is reported upward." 
                },
                { 
                    title: "3. Carrier Sensing & Jamming Signal", 
                    content: "A device first performs physical carrier sensing (monitoring the channel voltage). If idle (voltage at baseline), it transmits. During transmission, it compares transmitted signals with incoming medium voltage. If a spike is detected, indicating overlapping signals, it stops immediately and broadcasts a 32-bit 'Jam Signal' to ensure all other stations recognize the collision." 
                }
            ]
        },
        pretest: [
            { q: "How does CSMA/CD detect a collision?", options: ["By waiting for an acknowledgment signal", "By continuously monitoring the transmission medium's voltage level", "By using a token-based system", "By sending a preemptive jam signal"], correct: 1 },
            { q: "Why is CSMA/CD not commonly used in modern Ethernet networks?", options: ["Because wireless networks are more efficient", "Because modern Ethernet uses full-duplex point-to-point switch connections", "Because CSMA/CD is not effective at high speeds", "Because token-ring networks have replaced Ethernet"], correct: 1 },
            { q: "What does the 'Carrier Sense' in CSMA/CD refer to?", options: ["A device transmits without checking", "A device listens to the network medium for carrier signals before transmitting", "A device sends a jam signal after every transmission", "A device only transmits when another is sending"], correct: 1 }
        ],
        procedure: [
            "1. Carrier Sense: Listen to the shared coaxial/twisted-pair transmission medium.",
            "2. Idle State: If the medium is idle (no voltage/carrier), begin data transmission.",
            "3. Busy State: If busy, defer transmission and wait until the medium becomes idle.",
            "4. Collision Detection: Monitor network voltage for unexpected spikes (amplitude threshold exceedance) while transmitting.",
            "5. Collision Handling: If a collision is detected, immediately halt data, broadcast a 32-bit Jam Signal, increment the collision count $n$, compute the backoff time, and schedule retransmission."
        ],
        posttest: [
            { q: "What happens when a collision is detected in CSMA/CD?", options: ["Stations stop and wait for a random backoff time", "The detecting station continues transmitting", "The station resends immediately", "All stations stop permanently"], correct: 0 },
            { q: "Which of the following best describes binary exponential backoff?", options: ["A method to increase bandwidth", "A way to ensure no device transmits simultaneously", "An algorithm that increases wait time exponentially after each collision to reduce congestion", "A technique to detect hidden terminals"], correct: 2 },
            { q: "What determines the minimum packet size in Ethernet?", options: ["Switch processing speed", "Propagation delay and collision detection requirements (Slot Time)", "Total number of devices", "Packets sent per second"], correct: 1 }
        ],
        simType: "collision"
    },
    csma_ca: {
        title: "Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA)",
        aim: "To demonstrate the Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA) networking technique by simulating its key mechanisms: carrier sensing, the random backoff algorithm for collision avoidance, and the RTS/CTS handshake to resolve the Hidden Node Problem.",
        theory: {
            intro: "CSMA/CA is used in wireless networks (e.g., IEEE 802.11 Wi-Fi) because wireless transmitters cannot reliably detect collisions. A wireless station's own signal overwhelms its receiver, preventing it from detecting simultaneous transmissions. CSMA/CA aims to avoid collisions entirely by using acknowledgments, virtual carrier sensing, and random contention windows.",
            cards: [
                { 
                    title: "1. The Inter-Frame Spacing (IFS)", 
                    content: "Different inter-frame spaces create access priorities. SIFS (Short Inter-Frame Space) is the shortest, reserved for high-priority transmissions like ACKs and CTS. DIFS (Distributed Inter-Frame Space) is the standard spacing. Stations must sense the channel idle for a full DIFS period before initiating backoff: \\n\\n$$\\text{DIFS} = \\text{SIFS} + (2 \\times \\text{Slot Time})$$" 
                },
                { 
                    title: "2. Virtual Carrier Sensing & NAV", 
                    content: "Virtual carrier sensing uses the Network Allocation Vector (NAV). Every frame contains a 'Duration' field indicating how long the medium is reserved. Listening stations update their internal NAV timer and defer transmission until NAV reaches zero, even if physical sensing indicates an idle medium." 
                },
                { 
                    title: "3. Hidden Node Problem & RTS/CTS", 
                    content: "The hidden node problem occurs when two stations (A and C) can communicate with an Access Point (B) but not with each other. If both send to B, collisions occur. The RTS/CTS handshake solves this: A sends a 'Request to Send' to B. B broadcasts a 'Clear to Send', silencing C (since C hears the CTS and updates its NAV) and granting A exclusive access." 
                }
            ]
        },
        pretest: [
            { q: "Which technique does CSMA/CA use to avoid collisions?", options: ["Carrier Sense, NAV, and Random Backoff", "Collision Detection via Voltage monitoring", "Synchronous Time Slots", "Token Passing"], correct: 0 },
            { q: "Why does CSMA/CA use an acknowledgment (ACK) mechanism?", options: ["Confirm success and trigger retransmission if missing, as collisions cannot be directly detected", "Detect collisions like CSMA/CD", "Allow multiple users simultaneously", "Increase transmission speed"], correct: 0 },
            { q: "What is the primary reason CSMA/CA is used in wireless instead of CSMA/CD?", options: ["Wireless transceivers cannot listen and transmit on the same channel simultaneously (Self-Interference)", "Wireless has higher speeds", "CSMA/CD is more expensive", "Wireless has no collisions"], correct: 0 }
        ],
        procedure: [
            "1. Physical Sensing: Listen to the channel. If busy, defer transmission.",
            "2. DIFS Deferral: Wait until the channel is physically idle for a duration equal to DIFS.",
            "3. Contention & Backoff: Choose a random slot number within the Contention Window (CW). Decrement this slot timer while the channel is idle. If the channel becomes busy, freeze the timer.",
            "4. RTS/CTS Handshake: Send an RTS frame. If the AP responds with a CTS, the virtual carrier sensing (NAV) is set on neighboring nodes.",
            "5. Data & ACK: Transmit the data frame. If a SIFS period passes without receiving an ACK frame, assume transmission failure, double the CW, and return to step 3."
        ],
        posttest: [
            { q: "What is the purpose of the RTS/CTS mechanism?", options: ["Minimize the effect of the hidden node problem by reserving the channel", "Increase speed", "Eliminate all collisions", "Detect errors"], correct: 0 },
            { q: "What happens when multiple devices sense an idle channel in CSMA/CA?", options: ["All transmit immediately", "Each decrements a unique random backoff timer before transmitting", "First device gains control", "All enter collision state"], correct: 1 },
            { q: "How does the backoff mechanism help?", options: ["Forces same wait time", "Introduces random delay before retransmission to minimize repeat collisions", "Retries immediately", "Prevents hidden nodes"], correct: 1 }
        ],
        simType: "csma_ca"
    },
    subnet: {
        title: "Subnetting & Network Design",
        aim: "To master the process of dividing a large network into smaller subnetworks by converting decimal values to binary, determining Network ID sizes, and calculating subnet masks based on specific departmental requirements.",
        theory: {
            intro: "Subnetting is the architectural division of a single physical network into multiple logical sub-networks (subnets). This strategy reduces broadcast domain sizes, enhances security, and allows administrators to allocate IP addresses efficiently.",
            cards: [
                { 
                    title: "1. IP Subnetting Formulas", 
                    content: "To divide a network, bits are borrowed from the host portion. If we borrow $b$ bits, we create $2^b$ subnets. The remaining $H$ host bits determine the number of usable hosts per subnet: \\n\\n$$\\text{Usable Hosts} = 2^H - 2$$ \\n\\nTwo addresses are reserved: the Network Address (host portion all 0s) and the Broadcast Address (host portion all 1s)." 
                },
                { 
                    title: "2. CIDR (Classless Inter-Domain Routing)", 
                    content: "CIDR replaced traditional Class A, B, and C networks with variable-length subnets. It uses a prefix length (e.g., /26) instead of a default class mask. A /26 mask indicates that the first 26 bits are the network prefix, leaving 6 bits ($32 - 26 = 6$) for host addressing ($2^6 - 2 = 62$ usable hosts)." 
                },
                { 
                    title: "3. VLSM (Variable Length Subnet Masking)", 
                    content: "VLSM allows subnets of different sizes to be allocated from a single network block. Instead of assigning a fixed mask to all subnets, masks are customized based on the requirement of each segment (e.g., allocating a /30 subnet for point-to-point links and /24 subnets for user LANs) to avoid wasting IP space." 
                }
            ]
        },
        pretest: [
            { q: "What is the purpose of an IP address?", options: ["Provide a physical hardware address", "Uniquely identify a device on an IP network", "Convert binary to text", "Encrypt traffic"], correct: 1 },
            { q: "What is dotted decimal notation used for?", options: ["Make 32-bit binary IP addresses human-readable", "Convert decimal to binary", "Represent hex values", "Separate Network ID from Host ID"], correct: 0 },
            { q: "Which is the default subnet mask for Class C?", options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], correct: 2 }
        ],
        procedure: [
            "1. Requirement Analysis: Count the number of hosts required for each departmental subnet.",
            "2. Bit Calculation: Find the smallest integer $H$ such that $2^H - 2 \\ge \\text{Required Hosts}$.",
            "3. Subnet Mask Formulation: Determine the prefix CIDR value: $32 - H$. Convert to dotted decimal format.",
            "4. Range Allocation: Calculate the Network ID, usable range, and Broadcast ID for each subnet, starting with the largest subnet block.",
            "5. Configuration: Apply the calculated gateway IP and subnet mask to the local router interfaces."
        ],
        posttest: [
            { q: "What is the binary representation of 5 using 3 bits?", options: ["100", "101", "011", "110"], correct: 1 },
            { q: "To create a subnet for 10 hosts, how many bits are needed for host ID?", options: ["2 bits", "3 bits", "4 bits", "5 bits"], correct: 2 },
            { q: "A network needs 4 subnets. How many bits are required for the Subnet ID?", options: ["1", "2", "3", "4"], correct: 1 }
        ],
        simType: "subnet_calc"
    },
    routing_dv: {
        title: "Distance Vector Routing Algorithm",
        aim: "To understand and simulate the Distance-Vector (DV) routing algorithm, demonstrating its iterative, asynchronous, and distributed nature for computing the shortest paths in a network using the Bellman-Ford equation.",
        theory: {
            intro: "Distance-Vector routing is a dynamic protocol class where each router maintains a table of distances to all known destinations. Routers periodically advertise their complete routing tables to directly connected neighbors, converging on the shortest path through iterative updates.",
            cards: [
                { 
                    title: "1. The Bellman-Ford Equation", 
                    content: "The Bellman-Ford mathematical relation is the core update algorithm in distance vector routing. Let $D_x(y)$ be the cost of the least-cost path from node $x$ to $y$. The cost update is calculated as: \\n\\n$$D_x(y) = \\min_{v} \\{ c(x,v) + D_v(y) \\}$$ \\n\\nwhere $c(x,v)$ is the link cost from $x$ to neighbor $v$, and $D_v(y)$ is neighbor $v$'s cost estimate to destination $y$." 
                },
                { 
                    title: "2. Count-to-Infinity & Loop Prevention", 
                    content: "If a link fails, routers may learn incorrect routes from neighbors who have not processed the failure, causing metric values to increment indefinitely (Count-to-Infinity). To resolve this, protocols use Split Horizon (do not advertise routes back to the neighbor from whom they were learned) and Poison Reverse (advertise failed routes with an infinite metric, e.g., 16 hops in RIP)." 
                },
                { 
                    title: "3. Routing Information Protocol (RIP)", 
                    content: "RIP is the standard implementation of a Distance Vector protocol. It uses hop count as its metric, where each router adds a cost of 1 to incoming advertisements. A hop count of 16 is defined as unreachable, limiting RIP to networks with a maximum diameter of 15 hops." 
                }
            ]
        },
        pretest: [
            { q: "What is the primary function of the DV routing algorithm?", options: ["Encrypt traffic", "Compute shortest paths in a distributed manner", "Assign IP addresses", "Manage physical connections"], correct: 1 },
            { q: "Which describes a key characteristic of the DV algorithm?", options: ["Requires central server", "Synchronous and centralized", "Iterative and distributed", "Focuses on static routes"], correct: 2 },
            { q: "What information does a node send to neighbors?", options: ["Entire routing table", "Neighbor costs only", "Its own distance vector", "List of all nodes"], correct: 2 }
        ],
        procedure: [
            "1. Distance Vector Initialization: Initialize each node's routing table with a cost of 0 to itself, direct link costs to neighbors, and infinity ($\\infty$) to all other destinations.",
            "2. Table Exchange: Periodically broadcast the local distance vector to all directly connected neighbor routers.",
            "3. Execution of Bellman-Ford: Upon receiving updates from a neighbor, recalculate costs using the Bellman-Ford equation.",
            "4. Dynamic Table Updates: Update local next-hop and metric settings if a lower-cost path is discovered.",
            "5. Convergence Observation: Observe how routing tables stabilize when no further updates modify any distance metrics."
        ],
        posttest: [
            { q: "Which mathematical equation is used to update a node's distance vector?", options: ["D(y) = max{c + D}", "D(y) = min{c + D}", "D(y) = sum{c * D}", "D(y) = D / c"], correct: 1 },
            { q: "What happens when a node updates its distance vector?", options: ["Resets table", "Sends the updated vector to neighbors", "Waits for next schedule", "Ignores update"], correct: 1 },
            { q: "In the Bellman-Ford equation, what does c(x, v) represent?", options: ["Cost from neighbor to dest", "Cost to directly connected neighbor", "Minimum cost from node to dest", "Cost of entire path"], correct: 1 }
        ],
        simType: "dv_sim"
    },
    routing_ls: {
        title: "Link State Routing Algorithm",
        aim: "To understand and simulate the Link State Routing algorithm, demonstrating how global network topology information is used with Dijkstra's algorithm to compute least-cost paths.",
        theory: {
            intro: "Link-State routing uses a global network view to make routing decisions. Instead of sharing distance tables, each router floods the network with Link-State Packets (LSPs) containing its local link status. Every router constructs an identical map of the network and independently runs Dijkstra's algorithm to compute the shortest-path tree.",
            cards: [
                { 
                    title: "1. Dijkstra's SPF Algorithm", 
                    content: "Let $u$ be the source node. Initialize the shortest-path set $S$. For all nodes $v$, set $D(v)$ to the direct link cost $c(u,v)$ or $\\infty$ if not adjacent. Then, iteratively select node $w$ not in $S$ with the minimum $D(w)$, add it to $S$, and update the distance vectors of all remaining nodes: \\n\\n$$D(v) = \\min(D(v), D(w) + c(w,v))$$" 
                },
                { 
                    title: "2. Link State Packets & Flooding", 
                    content: "An LSP contains a router's ID, its list of active neighbors, corresponding link costs, and a sequence number. LSPs are flooded throughout the network. Routers use sequence numbers to identify newer updates, discarding duplicate or older LSPs to prevent routing loops." 
                },
                { 
                    title: "3. Open Shortest Path First (OSPF)", 
                    content: "OSPF is the dominant Link-State protocol. It scales well by dividing the network into Areas, with Area 0 serving as the core backbone. Link costs are calculated using bandwidth: \\n\\n$$\\text{Cost} = \\frac{10^8}{\\text{Bandwidth in bps}}$$" 
                }
            ]
        },
        pretest: [
            { q: "What is the key characteristic of Link-State Routing?", options: ["Maintain only neighbor info", "A complete, global view of network topology at every node", "Share tables with one neighbor", "Hop count only"], correct: 1 },
            { q: "Which algorithm is used in Link-State Routing?", options: ["Bellman-Ford", "Dijkstra's Shortest Path First", "Floyd-Warshall", "A*"], correct: 1 },
            { q: "What type of packet is used to share info?", options: ["Link-State Packet (LSP)", "Distance Vector Packet", "Hello Packet", "ACK Packet"], correct: 0 }
        ],
        procedure: [
            "1. Topology Discovery: Exchange Hello packets to discover neighbor routers and verify physical connectivity.",
            "2. LSP Generation: Create Link-State Advertisements containing local neighbor interfaces and link costs.",
            "3. Reliable Flooding: Flood LSPs across the network to synchronize the Link-State Database (LSDB) on all routers.",
            "4. Dijkstra's Execution: Run Dijkstra's algorithm on the synchronized LSDB to calculate the shortest path tree.",
            "5. Forwarding Table Generation: Construct the forwarding table mapping destination prefixes to next-hop interfaces."
        ],
        posttest: [
            { q: "What is the primary advantage of LS over DV?", options: ["Less memory", "Faster convergence and freedom from Count-to-Infinity problems", "Lower processing power", "Better for small networks"], correct: 1 },
            { q: "How does a node update D(v) in LS algorithm?", options: ["max(D, D-c)", "D/c", "min(D, D+c)", "sum(D, c)"], correct: 2 },
            { q: "What is the final output of the LS algorithm?", options: ["Complete routing table with next-hops", "Shortest paths only", "List of all devices", "Distance vector"], correct: 0 }
        ],
        simType: "ls_sim"
    },
    udp: {
        title: "Chat Application using UDP",
        aim: "To understand the working of User Datagram Protocol (UDP), focusing on its connectionless, lightweight nature and minimal service overhead for time-sensitive applications.",
        theory: {
            intro: "User Datagram Protocol (UDP) is a connectionless, minimal transport layer protocol defined in RFC 768. It provides a simple, direct interface to IP, omitting flow control, congestion management, and transmission retries to minimize communication latency.",
            cards: [
                { 
                    title: "1. Connectionless Transport", 
                    content: "UDP requires no initial handshake before sending data. Datagrams are packaged and transmitted immediately, making them 'unreliable' (best-effort delivery). If a packet is dropped, damaged, or duplicated, the protocol does not notify the sender or attempt retransmission; handling packet loss is left to the application layer." 
                },
                { 
                    title: "2. UDP Header Overhead", 
                    content: "The UDP header has a fixed size of 8 bytes: Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B). This minimal overhead is significantly smaller than TCP's 20-60 byte header, reducing serialization delays." 
                },
                { 
                    title: "3. UDP Applications", 
                    content: "UDP is ideal for real-time applications where low latency is more critical than guaranteed delivery (such as DNS, DHCP, VoIP, video streaming, and online gaming)." 
                }
            ]
        },
        pretest: [
            { q: "Which of the following best describes UDP?", options: ["Connection-oriented", "Reliable transport", "Connectionless, lightweight best-effort transport", "Built-in error correction"], correct: 2 },
            { q: "Why is UDP suitable for VoIP?", options: ["Guarantees error-free delivery", "Minimizes latency by avoiding handshake and retransmission delays", "Prioritizes security", "Built-in congestion control"], correct: 1 },
            { q: "Which is a key advantage of UDP over TCP?", options: ["Guaranteed delivery", "Lower latency (no retransmissions or handshakes)", "Stronger encryption", "Automatic congestion control"], correct: 1 }
        ],
        procedure: [
            "1. Socket Initialization: Initialize a UDP socket and bind it to a local port.",
            "2. Packet Creation: Construct the payload, adding the destination IP address and port.",
            "3. Fire-and-Forget: Transmit the UDP datagram without performing a connection handshake.",
            "4. Receipt: Listen on the designated port for incoming datagrams.",
            "5. Error Handling: Observe that dropped packets are not retransmitted, demonstrating UDP's best-effort delivery model."
        ],
        posttest: [
            { q: "Which application is most likely to use UDP?", options: ["SMTP Email", "FTP File Download", "Live Video Streaming", "Online Banking"], correct: 2 },
            { q: "What is the main reason UDP does not guarantee ordered delivery?", options: ["Lacks sequence numbers and ACKs", "Discards late packets", "Connection-oriented", "Based on priority"], correct: 0 },
            { q: "Which of the following is NOT a typical UDP use case?", options: ["Online gaming", "DNS queries", "Web browsing", "VoIP calls"], correct: 2 }
        ],
        simType: "udp"
    },
    tcp: {
        title: "File Transfer using TCP",
        aim: "To demonstrate and understand the working of the Transmission Control Protocol (TCP), including its connection-oriented 3-way handshake, reliable data transfer using GBN, and congestion control mechanisms like Slow Start and AIMD.",
        theory: {
            intro: "Transmission Control Protocol (TCP) is a connection-oriented, reliable transport protocol. It manages byte streams, ensures ordered delivery, and regulates traffic flow to prevent network congestion.",
            cards: [
                { 
                    title: "1. Three-Way Handshake & Connection States", 
                    content: "TCP establishes connections using a 3-Way Handshake: \\n\\n$$\\text{SYN (seq=x)} \\to \\text{SYN-ACK (seq=y, ack=x+1)} \\to \\text{ACK (seq=x+1, ack=y+1)}$$ \\n\\nThis exchanges initial sequence numbers (ISNs). Connection teardown uses a 4-way handshake exchanging FIN and ACK flags." 
                },
                { 
                    title: "2. Pipelining & Reliable Transfer (GBN)", 
                    content: "TCP uses sliding window protocols to send multiple packets before receiving an acknowledgment. In Go-Back-N (GBN), the sender maintains a window of size $N$. If a packet times out, the sender retransmits that packet and all subsequent packets sent after it." 
                },
                { 
                    title: "3. Congestion Control (Slow Start & AIMD)", 
                    content: "TCP regulates its transmission rate using the Congestion Window (CWND). In **Slow Start**, CWND doubles every RTT. After reaching the threshold (ssthresh), it enters **Congestion Avoidance**, increasing linearly by 1 MSS per RTT. If packet loss is detected (via a timeout), CWND drops to 1 MSS, and ssthresh is set to $\\text{CWND} / 2$ (Multiplicative Decrease)." 
                }
            ]
        },
        pretest: [
            { q: "Which TCP field ensures ordered data delivery?", options: ["Sequence Number", "Acknowledgment Number", "Window Size", "Checksum"], correct: 0 },
            { q: "What happens during the slow-start phase?", options: ["Congestion window increases exponentially", "Sender stops sending", "Window decreases exponentially", "Sender waits for signal"], correct: 0 },
            { q: "How does TCP ensure reliability?", options: ["Checksums, sequence numbers, and acknowledgments", "Encryption", "Random packets", "Dropping duplicates"], correct: 0 }
        ],
        procedure: [
            "1. Handshake Phase: Send SYN, verify SYN-ACK receipt, and respond with ACK to establish the connection.",
            "2. Slow Start: Begin data transmission, doubling the window size (CWND) with each successful round-trip acknowledgment.",
            "3. Congestion Avoidance: Upon reaching the ssthresh value, transition to linear window growth (Additive Increase).",
            "4. Packet Loss Handling: Simulate a packet loss event. Observe the timeout, drop the CWND to 1, and halve the ssthresh.",
            "5. Teardown Phase: Initiate a 4-way handshake using FIN and ACK flags to close the socket connection."
        ],
        posttest: [
            { q: "What happens when a TCP sender detects packet loss?", options: ["Reduces congestion window size", "Stops transmitting", "Increases rate", "Ignores loss"], correct: 0 },
            { q: "What is the purpose of the 3-way handshake?", options: ["Verify IP", "Establish reliable connection and exchange initial sequence numbers", "Encrypt data", "Check congestion"], correct: 1 },
            { q: "Which mechanism prevents overwhelming the receiver?", options: ["Slow Start", "Congestion Window", "Sliding Window Flow Control", "Checksum"], correct: 2 }
        ],
        simType: "gbn"
    },
    dns: {
        title: "Domain Name System (DNS)",
        aim: "To explore the working of the Domain Name System (DNS), demonstrating how this hierarchical, distributed database translates easy-to-remember hostnames into numerical IP addresses through recursive and iterative queries.",
        theory: {
            intro: "The Domain Name System (DNS) translates human-readable hostnames into numerical IP addresses. Since a single server cannot handle all queries globally, DNS uses a distributed, hierarchical database.",
            cards: [
                { 
                    title: "1. The DNS Hierarchy", 
                    content: "DNS is structured hierarchically: \\n\\n- **Root DNS Servers**: The top tier, directing queries to TLD servers.\\n- **Top-Level Domain (TLD) Servers**: Manage domains like .com, .net, and country codes (e.g., .in).\\n- **Authoritative DNS Servers**: Maintained by organizations, providing final IP mappings for specific hostnames." 
                },
                { 
                    title: "2. Query Resolution: Recursive vs. Iterative", 
                    content: "In a **Recursive Query**, the local DNS resolver handles the lookup process and returns the final IP address to the client. In an **Iterative Query**, the DNS server replies with the address of the next DNS server in the hierarchy, directing the client to perform the next query step." 
                },
                { 
                    title: "3. DNS Records & Time-to-Live (TTL)", 
                    content: "DNS database entries are called Resource Records (RRs), formatted as `(Name, Value, Type, TTL)`. Type **A** maps hostnames to IPv4 addresses. Type **NS** specifies authoritative name servers. Type **CNAME** maps aliases to canonical names. **TTL** defines how long a record can be cached before it must be updated from the authoritative server." 
                }
            ]
        },
        pretest: [
            { q: "What is the primary purpose of DNS?", options: ["Translate human-readable hostnames to IP addresses", "Establish encrypted communication", "Store website content", "Control traffic flow"], correct: 0 },
            { q: "Which DNS query allows the server to take full responsibility?", options: ["Iterative", "Recursive", "Authoritative", "Hierarchical"], correct: 1 },
            { q: "Which record type maps a hostname to an IP?", options: ["CNAME", "NS", "A", "MX"], correct: 2 }
        ],
        procedure: [
            "1. Query Initiation: Send a DNS query for a specific hostname from the client PC.",
            "2. Recursive Resolution: Trace the path from the local resolver to the Root, TLD, and Authoritative servers.",
            "3. Record Parsing: Inspect the returned Resource Record (A, CNAME, or NS) and its TTL value.",
            "4. Caching: Verify that subsequent queries for the same domain are answered instantly from the local cache.",
            "5. Iterative Mode Analysis: Compare recursive query paths with step-by-step iterative queries."
        ],
        posttest: [
            { q: "Which server handles extensions like '.com'?", options: ["Root", "TLD", "Authoritative", "Recursive"], correct: 1 },
            { q: "What does the TTL field specify?", options: ["Time after which cached record expires and must be refreshed", "Priority of query", "Security level", "Number of queries allowed"], correct: 0 },
            { q: "Which protocol is used by DNS?", options: ["TCP", "UDP", "Both TCP (zone transfers/large payloads) and UDP (queries)", "ICMP"], correct: 2 }
        ],
        simType: "dns"
    },
    cables_devices: {
        title: "Cables, Connectors and Networking Devices",
        aim: "To study types of cables (Twisted Pair, Co-axial, Fiber optic), connectors (RJ-45, BNC) and networking devices (Hub, Switch, Router, Gateway).",
        theory: {
            intro: "Physical layer media and network devices connect nodes to form a network. Selecting appropriate cabling and hardware is essential for bandwidth capacity, signal integrity, and cost-efficiency.",
            cards: [
                { 
                    title: "1. Guided Transmission Media", 
                    content: "**Twisted Pair (UTP/STP)**: Consists of color-coded copper wires twisted in pairs to reduce electromagnetic interference (EMI). Standard Category 6 (Cat6) cabling supports 10Gbps up to 55m.\\n\\n**Coaxial Cable**: Features a copper conductor surrounded by insulation and shielding, commonly used for broadband internet access.\\n\\n**Fiber Optic**: Uses light pulses to transmit data through glass or plastic fibers, providing high bandwidth over long distances." 
                },
                { 
                    title: "2. Networking Connectors", 
                    content: "**RJ-45**: The standard 8-pin connector used to terminate twisted-pair Ethernet cables. Uses the T568A or T568B pinout standards.\\n\\n**BNC**: A bayonet-style connector used to terminate coaxial cables, common in early thin Ethernet networks and analog video systems." 
                },
                { 
                    title: "3. Hubs, Switches, and Routers", 
                    content: "**Hub (Physical Layer)**: A legacy multiport repeater that broadcasts all incoming traffic to all ports, creating a single collision domain.\\n\\n**Switch (Data Link Layer)**: Filters and forwards frames to specific MAC addresses using a MAC address table, dividing the network into separate collision domains.\\n\\n**Router (Network Layer)**: Connects different IP subnets and forwards packets using IP routing tables, defining broadcast domain boundaries." 
                }
            ]
        },
        pretest: [
            { q: "Which cable is least susceptible to EMI?", options: ["UTP", "STP", "Coaxial", "Fiber Optic"], correct: 3 },
            { q: "What is the maximum length of a UTP cable segment?", options: ["100m", "500m", "1000m", "10m"], correct: 0 },
            { q: "Which device operates at the Network Layer (Layer 3)?", options: ["Hub", "Switch", "Router", "Bridge"], correct: 2 }
        ],
        procedure: [
            "1. Media Analysis: Examine properties of UTP, coaxial, and single-mode/multi-mode fiber cables.",
            "2. Connector Pinouts: Study the pin assignments for T568A and T568B Ethernet configurations.",
            "3. Hardware Sandbox: Place a Hub, Switch, and Router into the topology workspace.",
            "4. Cabling: Connect host PCs to the Switch using straight-through cables.",
            "5. Loopback & Verification: Run link checks to verify status and establish connectivity."
        ],
        posttest: [
            { q: "What does RJ stand for in RJ-45?", options: ["Registered Jack", "Radio Jack", "Routing Junction", "Real Joint"], correct: 0 },
            { q: "Which topology typically uses a central Hub?", options: ["Bus", "Star", "Mesh", "Ring"], correct: 1 },
            { q: "Fiber optic cables transmit data in the form of?", options: ["Electrical signals", "Radio waves", "Light pulses", "Sound waves"], correct: 2 }
        ],
        simType: "media_study"
    },
    modulation: {
        title: "Modulation Techniques (AM, FM, PCM)",
        aim: "To study and analyze various modulation techniques: Amplitude Modulation (AM), Frequency Modulation (FM), and Pulse Code Modulation (PCM).",
        theory: {
            intro: "Modulation is the process of modifying a carrier signal (typically a high-frequency sine wave) with a message signal (containing data or audio) to facilitate transmission over physical media.",
            cards: [
                { 
                    title: "1. Amplitude Modulation (AM) & FM", 
                    content: "In **AM**, the amplitude of the carrier wave is varied in proportion to the message signal's instantaneous amplitude: \\n\\n$$s(t) = [A_c + m(t)] \\cos(2\\pi f_c t)$$\\n\\nIn **FM**, the carrier frequency varies with the message signal amplitude, keeping overall signal amplitude constant, which provides better resistance to environmental noise." 
                },
                { 
                    title: "2. Pulse Code Modulation (PCM) Stages", 
                    content: "PCM converts analog signals into digital binary format in three stages:\\n\\n1. **Sampling**: Capture signal values at regular intervals. The Nyquist sampling rate must satisfy $f_s \\ge 2f_{max}$.\\n2. **Quantization**: Map continuous sample values to a discrete scale.\\n3. **Encoding**: Convert quantized values into binary code." 
                },
                { 
                    title: "3. Bandwidth Capacity Limits", 
                    content: "The **Nyquist Formula** calculates the maximum capacity of a noiseless channel: $C = 2B \\log_2 M$.\\n\\nThe **Shannon-Hartley Theorem** calculates maximum capacity for a noisy channel: \\n\\n$$C = B \\log_2\\left(1 + \\frac{S}{N}\\right)$$\\n\\nwhere $B$ is bandwidth and $S/N$ is the Signal-to-Noise Ratio." 
                }
            ]
        },
        pretest: [
            { q: "Which modulation varies the height of the carrier wave?", options: ["AM", "FM", "PM", "PCM"], correct: 0 },
            { q: "Which technique is commonly used for digital audio and telephony?", options: ["AM", "FM", "PCM", "PWM"], correct: 2 },
            { q: "Which modulation is more resistant to atmospheric noise?", options: ["AM", "FM", "PCM", "All are equal"], correct: 1 }
        ],
        procedure: [
            "1. Base Waveforms: Generate a high-frequency carrier sine wave and a lower-frequency message signal.",
            "2. Amplitude Modulation: Vary the carrier wave envelope to match the message signal.",
            "3. Frequency Modulation: Adjust the carrier frequency dynamically based on message signal amplitude.",
            "4. PCM Conversion: Sample the message signal, apply quantization levels, and encode the results into binary code.",
            "5. Signal Degradation: Add simulated white noise to analyze signal distortion."
        ],
        posttest: [
            { q: "What is the primary drawback of AM?", options: ["High bandwidth", "Complexity", "Susceptibility to noise", "Low range"], correct: 2 },
            { q: "In PCM, the process of assigning discrete values to samples is called?", options: ["Sampling", "Quantization", "Encoding", "Modulation"], correct: 1 },
            { q: "FM belongs to which category of modulation?", options: ["Amplitude", "Angle Modulation", "Digital", "Pulse"], correct: 1 }
        ],
        simType: "modulation"
    },
    net_commands: {
        title: "Networking Commands & Utilities",
        aim: "To study and analyze basic networking commands like ping, tracert, arp, netstat, nslookup, ipconfig, and whois.",
        theory: {
            intro: "Networking utilities are command-line tools used by administrators to configure network interfaces, troubleshoot connectivity issues, and monitor network statistics.",
            cards: [
                { 
                    title: "1. ICMP Commands: Ping & Traceroute", 
                    content: "**ping**: Sends ICMP Echo Requests to verify hostname or IP address reachability.\\n\\n**traceroute/tracert**: Tracks the path packets take to a destination. It increments the TTL (Time-To-Live) field of outgoing packets from 1 upwards, causing each hop along the path to return an ICMP Time Exceeded message." 
                },
                { 
                    title: "2. IP Config & Address Resolution (ARP)", 
                    content: "**ipconfig / ifconfig**: Displays interface IP configurations, subnet masks, and default gateways.\\n\\n**arp -a**: Displays the ARP cache containing resolved IP-to-MAC address mappings." 
                },
                { 
                    title: "3. Connection Monitoring & DNS Lookup", 
                    content: "**netstat**: Lists active TCP/UDP connections, listening ports, and routing statistics.\\n\\n**nslookup / dig**: Queries DNS servers to resolve hostnames to IP addresses." 
                }
            ]
        },
        pretest: [
            { q: "Which command shows the route taken to a destination?", options: ["ping", "tracert", "netstat", "arp"], correct: 1 },
            { q: "Which command is used to see your own IP address on Windows?", options: ["ifconfig", "ipconfig", "nslookup", "whois"], correct: 1 },
            { q: "ARP is used to map IP addresses to?", options: ["Hostnames", "MAC addresses", "Port numbers", "Gateways"], correct: 1 }
        ],
        procedure: [
            "1. Interface Check: Run `ipconfig` to verify local IP, mask, and gateway settings.",
            "2. Ping Test: Execute `ping 127.0.0.1` to verify the local loopback interface.",
            "3. Route Trace: Use `tracert` to map the path to an external server.",
            "4. Cache Inspection: Run `arp -a` to view the local physical address cache.",
            "5. DNS Query: Run `nslookup` to query domain name servers."
        ],
        posttest: [
            { q: "Which protocol is used by the ping command?", options: ["TCP", "UDP", "ICMP", "IGMP"], correct: 2 },
            { q: "What does TTL stand for in networking commands?", options: ["Total Time Limit", "Time To Live", "Terminal Transit Loss", "Table Task List"], correct: 1 },
            { q: "Which command would you use to check for a DNS issue?", options: ["arp", "ping", "nslookup", "netstat"], correct: 2 }
        ],
        simType: "cmd_challenge"
    },
    ip_class: {
        title: "IPv4 Address Classification",
        aim: "To identify the class (A, B, C, D, or E), Network ID, and Host ID of a given IPv4 address.",
        theory: {
            intro: "IPv4 addresses are 32-bit values historically categorized into five classes (Classful Addressing) to simplify allocation, determined by the state of the first octet's leading bits.",
            cards: [
                { 
                    title: "1. Class Boundaries", 
                    content: "- **Class A**: Range 1.0.0.0 to 126.255.255.255. Default mask `/8`. The first octet is the network portion.\\n- **Class B**: Range 128.0.0.0 to 191.255.255.255. Default mask `/16`. The first two octets form the network portion.\\n- **Class C**: Range 192.0.0.0 to 223.255.255.255. Default mask `/24`. The first three octets form the network portion." 
                },
                { 
                    title: "2. Class D (Multicast) & Class E", 
                    content: "- **Class D**: Range 224.0.0.0 to 239.255.255.255. Reserved for multicast traffic (transmitting to a group of nodes simultaneously).\\n- **Class E**: Range 240.0.0.0 to 255.255.255.255. Reserved for experimental and research use." 
                },
                { 
                    title: "3. Special Purpose Ranges", 
                    content: "- **Loopback Address**: The `127.0.0.0/8` range is reserved for local host testing.\\n- **Private IP Ranges (RFC 1918)**: IP ranges reserved for private networks: `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16` (not routable on the public Internet)." 
                }
            ]
        },
        pretest: [
            { q: "Which class does 172.16.0.1 belong to?", options: ["Class A", "Class B", "Class C", "Class D"], correct: 1 },
            { q: "What is the range of Class C IP addresses?", options: ["0-127", "128-191", "192-223", "224-239"], correct: 2 },
            { q: "Which octet(s) represent the Network ID in Class A?", options: ["First", "First and Second", "First, Second and Third", "All"], correct: 0 }
        ],
        procedure: [
            "1. Octet Analysis: Inspect the first octet of a given IP address.",
            "2. Range Matching: Map the first octet value to its corresponding address class (A, B, C, D, or E).",
            "3. Network ID Determination: Separate the network portion from the host portion based on the class's default subnet mask.",
            "4. Private Address Check: Identify if the IP belongs to a public, private (RFC 1918), or loopback range.",
            "5. Verification: Write a script to automate IP parsing and classification."
        ],
        posttest: [
            { q: "What is the Network ID of 10.20.30.40?", options: ["10.20.30", "10.20", "10", "10.20.30.40"], correct: 2 },
            { q: "Class D addresses are reserved for?", options: ["Large Networks", "Experimental", "Multicasting", "Loopback"], correct: 2 },
            { q: "The IP 192.168.10.1 belongs to?", options: ["Class A", "Class B", "Class C", "Class D"], correct: 2 }
        ],
        simType: "ip_sorter"
    },
    vlan: {
        title: "VLAN (Virtual LAN) Configuration",
        aim: "To design and configure Virtual LANs (VLANs) to segment a physical network into multiple logical broadcast domains.",
        theory: {
            intro: "A Virtual Local Area Network (VLAN) segments a physical switch into multiple logical networks, dividing the hardware into separate broadcast domains to improve network security and efficiency.",
            cards: [
                { 
                    title: "1. Broadcast Domain Segmentation", 
                    content: "By default, all switch ports belong to a single broadcast domain (VLAN 1). VLANs logically segment the switch, preventing broadcast traffic from crossing VLAN boundaries. Devices in different VLANs cannot communicate without a Layer 3 router or multilayer switch (Inter-VLAN Routing)." 
                },
                { 
                    title: "2. Port Modes: Access vs. Trunk", 
                    content: "**Access Ports**: Belong to a single VLAN, carrying untagged frames. Used to connect end devices like PCs.\\n\\n**Trunk Ports**: Carry traffic for multiple VLANs over a single physical link connecting switches or routers. Frame routing is managed using VLAN tagging standards." 
                },
                { 
                    title: "3. IEEE 802.1Q Frame Tagging", 
                    content: "IEEE 802.1Q is the industry standard for VLAN trunking. When a frame enters a trunk link, a 4-byte tag containing a 12-bit VLAN ID is inserted into the Ethernet header, allowing the receiving switch to identify the frame's source VLAN." 
                }
            ]
        },
        pretest: [
            { q: "Which device is used to create VLANs?", options: ["Hub", "Switch", "Repeater", "Modem"], correct: 1 },
            { q: "What is the default VLAN ID on most switches?", options: ["0", "1", "10", "100"], correct: 1 },
            { q: "Which protocol is used for VLAN tagging on trunks?", options: ["802.11", "802.3", "802.1Q", "STP"], correct: 2 }
        ],
        procedure: [
            "1. VLAN Definition: Create VLANs on the switch and assign names to them.",
            "2. Access Port Configuration: Assign specific switch ports to designated VLANs.",
            "3. Trunk Port Configuration: Configure the link connecting switches as a trunk port.",
            "4. Trunk Validation: Verify that frames are tagged with their corresponding VLAN IDs over the trunk link.",
            "5. Inter-VLAN Routing: Configure subinterfaces on a router to enable communication between different VLANs."
        ],
        posttest: [
            { q: "VLANs operate at which layer of the OSI model?", options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], correct: 1 },
            { q: "What happens to a broadcast frame sent in VLAN 10?", options: ["Sent to all ports", "Sent only to ports assigned to VLAN 10", "Sent to all VLANs", "Dropped"], correct: 1 },
            { q: "To allow communication between VLAN 10 and VLAN 20, we need?", options: ["A bigger switch", "A cross cable", "A Router or Layer 3 Switch", "Nothing"], correct: 2 }
        ],
        simType: "vlan_sim"
    },
    routing_protocols: {
        title: "Dynamic Routing (OSPF & BGP)",
        aim: "To configure and analyze advanced dynamic routing protocols: OSPF (Interior Gateway Protocol) and BGP (Exterior Gateway Protocol).",
        theory: {
            intro: "Dynamic routing protocols allow routers to automatically share network topologies, dynamically calculate optimal paths, and adapt to network changes.",
            cards: [
                { 
                    title: "1. IGP vs. EGP Routing Protocols", 
                    content: "**IGP (Interior Gateway Protocol)**: Used to exchange routing information within a single Autonomous System (AS). Examples include RIP, OSPF, and EIGRP.\\n\\n**EGP (Exterior Gateway Protocol)**: Used to route packets between different Autonomous Systems. **BGP** is the standard EGP used to route traffic across the Internet." 
                },
                { 
                    title: "2. OSPF Core Features", 
                    content: "OSPF is a Link-State protocol that uses Dijkstra's Shortest Path First algorithm. It establishes neighbor relationships using Hello packets and synchronizes Link-State Advertisements (LSAs) within Areas to maintain a consistent network map." 
                },
                { 
                    title: "3. BGP Path-Vector Routing", 
                    content: "BGP is a Path-Vector protocol that manages routing paths using policy decisions rather than simple link costs. It advertises routes as a sequence of Autonomous System Numbers (AS-Path), which helps prevent routing loops between different networks." 
                }
            ]
        },
        pretest: [
            { q: "Which protocol is an Exterior Gateway Protocol (EGP)?", options: ["RIP", "OSPF", "EIGRP", "BGP"], correct: 3 },
            { q: "OSPF uses which algorithm for path calculation?", options: ["Bellman-Ford", "Dijkstra", "Spanning Tree", "Round Robin"], correct: 1 },
            { q: "What is an Autonomous System (AS)?", options: ["A single router", "A collection of networks under a single administrative domain", "A type of server", "A VLAN"], correct: 1 }
        ],
        procedure: [
            "1. Process Initialization: Enable the OSPF routing process on target routers.",
            "2. Network Advertisement: Define interfaces to participate in OSPF and assign them to Area 0.",
            "3. Neighbor Verification: Check the OSPF neighbor table to verify adjacencies.",
            "4. BGP Peer Configuration: Establish BGP peer sessions with neighboring Autonomous Systems.",
            "5. Routing Table Verification: Inspect the local routing table to verify dynamically learned routes."
        ],
        posttest: [
            { q: "Which protocol is best suited for routing within a large corporate campus?", options: ["BGP", "OSPF", "Static Routing", "HTTP"], correct: 1 },
            { q: "The Administrative Distance of OSPF is?", options: ["90", "100", "110", "120"], correct: 2 },
            { q: "BGP uses which port for communication?", options: ["TCP 80", "UDP 53", "TCP 179", "UDP 161"], correct: 2 }
        ],
        simType: "path_sim",
        practice_commands: [
            "router ospf 1",
            "network 192.168.1.0 0.0.0.255 area 0",
            "show ip route ospf",
            "router bgp 65001",
            "neighbor 10.0.0.1 remote-as 65002",
            "show ip bgp summary"
        ],
        practice_questions: [
            "Why is BGP called a path-vector protocol instead of a distance-vector protocol?",
            "What happens if two routers have the same Router ID in OSPF?",
            "How does BGP prevent routing loops between Autonomous Systems?",
            "Explain the difference between eBGP and iBGP."
        ]
    },
    cpu_scheduling: {
        title: "CPU Scheduling Algorithms",
        aim: "To study and analyze CPU scheduling algorithms (FCFS, SJF, and Round Robin) to calculate waiting time, turnaround time, and CPU utilization.",
        theory: {
            intro: "CPU Scheduling is the process by which the operating system decides which process in the ready queue gets the CPU. In multiprogramming, it maximizes CPU utilization.",
            cards: [
                {
                    title: "1. FCFS & SJF Scheduling",
                    content: "**First-Come, First-Served (FCFS)**: Non-preemptive scheduling where the process that requests the CPU first gets it first. Simple but prone to Convoy Effect.\\n\\n**Shortest Job First (SJF)**: Selects the process with the shortest CPU burst time. Proven to yield optimal average waiting time."
                },
                {
                    title: "2. Round Robin (RR) & Time Quantum",
                    content: "**Round Robin (RR)**: Designed for time-sharing systems. Each process gets a small unit of CPU time (time quantum), then is preempted and put back in the ready queue."
                },
                {
                    title: "3. Formulas",
                    content: "$$\\text{Turnaround Time (TAT)} = \\text{Completion Time (CT)} - \\text{Arrival Time (AT)}$$\\n$$\\text{Waiting Time (WT)} = \\text{Turnaround Time (TAT)} - \\text{Burst Time (BT)}$$"
                }
            ]
        },
        pretest: [
            { q: "Which CPU scheduling algorithm leads to the Convoy Effect?", options: ["FCFS", "SJF", "Round Robin", "Priority"], correct: 0 },
            { q: "What is the primary goal of CPU scheduling?", options: ["To maximize throughput and CPU utilization", "To increase page faults", "To synchronize physical devices", "To prevent deadlocks"], correct: 0 },
            { q: "Which scheduling algorithm is optimal in terms of average waiting time?", options: ["FCFS", "SJF", "Round Robin", "FIFO"], correct: 1 }
        ],
        procedure: [
            "1. Enter the number of processes to schedule.",
            "2. Input the Arrival Time and Burst Time for each process.",
            "3. Choose the Scheduling Algorithm: FCFS, SJF, or Round Robin (and input Time Quantum).",
            "4. Click Run to generate the Gantt chart and step-by-step timeline.",
            "5. Analyze the Turnaround Time (TAT), Waiting Time (WT), and average statistics."
        ],
        posttest: [
            { q: "In Round Robin scheduling, what happens if the time quantum is extremely large?", options: ["It behaves like FCFS", "It behaves like SJF", "It causes deadlock", "It reduces waiting time to zero"], correct: 0 },
            { q: "Waiting Time is defined as?", options: ["TAT - Burst Time", "Completion Time - Arrival Time", "Burst Time - Arrival Time", "None of these"], correct: 0 },
            { q: "Which scheduler selects from among the processes that are ready to execute and allocates the CPU to one of them?", options: ["Short-term scheduler", "Medium-term scheduler", "Long-term scheduler", "Device scheduler"], correct: 0 }
        ],
        simType: "cpu_scheduling",
        practice_commands: ["ps -aux", "top", "renice", "nice -n 10 ./process"],
        practice_questions: ["Calculate average waiting time for FCFS with processes P1(BT=24), P2(BT=3), P3(BT=3) arriving at 0.", "Why is preemptive SJF also known as Shortest Remaining Time First (SRTF)?"]
    },
    process_sync: {
        title: "Process Synchronization & Semaphores",
        aim: "To study and simulate process synchronization using the classical Producer-Consumer Problem solved with Mutex and Semaphores.",
        theory: {
            intro: "Process synchronization is the coordination of execution of multiple processes in a shared address space to maintain data consistency. The Producer-Consumer problem is a classic multi-process synchronization problem.",
            cards: [
                {
                    title: "1. Critical Section Problem",
                    content: "A critical section is a code segment where shared resources are accessed. To prevent race conditions, solutions must satisfy Mutual Exclusion, Progress, and Bounded Waiting."
                },
                {
                    title: "2. Semaphores",
                    content: "A semaphore is an integer variable accessed via atomic operations: `wait()` (or P) which decrements, and `signal()` (or V) which increments. Binary semaphores act as Mutexes."
                },
                {
                    title: "3. Producer-Consumer Problem",
                    content: "A producer puts items into a shared buffer, and a consumer removes them. Synchronized using semaphores: `empty` (empty slots), `full` (filled slots), and `mutex` (mutual exclusion)."
                }
            ]
        },
        pretest: [
            { q: "What is a race condition?", options: ["When multiple processes access and manipulate the same data concurrently", "When one process runs faster than another", "A deadlock situation", "When CPU speed is high"], correct: 0 },
            { q: "Which semaphore operation decrements the semaphore value?", options: ["wait()", "signal()", "post()", "get()"], correct: 0 },
            { q: "The Producer-Consumer problem is also known as?", options: ["Bounded Buffer problem", "Readers-Writers problem", "Dining Philosophers problem", "Sleeping Barber problem"], correct: 0 }
        ],
        procedure: [
            "1. Set the buffer capacity limit.",
            "2. Click 'Produce' to insert an item into the buffer (decrements empty, increments full).",
            "3. Click 'Consume' to remove an item from the buffer (decrements full, increments empty).",
            "4. Try to Produce when the buffer is full or Consume when empty, and observe semaphore states.",
            "5. Study the log trace showing P/V operation states."
        ],
        posttest: [
            { q: "If the buffer is full, what state does the Producer enter?", options: ["Blocked/Waiting", "Running", "Terminated", "Ready"], correct: 0 },
            { q: "What is the initial value of the 'empty' semaphore for a buffer of size N?", options: ["N", "0", "1", "N-1"], correct: 0 },
            { q: "Which of the following is NOT a requirement for a critical section solution?", options: ["Mutual Exclusion", "Progress", "Bounded Waiting", "Spinlock Capability"], correct: 3 }
        ],
        simType: "process_sync",
        practice_commands: ["ipcs -s", "ipcrm -s", "pthread_mutex_init", "sem_wait"],
        practice_questions: ["Explain the difference between binary semaphore and mutex.", "How does busy waiting waste CPU cycles?"]
    },
    deadlock_avoidance: {
        title: "Deadlock Avoidance (Banker's Algorithm)",
        aim: "To simulate Banker's Algorithm to determine if a resource allocation request leads to a safe or unsafe state, preventing deadlock.",
        theory: {
            intro: "Deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process. Banker's Algorithm is a deadlock avoidance algorithm.",
            cards: [
                {
                    title: "1. Banker's Algorithm matrices",
                    content: "Uses matrices: `Allocation` (resources currently allocated), `Max` (maximum resources required), `Need` (remaining resources needed = Max - Allocation), and `Available` vector."
                },
                {
                    title: "2. Safety Algorithm",
                    content: "Checks if the system is in a safe state. A state is safe if there exists a safe sequence $P_1, P_2, \\dots, P_n$ where all processes can finish executing without deadlock."
                },
                {
                    title: "3. Resource Request Algorithm",
                    content: "Determines if a request can be safely granted immediately. If allocating the requested resources leaves the system in a safe state, the request is granted."
                }
            ]
        },
        pretest: [
            { q: "What are the four necessary conditions for deadlock?", options: ["Mutual exclusion, hold and wait, no preemption, circular wait", "Starvation, race condition, critical section, spinlock", "Allocation, request, available, need", "None of the above"], correct: 0 },
            { q: "Banker's Algorithm is used for?", options: ["Deadlock Avoidance", "Deadlock Detection", "Deadlock Recovery", "Deadlock Prevention"], correct: 0 },
            { q: "If a system is in an unsafe state, does it mean deadlock is guaranteed?", options: ["No, it just means there is a possibility of deadlock", "Yes, deadlock will definitely occur immediately", "It depends on CPU speed", "Unsafe state is the same as deadlock"], correct: 0 }
        ],
        procedure: [
            "1. Enter the Allocation and Max matrices for 3 to 5 processes and 3 resource types.",
            "2. Input the Available resource vector.",
            "3. Click 'Check Safety' to trace the step-by-step verification of a safe sequence.",
            "4. Trigger a resource request from a process and verify if the system can safely grant it."
        ],
        posttest: [
            { q: "Need matrix is calculated as?", options: ["Max - Allocation", "Max + Allocation", "Allocation - Max", "Available - Allocation"], correct: 0 },
            { q: "What does the Banker's algorithm do when a process requests resources?", options: ["Simulates allocation and checks if the resulting state is safe", "Grants the request immediately", "Blocks the process permanently", "Terminates the process"], correct: 0 },
            { q: "Which data structure is NOT used in Banker's algorithm?", options: ["Allocation matrix", "Max matrix", "Process table", "Available vector"], correct: 2 }
        ],
        simType: "bankers",
        practice_commands: ["ulimit -a", "sysctl -a | grep sem", "kill -9"],
        practice_questions: ["Given Allocation=[0 1 0], Max=[7 5 3], Available=[3 3 2], calculate the Need matrix.", "Compare deadlock prevention with deadlock avoidance."]
    },
    page_replacement: {
        title: "Page Replacement Algorithms",
        aim: "To analyze page replacement algorithms (FIFO, LRU, and Optimal) to count page hits, page faults, and calculate the page fault ratio.",
        theory: {
            intro: "Page replacement occurs when a page fault happens and there are no free frames. The OS must select a page in memory to replace with the requested page.",
            cards: [
                {
                    title: "1. FIFO & LRU Algorithms",
                    content: "**First-In-First-Out (FIFO)**: Replaces the oldest page. Easy to implement but suffers from Belady's Anomaly.\\n\\n**Least Recently Used (LRU)**: Replaces the page that has not been used for the longest period of time. Approximates optimal replacement."
                },
                {
                    title: "2. Optimal Algorithm",
                    content: "**Optimal Page Replacement**: Replaces the page that will not be used for the longest period in the future. Serves as a benchmark with the minimum page fault rate."
                },
                {
                    title: "3. Belady's Anomaly",
                    content: "For some page replacement algorithms (like FIFO), the page fault rate may increase as the number of allocated physical frames increases. This is known as Belady's Anomaly."
                }
            ]
        },
        pretest: [
            { q: "Which algorithm suffers from Belady's Anomaly?", options: ["FIFO", "LRU", "Optimal", "LFU"], correct: 0 },
            { q: "A page fault occurs when?", options: ["A page referenced is not present in main memory", "A page is written to disk", "The CPU executes a branch", "Virtual memory is disabled"], correct: 0 },
            { q: "Which page replacement algorithm is used as a benchmark for comparison?", options: ["Optimal", "LRU", "FIFO", "MRU"], correct: 0 }
        ],
        procedure: [
            "1. Enter the reference string of page numbers.",
            "2. Input the number of physical frames.",
            "3. Select the algorithm: FIFO, LRU, or Optimal.",
            "4. Step through the execution to watch pages load into frames and identify hits/faults.",
            "5. Review total page faults and final page fault ratio."
        ],
        posttest: [
            { q: "What is the Optimal page replacement criteria?", options: ["Replace page that will not be used for the longest period in the future", "Replace page that has been in memory longest", "Replace page that was least recently used", "Replace page with lowest frequency of use"], correct: 0 },
            { q: "If page references are 7,0,1,2,0,3 and frame size is 3, what is the frame status in FIFO after loading 7,0,1?", options: ["[7, 0, 1]", "[0, 1, 2]", "[7, 0, 3]", "Empty"], correct: 0 },
            { q: "LRU stands for?", options: ["Least Recently Used", "Last Random Unit", "Least Random Utilized", "List Reference Unit"], correct: 0 }
        ],
        simType: "page_replacement",
        practice_commands: ["vmstat", "free -m", "sar -B", "swapon -s"],
        practice_questions: ["Demonstrate Belady's Anomaly using the reference string 1,2,3,4,1,2,5,1,2,3,4,5 with FIFO for 3 and 4 frames.", "Explain how Page Table Entry (PTE) reference bits help approximate LRU."]
    },
    disk_scheduling: {
        title: "Disk Scheduling Algorithms",
        aim: "To analyze disk scheduling algorithms (FCFS, SSTF, and SCAN) to calculate the total head movement of the disk read/write head.",
        theory: {
            intro: "Disk scheduling is done by operating systems to schedule I/O requests arriving for the disk. It reduces disk seek time, which is the time taken to locate the track.",
            cards: [
                {
                    title: "1. FCFS & SSTF Algorithms",
                    content: "**First-Come, First-Served (FCFS)**: Services requests in the order they arrive. Simple, fair, but does not optimize head movement.\\n\\n**Shortest Seek Time First (SSTF)**: Selects the request closest to the current head position, minimizing immediate seek time but may cause starvation."
                },
                {
                    title: "2. SCAN (Elevator) Algorithm",
                    content: "**SCAN**: The disk head moves in one direction, servicing requests, until it reaches the end of the disk, then reverses direction and services requests in the opposite direction."
                },
                {
                    title: "3. Seek Time Definition",
                    content: "Seek time is the primary component of disk access latency. Minimizing total head movement directly reduces seek time and improves system throughput."
                }
            ]
        },
        pretest: [
            { q: "What is the main objective of disk scheduling?", options: ["To minimize disk seek time (head movement)", "To maximize storage capacity", "To encrypt disk sectors", "To backup data"], correct: 0 },
            { q: "Which disk scheduling algorithm is also known as the Elevator Algorithm?", options: ["SCAN", "FCFS", "SSTF", "C-LOOK"], correct: 0 },
            { q: "Which algorithm selects requests closest to the current head position?", options: ["SSTF", "FCFS", "SCAN", "LOOK"], correct: 0 }
        ],
        procedure: [
            "1. Enter the list of requested disk cylinder tracks.",
            "2. Input the initial head position and direction of head movement.",
            "3. Choose the Algorithm: FCFS, SSTF, or SCAN.",
            "4. Run the simulation to plot the head movement path on the grid.",
            "5. Compare total cylinder head movements across different algorithms."
        ],
        posttest: [
            { q: "SSTF scheduling may lead to?", options: ["Starvation of requests far from the head", "Deadlock", "High overhead", "Equal seek times for all requests"], correct: 0 },
            { q: "In SCAN scheduling, what boundary must the head reach before reversing?", options: ["The extreme end of the disk (0 or Max)", "The first pending request", "The middle cylinder", "It reverses randomly"], correct: 0 },
            { q: "Seek time is the time taken to?", options: ["Position the head over the desired track/cylinder", "Rotate the disk to the desired sector", "Transfer data to memory", "Initialize the disk controller"], correct: 0 }
        ],
        simType: "disk_scheduling",
        practice_commands: ["iostat", "lsblk", "fdisk -l", "hdparm -t /dev/sda"],
        practice_questions: ["Why does SCAN prevent starvation compared to SSTF?", "Calculate total head movement for FCFS with requests: 98, 183, 37, 122, 14, 124, 65, 67 and head starting at 53."]
    }
};

// Add practice data to other labs
window.VLAB_DATA.csma.practice_commands = ["ping 192.168.1.2", "show mac address-table", "debug ip icmp"];
window.VLAB_DATA.csma.practice_questions = ["What is the effect of the slot time on collision detection?", "How does a switch handle a frame if the destination MAC is missing from its table?"];

window.VLAB_DATA.csma_ca.practice_commands = ["show interfaces dot11radio 0", "show controllers dot11radio 0", "debug dot11 state"];
window.VLAB_DATA.csma_ca.practice_questions = ["Why is a random backoff used even if the channel is idle?", "Describe the difference between DIFS and SIFS timing."];

window.VLAB_DATA.subnet.practice_commands = ["ip address 192.168.1.1 255.255.255.128", "show ip interface brief", "ping 192.168.1.129"];
window.VLAB_DATA.subnet.practice_questions = ["Calculate the broadcast address for 172.16.10.0/26.", "How many usable hosts are in a /28 subnet?"];

window.VLAB_DATA.routing_dv.practice_commands = ["router rip", "network 10.0.0.0", "show ip rip database"];
window.VLAB_DATA.routing_dv.practice_questions = ["Explain the 'Count to Infinity' problem.", "How does 'Split Horizon' prevent routing loops?"];

window.VLAB_DATA.routing_ls.practice_commands = ["show ip ospf database", "show ip ospf neighbor", "clear ip ospf process"];
window.VLAB_DATA.routing_ls.practice_questions = ["Compare the convergence speed of Dijkstra vs Bellman-Ford.", "What is the purpose of an LSA (Link State Advertisement)?"];

window.VLAB_DATA.udp.practice_commands = ["nc -u 192.168.1.10 5000", "netstat -unap", "tcpdump -i eth0 udp"];
window.VLAB_DATA.udp.practice_questions = ["Why is the UDP header smaller than the TCP header?", "Give an example where packet loss is acceptable in a UDP application."];

window.VLAB_DATA.tcp.practice_commands = ["telnet 192.168.1.10 80", "show tcp brief", "netstat -tnap"];
window.VLAB_DATA.tcp.practice_questions = ["Describe the state transitions during a TCP 3-way handshake.", "What is the role of the Advertised Window in TCP flow control?"];

window.VLAB_DATA.dns.practice_commands = ["nslookup -type=mx google.com", "dig @8.8.8.8 www.mit.edu", "ipconfig /displaydns"];
window.VLAB_DATA.dns.practice_questions = ["Explain the difference between an 'A' record and a 'CNAME' record.", "What is the function of the Root DNS servers?"];

window.VLAB_DATA.cables_devices.practice_commands = ["show version", "show inventory", "show interface status"];
window.VLAB_DATA.cables_devices.practice_questions = ["When would you use a Crossover cable instead of a Straight-through cable?", "What are the advantages of Fiber Optic over Copper?"];

window.VLAB_DATA.modulation.practice_commands = ["analyze spectrum am", "measure snr", "set sampling_rate 44100"];
window.VLAB_DATA.modulation.practice_questions = ["State the Nyquist Sampling Theorem.", "Why is FM more resistant to noise than AM?"];

window.VLAB_DATA.net_commands.practice_commands = ["tracert 8.8.8.8", "arp -a", "route print", "getmac"];
window.VLAB_DATA.net_commands.practice_questions = ["What does a request timed out error in ping indicate?", "How does tracert use the TTL field to discover hops?"];

window.VLAB_DATA.ip_class.practice_commands = ["ip address 10.0.0.1 255.0.0.0", "ip address 172.16.0.1 255.255.0.0", "show ip route"];
window.VLAB_DATA.ip_class.practice_questions = ["Identify the class and default mask for 223.255.255.0.", "What are the private IP ranges for Class A, B, and C?"];

window.VLAB_DATA.vlan.practice_commands = ["vlan 10", "name Marketing", "switchport mode access", "switchport access vlan 10", "show vlan brief"];
window.VLAB_DATA.vlan.practice_questions = ["What is the purpose of a Trunk port?", "How does a VLAN reduce the size of a broadcast domain?"];
