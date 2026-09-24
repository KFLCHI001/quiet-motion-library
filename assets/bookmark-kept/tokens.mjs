/** Bind the mark to the host application's colors before playback. */

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function colors(theme) {
  const accent = theme?.accent;
  const line = theme?.line;
  if (!HEX_COLOR.test(accent ?? '') || !HEX_COLOR.test(line ?? '')) {
    throw new TypeError('Bookmark mark needs theme.accent and theme.line as hex colors');
  }
  return { accent, line };
}

function rgb(hex) {
  return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
}

export function bindBookmarkLottie(rawAnimation, theme) {
  const { accent, line } = colors(theme);
  const animation = JSON.parse(JSON.stringify(rawAnimation));
  if (animation.w !== 24 || animation.h !== 24 || animation.layers?.length !== 1 || animation.layers[0]?.nm !== 'Kept bookmark') {
    throw new TypeError('Unexpected bookmark animation structure');
  }
  const fill = animation.layers[0].shapes.find(shape => shape.ty === 'fl');
  const stroke = animation.layers[0].shapes.find(shape => shape.ty === 'st');
  if (!fill || !stroke) throw new TypeError('Kept mark needs a fill and outline');
  fill.c.k = rgb(accent);
  stroke.c.k = rgb(line);
  return animation;
}

export function bindBookmarkStill(svgSource, theme) {
  const { accent, line } = colors(theme);
  if (!svgSource.includes('fill="currentColor"') || !svgSource.includes('stroke="var(--line, currentColor)"')) {
    throw new TypeError('Unexpected bookmark SVG source');
  }
  return svgSource
    .replace('fill="currentColor"', `fill="${accent}"`)
    .replace('stroke="var(--line, currentColor)"', `stroke="${line}"`);
}
