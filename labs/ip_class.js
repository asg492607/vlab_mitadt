export default {
  id: "IpClass",
  title: "IPv4 Address Classification",
  concept: `IPv4 addresses are divided into classes (A, B, C, D, E) based on the first octet. This determines the default network and host portions.`,
  steps: ["Identify the first octet", "Determine address class", "Identify Network ID", "Identify Host ID"],
  cliExamples: ["ip address 192.168.1.1 255.255.255.0", "show ip interface brief"],
  practice: ["Assign a Class B IP to a Server and a Class C IP to a PC.", "Verify if the devices can communicate on the same subnet."],
  checks: [
    (model) => ({ ok: model.nodes.some(n => n.endpoint?.ip), points: 50, remark: "Assign an IP address to at least one device." })
  ],
};
