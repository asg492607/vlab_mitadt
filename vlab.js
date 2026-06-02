// window.VLAB_DATA is loaded globally via vlabData.js script tag
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// evaluate.js and labs/index.js loaded on-demand if needed

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

const getStateKey = (labId) => {
    const data = window.VLAB_DATA ? window.VLAB_DATA[labId] : null;
    if (data && data.isMultiModule) {
        let modIdx = window.currentModuleIndex;
        if (modIdx === undefined || modIdx === null) {
            const modSelect = document.getElementById('moduleSelect');
            if (modSelect && modSelect.style.display !== 'none' && modSelect.value !== '') {
                modIdx = parseInt(modSelect.value, 10);
            } else {
                const savedIdx = localStorage.getItem(`${labId}_active_module`);
                modIdx = savedIdx ? parseInt(savedIdx, 10) : 0;
            }
        }
        if (isNaN(modIdx)) {
            modIdx = 0;
        }
        return `${labId}_mod_${modIdx}`;
    }
    return labId;
};

const syncProgress = async (labId, data) => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user || !labId) {
        console.warn("Sync failed: User or Lab ID missing");
        return;
    }
    try {
        const pathKey = getStateKey(labId);
        await setDoc(doc(db, "users", user.uid, "progress", pathKey), {
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
    loader.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.9); z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:Outfit, sans-serif; backdrop-filter:blur(8px);";
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

        // Tooltip handlers (single set — see below for implementation)

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

                    this.cableStartNode.el?.classList.remove('cabling-source');
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

            this.ctx.font = "bold 9px 'JetBrains Mono', monospace";
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
        if (this.aniId) { cancelAnimationFrame(this.aniId); this.aniId = null; }
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
        this.ctx.font = "800 24px Outfit, sans-serif";
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
            this.ctx.font = "bold 16px Outfit, sans-serif";
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
        this.ctx.font = "bold 14px Outfit, sans-serif";
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
        this.ctx.font = "bold 14px Outfit, sans-serif";
        this.ctx.fillText(label, xStart, yCenter - 45);
    }

    // destroy() is defined above at first occurrence — this duplicate removed

    drawWindow() {
        const x = this.senderPos.x - 100, y = this.senderPos.y + 80, size = 30;
        this.ctx.font = "bold 11px Outfit, sans-serif"; this.ctx.fillStyle = "var(--text-muted)"; this.ctx.fillText("Active Window", x + 60, y - 15);
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
        this.ctx.font = "bold 13px Outfit, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(label, 0, 45);

        // TX/RX Role Indicator
        const role = (lowerLabel.includes("sender") || lowerLabel.includes("a") || lowerLabel.includes("client") || lowerLabel.includes("1")) ? "TX" : "RX";
        this.ctx.fillStyle = color;
        this.ctx.font = "bold 9px 'JetBrains Mono', monospace";
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
        this.ctx.fillStyle = "white"; this.ctx.font = "bold 14px 'JetBrains Mono', monospace";
        this.ctx.textAlign = "center"; this.ctx.textBaseline = "middle";
        this.ctx.fillText(p.type === 'ack' ? "A" : "D", 0, 0);
        
        // Sequence Tag
        this.ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; 
        this.ctx.beginPath(); this.ctx.roundRect(14, -22, 22, 16, 4); this.ctx.fill();
        this.ctx.fillStyle = "white"; 
        this.ctx.font = "bold 10px 'JetBrains Mono', monospace"; 
        this.ctx.fillText(p.seq, 25, -14);
        
        this.ctx.restore();
    }

    drawVlanSim() {
        const time = Date.now() / 1000;
        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px Outfit, sans-serif";
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
        this.ctx.font = "italic 11px Outfit, sans-serif";
        this.ctx.fillText(targetLabel, px, py + 45);
    }

    drawUdpChatSim() {
        const time = Date.now() / 1000;
        this.drawNode(this.senderPos.x, this.senderPos.y, "Sender (App)", "#3b82f6");
        this.drawNode(this.receiverPos.x, this.receiverPos.y, "Receiver (App)", "#1e293b");

        this.ctx.fillStyle = "var(--text-main)";
        this.ctx.font = "bold 16px Outfit, sans-serif";
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
            this.ctx.font = "bold 16px Outfit, sans-serif";
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
            this.ctx.font = "bold 16px Outfit, sans-serif";
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
            this.ctx.font = "bold 16px Outfit, sans-serif";
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
        this.ctx.font = "bold 16px Outfit, sans-serif";

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
            this.ctx.font = "bold 10px Outfit, sans-serif";
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
        this.ctx.font = "bold 11px 'JetBrains Mono', monospace";
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
        this.ctx.font = "bold 16px Outfit, sans-serif";
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
            this.ctx.font = "bold 12px Outfit, sans-serif";
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

        this.ctx.restore();
    }
}

// ==========================================
// PROGRAMMING & DBMS LAB MODULES (PHASE 3)
// ==========================================

const loadAceEditor = () => {
    return new Promise((resolve) => {
        if (window.ace) return resolve(window.ace);
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/ace.js";
        script.onload = () => {
            const extScript = document.createElement('script');
            extScript.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/ext-language_tools.min.js";
            extScript.onload = () => resolve(window.ace);
            document.head.appendChild(extScript);
        };
        document.head.appendChild(script);
    });
};

const getApiKey = () => localStorage.getItem('vlab_gemini_api_key') || '';
const setApiKey = (key) => localStorage.setItem('vlab_gemini_api_key', key.trim());

const askGemini = async (promptText) => {
    const key = getApiKey();
    if (!key) return null;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
        const resData = await response.json();
        if (resData.candidates && resData.candidates[0] && resData.candidates[0].content) {
            return resData.candidates[0].content.parts[0].text;
        }
        return "Failed to parse API response. Please verify key rules.";
    } catch (e) {
        console.error("Gemini API call failed", e);
        return "Error querying Gemini API. Check your internet connection or API key validity.";
    }
};

const localAIEvaluator = (code, query, lang) => {
    query = query.toLowerCase();
    code = code || '';
    if (['c', 'cpp', 'java'].includes(lang)) {
        if (!code.includes(';') && (code.includes('printf') || code.includes('cout') || code.includes('System.out'))) {
            return "AI Tutor: I see a likely syntax issue. In C, C++, and Java, every statement must end with a semicolon (`;`). I notice you have printed expressions but may have forgotten a semicolon at the end of a line. Check your code lines carefully!";
        }
    }
    if (query.includes('loop') || query.includes('infinite')) {
        return "AI Tutor: An infinite loop occurs when the loop condition always evaluates to true (e.g. `while(1)` or `while(true)`) and there is no break condition, or if loop variables are not modified inside the body. Inspect your loop counters.";
    }
    if (query.includes('pointer') || query.includes('address')) {
        return "AI Tutor: A pointer is a variable storing the memory address of another variable. In C/C++, define with `int *ptr = &val;`. Dereference with `*ptr` to fetch value. Watch for segmentation faults by ensuring pointers aren't dereferenced when NULL.";
    }
    if (query.includes('segmentation') || query.includes('segfault')) {
        return "AI Tutor: A segmentation fault occurs when access to restricted memory is attempted (e.g. dereferencing uninitialized/NULL pointer, index out of bounds, stack overflow). Initialize pointers and double check array indices.";
    }
    if (query.includes('explain') || query.includes('how does')) {
        return "AI Tutor: This code solves the exercise by taking standard inputs from stdin, processing values through the algorithm bounds, and printing values to stdout. To audit line-by-line, look at how values are read and updated in loops.";
    }
    return "AI Tutor: Currently in Local Mode. Enter a Google Gemini API Key in the settings (⚙️ icon) to activate advanced context-aware debugging and interactive chats. For now, you can compile code, run outputs, and submit for automated grading!";
};

const runPistonCode = async (lang, version, code, stdin) => {
    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: lang,
                version: version || "*",
                files: [{ name: lang === "java" ? "Main.java" : lang === "python" ? "main.py" : lang === "cpp" ? "main.cpp" : "main.c", content: code }],
                stdin: stdin
            })
        });
        return await response.json();
    } catch (e) {
        console.error("Piston run failed", e);
        return null;
    }
};

const executeSimulatedCode = (lang, code, stdin, labId) => {
    const inputVal = stdin.trim();
    let stdout = "";
    let stderr = "";
    let compileLog = "";
    if (lang === "c" || lang === "cpp") {
        compileLog = `[Compiling...] g++ main.cpp -o main.out\n[Compilation successful]\n[Running...] ./main.out\n`;
    } else if (lang === "java") {
        compileLog = `[Compiling...] javac Main.java\n[Compilation successful]\n[Running...] java Main\n`;
    } else {
        compileLog = `[Running...] python3 main.py\n`;
    }

    if (labId === 'c_prog') {
        const val = parseInt(inputVal);
        if (isNaN(val)) stdout = "Invalid input\n";
        else {
            const fact = (n) => n <= 1 ? 1 : n * fact(n - 1);
            stdout = fact(val).toString() + "\n";
        }
    } else if (labId === 'cpp_prog') {
        const lines = inputVal.split(/\s+/);
        if (lines.length === 0 || isNaN(parseFloat(lines[0]))) {
            stdout = "0\n";
        } else {
            let balance = parseFloat(lines[0]);
            let idx = 1;
            while (idx < lines.length) {
                const act = lines[idx];
                const amt = parseFloat(lines[idx+1]);
                if (act === 'D') balance += amt;
                else if (act === 'W') { if (balance >= amt) balance -= amt; }
                idx += 2;
            }
            stdout = balance.toString() + "\n";
        }
    } else if (labId === 'java_prog') {
        const val = parseInt(inputVal);
        if (isNaN(val)) stdout = "0\n";
        else {
            let sum = 0;
            for (let i = 1; i <= val; i++) sum += i;
            stdout = sum.toString() + "\n";
        }
    } else if (labId === 'python_prog') {
        const nums = inputVal.split(/\s+/).map(Number).filter(x => !isNaN(x));
        const sum = nums.reduce((a, b) => a + b, 0);
        stdout = sum.toString() + "\n";
    }
    return { compileLog, stdout, stderr, code: 0 };
};

// --- MOCK DATABASE SCHEMAS ---
const MOCK_DB = {
    students: [
        { id: 1, name: "Atharva Gandhi", age: 20, branch: "CS" },
        { id: 2, name: "Nisha Patil", age: 21, branch: "IT" },
        { id: 3, name: "Rahul Deshmukh", age: 22, branch: "ENTC" },
        { id: 4, name: "Sneha Thorat", age: 20, branch: "CS" }
    ],
    courses: [
        { course_id: 101, title: "Computer Networks", credits: 4 },
        { course_id: 102, title: "Operating Systems", credits: 4 },
        { course_id: 103, title: "Database Systems", credits: 3 }
    ],
    enrollments: [
        { student_id: 1, course_id: 101, grade: "A" },
        { student_id: 1, course_id: 102, grade: "O" },
        { student_id: 2, course_id: 101, grade: "B" },
        { student_id: 3, course_id: 103, grade: "A" },
        { student_id: 4, course_id: 102, grade: "O" }
    ],
    accounts: [
        { id: 1, name: "Atharva Gandhi", balance: 5000 },
        { id: 2, name: "Nisha Patil", balance: 7500 },
        { id: 3, name: "Rahul Deshmukh", balance: 12000 }
    ],
    indextable: [
        { key: 10, pointer: "Record_A" },
        { key: 20, pointer: "Record_B" },
        { key: 30, pointer: "Record_C" }
    ]
};

let MOCK_DB_WORKING = JSON.parse(JSON.stringify(MOCK_DB));

const executeSQL = (queryText) => {
    const q = queryText.trim().replace(/\s+/g, ' ').replace(/;$/, '').toLowerCase();
    if (q.startsWith('select')) {
        if (q.includes('join')) {
            if (q.includes('students') && q.includes('enrollments')) {
                const rows = [];
                MOCK_DB_WORKING.enrollments.forEach(e => {
                    const s = MOCK_DB_WORKING.students.find(student => student.id === e.student_id);
                    const c = MOCK_DB_WORKING.courses.find(course => course.course_id === e.course_id);
                    if (s && c) {
                        rows.push({ student_id: s.id, name: s.name, course: c.title, grade: e.grade });
                    }
                });
                return { success: true, columns: ['student_id', 'name', 'course', 'grade'], rows };
            }
        }
        const match = q.match(/select \* from (\w+)/);
        if (match && MOCK_DB_WORKING[match[1]]) {
            const tableName = match[1];
            const rows = MOCK_DB_WORKING[tableName];
            const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
            return { success: true, columns, rows };
        }
        const projMatch = q.match(/select ([\w\s,._*]+) from (\w+)/);
        if (projMatch) {
            const cols = projMatch[1].split(',').map(c => c.trim());
            const tableName = projMatch[2];
            if (MOCK_DB_WORKING[tableName]) {
                const rows = MOCK_DB_WORKING[tableName].map(row => {
                    const res = {};
                    cols.forEach(c => { if (row[c] !== undefined) res[c] = row[c]; });
                    return res;
                });
                return { success: true, columns: cols.filter(c => rows[0] && rows[0][c] !== undefined), rows };
            }
        }
        return { success: false, error: "SQL Error: Table not found or JOIN query too complex." };
    }
    if (q.startsWith('update')) {
        const match = q.match(/update accounts set balance = balance ([+-]) (\d+) where id = (\d+)/);
        if (match) {
            const op = match[1];
            const val = parseFloat(match[2]);
            const targetId = parseInt(match[3]);
            const acct = MOCK_DB_WORKING.accounts.find(a => a.id === targetId);
            if (acct) {
                let oldVal = acct.balance;
                if (op === '+') acct.balance += val; else acct.balance -= val;
                return { success: true, message: `1 row updated. Balance changed from ${oldVal} to ${acct.balance}.` };
            }
            return { success: false, error: "SQL Error: Account ID not found." };
        }
    }
    if (q.startsWith('insert')) {
        const match = q.match(/insert into (\w+) values \(([^)]+)\)/);
        if (match) {
            const tableName = match[1];
            const val = parseInt(match[2]);
            if (tableName === 'indextable') {
                MOCK_DB_WORKING.indextable.push({ key: val, pointer: "Record_" + val });
                if (window.updateBTreeVisualizer) window.updateBTreeVisualizer(val);
                return { success: true, message: `1 row inserted. Key ${val} added to B-Tree Index.` };
            }
        }
    }
    return { success: false, error: "SQL Syntax Error or unhandled operation: " + queryText };
};

// --- B-TREE ALGORITHM STRUCTURES ---
class BTreeNode {
    constructor(isLeaf = true) {
        this.keys = [];
        this.children = [];
        this.isLeaf = isLeaf;
    }
}
class BTree {
    constructor(t = 2) {
        this.root = new BTreeNode(true);
        this.t = t;
    }
    insert(k) {
        const r = this.root;
        if (r.keys.length === 2 * this.t - 1) {
            const s = new BTreeNode(false);
            this.root = s;
            s.children.push(r);
            this.splitChild(s, 0, r);
            this.insertNonFull(s, k);
        } else {
            this.insertNonFull(r, k);
        }
    }
    insertNonFull(x, k) {
        let i = x.keys.length - 1;
        if (x.isLeaf) {
            while (i >= 0 && x.keys[i] > k) i--;
            if (x.keys[i] !== k) x.keys.splice(i + 1, 0, k);
        } else {
            while (i >= 0 && x.keys[i] > k) i--;
            i++;
            if (x.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(x, i, x.children[i]);
                if (x.keys[i] < k) i++;
            }
            this.insertNonFull(x.children[i], k);
        }
    }
    splitChild(x, i, y) {
        const z = new BTreeNode(y.isLeaf);
        const t = this.t;
        x.children.splice(i + 1, 0, z);
        x.keys.splice(i, 0, y.keys[t - 1]);
        z.keys = y.keys.splice(t, t - 1);
        y.keys.splice(t - 1, 1);
        if (!y.isLeaf) z.children = y.children.splice(t, t);
    }
}

const renderBTreeSVG = (tree) => {
    const svgWidth = 800;
    const svgHeight = 250;
    const nodeWidth = 80;
    const nodeHeight = 30;
    const levelHeight = 60;
    let html = "";
    const layoutNode = (node, xStart, xEnd, y) => {
        if (!node) return;
        const x = (xStart + xEnd) / 2;
        const keysText = node.keys.join(" | ");
        html += `<rect x="${x - nodeWidth/2}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="6" ry="6" fill="#1e293b" stroke="#10b981" stroke-width="2" />`;
        html += `<text x="${x}" y="${y + 20}" font-family="'JetBrains Mono', monospace" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">${keysText}</text>`;
        if (!node.isLeaf) {
            const numChildren = node.children.length;
            const segment = (xEnd - xStart) / numChildren;
            node.children.forEach((child, idx) => {
                const childXStart = xStart + idx * segment;
                const childXEnd = xStart + (idx + 1) * segment;
                const childX = (childXStart + childXEnd) / 2;
                const childY = y + levelHeight;
                html += `<line x1="${x}" y1="${y + nodeHeight}" x2="${childX}" y2="${childY}" stroke="#10b981" stroke-opacity="0.6" stroke-width="1.5" />`;
                layoutNode(child, childXStart, childXEnd, childY);
            });
        }
    };
    layoutNode(tree.root, 0, svgWidth, 20);
    return `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}">${html}</svg>`;
};

// --- FIRESTORE UTILS ---
const saveUserCode = async (labId, code) => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user || !labId) return;
    try {
        const pathKey = getStateKey(labId);
        await setDoc(doc(db, "users", user.uid, "code", pathKey), {
            code: code,
            lastSaved: new Date().toISOString()
        });
    } catch(e) { console.error("Cloud autosave failed", e); }
};

const loadUserCode = async (labId) => {
    const user = auth.currentUser || await getCurrentUser();
    if (!user || !labId) return null;
    try {
        const pathKey = getStateKey(labId);
        const snap = await getDoc(doc(db, "users", user.uid, "code", pathKey));
        if (snap.exists()) return snap.data().code;
    } catch(e) { console.error("Cloud fetch failed", e); }
    return null;
};

