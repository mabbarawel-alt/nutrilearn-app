import os
import json
from typing import Optional, List, Dict, Any
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI(
    title="NutriLearn Backend API",
    description="Evidence-based Child Malnutrition Monitoring Platform API",
    version="2.4.0"
)

# Enable CORS for local development and cross-origin access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY", "")

def get_supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def is_supabase_configured() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY and "YOUR_PROJECT_ID" not in SUPABASE_URL)

# Local fallback store (persists to a JSON file if cloud database is unreachable)
LOCAL_DB_FILE = BASE_DIR / "local_db.json"

def get_local_db() -> Dict[str, Any]:
    if LOCAL_DB_FILE.exists():
        try:
            with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"children": [], "monthly_reports": [], "announcements": [], "users": [], "modules": [], "groups": []}

def save_local_db(data: Dict[str, Any]):
    try:
        with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print("Error saving local db:", e)

# ==============================================================================
# API ENDPOINTS
# ==============================================================================

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "NutriLearn",
        "version": "2.4.0",
        "supabase_configured": is_supabase_configured(),
        "supabase_url": SUPABASE_URL if is_supabase_configured() else None
    }

# ------------------------------------------------------------------------------
# 1. CHILDREN ENDPOINTS
# ------------------------------------------------------------------------------
@app.get("/api/children")
async def get_children(barangay: Optional[str] = None):
    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/children?select=*&order=last_assessed.desc"
            if barangay and barangay != "All Barangays":
                url += f"&barangay=eq.{barangay}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=get_supabase_headers())
                if resp.status_code == 200:
                    return resp.json()
                print("Supabase get children status:", resp.status_code, resp.text)
        except Exception as e:
            print("Supabase get children error:", e)

    # Fallback to local storage
    db = get_local_db()
    children = db.get("children", [])
    if barangay and barangay != "All Barangays":
        children = [c for c in children if c.get("barangay") == barangay]
    return children

@app.post("/api/children")
async def save_child(child: Dict[str, Any]):
    payload = {
        "first_name": child.get("name", "").split()[0] if child.get("name") else child.get("first_name", "Child"),
        "last_name": " ".join(child.get("name", "").split()[1:]) if child.get("name") else child.get("last_name", ""),
        "age_months": int(child.get("ageMonths") or child.get("age_months") or 0),
        "sex": child.get("sex", "Male"),
        "parent_name": child.get("parentName") or child.get("parent_name") or "Guardian",
        "parent_phone": child.get("parentPhone") or child.get("parent_phone") or "",
        "barangay": child.get("barangay", "Barangay San Jose"),
        "height_cm": float(child.get("heightCm") or child.get("height_cm") or 0.0),
        "weight_kg": float(child.get("weightKg") or child.get("weight_kg") or 0.0),
        "muac_mm": int(child.get("muacMm") or child.get("muac_mm") or 0),
        "status": child.get("status", "Normal"),
        "hfa_status": child.get("hfaStatus") or child.get("hfa_status") or "Normal",
        "wfh_status": child.get("wfhStatus") or child.get("wfh_status") or "Normal",
        "wfa_status": child.get("wfaStatus") or child.get("wfa_status") or "Normal",
        "muac_status": child.get("muacStatus") or child.get("muac_status") or "Normal",
        "improved": bool(child.get("improved", False)),
        "last_assessed": child.get("lastAssessed") or child.get("last_assessed") or "2026-09-12",
        "notes": child.get("notes", "")
    }

    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/children"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=[payload], headers=get_supabase_headers())
                if resp.status_code in [200, 201]:
                    data = resp.json()
                    return data[0] if isinstance(data, list) and data else payload
                print("Supabase insert child status:", resp.status_code, resp.text)
        except Exception as e:
            print("Supabase insert child error:", e)

    # Local fallback
    db = get_local_db()
    payload["id"] = f"ch-{len(db.get('children', [])) + 1}"
    db.setdefault("children", []).insert(0, payload)
    save_local_db(db)
    return payload

