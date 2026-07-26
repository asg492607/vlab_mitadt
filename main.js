import { SimEngine } from "./engine.js";
import { LABS } from "./labs/index.js";
import { evaluateLab } from "./evaluate.js";

function $(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element ${sel}`);
  return el;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function downloadText(filename, text, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function setLastReport(report) {
  appState.lastReport = report;
  if (!reportOut) return;
  reportOut.textContent = report ? JSON.stringify(report, null, 2) : "";
}

function downloadDataUrl(filename, dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function randomMac() {
  const hex = "0123456789abcdef";
  const bytes = [];
  for (let i = 0; i < 6; i++) bytes.push(hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)]);
  return bytes.join(":");
}

function mkId(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const DEVICE_TEMPLATES = [
  { kind: "router", title: "Cisco 2911 ISR Router", sub: "Modular Router", ports: ["g0/0", "g0/1", "g0/2", "s0/0/0", "s0/0/1"], icon: "R2911" },
  { kind: "router", title: "Cisco 1941 Router", sub: "ISR Router", ports: ["g0/0", "g0/1"], icon: "R1941" },
  { kind: "switch", title: "Catalyst 2960 Switch", sub: "Layer 2 Switch", ports: ["f0/1", "f0/2", "f0/3", "f0/4", "f0/5", "f0/6", "g0/1", "g0/2"], icon: "S2960" },
  { kind: "switch", title: "Catalyst 3560 Switch", sub: "Layer 3 Multilayer Switch", ports: ["f0/1", "f0/2", "f0/3", "f0/4", "g0/1", "g0/2"], icon: "S3560" },
  { kind: "hub", title: "4-Port Hub", sub: "Layer 1 Repeater", ports: ["p1", "p2", "p3", "p4"], icon: "H" },
  { kind: "hub", title: "2-Port Bridge", sub: "Layer 2 Segmenter", ports: ["p1", "p2"], icon: "BR" },
  { kind: "firewall", title: "ASA 5505 Firewall", sub: "Security Appliance", ports: ["e0/0", "e0/1", "e0/2"], icon: "ASA" },
  { kind: "pc", title: "PC Workstation", sub: "Desktop End Device", ports: ["eth0"], icon: "PC" },
  { kind: "pc", title: "Laptop", sub: "Mobile Computer", ports: ["eth0", "wlan0"], icon: "LAP" },
  { kind: "server", title: "Dedicated Server", sub: "DNS/DHCP/Web/Mail", ports: ["eth0"], icon: "SV" },
  { kind: "pc", title: "Printer", sub: "Network Printer", ports: ["eth0"], icon: "PRN" },
  { kind: "pc", title: "IP Phone", sub: "VoIP Terminal", ports: ["eth0", "pc-port"], icon: "VOIP" },
  { kind: "wpc", title: "Smartphone", sub: "Wi-Fi Mobile", ports: ["wlan0"], icon: "SMART" },
  { kind: "wpc", title: "Tablet", sub: "Wireless Device", ports: ["wlan0"], icon: "TAB" },
  { kind: "ap", title: "Wireless Access Point", sub: "802.11 N/AC AP", ports: ["eth0", "wlan0"], icon: "AP" },
  { kind: "ap", title: "Wireless Router", sub: "Home Gateway", ports: ["wan0", "lan1", "lan2", "wlan0"], icon: "W-RT" },
  { kind: "iot", title: "IoT Gateway Node", sub: "Sensor / Controller", ports: ["eth0", "wlan0"], icon: "IoT" },
  { kind: "cloud", title: "Cloud / Internet Node", sub: "WAN Backbone", ports: ["g0/0", "g0/1"], icon: "WAN" },
];

const CABLE_TEMPLATES = [
  { kind: "straight", title: "Straight-through", sub: "Copper", icon: "—" },
  { kind: "crossover", title: "Crossover", sub: "Copper", icon: "×" },
  { kind: "fiber", title: "Fiber", sub: "Optical", icon: "≋" },
  { kind: "serial", title: "Serial", sub: "DCE/DTE", icon: "S" },
  { kind: "console", title: "Console", sub: "Mgmt", icon: "C" },
];

class DhcpService {
  constructor() {
    this.enabled = true;
    this.poolStart = "192.168.1.100";
    this.poolEnd = "192.168.1.200";
    this.mask = "255.255.255.0";
    this.gateway = "192.168.1.1";
    this.dns = "192.168.1.2";
    this.leases = {}; // mac -> ip
  }

  allocate(mac) {
    if (!this.enabled) return null;
    if (this.leases[mac]) return this.leases[mac];
    const start = ipToIntSafe(this.poolStart);
    const end = ipToIntSafe(this.poolEnd);
    if (start === null || end === null || end < start) return null;
    const used = new Set(Object.values(this.leases));
    for (let v = start; v <= end; v++) {
      const ip = intToIpSafe(v);
      if (!used.has(ip)) {
        this.leases[mac] = ip;
        return ip;
      }
    }
    return null;
  }
}

class DnsService {
  constructor() {
    this.enabled = true;
    this.records = {
      "example.local": { A: ["192.168.1.10"] },
      "dns.local": { A: ["192.168.1.2"] },
    };
  }

  resolve(name, qtype) {
    if (!this.enabled) return [];
    const rec = this.records[String(name).toLowerCase()];
    if (!rec) return [];
    return rec[qtype] ?? [];
  }
}

function ipToIntSafe(ip) {
  const parts = String(ip ?? "").split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}
function intToIpSafe(v) {
  return `${(v >>> 24) & 255}.${(v >>> 16) & 255}.${(v >>> 8) & 255}.${v & 255}`;
}

class TopologyModel {
  constructor() {
    this.nodes = [];
    this.links = [];
    this.meta = { name: "Untitled", createdAt: new Date().toISOString() };
  }

  snapshot() {
    return deepClone({ nodes: this.nodes, links: this.links, meta: this.meta });
  }

  restore(snap) {
    this.nodes = snap.nodes ?? [];
    this.links = snap.links ?? [];
    this.meta = snap.meta ?? this.meta;
  }

  addNode(template, x, y) {
    const n = {
      id: mkId("n"),
      kind: template.kind,
      name: this.defaultName(template.kind),
      x,
      y,
      ports: template.ports.map((p) => ({ name: p, up: true })),
      macBase: randomMac(),
      endpoint: this.makeEndpoint(template.kind),
      services: this.makeServices(template.kind),
      routing: this.makeRouting(template.kind),
      routes: [],
      stp: { enabled: template.kind === "switch", priority: 32768 },
      etherChannel: { groups: {} },
      nat: { enabled: false, inside: [], outside: [], overload: true },
      acls: [],
    };
    this.nodes.push(n);
    return n;
  }

  defaultName(kind) {
    const base = {
      router: "R",
      switch: "SW",
      hub: "HUB",
      firewall: "FW",
      pc: "PC",
      server: "SRV",
      iot: "IOT",
      ap: "AP",
      wpc: "WPC",
    }[kind] ?? "DEV";
    const count = this.nodes.filter((n) => n.kind === kind).length + 1;
    return `${base}${count}`;
  }

  makeEndpoint(kind) {
    const hasIp = ["pc", "server", "iot", "wpc"].includes(kind);
    return {
      ip: hasIp ? "" : null,
      mask: hasIp ? "255.255.255.0" : null,
      gateway: hasIp ? "" : null,
      dns: hasIp ? "" : null,
      mac: randomMac(),
      arp: {},
      ifs: {},
    };
  }

  makeServices(kind) {
    if (kind !== "server") return {};
    return { dhcp: true, dns: true, web: false, mail: false };
  }

  makeRouting(kind) {
    if (kind !== "router") return {};
    return { rip: { enabled: false, version: 2 }, ospf: { enabled: false, pid: 1, area: 0 }, bgp: { enabled: false, asn: 65000 } };
  }

  removeNode(nodeId) {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);
    this.links = this.links.filter((l) => l.a.nodeId !== nodeId && l.b.nodeId !== nodeId);
  }

  addLink({ aNodeId, aPort, bNodeId, bPort, cableKind }) {
    const id = mkId("l");
    const link = {
      id,
      kind: cableKind,
      a: { nodeId: aNodeId, port: aPort },
      b: { nodeId: bNodeId, port: bPort },
      state: "up",
    };
    this.links.push(link);
    return link;
  }

  linkForPort(nodeId, portName) {
    return this.links.find((l) => (l.a.nodeId === nodeId && l.a.port === portName) || (l.b.nodeId === nodeId && l.b.port === portName)) ?? null;
  }

  findEndpointByIp(ip) {
    const key = String(ip ?? "").trim();
    for (const n of this.nodes) {
      if (!n.endpoint || typeof n.endpoint.ip !== "string") continue;
      if (n.endpoint.ip.trim() === key) return { node: n, ...n.endpoint };
    }
    // Routers/firewalls can have IPs per-interface in endpoint.ifs
    for (const n of this.nodes) {
      const ifs = n.endpoint?.ifs ?? {};
      for (const [ifName, v] of Object.entries(ifs)) {
        if (v?.ip?.trim?.() === key) return { node: n, ...n.endpoint, ip: v.ip, mask: v.mask, gateway: null, dns: null };
      }
    }
    return null;
  }

  findEndpointByNodeName(name) {
    const key = String(name ?? "").toLowerCase();
    const node = this.nodes.find((n) => n.name.toLowerCase() === key);
    if (!node) return null;
    return { node, ...node.endpoint };
  }

  findServerByNodeName(name) {
    const key = String(name ?? "").toLowerCase();
    const node = this.nodes.find((n) => n.kind === "server" && n.name.toLowerCase() === key);
    if (!node) return null;
    return {
      node,
      dhcp: node.services?.dhcp ? node.dhcpService : null,
      dns: node.services?.dns ? node.dnsService : null,
    };
  }

  findDhcpServer() {
    const node = this.nodes.find((n) => n.kind === "server" && n.services?.dhcp);
    if (!node) return null;
    return { node, dhcp: node.dhcpService };
  }

  findDnsServer(serverIp) {
    const ip = String(serverIp ?? "").trim();
    const node = this.nodes.find((n) => n.kind === "server" && n.services?.dns && (n.endpoint?.ip ?? "").trim() === ip);
    if (!node) return null;
    return { node, dns: node.dnsService };
  }

  connectedNetworksForRouter(routerId) {
    const r = this.nodes.find((n) => n.id === routerId);
    if (!r) return [];
    const out = [];
    const ifs = r.endpoint?.ifs ?? {};
    for (const v of Object.values(ifs)) {
      if (!v?.ip || !v?.mask) continue;
      const net = networkOfSafe(v.ip, v.mask);
      if (net) out.push({ net, mask: v.mask });
    }
    return out;
  }

  // Helpers used by engine.js
  findEndpointByNodeNameStrict(nodeName) {
    return this.findEndpointByNodeName(nodeName);
  }
}

function networkOfSafe(ip, mask) {
  const a = ipToIntSafe(ip);
  const m = ipToIntSafe(mask);
  if (a === null || m === null) return null;
  return intToIpSafe((a & m) >>> 0);
}

// ===== UI + Controllers =====
const canvas = $("#topology");
const ctx = canvas.getContext("2d");

// Older browsers may not implement roundRect; provide a small polyfill.
if (!CanvasRenderingContext2D.prototype.roundRect) {
  // eslint-disable-next-line no-extend-native
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const rr = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
    const tl = rr.tl ?? 0, tr = rr.tr ?? 0, br = rr.br ?? 0, bl = rr.bl ?? 0;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

const inspector = $("#inspector");
const palette = $("#devicePalette");
const cablePalette = $("#cablePalette");
const pduTimeline = $("#pduTimeline");
const hudTool = $("#hudTool");
const hudMode = $("#hudMode");
const hudZoom = $("#hudZoom");

const logicalView = $("#logicalView");
const physicalView = $("#physicalView");
const rack = $("#physicalRack");

const terminalOut = $("#terminalOut");
const terminalIn = $("#terminalIn");
const terminalContext = $("#terminalContext");
const terminalPrompt = $("#terminalPrompt");

const consoleOut = $("#consoleOut");
const consoleIn = $("#consoleIn");
const consoleDevice = $("#consoleDevice");
const consolePrompt = $("#consolePrompt");

const labsPane = $("#labsPane");
const examPane = $("#examPane");
const appModeEl = $("#appMode");
const reportOut = document.querySelector("#reportOut");
const btnReportDownload = document.querySelector("#btnReportDownload");
const btnReportClear = document.querySelector("#btnReportClear");

// Overlay / auth / mode routing
const overlay = $("#overlay");
const landing = $("#landing");
const modeSelect = $("#modeSelect");
const splash = $("#splash");
const authModal = $("#authModal");
const whoami = $("#whoami");
const btnHome = $("#btnHome");
const btnTheme = $("#btnTheme");
const btnGetStarted = $("#btnGetStarted");
const btnOpenLogin = $("#btnOpenLogin");
const btnCancelLogin = $("#btnCancelLogin");
const btnDoLogin = $("#btnDoLogin");
const btnGuest = $("#btnGuest");
const btnLogout = $("#btnLogout");
const btnModeVlab = $("#btnModeVlab");
const btnModeExp = $("#btnModeExp");
const inpUsername = $("#inpUsername");
const inpPassword = $("#inpPassword");
const authMsg = $("#authMsg");

const chkAutoScroll = $("#chkAutoScroll");

// Model + history
const model = new TopologyModel();
const history = { undo: [], redo: [] };
const appState = { currentLabId: null, lastReport: null };
const session = {
  user: null, // { username, isGuest }
  mode: null, // "vlab" | "experiment"
  consoleCmds: [], // { ts, deviceId, deviceName, line }
};

// ===== Theme (light/dark) =====
function setTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("netforge.theme", t);
  } catch {
    // ignore
  }
  btnTheme.textContent = `Theme: ${t === "dark" ? "Dark" : "Light"}`;
}

function loadTheme() {
  try {
    return localStorage.getItem("netforge.theme");
  } catch {
    return null;
  }
}

function getPracticeTasks(labId) {
  const id = String(labId ?? "").toLowerCase();
  if (id === "subnetting") {
    return [
      { id: "s1", title: "Configure router interface IP", points: 20, match: /\bint(erface)?\s+g0\/0\b/i },
      { id: "s2", title: "Assign IP address + mask", points: 25, match: /\bip\s+address\s+\d+\.\d+\.\d+\.\d+\s+\d+\.\d+\.\d+\.\d+\b/i },
      { id: "s3", title: "Bring interface up", points: 10, match: /\bno\s+shut(down)?\b/i },
      { id: "s4", title: "Verify interfaces", points: 15, match: /\bshow\s+ip\s+int\s+brief\b/i },
    ];
  }
  if (id === "rip") {
    return [
      { id: "r1", title: "Enable RIP", points: 20, match: /\brouter\s+rip\b/i },
      { id: "r2", title: "Advertise a network", points: 20, match: /\bnetwork\s+\d+\.\d+\.\d+\.\d+\b/i },
      { id: "r3", title: "Verify routes", points: 20, match: /\bshow\s+ip\s+route\b/i },
    ];
  }
  if (id === "ospf") {
    return [
      { id: "o1", title: "Enable OSPF", points: 20, match: /\brouter\s+ospf\s+\d+\b/i },
      { id: "o2", title: "Add OSPF network statement", points: 25, match: /\bnetwork\s+\d+\.\d+\.\d+\.\d+\s+\d+\.\d+\.\d+\.\d+\s+area\s+\d+\b/i },
      { id: "o3", title: "Verify neighbors", points: 15, match: /\bshow\s+ip\s+ospf\s+neighbor\b/i },
      { id: "o4", title: "Verify routes", points: 15, match: /\bshow\s+ip\s+route\b/i },
    ];
  }
  if (id === "dns") {
    return [
      { id: "d1", title: "Query DNS (nslookup)", points: 25, match: /\bnslookup\s+\S+\b/i, source: "terminal" },
      { id: "d2", title: "Ping by name", points: 25, match: /\bping\s+\D+\S*\b/i, source: "terminal" },
    ];
  }
  if (id === "vlans") {
    return [
      { id: "v1", title: "Create VLAN", points: 20, match: /\bvlan\s+\d+\b/i },
      { id: "v2", title: "Set access VLAN", points: 20, match: /\bswitchport\s+access\s+vlan\s+\d+\b/i },
      { id: "v3", title: "Set trunk mode", points: 20, match: /\bswitchport\s+mode\s+trunk\b/i },
      { id: "v4", title: "Verify VLANs", points: 10, match: /\bshow\s+vlan\s+brief\b/i },
    ];
  }
  return [];
}

function validatePracticeTasks(labId) {
  const tasks = getPracticeTasks(labId);
  const results = [];
  for (const t of tasks) {
    const src = t.source ?? "console";
    const hay = src === "terminal" ? terminalOut.textContent : session.consoleCmds.map((x) => x.line).join("\n");
    const ok = t.match.test(hay);
    results.push({ ...t, ok });
  }
  return results;
}

function pushHistory(reason) {
  history.undo.push({ snap: model.snapshot(), reason, at: Date.now() });
  history.redo = [];
}

function buildCombinedLabReport(lab) {
  const base = evaluateLab({ model, lab });
  const tasks = validatePracticeTasks(lab.id);
  const practiceDetails = tasks.map((t) => ({
    ok: t.ok,
    points: t.points,
    remark: `Practice: ${t.title}`,
  }));

  const allDetails = [...(base.details ?? []), ...practiceDetails];
  const total = allDetails.reduce((a, d) => a + (d.points ?? 0), 0);
  const earned = allDetails.reduce((a, d) => a + (d.ok ? (d.points ?? 0) : 0), 0);
  const score = total > 0 ? (earned / total) * 100 : base.score ?? 0;
  const remarks = base.remarks ?? "";

  return {
    ...base,
    score: Math.round(score),
    remarks: remarks,
    details: allDetails,
    student: session.user?.username ?? base.student,
  };
}

function undo() {
  const last = history.undo.pop();
  if (!last) return;
  history.redo.push({ snap: model.snapshot(), reason: "redo", at: Date.now() });
  model.restore(last.snap);
  refreshAll();
}

function redo() {
  const next = history.redo.pop();
  if (!next) return;
  history.undo.push({ snap: model.snapshot(), reason: "undo", at: Date.now() });
  model.restore(next.snap);
  refreshAll();
}

// Services init for servers
function ensureServices() {
  for (const n of model.nodes) {
    if (n.kind === "server") {
      n.dhcpService = n.dhcpService ?? new DhcpService();
      n.dnsService = n.dnsService ?? new DnsService();
    }
  }
}

// Engine
const engine = new SimEngine({
  model: {
    get nodes() {
      return model.nodes;
    },
    get links() {
      return model.links;
    },
    findEndpointByIp: (ip) => model.findEndpointByIp(ip),
    findEndpointByNodeName: (name) => model.findEndpointByNodeName(name),
    findDhcpServer: () => model.findDhcpServer(),
    findDnsServer: (ip) => model.findDnsServer(ip),
    findServerByNodeName: (name) => model.findServerByNodeName(name),
    connectedNetworksForRouter: (id) => model.connectedNetworksForRouter(id),
  },
  onEvent: (row) => addPduRow(row),
});

// DNS -> follow-up actions (e.g., ping hostname after resolution)
const pendingDns = new Map(); // qname -> { srcNode, onIp(ip) }

// Canvas view state
const view = { panX: 0, panY: 0, zoom: 1 };
const ui = {
  tool: "select", // select | addDevice | cable
  addKind: null,
  cableKind: "straight",
  selected: { type: null, id: null },
  draggingNodeId: null,
  dragOff: { x: 0, y: 0 },
  cableFrom: null, // { nodeId, port }
  lastMouseX: 0,
  lastMouseY: 0,
};

function setTool(t) {
  ui.tool = t;
  hudTool.textContent = t === "select" ? "Select" : t === "addDevice" ? `Add ${ui.addKind}` : `Cable (${ui.cableKind})`;
}

function setSimMode(mode) {
  engine.setMode(mode);
  hudMode.textContent = mode === "realtime" ? "Real-time" : "Simulation";
}

function setZoom(z) {
  view.zoom = clamp(z, 0.35, 2.2);
  hudZoom.textContent = `${Math.round(view.zoom * 100)}%`;
}

function screenToWorld(px, py) {
  const rect = canvas.getBoundingClientRect();
  const x = (px - rect.left) * (canvas.width / rect.width);
  const y = (py - rect.top) * (canvas.height / rect.height);
  return { x: (x - view.panX) / view.zoom, y: (y - view.panY) / view.zoom };
}

function worldToScreen(wx, wy) {
  return { x: wx * view.zoom + view.panX, y: wy * view.zoom + view.panY };
}

function hitNode(worldX, worldY) {
  for (let i = model.nodes.length - 1; i >= 0; i--) {
    const n = model.nodes[i];
    const dx = worldX - n.x;
    const dy = worldY - n.y;
    if (dx * dx + dy * dy <= 26 * 26) return n;
  }
  return null;
}

function drawGrid() {
  const step = 50 * view.zoom;
  ctx.save();
  ctx.translate(view.panX, view.panY);
  ctx.scale(view.zoom, view.zoom);
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1 / view.zoom;
  const startX = -view.panX / view.zoom;
  const startY = -view.panY / view.zoom;
  for (let x = Math.floor(startX / 50) * 50; x < startX + canvas.width / view.zoom; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, startY - 2000);
    ctx.lineTo(x, startY + canvas.height / view.zoom + 2000);
    ctx.stroke();
  }
  for (let y = Math.floor(startY / 50) * 50; y < startY + canvas.height / view.zoom; y += 50) {
    ctx.beginPath();
    ctx.moveTo(startX - 2000, y);
    ctx.lineTo(startX + canvas.width / view.zoom + 2000, y);
    ctx.stroke();
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // Links
  ctx.save();
  ctx.translate(view.panX, view.panY);
  ctx.scale(view.zoom, view.zoom);

  for (const l of model.links) {
    const a = model.nodes.find((n) => n.id === l.a.nodeId);
    const b = model.nodes.find((n) => n.id === l.b.nodeId);
    if (!a || !b) continue;
    const selected = ui.selected.type === "link" && ui.selected.id === l.id;
    ctx.lineWidth = selected ? 4 : 2;
    ctx.strokeStyle = selected ? "rgba(96,165,250,0.9)" : "rgba(140,160,200,0.55)";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // Cable kind label
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    ctx.fillStyle = "rgba(15,33,74,0.65)";
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx - 38, my - 12, 76, 24, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(232,238,255,0.92)";
    ctx.font = `12px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(l.kind, mx, my);
  }

  // Nodes
  for (const n of model.nodes) {
    const selected = ui.selected.type === "node" && ui.selected.id === n.id;
    const r = 26;
    ctx.fillStyle = selected ? "rgba(96,165,250,0.35)" : "rgba(16,26,51,0.75)";
    ctx.strokeStyle = selected ? "rgba(96,165,250,0.95)" : "rgba(255,255,255,0.10)";
    ctx.lineWidth = selected ? 3 : 2;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(232,238,255,0.95)";
    ctx.font = `12.5px ${getComputedStyle(document.documentElement).getPropertyValue("--sans")}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(n.name, n.x, n.y + 32);

    ctx.fillStyle = "rgba(142,160,200,0.95)";
    ctx.font = `12px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;
    ctx.textBaseline = "middle";
    ctx.fillText(kindAbbrev(n.kind), n.x, n.y);
  }

  // Cable pulling preview
  if (ui.tool === "cable" && ui.cableFrom) {
    const startNode = model.nodes.find(n => n.id === ui.cableFrom.nodeId);
    if (startNode) {
      const mouseWorld = screenToWorld(ui.lastMouseX, ui.lastMouseY);
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(96,165,250,0.6)";
      ctx.lineWidth = 2;
      ctx.moveTo(startNode.x, startNode.y);
      ctx.lineTo(mouseWorld.x, mouseWorld.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

function kindAbbrev(kind) {
  const t = DEVICE_TEMPLATES.find((x) => x.kind === kind);
  return t?.icon ?? kind.slice(0, 2).toUpperCase();
}

function addPduRow(row) {
  const div = document.createElement("div");
  div.className = "trow";
  const pillClass = row.status === "ok" ? "ok" : row.status === "bad" ? "bad" : "warn";
  div.innerHTML = `
    <div>${new Date(row.ts).toLocaleTimeString()}</div>
    <div><span class="pill ${pillClass}">${row.proto}</span></div>
    <div>${escapeHtml(row.summary ?? "")}<div class="muted">${escapeHtml(row.detail ?? "")}</div></div>
  `;
  pduTimeline.appendChild(div);
  if (chkAutoScroll.checked) pduTimeline.scrollTop = pduTimeline.scrollHeight;

  // Resolve pending DNS continuations
  if (row.proto === "DNS" && typeof row.summary === "string") {
    const m = row.summary.match(/^DNS reply\s+(.+?)\s+=\s+(.+)$/);
    if (m) {
      const qname = m[1].trim().toLowerCase();
      const ip = m[2].split(",")[0]?.trim();
      const pending = pendingDns.get(qname);
      if (pending && ip) {
        pendingDns.delete(qname);
        pending.onIp(ip);
      }
    }
    const nx = row.summary.match(/^DNS NXDOMAIN\s+(.+)$/);
    if (nx) {
      pendingDns.delete(nx[1].trim().toLowerCase());
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function refreshInspector() {
  const sel = ui.selected;
  if (!sel.type) {
    inspector.classList.add("muted");
    inspector.textContent = "Select a device/link.";
    return;
  }

  inspector.classList.remove("muted");
  if (sel.type === "node") {
    const n = model.nodes.find((x) => x.id === sel.id);
    if (!n) return;
    inspector.innerHTML = renderNodeInspector(n);
    wireInspectorForNode(n);
    return;
  }
  if (sel.type === "link") {
    const l = model.links.find((x) => x.id === sel.id);
    if (!l) return;
    inspector.innerHTML = renderLinkInspector(l);
    wireInspectorForLink(l);
  }
}

function renderNodeInspector(n) {
  const ip = n.endpoint?.ip ?? "";
  const mask = n.endpoint?.mask ?? "";
  const gw = n.endpoint?.gateway ?? "";
  const dns = n.endpoint?.dns ?? "";
  const ports = n.ports.map((p) => {
    const used = model.linkForPort(n.id, p.name);
    return `<div class="row" style="justify-content:space-between">
      <div><code>${p.name}</code> <span class="muted">${used ? "• linked" : ""}</span></div>
      <div class="row">
        <label class="toggle"><input data-port-up="${p.name}" type="checkbox" ${p.up ? "checked" : ""}/> <span>up</span></label>
        <button class="btn btnSmall" data-port-cable="${p.name}">Cable</button>
      </div>
    </div>`;
  }).join("");

  const serverServices = n.kind === "server" ? `
    <div class="card" style="margin-top:10px">
      <div class="cardTitle">Server Services</div>
      <div class="row" style="gap:14px">
        <label class="toggle"><input data-svc="dhcp" type="checkbox" ${n.services?.dhcp ? "checked" : ""}/> <span>DHCP</span></label>
        <label class="toggle"><input data-svc="dns" type="checkbox" ${n.services?.dns ? "checked" : ""}/> <span>DNS</span></label>
        <label class="toggle"><input data-svc="web" type="checkbox" ${n.services?.web ? "checked" : ""}/> <span>Web</span></label>
        <label class="toggle"><input data-svc="mail" type="checkbox" ${n.services?.mail ? "checked" : ""}/> <span>Mail</span></label>
      </div>
      <div class="muted" style="margin-top:8px">Use the Console for advanced configuration (IOS-like or server config stubs).</div>
    </div>
  ` : "";

  return `
    <div class="card">
      <div class="cardTitle">${escapeHtml(n.name)} <span class="muted">(${escapeHtml(n.kind)})</span></div>
      <div class="row">
        <label class="muted">Name</label>
        <input id="inspName" class="select" value="${escapeHtml(n.name)}" style="min-width:180px" />
        <button class="btn btnSmall" id="btnDeleteNode" style="border-color:rgba(239,68,68,.35)">Delete</button>
      </div>
      ${typeof n.endpoint?.ip === "string" ? `
        <div class="row" style="margin-top:10px">
          <input id="inspIp" class="select" placeholder="IP" value="${escapeHtml(ip)}" />
          <input id="inspMask" class="select" placeholder="Mask" value="${escapeHtml(mask)}" />
          <input id="inspGw" class="select" placeholder="Gateway" value="${escapeHtml(gw)}" />
          <input id="inspDns" class="select" placeholder="DNS" value="${escapeHtml(dns)}" />
        </div>
      ` : `<div class="muted" style="margin-top:10px">Use Console to configure interfaces and routing.</div>`}
    </div>
    <div class="card">
      <div class="cardTitle">Ports</div>
      <div style="display:flex;flex-direction:column;gap:8px">${ports}</div>
      <div class="muted" style="margin-top:8px">Cable workflow: click “Cable” on port A, then click “Cable” on port B.</div>
    </div>
    ${serverServices}
  `;
}

function renderLinkInspector(l) {
  const a = model.nodes.find((n) => n.id === l.a.nodeId);
  const b = model.nodes.find((n) => n.id === l.b.nodeId);
  return `
    <div class="card">
      <div class="cardTitle">Link</div>
      <div class="kv">
        <div class="k">Kind</div><div><code>${escapeHtml(l.kind)}</code></div>
        <div class="k">A</div><div>${escapeHtml(a?.name ?? l.a.nodeId)}:<code>${escapeHtml(l.a.port)}</code></div>
        <div class="k">B</div><div>${escapeHtml(b?.name ?? l.b.nodeId)}:<code>${escapeHtml(l.b.port)}</code></div>
      </div>
      <div class="row" style="margin-top:10px;justify-content:space-between">
        <label class="toggle"><input id="linkUp" type="checkbox" ${l.state === "up" ? "checked" : ""}/> <span>Link up</span></label>
        <button class="btn btnSmall" id="btnDeleteLink" style="border-color:rgba(239,68,68,.35)">Delete</button>
      </div>
    </div>
  `;
}

function wireInspectorForNode(n) {
  $("#inspName").addEventListener("change", (e) => {
    pushHistory("rename");
    n.name = e.target.value.trim() || n.name;
    refreshAll();
  });

  const del = document.getElementById("btnDeleteNode");
  del?.addEventListener("click", () => {
    pushHistory("deleteNode");
    model.removeNode(n.id);
    ui.selected = { type: null, id: null };
    refreshAll();
  });

  const ipEl = document.getElementById("inspIp");
  if (ipEl) {
    ipEl.addEventListener("change", () => {
      pushHistory("ip");
      n.endpoint.ip = ipEl.value.trim();
      refreshAll();
    });
    $("#inspMask").addEventListener("change", (e) => {
      pushHistory("mask");
      n.endpoint.mask = e.target.value.trim();
      refreshAll();
    });
    $("#inspGw").addEventListener("change", (e) => {
      pushHistory("gw");
      n.endpoint.gateway = e.target.value.trim();
      refreshAll();
    });
    $("#inspDns").addEventListener("change", (e) => {
      pushHistory("dns");
      n.endpoint.dns = e.target.value.trim();
      refreshAll();
    });
  }

  for (const el of inspector.querySelectorAll("[data-port-up]")) {
    el.addEventListener("change", () => {
      pushHistory("portUp");
      const p = n.ports.find((x) => x.name === el.getAttribute("data-port-up"));
      if (p) p.up = el.checked;
      refreshAll();
    });
  }

  for (const el of inspector.querySelectorAll("[data-port-cable]")) {
    el.addEventListener("click", () => {
      const port = el.getAttribute("data-port-cable");
      if (ui.cableFrom) finishCableTo(n.id, port);
      else startCableFrom(n.id, port);
    });
  }

  for (const el of inspector.querySelectorAll("[data-svc]")) {
    el.addEventListener("change", () => {
      pushHistory("svc");
      const svc = el.getAttribute("data-svc");
      n.services = n.services ?? {};
      n.services[svc] = el.checked;
      ensureServices();
      refreshAll();
    });
  }
}

function wireInspectorForLink(l) {
  $("#linkUp")?.addEventListener("change", (e) => {
    pushHistory("linkUp");
    l.state = e.target.checked ? "up" : "down";
    refreshAll();
  });
  $("#btnDeleteLink")?.addEventListener("click", () => {
    pushHistory("deleteLink");
    model.links = model.links.filter((x) => x.id !== l.id);
    ui.selected = { type: null, id: null };
    refreshAll();
  });
}

function startCableFrom(nodeId, port) {
  if (model.linkForPort(nodeId, port)) {
    logTerm(`[cable] Port already linked: ${nodeName(nodeId)} ${port}`);
    return;
  }
  ui.tool = "cable";
  ui.cableFrom = { nodeId, port };
  hudTool.textContent = `Cable (${ui.cableKind})`;
  logTerm(`[cable] Select second port to connect (${ui.cableKind}).`);
}

function finishCableTo(nodeId, port) {
  if (!ui.cableFrom) return;
  const a = ui.cableFrom;
  if (a.nodeId === nodeId && a.port === port) return;
  if (a.nodeId === nodeId) {
    logTerm("[cable] Cannot connect ports on the same device.");
    return;
  }
  if (model.linkForPort(nodeId, port)) {
    logTerm(`[cable] Port already linked: ${nodeName(nodeId)} ${port}`);
    return;
  }
  pushHistory("addLink");
  model.addLink({ aNodeId: a.nodeId, aPort: a.port, bNodeId: nodeId, bPort: port, cableKind: ui.cableKind });
  ui.cableFrom = null;
  ui.tool = "select";
  setTool("select");
  refreshAll();
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ui.cableFrom) {
    ui.cableFrom = null;
    ui.tool = "select";
    setTool("select");
    logTerm("[cable] Canceled.");
  }
});

function nodeName(id) {
  return model.nodes.find((n) => n.id === id)?.name ?? id;
}

function buildPalette() {
  palette.innerHTML = "";
  for (const t of DEVICE_TEMPLATES) {
    const el = document.createElement("div");
    el.className = "tile";
    el.draggable = true;
    el.innerHTML = `<div class="tileTitle">${t.title}</div><div class="tileSub">${t.sub}</div>`;
    el.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "device", kind: t.kind }));
    });
    el.addEventListener("click", () => {
      ui.addKind = t.kind;
      ui.tool = "addDevice";
      setTool("addDevice");
    });
    palette.appendChild(el);
  }

  cablePalette.innerHTML = "";
  for (const c of CABLE_TEMPLATES) {
    const el = document.createElement("div");
    el.className = "tile";
    el.innerHTML = `<div class="tileTitle">${c.title}</div><div class="tileSub">${c.sub}</div>`;
    el.addEventListener("click", () => {
      ui.cableKind = c.kind;
      ui.tool = "cable";
      setTool("cable");
      logTerm(`[cable] Mode: ${c.title}. Click a node to start cabling.`);
    });
    cablePalette.appendChild(el);
  }
}

