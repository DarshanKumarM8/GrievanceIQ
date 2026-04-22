"""
GrievanceIQ Pipeline — Configuration
Centralized configuration loaded from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# --- Internal Authentication ---
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "")

# --- Cloudflare D1 REST API ---
CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", "")
CF_D1_DATABASE_ID = os.getenv("CF_D1_DATABASE_ID", "")
CF_D1_API_TOKEN = os.getenv("CF_D1_API_TOKEN", "")

# --- data.gov.in API ---
DATAGOV_API_KEY = os.getenv("DATAGOV_API_KEY", "")

# --- RSS Feed URLs ---
RSS_FEEDS = [
    {"name": "PIB", "url": "https://pib.gov.in/RssMain.aspx"},
    {"name": "The Hindu", "url": "https://www.thehindu.com/news/national/feeder/default.rss"},
    {"name": "Indian Express", "url": "https://indianexpress.com/feed/"},
    {"name": "Hindustan Times", "url": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"},
    {"name": "NDTV", "url": "https://feeds.feedburner.com/ndtvnews-india-news"},
]

# --- DARPG PDF Sources ---
DARPG_CENTRAL_URL = "https://darpg.gov.in/node/6003/"
DARPG_STATE_URL = "https://darpg.gov.in/node/6004/"

# --- Grievance Keywords for RSS Matching ---
GRIEVANCE_KEYWORDS = [
    "CPGRAMS", "grievance", "complaint portal", "PM-KISAN", "EPFO",
    "pension delay", "ration card", "Ayushman Bharat", "passport delay",
    "railway refund", "smart meter", "DARPG", "e-Shram",
    "labour complaint", "RTI", "PMJAY", "PDS", "MGNREGA",
    "PM Awas", "Jal Jeevan", "Ujjwala", "DBT"
]

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
