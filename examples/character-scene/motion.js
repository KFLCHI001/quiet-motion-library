/** Small state-driven SVG rig. Load only the trusted, same-origin scene.svg. */

const stage = document.querySelector('.stage');
const slot = document.querySelector('#scene-slot');
const buttons = [...document.querySelectorAll('[data-set-mode]')];
const reduceControl = document.querySelector('#reduce');
const status = document.querySelector('#status');
const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const labels = {
  idle: 'Idle. Gentle body and leaf motion; the character can be interrupted immediately.',
  look: 'Look. Move your pointer across the scene to direct gaze and depth.',
  listen: 'Listen. Head tilts and the mouth changes to an attentive expression.',
  confirm: 'Confirm. The arm waves once, then the character holds a settled smile.',
  rest: 'Rest. Eyes soften and ambient motion continues quietly.',
};
const stillLabels = {
  idle: 'Idle. Static settled pose.',
  look: 'Look. Static attentive pose; pointer depth is off.',
  listen: 'Listen. Static attentive expression.',
  confirm: 'Confirm. Static settled smile; no wave.',
  rest: 'Rest. Static softened eyes.',
};

let loaded = false;
let manualReduced = false;
let pointerFrame = 0;
let pendingPoint = null;
const isReduced = () => manualReduced || systemReduced.matches;
const description = mode => (isReduced() ? stillLabels : labels)[mode];

function setDepth(x, y) {
  stage.style.setProperty('--far-x', `${(-x * 3).toFixed(1)}px`);
  stage.style.setProperty('--far-y', `${(-y * 2).toFixed(1)}px`);
  stage.style.setProperty('--mid-x', `${(-x * 8).toFixed(1)}px`);
  stage.style.setProperty('--mid-y', `${(-y * 5).toFixed(1)}px`);
  stage.style.setProperty('--near-x', `${(-x * 15).toFixed(1)}px`);
  stage.style.setProperty('--near-y', `${(-y * 9).toFixed(1)}px`);
  stage.style.setProperty('--gaze-x', `${(x * 5).toFixed(1)}px`);
  stage.style.setProperty('--gaze-y', `${(y * 3).toFixed(1)}px`);
}

function clearPointer() {
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  pendingPoint = null;
  setDepth(0, 0);
}

function setMode(mode) {
  if (!loaded || !Object.hasOwn(labels, mode)) return;
  if (mode !== 'look') clearPointer();
  stage.dataset.mode = mode;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setMode === mode)));
  status.textContent = description(mode);
  stage.classList.remove('pulse');
  if (mode === 'confirm' && !isReduced() && !document.hidden) {
    // Flush the previous class so repeated confirmations restart once.
    void stage.offsetWidth;
    stage.classList.add('pulse');
  }
}

function updateReduced() {
  reduceControl.checked = isReduced();
  reduceControl.disabled = systemReduced.matches;
  document.documentElement.dataset.reduce = String(isReduced());
  if (isReduced()) {
    clearPointer();
    stage.classList.remove('pulse');
  }
  if (loaded) status.textContent = description(stage.dataset.mode);
}

buttons.forEach(button => {
  button.disabled = true;
  button.addEventListener('click', () => setMode(button.dataset.setMode));
});
reduceControl.addEventListener('change', () => {
  manualReduced = reduceControl.checked;
  updateReduced();
});
systemReduced.addEventListener('change', updateReduced);
updateReduced();

stage.addEventListener('pointermove', event => {
  if (!loaded || isReduced() || document.hidden || stage.dataset.mode !== 'look') return;
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
  const rect = stage.getBoundingClientRect();
  pendingPoint = [
    Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
    Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)),
  ];
  if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
    if (pendingPoint && !isReduced() && stage.dataset.mode === 'look' && !document.hidden) {
      setDepth(pendingPoint[0], pendingPoint[1]);
    }
    pointerFrame = 0;
  });
});
stage.addEventListener('pointerleave', clearPointer);
document.addEventListener('visibilitychange', () => {
  document.documentElement.dataset.pageHidden = String(document.hidden);
  if (document.hidden) {
    clearPointer();
    stage.classList.remove('pulse');
  }
});
document.documentElement.dataset.pageHidden = String(document.hidden);

window.motionLabState = () => ({
  loaded,
  mode: stage.dataset.mode,
  reduced: isReduced(),
  status: status.textContent,
  depthX: stage.style.getPropertyValue('--near-x'),
});

fetch('scene.svg')
  .then(response => {
    if (!response.ok) throw new Error(`scene.svg: HTTP ${response.status}`);
    return response.text();
  })
  .then(source => {
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    const svg = parsed.documentElement;
    if (svg.namespaceURI !== 'http://www.w3.org/2000/svg' || parsed.querySelector('parsererror')) {
      throw new Error('scene.svg is not valid SVG');
    }
    for (const selector of ['.far', '.mid', '.near', '#head', '#body', '#arm-right', '#mouth-smile', '#mouth-listen']) {
      if (!svg.querySelector(selector)) throw new Error(`scene.svg lacks ${selector}`);
    }
    if (svg.querySelector('script, foreignObject')) throw new Error('scene.svg contains unsupported active content');
    slot.replaceChildren(document.importNode(svg, true));
    loaded = true;
    buttons.forEach(button => { button.disabled = false; });
    status.textContent = description(stage.dataset.mode);
  })
  .catch(error => {
    console.error(error);
    status.textContent = 'Interactive rig unavailable. Static illustration shown; serve this folder over local HTTP.';
  });
