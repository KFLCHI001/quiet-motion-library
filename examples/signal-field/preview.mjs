import { signalField } from './model.mjs';

const slider = document.querySelector('#level');
const label = document.querySelector('#level-value');
const svg = document.querySelector('#field');
const fallback = document.querySelector('#fallback');
const ns = 'http://www.w3.org/2000/svg';
let pending = false;
let current = Number(slider.value) / 100;

function element(tag, attributes) {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
}

const rail = element('rect', { x: 39, y: 150, width: 442, height: 2, fill: '#263d39' });
svg.append(rail);
const tiles = Array.from({ length: 11 }, () => element('rect', { class: 'tile', rx: 3 }));
svg.append(...tiles);

function draw() {
  pending = false;
  if (document.hidden) return;
  const field = signalField(current);
  field.tiles.forEach((tile, index) => {
    const node = tiles[index];
    node.setAttribute('x', tile.x - tile.width / 2);
    node.setAttribute('y', tile.y - tile.height / 2);
    node.setAttribute('width', tile.width);
    node.setAttribute('height', tile.height);
    node.setAttribute('fill', tile.color);
    node.setAttribute('transform', `rotate(${tile.rotation} ${tile.x} ${tile.y})`);
  });
  svg.removeAttribute('hidden');
  fallback.hidden = true;
}

function schedule() {
  if (!pending && !document.hidden) {
    pending = true;
    requestAnimationFrame(draw);
  }
}

slider.addEventListener('input', () => {
  current = Number(slider.value) / 100;
  label.textContent = slider.value;
  schedule();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
schedule();