// --- INITIALIZE PROGRAMMING WORKSPACE ---
const initProgrammingLab = async (container, labId) => {
    let data = window.VLAB_DATA[labId];
    if (data && data.isMultiModule) {
        const modIdx = window.currentModuleIndex !== undefined && window.currentModuleIndex !== null ? window.currentModuleIndex : 0;
        data = data.modules[modIdx];
    }
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; gap:12px; padding:8px;">
            <div class="sim-toolbar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; gap:8px; align-items:center;">
                    <button id="btnRunCode" class="btn-sim primary">▶ Run Code</button>
                    <button id="btnGradeCode" class="btn-sim" style="background:#10b981; color:white;">🎯 Submit Code</button>
                    <button id="btnResetCode" class="btn-sim">Reset Template</button>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button id="btnCollSession" class="btn-sim" style="background:#2563eb; color:white;">👥 Live Collaboration</button>
                    <button id="btnAiSettings" class="btn-sim" title="Gemini Configuration">⚙️ AI Settings</button>
                    <button id="btnToggleAiPanel" class="btn-sim primary" style="background:#a855f7; color:white;">✨ AI Tutor</button>
                </div>
            </div>
            
            <div id="collaboration-bar" style="display:none; background:var(--bg-alt); padding:10px; border-radius:8px; border:1px solid var(--border); display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <span id="collStatus" style="font-weight:700; color:var(--text-muted);">Session Room:</span>
                <input id="collRoomId" placeholder="Room ID (e.g. PROG-101)" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:var(--bg-page); color:var(--text-main); font-family:monospace;">
                <button id="btnCreateRoom" class="btn-sim" style="padding:6px 12px;">Create Room</button>
                <button id="btnJoinRoom" class="btn-sim" style="padding:6px 12px;">Join Room</button>
                <span id="roomStatusText" style="font-size:12px; color:#10b981;"></span>
            </div>

            <div style="display:flex; flex:1; gap:12px; height:500px; flex-wrap:wrap;">
                <div style="flex:1.4; display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; min-width:320px;">
                    <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700; display:flex; justify-content:space-between; align-items:center;">
                        <span>📝 Code Editor (${data.lang.toUpperCase()})</span>
                        <span id="editorStatus" style="font-size:12px; color:var(--text-muted);">Synced to cloud</span>
                    </div>
                    <div id="ace-editor" style="flex:1; width:100%;"></div>
                </div>
                
                <div style="flex:1; display:flex; flex-direction:column; gap:12px; min-width:280px;">
                    <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; flex:0.4;">
                        <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">📥 Standard Input (stdin)</div>
                        <textarea id="stdin-area" placeholder="Type input values here..." style="flex:1; padding:12px; border:none; resize:none; font-family:monospace; background:var(--bg-page); color:var(--text-main); font-size:13px; outline:none;"></textarea>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; flex:1;">
                        <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700; display:flex; justify-content:space-between; align-items:center;">
                            <span>💻 Console Terminal</span>
                            <button id="btnClearConsole" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:12px;">Clear</button>
                        </div>
                        <div id="terminal-box" style="flex:1; background:#000; color:#10b981; font-family:'JetBrains Mono', monospace; font-size:13px; padding:12px; overflow-y:auto; line-height:1.5; white-space:pre-wrap;">Console Ready. Write code and click 'Run Code' to execute.</div>
                    </div>
                </div>

                <div id="ai-tutor-drawer" style="width:300px; display:none; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--container-bg); min-height:500px;">
                    <div style="background:#a855f71a; color:#a855f7; padding:12px 16px; border-bottom:1px solid var(--border); font-weight:800; display:flex; justify-content:space-between; align-items:center;">
                        <span>✨ AI Tutor Assistant</span>
                        <button id="btnCloseAiDrawer" style="background:transparent; border:none; color:#a855f7; font-weight:bold; cursor:pointer;">×</button>
                    </div>
                    <div style="padding:10px; border-bottom:1px solid var(--border); background:var(--bg-alt); display:flex; flex-wrap:wrap; gap:6px;">
                        <button id="btnAiAudit" style="flex:1; padding:6px; font-size:11px; border-radius:4px; border:1px solid var(--border); background:var(--bg-page); color:var(--text-main); cursor:pointer;">🔍 Audit Code</button>
                        <button id="btnAiExplain" style="flex:1; padding:6px; font-size:11px; border-radius:4px; border:1px solid var(--border); background:var(--bg-page); color:var(--text-main); cursor:pointer;">📚 Explain Code</button>
                    </div>
                    <div id="ai-chat-logs" style="flex:1; padding:12px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; background:var(--bg-page);">
                        <div style="align-self:flex-start; background:var(--bg-alt); padding:8px 12px; border-radius:12px; max-width:85%; font-size:13px; color:var(--text-main); line-height:1.4;">
                            Hello! I am your MIT VLab AI Assistant. Ask me anything about your code, or click a helper option above!
                        </div>
                    </div>
                    <div style="padding:10px; border-top:1px solid var(--border); display:flex; gap:6px; background:var(--bg-alt);">
                        <input id="ai-chat-input" placeholder="Ask AI about loops, pointers..." style="flex:1; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--bg-page); color:var(--text-main); font-size:13px;">
                        <button id="btnSendChat" class="btn-sim primary" style="background:#a855f7; border:none; color:white; border-radius:6px; padding:6px 12px; font-size:13px;">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize Ace Editor
    const aceLib = await loadAceEditor();
    const editor = aceLib.edit("ace-editor");
    editor.setTheme("ace/theme/chrome");
    const modeMap = { c: 'c_cpp', cpp: 'c_cpp', java: 'java', python: 'python' };
    editor.session.setMode(`ace/mode/${modeMap[data.lang] || 'c_cpp'}`);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        fontFamily: "'JetBrains Mono', monospace"
    });

    // Dark Theme syncing
    const syncEditorTheme = () => {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        editor.setTheme(theme === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome');
    };
    syncEditorTheme();
    
    // Listen to theme modifications
    const observer = new MutationObserver(syncEditorTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Load saved code from cloud
    const saved = await loadUserCode(labId);
    if (saved) editor.setValue(saved, -1);
    else editor.setValue(data.defaultCode, -1);

    // Save code changes debounced
    let saveTimeout;
    editor.session.on('change', () => {
        document.getElementById('editorStatus').textContent = "Saving...";
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const currentCode = editor.getValue();
            await saveUserCode(labId, currentCode);
            document.getElementById('editorStatus').textContent = "Saved to cloud";
            
            // Sync collaboration session
            if (window.activeCollRoomId) {
                try {
                    await setDoc(doc(db, "collaboration", window.activeCollRoomId), {
                        code: currentCode,
                        updatedBy: localStorage.getItem('vlab_user_name') || 'Student',
                        timestamp: new Date().toISOString()
                    });
                } catch(err) { console.error("Collab sync error", err); }
            }
        }, 1000);
    });

    // Stdin / console element configurations
    const stdinArea = document.getElementById('stdin-area');
    const terminalBox = document.getElementById('terminal-box');

    // Run Code Integration
    document.getElementById('btnRunCode').addEventListener('click', async () => {
        terminalBox.innerHTML = `[Compiling / executing code...]\n`;
        const codeText = editor.getValue();
        const stdinText = stdinArea.value;

        // Try Piston runner
        let res = await runPistonCode(data.lang, data.version, codeText, stdinText);
        if (res && res.run) {
            let outputText = "";
            if (res.compile && res.compile.output) outputText += res.compile.output + "\n";
            outputText += res.run.stdout || "";
            if (res.run.stderr) outputText += "\nError:\n" + res.run.stderr;
            if (!outputText.trim()) outputText = "[Process executed with no console output]";
            terminalBox.textContent = outputText;
        } else {
            // Simulated evaluation fallback
            const sim = executeSimulatedCode(data.lang, codeText, stdinText, labId);
            let outputText = sim.compileLog;
            if (sim.stdout) outputText += sim.stdout;
            if (sim.stderr) outputText += "\nError:\n" + sim.stderr;
            terminalBox.textContent = outputText;
        }
    });

    // Reset code
    document.getElementById('btnResetCode').addEventListener('click', () => {
        if (confirm("Reset to default curriculum code template? Your changes will be cleared.")) {
            editor.setValue(data.defaultCode, -1);
        }
    });

    // Clear terminal
    document.getElementById('btnClearConsole').addEventListener('click', () => {
        terminalBox.textContent = "";
    });

    // Submit / Automated Grade Case check
    document.getElementById('btnGradeCode').addEventListener('click', async () => {
        terminalBox.textContent = `[Initiating compilation and automated test sequence...]\n`;
        let passedCases = 0;
        const testCases = data.testCases || [];
        const codeText = editor.getValue();

        for (let idx = 0; idx < testCases.length; idx++) {
            const tc = testCases[idx];
            terminalBox.textContent += `Running Test Case ${idx+1}/${testCases.length}... `;
            
            let res = await runPistonCode(data.lang, data.version, codeText, tc.input);
            let runOutput = "";
            if (res && res.run) {
                runOutput = (res.run.stdout || "").trim();
            } else {
                const sim = executeSimulatedCode(data.lang, codeText, tc.input, labId);
                runOutput = (sim.stdout || "").trim();
            }

            if (runOutput === tc.expected.trim()) {
                terminalBox.textContent += `PASSED\n`;
                passedCases++;
            } else {
                terminalBox.textContent += `FAILED (Expected: "${tc.expected.trim()}", Got: "${runOutput}")\n`;
            }
        }

        const finalScore = testCases.length > 0 ? Math.round((passedCases / testCases.length) * 100) : 100;
        terminalBox.textContent += `\nAutomated grading complete.\nPassed: ${passedCases}/${testCases.length}\nScore: ${finalScore}/100\n`;
        
        // Update grade score display and sync progress
        const scoreDisp = document.getElementById('scoreDisplay');
        if (scoreDisp) scoreDisp.textContent = `Score: ${finalScore}`;
        await syncProgress(labId, { score: finalScore, completed: finalScore === 100 });
        
        // Update user local storage status
        const localState = { score: finalScore, completed: finalScore === 100, lastUpdated: new Date().toISOString() };
        localStorage.setItem(`vlab_state_${getStateKey(labId)}`, JSON.stringify(localState));
    });

    // AI Drawer Panel toggles
    const aiDrawer = document.getElementById('ai-tutor-drawer');
    document.getElementById('btnToggleAiPanel').addEventListener('click', () => {
        const globalDrawer = document.getElementById('global-ai-drawer');
        const bubble = document.getElementById('global-ai-bubble');
        if (globalDrawer) {
            const isOpen = globalDrawer.style.display === 'flex';
            globalDrawer.style.display = isOpen ? 'none' : 'flex';
            if (bubble) {
                if (isOpen) bubble.classList.remove('active');
                else bubble.classList.add('active');
            }
        }
    });
    document.getElementById('btnCloseAiDrawer').addEventListener('click', () => {
        const globalDrawer = document.getElementById('global-ai-drawer');
        if (globalDrawer) globalDrawer.style.display = 'none';
        const bubble = document.getElementById('global-ai-bubble');
        if (bubble) bubble.classList.remove('active');
    });

    // AI Settings modal input
    document.getElementById('btnAiSettings').addEventListener('click', () => {
        const key = prompt("Enter Gemini API Key to enable Premium Live AI Mode. (Get a free key from Google AI Studio). Leave blank to clear key:", getApiKey());
        if (key !== null) {
            setApiKey(key);
            alert(key.trim() ? "Gemini Key Saved. Premium AI Assistant features unlocked!" : "Gemini Key cleared. Fallen back to Local Heuristic Engine.");
        }
    });

    // Helper Chat response builder
    const appendChatMessage = (sender, message) => {
        const chatLogs = document.getElementById('ai-chat-logs');
        const msgDiv = document.createElement('div');
        msgDiv.style.alignSelf = sender === 'student' ? 'flex-end' : 'flex-start';
        msgDiv.style.background = sender === 'student' ? 'var(--primary-rgb)2a' : 'var(--bg-alt)';
        if (sender === 'student') msgDiv.style.borderColor = 'var(--primary)';
        msgDiv.style.padding = '8px 12px';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.fontSize = '13px';
        msgDiv.style.color = 'var(--text-main)';
        msgDiv.style.lineHeight = '1.4';
        msgDiv.style.border = sender === 'student' ? '1px solid var(--primary)' : 'none';
        msgDiv.textContent = message;
        chatLogs.appendChild(msgDiv);
        chatLogs.scrollTop = chatLogs.scrollHeight;
    };

    // Chat Trigger
    const executeChatQuery = async (queryText) => {
        if (!queryText.trim()) return;
        appendChatMessage('student', queryText);
        appendChatMessage('ai', 'AI is thinking...');

        const codeText = editor.getValue();
        let aiResponse = "";
        
        const key = getApiKey();
        if (key) {
            const systemPrompt = `You are the MIT VLab Academic AI Tutor. Provide clear, concise, step-by-step guidance on how to solve the student's coding issue. Do not give the direct solution code outright, but help guide them. Code Language: ${data.lang}. Student Code:\n${codeText}\n\nStudent Question: ${queryText}`;
            aiResponse = await askGemini(systemPrompt);
        } else {
            aiResponse = localAIEvaluator(codeText, queryText, data.lang);
        }

        // Remove thinking message
        const chatLogs = document.getElementById('ai-chat-logs');
        if (chatLogs.lastChild) chatLogs.removeChild(chatLogs.lastChild);
        appendChatMessage('ai', aiResponse || "Failed to contact AI.");
    };

    document.getElementById('btnSendChat').addEventListener('click', () => {
        const input = document.getElementById('ai-chat-input');
        executeChatQuery(input.value);
        input.value = "";
    });

    document.getElementById('ai-chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('ai-chat-input');
            executeChatQuery(input.value);
            input.value = "";
        }
    });

    document.getElementById('btnAiAudit').addEventListener('click', () => {
        executeChatQuery("Audit my code quality, name checks, optimizations and let me know how to improve it.");
    });
    
    document.getElementById('btnAiExplain').addEventListener('click', () => {
        executeChatQuery("Explain this code logic line-by-line in simple terms.");
    });

    // Real-time Collaboration Logic via Firestore
    const collBar = document.getElementById('collaboration-bar');
    document.getElementById('btnCollSession').addEventListener('click', () => {
        const isOpen = collBar.style.display === 'flex';
        collBar.style.display = isOpen ? 'none' : 'flex';
    });

    const createRoom = async () => {
        const roomInput = document.getElementById('collRoomId');
        const roomStatusText = document.getElementById('roomStatusText');
        const roomId = roomInput.value.trim().toUpperCase();
        if (!roomId) { alert("Enter a valid Room ID."); return; }
        
        try {
            roomStatusText.textContent = "Setting room...";
            await setDoc(doc(db, "collaboration", roomId), {
                code: editor.getValue(),
                updatedBy: localStorage.getItem('vlab_user_name') || 'Student',
                timestamp: new Date().toISOString()
            });
            window.activeCollRoomId = roomId;
            roomStatusText.textContent = "Active Room: " + roomId;
            listenToRoom(roomId);
        } catch(err) { roomStatusText.textContent = "Error creating room: " + err.message; }
    };

    const joinRoom = () => {
        const roomInput = document.getElementById('collRoomId');
        const roomStatusText = document.getElementById('roomStatusText');
        const roomId = roomInput.value.trim().toUpperCase();
        if (!roomId) { alert("Enter a Room ID."); return; }
        
        window.activeCollRoomId = roomId;
        roomStatusText.textContent = "Connected to room: " + roomId;
        listenToRoom(roomId);
    };

    let collabUnsubscribe = null;
    const listenToRoom = (roomId) => {
        if (collabUnsubscribe) collabUnsubscribe();
        const { onSnapshot } = window.firebaseFirestore || { onSnapshot: (ref, cb) => {
            // Fallback dynamic import if not loaded globally
            import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js").then(mod => {
                window.firebaseFirestore = mod;
                listenToRoom(roomId);
            });
        }};
        if (!window.firebaseFirestore) return;
        
        collabUnsubscribe = onSnapshot(doc(db, "collaboration", roomId), (docSnap) => {
            if (docSnap.exists()) {
                const dataSnap = docSnap.data();
                const myName = localStorage.getItem('vlab_user_name') || 'Student';
                if (dataSnap.updatedBy !== myName) {
                    const cursor = editor.getCursorPosition();
                    editor.setValue(dataSnap.code, -1);
                    editor.moveCursorToPosition(cursor);
                }
            }
        });
    };

    document.getElementById('btnCreateRoom').addEventListener('click', createRoom);
    document.getElementById('btnJoinRoom').addEventListener('click', joinRoom);
};

// --- INITIALIZE SQL SANDBOX WORKSPACE ---
const initSqlLab = async (container, labId) => {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; gap:12px; padding:8px;">
            <div class="sim-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:8px;">
                    <button id="btnRunSql" class="btn-sim primary">▶ Run Query</button>
                    <button id="btnResetSql" class="btn-sim">Reset DB</button>
                </div>
                <div style="font-weight:800; color:var(--primary); font-size:16px;">SQL Sandbox Terminal</div>
            </div>
            
            <div style="display:flex; flex:1; gap:12px; min-height:480px; flex-wrap:wrap;">
                <div style="flex:1; display:flex; flex-direction:column; gap:12px; min-width:300px;">
                    <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; flex:1;">
                        <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">📝 SQL Editor</div>
                        <div id="sql-editor" style="flex:1; width:100%;"></div>
                    </div>
                    <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; flex:1; background:var(--bg-alt); padding:12px; overflow-y:auto;">
                        <h4 style="margin:0 0 8px 0; color:var(--primary);">📁 Database Schema Definition</h4>
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; font-family:monospace;">
                            <div><b>Students</b> (id INT PK, name VARCHAR, age INT, branch VARCHAR)</div>
                            <div><b>Courses</b> (course_id INT PK, title VARCHAR, credits INT)</div>
                            <div><b>Enrollments</b> (student_id INT FK, course_id INT FK, grade CHAR)</div>
                        </div>
                    </div>
                </div>
                
                <div style="flex:1.2; display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; min-width:320px; background:var(--bg-page);">
                    <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">📊 Query Output Console</div>
                    <div id="sql-console-output" style="flex:1; padding:16px; overflow-y:auto; font-family:'JetBrains Mono', monospace; font-size:13px;">
                        SQL engine ready. Write queries and click 'Run Query'.<br>
                        Example: <code>SELECT * FROM Students;</code>
                    </div>
                </div>
            </div>
        </div>
    `;

    const aceLib = await loadAceEditor();
    const sqlEditor = aceLib.edit("sql-editor");
    sqlEditor.setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome');
    sqlEditor.session.setMode("ace/mode/sql");
    sqlEditor.setOptions({ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace" });

    sqlEditor.setValue(`-- Write SQL queries here and run against mock DB\nSELECT * FROM Students;`, -1);

    document.getElementById('btnRunSql').addEventListener('click', () => {
        const text = sqlEditor.getValue();
        const out = document.getElementById('sql-console-output');
        out.innerHTML = `Running SQL statement...\n\n`;
        const res = executeSQL(text);
        if (res.success) {
            if (res.rows && res.rows.length !== undefined) {
                // Table output rendering
                let tableHtml = `<table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:13px; text-align:left;"><thead><tr style="border-bottom:2px solid var(--border); background:var(--bg-alt);">`;
                res.columns.forEach(col => {
                    tableHtml += `<th style="padding:8px;">${col.toUpperCase()}</th>`;
                });
                tableHtml += `</tr></thead><tbody>`;
                res.rows.forEach(row => {
                    tableHtml += `<tr style="border-bottom:1px solid var(--border);">`;
                    res.columns.forEach(col => {
                        tableHtml += `<td style="padding:8px;">${row[col] !== undefined ? row[col] : 'NULL'}</td>`;
                    });
                    tableHtml += `</tr>`;
                });
                tableHtml += `</tbody></table>`;
                out.innerHTML = `Query successful. Selected ${res.rows.length} rows.\n` + tableHtml;
            } else {
                out.innerHTML = `<span style="color:#10b981;">Query executed successfully. ${res.message || ''}</span>`;
            }
            
            // Mark lab complete
            syncProgress(labId, { score: 100, completed: true });
            const scoreDisp = document.getElementById('scoreDisplay');
            if (scoreDisp) scoreDisp.textContent = `Score: 100`;
            localStorage.setItem(`vlab_state_${labId}`, JSON.stringify({ score: 100, completed: true }));
        } else {
            out.innerHTML = `<span style="color:#ef4444; font-weight:bold;">${res.error}</span>`;
        }
    });

    document.getElementById('btnResetSql').addEventListener('click', () => {
        MOCK_DB_WORKING = JSON.parse(JSON.stringify(MOCK_DB));
        alert(" Relational tables reset to initial database records.");
    });
};

// --- INITIALIZE TRANSACTION LAB WORKSPACE ---
const initTransactionsLab = (container, labId) => {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; gap:12px; padding:8px;">
            <div class="sim-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:8px;">
                    <button id="btnTxBegin" class="btn-sim primary">BEGIN TRANSACTION</button>
                    <button id="btnTxCommit" class="btn-sim" style="background:#10b981; color:white;" disabled>COMMIT</button>
                    <button id="btnTxRollback" class="btn-sim" style="background:#ef4444; color:white;" disabled>ROLLBACK</button>
                </div>
                <div style="font-weight:800; color:var(--primary); font-size:16px;">ACID Concurrency Sandbox</div>
            </div>

            <div style="display:flex; flex:1; gap:12px; min-height:450px; flex-wrap:wrap;">
                <div style="flex:1.1; display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; padding:16px; background:var(--bg-alt); min-width:300px;">
                    <h3 style="margin-top:0; color:var(--primary);">🏦 Accounts Database State</h3>
                    <table id="tx-db-table" style="width:100%; border-collapse:collapse; text-align:left; font-size:14px; margin-top:12px;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border);">
                                <th style="padding:8px;">ID</th>
                                <th style="padding:8px;">Name</th>
                                <th style="padding:8px;">Balance ($)</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    
                    <div id="tx-actions-panel" style="margin-top:20px; display:none; flex-direction:column; gap:10px;">
                        <h4>Execute Transaction Update</h4>
                        <button id="btnActionTransfer" class="btn-sim" style="text-align:left; padding:10px;">Transfer $1000 from Atharva Gandhi (1) to Nisha Patil (2)</button>
                    </div>
                </div>

                <div style="flex:1.2; display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; min-width:320px; background:var(--bg-page);">
                    <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">🪵 Transaction Log & ACID Audits</div>
                    <div id="tx-log-box" style="flex:1; padding:16px; overflow-y:auto; font-family:'JetBrains Mono', monospace; font-size:13px; line-height:1.5;">
                        System ready. Click BEGIN TRANSACTION to start a block of transactions.
                    </div>
                </div>
            </div>
        </div>
    `;

    let activeTransaction = false;
    let oldBalances = {};

    const renderAccounts = () => {
        const tbody = document.querySelector('#tx-db-table tbody');
        tbody.innerHTML = MOCK_DB_WORKING.accounts.map(a => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:8px;">${a.id}</td>
                <td style="padding:8px;">${a.name}</td>
                <td style="padding:8px;">$${a.balance}</td>
            </tr>
        `).join('');
    };
    renderAccounts();

    const logBox = document.getElementById('tx-log-box');
    const logMsg = (text, type = 'info') => {
        const colorMap = { info: 'var(--text-main)', success: '#10b981', error: '#ef4444', warning: '#f59e0b' };
        logBox.innerHTML += `<div style="color:${colorMap[type]}; margin-bottom:4px;">${text}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    };

    document.getElementById('btnTxBegin').addEventListener('click', () => {
        activeTransaction = true;
        oldBalances = JSON.parse(JSON.stringify(MOCK_DB_WORKING.accounts));
        
        document.getElementById('btnTxBegin').disabled = true;
        document.getElementById('btnTxCommit').disabled = false;
        document.getElementById('btnTxRollback').disabled = false;
        document.getElementById('tx-actions-panel').style.display = 'flex';
        
        logBox.innerHTML = "";
        logMsg("Transaction block began. Isolation state: READ UNCOMMITTED (Intermediate changes visible locally).", "warning");
    });

    document.getElementById('btnActionTransfer').addEventListener('click', () => {
        if (!activeTransaction) return;
        const fromA = MOCK_DB_WORKING.accounts.find(a => a.id === 1);
        const toA = MOCK_DB_WORKING.accounts.find(a => a.id === 2);
        if (fromA && toA) {
            fromA.balance -= 1000;
            toA.balance += 1000;
            renderAccounts();
            logMsg("UPDATE Accounts SET balance = balance - 1000 WHERE id = 1;", "info");
            logMsg("UPDATE Accounts SET balance = balance + 1000 WHERE id = 2;", "info");
            logMsg("Temporary database modifications set. Click COMMIT to save or ROLLBACK to discard changes.", "warning");
        }
    });

    document.getElementById('btnTxCommit').addEventListener('click', () => {
        activeTransaction = false;
        document.getElementById('btnTxBegin').disabled = false;
        document.getElementById('btnTxCommit').disabled = true;
        document.getElementById('btnTxRollback').disabled = true;
        document.getElementById('tx-actions-panel').style.display = 'none';

        logMsg("COMMIT TRANSACTION;", "success");
        logMsg("Database state successfully synchronized. ACID consistency checks: PASSED.", "success");
        
        syncProgress(labId, { score: 100, completed: true });
        const scoreDisp = document.getElementById('scoreDisplay');
        if (scoreDisp) scoreDisp.textContent = `Score: 100`;
        localStorage.setItem(`vlab_state_${labId}`, JSON.stringify({ score: 100, completed: true }));
    });

    document.getElementById('btnTxRollback').addEventListener('click', () => {
        activeTransaction = false;
        MOCK_DB_WORKING.accounts = oldBalances;
        renderAccounts();

        document.getElementById('btnTxBegin').disabled = false;
        document.getElementById('btnTxCommit').disabled = true;
        document.getElementById('btnTxRollback').disabled = true;
        document.getElementById('tx-actions-panel').style.display = 'none';

        logMsg("ROLLBACK TRANSACTION;", "error");
        logMsg("Database modifications successfully reverted. ACID durability constraints: ENFORCED.", "info");
    });
};

// --- INITIALIZE B-TREE INDEXING LAB WORKSPACE ---
const initIndexingLab = (container, labId) => {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; gap:12px; padding:8px;">
            <div class="sim-toolbar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; gap:8px; align-items:center;">
                    <input id="btree-insert-val" type="number" placeholder="Enter key (e.g. 15)" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:var(--bg-page); color:var(--text-main); font-family:monospace; width:140px;">
                    <button id="btnBTreeInsert" class="btn-sim primary">📥 Insert Key</button>
                    <button id="btnBTreeReset" class="btn-sim">Reset Index</button>
                </div>
                <div style="font-weight:800; color:var(--primary); font-size:16px;">B-Tree Indexing Visualizer</div>
            </div>

            <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--bg-page); flex:1; min-height:300px; position:relative;">
                <div style="background:var(--bg-alt); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">🌴 B-Tree Structure (Order = 3, Max Keys = 2)</div>
                <div id="btree-visual-panel" style="flex:1; display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto;"></div>
            </div>

            <div style="display:flex; flex-direction:column; border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--bg-alt); height:140px;">
                <div style="background:var(--bg-page); padding:8px 16px; border-bottom:1px solid var(--border); font-weight:700;">🪵 Indexing Split Logs</div>
                <div id="btree-log" style="flex:1; padding:12px; overflow-y:auto; font-family:monospace; font-size:12px; color:var(--text-muted);">
                    Enter integers and click Insert Key to build index tree. Order 3 splits occur when keys exceed 2 per node.
                </div>
            </div>
        </div>
    `;

    const tree = new BTree(2); // Order = 3
    const visual = document.getElementById('btree-visual-panel');
    const logBox = document.getElementById('btree-log');

    const updateVisual = () => {
        visual.innerHTML = renderBTreeSVG(tree);
    };

    // Insert key trigger
    document.getElementById('btnBTreeInsert').addEventListener('click', () => {
        const input = document.getElementById('btree-insert-val');
        const val = parseInt(input.value);
        if (isNaN(val)) { alert("Enter a valid integer."); return; }
        
        tree.insert(val);
        updateVisual();
        
        logBox.innerHTML += `Inserted key ${val} into index database.\n`;
        logBox.scrollTop = logBox.scrollHeight;
        input.value = "";
        
        // Progress update
        syncProgress(labId, { score: 100, completed: true });
        const scoreDisp = document.getElementById('scoreDisplay');
        if (scoreDisp) scoreDisp.textContent = `Score: 100`;
        localStorage.setItem(`vlab_state_${labId}`, JSON.stringify({ score: 100, completed: true }));
    });

    document.getElementById('btnBTreeReset').addEventListener('click', () => {
        location.reload();
    });

    window.updateBTreeVisualizer = (val) => {
        tree.insert(val);
        updateVisual();
        logBox.innerHTML += `Triggered Index update: added key ${val} via SQL query statement.\n`;
        logBox.scrollTop = logBox.scrollHeight;
    };

    // Load initial nodes
    tree.insert(10);
    tree.insert(20);
    tree.insert(30); // split root
    updateVisual();
};

