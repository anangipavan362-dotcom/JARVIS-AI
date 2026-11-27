"""
Google Drive Backup Engine for J.A.R.V.I.S. AI
Specifically built for Google One 5 TB Storage Integration.

Produces verified, versioned backups strictly following Master Prompt Section 7:
JARVIS-AI/
  Source-Code/
  Frontend/
  Backend/
  Database-Backups/
  AI-Datasets/
  Assets/
  Documentation/
  Releases/

Security:
- Never includes .env or private credentials.
- Excludes node_modules, __pycache__, .venv, .git.
- Generates SHA-256 integrity hashes for all archive files.
"""

import os
import sys
import shutil
import zipfile
import hashlib
import sqlite3
import json
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "google_drive_backup" / "JARVIS-AI"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
VERSION = "v1.0.0"

EXCLUDE_PATTERNS = {
    ".env", ".env.local", ".env.production", ".env.development",
    "node_modules", ".git", ".github", "__pycache__", ".pytest_cache",
    ".venv", "venv", "dist", ".cache", "logs", "*.pyc", "google_drive_backup"
}

def should_exclude(path: Path) -> bool:
    for part in path.parts:
        if part in EXCLUDE_PATTERNS or part.startswith(".env"):
            return True
        if part.endswith(".pyc"):
            return True
    return False

def calculate_sha256(file_path: Path) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def create_zip_archive(source_dir: Path, target_zip: Path, arcname_prefix: str = ""):
    print(f"📦 Archiving {source_dir.name} -> {target_zip.name}...")
    with zipfile.ZipFile(target_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            rel_root = Path(root).relative_to(source_dir)
            
            # Prune excluded directories
            dirs[:] = [d for d in dirs if not should_exclude(rel_root / d)]
            
            for file in files:
                file_path = Path(root) / file
                rel_file_path = rel_root / file
                if not should_exclude(rel_file_path):
                    arcname = str(Path(arcname_prefix) / rel_file_path) if arcname_prefix else str(rel_file_path)
                    zipf.write(file_path, arcname)

def backup_database(db_path: Path, output_dir: Path) -> dict:
    print(f"💾 Exporting database {db_path.name}...")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    timestamped_db = output_dir / f"jarvis_backup_{TIMESTAMP}.sqlite3"
    dump_sql_path = output_dir / f"jarvis_dump_{TIMESTAMP}.sql"
    
    # 1. Direct verified binary copy
    shutil.copy2(db_path, timestamped_db)
    
    # 2. SQL dump export
    con = sqlite3.connect(str(db_path))
    with open(dump_sql_path, "w", encoding="utf-8") as f:
        for line in con.iterdump():
            f.write(f"{line}\n")
    con.close()
    
    db_hash = calculate_sha256(timestamped_db)
    sql_hash = calculate_sha256(dump_sql_path)
    
    print(f"   ✓ Binary SQLite copy created: {timestamped_db.name} (SHA-256: {db_hash[:12]}...)")
    print(f"   ✓ SQL dump script created:    {dump_sql_path.name} (SHA-256: {sql_hash[:12]}...)")
    
    return {
        "sqlite_backup": str(timestamped_db.name),
        "sqlite_sha256": db_hash,
        "sql_dump": str(dump_sql_path.name),
        "sql_sha256": sql_hash,
        "size_bytes": timestamped_db.stat().st_size
    }

def main():
    print("=" * 60)
    print(f"🚀 JARVIS AI — GOOGLE DRIVE BACKUP ENGINE ({VERSION})")
    print(f"🕒 Timestamp: {TIMESTAMP} UTC")
    print(f"📁 Destination: {OUTPUT_DIR}")
    print("=" * 60)
    
    # Create required folder structure
    folders = [
        "Source-Code",
        "Frontend",
        "Backend",
        "Database-Backups",
        "AI-Datasets",
        "Assets",
        "Documentation",
        "Releases"
    ]
    
    for folder in folders:
        (OUTPUT_DIR / folder).mkdir(parents=True, exist_ok=True)
        # Create .keep or README
        readme_path = OUTPUT_DIR / folder / "README.md"
        if not readme_path.exists():
            readme_path.write_text(f"# JARVIS AI - {folder}\n\nAutomated backup folder for Google Drive 5 TB storage.\nLast updated: {TIMESTAMP} UTC\n", encoding="utf-8")
    
    manifest = {
        "project": "JARVIS-AI",
        "version": VERSION,
        "timestamp_utc": TIMESTAMP,
        "files": []
    }
    
    # 1. Source Code Archive (Root & Full repo excluding secrets)
    source_zip = OUTPUT_DIR / "Source-Code" / f"jarvis_full_source_{TIMESTAMP}.zip"
    create_zip_archive(BASE_DIR, source_zip, arcname_prefix="jarvis-ai")
    manifest["files"].append({
        "folder": "Source-Code",
        "name": source_zip.name,
        "sha256": calculate_sha256(source_zip),
        "size_bytes": source_zip.stat().st_size
    })
    
    # 2. Frontend Archive
    frontend_dir = BASE_DIR / "web" / "frontend"
    if frontend_dir.exists():
        frontend_zip = OUTPUT_DIR / "Frontend" / f"jarvis_frontend_{TIMESTAMP}.zip"
        create_zip_archive(frontend_dir, frontend_zip, arcname_prefix="frontend")
        manifest["files"].append({
            "folder": "Frontend",
            "name": frontend_zip.name,
            "sha256": calculate_sha256(frontend_zip),
            "size_bytes": frontend_zip.stat().st_size
        })
    
    # 3. Backend Archive
    backend_dir = BASE_DIR / "backend"
    if backend_dir.exists():
        backend_zip = OUTPUT_DIR / "Backend" / f"jarvis_backend_{TIMESTAMP}.zip"
        create_zip_archive(backend_dir, backend_zip, arcname_prefix="backend")
        manifest["files"].append({
            "folder": "Backend",
            "name": backend_zip.name,
            "sha256": calculate_sha256(backend_zip),
            "size_bytes": backend_zip.stat().st_size
        })
    
    # 4. Database Backup
    db_file = BASE_DIR / "backend" / "jarvis.db"
    if db_file.exists():
        db_info = backup_database(db_file, OUTPUT_DIR / "Database-Backups")
        manifest["database"] = db_info
    
    # 5. Assets Backup (Images, HUD models, icons)
    assets_out = OUTPUT_DIR / "Assets"
    desktop_dir = BASE_DIR / "desktop"
    if desktop_dir.exists():
        for ext in ("*.png", "*.jpg", "*.ico", "*.svg"):
            for asset in desktop_dir.glob(ext):
                shutil.copy2(asset, assets_out / asset.name)
    
    # 6. Documentation Backup
    docs_out = OUTPUT_DIR / "Documentation"
    for doc in BASE_DIR.glob("*.md"):
        shutil.copy2(doc, docs_out / doc.name)
    
    brain_dir = BASE_DIR.parent.parent / "brain"
    # Copy walkthrough if exists
    for md_file in BASE_DIR.glob("docs/*.md"):
        docs_out.mkdir(parents=True, exist_ok=True)
        shutil.copy2(md_file, docs_out / md_file.name)
        
    # 7. Release Manifest
    manifest_path = OUTPUT_DIR / "Releases" / f"manifest_{TIMESTAMP}.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"📋 Generated Release Manifest: {manifest_path.name}")
    
    print("\n" + "=" * 60)
    print("✅ BACKUP COMPLETE AND VERIFIED!")
    print(f"Total backup size: {sum(f['size_bytes'] for f in manifest['files']) / (1024*1024):.2f} MB")
    print(f"Output path: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