function refreshPhysical() {
  ensureServices();
  const grid = document.createElement("div");
  grid.className = "rackGrid";
  for (const n of model.nodes) {
    const card = document.createElement("div");
    card.className = "rackCard";
    const ip = typeof n.endpoint?.ip === "string" ? (n.endpoint.ip || "—") : "—";
    const mac = n.endpoint?.mac ?? n.macBase ?? "—";
    card.innerHTML = `
      <div class="rackCardTitle">
        <div>${escapeHtml(n.name)}</div>
        <div class="tag">${escapeHtml(n.kind)}</div>
      </div>
      <div class="kv">
        <div class="k">IP</div><div><code>${escapeHtml(ip)}</code></div>
        <div class="k">MAC</div><div><code>${escapeHtml(mac)}</code></div>
        <div class="k">Ports</div><div class="muted">${n.ports.length}</div>
      </div>
      <div class="row" style="margin-top:10px;justify-content:space-between">
        <button class="btn btnSmall" data-sel="${n.id}">Select</button>
        <button class="btn btnSmall" data-console="${n.id}">Console</button>
      </div>
    `;
    card.querySelector("[data-sel]")?.addEventListener("click", () => {
      ui.selected = { type: "node", id: n.id };
      refreshAll();
      showLogical();
    });
    card.querySelector("[data-console]")?.addEventListener("click", () => {
      ui.selected = { type: "node", id: n.id };
      refreshAll();
      openConsoleForSelected();
    });
    grid.appendChild(card);
  }
  rack.innerHTML = "";
  rack.appendChild(grid);
}

