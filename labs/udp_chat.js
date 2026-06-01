export default {
  id: "UDP Chat",
  title: "UDP Chat (connectionless sockets)",
  concept: `UDP is connectionless and does not guarantee delivery, ordering, or duplicates. Applications implement their own reliability if needed.`,
  steps: ["Choose UDP port", "Send datagrams between endpoints", "Observe no handshake and best-effort delivery"],
  cliExamples: ["netstat", "show udp"],
  practice: ["Create 2 PCs and simulate UDP messages.", "Discuss when UDP is preferable (voice/video, DNS queries)."],
  checks: [
    (model) => {
      const pcs = model.nodes.filter((n) => n.kind === "pc").length;
      return { ok: pcs >= 2, points: 20, remark: "Add at least 2 PCs for UDP chat." };
    },
  ],
};

