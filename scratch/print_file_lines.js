const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\full_audit_report.md', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.length > 50) {
        console.log(`Line ${idx+1} length: ${line.length}. Starts with: "${line.substring(0, 80)}"`);
        fs.writeFileSync(`C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\formatted_line_${idx+1}.md`, line.replace(/\\n/g, '\n').replace(/\\t/g, '\t'), 'utf8');
    }
});
