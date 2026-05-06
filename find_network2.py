import re

with open("src/routes/api.ts", "r", encoding="utf-8") as f:
    api_content = f.read()

api_match = re.search(r'apiRoutes\.get\([\'"`]/analytics/network[\'"`].*?}\)', api_content, re.DOTALL)
if api_match:
    print(api_match.group(0))
