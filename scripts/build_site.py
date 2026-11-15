"""Rebuild index.html from the template, inlining assets as base64 data URIs.

Run from anywhere; paths are resolved relative to the repo root.
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TPL = ROOT / "src" / "index.template.html"
OUT = ROOT / "index.html"
ASSETS = ROOT / "assets"

MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}

html = TPL.read_text(encoding="utf-8")
missing = []

def repl(m):
    key = m.group(1)
    for ext in (".webp", ".png", ".jpg"):
        f = ASSETS / f"{key}{ext}"
        if f.exists():
            print(f"  inlined {key}{ext} ({f.stat().st_size // 1024} KB)")
            return "data:" + MIME[ext] + ";base64," + base64.b64encode(f.read_bytes()).decode()
    missing.append(key)
    return m.group(0)

html = re.sub(r"\{\{ASSET:([a-z0-9\-]+)\}\}", repl, html)

if missing:
    raise SystemExit(f"MISSING ASSETS: {missing}")

OUT.write_text(html, encoding="utf-8")
print(f"built {OUT} ({OUT.stat().st_size // 1024} KB)")
assert "{{ASSET:" not in html, "unreplaced asset placeholder"
print("OK")
