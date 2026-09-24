"""Render a small looping cinematic from the original named SVG layers.

Requires Pillow, CairoSVG and ffmpeg. This uses only local source art.
"""

from __future__ import annotations

import copy
import io
import math
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

import cairosvg
from PIL import Image, ImageChops, ImageDraw, ImageStat


ROOT = Path(__file__).resolve().parent
WIDTH, HEIGHT = 720, 480
FPS, SECONDS = 24, 6
FRAME_COUNT = FPS * SECONDS
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)


def render_element(root: ET.Element, element: ET.Element, padding: int = 0) -> Image.Image:
    wrapper = ET.Element(f"{{{SVG_NS}}}svg", {
        "viewBox": f"{-padding} {-padding} {WIDTH + 2 * padding} {HEIGHT + 2 * padding}",
        "width": str(WIDTH + 2 * padding), "height": str(HEIGHT + 2 * padding),
    })
    definitions = root.find(f"{{{SVG_NS}}}defs")
    if definitions is not None:
        wrapper.append(copy.deepcopy(definitions))
    wrapper.append(copy.deepcopy(element))
    png = cairosvg.svg2png(bytestring=ET.tostring(wrapper, encoding="utf-8"))
    return Image.open(io.BytesIO(png)).convert("RGBA")


def locate(root: ET.Element, attribute: str, value: str) -> ET.Element:
    for element in root.iter():
        if element.get(attribute) == value:
            return element
    raise ValueError(f"Missing SVG element {attribute}={value}")


svg_root = ET.parse(ROOT / "scene.svg").getroot()
sky = render_element(svg_root, svg_root.find(f"{{{SVG_NS}}}rect"))
far = render_element(svg_root, locate(svg_root, "class", "far"), padding=24)
mid = render_element(svg_root, locate(svg_root, "class", "mid"), padding=24)
near = render_element(svg_root, locate(svg_root, "class", "near"), padding=24)
character = locate(svg_root, "id", "character")
shadow = render_element(svg_root, character.find(f"{{{SVG_NS}}}ellipse"))
body = render_element(svg_root, locate(svg_root, "id", "body"))
head = render_element(svg_root, locate(svg_root, "id", "head"))


def shifted(layer: Image.Image, x: float, y: float) -> Image.Image:
    output = Image.new("RGBA", (WIDTH, HEIGHT))
    # Keep the layer's alpha; using it as a paste mask would apply alpha twice.
    padding_x = (layer.width - WIDTH) // 2
    padding_y = (layer.height - HEIGHT) // 2
    output.paste(layer, (round(x) - padding_x, round(y) - padding_y))
    return output


def render_frame(number: int) -> Image.Image:
    # Begin near a turning point so the repeated last-to-first frame is quiet.
    phase = 2 * math.pi * number / FRAME_COUNT - math.pi / 2
    drift = math.sin(phase)
    lift = math.sin(phase - 0.35)
    canvas = sky.copy()
    for layer, depth in ((far, 2), (mid, 5), (near, 9)):
        canvas.alpha_composite(shifted(layer, drift * depth, lift * depth * 0.45))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(shifted(body, 0, -1.5 * math.sin(phase)))
    head_turn = head.rotate(1.6 * math.sin(phase), resample=Image.Resampling.BICUBIC, center=(363, 261))
    canvas.alpha_composite(shifted(head_turn, 1.2 * drift, -2.2 * math.sin(phase)))
    draw = ImageDraw.Draw(canvas, "RGBA")
    for index, (cx, cy, radius) in enumerate(((122, 211, 3), (602, 307, 2), (539, 182, 2))):
        p = phase + index * 2.1
        draw.ellipse((cx + math.sin(p) * 8 - radius, cy + math.cos(p) * 7 - radius,
                      cx + math.sin(p) * 8 + radius, cy + math.cos(p) * 7 + radius),
                     fill=(255, 248, 198, 105))
    return canvas.convert("RGB")


first = render_frame(0)
first.save(ROOT / "scene-poster.png", optimize=True)
loop_delta = ImageStat.Stat(ImageChops.difference(first, render_frame(FRAME_COUNT))).mean
assert max(loop_delta) == 0, f"Loop did not close: {loop_delta}"
source_boundary_delta = sum(ImageStat.Stat(ImageChops.difference(first, render_frame(FRAME_COUNT - 1))).mean) / 3

command = [
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}",
    "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-crf", "20",
    "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    str(ROOT / "scene-loop.mp4"),
]
with subprocess.Popen(command, stdin=subprocess.PIPE) as process:
    assert process.stdin is not None
    for frame in range(FRAME_COUNT):
        process.stdin.write(render_frame(frame).tobytes())
    process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError("ffmpeg encode failed")

print(f"Rendered {FRAME_COUNT} frames at {WIDTH}x{HEIGHT}, {FPS} fps")
print(f"Loop closure mean RGB difference: {loop_delta}")
print(f"Source last-to-first frame mean difference: {source_boundary_delta:.3f}")
decode = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(ROOT / "scene-loop.mp4"),
          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
bytes_per_frame = WIDTH * HEIGHT * 3
with subprocess.Popen(decode, stdout=subprocess.PIPE) as process:
    assert process.stdout is not None
    decoded_frames = []
    while pixels := process.stdout.read(bytes_per_frame):
        if len(pixels) != bytes_per_frame:
            raise RuntimeError("Incomplete decoded frame")
        if len(decoded_frames) < 2:
            decoded_frames.append(Image.frombytes("RGB", (WIDTH, HEIGHT), pixels))
        elif len(decoded_frames) == 2:
            decoded_frames.append(Image.frombytes("RGB", (WIDTH, HEIGHT), pixels))
        else:
            decoded_frames[-1] = Image.frombytes("RGB", (WIDTH, HEIGHT), pixels)
    if process.wait() != 0:
        raise RuntimeError("ffmpeg decode failed")
if len(decoded_frames) != 3:
    raise RuntimeError("Expected at least three decoded frames")
def mean_delta(a: Image.Image, b: Image.Image) -> float:
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
print(f"Encoded first-to-second frame mean difference: {mean_delta(decoded_frames[0], decoded_frames[1]):.3f}")
print(f"Encoded last-to-first frame mean difference: {mean_delta(decoded_frames[-1], decoded_frames[0]):.3f}")
print(f"Video: {ROOT / 'scene-loop.mp4'}")
