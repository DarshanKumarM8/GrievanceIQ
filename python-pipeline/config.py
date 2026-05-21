"""
GrievanceIQ Pipeline — Configuration
Centralized configuration loaded from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# --- Internal Authentication ---
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "")

# --- Supabase (Primary database for pipeline) ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "")           # e.g. https://xxxx.supabase.co
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")  # service_role key (server-side only)

# --- Cloudflare D1 REST API (Legacy — kept for local dev fallback) ---
CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", "")
CF_D1_DATABASE_ID = os.getenv("CF_D1_DATABASE_ID", "")
CF_D1_API_TOKEN = os.getenv("CF_D1_API_TOKEN", "")

# --- data.gov.in API ---
DATAGOV_API_KEY = os.getenv("DATAGOV_API_KEY", "")

# --- RSS Feed URLs ---
RSS_FEEDS = [
    {"name": "PIB", "url": "https://pib.gov.in/RssMain.aspx"},
    {"name": "PIB-DARPG", "url": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"},
    {"name": "The Hindu", "url": "https://www.thehindu.com/news/national/feeder/default.rss"},
    {"name": "Indian Express", "url": "https://indianexpress.com/feed/"},
    {"name": "NDTV", "url": "https://feeds.feedburner.com/ndtvnews-india-news"},
]

# --- DARPG PDF Sources ---
DARPG_CENTRAL_URL = "https://darpg.gov.in/node/6003/"
DARPG_STATE_URL = "https://darpg.gov.in/node/6004/"

# --- Tiered Grievance Keywords for RSS Matching ---
# TIER 1 (high relevance — always include)
TIER1_KEYWORDS = [
    'cpgrams', 'darpg', 'grievance redressal', 'complaint portal',
    'pgportal', 'rti', 'right to information'
]

# TIER 2 (scheme-specific — include if complaint-related context)
TIER2_KEYWORDS = [
    'pm-kisan', 'epfo', 'pension delay', 'ration card', 'ayushman bharat',
    'passport delay', 'railway refund', 'mnrega payment', 'scholarship delay',
    'aadhaar linking', 'e-shram', 'jan dhan', 'pm awas', 'pmjdy',
    'ayushman', 'mgnrega', 'pm awas', 'jal jeevan', 'ujjwala', 'dbt'
]

# TIER 3 (general — include only if combined with TIER 2 grievance words)
TIER3_KEYWORDS = [
    'complaint', 'pending', 'unresolved', 'ministry', 'department delay',
    'government failure', 'public grievance', 'citizen complaint'
]

# Legacy flat list (kept for backward compatibility with aggregator)
GRIEVANCE_KEYWORDS = TIER1_KEYWORDS + TIER2_KEYWORDS

# --- Ministry Name Mapping (for PDF parsing fuzzy match) ---
MINISTRY_NAMES = {
    "Department of Posts": "DOP",
    "Ministry of Railways": "MOR",
    "Department of Financial Services": "DFS",
    "Ministry of Labour and Employment": "MOLE",
    "Ministry of Health and Family Welfare": "MOHFW",
    "Ministry of Home Affairs": "MHA",
    "Department of Land Resources": "DOLR",
    "Ministry of Housing and Urban Affairs": "MOHUA",
    "Department of Pensions and Pensioners Welfare": "DPPW",
    "Ministry of Education": "MOE",
    "Ministry of Agriculture and Farmers Welfare": "MOAFW",
    "Ministry of Consumer Affairs, Food and Public Distribution": "MOCAFPD",
    "Ministry of Electronics and Information Technology": "MEITY",
    "Ministry of Road Transport and Highways": "MORTH",
    "Department of Revenue": "DOR",
    "Ministry of Power": "MOP",
    "Ministry of Women and Child Development": "MWCD",
    "Department of Telecommunications": "DOT",
    "Ministry of Rural Development": "MORD",
    "Ministry of Social Justice and Empowerment": "MOSJE",
    "Ministry of Environment, Forest and Climate Change": "MOEFCC",
    "Ministry of Commerce and Industry": "MOCI",
    "Ministry of Jal Shakti": "MOJS",
    "Ministry of Petroleum and Natural Gas": "MOPNG",
    "Ministry of External Affairs": "MEA",
    "Ministry of Defence": "MOD",
    "Ministry of Tribal Affairs": "MOTA",
    "Ministry of Minority Affairs": "MOMA",
    "Ministry of Skill Development and Entrepreneurship": "MSDE",
    "Department of Science and Technology": "DST",
}
