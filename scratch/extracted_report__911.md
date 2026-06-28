The following is a <SYSTEM_MESSAGE> not actually sent by the user. It is provided by the system as important information to pay attention to.

<SYSTEM_MESSAGE>
[Message] timestamp=2026-06-01T14:33:15Z sender=22e1b5c5-f4b7-4460-877d-0a7b819e81e3 priority=MESSAGE_PRIORITY_HIGH content=# Comprehensive Audit Report

## FILE 1: `vlab.js` (5180 lines, 280KB)

---

### 🔴 CRITICAL BUGS

**[BUG-1] `currentSubject` used before declaration — Lines 4663–4690**
- **Type:** Undefined variable / scope error
- **Description:** `currentSubject` is used on lines 4663, 4664, and 4690 inside the disk scheduling `runDiskSim()` function (which is defined inside `DOMContentLoaded`). However, the variable `currentSubject` is declared at line 4912 (inside `initExperiment`) and line 5081 (module-level in `DOMContentLoaded`). The uses at 4663/4664/4690 are **inside a different local function scope** (`initDiskSchedulingSim` closure) where `currentSubject` is **not in lexical scope** at the point of execution — it depends on closure over the line-5081 declaration. Since `runDiskSim` is called via a click event handler after full page load, the line-5081 `const currentSubject` will already be defined in the enclosing `DOMContentLoaded` closure, so it *works at runtime*. However, it is a **fragile reference** — if `initDiskSchedulingSim` were ever called before line 5081 executes, it would throw `ReferenceError`. This is a latent bug with misleading scoping.

**[BUG-2] Duplicate `destroy()` method in `NetworkingSim` class — Lines 1994 & 2360**
- **Type:** Duplicate method definition (JavaScript class bug)
- **Description:** The `NetworkingSim` class has **two `destroy()` methods**: one at line 1994 and another at line 2360. In JavaScript, the second definition silently overwrites the first. The method at line 1994 sets `this.isDestroyed = true` and `this.timerActive = false`; the one at line 2360 does NOT. This means `isDestroyed` and `timerActive` are never set when destroy is called, causing the animation loop at line 2154 (`if
<truncated 22283 bytes>
event-time`/`.event-proto`/`.event-desc` — PDF log always empty |
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

</SYSTEM_MESSAGE>