export default {
  id: "RIP",
  title: "Distance Vector Routing (RIP)",
  concept: `Distance Vector routing shares routes with neighbors. RIP uses hop count as metric (max 15). Split horizon helps prevent routing loops.`,
  steps: ["Enable RIP", "Advertise connected networks", "Verify learned routes", "Discuss split horizon + route poisoning"],
  cliExamples: ["conf t", "router rip", "version 2", "network 10.0.0.0", "show ip route", "debug ip rip"],
  practice: ["Build a 3-router line topology.", "Enable RIP on all routers and verify end-to-end connectivity."],
  checks: [
    (model) => {
      const routers = model.nodes.filter((n) => n.kind === "router").length;
      return { ok: routers >= 3, points: 30, remark: "Use at least 3 routers for RIP propagation." };
    },
  ],
};