function refreshSelects() {
  // Terminal context: endpoints
  terminalContext.innerHTML = "";
  for (const n of model.nodes.filter((x) => ["pc", "server", "iot", "wpc"].includes(x.kind))) {
    const opt = document.createElement("option");
    opt.value = n.name;
    opt.textContent = n.name;
    terminalContext.appendChild(opt);
  }
  terminalPrompt.textContent = `${terminalContext.value || ">"}>`;

  // Console devices: routers/switches/firewalls/servers
  consoleDevice.innerHTML = "";
  for (const n of model.nodes.filter((x) => ["router", "switch", "firewall", "server"].includes(x.kind))) {
    const opt = document.createElement("option");
    opt.value = n.id;
    opt.textContent = n.name;
    consoleDevice.appendChild(opt);
  }
}

function refreshAll() {
  ensureServices();
  refreshInspector();
  refreshPhysical();
  refreshSelects();
  draw();
}

// ===== Overlay routing =====
function showOverlayPane(pane) {
  overlay.classList.add("show");
  [landing, modeSelect, splash].forEach((x) => x.classList.remove("active"));
  pane.classList.add("active");
}

function hideOverlay() {
  overlay.classList.remove("show");
  [landing, modeSelect, splash].forEach((x) => x.classList.remove("active"));
  authModal.classList.add("hidden");
}

