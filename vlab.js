// window.VLAB_DATA is loaded globally via vlabData.js script tag
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { evaluateLab } from "./evaluate.js";
import { LABS } from "./labs/index.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaYFXyCpq60TC-op86g5cO5laHA5_bC10",
    authDomain: "vlab-b1761.firebaseapp.com",
    projectId: "vlab-b1761",
    storageBucket: "vlab-b1761.firebasestorage.app",
    messagingSenderId: "83114402229",
    appId: "1:83114402229:web:be4e43415868e57ecaf9fc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

const syncProgress = async (labId, data) => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user || !labId) {
        console.warn("Sync failed: User or Lab ID missing");
        return;
    }
    try {
        await setDoc(doc(db, "users", user.uid, "progress", labId), {
            ...data,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Progress synced to cloud");
    } catch (e) { console.error("Cloud sync failed", e); }
};

const syncTopology = async (labId, topoData) => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user || !labId) return;
    try {
        await setDoc(doc(db, "users", user.uid, "topologies", labId), {
            ...topoData,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Topology synced to cloud");
    } catch (e) { console.error("Topology cloud sync failed", e); }
};

const fetchProgress = async () => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user) {
        console.warn("Fetch failed: User not authenticated");
        return;
    }
    try {
        const progSnap = await getDocs(collection(db, "users", user.uid, "progress"));
        progSnap.forEach(doc => {
            localStorage.setItem(`vlab_state_${doc.id}`, JSON.stringify(doc.data()));
        });

        const topoSnap = await getDocs(collection(db, "users", user.uid, "topologies"));
        topoSnap.forEach(doc => {
            localStorage.setItem(`vlab_topology_${doc.id}`, JSON.stringify(doc.data()));
        });

        console.log("Progress and topologies restored from cloud");
    } catch (e) {
        console.error("Restore failed", e);
        if (e.code === 'permission-denied') {
            console.warn("Firestore Permission Denied: Ensure rules allow access to 'users/{uid}/progress' and 'topologies'.");
        }
    } finally {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }
};

window.fetchProgress = fetchProgress;
window.syncProgress = syncProgress;
// Polyfill for roundRect if not supported
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
        else r = { tl: r.tl || 0, tr: r.tr || 0, br: r.br || 0, bl: r.bl || 0 };
        this.beginPath();
        this.moveTo(x + r.tl, y);
        this.lineTo(x + w - r.tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        this.lineTo(x + w, y + h - r.br);
        this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        this.lineTo(x + r.bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        this.lineTo(x, y + r.tl);
        this.quadraticCurveTo(x, y, x + r.tl, y);
        this.closePath();
        return this;
    };
}



