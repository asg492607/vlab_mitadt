export default {
  id: "RoutingProtocols",
  title: "Dynamic Routing Protocols (OSPF & BGP)",
  concept: `OSPF and BGP are advanced dynamic routing protocols. OSPF uses link-states for internal routing, while BGP is a path-vector protocol for inter-AS routing.`,
  steps: ["Enable routing process", "Define AS/Process ID", "Advertise network segments", "Verify adjacency and routing table"],
  cliExamples: ["router ospf 1", "network 10.0.0.0 0.255.255.255 area 0", "router bgp 65001", "neighbor 192.168.1.1 remote-as 65002"],
  practice: ["Configure OSPF between three routers in Area 0.", "Establish a BGP peering session between two autonomous systems."],
  checks: [
    (model) => ({ ok: model.nodes.filter(n => n.kind === 'router').length >= 2, points: 40, remark: "Connect at least two routers to test dynamic routing." }),
    (model) => ({ ok: model.links.filter(l => l.kind === 'serial' || l.kind === 'straight').length >= 1, points: 20, remark: "Establish a link between routers." })
  ],
};