function openAuth() {
  authMsg.textContent = "";
  authModal.classList.remove("hidden");
  inpUsername.value = "";
  inpPassword.value = "";
  inpUsername.focus();
}

function closeAuth() {
  authModal.classList.add("hidden");
}

function setUser(u) {
  session.user = u;
  try {
    localStorage.setItem("netforge.user", JSON.stringify(u));
  } catch {
    // ignore
  }
  whoami.textContent = u?.username ?? "—";
}

function loadUser() {
  try {
    const raw = localStorage.getItem("netforge.user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function login({ username, password, isGuest }) {
  // Local-only: accept any username/password; treat password as optional.
  if (!username) throw new Error("Enter a username or use Guest.");
  setUser({ username, isGuest: !!isGuest, passwordSet: !!password });
  showOverlayPane(splash);
  await new Promise((r) => setTimeout(r, 650));
  showOverlayPane(modeSelect);
}

function logout() {
  session.user = null;
  session.mode = null;
  appModeEl.textContent = "—";
  try {
    localStorage.removeItem("netforge.user");
  } catch {
    // ignore
  }
  showOverlayPane(landing);
}

function setAppMode(mode) {
  session.mode = mode;
  appModeEl.textContent = mode === "vlab" ? "VLab" : "Experiment";
}

// ===== Lab topology presets (VLab Mode) =====
function resetProject({ name }) {
  pushHistory("reset");
  model.nodes = [];
  model.links = [];
  model.meta = { name: name ?? "Untitled", createdAt: new Date().toISOString() };
  ui.selected = { type: null, id: null };
  ui.cableFrom = null;
  pduTimeline.innerHTML = "";
  terminalOut.textContent = "";
  consoleOut.textContent = "";
  engine.clearLogs();
  refreshAll();
}

function t(kind) {
  const tpl = DEVICE_TEMPLATES.find((x) => x.kind === kind);
  if (!tpl) throw new Error(`Missing template ${kind}`);
  return tpl;
}

function add(kind, x, y, nameOverride = null) {
  const n = model.addNode(t(kind), x, y);
  if (nameOverride) n.name = nameOverride;
  if (n.kind === "server") ensureServices();
  return n;
}

function link(a, aport, b, bport, cableKind = "straight") {
  model.addLink({ aNodeId: a.id, aPort: aport, bNodeId: b.id, bPort: bport, cableKind });
}

function loadLabTopology(labId) {
  const id = String(labId ?? "").toLowerCase();
  resetProject({ name: `Lab_${labId}` });

  if (id === "subnetting") {
    const r1 = add("router", 520, 260, "R1");
    const sw1 = add("switch", 360, 440, "SW1");
    const sw2 = add("switch", 680, 440, "SW2");
    const pc1 = add("pc", 250, 640, "PC1");
    const pc2 = add("pc", 430, 640, "PC2");
    const pc3 = add("pc", 610, 640, "PC3");
    const pc4 = add("pc", 790, 640, "PC4");
    link(r1, "g0/0", sw1, "g0/1", "straight");
    link(r1, "g0/1", sw2, "g0/1", "straight");
    link(sw1, "f0/1", pc1, "eth0");
    link(sw1, "f0/2", pc2, "eth0");
    link(sw2, "f0/1", pc3, "eth0");
    link(sw2, "f0/2", pc4, "eth0");

    // Preconfigure endpoints to give students a starting point
    pc1.endpoint.ip = "192.168.10.10";
    pc1.endpoint.mask = "255.255.255.0";
    pc1.endpoint.gateway = "192.168.10.1";
    pc2.endpoint.ip = "192.168.10.11";
    pc2.endpoint.mask = "255.255.255.0";
    pc2.endpoint.gateway = "192.168.10.1";
    pc3.endpoint.ip = "192.168.20.10";
    pc3.endpoint.mask = "255.255.255.0";
    pc3.endpoint.gateway = "192.168.20.1";
    pc4.endpoint.ip = "192.168.20.11";
    pc4.endpoint.mask = "255.255.255.0";
    pc4.endpoint.gateway = "192.168.20.1";

    // Router interface stubs (students can verify via show ip int brief)
    r1.endpoint.ifs = r1.endpoint.ifs ?? {};
    r1.endpoint.ifs["g0/0"] = { ip: "192.168.10.1", mask: "255.255.255.0", shutdown: false };
    r1.endpoint.ifs["g0/1"] = { ip: "192.168.20.1", mask: "255.255.255.0", shutdown: false };
    refreshAll();
    return;
  }

  if (id === "rip") {
    const r1 = add("router", 260, 320, "R1");
    const r2 = add("router", 520, 320, "R2");
    const r3 = add("router", 780, 320, "R3");
    const pc1 = add("pc", 160, 560, "PC1");
    const pc2 = add("pc", 880, 560, "PC2");
    link(pc1, "eth0", r1, "g0/0");
    link(r1, "g0/1", r2, "s0/0/0", "serial");
    link(r2, "g0/1", r3, "s0/0/0", "serial");
    link(r3, "g0/0", pc2, "eth0");

    pc1.endpoint.ip = "10.1.1.10";
    pc1.endpoint.mask = "255.255.255.0";
    pc1.endpoint.gateway = "10.1.1.1";
    pc2.endpoint.ip = "10.3.3.10";
    pc2.endpoint.mask = "255.255.255.0";
    pc2.endpoint.gateway = "10.3.3.1";

    r1.endpoint.ifs = { "g0/0": { ip: "10.1.1.1", mask: "255.255.255.0", shutdown: false }, "s0/0/0": { ip: "10.12.12.1", mask: "255.255.255.252", shutdown: false } };
    r2.endpoint.ifs = { "s0/0/0": { ip: "10.12.12.2", mask: "255.255.255.252", shutdown: false }, "g0/1": { ip: "10.23.23.1", mask: "255.255.255.252", shutdown: false } };
    r3.endpoint.ifs = { "s0/0/0": { ip: "10.23.23.2", mask: "255.255.255.252", shutdown: false }, "g0/0": { ip: "10.3.3.1", mask: "255.255.255.0", shutdown: false } };

    refreshAll();
    return;
  }

  if (id === "ospf") {
    const r1 = add("router", 360, 300, "R1");
    const r2 = add("router", 660, 300, "R2");
    const r3 = add("router", 510, 520, "R3");
    link(r1, "s0/0/0", r2, "s0/0/0", "serial");
    link(r2, "g0/0", r3, "g0/0");
    link(r3, "g0/1", r1, "g0/0");

    r1.endpoint.ifs = { "s0/0/0": { ip: "10.0.12.1", mask: "255.255.255.252", shutdown: false }, "g0/0": { ip: "10.0.31.1", mask: "255.255.255.252", shutdown: false } };
    r2.endpoint.ifs = { "s0/0/0": { ip: "10.0.12.2", mask: "255.255.255.252", shutdown: false }, "g0/0": { ip: "10.0.23.1", mask: "255.255.255.252", shutdown: false } };
    r3.endpoint.ifs = { "g0/0": { ip: "10.0.23.2", mask: "255.255.255.252", shutdown: false }, "g0/1": { ip: "10.0.31.2", mask: "255.255.255.252", shutdown: false } };

    refreshAll();
    return;
  }

  if (id === "dns") {
    const sw = add("switch", 520, 420, "SW1");
    const srv = add("server", 520, 260, "SRV1");
    const pc = add("pc", 360, 600, "PC1");
    link(srv, "eth0", sw, "g0/1");
    link(pc, "eth0", sw, "f0/1");
    srv.endpoint.ip = "192.168.1.2";
    srv.endpoint.mask = "255.255.255.0";
    pc.endpoint.ip = "192.168.1.10";
    pc.endpoint.mask = "255.255.255.0";
    pc.endpoint.dns = "192.168.1.2";
    ensureServices();
    refreshAll();
    return;
  }

  // Default: empty lab canvas
  refreshAll();
}

// ===== Dock + view tabs =====
for (const tab of document.querySelectorAll(".dockTab")) {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".dockTab").forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");
    const key = tab.getAttribute("data-dock");
    document.querySelectorAll(".dockPane").forEach((x) => x.classList.remove("active"));
    $(`#dock_${key}`).classList.add("active");
  });
}

