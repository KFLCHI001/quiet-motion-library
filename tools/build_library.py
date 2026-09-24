"""Generate the two original SVG and Lottie studies from local vector geometry.

The named SVG groups are editable source. This script keeps the checked-in Lottie
exports and settled SVGs in sync with that geometry and the timing below.
"""

from __future__ import annotations

import json
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
FPS = 30
OUT = 9
EASE = {"o": {"x": 0.23, "y": 1}, "i": {"x": 0.32, "y": 1}}


def color(hex_value: str) -> list[float]:
    return [round(int(hex_value[i : i + 2], 16) / 255, 6) for i in (1, 3, 5)]


def static(value):
    return {"a": 0, "k": value}


def frames(start, end, first, last):
    return {"a": 1, "k": [{**EASE, "s": [first] if isinstance(first, (int, float)) else first, "e": [last] if isinstance(last, (int, float)) else last, "t": start}, {"s": [last] if isinstance(last, (int, float)) else last, "t": end}]}


def transform(position=(0, 0), opacity=100):
    return {
        "a": static([0, 0]), "s": static([100, 100]), "sk": static(0),
        "p": position if isinstance(position, dict) else static(list(position)),
        "r": static(0), "sa": static(0),
        "o": opacity if isinstance(opacity, dict) else static(opacity),
    }


def path(points, name, closed=False):
    count = len(points)
    return {"ty": "sh", "nm": name, "d": 1, "ks": static({"c": closed, "i": [[0, 0]] * count, "o": [[0, 0]] * count, "v": [list(p) for p in points]})}


def rect(width, height, radius, name):
    return {"ty": "rc", "nm": name, "d": 1, "p": static([0, 0]), "s": static([width, height]), "r": static(radius)}


def fill(hex_value):
    return {"ty": "fl", "nm": "Fill", "c": static(color(hex_value)), "o": static(100), "r": 1}


def stroke(hex_value, width):
    return {"ty": "st", "nm": "Outline", "c": static(color(hex_value)), "o": static(100), "w": static(width), "lc": 2, "lj": 2, "ml": 4}


def shape_layer(name, geometry, styling, position=(0, 0), opacity=100, out=OUT):
    shapes = geometry if isinstance(geometry, list) else [geometry]
    return {"ddd": 0, "ty": 4, "nm": name, "sr": 1, "st": 0, "ip": 0, "op": out, "hd": False, "bm": 0, "ks": transform(position, opacity), "shapes": [*shapes, *styling]}


def document(name, layers, size=240, out=OUT, token_bindings=None):
    for index, layer in enumerate(layers, 1):
        layer["ind"] = index
    result = {"v": "5.7.4", "fr": FPS, "ip": 0, "op": out, "w": size, "h": size,
            "nm": name, "ddd": 0, "assets": [], "layers": layers,
            "meta": {"g": "quiet-motion-library local vector source; original geometry"}}
    if token_bindings:
        result["meta"]["tokenBindings"] = token_bindings
    return result


ASSETS = [
    {
        "id": "bookmark-kept",
        "title": "Inline kept mark",
        "size": 24,
        "out": 5,
        "token_bindings": {"Kept bookmark": {"fill": "theme.accent", "stroke": "theme.line"}},
        "svg": """<g id="kept-bookmark" aria-label="bookmark" data-fill-token="theme.accent" data-stroke-token="theme.line"><path d="M4 2 L20 2 L20 23 L12 19 L4 23 Z" fill="currentColor" stroke="var(--line, currentColor)" stroke-width="1" stroke-linejoin="round"/></g>""",
        "layers": [
            shape_layer("Kept bookmark", path([(4, 2), (20, 2), (20, 23), (12, 19), (4, 23)], "bookmark silhouette", True), [fill("#000000"), stroke("#888888", 1)], position=frames(0, 4, [0, -1.5], [0, 0]), opacity=frames(0, 3, 55, 100), out=5),
        ],
    },
    {
        "id": "review-draft",
        "title": "Review the draft",
        "svg": """<g id="source-frame" fill="none" stroke="#A25A44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M53 78V58h20"/><path d="M167 58h20v20"/><path d="M53 163v20h20"/><path d="M167 183h20v-20"/></g>
<g id="review-paper" aria-label="draft paper"><rect x="70" y="48" width="100" height="144" rx="12" fill="#F7F1E8" stroke="#D9CFC2" stroke-width="2"/></g>
<g id="draft-lines" fill="none" stroke="#6E6178" stroke-width="4" stroke-linecap="round"><path d="M88 93h64"/><path d="M88 111h48"/><path d="M88 129h64"/><path d="M88 147h37"/></g>
<g id="review-corner" aria-label="review tab"><path d="M145 48 L158 48 L170 60 L170 73 L145 73 Z" fill="#F1DDD2"/><path d="M145 48 L145 73 L170 73" fill="none" stroke="#A25A44" stroke-width="2" stroke-linejoin="round"/></g>""",
        "layers": [
            shape_layer("Fold highlight", path([(145, 48), (145, 73), (170, 73)], "fold line"), [stroke("#A25A44", 2)], opacity=frames(6, 8, 0, 100)),
            shape_layer("Review corner", path([(145, 48), (158, 48), (170, 60), (170, 73), (145, 73)], "fold", True), [fill("#F1DDD2")], opacity=frames(5, 7, 0, 100)),
            shape_layer("Line 4", path([(88, 147), (125, 147)], "line"), [stroke("#6E6178", 4)], opacity=frames(5, 8, 0, 100)),
            shape_layer("Line 3", path([(88, 129), (152, 129)], "line"), [stroke("#6E6178", 4)], opacity=frames(4, 7, 0, 100)),
            shape_layer("Line 2", path([(88, 111), (136, 111)], "line"), [stroke("#6E6178", 4)], opacity=frames(3, 6, 0, 100)),
            shape_layer("Line 1", path([(88, 93), (152, 93)], "line"), [stroke("#6E6178", 4)], opacity=frames(2, 5, 0, 100)),
            shape_layer("Draft paper", rect(100, 144, 12, "paper rectangle"), [fill("#F7F1E8"), stroke("#D9CFC2", 2)], position=frames(0, 6, [120, 132], [120, 120]), opacity=frames(0, 3, 0, 100)),
            shape_layer("Source frame", [
                path([(73, 58), (53, 58), (53, 78)], "top left"),
                path([(167, 58), (187, 58), (187, 78)], "top right"),
                path([(53, 163), (53, 183), (73, 183)], "bottom left"),
                path([(187, 163), (187, 183), (167, 183)], "bottom right"),
            ], [stroke("#A25A44", 4)], opacity=frames(0, 3, 0, 100)),
        ],
    },
]


def svg_markup(title, body, size=240):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-labelledby="title">
<title id="title">{escape(title)}</title>
{body}
</svg>\n'''


def main():
    for asset in ASSETS:
        directory = ROOT / "assets" / asset["id"]
        directory.mkdir(parents=True, exist_ok=True)
        (directory / "source.svg").write_text(svg_markup(asset["title"] + " — editable layered source", asset["svg"], asset.get("size", 240)), encoding="utf-8")
        (directory / "still.svg").write_text(svg_markup(asset["title"], asset["svg"], asset.get("size", 240)), encoding="utf-8")
        (directory / "motion.lottie.json").write_text(json.dumps(document(asset["title"], asset["layers"], asset.get("size", 240), asset.get("out", OUT), asset.get("token_bindings")), separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
