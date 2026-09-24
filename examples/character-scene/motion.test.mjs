import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const code = await readFile(new URL('./motion.js', import.meta.url), 'utf8');
const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.match(html, /<img class="scene-still" src="scene\.svg"/);
const stateButtons = [...html.matchAll(/<button\b[^>]*data-set-mode="[^"]+"[^>]*>/g)];
assert.equal(stateButtons.length, 5);
assert.ok(stateButtons.every(([tag]) => /\bdisabled\b/.test(tag)), 'controls should stay disabled without JavaScript');

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = new Map();
    this.attributes = new Map();
    this.styles = new Map();
    this.style = {
      setProperty: (name, value) => this.styles.set(name, value),
      getPropertyValue: name => this.styles.get(name) ?? '',
    };
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      contains: name => this.classes.has(name),
    };
    this.textContent = '';
    this.checked = false;
    this.disabled = false;
  }
  addEventListener(name, callback) { this.listeners.set(name, callback); }
  dispatch(name, event = {}) { this.listeners.get(name)?.(event); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 720, height: 480 }; }
  replaceChildren(child) { this.child = child; }
  get offsetWidth() { return 720; }
}

async function setup(fetchSucceeds) {
  const stage = new Element({ mode: 'idle' });
  const slot = new Element();
  slot.child = 'still';
  const buttons = ['idle', 'look', 'listen', 'confirm', 'rest'].map(mode => new Element({ setMode: mode }));
  const reduce = new Element();
  const status = new Element();
  const documentElement = new Element();
  const media = { matches: false, addEventListener(name, callback) { this.onChange = callback; } };
  const frames = new Map();
  let nextFrame = 1;
  let errors = 0;
  const document = {
    hidden: false,
    documentElement,
    listeners: new Map(),
    querySelector(selector) {
      return ({ '.stage': stage, '#scene-slot': slot, '#reduce': reduce, '#status': status })[selector];
    },
    querySelectorAll: () => buttons,
    addEventListener(name, callback) { this.listeners.set(name, callback); },
    dispatch(name) { this.listeners.get(name)?.(); },
    importNode: svg => svg,
  };
  const fakeSvg = {
    namespaceURI: 'http://www.w3.org/2000/svg',
    querySelector: selector => selector === 'script, foreignObject' ? null : {},
  };
  class DOMParser {
    parseFromString() {
      return { documentElement: fakeSvg, querySelector: () => null };
    }
  }
  const window = { matchMedia: () => media };
  vm.runInNewContext(code, {
    document, window, DOMParser,
    fetch: () => fetchSucceeds
      ? Promise.resolve({ ok: true, text: () => Promise.resolve('<svg/>') })
      : Promise.reject(new Error('offline')),
    requestAnimationFrame: callback => { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    console: { error: () => { errors += 1; } },
  }, { filename: 'motion.js' });
  await new Promise(resolve => setImmediate(resolve));
  return { stage, slot, buttons, reduce, status, document, media, frames, window, get errors() { return errors; } };
}

const ready = await setup(true);
assert.equal(ready.window.motionLabState().loaded, true);
assert.notEqual(ready.slot.child, 'still', 'loaded SVG should replace the still');
assert.ok(ready.buttons.every(button => !button.disabled));
for (const button of ready.buttons) {
  button.dispatch('click');
  assert.equal(ready.stage.dataset.mode, button.dataset.setMode);
  assert.equal(ready.buttons.filter(candidate => candidate.attributes.get('aria-pressed') === 'true').length, 1);
}

ready.buttons[1].dispatch('click');
assert.equal(ready.stage.dataset.mode, 'look');
assert.equal(ready.buttons[1].attributes.get('aria-pressed'), 'true');
ready.stage.dispatch('pointermove', { pointerType: 'mouse', clientX: 720, clientY: 240 });
assert.equal(ready.frames.size, 1);
ready.frames.values().next().value();
assert.equal(ready.stage.style.getPropertyValue('--near-x'), '-15.0px');
ready.frames.clear();
ready.stage.dispatch('pointermove', { pointerType: 'mouse', clientX: 0, clientY: 240 });
assert.equal(ready.frames.size, 1);
ready.buttons[4].dispatch('click');
assert.equal(ready.frames.size, 0, 'state change should cancel pending depth work');
assert.equal(ready.stage.style.getPropertyValue('--near-x'), '0.0px');

ready.buttons[3].dispatch('click');
assert.equal(ready.stage.classList.contains('pulse'), true);
ready.reduce.checked = true;
ready.reduce.dispatch('change');
assert.equal(ready.window.motionLabState().reduced, true);
assert.equal(ready.stage.classList.contains('pulse'), false);
assert.match(ready.status.textContent, /Static settled smile/);
ready.buttons[3].dispatch('click');
assert.equal(ready.stage.classList.contains('pulse'), false, 'Reduce Motion should suppress the wave');

ready.media.matches = true;
ready.media.onChange();
assert.equal(ready.reduce.disabled, true);
ready.media.matches = false;
ready.media.onChange();
assert.equal(ready.reduce.disabled, false);
assert.equal(ready.reduce.checked, true, 'manual Reduce Motion choice should survive a system change');

ready.document.hidden = true;
ready.document.dispatch('visibilitychange');
assert.equal(ready.document.documentElement.dataset.pageHidden, 'true');

const failed = await setup(false);
assert.equal(failed.window.motionLabState().loaded, false);
assert.equal(failed.slot.child, 'still');
assert.ok(failed.buttons.every(button => button.disabled));
assert.match(failed.status.textContent, /Static illustration shown/);
assert.equal(failed.errors, 1);

console.log('PASS character scene: loaded states, interruption, Reduce Motion, hidden page, static failure fallback');
