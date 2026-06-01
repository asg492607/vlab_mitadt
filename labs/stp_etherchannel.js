export default {
  id: "STP-ETHCH",
  title: "STP & EtherChannel",
  concept: `STP prevents Layer-2 loops by blocking redundant paths. EtherChannel bundles multiple physical links into a single logical link to increase bandwidth and provide redundancy.`,
  steps: ["Create a looped L2 topology", "Observe STP blocking a port", "Bundle parallel links as an EtherChannel", "Verify loop-free forwarding"],
  cliExamples: ["show spanning-tree", "interface range f0/1-2", "channel-group 1 mode active", "show etherchannel summary"],
  practice: ["Connect 3 switches in a triangle.", "Add a second parallel link between two switches and bundle it."],
  checks: [
    (model) => ({ ok: model.nodes.filter((n) => n.kind === "switch").length >= 3, points: 30, remark: "Use at least 3 switches to demonstrate STP in a loop." }),
    (model) => ({ ok: model.links.length >= 3, points: 10, remark: "Add enough links to create a loop." }),
  ],
};

