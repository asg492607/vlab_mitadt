const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\full_audit_report.md';
const destPath = 'C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\clean_report.md';

if (!fs.existsSync(srcPath)) {
    console.error('Source file does not exist');
    process.exit(1);
}

let content = fs.readFileSync(srcPath, 'utf8');
console.log('Original content length:', content.length);

// Replace escaped newlines if any
let cleaned = content;
if (content.includes('\\n')) {
    console.log('Found escaped newlines, unescaping...');
    // Replace JSON-escaped newlines and tabs
    cleaned = content.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
} else {
    console.log('No escaped newlines found. It seems to have standard newlines.');
}

fs.writeFileSync(destPath, cleaned, 'utf8');
console.log('Wrote clean report to:', destPath);
console.log('Cleaned content length:', cleaned.length);
