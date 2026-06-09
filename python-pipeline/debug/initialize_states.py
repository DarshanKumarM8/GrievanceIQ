import asyncio
import json
import random
from services.d1_client import d1

STATES = [
    ('AN', 'Andaman and Nicobar Islands'), ('AP', 'Andhra Pradesh'), ('AR', 'Arunachal Pradesh'),
    ('AS', 'Assam'), ('BR', 'Bihar'), ('CH', 'Chandigarh'), ('CG', 'Chhattisgarh'),
    ('DN', 'Dadra and Nagar Haveli'), ('DL', 'Delhi'), ('GA', 'Goa'), ('GJ', 'Gujarat'),
    ('HR', 'Haryana'), ('HP', 'Himachal Pradesh'), ('JK', 'Jammu and Kashmir'), ('JH', 'Jharkhand'),
    ('KA', 'Karnataka'), ('KL', 'Kerala'), ('LA', 'Ladakh'), ('LD', 'Lakshadweep'),
    ('MP', 'Madhya Pradesh'), ('MH', 'Maharashtra'), ('MN', 'Manipur'), ('ML', 'Meghalaya'),
    ('MZ', 'Mizoram'), ('NL', 'Nagaland'), ('OD', 'Odisha'), ('PY', 'Puducherry'),
    ('PB', 'Punjab'), ('RJ', 'Rajasthan'), ('SK', 'Sikkim'), ('TN', 'Tamil Nadu'),
    ('TG', 'Telangana'), ('TR', 'Tripura'), ('UP', 'Uttar Pradesh'), ('UK', 'Uttarakhand'),
    ('WB', 'West Bengal')
]

DEPARTMENTS = [
    "Department of Posts", "Ministry of Railways", "Department of Financial Services",
    "Ministry of Labour and Employment", "Ministry of Health and Family Welfare"
]

ISSUES = [
    "Delayed Pension Payment", "Ration Card Renewal", "PM-KISAN Status",
    "Smart Meter Overbilling", "Passport Verification Delay", "Road Repair Required"
]

async def initialize():
    print("Initializing state stats for March 2026...")
    month, year = 3, 2026
    for code, name in STATES:
        # Generate realistic baseline
        total = random.randint(5000, 50000) if code in ['UP', 'MH', 'BR', 'WB'] else random.randint(500, 10000)
        resolved = int(total * random.uniform(0.65, 0.92))
        fake = int(resolved * random.uniform(0.05, 0.25))
        res_rate = round((resolved / total) * 100, 1)
        fake_rate = round((fake / resolved) * 100, 1)
        
        top_issues = random.sample(ISSUES, 3)
        top_depts = random.sample(DEPARTMENTS, 3)
        
        await d1.execute(
            """INSERT INTO state_grievance_stats 
               (state_code, state_name, total_complaints, complaints_resolved, complaints_fake_closed, 
                resolution_rate, fake_closure_rate, avg_resolution_days, top_issues, top_departments, 
                month, year, data_source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(state_code, month, year) DO UPDATE SET
               total_complaints = excluded.total_complaints,
               complaints_resolved = excluded.complaints_resolved,
               complaints_fake_closed = excluded.complaints_fake_closed,
               resolution_rate = excluded.resolution_rate,
               fake_closure_rate = excluded.fake_closure_rate""",
            [
                code, name, total, resolved, fake, 
                res_rate, fake_rate, random.randint(15, 45),
                json.dumps(top_issues), json.dumps(top_depts), 
                month, year, "initial_seed"
            ]
        )
    
    print("Done. State stats initialized.")

if __name__ == "__main__":
    asyncio.run(initialize())
