export default {
  id: "CablesDevices",
  title: "Cables, Connectors and Networking Devices",
  concept: `Networking media (UTP, Fiber, Coaxial) and devices (Hub, Switch, Router) form the foundation of data communication. Proper cabling and device selection ensure efficient traffic flow.`,
  steps: ["Select appropriate cable type", "Connect devices via correct ports", "Verify physical link status", "Examine device roles (L1/L2/L3)"],
  cliExamples: ["show interface brief", "show version"],
  practice: ["Connect two PCs using a crossover cable.", "Connect multiple PCs to a central Switch using straight-through cables."],
  checks: [
    (model) => ({ ok: model.links.length >= 1, points: 20, remark: "Establish at least one physical connection." }),
    (model) => ({ ok: model.nodes.some(n => n.kind === 'router' || n.kind === 'switch'), points: 20, remark: "Use a networking device (Switch/Router)." })
  ],
};