$("#tabLogical").addEventListener("click", showLogical);
$("#tabPhysical").addEventListener("click", showPhysical);
$("#btnLogical").addEventListener("click", showLogical);
$("#btnPhysical").addEventListener("click", showPhysical);

function showLogical() {
  $("#tabLogical").classList.add("active");
  $("#tabPhysical").classList.remove("active");
  logicalView.classList.add("active");
  physicalView.classList.remove("active");
}
function showPhysical() {
  $("#tabPhysical").classList.add("active");
  $("#tabLogical").classList.remove("active");
  physicalView.classList.add("active");
  logicalView.classList.remove("active");
}

// ===== Toolbar actions =====
$("#btnUndo").addEventListener("click", undo);
$("#btnRedo").addEventListener("click", redo);
$("#btnRealtime").addEventListener("click", () => setSimMode("realtime"));
$("#btnSim").addEventListener("click", () => setSimMode("simulation"));
$("#btnStep").addEventListener("click", () => engine.step());
$("#btnClearPdu").addEventListener("click", () => (pduTimeline.innerHTML = ""));
$("#btnTermClear").addEventListener("click", () => (terminalOut.textContent = ""));
$("#btnConsoleClear").addEventListener("click", () => (consoleOut.textContent = ""));

$("#btnExport").addEventListener("click", () => {
  const payload = {
    version: 1,
    format: "nfz-json",
    model: model.snapshot(),
    engineLogs: engine.logs,
  };
  downloadText(`${model.meta?.name ?? "netforge"}.nfz`, JSON.stringify(payload, null, 2), "application/json");
});

$("#fileImport").addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const text = await f.text();
  const data = JSON.parse(text);
  pushHistory("import");
  model.restore(data.model ?? data);
  refreshAll();
});

$("#btnCapture").addEventListener("click", () => {
  const dataUrl = canvas.toDataURL("image/png");
  downloadDataUrl(`netforge_capture_${Date.now()}.png`, dataUrl);
});

$("#btnReport").addEventListener("click", () => {
  const lab = LABS.find((x) => x.id === appState.currentLabId) ?? LABS[0];
  const report = buildCombinedLabReport(lab);
  setLastReport(report);
  downloadText(`netforge_report_${lab.id}_${Date.now()}.json`, JSON.stringify(report, null, 2));
});

$("#btnLabs").addEventListener("click", () => {
  document.querySelector('.dockTab[data-dock="labs"]').click();
  renderLabs();
});
$("#btnExam").addEventListener("click", () => {
  document.querySelector('.dockTab[data-dock="exam"]').click();
  renderExam();
});

btnHome.addEventListener("click", () => {
  // Return to mode selection without destroying current project.
  whoami.textContent = session.user?.username ?? "—";
  showOverlayPane(modeSelect);
});

btnTheme.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  setTheme(cur === "dark" ? "light" : "dark");
});

terminalContext.addEventListener("change", () => {
  terminalPrompt.textContent = `${terminalContext.value || ">"}>`;
});

canvas.addEventListener("mousemove", (ev) => {
  ui.lastMouseX = ev.clientX;
  ui.lastMouseY = ev.clientY;
  
  const w = screenToWorld(ev.clientX, ev.clientY);
  if (ui.draggingNodeId) {
     const n = model.nodes.find(x => x.id === ui.draggingNodeId);
     if (n) {
        n.x = w.x - ui.dragOff.x;
        n.y = w.y - ui.dragOff.y;
        draw();
     }
  }
  if (ui.tool === "cable" && ui.cableFrom) draw();
});

canvas.addEventListener("mouseup", () => {
  ui.draggingNodeId = null;
});

canvas.addEventListener("dragover", (ev) => ev.preventDefault());
canvas.addEventListener("drop", (ev) => {
  ev.preventDefault();
  try {
    const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    if (data.type === "device") {
      const t = DEVICE_TEMPLATES.find((x) => x.kind === data.kind);
      if (!t) return;
      const w = screenToWorld(ev.clientX, ev.clientY);
      pushHistory("addNode");
      const n = model.addNode(t, w.x, w.y);
      if (n.kind === "server") ensureServices();
      refreshAll();
      ui.selected = { type: "node", id: n.id };
      refreshInspector();
    }
  } catch {
    // ignore
  }
});

canvas.addEventListener("dblclick", (ev) => {
  const w = screenToWorld(ev.clientX, ev.clientY);
  const n = hitNode(w.x, w.y);
  if (!n) return;
  ui.selected = { type: "node", id: n.id };
  refreshAll();
  openConsoleForSelected();
});

canvas.addEventListener("mousedown", (ev) => {
  const w = screenToWorld(ev.clientX, ev.clientY);
  const n = hitNode(w.x, w.y);

  if (ui.tool === "addDevice" && ui.addKind) {
    const t = DEVICE_TEMPLATES.find((x) => x.kind === ui.addKind);
    if (t) {
      pushHistory("addNode");
      const nn = model.addNode(t, w.x, w.y);
      if (nn.kind === "server") ensureServices();
      ui.selected = { type: "node", id: nn.id };
      ui.tool = "select";
      setTool("select");
      refreshAll();
    }
    return;
  }

  if (n) {
    if (ui.tool === "cable") {
       // Auto-find first available port
       const port = n.ports.find(p => !model.linkForPort(n.id, p.name));
       if (!port) {
          logTerm(`[cable] No free ports on ${n.name}`);
          return;
       }
       if (ui.cableFrom) finishCableTo(n.id, port.name);
       else startCableFrom(n.id, port.name);
       return;
    }

    pushHistory("move");
    ui.selected = { type: "node", id: n.id };
    ui.draggingNodeId = n.id;
    ui.dragOff = { x: w.x - n.x, y: w.y - n.y };
    refreshInspector();
    draw();
    return;
  } else {
     if (ui.tool === "cable") {
        ui.cableFrom = null;
        setTool("select");
        logTerm("[cable] Canceled.");
     }
  }

  // hit link (rough)
  const link = hitLink(w.x, w.y);
  if (link) {
    ui.selected = { type: "link", id: link.id };
    refreshInspector();
    draw();
    return;
  }

  ui.selected = { type: null, id: null };
  refreshInspector();
  draw();
});

canvas.addEventListener("mousemove", (ev) => {
  if (!ui.draggingNodeId) return;
  const w = screenToWorld(ev.clientX, ev.clientY);
  const n = model.nodes.find((x) => x.id === ui.draggingNodeId);
  if (!n) return;
  n.x = w.x - ui.dragOff.x;
  n.y = w.y - ui.dragOff.y;
  draw();
});

window.addEventListener("mouseup", () => {
  if (ui.draggingNodeId) {
    ui.draggingNodeId = null;
    refreshAll();
  }
});

canvas.addEventListener("wheel", (ev) => {
  if (ev.ctrlKey) {
    ev.preventDefault();
    const dz = ev.deltaY > 0 ? -0.08 : 0.08;
    setZoom(view.zoom + dz);
    draw();
  }
}, { passive: false });

function hitLink(wx, wy) {
  // distance to segment under threshold
  for (let i = model.links.length - 1; i >= 0; i--) {
    const l = model.links[i];
    const a = model.nodes.find((n) => n.id === l.a.nodeId);
    const b = model.nodes.find((n) => n.id === l.b.nodeId);
    if (!a || !b) continue;
    const d = pointSegDist(wx, wy, a.x, a.y, b.x, b.y);
    if (d < 6) return l;
  }
  return null;
}

function pointSegDist(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const c1 = wx * vx + wy * vy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2);
  const b = c1 / c2;
  const bx = x1 + b * vx;
  const by = y1 + b * vy;
  return Math.hypot(px - bx, py - by);
}

// ===== Terminal overlay =====
function logTerm(line) {
  terminalOut.textContent += line + "\n";
  terminalOut.scrollTop = terminalOut.scrollHeight;
}

terminalIn.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const cmd = terminalIn.value.trim();
  if (!cmd) return;
  terminalIn.value = "";
  const ctxNodeName = terminalContext.value;
  logTerm(`${ctxNodeName}> ${cmd}`);
  runTerminalCommand(ctxNodeName, cmd);
});

