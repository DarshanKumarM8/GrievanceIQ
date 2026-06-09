import re

with open('src/pages/layout.ts', 'r', encoding='utf-8') as f:
    code = f.read()

translations = {
    'en': """
        dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time'""",
    'hi': """
        dashboard_map_title: 'भारत शिकायत इंटेलिजेंस मानचित्र',
        dashboard_map_subtitle: 'जियोजेसन + जिला ड्रिल-डाउन',
        dashboard_map_back: 'भारत पर वापस जाएँ',
        metric_total: 'कुल शिकायतें',
        metric_resolution: 'समाधान दर',
        metric_fake: 'फर्जी समापन दर',
        metric_avg_days: 'औसत समाधान दिन',
        dashboard_monthly: 'मासिक रुझान - 15 महीने का विश्लेषण',
        dashboard_analytics: 'एनालिटिक्स अवलोकन',
        dashboard_radar: 'विभाग तुलना रडार',
        dashboard_scorecard: 'विभाग जवाबदेही स्कोरकार्ड',
        sort_volume: 'मात्रा के अनुसार',
        sort_fake: 'फर्जी समापन दर के अनुसार',
        sort_sat: 'नागरिक संतुष्टि के अनुसार',
        sort_time: 'समाधान समय के अनुसार'"""
}

# Add empty strings for others or english fallback
for lang in ['ta', 'te', 'bn', 'mr']:
    translations[lang] = translations['en']

def replace_lang(lang_code, content):
    pattern = rf"(lang_name:\s*'[^\n]+')\n\s*\}}"
    def repl(m):
        return m.group(1) + ",\n" + translations[lang_code].strip() + "\n      }"
    
    # We need to find the block for the specific lang. 
    # Since it's like `en: { ... }` we can just replace `lang_name: 'Language'` 
    # Let's find the lang_name for each block.
    return content

# Simpler: just replace the specific lang_name line
lang_names = {
    'en': "lang_name: 'English'",
    'hi': "lang_name: 'हिन्दी'",
    'ta': "lang_name: 'தமிழ்'",
    'te': "lang_name: 'తెలుగు'",
    'bn': "lang_name: 'বাংলা'",
    'mr': "lang_name: 'मराठी'"
}

for lang_code, text in lang_names.items():
    code = code.replace(text, text + ",\n" + translations[lang_code].strip())

with open('src/pages/layout.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
