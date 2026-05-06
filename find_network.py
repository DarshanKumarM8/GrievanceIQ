import re

# Dashboard Frontend
with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Extract the full loadNetwork function
match = re.search(r'async function loadNetworkGraph\(\).*?(?=\s*// ============================================|\Z)', content, re.DOTALL)
if match:
    print("--- FRONTEND loadNetworkGraph ---")
    print(match.group(0)[:1500]) # just checking the start
else:
    print("loadNetworkGraph not found with async keyword. Let's try without:")
    match2 = re.search(r'function loadNetworkGraph\(\).*?(?=\s*(?://|function |\Z))', content, re.DOTALL)
    if match2:
        print("--- FRONTEND loadNetworkGraph ---")
        print(match2.group(0))

# API Backend
with open("src/routes/api.ts", "r", encoding="utf-8") as f:
    api_content = f.read()

api_match = re.search(r'apiRoutes\.get\([\'"`]/analytics/network[\'"`].*?}\)', api_content, re.DOTALL)
if api_match:
    print("\n--- BACKEND API ---")
    print(api_match.group(0))
else:
    print("\n--- BACKEND API NOT FOUND ---")
