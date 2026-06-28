# Comprehensive Audit Report

## FILE 1: `vlab.js` (5180 lines, 280KB)

---

### 🔴 CRITICAL BUGS

**[BUG-1] `currentSubject` used before declaration — Lines 4663–4690**
- **Type:** Undefined variable / scope error
- **Description:** `currentSubject` is used on lines 4663, 4664, and 4690 inside the disk scheduling `runDiskSim()` function (which is defined inside `DOMContentLoaded`). However, the variable `currentSubject` is declared at line 4912 (inside `initExperiment`) and line 5081 (module-level in `DOMContentLoaded`). The uses at 4663/4664/4690 are **inside a different local function scope** (`initDiskSchedulingSim` closure) where `currentSubject` is **not in lexical scope** at the point of execution — it depends on closure over the line-5081 declaration. Since `runDiskSim` is called via a click event handler after full page load, the line-5081 `const currentSubject` will already be defined in the enclosing `DOMContentLoaded` closure, so it *works at runtime*. However, it is a **fragile reference** — if `initDiskSchedulingSim` were ever called before line 5081 executes, it would throw `ReferenceError`. This is a latent bug with misleading scoping.

**[BUG-2] Duplicate `destroy()` method in `NetworkingSim` class — Lines 1994 & 2360**
- **Type:** Duplicate method definition (JavaScript class bug)
- **Description:** The `NetworkingSim` class has **two `destroy()` methods**: one at line 1994 and another at line 2360. In JavaScript, the second definition silently overwrites the first. The method at line 1994 sets `this.isDestroyed = true` and `this.timerActive = false`; the one at line 2360 does NOT. This means `isDestroyed` and `timerActive` are never set when destroy is called, causing the animation loop at line 2154 (`if (this.isDestroyed) return`) to **never stop**. This is a **zombie animation frame leak** on every lab switch.

**[BUG-3] `node.el` referenced before assignment in cabling mode — Line 1097**
- **Type:** Null reference / runtime error
- **Description:** At line 1097: `this.cableStartNode.el.classList.remove('cabling-source')`. The `node.el` property is assigned at line 1155 (`node.el = div`), **after** `addNodeElement` completes. However, in the cable connection flow (line 1097), `this.cableStartNode.el` is accessed. If `addNodeElement` has not set `.el` yet (e.g. if the cabling source was created differently), this throws `TypeError: Cannot read properties of null`. In practice this mostly works, but it's a fragile assumption.

---

### 🟠 SERIOUS ISSUES

**[BUG-4] `LABS` import from `./labs/index.js` is imported but never used — Line 6**
- **Type:** Dead import / unused module
- **Description:** Line 6: `import { LABS } from "./labs/index.js";` — The `LABS` array is imported but **never referenced anywhere** in vlab.js. All lab routing is done via `window.VLAB_DATA` (from vlabData.js). The import serves no purpose and wastes a network round-trip for the `labs/index.js` file and all 18 sub-modules it loads. This also means any errors in those 18 files would break the module import silently.

**[BUG-5] `engine.js` is missing from `<script>` tags in `vlab.html`**
- **Type:** Missing script dependency
- **Description:** `engine.js` (26KB) exists in the project root but is **never loaded** by `vlab.html`. The HTML only loads `vlabData.js` and `vlab.js`. If any functionality depends on `engine.js`, it will silently fail.

