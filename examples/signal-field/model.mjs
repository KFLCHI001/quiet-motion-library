// A renderer-independent visual model. The host owns the number and its meaning.
export const WIDTH = 520;
export const HEIGHT = 320;
export const TILE_COUNT = 11;

export function clampUnit(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
}

function colorMix(a, b, t) {
  const left = [1, 3, 5].map((index) => parseInt(a.slice(index, index + 2), 16));
  const right = [1, 3, 5].map((index) => parseInt(b.slice(index, index + 2), 16));
  return '#' + left.map((channel, index) => Math.round(channel + (right[index] - channel) * t).toString(16).padStart(2, '0')).join('');
}

export function signalField(value) {
  const input = clampUnit(value);
  const tiles = Array.from({ length: TILE_COUNT }, (_, index) => {
    const along = index / (TILE_COUNT - 1);
    const wave = Math.sin(along * Math.PI * (1.4 + input * 1.5) + input * 1.6);
    const height = 40 + input * 105 + (wave + 1) * (12 + input * 19);
    const width = 19 + input * 9 + (index % 3) * 2;
    return {
      x: 70 + index * 38,
      y: 147 + wave * (8 + input * 27),
      width,
      height,
      rotation: -7 + input * 12 + wave * 2,
      color: colorMix('#9a4e3b', '#d17e36', input * 0.76 + along * 0.17),
    };
  });
  return {
    input,
    background: '#f5f0e7',
    rail: '#263d39',
    tiles,
    // A smaller motif can be used elsewhere without copying the whole field.
    motif: tiles.filter((_, index) => index === 3 || index === 5 || index === 7)
      .map((tile) => ({ height: tile.height / 5, rotation: tile.rotation, color: tile.color })),
  };
}
