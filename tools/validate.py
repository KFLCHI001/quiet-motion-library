"""Focused structural and provenance checks for the distributable motion assets."""

from __future__ import annotations

import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ("bookmark-kept", "review-draft")
REVIEW_PALETTE = {"#F7F1E8", "#D9CFC2", "#A25A44", "#F1DDD2", "#6E6178"}
SVG_NS = "{http://www.w3.org/2000/svg}"


def check(condition: bool, message: str):
    if not condition:
        raise AssertionError(message)


def visit(value):
    if isinstance(value, dict):
        yield value
        for nested in value.values():
            yield from visit(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from visit(nested)


def endpoint_vertices(svg_tree, group_id: str):
    group = next(group for group in svg_tree.findall(f"{SVG_NS}g") if group.attrib.get("id") == group_id)
    d = group.find(f"{SVG_NS}path").attrib["d"]
    pairs = re.findall(r"[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)", d)
    check(bool(pairs), f"{group_id}: use explicit source vertices for export parity")
    return [[float(x), float(y)] for x, y in pairs]


def run():
    preview = (ROOT / "preview" / "index.html").read_text(encoding="utf-8")
    check("loop: false" in preview and "autoplay: false" in preview, "preview must play once on request")
    check("prefers-reduced-motion: reduce" in preview and "Player unavailable" in preview, "reduced motion and player failure need static fallback")
    check((ROOT / "preview" / "vendor" / "LICENSE.md").exists(), "vendored player needs its own license")

    for asset_id in ASSETS:
        directory = ROOT / "assets" / asset_id
        data_bytes = (directory / "motion.lottie.json").read_bytes()
        data = json.loads(data_bytes)
        expected_size, expected_frames = (24, 5) if asset_id == "bookmark-kept" else (240, 9)
        check(data["w"] == expected_size and data["h"] == expected_size, f"{asset_id}: stage size")
        check(data["fr"] == 30 and data["ip"] == 0 and data["op"] == expected_frames, f"{asset_id}: bounded one-shot duration")
        check(data["assets"] == [] and all(layer["ty"] == 4 for layer in data["layers"]), f"{asset_id}: vector layers only")
        check(len(data_bytes) < 40_000, f"{asset_id}: unexpectedly large JSON")
        check(all(layer["nm"] and layer["ip"] == 0 and layer["op"] == data["op"] for layer in data["layers"]), f"{asset_id}: named complete layers")
        for node in visit(data):
            if node.get("a") == 1 and isinstance(node.get("k"), list):
                times = [frame["t"] for frame in node["k"] if isinstance(frame, dict) and "t" in frame]
                check(times == sorted(times) and all(0 <= t <= data["op"] for t in times), f"{asset_id}: keyframe outside composition")
        source = (directory / "source.svg").read_text(encoding="utf-8")
        still = (directory / "still.svg").read_text(encoding="utf-8")
        source_tree = ET.fromstring(source)
        still_tree = ET.fromstring(still)
        for label, tree, text in (("source", source_tree, source), ("still", still_tree, still)):
            check(tree.attrib["viewBox"] == f"0 0 {expected_size} {expected_size}", f"{asset_id}: {label} viewBox")
            check(len(tree.findall(f"{SVG_NS}g")) >= (1 if asset_id == "bookmark-kept" else 3), f"{asset_id}: {label} needs editable named layers")
            text_without_namespace = text.replace('http://www.w3.org/2000/svg', '')
            check(not tree.findall(f".//{SVG_NS}image") and "http:" not in text_without_namespace and "https:" not in text_without_namespace, f"{asset_id}: {label} external or raster asset")
            found = set(re.findall(r"#[0-9A-Fa-f]{6}", text))
            palette = set() if asset_id == "bookmark-kept" else REVIEW_PALETTE
            check(found <= palette, f"{asset_id}: {label} unapproved color {found - palette}")
            if asset_id == "bookmark-kept":
                check('fill="currentColor"' in text and 'stroke="var(--line, currentColor)"' in text, f"{asset_id}: {label} needs runtime color tokens")
        source_tree.find(f"{SVG_NS}title").text = ""
        still_tree.find(f"{SVG_NS}title").text = ""
        check(ET.tostring(source_tree) == ET.tostring(still_tree), f"{asset_id}: settled SVG drifted from source")
        group_id, layer_name = ("kept-bookmark", "Kept bookmark") if asset_id == "bookmark-kept" else ("review-corner", "Review corner")
        layer = next(layer for layer in data["layers"] if layer["nm"] == layer_name)
        exported_vertices = next(shape for shape in layer["shapes"] if shape["ty"] == "sh")["ks"]["k"]["v"]
        check(endpoint_vertices(source_tree, group_id) == exported_vertices, f"{asset_id}: SVG and Lottie endpoint geometry differ")
        if asset_id == "bookmark-kept":
            check(len(data["layers"]) == 1, "Bookmark mark must remain a single shape")
            check(data["meta"].get("tokenBindings") == {"Kept bookmark": {"fill": "theme.accent", "stroke": "theme.line"}}, "Bookmark runtime color contract")
        print(f"PASS {asset_id}: {len(data_bytes):,} B, {data['op'] / data['fr']:.2f} s, {len(data['layers'])} vector layers, 0 image assets, SVG parity")

    print("PASS preview: one-shot, reduced-motion and player-failure paths, licensed local player")
    print("Player SHA-256:", hashlib.sha256((ROOT / "preview" / "vendor" / "lottie.min.js").read_bytes()).hexdigest())


if __name__ == "__main__":
    run()
