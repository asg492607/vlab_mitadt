# MIT ADT Virtual Lab (VLAB)

Welcome to the **MIT ADT Virtual Lab**, a comprehensive, interactive, and AI-powered virtual laboratory designed for computer science and engineering students. 

This platform provides interactive simulations across multiple disciplines, replacing static textbooks with hands-on, highly visual, and interactive experiments.

## 🚀 Key Features

*   **Multi-Disciplinary Simulations:** Covers Networking, Operating Systems, Programming (C/C++, Java, Python, x86 Assembly), DBMS, Theory of Computation, Artificial Intelligence, Cloud Computing, and Cybersecurity.
*   **Interactive Simulation Engine:** A custom-built 2D/3D capable rendering engine (`vlab.js`) that allows drag-and-drop networking, real-time CPU scheduling visualization, SQL query execution, and step-by-step Assembly code execution.
*   **Global AI Tutor:** A persistent, context-aware AI assistant (Gemini/OpenAI powered) integrated directly into the workspace to help students debug issues or understand theories based on their current lab.
*   **Voice Commands:** Hands-free control for executing commands and managing the UI.
*   **Firebase Integration:** Real-time progress synchronization, global leaderboards, and cloud saving for custom network topologies.
*   **PWA Ready:** Works offline or on slow networks via aggressive Service Worker caching.

---

## 🏗️ Project Architecture

The application follows a monolithic frontend architecture, heavily utilizing vanilla JavaScript for maximum performance and direct DOM manipulation for complex visual simulations.

### Core Files

*   `index.html`: The landing page and authentication portal.
*   `dashboard.html`: The central hub where students select subjects, view global leaderboards, and track their module completion progress.
*   `vlab.html`: The main laboratory shell. It provides the UI framework (Sidebar, Aim, Theory, Simulation, Experiment, AI Chat, Settings).
*   `vlab.js` (The Engine): The heart of the application. This file (13k+ lines) handles:
    *   Routing and rendering the lab UI based on the selected `labId`.
    *   The `initSimulation()` dispatcher, which dynamically builds custom simulation views (e.g., `initAssemblySim`, `initNetworkSim`, `initDFASim`).
    *   Firebase synchronization (`fetchProgress`, `syncProgress`).
    *   AI Tutor context extraction.
*   `vlabData.js` (The Database): Contains the static content for all labs, including Aim, Theory, Procedure, Quizzes, and configuration flags indicating which simulation module to load.
*   `sw.js`: The Service Worker handling caching for offline Progressive Web App (PWA) support.

---

## 🛠️ Local Development & Setup

This application is purely client-side HTML/CSS/JS with Firebase as the backend.

### Prerequisites
*   A local web server (e.g., `Live Server` in VSCode, `python -m http.server`, or `npx serve`).
*   A Firebase project with Authentication and Firestore Database enabled.

### Running Locally
1.  Clone the repository.
2.  Serve the root directory using your local web server.
    *(Note: Opening the HTML files directly via `file://` protocols will cause CORS errors and ES6 module import failures. You must use a local server).*
3.  Navigate to `http://localhost:<port>/index.html`.

### Firebase Configuration
To ensure progress tracking and leaderboards work, you must configure your Firestore Rules.

**Required Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own progress and topology data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // IMPORTANT: Allow read access to the 'users' collection to enable the global Dashboard Leaderboard
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## 📝 How to Add a New Lab

Adding a new lab involves modifying both the data source (`vlabData.js`) and the rendering engine (`vlab.js`).

### 1. Define the Content in `vlabData.js`
Append a new entry to the global `window.VLAB_DATA` object. The key must be a unique identifier (e.g., `my_new_lab`).

```javascript
window.VLAB_DATA.my_new_lab = {
    title: "My Custom Lab",
    simType: "custom_sim_identifier", // Leave blank if it's just theory/quiz
    aim: "To demonstrate X.",
    theory: {
        intro: "Basic theory...",
        cards: [{ title: "Concept 1", content: "Details..." }]
    },
    procedure: ["Step 1", "Step 2"],
    pretest: [
        { q: "What is X?", options: ["A", "B", "C", "D"], correct: 0 }
    ],
    posttest: [
        { q: "Did X work?", options: ["Yes", "No"], correct: 0 }
    ]
};
```

### 2. Register the Lab in `vlab.js`
You must add your lab's ID to the appropriate subject array so it appears in the dropdowns and avoids redirect loops.
Locate the arrays inside `document.addEventListener('DOMContentLoaded', ...)` around line `13057` and `13229`:

```javascript
const netLabs = ['cables_devices', ..., 'my_new_lab']; // Add it here!
```

### 3. Build the Simulation Engine (Optional)
If your lab requires a custom interactive simulation (indicated by `simType: "custom_sim_identifier"`), you must intercept it in `vlab.js`.

Locate the `initSimulation` function:
```javascript
const initSimulation = (id) => {
    const data = window.VLAB_DATA[id];
    const container = document.getElementById('dynamic-sim-ui');

    if (data.simType === 'custom_sim_identifier') {
        container.innerHTML = `<div id="my-sim">Building Simulation...</div>`;
        // Add your custom logic, event listeners, and canvas rendering here.
        return;
    }
    // ... existing sims ...
};
```

---

## 🧠 Managing the AI Tutor Context

The Global AI Tutor uses the context of the user's current view to provide relevant help. If you add a completely new view or complex simulation state (like a custom code editor), you should update `getAIContext()` in `vlab.js` to ensure the AI can "see" what the student is doing.

Locate `getAIContext()` and inject your specific state:
```javascript
// Inside getAIContext()
if (activeTab === 'simulation' && labId === 'my_new_lab') {
    const myState = getMyCustomState();
    context += `The student's current configuration is: ${myState}.`;
}
```

---

## 🔧 Troubleshooting

*   **UI is locked / Splash screen won't hide:** This typically means Firebase is unreachable on your network. The app has a 3-second timeout (`Promise.race`) in `vlab.js` to forcefully unlock the UI if Firebase hangs.
*   **Changes to `vlab.js` aren't showing up:** The application uses a Progressive Web App (PWA) Service Worker (`sw.js`). We bypass caching via `vlab.js?v=5` in `vlab.html`. If issues persist, instruct users to perform a "Hard Refresh" (Ctrl+F5) or clear their site data.
*   **Leaderboard fails to load:** Check your Firebase Firestore security rules as outlined above.

---
*Maintained by the MIT ADT Development Team.*