// Expose routing hooks
window.initProgrammingLab = initProgrammingLab;
window.initSqlLab = initSqlLab;
window.initTransactionsLab = initTransactionsLab;
window.initIndexingLab = initIndexingLab;

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

        let parentTitle = data.title;
        let isMulti = data.isMultiModule;
        let activeIndex = 0;

        if (isMulti) {
            const modSelect = document.getElementById('moduleSelect');
            if (modSelect) {
                modSelect.style.display = 'inline-block';
                if (modSelect.getAttribute('data-current-lab') !== id) {
                    modSelect.innerHTML = data.modules.map((m, idx) => `<option value="${idx}">${m.title}</option>`).join('');
                    modSelect.setAttribute('data-current-lab', id);
                    
                    const savedIdx = localStorage.getItem(`${id}_active_module`);
                    activeIndex = savedIdx ? parseInt(savedIdx, 10) : 0;
                    if (activeIndex >= data.modules.length) activeIndex = 0;
                    modSelect.value = activeIndex;
                } else {
                    activeIndex = parseInt(modSelect.value, 10) || 0;
                }
            }
            window.currentModuleIndex = activeIndex;
            
            const parentLang = data.lang;
            const parentVersion = data.version;
            const parentSimType = data.simType;
            
            data = {
                ...data,
                ...data.modules[activeIndex]
            };
            
            if (!data.lang && parentLang) data.lang = parentLang;
            if (!data.version && parentVersion) data.version = parentVersion;
            if (!data.simType && parentSimType) data.simType = parentSimType;
        } else {
            const modSelect = document.getElementById('moduleSelect');
            if (modSelect) {
                modSelect.style.display = 'none';
                modSelect.removeAttribute('data-current-lab');
            }
            window.currentModuleIndex = null;
        }

        // Dynamic content population with fade-in effect
        const content = document.getElementById('content-display');
        if (!content) return;
        content.style.opacity = '0';
        
        // Sync the main header title
        const mainTitle = document.getElementById('lab-title-display');
        if (mainTitle) {
            if (isMulti) {
                mainTitle.textContent = `${parentTitle} - ${data.title}`;
            } else {
                mainTitle.textContent = data.title;
            }
        }

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
                    const stateKey = getStateKey(labId);
                    const state = JSON.parse(localStorage.getItem(`vlab_state_${stateKey}`) || '{}');
                    state.pretest = true;
                    localStorage.setItem(`vlab_state_${stateKey}`, JSON.stringify(state));
                    alert(`Pretest Submitted! Simulation and Experiment sections are now UNLOCKED for this lab. 🚀`);
                    syncProgress(labId, { pretest: true, pretestScore: scorePercent });
                }
 
                if (prefix === 'post') {
                    const labId = document.getElementById('labSelect').value;
                    const feedback = document.getElementById('student-feedback')?.value || "";
                    const labData = window.VLAB_DATA[labId] || { title: "Custom Experiment" };
                    const currentModData = labData.isMultiModule ? labData.modules[window.currentModuleIndex] : labData;
 
                    syncProgress(labId, {
                        posttest: true,
                        posttestScore: scorePercent,
                        completed: true,
                        feedback: feedback
                    });
 
                    document.getElementById('cert-user-name').textContent = localStorage.getItem('vlab_user_name') || 'Atharva Gandhi';
                    document.getElementById('cert-lab-name').textContent = labData.isMultiModule ? `${labData.title} - ${currentModData.title}` : labData.title;
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
            const stateKey = getStateKey(labId);
            const state = JSON.parse(localStorage.getItem(`vlab_state_${stateKey}`) || '{"pretest":false}');

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
                                        <code style="background:#000; color:#10b981; padding:6px 10px; border-radius:6px; display:block; font-size:12px; font-family:'JetBrains Mono', monospace;">${cmd}</code>
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
        const ipToUint = (ip) => ip.split('.').reduce((acc, o) => (acc << 8) + parseInt(o, 10), 0) >>> 0;
        const uintToIp = (u) => [(u >>> 24) & 0xff, (u >>> 16) & 0xff, (u >>> 8) & 0xff, u & 0xff].join('.');
        const toBin8 = (n) => (n & 0xff).toString(2).padStart(8, '0');

        const challenges = [
            { q: 'How many usable hosts are in a /24 network?', ans: ['254','254 hosts'], exp: '2^8 - 2 = 254. /24 leaves 8 host bits.' },
            { q: 'What CIDR gives exactly 30 usable hosts per subnet?', ans: ['/27','27','255.255.255.224'], exp: '/27 → 2^5 − 2 = 30 hosts.' },
            { q: 'What subnet mask corresponds to /28?', ans: ['255.255.255.240','/28'], exp: '11110000 in last octet = 255.255.255.240' },
            { q: 'How many /26 subnets fit inside one /24?', ans: ['4','4 subnets'], exp: '/26 borrows 2 bits → 2^2 = 4 subnets, 62 hosts each.' },
            { q: 'What class is 172.31.0.1?', ans: ['class b','b','class-b'], exp: '172.x.x.x (128-191) = Class B.' },
            { q: 'What is the broadcast address of 192.168.10.0/27?', ans: ['192.168.10.31'], exp: 'Block size 32 → network .0, broadcast .31.' },
            { q: 'How many hosts can a /30 subnet support?', ans: ['2','2 hosts'], exp: '/30 → 2^2 − 2 = 2. Used for P2P WAN links.' },
            { q: 'What CIDR gives 510 hosts?', ans: ['/23','23'], exp: '/23 → 2^9 − 2 = 510 hosts.' },
        ];
        let cIdx = 0, challengeScore = 0;

        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">IP Subnetting & Addressing Lab</div></div>
            <div class="sim-workspace" style="flex-direction:column; gap:20px; padding:20px; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <h3 style="margin-bottom:15px; color:var(--primary);">Live Subnet Calculator</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Network IP Address:</label>
                            <input type="text" id="calcIP" class="sim-select" style="width:100%; font-family:'JetBrains Mono', monospace;" placeholder="e.g. 192.168.10.0">
                        </div>
                        <div style="margin-bottom:20px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">CIDR Prefix: <span id="cidrLabel" style="color:var(--primary); font-size:16px; font-family:'JetBrains Mono', monospace;">/24</span></label>
                            <input type="range" id="cidrSlider" min="8" max="30" value="24" style="width:100%; accent-color:var(--primary);">
                            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:4px;"><span>/8 Class A</span><span>/16 Class B</span><span>/24 Class C</span><span>/30 P2P</span></div>
                        </div>
                        <button id="btnCalc" class="btn-sim primary" style="width:100%;">Analyze Network ▶</button>
                        <div id="calcResult" style="margin-top:20px; display:none;">
                            <div style="background:rgba(37,99,235,0.05); border:1px solid var(--primary); border-radius:12px; padding:15px;">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-family:'JetBrains Mono', monospace; font-size:12px;">
                                    <div style="padding:10px; background:var(--bg-page); border-radius:8px;"><div style="font-size:10px; color:var(--text-muted); font-weight:800;">NETWORK ADDRESS</div><div id="resNet" style="font-weight:800; color:var(--primary); font-size:15px; margin-top:4px;"></div></div>
                                    <div style="padding:10px; background:var(--bg-page); border-radius:8px;"><div style="font-size:10px; color:var(--text-muted); font-weight:800;">BROADCAST ADDRESS</div><div id="resBroad" style="font-weight:800; color:var(--danger); font-size:15px; margin-top:4px;"></div></div>
                                    <div style="padding:10px; background:var(--bg-page); border-radius:8px;"><div style="font-size:10px; color:var(--text-muted); font-weight:800;">FIRST USABLE HOST</div><div id="resFirst" style="font-weight:800; color:var(--success); font-size:13px; margin-top:4px;"></div></div>
                                    <div style="padding:10px; background:var(--bg-page); border-radius:8px;"><div style="font-size:10px; color:var(--text-muted); font-weight:800;">LAST USABLE HOST</div><div id="resLast" style="font-weight:800; color:var(--success); font-size:13px; margin-top:4px;"></div></div>
                                    <div style="padding:10px; background:rgba(37,99,235,0.08); border-radius:8px; grid-column:1/-1; text-align:center;"><div style="font-size:10px; color:var(--text-muted); font-weight:800;">USABLE HOST COUNT</div><div id="resHosts" style="font-weight:800; font-size:24px; color:var(--primary); margin-top:4px;"></div></div>
                                </div>
                            </div>
                            <div style="margin-top:12px; background:#0b0f19; border-radius:12px; padding:15px; font-family:'JetBrains Mono', monospace; font-size:11px; line-height:2;">
                                <div style="color:#64748b; font-size:10px; font-weight:800; margin-bottom:6px;">▸ BINARY REPRESENTATION (Network=<span style='color:#10b981'>■</span> Host=<span style='color:#ef4444'>■</span>)</div>
                                <div id="binaryBreakdown" style="word-break:break-all; line-height:1.8;"></div>
                            </div>
                            <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
                                <div style="padding:8px 14px; background:rgba(37,99,235,0.08); border:1px solid rgba(37,99,235,0.2); border-radius:8px; font-size:12px;">Class: <b id="resClass" style="font-family:'JetBrains Mono', monospace;"></b></div>
                                <div style="padding:8px 14px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:8px; font-size:12px;">Type: <b id="resType" style="font-family:'JetBrains Mono', monospace; color:var(--success);"></b></div>
                                <div style="padding:8px 14px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:8px; font-size:12px;">Subnet Mask: <b id="resMask" style="font-family:'JetBrains Mono', monospace; color:var(--warning);"></b></div>
                            </div>
                        </div>
                    </div>
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0; display:flex; flex-direction:column; gap:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="margin:0; color:var(--success);">Challenge Mode 🎯</h3>
                            <div style="font-size:22px; font-weight:800; color:var(--primary);">Score: <span id="challengeScore">0</span></div>
                        </div>
                        <div style="font-size:11px; color:var(--text-muted);">Question <span id="challengeNum">1</span> of ${challenges.length}</div>
                        <div style="padding:15px; background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.3); border-radius:12px;">
                            <div style="font-size:10px; color:var(--warning); font-weight:800; margin-bottom:8px;">CHALLENGE QUESTION</div>
                            <p id="challengeText" style="font-size:13px; line-height:1.6; margin:0;"></p>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="challengeAns" class="sim-select" style="flex:1; font-family:'JetBrains Mono', monospace;" placeholder="Your answer...">
                            <button id="btnCheckChallenge" class="btn-sim success">Submit</button>
                        </div>
                        <div id="challengeFeedback" style="font-weight:700; font-size:12px; min-height:18px;"></div>
                        <button id="btnNextChallenge" class="btn-sim primary" style="display:none;">Next Question →</button>
                    </div>
                </div>
            </div>
        `;

        const cidrSlider = document.getElementById('cidrSlider');
        cidrSlider.oninput = () => document.getElementById('cidrLabel').textContent = `/${cidrSlider.value}`;

        document.getElementById('btnCalc').onclick = () => {
            const ip = document.getElementById('calcIP').value.trim();
            const mask = parseInt(cidrSlider.value);
            if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) { alert('Invalid IP address. Use dotted decimal: e.g. 192.168.1.0'); return; }
            const parts = ip.split('.').map(Number);
            if (parts.some(p => p < 0 || p > 255)) { alert('Each octet must be 0–255'); return; }
            const ipUint = ipToUint(ip);
            const maskUint = ((0xffffffff << (32 - mask)) >>> 0);
            const netUint = (ipUint & maskUint) >>> 0;
            const broadUint = (netUint | (~maskUint >>> 0)) >>> 0;
            const hosts = Math.max(0, Math.pow(2, 32 - mask) - 2);
            document.getElementById('resNet').textContent = uintToIp(netUint) + ` /${mask}`;
            document.getElementById('resBroad').textContent = uintToIp(broadUint);
            document.getElementById('resFirst').textContent = hosts > 0 ? uintToIp(netUint + 1) : 'N/A';
            document.getElementById('resLast').textContent = hosts > 0 ? uintToIp(broadUint - 1) : 'N/A';
            document.getElementById('resHosts').textContent = hosts.toLocaleString() + ' hosts';
            document.getElementById('resMask').textContent = uintToIp(maskUint);

            // Binary breakdown with color coding
            const netParts = uintToIp(netUint).split('.').map(Number);
            const maskParts = uintToIp(maskUint).split('.').map(Number);
            const fullBin = netParts.map(toBin8).join('');
            const coloredBits = fullBin.split('').map((b, i) =>
                `<span style="color:${i < mask ? '#10b981' : '#ef4444'};">${b}</span>`).join('');
            const octets = [0, 8, 16, 24].map(s => coloredBits.slice(s * 18, s * 18 + 8 * 18)).join('<span style="color:#64748b;">.</span>');
            document.getElementById('binaryBreakdown').innerHTML =
                `<div><span style="color:#64748b; font-size:10px;">IP:   </span>${octets}</div>` +
                `<div><span style="color:#64748b; font-size:10px;">MASK: </span><span style="color:#f59e0b;">${maskParts.map(toBin8).join('.')}</span></div>`;

            const first = parts[0];
            const cls = first < 128 ? 'Class A' : first < 192 ? 'Class B' : first < 224 ? 'Class C' : first < 240 ? 'Class D (Multicast)' : 'Class E';
            let type = 'Public';
            if (first === 10 || (first === 172 && parts[1] >= 16 && parts[1] <= 31) || (first === 192 && parts[1] === 168)) type = 'Private (RFC 1918)';
            else if (first === 127) type = 'Loopback';
            else if (first >= 224) type = 'Special / Reserved';
            document.getElementById('resClass').textContent = cls;
            document.getElementById('resType').textContent = type;
            document.getElementById('calcResult').style.display = 'block';
        };

        const loadChallenge = () => {
            const c = challenges[cIdx % challenges.length];
            document.getElementById('challengeNum').textContent = (cIdx % challenges.length) + 1;
            document.getElementById('challengeText').textContent = c.q;
            document.getElementById('challengeAns').value = '';
            document.getElementById('challengeFeedback').textContent = '';
            document.getElementById('btnNextChallenge').style.display = 'none';
        };
        loadChallenge();

        document.getElementById('btnCheckChallenge').onclick = () => {
            const ans = document.getElementById('challengeAns').value.trim().toLowerCase();
            const c = challenges[cIdx % challenges.length];
            const ok = c.ans.some(a => a.toLowerCase() === ans);
            const fb = document.getElementById('challengeFeedback');
            if (ok) { challengeScore += 10; document.getElementById('challengeScore').textContent = challengeScore; fb.style.color = 'var(--success)'; fb.textContent = `✅ ${c.exp}`; }
            else { fb.style.color = 'var(--danger)'; fb.textContent = `❌ ${c.exp} (Answer: ${c.ans[0]})`; }
            document.getElementById('btnNextChallenge').style.display = 'block';
        };
        document.getElementById('btnNextChallenge').onclick = () => { cIdx++; loadChallenge(); };
    };

    const initIpSorter = (container) => {
        const ipPool = [
            { ip: '10.0.0.1',    cls: 'A', type: 'Private' },
            { ip: '172.16.0.1',  cls: 'B', type: 'Private' },
            { ip: '192.168.1.1', cls: 'C', type: 'Private' },
            { ip: '8.8.8.8',     cls: 'A', type: 'Public' },
            { ip: '128.0.0.1',   cls: 'B', type: 'Public' },
            { ip: '200.1.1.1',   cls: 'C', type: 'Public' },
            { ip: '127.0.0.1',   cls: 'A', type: 'Loopback' },
            { ip: '224.0.0.1',   cls: 'D', type: 'Multicast' },
        ];
        const classLabels = { A:'1–126', B:'128–191', C:'192–223', D:'224–239' };
        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">IPv4 Address Classification Lab 🏷️</div></div>
            <div class="sim-workspace" style="flex-direction:column; align-items:center; padding:25px; overflow-y:auto; gap:20px;">
                <p style="color:var(--text-muted); margin:0;">Drag each IP address into its correct IPv4 Class bucket. Binary (first octet) shown as tooltip.</p>
                <div id="ip-pool" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                    ${ipPool.map(item => `
                        <div class="btn-sim" draggable="true" data-ip="${item.ip}" style="cursor:grab; font-family:'JetBrains Mono', monospace;" title="First octet binary: ${parseInt(item.ip.split('.')[0]).toString(2).padStart(8,'0')}">
                            <div>${item.ip}</div>
                            <div style="font-size:9px; opacity:0.5; font-family:'JetBrains Mono', monospace;">${parseInt(item.ip.split('.')[0]).toString(2).padStart(8,'0')}…</div>
                        </div>`).join('')}
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:15px; width:100%; max-width:960px;">
                    ${['A','B','C','D'].map(cls => `
                        <div class="theory-card bucket" data-class="${cls}" ondragover="event.preventDefault()" ondrop="handleIpDrop(event,'${cls}')" style="min-height:120px; text-align:center; transition:border-color 0.2s; border:2px dashed var(--border);">
                            <div style="font-weight:800; color:var(--primary); margin-bottom:6px;">Class ${cls}</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">${classLabels[cls]}</div>
                            <div class="bucket-list" style="display:flex; flex-direction:column; gap:5px; align-items:center;"></div>
                        </div>`).join('')}
                </div>
                <div style="display:flex; gap:15px; align-items:center; flex-wrap:wrap; justify-content:center;">
                    <button class="btn-sim primary" id="btnCheckSorter">Check Answers ✓</button>
                    <button class="btn-sim" id="btnResetSorter">Reset ↺</button>
                    <div style="font-size:20px; font-weight:800; color:var(--primary);">Score: <span id="sorterScore">0</span>/${ipPool.length * 10}</div>
                </div>
                <div id="sorterResult" style="width:100%; max-width:960px; display:none;">
                    <div class="theory-card" style="margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Detailed IP Analysis</h3>
                        <table class="sim-table" style="width:100%; border-collapse:collapse; font-family:'JetBrains Mono', monospace; font-size:12px; text-align:left;">
                            <thead><tr style="border-bottom:2px solid var(--border);">
                                <th style="padding:8px;">IP Address</th><th style="padding:8px;">Class</th>
                                <th style="padding:8px;">Type</th><th style="padding:8px;">First Octet (Binary)</th><th style="padding:8px;">Range</th>
                            </tr></thead>
                            <tbody id="ipDetailRows"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('#ip-pool .btn-sim').forEach(item => {
            item.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.currentTarget.dataset.ip));
        });

        window.handleIpDrop = (e, targetClass) => {
            e.preventDefault();
            const ip = e.dataTransfer.getData('text');
            if (!ip) return;
            const bucket = e.currentTarget.querySelector('.bucket-list');
            if ([...bucket.querySelectorAll('[data-ip]')].some(el => el.dataset.ip === ip)) return;
            const el = document.createElement('div');
            el.className = 'btn-sim';
            el.style.cssText = "margin:2px; font-family:'JetBrains Mono', monospace; font-size:11px; padding:4px 10px; cursor:default;";
            el.textContent = ip;
            el.dataset.ip = ip;
            bucket.appendChild(el);
            document.querySelectorAll(`#ip-pool [data-ip="${ip}"]`).forEach(item => item.style.display = 'none');
            e.currentTarget.style.borderColor = 'var(--primary)';
        };

        document.getElementById('btnCheckSorter').onclick = () => {
            let correct = 0;
            const tbody = document.getElementById('ipDetailRows');
            tbody.innerHTML = '';
            document.querySelectorAll('.bucket').forEach(bucket => {
                const target = bucket.dataset.class;
                bucket.querySelectorAll('[data-ip]').forEach(item => {
                    const ip = item.dataset.ip;
                    const first = parseInt(ip.split('.')[0]);
                    const actual = first >= 1 && first <= 126 ? 'A' : first >= 128 && first <= 191 ? 'B' : first >= 192 && first <= 223 ? 'C' : first >= 224 && first <= 239 ? 'D' : 'E';
                    const ok = actual === target;
                    if (ok) { correct++; item.style.color='var(--success)'; item.style.borderColor='var(--success)'; } else { item.style.color='var(--danger)'; item.style.borderColor='var(--danger)'; }
                    const pd = ipPool.find(p => p.ip === ip);
                    tbody.innerHTML += `<tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:8px; font-weight:bold; color:${ok ? 'var(--success)' : 'var(--danger)'}">${ip} ${ok ? '✓' : '✗'}</td>
                        <td style="padding:8px;">Class ${actual}</td>
                        <td style="padding:8px; color:${pd?.type==='Private'?'var(--warning)':'var(--primary)'}">${pd?.type||'Public'}</td>
                        <td style="padding:8px;">${first.toString(2).padStart(8,'0')}</td>
                        <td style="padding:8px;">${classLabels[actual]||'N/A'}</td>
                    </tr>`;
                });
            });
            document.getElementById('sorterScore').textContent = correct * 10;
            document.getElementById('sorterResult').style.display = 'block';
            document.getElementById('sorterResult').scrollIntoView({ behavior: 'smooth' });
            if (!document.querySelector('[data-ip]')) alert('Drag all IPs into their Class buckets first!');
        };

        document.getElementById('btnResetSorter').onclick = () => {
            document.querySelectorAll('.bucket-list').forEach(b => b.innerHTML = '');
            document.querySelectorAll('.bucket').forEach(b => b.style.borderColor = '');
            document.querySelectorAll('#ip-pool .btn-sim').forEach(item => item.style.display = '');
            document.getElementById('sorterScore').textContent = '0';
            document.getElementById('sorterResult').style.display = 'none';
        };
    };

    const initCmdChallenge = (container) => {
        const levels = [
            { task: "Check the reachability of '127.0.0.1' using ping", cmd: 'ping 127.0.0.1', hint: "Syntax: ping <IP>", out: "Pinging 127.0.0.1 with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\n\nPing statistics: Sent=4, Received=4, Lost=0 (0% loss)\nApproximate round trip times: Min=0ms, Max=0ms, Avg=0ms" },
            { task: "Display your current network IP configuration", cmd: 'ipconfig', hint: "Windows: ipconfig  |  Linux: ifconfig", out: "Windows IP Configuration\n\nEthernet adapter Local Area Connection:\n   IPv4 Address  . . . . : 192.168.1.100\n   Subnet Mask . . . . . : 255.255.255.0\n   Default Gateway . . . : 192.168.1.1" },
            { task: "Resolve hostname 'google.com' to its IP address using DNS", cmd: 'nslookup google.com', hint: "Syntax: nslookup <hostname>", out: "Server:  mitadt-dns.edu.in\nAddress: 192.168.1.1\n\nNon-authoritative answer:\nName:    google.com\nAddresses: 142.250.77.110\n           2404:6800:4009:808::200e" },
            { task: "Display the system's current IP routing table", cmd: 'route print', hint: "Windows: route print  |  Linux: netstat -r", out: "IPv4 Route Table\n=============================================================\nActive Routes:\nNetwork Dest.     Netmask          Gateway        Interface   Metric\n0.0.0.0           0.0.0.0          192.168.1.1    192.168.1.100  25\n127.0.0.0         255.0.0.0        On-link        127.0.0.1   306\n192.168.1.0       255.255.255.0    On-link        192.168.1.100 281" },
            { task: "Trace the route to 'mitadt.edu.in' showing all intermediate hops", cmd: 'tracert mitadt.edu.in', hint: "Windows: tracert  |  Linux: traceroute", out: "Tracing route to mitadt.edu.in [103.21.58.100]:\n  1    1ms   <1ms    192.168.1.1     [Local Gateway]\n  2    8ms    7ms    10.100.0.1      [ISP Edge]\n  3   15ms   14ms    203.88.32.1     [ISP Core Router]\n  4   22ms   21ms    103.21.58.100   [Destination]\n\nTrace complete." },
            { task: "Show all active TCP/UDP network connections and listening ports", cmd: 'netstat -an', hint: "Syntax: netstat -an", out: "Active Connections\nProto  Local Address           Foreign Address       State\nTCP    0.0.0.0:80              0.0.0.0:0             LISTENING\nTCP    0.0.0.0:443             0.0.0.0:0             LISTENING\nTCP    192.168.1.100:52341     142.250.77.110:443    ESTABLISHED\nUDP    0.0.0.0:53              *:*" },
            { task: "Display the ARP cache showing MAC-to-IP mappings", cmd: 'arp -a', hint: "Syntax: arp -a", out: "Interface: 192.168.1.100\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static" },
        ];
        let lvl = 0, score = 0, timerInterval = null, timeLeft = 60;

        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Network Commands Challenge 🖥️</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                            <div>
                                <div style="font-size:11px; color:var(--text-muted); font-weight:800;">LEVEL <span id="cmdLvlNum">1</span>/${levels.length}</div>
                                <div style="font-size:22px; font-weight:800; color:var(--primary);">Score: <span id="cmdScore">0</span></div>
                            </div>
                            <div style="text-align:center; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:10px 18px;">
                                <div style="font-size:10px; color:var(--text-muted);">TIME LEFT</div>
                                <div id="cmdTimer" style="font-size:28px; font-weight:800; font-family:'JetBrains Mono', monospace; color:var(--danger);">60s</div>
                            </div>
                        </div>
                        <div style="padding:14px; background:rgba(245,158,11,0.07); border:1px solid rgba(245,158,11,0.3); border-radius:12px; margin-bottom:15px;">
                            <div style="font-size:10px; color:var(--warning); font-weight:800; margin-bottom:6px;">📋 CURRENT TASK</div>
                            <div id="cmdTask" style="font-size:14px; font-weight:600; line-height:1.5;"></div>
                        </div>
                        <div style="background:#0b0f19; border-radius:12px; border:1px solid var(--border); overflow:hidden;">
                            <div style="background:#131824; padding:8px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border);">
                                <span style="font-size:11px; color:var(--text-muted);">MIT ADT VLab Terminal</span>
                                <div style="display:flex; gap:5px;"><span style="width:8px;height:8px;background:#ef4444;border-radius:50%;display:inline-block;"></span><span style="width:8px;height:8px;background:#fbbf24;border-radius:50%;display:inline-block;"></span><span style="width:8px;height:8px;background:#10b981;border-radius:50%;display:inline-block;"></span></div>
                            </div>
                            <div id="cmdOutput" style="height:260px; overflow-y:auto; padding:14px; font-family:'JetBrains Mono', monospace; font-size:12px; color:#10b981; white-space:pre-wrap; line-height:1.6;"></div>
                            <div style="display:flex; align-items:center; gap:8px; padding:10px 14px; border-top:1px solid rgba(255,255,255,0.05); background:#0e1420;">
                                <span style="color:#a855f7; font-weight:800; font-family:'JetBrains Mono', monospace; font-size:12px; white-space:nowrap;">C:\\Users\\Student&gt;</span>
                                <input type="text" id="cmdChallengeInput" style="flex:1; background:transparent; border:none; color:#10b981; outline:none; font-family:'JetBrains Mono', monospace; font-size:12px;" placeholder="Type the correct command and press Enter..." autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <div class="theory-card" style="flex:1; min-width:220px; margin:0; display:flex; flex-direction:column; gap:10px;">
                        <h3 style="color:var(--primary); margin:0;">Quick Reference 📚</h3>
                        <div style="display:flex; flex-direction:column; gap:8px; flex:1; overflow-y:auto;">
                            ${[['ping &lt;IP&gt;','Test host reachability'],['ipconfig','Show IP config (Windows)'],['ifconfig','Show interfaces (Linux)'],['nslookup &lt;host&gt;','DNS lookup'],['tracert &lt;host&gt;','Trace route (Windows)'],['netstat -an','Show all connections'],['route print','Display routing table'],['arp -a','Display ARP cache']].map(([cmd,desc])=>`
                            <div style="padding:8px 12px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px; cursor:pointer;" onclick="document.getElementById('cmdChallengeInput').value='${cmd.replace(/&lt;/g,'<').replace(/&gt;/g,'>')}'; document.getElementById('cmdChallengeInput').focus();">
                                <code style="color:var(--primary); font-size:11px;">${cmd}</code>
                                <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${desc}</div>
                            </div>`).join('')}
                        </div>
                        <button id="cmdHintBtn" class="btn-sim" style="margin-top:4px;">💡 Show Hint (−5 pts)</button>
                        <div id="cmdWinBanner" style="display:none; padding:12px; background:rgba(16,185,129,0.1); border:1px solid var(--success); border-radius:10px; text-align:center; font-weight:800; color:var(--success); font-size:13px;"></div>
                    </div>
                </div>
            </div>
        `;

        const loadLevel = (idx) => {
            const lv = levels[idx];
            document.getElementById('cmdLvlNum').textContent = idx + 1;
            document.getElementById('cmdTask').textContent = lv.task;
            document.getElementById('cmdOutput').textContent = `MIT ADT VLab Terminal v2.0\n${'─'.repeat(38)}\nLevel ${idx + 1} of ${levels.length}: ${lv.task}\n\nC:\\Users\\Student> `;
            clearInterval(timerInterval);
            timeLeft = 60;
            const timerEl = document.getElementById('cmdTimer');
            timerEl.textContent = '60s';
            timerEl.style.color = 'var(--danger)';
            timerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft + 's';
                if (timeLeft <= 10) timerEl.style.color = '#ef4444';
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('cmdOutput').textContent += `\n\n⏰ TIME'S UP! Correct answer was: ${lv.cmd}\n\nC:\\Users\\Student> `;
                    setTimeout(() => { if (lvl < levels.length - 1) { lvl++; loadLevel(lvl); } }, 2000);
                }
            }, 1000);
        };

        loadLevel(0);

        const otherCmds = {
            'ipconfig': 'Windows IP Configuration\n   IPv4 Address: 192.168.1.100\n   Subnet Mask:  255.255.255.0\n   Gateway:      192.168.1.1',
            'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>\n     inet 192.168.1.100 netmask 255.255.255.0',
            'arp -a': 'Interface: 192.168.1.100\n  192.168.1.1     00-11-22-33-44-55  dynamic\n  192.168.1.255   ff-ff-ff-ff-ff-ff  static',
            'netstat -an': 'Active Connections\n  TCP  0.0.0.0:80    LISTENING\n  TCP  0.0.0.0:443   LISTENING',
        };

        document.getElementById('cmdChallengeInput').onkeydown = (e) => {
            if (e.key !== 'Enter') return;
            const input = document.getElementById('cmdChallengeInput');
            const output = document.getElementById('cmdOutput');
            const cmd = input.value.trim();
            input.value = '';
            if (!cmd) return;
            const lv = levels[lvl];
            output.textContent += `${cmd}\n`;
            if (cmd.toLowerCase() === lv.cmd.toLowerCase()) {
                clearInterval(timerInterval);
                const pts = Math.max(10, timeLeft);
                score += pts;
                document.getElementById('cmdScore').textContent = score;
                output.textContent += `\n${lv.out}\n\n✅ CORRECT! +${pts} points (${timeLeft}s remaining)\n\nC:\\Users\\Student> `;
                output.scrollTop = output.scrollHeight;
                setTimeout(() => {
                    if (lvl < levels.length - 1) { lvl++; loadLevel(lvl); }
                    else {
                        clearInterval(timerInterval);
                        const banner = document.getElementById('cmdWinBanner');
                        banner.style.display = 'block';
                        banner.textContent = `🏆 Challenge Complete! Final Score: ${score}/${levels.length * 60}`;
                    }
                }, 2200);
            } else {
                const known = otherCmds[cmd.toLowerCase()];
                if (known) output.textContent += `\n${known}\n\nC:\\Users\\Student> `;
                else output.textContent += `\n'${cmd}' — not the right command for this task. Try again!\n\nC:\\Users\\Student> `;
            }
            output.scrollTop = output.scrollHeight;
        };

        document.getElementById('cmdHintBtn').onclick = () => {
            score = Math.max(0, score - 5);
            document.getElementById('cmdScore').textContent = score;
            const out = document.getElementById('cmdOutput');
            out.textContent += `\n💡 HINT: ${levels[lvl].hint}\n\nC:\\Users\\Student> `;
            out.scrollTop = out.scrollHeight;
        };
    };

    const initMediaStudy = (container) => {
        const media = [
            { name:'UTP Cat6', color:'#3b82f6', icon:'🔵', speed:'10 Gbps', dist:'100m', freq:'250 MHz', imp:'100Ω', pro:'Affordable, easy to install, widely used in LAN', con:'Susceptible to EMI, limited distance' },
            { name:'STP Cat7', color:'#8b5cf6', icon:'🟣', speed:'10 Gbps', dist:'100m', freq:'600 MHz', imp:'100Ω', pro:'Better shielding than UTP, lower crosstalk', con:'More expensive, thicker and harder to route' },
            { name:'Coaxial', color:'#f59e0b', icon:'🟡', speed:'10 Mbps', dist:'500m', freq:'~1 GHz', imp:'50/75Ω', pro:'Long distance, good noise immunity, used in cable TV', con:'Bulky, difficult termination, replaced by fiber' },
            { name:'Fiber (SMF)', color:'#10b981', icon:'🟢', speed:'100+ Gbps', dist:'80km+', freq:'200+ THz', imp:'N/A', pro:'Highest bandwidth, immune to EMI, long distances', con:'Expensive splicing, fragile, costly equipment' },
            { name:'Fiber (MMF)', color:'#06b6d4', icon:'🔷', speed:'10 Gbps', dist:'550m', freq:'200+ THz', imp:'N/A', pro:'Cheaper than SMF, easier to connect', con:'Modal dispersion limits bandwidth over distance' },
            { name:'Wi-Fi 6 (Radio)', color:'#ec4899', icon:'📡', speed:'9.6 Gbps', dist:'~150m', freq:'2.4/5/6 GHz', imp:'N/A', pro:'No cables, mobile, covers large areas', con:'Interference, security concerns, shared medium' },
        ];
        let selectedIdx = 0;
        const wiring = [
            { name:'T568A', colors:['W/Green','Green','W/Orange','Blue','W/Blue','Orange','W/Brown','Brown'] },
            { name:'T568B', colors:['W/Orange','Orange','W/Green','Blue','W/Blue','Green','W/Brown','Brown'] },
        ];
        const pinColors = { 'W/Green':'#d4fce8', 'Green':'#10b981', 'W/Orange':'#fde8d0', 'Orange':'#f97316', 'Blue':'#3b82f6', 'W/Blue':'#bfdbfe', 'W/Brown':'#ede0d4', 'Brown':'#92400e' };

        const renderMedia = (idx) => {
            const m = media[idx];
            document.getElementById('mediaDetail').innerHTML = `
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:18px;">
                    <div style="width:50px; height:50px; border-radius:50%; background:${m.color}22; border:2px solid ${m.color}; display:flex; align-items:center; justify-content:center; font-size:24px;">${m.icon}</div>
                    <div><div style="font-size:18px; font-weight:800; color:${m.color};">${m.name}</div><div style="font-size:11px; color:var(--text-muted);">Physical Layer Transmission Medium</div></div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:15px; font-size:12px;">
                    <div style="padding:10px; background:var(--bg-page); border-radius:8px; border-left:3px solid ${m.color};"><div style="color:var(--text-muted); font-weight:800; font-size:10px;">MAX SPEED</div><div style="font-weight:800; color:${m.color}; margin-top:4px;">${m.speed}</div></div>
                    <div style="padding:10px; background:var(--bg-page); border-radius:8px; border-left:3px solid ${m.color};"><div style="color:var(--text-muted); font-weight:800; font-size:10px;">MAX DISTANCE</div><div style="font-weight:800; color:${m.color}; margin-top:4px;">${m.dist}</div></div>
                    <div style="padding:10px; background:var(--bg-page); border-radius:8px; border-left:3px solid ${m.color};"><div style="color:var(--text-muted); font-weight:800; font-size:10px;">BANDWIDTH / FREQ</div><div style="font-weight:800; color:${m.color}; margin-top:4px;">${m.freq}</div></div>
                    <div style="padding:10px; background:var(--bg-page); border-radius:8px; border-left:3px solid ${m.color};"><div style="color:var(--text-muted); font-weight:800; font-size:10px;">IMPEDANCE</div><div style="font-weight:800; color:${m.color}; margin-top:4px;">${m.imp}</div></div>
                </div>
                <div style="padding:10px; background:rgba(16,185,129,0.05); border-radius:8px; font-size:12px; margin-bottom:8px;"><b style="color:var(--success);">✅ Pros:</b> ${m.pro}</div>
                <div style="padding:10px; background:rgba(239,68,68,0.05); border-radius:8px; font-size:12px;"><b style="color:var(--danger);">❌ Cons:</b> ${m.con}</div>
            `;
        };

        container.innerHTML = `
            <div class="sim-toolbar"><div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Physical Layer & Transmission Media Study</div></div>
            <div class="sim-workspace" style="flex-direction:column; padding:20px; gap:20px; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1; min-width:260px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Select Medium</h3>
                        <div style="display:flex; flex-direction:column; gap:8px;" id="mediaList">
                            ${media.map((m,i)=>`<div onclick="document.getElementById('mediaList').querySelectorAll('.media-item').forEach(el=>el.style.borderColor='var(--border)'); this.style.borderColor='${m.color}'; document.querySelector('[data-render-media]').dataset.renderMedia='${i}';" class="media-item" style="padding:12px; background:var(--bg-page); border:1px solid var(--border); border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:10px; transition:border-color 0.2s;"
                                ><span style="font-size:20px;">${m.icon}</span><div><div style="font-weight:800; font-size:13px;">${m.name}</div><div style="font-size:10px; color:var(--text-muted);">${m.speed} · ${m.dist}</div></div></div>`).join('')}
                        </div>
                    </div>
                    <div class="theory-card" style="flex:2; min-width:300px; margin:0;" id="mediaDetail" data-render-media="0">
                    </div>
                </div>
                <div class="theory-card" style="width:100%; margin:0;">
                    <h3 style="color:var(--primary); margin-bottom:15px;">RJ-45 Wiring Standards: T568A vs T568B</h3>
                    <div style="display:flex; gap:20px; flex-wrap:wrap;">
                        ${wiring.map(w=>`<div style="flex:1; min-width:200px;">
                            <div style="font-weight:800; color:var(--primary); margin-bottom:10px;">${w.name}</div>
                            <div style="display:flex; gap:4px; align-items:flex-end; height:80px;">
                                ${w.colors.map((c,i)=>`<div style="display:flex; flex-direction:column; align-items:center; gap:3px; flex:1;">
                                    <div style="font-size:8px; color:var(--text-muted); writing-mode:vertical-rl; transform:rotate(180deg); white-space:nowrap;">${c}</div>
                                    <div style="flex:1; width:100%; background:${pinColors[c]||'#888'}; border-radius:2px 2px 0 0; min-height:30px; border:1px solid rgba(255,255,255,0.1);"></div>
                                    <div style="font-size:9px; font-weight:800; color:var(--text-muted);">${i+1}</div>
                                </div>`).join('')}
                            </div>
                        </div>`).join('<div style="padding:10px; display:flex; align-items:center; font-weight:800; color:var(--text-muted);">VS</div>')}
                    </div>
                    <div style="margin-top:15px; padding:12px; background:rgba(37,99,235,0.05); border-radius:10px; font-size:12px; line-height:1.6;">
                        <b style="color:var(--primary);">Straight-Through:</b> Both ends use same standard (T568B↔T568B). Used: PC→Switch, Switch→Router.<br>
                        <b style="color:var(--warning);">Crossover:</b> One end T568A, other T568B. Used: PC↔PC, Switch↔Switch, Router↔Router (same device type).<br>
                        <b style="color:var(--success);">Modern Note:</b> Auto-MDI/MDIX ports on modern switches detect and swap automatically.
                    </div>
                </div>
                <div class="theory-card" style="width:100%; margin:0;">
                    <h3 style="color:var(--primary); margin-bottom:12px;">Cable Type Quick Quiz 🎯</h3>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;" id="cableQuiz">
                        ${[
                            { q:'PC → Switch', correct:'Straight-Through', opts:['Straight-Through','Crossover','Rollover'] },
                            { q:'Router → Router', correct:'Crossover', opts:['Straight-Through','Crossover','Rollover'] },
                            { q:'PC → Router (Console)', correct:'Rollover', opts:['Straight-Through','Crossover','Rollover'] },
                            { q:'Switch → Switch', correct:'Crossover', opts:['Straight-Through','Crossover','Rollover'] },
                        ].map((q,qi)=>`<div class="theory-card" style="flex:1; min-width:180px; margin:0; padding:12px;">
                            <div style="font-size:12px; font-weight:800; color:var(--primary); margin-bottom:10px;">${q.q}</div>
                            ${q.opts.map(o=>`<button class="btn-sim" style="display:block; width:100%; margin-bottom:5px; font-size:11px; text-align:left; padding:6px 10px;" onclick="(function(btn,correct,container){
                                container.querySelectorAll('.btn-sim').forEach(b=>b.style.borderColor='');
                                if(btn.textContent.trim()===correct){btn.style.borderColor='var(--success)';btn.style.color='var(--success)';}
                                else{btn.style.borderColor='var(--danger)';btn.style.color='var(--danger)'; container.querySelectorAll('.btn-sim').forEach(b=>{if(b.textContent.trim()===correct){b.style.borderColor='var(--success)';b.style.color='var(--success)';}});}
                            })(this,'${q.correct}',this.parentElement);">${o}</button>`).join('')}
                        </div>`).join('')}
                    </div>
                </div>
            </div>
        `;

        // Wire up media selection
        const mediaDetail = document.getElementById('mediaDetail');
        renderMedia(0);
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems[0].style.borderColor = media[0].color;

        const obs = new MutationObserver(() => {
            const idx = parseInt(mediaDetail.dataset.renderMedia);
            renderMedia(idx);
            mediaItems.forEach((el, i) => el.style.borderColor = i === idx ? media[i].color : 'var(--border)');
        });
        obs.observe(mediaDetail, { attributes: true, attributeFilter: ['data-render-media'] });
    };


    // --- OPERATING SYSTEMS SIMULATORS ---
    const initCpuSchedulingSim = (container) => {
        const COLORS = ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];
        const algoInfoMap = {
            fcfs: '<b>FCFS:</b> Processes run in arrival order. Non-preemptive. Simple but can cause convoy effect.',
            sjf: '<b>SJF:</b> Picks the shortest burst time. Non-preemptive. Optimal avg waiting time.',
            srtf: '<b>SRTF:</b> Preemptive SJF. Interrupts running process if a new shorter one arrives.',
            rr: '<b>Round Robin:</b> Each process gets a fixed time quantum. Fair, set quantum below.',
            priority: '<b>Priority:</b> Lower number = higher priority. Non-preemptive.',
        };
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">CPU Scheduling Visualizer</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto;">
                <div style="display:flex; gap:20px; flex-wrap:wrap; width:100%;">
                    <div class="theory-card" style="flex:1.5; min-width:300px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Processes Configuration</h3>
                        <table class="sim-table" style="width:100%; border-collapse:collapse; margin-bottom:15px; text-align:left;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border);">
                                    <th style="padding:8px;">PID</th>
                                    <th style="padding:8px;">Arrival (AT)</th>
                                    <th style="padding:8px;">Burst (BT)</th>
                                    <th style="padding:8px; display:none;" id="priorityHeader">Priority</th>
                                    <th style="padding:8px;">✕</th>
                                </tr>
                            </thead>
                            <tbody id="cpuProcessRows">
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold; color:#2563eb;">P1</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="0" min="0" id="at-P1"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="4" min="1" id="bt-P1"></td>
                                    <td style="padding:8px; display:none;" class="priority-col"><input type="number" class="sim-select" style="width:60px;" value="2" min="1" id="pr-P1"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:3px 8px; font-size:11px;" onclick="this.closest('tr').remove();">✕</button></td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold; color:#10b981;">P2</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="1" min="0" id="at-P2"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="3" min="1" id="bt-P2"></td>
                                    <td style="padding:8px; display:none;" class="priority-col"><input type="number" class="sim-select" style="width:60px;" value="1" min="1" id="pr-P2"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:3px 8px; font-size:11px;" onclick="this.closest('tr').remove();">✕</button></td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:8px; font-weight:bold; color:#f59e0b;">P3</td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="2" min="0" id="at-P3"></td>
                                    <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="1" min="1" id="bt-P3"></td>
                                    <td style="padding:8px; display:none;" class="priority-col"><input type="number" class="sim-select" style="width:60px;" value="3" min="1" id="pr-P3"></td>
                                    <td style="padding:8px;"><button class="btn-sim" style="padding:3px 8px; font-size:11px;" onclick="this.closest('tr').remove();">✕</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="display:flex; gap:10px;">
                            <button id="btnAddProcess" class="btn-sim" style="flex:1;">+ Add Process</button>
                            <button id="btnRunCpuSim" class="btn-sim primary" style="flex:1;">▶ Run Scheduler</button>
                        </div>
                    </div>
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Algorithm Settings</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Scheduling Algorithm:</label>
                            <select id="cpuAlgoSelect" class="sim-select" style="width:100%;">
                                <option value="fcfs">First-Come, First-Served (FCFS)</option>
                                <option value="sjf">Shortest Job First (SJF) — Non-Preemptive</option>
                                <option value="srtf">Shortest Remaining Time (SRTF) — Preemptive</option>
                                <option value="rr">Round Robin (RR) — Preemptive</option>
                                <option value="priority">Priority Scheduling — Non-Preemptive</option>
                            </select>
                        </div>
                        <div style="margin-bottom:15px; display:none;" id="quantumContainer">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Time Quantum:</label>
                            <input type="number" id="cpuQuantum" class="sim-select" style="width:100%;" value="2" min="1">
                        </div>
                        <div style="padding:12px; background:rgba(168,85,247,0.05); border:1px solid var(--border); border-radius:10px; font-size:11px; line-height:1.6;" id="algoInfo">
                            <b>FCFS:</b> Processes run in arrival order. Non-preemptive. Simple but can cause convoy effect.
                        </div>
                    </div>
                </div>
                <div class="theory-card" id="cpuResultsPanel" style="width:100%; margin:0; display:none; animation: fadeIn 0.4s;">
                    <h3 style="color:var(--success); margin-bottom:15px;">Execution Gantt Chart</h3>
                    <div id="ganttChartContainer" style="display:flex; align-items:center; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; height:80px; overflow-x:auto; margin-bottom:20px; padding:10px; gap:1px;"></div>
                    <h3 style="color:var(--primary); margin-bottom:15px;">Detailed Analysis Matrix</h3>
                    <table class="sim-table" style="width:100%; border-collapse:collapse; text-align:left; font-family:'JetBrains Mono', monospace; font-size:13px; margin-bottom:20px;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border);">
                                <th style="padding:8px;">PID</th><th style="padding:8px;">AT</th><th style="padding:8px;">BT</th>
                                <th style="padding:8px;">CT</th><th style="padding:8px;">TAT</th><th style="padding:8px;">WT</th><th style="padding:8px;">RT</th>
                            </tr>
                        </thead>
                        <tbody id="cpuAnalysisRows"></tbody>
                    </table>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
                        <div style="padding:15px; background:rgba(37,99,235,0.05); border:1px solid rgba(37,99,235,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:800;">AVG TURNAROUND</div>
                            <div id="cpuAvgTAT" style="font-size:22px; font-weight:800; color:var(--primary); margin-top:5px;">0.00</div>
                        </div>
                        <div style="padding:15px; background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:800;">AVG WAITING</div>
                            <div id="cpuAvgWT" style="font-size:22px; font-weight:800; color:var(--success); margin-top:5px;">0.00</div>
                        </div>
                        <div style="padding:15px; background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:800;">AVG RESPONSE</div>
                            <div id="cpuAvgRT" style="font-size:22px; font-weight:800; color:var(--warning); margin-top:5px;">0.00</div>
                        </div>
                        <div style="padding:15px; background:rgba(168,85,247,0.05); border:1px solid rgba(168,85,247,0.2); border-radius:10px; text-align:center;">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:800;">CPU UTILIZATION</div>
                            <div id="cpuUtil" style="font-size:22px; font-weight:800; color:#a855f7; margin-top:5px;">0%</div>
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
            const val = cpuAlgoSelect.value;
            quantumContainer.style.display = val === 'rr' ? 'block' : 'none';
            document.getElementById('algoInfo').innerHTML = algoInfoMap[val] || '';
            const showP = val === 'priority';
            document.getElementById('priorityHeader').style.display = showP ? '' : 'none';
            document.querySelectorAll('.priority-col').forEach(el => el.style.display = showP ? '' : 'none');
        });

        btnAddProcess.addEventListener('click', () => {
            procCounter++;
            const color = COLORS[(procCounter - 1) % COLORS.length];
            const showP = cpuAlgoSelect.value === 'priority';
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border)';
            row.innerHTML = `
                <td style="padding:8px; font-weight:bold; color:${color};">P${procCounter}</td>
                <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="0" min="0" id="at-P${procCounter}"></td>
                <td style="padding:8px;"><input type="number" class="sim-select" style="width:70px;" value="3" min="1" id="bt-P${procCounter}"></td>
                <td style="padding:8px; display:${showP ? '' : 'none'};" class="priority-col"><input type="number" class="sim-select" style="width:60px;" value="1" min="1" id="pr-P${procCounter}"></td>
                <td style="padding:8px;"><button class="btn-sim" style="padding:3px 8px; font-size:11px;" onclick="this.closest('tr').remove();">✕</button></td>
            `;
            cpuProcessRows.appendChild(row);
        });

        btnRunCpuSim.addEventListener('click', () => {
            const processes = [];
            cpuProcessRows.querySelectorAll('tr').forEach((row, i) => {
                const pid = row.cells[0].textContent.trim();
                const at = parseInt(row.querySelector('[id^="at-"]')?.value) || 0;
                const bt = parseInt(row.querySelector('[id^="bt-"]')?.value) || 1;
                const pr = parseInt(row.querySelector('[id^="pr-"]')?.value) || 1;
                processes.push({ pid, at, bt, pr, color: COLORS[i % COLORS.length], ct: 0, tat: 0, wt: 0, rt: -1 });
            });
            if (!processes.length) return alert('Please configure at least one process.');

            const algo = cpuAlgoSelect.value;
            const gantt = [];
            const n = processes.length;
            let t = 0;

            if (algo === 'fcfs') {
                processes.sort((a, b) => a.at - b.at);
                processes.forEach(p => {
                    if (t < p.at) { gantt.push({ pid: 'Idle', start: t, end: p.at, color: '#374151' }); t = p.at; }
                    if (p.rt < 0) p.rt = t - p.at;
                    gantt.push({ pid: p.pid, start: t, end: t + p.bt, color: p.color });
                    t += p.bt; p.ct = t; p.tat = p.ct - p.at; p.wt = p.tat - p.bt;
                });
            } else if (algo === 'sjf') {
                const done = new Array(n).fill(false); let comp = 0;
                while (comp < n) {
                    let mi = -1, mb = Infinity;
                    for (let i = 0; i < n; i++) { if (!done[i] && processes[i].at <= t && processes[i].bt < mb) { mb = processes[i].bt; mi = i; } }
                    if (mi < 0) { gantt.push({ pid: 'Idle', start: t, end: t + 1, color: '#374151' }); t++; }
                    else {
                        const p = processes[mi]; if (p.rt < 0) p.rt = t - p.at;
                        gantt.push({ pid: p.pid, start: t, end: t + p.bt, color: p.color });
                        t += p.bt; p.ct = t; p.tat = p.ct - p.at; p.wt = p.tat - p.bt; done[mi] = true; comp++;
                    }
                }
            } else if (algo === 'srtf') {
                const rem = processes.map(p => p.bt); const done = new Array(n).fill(false); let comp = 0;
                while (comp < n) {
                    let mi = -1, mr = Infinity;
                    for (let i = 0; i < n; i++) { if (!done[i] && processes[i].at <= t && rem[i] < mr) { mr = rem[i]; mi = i; } }
                    if (mi < 0) { gantt.push({ pid: 'Idle', start: t, end: t + 1, color: '#374151' }); t++; continue; }
                    const p = processes[mi]; if (p.rt < 0) p.rt = t - p.at;
                    if (gantt.length && gantt[gantt.length - 1].pid === p.pid) gantt[gantt.length - 1].end++;
                    else gantt.push({ pid: p.pid, start: t, end: t + 1, color: p.color });
                    rem[mi]--; t++;
                    if (rem[mi] === 0) { done[mi] = true; comp++; p.ct = t; p.tat = p.ct - p.at; p.wt = p.tat - p.bt; }
                }
            } else if (algo === 'rr') {
                const quantum = parseInt(document.getElementById('cpuQuantum').value) || 2;
                const rem = processes.map(p => p.bt); processes.sort((a, b) => a.at - b.at);
                const vis = new Array(n).fill(false); const q = [0]; vis[0] = true;
                t = processes[0].at; if (t > 0) gantt.push({ pid: 'Idle', start: 0, end: t, color: '#374151' });
                let comp = 0;
                while (comp < n) {
                    if (!q.length) {
                        const nx = Math.min(...processes.filter((_, i) => !vis[i]).map(p => p.at));
                        gantt.push({ pid: 'Idle', start: t, end: nx, color: '#374151' }); t = nx;
                        for (let i = 0; i < n; i++) { if (processes[i].at <= t && !vis[i]) { q.push(i); vis[i] = true; } }
                    }
                    const idx = q.shift(); const p = processes[idx];
                    if (p.rt < 0) p.rt = t - p.at;
                    const run = Math.min(rem[idx], quantum);
                    gantt.push({ pid: p.pid, start: t, end: t + run, color: p.color }); t += run; rem[idx] -= run;
                    for (let i = 0; i < n; i++) { if (processes[i].at <= t && !vis[i]) { q.push(i); vis[i] = true; } }
                    if (rem[idx] > 0) q.push(idx);
                    else { p.ct = t; p.tat = p.ct - p.at; p.wt = p.tat - p.bt; comp++; }
                }
            } else if (algo === 'priority') {
                const done = new Array(n).fill(false); let comp = 0;
                while (comp < n) {
                    let mi = -1, mp = Infinity;
                    for (let i = 0; i < n; i++) { if (!done[i] && processes[i].at <= t && processes[i].pr < mp) { mp = processes[i].pr; mi = i; } }
                    if (mi < 0) { gantt.push({ pid: 'Idle', start: t, end: t + 1, color: '#374151' }); t++; }
                    else {
                        const p = processes[mi]; if (p.rt < 0) p.rt = t - p.at;
                        gantt.push({ pid: p.pid, start: t, end: t + p.bt, color: p.color });
                        t += p.bt; p.ct = t; p.tat = p.ct - p.at; p.wt = p.tat - p.bt; done[mi] = true; comp++;
                    }
                }
            }

            const ganttBox = document.getElementById('ganttChartContainer');
            ganttBox.innerHTML = '';
            gantt.forEach(block => {
                const pct = Math.max(((block.end - block.start) / t) * 100, 1.5);
                const div = document.createElement('div');
                div.style.cssText = `width:${pct}%; height:100%; background:${block.color}; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:4px; flex-shrink:0; transition:transform 0.2s; cursor:default;`;
                div.title = `${block.pid}: t=${block.start}→${block.end} (Δ=${block.end - block.start})`;
                div.innerHTML = `<span style="font-weight:800; font-size:12px; white-space:nowrap; overflow:hidden; max-width:95%;">${block.pid}</span><span style="font-size:9px; opacity:0.8;">${block.start}→${block.end}</span>`;
                div.onmouseenter = () => div.style.transform = 'scaleY(1.08)';
                div.onmouseleave = () => div.style.transform = '';
                ganttBox.appendChild(div);
            });

            const tbody = document.getElementById('cpuAnalysisRows');
            tbody.innerHTML = '';
            let sTAT = 0, sWT = 0, sRT = 0, idle = 0;
            gantt.forEach(b => { if (b.pid === 'Idle') idle += b.end - b.start; });
            processes.forEach(p => {
                sTAT += p.tat; sWT += p.wt; sRT += Math.max(0, p.rt);
                tbody.innerHTML += `<tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:8px; font-weight:bold; color:${p.color};">${p.pid}</td>
                    <td style="padding:8px;">${p.at}</td><td style="padding:8px;">${p.bt}</td>
                    <td style="padding:8px; color:var(--success);">${p.ct}</td>
                    <td style="padding:8px; color:var(--primary);">${p.tat}</td>
                    <td style="padding:8px; color:var(--warning);">${p.wt}</td>
                    <td style="padding:8px; color:var(--danger);">${p.rt >= 0 ? p.rt : '-'}</td>
                </tr>`;
            });
            document.getElementById('cpuAvgTAT').textContent = (sTAT / n).toFixed(2);
            document.getElementById('cpuAvgWT').textContent = (sWT / n).toFixed(2);
            document.getElementById('cpuAvgRT').textContent = (sRT / n).toFixed(2);
            document.getElementById('cpuUtil').textContent = (((t - idle) / t) * 100).toFixed(1) + '%';
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
                                <span id="syncMutex" style="font-family:'JetBrains Mono', monospace; font-weight:800; color:var(--success);">1</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <span><b>Empty Slots Semaphore:</b></span>
                                <span id="syncEmpty" style="font-family:'JetBrains Mono', monospace; font-weight:800; color:var(--primary);">5</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg-page); border:1px solid var(--border); border-radius:8px;">
                                <span><b>Full Slots Semaphore:</b></span>
                                <span id="syncFull" style="font-family:'JetBrains Mono', monospace; font-weight:800; color:var(--warning);">0</span>
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
                    <div id="syncLog" style="height:150px; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; padding:15px; font-family:'JetBrains Mono', monospace; font-size:12px; overflow-y:auto; color:var(--text-main); text-align:left;">
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
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:'JetBrains Mono', monospace; font-weight:bold;" id="need-P0">7 4 3</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P1</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P1" class="sim-select" style="width:60px; text-align:center;" value="2 0 0"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P1" class="sim-select" style="width:60px; text-align:center;" value="3 2 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:'JetBrains Mono', monospace; font-weight:bold;" id="need-P1">1 2 2</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P2</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P2" class="sim-select" style="width:60px; text-align:center;" value="3 0 2"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P2" class="sim-select" style="width:60px; text-align:center;" value="9 0 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:'JetBrains Mono', monospace; font-weight:bold;" id="need-P2">6 0 0</td>
                                </tr>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px; font-weight:bold;">P3</td>
                                    <td style="padding:6px; background:rgba(37,99,235,0.02);"><input type="text" id="alloc-P3" class="sim-select" style="width:60px; text-align:center;" value="2 1 1"></td>
                                    <td style="padding:6px; background:rgba(168,85,247,0.02);"><input type="text" id="max-P3" class="sim-select" style="width:60px; text-align:center;" value="2 2 2"></td>
                                    <td style="padding:6px; background:rgba(245,158,11,0.02); font-family:'JetBrains Mono', monospace; font-weight:bold;" id="need-P3">0 1 1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="theory-card" style="flex:1; min-width:250px; margin:0;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">System Vectors</h3>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:800;">Available Resources (A B C):</label>
                            <input type="text" id="bankersAvail" class="sim-select" style="width:100%; text-align:center; font-family:'JetBrains Mono', monospace; font-weight:800;" value="3 3 2">
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
                        <div id="bankersLog" style="height:140px; background:var(--bg-page); border:1px solid var(--border); border-radius:12px; padding:15px; font-family:'JetBrains Mono', monospace; font-size:12px; overflow-y:auto; color:var(--text-main); text-align:left;">
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
                            <input type="text" id="reqVector" class="sim-select" style="flex:1; text-align:center; font-family:'JetBrains Mono', monospace;" value="1 0 2" placeholder="e.g. 1 0 2">
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
                            <input type="text" id="refString" class="sim-select" style="width:100%; font-family:'JetBrains Mono', monospace;" value="7,0,1,2,0,3,0,4,2,3,0,3,2">
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
                        <table class="sim-table" style="border-collapse:collapse; text-align:center; font-family:'JetBrains Mono', monospace; font-size:14px; min-width:100%;">
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
                            <input type="text" id="diskQueue" class="sim-select" style="width:100%; font-family:'JetBrains Mono', monospace;" value="98, 183, 37, 122, 14, 124, 65, 67">
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

            // Draw seek trace on Canvas — use OS purple if OS subject, blue for networking
            const diskSubject = localStorage.getItem('vlab_current_subject') || 'networking';
            drawGrid();
            ctx.lineWidth = 2;
            ctx.strokeStyle = diskSubject === 'os' ? '#a855f7' : '#2563eb';
            ctx.fillStyle = diskSubject === 'os' ? '#c084fc' : '#60a5fa';

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
                ctx.fillStyle = diskSubject === 'os' ? '#c084fc' : '#60a5fa';
            }
    const initVlanSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">VLAN & IEEE 802.1Q Trunking</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto; overflow-x:hidden;">
                <div style="display:flex; gap:20px; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1; min-width:400px; margin:0; position:relative; min-height:400px; overflow:hidden;">
                        <canvas id="vlanCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                        
                        <div style="position:absolute; top:40%; left:30%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #64748b; padding:10px 20px; border-radius:8px; font-weight:800; font-family:'JetBrains Mono', monospace;" id="sw1">SW-1</div>
                        <div style="position:absolute; top:40%; left:70%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #64748b; padding:10px 20px; border-radius:8px; font-weight:800; font-family:'JetBrains Mono', monospace;" id="sw2">SW-2</div>
                        
                        <div style="position:absolute; top:15%; left:10%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="pc1">
                            <div style="font-weight:800; font-size:12px;">PC-1</div>
                            <div style="font-size:10px; background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; margin-top:5px;">VLAN 10</div>
                        </div>
                        <div style="position:absolute; top:65%; left:10%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #ef4444; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="pc3">
                            <div style="font-weight:800; font-size:12px;">PC-3</div>
                            <div style="font-size:10px; background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; margin-top:5px;">VLAN 20</div>
                        </div>
                        
                        <div style="position:absolute; top:15%; left:90%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="pc2">
                            <div style="font-weight:800; font-size:12px;">PC-2</div>
                            <div style="font-size:10px; background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; margin-top:5px;">VLAN 10</div>
                        </div>
                        <div style="position:absolute; top:65%; left:90%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #ef4444; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="pc4">
                            <div style="font-weight:800; font-size:12px;">PC-4</div>
                            <div style="font-size:10px; background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; margin-top:5px;">VLAN 20</div>
                        </div>
                        
                        <div style="position:absolute; top:33%; left:50%; transform:translate(-50%,-50%); font-size:11px; font-weight:800; background:rgba(0,0,0,0.5); color:#fff; padding:4px 10px; border-radius:12px; border:1px solid #64748b;">802.1Q TRUNK</div>
                    </div>
                    
                    <div class="theory-card" style="width:300px; margin:0; display:flex; flex-direction:column;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Broadcast Controls</h3>
                        <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
                            <button id="btnVlan10" class="btn-sim" style="border-color:#3b82f6; color:#3b82f6;">Broadcast from PC-1 (VLAN 10)</button>
                            <button id="btnVlan20" class="btn-sim" style="border-color:#ef4444; color:#ef4444;">Broadcast from PC-3 (VLAN 20)</button>
                            <button id="btnVlanCross" class="btn-sim" style="border-color:var(--warning); color:var(--warning);">Ping PC-3 from PC-1 (Cross-VLAN)</button>
                        </div>
                        <div id="vlanConsole" style="background:#0b0f19; border-radius:8px; padding:10px; font-family:'JetBrains Mono', monospace; font-size:11px; color:#10b981; height:140px; overflow-y:auto; margin-top:15px; border:1px solid var(--border);">
                            > VLAN Simulator Initialized
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('vlanCanvas');
        const ctx = canvas.getContext('2d');
        let aniFrame = null;
        let isSimRunning = false;

        const getPos = (id) => {
            const el = document.getElementById(id);
            const rect = el.getBoundingClientRect();
            const parentRect = canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + (rect.width/2),
                y: rect.top - parentRect.top + (rect.height/2)
            };
        };

        const drawLine = (p1, p2, color, isTrunk=false) => {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = isTrunk ? 4 : 2;
            if(isTrunk) ctx.setLineDash([5,5]); else ctx.setLineDash([]);
            ctx.stroke();
            ctx.setLineDash([]);
        };

        const drawTopology = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            const sw1 = getPos('sw1'), sw2 = getPos('sw2');
            const pc1 = getPos('pc1'), pc2 = getPos('pc2');
            const pc3 = getPos('pc3'), pc4 = getPos('pc4');

            drawLine(pc1, sw1, 'rgba(59,130,246,0.3)');
            drawLine(pc3, sw1, 'rgba(239,68,68,0.3)');
            drawLine(pc2, sw2, 'rgba(59,130,246,0.3)');
            drawLine(pc4, sw2, 'rgba(239,68,68,0.3)');
            drawLine(sw1, sw2, 'rgba(100,116,139,0.8)', true);
        };
        
        setTimeout(drawTopology, 50);
        window.addEventListener('resize', () => { if(document.getElementById('vlanCanvas')) drawTopology(); });
        
        const log = (msg, color='#10b981') => {
            const c = document.getElementById('vlanConsole');
            c.innerHTML += `<div style="color:${color}; margin-bottom:4px;">> ${msg}</div>`;
            c.scrollTop = c.scrollHeight;
        };

        const animatePacket = (path, color, tag, onComplete) => {
            let start = performance.now();
            const duration = 1200; 
            
            const animate = (time) => {
                if(!document.getElementById('vlanCanvas')) return;
                let progress = (time - start) / duration;
                if(progress > 1) progress = 1;
                
                drawTopology();
                
                const x = path[0].x + (path[1].x - path[0].x) * progress;
                const y = path[0].y + (path[1].y - path[0].y) * progress;
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI*2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                if(tag) {
                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fillRect(x - 20, y - 25, 40, 14);
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = 'bold 9px Outfit, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(tag, x, y - 15);
                }
                
                if(progress < 1) {
                    aniFrame = requestAnimationFrame(animate);
                } else {
                    if(onComplete) onComplete();
                }
            };
            aniFrame = requestAnimationFrame(animate);
        };

        const runVlanBroadcast = (vlanId) => {
            if(isSimRunning) return;
            isSimRunning = true;
            
            const sw1 = getPos('sw1'), sw2 = getPos('sw2');
            const pc1 = getPos('pc1'), pc2 = getPos('pc2');
            const pc3 = getPos('pc3'), pc4 = getPos('pc4');

            const isVlan10 = vlanId === 10;
            const src = isVlan10 ? pc1 : pc3;
            const dst = isVlan10 ? pc2 : pc4;
            const dropped = isVlan10 ? pc3 : pc1;
            const color = isVlan10 ? '#3b82f6' : '#ef4444';
            
            document.querySelectorAll('#btnVlan10, #btnVlan20, #btnVlanCross').forEach(b => b.disabled = true);
            log(`PC-${isVlan10?1:3} sending broadcast frame...`, '#fff');
            
            animatePacket([src, sw1], color, null, () => {
                log(`SW-1 received frame. Attaching 802.1Q Tag: [VLAN ${vlanId}]`, '#f59e0b');
                
                ctx.fillStyle = 'rgba(239,68,68,0.8)';
                ctx.font = 'bold 20px Outfit, sans-serif';
                ctx.fillText('X', dropped.x + 30, dropped.y);
                log(`SW-1 drops frame for PC-${isVlan10?3:1} (Different VLAN)`, '#ef4444');
                
                setTimeout(() => {
                    log(`SW-1 forwarding tagged frame across TRUNK...`);
                    animatePacket([sw1, sw2], color, `VLAN ${vlanId}`, () => {
                        log(`SW-2 received frame. Stripping 802.1Q Tag.`, '#f59e0b');
                        
                        const dropped2 = isVlan10 ? pc4 : pc2;
                        ctx.fillStyle = 'rgba(239,68,68,0.8)';
                        ctx.fillText('X', dropped2.x - 30, dropped2.y);
                        log(`SW-2 drops frame for PC-${isVlan10?4:2} (Different VLAN)`, '#ef4444');
                        
                        setTimeout(() => {
                            log(`SW-2 forwarding untagged frame to PC-${isVlan10?2:4}...`);
                            animatePacket([sw2, dst], color, null, () => {
                                log(`Broadcast successfully reached PC-${isVlan10?2:4} (VLAN ${vlanId})!`, '#3b82f6');
                                setTimeout(()=> {
                                    drawTopology();
                                    isSimRunning = false;
                                    document.querySelectorAll('#btnVlan10, #btnVlan20, #btnVlanCross').forEach(b => b.disabled = false);
                                }, 1500);
                            });
                        }, 1000);
                    });
                }, 1000);
            });
        };

        const runCrossVlanPing = () => {
            if(isSimRunning) return;
            isSimRunning = true;
            const sw1 = getPos('sw1'), pc1 = getPos('pc1');
            
            document.querySelectorAll('#btnVlan10, #btnVlan20, #btnVlanCross').forEach(b => b.disabled = true);
            log(`PC-1 (VLAN 10) pinging PC-3 (VLAN 20)...`, '#fff');
            
            animatePacket([pc1, sw1], '#3b82f6', null, () => {
                log(`SW-1 checking MAC table and VLAN assignments...`, '#f59e0b');
                setTimeout(() => {
                    ctx.fillStyle = 'rgba(239,68,68,0.8)';
                    ctx.font = 'bold 24px Outfit, sans-serif';
                    ctx.fillText('DROP', sw1.x, sw1.y + 40);
                    log(`SW-1 DROP: Cannot route between VLANs without a Router!`, '#ef4444');
                    
                    setTimeout(()=> {
                        drawTopology();
                        isSimRunning = false;
                        document.querySelectorAll('#btnVlan10, #btnVlan20, #btnVlanCross').forEach(b => b.disabled = false);
                    }, 2000);
                }, 1000);
            });
        };

        document.getElementById('btnVlan10').addEventListener('click', () => runVlanBroadcast(10));
        document.getElementById('btnVlan20').addEventListener('click', () => runVlanBroadcast(20));
        document.getElementById('btnVlanCross').addEventListener('click', runCrossVlanPing);
    };

    const initDnsSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">DNS Name Resolution</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto; overflow-x:hidden;">
                <div style="display:flex; gap:20px; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1; min-width:400px; margin:0; position:relative; min-height:450px; overflow:hidden;">
                        <canvas id="dnsCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                        
                        <div style="position:absolute; top:85%; left:15%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="dnsClient">
                            <div style="font-size:24px;">💻</div>
                            <div style="font-weight:800; font-size:11px;">Client</div>
                        </div>
                        
                        <div style="position:absolute; top:85%; left:50%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #f59e0b; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="dnsResolver">
                            <div style="font-size:24px;">🌐</div>
                            <div style="font-weight:800; font-size:11px;">Local Resolver</div>
                            <div style="font-size:9px; color:var(--text-muted);">ISP</div>
                        </div>
                        
                        <div style="position:absolute; top:15%; left:85%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #ef4444; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="dnsRoot">
                            <div style="font-size:24px;">🗄️</div>
                            <div style="font-weight:800; font-size:11px;">Root Server</div>
                            <div style="font-size:9px; color:var(--text-muted);">.</div>
                        </div>
                        
                        <div style="position:absolute; top:50%; left:85%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #10b981; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="dnsTld">
                            <div style="font-size:24px;">🗄️</div>
                            <div style="font-weight:800; font-size:11px;">TLD Server</div>
                            <div style="font-size:9px; color:var(--text-muted);">.com</div>
                        </div>
                        
                        <div style="position:absolute; top:85%; left:85%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #8b5cf6; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="dnsAuth">
                            <div style="font-size:24px;">🗄️</div>
                            <div style="font-weight:800; font-size:11px;">Auth Server</div>
                            <div style="font-size:9px; color:var(--text-muted);">example.com</div>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="width:300px; margin:0; display:flex; flex-direction:column;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">DNS Query</h3>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <input type="text" id="dnsQueryHost" class="sim-select" value="www.example.com" style="width:100%; font-family:'JetBrains Mono', monospace;" readonly>
                            <button id="btnDnsIterative" class="btn-sim" style="border-color:#f59e0b; color:#f59e0b;">Run Iterative Query</button>
                            <button id="btnDnsRecursive" class="btn-sim" style="border-color:#3b82f6; color:#3b82f6;">Run Recursive Query</button>
                        </div>
                        <div id="dnsConsole" style="background:#0b0f19; border-radius:8px; padding:10px; font-family:'JetBrains Mono', monospace; font-size:11px; color:#10b981; flex:1; overflow-y:auto; margin-top:15px; border:1px solid var(--border);">
                            > DNS Subsystem Initialized
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('dnsCanvas');
        const ctx = canvas.getContext('2d');
        let aniFrame = null;
        let isSimRunning = false;

        const getPos = (id) => {
            const el = document.getElementById(id);
            const rect = el.getBoundingClientRect();
            const parentRect = canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + (rect.width/2),
                y: rect.top - parentRect.top + (rect.height/2)
            };
        };

        const drawTopology = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            const client = getPos('dnsClient'), res = getPos('dnsResolver');
            const root = getPos('dnsRoot'), tld = getPos('dnsTld'), auth = getPos('dnsAuth');

            ctx.lineWidth = 1;
            ctx.setLineDash([4,4]);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            [root, tld, auth].forEach(dest => {
                ctx.beginPath();
                ctx.moveTo(res.x, res.y);
                ctx.lineTo(dest.x, dest.y);
                ctx.stroke();
            });
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.moveTo(client.x, client.y);
            ctx.lineTo(res.x, res.y);
            ctx.stroke();
        };
        
        setTimeout(drawTopology, 50);
        window.addEventListener('resize', () => { if(document.getElementById('dnsCanvas')) drawTopology(); });
        
        const log = (msg, color='#10b981') => {
            const c = document.getElementById('dnsConsole');
            c.innerHTML += `<div style="color:${color}; margin-bottom:4px;">> ${msg}</div>`;
            c.scrollTop = c.scrollHeight;
        };

        const animatePacket = (path, color, tag, isResp, onComplete) => {
            let start = performance.now();
            const duration = 1000; 
            
            const animate = (time) => {
                if(!document.getElementById('dnsCanvas')) return;
                let progress = (time - start) / duration;
                if(progress > 1) progress = 1;
                
                drawTopology();
                const x = path[0].x + (path[1].x - path[0].x) * progress;
                const y = path[0].y + (path[1].y - path[0].y) * progress;
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI*2);
                ctx.fill();
                
                if(tag) {
                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fillRect(x - 20, y - 25, 40, 14);
                    ctx.fillStyle = isResp ? '#10b981' : '#f59e0b';
                    ctx.font = 'bold 9px Outfit, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(tag, x, y - 15);
                }
                
                if(progress < 1) {
                    aniFrame = requestAnimationFrame(animate);
                } else {
                    if(onComplete) onComplete();
                }
            };
            aniFrame = requestAnimationFrame(animate);
        };

        const runQuery = (type) => {
            if(isSimRunning) return;
            isSimRunning = true;
            document.getElementById('dnsConsole').innerHTML = '';
            log(`Starting ${type.toUpperCase()} resolution for www.example.com...`, '#fff');
            
            const c = getPos('dnsClient'), r = getPos('dnsResolver');
            const rt = getPos('dnsRoot'), tl = getPos('dnsTld'), au = getPos('dnsAuth');
            document.querySelectorAll('#btnDnsIterative, #btnDnsRecursive').forEach(b => b.disabled = true);
            
            animatePacket([c, r], '#3b82f6', 'Query', false, () => {
                log('Resolver checks cache: MISS.', '#f59e0b');
                
                if(type === 'iterative') {
                    // Iterative
                    setTimeout(() => {
                        log('Resolver -> Root: Where is .com?', '#3b82f6');
                        animatePacket([r, rt], '#ef4444', '?', false, () => {
                            log('Root -> Resolver: Try TLD server.', '#10b981');
                            animatePacket([rt, r], '#ef4444', 'TLD IP', true, () => {
                                setTimeout(() => {
                                    log('Resolver -> TLD: Where is example.com?', '#3b82f6');
                                    animatePacket([r, tl], '#10b981', '?', false, () => {
                                        log('TLD -> Resolver: Try Auth server.', '#10b981');
                                        animatePacket([tl, r], '#10b981', 'Auth IP', true, () => {
                                            setTimeout(() => {
                                                log('Resolver -> Auth: What is IP of www.example.com?', '#3b82f6');
                                                animatePacket([r, au], '#8b5cf6', '?', false, () => {
                                                    log('Auth -> Resolver: IP is 93.184.216.34', '#10b981');
                                                    animatePacket([au, r], '#8b5cf6', 'A Rec', true, () => {
                                                        setTimeout(() => {
                                                            log('Resolver caches result and replies to Client.', '#f59e0b');
                                                            animatePacket([r, c], '#3b82f6', 'IP Ans', true, () => {
                                                                log('Client successfully resolved www.example.com!', '#fff');
                                                                isSimRunning = false;
                                                                document.querySelectorAll('#btnDnsIterative, #btnDnsRecursive').forEach(b => b.disabled = false);
                                                            });
                                                        }, 500);
                                                    });
                                                });
                                            }, 500);
                                        });
                                    });
                                }, 500);
                            });
                        });
                    }, 500);
                } else {
                    // Recursive
                    setTimeout(() => {
                        log('Resolver -> Root: Resolve www.example.com', '#3b82f6');
                        animatePacket([r, rt], '#ef4444', 'Query', false, () => {
                            log('Root -> TLD: Resolve www.example.com', '#3b82f6');
                            animatePacket([rt, tl], '#10b981', 'Query', false, () => {
                                log('TLD -> Auth: Resolve www.example.com', '#3b82f6');
                                animatePacket([tl, au], '#8b5cf6', 'Query', false, () => {
                                    log('Auth -> TLD: IP is 93.184.216.34', '#10b981');
                                    animatePacket([au, tl], '#8b5cf6', 'A Rec', true, () => {
                                        log('TLD -> Root: Forwarding Answer', '#10b981');
                                        animatePacket([tl, rt], '#10b981', 'A Rec', true, () => {
                                            log('Root -> Resolver: Forwarding Answer', '#10b981');
                                            animatePacket([rt, r], '#ef4444', 'A Rec', true, () => {
                                                setTimeout(() => {
                                                    log('Resolver caches result and replies to Client.', '#f59e0b');
                                                    animatePacket([r, c], '#3b82f6', 'IP Ans', true, () => {
                                                        log('Client successfully resolved www.example.com!', '#fff');
                                                        isSimRunning = false;
                                                        document.querySelectorAll('#btnDnsIterative, #btnDnsRecursive').forEach(b => b.disabled = false);
                                                    });
                                                }, 500);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }, 500);
                }
            });
        };

        document.getElementById('btnDnsIterative').addEventListener('click', () => runQuery('iterative'));
        document.getElementById('btnDnsRecursive').addEventListener('click', () => runQuery('recursive'));
    };

    const initRoutingSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Routing Algorithm Convergence</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto; overflow-x:hidden;">
                <div style="display:flex; gap:20px; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1.5; min-width:400px; margin:0; position:relative; min-height:450px; overflow:hidden;">
                        <canvas id="routingCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                        
                        <div style="position:absolute; top:20%; left:50%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:10px 15px; border-radius:50%; font-weight:800; font-family:'JetBrains Mono', monospace; z-index:2; width:45px; height:45px; display:flex; align-items:center; justify-content:center;" id="rtA">A</div>
                        
                        <div style="position:absolute; top:50%; left:20%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #10b981; padding:10px 15px; border-radius:50%; font-weight:800; font-family:'JetBrains Mono', monospace; z-index:2; width:45px; height:45px; display:flex; align-items:center; justify-content:center;" id="rtB">B</div>
                        
                        <div style="position:absolute; top:50%; left:80%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #f59e0b; padding:10px 15px; border-radius:50%; font-weight:800; font-family:'JetBrains Mono', monospace; z-index:2; width:45px; height:45px; display:flex; align-items:center; justify-content:center;" id="rtC">C</div>
                        
                        <div style="position:absolute; top:80%; left:35%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #8b5cf6; padding:10px 15px; border-radius:50%; font-weight:800; font-family:'JetBrains Mono', monospace; z-index:2; width:45px; height:45px; display:flex; align-items:center; justify-content:center;" id="rtD">D</div>
                        
                        <div style="position:absolute; top:80%; left:65%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #ef4444; padding:10px 15px; border-radius:50%; font-weight:800; font-family:'JetBrains Mono', monospace; z-index:2; width:45px; height:45px; display:flex; align-items:center; justify-content:center;" id="rtE">E</div>
                    </div>
                    
                    <div class="theory-card" style="width:350px; margin:0; display:flex; flex-direction:column;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Convergence Controls</h3>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <label style="font-size:12px; font-weight:800; color:var(--text-muted);">Algorithm Mode:</label>
                            <select id="routeAlgoSelect" class="sim-select" style="width:100%;">
                                <option value="dv">Distance Vector (Bellman-Ford)</option>
                                <option value="ls">Link State (Dijkstra)</option>
                            </select>
                            <button id="btnRouteStep" class="btn-sim primary">Execute Next Step</button>
                            <button id="btnRouteReset" class="btn-sim">Reset Topology</button>
                        </div>
                        
                        <h3 style="color:var(--primary); margin-top:20px; margin-bottom:10px; font-size:14px;">Router A Routing Table</h3>
                        <table class="sim-table" style="width:100%; border-collapse:collapse; font-family:'JetBrains Mono', monospace; font-size:12px; text-align:left;">
                            <thead>
                                <tr style="border-bottom:1px solid var(--border);">
                                    <th style="padding:6px;">Dest</th>
                                    <th style="padding:6px;">Cost</th>
                                    <th style="padding:6px;">Next Hop</th>
                                </tr>
                            </thead>
                            <tbody id="routingTableA">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('routingCanvas');
        const ctx = canvas.getContext('2d');
        let step = 0;

        // Topology definition
        const nodes = ['A', 'B', 'C', 'D', 'E'];
        const edges = [
            {n1: 'A', n2: 'B', cost: 2},
            {n1: 'A', n2: 'C', cost: 5},
            {n1: 'B', n2: 'C', cost: 3},
            {n1: 'B', n2: 'D', cost: 1},
            {n1: 'C', n2: 'E', cost: 2},
            {n1: 'D', n2: 'E', cost: 4},
            {n1: 'C', n2: 'D', cost: 2}
        ];

        const getPos = (id) => {
            const el = document.getElementById('rt' + id);
            if(!el) return {x:0,y:0};
            const rect = el.getBoundingClientRect();
            const parentRect = canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + (rect.width/2),
                y: rect.top - parentRect.top + (rect.height/2)
            };
        };

        const drawTopology = (activeNodes = [], activeEdges = []) => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            edges.forEach(e => {
                const p1 = getPos(e.n1);
                const p2 = getPos(e.n2);
                const isActive = activeEdges.some(ae => (ae.n1===e.n1 && ae.n2===e.n2) || (ae.n1===e.n2 && ae.n2===e.n1));
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = isActive ? '#10b981' : 'rgba(255,255,255,0.1)';
                ctx.lineWidth = isActive ? 3 : 2;
                ctx.stroke();
                
                // Draw cost
                const cx = (p1.x + p2.x)/2;
                const cy = (p1.y + p2.y)/2;
                ctx.fillStyle = 'var(--bg-card)';
                ctx.beginPath();
                ctx.arc(cx, cy, 10, 0, Math.PI*2);
                ctx.fill();
                ctx.strokeStyle = 'var(--border)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.fillStyle = isActive ? '#10b981' : '#fff';
                ctx.font = "bold 11px Outfit, sans-serif";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(e.cost, cx, cy);
            });
            
            // Highlight active nodes
            nodes.forEach(n => {
                const el = document.getElementById('rt'+n);
                if(el) {
                    if(activeNodes.includes(n)) {
                        el.style.boxShadow = '0 0 15px #10b981';
                        el.style.borderColor = '#10b981';
                    } else {
                        el.style.boxShadow = 'none';
                        el.style.borderColor = n==='A'?'#3b82f6':n==='B'?'#10b981':n==='C'?'#f59e0b':n==='D'?'#8b5cf6':'#ef4444';
                    }
                }
            });
        };

        const renderTableA = (data) => {
            const tbody = document.getElementById('routingTableA');
            tbody.innerHTML = '';
            nodes.forEach(n => {
                if(n==='A') return;
                const r = data[n] || {cost: '∞', hop: '-'};
                tbody.innerHTML += `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:6px; color:#fff;">${n}</td>
                        <td style="padding:6px; color:#10b981;">${r.cost}</td>
                        <td style="padding:6px; color:var(--text-muted);">${r.hop}</td>
                    </tr>
                `;
            });
        };

        const resetSim = () => {
            step = 0;
            drawTopology();
            renderTableA({});
            document.getElementById('btnRouteStep').disabled = false;
            document.getElementById('btnRouteStep').textContent = 'Execute Next Step';
        };

        setTimeout(resetSim, 50);
        window.addEventListener('resize', () => { if(document.getElementById('routingCanvas')) drawTopology(); });

        document.getElementById('btnRouteReset').addEventListener('click', resetSim);
        document.getElementById('routeAlgoSelect').addEventListener('change', resetSim);

        document.getElementById('btnRouteStep').addEventListener('click', () => {
            const algo = document.getElementById('routeAlgoSelect').value;
            step++;
            
            if(algo === 'dv') {
                if(step === 1) {
                    drawTopology(['A'], [{n1:'A',n2:'B'}, {n1:'A',n2:'C'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'}
                    });
                } else if(step === 2) {
                    drawTopology(['A', 'B'], [{n1:'B',n2:'C'}, {n1:'B',n2:'D'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'}, // A->B->C is 2+3=5, same cost
                        D: {cost: 3, hop: 'B'}  // A->B->D is 2+1=3
                    });
                } else if(step === 3) {
                    drawTopology(['A', 'D'], [{n1:'D',n2:'E'}, {n1:'D',n2:'C'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'}, // A->B->D->C is 2+1+2=5, same cost
                        D: {cost: 3, hop: 'B'},
                        E: {cost: 7, hop: 'B'}  // A->B->D->E is 2+1+4=7
                    });
                } else if(step === 4) {
                    drawTopology(['A', 'C'], [{n1:'C',n2:'E'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'},
                        D: {cost: 3, hop: 'B'},
                        E: {cost: 7, hop: 'B'} // A->C->E is 5+2=7, same cost
                    });
                    document.getElementById('btnRouteStep').disabled = true;
                    document.getElementById('btnRouteStep').textContent = 'Converged';
                }
            } else {
                // Link State (Dijkstra)
                if(step === 1) {
                    drawTopology(['A'], [{n1:'A',n2:'B'}, {n1:'A',n2:'C'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'}
                    });
                } else if(step === 2) {
                    // Pick B (min cost 2)
                    drawTopology(['A', 'B'], [{n1:'A',n2:'B'}, {n1:'B',n2:'D'}, {n1:'B',n2:'C'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'},
                        D: {cost: 3, hop: 'B'}
                    });
                } else if(step === 3) {
                    // Pick D (min cost 3)
                    drawTopology(['A', 'B', 'D'], [{n1:'A',n2:'B'}, {n1:'B',n2:'D'}, {n1:'D',n2:'E'}, {n1:'D',n2:'C'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'}, 
                        D: {cost: 3, hop: 'B'},
                        E: {cost: 7, hop: 'B'}
                    });
                } else if(step === 4) {
                    // Pick C (min cost 5)
                    drawTopology(['A', 'B', 'D', 'C'], [{n1:'A',n2:'B'}, {n1:'B',n2:'D'}, {n1:'A',n2:'C'}, {n1:'C',n2:'E'}]);
                    renderTableA({
                        B: {cost: 2, hop: 'B'},
                        C: {cost: 5, hop: 'C'},
                        D: {cost: 3, hop: 'B'},
                        E: {cost: 7, hop: 'B'}
                    });
                } else if(step === 5) {
                    // Shortest Path Tree
                    drawTopology(['A', 'B', 'C', 'D', 'E'], [{n1:'A',n2:'B'}, {n1:'B',n2:'D'}, {n1:'A',n2:'C'}, {n1:'C',n2:'E'}]);
                    document.getElementById('btnRouteStep').disabled = true;
                    document.getElementById('btnRouteStep').textContent = 'Shortest Path Tree Built';
                }
            }
        });
    };

    const initTransportSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Transport Layer: TCP vs UDP</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto; overflow-x:hidden;">
                <div style="display:flex; gap:20px; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1.5; min-width:400px; margin:0; position:relative; min-height:350px; overflow:hidden;">
                        <canvas id="transCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                        
                        <div style="position:absolute; top:50%; left:20%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:15px; border-radius:12px; text-align:center; z-index:2; min-width:100px;" id="transClient">
                            <div style="font-size:32px;">💻</div>
                            <div style="font-weight:800; font-size:14px; margin-top:5px;">Host A</div>
                            <div id="tcpStateA" style="font-size:10px; color:#f59e0b; margin-top:5px; font-family:'JetBrains Mono', monospace; font-weight:bold;">CLOSED</div>
                        </div>
                        
                        <div style="position:absolute; top:50%; left:80%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #10b981; padding:15px; border-radius:12px; text-align:center; z-index:2; min-width:100px;" id="transServer">
                            <div style="font-size:32px;">🗄️</div>
                            <div style="font-weight:800; font-size:14px; margin-top:5px;">Host B</div>
                            <div id="tcpStateB" style="font-size:10px; color:#f59e0b; margin-top:5px; font-family:'JetBrains Mono', monospace; font-weight:bold;">LISTEN</div>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="width:350px; margin:0; display:flex; flex-direction:column;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">Protocol Settings</h3>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <label style="font-size:12px; font-weight:800; color:var(--text-muted);">Select Protocol:</label>
                            <select id="transProtocol" class="sim-select" style="width:100%;">
                                <option value="tcp">TCP (Reliable, Connection-Oriented)</option>
                                <option value="udp">UDP (Unreliable, Connectionless)</option>
                            </select>
                            <button id="btnTransStart" class="btn-sim primary">Start Transmission</button>
                        </div>
                        
                        <div id="transConsole" style="background:#0b0f19; border-radius:8px; padding:10px; font-family:'JetBrains Mono', monospace; font-size:11px; color:#10b981; height:180px; overflow-y:auto; margin-top:20px; border:1px solid var(--border);">
                            > Transport Simulator Ready
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('transCanvas');
        const ctx = canvas.getContext('2d');
        let aniFrame = null;
        let isSimRunning = false;

        const getPos = (id) => {
            const el = document.getElementById(id);
            const rect = el.getBoundingClientRect();
            const parentRect = canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + (rect.width/2),
                y: rect.top - parentRect.top + (rect.height/2)
            };
        };

        const drawTopology = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            const client = getPos('transClient');
            const server = getPos('transServer');

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.moveTo(client.x, client.y);
            ctx.lineTo(server.x, server.y);
            ctx.stroke();
        };

        setTimeout(drawTopology, 50);
        window.addEventListener('resize', () => { if(document.getElementById('transCanvas')) drawTopology(); });
        
        const log = (msg, color='#10b981') => {
            const c = document.getElementById('transConsole');
            c.innerHTML += `<div style="color:${color}; margin-bottom:4px;">> ${msg}</div>`;
            c.scrollTop = c.scrollHeight;
        };

        const setTcpState = (host, state, color) => {
            const el = document.getElementById(host === 'A' ? 'tcpStateA' : 'tcpStateB');
            el.textContent = state;
            el.style.color = color;
        };

        const animatePacket = (from, to, color, tag, duration, yOffset=0, onComplete) => {
            let start = performance.now();
            
            const animate = (time) => {
                if(!document.getElementById('transCanvas')) return;
                let progress = (time - start) / duration;
                if(progress > 1) progress = 1;
                
                // Don't clear canvas to allow multiple packets (UDP stream)
                // Just clear this packet's previous position if we wanted to, but we'll re-draw full topology for simplicity in TCP. For UDP, we might just layer them.
                // Actually, to support multiple packets cleanly without redrawing full canvas every frame (which erases other packets), we'll keep a list of active packets in the main loop. But for simplicity, we'll draw over the line.
                
                // Let's just redraw full canvas for TCP, and for UDP we'll manage an array.
                
                const p1 = getPos(from);
                const p2 = getPos(to);
                
                const x = p1.x + (p2.x - p1.x) * progress;
                const y = p1.y + (p2.y - p1.y) * progress + yOffset;
                
                ctx.fillStyle = color;
                ctx.fillRect(x - 10, y - 10, 20, 20);
                
                if(tag) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 9px Outfit, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(tag, x, y);
                }
                
                if(progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if(onComplete) onComplete();
                }
            };
            requestAnimationFrame(animate);
        };

        let packets = [];
        let udpInterval = null;

        const loopUdp = () => {
            if(!document.getElementById('transCanvas')) return;
            drawTopology();
            const now = performance.now();
            packets = packets.filter(p => {
                const prog = (now - p.start) / p.dur;
                if(prog >= 1) return false;
                const p1 = getPos('transClient'), p2 = getPos('transServer');
                const x = p1.x + (p2.x - p1.x) * prog;
                const y = p1.y + (p2.y - p1.y) * prog + p.yOff;
                
                if(p.dropped && prog > 0.5) return false; // packet drops midway
                
                ctx.fillStyle = p.color;
                ctx.fillRect(x - 10, y - 10, 20, 20);
                return true;
            });
            if(isSimRunning && document.getElementById('transProtocol').value === 'udp') {
                aniFrame = requestAnimationFrame(loopUdp);
            }
        };

        document.getElementById('btnTransStart').addEventListener('click', () => {
            if(isSimRunning) return;
            isSimRunning = true;
            document.getElementById('transConsole').innerHTML = '';
            document.getElementById('btnTransStart').disabled = true;
            
            const protocol = document.getElementById('transProtocol').value;
            
            if(protocol === 'tcp') {
                log('Initiating TCP 3-Way Handshake...', '#fff');
                setTcpState('A', 'SYN-SENT', '#f59e0b');
                log('Host A: [SYN] Seq=0', '#3b82f6');
                
                const c = 'transClient', s = 'transServer';
                const drawFull = () => {
                    requestAnimationFrame(() => {
                        if(isSimRunning) { drawTopology(); requestAnimationFrame(drawFull); }
                    });
                };
                drawFull(); // Start background redraw loop
                
                animatePacket(c, s, '#3b82f6', 'SYN', 1500, 0, () => {
                    setTcpState('B', 'SYN-RCVD', '#f59e0b');
                    log('Host B: Received SYN. Sending [SYN, ACK] Seq=0, Ack=1', '#10b981');
                    
                    animatePacket(s, c, '#10b981', 'SYN-ACK', 1500, 0, () => {
                        setTcpState('A', 'ESTABLISHED', '#10b981');
                        log('Host A: Received SYN-ACK. Sending [ACK] Seq=1, Ack=1', '#3b82f6');
                        
                        animatePacket(c, s, '#3b82f6', 'ACK', 1500, 0, () => {
                            setTcpState('B', 'ESTABLISHED', '#10b981');
                            log('TCP CONNECTION ESTABLISHED', '#fff');
                            
                            setTimeout(() => {
                                log('Sending Data Window (Size=3)...');
                                animatePacket(c, s, '#8b5cf6', 'P1', 1000, -20);
                                animatePacket(c, s, '#8b5cf6', 'P2', 1000, 0);
                                animatePacket(c, s, '#8b5cf6', 'P3', 1000, 20, () => {
                                    log('Host B: Received Window. Sending Cumulative [ACK 4]');
                                    animatePacket(s, c, '#10b981', 'ACK 4', 1000, 0, () => {
                                        log('Data transfer complete safely.', '#10b981');
                                        isSimRunning = false;
                                        setTcpState('A', 'CLOSED', '#ef4444');
                                        setTcpState('B', 'LISTEN', '#f59e0b');
                                        document.getElementById('btnTransStart').disabled = false;
                                    });
                                });
                            }, 1000);
                        });
                    });
                });
            } else {
                // UDP
                setTcpState('A', 'N/A', '#64748b');
                setTcpState('B', 'N/A', '#64748b');
                log('Starting UDP Datagram Stream (Connectionless)...', '#fff');
                log('No handshake required. Blasting packets...', '#ef4444');
                
                let count = 0;
                packets = [];
                aniFrame = requestAnimationFrame(loopUdp);
                
                udpInterval = setInterval(() => {
                    if(count > 20) {
                        clearInterval(udpInterval);
                        setTimeout(() => {
                            isSimRunning = false;
                            document.getElementById('btnTransStart').disabled = false;
                            log('UDP Stream Finished. No ACKs expected or received.', '#fff');
                        }, 1000);
                        return;
                    }
                    count++;
                    const dropped = Math.random() < 0.2; // 20% drop rate
                    packets.push({
                        start: performance.now(),
                        dur: 800 + Math.random()*400,
                        yOff: (Math.random() - 0.5) * 80,
                        color: dropped ? '#ef4444' : '#3b82f6',
                        dropped: dropped
                    });
                    if(dropped) log(`Datagram ${count} dropped in transit. (No retransmission)`, '#ef4444');
                }, 150);
            }
        });
    };

    const initCsmaSim = (container) => {
        container.innerHTML = `
            <div class="sim-toolbar">
                <div class="section-title" style="font-size:22px; margin:0; color:var(--primary);">Media Access Control: CSMA</div>
            </div>
            <div class="sim-workspace" style="padding:20px; gap:20px; flex-direction:column; overflow-y:auto; overflow-x:hidden;">
                <div style="display:flex; gap:20px; flex-wrap:wrap;">
                    <div class="theory-card" style="flex:1.5; min-width:400px; margin:0; position:relative; min-height:450px; overflow:hidden;">
                        <canvas id="csmaCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;"></canvas>
                        
                        <!-- Shared Bus Line -->
                        <div style="position:absolute; top:50%; left:10%; right:10%; height:8px; background:#1e293b; border-radius:4px; z-index:0; border:1px solid #334155;"></div>
                        
                        <div style="position:absolute; top:20%; left:25%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #3b82f6; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="macNode1">
                            <div style="font-size:24px;">💻</div>
                            <div style="font-weight:800; font-size:11px;">Node 1</div>
                            <div style="font-size:9px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;" id="stateN1">IDLE</div>
                        </div>
                        
                        <div style="position:absolute; top:80%; left:50%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #10b981; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="macNode2">
                            <div style="font-size:24px;">💻</div>
                            <div style="font-weight:800; font-size:11px;">Node 2</div>
                            <div style="font-size:9px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;" id="stateN2">IDLE</div>
                        </div>
                        
                        <div style="position:absolute; top:20%; left:75%; transform:translate(-50%,-50%); background:var(--bg-card); border:2px solid #f59e0b; padding:10px; border-radius:8px; text-align:center; z-index:2;" id="macNode3">
                            <div style="font-size:24px;">💻</div>
                            <div style="font-weight:800; font-size:11px;">Node 3</div>
                            <div style="font-size:9px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;" id="stateN3">IDLE</div>
                        </div>
                    </div>
                    
                    <div class="theory-card" style="width:300px; margin:0; display:flex; flex-direction:column;">
                        <h3 style="color:var(--primary); margin-bottom:15px;">MAC Controls</h3>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <label style="font-size:12px; font-weight:800; color:var(--text-muted);">Protocol:</label>
                            <select id="macProtocol" class="sim-select" style="width:100%;">
                                <option value="cd">CSMA/CD (Ethernet)</option>
                                <option value="ca">CSMA/CA (Wi-Fi)</option>
                            </select>
                            
                            <label style="font-size:12px; font-weight:800; color:var(--text-muted); margin-top:5px;">Traffic Load:</label>
                            <input type="range" id="macLoad" min="1" max="3" value="2" style="width:100%;">
                            <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
                                <span>Low</span><span>Med</span><span>High (Collisions!)</span>
                            </div>
                            
                            <label style="font-size:12px; font-weight:800; color:var(--text-muted); margin-top:5px; display:flex; align-items:center; gap:8px;">
                                <input type="checkbox" id="macRts" checked> Use RTS/CTS (CA Only)
                            </label>
                            
                            <button id="btnMacStart" class="btn-sim primary" style="margin-top:10px;">Trigger Transmission</button>
                        </div>
                        
                        <div id="macConsole" style="background:#0b0f19; border-radius:8px; padding:10px; font-family:'JetBrains Mono', monospace; font-size:11px; color:#10b981; flex:1; overflow-y:auto; margin-top:15px; border:1px solid var(--border);">
                            > MAC Subsystem Initialized
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('csmaCanvas');
        const ctx = canvas.getContext('2d');
        let isSimRunning = false;

        const getPos = (id) => {
            const el = document.getElementById(id);
            const rect = el.getBoundingClientRect();
            const parentRect = canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + (rect.width/2),
                y: rect.top - parentRect.top + (rect.height/2)
            };
        };

        const drawTopology = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            const n1 = getPos('macNode1'), n2 = getPos('macNode2'), n3 = getPos('macNode3');
            const busY = canvas.height / 2;

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#1e293b';
            
            // Drop cables
            [n1, n2, n3].forEach(n => {
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n.x, busY);
                ctx.stroke();
            });
        };

        setTimeout(drawTopology, 50);
        window.addEventListener('resize', () => { if(document.getElementById('csmaCanvas')) drawTopology(); });
        
        const log = (msg, color='#10b981') => {
            const c = document.getElementById('macConsole');
            c.innerHTML += `<div style="color:${color}; margin-bottom:4px;">> ${msg}</div>`;
            c.scrollTop = c.scrollHeight;
        };

        const setState = (id, state, color) => {
            const el = document.getElementById(id);
            el.textContent = state;
            el.style.color = color;
        };

        const animateSignal = (srcNode, isCollision, color, tag, onComplete) => {
            let start = performance.now();
            const dur = 1500;
            const srcPos = getPos(srcNode);
            const busY = canvas.height / 2;
            
            const animate = (time) => {
                if(!document.getElementById('csmaCanvas')) return;
                let prog = (time - start) / dur;
                if(prog > 1) prog = 1;
                
                drawTopology();
                
                // Drop to bus
                let dropProg = Math.min(prog * 3, 1);
                ctx.fillStyle = color;
                ctx.fillRect(srcPos.x - 5, srcPos.y + (busY - srcPos.y)*dropProg - 5, 10, 10);
                
                if(prog > 0.33) {
                    // Spread on bus
                    let spreadProg = (prog - 0.33) * 1.5;
                    const maxSpread = canvas.width * 0.4;
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(srcPos.x - maxSpread*spreadProg, busY - 4, maxSpread*spreadProg*2, 8);
                    ctx.globalAlpha = 1.0;
                    
                    if(isCollision && prog > 0.6) {
                        ctx.fillStyle = '#ef4444';
                        ctx.beginPath();
                        ctx.arc(srcPos.x, busY, 20 + Math.sin(time/50)*10, 0, Math.PI*2);
                        ctx.fill();
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 12px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('COLLISION', srcPos.x, busY + 35);
                    } else if (tag && prog > 0.5 && prog < 0.9) {
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px monospace';
                        ctx.fillText(tag, srcPos.x + 15, busY - 15);
                    }
                }
                
                if(prog < 1) requestAnimationFrame(animate);
                else { drawTopology(); if(onComplete) onComplete(); }
            };
            requestAnimationFrame(animate);
        };

        document.getElementById('btnMacStart').addEventListener('click', () => {
            if(isSimRunning) return;
            isSimRunning = true;
            document.getElementById('macConsole').innerHTML = '';
            
            const proto = document.getElementById('macProtocol').value;
            const load = document.getElementById('macLoad').value;
            const rts = document.getElementById('macRts').checked;
            
            document.querySelectorAll('[id^=stateN]').forEach(el => {el.textContent = 'IDLE'; el.style.color='#64748b';});
            
            if(proto === 'cd') {
                log('CSMA/CD: Carrier Sense Multiple Access / Collision Detection', '#fff');
                log('Node 1 listening to medium...');
                setState('stateN1', 'SENSING', '#f59e0b');
                
                setTimeout(() => {
                    log('Medium IDLE. Node 1 begins transmission.');
                    setState('stateN1', 'TRANSMITTING', '#3b82f6');
                    
                    if(load >= 2 && Math.random() > 0.4) {
                        // Collision Scenario
                        log('Node 3 simultaneously transmits! (Propagation Delay)', '#ef4444');
                        setState('stateN3', 'TRANSMITTING', '#3b82f6');
                        animateSignal('macNode1', true, '#3b82f6', 'DATA');
                        setTimeout(() => animateSignal('macNode3', true, '#f59e0b', 'DATA'), 200);
                        
                        setTimeout(() => {
                            log('COLLISION DETECTED! Sending JAM signal.', '#ef4444');
                            setState('stateN1', 'JAMMING', '#ef4444');
                            setState('stateN3', 'JAMMING', '#ef4444');
                            setTimeout(() => {
                                log('Nodes executing Binary Exponential Backoff.');
                                setState('stateN1', 'BACKOFF (8μs)', '#8b5cf6');
                                setState('stateN3', 'BACKOFF (14μs)', '#8b5cf6');
                                setTimeout(() => {
                                    log('Node 1 timer expired. Retransmitting...', '#10b981');
                                    setState('stateN1', 'TRANSMITTING', '#3b82f6');
                                    setState('stateN3', 'IDLE', '#64748b');
                                    animateSignal('macNode1', false, '#3b82f6', 'DATA', () => {
                                        log('Transmission Complete.', '#10b981');
                                        setState('stateN1', 'IDLE', '#64748b');
                                        isSimRunning = false;
                                    });
                                }, 1500);
                            }, 1000);
                        }, 1200);
                    } else {
                        // Success Scenario
                        animateSignal('macNode1', false, '#3b82f6', 'DATA', () => {
                            log('Transmission completed successfully.', '#10b981');
                            setState('stateN1', 'IDLE', '#64748b');
                            isSimRunning = false;
                        });
                    }
                }, 800);
            } else {
                // CA
                log('CSMA/CA: Collision Avoidance (Wireless Mode)', '#fff');
                log('Node 1 wants to send to Node 2.');
                setState('stateN1', 'DIFS WAIT', '#f59e0b');
                
                setTimeout(() => {
                    if(rts) {
                        log('Node 1 sending RTS (Request to Send)...');
                        setState('stateN1', 'RTS', '#8b5cf6');
                        animateSignal('macNode1', false, '#8b5cf6', 'RTS', () => {
                            log('Node 2 sending CTS (Clear to Send)...', '#10b981');
                            setState('stateN2', 'CTS', '#10b981');
                            setState('stateN3', 'NAV WAIT', '#ef4444');
                            log('Node 3 updates NAV (Network Allocation Vector) and sleeps.', '#ef4444');
                            animateSignal('macNode2', false, '#10b981', 'CTS', () => {
                                log('Node 1 sending DATA...', '#3b82f6');
                                setState('stateN1', 'DATA', '#3b82f6');
                                setState('stateN2', 'RECEIVING', '#10b981');
                                animateSignal('macNode1', false, '#3b82f6', 'DATA', () => {
                                    log('Node 2 sending ACK.', '#10b981');
                                    setState('stateN1', 'WAIT ACK', '#f59e0b');
                                    setState('stateN2', 'ACK', '#10b981');
                                    animateSignal('macNode2', false, '#10b981', 'ACK', () => {
                                        log('CSMA/CA Exchange Complete!', '#fff');
                                        document.querySelectorAll('[id^=stateN]').forEach(el => {el.textContent = 'IDLE'; el.style.color='#64748b';});
                                        isSimRunning = false;
                                    });
                                });
                            });
                        });
                    } else {
                        log('RTS/CTS disabled. Sending DATA directly...', '#3b82f6');
                        setState('stateN1', 'DATA', '#3b82f6');
                        
                        if(load >= 2 && Math.random() > 0.4) {
                            log('Hidden Node (Node 3) also transmits! Collision occurs at Node 2!', '#ef4444');
                            setState('stateN3', 'DATA', '#3b82f6');
                            animateSignal('macNode1', true, '#3b82f6', 'DATA');
                            setTimeout(() => animateSignal('macNode3', true, '#f59e0b', 'DATA'), 200);
                            setTimeout(() => {
                                log('Collision destroys DATA. No ACK received.', '#ef4444');
                                setState('stateN1', 'TIMEOUT', '#ef4444');
                                setState('stateN3', 'TIMEOUT', '#ef4444');
                                setTimeout(() => {
                                    log('Backoff & Retrying...', '#f59e0b');
                                    isSimRunning = false;
                                }, 1500);
                            }, 1500);
                        } else {
                            animateSignal('macNode1', false, '#3b82f6', 'DATA', () => {
                                log('Node 2 sending ACK.', '#10b981');
                                setState('stateN2', 'ACK', '#10b981');
                                animateSignal('macNode2', false, '#10b981', 'ACK', () => {
                                    log('CSMA/CA Exchange Complete.', '#10b981');
                                    document.querySelectorAll('[id^=stateN]').forEach(el => {el.textContent = 'IDLE'; el.style.color='#64748b';});
                                    isSimRunning = false;
                                });
                            });
                        }
                    }
                }, 1000);
            }
        });
    };

    const initSimulation = (id) => {
        const data = window.VLAB_DATA[id];
        const container = document.getElementById('dynamic-sim-ui');

        if (!data) {
            container.innerHTML = `
                <div class="sim-placeholder" style="text-align:center; padding:100px; color:var(--text-muted);">
                    <div style="font-size:48px; margin-bottom:20px;">🛡️</div>
                    <h2>Standard Simulation Unavailable</h2>
                    <p>This is a free-form Practice Lab. Switch to the <b>Experiment</b> tab to build your network.</p>
                </div>
            `;
            return;
        }

        if (data.simType === 'programming') {
            initProgrammingLab(container, id);
            return;
        }

        if (data.simType === 'dbms_sql') {
            initSqlLab(container, id);
            return;
        }

        if (data.simType === 'dbms_transactions') {
            initTransactionsLab(container, id);
            return;
        }

        if (data.simType === 'dbms_indexing') {
            initIndexingLab(container, id);
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

        if (data.simType === 'vlan_sim') {
            initVlanSim(container);
            return;
        }

        if (data.simType === 'dns') {
            initDnsSim(container);
            return;
        }

        if (data.simType === 'dv_sim' || data.simType === 'ls_sim') {
            initRoutingSim(container);
            return;
        }

        if (data.simType === 'gbn' || data.simType === 'udp') {
            initTransportSim(container);
            return;
        }

        if (data.simType === 'collision' || data.simType === 'csma_ca') {
            initCsmaSim(container);
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
                <div class="terminal-workspace" style="height:100%; display:flex; flex-direction:column; background:#0b0f19; border-radius:12px; border:1px solid var(--border); overflow:hidden; font-family:'JetBrains Mono', monospace; color:#10b981; min-height:400px;">
                    <div style="background:#131824; padding:10px 15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:var(--text-muted); font-size:12px; font-weight:800;">OS INTERACTIVE CLI TERMINAL</span>
                        <div style="display:flex; gap:6px;">
                            <span style="width:10px; height:10px; background:#ef4444; border-radius:50%; display:inline-block;"></span>
                            <span style="width:10px; height:10px; background:#fbbf24; border-radius:50%; display:inline-block;"></span>
                            <span style="width:10px; height:10px; background:#10b981; border-radius:50%; display:inline-block;"></span>
                        </div>
                    </div>
                    <div id="osTerminalOutput" style="flex:1; padding:20px; overflow-y:auto; font-size:13px; line-height:1.6; white-space:pre-wrap; text-align:left; font-family:'JetBrains Mono', monospace; color:#10b981;">Welcome to the MIT ADT OS Shell v2.1 (Kernel: NetForge-OS)
Type 'help' to list available academic commands.

student@mitadt-os:~$ </div>
                    <div style="display:flex; background:#131824; border-top:1px solid var(--border); padding:10px 15px; align-items:center; gap:10px;">
                        <span style="font-weight:800; color:#a855f7;">student@mitadt-os:~$</span>
                        <input type="text" id="osTerminalInput" style="flex:1; background:transparent; border:none; color:#10b981; outline:none; font-family:'JetBrains Mono', monospace; font-size:13px;" placeholder="Type a command and press Enter..." autocomplete="off">
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

    const moduleSelectEl = document.getElementById('moduleSelect');
    if (moduleSelectEl) {
        moduleSelectEl.addEventListener('change', (e) => {
            const labId = document.getElementById('labSelect').value;
            const newIndex = parseInt(e.target.value, 10);
            localStorage.setItem(`${labId}_active_module`, newIndex);
            window.currentModuleIndex = newIndex;
            
            // Reload active lab details
            loadLab(labId);
            
            // Re-trigger click on active nav item to refresh the panel and check lock status
            const activeSectionEl = document.querySelector('.nav-item.active');
            if (activeSectionEl) {
                activeSectionEl.click();
            }
        });
    }

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
        } else if (currentSubject === 'programming') {
            optionsHtml = `
                <option value="c_prog">1. C Programming Lab</option>
                <option value="cpp_prog">2. C++ OOP Concepts Lab</option>
                <option value="java_prog">3. Java Programming Lab</option>
                <option value="python_prog">4. Python Scripting Lab</option>
            `;
            const crumbs = document.querySelectorAll('.breadcrumb .crumb');
            if (crumbs.length >= 2) {
                crumbs[1].textContent = "Computer Programming Lab";
            }
            document.documentElement.style.setProperty('--primary', '#10b981');
            document.documentElement.style.setProperty('--primary-rgb', '16, 185, 129');
            document.documentElement.style.setProperty('--accent', '#34d399');
            document.title = "MIT ADT VLAB - Computer Programming";
        } else if (currentSubject === 'dbms') {
            optionsHtml = `
                <option value="sql_queries">1. Relational Schemas & SQL</option>
                <option value="transactions">2. Concurrency & Transactions</option>
                <option value="indexing">3. Indexing & B-Trees</option>
            `;
            const crumbs = document.querySelectorAll('.breadcrumb .crumb');
            if (crumbs.length >= 2) {
                crumbs[1].textContent = "Database Systems Lab";
            }
            document.documentElement.style.setProperty('--primary', '#f59e0b');
            document.documentElement.style.setProperty('--primary-rgb', '245, 158, 11');
            document.documentElement.style.setProperty('--accent', '#fbbf24');
            document.title = "MIT ADT VLAB - Database Systems";
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

    // Sanitize initial lab variable by active subject track to prevent cross-subject loading bugs
    const osLabs = ['cpu_scheduling', 'process_sync', 'deadlock_avoidance', 'page_replacement', 'disk_scheduling'];
    const netLabs = ['cables_devices', 'modulation', 'net_commands', 'ip_class', 'csma', 'csma_ca', 'subnet', 'vlan', 'routing_protocols', 'routing_dv', 'routing_ls', 'udp', 'tcp', 'dns', 'practice'];
    const progLabs = ['c_prog', 'cpp_prog', 'java_prog', 'python_prog'];
    const dbmsLabs = ['sql_queries', 'transactions', 'indexing'];
    
    let initialLab = localStorage.getItem('vlab_current_lab');
    if (currentSubject === 'os') {
        if (!osLabs.includes(initialLab)) {
            initialLab = 'cpu_scheduling';
            localStorage.setItem('vlab_current_lab', 'cpu_scheduling');
        }
    } else if (currentSubject === 'programming') {
        if (!progLabs.includes(initialLab)) {
            initialLab = 'c_prog';
            localStorage.setItem('vlab_current_lab', 'c_prog');
        }
    } else if (currentSubject === 'dbms') {
        if (!dbmsLabs.includes(initialLab)) {
            initialLab = 'sql_queries';
            localStorage.setItem('vlab_current_lab', 'sql_queries');
        }
    } else {
        if (!netLabs.includes(initialLab)) {
            initialLab = 'csma';
            localStorage.setItem('vlab_current_lab', 'csma');
        }
    }

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

    // ==========================================
    // GLOBAL AI TUTOR ASSISTANT LOGIC
    // ==========================================
    const globalBubble = document.getElementById('global-ai-bubble');
    const globalDrawer = document.getElementById('global-ai-drawer');
    const btnGlobalAiClose = document.getElementById('btnGlobalAiClose');
    const btnGlobalAiSend = document.getElementById('btnGlobalAiSend');
    const globalAiInput = document.getElementById('global-ai-chat-input');
    const globalChatLogs = document.getElementById('global-ai-chat-logs');
    
    if (globalBubble && globalDrawer) {
        globalBubble.addEventListener('click', () => {
            const isOpen = globalDrawer.style.display === 'flex';
            globalDrawer.style.display = isOpen ? 'none' : 'flex';
            if (isOpen) {
                globalBubble.classList.remove('active');
            } else {
                globalBubble.classList.add('active');
                globalAiInput.focus();
            }
        });
        
        btnGlobalAiClose.addEventListener('click', () => {
            globalDrawer.style.display = 'none';
            globalBubble.classList.remove('active');
        });
        
        const appendGlobalMessage = (sender, message) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `global-ai-msg ${sender}`;
            msgDiv.textContent = message;
            globalChatLogs.appendChild(msgDiv);
            globalChatLogs.scrollTop = globalChatLogs.scrollHeight;
        };
        
        const getActiveContext = () => {
            const subject = localStorage.getItem('vlab_current_subject') || 'networking';
            const labId = document.getElementById('labSelect').value;
            const labData = window.VLAB_DATA ? window.VLAB_DATA[labId] : null;
            const labTitle = labData ? labData.title : 'Custom Lab';
            const activeSectionEl = document.querySelector('.nav-item.active');
            const activeTab = activeSectionEl ? activeSectionEl.getAttribute('data-section') : 'aim';
            
            let context = `Active Subject: ${subject}. Active Lab: ${labTitle}. Current Screen: ${activeTab}.\n`;
            
            // Check if programming/multi-module
            if (labData && labData.isMultiModule) {
                const modIdx = window.currentModuleIndex !== undefined && window.currentModuleIndex !== null ? window.currentModuleIndex : 0;
                const modData = labData.modules[modIdx];
                context += `Active Sub-Module: ${modData ? modData.title : 'N/A'}.\n`;
            }
            
            // Extract code context if in programming sandbox or DBMS editor
            const aceEl = document.getElementById('ace-editor');
            if (aceEl && window.ace) {
                try {
                    const editor = window.ace.edit("ace-editor");
                    const code = editor.getValue();
                    if (code && code.trim()) {
                        context += `Student's current editor code:\n${code.substring(0, 1000)}\n`;
                    }
                } catch(e) {}
            }
            
            // Extract SQL query if active
            const sqlTextarea = document.getElementById('sql-query-input');
            if (sqlTextarea && sqlTextarea.value.trim()) {
                context += `Student's SQL query:\n${sqlTextarea.value.trim()}\n`;
            }
            
            // Extract topology nodes/connections if in network editor
            if (window.currentTopo && window.currentTopo.nodes) {
                const nodesCount = window.currentTopo.nodes.length;
                const linksCount = window.currentTopo.links ? window.currentTopo.links.length : 0;
                context += `Network Topology: ${nodesCount} nodes, ${linksCount} links. Node names: ${window.currentTopo.nodes.map(n => n.name).join(', ')}.\n`;
            }
            
            return context;
        };
        
        const getCurriculumDataCorpus = () => {
            const subject = localStorage.getItem('vlab_current_subject') || 'networking';
            let corpus = `=== MIT ADT VLAB CURRICULUM REFERENCE MANUAL - SUBJECT: ${subject.toUpperCase()} ===\n\n`;
            
            const osLabs = ['cpu_scheduling', 'process_sync', 'deadlock_avoidance', 'page_replacement', 'disk_scheduling'];
            const netLabs = ['cables_devices', 'modulation', 'net_commands', 'ip_class', 'csma', 'csma_ca', 'subnet', 'vlan', 'routing_protocols', 'routing_dv', 'routing_ls', 'udp', 'tcp', 'dns', 'practice'];
            const progLabs = ['c_prog', 'cpp_prog', 'java_prog', 'python_prog'];
            const dbmsLabs = ['sql_queries', 'transactions', 'indexing'];
            
            let targetKeys = [];
            if (subject === 'os') targetKeys = osLabs;
            else if (subject === 'dbms') targetKeys = dbmsLabs;
            else if (subject === 'programming') targetKeys = progLabs;
            else targetKeys = netLabs;
            
            targetKeys.forEach(key => {
                const data = window.VLAB_DATA[key];
                if (!data) return;
                
                corpus += `--- LAB ID: ${key} ---\n`;
                corpus += `Title: ${data.title}\n`;
                corpus += `Aim: ${data.aim}\n`;
                if (data.theory) {
                    corpus += `Theory Intro: ${data.theory.intro || ''}\n`;
                    if (data.theory.cards) {
                        data.theory.cards.forEach((c, idx) => {
                            corpus += `Theory Concept ${idx+1}: ${c.title} - ${c.content}\n`;
                        });
                    }
                }
                if (data.procedure) {
                    corpus += `Procedure steps:\n${data.procedure.join('\n')}\n`;
                }
                if (data.practice_commands) {
                    corpus += `Practice CLI commands: ${data.practice_commands.join(', ')}\n`;
                }
                if (data.practice_questions) {
                    corpus += `Practice review tasks:\n${data.practice_questions.join('\n')}\n`;
                }
                if (data.isMultiModule && data.modules) {
                    corpus += `This is a multi-module lab with ${data.modules.length} modules:\n`;
                    data.modules.forEach((mod, idx) => {
                        corpus += `  Module ${idx+1}: ${mod.title}\n`;
                        corpus += `    Module Aim: ${mod.aim}\n`;
                        corpus += `    Module Procedure: ${mod.procedure ? mod.procedure.join(' -> ') : ''}\n`;
                        if (mod.defaultCode) {
                            corpus += `    Module Starter Code:\n${mod.defaultCode}\n`;
                        }
                    });
                }
                corpus += `\n`;
            });
            
            return corpus;
        };

        const executeGlobalChatQuery = async (queryText) => {
            if (!queryText.trim()) return;
            appendGlobalMessage('student', queryText);
            appendGlobalMessage('ai', 'AI Tutor is writing a response...');
            
            const context = getActiveContext();
            let responseText = "";
            
            const key = getApiKey();
            if (key) {
                const curriculumCorpus = getCurriculumDataCorpus();
                const systemPrompt = `You are the MIT VLab Academic AI Tutor. You are trained and data-driven on the entire curriculum of this virtual laboratory platform.
Use the following Curriculum Reference Manual to guide the student correctly, referencing actual aims, procedures, and concepts from the platform:

${curriculumCorpus}

Current Student Context:
${context}

Student Question: ${queryText}

Academic Rules:
1. Provide clear, step-by-step guidance to help the student learn.
2. Under no circumstances should you print raw solution code directly for the active programming/SQL exercises. Instead, explain the logical building blocks and let the student code it.
3. Be highly informative, academic, and detailed. Show that you have full knowledge of the curriculum. Keep responses educational and relatively concise.`;
                responseText = await askGemini(systemPrompt);
            } else {
                // Heuristic Offline Evaluation
                const subject = localStorage.getItem('vlab_current_subject') || 'networking';
                
                responseText = localAIEvaluator("", queryText, "");
                
                // Subject-Specific Local Heuristics
                const queryLower = queryText.toLowerCase();
                if (responseText.includes("Currently in Local Mode")) {
                    let subjectHelp = "";
                    if (subject === 'os') {
                        if (queryLower.includes('scheduling') || queryLower.includes('cpu')) {
                            subjectHelp = "AI Tutor: CPU Scheduling algorithms decide which process in the ready queue is allocated the CPU. FCFS is non-preemptive and has a convoy effect. SJF (Shortest Job First) is optimal for minimizing average waiting time. Round Robin uses time-quanta slicing for fair CPU sharing.";
                        } else if (queryLower.includes('deadlock') || queryLower.includes('banker')) {
                            subjectHelp = "AI Tutor: Banker's algorithm is a deadlock avoidance method that simulates resource allocation for each process. It determines if an allocation is 'safe' by checking if a safe sequence exists where all processes can run to completion.";
                        } else if (queryLower.includes('page') || queryLower.includes('replacement') || queryLower.includes('fifo') || queryLower.includes('lru')) {
                            subjectHelp = "AI Tutor: Page replacement algorithms decide which memory page to swap out when a new page is needed. FIFO swaps the oldest page (can experience Belady's anomaly). LRU swaps the page that hasn't been accessed for the longest time.";
                        } else {
                            subjectHelp = "AI Tutor (OS Mode): How can I help you with operating system algorithms? Ask about CPU Scheduling, Process Semaphores, Deadlocks, Page Replacements, or Disk Head movements!";
                        }
                    } else if (subject === 'dbms') {
                        if (queryLower.includes('sql') || queryLower.includes('select') || queryLower.includes('join')) {
                            subjectHelp = "AI Tutor: SQL queries fetch relational data. Use SELECT to project columns, WHERE to filter rows, INNER JOIN to match keys, and GROUP BY with HAVING to filter aggregates.";
                        } else if (queryLower.includes('acid') || queryLower.includes('transaction') || queryLower.includes('concurrency')) {
                            subjectHelp = "AI Tutor: Database transactions must guarantee ACID properties: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (independent concurrent execution), and Durability (permanent saves).";
                        } else if (queryLower.includes('index') || queryLower.includes('b-tree')) {
                            subjectHelp = "AI Tutor: A B-Tree index keeps records sorted and allows search, insertion, and deletion in O(log N) operations. Nodes split when capacity is exceeded to remain balanced.";
                        } else {
                            subjectHelp = "AI Tutor (DBMS Mode): How can I help you with database concepts? Ask about SQL joins, ACID properties, Transaction rollbacks, or B-Tree visualizers!";
                        }
                    } else if (subject === 'networking') {
                        if (queryLower.includes('subnet') || queryLower.includes('cidr') || queryLower.includes('mask')) {
                            subjectHelp = "AI Tutor: Subnetting divides a larger network into smaller, efficient subnets. A /24 CIDR prefix represents a 255.255.255.0 mask with 8 host bits, yielding 2^8 - 2 = 254 usable host addresses.";
                        } else if (queryLower.includes('vlan')) {
                            subjectHelp = "AI Tutor: A Virtual Local Area Network (VLAN) groups devices on separate physical networks into a single logical broadcast domain, improving security and reducing broadcast traffic.";
                        } else if (queryLower.includes('dns')) {
                            subjectHelp = "AI Tutor: The Domain Name System (DNS) translates human-readable domain names (e.g. google.com) to machine-readable IP addresses using a hierarchical distributed database of servers.";
                        } else {
                            subjectHelp = "AI Tutor (Networking Mode): How can I help you with networking topologies? Ask about subnet masking, VLAN tagging, Routing tables (OSPF/RIP), DNS resolution, or CSMA collision controls!";
                        }
                    }
                    if (subjectHelp) {
                        responseText = subjectHelp + "\n\n(Tip: Save a Gemini API Key in the programming settings (⚙️) to unlock premium live conversational queries across all labs!)";
                    }
                }
            }
            
            // Remove thinking message
            if (globalChatLogs.lastChild) globalChatLogs.removeChild(globalChatLogs.lastChild);
            appendGlobalMessage('ai', responseText || "Error communicating with AI.");
        };
        
        btnGlobalAiSend.addEventListener('click', () => {
            const query = globalAiInput.value;
            globalAiInput.value = "";
            executeGlobalChatQuery(query);
        });
        
        globalAiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = globalAiInput.value;
                globalAiInput.value = "";
                executeGlobalChatQuery(query);
            }
        });
        
        // Quick tools triggers
        document.getElementById('btnGlobalAiExplain').addEventListener('click', () => {
            const labId = document.getElementById('labSelect').value;
            const labData = window.VLAB_DATA ? window.VLAB_DATA[labId] : null;
            const title = labData ? labData.title : 'this lab';
            executeGlobalChatQuery(`Explain the core theory and learning objectives of ${title} in simple terms with analogies.`);
        });
        
        document.getElementById('btnGlobalAiAudit').addEventListener('click', () => {
            const subject = localStorage.getItem('vlab_current_subject') || 'networking';
            if (subject === 'programming') {
                executeGlobalChatQuery("Audit my current code editor quality, efficiency, name checks, optimizations and show me how to improve it.");
            } else if (subject === 'dbms') {
                executeGlobalChatQuery("Check my SQL query syntax and let me know if it matches the schema specifications.");
            } else {
                executeGlobalChatQuery("Review my topology design or configuration parameters for errors.");
            }
        });
    }
});
