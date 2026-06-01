export default {
  id: "Subnetting",
  title: "Subnetting (VLSM, CIDR)",
  concept: `Subnetting splits an address block into smaller networks. CIDR uses variable prefix lengths. VLSM allocates differently sized subnets based on host needs.`,
  steps: ["Identify required host counts", "Choose prefixes for each subnet", "Allocate from largest to smallest", "Assign gateways and host IPs"],
  cliExamples: ["show ip interface brief", "show ip route"],
  practice: ["Create two subnets and place PCs in each.", "Configure router interfaces as default gateways."],
  checks: [
    (model) => {
      const routers = model.nodes.filter((n) => n.kind === "router").length;
      return { ok: routers >= 1, points: 25, remark: "Add a router to route between subnets." };
    },
  ],
};

