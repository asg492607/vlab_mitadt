export default {
  id: "CSMA/CA",
  title: "CSMA/CA (Wireless collision avoidance)",
  concept: `Wireless uses CSMA/CA: nodes avoid collisions via random backoff, interframe spacing, and optional RTS/CTS. Collisions are hard to detect over the air, so avoidance is preferred.`,
  steps: ["Sense channel energy", "Random backoff counter", "Transmit when counter reaches 0", "Optional RTS/CTS to reduce hidden-node effects"],
  cliExamples: ["show dot11 associations", "show controllers dot11Radio"],
  practice: ["Add an AP and two wireless PCs; simulate contention by generating traffic.", "Discuss hidden node and how RTS/CTS helps."],
  checks: [
    (model) => {
      const aps = model.nodes.filter((n) => n.kind === "ap").length;
      return { ok: aps >= 1, points: 30, remark: "Add at least one wireless access point." };
    },
  ],
};