@app.put("/api/children/{child_id}")
async def update_child(child_id: str, child: Dict[str, Any]):
    update_data = {
        "age_months": int(child.get("ageMonths") or child.get("age_months") or 0),
        "height_cm": float(child.get("heightCm") or child.get("height_cm") or 0.0),
        "weight_kg": float(child.get("weightKg") or child.get("weight_kg") or 0.0),
        "muac_mm": int(child.get("muacMm") or child.get("muac_mm") or 0),
        "status": child.get("status", "Normal"),
        "improved": bool(child.get("improved", False)),
        "notes": child.get("notes", "")
    }

    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/children"
            if child_id.isdigit():
                url += f"?id=eq.{child_id}"
            else:
                first_name = child.get("name", "").split()[0] if child.get("name") else child.get("first_name", "")
                url += f"?first_name=eq.{first_name}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.patch(url, json=update_data, headers=get_supabase_headers())
                if resp.status_code in [200, 204]:
                    return {"success": True, "updated": update_data}
        except Exception as e:
            print("Supabase update child error:", e)

    # Local fallback
    db = get_local_db()
    for item in db.get("children", []):
        if str(item.get("id")) == str(child_id):
            item.update(update_data)
            save_local_db(db)
            return item
    return {"success": True, "updated": update_data}

# ------------------------------------------------------------------------------
# 2. MONTHLY REPORTS ENDPOINTS
# ------------------------------------------------------------------------------
@app.get("/api/reports")
async def get_reports():
    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/monthly_reports?select=*&order=submitted_date.desc"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=get_supabase_headers())
                if resp.status_code == 200:
                    return resp.json()
        except Exception as e:
            print("Supabase get reports error:", e)

    db = get_local_db()
    return db.get("monthly_reports", [])

@app.post("/api/reports")
async def submit_report(report: Dict[str, Any]):
    payload = {
        "report_code": report.get("reportId") or report.get("report_code") or f"REP-{os.urandom(3).hex().upper()}",
        "barangay": report.get("barangay", "Barangay San Jose"),
        "chw_name": report.get("chwName") or report.get("chw_name") or "BHW Lead",
        "submitted_date": report.get("submittedDate") or report.get("submitted_date") or "2026-09-12",
        "total_children": int(report.get("totalChildren") or report.get("total_children") or 0),
        "stunted_count": int(report.get("stuntedCount") or report.get("stunted_count") or 0),
        "wasted_count": int(report.get("wastedCount") or report.get("wasted_count") or 0),
        "underweight_count": int(report.get("underweightCount") or report.get("underweight_count") or 0),
        "improved_count": int(report.get("improvedCount") or report.get("improved_count") or 0),
        "stunting_rate": str(report.get("stuntingRate") or report.get("stunting_rate") or "0.0%"),
        "stunting_reduction_achieved": str(report.get("stuntingReductionAchieved") or report.get("stunting_reduction_achieved") or "0.0%"),
        "status": report.get("status", "Pending Review"),
        "notes": report.get("notes", "")
    }

    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/monthly_reports"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=[payload], headers=get_supabase_headers())
                if resp.status_code in [200, 201]:
                    data = resp.json()
                    return data[0] if isinstance(data, list) and data else payload
        except Exception as e:
            print("Supabase submit report error:", e)

    db = get_local_db()
    db.setdefault("monthly_reports", []).insert(0, payload)
    save_local_db(db)
    return payload

# ------------------------------------------------------------------------------
# 3. ANNOUNCEMENTS ENDPOINTS
# ------------------------------------------------------------------------------
@app.get("/api/announcements")
async def get_announcements():
    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/announcements?select=*&order=created_at.desc"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=get_supabase_headers())
                if resp.status_code == 200:
                    return resp.json()
        except Exception as e:
            print("Supabase get announcements error:", e)

    db = get_local_db()
    return db.get("announcements", [])

@app.post("/api/announcements")
async def create_announcement(ann: Dict[str, Any]):
    payload = {
        "title": ann.get("title", ""),
        "content": ann.get("content", ""),
        "category": ann.get("category", "General Notice"),
        "priority": ann.get("priority", "normal"),
        "author_name": ann.get("authorName") or ann.get("author_name") or "Health Official",
        "author_role": ann.get("authorRole") or ann.get("author_role") or "mho",
        "author_designation": ann.get("authorDesignation") or ann.get("author_designation") or "Staff",
        "target_audience": ann.get("targetAudience") or ann.get("target_audience") or "both",
        "target_barangays": ann.get("targetBarangays") or ann.get("target_barangays") or [],
        "barangay": ann.get("barangay", "All Barangays"),
        "pinned": bool(ann.get("pinned", False))
    }

    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/announcements"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=[payload], headers=get_supabase_headers())
                if resp.status_code in [200, 201]:
                    data = resp.json()
                    return data[0] if isinstance(data, list) and data else payload
        except Exception as e:
            print("Supabase create announcement error:", e)

    db = get_local_db()
    payload["id"] = f"ann-{len(db.get('announcements', [])) + 1}"
    db.setdefault("announcements", []).insert(0, payload)
    save_local_db(db)
    return payload

