export default {
  id: "OSPF",
  title: "Link State Routing (OSPF, Dijkstra)",
  concept: `Link State routing floods link-state information and computes shortest paths using Dijkstra's algorithm. OSPF organizes networks into areas and forms adjacencies via hello packets.`,
  steps: ["Configure OSPF process ID", "Add networks to area", "Check neighbor adjacency", "Verify LSDB and routes"],
  cliExamples: ["conf t", "router ospf 1", "network 10.0.0.0 0.0.0.255 area 0", "show ip ospf neighbor", "show ip route ospf", "debug ip ospf events"],
  practice: ["Build a triangle of 3 routers.", "Enable OSPF area 0 and verify equal-cost paths."],
  checks: [
    (model) => {
      const routers = model.nodes.filter((n) => n.kind === "router").length;
      return { ok: routers >= 3, points: 30, remark: "Use at least 3 routers for OSPF adjacency demonstration." };
    },
  ],
};