const generatePDFReport = async (labId) => {
    // Show Loading Overlay
    const loader = document.createElement('div');
    loader.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.9); z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:var(--font-sans); backdrop-filter:blur(8px);";
    loader.innerHTML = `
        <div class="pulse" style="width:80px; height:80px; background:var(--primary); border-radius:50%; margin-bottom:20px; box-shadow: 0 0 40px var(--primary);"></div>
        <h2 style="margin:0; font-size:24px;">Generating Academic Report</h2>
        <p style="opacity:0.7; margin-top:10px;">Compiling results, logs and visualizations...</p>
        <div style="width:200px; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; margin-top:20px; overflow:hidden;">
            <div id="report-progress" style="width:0%; height:100%; background:var(--primary); transition:width 0.3s;"></div>
        </div>
    `;
    document.body.appendChild(loader);
    const progress = loader.querySelector('#report-progress');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const name = localStorage.getItem('vlab_user_name') || 'Student User';
    const data = window.VLAB_DATA[labId] || { title: "Custom Experiment", aim: "N/A", theory: { intro: "", cards: [] }, procedure: [] };

    // Helper to capture DOM elements (High Reliability Version)
    const addElementToPDF = async (elementId, title, yPos) => {
        const element = document.getElementById(elementId);
        if (!element) return yPos;

        const section = element.closest('.content-section');
        const wasActive = section?.classList.contains('active');
        
        try {
            // 1. Prioritize Direct Canvas Export for Sim/Topo (100% Reliable)
            if (elementId === 'simCanvas' || elementId === 'topology-builder-ui') {
                const canvas = element.querySelector('canvas') || (element.tagName === 'CANVAS' ? element : null);
                if (canvas) {
                    // Force a re-render to ensure current state is captured
                    if (window.currentSim) window.currentSim.drawPerformanceGraphs();
                    if (window.currentTopo) window.currentTopo.render();

                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
                    doc.text(title, 20, yPos);
                    doc.addImage(imgData, 'JPEG', 20, yPos + 5, 170, 85);
                    return yPos + 100;
                }
            }

            // 2. Fallback to html2canvas for complex DOM elements
            if (section && !wasActive) {
                section.style.display = 'flex';
                section.style.opacity = '0';
                await new Promise(r => setTimeout(r, 300));
            }

            const canvas = await html2canvas(element, { 
                scale: 1.5,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            doc.setFont("helvetica", "bold"); doc.setFontSize(12);
            doc.text(title, 20, yPos);
            doc.addImage(imgData, 'JPEG', 20, yPos + 5, 170, 85);
            
            if (section && !wasActive) section.style.display = 'none';
            return yPos + 100;

        } catch (e) {
            console.error(`Report capture failed for ${elementId}:`, e);
            doc.setFont("helvetica", "italic"); doc.setFontSize(10);
            doc.text(`[Image Capture Failed for ${title}]`, 20, yPos + 10);
            return yPos + 20;
        }
    };

    progress.style.width = "10%";

    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("MIT ADT UNIVERSITY", 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text("VIRTUAL NETWORKING LABORATORY REPORT", 105, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Student: ${name}`, 20, 55);
    doc.text(`Lab: ${data.title}`, 20, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 69);

    progress.style.width = "30%";

    // Section 1 & 2: Aim & Theory
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text("1. AIM", 20, 85);
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    doc.text(doc.splitTextToSize(data.aim, 170), 20, 93);

    let y = 115;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("2. THEORY", 20, y); y += 8;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    const theoryLines = doc.splitTextToSize(data.theory.intro, 170);
    doc.text(theoryLines, 20, y); y += (theoryLines.length * 6) + 5;

    // Section 3: Procedure
    if (y > 200) { doc.addPage(); y = 30; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("3. PROCEDURE", 20, y); y += 8;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    data.procedure.forEach((step, i) => {
        const stepLines = doc.splitTextToSize(`${i + 1}. ${step}`, 165);
        doc.text(stepLines, 25, y);
        y += (stepLines.length * 6) + 2;
        if (y > 270) { doc.addPage(); y = 30; }
    });

    progress.style.width = "50%";

    // Section 4: Visualizations
    doc.addPage();
    y = 30;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("4. EXPERIMENT VISUALIZATIONS", 20, y); y += 15;
    
    y = await addElementToPDF('simCanvas', "A. Protocol Animation State", y);
    if (y > 200) { doc.addPage(); y = 30; }
    y = await addElementToPDF('topology-builder-ui', "B. Configured Network Topology", y);

    progress.style.width = "70%";

    // Section 5: Results Table
    doc.addPage();
    y = 30;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("5. PERFORMANCE RESULTS", 20, y); y += 10;

    const stats = [
        ["Metric", "Value"],
        ["Packets Sent", document.getElementById('statSent')?.textContent || "0"],
        ["Packets Acknowledged", document.getElementById('statAck')?.textContent || "0"],
        ["Network Efficiency", document.getElementById('statEff')?.textContent || "0%"],
        ["Average Throughput", document.getElementById('statThroughput')?.textContent || "0 Bps"]
    ];

    doc.autoTable({
        startY: y,
        head: [stats[0]],
        body: stats.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }
    });
    y = doc.lastAutoTable.finalY + 20;

    // Section 6: Observation Log Table
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("6. PROTOCOL OBSERVATION LOG", 20, y); y += 8;

    const logs = Array.from(document.querySelectorAll('#eventList .event-item')).map(item => {
        const time = item.querySelector('.event-time')?.textContent || "";
        const proto = item.querySelector('.event-proto')?.textContent || "";
        const desc = item.querySelector('.event-desc')?.textContent || "";
        return [time, proto, desc];
    }).slice(-15); // Take last 15 events for the report

    if (logs.length > 0) {
        doc.autoTable({
            startY: y,
            head: [["Time", "Protocol", "Observation/Event Detail"]],
            body: logs,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [16, 185, 129] }
        });
        y = doc.lastAutoTable.finalY + 20;
    } else {
        doc.setFont("helvetica", "italic"); doc.setFontSize(10);
        doc.text("No specific protocol events logged during this session.", 25, y);
        y += 15;
    }

    // Section 7: Conclusion
    if (y > 240) { doc.addPage(); y = 30; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("7. CONCLUSION", 20, y); y += 10;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    const concl = "The experiment successfully demonstrated the requested protocol behaviors. Live simulation verified packet flow, efficiency metrics, and topological connectivity in accordance with academic requirements.";
    doc.text(doc.splitTextToSize(concl, 170), 20, y);

    progress.style.width = "100%";
    setTimeout(() => {
        doc.save(`${data.title.replace(/ /g, '_')}_Academic_Report.pdf`);
        loader.remove();
    }, 500);
};

const generateCertificate = async (labId) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    const name = localStorage.getItem('vlab_user_name') || 'Student User';
    const data = window.VLAB_DATA[labId] || { title: "Custom Experiment" };

    // Aesthetic Border
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(5);
    doc.rect(5, 5, 287, 200);
    doc.setDrawColor(251, 191, 36); // Gold
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);

    // Header
    doc.setTextColor(30, 58, 138);
    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.text("MIT ADT UNIVERSITY", 148, 40, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("CERTIFICATE OF COMPLETION", 148, 55, { align: 'center' });

    // Body
    doc.setFontSize(14);
    doc.text("This is to certify that", 148, 80, { align: 'center' });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(42);
    doc.text(name, 148, 105, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("has successfully completed the virtual laboratory experiment on", 148, 125, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(data.title, 148, 140, { align: 'center' });

    // Seal/Logo Placeholder
    doc.setFontSize(60);
    doc.setTextColor(30, 58, 138, 0.1);
    doc.text("MIT ADT", 148, 110, { align: 'center', angle: 45 });

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Dr. Nilesh Thorat", 60, 175);
    doc.text("Supervisor, MIT ADT VLab", 60, 182);
    doc.line(40, 170, 100, 170);

    doc.text(new Date().toLocaleDateString(), 230, 175);
    doc.text("Date of Issue", 230, 182);
    doc.line(210, 170, 270, 170);

    doc.save(`${name.replace(/ /g, '_')}_Certificate.pdf`);
};

// Expose to global scope for HTML onclick handlers
window.generatePDFReport = generatePDFReport;
window.generateCertificate = generateCertificate;

// End of Cloud Config

class TopologySimulation {
    constructor(container) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;

        // 1. Bind methods and set aliases BEFORE init
        this.animate = this.animate.bind(this);
        this.resize = this.resize.bind(this);
        this.render = this.animate; // Compatibility alias

        // 2. Initialize properties
        this.nodes = [];
        this.links = [];
        this.isCabling = false;
        this.selectedCable = 'straight';
        this.cableStartNode = null;
        this.isRunning = true;

        // 3. Initialize DOM and listeners
        this.resizeBound = this.resize.bind(this);
        this.mousedownBound = (e) => {
            const menu = document.getElementById('contextMenu');
            const props = document.getElementById('device-props');
            if (menu && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
            if (props && !props.contains(e.target) && !e.target.closest('.device-node')) {
                props.style.display = 'none';
            }
        };
        this.init();

        // 4. Start animation loop
        this.animate();
        window.currentTopo = this;
    }

    destroy() {
        this.isRunning = false;
        if (this.aniId) cancelAnimationFrame(this.aniId);
        window.removeEventListener('resize', this.resizeBound);
        window.removeEventListener('mousedown', this.mousedownBound);
        if (window.currentTopo === this) window.currentTopo = null;
    }

    computeTopologyRouting() {
        this.nodes.forEach(n => {
            if (n.config && n.config.routes) {
                n.config.routes = n.config.routes.filter(r => r.proto !== 'rip' && r.proto !== 'ospf');
            }
        });

        const inSameSubnet = (ipA, ipB, mask) => {
            if (!ipA || !ipB || !mask || ipA === 'unassigned' || ipB === 'unassigned') return false;
            const parseIP = (ip) => ip.split('.').map(Number);
            const a = parseIP(ipA), b = parseIP(ipB), m = parseIP(mask);
            if (a.length !== 4 || b.length !== 4 || m.length !== 4) return false;
            for (let i = 0; i < 4; i++) {
                if ((a[i] & m[i]) !== (b[i] & m[i])) return false;
            }
            return true;
        };

        const getSubnet = (ip, mask) => {
            if (!ip || !mask || ip === 'unassigned' || mask === 'unassigned') return null;
            const a = ip.split('.').map(Number);
            const m = mask.split('.').map(Number);
            return a.map((val, idx) => val & m[idx]).join('.');
        };

        for (let round = 0; round < 5; round++) {
            this.nodes.forEach(router => {
                if (router.type !== 'router' || !router.config?.routing?.rip) return;
                
                const ripCfg = router.config.routing.rip;
                const connectedSubnets = [];
                Object.keys(router.config.interfaces).forEach(iface => {
                    const i = router.config.interfaces[iface];
                    if (i.status === 'up' && i.ip !== 'unassigned') {
                        const sub = getSubnet(i.ip, i.mask);
                        if (sub) connectedSubnets.push({ dest: sub, mask: i.mask, nextHop: '0.0.0.0', metric: 0, proto: 'connected', via: 'Direct' });
                    }
                });

                ripCfg.networks.forEach(netPrefix => {
                    this.links.forEach(link => {
                        const neighbor = link.from === router ? link.to : (link.to === router ? link.from : null);
                        if (neighbor && neighbor.type === 'router' && neighbor.config?.routing?.rip) {
                            const localIface = link.from === router ? link.fromPort : link.toPort;
                            const localIP = router.config.interfaces[localIface]?.ip;
                            const localMask = router.config.interfaces[localIface]?.mask;
                            const neighborIface = link.from === router ? link.toPort : link.fromPort;
                            const neighborIP = neighbor.config.interfaces[neighborIface]?.ip;

                            if (localIP && neighborIP && inSameSubnet(localIP, neighborIP, localMask)) {
                                const localRoutes = [
                                    ...connectedSubnets,
                                    ...router.config.routes
                                ];
                                localRoutes.forEach(r => {
                                    if (r.nextHop === neighborIP) return;

                                    const nextHopIP = localIP;
                                    const metric = (r.metric !== undefined ? r.metric : 0) + 1;
                                    if (metric >= 16) return;

                                    const existing = neighbor.config.routes.find(nr => nr.dest === r.dest && nr.mask === r.mask);
                                    if (!existing) {
                                        neighbor.config.routes.push({
                                            dest: r.dest,
                                            mask: r.mask,
                                            nextHop: nextHopIP,
                                            metric: metric,
                                            proto: 'rip',
                                            via: router.label
                                        });
                                    } else if (existing.proto === 'rip' && metric < existing.metric) {
                                        existing.metric = metric;
                                        existing.nextHop = nextHopIP;
                                        existing.via = router.label;
                                    }
                                });
                            }
                        }
                    });
                });
            });
        }

        this.nodes.forEach(router => {
            if (router.type !== 'router' || !router.config?.routing?.ospf) return;

            const dist = {};
            const prev = {};
            const nextHopRouter = {};
            const q = [];

            this.nodes.forEach(n => {
                if (n.type === 'router' && n.config?.routing?.ospf) {
                    dist[n.id] = Infinity;
                    prev[n.id] = null;
                    q.push(n);
                }
            });

            dist[router.id] = 0;

            while (q.length > 0) {
                q.sort((a, b) => dist[a.id] - dist[b.id]);
                const u = q.shift();
                if (dist[u.id] === Infinity) break;

                this.links.forEach(link => {
                    const v = link.from === u ? link.to : (link.to === u ? link.from : null);
                    if (v && v.type === 'router' && v.config?.routing?.ospf && q.includes(v)) {
                        const edgeCost = 10;
                        const alt = dist[u.id] + edgeCost;
                        if (alt < dist[v.id]) {
                            dist[v.id] = alt;
                            prev[v.id] = u;
                            if (u === router) {
                                nextHopRouter[v.id] = v;
                            } else {
                                nextHopRouter[v.id] = nextHopRouter[u.id];
                            }
                        }
                    }
                });
            }

            Object.keys(dist).forEach(targetId => {
                const targetRouter = this.nodes.find(n => n.id == targetId);
                if (!targetRouter || targetRouter === router || dist[targetId] === Infinity) return;

                Object.keys(targetRouter.config.interfaces).forEach(iface => {
                    const i = targetRouter.config.interfaces[iface];
                    if (i.status === 'up' && i.ip !== 'unassigned') {
                        const sub = getSubnet(i.ip, i.mask);
                        if (!sub) return;

                        const exists = router.config.routes.some(r => r.dest === sub && r.mask === i.mask && r.proto !== 'ospf');
                        if (exists) return;

                        const nextRouter = nextHopRouter[targetId];
                        let nextHopIP = '0.0.0.0';
                        if (nextRouter) {
                            this.links.forEach(link => {
                                if ((link.from === router && link.to === nextRouter) || (link.to === router && link.from === nextRouter)) {
                                    const nextIface = link.from === nextRouter ? link.fromPort : link.toPort;
                                    nextHopIP = nextRouter.config.interfaces[nextIface]?.ip || '0.0.0.0';
                                }
                            });
                        }

                        router.config.routes.push({
                            dest: sub,
                            mask: i.mask,
                            nextHop: nextHopIP,
                            metric: dist[targetId],
                            proto: 'ospf',
                            via: nextRouter ? nextRouter.label : 'Direct'
                        });
                    }
                });
            });
        });
    }

    tracePath(srcNode, targetIp) {
        const inSameSubnet = (ipA, ipB, mask) => {
            if (!ipA || !ipB || !mask || ipA === 'unassigned' || ipB === 'unassigned') return false;
            const parseIP = (ip) => ip.split('.').map(Number);
            const a = parseIP(ipA), b = parseIP(ipB), m = parseIP(mask);
            if (a.length !== 4 || b.length !== 4 || m.length !== 4) return false;
            for (let i = 0; i < 4; i++) {
                if ((a[i] & m[i]) !== (b[i] & m[i])) return false;
            }
            return true;
        };

        const getSubnet = (ip, mask) => {
            if (!ip || !mask || ip === 'unassigned' || mask === 'unassigned') return null;
            const a = ip.split('.').map(Number);
            const m = mask.split('.').map(Number);
            return a.map((val, idx) => val & m[idx]).join('.');
        };

        const l3Hops = [srcNode];
        let currentL3 = srcNode;
        const maxHops = 10;
        let hopsCount = 0;

        while (hopsCount++ < maxHops) {
            const targetNode = this.nodes.find(n => 
                n.ip === targetIp || 
                (n.config && Object.values(n.config.interfaces).some(i => i.ip === targetIp))
            );

            if (!targetNode) return null;

            let srcIp = currentL3.ip;
            let srcMask = currentL3.config?.interfaces?.['eth0']?.mask || '255.255.255.0';
            if (currentL3.type === 'router') {
                const activeIf = Object.keys(currentL3.config.interfaces).find(k => currentL3.config.interfaces[k].ip !== 'unassigned');
                srcIp = currentL3.config.interfaces[activeIf]?.ip;
                srcMask = currentL3.config.interfaces[activeIf]?.mask;
            }

            if (inSameSubnet(srcIp, targetIp, srcMask)) {
                l3Hops.push(targetNode);
                break;
            }

            let nextHopIP = null;
            if (currentL3.type === 'router') {
                const route = currentL3.config.routes.find(r => {
                    const sub = getSubnet(targetIp, r.mask);
                    return sub === r.dest;
                });
                if (route) {
                    nextHopIP = route.nextHop;
                } else {
                    nextHopIP = currentL3.config.gateway;
                }
            } else {
                nextHopIP = currentL3.config.gateway;
            }

            if (!nextHopIP || nextHopIP === '0.0.0.0' || nextHopIP === 'unassigned') {
                return null;
            }

            const nextRouter = this.nodes.find(n => 
                n.type === 'router' && 
                Object.values(n.config.interfaces).some(i => i.ip === nextHopIP)
            );

            if (!nextRouter || nextRouter === currentL3) {
                return null;
            }

            currentL3 = nextRouter;
            l3Hops.push(currentL3);
        }

        const fullPhysicalPath = [];
        for (let i = 0; i < l3Hops.length - 1; i++) {
            const startNode = l3Hops[i];
            const endNode = l3Hops[i + 1];

            const pathL2 = this.findL2Path(startNode, endNode);
            if (!pathL2) return null;

            if (i > 0) {
                fullPhysicalPath.push(...pathL2.slice(1));
            } else {
                fullPhysicalPath.push(...pathL2);
            }
        }

        return fullPhysicalPath;
    }

    findL2Path(start, end) {
        const queue = [[start]];
        const visited = new Set([start.id]);

        while (queue.length > 0) {
            const path = queue.shift();
            const curr = path[path.length - 1];

            if (curr === end) return path;

            this.links.forEach(link => {
                const neighbor = link.from === curr ? link.to : (link.to === curr ? link.from : null);
                if (neighbor && !visited.has(neighbor.id)) {
                    visited.add(neighbor.id);
                    queue.push([...path, neighbor]);
                }
            });
        }
        return null;
    }

    animatePathPackets(path, isSuccess = true, protocol = 'ICMP', callback = null) {
        if (!path || path.length < 2) {
            if (callback) callback();
            return;
        }

        let currentStep = 0;

        const runNextStep = () => {
            if (currentStep >= path.length - 1) {
                if (callback) callback();
                return;
            }

            const from = path[currentStep];
            const to = path[currentStep + 1];
            currentStep++;

            this.animatePacketStep(from, to, (currentStep === path.length - 1) ? isSuccess : true, protocol, () => {
                runNextStep();
            });
        };

        runNextStep();
    }

    animatePacketStep(from, to, isSuccess, protocol, onComplete) {
        const p = document.createElement('div');
        p.className = 'sim-packet';

        let color = '#f59e0b';
        let label = 'ARP';

        if (protocol === 'ICMP') { color = isSuccess ? '#10b981' : '#ef4444'; label = 'ICMP'; }
        if (protocol === 'TCP') { color = '#3b82f6'; label = 'TCP'; }
        if (protocol === 'UDP') { color = '#8b5cf6'; label = 'UDP'; }
        if (protocol === 'DNS') { color = '#14b8a6'; label = 'DNS'; }

        p.style.cssText = `
            width: 14px; 
            height: 14px; 
            background: ${color}; 
            border-radius: 3px; 
            position: absolute; 
            z-index: 1000; 
            box-shadow: 0 0 15px ${color}; 
            border: 1.5px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            font-weight: 900;
            color: white;
            pointer-events: none;
        `;
        p.textContent = label;
        const layer = document.getElementById('packet-layer');
        if (layer) layer.appendChild(p);

        const start = { x: from.x + 30, y: from.y + 30 };
        const end = { x: to.x + 30, y: to.y + 30 };
        let progress = 0;

        const move = () => {
            progress += 0.04;
            p.style.left = (start.x + (end.x - start.x) * progress) + 'px';
            p.style.top = (start.y + (end.y - start.y) * progress) + 'px';

            if (progress < 1) {
                requestAnimationFrame(move);
            } else {
                p.remove();
                if (onComplete) onComplete();
            }
        };
        move();
    }

    init() {
        this.container.innerHTML = `
            <div class="topology-workspace">
                <aside class="topology-toolbox">
                    <div class="toolbox-tabs">
                        <button class="tab-btn active" data-tab="devices" title="Network Devices">💻</button>
                        <button class="tab-btn" data-tab="cables" title="Connections">⚡</button>
                        <button class="tab-btn" data-tab="tools" title="Common Tools">🛠️</button>
                    </div>
                    <div class="toolbox-content">
                        <div class="tool-category active" id="cat-devices">
                            <div class="tool-item" draggable="true" data-type="router" title="Router">🌐</div>
                            <div class="tool-item" draggable="true" data-type="switch" title="L2 Switch">📟</div>
                            <div class="tool-item" draggable="true" data-type="hub" title="Hub">🧱</div>
                            <div class="tool-item" draggable="true" data-type="pc" title="PC">🖥️</div>
                            <div class="tool-item" draggable="true" data-type="laptop" title="Laptop">💻</div>
                            <div class="tool-item" draggable="true" data-type="server" title="Server">🗄️</div>
                        </div>
                        <div class="tool-category" id="cat-cables">
                            <div class="tool-item cable-tool" data-cable="straight" title="Straight-Through">➖</div>
                            <div class="tool-item cable-tool" data-cable="cross" title="Cross-Over">〰️</div>
                            <div class="tool-item cable-tool" data-cable="fiber" title="Fiber Optic">✨</div>
                        </div>
                        <div class="tool-category" id="cat-tools">
                            <button id="btnSaveTopo" class="btn-sim" style="width:100%; margin-bottom:8px;">Save</button>
                            <button id="btnLoadTopo" class="btn-sim" style="width:100%; margin-bottom:8px;">Load</button>
                            <button id="btnClearTopo" class="btn-sim" style="width:100%; border-color:var(--danger); color:var(--danger);">Clear</button>
                        </div>
                    </div>
                </aside>
                <main class="topology-main" id="topology-canvas">
                    <div id="packet-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
                    <canvas id="topo-links" style="position:absolute; top:0; left:0; pointer-events:none;"></canvas>
                    <div id="hint-box" style="position:absolute; bottom:50px; right:20px; background:var(--glass); padding:12px 20px; border-radius:12px; border:1px solid var(--primary); color:var(--primary); font-weight:700; font-size:13px; display:none; z-index:1000; box-shadow:var(--shadow-md);"></div>
                    <div class="workspace-status">
                        <div class="status-left"><span class="status-dot"></span> TOPOLOGY ACTIVE: <span id="node-count">0</span> Devices | <span id="link-count">0</span> Links</div>
                        <div class="status-right" id="topo-last-event">Ready for design...</div>
                    </div>
                    <div id="device-props" class="device-props-panel" style="display:none;">
                        <div class="props-header">Device Properties <button onclick="this.parentElement.parentElement.style.display='none'">×</button></div>
                        <div id="props-body" class="props-body"></div>
                    </div>
                    <div class="scanlines"></div>
                </main>
            </div>
        `;

        this.canvas = document.getElementById('topo-links');
        this.ctx = this.canvas.getContext('2d');
        this.workspace = document.getElementById('topology-canvas');
        this.main = this.workspace; // Fix for undefined this.main
        this.packetLayer = document.getElementById('packet-layer');
        this.hintBox = document.getElementById('hint-box');

        // Ghost cable line for better UX
        this.ghostLine = { active: false, x1: 0, y1: 0, x2: 0, y2: 0 };

        this.setupEventListeners();
        this.resize();

        document.getElementById('btnSaveTopo').onclick = () => this.saveTopology();
        document.getElementById('btnLoadTopo').onclick = () => this.loadTopology();
        document.getElementById('btnClearTopo').onclick = () => this.clearTopology();

        // Auto-load previous session
        setTimeout(() => this.loadTopology(), 500);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeBound);
        window.addEventListener('mousedown', this.mousedownBound);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tool-category').forEach(c => c.classList.remove('active'));
                document.getElementById(`cat-${btn.dataset.tab}`).classList.add('active');
            };
        });

        document.querySelectorAll('.tool-item[draggable="true"]').forEach(item => {
            item.addEventListener('dragstart', (e) => e.dataTransfer.setData('type', e.target.dataset.type));
        });

        document.querySelectorAll('.cable-tool').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.cable-tool').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCable = btn.dataset.cable;
                this.isCabling = true;
                this.showHint(`Cabling Mode: Select ${this.cableStartNode ? 'destination' : 'source'} device.`);
            };
        });

        this.workspace.addEventListener('mousemove', (e) => {
            if (this.isCabling && this.cableStartNode) {
                const rect = this.workspace.getBoundingClientRect();
                this.ghostLine.active = true;
                this.ghostLine.x1 = this.cableStartNode.x + 30;
                this.ghostLine.y1 = this.cableStartNode.y + 30;
                this.ghostLine.x2 = e.clientX - rect.left;
                this.ghostLine.y2 = e.clientY - rect.top;
                this.render();
            }
        });

        this.workspace.addEventListener('mouseleave', () => {
            this.ghostLine.active = false;
            this.render();
        });

        this.workspace.addEventListener('dragover', (e) => e.preventDefault());
        this.workspace.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('type');
            const rect = this.workspace.getBoundingClientRect();
            this.addNode(type, e.clientX - rect.left - 30, e.clientY - rect.top - 30);
            this.validateTopology();
        });


    }
    resize() {
        if (!this.canvas || !this.workspace) return;
        const rect = this.workspace.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        if (this.render) this.render();
    }

    getNextAvailablePort(node) {
        if (!node || !node.config || !node.config.interfaces) return 'fa0/0';
        const usedPorts = this.links
            .filter(l => l.from === node || l.to === node)
            .map(l => l.from === node ? l.fromPort : l.toPort);

        const possible = ['fa0/0', 'fa0/1', 'fa1/0', 'fa1/1', 'gi0/0', 'gi0/1'];
        return possible.find(p => !usedPorts.includes(p)) || null;
    }

    validateTopology() {
        this.nodes.forEach(n => {
            if (n.el) n.el.classList.remove('error');
        });
        // Simplified validation: Check if any node is isolated
        this.nodes.forEach(n => {
            const isConnected = this.links.some(l => l.from === n || l.to === n);
            if (!isConnected && this.nodes.length > 1) {
                // n.el.classList.add('warning');
            }
        });
        if (this.updateStatus) this.updateStatus();
    }

    saveTopology() {
        const labId = document.getElementById('labSelect')?.value || 'practice';
        const data = {
            nodes: this.nodes.map(n => ({ ...n, el: null })),
            links: this.links.map(l => ({
                fromId: l.from.id,
                toId: l.to.id,
                type: l.type,
                fromPort: l.fromPort,
                toPort: l.toPort
            }))
        };
        localStorage.setItem(`vlab_topology_${labId}`, JSON.stringify(data));
        syncTopology(labId, data);
        this.updateStatus("Topology Saved (Cloud & Local)");
    }

    loadTopology() {
        const labId = document.getElementById('labSelect')?.value || 'practice';
        const raw = localStorage.getItem(`vlab_topology_${labId}`);
        if (!raw) {
            this.updateStatus("No saved topology found for this lab");
            return;
        }
        this.clearTopology();
        const data = JSON.parse(raw);

        data.nodes.forEach(n => this.addNode(n.type, n.x, n.y, n.label, n.config));
        data.links.forEach(l => {
            const from = this.nodes.find(n => n.id === l.fromId);
            const to = this.nodes.find(n => n.id === l.toId);
            if (from && to) {
                this.links.push({ from, to, type: l.type, fromPort: l.fromPort, toPort: l.toPort });
            }
        });
        this.validateTopology();
        this.updateStatus("Topology Restored");
    }

    clearTopology() {
        this.nodes = [];
        this.links = [];
        this.workspace.querySelectorAll('.device-node').forEach(n => n.remove());
        this.updateStatus("Workspace Cleared");
    }

    addNode(type, x, y, label = null, config = null) {
        const iconMap = {
            'router': '🌐',
            'switch': '📟',
            'hub': '🧱',
            'pc': '🖥️',
            'laptop': '💻',
            'server': '🗄️'
        };
        const node = {
            id: Date.now(),
            type, x, y,
            icon: iconMap[type] || '📟',
            label: label || `${type.toUpperCase()}_${this.nodes.length + 1}`,
            config: config || { 
                hostname: label || `${type.toUpperCase()}_${this.nodes.length + 1}`,
                interfaces: (type === 'router' || type === 'switch') ? {
                    'fa0/0': { ip: 'unassigned', mask: 'unassigned', status: 'down', desc: '' },
                    'fa0/1': { ip: 'unassigned', mask: 'unassigned', status: 'down', desc: '' }
                } : {
                    'eth0': { ip: 'unassigned', mask: 'unassigned', status: 'up', desc: '' }
                },
                routes: [],
                vlans: { '1': { name: 'default', ports: [] } }
            }
        };
        this.nodes.push(node);
        this.addNodeElement(node);
        this.updateStatus(`Added ${type.toUpperCase()}`);
        if (this.render) this.render();
    }

    updateStatus(msg) {
        if (document.getElementById('node-count')) {
            document.getElementById('node-count').textContent = this.nodes.length;
            document.getElementById('link-count').textContent = this.links.length;
            if (msg) {
                document.getElementById('topo-last-event').textContent = msg;
                this.showHint(msg);
            }
        }
    }

    showHint(msg) {
        if (!this.hintBox) return;
        this.hintBox.textContent = msg;
        this.hintBox.style.display = 'block';
        this.hintBox.style.animation = 'none';
        this.hintBox.offsetHeight; // trigger reflow
        this.hintBox.style.animation = 'fadeInUp 0.3s ease-out';
        clearTimeout(this.hintTimeout);
        this.hintTimeout = setTimeout(() => {
            this.hintBox.style.display = 'none';
        }, 4000);
    }

    addNodeElement(node) {
        const div = document.createElement('div');
        div.className = 'device-node';
        div.style.left = node.x + 'px';
        div.style.top = node.y + 'px';
        div.style.userSelect = 'none';
        div.innerHTML = `<div class="d-icon">${node.icon}</div><div class="d-label">${node.label}</div>`;

        div.addEventListener('mouseenter', (e) => {
            const tip = document.getElementById('topoTooltip');
            if (tip) {
                tip.style.display = 'block';
                let content = `<strong>${node.label}</strong><br><small>${node.type.toUpperCase()} ${node.model || ''}</small>`;
                if (node.config?.interfaces) {
                    Object.keys(node.config.interfaces).forEach(iface => {
                        const i = node.config.interfaces[iface];
                        if (i.ip && i.ip !== 'unassigned') content += `<br><span style="color:#10b981; font-size:10px;">• ${iface}: ${i.ip}</span>`;
                    });
                }
                tip.innerHTML = content;
            }
        });

        div.addEventListener('mousemove', (e) => {
            const tip = document.getElementById('topoTooltip');
            if (tip) {
                tip.style.left = (e.clientX + 15) + 'px';
                tip.style.top = (e.clientY + 15) + 'px';
            }
        });

        div.addEventListener('mouseleave', () => {
            const tip = document.getElementById('topoTooltip');
            if (tip) tip.style.display = 'none';
        });

        let moved = false;
        div.addEventListener('mousedown', (e) => {
            moved = false;
            if (this.isCabling) {
                if (!this.cableStartNode) {
                    this.cableStartNode = node;
                    div.classList.add('cabling-source');
                    this.showHint(`Cable started at ${node.label}. Select destination.`);
                } else if (this.cableStartNode === node) {
                    this.cableStartNode = null;
                    div.classList.remove('cabling-source');
                    this.showHint(`Cabling cancelled.`);
                    this.ghostLine.active = false;
                    this.render();
                } else {
                    const fromPort = this.getNextAvailablePort(this.cableStartNode);
                    const toPort = this.getNextAvailablePort(node);

                    if (fromPort && toPort) {
                        this.links.push({ from: this.cableStartNode, to: node, type: this.selectedCable, fromPort, toPort });
                        this.showHint(`Connected ${this.cableStartNode.label} to ${node.label}`);
                        this.validateTopology();
                    } else {
                        this.showHint(`Connection failed: No available ports.`);
                    }

                    this.cableStartNode.el.classList.remove('cabling-source');
                    this.cableStartNode = null;
                    this.ghostLine.active = false;
                    this.render();
                }
            } else {
                this.startDrag(e, node, div, () => moved = true);
            }
        });

        div.addEventListener('mouseup', (e) => {
            if (e.button === 0 && !moved && !this.isCabling) {
                // Close context menu if open
                const menu = document.getElementById('contextMenu');
                if (menu) menu.style.display = 'none';
                this.showProperties(node);
            }
        });

        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close properties panel if open
            const panel = document.getElementById('device-props');
            if (panel) panel.style.display = 'none';

            const menu = document.getElementById('contextMenu');
            if (menu) {
                menu.style.display = 'block';
                menu.style.left = e.clientX + 'px';
                menu.style.top = e.clientY + 'px';
            }
            this.currentContextNode = node;
        });

        div.addEventListener('mouseenter', (e) => {
            const tooltip = document.getElementById('topoTooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `
                    <div style="font-weight:800; color:var(--primary); margin-bottom:4px;">${node.label}</div>
                    <div style="font-size:11px; opacity:0.8;">Type: ${node.type.toUpperCase()}</div>
                    <div style="font-size:11px; opacity:0.8;">IP: ${node.config?.ip || 'Unconfigured'}</div>
                    <div style="font-size:11px; opacity:0.8;">Status: <span style="color:var(--success)">Operational</span></div>
                `;
            }
            this.updateTooltipPos(e);
        });

        div.addEventListener('mousemove', (e) => this.updateTooltipPos(e));

        div.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('topoTooltip');
            if (tooltip) tooltip.style.display = 'none';
        });

        this.main.appendChild(div);
        node.el = div;
    }

    deleteNode() {
        if (!this.currentContextNode) return;
        const node = this.currentContextNode;
        this.links = this.links.filter(l => l.from !== node && l.to !== node);
        this.nodes = this.nodes.filter(n => n.id !== node.id);
        if (node.el) node.el.remove();
        const menu = document.getElementById('contextMenu');
        if (menu) menu.style.display = 'none';
        this.validateTopology();
        this.updateStatus(`Deleted ${node.label}`);
        if (this.render) this.render();
    }

    deleteLinks() {
        if (!this.currentContextNode) return;
        const node = this.currentContextNode;
        this.links = this.links.filter(l => l.from !== node && l.to !== node);
        const menu = document.getElementById('contextMenu');
        if (menu) menu.style.display = 'none';
        this.validateTopology();
        this.updateStatus(`Cleared links for ${node.label}`);
        if (this.render) this.render();
    }

    updateTooltipPos(e) {
        const tooltip = document.getElementById('topoTooltip');
        if (tooltip) {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        }
    }

    showProperties(node) {
        const panel = document.getElementById('device-props');
        const body = document.getElementById('props-body');
        if (!panel || !body) return;
        panel.style.display = 'block';

        const uptime = Math.floor(Math.random() * 500) + "m " + Math.floor(Math.random() * 60) + "s";
        const mac = node.id.toString(16).padStart(12, '0').match(/.{2}/g).join(':').toUpperCase();

        body.innerHTML = `
            <div class="prop-row"><span>Type</span><b>${node.type.toUpperCase()}</b></div>
            <div class="prop-row"><span>Label</span><b>${node.label}</b></div>
            <div class="prop-row"><span>Hardware ID</span><b>${mac}</b></div>
            <div class="prop-row"><span>System Uptime</span><b>${uptime}</b></div>
            <div class="prop-row"><span>Primary IP</span><b>${node.config?.ip || 'Unset'}</b></div>
            <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
            <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">OPERATIONAL INTERFACES</div>
            ${Object.keys(node.config?.interfaces || {}).map(iface => `
                <div class="prop-row"><span>${iface}</span><b style="color:var(--success)">UP</b></div>
            `).join('')}
            <button id="btnOpenCLI" class="btn-sim primary" style="width:100%; margin-top:15px;">Open CLI Terminal</button>
        `;

        document.getElementById('btnOpenCLI').onclick = () => {
            this.openConfig(node);
            panel.style.display = 'none';
        };
    }

    startDrag(e, node, el, onMove) {
        this.isDragging = true;
        el.classList.add('dragging');
        this.dragNode = { node, el, startX: e.clientX, startY: e.clientY, initialX: node.x, initialY: node.y };

        const move = (me) => {
            if (Math.abs(me.clientX - this.dragNode.startX) > 5 || Math.abs(me.clientY - this.dragNode.startY) > 5) {
                onMove();
            }
            const dx = me.clientX - this.dragNode.startX;
            const dy = me.clientY - this.dragNode.startY;
            node.x = this.dragNode.initialX + dx;
            node.y = this.dragNode.initialY + dy;
            el.style.left = node.x + 'px';
            el.style.top = node.y + 'px';
        };

        const stop = () => {
            el.classList.remove('dragging');
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            setTimeout(() => this.isDragging = false, 50);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    }

    runPingTest() {
        if (this.links.length === 0) {
            alert("Connect nodes with cables first!");
            return;
        }
        this.links.forEach(link => {
            this.animatePacket(link.from, link.to);
        });
    }

    animatePacket(from, to, isSuccess = false, protocol = 'ICMP', visited = new Set()) {
        const pId = `${from.id}-${to.id}-${protocol}`;
        if (visited.has(pId)) return;
        visited.add(pId);

        const p = document.createElement('div');
        p.className = 'sim-packet';

        // Protocol-specific styling
        let color = '#f59e0b'; // Default (Warning/ARP)
        let label = 'ARP';

        if (protocol === 'ICMP') { color = isSuccess ? '#10b981' : '#ef4444'; label = 'ICMP'; }
        if (protocol === 'TCP') { color = '#3b82f6'; label = 'TCP'; }
        if (protocol === 'UDP') { color = '#8b5cf6'; label = 'UDP'; }
        if (protocol === 'HTTP') { color = '#ec4899'; label = 'HTTP'; }
        if (protocol === 'DNS') { color = '#14b8a6'; label = 'DNS'; }

        p.style.cssText = `
            width: 14px; 
            height: 14px; 
            background: ${color}; 
            border-radius: 3px; 
            position: absolute; 
            z-index: 1000; 
            box-shadow: 0 0 15px ${color}; 
            border: 1.5px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            font-weight: 900;
            color: white;
            pointer-events: none;
        `;
        p.textContent = label;
        const layer = document.getElementById('packet-layer');
        if (layer) layer.appendChild(p);

        const start = { x: from.x + 30, y: from.y + 30 };
        const end = { x: to.x + 30, y: to.y + 30 };
        let progress = 0;

        const move = () => {
            progress += 0.02; // Slower, more realistic speed
            p.style.left = (start.x + (end.x - start.x) * progress) + 'px';
            p.style.top = (start.y + (end.y - start.y) * progress) + 'px';

            if (progress < 1) {
                requestAnimationFrame(move);
            } else {
                p.remove();
                if (isSuccess && progress >= 1) {
                    to.el.style.transform = 'scale(1.2)';
                    to.el.style.boxShadow = `0 0 20px ${color}`;
                    setTimeout(() => {
                        to.el.style.transform = 'scale(1)';
                        to.el.style.boxShadow = 'none';
                    }, 200);
                }

                // Propagation Logic: Broadcast domains and Protocol rules
                if (to.type === 'hub' || to.type === 'switch') {
                    this.links.forEach(link => {
                        const next = link.from === to ? link.to : (link.to === to ? link.from : null);
                        if (next && next !== from) {
                            // Switches learn MACs, but in our simplified model they broadcast ARP/Unknowns
                            const nextProto = (protocol === 'ARP') ? 'ARP' : protocol;
            this.animatePacket(to, next, isSuccess, nextProto, visited);
                        }
                    });
                } else if (to.type === 'router' && protocol !== 'ARP') {
                    // Routers forward based on routing table (simplified to direct neighbors for now)
                    // If target node is in routing table, forward there
                }
            }
        };
        move();
    }

    openConfig(node) {
        // Close other panels first to prevent overlap
        const menu = document.getElementById('contextMenu');
        if (menu) menu.style.display = 'none';
        
        const modal = document.getElementById('configModal');
        if (!modal) return;
        
        // Clear terminal history from previous nodes
        const area = document.getElementById('terminalArea');
        if (area) {
            const inputWrap = area.querySelector('.terminal-input-wrap');
            area.innerHTML = '';
            if (inputWrap) area.appendChild(inputWrap);
            
            // Add a welcome message if this is the first time
            const welcome = document.createElement('div');
            welcome.className = 'terminal-line';
            welcome.style.color = '#94a3b8';
            welcome.style.marginBottom = '15px';
            welcome.innerHTML = `NetForge IOS Software (NF-i686), Version 15.1(4)M4<br>Technical Support: http://netforge.mit.edu/support<br>Ready for ${node.label} configuration.`;
            area.insertBefore(welcome, inputWrap);
        }

        modal.style.display = 'flex';
        const title = document.getElementById('modalTitle');
        if (title) title.textContent = `NF-IOS CLI: ${node.label}`;
        this.currentConfigNode = node;
        this.updateTerminal(node);

        // Ensure focus with small delay for modal transition
        setTimeout(() => {
            const input = document.getElementById('terminalInput');
            if (input) input.focus();
        }, 100);
    }

    updateTerminal(node) {
        const prompt = document.getElementById('prompt');
        const input = document.getElementById('terminalInput');
        const area = document.getElementById('terminalArea');

        if (!prompt || !input || !area) return;

        node.cliMode = node.cliMode || 'user';
        node.commandHistory = node.commandHistory || [];
        node.historyIndex = -1;

        const updatePrompt = () => {
            const host = node.config?.hostname || node.label || node.type.toUpperCase();
            let suffix = '>';
            if (node.cliMode === 'privileged') suffix = '#';
            if (node.cliMode === 'config') suffix = '(config)#';
            if (node.cliMode === 'config-if') suffix = `(config-if)#`;
            if (node.cliMode === 'config-vlan') suffix = `(config-vlan)#`;
            prompt.textContent = `${host}${suffix}`;
        };

        updatePrompt();

        // Show Banner MOTD if exists
        if (node.config?.motd) {
            const bannerDiv = document.createElement('div');
            bannerDiv.className = 'terminal-line';
            bannerDiv.style.color = '#fbbf24';
            bannerDiv.style.fontWeight = 'bold';
            bannerDiv.style.padding = '10px 0';
            bannerDiv.textContent = node.config.motd;
            area.insertBefore(bannerDiv, area.querySelector('.terminal-input-wrap'));
        }

        input.focus();
        area.onclick = () => input.focus();

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    node.commandHistory.unshift(cmd);
                    if (node.commandHistory.length > 50) node.commandHistory.pop();
                }
                node.historyIndex = -1;
                this.processCommand(node, cmd);
                input.value = '';
                area.scrollTop = area.scrollHeight;
                updatePrompt();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion(node, input);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (node.historyIndex < node.commandHistory.length - 1) {
                    node.historyIndex++;
                    input.value = node.commandHistory[node.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (node.historyIndex > 0) {
                    node.historyIndex--;
                    input.value = node.commandHistory[node.historyIndex];
                } else {
                    node.historyIndex = -1;
                    input.value = '';
                }
            }
        };
    }

    handleTabCompletion(node, input) {
        const val = input.value.toLowerCase().trim();
        const args = val.split(/\s+/);
        const base = args[0];
        
        const commands = {
            'user': ['enable', 'ping', 'show', 'exit', 'help', 'traceroute', 'clear'],
            'privileged': ['configure terminal', 'disable', 'ping', 'show', 'write', 'copy', 'erase', 'reload', 'clock', 'terminal', 'exit', 'traceroute', 'debug', 'undebug'],
            'config': ['hostname', 'interface', 'ip route', 'router', 'vlan', 'banner', 'line', 'no', 'exit', 'end', 'do', 'service', 'access-list', 'ip default-gateway'],
            'config-if': ['ip address', 'no shutdown', 'shutdown', 'switchport', 'description', 'duplex', 'speed', 'exit', 'end', 'vlan', 'channel-group'],
            'config-router': ['network', 'neighbor', 'passive-interface', 'redistribute', 'exit', 'end']
        };

        const currentPool = commands[node.cliMode] || [];
        const matches = currentPool.filter(c => c.startsWith(val));
        
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            // Logic for multiple matches could go here (e.g. show all)
        }
    }

    processCommand(node, cmd) {
        const area = document.getElementById('terminalArea');
        node.config = node.config || {
            hostname: node.label,
            interfaces: {
                'fa0/0': { ip: 'unassigned', mask: 'unassigned', status: 'down', desc: '' },
                'fa0/1': { ip: 'unassigned', mask: 'unassigned', status: 'down', desc: '' }
            },
            routes: [],
            vlans: { '1': { name: 'default', ports: ['fa0/1'] } }
        };

        const addLine = (txt, type = '') => {
            const div = document.createElement('div');
            div.className = 'terminal-line';
            div.style.whiteSpace = 'pre-wrap';
            div.style.marginBottom = '8px';
            const currentPrompt = document.getElementById('prompt').textContent;

            if (type === 'out') {
                div.style.color = '#94a3b8';
                div.textContent = txt;
            } else {
                div.style.color = '#10b981';
                div.textContent = `${currentPrompt} ${cmd}${txt ? '\n' + txt : ''}`;
            }
            area.insertBefore(div, area.querySelector('.terminal-input-wrap'));
            area.scrollTop = area.scrollHeight;
        };

        const logToWorkspace = (msg, type = 'info') => {
            const log = document.getElementById('workspaceLog');
            if (!log) return;
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span> ${msg}`;
            log.prepend(entry);
            if (log.children.length > 5) log.lastElementChild.remove();
        };

        if (!cmd) {
            addLine("");
            return;
        }

        const args = cmd.toLowerCase().split(/\s+/);
        const baseCmd = args[0];

        // Handle 'do' globally
        let targetCmd = cmd;
        let targetBaseCmd = baseCmd;
        let targetArgs = args;
        if (baseCmd === 'do') {
            addLine(""); // Log the 'do' command itself
            targetCmd = cmd.split(/\s+/).slice(1).join(' ');
            targetArgs = targetCmd.toLowerCase().split(/\s+/);
            targetBaseCmd = targetArgs[0];
            if (!targetCmd) return;
        }

        // Global Commands
        if (targetBaseCmd === 'clear' || targetBaseCmd === 'cls') {
            area.querySelectorAll('.terminal-line').forEach(l => l.remove());
            return;
        }

        if (targetBaseCmd === 'reload') {
            addLine("System reloading...", "out");
            setTimeout(() => location.reload(), 1000);
            return;
        }

        if (targetBaseCmd === 'write' || targetBaseCmd === 'wr' || (targetBaseCmd === 'copy' && targetArgs[1] === 'running-config')) {
            addLine("Building configuration...\n[OK]", "out");
            if (this.saveTopology) this.saveTopology();
            return;
        }

        const fullCmd = targetArgs.join(' ');
        const isNo = baseCmd === 'no';
        let effectiveArgs = targetArgs;
        let effectiveBase = targetBaseCmd;

        if (isNo) {
            effectiveArgs = targetArgs.slice(1);
            effectiveBase = effectiveArgs[0];
        }

        // Mode-specific Logic
        if (effectiveBase === 'enable' || effectiveBase === 'en') {
            node.cliMode = 'privileged';
            addLine("");
        } else if (targetBaseCmd === 'disable') {
            node.cliMode = 'user';
            addLine("");
        } else if (targetBaseCmd.startsWith('conf') && targetArgs[1] && targetArgs[1].startsWith('t')) {
            if (node.cliMode === 'privileged' || node.cliMode === 'config') {
                node.cliMode = 'config';
                addLine("Enter configuration commands, one per line. End with CNTL/Z.");
            } else addLine("% Invalid input detected at '^' marker.", 'out');
        } else if (targetBaseCmd === 'exit') {
            if (node.cliMode === 'config-if') node.cliMode = 'config';
            else if (node.cliMode === 'config-vlan') node.cliMode = 'config';
            else if (node.cliMode === 'config-router') node.cliMode = 'config';
            else if (node.cliMode === 'config') node.cliMode = 'privileged';
            else if (node.cliMode === 'privileged') node.cliMode = 'user';
            addLine("");
        } else if (targetBaseCmd === 'end') {
            node.cliMode = 'privileged';
            addLine("");
        }

        // Show Commands
        else if (targetBaseCmd === 'show' || targetBaseCmd === 'sh') {
            const sub = targetArgs[1];
            if (sub === 'running-config' || sub === 'run') {
                let run = `Building configuration...\n\nCurrent configuration :\n!\nversion 15.1\nhostname ${node.config.hostname}\n!`;
                Object.keys(node.config.interfaces).forEach(iface => {
                    const i = node.config.interfaces[iface];
                    run += `\ninterface ${iface}\n ip address ${i.ip} ${i.mask}\n description ${i.desc || 'none'}\n ${i.status === 'up' ? '' : 'shutdown'}\n!`;
                });
                if (node.config.gateway) run += `\nip default-gateway ${node.config.gateway}\n!`;
                node.config.routes.forEach(r => run += `\nip route ${r.dest} ${r.mask} ${r.nextHop}\n`);
                run += `\n!\nend`;
                addLine(run, 'out');
            } else if (sub === 'ip') {
                const sub2 = targetArgs[2];
                if (sub2 === 'interface' && targetArgs[3] && targetArgs[3].startsWith('br')) {
                    let out = `Interface             IP-Address      OK? Method Status                Protocol`;
                    Object.keys(node.config.interfaces).forEach(iface => {
                        const i = node.config.interfaces[iface];
                        out += `\n${iface.padEnd(21)} ${i.ip.padEnd(15)} YES manual ${i.status.padEnd(21)} ${i.status}`;
                    });
                    addLine(out, 'out');
                } else if (sub2 === 'route') {
                    let out = `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP\n       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area\n\nGateway of last resort is ${node.config.gateway || 'not set'}\n\n`;
                    node.config.routes.forEach(r => {
                        const prefix = r.proto === 'rip' ? 'R' : (r.proto === 'ospf' ? 'O' : 'S');
                        const metricStr = r.proto === 'rip' ? `[120/${r.metric}]` : (r.proto === 'ospf' ? `[110/${r.metric}]` : `[1/0]`);
                        out += `${prefix}    ${r.dest}/24 ${metricStr} via ${r.nextHop}\n`;
                    });
                    Object.keys(node.config.interfaces).forEach(iface => {
                        const i = node.config.interfaces[iface];
                        if (i.ip !== 'unassigned') out += `C    ${i.ip.split('.').slice(0, 3).join('.')}.0/24 is directly connected, ${iface}\nL    ${i.ip}/32 is directly connected, ${iface}\n`;
                    });
                    addLine(out, 'out');
                } else if (sub2 === 'arp') {
                    addLine("Protocol  Address          Age (min)  Hardware Addr   Type   Interface\nInternet  192.168.1.1             -   000c.294f.8a33  ARPA   FastEthernet0/0", "out");
                }
            } else if (sub === 'mac' && targetArgs[2] === 'address-table') {
                let out = `          Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       ----        -----\n`;
                this.links.filter(l => l.from === node || l.to === node).forEach(l => {
                    const other = l.from === node ? l.to : l.from;
                    const port = l.from === node ? l.fromPort : l.toPort;
                    const fakeMac = other.id.toString(16).padStart(12, '0').match(/.{4}/g).join('.');
                    out += `   1    ${fakeMac}    DYNAMIC     ${port}\n`;
                });
                addLine(out, 'out');
            } else if (sub === 'vlan' || sub === 'vlan-switch') {
                let out = `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Fa0/1`;
                Object.keys(node.config.vlans || {}).forEach(vid => {
                    if (vid !== '1') out += `\n${vid.padEnd(4)} ${node.config.vlans[vid].name.padEnd(32)} active    ${node.config.vlans[vid].ports.join(', ')}`;
                });
                addLine(out, 'out');
            } else if (sub === 'version' || sub === 'ver') {
                addLine("NetForge IOS Software, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)\nTechnical Support: http://netforge.mit.edu/support\nCopyright (c) 1986-2026 by NetForge Systems, Inc.", "out");
            } else if (sub === 'clock') {
                addLine(new Date().toString(), "out");
            } else if (sub === 'users') {
                addLine("    Line       User       Host(s)              Idle       Location\n*  0 con 0                idle                 00:00:00", "out");
            } else {
                addLine(`% Incomplete command.`, "out");
            }
        }
 
        // Configuration Commands
        else if (node.cliMode === 'config') {
            if (targetBaseCmd === 'hostname') {
                node.label = targetArgs[1].toUpperCase();
                node.config.hostname = node.label;
                if (node.el && node.el.querySelector('.d-label')) node.el.querySelector('.d-label').textContent = node.label;
                addLine("");
            } else if (targetBaseCmd === 'interface' || targetBaseCmd === 'int') {
                const iface = targetArgs[1];
                node.cliMode = 'config-if';
                node.currentIf = iface;
                node.config.interfaces[iface] = node.config.interfaces[iface] || { ip: 'unassigned', mask: 'unassigned', status: 'down', desc: '' };
                addLine("");
            } else if (targetBaseCmd === 'ip' && targetArgs[1] === 'route') {
                const route = { dest: targetArgs[2], mask: targetArgs[3], nextHop: targetArgs[4] };
                node.config.routes.push(route);
                this.computeTopologyRouting();
                addLine("");
            } else if (targetBaseCmd === 'ip' && targetArgs[1] === 'default-gateway') {
                node.config.gateway = targetArgs[2];
                this.computeTopologyRouting();
                addLine("");
            } else if (effectiveBase === 'vlan') {
                const vid = effectiveArgs[1];
                node.cliMode = 'config-vlan';
                node.currentVlan = vid;
                node.config.vlans[vid] = node.config.vlans[vid] || { name: `VLAN${vid}`, ports: [] };
                addLine("");
            } else if (effectiveBase === 'banner' && effectiveArgs[1] === 'motd') {
                const msg = targetCmd.split('#')[1] || "Welcome to NetForge Lab";
                node.config.motd = msg;
                addLine("");
            } else if (effectiveBase === 'router') {
                const protocol = effectiveArgs[1];
                if (['rip', 'ospf', 'bgp'].includes(protocol)) {
                    node.cliMode = `config-router`;
                    node.currentRouterProto = protocol;
                    node.config.routing = node.config.routing || {};
                    node.config.routing[protocol] = node.config.routing[protocol] || { networks: [], neighbors: [] };
                    addLine("");
                } else addLine("% Invalid routing protocol.", "out");
            } else {
                addLine("% Unrecognized command.", "out");
            }
        }
 
        // Router Config
        else if (node.cliMode === 'config-router') {
            if (targetBaseCmd === 'network') {
                const net = targetArgs[1];
                node.config.routing[node.currentRouterProto].networks.push(net);
                this.computeTopologyRouting();
                addLine("");
            } else if (targetBaseCmd === 'exit') {
                node.cliMode = 'config';
                addLine("");
            }
        }
 
        // Interface Config
        else if (node.cliMode === 'config-if') {
            const ifaceCmd = targetArgs.join(' ');
            if (ifaceCmd.includes('no shutdown') || ifaceCmd.includes('no shut')) {
                node.config.interfaces[node.currentIf].status = 'up';
                this.computeTopologyRouting();
                addLine(`%LINK-5-CHANGED: Interface ${node.currentIf}, changed state to up`, 'out');
            } else if (ifaceCmd.includes('shutdown') || ifaceCmd.includes('shut')) {
                node.config.interfaces[node.currentIf].status = 'down';
                this.computeTopologyRouting();
                addLine(`%LINK-5-CHANGED: Interface ${node.currentIf}, changed state to administratively down`, 'out');
            } else if (targetBaseCmd === 'ip' && targetArgs[1] === 'address') {
                const ip = targetArgs[2];
                const mask = targetArgs[3] || '255.255.255.0';
                node.ip = ip;
                node.config.interfaces[node.currentIf].ip = ip;
                node.config.interfaces[node.currentIf].mask = mask;
                this.computeTopologyRouting();
                addLine("");
            } else if (targetBaseCmd === 'switchport' || targetBaseCmd === 'sw') {
                const vid = targetArgs[3];
                node.config.interfaces[node.currentIf].vlan = vid;
                node.config.vlans[vid] = node.config.vlans[vid] || { name: `VLAN${vid}`, ports: [] };
                if (!node.config.vlans[vid].ports.includes(node.currentIf)) node.config.vlans[vid].ports.push(node.currentIf);
                addLine("");
            } else if (targetBaseCmd === 'description' || targetBaseCmd === 'desc') {
                node.config.interfaces[node.currentIf].desc = targetCmd.substring(targetBaseCmd.length + 1);
                addLine("");
            } else if (targetBaseCmd === 'exit') {
                node.cliMode = 'config';
                addLine("");
            }
        }
 
        // VLAN Config
        else if (node.cliMode === 'config-vlan') {
            if (targetBaseCmd === 'name') {
                node.config.vlans[node.currentVlan].name = targetArgs[1];
                addLine("");
            } else if (targetBaseCmd === 'exit') {
                node.cliMode = 'config';
                addLine("");
            }
        }
 
        // Execution Commands (Ping)
        else if (targetBaseCmd === 'ping') {
            const targetIp = targetArgs[1];
            if (!targetIp) { addLine("% Incomplete command.", "out"); return; }
            addLine(`Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`, 'out');
 
            const path = this.tracePath(node, targetIp);
 
            if (path && path.length >= 2) {
                this.animatePathPackets(path, true, 'ICMP', () => {
                    const reversePath = [...path].reverse();
                    this.animatePathPackets(reversePath, true, 'ICMP', () => {
                        addLine("!!!!!\nSuccess rate is 100 percent (5/5), RTT = 12ms", 'out');
                    });
                });
            } else {
                this.animatePacketStep(node, node, false, 'ARP', () => {
                    addLine(".....\nSuccess rate is 0 percent (0/5) - Destination Host Unreachable", 'out');
                });
            }
        }

        else if (targetBaseCmd === 'traceroute') {
            addLine(`Tracing the route to ${targetArgs[1]}\n  1  192.168.1.1  1 msec  1 msec  1 msec\n  2  10.0.0.1  2 msec  *  2 msec`, "out");
        }

        else if (targetBaseCmd === '?' || targetBaseCmd === 'help') {
            let help = "Available commands:\n";
            if (node.cliMode === 'user') help += "  enable, ping, show, exit, help, traceroute, clear";
            else if (node.cliMode === 'privileged') help += "  configure terminal, disable, ping, show, write, reload, exit";
            else if (node.cliMode === 'config') help += "  hostname, interface, ip route, ip default-gateway, router, vlan, banner, no, exit, end";
            else if (node.cliMode === 'config-if') help += "  ip address, no shutdown, shutdown, switchport, description, exit";
            addLine(help, 'out');
        }

        else {
            addLine("% Unrecognized command. Type '?' for help.", 'out');
        }

        // AUTO-SAVE on every valid command that changes config
        if (this.saveTopology) this.saveTopology();

        // Update Prompt
        const host = node.config?.hostname || node.label || node.type.toUpperCase();
        let suffix = '>';
        if (node.cliMode === 'privileged') suffix = '#';
        if (node.cliMode === 'config') suffix = '(config)#';
        if (node.cliMode === 'config-if') suffix = `(config-if)#`;
        if (node.cliMode === 'config-vlan') suffix = `(config-vlan)#`;
        if (node.cliMode === 'config-router') suffix = `(config-router)#`;
        document.getElementById('prompt').textContent = `${host}${suffix}`;
        area.scrollTop = area.scrollHeight;
    }

    drawLinks() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.links.forEach(link => {
            const fromPortStatus = link.from.config?.interfaces?.[link.fromPort]?.status === 'up' || link.from.type === 'hub';
            const toPortStatus = link.to.config?.interfaces?.[link.toPort]?.status === 'up' || link.to.type === 'hub';
            const isUp = fromPortStatus && toPortStatus;

            const dx = link.to.x - link.from.x, dy = link.to.y - link.from.y;
            const angle = Math.atan2(dy, dx);
            const radius = 35;
            const fx = link.from.x + 30 + Math.cos(angle) * radius;
            const fy = link.from.y + 30 + Math.sin(angle) * radius;
            const tx = link.to.x + 30 - Math.cos(angle) * radius;
            const ty = link.to.y + 30 - Math.sin(angle) * radius;

            this.ctx.beginPath();
            if (link.type === 'straight') {
                this.ctx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
                this.ctx.setLineDash([]);
            } else if (link.type === 'cross') {
                this.ctx.strokeStyle = isUp ? '#fbbf24' : '#f43f5e';
                this.ctx.setLineDash([8, 5]);
            } else if (link.type === 'serial') {
                this.ctx.strokeStyle = '#f43f5e';
                this.ctx.setLineDash([]);
                this.drawZigzag(fx, fy, tx, ty);
                this.ctx.stroke();
            } else if (link.type === 'fiber') {
                this.ctx.strokeStyle = '#f97316';
                this.ctx.setLineDash([15, 5]);
            } else {
                this.ctx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
                this.ctx.setLineDash([]);
            }

            if (link.type !== 'serial') {
                this.ctx.lineWidth = 2.5;
                this.ctx.moveTo(fx, fy);
                this.ctx.lineTo(tx, ty);
                this.ctx.stroke();
            }

            this.ctx.font = "bold 9px var(--font-mono)";
            this.ctx.fillStyle = "#64748b";
            const labelDist = 18;
            this.ctx.fillText(link.fromPort, fx + Math.cos(angle) * labelDist, fy + Math.sin(angle) * labelDist);
            this.ctx.fillText(link.toPort, tx - Math.cos(angle) * labelDist, ty - Math.sin(angle) * labelDist);

            this.ctx.setLineDash([]);
            this.drawLinkDot(link.from, link.to, fromPortStatus, angle);
            this.drawLinkDot(link.to, link.from, toPortStatus, angle + Math.PI);
        });

        if (this.ghostLine.active) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)';
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(this.ghostLine.x1, this.ghostLine.y1);
            this.ctx.lineTo(this.ghostLine.x2, this.ghostLine.y2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawLinkDot(n1, n2, status, angle) {
        const radius = 35;
        const x = n1.x + 30 + Math.cos(angle) * radius;
        const y = n1.y + 30 + Math.sin(angle) * radius;

        this.ctx.fillStyle = status ? '#10b981' : '#f43f5e';
        this.ctx.shadowBlur = status ? 8 : 0;
        this.ctx.shadowColor = this.ctx.fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3.5, 0, Math.PI * 2); // Smaller, cleaner dots
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawZigzag(x1, y1, x2, y2) {
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (dist < 10) return;
        const steps = Math.max(4, Math.floor(dist / 12));
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;

        this.ctx.lineWidth = 2;
        this.ctx.moveTo(x1, y1);
        const mag = Math.sqrt(dx * dx + dy * dy);
        const ux = -dy / mag;
        const uy = dx / mag;

        for (let i = 1; i < steps; i++) {
            const px = x1 + dx * i;
            const py = y1 + dy * i;
            const offset = (i % 2 === 0 ? 8 : -8);
            this.ctx.lineTo(px + ux * offset, py + uy * offset);
        }
        this.ctx.lineTo(x2, y2);
    }

    animate() {
        if (!this.isRunning) return;
        this.drawLinks();
        this.aniId = requestAnimationFrame(this.animate);

        // Update Status Bar
        const nCnt = document.getElementById('node-count');
        const lCnt = document.getElementById('link-count');
        if (nCnt) nCnt.textContent = this.nodes.length;
        if (lCnt) lCnt.textContent = this.links.length;
    }
}

