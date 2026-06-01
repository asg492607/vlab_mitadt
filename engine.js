// MIT ADT VLab simulation engine (intentionally simplified, deterministic, and local-only)
export const PROTOCOLS = [
  "ARP",
  "ICMP",
  "DHCP",
  "DNS",
  "TCP",
  "UDP",
  "RIP",
  "OSPF",
  "BGP",
  "VLAN",
  "NAT",
  "STP",
  "ETHCH",
];

export const ETH_BROADCAST = "ff:ff:ff:ff:ff:ff";

export function nowMs() {
  return performance.now();
}

export function ipToInt(ip) {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

export function intToIp(v) {
  return `${(v >>> 24) & 255}.${(v >>> 16) & 255}.${(v >>> 8) & 255}.${v & 255}`;
}

export function maskToPrefix(mask) {
  const m = ipToInt(mask);
  if (m === null) return null;
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((m >>> i) & 1) count++;
    else break;
  }
  const contiguous = ((~((1 << (32 - count)) - 1)) >>> 0) === m;
  return contiguous ? count : null;
}

export function prefixToMask(prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  if (prefix === 0) return "0.0.0.0";
  const m = (~((1 << (32 - prefix)) - 1)) >>> 0;
  return intToIp(m);
}

export function sameSubnet(ipA, ipB, mask) {
  const a = ipToInt(ipA);
  const b = ipToInt(ipB);
  const m = ipToInt(mask);
  if (a === null || b === null || m === null) return false;
  return (a & m) >>> 0 === (b & m) >>> 0;
}

export function networkOf(ip, mask) {
  const a = ipToInt(ip);
  const m = ipToInt(mask);
  if (a === null || m === null) return null;
  return intToIp((a & m) >>> 0);
}

export function wildcardOf(mask) {
  const m = ipToInt(mask);
  if (m === null) return null;
  return intToIp((~m) >>> 0);
}

