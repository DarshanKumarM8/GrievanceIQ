import re

with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Comprehensive text color dark mode injection
def add_dark_text(match):
    full_match = match.group(0)
    if 'dark:text-' in full_match:
        return full_match
    
    # Extract the color and weight to determine the dark mode variant
    color_match = re.search(r'\btext-([a-z]+)-([0-9]+)\b', full_match)
    if not color_match:
        return full_match
        
    color = color_match.group(1)
    weight = int(color_match.group(2))
    
    dark_class = ""
    if color in ['navy', 'indigo', 'slate', 'gray']:
        if weight >= 700:
            dark_class = "dark:text-white"
        elif weight >= 500:
            dark_class = "dark:text-gray-300"
    else:
        # Colorful text like saffron-600, ashoka-600, red-600, purple-600
        if weight >= 600:
            dark_class = f"dark:text-{color}-400"
            
    if not dark_class:
        return full_match
        
    if full_match.endswith('"'):
        return full_match[:-1] + f' {dark_class}"'
    elif full_match.endswith("'"):
        return full_match[:-1] + f" {dark_class}'"
    return full_match

# Find all class attributes containing text colors
pattern = re.compile(r'(?:class|className)=["\'][^"\']*\btext-(?:[a-z]+)-(?:[0-9]+)\b[^"\']*["\']')
content = pattern.sub(add_dark_text, content)

# Let's also ensure the main stat cards themselves have a proper dark background if they don't already
# bg-white -> bg-white dark:bg-dark-800 or dark:bg-gray-800
def add_dark_bg(match):
    full_match = match.group(0)
    if 'dark:bg-' not in full_match and 'bg-white' in full_match:
        return full_match[:-1] + ' dark:bg-gray-800 dark:border-gray-700"'
    return full_match

pattern_bg = re.compile(r'class="[^"]*\bbg-white\b[^"]*"')
content = pattern_bg.sub(add_dark_bg, content)

with open("src/pages/dashboard.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Comprehensive dark mode text and background fixes applied successfully.")