function runTerminalCommand(nodeName, cmdLine) {
  const [cmd, ...rest] = cmdLine.split(/\s+/);
  const args = rest;
  const ep = model.findEndpointByNodeName(nodeName);
  if (!ep) return logTerm("No endpoint selected.");

  switch (cmd.toLowerCase()) {
    case "ipconfig":
      return logTerm(renderIpconfig(ep));
    case "arp":
      if (args[0] === "-a") return logTerm(renderArp(ep));
      return logTerm("Usage: arp -a");
    case "ping":
      if (!args[0]) return logTerm("Usage: ping <ip|hostname>");
      return doPing(nodeName, args[0]);
    case "tracert":
      if (!args[0]) return logTerm("Usage: tracert <ip|hostname>");
      return doTracert(nodeName, args[0]);
    case "nslookup":
      if (!args[0]) return logTerm("Usage: nslookup <name>");
      return doNslookup(nodeName, args[0]);
    case "netstat":
      return logTerm("Active Connections (simulated)\nProto  Local Address  Foreign Address  State\nTCP    0.0.0.0:0      0.0.0.0:0        LISTENING");
    case "dhcp":
      engine.enqueue({ type: "DHCP_DISCOVER", clientNode: nodeName, clientMac: ep.mac });
      return;
    case "udpchat": {
      const dstIp = args[0];
      const msg = args.slice(1).join(" ");
      if (!dstIp || !msg) return logTerm("Usage: udpchat <dst-ip> <message>");
      engine.enqueue({ type: "UDP_SEND", srcNode: nodeName, dstIp, dstPort: 5000, payload: msg });
      return;
    }
    case "tcpput": {
      const dstIp = args[0];
      const bytes = Number(args[1] ?? 1024) || 1024;
      if (!dstIp) return logTerm("Usage: tcpput <dst-ip> [bytes]");
      engine.enqueue({ type: "TCP_CONNECT", srcNode: nodeName, dstIp, dstPort: 80, bytes });
      return;
    }
    default:
      logTerm(`Unknown command: ${cmd}`);
  }
}

function renderIpconfig(ep) {
  return `IP Configuration (simulated)
IP Address . . . . . . . . . . : ${ep.ip || "0.0.0.0"}
Subnet Mask . . . . . . . . .  : ${ep.mask || "0.0.0.0"}
Default Gateway . . . . . . .  : ${ep.gateway || "0.0.0.0"}
DNS Servers . . . . . . . . .  : ${ep.dns || "0.0.0.0"}`;
}

function renderArp(ep) {
  const entries = Object.entries(ep.arp ?? {});
  if (!entries.length) return "ARP cache empty.";
  return `ARP -a (simulated)\nInternet Address      Physical Address\n${entries.map(([ip, mac]) => `${ip.padEnd(20)} ${mac}`).join("\n")}`;
}

function doPing(srcNodeName, target) {
  // Resolve name via DNS if needed
  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(target);
  if (!isIp) {
    const ep = model.findEndpointByNodeName(srcNodeName);
    const dnsIp = ep?.dns;
    if (!dnsIp) return logTerm("No DNS configured. Set DNS in Inspector or via DHCP.");
    engine.enqueue({ type: "DNS_QUERY", srcNode: srcNodeName, serverIp: dnsIp, qname: target, qtype: "A" });
    pendingDns.set(String(target).toLowerCase(), {
      srcNode: srcNodeName,
      onIp: (ip) => engine.enqueue({ type: "PING", srcNode: srcNodeName, dstIp: ip }),
    });
    return;
  }
  engine.enqueue({ type: "PING", srcNode: srcNodeName, dstIp: target });
}

function doTracert(srcNodeName, target) {
  const dst = /^\d+\.\d+\.\d+\.\d+$/.test(target) ? target : null;
  if (!dst) return logTerm("tracert supports IP targets in this build.");
  const src = model.findEndpointByNodeName(srcNodeName);
  const dstEp = model.findEndpointByIp(dst);
  if (!src || !dstEp) return logTerm("Unable to trace route.");
  const path = engine.shortestPath(src.node.id, dstEp.node.id);
  if (!path) return logTerm("No route to host.");
  const names = path.map((id) => model.nodes.find((n) => n.id === id)?.name ?? id);
  logTerm(`Tracing route to ${dst} over ${names.length} hops:\n${names.map((n, i) => `${String(i + 1).padStart(2)}  ${n}`).join("\n")}`);
}

function doNslookup(srcNodeName, name) {
  const ep = model.findEndpointByNodeName(srcNodeName);
  const dnsIp = ep?.dns;
  if (!dnsIp) return logTerm("No DNS configured.");
  engine.enqueue({ type: "DNS_QUERY", srcNode: srcNodeName, serverIp: dnsIp, qname: name, qtype: "A" });
}

// ===== IOS-lite Console (subset) =====
const ios = {
  mode: "user", // user | priv | global | interface | router_rip | router_ospf
  ifName: null,
  routerProto: null,
};

function conWrite(s) {
  consoleOut.textContent += s + "\n";
  consoleOut.scrollTop = consoleOut.scrollHeight;
}

function setConsolePrompt() {
  const dev = currentConsoleDevice();
  const host = dev?.name ?? "Device";
  const m = ios.mode;
  if (m === "user") consolePrompt.textContent = `${host}>`;
  else if (m === "priv") consolePrompt.textContent = `${host}#`;
  else if (m === "global") consolePrompt.textContent = `${host}(config)#`;
  else if (m === "interface") consolePrompt.textContent = `${host}(config-if)#`;
  else if (m === "router_rip") consolePrompt.textContent = `${host}(config-router)#`;
  else if (m === "router_ospf") consolePrompt.textContent = `${host}(config-router)#`;
  else if (m === "router_bgp") consolePrompt.textContent = `${host}(config-router)#`;
  else consolePrompt.textContent = `${host}#`;
}

function currentConsoleDevice() {
  const id = consoleDevice.value;
  return model.nodes.find((n) => n.id === id) ?? null;
}

function openConsoleForSelected() {
  const n = ui.selected.type === "node" ? model.nodes.find((x) => x.id === ui.selected.id) : null;
  if (!n) return;
  if (!["router", "switch", "firewall", "server"].includes(n.kind)) return;
  document.querySelector('.dockTab[data-dock="console"]').click();
  consoleDevice.value = n.id;
  ios.mode = "user";
  ios.ifName = null;
  setConsolePrompt();
  conWrite(`Connected to ${n.name} console.`);
}

$("#btnConsoleNew").addEventListener("click", () => {
  ios.mode = "user";
  ios.ifName = null;
  setConsolePrompt();
  conWrite("New console session.");
});
consoleDevice.addEventListener("change", () => {
  ios.mode = "user";
  ios.ifName = null;
  setConsolePrompt();
});

consoleIn.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const line = consoleIn.value.trim();
  if (!line) return;
  consoleIn.value = "";
  conWrite(`${consolePrompt.textContent} ${line}`);
  session.consoleCmds.push({ ts: Date.now(), deviceId: consoleDevice.value, deviceName: currentConsoleDevice()?.name ?? "?", line });
  runIos(line);
});

