export default {
  id: "TCP Transfer",
  title: "TCP File Transfer (reliable transport)",
  concept: `TCP provides reliable, ordered delivery using sequence numbers, acknowledgements, retransmissions, and congestion control. A 3-way handshake establishes state before data flows.`,
  steps: ["SYN", "SYN-ACK", "ACK", "Data segments + ACKs", "FIN teardown"],
  cliExamples: ["netstat", "show tcp brief"],
  practice: ["Simulate a TCP file transfer from PC to server.", "Introduce packet loss and observe retransmissions in timeline."],
  checks: [
    (model) => {
      const servers = model.nodes.filter((n) => n.kind === "server").length;
      return { ok: servers >= 1, points: 20, remark: "Add at least one server for a TCP transfer target." };
    },
  ],
};