function rndId(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function normMac(mac) {
  return String(mac ?? "").trim().toLowerCase();
}

function isBroadcastMac(mac) {
  return normMac(mac) === ETH_BROADCAST;
}

export class SimEngine {
  constructor({ model, onEvent }) {
    this.model = model;
    this.onEvent = onEvent;
    this.mode = "realtime"; // realtime | simulation
    this.queue = [];
    this.logs = [];
    this.seq = 0;
    this.lastTick = nowMs();
  }

  setMode(mode) {
    this.mode = mode;
  }

  clearLogs() {
    this.logs = [];
  }

  emit(evt) {
    const row = {
      id: rndId("pdu"),
      ts: new Date().toISOString(),
      tms: nowMs(),
      seq: ++this.seq,
      ...evt,
    };
    this.logs.push(row);
    this.onEvent?.(row);
  }

  enqueue(evt) {
    this.queue.push({ ...evt, enq: nowMs(), id: evt.id ?? rndId("evt") });
  }

  step() {
    const evt = this.queue.shift();
    if (!evt) return false;
    this.processEvent(evt);
    return true;
  }

  tick() {
    const t = nowMs();
    const dt = t - this.lastTick;
    this.lastTick = t;

    if (this.mode !== "realtime") return;

    // Process a bounded number of queued events per frame for responsiveness
    let budget = 30;
    while (budget-- > 0 && this.queue.length) {
      const evt = this.queue.shift();
      this.processEvent(evt);
    }

    // Periodic routing updates
    this.maybeRoutingTick(dt);
  }

  maybeRoutingTick(dt) {
    this._rtAcc = (this._rtAcc ?? 0) + dt;
    if (this._rtAcc < 800) return;
    this._rtAcc = 0;
    this.runRIP();
    this.runOSPF();
    // BGP intentionally left as a placeholder hook (can be expanded per lab)
  }

  processEvent(evt) {
    switch (evt.type) {
      case "PING":
        return this.handlePing(evt);
      case "UDP_SEND":
        return this.handleUdpSend(evt);
      case "TCP_CONNECT":
      case "TCP_DATA":
        return this.handleTcp(evt);
      case "ARP_REQUEST":
      case "ARP_REPLY":
        return this.handleARP(evt);
      case "DHCP_DISCOVER":
      case "DHCP_OFFER":
      case "DHCP_REQUEST":
      case "DHCP_ACK":
        return this.handleDHCP(evt);
      case "DNS_QUERY":
      case "DNS_REPLY":
        return this.handleDNS(evt);
      case "ROUTE_ADVERT":
        return this.handleRouteAdvert(evt);
      default:
        this.emit({ proto: "UDP", status: "warn", summary: `Unhandled event ${evt.type}`, detail: JSON.stringify(evt) });
    }
  }

  // ===== Topology helpers =====
  findNodeById(id) {
    return this.model.nodes.find((n) => n.id === id) ?? null;
  }

  findNodeByName(name) {
    const key = String(name ?? "").toLowerCase();
    return this.model.nodes.find((n) => n.name.toLowerCase() === key) ?? null;
  }

  neighbors(nodeId) {
    const out = [];
    for (const l of this.model.links) {
      if (l.state && l.state !== "up") continue;
      if (l.a.nodeId === nodeId) out.push({ link: l, to: l.b.nodeId, fromPort: l.a.port, toPort: l.b.port });
      else if (l.b.nodeId === nodeId) out.push({ link: l, to: l.a.nodeId, fromPort: l.b.port, toPort: l.a.port });
    }
    return out;
  }

  peerForPort(nodeId, portName) {
    for (const l of this.model.links) {
      if (l.state && l.state !== "up") continue;
      if (l.a.nodeId === nodeId && l.a.port === portName) return { nodeId: l.b.nodeId, port: l.b.port, linkId: l.id, link: l };
      if (l.b.nodeId === nodeId && l.b.port === portName) return { nodeId: l.a.nodeId, port: l.a.port, linkId: l.id, link: l };
    }
    return null;
  }

  pickAttachedPort(node) {
    // Prefer common edge ports
    const preferred = ["eth0", "wlan0", "g0/0", "f0/1"];
    for (const p of preferred) {
      if (node.ports?.some((x) => x.name === p) && this.peerForPort(node.id, p)) return p;
    }
    for (const p of node.ports ?? []) {
      if (this.peerForPort(node.id, p.name)) return p.name;
    }
    return null;
  }

  // ===== L2/L3 packet model (subset) =====
  // Frame: { srcMac, dstMac, ethType: "ARP"|"IP", vlan: number|null, payload: object }
  // ARP: { op:"request"|"reply", senderIp, senderMac, targetIp, targetMac }
  // IP:  { srcIp, dstIp, proto:"ICMP", payload:{ type:"echo"|"reply", id, seq } }
  sendFrame({ fromNodeId, fromPort, frame }) {
    const visited = new Set();
    const queue = [{ nodeId: fromNodeId, port: fromPort, frame, ingress: false }];
    let hops = 0;
    while (queue.length) {
      const cur = queue.shift();
      const key = `${cur.nodeId}:${cur.port}:${normMac(cur.frame.srcMac)}:${normMac(cur.frame.dstMac)}:${cur.frame.ethType}:${cur.frame.vlan ?? "u"}`;
      if (visited.has(key)) continue;
      visited.add(key);
      hops++;

      const peer = this.peerForPort(cur.nodeId, cur.port);
      if (!peer) continue;

      const toNode = this.findNodeById(peer.nodeId);
      if (!toNode) continue;

      const delivered = this.deliverToNode({ node: toNode, ingressPort: peer.port, frame: cur.frame });
      for (const egress of delivered) {
        queue.push({ nodeId: toNode.id, port: egress.egressPort, frame: egress.frame, ingress: true });
      }
    }
    return { hops };
  }

  deliverToNode({ node, ingressPort, frame }) {
    if (node.kind === "hub") return this.hubDeliver(node, ingressPort, frame);
    if (node.kind === "switch") return this.switchDeliver(node, ingressPort, frame);
    // endpoints / routers / servers behave as hosts for this subset
    return this.hostDeliver(node, ingressPort, frame);
  }

  // Hub: repeat to all other ports (no VLAN enforcement)
  hubDeliver(node, ingressPort, frame) {
    const out = [];
    for (const p of node.ports ?? []) {
      if (p.name === ingressPort) continue;
      if (!this.peerForPort(node.id, p.name)) continue;
      out.push({ egressPort: p.name, frame });
    }
    return out;
  }

  // Switch: VLAN-aware forwarding + MAC learning (access/trunk)
  switchDeliver(node, ingressPort, frame) {
    node.macTable = node.macTable ?? {}; // vlan -> { mac -> { port, lastSeen } }
    node.endpoint = node.endpoint ?? { ifs: {} };
    node.endpoint.ifs = node.endpoint.ifs ?? {};

    const inCfg = node.endpoint.ifs[ingressPort] ?? {};
    const portMetaIn = (node.ports ?? []).find((p) => p.name === ingressPort);
    if (portMetaIn && portMetaIn.up === false) return [];
    if (inCfg.shutdown) return [];
    const inMode = (inCfg.swMode ?? "access").toLowerCase();
    const accessVlan = Number(inCfg.accessVlan ?? 1) || 1;
    const nativeVlan = Number(inCfg.nativeVlan ?? 1) || 1;

    // Determine VLAN on ingress
    let vlan = frame.vlan;
    if (inMode === "access") {
      if (vlan != null) return []; // drop tagged on access
      vlan = accessVlan;
    } else if (inMode === "trunk") {
      vlan = vlan == null ? nativeVlan : vlan;
      if (!this.vlanAllowed(inCfg.allowedVlans, vlan)) return [];
    } else {
      vlan = vlan ?? 1;
    }

    // MAC learn
    const src = normMac(frame.srcMac);
    const dst = normMac(frame.dstMac);
    node.macTable[vlan] = node.macTable[vlan] ?? {};
    node.macTable[vlan][src] = { port: ingressPort, lastSeen: nowMs() };

    // Forward decision
    const outPorts = [];
    if (isBroadcastMac(dst)) {
      for (const p of node.ports ?? []) if (p.name !== ingressPort) outPorts.push(p.name);
    } else {
      const entry = node.macTable[vlan]?.[dst];
      if (entry?.port && entry.port !== ingressPort) outPorts.push(entry.port);
      else {
        for (const p of node.ports ?? []) if (p.name !== ingressPort) outPorts.push(p.name);
      }
    }

    const out = [];
    for (const p of outPorts) {
      if (!this.peerForPort(node.id, p)) continue;
      const outCfg = node.endpoint.ifs[p] ?? {};
      const portMeta = (node.ports ?? []).find((x) => x.name === p);
      if (portMeta && portMeta.up === false) continue;
      if (outCfg.shutdown) continue;
      const outMode = (outCfg.swMode ?? "access").toLowerCase();
      const outAccessVlan = Number(outCfg.accessVlan ?? 1) || 1;
      const outNativeVlan = Number(outCfg.nativeVlan ?? 1) || 1;

      // VLAN filtering for access ports
      if (outMode === "access" && outAccessVlan !== vlan) continue;
      if (outMode === "trunk" && !this.vlanAllowed(outCfg.allowedVlans, vlan)) continue;

      const egress = { ...frame, vlan };
      // Tag/untag for egress
      if (outMode === "access") egress.vlan = null;
      else if (outMode === "trunk") egress.vlan = vlan === outNativeVlan ? null : vlan;
      out.push({ egressPort: p, frame: egress });
    }
    return out;
  }

  vlanAllowed(spec, vlan) {
    if (!spec || spec === "all") return true;
    const s = String(spec).trim().toLowerCase();
    if (s === "all") return true;
    // Accept comma list and simple ranges like "10-20"
    const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
    for (const p of parts) {
      const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        const a = Number(m[1]);
        const b = Number(m[2]);
        if (vlan >= Math.min(a, b) && vlan <= Math.max(a, b)) return true;
        continue;
      }
      const n = Number(p);
      if (Number.isFinite(n) && n === vlan) return true;
    }
    return false;
  }

  hostDeliver(node, ingressPort, frame) {
    const ep = node.endpoint ?? {};
    const mac = normMac(ep.mac);
    const dst = normMac(frame.dstMac);
    if (!isBroadcastMac(dst) && mac && dst !== mac) return [];

    if (frame.ethType === "ARP") {
      const arp = frame.payload;
      if (!arp || !arp.op) return [];
      if (arp.op === "request") {
        const myIp = typeof ep.ip === "string" ? ep.ip.trim() : "";
        if (myIp && myIp === String(arp.targetIp ?? "").trim()) {
          // Reply
          const reply = {
            srcMac: ep.mac,
            dstMac: arp.senderMac,
            ethType: "ARP",
            vlan: frame.vlan,
            payload: {
              op: "reply",
              senderIp: myIp,
              senderMac: ep.mac,
              targetIp: arp.senderIp,
              targetMac: arp.senderMac,
            },
          };
          const outPort = this.pickAttachedPort(node);
          if (!outPort) return [];
          this.emit({ proto: "ARP", status: "ok", summary: `ARP reply: ${myIp} is-at ${ep.mac}`, detail: `${node.name} → ${arp.senderIp}` });
          this.sendFrame({ fromNodeId: node.id, fromPort: outPort, frame: reply });
        }
        return [];
      }
      if (arp.op === "reply") {
        ep.arp = ep.arp ?? {};
        ep.arp[String(arp.senderIp).trim()] = String(arp.senderMac).trim();
        return [];
      }
    }

    if (frame.ethType === "IP") {
      const ip = frame.payload;
      if (!ip || ip.proto !== "ICMP") return [];
      const myIp = typeof ep.ip === "string" ? ep.ip.trim() : "";
      if (!myIp || myIp !== String(ip.dstIp ?? "").trim()) return [];
      const icmp = ip.payload;
      if (!icmp) return [];

      if (icmp.type === "echo") {
        const replyIp = {
          srcIp: myIp,
          dstIp: ip.srcIp,
          proto: "ICMP",
          payload: { type: "reply", id: icmp.id, seq: icmp.seq },
        };
        const replyFrame = { srcMac: ep.mac, dstMac: frame.srcMac, ethType: "IP", vlan: frame.vlan, payload: replyIp };
        const outPort = this.pickAttachedPort(node);
        if (!outPort) return [];
        this.sendFrame({ fromNodeId: node.id, fromPort: outPort, frame: replyFrame });
      }
    }

    return [];
  }

  shortestPath(srcId, dstId) {
    if (srcId === dstId) return [srcId];
    
    const srcNode = this.findNodeById(srcId);
    const dstNode = this.findNodeById(dstId);
    if (!srcNode || !dstNode) return null;

    // 1. If source is a router, check routing table
    if (srcNode.kind === "router" && srcNode.routes?.length) {
      const dstIp = this.pickSourceL3(this.model.findEndpointByNodeId(dstId)).ip;
      if (dstIp) {
        const route = this.lookupRoute(srcNode, dstIp);
        if (route && route.via) {
          const nextRouter = this.findNodeByName(route.via);
          if (nextRouter) {
            const subPath = this.shortestPath(nextRouter.id, dstId);
            if (subPath) return [srcId, ...subPath];
          }
        }
      }
    }

    // 2. Fallback to BFS for direct connectivity/L2
    const q = [srcId];
    const prev = new Map();
    prev.set(srcId, null);
    while (q.length) {
      const cur = q.shift();
      for (const nb of this.neighbors(cur)) {
        if (prev.has(nb.to)) continue;
        prev.set(nb.to, cur);
        if (nb.to === dstId) {
          const path = [dstId];
          let p = cur;
          while (p) {
            path.push(p);
            p = prev.get(p);
          }
          return path.reverse();
        }
        q.push(nb.to);
      }
    }
    return null;
  }

  lookupRoute(router, ip) {
    // Best effort matching (longest prefix match placeholder)
    if (!router.routes) return null;
    const target = ipToInt(ip);
    let bestMatch = null;
    let maxPrefix = -1;

    for (const r of router.routes) {
      const net = ipToInt(r.net);
      const m = ipToInt(r.mask);
      const prefix = maskToPrefix(r.mask);
      if ((target & m) >>> 0 === (net & m) >>> 0) {
        if (prefix > maxPrefix) {
          maxPrefix = prefix;
          bestMatch = r;
        }
      }
    }
    return bestMatch;
  }

  // ===== ARP =====
  handleARP(evt) {
    if (evt.type === "ARP_REQUEST") {
      this.emit({
        proto: "ARP",
        status: "ok",
        summary: `ARP? Who has ${evt.targetIp} tell ${evt.srcIp}`,
        detail: `From ${evt.srcNode} → broadcast (L2)`,
      });
      const srcNode = this.findNodeByName(evt.srcNode);
      if (!srcNode) return;
      const port = this.pickAttachedPort(srcNode);
      if (!port) return;
      const frame = {
        srcMac: evt.srcMac,
        dstMac: ETH_BROADCAST,
        ethType: "ARP",
        vlan: null,
        payload: { op: "request", senderIp: evt.srcIp, senderMac: evt.srcMac, targetIp: evt.targetIp, targetMac: "00:00:00:00:00:00" },
      };
      this.sendFrame({ fromNodeId: srcNode.id, fromPort: port, frame });
      return;
    }

    if (evt.type === "ARP_REPLY") {
      this.emit({
        proto: "ARP",
        status: "ok",
        summary: `ARP reply: ${evt.srcIp} is-at ${evt.srcMac}`,
        detail: `To ${evt.dstNode} (${evt.dstIp})`,
      });
      const dstNode = this.findNodeByName(evt.dstNode);
      if (!dstNode) return;
      const port = this.pickAttachedPort(dstNode);
      if (!port) return;
      const frame = {
        srcMac: evt.srcMac,
        dstMac: evt.dstMac,
        ethType: "ARP",
        vlan: null,
        payload: { op: "reply", senderIp: evt.srcIp, senderMac: evt.srcMac, targetIp: evt.dstIp, targetMac: evt.dstMac },
      };
      this.sendFrame({ fromNodeId: dstNode.id, fromPort: port, frame });
    }
  }

  // ===== ICMP Ping =====
  handlePing(evt) {
    const srcEp = this.model.findEndpointByNodeName(evt.srcNode);
    const dstEp = this.model.findEndpointByIp(evt.dstIp);

    if (!srcEp) {
      this.emit({ proto: "ICMP", status: "bad", summary: `Ping failed: unknown source ${evt.srcNode}`, detail: "" });
      return;
    }
    if (!dstEp) {
      this.emit({ proto: "ICMP", status: "bad", summary: `Ping failed: host unreachable (${evt.dstIp})`, detail: "" });
      return;
    }

    const l3 = this.pickSourceL3(srcEp);
    const srcIp = l3.ip ?? "";
    const srcMask = l3.mask ?? "";
    const srcMac = srcEp.mac ?? "";

    const srcNode = this.findNodeByName(evt.srcNode);
    if (!srcNode) return;
    const outPort = this.pickAttachedPort(srcNode);
    if (!outPort) {
      this.emit({ proto: "ICMP", status: "bad", summary: `Ping failed: ${evt.srcNode} not connected`, detail: "" });
      return;
    }

    // L2/ARP: resolve destination MAC for same-subnet traffic (no routing yet)
    const inSame = !!srcIp && !!srcMask && sameSubnet(srcIp, evt.dstIp, srcMask);
    if (!inSame) {
      this.emit({ proto: "ICMP", status: "bad", summary: `Ping failed: routing not implemented (L2-only)`, detail: `Source ${srcIp}/${srcMask} → ${evt.dstIp}` });
      return;
    }

    srcEp.arp = srcEp.arp ?? {};
    const dstMac = srcEp.arp[evt.dstIp];
    if (!dstMac) {
      this.enqueue({ type: "ARP_REQUEST", srcNode: evt.srcNode, srcIp, srcMac, targetIp: evt.dstIp });
      this.enqueue({ ...evt, _retry: (evt._retry ?? 0) + 1 });
      if ((evt._retry ?? 0) > 1) this.emit({ proto: "ICMP", status: "warn", summary: `Waiting for ARP...`, detail: "" });
      return;
    }

    const icmpId = evt._id ?? Math.floor(Math.random() * 65535);
    const seq = evt._seq ?? 1;
    const ipPkt = { srcIp, dstIp: evt.dstIp, proto: "ICMP", payload: { type: "echo", id: icmpId, seq } };
    const frame = { srcMac, dstMac, ethType: "IP", vlan: null, payload: ipPkt };
    const res = this.sendFrame({ fromNodeId: srcNode.id, fromPort: outPort, frame });

    this.emit({
      proto: "ICMP",
      status: "ok",
      summary: `ICMP echo ${srcIp || evt.srcNode} → ${evt.dstIp} (len=32)`,
      detail: `L2 delivered (hops=${res.hops})`,
    });
    this.emit({
      proto: "ICMP",
      status: "ok",
      summary: `ICMP echo-reply ${evt.dstIp} → ${srcIp || evt.srcNode}`,
      detail: `RTT: ${Math.max(1, Math.round(res.hops * 2))}ms (simulated)`,
    });
  }

  pickSourceL3(srcEp) {
    if (!srcEp) return { ip: "", mask: "" };
    if (typeof srcEp.ip === "string" && srcEp.ip.trim()) {
      return { ip: srcEp.ip.trim(), mask: typeof srcEp.mask === "string" ? srcEp.mask.trim() : "" };
    }
    const ifs = srcEp.ifs ?? {};
    for (const v of Object.values(ifs)) {
      if (typeof v?.ip === "string" && v.ip.trim()) {
        return { ip: v.ip.trim(), mask: typeof v?.mask === "string" ? v.mask.trim() : "" };
      }
    }
    return { ip: "", mask: "" };
  }

  // ===== DHCP =====
  handleDHCP(evt) {
    if (evt.type === "DHCP_DISCOVER") {
      this.emit({ proto: "DHCP", status: "ok", summary: `DHCP Discover from ${evt.clientNode}`, detail: "" });
      const server = this.model.findDhcpServer();
      if (!server) {
        this.emit({ proto: "DHCP", status: "bad", summary: `No DHCP server available`, detail: "" });
        return;
      }
      const offerIp = server.dhcp.allocate(evt.clientMac);
      if (!offerIp) {
        this.emit({ proto: "DHCP", status: "bad", summary: `DHCP pool exhausted`, detail: "" });
        return;
      }
      this.enqueue({ type: "DHCP_OFFER", serverNode: server.node.name, clientNode: evt.clientNode, offeredIp: offerIp, mask: server.dhcp.mask, gw: server.dhcp.gateway, dns: server.dhcp.dns });
      return;
    }

    if (evt.type === "DHCP_OFFER") {
      this.emit({ proto: "DHCP", status: "ok", summary: `DHCP Offer ${evt.offeredIp} to ${evt.clientNode}`, detail: `Server: ${evt.serverNode}` });
      this.enqueue({ type: "DHCP_REQUEST", serverNode: evt.serverNode, clientNode: evt.clientNode, requestedIp: evt.offeredIp });
      return;
    }

    if (evt.type === "DHCP_REQUEST") {
      this.emit({ proto: "DHCP", status: "ok", summary: `DHCP Request ${evt.requestedIp} by ${evt.clientNode}`, detail: `Server: ${evt.serverNode}` });
      this.enqueue({ type: "DHCP_ACK", serverNode: evt.serverNode, clientNode: evt.clientNode, assignedIp: evt.requestedIp });
      return;
    }

    if (evt.type === "DHCP_ACK") {
      this.emit({ proto: "DHCP", status: "ok", summary: `DHCP ACK ${evt.assignedIp} to ${evt.clientNode}`, detail: "" });
      const client = this.model.findEndpointByNodeName(evt.clientNode);
      const server = this.model.findServerByNodeName(evt.serverNode);
      if (client && server) {
        client.ip = evt.assignedIp;
        client.mask = server.dhcp.mask;
        client.gateway = server.dhcp.gateway;
        client.dns = server.dhcp.dns;
      }
    }
  }

  // ===== DNS =====
  handleDNS(evt) {
    if (evt.type === "DNS_QUERY") {
      this.emit({ proto: "DNS", status: "ok", summary: `DNS query ${evt.qname} (${evt.qtype})`, detail: `From ${evt.srcNode}` });
      const server = this.model.findDnsServer(evt.serverIp);
      if (!server) {
        this.emit({ proto: "DNS", status: "bad", summary: `DNS server unreachable (${evt.serverIp})`, detail: "" });
        return;
      }
      const ans = server.dns.resolve(evt.qname, evt.qtype);
      this.enqueue({ type: "DNS_REPLY", qname: evt.qname, qtype: evt.qtype, answer: ans, srcNode: server.node.name, dstNode: evt.srcNode });
      return;
    }

    if (evt.type === "DNS_REPLY") {
      if (evt.answer?.length) {
        this.emit({ proto: "DNS", status: "ok", summary: `DNS reply ${evt.qname} = ${evt.answer.join(", ")}`, detail: `To ${evt.dstNode}` });
      } else {
        this.emit({ proto: "DNS", status: "warn", summary: `DNS NXDOMAIN ${evt.qname}`, detail: `To ${evt.dstNode}` });
      }
    }
  }

  // ===== UDP =====
  handleUdpSend(evt) {
    const srcEp = this.model.findEndpointByNodeName(evt.srcNode);
    const dstEp = this.model.findEndpointByIp(evt.dstIp);
    if (!srcEp || !dstEp) {
      this.emit({ proto: "UDP", status: "bad", summary: `UDP send failed (unreachable)`, detail: `${evt.srcNode} → ${evt.dstIp}` });
      return;
    }
    const path = this.shortestPath(srcEp.node.id, dstEp.node.id);
    if (!path) {
      this.emit({ proto: "UDP", status: "bad", summary: `UDP send failed: no path`, detail: `${evt.dstIp}` });
      return;
    }
    const l3 = this.pickSourceL3(srcEp);
    const sport = evt.srcPort ?? 49152;
    const dport = evt.dstPort ?? 5000;
    this.emit({
      proto: "UDP",
      status: "ok",
      summary: `UDP ${l3.ip || evt.srcNode}:${sport} → ${evt.dstIp}:${dport}`,
      detail: `Len=${(evt.payload ?? "").length} Path: ${path.map((id) => this.findNodeById(id)?.name ?? id).join(" → ")}`,
    });
  }

  // ===== TCP =====
  handleTcp(evt) {
    const srcEp = this.model.findEndpointByNodeName(evt.srcNode);
    const dstEp = this.model.findEndpointByIp(evt.dstIp);
    if (!srcEp || !dstEp) {
      this.emit({ proto: "TCP", status: "bad", summary: `TCP failed (unreachable)`, detail: `${evt.srcNode} → ${evt.dstIp}` });
      return;
    }
    const path = this.shortestPath(srcEp.node.id, dstEp.node.id);
    if (!path) {
      this.emit({ proto: "TCP", status: "bad", summary: `TCP failed: no path`, detail: `${evt.dstIp}` });
      return;
    }

    const l3 = this.pickSourceL3(srcEp);
    const sport = evt.srcPort ?? 51515;
    const dport = evt.dstPort ?? 80;

    if (evt.type === "TCP_CONNECT") {
      this.emit({ proto: "TCP", status: "ok", summary: `SYN ${l3.ip || evt.srcNode}:${sport} → ${evt.dstIp}:${dport}`, detail: `Path: ${path.map((id) => this.findNodeById(id)?.name ?? id).join(" → ")}` });
      this.emit({ proto: "TCP", status: "ok", summary: `SYN-ACK ${evt.dstIp}:${dport} → ${l3.ip || evt.srcNode}:${sport}`, detail: "" });
      this.emit({ proto: "TCP", status: "ok", summary: `ACK ${l3.ip || evt.srcNode}:${sport} → ${evt.dstIp}:${dport}`, detail: "Connection established (simulated)" });
      if (evt.payload) this.enqueue({ ...evt, type: "TCP_DATA" });
      return;
    }

    if (evt.type === "TCP_DATA") {
      const bytes = Number(evt.bytes ?? (evt.payload?.length ?? 0)) || 0;
      this.emit({ proto: "TCP", status: "ok", summary: `TCP data ${l3.ip || evt.srcNode}:${sport} → ${evt.dstIp}:${dport}`, detail: `Bytes=${bytes} (simulated)` });
      this.emit({ proto: "TCP", status: "ok", summary: `TCP ACK ${evt.dstIp}:${dport} → ${l3.ip || evt.srcNode}:${sport}`, detail: "" });
    }
  }

  // ===== Routing (RIP/OSPF stubs) =====
  runRIP() {
    const routers = this.model.nodes.filter((n) => n.kind === "router");
    for (const r of routers) {
      if (!r.routing?.rip?.enabled) continue;
      const connected = this.model.connectedNetworksForRouter(r.id);
      this.enqueue({ type: "ROUTE_ADVERT", proto: "RIP", from: r.name, routes: connected.map((c) => ({ net: c.net, mask: c.mask, metric: 1 })) });
    }
  }

  runOSPF() {
    const routers = this.model.nodes.filter((n) => n.kind === "router");
    for (const r of routers) {
      if (!r.routing?.ospf?.enabled) continue;
      const connected = this.model.connectedNetworksForRouter(r.id);
      this.enqueue({ type: "ROUTE_ADVERT", proto: "OSPF", from: r.name, routes: connected.map((c) => ({ net: c.net, mask: c.mask, area: r.routing.ospf.area ?? 0, cost: 10 })) });
    }
  }

  handleRouteAdvert(evt) {
    const proto = evt.proto ?? "RIP";
    this.emit({ proto, status: "ok", summary: `${proto} advert from ${evt.from}`, detail: `${evt.routes?.length ?? 0} routes` });
    // Simplified: installs routes into all other routers with metric/cost.
    for (const r of this.model.nodes.filter((n) => n.kind === "router" && n.name !== evt.from)) {
      r.routes = r.routes ?? [];
      for (const rt of evt.routes ?? []) {
        const existing = r.routes.find((x) => x.net === rt.net && x.mask === rt.mask && x.proto === proto);
        const metric = proto === "OSPF" ? (rt.cost ?? 10) : (rt.metric ?? 1);
        if (!existing) r.routes.push({ ...rt, proto, via: evt.from, metric });
      }
    }
  }
}