function runIos(line) {
  const dev = currentConsoleDevice();
  if (!dev) return conWrite("No device selected.");
  const w = line.split(/\s+/);
  const cmd = w[0]?.toLowerCase?.() ?? "";
  const args = w.slice(1);

  if (cmd === "exit") {
    if (ios.mode === "global" || ios.mode === "interface" || ios.mode.startsWith("router_")) ios.mode = "priv";
    else if (ios.mode === "priv") ios.mode = "user";
    setConsolePrompt();
    return;
  }

  if (ios.mode === "user") {
    if (cmd === "enable") {
      ios.mode = "priv";
      setConsolePrompt();
      return;
    }
    if (cmd === "ping") {
      if (!args[0]) return conWrite("Usage: ping <ip>");
      engine.enqueue({ type: "PING", srcNode: dev.name, dstIp: args[0] });
      return;
    }
    if (cmd === "traceroute" || cmd === "tracert") {
      if (!args[0]) return conWrite("Usage: traceroute <ip>");
      return conWrite("Use the Terminal overlay for tracert in this build.");
    }
    if (cmd === "show" && args[0] === "version") {
      return conWrite(`MIT ADT VLab IOS-lite 0.1\nDevice: ${dev.kind}\nUptime: simulated`);
    }
    if (cmd === "show" && args.join(" ") === "ip int brief") {
      return conWrite(renderShowIpIntBrief(dev));
    }
    if (cmd === "show" && args.join(" ") === "ip protocols") {
      return conWrite(renderShowIpProtocols(dev));
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }

  if (ios.mode === "priv") {
    if (cmd === "disable") {
      ios.mode = "user";
      setConsolePrompt();
      return;
    }
    if (cmd === "show" && args[0] === "running-config") {
      return conWrite(renderRunningConfig(dev));
    }
    if (cmd === "show" && args.join(" ") === "ip route") {
      return conWrite(renderIpRoute(dev));
    }
    if (cmd === "show" && args.join(" ") === "ip int brief") {
      return conWrite(renderShowIpIntBrief(dev));
    }
    if (cmd === "show" && args.join(" ") === "ip ospf neighbor") {
      return conWrite(renderShowOspfNeighbor(dev));
    }
    if (cmd === "show" && args.join(" ") === "ip route ospf") {
      return conWrite(renderIpRouteFiltered(dev, "OSPF"));
    }
    if (cmd === "show" && args.join(" ") === "ip protocols") {
      return conWrite(renderShowIpProtocols(dev));
    }
    if (cmd === "show" && args.join(" ") === "vlan brief") {
      return conWrite(renderShowVlanBrief(dev));
    }
    if (cmd === "show" && (args.join(" ") === "mac address-table" || args.join(" ") === "mac address table")) {
      return conWrite(renderShowMacAddressTable(dev));
    }
    if (cmd === "show" && args.join(" ") === "interfaces trunk") {
      return conWrite(renderShowInterfacesTrunk(dev));
    }
    if (cmd === "show" && (args.join(" ") === "spanning-tree" || args.join(" ") === "spanning tree")) {
      return conWrite(renderShowSpanningTree(dev));
    }
    if (cmd === "show" && args.join(" ") === "etherchannel summary") {
      return conWrite(renderShowEtherChannel(dev));
    }
    if ((cmd === "conf" && args[0] === "t") || cmd === "configure") {
      if (cmd === "configure" && args[0] && args[0].toLowerCase?.() !== "terminal") return conWrite("% Usage: configure terminal");
      ios.mode = "global";
      setConsolePrompt();
      return;
    }
    if (cmd === "write" || (cmd === "copy" && args.join(" ") === "run start")) {
      return conWrite("Building configuration...\n[OK]");
    }
    if (cmd === "debug" && args[0] === "ip" && args[1] === "ospf" && args[2] === "events") {
      dev.debug = dev.debug ?? {};
      dev.debug.ospfEvents = true;
      return conWrite("OSPF event debugging is on (simulated).");
    }
    if (cmd === "debug" && args[0] === "ip" && args[1] === "rip") {
      dev.debug = dev.debug ?? {};
      dev.debug.rip = true;
      return conWrite("RIP debugging is on (simulated).");
    }
    // allow ping in priv
    if (cmd === "ping") {
      if (!args[0]) return conWrite("Usage: ping <ip>");
      engine.enqueue({ type: "PING", srcNode: dev.name, dstIp: args[0] });
      return;
    }
    return conWrite("% Unrecognized command");
  }

  if (ios.mode === "global") {
    if (cmd === "hostname") {
      pushHistory("hostname");
      dev.name = args[0] ?? dev.name;
      refreshAll();
      setConsolePrompt();
      return;
    }
    if (cmd === "ip" && args[0] === "routing") {
      dev.ipRouting = true;
      return conWrite("IP routing enabled.");
    }
    if (cmd === "interface" || cmd === "int") {
      ios.mode = "interface";
      ios.ifName = args[0] ?? null;
      dev.endpoint.ifs = dev.endpoint.ifs ?? {};
      dev.endpoint.ifs[ios.ifName] = dev.endpoint.ifs[ios.ifName] ?? { ip: "", mask: "255.255.255.0", shutdown: false };
      setConsolePrompt();
      return;
    }
    if (cmd === "router") {
      const proto = args[0]?.toLowerCase();
      if (proto === "rip") {
        if (dev.kind !== "router") return conWrite("% Routing not supported on this device.");
        dev.routing.rip.enabled = true;
        ios.mode = "router_rip";
        setConsolePrompt();
        return;
      }
      if (proto === "ospf") {
        if (dev.kind !== "router") return conWrite("% Routing not supported on this device.");
        dev.routing.ospf.enabled = true;
        dev.routing.ospf.pid = Number(args[1] ?? dev.routing.ospf.pid) || dev.routing.ospf.pid;
        ios.mode = "router_ospf";
        setConsolePrompt();
        return;
      }
      if (proto === "bgp") {
        if (dev.kind !== "router") return conWrite("% Routing not supported on this device.");
        dev.routing.bgp.enabled = true;
        dev.routing.bgp.asn = Number(args[1] ?? dev.routing.bgp.asn) || dev.routing.bgp.asn;
        ios.mode = "router_bgp";
        setConsolePrompt();
        return;
      }
      return conWrite("% Unsupported routing protocol in this build.");
    }
    if (cmd === "vlan") {
      dev.vlans = dev.vlans ?? {};
      const id = Number(args[0]);
      if (!Number.isInteger(id) || id < 1 || id > 4094) return conWrite("% Invalid VLAN id");
      dev.vlans[id] = dev.vlans[id] ?? { name: `VLAN${id}` };
      return conWrite(`VLAN ${id} added.`);
    }
    if (cmd === "vtp" && args[0] === "domain") {
      dev.vtp = dev.vtp ?? {};
      dev.vtp.domain = args[1] ?? "";
      return conWrite("VTP domain set.");
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }

  if (ios.mode === "interface") {
    const ifName = ios.ifName;
    dev.endpoint.ifs = dev.endpoint.ifs ?? {};
    const ifc = (dev.endpoint.ifs[ifName] = dev.endpoint.ifs[ifName] ?? { ip: "", mask: "255.255.255.0", shutdown: false });
    if (cmd === "ip" && args[0] === "address") {
      pushHistory("ifIp");
      ifc.ip = args[1] ?? "";
      ifc.mask = args[2] ?? ifc.mask;
      refreshAll();
      return;
    }
    if ((cmd === "no" && args[0] === "shutdown") || cmd === "no" && args[0] === "shut") {
      ifc.shutdown = false;
      return;
    }
    if (cmd === "shutdown" || cmd === "shut") {
      ifc.shutdown = true;
      return;
    }
    if (cmd === "encapsulation" && args[0] === "dot1q") {
      ifc.dot1q = Number(args[1] ?? 1) || 1;
      return;
    }
    if (cmd === "switchport" && args[0] === "mode") {
      ifc.swMode = args[1] ?? "access";
      return;
    }
    if (cmd === "switchport" && args[0] === "access" && args[1] === "vlan") {
      ifc.accessVlan = Number(args[2] ?? 1) || 1;
      return;
    }
    if (cmd === "switchport" && args[0] === "trunk" && args[1] === "native" && args[2] === "vlan") {
      ifc.nativeVlan = Number(args[3] ?? 1) || 1;
      return;
    }
    if (cmd === "switchport" && args[0] === "trunk" && args[1] === "allowed" && args[2] === "vlan") {
      // Accept "all" or "10,20,30"
      const spec = (args[3] ?? "all").toLowerCase();
      ifc.allowedVlans = spec === "all" ? "all" : spec;
      return;
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }

  if (ios.mode === "router_rip") {
    if (cmd === "network") {
      dev.routing.rip.networks = dev.routing.rip.networks ?? [];
      dev.routing.rip.networks.push(args[0]);
      return;
    }
    if (cmd === "version") {
      dev.routing.rip.version = Number(args[0] ?? 2) || 2;
      return;
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }

  if (ios.mode === "router_ospf") {
    if (cmd === "network") {
      dev.routing.ospf.networks = dev.routing.ospf.networks ?? [];
      dev.routing.ospf.networks.push({ ip: args[0], wildcard: args[1], area: Number(args[3] ?? 0) || 0 });
      return;
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }

  if (ios.mode === "router_bgp") {
    if (cmd === "network") {
      dev.routing.bgp.networks = dev.routing.bgp.networks ?? [];
      dev.routing.bgp.networks.push(args[0]);
      return;
    }
    if (cmd === "neighbor") {
      dev.routing.bgp.neighbors = dev.routing.bgp.neighbors ?? [];
      dev.routing.bgp.neighbors.push({ ip: args[0], remoteAs: Number(args[2]) || 0 });
      return;
    }
    return conWrite("% Invalid input detected at '^' marker.");
  }
}

function renderShowIpIntBrief(dev) {
  const lines = ["Interface          IP-Address      OK? Method Status Protocol"];
  const ifs = dev.endpoint?.ifs ?? {};
  for (const [name, v] of Object.entries(ifs)) {
    const ip = (v.ip || "unassigned").padEnd(14);
    const up = v.shutdown ? "administratively down" : "up";
    lines.push(`${name.padEnd(18)} ${ip} YES manual ${up.padEnd(6)} up`);
  }
  return lines.join("\n");
}

function renderRunningConfig(dev) {
  const lines = [];
  lines.push(`hostname ${dev.name}`);
  if (dev.kind === "router") {
    if (dev.routing?.rip?.enabled) lines.push("router rip");
    if (dev.routing?.ospf?.enabled) lines.push(`router ospf ${dev.routing.ospf.pid}`);
  }
  const ifs = dev.endpoint?.ifs ?? {};
  for (const [name, v] of Object.entries(ifs)) {
    lines.push(`interface ${name}`);
    if (v.ip) lines.push(` ip address ${v.ip} ${v.mask}`);
    if (!v.shutdown) lines.push(" no shutdown");
  }
  return lines.join("\n");
}

function renderIpRoute(dev) {
  const lines = ["Codes: C - connected, R - RIP, O - OSPF"];
  const connected = model.connectedNetworksForRouter(dev.id);
  for (const c of connected) lines.push(`C    ${c.net}/${maskToPrefixSafe(c.mask)} is directly connected`);
  for (const r of dev.routes ?? []) {
    const code = r.proto === "OSPF" ? "O" : r.proto === "RIP" ? "R" : "R";
    lines.push(`${code}    ${r.net}/${maskToPrefixSafe(r.mask)} [${r.metric}] via ${r.via}`);
  }
  return lines.join("\n");
}

function renderIpRouteFiltered(dev, proto) {
  const lines = [`Codes: O - OSPF, R - RIP`];
  for (const r of dev.routes ?? []) {
    if (r.proto !== proto) continue;
    const code = r.proto === "OSPF" ? "O" : "R";
    lines.push(`${code}    ${r.net}/${maskToPrefixSafe(r.mask)} [${r.metric}] via ${r.via}`);
  }
  if (lines.length === 1) lines.push("No routes.");
  return lines.join("\n");
}

function renderShowOspfNeighbor(dev) {
  if (dev.kind !== "router" || !dev.routing?.ospf?.enabled) return "OSPF not enabled.";
  return `Neighbor ID     State     Dead Time   Address\n(simulated)     FULL      00:00:30    0.0.0.0`;
}

function renderShowIpProtocols(dev) {
  const lines = ["Routing Protocols:"];
  if (dev.kind !== "router") return "No routing protocols on this device.";
  if (dev.routing?.rip?.enabled) lines.push(`RIP v${dev.routing.rip.version} - networks: ${(dev.routing.rip.networks ?? []).join(", ") || "(none)"}`);
  if (dev.routing?.ospf?.enabled) lines.push(`OSPF ${dev.routing.ospf.pid} area ${dev.routing.ospf.area ?? 0} - networks: ${(dev.routing.ospf.networks ?? []).length || 0}`);
  if (dev.routing?.bgp?.enabled) lines.push(`BGP AS ${dev.routing.bgp.asn} - neighbors: ${(dev.routing.bgp.neighbors ?? []).length || 0}`);
  if (lines.length === 1) lines.push("(none)");
  return lines.join("\n");
}

function renderShowVlanBrief(dev) {
  if (dev.kind !== "switch") return "VLANs not supported on this device.";
  const vlans = dev.vlans ?? { 1: { name: "default" } };
  const lines = ["VLAN Name                             Status Ports", "---- -------------------------------- --------- -----"];
  for (const [id, v] of Object.entries(vlans)) {
    lines.push(`${String(id).padEnd(4)} ${String(v.name ?? `VLAN${id}`).padEnd(32)} active`);
  }
  return lines.join("\n");
}

function renderShowSpanningTree(dev) {
  if (dev.kind !== "switch") return "STP not supported on this device.";
  if (!dev.stp?.enabled) return "Spanning tree disabled.";
  return `Spanning tree enabled (simulated)\nRoot ID    Priority  ${dev.stp.priority ?? 32768}\nBridge ID  Priority  ${dev.stp.priority ?? 32768}\nPorts: ${dev.ports.length}`;
}

function renderShowEtherChannel(dev) {
  if (dev.kind !== "switch") return "EtherChannel not supported on this device.";
  const groups = Object.entries(dev.etherChannel?.groups ?? {});
  if (!groups.length) return "No EtherChannels configured.";
  const lines = ["Group  Port-channel  Protocol  Ports"];
  for (const [gid, g] of groups) lines.push(`${gid.padEnd(5)} Po${gid.padEnd(12)} LACP      ${(g.ports ?? []).join(", ")}`);
  return lines.join("\n");
}

function renderShowMacAddressTable(dev) {
  if (dev.kind !== "switch") return "MAC table not supported on this device.";
  const mt = dev.macTable ?? {};
  const lines = ["          Mac Address Table (simulated)", "Vlan    Mac Address       Type        Ports", "----    -----------       --------    -----"];
  const entries = [];
  for (const [vlan, table] of Object.entries(mt)) {
    for (const [mac, v] of Object.entries(table ?? {})) {
      entries.push({ vlan: Number(vlan), mac, port: v.port });
    }
  }
  entries.sort((a, b) => a.vlan - b.vlan || a.mac.localeCompare(b.mac));
  for (const e of entries) lines.push(`${String(e.vlan).padEnd(7)} ${String(e.mac).padEnd(17)} DYNAMIC     ${e.port}`);
  if (entries.length === 0) lines.push("(empty)");
  return lines.join("\n");
}

function renderShowInterfacesTrunk(dev) {
  if (dev.kind !== "switch") return "Trunk interfaces not supported on this device.";
  const ifs = dev.endpoint?.ifs ?? {};
  const trunks = Object.entries(ifs).filter(([, v]) => String(v?.swMode ?? "access").toLowerCase() === "trunk");
  const lines = ["Port      Mode         Encapsulation  Status    Native vlan", "----      ----         -------------  ------    -----------"];
  for (const [name, v] of trunks) {
    const native = Number(v.nativeVlan ?? 1) || 1;
    lines.push(`${name.padEnd(9)} on           802.1q        trunking  ${native}`);
  }
  if (!trunks.length) lines.push("(none)");
  return lines.join("\n");
}

function maskToPrefixSafe(mask) {
  const m = ipToIntSafe(mask);
  if (m === null) return "?";
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((m >>> i) & 1) count++;
    else break;
  }
  return count;
}

// ===== Labs + Exam =====
function renderLabs() {
  labsPane.innerHTML = "";
  const select = document.createElement("select");
  select.className = "select";
  for (const l of LABS) {
    const o = document.createElement("option");
    o.value = l.id;
    o.textContent = l.title;
    select.appendChild(o);
  }

  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.innerHTML = `<div class="cardTitle">Theory Modules</div>`;
  wrap.appendChild(select);
  const content = document.createElement("div");
  content.style.marginTop = "10px";
  wrap.appendChild(content);
  labsPane.appendChild(wrap);

  const btnEval = document.createElement("button");
  btnEval.className = "btn";
  btnEval.textContent = "Evaluate Lab";
  btnEval.addEventListener("click", () => {
    const lab = LABS.find((x) => x.id === select.value);
    const report = buildCombinedLabReport(lab);
    setLastReport(report);
    labsPane.appendChild(renderReportCard(report));
  });
  wrap.appendChild(document.createElement("div")).style.marginTop = "10px";
  wrap.appendChild(btnEval);

  const render = () => {
    const lab = LABS.find((x) => x.id === select.value);
    appState.currentLabId = lab.id;
    content.innerHTML = `
      <div class="card" style="margin:0">
        <div class="cardTitle">${escapeHtml(lab.title)}</div>
        <div class="muted">${escapeHtml(lab.concept)}</div>
        <div style="margin-top:10px"><b>Step-by-step</b><ol>${(lab.steps ?? []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol></div>
        <div style="margin-top:10px"><b>CLI examples</b><div><code>${(lab.cliExamples ?? []).join("</code> <code>")}</code></div></div>
        <div style="margin-top:10px"><b>Practice</b><ul>${(lab.practice ?? []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></div>
      </div>
    `;

    // Auto-load lab topology for VLab mode
    if (session.mode === "vlab") loadLabTopology(lab.id);

    // Practice tasks with syntax validation
    const tasks = getPracticeTasks(lab.id);
    if (tasks.length) {
      const tcard = document.createElement("div");
      tcard.className = "card";
      tcard.innerHTML = `
        <div class="cardTitle">Practice Panel (syntax validation)</div>
        <div class="muted">Marks tasks complete when the expected command patterns are detected.</div>
        <div style="margin-top:10px" id="practiceTasks"></div>
        <div class="row" style="margin-top:12px;justify-content:space-between">
          <button class="btn" id="btnValidatePractice">Validate Tasks</button>
          <div class="muted">Tip: run commands in Device Console or Terminal, then validate.</div>
        </div>
      `;
      labsPane.appendChild(tcard);

      const list = tcard.querySelector("#practiceTasks");
      const renderTasks = () => {
        const res = validatePracticeTasks(lab.id);
        list.innerHTML = res
          .map((r) => `<div class="row" style="justify-content:space-between">
            <div>${escapeHtml(r.title)}</div>
            <div class="tag">${r.ok ? "DONE" : `${r.points} pts`}</div>
          </div>`)
          .join("");
      };
      tcard.querySelector("#btnValidatePractice").addEventListener("click", renderTasks);
      renderTasks();
    }
  };
  select.addEventListener("change", render);
  select.value = appState.currentLabId ?? LABS[0].id;
  render();
}

function renderReportCard(report) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="cardTitle">Evaluation Report</div>
    <div class="row">
      <div class="tag">Score: ${report.score}</div>
      <button class="btn btnSmall" data-dl>Download JSON</button>
    </div>
    <div class="muted" style="margin-top:8px">${escapeHtml(report.remarks)}</div>
    <div style="margin-top:10px">${(report.details ?? []).map((d) => `<div class="row" style="justify-content:space-between"><div>${escapeHtml(d.remark || "")}</div><div class="tag">${d.ok ? "OK" : "FIX"}</div></div>`).join("")}</div>
  `;
  card.querySelector("[data-dl]")?.addEventListener("click", () => {
    downloadText(`netforge_report_${report.lab}_${Date.now()}.json`, JSON.stringify(report, null, 2));
  });
  return card;
}

function renderExam() {
  examPane.innerHTML = "";
  const examState = { startedAt: null, durationSec: 10 * 60, timer: null };
  const questions = [
    { id: "q1", text: "What does split horizon help prevent in RIP?", choices: ["Routing loops", "ARP spoofing", "VLAN hopping", "DNS poisoning"], correct: 0 },
    { id: "q2", text: "OSPF is primarily a:", choices: ["Distance vector protocol", "Link state protocol", "Transport protocol", "Application protocol"], correct: 1 },
    { id: "q3", text: "CSMA/CA is used by:", choices: ["Ethernet hubs", "Wireless LANs", "Fiber links", "Serial WAN"], correct: 1 },
  ];
  const answers = {};

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<div class="cardTitle">Exam Mode</div><div class="muted">MCQs + quick CLI tasks + topology build checks.</div>`;
  examPane.appendChild(card);

  const mcq = document.createElement("div");
  mcq.className = "card";
  mcq.innerHTML = `<div class="cardTitle">MCQs (timed)</div><div class="row" style="justify-content:space-between;margin-top:6px"><div class="muted">Time left: <span id="examTime">10:00</span></div><button class="btn" id="btnStartExam">Start</button></div>`;
  for (const q of questions) {
    const qdiv = document.createElement("div");
    qdiv.style.marginTop = "10px";
    qdiv.innerHTML = `<div><b>${escapeHtml(q.text)}</b></div>`;
    q.choices.forEach((c, i) => {
      const id = `${q.id}_${i}`;
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<label class="toggle"><input type="radio" name="${q.id}" value="${i}" id="${id}"/><span>${escapeHtml(c)}</span></label>`;
      row.querySelector("input").addEventListener("change", () => (answers[q.id] = i));
      qdiv.appendChild(row);
    });
    mcq.appendChild(qdiv);
  }
  const btnGrade = document.createElement("button");
  btnGrade.className = "btn";
  btnGrade.textContent = "Grade Exam";
  btnGrade.addEventListener("click", () => {
    const correct = questions.reduce((acc, q) => acc + ((answers[q.id] ?? -1) === q.correct ? 1 : 0), 0);
    const score = Math.round((correct / questions.length) * 100);
    const timeSpent = examState.startedAt ? Math.round((Date.now() - examState.startedAt) / 1000) : 0;
    const report = {
      student: session.user?.username ?? "Demo User",
      lab: `Exam Mode${appState.currentLabId ? ` (${appState.currentLabId})` : ""}`,
      score,
      remarks: `MCQ score: ${correct}/${questions.length}. Time spent: ${timeSpent}s.`,
    };
    setLastReport(report);
    examPane.appendChild(renderReportCard({ ...report, details: [] }));
  });
  mcq.appendChild(document.createElement("div")).style.marginTop = "10px";
  mcq.appendChild(btnGrade);
  examPane.appendChild(mcq);

  // Start timer + enable inputs
  const timeEl = mcq.querySelector("#examTime");
  const startBtn = mcq.querySelector("#btnStartExam");
  const setEnabled = (on) => {
    mcq.querySelectorAll("input[type=radio]").forEach((x) => (x.disabled = !on));
    btnGrade.disabled = !on;
  };
  const tick = () => {
    if (!examState.startedAt) return;
    const elapsed = Math.floor((Date.now() - examState.startedAt) / 1000);
    const left = Math.max(0, examState.durationSec - elapsed);
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    timeEl.textContent = `${mm}:${ss}`;
    if (left <= 0) {
      clearInterval(examState.timer);
      examState.timer = null;
      setEnabled(false);
      timeEl.textContent = "00:00";
    }
  };
  setEnabled(false);
  startBtn.addEventListener("click", () => {
    if (examState.startedAt) return;
    examState.startedAt = Date.now();
    setEnabled(true);
    tick();
    examState.timer = setInterval(tick, 250);
  });

  const cli = document.createElement("div");
  cli.className = "card";
  cli.innerHTML = `
    <div class="cardTitle">CLI Tasks</div>
    <ol>
      <li>Configure an IP on a router interface (<code>int g0/0</code>, <code>ip address ...</code>, <code>no shut</code>).</li>
      <li>Enable RIP or OSPF and verify routes (<code>show ip route</code>).</li>
      <li>Create VLAN 10 on a switch (<code>vlan 10</code>).</li>
    </ol>
    <div class="muted">Use the Device Console dock tab and then export a Report.</div>
  `;
  examPane.appendChild(cli);
}

// ===== Init =====
buildPalette();
setTool("select");
setSimMode("realtime");
setZoom(1);
appState.currentLabId = LABS[0]?.id ?? null;

renderLabs();
renderExam();
refreshAll();
setConsolePrompt();
setLastReport(null);

btnReportDownload?.addEventListener("click", () => {
  if (!appState.lastReport) return;
  downloadText(`netforge_report_${Date.now()}.json`, JSON.stringify(appState.lastReport, null, 2));
});
btnReportClear?.addEventListener("click", () => setLastReport(null));

// ===== Auth / app start =====
btnGetStarted.addEventListener("click", () => openAuth());
btnOpenLogin.addEventListener("click", () => openAuth());
btnCancelLogin.addEventListener("click", () => closeAuth());
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuth();
});
btnGuest.addEventListener("click", async () => {
  try {
    closeAuth();
    await login({ username: `Guest_${Math.floor(Math.random() * 10000)}`, password: "", isGuest: true });
  } catch (err) {
    authMsg.textContent = String(err?.message ?? err);
  }
});
btnDoLogin.addEventListener("click", async () => {
  try {
    const u = inpUsername.value.trim();
    const p = inpPassword.value;
    closeAuth();
    await login({ username: u, password: p, isGuest: false });
  } catch (err) {
    authMsg.textContent = String(err?.message ?? err);
    authModal.classList.remove("hidden");
  }
});
btnLogout.addEventListener("click", () => logout());

btnModeVlab.addEventListener("click", () => {
  window.location.href = "vlab.html";
});
btnModeExp.addEventListener("click", () => {
  setAppMode("experiment");
  hideOverlay();
  resetProject({ name: "Experiment" });
});

const prevUser = loadUser();
setTheme(loadTheme() ?? "light");
if (prevUser?.username) {
  setUser(prevUser);
  showOverlayPane(modeSelect);
} else {
  showOverlayPane(landing);
}

// Animation loop
function frame() {
  engine.tick();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
