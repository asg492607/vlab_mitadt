Created At: 2026-06-02T09:34:43Z
Completed At: 2026-06-02T09:34:44Z
File Path: `file:///C:/Users/Atharva/.gemini/antigravity/scratch/audit_report.txt`
Total Lines: 21
Total Bytes: 2074
Showing lines 1 to 21
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "# Comprehensive Audit Report
2: 
3: ## FILE 1: `vlab.js` (5180 lines, 280KB)
4: 
5: ---
6: 
7: ### 🔴 CRITICAL BUGS
8: 
9: **[BUG-1] `currentSubject` used before declaration — Lines 4663–4690**
10: - **Type:** Undefined variable / scope error
11: - **Description:** `currentSubject` is used on lines 4663, 4664, and 4690 inside the disk scheduling `runDiskSim()` function (which is defined inside `DOMContentLoaded`). However, the variable `currentSubject` is declared at line 4912 (inside `initExperiment`) and line 5081 (module-level in `DOMContentLoaded`). The uses at 4663/4664/4690 are **inside a different local function scope** (`initDiskSchedulingSim` closure) where `currentSubject` is **not in lexical scope** at the point of execution — it depends on closure over the line-5081 declaration. Since `runDiskSim` is called via a click event handler after full page load, the line-5081 `const currentSubject` will already be defined in the enclosing `DOMContentLoaded` closure, so it *works at runtime*. However, it is a **fragile reference** — if `initDiskSchedulingSim` were ever called before line 5081 executes, it would throw `ReferenceError`. This is a latent bug with misleading scoping.
12: 
13: **[BUG-2] Duplicate `destroy()` method in `NetworkingSim` class — Lines 1994 & 2360**
14: - **Type:** Duplicate method definition (JavaScript class bug)
15: - **Description:** The `NetworkingSim` class has **two `destroy()` methods**: one at line 1994 and another at line 2360. In JavaScript, the second definition silently overwrites the first. The method at line 1994 sets `this.isDestroyed = true` and `this.timerActive = false`; the one at line 2360 does NOT. This means `isDestroyed` and `timerActive` are never set when destroy is called, causing the animation loop at line 2154 (`if (this.isDestroyed) return`) to **never stop**. This is a **zombie animation frame leak** on every lab switch.
16: 
17: **[BUG-3] `node.el` referenced before assignment in cabling mode — Line 1097**
18: - **Type:** Null reference / runtime error
19: - **Description:** At line 10
20: <truncated 24406 bytes>
21: 
The above content shows the entire, complete file contents of the requested file.
