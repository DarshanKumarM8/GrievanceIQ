import re

with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add text-white to all dark headers
def add_text_white(match):
    full_match = match.group(0)
    if 'text-white' not in full_match and 'text-gray-50' not in full_match:
        # Insert text-white just before the closing quote
        return full_match[:-2] + ' text-white">'
    return full_match

# Matches any class string that contains a dark gradient
pattern = re.compile(r'class="[^"]*from-(?:navy|indigo|purple|slate|ashoka|saffron|red|emerald|teal|rose|pink)-(?:500|600|700|800|900)[^"]*"')
content = pattern.sub(add_text_white, content)

# 2. Fix India Map Tooltip Contrast
old_tooltip = """const tooltipContent = state 
              ? '<strong>' + feature.properties.name + '</strong><br>' + Number(state.total_complaints).toLocaleString() + ' complaints<br>Resolution: ' + state.resolution_rate + '%<br>Fake Closure: ' + state.fake_closure_rate + '%'
              : '<strong>' + feature.properties.name + '</strong><br>No data';"""

new_tooltip = """const tooltipContainer = '<div class="bg-white text-gray-900 shadow-lg border border-gray-200 rounded-md p-3 dark:bg-gray-800 dark:text-white dark:border-gray-700">';
            const tooltipContent = state 
              ? tooltipContainer + '<strong>' + feature.properties.name + '</strong><br><span class="font-bold text-blue-600 dark:text-blue-400">' + Number(state.total_complaints).toLocaleString() + '</span> complaints<br>Resolution: <span class="font-bold text-blue-600 dark:text-blue-400">' + state.resolution_rate + '%</span><br>Fake Closure: <span class="font-bold text-blue-600 dark:text-blue-400">' + state.fake_closure_rate + '%</span></div>'
              : tooltipContainer + '<strong>' + feature.properties.name + '</strong><br><span class="font-bold text-blue-600 dark:text-blue-400">No data</span></div>';"""

if old_tooltip in content:
    content = content.replace(old_tooltip, new_tooltip)
else:
    print("WARNING: Could not find old tooltip to replace.")

with open("src/pages/dashboard.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard contrast fixes applied successfully.")