**[BUG-6] `initSimulation()` does NOT route `csma`, `csma_ca`, `vlan`, `dns`, `routing_*`, `tcp`, `udp`, `modulation` to dedicated init functions**
- **Type:** Missing routing / dispatch logic
- **Description:** The `initSimulation()` function (line 4695) routes to dedicated init functions for:
  - `cpu_scheduling` → `initCpuSchedulingSim()`
  - `process_sync` → `initProcessSyncSim()`
  - `bankers` → `initBankersSim()`
  - `page_replacement` → `initPageReplacementSim()`
  - `disk_scheduling` → `initDiskSchedulingSim()`
  - `subnet_calc` → `initSubnetCalc()`
  - `ip_sorter` → `initIpSorter()`
  - `cmd_challenge` → `initCmdChallenge()`
  - `media_study` → `initMediaStudy()`
  - **Everything else falls through to generic `NetworkingSim` canvas**, including labs with simTypes `collision`, `csma_ca`, `gbn`, `dv_sim`, `ls_sim`, `path_sim`, `vlan_sim`, `dns`, `modulation`, `udp`. These are handled inside `NetworkingSim.animate()` by mode branching. This works, **but there is no explicit route validation** — if a `simType` is misspelled in vlabData.js, it silently falls through to the generic canvas and renders nothing meaningful.

