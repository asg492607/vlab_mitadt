export default {
  id: "NetCommands",
  title: "Networking Commands & Utilities",
  concept: `Utilities like ping, tracert, and ipconfig are essential for diagnosing network connectivity, path analysis, and interface configuration.`,
  steps: ["Check local IP config", "Test end-to-end connectivity (ping)", "Trace network path (tracert)", "Verify DNS resolution (nslookup)"],
  cliExamples: ["ping 127.0.0.1", "ipconfig /all", "tracert google.com", "nslookup", "arp -a"],
  practice: ["Ping a remote server and check for packet loss.", "Use nslookup to resolve a custom domain name."],
  checks: [
    (model) => ({ ok: model.nodes.filter(n => n.kind === 'pc').length >= 2, points: 20, remark: "Add at least two hosts for testing commands." }),
    (model) => ({ ok: model.links.length >= 1, points: 20, remark: "Connect nodes to test connectivity commands." })
  ],
};
