"""Package the generated Lottie animation with deterministic ZIP metadata."""
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent
animation = (ROOT / "signal-field.json").read_bytes()
manifest = json.dumps({"version": "2", "animations": [{"id": "signal-field"}], "initial": {"animation": "signal-field"}}, separators=(",", ":")).encode()
with ZipFile(ROOT / "signal-field.lottie", "w") as archive:
    for name, content in (("manifest.json", manifest), ("a/signal-field.json", animation)):
        info = ZipInfo(name, date_time=(2026, 9, 24, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, content)
print("signal field dotLottie written")
