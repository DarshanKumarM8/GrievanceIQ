import re
with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'function loadNetworkGraph\(\).*?(?=\s*(?://|function |\Z))', content, re.DOTALL)
if match:
    print(match.group(0))
