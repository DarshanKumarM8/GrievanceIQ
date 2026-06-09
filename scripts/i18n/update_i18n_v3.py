import re

# UPDATE LAYOUT.TS
with open('src/pages/layout.ts', 'r', encoding='utf-8') as f:
    code = f.read()

en_keys = {
    'table_hash': '#',
    'table_district': 'District',
    'table_complaints': 'Complaints',
    'table_resolution': 'Resolution',
    'table_fake_closure': 'Fake Closure',
    'table_satisfaction': 'Satisfaction',
    'table_avg_days': 'Avg Days',
    'table_trend': 'Trend',
    'table_ministry': 'Ministry',
    'table_received': 'Received',
    'table_official_rate': 'Official Rate',
    'table_citizen_rate': 'Citizen Rate',
    'table_flag': 'Flag',
    'chart_national_trend': 'National Complaints — Monthly Trend',
    'chart_sat_vs_fake': 'Satisfaction vs Fake Closure Trend',
    'chart_top10': 'Top 10 Ministries — Complaint Volume',
    'chart_dist': 'Resolution Status Distribution',
    'chart_offenders': 'Fake Closure Rate — Top Offenders',
    'chart_avg_res': 'Average Resolution Days',
    'funnel_title': 'Resolution Funnel — National Pipeline',
    'funnel_sub': 'Complaint Journey: Filing to Resolution',
    'heatmap_title': 'Complaint Activity Heatmap — 12 Months',
    'heatmap_sub': 'Daily Complaint Volume Heatmap',
    'heatmap_less': 'Less',
    'heatmap_more': 'More',
    'network_title': 'Department Interaction Network',
    'network_sub': 'Inter-Ministry Complaint Transfer Network — Top 15',
    'radar_sys_title': 'Systemic Issue Radar',
    'social_feed_title': 'Social Monitoring Feed'
}

hi_keys = {k: f"[HI] {v}" for k, v in en_keys.items()}

en_str = ",\n" + ",\n".join([f"        {k}: '{v}'" for k, v in en_keys.items()])
hi_str = ",\n" + ",\n".join([f"        {k}: '{v}'" for k, v in hi_keys.items()])

code = code.replace("lang_name: 'English'", "lang_name: 'English'" + en_str, 1)
code = code.replace("lang_name: 'हिन्दी'", "lang_name: 'हिन्दी'" + hi_str, 1)

for lang in ['ta', 'te', 'bn', 'mr']:
    search_str = {
        'ta': "lang_name: 'தமிழ்'",
        'te': "lang_name: 'తెలుగు'",
        'bn': "lang_name: 'বাংলা'",
        'mr': "lang_name: 'मराठी'"
    }[lang]
    code = code.replace(search_str, search_str + en_str, 1)

with open('src/pages/layout.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated layout.ts")

# UPDATE DASHBOARD.TS
with open('src/pages/dashboard.ts', 'r', encoding='utf-8') as f:
    dcode = f.read()

replacements = {
    '<th>#</th>': '<th data-i18n="table_hash">#</th>',
    '<th class="text-left">District</th>': '<th class="text-left" data-i18n="table_district">District</th>',
    '<th>Complaints</th>': '<th data-i18n="table_complaints">Complaints</th>',
    '<th>Resolution</th>': '<th data-i18n="table_resolution">Resolution</th>',
    '<th>Fake Closure</th>': '<th data-i18n="table_fake_closure">Fake Closure</th>',
    '<th>Satisfaction</th>': '<th data-i18n="table_satisfaction">Satisfaction</th>',
    '<th>Avg Days</th>': '<th data-i18n="table_avg_days">Avg Days</th>',
    '<th>Trend</th>': '<th data-i18n="table_trend">Trend</th>',
    '<th class="text-left">Ministry</th>': '<th class="text-left" data-i18n="table_ministry">Ministry</th>',
    '<th>Received</th>': '<th data-i18n="table_received">Received</th>',
    '<th>Official Rate</th>': '<th data-i18n="table_official_rate">Official Rate</th>',
    '<th>Citizen Rate</th>': '<th data-i18n="table_citizen_rate">Citizen Rate</th>',
    '<th>Flag</th>': '<th data-i18n="table_flag">Flag</th>',
    'National Complaints &mdash; Monthly Trend': '<span data-i18n="chart_national_trend">National Complaints &mdash; Monthly Trend</span>',
    'Satisfaction vs Fake Closure Trend': '<span data-i18n="chart_sat_vs_fake">Satisfaction vs Fake Closure Trend</span>',
    'Top 10 Ministries &mdash; Complaint Volume': '<span data-i18n="chart_top10">Top 10 Ministries &mdash; Complaint Volume</span>',
    'Resolution Status Distribution': '<span data-i18n="chart_dist">Resolution Status Distribution</span>',
    'Fake Closure Rate &mdash; Top Offenders': '<span data-i18n="chart_offenders">Fake Closure Rate &mdash; Top Offenders</span>',
    'Average Resolution Days': '<span data-i18n="chart_avg_res">Average Resolution Days</span>',
    'Resolution Funnel &mdash; National Pipeline': '<span data-i18n="funnel_title">Resolution Funnel &mdash; National Pipeline</span>',
    'Complaint Journey: Filing to Resolution': '<span data-i18n="funnel_sub">Complaint Journey: Filing to Resolution</span>',
    'Complaint Activity Heatmap &mdash; 12 Months': '<span data-i18n="heatmap_title">Complaint Activity Heatmap &mdash; 12 Months</span>',
    'Daily Complaint Volume Heatmap': '<span data-i18n="heatmap_sub">Daily Complaint Volume Heatmap</span>',
    '>Less<': ' data-i18n="heatmap_less">Less<',
    '>More<': ' data-i18n="heatmap_more">More<',
    'Department Interaction Network': '<span data-i18n="network_title">Department Interaction Network</span>',
    'Inter-Ministry Complaint Transfer Network &mdash; Top 15': '<span data-i18n="network_sub">Inter-Ministry Complaint Transfer Network &mdash; Top 15</span>',
    'Systemic Issue Radar': '<span data-i18n="radar_sys_title">Systemic Issue Radar</span>',
    'Social Monitoring Feed': '<span data-i18n="social_feed_title">Social Monitoring Feed</span>'
}

for k, v in replacements.items():
    dcode = dcode.replace(k, v)

with open('src/pages/dashboard.ts', 'w', encoding='utf-8') as f:
    f.write(dcode)

print("Updated dashboard.ts")
