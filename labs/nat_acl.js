export default {
  id: "NAT-ACL",
  title: "NAT & ACLs",
  concept: `NAT translates private addresses to public addresses. ACLs permit/deny traffic based on match conditions (source/destination/protocol/ports). Together they enforce policy and enable internet access from private subnets.`,
  steps: ["Define inside/outside interfaces", "Create NAT rule (PAT overload)", "Create ACL permit/deny entries", "Test permitted vs denied traffic"],
  cliExamples: ["conf t", "ip nat inside", "ip nat outside", "access-list 1 permit 192.168.1.0 0.0.0.255", "ip nat inside source list 1 interface g0/1 overload"],
  practice: ["Build a LAN behind a router and a server outside.", "Apply ACL to block ICMP but permit DNS."],
  checks: [
    (model) => ({ ok: model.nodes.some((n) => n.kind === "router" || n.kind === "firewall"), points: 20, remark: "Add a router or firewall as the policy point." }),
    (model) => ({ ok: model.nodes.filter((n) => n.kind === "server").length >= 1, points: 10, remark: "Add at least one server (outside host)." }),
  ],
};

