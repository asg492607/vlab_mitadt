const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    const logs = [];

    page.on('console', msg => {
        logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', error => {
        errors.push(`[Page Error] ${error.message}`);
    });

    page.on('requestfailed', request => {
        errors.push(`[Request Failed] ${request.url()} - ${request.failure().errorText}`);
    });

    // We need to serve the files using a local server because fetch/import might fail with file:// protocol
    // But playwright can intercept and serve from disk
    await page.route('**/*', (route) => {
        const requestUrl = route.request().url();
        if (requestUrl.startsWith('http://localhost:8080/')) {
            const filePath = path.join(__dirname, requestUrl.replace('http://localhost:8080/', ''));
            route.fulfill({ path: filePath }).catch(() => route.continue());
        } else {
            route.continue();
        }
    });

    try {
        await page.goto('http://localhost:8080/dashboard.html', { waitUntil: 'networkidle', timeout: 5000 });
    } catch (e) {
        errors.push(`[Goto dashboard] ${e.message}`);
    }

    try {
        await page.goto('http://localhost:8080/vlab.html?subject=networking&lab=csma', { waitUntil: 'networkidle', timeout: 5000 });
    } catch (e) {
        errors.push(`[Goto vlab.html (csma)] ${e.message}`);
    }

    try {
        await page.goto('http://localhost:8080/vlab.html?subject=programming&lab=asm_prog', { waitUntil: 'networkidle', timeout: 5000 });
    } catch (e) {
        errors.push(`[Goto vlab.html (asm_prog)] ${e.message}`);
    }

    console.log("=== BROWSER LOGS ===");
    console.log(logs.join('\n'));
    console.log("\n=== BROWSER ERRORS ===");
    console.log(errors.join('\n'));

    await browser.close();
})();