class NetworkingSim {
    constructor(canvasId, mode, labId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.labId = labId;
        this.packets = [];
        this.acks = [];
        this.isRunning = false;
        this.mode = mode || 'stop-wait';
        this.windowSize = 4;
        this.base = 0;
        this.nextSeqNum = 0;
        this.expectedSeqNum = 0;
        this.stats = { sent: 0, acked: 0 };
        this.timeoutDuration = 4000;
        this.timerStart = null;
        this.timerActive = false;
        this.eventList = document.getElementById('eventList');
        this.packetLog = [];
        this.startTime = null;
        this.totalDataSent = 0;
        this.aniId = null;
        this.isDestroyed = false;
        this.init();
        window.currentSim = this;
    }

    init() {
        this.resize = this.resize.bind(this);
        this.resize();
        window.addEventListener('resize', this.resize);
        this.animate = this.animate.bind(this);
        this.aniId = requestAnimationFrame(this.animate);
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    resize() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        // Ensure non-zero dimensions for proper rendering
        this.canvas.width = Math.max(container.clientWidth, 800);
        this.canvas.height = Math.max(container.clientHeight, 500);
        
        this.senderPos = { x: 100, y: this.canvas.height / 2 };
        this.receiverPos = { x: this.canvas.width - 150, y: this.canvas.height / 2 };
        this.channelY = this.canvas.height / 2;

        // Initialize sequence visualization
        this.sequenceNodes = [];
        const gap = (this.receiverPos.x - this.senderPos.x) / 10;
        for (let i = 0; i < 10; i++) {
            this.sequenceNodes.push({ x: this.senderPos.x + i * gap, y: this.channelY });
        }
    }

    // Consolidated Stats Update
    updateStats() {
        const sentEl = document.getElementById('statSent');
        const ackEl = document.getElementById('statAck');
        const effEl = document.getElementById('statEff');
        const throughputEl = document.getElementById('statThroughput');

        if (sentEl) sentEl.textContent = this.stats.sent;
        if (ackEl) ackEl.textContent = this.stats.acked;

        const efficiency = this.stats.sent > 0 ? Math.round((this.stats.acked / this.stats.sent) * 100) : 0;
        if (effEl) effEl.textContent = efficiency + '%';

        let throughput = 0;
        if (this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            throughput = (this.stats.acked * 1024) / (elapsed || 1);
            if (throughputEl) throughputEl.textContent = Math.round(throughput) + " Bps";
        }

        window.VLAB_CURRENT_STATS = { sent: this.stats.sent, acked: this.stats.acked, efficiency: efficiency + '%', throughput: Math.round(throughput) + " Bps" };
    }

    destroy() {
        this.isRunning = false;
        this.isDestroyed = true;
        this.timerActive = false;
        if (this.aniId) cancelAnimationFrame(this.aniId);
        window.removeEventListener('resize', this.resize);
    }

    updatePackets() {
        this.packets.forEach((p, idx) => {
            if (p.isCollided) return;
            p.progress += p.speed;
            p.x = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * p.progress;
            if (p.progress >= 1) {
                this.handlePacketArrival(p);
                this.packets.splice(idx, 1);
            }
        });
    }

    updateAcks() {
        this.acks.forEach((a, idx) => {
            a.progress += a.speed;
            a.x = this.receiverPos.x - (this.receiverPos.x - this.senderPos.x) * a.progress;
            if (a.progress >= 1) {
                this.handleAckArrival(a);
                this.acks.splice(idx, 1);
            }
        });
    }

    checkTimeout() {
        if (this.timerActive && (Date.now() - this.timerStart > this.timeoutDuration)) {
            this.handleTimeout();
        }
    }

    handlePacketArrival(p) {
        if (this.mode === 'collision') {
            this.stats.acked++; this.updateStats();
            this.logEvent(`Packet Received Successfully`, "success");
            return;
        }
        if (p.seq === this.expectedSeqNum) {
            this.sendAck(p.seq);
            this.expectedSeqNum++;
            this.logEvent(`Accepted PDU ${p.seq}`, "success");
        } else {
            this.sendAck(this.expectedSeqNum - 1);
            this.logEvent(`Discarded ${p.seq}: Out of Order`, "error");
        }
    }

    sendAck(seq) {
        if (seq < 0) return;
        this.acks.push({ id: Math.random(), seq, x: this.receiverPos.x, y: this.receiverPos.y, progress: 0, speed: 0.006, type: 'ack', color: '#10b981' });
    }

    handleAckArrival(a) {
        if (this.mode === 'stop-wait' || this.mode === 'collision' || this.mode === 'csma_ca') {
            if (a.seq === this.base) {
                this.base++; this.stats.acked++; this.stopTimer(); this.updateStats();
                if (this.isRunning) setTimeout(() => this.runStep(), 800);
            }
        } else {
            if (a.seq >= this.base) {
                const adv = a.seq - this.base + 1;
                this.stats.acked += adv;
                this.base = a.seq + 1;
                if (this.base === this.nextSeqNum) this.stopTimer(); else this.startTimer();
                this.updateStats();
                if (this.isRunning) this.runStep();
            }
        }
    }

