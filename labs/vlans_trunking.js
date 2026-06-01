export default {
  id: "Vlan",
  title: "VLANs & Trunking",
  concept: `VLANs segment a switch into multiple Layer-2 broadcast domains. Trunks carry multiple VLANs between switches using 802.1Q tagging. Access ports carry a single VLAN.`,
  steps: ["Create VLAN IDs", "Set access ports to VLANs", "Configure trunk on uplink", "Verify VLAN membership and trunk allowed VLANs"],
  cliExamples: ["conf t", "vlan 10", "int f0/1", "switchport mode access", "switchport access vlan 10", "int g0/1", "switchport mode trunk", "encapsulation dot1q 10"],
  practice: ["Place 2 PCs in VLAN 10 and 2 PCs in VLAN 20 on the same switch.", "Add a second switch and connect via trunk; verify VLAN continuity."],
  checks: [
    (model) => ({ ok: model.nodes.some((n) => n.kind === "switch"), points: 20, remark: "Add at least one switch." }),
    (model) => ({ ok: model.nodes.filter((n) => n.kind === "pc").length >= 2, points: 10, remark: "Add at least two PCs." }),
  ],
};

