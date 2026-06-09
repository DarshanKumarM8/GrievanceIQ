import re

with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the broken HTML from previous regex
content = content.replace('gap- text-white">>', 'gap-2 text-white">')
content = content.replace('to-navy-70 text-white">>', 'to-navy-700 text-white">')
content = content.replace('to-ashoka-70 text-white">>', 'to-ashoka-700 text-white">')
content = content.replace('to-purple-70 text-white">>', 'to-purple-700 text-white">')
content = content.replace('to-saffron-60 text-white">>', 'to-saffron-600 text-white">')
content = content.replace('to-red-70 text-white">>', 'to-red-700 text-white">')
content = content.replace('to-indigo-70 text-white">>', 'to-indigo-700 text-white">')
content = content.replace('to-teal-70 text-white">>', 'to-teal-700 text-white">')
content = content.replace('to-pink-70 text-white">>', 'to-pink-700 text-white">')

# Let's use regex to find any other instances of ` text-white">>` just in case
content = re.sub(r'([a-z0-9-]+)\s*text-white">>', r'\1 text-white">', content)

# 2. Add dark:text-white to text-navy-* and text-gray-* that are meant to be readable
# We want to add dark:text-white to:
# text-navy-800, text-navy-700, text-gray-800, text-gray-900

def add_dark_text(match):
    full_match = match.group(0)
    # If it already has a dark:text- class, leave it alone
    if 'dark:text-' in full_match:
        return full_match
    
    # We find where to inject it. We can just append it at the end of the class string.
    # match.group(0) is like class="... text-navy-800 ..."
    # We can inject dark:text-white right before the closing quote.
    if full_match.endswith('"'):
        return full_match[:-1] + ' dark:text-white"'
    elif full_match.endswith("'"):
        return full_match[:-1] + " dark:text-white'"
    return full_match

pattern2 = re.compile(r'(?:class|className)=["\'][^"\']*\btext-(?:navy|gray|ashoka|saffron|purple|red)-(?:700|800|900)\b[^"\']*["\']')
content = pattern2.sub(add_dark_text, content)

with open("src/pages/dashboard.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard dark mode text fixes applied successfully.")
