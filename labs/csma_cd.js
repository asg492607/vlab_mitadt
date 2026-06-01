export default {
  id: "CSMA/CD",
  title: "CSMA/CD (Ethernet collision detection)",
  concept: `CSMA/CD is the classic Ethernet media-access method for shared half-duplex links. A station senses the medium, transmits if idle, detects collisions, then backs off using a randomized delay.`,
  steps: [
    "Shared medium: hub / half-duplex segment",
    "Carrier sense: listen before transmit",
    "Collision detect: detect overlap of signals",
    "Jam + backoff: stop, wait random time, retry",
  ],
  cliExamples: [
    "show interfaces",
    "show controllers ethernet-controller",
  ],
  practice: [
    "Build a hub-based topology with 3 PCs and observe simulated collisions.",
    "Switch the hub to a switch and note collisions disappear (full-duplex links).",
  ],
  checks: [
    (model) => {
      const hubs = model.nodes.filter((n) => n.kind === "hub").length;
      return { ok: hubs >= 1, points: 30, remark: "Add at least one hub to create a shared medium." };
    },
  ],
};