    handleTimeout() {
        this.logEvent(`Timeout at ${this.base}. Retransmitting...`, "error");
        this.stopTimer();
        this.nextSeqNum = this.base;
        this.packets = [];
        this.runStep();
    }

    startTimer() { this.timerStart = Date.now(); this.timerActive = true; }
    stopTimer() { this.timerActive = false; this.timerStart = null; }

    logEvent(msg, type) {
        if (!this.eventList) return;
        const div = document.createElement('div');
        div.className = 'event-item';
        div.style.padding = '8px 12px'; div.style.borderBottom = '1px solid var(--border)';
        let color = "var(--text-muted)";
        if (type === 'success') color = 'var(--success)';
        else if (type === 'error') color = 'var(--danger)';
        else if (type === 'data') color = 'var(--primary)';
        div.innerHTML = `<span style="color:${color}; font-weight:800;">[${new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span> ${msg}`;
        this.eventList.prepend(div);
    }

    reset() {
        this.packets = []; this.acks = []; this.nextSeqNum = 0; this.base = 0; this.expectedSeqNum = 0;
        this.stats = { sent: 0, acked: 0 }; this.timerActive = false; this.isRunning = false;
        this.updateStats(); this.logEvent("Simulation Engine Reset", "info");
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now();
        this.logEvent("Simulation Engine Started", "success");
        this.runStep();
    }

    runStep() {
        if (!this.isRunning) return;
        if (this.mode === 'stop-wait' || this.mode === 'collision' || this.mode === 'csma_ca') {
            if (this.base === this.nextSeqNum && this.packets.length === 0 && this.acks.length === 0) {
                this.sendPacket(this.nextSeqNum);
            }
        } else {
            while (this.nextSeqNum < this.base + this.windowSize) {
                this.sendPacket(this.nextSeqNum);
            }
        }
    }

    sendPacket(seq) {
        let color = '#2563eb';
        if (this.mode === 'collision') {
            if (this.packets.length > 0) {
                this.attempts = (this.attempts || 0) + 1;
                const backoff = Math.floor(Math.random() * (Math.pow(2, this.attempts) - 1)) * 100;
                this.logEvent(`Collision! Retrying in ${backoff}ms`, "error");
                this.packets.forEach(p => { p.color = '#ef4444'; p.speed = 0; p.isCollided = true; });
                setTimeout(() => { if (this.isRunning) this.runStep(); }, backoff);
                return;
            }
            this.attempts = 0; color = '#10b981';
        } else if (this.mode === 'csma_ca') {
            this.logEvent(`Sensing Channel...`, "info");
            setTimeout(() => {
                this.logEvent(`Sending RTS (Request to Send)`, "data");
                setTimeout(() => {
                    this.logEvent(`Received CTS (Clear to Send)`, "success");
                    this.packets.push({ id: Math.random(), seq, x: this.senderPos.x, y: this.senderPos.y, progress: 0, speed: 0.005, type: 'data', color: '#8b5cf6' });
                    this.nextSeqNum++; this.stats.sent++; this.updateStats();
                }, 800);
            }, 600);
            return;
        }

        this.packets.push({ id: Math.random(), seq, x: this.senderPos.x, y: this.senderPos.y, progress: 0, speed: 0.004, type: 'data', color, trail: [] });
        if (seq === this.nextSeqNum) this.nextSeqNum++;
        if (this.base === seq && !this.timerActive) this.startTimer();
        this.stats.sent++; this.updateStats();
        this.logEvent(`Sent PDU ${seq}`, "data");
    }

    animate() {
        if (this.isDestroyed) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Always draw grid for technical feel
        this.ctx.strokeStyle = "rgba(0,0,0,0.05)";
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 40) { this.ctx.beginPath(); this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.canvas.height); this.ctx.stroke(); }
        for (let i = 0; i < this.canvas.height; i += 40) { this.ctx.beginPath(); this.ctx.moveTo(0, i); this.ctx.lineTo(this.canvas.width, i); this.ctx.stroke(); }

        // Draw Real-time Graphs
        this.drawPerformanceGraphs();

        // Draw Analytical Sparklines
        this.drawSparklines();

        // Draw Watermark for Screenshot Authenticity
        this.ctx.fillStyle = "rgba(100, 116, 139, 0.2)";
        this.ctx.font = "800 24px var(--font-sans)";
        this.ctx.textAlign = "right";
        this.ctx.fillText("MIT ADT VLAB - OFFICIAL SIMULATION", this.canvas.width - 20, this.canvas.height - 20);

        if (this.timerActive && Date.now() - this.timerStart > this.timeoutDuration) this.handleTimeout();

        const mode = this.mode;
        const labId = this.labId;

        if (mode === 'modulation') {
            this.drawModulationWaves();
        } else if (mode === 'vlan_sim') {
            this.drawVlanSim();
        } else if (mode === 'dns') {
            this.drawDnsSim();
        } else if (mode === 'dv_sim' || mode === 'ls_sim' || mode === 'path_sim') {
            this.drawRoutingSim();
        } else if (mode === 'gbn' && labId === 'tcp') {
            this.drawTcpTransferSim();
        } else if (mode === 'gbn' && labId === 'udp') {
             this.drawUdpChatSim();
        } else {
            // Determine realistic device names based on mode
            let senderLabel, receiverLabel;
            if (mode === 'collision') {
                senderLabel = "PC-A (Ethernet)"; receiverLabel = "PC-B (Ethernet)";
            } else if (mode === 'csma_ca') {
                senderLabel = "Laptop A (Wi-Fi)"; receiverLabel = "Access Point";
            } else if (mode === 'udp') {
                senderLabel = "Client PC"; receiverLabel = "Server";
            } else if (mode === 'gbn') {
                senderLabel = "PC Sender"; receiverLabel = "PC Receiver";
            } else {
                senderLabel = "Host A (Sender)"; receiverLabel = "Host B (Receiver)";
            }

            this.drawNode(this.senderPos.x, this.senderPos.y, senderLabel, "#2563eb");
            this.drawNode(this.receiverPos.x, this.receiverPos.y, receiverLabel, "#1e293b");

            if (mode === 'csma_ca') this.drawNavTimer();
            if (mode === 'gbn') this.drawWindow();
            if (this.timerActive) this.drawTimer();

            // Draw protocol title
            this.ctx.fillStyle = "var(--text-main)";
            this.ctx.font = "bold 16px var(--font-sans)";
            this.ctx.textAlign = "left";
            if (mode === 'collision') this.ctx.fillText("CSMA/CD: Collision Detection on Shared Ethernet", 100, 40);
            else if (mode === 'csma_ca') this.ctx.fillText("CSMA/CA: RTS/CTS Collision Avoidance (802.11)", 100, 40);
            else if (mode === 'udp') this.ctx.fillText("UDP: Connectionless Datagram Transfer", 100, 40);
            else if (mode === 'gbn') this.ctx.fillText("Go-Back-N: Pipelined Reliable Transfer", 100, 40);
            else if (mode === 'stop-wait') this.ctx.fillText("Stop-and-Wait ARQ Protocol", 100, 40);

            // Link Line
            this.ctx.beginPath(); this.ctx.setLineDash([8, 8]); this.ctx.strokeStyle = "var(--border)";
            this.ctx.moveTo(this.senderPos.x + 40, this.senderPos.y); this.ctx.lineTo(this.receiverPos.x - 40, this.receiverPos.y); this.ctx.stroke(); this.ctx.setLineDash([]);
        }

        if (!this.isRunning && this.packets.length === 0 && this.acks.length === 0) {
            this.updateStats(); // Ensure stats are final even when idle
            this.aniId = requestAnimationFrame(this.animate);
            return;
        }

        [this.packets, this.acks].forEach((arr, idx) => {
            for (let i = arr.length - 1; i >= 0; i--) {
                const p = arr[i];
                if (!p.isCollided) p.progress += p.speed;
                const start = idx === 0 ? this.senderPos : this.receiverPos;
                const end = idx === 0 ? this.receiverPos : this.senderPos;
                p.x = start.x + (end.x - start.x) * p.progress; p.y = start.y;
                if (p.isCollided) {
                    p.y += Math.sin(Date.now() / 50) * 2;
                    if (p.collisionTime === undefined) p.collisionTime = Date.now();
                    if (Date.now() - p.collisionTime > 2000) arr.splice(i, 1);
                } else if (p.progress >= 1) {
                    if (idx === 0) this.handlePacketArrival(p); else this.handleAckArrival(p); arr.splice(i, 1);
                }
                if (arr[i]) this.drawPacket(p);
            }
        });
        if (this.mode === 'collision' && this.isRunning && Math.random() < 0.01) this.sendPacket(this.nextSeqNum);

        // Update UI Stats
        const sentEl = document.getElementById('statSent');
        const ackEl = document.getElementById('statAck');
        const effEl = document.getElementById('statEff');
        const throughputEl = document.getElementById('statThroughput');

        if (sentEl) sentEl.textContent = this.stats.sent;
        if (ackEl) ackEl.textContent = this.stats.acked;
        if (effEl) {
            const eff = this.stats.sent > 0 ? Math.round((this.stats.acked / this.stats.sent) * 100) : 0;
            effEl.textContent = `${eff}%`;
        }
        if (throughputEl && this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const bps = elapsed > 0 ? Math.round((this.stats.acked * 1024) / elapsed) : 0;
            throughputEl.textContent = `${bps} Bps`;
        }

        this.aniId = requestAnimationFrame(this.animate);
    }

    drawModulationWaves() {
        const time = Date.now() / 1000;
        const centerX = this.canvas.width / 2;
        const startY = 80;
        const spacing = 110;

        // Oscilloscope Background
        this.ctx.fillStyle = "#0a0a0a";
        this.ctx.fillRect(40, 20, this.canvas.width - 80, this.canvas.height - 40);
        this.ctx.strokeStyle = "rgba(0, 255, 0, 0.1)";
        this.ctx.lineWidth = 1;
        for (let x = 40; x < this.canvas.width - 40; x += 20) { this.ctx.beginPath(); this.ctx.moveTo(x, 20); this.ctx.lineTo(x, this.canvas.height - 20); this.ctx.stroke(); }
        for (let y = 20; y < this.canvas.height - 20; y += 20) { this.ctx.beginPath(); this.ctx.moveTo(40, y); this.ctx.lineTo(this.canvas.width - 40, y); this.ctx.stroke(); }

        // 1. Message Signal
        this.drawWave(50, startY, "Message Signal (Analog)", "#3b82f6", (x) => Math.sin(x * 0.02 + time * 2) * 30);

        // 2. Modulated Signal (Cycle AM -> FM -> PCM -> NOISE)
        const cycle = Math.floor((time % 16) / 4);
        let title = "Amplitude Modulation (AM)";
        let color = "#10b981";

        if (cycle === 0) {
            this.drawWave(50, startY + spacing, title, color, (x) => {
                const message = Math.sin(x * 0.02 + time * 2);
                return Math.sin(x * 0.2 + time * 10) * (30 + message * 20);
            });
            this.ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
            this.ctx.fillText("Sidebands: fc ± fm", 50, startY + spacing + 60);
        } else if (cycle === 1) {
            title = "Frequency Modulation (FM)";
            this.drawWave(50, startY + spacing, title, color, (x) => {
                const message = Math.sin(x * 0.02 + time * 2);
                return Math.sin(x * (0.2 + message * 0.1) + time * 10) * 30;
            });
            this.ctx.fillText("Bessel Functions: Inf. Sidebands", 50, startY + spacing + 60);
        } else if (cycle === 2) {
            title = "Pulse Code Modulation (PCM) - 8-Level Quantization";
            color = "#f59e0b";
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            for (let x = 0; x < this.canvas.width - 100; x += 15) {
                const message = Math.sin(x * 0.02 + time * 2) * 30;
                this.ctx.moveTo(50 + x, startY + spacing);
                this.ctx.lineTo(50 + x, startY + spacing + message);
                const val = Math.floor(((message + 30) / 60) * 7);
                this.ctx.fillStyle = "white";
                this.ctx.font = "8px monospace";
                if (x % 30 === 0) this.ctx.fillText(`Q:${val} [${val.toString(2).padStart(3, '0')}]`, 50 + x - 10, startY + spacing + message + (message > 0 ? 10 : -10));
            }
            this.ctx.stroke();
        } else {
            title = "⚠️ ATTENUATION & THERMAL NOISE (SNR < 10dB)";
            color = "#ef4444";
            this.drawWave(50, startY + spacing, title, color, (x) => {
                const noise = (Math.random() - 0.5) * 40;
                const signal = Math.sin(x * 0.02 + time * 2) * 5; // Heavily attenuated
                return signal + noise;
            });
            this.ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
            this.ctx.fillText("CRITICAL: Bit Error Rate (BER) Spike detected", 50, startY + spacing + 60);
        }

        this.ctx.fillStyle = color;
        this.ctx.font = "bold 14px var(--font-sans)";
        this.ctx.fillText(title, 50, startY + spacing - 45);
    }

    drawWave(xStart, yCenter, label, color, waveFn) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        const width = this.canvas.width - 100;
        for (let x = 0; x < width; x++) {
            const y = yCenter + waveFn(x);
            if (x === 0) this.ctx.moveTo(xStart + x, y);
            else this.ctx.lineTo(xStart + x, y);
        }
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        this.ctx.font = "bold 14px var(--font-sans)";
        this.ctx.fillText(label, xStart, yCenter - 45);
    }

    destroy() {
        this.isRunning = false;
        if (this.aniId) cancelAnimationFrame(this.aniId);
        window.removeEventListener('resize', this.resize);
    }

    drawWindow() {
        const x = this.senderPos.x - 100, y = this.senderPos.y + 80, size = 30;
        this.ctx.font = "bold 11px var(--font-sans)"; this.ctx.fillStyle = "var(--text-muted)"; this.ctx.fillText("Active Window", x + 60, y - 15);
        for (let i = 0; i < this.windowSize; i++) {
            const seq = this.base + i; const isSent = seq < this.nextSeqNum;
            this.ctx.strokeStyle = isSent ? "var(--primary)" : "var(--border)";
            this.ctx.fillStyle = isSent ? "rgba(37, 99, 235, 0.1)" : "transparent";
            this.ctx.beginPath(); this.ctx.roundRect(x + i * 35, y, size, size, 6); this.ctx.fill(); this.ctx.stroke();
            this.ctx.fillStyle = isSent ? "var(--primary)" : "var(--text-muted)"; this.ctx.fillText(seq, x + i * 35 + 15, y + 15);
        }
    }

    drawTimer() {
        const x = this.senderPos.x - 40, y = this.senderPos.y - 60, w = 80, h = 8;
        const pct = Math.min(1, (Date.now() - this.timerStart) / this.timeoutDuration);
        this.ctx.fillStyle = "var(--border)"; this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, 4); this.ctx.fill();
        this.ctx.fillStyle = pct > 0.8 ? "var(--danger)" : "var(--primary)";
        this.ctx.beginPath(); this.ctx.roundRect(x, y, w * pct, h, 4); this.ctx.fill();
    }

    drawNode(x, y, label, color) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Determine Icon Type
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('pc') || lowerLabel.includes('host') || lowerLabel.includes('client') || lowerLabel.includes('laptop') || lowerLabel.includes('node')) {
            this.drawPCIcon(color);
        } else if (lowerLabel.includes('router') || lowerLabel.includes('resolver') || lowerLabel.includes('gateway')) {
            this.drawRouterIcon(color);
        } else if (lowerLabel.includes('switch') || lowerLabel.includes('hub') || lowerLabel.includes('point')) {
            this.drawSwitchIcon(color);
        } else if (lowerLabel.includes('server')) {
            this.drawServerIcon(color);
        } else {
            // Fallback to circle
            this.ctx.beginPath(); this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
            this.ctx.fillStyle = color; this.ctx.fill();
        }

        // Label
        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 13px var(--font-sans)";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(label, 0, 45);

        // TX/RX Role Indicator
        const role = (lowerLabel.includes("sender") || lowerLabel.includes("a") || lowerLabel.includes("client") || lowerLabel.includes("1")) ? "TX" : "RX";
        this.ctx.fillStyle = color;
        this.ctx.font = "bold 9px var(--font-mono)";
        this.ctx.fillText(role, 0, -40);

        this.ctx.restore();
    }

    drawPCIcon(color) {
        this.ctx.fillStyle = color;
        // Monitor Frame
        this.ctx.beginPath(); this.ctx.roundRect(-22, -28, 44, 32, 4); this.ctx.fill();
        // Screen
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.beginPath(); this.ctx.roundRect(-18, -24, 36, 24, 2); this.ctx.fill();
        // Code-like lines on screen for "hacker" feel
        this.ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-14, -18); this.ctx.lineTo(-4, -18);
        this.ctx.moveTo(-14, -14); this.ctx.lineTo(4, -14);
        this.ctx.moveTo(-14, -10); this.ctx.lineTo(0, -10);
        this.ctx.stroke();
        // Stand
        this.ctx.fillStyle = color;
        this.ctx.fillRect(-6, 4, 12, 6);
        this.ctx.fillRect(-18, 10, 36, 4);
    }

    drawRouterIcon(color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.arc(0, 0, 28, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.strokeStyle = "rgba(255,255,255,0.4)"; this.ctx.lineWidth = 2;
        // Cross arrows
        this.ctx.beginPath(); this.ctx.moveTo(-18, 0); this.ctx.lineTo(18, 0); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(0, -18); this.ctx.lineTo(0, 18); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.arc(0, 0, 12, 0, Math.PI * 2); this.ctx.stroke();
    }

    drawSwitchIcon(color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.roundRect(-28, -18, 56, 36, 3); this.ctx.fill();
        this.ctx.strokeStyle = "rgba(255,255,255,0.3)"; this.ctx.lineWidth = 1;
        for (let i = -18; i <= 18; i += 12) {
            this.ctx.strokeRect(i - 3, -12, 6, 6);
            this.ctx.strokeRect(i - 3, 6, 6, 6);
        }
    }

    drawServerIcon(color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.roundRect(-18, -28, 36, 56, 3); this.ctx.fill();
        this.ctx.fillStyle = "rgba(255,255,255,0.2)";
        this.ctx.fillRect(-12, -18, 24, 3);
        this.ctx.fillRect(-12, -8, 24, 3);
        this.ctx.fillRect(-12, 2, 24, 3);
        this.ctx.beginPath(); this.ctx.arc(12, 18, 3, 0, Math.PI * 2); this.ctx.fill();
    }

    drawPacket(p) {
        this.ctx.save(); this.ctx.translate(p.x, p.y);
        this.ctx.fillStyle = p.color; 
        this.ctx.shadowBlur = 15; this.ctx.shadowColor = p.color;
        
        // PDU Box
        this.ctx.beginPath(); this.ctx.roundRect(-14, -14, 28, 28, 6); this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Icon on PDU
        this.ctx.fillStyle = "white"; this.ctx.font = "bold 14px var(--font-mono)";
        this.ctx.textAlign = "center"; this.ctx.textBaseline = "middle";
        this.ctx.fillText(p.type === 'ack' ? "A" : "D", 0, 0);
        
        // Sequence Tag
        this.ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; 
        this.ctx.beginPath(); this.ctx.roundRect(14, -22, 22, 16, 4); this.ctx.fill();
        this.ctx.fillStyle = "white"; 
        this.ctx.font = "bold 10px var(--font-mono)"; 
        this.ctx.fillText(p.seq, 25, -14);
        
        this.ctx.restore();
    }

    drawVlanSim() {
        const time = Date.now() / 1000;
        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px var(--font-sans)";
        this.ctx.textAlign = "left";
        this.ctx.fillText("VLAN: IEEE 802-1Q Frame Tagging and Trunk Segmentation", 80, 40);

        this.ctx.strokeStyle = "rgba(37,99,235,0.3)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(120, 200);
        this.ctx.lineTo(400, 280);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(239,68,68,0.3)";
        this.ctx.beginPath();
        this.ctx.moveTo(120, 400);
        this.ctx.lineTo(400, 320);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(100,116,139,0.4)";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(400, 300);
        this.ctx.lineTo(680, 300);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(37,99,235,0.3)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(680, 200);
        this.ctx.lineTo(400, 280);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(239,68,68,0.3)";
        this.ctx.beginPath();
        this.ctx.moveTo(680, 400);
        this.ctx.lineTo(400, 320);
        this.ctx.stroke();

        this.drawNode(120, 200, "PC-1 (VLAN 10)", "#2563eb");
        this.drawNode(120, 400, "PC-3 (VLAN 20)", "#ef4444");
        this.drawNode(400, 300, "L2 Switch", "#64748b");
        this.drawNode(680, 200, "PC-2 (VLAN 10)", "#2563eb");
        this.drawNode(680, 400, "PC-4 (VLAN 20)", "#ef4444");

        this.ctx.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx.beginPath();
        this.ctx.roundRect(490, 270, 80, 20, 4);
        this.ctx.fill();

        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 10px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText("TRUNK", 530, 284);

        const cycle = time % 12;
        let px, py, tag, tagColor, targetLabel = "";

        if (cycle < 4) {
            // SUCCESS: VLAN 10 -> VLAN 10
            const progress = cycle / 4;
            if (progress < 0.5) {
                px = 120 + (400 - 120) * (progress * 2);
                py = 200 + (280 - 200) * (progress * 2);
                tag = "Untagged"; tagColor = "#2563eb";
            } else {
                px = 400 + (680 - 400) * ((progress - 0.5) * 2);
                py = 280 + (200 - 280) * ((progress - 0.5) * 2);
                tag = "802.1Q [VID:10]"; tagColor = "#8b5cf6";
            }
            targetLabel = "Accepted (Same VLAN)";
        } else if (cycle < 8) {
            // BLOCKED: VLAN 10 -> VLAN 20
            const progress = (cycle - 4) / 4;
            if (progress < 0.5) {
                px = 120 + (400 - 120) * (progress * 2);
                py = 200 + (280 - 200) * (progress * 2);
                tag = "Untagged"; tagColor = "#2563eb";
            } else {
                px = 400 + (680 - 400) * ((progress - 0.5) * 2);
                py = 280 + (400 - 280) * ((progress - 0.5) * 2);
                tag = "802.1Q [VID:10]"; tagColor = "#8b5cf6";
            }

            if (progress > 0.6) {
                this.ctx.fillStyle = "#ef4444";
                this.ctx.font = "bold 14px monospace";
                this.ctx.fillText("❌ BLOCKED: VLAN MISMATCH", px, py - 20);
            }
            targetLabel = "Rejected (VLAN Isolation)";
        } else {
            // Idle/Transition
            return;
        }

        this.ctx.fillStyle = tagColor;
        this.ctx.beginPath();
        this.ctx.roundRect(px - 45, py + 10, 90, 22, 4);
        this.ctx.fill();

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 9px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText(tag, px, py + 24);

        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "italic 11px var(--font-sans)";
        this.ctx.fillText(targetLabel, px, py + 45);
    }

    drawUdpChatSim() {
        const time = Date.now() / 1000;
        this.drawNode(this.senderPos.x, this.senderPos.y, "Sender (App)", "#3b82f6");
        this.drawNode(this.receiverPos.x, this.receiverPos.y, "Receiver (App)", "#1e293b");

        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px var(--font-sans)";
        this.ctx.fillText("UDP: Unreliable 'Fire-and-Forget' Datagrams", 100, 50);
        
        const cycle = time % 6;
        let px, py, label = "Datagram Sent", color = "#3b82f6";
        let progress = (cycle / 4);

        if (cycle < 4) {
            px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * progress;
            py = this.senderPos.y;
            if (cycle > 3.5 && cycle < 4) {
                label = "Dropped (No ACK)"; color = "#ef4444";
            }
        }

        if (px) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath(); this.ctx.roundRect(px - 30, py - 10, 60, 20, 4); this.ctx.fill();
            this.ctx.fillStyle = "white"; this.ctx.font = "bold 9px monospace";
            this.ctx.textAlign = "center"; this.ctx.fillText("UDP PDU", px, py + 3);
            this.ctx.fillStyle = "var(--text-muted)"; this.ctx.fillText(label, px, py + 25);
        }
    }

    drawTcpTransferSim() {
        const time = Date.now() / 1000;
        this.drawNode(this.senderPos.x, this.senderPos.y, "Client", "#2563eb");
        this.drawNode(this.receiverPos.x, this.receiverPos.y, "Server", "#1e293b");

        const cycle = time % 20;
        let px, py, label = "", color = "#2563eb";

        if (cycle < 6) {
            // Handshake Phase
            this.ctx.fillStyle = "var(--primary)";
            this.ctx.font = "bold 16px var(--font-sans)";
            this.ctx.fillText("PHASE 1: 3-Way Handshake (Connection Establishment)", 100, 50);
            const sub = (cycle % 6) / 2;
            const p = sub % 1;
            if (sub < 1) {
                px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * p; py = this.senderPos.y;
                label = "SYN (Seq=100)";
            } else if (sub < 2) {
                px = this.receiverPos.x + (this.senderPos.x - this.receiverPos.x) * p; py = this.receiverPos.y;
                label = "SYN-ACK (Ack=101)";
            } else {
                px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * p; py = this.senderPos.y;
                label = "ACK (Seq=101, Ack=201)"; color = "#10b981";
            }
        } else if (cycle < 16) {
            // Data Transfer Phase (GBN/Congestion Control)
            this.ctx.fillStyle = "#10b981";
            this.ctx.font = "bold 16px var(--font-sans)";
            this.ctx.fillText("PHASE 2: Data Transfer (Windowing & Congestion Control)", 100, 50);
            
            const p = ((cycle - 6) % 2) / 2;
            const seq = Math.floor((cycle - 6) / 2);
            px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * p; py = this.senderPos.y;
            label = `DATA (Seq=${102 + seq * 1460})`;
            
            // Draw window visualization overlay
            this.ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
            this.ctx.fillRect(this.senderPos.x + 40, this.senderPos.y - 40, 100, 80);
            this.ctx.strokeStyle = "#10b981";
            this.ctx.strokeRect(this.senderPos.x + 40, this.senderPos.y - 40, 100, 80);
            this.ctx.fillStyle = "#10b981";
            this.ctx.font = "bold 10px monospace";
            this.ctx.fillText(`CWND: ${Math.min(16, 2 + seq)} MSS`, this.senderPos.x + 50, this.senderPos.y - 25);
        } else {
            // Closing Phase
            this.ctx.fillStyle = "#ef4444";
            this.ctx.font = "bold 16px var(--font-sans)";
            this.ctx.fillText("PHASE 3: 4-Way Handshake (Connection Termination)", 100, 50);
            const p = (cycle - 16) / 4;
            px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * p; py = this.senderPos.y;
            label = "FIN (Close)"; color = "#ef4444";
        }

        if (px) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath(); this.ctx.roundRect(px - 60, py - 15, 120, 30, 6); this.ctx.fill();
            this.ctx.fillStyle = "white"; this.ctx.font = "bold 10px monospace";
            this.ctx.textAlign = "center"; this.ctx.fillText(label, px, py + 4);
        }
    }

    drawRoutingSim() {
        const time = Date.now() / 1000;
        const nodes = [
            { x: 150, y: 300, name: "Router A" },
            { x: 400, y: 150, name: "Router B" },
            { x: 400, y: 450, name: "Router C" },
            { x: 650, y: 300, name: "Router D" }
        ];

        nodes.forEach(n => this.drawNode(n.x, n.y, n.name, "#64748b"));
        this.drawCostLink(150, 300, 400, 150, "Cost: 10");
        this.drawCostLink(150, 300, 400, 450, "Cost: 2");
        this.drawCostLink(400, 150, 650, 300, "Cost: 5");
        this.drawCostLink(400, 450, 650, 300, "Cost: 20");

        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px var(--font-sans)";

        if (this.mode === 'dv_sim') {
            this.ctx.fillText("Distance Vector (RIPv2): Iterative Bellman-Ford Table Exchange", 100, 50);
            this.ctx.fillStyle = "rgba(0,0,0,0.85)";
            this.ctx.beginPath(); this.ctx.roundRect(30, 350, 170, 110, 8); this.ctx.fill();
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 10px monospace";
            this.ctx.fillText("LOCAL RIB: ROUTER A", 45, 368);
            this.ctx.fillText("Dest | Cost | Next", 45, 385);
            this.ctx.fillText("───────────────────", 45, 393);
            this.ctx.fillText("  B  |  10  |   B", 45, 408);
            this.ctx.fillText("  C  |   2  |   C", 45, 423);
            this.ctx.fillText("  D  |   7  |   C (Best)", 45, 438);

            const cycle = time % 4;
            if (cycle < 2) {
                const p = cycle / 2;
                const px = 150 + (400 - 150) * p, py = 300 + (450 - 300) * p;
                this.ctx.fillStyle = "#3b82f6";
                this.ctx.beginPath(); this.ctx.arc(px, py, 5, 0, Math.PI * 2); this.ctx.fill();
                this.ctx.fillStyle = "var(--text-muted)";
                this.ctx.font = "bold 9px monospace";
                this.ctx.fillText("DV Update Packet", px + 10, py - 5);
            }
        } else if (this.mode === 'ls_sim') {
            this.ctx.fillText("Link State (OSPFv2): Dijkstra SPF (Shortest Path First) Calculation", 100, 50);
            this.ctx.fillStyle = "rgba(0,0,0,0.85)";
            this.ctx.beginPath(); this.ctx.roundRect(30, 350, 180, 80, 8); this.ctx.fill();
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 10px monospace";
            this.ctx.fillText("OSPF LSDB (Global View)", 45, 370);
            this.ctx.fillText("• A-B (10) | A-C (2)", 45, 390);
            this.ctx.fillText("• B-D (5)  | C-D (20)", 45, 405);
            
            // Highlight shortest path A -> C -> D
            this.ctx.strokeStyle = "#10b981";
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(150, 300); this.ctx.lineTo(400, 450);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        } else {
            this.ctx.fillText("BGP (Path Vector): AS-Path Attribute and Policy Routing", 100, 50);
            this.ctx.fillStyle = "rgba(0,0,0,0.85)";
            this.ctx.beginPath(); this.ctx.roundRect(30, 350, 200, 80, 8); this.ctx.fill();
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 10px monospace";
            this.ctx.fillText("BGP TABLE (AS 65001)", 45, 370);
            this.ctx.fillText("Prefix: 8.8.8.0/24", 45, 390);
            this.ctx.fillText("AS-PATH: [65002, 65003] i", 45, 405);
            this.ctx.fillText("NEXT-HOP: 10.0.0.1", 45, 420);

            let progress = (time % 6) / 6;
            const p = progress;
            // Best path selection A -> B -> D (Cost 15) vs A -> C -> D (Cost 22)
            let px, py;
            if (p < 0.5) {
                const subP = p * 2;
                px = 150 + (400 - 150) * subP;
                py = 300 + (150 - 300) * subP;
            } else {
                const subP = (p - 0.5) * 2;
                px = 400 + (650 - 400) * subP;
                py = 150 + (300 - 150) * subP;
            }
            this.ctx.fillStyle = "#f59e0b";
            this.ctx.beginPath(); this.ctx.arc(px, py, 8, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = "var(--text-main)";
            this.ctx.font = "bold 10px var(--font-sans)";
            this.ctx.fillText("Best Path (Metric: 15)", px, py + 20);
        }
    }

    drawCostLink(x1, y1, x2, y2, label) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgba(100,116,139,0.5)";
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx.beginPath();
        this.ctx.roundRect((x1 + x2) / 2 - 35, (y1 + y2) / 2 - 22, 70, 18, 4);
        this.ctx.fill();

        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 11px var(--font-mono)";
        this.ctx.textAlign = "center";
        this.ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
    }

    drawTcpHandshake() {
        const time = Date.now() / 1000;
        this.ctx.strokeStyle = "rgba(100,116,139,0.3)"; this.ctx.lineWidth = 2;
        this.ctx.beginPath(); this.ctx.moveTo(this.senderPos.x + 30, this.senderPos.y);
        this.ctx.lineTo(this.receiverPos.x - 30, this.receiverPos.y); this.ctx.stroke();

        this.drawNode(this.senderPos.x, this.senderPos.y, "Client PC", "#2563eb");
        this.drawNode(this.receiverPos.x, this.receiverPos.y, "Server", "#1e293b");
        const stage = Math.floor((time % 9) / 3);
        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px var(--font-sans)";
        this.ctx.fillText("TCP Reno Connection (3-Way Handshake)", 100, 50);
        this.ctx.font = "12px monospace";
        this.ctx.fillText(`MSS: 1460 bytes | RTT: 20ms | Window: ${this.windowSize}`, 100, 70);

        let px, py, label = "", data = "", color = "#3b82f6";
        const cycle = time % 15;
        const phase = Math.floor(cycle / 5);
        let progress = (cycle % 5) / 5;

        if (phase === 0) {
            // SUCCESSFUL 3-WAY HANDSHAKE
            const sub = Math.floor(progress * 3);
            const subP = (progress * 3) % 1;
            if (sub === 0) {
                px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * subP; py = this.senderPos.y;
                label = "SYN (Seq=100)"; data = "Connection Request";
            } else if (sub === 1) {
                px = this.receiverPos.x + (this.senderPos.x - this.receiverPos.x) * subP; py = this.receiverPos.y;
                label = "SYN-ACK (Seq=200, Ack=101)"; data = "Request Granted";
            } else {
                px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * subP; py = this.senderPos.y;
                label = "ACK (Seq=101, Ack=201)"; data = "Established"; color = "#10b981";
            }
        } else if (phase === 1) {
            // FIREWALL DROP (SYN SENT BUT NO RESPONSE)
            px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * Math.min(1, progress * 2); py = this.senderPos.y;
            label = "SYN (Seq=300)"; data = "Retransmitting...";
            if (progress > 0.4) {
                color = "#ef4444";
                this.ctx.fillStyle = "#ef4444";
                this.ctx.fillText("❌ DROPPED BY FIREWALL", px, py - 30);
            }
        } else {
            // CONNECTION RESET
            px = this.senderPos.x + (this.receiverPos.x - this.senderPos.x) * progress; py = this.senderPos.y;
            if (progress > 0.7) {
                label = "RST (Reset)"; data = "Port Unreachable"; color = "#f59e0b";
            } else {
                label = "SYN (Seq=400)"; data = "Connecting...";
            }
        }

        this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.roundRect(px - 50, py + 50, 160, 35, 4); this.ctx.fill();
        this.ctx.fillStyle = "white"; this.ctx.font = "bold 10px monospace";
        this.ctx.fillText(label, px + 30, py + 65);
        this.ctx.font = "8px monospace"; this.ctx.fillStyle = "rgba(255,255,255,0.7)";
        this.ctx.fillText(data, px + 30, py + 78);
    }

    drawNavTimer() {
        const time = Date.now() / 1000;
        const isNavActive = Math.sin(time) > 0.5;
        if (isNavActive) {
            this.ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
            this.ctx.beginPath(); this.ctx.arc(this.senderPos.x, this.senderPos.y, 60, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = "#ef4444";
            this.ctx.font = "bold 12px var(--font-sans)";
            this.ctx.fillText("NAV ACTIVE (Waiting...)", this.senderPos.x, this.senderPos.y - 60);
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect(); const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const check = (arr, lbl) => {
            for (let i = 0; i < arr.length; i++) {
                const p = arr[i];
                if (Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2) < 25) {
                    if (e.shiftKey) {
                        this.logEvent(`${lbl} ${p.seq} lost`, "error");
                        arr.splice(i, 1);
                    } else {
                        this.inspectPacket(p);
                    }
                    return true;
                }
            }
            return false;
        };
        check(this.packets, "Data"); check(this.acks, "ACK");
    }

    inspectPacket(p) {
        const panel = document.getElementById('packet-inspector');
        const body = document.getElementById('inspector-body');
        if (panel) panel.style.display = 'block';
        if (body) {
            body.innerHTML = `
                <div style="background:var(--primary); color:white; padding:4px 8px; border-radius:4px; font-size:10px; margin-bottom:10px;">FRAME ${Math.floor(p.id * 10000)}</div>
                <div class="prop-row"><span>Layer 2</span><b>Ethernet II (MAC)</b></div>
                <div style="font-size:10px; margin-left:10px; color:var(--text-muted);">Src: 00:0C:29:XX:XX:XX<br>Dst: 00:50:56:YY:YY:YY</div>
                <div class="prop-row" style="margin-top:10px;"><span>Layer 3</span><b>IPv4 (Internet)</b></div>
                <div style="font-size:10px; margin-left:10px; color:var(--text-muted);">Src: 192.168.1.10<br>Dst: 192.168.1.254<br>TTL: 64 | Protocol: TCP (6)</div>
                <div class="prop-row" style="margin-top:15px;"><span>HEX DUMP</span></div>
                <div style="font-family:monospace; font-size:9px; background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; line-height:1.4;">
                    0000  00 0c 29 3e 4f 5a 00 50 56 c0 00 08 08 00 45 00
                </div>
            `;
        }
    }

    drawPerformanceGraphs() {
        const w = 150, h = 60;
        const x = this.canvas.width - w - 20, y = 20;
        this.ctx.fillStyle = "rgba(0,0,0,0.4)";
        this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, 8); this.ctx.fill();
        this.ctx.strokeStyle = "rgba(255,255,255,0.1)"; this.ctx.stroke();
    }

    drawSparklines() {
        const w = 180, h = 70;
        const x = this.canvas.width - w - 20, y = 20;
        this.ctx.save();
        this.ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
        this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, 12); this.ctx.fill();

        const hist = this.tpHist || (this.tpHist = Array(30).fill(0));
        const current = parseFloat(document.getElementById('statThroughput')?.textContent || '0');
        hist.push(current); hist.shift();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "var(--primary)";
        this.ctx.lineWidth = 2;
        const max = Math.max(...hist, 100);
        hist.forEach((v, i) => {
            const px = x + 10 + (i / 29) * (w - 20);
            const py = y + h - 10 - (v / max) * (h - 35);
            if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
        });
        this.ctx.stroke();
        this.ctx.restore();
    }
}

