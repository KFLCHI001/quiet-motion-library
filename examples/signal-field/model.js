// A renderer-independent visual model. The host owns the number and its meaning.
// The 'worklet' directives let Reanimated run these functions on the UI thread;
// in other runtimes they are inert strings.
export const WIDTH = 520;
export const HEIGHT = 320;
export const TILE_COUNT = 11;

export const DEFAULT_THEME = Object.freeze({
  background: '#f5f0e7',
  rail: '#263d39',
  low: '#9a4e3b',
  high: '#d17e36',
});

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Merge host colors over the defaults. Call once per theme, off the animation path. */
export function resolveTheme(theme) {
  const resolved = { ...DEFAULT_THEME, ...theme };
  for (const key of Object.keys(DEFAULT_THEME)) {
    if (!HEX_COLOR.test(resolved[key] ?? '')) {
      throw new TypeError(`Signal field theme.${key} must be a #rrggbb color`);
    }
  }
  return resolved;
}

export function clampUnit(value) {
  'worklet';
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
}

function channel(hex, index) {
  'worklet';
  return parseInt(hex.slice(index, index + 2), 16);
}

function colorMix(a, b, t) {
  'worklet';
  let out = '#';
  for (const index of [1, 3, 5]) {
    const left = channel(a, index);
    out += Math.round(left + (channel(b, index) - left) * t).toString(16).padStart(2, '0');
  }
  return out;
}

/** One tile, so a per-tile renderer need not compute the whole field. */
export function signalTile(input, index, theme = DEFAULT_THEME) {
  'worklet';
  const along = index / (TILE_COUNT - 1);
  const wave = Math.sin(along * Math.PI * (1.4 + input * 1.5) + input * 1.6);
  return {
    x: 70 + index * 38,
    y: 147 + wave * (8 + input * 27),
    width: 19 + input * 9 + (index % 3) * 2,
    height: 40 + input * 105 + (wave + 1) * (12 + input * 19),
    rotation: -7 + input * 12 + wave * 2,
    color: colorMix(theme.low, theme.high, input * 0.76 + along * 0.17),
  };
}

/** Pass a theme from resolveTheme(); the default needs no validation. */
export function signalField(value, theme = DEFAULT_THEME) {
  'worklet';
  const input = clampUnit(value);
  const tiles = [];
  for (let index = 0; index < TILE_COUNT; index += 1) tiles.push(signalTile(input, index, theme));
  return {
    input,
    background: theme.background,
    rail: theme.rail,
    tiles,
    // A smaller motif can be used elsewhere without copying the whole field.
    motif: [tiles[3], tiles[5], tiles[7]]
      .map((tile) => ({ height: tile.height / 5, rotation: tile.rotation, color: tile.color })),
  };
}
