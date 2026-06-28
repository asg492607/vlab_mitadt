Created At: 2026-06-08T13:31:04Z
Completed At: 2026-06-08T13:31:04Z
File Path: `file:///C:/Users/Atharva/.gemini/antigravity/brain/de07a3b0-c2e3-4687-bc41-39d9784c7bca/scratch/full_audit_report.md`
Total Lines: 46
Total Bytes: 4121
Showing lines 1 to 46
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: The following is a <SYSTEM_MESSAGE> not actually sent by the user. It is provided by the system as important information to pay attention to.
2: 
3: <SYSTEM_MESSAGE>
4: [Message] timestamp=2026-06-01T14:33:15Z sender=22e1b5c5-f4b7-4460-877d-0a7b819e81e3 priority=MESSAGE_PRIORITY_HIGH content=# Comprehensive Audit Report
5: 
6: ## FILE 1: `vlab.js` (5180 lines, 280KB)
7: 
8: ---
9: 
10: ### 🔴 CRITICAL BUGS
11: 
12: **[BUG-1] `currentSubject` used before declaration — Lines 4663–4690**
13: - **Type:** Undefined variable / scope error
14: - **Description:** `currentSubject` is used on lines 4663, 4664, and 4690 inside the disk scheduling `runDiskSim()` function (which is defined inside `DOMContentLoaded`). However, the variable `currentSubject` is declared at line 4912 (inside `initExperiment`) and line 5081 (module-level in `DOMContentLoaded`). The uses at 4663/4664/4690 are **inside a different local function scope** (`initDiskSchedulingSim` closure) where `currentSubject` is **not in lexical scope** at the point of execution — it depends on closure over the line-5081 declaration. Since `runDiskSim` is called via a click event handler after full page load, the line-5081 `const currentSubject` will already be defined in the enclosing `DOMContentLoaded` closure, so it *works at runtime*. However, it is a **fragile reference** — if `initDiskSchedulingSim` were ever called before line 5081 executes, it would throw `ReferenceError`. This is a latent bug with misleading scoping.
15: 
16: **[BUG-2] Duplicate `destroy()` 
<truncated 779 bytes>
.js | 129 | 🔵 Minor | `doc` variable shadows Firebase `doc` import |
23: | 17 | vlabData.js | 562-765 | 🟠 Serious | OS labs mixed into networking VLAB_DATA — cross-subject contamination |
24: | 18 | vlabData.js | 507 | 🟡 Moderate | `vlan_sim` simType relies on implicit NetworkingSim mode handling |
25: | 19 | vlab.html | 184 | 🟡 Moderate | `<textarea>` uses `.sim-select` class (select-specific class) |
26: | 20 | vlab.html | 237-238 | 🟡 Moderate | Feedback textarea and button are non-functional (no handler) |
27: | 21 | vlab.html | 286-288 | 🟡 Moderate | Context menu onclik handlers don't null-guard `window.currentTopo` |
28: | 22 | vlab.css | 1204 | 🔴 Critical | `var(--shadow-xl)` undefined — device-props-panel has no shadow |
29: | 23 | vlab.css | 904,949,1095 | 🟠 Serious | `.status-dot` defined 3× with different animations — only last applies |
30: | 24 | vlab.css | 903, 943 | 🟠 Serious | `.status-left/.status-right` defined 2× — conflicting gap values |
31: | 25 | vlab.css | 491,838,1289 | 🟠 Serious | `.device-node` defined 3× — mixed/conflicting properties |
32: | 26 | vlab.css | 843, 1293 | 🟠 Serious | `.device-node:hover` defined 2× — mixed hover state |
33: | 27 | vlab.css | 1033, 1269 | 🟠 Serious | `.topo-tooltip` defined 2× — inconsistent background styling |
34: | 28 | vlab.css | 69, 643 | 🟡 Moderate | `.breadcrumb` defined 2× — font-size and color conflicts |
35: | 29 | vlab.css | 885, 1090 | 🟡 Moderate | `.workspace-status` defined 2× — partial override |
36: | 30 | vlab.css | 129, 1318 | 🟡 Moderate | `.nav-item` defined 2× |
37: | 31 | vlab.css | 142, 1324 | 🟡 Moderate | `.nav-item:hover` defined 2× |
38: | 32 | vlab.css | 420, 1173 | 🔵 Minor | `@keyframes fadeIn` defined 2× — redundant |
39: 
40: **Total Issues Found: 32**
41: - 🔴 Critical: 5
42: - 🟠 Serious: 14
43: - 🟡 Moderate: 10
44: - 🔵 Minor: 3
45: 
46: </SYSTEM_MESSAGE>
The above content shows the entire, complete file contents of the requested file.