// App Controller
document.addEventListener('DOMContentLoaded', async () => {
    // Initial State Restoration from Cloud
    await fetchProgress();

    let currentScore = 0;
    window.currentSim = null;

    const loadLab = (id) => {
        let data = window.VLAB_DATA[id];

        // Handle Practice Lab (Sandbox) Metadata
        if (id === 'practice') {
            data = {
                title: "Free-Form Practice Lab",
                aim: "To build and test custom network topologies using the Cisco Packet Tracer-style workspace.",
                theory: {
                    intro: "Practical network engineering involves designing robust topologies and configuring real hardware. This sandbox mode allows you to experiment with all devices.",
                    cards: [{ title: "Toolbox Guide", content: "Drag devices like Routers and Switches to the workspace. Use the cabling tool to connect them, and the CLI to configure IP addresses." }]
                },
                procedure: ["Drag a PC into the workspace.", "Drag a Switch into the workspace.", "Select the Cable tool and connect them.", "Click the PC to configure its IP via CLI."],
                pretest: [], posttest: []
            };
        }

        if (!data) return;

        // Dynamic content population with fade-in effect
        const content = document.getElementById('content-display');
        if (!content) return;
        content.style.opacity = '0';
        
        // Sync the main header title
        const mainTitle = document.getElementById('lab-title-display');
        if (mainTitle) mainTitle.textContent = data.title;

        setTimeout(() => {
            document.querySelectorAll('.section-title').forEach(el => el.textContent = data.title);

            const setBody = (id, html) => {
                const sec = document.getElementById(id);
                if (sec) {
                    const body = sec.querySelector('.section-body');
                    if (body) body.innerHTML = html;
                }
            };

            setBody('section-aim', `<p>${data.aim}</p>`);

            let theory = `<p>${data.theory.intro}</p>`;
            data.theory.cards.forEach(c => theory += `<div class="theory-card"><strong>${c.title}</strong><p>${c.content}</p></div>`);
            setBody('section-theory', theory);

            renderMCQ('section-pretest', data.pretest, 'pre');
            renderMCQ('section-posttest', data.posttest, 'post');

            setBody('section-procedure', `<ol style="padding-left:20px; line-height:2;">${data.procedure.map(s => `<li>${s}</li>`).join('')}</ol>`);

            // Inject Practice Tasks
            const cmdList = document.getElementById('practice-commands-list');
            const qList = document.getElementById('practice-questions-list');
            if (cmdList && data.practice_commands) {
                cmdList.innerHTML = data.practice_commands.map(cmd => `<div style="margin-bottom:8px; display:flex; gap:10px;"><span style="color:var(--primary); opacity:0.6;">$</span> <span>${cmd}</span></div>`).join('');
            }
            if (qList && data.practice_questions) {
                qList.innerHTML = data.practice_questions.map((q, i) => `<div class="theory-card"><strong>Task ${i + 1}:</strong><p>${q}</p></div>`).join('');
            }

            content.style.opacity = '1';
        }, 200);

        if (window.currentSim) window.currentSim.destroy();
    };

    const renderMCQ = (sectionId, questions, prefix) => {
        const container = document.getElementById(sectionId).querySelector('.section-body');
        let html = questions.map((q, i) => `
            <div class="theory-card" id="${prefix}-q${i}">
                <strong>Q${i + 1}: ${q.q}</strong>
                <div style="display:grid; gap:12px; margin-top:16px;">
                    ${q.options.map((opt, oi) => `
                        <label class="mcq-option" data-name="${prefix}-q${i}" for="${prefix}-q${i}-opt${oi}">
                            <input type="radio" id="${prefix}-q${i}-opt${oi}" name="${prefix}-q${i}" value="${oi}"> ${opt}
                        </label>
                    `).join('')}
                </div>
                <div class="mcq-status" style="margin-top:12px; font-weight:800; display:none;"></div>
            </div>
        `).join('');
        html += `<button class="btn-sim primary" style="margin-top:24px; width:100%;" id="submit-${prefix}">Submit Final Answers</button>`;
        container.innerHTML = html;

        // Interactive selection feedback
        container.querySelectorAll('.mcq-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const name = opt.getAttribute('data-name');
                container.querySelectorAll(`.mcq-option[data-name="${name}"]`).forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        document.getElementById(`submit-${prefix}`).addEventListener('click', () => {
            let correctCount = 0;
            questions.forEach((q, i) => {
                const selected = container.querySelector(`input[name="${prefix}-q${i}"]:checked`);
                const status = document.getElementById(`${prefix}-q${i}`).querySelector('.mcq-status');
                status.style.display = 'block';
                if (selected && parseInt(selected.value) === q.correct) {
                    correctCount++; status.textContent = 'Correct Answer ✓'; status.style.color = 'var(--success)';
                } else {
                    status.textContent = `Incorrect. Correct: ${q.options[q.correct]}`; status.style.color = 'var(--danger)';
                }
            });
            const scorePercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 100;
            currentScore += scorePercent;
            document.getElementById('scoreDisplay').innerHTML = `<span>🏆</span> Score: ${currentScore}`;
            if (correctCount >= 0) {
                // Save state to unlock next sections
                if (prefix === 'pre') {
                    const labId = document.getElementById('labSelect').value;
                    const state = JSON.parse(localStorage.getItem(`vlab_state_${labId}`) || '{}');
                    state.pretest = true;
                    localStorage.setItem(`vlab_state_${labId}`, JSON.stringify(state));
                    alert(`Pretest Submitted! Simulation and Experiment sections are now UNLOCKED for this lab. 🚀`);
                    syncProgress(labId, { pretest: true, pretestScore: scorePercent });
                }
 
                if (prefix === 'post') {
                    const labId = document.getElementById('labSelect').value;
                    const feedback = document.getElementById('student-feedback')?.value || "";
                    const labData = window.VLAB_DATA[labId] || { title: "Custom Experiment" };
 
                    syncProgress(labId, {
                        posttest: true,
                        posttestScore: scorePercent,
                        completed: true,
                        feedback: feedback
                    });
 
                    document.getElementById('cert-user-name').textContent = localStorage.getItem('vlab_user_name') || 'Atharva Gandhi';
                    document.getElementById('cert-lab-name').textContent = labData.title;
                    document.getElementById('cert-date').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
 
                    // Auto-generate report in background and prompt user
                    console.log("Auto-capturing simulation state for report...");
 
                    setTimeout(() => {
                        document.getElementById('certModal').style.display = 'flex';
                    }, 1000);
                } else {
                    alert(`Section Complete! Accuracy: ${scorePercent}%`);
                }
            }
        });
    };

    // Sidebar Navigation with Locked States
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const sid = item.getAttribute('data-section');
            const labId = document.getElementById('labSelect').value;
            const state = JSON.parse(localStorage.getItem(`vlab_state_${labId}`) || '{"pretest":false}');

            const initialMode = localStorage.getItem('vlab_current_mode') || 'learning';
            
            // 1. Aggressive Cleanup: Hide ALL sections and remove active states
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
                sec.style.display = 'none'; // Explicitly hide to prevent overlap
            });
            document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
            
            // 2. Stop any running simulation engines to free up resources
            if (window.currentSim) { window.currentSim.isRunning = false; }

            // 3. Pedagogical Lock Check
            if ((sid === 'simulation' || sid === 'experiment') && !state.pretest && labId !== 'practice' && initialMode !== 'sandbox') {
                item.classList.add('active');
                const container = document.getElementById(`section-${sid}`);
                container.classList.add('active');
                container.style.display = 'flex';
                container.innerHTML = `
                    <div class="locked-overlay">
                        <div style="font-size:64px; margin-bottom:24px;">🔒</div>
                        <h2 style="font-size:28px; margin-bottom:16px;">Section Locked</h2>
                        <p style="color:var(--text-muted); max-width:400px; margin:0 auto 32px;">To maintain academic integrity, you must complete the <b>Pretest</b> before accessing this module.</p>
                        <button class="btn-sim primary" onclick="document.querySelector('[data-section=\\'pretest\\']').click()">Go to Pretest</button>
                    </div>
                `;
                return;
            }

            // 4. Activate target section
            item.classList.add('active');
            const targetSection = document.getElementById(`section-${sid}`);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'flex';
            }

            if (sid === 'simulation') initSimulation(labId);
            if (sid === 'experiment') initExperiment(labId);
            if (sid === 'practice_tasks') {
                const pData = window.VLAB_DATA[labId];
                const pSection = document.getElementById('section-practice_tasks');
                if (pSection && pData) {
                    pSection.innerHTML = `
                        <h1 class="section-title">Academic Practice & Review</h1>
                        <div class="section-body">
                            <h3>Hands-on Exercises</h3>
                            <p style="color:var(--text-muted); margin-bottom:15px;">Try executing these commands in the <b>Experiment</b> CLI to observe behavior.</p>
                            <div class="task-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-top:20px;">
                                ${(pData.practice_commands || []).map(cmd => `
                                    <div class="theory-card" style="border-left:4px solid var(--primary); padding:15px;">
                                        <div style="font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:800;">CLI EXERCISE</div>
                                        <code style="background:#000; color:#10b981; padding:6px 10px; border-radius:6px; display:block; font-size:12px; font-family:var(--font-mono);">${cmd}</code>
                                    </div>
                                `).join('')}
                            </div>
                            <h3 style="margin-top:40px;">Review Questions</h3>
                            <div class="theory-card" style="background:rgba(37,99,235,0.03); border:1px solid rgba(37,99,235,0.1);">
                                <ul style="list-style:none; padding:0;">
                                    ${(pData.practice_questions || []).map(q => `
                                        <li style="margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid rgba(0,0,0,0.05);">
                                            <b style="color:var(--primary);">Q:</b> ${q}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                }
            }
        });
    });
    const initSubnetCalc = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:24px; margin:0;">IP Subnetting & Addressing Lab</div></div>
            <div class="sim-workspace" style="gap:20px; padding:20px;">
                <div class="theory-card" style="flex:1; max-width:500px;">
                    <h3 style="margin-bottom:15px; color:var(--primary);">Subnet Calculator</h3>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Network IP:</label>
                        <input type="text" id="calcIP" class="sim-select" style="width:100%;" placeholder="e.g. 192.168.1.0">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Subnet Mask:</label>
                        <select id="calcMask" class="sim-select" style="width:100%;">
                            <option value="24">/24 (255.255.255.0)</option>
                            <option value="25">/25 (255.255.255.128)</option>
                            <option value="26">/26 (255.255.255.192)</option>
                            <option value="27">/27 (255.255.255.224)</option>
                            <option value="28">/28 (255.255.255.240)</option>
                        </select>
                    </div>
                    <button id="btnCalc" class="btn-sim primary" style="width:100%;">Analyze Network</button>
                    <div id="calcResult" style="margin-top:20px; font-family:var(--font-mono); font-size:12px; display:none;">
                        <div style="padding:15px; background:rgba(37,99,235,0.05); border:1px solid var(--primary); border-radius:10px;">
                            <p><b>Network ID:</b> <span id="resNet" style="color:var(--primary);"></span></p>
                            <p><b>Broadcast:</b> <span id="resBroad" style="color:var(--danger);"></span></p>
                            <p><b>Valid Hosts:</b> <span id="resRange"></span></p>
                            <p><b>Capacity:</b> <span id="resHosts"></span> hosts</p>
                        </div>
                    </div>
                </div>
                <div class="theory-card" style="flex:1; background:var(--glass);">
                    <h3 style="margin-bottom:15px; color:var(--success);">Practice Challenge</h3>
                    <div id="challengeBox">
                        <p id="challengeText" style="font-size:14px; margin-bottom:20px;"><b>Task:</b> Divide 192.168.10.0 into subnets that can hold 30 hosts each. What is the required CIDR?</p>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="challengeAns" class="sim-select" style="flex:1;" placeholder="Enter CIDR (e.g. /26)">
                            <button id="btnCheckChallenge" class="btn-sim success">Submit</button>
                        </div>
                        <div id="challengeFeedback" style="margin-top:15px; font-weight:700;"></div>
                    </div>
                </div>
            </div>
        `;
        const btn = document.getElementById('btnCalc');
        btn.onclick = () => {
            const ip = document.getElementById('calcIP').value;
            const mask = parseInt(document.getElementById('calcMask').value);
            if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) { alert("Invalid IP"); return; }
            const ipToUint = (ip) => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
            const uintToIp = (u) => [(u >>> 24) & 0xff, (u >>> 16) & 0xff, (u >>> 8) & 0xff, u & 0xff].join('.');
            const ipUint = ipToUint(ip);
            const maskUint = ((0xffffffff << (32 - mask)) >>> 0);
            const netUint = (ipUint & maskUint) >>> 0;
            const broadUint = (netUint | ~maskUint) >>> 0;
            const res = document.getElementById('calcResult');
            res.style.display = 'block';
            document.getElementById('resNet').textContent = `${uintToIp(netUint)} /${mask}`;
            document.getElementById('resBroad').textContent = uintToIp(broadUint);
            document.getElementById('resRange').textContent = `${uintToIp(netUint + 1)} - ${uintToIp(broadUint - 1)}`;
            document.getElementById('resHosts').textContent = Math.pow(2, 32 - mask) - 2;
        };

        const btnCheck = document.getElementById('btnCheckChallenge');
        if (btnCheck) {
            btnCheck.onclick = () => {
                const ans = document.getElementById('challengeAns').value.trim();
                const feedback = document.getElementById('challengeFeedback');
                if (ans === '/27' || ans === '27') {
                    feedback.textContent = "✅ Correct! 2^(32-27) - 2 = 30 usable hosts.";
                    feedback.style.color = "#10b981";
                } else {
                    feedback.textContent = "❌ Incorrect. Try again. (Hint: 2^5 = 32)";
                    feedback.style.color = "#ef4444";
                }
            };
        }
    };

    const initIpSorter = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:24px; margin:0;">IP Class Sorter Challenge</div></div>
            <div class="sim-workspace" style="flex-direction:column; align-items:center; padding:40px;">
                <p style="margin-bottom:20px; color:var(--text-muted);">Drag the IP addresses into their correct Class buckets.</p>
                <div id="ip-pool" style="display:flex; gap:10px; margin-bottom:40px; flex-wrap:wrap; justify-content:center;">
                    ${['10.0.0.1', '172.16.0.1', '192.168.1.1', '8.8.8.8', '128.0.0.1', '200.1.1.1'].map(ip => `<div class="btn-sim" draggable="true" ondragstart="event.dataTransfer.setData('text', '${ip}')">${ip}</div>`).join('')}
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; width:100%; max-width:800px;">
                    <div class="theory-card bucket" data-class="A" ondragover="event.preventDefault()" ondrop="handleIpDrop(event, 'A')" style="text-align:center;"><strong>Class A</strong><div class="bucket-list"></div></div>
                    <div class="theory-card bucket" data-class="B" ondragover="event.preventDefault()" ondrop="handleIpDrop(event, 'B')" style="text-align:center;"><strong>Class B</strong><div class="bucket-list"></div></div>
                    <div class="theory-card bucket" data-class="C" ondragover="event.preventDefault()" ondrop="handleIpDrop(event, 'C')" style="text-align:center;"><strong>Class C</strong><div class="bucket-list"></div></div>
                </div>
                <button class="btn-sim primary" style="margin-top:40px;" id="btnCheckSorter">Check Results</button>
            </div>
        `;
        window.handleIpDrop = (e, targetClass) => {
            e.preventDefault();
            const ip = e.dataTransfer.getData('text');
            const bucket = e.currentTarget.querySelector('.bucket-list');
            const el = document.createElement('div');
            el.className = 'btn-sim';
            el.style.margin = '5px auto';
            el.textContent = ip;
            el.dataset.ip = ip;
            bucket.appendChild(el);
            document.querySelectorAll('#ip-pool .btn-sim').forEach(item => { if (item.textContent === ip) item.style.display = 'none'; });
        };
        document.getElementById('btnCheckSorter').onclick = () => {
            let correct = 0;
            document.querySelectorAll('.bucket').forEach(bucket => {
                const target = bucket.dataset.class;
                bucket.querySelectorAll('[data-ip]').forEach(item => {
                    const firstOctet = parseInt(item.dataset.ip.split('.')[0]);
                    let actual = '';
                    if (firstOctet >= 1 && firstOctet <= 126) actual = 'A';
                    else if (firstOctet >= 128 && firstOctet <= 191) actual = 'B';
                    else if (firstOctet >= 192 && firstOctet <= 223) actual = 'C';
                    if (actual === target) { correct++; item.style.color = '#10b981'; }
                    else item.style.color = '#ef4444';
                });
            });
            alert(`You got ${correct} IPs correctly classified!`);
        };
    };

    const initCmdChallenge = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:24px; margin:0;">Terminal Command Challenge</div></div>
            <div class="sim-workspace" style="padding:40px; justify-content:center;">
                <div class="theory-card" style="width:100%; max-width:700px;">
                    <div id="cmdTask" style="margin-bottom:20px; font-weight:800; color:#2563eb;">Task: Check the reachability of '127.0.0.1'</div>
                    <div class="terminal-area" style="height:300px; background:#000; border-radius:10px; overflow-y:auto; padding:20px; font-family:monospace;">
                        <div id="cmdOutput">C:\\Users\\Student> _</div>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <input type="text" id="cmdChallengeInput" class="sim-select" style="background:#000; color:#0f0; border:none; flex:1; outline:none;" placeholder="Type command here...">
                        </div>
                    </div>
                </div>
            </div>
        `;
        const input = document.getElementById('cmdChallengeInput');
        const output = document.getElementById('cmdOutput');
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                output.innerHTML += `<div>C:\\Users\\Student> ${cmd}</div>`;
                if (cmd === 'ping 127.0.0.1') {
                    output.innerHTML += `<div style="color:#0f0;">Pinging 127.0.0.1 with 32 bytes of data:<br>Reply from 127.0.0.1: bytes=32 time<1ms TTL=128<br>...Success! Task Completed.</div>`;
                    document.getElementById('cmdTask').textContent = "Task: Display your current network configuration";
                } else if (cmd === 'ipconfig') {
                    output.innerHTML += `<div style="color:#0f0;">Ethernet adapter Ethernet:<br>   IPv4 Address. . . . . . . . . . . : 192.168.1.100<br>   Subnet Mask . . . . . . . . . . . : 255.255.255.0</div>`;
                } else {
                    output.innerHTML += `<div style="color:#f00;">'${cmd}' is not recognized as an internal or external command.</div>`;
                }
                input.value = '';
                output.scrollTop = output.scrollHeight;
            }
        };
    };

    const initMediaStudy = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:24px; margin:0;">Physical Layer Hardware Study</div></div>
            <div class="sim-workspace" style="padding:40px; gap:30px; overflow-y:auto; justify-content:center; align-items:flex-start;">
                <div class="theory-card" style="flex:1; min-width:280px; transition:transform 0.3s; cursor:pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding:30px; border-radius:12px; margin-bottom:20px; display:flex; justify-content:center;">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>
                    </div>
                    <h3 style="color:var(--primary); margin-bottom:10px;">UTP (Category 6)</h3>
                    <p style="font-size:13px; line-height:1.6; color:var(--text-muted);">Unshielded Twisted Pair. Uses differential signaling to cancel electromagnetic interference. Supports 10Gbps up to 55 meters.</p>
                    <ul style="font-size:12px; margin-top:15px; color:var(--primary); font-weight:700;">
                        <li>• Max Distance: 100m</li>
                        <li>• Bandwidth: 250 MHz</li>
                        <li>• Impedance: 100 Ohms</li>
                    </ul>
                </div>
                <div class="theory-card" style="flex:1; min-width:280px; transition:transform 0.3s; cursor:pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding:30px; border-radius:12px; margin-bottom:20px; display:flex; justify-content:center;">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
                    </div>
                    <h3 style="color:#d97706; margin-bottom:10px;">Fiber Optic (Single-Mode)</h3>
                    <p style="font-size:13px; line-height:1.6; color:var(--text-muted);">Transmits data as light pulses through a glass core. Immune to EMI and supports extremely high bandwidth over long distances.</p>
                    <ul style="font-size:12px; margin-top:15px; color:#d97706; font-weight:700;">
                        <li>• Max Distance: 40km+</li>
                        <li>• Light Source: Laser</li>
                        <li>• Core Diameter: 9 Microns</li>
                    </ul>
                </div>
                <div class="theory-card" style="flex:1; min-width:280px; transition:transform 0.3s; cursor:pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); padding:30px; border-radius:12px; margin-bottom:20px; display:flex; justify-content:center;">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M18 10h.01M15 10h.01M12 10h.01M9 10h.01"/></svg>
                    </div>
                    <h3 style="color:#059669; margin-bottom:10px;">RJ-45 Connector</h3>
                    <p style="font-size:13px; line-height:1.6; color:var(--text-muted);">Standard 8P8C connector used for Ethernet cabling. Follows T568A or T568B wiring standards for pinout configuration.</p>
                    <ul style="font-size:12px; margin-top:15px; color:#059669; font-weight:700;">
                        <li>• Pins: 8</li>
                        <li>• Material: Polycarbonate</li>
                        <li>• Standard: IEC 60603-7</li>
                    </ul>
                </div>
                <div class="theory-card" style="width:100%; margin-top:20px; border:2px dashed var(--primary); text-align:center;">
                    <h3 style="color:var(--primary); margin-bottom:10px;">Interactive Challenge: Straight vs Crossover</h3>
                    <p style="font-size:14px; margin-bottom:15px;">Which cable connects a <b>Router</b> to a <b>PC</b>?</p>
                    <div style="display:flex; justify-content:center; gap:20px;">
                        <button class="btn-sim" onclick="alert('Correct! Router to PC requires a Crossover cable (Different Layers, but Routers and PCs are both MDI devices).')">Crossover</button>
                        <button class="btn-sim" onclick="alert('Incorrect. Router and PC are both MDI (pin 1,2 TX), so they need a crossover to align TX to RX.')">Straight-Through</button>
                    </div>
                </div>
            </div>
    };

    // --- OPERATING SYSTEMS SIMULATORS ---
    const initCpuSchedulingSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">CPU Scheduling Visualizer</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                            <span>Processes Configuration</span>
                            <span style="font-size:12px; font-weight:normal; color:var(--text-muted);">Configure ready queue processes</span>
                        </h3>
                        <table class="sim-table" style="width:100%; border-collapse:collapse; margin-bottom:15px; text-align:left;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border);">
                                    <th style="padding:8px;">PID</th>
                                    <th style="padding:8px;">Arrival Time (AT)</th>
                                    <th style="padding:8px;">Burst Time (BT)</th>
                                    <th style="padding:8px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="cpuProcessRows">
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold;">P1</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="0" min="0" id="at-P1"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="4" min="1" id="bt-P1"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:4px 8px; font-size:11px;" onclick="this.closest('tr').remove();">Delete</button></td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold;">P2</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="1" min="0" id="at-P2"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="3" min="1" id="bt-P2"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:4px 8px; font-size:11px;" onclick="this.closest('tr').remove();">Delete</button></td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold;">P3</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="2" min="0" id="at-P3"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="1" min="1" id="bt-P3"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:4px 8px; font-size:11px;" onclick="this.closest('tr').remove();">Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="display:flex; gap:10px;">
                            <button id="btnAddProcess" class="btn-sim" style="flex:1;">+ Add Process</button>
                            <button id="btnRunCpuSim" class="btn-sim primary" style="flex:1;">Run Scheduler</button>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Algorithm Settings</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Scheduling Algorithm:</label>
                            <select id="cpuAlgoSelect" class="sim-select" style="width:100%;">
                                <option value="fcfs">First-Come, First-Served (FCFS)</option>
                                <option value="sjf">Shortest Job First (SJF)</option>
                                <option value="rr">Round Robin (RR)</option>
                            </select>
                        </div>
                        <div style="margin-bottom:15px; display:none;" id="quantumContainer">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Time Quantum:</label>
                            <input type="number" id="cpuQuantum" class="sim-select" style="width:100%;" value="2" min="1">
                        </div>
                        <div style="padding:15px; background:rgba(168,85,247,0.05); border:1px solid var(--border); border-radius:12px; font-size:12px; line-height:1.5;">
                            <b>Convoy Effect:</b> When short processes wait behind long ones (FCFS).<br>
                            <b>SJF Optimal:</b> SJF is mathematically optimal for minimizing average waiting times.
                        </div>
                    </div>
                </div>

                <div class="theory-card" id="cpuResultsPanel" style="width:100%; margin:0; display:none; animation: fadeIn 0.4s;">
                    <h3 style="color:var(--success); margin-bottom:15px;">Execution Gantt Chart</h3>
                    <div id="ganttChartContainer" style="display:flex; align-items:center; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; height:80px; overflow-x:auto; margin-bottom:20px; padding:10px; position:relative;">
                        <!-- Gantt blocks injected dynamically -->
                    </div>
                    
                    <h3 style="color:var(--primary); margin-bottom:15px;">Detailed Analysis Matrix</h3>
                    <table class="sim-table" style="width:100%; border-collapse:collapse; text-align:left; font-family:var(--font-mono); font-size:13px; margin-bottom:20px;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border);">
                                <th style="padding:8px;">PID</th>
                                <th style="padding:8px;">Arrival (AT)</th>
                                <th style="padding:8px;">Burst (BT)</th>
                                <th style="padding:8px;">Completion (CT)</th>
                                <th style="padding:8px;">Turnaround (TAT)</th>
                                <th style="padding:8px;">Waiting (WT)</th>
                            </tr>
                        </thead>
                        <tbody id="cpuAnalysisRows">
                        </tbody>
                    </table>
                    
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                        <div style="padding:15px; background:rgba(37,99,235,0.05); border:1px solid rgba(37,99,235,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:12px; color:var(--text-muted); font-weight:800; text-transform:uppercase;">Average Turnaround Time</div>
                            <div id="cpuAvgTAT" style="font-size:24px; font-weight:800; color:var(--primary); margin-top:5px;">0.00</div>
                        </div>
                        <div style="padding:15px; background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:12px; color:var(--text-muted); font-weight:800; text-transform:uppercase;">Average Waiting Time</div>
                            <div id="cpuAvgWT" style="font-size:24px; font-weight:800; color:var(--success); margin-top:5px;">0.00</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const cpuAlgoSelect = document.getElementById('cpuAlgoSelect');
        const quantumContainer = document.getElementById('quantumContainer');
        const cpuProcessRows = document.getElementById('cpuProcessRows');
        const btnAddProcess = document.getElementById('btnAddProcess');
        const btnRunCpuSim = document.getElementById('btnRunCpuSim');
        let procCounter = 3;

        cpuAlgoSelect.addEventListener('change', () => {
            quantumContainer.style.display = cpuAlgoSelect.value === 'rr' ? 'block' : 'none';
        });

        btnAddProcess.addEventListener('click', () => {
            procCounter++;
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border)';
            row.innerHTML = `
                <td style="padding:8px; font-weight:bold;">P${procCounter}</td>
                <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="0" min="0" id="at-P${procCounter}"></td>
                <td style="padding:8px;"><input type="number" class="sim-select" style="width:80px;" value="3" min="1" id="bt-P${procCounter}"></td>
                <td style="padding:8px;"><button class="btn-sim" style="padding:4px 8px; font-size:11px;" onclick="this.closest('tr').remove();">Delete</button></td>
            `;
            cpuProcessRows.appendChild(row);
        });

        btnRunCpuSim.addEventListener('click', () => {
            const processes = [];
            const rows = cpuProcessRows.querySelectorAll('tr');
            rows.forEach(row => {
                const pid = row.cells[0].textContent;
                const at = parseInt(row.querySelector(`[id^="at-"]`).value) || 0;
                const bt = parseInt(row.querySelector(`[id^="bt-"]`).value) || 0;
                processes.push({ pid, at, bt, tempBt: bt, ct: 0, tat: 0, wt: 0 });
            });

            if (processes.length === 0) return alert("Please configure at least one process.");

            const algo = cpuAlgoSelect.value;
            const gantt = [];
            let currentTime = 0;

            if (algo === 'fcfs') {
                processes.sort((a, b) => a.at - b.at);
                processes.forEach(p => {
                    if (currentTime < p.at) {
                        gantt.push({ pid: 'Idle', start: currentTime, end: p.at });
                        currentTime = p.at;
                    }
                    gantt.push({ pid: p.pid, start: currentTime, end: currentTime + p.bt });
                    currentTime += p.bt;
                    p.ct = currentTime;
                    p.tat = p.ct - p.at;
                    p.wt = p.tat - p.bt;
                });
            } else if (algo === 'sjf') {
                // Non-preemptive Shortest Job First
                let completed = 0;
                const n = processes.length;
                const isCompleted = new Array(n).fill(false);
                
                while (completed < n) {
                    let minIdx = -1;
                    let minBt = Infinity;
                    
                    for (let i = 0; i < n; i++) {
                        if (processes[i].at <= currentTime && !isCompleted[i]) {
                            if (processes[i].bt < minBt) {
                                minBt = processes[i].bt;
                                minIdx = i;
                            }
                        }
                    }
                    
                    if (minIdx === -1) {
                        gantt.push({ pid: 'Idle', start: currentTime, end: currentTime + 1 });
                        currentTime++;
                    } else {
                        const p = processes[minIdx];
                        gantt.push({ pid: p.pid, start: currentTime, end: currentTime + p.bt });
                        currentTime += p.bt;
                        p.ct = currentTime;
                        p.tat = p.ct - p.at;
                        p.wt = p.tat - p.bt;
                        isCompleted[minIdx] = true;
                        completed++;
                    }
                }
            } else if (algo === 'rr') {
                const quantum = parseInt(document.getElementById('cpuQuantum').value) || 2;
                let queue = [];
                processes.sort((a, b) => a.at - b.at);
                let completed = 0;
                const n = processes.length;
                let isVisited = new Array(n).fill(false);
                
                currentTime = processes[0].at;
                if (currentTime > 0) {
                    gantt.push({ pid: 'Idle', start: 0, end: currentTime });
                }
                
                queue.push(0);
                isVisited[0] = true;
                
                while (completed < n) {
                    if (queue.length === 0) {
                        let nextArr = Infinity;
                        for(let i=0; i<n; i++) {
                            if(!isVisited[i] && processes[i].at < nextArr) {
                                nextArr = processes[i].at;
                            }
                        }
                        gantt.push({ pid: 'Idle', start: currentTime, end: nextArr });
                        currentTime = nextArr;
                        for(let i=0; i<n; i++) {
                            if(processes[i].at <= currentTime && !isVisited[i]) {
                                queue.push(i);
                                isVisited[i] = true;
                            }
                        }
                    }
                    
                    const idx = queue.shift();
                    const p = processes[idx];
                    const runTime = Math.min(p.tempBt, quantum);
                    
                    gantt.push({ pid: p.pid, start: currentTime, end: currentTime + runTime });
                    currentTime += runTime;
                    p.tempBt -= runTime;
                    
                    // Add newly arrived processes to queue
                    for (let i = 0; i < n; i++) {
                        if (processes[i].at <= currentTime && !isVisited[i] && processes[i].tempBt > 0) {
                            queue.push(i);
                            isVisited[i] = true;
                        }
                    }
                    
                    if (p.tempBt > 0) {
                        queue.push(idx);
                    } else {
                        p.ct = currentTime;
                        p.tat = p.ct - p.at;
                        p.wt = p.tat - p.bt;
                        completed++;
                    }
                }
            }

            // Render Gantt
            const ganttBox = document.getElementById('ganttChartContainer');
            ganttBox.innerHTML = '';
            const totalDuration = currentTime;
            
            gantt.forEach(block => {
                const percent = ((block.end - block.start) / totalDuration) * 100;
                const div = document.createElement('div');
                const isIdle = block.pid === 'Idle';
                div.style.width = `${percent}%`;
                div.style.height = '100%';
                div.style.background = isIdle ? '#475569' : (currentSubject === 'os' ? '#a855f7' : '#2563eb');
                div.style.color = '#fff';
                div.style.display = 'flex';
                div.style.flexDirection = 'column';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'center';
                div.style.borderRight = '1px solid var(--border)';
                div.style.flexShrink = '0';
                div.innerHTML = `
                    <span style="font-weight:bold; font-size:14px;">${block.pid}</span>
                    <span style="font-size:10px; opacity:0.8;">${block.start}-${block.end}</span>
                `;
                ganttBox.appendChild(div);
            });

            // Render table
            const analysisRows = document.getElementById('cpuAnalysisRows');
            analysisRows.innerHTML = '';
            let sumTAT = 0, sumWT = 0;
            
            processes.forEach(p => {
                sumTAT += p.tat;
                sumWT += p.wt;
                analysisRows.innerHTML += `
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:8px; font-weight:bold; color:var(--primary);">${p.pid}</td>
                        <td style="padding:8px;">${p.at}</td>
                        <td style="padding:8px;">${p.bt}</td>
                        <td style="padding:8px;">${p.ct}</td>
                        <td style="padding:8px;">${p.tat}</td>
                        <td style="padding:8px;">${p.wt}</td>
                    </tr>
                `;
            });

            document.getElementById('cpuAvgTAT').textContent = (sumTAT / processes.length).toFixed(2);
            document.getElementById('cpuAvgWT').textContent = (sumWT / processes.length).toFixed(2);
            document.getElementById('cpuResultsPanel').style.display = 'block';
        });
    };

    const initProcessSyncSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Producer-Consumer Semaphore Sim</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0; text-align:center;">
                        <h3 style="color:var(--primary); margin-bottom:20px;">Shared Circular Buffer</h3>
                        <div id="bufferSlots" style="display:flex; justify-content:center; gap:15px; margin-bottom:30px;">
                            <!-- Circular slots populated dynamically -->
                        </div>
                        <div style="display:flex; justify-content:center; gap:15px; margin-bottom:20px;">
                            <button id="btnProduceSync" class="btn-sim primary">Produce Item</button>
                            <button id="btnConsumeSync" class="btn-sim success">Consume Item</button>
                            <button id="btnAutoSync" class="btn-sim">Toggle Auto Play</button>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Semaphores status</h3>
                        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <span><b>Mutex (Mutual Exclusion):</b></span>
                                <span id="syncMutex" style="font-family:var(--font-mono); font-weight:800; color:var(--success);">1</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <span><b>Empty Slots Semaphore:</b></span>
                                <span id="syncEmpty" style="font-family:var(--font-mono); font-weight:800; color:var(--primary);">5</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <span><b>Full Slots Semaphore:</b></span>
                                <span id="syncFull" style="font-family:var(--font-mono); font-weight:800; color:var(--warning);">0</span>
                            </div>
                        </div>
                        <div style="padding:12px; background:rgba(16,185,129,0.05); border:1px solid var(--border); border-radius:10px; font-size:12px; line-height:1.4;">
                            • <b>empty</b> blocks producer when buffer is full (0).<br>
                            • <b>full</b> blocks consumer when buffer is empty (0).<br>
                            • <b>mutex</b> ensures critical section exclusivity.
                        </div>
                    </div>
                </div>

                <div class="theory-card" style="width:100%; margin:0;">
                    <h3 style="color:var(--primary); margin-bottom:15px;">Pedagogical Operation Logger</h3>
                    <div id="syncLog" style="height:150px; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; padding:15px; font-family:var(--font-mono); font-size:12px; overflow-y:auto; color:var(--text-main); text-align:left;">
                        <div style="color:var(--text-muted);">&gt; Semaphores initialized. Buffer empty. Waiting for operations...</div>
                    </div>
                </div>
            </div>
        `;

        const bufferSlots = document.getElementById('bufferSlots');
        const syncMutex = document.getElementById('syncMutex');
        const syncEmpty = document.getElementById('syncEmpty');
        const syncFull = document.getElementById('syncFull');
        const syncLog = document.getElementById('syncLog');

        const bufferSize = 5;
        let buffer = new Array(bufferSize).fill(null);
        let inPtr = 0;
        let outPtr = 0;
        let count = 0;

        let autoPlayTimer = null;

        const updateBufferUI = () => {
            bufferSlots.innerHTML = '';
            for (let i = 0; i < bufferSize; i++) {
                const slot = document.createElement('div');
                slot.style.cssText = `
                    width: 60px; height: 60px; border-radius: 12px;
                    border: 2px solid ${buffer[i] ? 'var(--primary)' : 'var(--border)'};
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px; position: relative; background: var(--container-bg);
                    transition: all 0.3s ease;
                `;
                if (buffer[i]) {
                    slot.style.boxShadow = '0 0 15px rgba(168,85,247,0.2)';
                    slot.innerHTML = '📦';
                    const idx = document.createElement('span');
                    idx.textContent = `Item ${buffer[i]}`;
                    idx.style.cssText = 'font-size:9px; position:absolute; bottom:2px; color:var(--text-muted);';
                    slot.appendChild(idx);
                } else {
                    slot.innerHTML = '⚙️';
                    slot.style.opacity = '0.4';
                }
                bufferSlots.appendChild(slot);
            }
            syncMutex.textContent = '1';
            syncEmpty.textContent = bufferSize - count;
            syncFull.textContent = count;
        };

        const logOp = (msg, type = 'info') => {
            const div = document.createElement('div');
            const color = type === 'produce' ? 'var(--primary)' : (type === 'consume' ? 'var(--success)' : 'var(--danger)');
            div.innerHTML = `<span style="color:${color}; font-weight:800;">&gt;</span> ${msg}`;
            syncLog.appendChild(div);
            syncLog.scrollTop = syncLog.scrollHeight;
        };

        updateBufferUI();

        document.getElementById('btnProduceSync').addEventListener('click', () => {
            if (count >= bufferSize) {
                logOp("PRODUCER BLOCKED: Buffer is full! (empty semaphore = 0)", "error");
                return;
            }
            const itemId = Math.floor(Math.random() * 900) + 100;
            logOp(`Producer calls wait(empty) -> empty=${bufferSize - count - 1}`, "info");
            logOp(`Producer enters critical section: wait(mutex)`, "info");
            buffer[inPtr] = itemId;
            logOp(`Producer added Item ${itemId} at slot ${inPtr + 1}`, "produce");
            inPtr = (inPtr + 1) % bufferSize;
            count++;
            logOp(`Producer exits critical section: signal(mutex)`, "info");
            logOp(`Producer signals full -> full=${count}`, "info");
            updateBufferUI();
        });

        document.getElementById('btnConsumeSync').addEventListener('click', () => {
            if (count === 0) {
                logOp("CONSUMER BLOCKED: Buffer is empty! (full semaphore = 0)", "error");
                return;
            }
            logOp(`Consumer calls wait(full) -> full=${count - 1}`, "info");
            logOp(`Consumer enters critical section: wait(mutex)`, "info");
            const item = buffer[outPtr];
            buffer[outPtr] = null;
            logOp(`Consumer retrieved Item ${item} from slot ${outPtr + 1}`, "consume");
            outPtr = (outPtr + 1) % bufferSize;
            count--;
            logOp(`Consumer exits critical section: signal(mutex)`, "info");
            logOp(`Consumer signals empty -> empty=${bufferSize - count}`, "info");
            updateBufferUI();
        });

        document.getElementById('btnAutoSync').addEventListener('click', () => {
            const btn = document.getElementById('btnAutoSync');
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
                btn.textContent = "Toggle Auto Play";
                btn.classList.remove('primary');
            } else {
                btn.textContent = "Stop Auto Play";
                btn.classList.add('primary');
                autoPlayTimer = setInterval(() => {
                    if (Math.random() > 0.4) {
                        document.getElementById('btnProduceSync').click();
                    } else {
                        document.getElementById('btnConsumeSync').click();
                    }
                }, 1500);
            }
        });
    };

    const initBankersSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Banker's Deadlock Avoidance Sim</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:2; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">System Resource State</h3>
                        <table class="sim-table" style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border);">
                                    <th style="padding:6px;">Process</th>
                                    <th style="padding:6px; background:rgba(37,99,235,0.05);">Allocation (A B C)</th>
                                    <th style="padding:6px; background:rgba(168,85,247,0.05);">Max Demand (A B C)</th>
                                    <th style="padding:6px; background:rgba(245,158,11,0.05);">Remaining Need (A B C)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P0</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P0" class="sim-select" style="width:60px; text-align:center;" value="0 1 0"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P0" class="sim-select" style="width:60px; text-align:center;" value="7 5 3"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:var(--font-mono); font-weight:bold;" id="need-P0">7 4 3</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P1</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P1" class="sim-select" style="width:60px; text-align:center;" value="2 0 0"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P1" class="sim-select" style="width:60px; text-align:center;" value="3 2 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:var(--font-mono); font-weight:bold;" id="need-P1">1 2 2</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P2</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P2" class="sim-select" style="width:60px; text-align:center;" value="3 0 2"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P2" class="sim-select" style="width:60px; text-align:center;" value="9 0 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:var(--font-mono); font-weight:bold;" id="need-P2">6 0 0</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P3</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P3" class="sim-select" style="width:60px; text-align:center;" value="2 1 1"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P3" class="sim-select" style="width:60px; text-align:center;" value="2 2 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:var(--font-mono); font-weight:bold;" id="need-P3">0 1 1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">System Vectors</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Available Resources (A B C):</label>
                            <input type="text" id="bankersAvail" class="sim-select" style="width:100%; text-align:center; font-family:var(--font-mono); font-weight:800;" value="3 3 2">
                        </div>
                        <div style="display:flex; gap:10px; margin-bottom:15px;">
                            <button id="btnRecalcNeed" class="btn-sim" style="flex:1;">Recalculate Need</button>
                            <button id="btnCheckSafety" class="btn-sim primary" style="flex:1;">Check Safety</button>
                        </div>
                        <div id="safetyResultBox" style="padding:12px; background:rgba(16,185,129,0.05); border:1px solid var(--border); border-radius:10px; font-size:12px; line-height:1.4; font-weight:800; display:none; text-align:center;">
                            <!-- Safety result loaded dynamically -->
                        </div>
                    </div>
                </div>

                <div style="display:flex; gap:20px; width:100%; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:12px;">Safety Verification Trace Log</h3>
                        <div id="bankersLog" style="height:140px; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; padding:15px; font-family:var(--font-mono); font-size:12px; overflow-y:auto; color:var(--text-main); text-align:left;">
                            <div style="color:var(--text-muted);">&gt; System state initialized. Ready for safety test.</div>
                        </div>
                    </div>
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--warning); margin-bottom:12px;">Simulate Resource Request</h3>
                        <div style="display:flex; gap:10px; align-items:center; margin-bottom:12px;">
                            <select id="reqPid" class="sim-select" style="width:80px;">
                                <option value="0">P0</option>
                                <option value="1">P1</option>
                                <option value="2">P2</option>
                                <option value="3">P3</option>
                            </select>
                            <input type="text" id="reqVector" class="sim-select" style="flex:1; text-align:center; font-family:var(--font-mono);" value="1 0 2" placeholder="e.g. 1 0 2">
                        </div>
                        <button id="btnRequestBankers" class="btn-sim warning" style="width:100%;">Evaluate Request</button>
                    </div>
                </div>
            </div>
        `;

        const logBankers = (msg, type = 'info') => {
            const div = document.createElement('div');
            const color = type === 'success' ? 'var(--success)' : (type === 'danger' ? 'var(--danger)' : 'var(--text-main)');
            div.innerHTML = `<span style="color:${color}; font-weight:800;">&gt;</span> ${msg}`;
            const logBox = document.getElementById('bankersLog');
            logBox.appendChild(div);
            logBox.scrollTop = logBox.scrollHeight;
        };

        const getMatrices = () => {
            const alloc = [], max = [], need = [];
            const avail = document.getElementById('bankersAvail').value.trim().split(/\s+/).map(Number);
            
            for (let i = 0; i < 4; i++) {
                const a = document.getElementById(`alloc-P${i}`).value.trim().split(/\s+/).map(Number);
                const m = document.getElementById(`max-P${i}`).value.trim().split(/\s+/).map(Number);
                const n = m.map((val, idx) => val - a[idx]);
                alloc.push(a);
                max.push(m);
                need.push(n);
                document.getElementById(`need-P${i}`).textContent = n.join(' ');
            }
            return { alloc, max, need, avail };
        };

        document.getElementById('btnRecalcNeed').addEventListener('click', () => {
            getMatrices();
            logBankers("Recalculated process remaining need vectors successfully.");
        });

        const checkSafetyState = () => {
            const { alloc, need, avail } = getMatrices();
            const work = [...avail];
            const finish = new Array(4).fill(false);
            const safeSeq = [];
            
            logBankers(`Safety Algorithm started. Work vector: [${work.join(', ')}]`);
            let count = 0;
            
            while (count < 4) {
                let found = false;
                for (let i = 0; i < 4; i++) {
                    if (!finish[i]) {
                        // Check if Need <= Work
                        let possible = true;
                        for (let j = 0; j < 3; j++) {
                            if (need[i][j] > work[j]) {
                                possible = false;
                                break;
                            }
                        }
                        
                        if (possible) {
                            logBankers(`Process P${i} requirements [${need[i].join(', ')}] are <= Work [${work.join(', ')}]. Process can run.`);
                            for (let j = 0; j < 3; j++) {
                                work[j] += alloc[i][j];
                            }
                            finish[i] = true;
                            safeSeq.push(`P${i}`);
                            logBankers(`P${i} released resources. New Work: [${work.join(', ')}]`);
                            found = true;
                            count++;
                            break;
                        }
                    }
                }
                if (!found) break;
            }

            const resultBox = document.getElementById('safetyResultBox');
            resultBox.style.display = 'block';
            if (count === 4) {
                resultBox.style.background = 'rgba(16,185,129,0.1)';
                resultBox.style.borderColor = 'var(--success)';
                resultBox.style.color = 'var(--success)';
                resultBox.innerHTML = `SAFE STATE DETECTED<br>Sequence: &lt;${safeSeq.join(', ')}&gt;`;
                logBankers(`SYSTEM SAFE: Safe sequence found: <${safeSeq.join(', ')}>`, 'success');
                return true;
            } else {
                resultBox.style.background = 'rgba(239,68,68,0.1)';
                resultBox.style.borderColor = 'var(--danger)';
                resultBox.style.color = 'var(--danger)';
                resultBox.innerHTML = `UNSAFE STATE DETECTED<br>Potential Deadlock State!`;
                logBankers("SYSTEM UNSAFE: No valid scheduling execution sequence avoids circular dependency!", "danger");
                return false;
            }
        };

        document.getElementById('btnCheckSafety').addEventListener('click', checkSafetyState);

        document.getElementById('btnRequestBankers').addEventListener('click', () => {
            const reqPid = parseInt(document.getElementById('reqPid').value);
            const req = document.getElementById('reqVector').value.trim().split(/\s+/).map(Number);
            const { alloc, need, avail } = getMatrices();

            logBankers(`Resource Request Evaluation: P${reqPid} requests [${req.join(', ')}]`);
            
            // Check if Request <= Need
            for (let j = 0; j < 3; j++) {
                if (req[j] > need[reqPid][j]) {
                    logBankers(`Error: Process P${reqPid} requested more than its maximum need!`, 'danger');
                    return;
                }
            }

            // Check if Request <= Available
            for (let j = 0; j < 3; j++) {
                if (req[j] > avail[j]) {
                    logBankers(`Process P${reqPid} must wait: resources unavailable immediately.`, 'danger');
                    return;
                }
            }

            // Pretend to allocate
            for (let j = 0; j < 3; j++) {
                avail[j] -= req[j];
                alloc[reqPid][j] += req[j];
                need[reqPid][j] -= req[j];
            }

            // Apply to UI fields temporarily
            document.getElementById('bankersAvail').value = avail.join(' ');
            document.getElementById(`alloc-P${reqPid}`).value = alloc[reqPid].join(' ');
            getMatrices();

            logBankers("Pretending to allocate resources. Running safety algorithm check...");
            const safe = checkSafetyState();

            if (safe) {
                logBankers("Request Approved: Safe state preserved. Allocation complete.", 'success');
            } else {
                logBankers("Request Denied: Reverting allocation. Deadlock danger detected.", 'danger');
                // Revert
                for (let j = 0; j < 3; j++) {
                    avail[j] += req[j];
                    alloc[reqPid][j] -= req[j];
                }
                document.getElementById('bankersAvail').value = avail.join(' ');
                document.getElementById(`alloc-P${reqPid}`).value = alloc[reqPid].join(' ');
                getMatrices();
                checkSafetyState();
            }
        });
    };

    const initPageReplacementSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Page Replacement Visualizer</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Algorithm & Reference Parameters</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Reference String (comma separated):</label>
                            <input type="text" id="refString" class="sim-select" style="width:100%; font-family:var(--font-mono);" value="7,0,1,2,0,3,0,4,2,3,0,3,2">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
                            <div>
                                <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Number of Frames (2-6):</label>
                                <input type="number" id="frameLimit" class="sim-select" style="width:100%;" value="3" min="2" max="6">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Replacement Algorithm:</label>
                                <select id="pageAlgoSelect" class="sim-select" style="width:100%;">
                                    <option value="fifo">First-In-First-Out (FIFO)</option>
                                    <option value="lru">Least Recently Used (LRU)</option>
                                    <option value="optimal">Optimal</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button id="btnResetPageSim" class="btn-sim" style="flex:1;">Reset</button>
                            <button id="btnStepPageSim" class="btn-sim primary" style="flex:1;">Next Step</button>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0; text-align:center; display:flex; flex-direction:column; justify-content:center;">
                        <div style="margin-bottom:15px;">
                            <div style="font-size:12px; color:var(--text-muted); font-weight:800;">PAGE FAULTS COUNT</div>
                            <div id="statPageFaults" style="font-size:42px; font-weight:800; color:var(--danger);">0</div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div style="padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <div style="font-size:10px; color:var(--text-muted);">PAGE HITS</div>
                                <div id="statPageHits" style="font-size:18px; font-weight:800; color:var(--success);">0</div>
                            </div>
                            <div style="padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <div style="font-size:10px; color:var(--text-muted);">FAULT RATIO</div>
                                <div id="statPageRatio" style="font-size:18px; font-weight:800; color:var(--danger);">0%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="theory-card" id="pageTimelinePanel" style="width:100%; margin:0; overflow-x:auto;">
                    <h3 style="color:var(--primary); margin-bottom:15px;">Paging Execution Matrix</h3>
                    <div id="pageTableWrapper">
                        <table class="sim-table" style="border-collapse:collapse; text-align:center; font-family:var(--font-mono); font-size:14px; min-width:100%;">
                            <thead id="pageHeaderRow"></thead>
                            <tbody id="pageFramesBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const refInput = document.getElementById('refString');
        const frameLimitInput = document.getElementById('frameLimit');
        const pageAlgoSelect = document.getElementById('pageAlgoSelect');
        const btnStepPageSim = document.getElementById('btnStepPageSim');
        const btnResetPageSim = document.getElementById('btnResetPageSim');

        let stepIndex = 0;
        let pageFaults = 0;
        let pageHits = 0;
        let framesState = [];
        let stepsLog = [];

        const resetPageSim = () => {
            stepIndex = 0;
            pageFaults = 0;
            pageHits = 0;
            framesState = new Array(parseInt(frameLimitInput.value) || 3).fill(null);
            stepsLog = [];
            
            document.getElementById('statPageFaults').textContent = '0';
            document.getElementById('statPageHits').textContent = '0';
            document.getElementById('statPageRatio').textContent = '0%';
            
            document.getElementById('pageHeaderRow').innerHTML = '';
            document.getElementById('pageFramesBody').innerHTML = '';
        };

        btnResetPageSim.addEventListener('click', resetPageSim);
        frameLimitInput.addEventListener('change', resetPageSim);
        pageAlgoSelect.addEventListener('change', resetPageSim);

        btnStepPageSim.addEventListener('click', () => {
            const pages = refInput.value.trim().split(',').map(s => parseInt(s.trim()));
            const framesCount = parseInt(frameLimitInput.value) || 3;
            const algo = pageAlgoSelect.value;
            
            if (stepIndex >= pages.length) return alert("Finished reference string traversal.");

            const currentPage = pages[stepIndex];
            let isHit = framesState.includes(currentPage);
            let replacedIdx = -1;

            if (isHit) {
                pageHits++;
            } else {
                pageFaults++;
                // Find empty slot
                let emptyIdx = framesState.indexOf(null);
                if (emptyIdx !== -1) {
                    framesState[emptyIdx] = currentPage;
                    replacedIdx = emptyIdx;
                } else {
                    // Evict depending on algorithm
                    if (algo === 'fifo') {
                        // FIFO Replacement: Replace first entered
                        // Queue indices simply rotate: pageFaults mod framesCount
                        const idxToEvict = (pageFaults - 1) % framesCount;
                        framesState[idxToEvict] = currentPage;
                        replacedIdx = idxToEvict;
                    } else if (algo === 'lru') {
                        // LRU Replacement: Replace least recently used
                        let oldestAccess = Infinity;
                        let idxToEvict = -1;
                        for (let f = 0; f < framesCount; f++) {
                            const val = framesState[f];
                            // Find last index of val in processed list
                            const lastIdx = pages.slice(0, stepIndex).lastIndexOf(val);
                            if (lastIdx < oldestAccess) {
                                oldestAccess = lastIdx;
                                idxToEvict = f;
                            }
                        }
                        framesState[idxToEvict] = currentPage;
                        replacedIdx = idxToEvict;
                    } else if (algo === 'optimal') {
                        // Optimal Replacement: Replace one that won't be used longest in future
                        let farthestUsage = -1;
                        let idxToEvict = -1;
                        for (let f = 0; f < framesCount; f++) {
                            const val = framesState[f];
                            let nextUsage = pages.slice(stepIndex + 1).indexOf(val);
                            if (nextUsage === -1) {
                                idxToEvict = f;
                                break; // Unused in future has highest replacement priority
                            }
                            if (nextUsage > farthestUsage) {
                                farthestUsage = nextUsage;
                                idxToEvict = f;
                            }
                        }
                        framesState[idxToEvict] = currentPage;
                        replacedIdx = idxToEvict;
                    }
                }
            }

            stepsLog.push({
                page: currentPage,
                hit: isHit,
                replacedIdx,
                frames: [...framesState]
            });

            // Re-render Page Table Matrix
            const head = document.getElementById('pageHeaderRow');
            head.innerHTML = '<th style="padding:10px; border:1px solid var(--border);">Req Page</th>' + 
                stepsLog.map((log, idx) => `<th style="padding:10px; border:1px solid var(--border); background:${log.hit ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};">${log.page}</th>`).join('');

            const body = document.getElementById('pageFramesBody');
            body.innerHTML = '';
            for (let f = 0; f < framesCount; f++) {
                let row = `<td style="padding:10px; font-weight:bold; border:1px solid var(--border);">Frame ${f + 1}</td>`;
                stepsLog.forEach(log => {
                    const isAllocated = log.frames[f] !== null && log.frames[f] !== undefined;
                    const val = isAllocated ? log.frames[f] : '-';
                    const isReplaced = log.replacedIdx === f && !log.hit;
                    row += `<td style="padding:10px; border:1px solid var(--border); font-weight:${isReplaced ? '800' : 'normal'}; color:${isReplaced ? 'var(--danger)' : 'var(--text-main)'}; background:${isReplaced ? 'rgba(239,68,68,0.15)' : 'none'};">${val}</td>`;
                });
                body.innerHTML += `<tr>${row}</tr>`;
            }

            // Append status row
            let statusRow = '<td style="padding:10px; font-weight:bold; border:1px solid var(--border);">Status</td>';
            stepsLog.forEach(log => {
                statusRow += `<td style="padding:10px; border:1px solid var(--border); font-weight:800; color:${log.hit ? 'var(--success)' : 'var(--danger)'};">${log.hit ? 'HIT' : 'FAULT'}</td>`;
            });
            body.innerHTML += `<tr>${statusRow}</tr>`;

            document.getElementById('statPageFaults').textContent = pageFaults;
            document.getElementById('statPageHits').textContent = pageHits;
            const total = pageFaults + pageHits;
            document.getElementById('statPageRatio').textContent = ((pageFaults / total) * 100).toFixed(1) + '%';

            stepIndex++;
        });

        resetPageSim();
    };

    const initDiskSchedulingSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Disk Cylinder Scheduling Sim</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Disk Request Settings</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Request Queue (tracks separated by commas):</label>
                            <input type="text" id="diskQueue" class="sim-select" style="width:100%; font-family:var(--font-mono);" value="98, 183, 37, 122, 14, 124, 65, 67">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:15px; margin-bottom:15px;">
                            <div>
                                <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Initial Head Position:</label>
                                <input type="number" id="diskInitialHead" class="sim-select" style="width:100%;" value="53" min="0" max="199">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Disk Scheduling Algorithm:</label>
                                <select id="diskAlgoSelect" class="sim-select" style="width:100%;">
                                    <option value="fcfs">FCFS (First-Come, First-Served)</option>
                                    <option value="sstf">SSTF (Shortest Seek Time First)</option>
                                    <option value="scan">SCAN (Elevator Algorithm)</option>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">SCAN Direction:</label>
                                <select id="diskScanDir" class="sim-select" style="width:100%;">
                                    <option value="left">Left (Towards cylinder 0)</option>
                                    <option value="right">Right (Towards cylinder 199)</option>
                                </select>
                            </div>
                        </div>
                        <button id="btnRunDiskSim" class="btn-sim primary" style="width:100%;">Map Seek Path</button>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0; text-align:center; display:flex; flex-direction:column; justify-content:center;">
                        <div style="margin-bottom:15px;">
                            <div style="font-size:12px; color:var(--text-muted); font-weight:800;">TOTAL HEAD MOVEMENT</div>
                            <div id="statDiskSeek" style="font-size:42px; font-weight:800; color:var(--primary);">0</div>
                            <div style="font-size:12px; color:var(--text-muted); font-weight:600;">cylinders</div>
                        </div>
                    </div>
                </div>

                <div class="theory-card" style="width:100%; margin:0;">
                    <h3 style="color:var(--primary); margin-bottom:15px;">Seek Trace Graph</h3>
                    <div style="background:var(--bg-page); padding:20px; border-radius:12px; border:1px solid var(--border); display:flex; justify-content:center;">
                        <canvas id="diskCanvas" width="600" height="300" style="max-width:100%; background:var(--dashboard-bg); border-radius:8px;"></canvas>
                    </div>
                </div>
            </div>
        `;

        const btnRunDiskSim = document.getElementById('btnRunDiskSim');
        const diskQueueInput = document.getElementById('diskQueue');
        const diskInitialHeadInput = document.getElementById('diskInitialHead');
        const diskAlgoSelect = document.getElementById('diskAlgoSelect');
        const diskScanDir = document.getElementById('diskScanDir');
        const canvas = document.getElementById('diskCanvas');
        const ctx = canvas.getContext('2d');

        // Draw initial track guidelines
        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 200; i += 20) {
                const x = 50 + (i / 200) * 500;
                ctx.beginPath();
                ctx.moveTo(x, 20);
                ctx.lineTo(x, 280);
                ctx.stroke();
                ctx.fillStyle = 'var(--text-muted)';
                ctx.font = '9px Outfit';
                ctx.fillText(i, x - 6, 15);
            }
        };

        drawGrid();

        btnRunDiskSim.addEventListener('click', () => {
            const queue = diskQueueInput.value.trim().split(',').map(s => parseInt(s.trim()));
            const initialHead = parseInt(diskInitialHeadInput.value) || 53;
            const algo = diskAlgoSelect.value;
            const direction = diskScanDir.value;

            if (queue.some(isNaN)) return alert("Please specify a valid numeric cylinder request list.");

            let seekSeq = [initialHead];
            let head = initialHead;

            if (algo === 'fcfs') {
                seekSeq = [initialHead, ...queue];
            } else if (algo === 'sstf') {
                let remaining = [...queue];
                while (remaining.length > 0) {
                    remaining.sort((a, b) => Math.abs(a - head) - Math.abs(b - head));
                    const next = remaining.shift();
                    seekSeq.push(next);
                    head = next;
                }
            } else if (algo === 'scan') {
                const left = [], right = [];
                queue.forEach(q => {
                    if (q < initialHead) left.push(q);
                    else right.push(q);
                });
                left.sort((a, b) => b - a); // descending
                right.sort((a, b) => a - b); // ascending

                if (direction === 'left') {
                    seekSeq = [initialHead, ...left, 0, ...right];
                } else {
                    seekSeq = [initialHead, ...right, 199, ...left];
                }
            }

            // Calculate movement
            let movement = 0;
            for (let i = 0; i < seekSeq.length - 1; i++) {
                movement += Math.abs(seekSeq[i] - seekSeq[i+1]);
            }
            document.getElementById('statDiskSeek').textContent = movement;

            // Draw seek trace on Canvas
            drawGrid();
            ctx.lineWidth = 2;
            ctx.strokeStyle = currentSubject === 'os' ? '#a855f7' : '#2563eb';
            ctx.fillStyle = currentSubject === 'os' ? '#c084fc' : '#60a5fa';

            const startX = 50 + (seekSeq[0] / 200) * 500;
            const yStep = 240 / (seekSeq.length - 1);
            
            // Draw lines
            ctx.beginPath();
            ctx.moveTo(startX, 40);
            for (let i = 1; i < seekSeq.length; i++) {
                const x = 50 + (seekSeq[i] / 200) * 500;
                const y = 40 + i * yStep;
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw points
            for (let i = 0; i < seekSeq.length; i++) {
                const x = 50 + (seekSeq[i] / 200) * 500;
                const y = 40 + i * yStep;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#fff';
                ctx.font = '10px Outfit';
                ctx.fillText(`P(${seekSeq[i]})`, x + 8, y + 3);
                ctx.fillStyle = currentSubject === 'os' ? '#c084fc' : '#60a5fa';
            }
        });
    };

            container.innerHTML = `
                <div class="sim-placeholder" style="text-align:center; padding:100px; color:var(--text-muted);">
                    <div style="font-size:48px; margin-bottom:20px;">🛡️</div>
                    <h2>Standard Simulation Unavailable</h2>
                    <p>This is a free-form Practice Lab. Switch to the <b>Experiment</b> tab to build your network.</p>
                </div>
            `;
            return;
        }

        if (data.simType === 'cpu_scheduling') {
            initCpuSchedulingSim(container);
            return;
        }

        if (data.simType === 'process_sync') {
            initProcessSyncSim(container);
            return;
        }

        if (data.simType === 'bankers') {
            initBankersSim(container);
            return;
        }

        if (data.simType === 'page_replacement') {
            initPageReplacementSim(container);
            return;
        }

        if (data.simType === 'disk_scheduling') {
            initDiskSchedulingSim(container);
            return;
        }

        if (data.simType === 'subnet_calc') {
            initSubnetCalc(container);
            return;
        }

        if (data.simType === 'ip_sorter') {
            initIpSorter(container);
            return;
        }

        if (data.simType === 'cmd_challenge') {
            initCmdChallenge(container);
            return;
        }

        if (data.simType === 'media_study') {
            initMediaStudy(container);
            return;
        }

        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="sim-controls">
                    <button id="btnResetSim" class="btn-sim">Reset</button>
                    <button id="btnPlaySim" class="btn-sim primary">Start Transmission</button>
                </div>
                <div class="sim-title" style="flex:1; text-align:center; font-weight:800; font-size:18px; color:var(--primary);">${data.title}</div>
                <div class="sim-options">
                    <select id="simType" class="sim-select">
                        <option value="stop-wait">Stop and Wait</option>
                        <option value="gbn">Go-Back-N</option>
                        <option value="collision">CSMA/CD</option>
                        <option value="csma_ca">CSMA/CA</option>
                    </select>
                </div>
            </div>
            <div class="sim-workspace">
                <div id="network-canvas-container" style="flex:1; position:relative;">
                    <canvas id="simCanvas"></canvas>
                    <div class="sim-legend">
                        <div class="legend-item"><span class="dot data"></span> Data PDU</div>
                        <div class="legend-item"><span class="dot ack"></span> ACK</div>
                        <div class="legend-item"><span class="dot error"></span> Collision</div>
                        <div class="legend-item"><span class="dot signal"></span> Signal</div>
                    </div>
                </div>
                <div class="sim-sidebar">
                    <div class="sim-panel" style="height:100%; display:flex; flex-direction:column;">
                        <div class="panel-header">Protocol Analysis Log</div>
                        <div id="eventList" class="event-list" style="flex:1; overflow-y:auto;"></div>
                    </div>
                </div>
            </div>
            <div class="sim-footer">
                <div class="sim-stats">
                    <span>Sent: <b id="statSent">0</b></span>
                    <span>Acked: <b id="statAck">0</b></span>
                    <span>Efficiency: <b id="statEff">0%</b></span>
                    <span>Throughput: <b id="statThroughput">0 Bps</b></span>
                </div>
                <div class="sim-status-pill">
                    <span class="pulse"></span> LIVE SIMULATION
                </div>
            </div>
            <div id="sim-overlay" class="sim-overlay-panel"></div>
        `;

        // Hide generic protocol dropdown for labs with dedicated visualizations
        const specializedTypes = ['dv_sim', 'ls_sim', 'path_sim', 'vlan_sim', 'dns', 'modulation', 'gbn', 'csma_ca', 'udp'];
        if (specializedTypes.includes(data.simType)) {
            const opts = container.querySelector('.sim-options');
            if (opts) opts.style.display = 'none';
        }

        setTimeout(() => {
            if (window.currentSim) window.currentSim.destroy();
            const sim = new NetworkingSim('simCanvas', data.simType, id);
            sim.mode = data.simType; 
            window.currentSim = sim;
            
            sim.resize();
            setTimeout(() => sim.resize(), 100);
            
            setupSimControls(sim);
        }, 100);
    };

    const handleOsCommand = (cmdStr, outputEl) => {
        const parts = cmdStr.split(/\s+/);
        const baseCmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        let output = `\nstudent@mitadt-os:~$ ${cmdStr}\n`;
        
        switch (baseCmd) {
            case 'help':
                output += `Available commands:\n` +
                          `  help                  - List all commands\n` +
                          `  clear                 - Clear terminal screen\n` +
                          `  ls                    - List workspace code files\n` +
                          `  cat [filename]        - Display code of a file\n` +
                          `  ps                    - List active processes in system\n` +
                          `  top                   - Show real-time CPU resource usage\n` +
                          `  ipcs                  - List active semaphores and shared memory segments\n` +
                          `  nice -n [val] [proc]  - Adjust process execution priority`;
                break;
            case 'clear':
                outputEl.innerHTML = `Welcome to the MIT ADT OS Shell v2.1 (Kernel: NetForge-OS)\nType 'help' to list available academic commands.\n\nstudent@mitadt-os:~$ `;
                return;
            case 'ls':
                output += `process.c    sem_prod_cons.c    banker.py    page_replacement.c    disk_sched.c`;
                break;
            case 'cat':
                if (!args[0]) {
                    output += `Usage: cat [filename]`;
                } else {
                    const fn = args[0].toLowerCase();
                    if (fn === 'process.c') {
                        output += `/* CPU Scheduling Algorithm implementation */\n#include <stdio.h>\nint main() {\n    printf("Running FCFS / SJF Scheduler...\\n");\n    return 0;\n}`;
                    } else if (fn === 'sem_prod_cons.c') {
                        output += `/* Semaphore Producer-Consumer Synchronization */\n#include <pthread.h>\n#include <semaphore.h>\nsem_t empty, full;\npthread_mutex_t mutex;`;
                    } else if (fn === 'banker.py') {
                        output += `# Banker's Algorithm Deadlock Avoidance\ndef check_safety(allocation, max_need, available):\n    # safety checking logic`;
                    } else if (fn === 'page_replacement.c') {
                        output += `/* Page Replacement Simulation - FIFO/LRU */\nvoid replace_page(int page, int frames[]) {\n    // replacement algorithm\n}`;
                    } else if (fn === 'disk_sched.c') {
                        output += `/* Disk Scheduling cylinder sweep */\nint calculate_seek_time(int queue[], int head) {\n    return total_head_movement;\n}`;
                    } else {
                        output += `cat: ${args[0]}: No such file in user workspace.`;
                    }
                }
                break;
            case 'ps':
                output += `PID   TTY      TIME     CMD       PRIORITY  STATUS\n` +
                          `1     tty1     00:00:02 init      20        RUNNING\n` +
                          `142   tty1     00:00:01 bash      20        SLEEPING\n` +
                          `205   tty1     00:00:00 ps        20        RUNNING\n` +
                          `304   tty1     00:00:05 kworker   15        IDLE`;
                break;
            case 'top':
                output += `OS Load average: 0.12, 0.08, 0.02\n` +
                          `Tasks: 4 total, 2 running, 2 sleeping\n` +
                          `CPU utilization: 4.8% user, 1.2% system, 94.0% idle\n\n` +
                          `PID   USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n` +
                          `1     student   20   0    4200   1200   1000 R   0.2   0.1   0:02.10 init\n` +
                          `142   student   20   0    5100   2100   1800 S   0.0   0.2   0:01.45 bash\n` +
                          `304   root      15  -5       0      0      0 S   0.5   0.0   0:05.12 kworker\n` +
                          `312   student   20   0    9100   3400   2100 R   4.1   0.3   0:00.08 top`;
                break;
            case 'ipcs':
                output += `------ Shared Memory Segments ------\n` +
                          `key        shmid      owner      perms      bytes      nattch     status\n` +
                          `0x00007f12 65536      student    660        1024       2\n\n` +
                          `------ Semaphore Arrays ------\n` +
                          `key        semid      owner      perms      nsems\n` +
                          `0x00007f13 98304      student    660        3\n` +
                          `  [empty: 5, full: 0, mutex: 1]`;
                break;
            case 'nice':
                if (args.length < 3 || args[0] !== '-n') {
                    output += `Usage: nice -n [increment] [process_name]`;
                } else {
                    output += `Adjusted scheduling priority for process '${args[2]}' by ${args[1]}. New Nice value: ${args[1]}.`;
                }
                break;
            default:
                output += `bash: ${baseCmd}: command not found. Type 'help' to see valid commands.`;
        }
        
        outputEl.textContent += output + '\nstudent@mitadt-os:~$ ';
        outputEl.scrollTop = outputEl.scrollHeight;
    };

    const initExperiment = (id) => {
        if (window.currentTopo) window.currentTopo.destroy();
        const container = document.getElementById('topology-builder-ui');
        if (!container) return;

        const currentSubject = localStorage.getItem('vlab_current_subject') || 'networking';
        if (currentSubject === 'os') {
            container.innerHTML = `
                <div class="terminal-workspace" style="height:100%; display:flex; flex-direction:column; background:#0b0f19; border-radius:12px; border:1px solid var(--border); overflow:hidden; font-family:var(--font-mono); color:#10b981; min-height:400px;">
                    <div style="background:#131824; padding:10px 15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:var(--text-muted); font-size:12px; font-weight:800;">OS INTERACTIVE CLI TERMINAL</span>
                        <div style="display:flex; gap:6px;">
                            <span style="width:10px; height:10px; background:#ef4444; border-radius:50%; display:inline-block;"></span>
                            <span style="width:10px; height:10px; background:#fbbf24; border-radius:50%; display:inline-block;"></span>
                            <span style="width:10px; height:10px; background:#10b981; border-radius:50%; display:inline-block;"></span>
                        </div>
                    </div>
                    <div id="osTerminalOutput" style="flex:1; padding:20px; overflow-y:auto; font-size:13px; line-height:1.6; white-space:pre-wrap; text-align:left; font-family:var(--font-mono); color:#10b981;">Welcome to the MIT ADT OS Shell v2.1 (Kernel: NetForge-OS)
Type 'help' to list available academic commands.

student@mitadt-os:~$ </div>
                    <div style="display:flex; background:#131824; border-top:1px solid var(--border); padding:10px 15px; align-items:center; gap:10px;">
                        <span style="font-weight:800; color:#a855f7;">student@mitadt-os:~$</span>
                        <input type="text" id="osTerminalInput" style="flex:1; background:transparent; border:none; color:#10b981; outline:none; font-family:var(--font-mono); font-size:13px;" placeholder="Type a command and press Enter..." autocomplete="off">
                    </div>
                </div>
            `;
            
            const termInput = document.getElementById('osTerminalInput');
            const termOutput = document.getElementById('osTerminalOutput');
            
            if (termInput) {
                termInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const cmd = termInput.value.trim();
                        termInput.value = '';
                        if (cmd) {
                            handleOsCommand(cmd, termOutput);
                        }
                    }
                });
            }
            return;
        }

        if (container) {
            const topo = new TopologySimulation(container);
            window.currentTopo = topo;

            // Lab-Specific Scenario Presets
            setTimeout(() => {
                const rect = topo.workspace.getBoundingClientRect();
                const midX = rect.width / 2;
                const midY = rect.height / 2;

                if (id === 'vlan') {
                    topo.addNode('switch', midX - 30, midY - 30, 'Core_Switch');
                    topo.addNode('pc', midX - 150, midY - 150, 'PC_V10_1');
                    topo.addNode('pc', midX + 150, midY - 150, 'PC_V10_2');
                    topo.addNode('pc', midX - 150, midY + 150, 'PC_V20_1');
                    topo.addNode('pc', midX + 150, midY + 150, 'PC_V20_2');
                    topo.showHint("VLAN Scenario Loaded: Configure VLAN 10 and 20.");
                } else if (id === 'routing_protocols' || id === 'routing_dv' || id === 'routing_ls') {
                    topo.addNode('router', midX - 200, midY, 'R1');
                    topo.addNode('router', midX, midY - 100, 'R2');
                    topo.addNode('router', midX, midY + 100, 'R3');
                    topo.addNode('router', midX + 200, midY, 'R4');
                    topo.showHint("Routing Mesh Loaded: Configure OSPF/RIP/BGP.");
                } else if (id === 'dns') {
                    topo.addNode('server', midX + 150, midY - 100, 'Root_DNS');
                    topo.addNode('server', midX + 150, midY, 'TLD_COM');
                    topo.addNode('server', midX + 150, midY + 100, 'Auth_NS');
                    topo.addNode('pc', midX - 150, midY, 'Client_PC');
                    topo.showHint("DNS Infrastructure Loaded.");
                }
            }, 300);
        }
    };

    const setupSimControls = (s) => {
        const play = document.getElementById('btnPlaySim');
        if (!play) return;

        play.addEventListener('click', () => {
            if (s.isRunning) { s.isRunning = false; play.textContent = "Resume Engine"; play.classList.add('primary'); }
            else { s.start(); play.textContent = "Pause Engine"; play.classList.remove('primary'); }
        });
        document.getElementById('btnResetSim').addEventListener('click', () => { s.reset(); play.textContent = "Start Simulation"; play.classList.add('primary'); });

        const typeSel = document.getElementById('simType');
        if (typeSel) typeSel.addEventListener('change', (e) => { s.mode = e.target.value; s.reset(); });

        const winSize = document.getElementById('windowSize');
        if (winSize) winSize.addEventListener('input', (e) => { s.windowSize = parseInt(e.target.value) || 4; s.reset(); });
    };

    // Splash Screen Handling
    const hideSplash = () => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    };
    setTimeout(hideSplash, 1500);

    document.getElementById('labSelect').addEventListener('change', (e) => {
        const targetLab = e.target.value;
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.display = 'flex';
            splash.style.opacity = '1';
        }

        // Cleanup Sandbox if we are moving AWAY from it
        const app = document.getElementById('vlab-app');
        const sandbox = document.getElementById('topology-builder-ui-sandbox');
        const floatingHome = document.querySelector('.floating-back-btn');

        if (targetLab === 'practice') {
            if (app) app.style.display = 'none';
            document.body.classList.add('sandbox-mode');
            if (!sandbox) {
                const s = document.createElement('div');
                s.id = 'topology-builder-ui-sandbox';
                s.style.cssText = "height: 100vh; width: 100vw; overflow: hidden; background: var(--bg-page);";
                document.body.appendChild(s);
            }
        } else {
            if (app) app.style.display = 'flex';
            document.body.classList.remove('sandbox-mode');
            if (sandbox) sandbox.remove();
            if (floatingHome) floatingHome.remove();
        }

        loadLab(targetLab);
        const activeSectionEl = document.querySelector('.nav-item.active');
        const activeSection = activeSectionEl ? activeSectionEl.getAttribute('data-section') : 'aim';
        
        if (activeSection === 'simulation') initSimulation(targetLab);
        if (activeSection === 'experiment') initExperiment(targetLab);

        setTimeout(() => {
            const splash2 = document.getElementById('splash-screen');
            if (splash2) {
                splash2.style.opacity = '0';
                setTimeout(() => splash2.style.display = 'none', 800);
            }
        }, 1200);
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const target = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', target);
        localStorage.setItem('vlab_theme', target);
        const toggleEl = document.getElementById('themeToggle');
        if (toggleEl.querySelector('.sun')) {
            // Already has complex inner structure (like in landing/dashboard)
        } else {
            toggleEl.innerHTML = target === 'dark' ? '🌙' : '☀️';
        }
    });

    // Technical Focus Manager: Prevent simulation hotkeys while typing
    window.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const isTyping = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
        if (isTyping && e.code === 'Space') {
            e.stopPropagation(); // Prevent spacebar from pausing sim while typing
        }
    }, true);
    document.getElementById('btnHome').addEventListener('click', () => window.location.href = 'dashboard.html');

    const currentSubject = localStorage.getItem('vlab_current_subject') || 'networking';
    const labSelectEl = document.getElementById('labSelect');
    if (labSelectEl) {
        let optionsHtml = '';
        if (currentSubject === 'os') {
            optionsHtml = `
                <option value="cpu_scheduling">1. CPU Scheduling Algorithms</option>
                <option value="process_sync">2. Process Synchronization & Semaphores</option>
                <option value="deadlock_avoidance">3. Deadlock Avoidance (Banker's)</option>
                <option value="page_replacement">4. Page Replacement Algorithms</option>
                <option value="disk_scheduling">5. Disk Scheduling Algorithms</option>
            `;
            const crumbs = document.querySelectorAll('.breadcrumb .crumb');
            if (crumbs.length >= 2) {
                crumbs[1].textContent = "Operating Systems Lab";
            }
            document.documentElement.style.setProperty('--primary', '#a855f7');
            document.documentElement.style.setProperty('--primary-rgb', '168, 85, 247');
            document.documentElement.style.setProperty('--accent', '#c084fc');
            document.title = "MIT ADT VLAB - Operating Systems";
        } else {
            optionsHtml = `
                <option value="cables_devices">1. Cables, Connectors and Networking Devices</option>
                <option value="modulation">2. Modulation Techniques (AM, FM, PCM)</option>
                <option value="net_commands">3. Networking Commands & Utilities</option>
                <option value="ip_class">4. IPv4 Address Classification</option>
                <option value="csma">5. CSMA/CD Simulation</option>
                <option value="csma_ca">6. CSMA/CA Simulation</option>
                <option value="subnet">7. Subnetting & Network Design</option>
                <option value="vlan">8. VLAN (Virtual LAN) Configuration</option>
                <option value="routing_protocols">9. Dynamic Routing (OSPF & BGP)</option>
                <option value="routing_dv">10. Distance Vector Routing Algorithm</option>
                <option value="routing_ls">11. Link State Routing Algorithm</option>
                <option value="udp">12. Chat Application using UDP</option>
                <option value="tcp">13. File Transfer using TCP</option>
                <option value="dns">14. Domain Name System (DNS)</option>
                <option value="practice" style="display:none;">Practice Lab</option>
            `;
            const crumbs = document.querySelectorAll('.breadcrumb .crumb');
            if (crumbs.length >= 2) {
                crumbs[1].textContent = "Computer Networks Lab";
            }
            document.title = "MIT ADT VLAB - Computer Networks";
        }
        labSelectEl.innerHTML = optionsHtml;
    }

    const initialLab = localStorage.getItem('vlab_current_lab') || (currentSubject === 'os' ? 'cpu_scheduling' : 'csma');
    const initialMode = localStorage.getItem('vlab_current_mode') || 'learning';
    if (labSelectEl) labSelectEl.value = initialLab;
    loadLab(initialLab);

    // Aggressive Sandbox Mode: Preserve essential UI components while clearing workspace
    if (initialMode === 'sandbox' || initialLab === 'practice') {
        document.body.classList.add('sandbox-mode');

        const app = document.getElementById('vlab-app');
        if (app) app.style.display = 'none';

        let sandboxContainer = document.getElementById('topology-builder-ui-sandbox');
        if (!sandboxContainer) {
            sandboxContainer = document.createElement('div');
            sandboxContainer.id = 'topology-builder-ui-sandbox';
            sandboxContainer.style.cssText = "height: 100vh; width: 100vw; overflow: hidden; background: var(--bg-page);";
            document.body.appendChild(sandboxContainer);
        }

        const floatingHome = document.createElement('a');
        floatingHome.href = 'dashboard.html';
        floatingHome.className = 'floating-back-btn';
        floatingHome.innerHTML = '🏠';
        floatingHome.title = 'Back to Dashboard';
        document.body.appendChild(floatingHome);

        // Re-initialize the experiment in the new clean container
        const topo = new TopologySimulation(sandboxContainer);
        window.currentTopo = topo;
    } else {
        // Start on Aim for learning mode to avoid immediate "Locked" screen confusion
        const aimTab = document.querySelector('.nav-item[data-section="aim"]');
        if (aimTab) aimTab.click();
    }
});
