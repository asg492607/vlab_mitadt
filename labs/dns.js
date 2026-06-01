export default {
  id: "DNS",
  title: "DNS (name resolution)",
  concept: `DNS maps names to IP addresses using records like A/AAAA/CNAME. Clients query resolvers; caching improves performance.`,
  steps: ["Configure DNS server records", "Point clients to DNS server", "Use nslookup to query records", "Verify traffic in timeline"],
  cliExamples: ["nslookup example.local", "ipconfig /all"],
  practice: ["Add a DNS server with an A record.", "Resolve a name from a PC and then ping the returned IP."],
  checks: [
    (model) => {
      const servers = model.nodes.filter((n) => n.kind === "server" && (n.services?.dns ?? false)).length;
      return { ok: servers >= 1, points: 25, remark: "Enable DNS on at least one server." };
    },
  ],
};

