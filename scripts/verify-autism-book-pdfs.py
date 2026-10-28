"""Offline release QA. Never writes to the source PDFs or the app's public directory."""
import argparse
import hashlib
import json
from pathlib import Path
from pypdf import PdfReader, PdfWriter

parser = argparse.ArgumentParser()
parser.add_argument("--source", type=Path, required=True)
parser.add_argument("--downloaded", type=Path, required=True)
parser.add_argument("--work", type=Path, required=True)
args = parser.parse_args()
args.work.mkdir(parents=True, exist_ok=True)
report = {}
for name, pages, count in [("AUTISM_ALL_INCLUSIVE_Elias_Voss.pdf", 52, 0), ("AUTISM_ALL_INCLUSIVE_arbetsblad_A4.pdf", 12, 72)]:
    original = args.source / name
    downloaded = args.downloaded / name
    source_hash = hashlib.sha256(original.read_bytes()).hexdigest()
    assert source_hash == hashlib.sha256(downloaded.read_bytes()).hexdigest(), "Download changed PDF bytes"
    reader = PdfReader(downloaded)
    assert len(reader.pages) == pages
    fields = reader.get_fields() or {}
    assert len(fields) == count
    report[name] = {"sha256": source_hash, "pages": pages, "fields": count, "download_identical": True}
    if not count:
        continue
    assert all(field.get("/FT") == "/Tx" for field in fields.values())
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    values = {name: ("2026-10-28" if "datum" in name.lower() else f"Testvärde {i + 1}: min egen anteckning") for i, name in enumerate(fields)}
    writer.update_page_form_field_values(None, values, auto_regenerate=False)
    filled = args.work / "arbetsblad-ifyllnadstest.pdf"
    with filled.open("wb") as stream:
        writer.write(stream)
    reopened = PdfReader(filled)
    saved_fields = reopened.get_fields() or {}
    assert set(saved_fields) == set(values)
    for field_name, value in values.items():
        assert saved_fields[field_name].get("/V") == value, field_name
    widgets = 0
    for page in reopened.pages:
        for reference in page.get("/Annots", []):
            widget = reference.get_object()
            if widget.get("/Subtype") != "/Widget":
                continue
            parent = widget.get("/Parent")
            effective = parent.get_object() if parent else widget
            assert effective.get("/V") == values[effective["/T"]]
            assert widget.get("/AP") and widget["/AP"].get("/N"), "Missing appearance stream"
            widgets += 1
    assert widgets == 72
    report[name].update(saved_and_reopened_values=72, interactive_widgets=widgets, appearance_streams_verified=True)
    assert hashlib.sha256(original.read_bytes()).hexdigest() == source_hash
output = args.work / "pdf-verification.json"
output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