**[BUG-7] Duplicate element IDs injected by `initSimulation()` on repeat calls**
- **Type:** DOM ID collision
- **Description:** Every call to `initSimulation()` injects `id="simCanvas"`, `id="eventList"`, `id="statSent"`, `id="statAck"`, `id="statEff"`, `id="statThroughput"`, `id="btnPlaySim"`, `id="btnResetSim"`, `id="simType"`, `id="sim-overlay"` (line 4755–4800). Similarly, `initCpuSchedulingSim()` injects `id="cpuProcessRows"`, `id="ganttChartContainer"`. If `initSimulation()` is called multiple times (e.g., switching labs while on the Simulation tab), the OLD DOM is replaced, but any lingering event listeners from `setupSimControls()` still reference stale elements. More critically, `getElementById` calls in the running `animate()` loop (e.g. `statSent`, `statAck` at lines 2255-2270) may find the **old** or **new** element depending on timing. The `destroy()` bug (#2 above) makes this worse since the old sim's animation loop keeps running.

**[BUG-8] `initSubnetCalc` injects `id="calcIP"` and `id="calcMask"` — no ID conflict guard**
- **Type:** DOM ID collision on repeat navigation
- **Description:** Line 3215 injects `id="calcIP"`. If the user navigates away and back to the Subnet Calc lab, the old `#dynamic-sim-ui` is replaced with new innerHTML (clearing old IDs), so in this case it self-corrects. However, if two labs with overlapping injected IDs were somehow active simultaneously (e.g. during the 100ms `setTimeout` race in `initSimulation` at line 4809), `getElementById('calcIP')` would find the wrong element.

**[BUG-9] `vlab.html` has hardcoded static content in `#section-aim`, `#section-theory`, `#section-pretest`, `#section-procedure` that gets OVERWRITTEN by `loadLab()` but not removed on first load**
- **Type:** Flash of incorrect content / stale fallback content
- **Description:** Lines 95–220 of vlab.html contain hardcoded TCP content ("Transmission Control Protocol", TCP pretest questions) in the static sections. On page load, `loadLab(initialLab)` is called with a 200ms delay (line 2991), so the **wrong lab content** is briefly visible before being replaced. This is a UX issue and could confuse users.

---

### 🟡 MODERATE ISSUES

**[BUG-10] `vlab.html` `#labSelect` options are immediately overwritten by vlab.js — redundant HTML**
- **Type:** Redundant/dead HTML
- **Description:** `vlab.html` lines 30–44 define `<option>` elements for `#labSelect`, but vlab.js lines 5082–5125 unconditionally replaces `labSelectEl.innerHTML` with dynamically generated options. The static HTML options are wasted and could cause a flash of different content.

**[BUG-11] `vlab.html` missing `dashboard.html` validity check**
- **Type:** Broken relative link risk
- **Description:** Line 75: `<a href="dashboard.html">Dashboard</a>` — `dashboard.html` exists in the project root, so this is valid. However, `vlab.html` is opened from the root, so the link is correct as-is. ✅ Not broken, but noted.

**[BUG-12] `drawPerformanceGraphs()` called in `addElementToPDF` (line 147) but `window.currentSim` may be null**
- **Type:** Null pointer dereference risk
- **Description:** `if (window.currentSim) window.currentSim.drawPerformanceGraphs()` — guarded correctly. ✅ But `drawPerformanceGraphs` may not exist on all sim modes.

**[BUG-13] `vlab.js` line 5013: `document.getElementById('labSelect').addEventListener(...)` — no null guard**
- **Type:** Potential null dereference
- **Description:** This runs inside `DOMContentLoaded`, and `#labSelect` exists in the HTML, so it should always find the element. However, if `labSelectEl.innerHTML` replacement at line 5125 fails (e.g., JS error earlier), the element may have no children. Not null itself, but logically fragile.

**[BUG-14] `vlab.js` line 5058: `document.getElementById('themeToggle').addEventListener(...)` — no null guard**
- **Type:** Same as above — no defensive null check. Fails silently if element not found.

**[BUG-15] `vlab.js` line 5079: `document.getElementById('btnHome').addEventListener(...)` — no null guard**
- **Type:** Same pattern. Works as-is since HTML has `#btnHome`, but fragile.

**[BUG-16] Double `mouseenter` listener attached to each node element — Lines 1043–1056 AND 1133–1145**
- **Type:** Duplicate event listener / unexpected behavior
- **Description:** In `addNodeElement()`, **two separate `mouseenter` event listeners** are attached to each `div` (lines 1043 and 1133). Similarly, two `mousemove` listeners (lines 1058 and 1147) and two `mouseleave` listeners (lines 1066 and 1149). The second set uses a richer tooltip format. The first set will fire and show a simpler tooltip, then the second immediately overwrites it with the richer one. This is wasteful and can cause flicker; the first set (lines 1043–1068) should be removed.

**[BUG-17] `cableStartNode.el` used without checking if `.el` is set — Line 1097**
- (Already reported as BUG-3 above)

**[BUG-18] `validate.js` is imported in vlab.js line 5 as `evaluateLab` but never used**
- **Type:** Unused import
- **Description:** Line 5: `import { evaluateLab } from "./evaluate.js"` — `evaluateLab` is never called anywhere in vlab.js. Dead code.

---

### 🔵 MINOR ISSUES

**[BUG-19] `vlab.js` line 129: variable `doc` shadows outer scope `doc` (Firestore document reference)**
- **Type:** Variable shadowing — potentially confusing but not functionally broken
- **Description:** At the module top level, `doc` is imported from Firebase (line 4): `import { ..., doc, ... } from "...firebase-firestore.js"`. Inside `generatePDFReport` (line 129): `const doc = new jsPDF()`. This `const doc` **shadows the Firebase `doc` import** within that function. The Firebase `doc` function is used elsewhere (line 37, 49) but NOT inside `generatePDFReport`, so there's no runtime crash. However, it is a code smell and maintenance hazard.

**[BUG-20] `vlab.js` `NetworkingSim.logEvent()` at line 2090: event items do NOT have `.event-time`, `.event-proto`, or `.event-desc` child elements**
- **Type:** DOM structure mismatch with PDF report generator
- **Description:** `logEvent()` creates items as: `<div class="event-item"><span style="color:...;">[time]</span> msg</div>`. But `generatePDFReport()` at lines 273–278 queries `.event-time`, `.event-proto`, `.event-desc` child elements of each `event-item`. Since those classes don't exist, the PDF protocol log table will **always be empty** (falling into the "No specific protocol events logged" branch at line 291).

**[BUG-21] `vlab.js` uses CSS variable `var(--font-sans)` in Canvas `ctx.font` (e.g. line 2171)** 
- **Type:** Invalid Canvas API usage
- **Description:** Canvas `ctx.font` does not support CSS variables. Strings like `"800 24px var(--font-sans)"` will cause the font to fall back to the browser default. The text will still render but not with the Outfit font. Same issue at lines 2216, 2217, 2303, etc.

---

## FILE 2: `vlabData.js` (807 lines)

---

### 🟠 SERIOUS ISSUES

**[BUG-22] `vlabData.js` contains OS labs (`cpu_scheduling`, `process_sync`, `deadlock_avoidance`, `page_replacement`, `disk_scheduling`) that are NOT networking labs**
- **Type:** Cross-subject data contamination / misrouting risk
- **Description:** `window.VLAB_DATA` is a single object containing both networking labs AND OS labs. When vlab.js does `window.VLAB_DATA[id]` for networking labs, it will also find OS lab entries. If a user somehow selects an OS lab ID while in networking mode (or vice versa), `initSimulation()` will try to find a `simType` like `cpu_scheduling` but won't find an init function for it — it falls through to the generic `NetworkingSim` canvas which will render nothing meaningful.

**[BUG-23] `vlabData.js` `vlan` entry (line 470) has `simType: "vlan_sim"` but `initSimulation()` does NOT have a dedicated route for `vlan_sim`**
- **Type:** Missing init function dispatch
- **Description:** `vlan_sim` falls through to `NetworkingSim` which handles it via `this.drawVlanSim()` inside `animate()`. This works BUT `drawVlanSim()` must exist in the class. The method is referenced at line 2183 — it needs to be verified it's defined. (Given the file is 5180 lines I can confirm the method reference exists at line 2183; it should be defined somewhere in the class.)

**[BUG-24] `vlabData.js` `routing_protocols` entry has `simType: "path_sim"` — no dedicated init, falls through to generic canvas**
- **Type:** Same dispatch issue as BUG-23. `path_sim` is handled by `drawRoutingSim()` in `animate()` (line 2187). Not crashing but no dedicated advanced UI.

**[BUG-25] No `labId` key in any `VLAB_DATA` entry**
- **Type:** Missing metadata field
- **Description:** Each entry in `window.VLAB_DATA` uses its key as the lab ID (e.g., `csma`, `subnet`), but none of the data objects contain a `labId` property. The `syncProgress(labId, data)` calls work because `labId` is passed separately from the data. No structural bug, but inconsistent with what `evaluateLab` (from evaluate.js) might expect if it reads `labId` from data.

**[BUG-26] `vlabData.js` contains OS labs that have NO corresponding `<option>` in the static HTML `#labSelect`**
- **Type:** Dead data entries with no UI access
- **Description:** `cpu_scheduling`, `process_sync`, `deadlock_avoidance`, `page_replacement`, `disk_scheduling` exist in `VLAB_DATA` but are **not listed** in the static HTML `#labSelect`. They ARE dynamically injected when `currentSubject === 'os'`. So they're not truly dead — but the static HTML options (lines 30–44 of vlab.html) that users see briefly on first load don't include them.

### 🟡 MODERATE ISSUES

**[BUG-27] No `labId` matching `"deadlock_avoidance"` routes to `initBankersSim()` correctly**
- **Type:** Routing works but naming is inconsistent
- **Description:** In `initSimulation()`, the check is `data.simType === 'bankers'` (line 4720). In `vlabData.js`, `deadlock_avoidance` has `simType: "bankers"` (line 680). These match correctly. ✅ However, the simType `"bankers"` doesn't match the lab name `deadlock_avoidance`, making it harder to trace.

**[BUG-28] No duplicate `labId` keys** — ✅ All keys in `window.VLAB_DATA` are unique.

---

## FILE 3: `vlab.html` (347 lines)

---

### 🔴 CRITICAL

**[BUG-29] `engine.js` script tag is MISSING**
- **Type:** Missing script dependency
- **Description:** `engine.js` (26KB) exists in the project root but is **NOT loaded** by `vlab.html`. The only scripts loaded are (lines 339–344): jsPDF, html2canvas, jsPDF-autotable, `vlabData.js`, and `vlab.js` (as a module). If `engine.js` exports or provides any utilities used by `vlab.js`, those would fail. Since `vlab.js` uses ES module imports (`import { LABS } from "./labs/index.js"`), and doesn't import from `engine.js`, the engine.js file appears to be a legacy/orphan — but its absence should be confirmed. **Flag for review.**

### 🟠 SERIOUS

**[BUG-30] Static hardcoded content in sections shows wrong lab on first load**
- **Type:** Flash of incorrect content (TCP content shown for all labs initially)
- **Description:** `#section-aim` (line 95–101) shows "Transmission Control Protocol" hardcoded. `#section-theory` (lines 103–118) shows TCP theory. `#section-pretest` shows TCP MCQ questions. These are replaced by `loadLab()` after a 200ms delay, causing a visible flash of wrong content.

**[BUG-31] `vlab.html` loads `vlab.js` with `type="module"` (line 344) but the HTML has an inline `<script>` at line 311 that calls `initTheme()` before modules load**
- **Type:** Script loading order issue
- **Description:** The inline `<script>` (lines 311–336) runs synchronously during HTML parsing and calls `initTheme()` immediately. This is fine because `initTheme` uses only `localStorage` and `setAttribute`. But `downloadReport()` and `downloadCertificate()` at lines 328–335 call `window.generatePDFReport` and `window.generateCertificate` which are defined in `vlab.js` (module). Since modules are deferred by default, if a user clicks "Download Report" before the module finishes loading, these would be `undefined`. **Missing null guard on `window.generatePDFReport`.**

**[BUG-32] `#dynamic-sim-ui` container exists** ✅ (line 159) — Present and correct.

### 🟡 MODERATE

**[BUG-33] `textarea` at line 184 reuses class `sim-select` instead of a textarea-specific class**
- **Type:** CSS class misuse
- **Description:** `<textarea id="student-feedback" class="sim-select" ...>` uses the `.sim-select` class which is designed for `<select>` elements. The styling works visually but is semantically wrong and could break if `.sim-select` styling is ever updated for selects only.

**[BUG-34] `textarea` at line 237 (Feedback section) has no `id` and no form submit handler**
- **Type:** Non-functional UI element
- **Description:** The Feedback section textarea and button at lines 237–238 have no `id`, no form action, and no event listener attached in vlab.js. The "Submit Feedback" button does nothing.

**[BUG-35] `onclick` handlers in `#contextMenu` (lines 286–288) use `window.currentTopo.deleteNode()`, `window.currentTopo.deleteLinks()`, `window.currentTopo.openConfig()` — no null guard**
- **Type:** Potential null pointer
- **Description:** If `window.currentTopo` is null (e.g., user right-clicks context menu from Simulation tab), these throw `TypeError`.

---

## FILE 4: `vlab.css` (1477 lines)

---

### 🔴 CRITICAL

**[BUG-36] `var(--shadow-xl)` used but NOT defined anywhere in the CSS**
- **Type:** Undefined CSS variable
- **Description:** Line 1204: `box-shadow: var(--shadow-xl)` on `.device-props-panel`. The CSS root (lines 1–24) defines `--shadow-sm`, `--shadow-md`, `--shadow-lg` — but **NOT `--shadow-xl`**. This causes the device properties panel to render with no box-shadow (falls back to `initial`/none). Visual bug.

### 🟠 SERIOUS

**[BUG-37] `.status-dot` CSS class is defined THREE TIMES (lines 904, 949, 1095)**
- **Type:** Duplicate CSS rules / specificity conflict
- **Description:** `.status-dot` is defined at:
  - Line 904: `animation: dotPulse 2s infinite`
  - Line 949: `animation: pulse 2s infinite` (different keyframe name)
  - Line 1095: `animation: statusPulse 2s infinite` (yet another keyframe name)
  
  The last definition wins due to CSS cascade, so `.status-dot` uses `statusPulse`. The first two definitions are overridden and dead. `dotPulse` and `pulse` keyframes are defined but the `.status-dot` uses only `statusPulse`. Not a crash, but messy.

**[BUG-38] `.status-left` and `.status-right` defined TWICE (lines 903 and 943)**
- **Type:** Duplicate CSS rules
- **Description:** First at line 903: `display: flex; align-items: center; gap: 8px;`  
  Then at line 943: `display: flex; align-items: center; gap: 20px;` (different gap).  
  Last definition wins → gap is 20px. The `gap: 8px` definition is overridden/dead.

**[BUG-39] `.device-node` defined THREE TIMES (lines 491, 838, 1289)**
- **Type:** Multiple rule blocks for same selector
- **Description:** Properties are spread across three rule blocks. Later blocks override earlier ones for conflicting properties. `transition` is defined at 491 (one value), 838 (another), and 1289 (yet another). Only the last one at 1289 applies. `border-radius` set at 838 may or may not be present depending on cascade. Not a crash but creates maintenance confusion.

**[BUG-40] `.device-node:hover` defined TWICE (lines 843 and 1293)**
- **Type:** Duplicate hover rule
- **Description:** First at 843: `transform: scale(1.1); background: rgba(255,255,255,0.4); box-shadow: 0 8px 30px rgba(0,0,0,0.05);`  
  Second at 1293: `transform: scale(1.1); box-shadow: 0 0 20px var(--primary); z-index: 100;`  
  The second overrides the first for conflicting properties. `background` from line 843 still applies. Mixed hover states.

**[BUG-41] `.topo-tooltip` defined TWICE (lines 1033 and 1269)**
- **Type:** Duplicate rule blocks
- **Description:** Two separate style blocks for `.topo-tooltip`. Line 1033 uses `background: rgba(15, 23, 42, 0.9)` (dark); line 1269 uses `background: var(--glass)` (semi-transparent). The second overrides the first. Line 1033's `border: 1px solid rgba(255,255,255,0.2); color: white;` are NOT in the second block — whether they apply depends on cascade order. Inconsistent styling.

**[BUG-42] `.breadcrumb` defined TWICE (lines 69 and 643)**
- **Type:** Duplicate CSS rules
- **Description:** Line 69: `font-size: 15px; font-weight: 600; gap: 10px;`  
  Line 643: `font-size: 13px; color: var(--text-muted); margin-bottom: 8px; gap: 8px;`  
  The second overrides font-size to 13px and adds color/margin. The breadcrumb in the header (`vlab-header`) and content header will both be affected, though they may be intended to look different.

**[BUG-43] `.workspace-status` defined TWICE (lines 885 and 1090)**
- **Type:** Duplicate CSS rule
- **Description:** Line 885 has full positioning and layout properties. Line 1090 only sets `background: linear-gradient(...)` and `border-top`. The second block only partially overrides — both sets of properties apply, with the second winning for `background`. Not broken but redundant.

### 🟡 MODERATE

**[BUG-44] `.nav-item` defined TWICE (lines 129 and 1318)**
- **Type:** Duplicate rule
- **Description:** Line 1318 redefines `border-radius: 12px; margin: 4px 12px; transition: all 0.2s ease;`. Partially overrides line 129's definition.

**[BUG-45] `.nav-item:hover` defined TWICE (lines 142 and 1324)**
- **Type:** Duplicate hover rule — second overrides first.

**[BUG-46] `@keyframes fadeIn` defined TWICE (lines 420 and 1173)**
- **Type:** Duplicate keyframe
- **Description:** Same name, same effect (opacity 0 → 1). Second definition overwrites first. Harmless but redundant.

### ✅ CONFIRMED PRESENT (no issues)

- `.btn-sim` — ✅ Line 259
- `.sim-select` — ✅ Line 89
- `.theory-card` — ✅ Line 193
- `.sim-toolbar` — ✅ Line 248
- `.sim-workspace` — ✅ Line 274
- All are properly defined.

---

## SUMMARY TABLE

| # | File | Line(s) | Severity | Issue |
|---|------|---------|----------|-------|
| 1 | vlab.js | 4663-4690 | 🔴 Critical | `currentSubject` used outside its scope in disk scheduling |
| 2 | vlab.js | 1994, 2360 | 🔴 Critical | Duplicate `destroy()` in NetworkingSim — zombie animation leak |
| 3 | vlab.js | 1097 | 🔴 Critical | `node.el` null access risk during cabling |
| 4 | vlab.js | 6 | 🟠 Serious | `LABS` imported but never used — dead import + 18 sub-modules loaded for nothing |
| 5 | vlab.html | 344 | 🔴 Critical | `engine.js` missing from script tags |
| 6 | vlab.js | 4695-4820 | 🟠 Serious | No explicit validation of simType in dispatch; silent fallthrough |
| 7 | vlab.js | 4755-4800 | 🟠 Serious | Duplicate element IDs injected on every initSimulation() call |
| 8 | vlab.js | 3215 | 🟡 Moderate | ID collision risk on repeated subnet calc nav |
| 9 | vlab.html | 95-220 | 🟠 Serious | Hardcoded TCP content flashes before correct lab loads |
| 10 | vlab.html | 30-44 | 🟡 Moderate | Static labSelect options overwritten, cause flash |
| 11 | vlab.html | 328-335 | 🟠 Serious | `window.generatePDFReport` may be undefined when called early |
| 12 | vlab.js | 1043-1068 | 🟡 Moderate | Double mouseenter/move/leave listeners on every node element |
| 13 | vlab.js | 5 | 🔵 Minor | `evaluateLab` imported but never used |
| 14 | vlab.js | 2090 | 🟡 Moderate | Event log items lack `.event-time`/`.event-proto`/`.event-desc` — PDF log always empty |
| 15 | vlab.js | 2171 | 🔵 Minor | CSS variables used in Canvas ctx.font — ignored by browser |
| 16 | vlab.js | 129 | 🔵 Minor | `doc` variable shadows Firebase `doc` import |
| 17 | vlabData.js | 562-765 | 🟠 Serious | OS labs mixed into networking VLAB_DATA — cross-subject contamination |
| 18 | vlabData.js | 507 | 🟡 Moderate | `vlan_sim` simType relies on implicit NetworkingSim mode handling |
| 19 | vlab.html | 184 | 🟡 Moderate | `<textarea>` uses `.sim-select` class (select-specific class) |
| 20 | vlab.html | 237-238 | 🟡 Moderate | Feedback textarea and button are non-functional (no handler) |
| 21 | vlab.html | 286-288 | 🟡 Moderate | Context menu onclik handlers don't null-guard `window.currentTopo` |
| 22 | vlab.css | 1204 | 🔴 Critical | `var(--shadow-xl)` undefined — device-props-panel has no shadow |
| 23 | vlab.css | 904,949,1095 | 🟠 Serious | `.status-dot` defined 3× with different animations — only last applies |
| 24 | vlab.css | 903, 943 | 🟠 Serious | `.status-left/.status-right` defined 2× — conflicting gap values |
| 25 | vlab.css | 491,838,1289 | 🟠 Serious | `.device-node` defined 3× — mixed/conflicting properties |
| 26 | vlab.css | 843, 1293 | 🟠 Serious | `.device-node:hover` defined 2× — mixed hover state |
| 27 | vlab.css | 1033, 1269 | 🟠 Serious | `.topo-tooltip` defined 2× — inconsistent background styling |
| 28 | vlab.css | 69, 643 | 🟡 Moderate | `.breadcrumb` defined 2× — font-size and color conflicts |
| 29 | vlab.css | 885, 1090 | 🟡 Moderate | `.workspace-status` defined 2× — partial override |
| 30 | vlab.css | 129, 1318 | 🟡 Moderate | `.nav-item` defined 2× |
| 31 | vlab.css | 142, 1324 | 🟡 Moderate | `.nav-item:hover` defined 2× |
| 32 | vlab.css | 420, 1173 | 🔵 Minor | `@keyframes fadeIn` defined 2× — redundant |

**Total Issues Found: 32**
- 🔴 Critical: 5
- 🟠 Serious: 14
- 🟡 Moderate: 10
- 🔵 Minor: 3
