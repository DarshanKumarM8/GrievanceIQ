import re

# 1. Fix the heading in dashboard.ts
with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the light container background to be dark in dark mode
old_bg = 'class="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center gap-2"'
new_bg = 'class="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2"'
if old_bg in content:
    content = content.replace(old_bg, new_bg)
    with open("src/pages/dashboard.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed district heading container background.")
else:
    print("Could not find the exact old_bg string in dashboard.ts")

# 2. Check api.ts for the district data route
with open("src/routes/api.ts", "r", encoding="utf-8") as f:
    api_content = f.read()

import sys
for i, line in enumerate(api_content.split('\n')):
    if '/districts' in line:
        print(f"L{i+1}: {line}")
        # print next 20 lines to see the logic
        for j in range(1, 20):
            print(f"L{i+1+j}: {api_content.split(chr(10))[i+j]}")
        break