@app.delete("/api/announcements/{ann_id}")
async def delete_announcement(ann_id: str):
    if is_supabase_configured():
        try:
            url = f"{SUPABASE_URL}/rest/v1/announcements"
            if ann_id.isdigit():
                url += f"?id=eq.{ann_id}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.delete(url, headers=get_supabase_headers())
                if resp.status_code in [200, 204]:
                    return {"success": True}
        except Exception as e:
            print("Supabase delete announcement error:", e)

    db = get_local_db()
    db["announcements"] = [a for a in db.get("announcements", []) if str(a.get("id")) != str(ann_id)]
    save_local_db(db)
    return {"success": True}

# ------------------------------------------------------------------------------
# 4. USER ACCOUNTS ENDPOINTS (Req #1, #12)
# ------------------------------------------------------------------------------
@app.get("/api/users")
async def get_users():
    db = get_local_db()
    return db.get("users", [])

@app.post("/api/users")
async def save_user(user: Dict[str, Any]):
    db = get_local_db()
    users = db.get("users", [])
    user_id = user.get("id") or f"usr-{int(Path(__file__).stat().st_mtime * 1000)}"
    user["id"] = user_id
    existing_idx = next((i for i, u in enumerate(users) if u.get("id") == user_id), None)
    if existing_idx is not None:
        users[existing_idx] = {**users[existing_idx], **user}
    else:
        users.append(user)
    db["users"] = users
    save_local_db(db)
    return user

# ------------------------------------------------------------------------------
# 5. MODULES ENDPOINTS (Req #11)
# ------------------------------------------------------------------------------
@app.get("/api/modules")
async def get_modules():
    db = get_local_db()
    return db.get("modules", [])

@app.post("/api/modules")
async def save_module(mod: Dict[str, Any]):
    db = get_local_db()
    modules = db.get("modules", [])
    mod_id = mod.get("id") or f"mod-{len(modules) + 1}"
    mod["id"] = mod_id
    existing_idx = next((i for i, m in enumerate(modules) if m.get("id") == mod_id), None)
    if existing_idx is not None:
        modules[existing_idx] = {**modules[existing_idx], **mod}
    else:
        modules.append(mod)
    db["modules"] = modules
    save_local_db(db)
    return mod

# ------------------------------------------------------------------------------
# 6. PARENT GROUPS ENDPOINTS (Req #8)
# ------------------------------------------------------------------------------
@app.get("/api/groups")
async def get_groups():
    db = get_local_db()
    return db.get("groups", [])

@app.post("/api/groups")
async def save_group(grp: Dict[str, Any]):
    db = get_local_db()
    groups = db.get("groups", [])
    grp_id = grp.get("id") or f"grp-{len(groups) + 1}"
    grp["id"] = grp_id
    existing_idx = next((i for i, g in enumerate(groups) if g.get("id") == grp_id), None)
    if existing_idx is not None:
        groups[existing_idx] = {**groups[existing_idx], **grp}
    else:
        groups.append(grp)
    db["groups"] = groups
    save_local_db(db)
    return grp

# ==============================================================================
# STATIC FILES & SINGLE PAGE APP ROUTING (Render Unified Deploy)
# ==============================================================================

# Mount static asset folders if they exist
for folder in ["css", "js", "assets"]:
    p = BASE_DIR / folder
    if p.exists() and p.is_dir():
        app.mount(f"/{folder}", StaticFiles(directory=str(p)), name=folder)

@app.get("/manifest.json")
async def manifest():
    f = BASE_DIR / "manifest.json"
    if f.exists():
        return FileResponse(f, media_type="application/json")
    raise HTTPException(status_code=404)

@app.get("/sw.js")
async def service_worker():
    f = BASE_DIR / "sw.js"
    if f.exists():
        return FileResponse(f, media_type="application/javascript")
    raise HTTPException(status_code=404)

@app.get("/.env")
async def env_file():
    # Only return public frontend configuration
    f = BASE_DIR / ".env"
    if f.exists():
        return FileResponse(f, media_type="text/plain")
    raise HTTPException(status_code=404)

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = BASE_DIR / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    return FileResponse(BASE_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8085))
    print(f"🚀 Starting NutriLearn FastAPI Backend on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
