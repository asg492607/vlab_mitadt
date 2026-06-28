const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\full_audit_report.md', 'utf8');
const lines = content.split('\n');
console.log("Line 19 length:", lines[18].length);
// Let's split line 19 by its standard formatting markers or pipe symbols and print
const parts = lines[18].split('|');
console.log("Line 19 parts count:", parts.length);
fs.writeFileSync('C:\\Users\\Atharva\\.gemini\\antigravity\\brain\\de07a3b0-c2e3-4687-bc41-39d9784c7bca\\scratch\\formatted_line_19.txt', lines[18].replace(/\\n/g, '\n').replace(/\\t/g, '\t'), 'utf8');
console.log("Wrote formatted line 19 to scratch/formatted_line_19.txt");
