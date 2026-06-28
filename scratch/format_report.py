import os
import re

src_path = r'C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\scratch\full_audit_report.md'
dest_path = r'C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\scratch\clean_report.md'

if not os.path.exists(src_path):
    print("Source file does not exist")
    exit(1)

with open(src_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("Original content length:", len(content))

cleaned = content
if '\\n' in content:
    print("Found escaped newlines, unescaping...")
    # Replacing escaped chars
    cleaned = content.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"')
else:
    print("No escaped newlines found in the file.")

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(cleaned)

print("Wrote clean report to:", dest_path)
print("Cleaned content length:", len(cleaned))
