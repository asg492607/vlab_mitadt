export default {
  id: "IPv6",
  title: "IPv6 basics (addressing, routing)",
  concept: `IPv6 uses 128-bit addresses and typically /64 subnets. Neighbor Discovery (ND) replaces ARP. Routing concepts remain similar (connected routes, dynamic protocols).`,
  steps: ["Assign IPv6 addresses", "Enable IPv6 routing (if applicable)", "Verify reachability with ping6", "Discuss link-local vs global unicast"],
  cliExamples: ["show ipv6 interface brief", "ping ipv6 <addr>", "ipv6 unicast-routing"],
  practice: ["Assign IPv6 addresses to two PCs on the same LAN.", "Add a router and route between two IPv6 subnets."],
  checks: [
    (model) => ({ ok: model.nodes.filter((n) => n.kind === "pc").length >= 2, points: 15, remark: "Add at least 2 PCs for IPv6 tests." }),
  ],
};

