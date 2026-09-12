import urllib.request, json

SUPABASE_URL = "https://zvsajtnxthoahrujwfpf.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2c2FqdG54dGhvYWhydWp3ZnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNjQ0NjYsImV4cCI6MjEwNDc0MDQ2Nn0.OT1MjjVunkwJy23esw6nkWQ2a38RsEdTLX-aBD_ZojE"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

children = [
    {
        "first_name": "Joshua",
        "last_name": "Garcia",
        "age_months": 18,
        "sex": "Male",
        "parent_name": "Joy Garcia",
        "parent_phone": "0917-123-4567",
        "barangay": "Barangay San Jose",
        "height_cm": 73.5,
        "weight_kg": 8.1,
        "muac_mm": 116,
        "status": "Stunted",
        "hfa_status": "Stunted",
        "wfh_status": "Normal",
        "wfa_status": "Underweight",
        "muac_status": "Yellow (At Risk)",
        "improved": False,
        "last_assessed": "2026-09-02",
        "notes": "Low animal protein access; advised on monggo and malunggay."
    },
    {
        "first_name": "Althea",
        "last_name": "Santos",
        "age_months": 14,
        "sex": "Female",
        "parent_name": "Elena Santos",
        "parent_phone": "0920-888-4321",
        "barangay": "Barangay Santa Maria",
        "height_cm": 69.2,
        "weight_kg": 6.8,
        "muac_mm": 112,
        "status": "Wasted",
        "hfa_status": "Normal",
        "wfh_status": "Wasted",
        "wfa_status": "Underweight",
        "muac_status": "Red (Severe Acute)",
        "improved": False,
        "last_assessed": "2026-09-04",
        "notes": "Severe acute wasting; enrolled in supplemental feeding."
    },
    {
        "first_name": "Princess Joy",
        "last_name": "Mendoza",
        "age_months": 20,
        "sex": "Female",
        "parent_name": "Janice Mendoza",
        "parent_phone": "0915-443-8877",
        "barangay": "Barangay Santa Maria",
        "height_cm": 76.8,
        "weight_kg": 9.8,
        "muac_mm": 127,
        "status": "Improved",
        "hfa_status": "Normal",
        "wfh_status": "Normal",
        "wfa_status": "Normal",
        "muac_status": "Green (Normal)",
        "improved": True,
        "last_assessed": "2026-09-05",
        "notes": "Successfully replaced junk snacks with Saba banana and monggo."
    }
]

def seed():
    url = f"{SUPABASE_URL}/rest/v1/children"
    req = urllib.request.Request(url, data=json.dumps(children).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            print("Successfully seeded children:", resp.status)
    except urllib.error.HTTPError as e:
        print("HTTP ERROR:", e.code, e.read().decode('utf-8'))
    except Exception as ex:
        print("ERROR:", ex)

if __name__ == "__main__":
    seed()
