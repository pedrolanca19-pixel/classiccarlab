(() => {
'use strict';

/* ------------------------------------------------------------------ *
 * Esquema de controlos. Cada entrada vira um slider/seletor no painel
 * e (salvo u:false) um uniform `u_<k>` nos shaders.
 * ------------------------------------------------------------------ */
const R = (k, label, min, max, step, def, x) => ({ type: 'range', k, label, min, max, step, def, ...x });
const N = (k, label, min, max, def, x) => ({ type: 'int', k, label, min, max, step: 1, def, ...x });
const S = (k, label, options, def, x) => ({ type: 'select', k, label, options, def, ...x });
const B = (k, label, def, x) => ({ type: 'bool', k, label, def, ...x });
const C = (k, label, def, x) => ({ type: 'color', k, label, def, ...x });

const PALETTES = [
  { name: 'Espectro (arco-íris)' },
  { name: 'Pastel', stops: ['#ffc6ec', '#c3d2ff', '#bffbe6', '#fff0bd'] },
  { name: 'Aurora', stops: ['#18f0a8', '#2f7bff', '#b04bff', '#2ff0e0'] },
  { name: 'Pôr do sol', stops: ['#ff4d6d', '#ff9a3c', '#ffd86b', '#b84bff'] },
  { name: 'Gelo', stops: ['#e6fbff', '#7fd6ff', '#5b7bff', '#b9f3ff'] },
  { name: 'Brasa', stops: ['#ff3b1d', '#ff9d1a', '#ffe08a', '#c4144b'] },
  { name: 'Fio dourado', stops: ['#fff3c4', '#f2b24d', '#fffaf0', '#d98a2b'] },
  { name: 'Personalizada' },
];
const CUSTOM_PAL = PALETTES.length - 1;

const SCHEMA = [
  { id: 'flow', title: 'Fluxo', open: true, controls: [
    R('speed', 'Velocidade global', 0, 3, 0.01, 0.55, { u: false }),
    R('flowAngle', 'Direção do fluxo (°)', -180, 180, 1, 18, { u: false }),
    R('flow', 'Deriva da folha', 0, 2, 0.01, 0.22, { u: false }),
    R('evolve', 'Evolução (morphing)', 0, 2, 0.01, 0.35, { u: false }),
    R('foldSpeed', 'Viagem das pregas', -2, 2, 0.01, 0.45, { u: false }),
  ] },
  { id: 'sheet', title: 'Folha e pregas', open: true, controls: [
    R('foldFreq', 'Densidade das pregas', 0.3, 12, 0.01, 2.2),
    R('foldAngle', 'Ângulo das pregas (°)', -180, 180, 1, 38),
    R('foldSpread', 'Abertura entre camadas (°)', -90, 90, 1, 38),
    N('layers', 'Camadas de pregas', 1, 3, 3),
    R('layerFalloff', 'Peso das camadas', 0.2, 1, 0.01, 0.62),
    R('foldSharp', 'Vincos (suave → afiado)', 0, 1, 0.01, 0.35),
    R('foldNoise', 'Ondulação das pregas', 0, 2, 0.01, 0.55),
    R('foldNoiseScale', 'Escala da ondulação', 0.1, 4, 0.01, 0.8),
    R('warp', 'Distorção do domínio', 0, 2.5, 0.01, 0.65),
    R('warpScale', 'Escala da distorção', 0.1, 3, 0.01, 0.7),
    R('detail', 'Micro-relevo', 0, 0.8, 0.01, 0.06),
    R('detailScale', 'Escala do micro-relevo', 0.5, 10, 0.01, 3),
    N('octaves', 'Oitavas de detalhe', 1, 6, 4),
    R('coverage', 'Cobertura (1 = contínua)', 0, 1, 0.01, 1),
    R('edgeSoft', 'Suavidade das bordas', 0.01, 1, 0.01, 0.3),
  ] },
  { id: 'light', title: 'Luz e volume', open: false, controls: [
    R('intensity', 'Intensidade', 0, 4, 0.01, 1.5, { rmin: 1, rmax: 1.6 }),
    R('relief', 'Relevo (profundidade 3D)', 0, 1.5, 0.01, 0.9),
    R('lightAngle', 'Azimute da luz (°)', -180, 180, 1, 40),
    R('lightElev', 'Elevação da luz (°)', 5, 90, 1, 42),
    R('ambient', 'Luz ambiente', 0, 1, 0.01, 0.03, { rmin: 0, rmax: 0.12 }),
    R('diffuse', 'Difusa', 0, 2, 0.01, 1, { rmin: 0.6, rmax: 1.4 }),
    R('specular', 'Especular', 0, 4, 0.01, 1.1, { rmin: 0.4, rmax: 1.8 }),
    R('shine', 'Brilho especular', 2, 200, 1, 28),
    R('rim', 'Luz de contorno (fresnel)', 0, 3, 0.01, 0.75, { rmin: 0.2, rmax: 1.2 }),
    R('rimPower', 'Alcance do contorno', 0.5, 8, 0.01, 2.4),
    R('ridge', 'Cristas luminosas', 0, 3, 0.01, 0.7, { rmin: 0.2, rmax: 1.2 }),
    R('ridgePow', 'Foco das cristas', 0.5, 8, 0.01, 2.2),
    R('whiten', 'Núcleo branco', 0, 1, 0.01, 0.4, { rmin: 0, rmax: 0.4 }),
  ] },
  { id: 'spectrum', title: 'Espectro e refração', open: true, controls: [
    S('palette', 'Paleta', PALETTES.map(p => p.name), 0, { u: false }),
    C('c0', 'Cor 1', '#ffc6ec'),
    C('c1', 'Cor 2', '#c3d2ff'),
    C('c2', 'Cor 3', '#bffbe6'),
    C('c3', 'Cor 4', '#fff0bd'),
    R('hueOffset', 'Rotação de matiz', 0, 1, 0.005, 0.02),
    R('hueRange', 'Amplitude espectral', 0.05, 3, 0.01, 0.75),
    R('bands', 'Densidade das bandas', 0, 8, 0.01, 1.5),
    R('bandSharp', 'Bandas (suave → listradas)', 0, 1, 0.01, 0),
    B('bandMirror', 'Espelhar bandas (sem costura)', false),
    R('bandAngle', 'Ângulo do gradiente (°)', -180, 180, 1, 60),
    R('bandGradient', 'Gradiente de cor no espaço', -3, 3, 0.01, 0.35),
    R('tilt', 'Cor pela inclinação', -3, 3, 0.01, 0.3),
    R('tiltAngle', 'Direção da inclinação (°)', -180, 180, 1, 20),
    R('dispersion', 'Dispersão cromática', 0, 0.5, 0.001, 0.04, { rmin: 0, rmax: 0.15 }),
    R('saturation', 'Saturação', 0, 1.5, 0.01, 0.8, { rmin: 0.6, rmax: 1.2 }),
    R('hueDrift', 'Deriva de matiz', -1, 1, 0.01, 0.05, { u: false }),
  ] },
  { id: 'glow', title: 'Brilho e óptica', open: false, controls: [
    R('bloom', 'Brilho (bloom)', 0, 3, 0.01, 0.8, { rmin: 0.3, rmax: 1.2 }),
    R('bloomThreshold', 'Limiar do brilho', 0, 1, 0.01, 0.3),
    R('bloomRadius', 'Raio do brilho', 0.2, 4, 0.01, 1.2),
    R('bloomSpread', 'Difusão (perto → longe)', 0, 1, 0.01, 0.5),
    C('bloomTint', 'Tom do brilho', '#ffffff'),
    R('bloomTintAmt', 'Quantidade de tom', 0, 1, 0.01, 0),
    R('aberration', 'Aberração cromática', 0, 0.03, 0.0005, 0.004, { rmin: 0, rmax: 0.012 }),
  ] },
  { id: 'comp', title: 'Composição', open: false, controls: [
    R('zoom', 'Zoom', 0.2, 4, 0.01, 1, { rmin: 0.6, rmax: 2 }),
    R('panX', 'Posição X', -2, 2, 0.01, 0, { rmin: -0.4, rmax: 0.4 }),
    R('panY', 'Posição Y', -2, 2, 0.01, 0, { rmin: -0.3, rmax: 0.3 }),
    R('rotate', 'Rotação (°)', -180, 180, 1, 0),
    R('stretch', 'Esticar', 0.25, 4, 0.01, 1),
    R('persp', 'Perspetiva', -1, 1, 0.01, 0.15),
    S('mirror', 'Espelho', ['Nenhum', 'Horizontal', 'Vertical', 'Ambos'], 0),
    S('maskType', 'Máscara', ['Nenhuma', 'Faixa', 'Elipse', 'Arco', 'Anel'], 1),
    R('maskAngle', 'Ângulo da máscara (°)', -180, 180, 1, 18),
    R('maskX', 'Máscara X', -1.5, 1.5, 0.01, 0, { rmin: -0.3, rmax: 0.3 }),
    R('maskY', 'Máscara Y', -1, 1, 0.01, 0, { rmin: -0.2, rmax: 0.2 }),
    R('maskSize', 'Tamanho da máscara', 0.05, 2, 0.01, 0.5, { rmin: 0.3, rmax: 0.8 }),
    R('maskSoft', 'Suavidade da máscara', 0.01, 2, 0.01, 0.7, { rmin: 0.3, rmax: 1 }),
    R('maskWarp', 'Borda orgânica', 0, 1, 0.01, 0.35),
    B('maskInvert', 'Inverter máscara', false),
  ] },
  { id: 'finish', title: 'Fundo e acabamento', open: false, controls: [
    C('bg1', 'Fundo A', '#04050a'),
    C('bg2', 'Fundo B', '#0a1030'),
    R('bgAngle', 'Ângulo do fundo (°)', -180, 180, 1, 90),
    R('bgAmount', 'Quantidade de fundo', 0, 1, 0.01, 1),
    B('transparent', 'Fundo transparente (PNG/vídeo)', false),
    R('exposure', 'Exposição', 0.2, 3, 0.01, 1, { rmin: 0.7, rmax: 1.6 }),
    R('contrast', 'Contraste', 0.5, 2, 0.01, 1.05, { rmin: 0.9, rmax: 1.4 }),
    R('vignette', 'Vinheta', 0, 1, 0.01, 0.3),
    R('grain', 'Grão de filme', 0, 0.3, 0.005, 0.035),
  ] },
  { id: 'output', title: 'Saída', open: false, noRandom: true, controls: [
    S('aspect', 'Formato', ['Preencher janela', '16:9', '4:3', '1:1', '4:5', '9:16', '21:9'], 0, { u: false }),
    R('quality', 'Resolução de render', 0.25, 2, 0.05, 1, { u: false }),
    S('exportSize', 'Tamanho de exportação', ['Atual', '1920 px', '2560 px', '3840 px', '5120 px'], 0, { u: false }),
    N('seed', 'Semente', 0, 999, 7),
  ] },
];

const CONTROLS = {};
SCHEMA.forEach(sec => sec.controls.forEach(c => { CONTROLS[c.k] = c; }));
const DEFAULTS = Object.fromEntries(Object.values(CONTROLS).map(c => [c.k, c.def]));

const PRESETS = {
  'Folha prismática (base)': {},
  'Seda aurora': {
    palette: 2, bands: 0.9, hueRange: 1, dispersion: 0.03, foldFreq: 1.6, warp: 1.1, foldSharp: 0.1,
    bg1: '#02050a', bg2: '#06121f', maskType: 0, bloom: 0.8, whiten: 0.15, intensity: 1.3,
  },
  'Vidro iridescente': {
    palette: 0, hueRange: 1.4, bands: 2.4, bandSharp: 0.35, dispersion: 0.1, foldFreq: 2.8, foldSharp: 0.6,
    relief: 1, specular: 1.6, bloom: 0.6, aberration: 0.01, maskType: 2, maskSize: 1.2, maskSoft: 1,
    intensity: 1.2, whiten: 0.2,
  },
  'Fita de pôr do sol': {
    palette: 3, bands: 0.7, hueRange: 0.9, dispersion: 0.03, foldFreq: 1.3, foldAngle: 70, layers: 2,
    bg1: '#0a0408', bg2: '#240a1a', maskType: 1, maskAngle: -25, maskSize: 0.45, maskSoft: 0.5,
    intensity: 1, bloom: 0.6, whiten: 0.12, saturation: 1,
  },
  'Fio dourado': {
    palette: 6, bands: 0.5, hueRange: 0.6, dispersion: 0.01, saturation: 1, foldFreq: 3.4, foldSharp: 0.8,
    detail: 0.03, ridge: 1.4, ridgePow: 4, diffuse: 0.5, bg1: '#050403', bg2: '#120c05', maskType: 3,
    maskSize: 0.5, intensity: 1, bloom: 0.6, whiten: 0.2,
  },
  'Gelo cromático': {
    palette: 4, bands: 1.8, hueRange: 1.1, dispersion: 0.12, aberration: 0.012, foldFreq: 2, relief: 1,
    bg1: '#02060c', bg2: '#04162a', maskType: 4, maskSize: 0.9, maskSoft: 0.9, bloom: 0.7, intensity: 1.2,
  },
  'Neon listrado': {
    palette: 0, bandSharp: 0.9, bandMirror: true, bands: 3, hueRange: 1.2, dispersion: 0.05, foldFreq: 4,
    foldSharp: 0.9, detail: 0, relief: 1, intensity: 0.9, bloom: 0.9, bloomThreshold: 0.25, whiten: 0,
    exposure: 0.9, grain: 0.06, maskType: 0, bg1: '#02020a', bg2: '#10041e',
  },
  'Névoa suave': {
    palette: 1, bands: 0.6, hueRange: 0.7, dispersion: 0.02, foldFreq: 0.9, foldSharp: 0, warp: 1.4,
    detail: 0, relief: 0.4, ridge: 1.2, ridgePow: 1.2, intensity: 1.1, saturation: 1.2, bg1: '#0b0b14', bg2: '#15152a',
    maskType: 2, maskSize: 1.4, maskSoft: 1.6, bloom: 0.7, whiten: 0.05, speed: 0.3,
  },
};

/* ------------------------------------------------------------------ *
 * Estado
 * ------------------------------------------------------------------ */
const state = { ...DEFAULTS };
const store = {
  get() { try { return JSON.parse(localStorage.getItem('prism:v1') || 'null'); } catch (e) { return null; } },
  set(v) { try { localStorage.setItem('prism:v1', JSON.stringify(v)); } catch (e) { /* ignorar */ } },
};

const ui = {}; // k -> { set(v) }
const $ = id => document.getElementById(id);
const stage = $('stage');
const canvas = $('c');
const statusEl = $('status');
let statusTimer = 0;
function say(msg) {
  statusEl.textContent = msg;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusEl.textContent = ''; }, 3500);
}

function clampVal(c, v) {
  if (c.type === 'range' || c.type === 'int') {
    v = Number(v);
    if (!isFinite(v)) v = c.def;
    return Math.min(c.max, Math.max(c.min, c.type === 'int' ? Math.round(v) : v));
  }
  if (c.type === 'select') {
    v = Math.round(Number(v));
    return Math.min(c.options.length - 1, Math.max(0, isFinite(v) ? v : c.def));
  }
  if (c.type === 'bool') return !!v;
  if (c.type === 'color') return /^#[0-9a-f]{6}$/i.test(v) ? String(v).toLowerCase() : c.def;
  return v;
}

let saveTimer = 0;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => store.set(state), 300);
}

function setValue(k, v, opts = {}) {
  const c = CONTROLS[k];
  if (!c) return;
  v = clampVal(c, v);
  state[k] = v;
  if (ui[k] && !opts.skipUI) ui[k].set(v);

  if (k === 'palette' && PALETTES[v].stops) {
    PALETTES[v].stops.forEach((hex, i) => setValue('c' + i, hex, { keepPalette: true }));
  }
  if (/^c[0-3]$/.test(k) && !opts.keepPalette && state.palette !== CUSTOM_PAL) {
    state.palette = CUSTOM_PAL;
    ui.palette.set(CUSTOM_PAL);
  }
  if (k === 'aspect' || k === 'quality') resize();
  if (k === 'transparent') stage.classList.toggle('checker', !!v);
  if (!opts.silent) scheduleSave();
}

function applyAll(obj, base = state) {
  // a paleta entra por último: as paletas predefinidas sobrepõem as cores 1-4,
  // e 'Personalizada' mantém as que já foram aplicadas
  const keys = Object.keys(obj).filter(k => k in CONTROLS).sort((a, b) => (a === 'palette') - (b === 'palette'));
  keys.forEach(k => setValue(k, obj[k], { silent: true, keepPalette: true }));
  scheduleSave();
}

/* ------------------------------------------------------------------ *
 * Construção do painel
 * ------------------------------------------------------------------ */
function decimals(step) {
  const s = String(step);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

function buildUI() {
  const host = $('sections');
  SCHEMA.forEach(sec => {
    const det = document.createElement('details');
    if (sec.open) det.open = true;
    const sum = document.createElement('summary');
    sum.innerHTML = `<span class="title">${sec.title}</span>`;
    if (!sec.noRandom) {
      const sh = document.createElement('button');
      sh.type = 'button';
      sh.className = 'shuffle';
      sh.textContent = 'Aleatório';
      sh.title = 'Aleatorizar só esta secção';
      sh.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); randomize(sec.id); });
      sum.appendChild(sh);
    }
    det.appendChild(sum);
    const box = document.createElement('div');
    box.className = 'controls';
    sec.controls.forEach(c => box.appendChild(buildControl(c)));
    det.appendChild(box);
    host.appendChild(det);
  });
}

function buildControl(c) {
  const wrap = document.createElement('div');
  wrap.className = 'ctl' + (c.type === 'range' || c.type === 'int' ? '' : ' inline');
  const row = document.createElement('div');
  row.className = 'row';
  const name = document.createElement('label');
  name.className = 'name';
  name.textContent = c.label;
  name.title = 'Duplo clique para repor';
  name.addEventListener('dblclick', () => setValue(c.k, c.def));
  row.appendChild(name);
  wrap.appendChild(row);

  if (c.type === 'range' || c.type === 'int') {
    const num = document.createElement('input');
    num.type = 'number';
    num.min = c.min; num.max = c.max; num.step = c.step;
    const rng = document.createElement('input');
    rng.type = 'range';
    rng.min = c.min; rng.max = c.max; rng.step = c.step;
    rng.setAttribute('aria-label', c.label);
    const dp = decimals(c.step);
    row.appendChild(num);
    wrap.appendChild(rng);
    rng.addEventListener('input', () => {
      setValue(c.k, rng.value, { skipUI: true });
      num.value = Number(state[c.k]).toFixed(dp);
    });
    num.addEventListener('change', () => setValue(c.k, num.value));
    ui[c.k] = { set(v) { rng.value = v; num.value = Number(v).toFixed(dp); } };
  } else if (c.type === 'select') {
    const sel = document.createElement('select');
    c.options.forEach((o, i) => sel.add(new Option(o, i)));
    sel.addEventListener('change', () => setValue(c.k, sel.value));
    row.appendChild(sel);
    ui[c.k] = { set(v) { sel.value = v; } };
  } else if (c.type === 'bool') {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.addEventListener('change', () => setValue(c.k, cb.checked));
    row.appendChild(cb);
    ui[c.k] = { set(v) { cb.checked = !!v; } };
  } else if (c.type === 'color') {
    const col = document.createElement('input');
    col.type = 'color';
    col.addEventListener('input', () => setValue(c.k, col.value, { skipUI: true }));
    row.appendChild(col);
    ui[c.k] = { set(v) { col.value = v; } };
  }
  return wrap;
}

/* ------------------------------------------------------------------ *
 * Aleatório
 * ------------------------------------------------------------------ */
const rnd = (a, b) => a + Math.random() * (b - a);
function hslHex(h, s, l) {
  h = ((h % 1) + 1) % 1;
  const f = n => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function randomPalette() {
  if (Math.random() < 0.35) {
    const h = Math.random(), spread = rnd(0.08, 0.3);
    const stops = [0, 1, 2, 3].map(i => hslHex(h + (i - 1.5) * spread, rnd(0.55, 1), rnd(0.55, 0.8)));
    setValue('palette', CUSTOM_PAL, { silent: true });
    stops.forEach((hex, i) => setValue('c' + i, hex, { keepPalette: true, silent: true }));
  } else {
    setValue('palette', Math.floor(Math.random() * (PALETTES.length - 1)), { silent: true });
  }
  const h = Math.random();
  setValue('bg1', hslHex(h, rnd(0.2, 0.7), rnd(0.012, 0.035)), { silent: true });
  setValue('bg2', hslHex(h + rnd(-0.1, 0.1), rnd(0.3, 0.8), rnd(0.04, 0.12)), { silent: true });
}

function randomize(scope) {
  SCHEMA.forEach(sec => {
    if (sec.noRandom || (scope !== 'all' && scope !== sec.id)) return;
    sec.controls.forEach(c => {
      if (c.k === 'palette' || /^c[0-3]$/.test(c.k) || c.k === 'bg1' || c.k === 'bg2' || c.k === 'bloomTint') return;
      if (c.k === 'transparent' || c.k === 'speed') return;
      if (c.type === 'range') {
        const span = c.max - c.min;
        const lo = c.rmin ?? Math.max(c.min, c.def - span * 0.25);
        const hi = c.rmax ?? Math.min(c.max, c.def + span * 0.25);
        setValue(c.k, rnd(lo, hi), { silent: true });
      } else if (c.type === 'int') {
        setValue(c.k, Math.round(rnd(c.min, c.max)), { silent: true });
      } else if (c.type === 'select') {
        let v = Math.floor(Math.random() * c.options.length);
        if (c.k === 'mirror' && Math.random() < 0.75) v = 0;        // espelho só de vez em quando
        if (c.k === 'maskType') v = [0, 1, 1, 2, 3, 4][Math.floor(Math.random() * 6)];
        setValue(c.k, v, { silent: true });
      } else if (c.type === 'bool') {
        setValue(c.k, Math.random() < 0.25, { silent: true });
      }
    });
    if (sec.id === 'spectrum') randomPalette();
  });
  if (scope === 'all' || scope === 'sheet') setValue('seed', Math.floor(rnd(0, 999)), { silent: true });
  scheduleSave();
}

/* ------------------------------------------------------------------ *
 * Shaders
 * ------------------------------------------------------------------ */
function uniformDecls() {
  return Object.values(CONTROLS).filter(c => c.u !== false).map(c => {
    const t = c.type === 'range' ? 'float' : c.type === 'color' ? 'vec3' : 'int';
    return `uniform ${t} u_${c.k};`;
  }).join('\n');
}

const HEAD = `#version 300 es
precision highp float;
precision highp int;
out vec4 outColor;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_flowOff;
uniform float u_zT;
uniform float u_foldT;
uniform float u_hueT;
uniform int u_palMode;
${uniformDecls()}
const float TAU = 6.28318530718;
`;

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const SCENE_FS = HEAD + `
vec3 hash33(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float gnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(dot(hash33(i + vec3(0, 0, 0)), f - vec3(0, 0, 0)), dot(hash33(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), u.x),
        mix(dot(hash33(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)), dot(hash33(i + vec3(1, 1, 0)), f - vec3(1, 1, 0)), u.x), u.y),
    mix(mix(dot(hash33(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)), dot(hash33(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), u.x),
        mix(dot(hash33(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)), dot(hash33(i + vec3(1, 1, 1)), f - vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

float fbm(vec3 p, int oct) {
  float a = 0.5, s = 0.0, n = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * gnoise(p);
    n += a;
    p = p * 2.03 + vec3(1.7, 9.2, 0.6);
    a *= 0.5;
  }
  return 1.3 * s / n;
}

// Campo de altura da folha: pregas senoidais em varias direcoes, deformadas por ruido.
float heightAt(vec2 p) {
  vec2 q = p - u_flowOff;
  float z = u_zT;
  vec2 w = vec2(fbm(vec3(q * u_warpScale, z), 3), fbm(vec3(q * u_warpScale + 17.3, z + 3.1), 3));
  q += w * u_warp;
  float h = 0.0, amp = 1.0, tot = 0.0;
  for (int i = 0; i < 3; i++) {
    if (i >= u_layers) break;
    float fi = float(i);
    float ang = radians(u_foldAngle + fi * u_foldSpread);
    vec2 d = vec2(cos(ang), sin(ang));
    float f = u_foldFreq * (1.0 + 0.41 * fi);
    float wob = gnoise(vec3(q * u_foldNoiseScale + fi * 5.7, z * 0.7 + fi * 2.3)) * u_foldNoise * TAU * 0.5;
    float ph = dot(q, d) * f + u_foldT * (1.0 + 0.35 * fi) + wob;
    float s = sin(ph);
    float crease = 1.0 - 2.0 * abs(s);
    h += amp * mix(s, crease, u_foldSharp);
    tot += amp;
    amp *= u_layerFalloff;
  }
  h /= tot;
  h += fbm(vec3(q * u_detailScale, z * 1.5 + 40.0), u_octaves) * u_detail;
  return h;
}

vec3 hueWheel(float h) {
  vec3 c = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c * c * (3.0 - 2.0 * c);
}

vec3 stopAt(int i) {
  if (i == 0) return u_c0;
  if (i == 1) return u_c1;
  if (i == 2) return u_c2;
  return u_c3;
}

vec3 stopsGradient(float x) {
  float u;
  float s;
  int n;
  if (u_bandMirror == 1) {
    u = clamp(x, 0.0, 1.0);
    s = u * 3.0;
    n = 3;
  } else {
    u = fract(x);
    s = u * 4.0;
    n = 4;
  }
  int i = int(floor(s));
  float f = smoothstep(0.0, 1.0, fract(s));
  return mix(stopAt(i % 4), stopAt((i + 1) % n), f);
}

float tri(float x) { return 1.0 - abs(1.0 - 2.0 * fract(x * 0.5)); }

vec3 palette(float ph) {
  float t = u_bandMirror == 1 ? tri(ph) : ph;
  float x = t * u_hueRange + u_hueOffset;
  return u_palMode == 0 ? hueWheel(x) : stopsGradient(x);
}

float maskAt(vec2 uv) {
  if (u_maskType == 0) return 1.0;
  vec2 c = uv - vec2(u_maskX, u_maskY);
  float a = radians(u_maskAngle);
  c = mat2(cos(a), -sin(a), sin(a), cos(a)) * c;
  c += vec2(gnoise(vec3(c * 1.7, u_zT * 0.5)), gnoise(vec3(c * 1.7 + 9.0, u_zT * 0.5))) * u_maskWarp * 0.35;
  float d;
  if (u_maskType == 1) d = abs(c.y) - u_maskSize * 0.5;
  else if (u_maskType == 2) d = length(c * vec2(1.0, 1.5)) - u_maskSize * 0.5;
  else if (u_maskType == 3) d = abs(length(c + vec2(0.0, 1.5)) - 1.5) - u_maskSize * 0.5;
  else d = abs(length(c) - u_maskSize * 0.8) - u_maskSize * 0.25;
  float s = u_maskSoft * 0.5;
  float m = 1.0 - smoothstep(-s, s, d);
  return u_maskInvert == 1 ? 1.0 - m : m;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // transformacao de composicao: espelho, posicao, rotacao, perspetiva, zoom, esticar
  vec2 p = uv;
  if (u_mirror == 1 || u_mirror == 3) p.x = abs(p.x);
  if (u_mirror == 2 || u_mirror == 3) p.y = abs(p.y);
  p -= vec2(u_panX, u_panY);
  float rr = radians(u_rotate);
  p = mat2(cos(rr), -sin(rr), sin(rr), cos(rr)) * p;
  p /= max(0.2, 1.0 + u_persp * p.y);
  p /= u_zoom;
  p.x /= u_stretch;
  float sd = float(u_seed);
  p += vec2(fract(sd * 0.6180339) * 40.0, fract(sd * 0.7548776) * 40.0);

  // altura e normal por diferencas finitas
  float e = 2.0 / (u_res.y * u_zoom);
  float h0 = heightAt(p);
  float hx = heightAt(p + vec2(e, 0.0));
  float hy = heightAt(p + vec2(0.0, e));
  vec2 g = vec2(hx - h0, hy - h0) / e;
  vec3 n = normalize(vec3(-g * u_relief * 0.3, 1.0));
  float hn = clamp(h0 * 0.5 + 0.5, 0.0, 1.0);

  // iluminacao da folha
  float la = radians(u_lightAngle), le = radians(u_lightElev);
  vec3 L = normalize(vec3(cos(la) * cos(le), sin(la) * cos(le), sin(le)));
  float diff = pow(max(dot(n, L), 0.0), 2.5);
  float spec = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), u_shine);
  float fres = pow(1.0 - n.z, u_rimPower);
  float ridge = pow(hn, u_ridgePow);
  float I = u_ambient + u_diffuse * diff + u_specular * spec + u_rim * fres * 6.0 + u_ridge * ridge;

  // cor espectral: fase = altura + inclinacao + gradiente espacial; dispersao separa R/G/B
  float ta = radians(u_tiltAngle), ba = radians(u_bandAngle);
  float ph = u_hueT + h0 * u_bands
           + dot(n.xy, vec2(cos(ta), sin(ta))) * u_tilt * 4.0
           + dot(uv, vec2(cos(ba), sin(ba))) * u_bandGradient;
  ph = mix(ph, floor(ph) + smoothstep(0.35, 0.65, fract(ph)), u_bandSharp);
  vec3 col = vec3(palette(ph + u_dispersion).r, palette(ph).g, palette(ph - u_dispersion).b);
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = max(mix(vec3(luma), col, u_saturation), 0.0);

  // cobertura da folha e mascara de composicao
  float cov = (1.0 - u_coverage) * 0.95;
  float es = max(u_edgeSoft * 0.5, 0.001);
  float a = mix(smoothstep(cov - es, cov + es, hn), 1.0, step(0.999, u_coverage));
  float m = maskAt(uv) * a;

  vec3 light = col * I * u_intensity * m;
  light += vec3(smoothstep(0.7, 1.8, I * u_intensity)) * u_whiten * m;

  // tonemap suave + contraste
  light = 1.0 - exp(-light * u_exposure);
  light = pow(light, vec3(u_contrast));

  // fundo e composicao em "screen"
  float bt = dot(uv, vec2(cos(radians(u_bgAngle)), sin(radians(u_bgAngle)))) + 0.5;
  vec3 bg = mix(u_bg1, u_bg2, smoothstep(0.0, 1.0, bt)) * u_bgAmount;
  if (u_transparent == 1) bg = vec3(0.0);
  vec3 outc = bg + light - bg * light;
  outColor = vec4(clamp(outc, 0.0, 1.0), 1.0);
}`;

const BLUR_FS = HEAD + `
uniform sampler2D u_src;
uniform vec2 u_dir;     // passo em texels do destino, já multiplicado pelo raio
uniform int u_first;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec3 c = texture(u_src, uv).rgb * 0.2270270270;
  c += texture(u_src, uv + u_dir * 1.3846153846).rgb * 0.3162162162;
  c += texture(u_src, uv - u_dir * 1.3846153846).rgb * 0.3162162162;
  c += texture(u_src, uv + u_dir * 3.2307692308).rgb * 0.0702702703;
  c += texture(u_src, uv - u_dir * 3.2307692308).rgb * 0.0702702703;
  if (u_first == 1) {
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    c *= smoothstep(u_bloomThreshold, u_bloomThreshold + 0.25, l);
  }
  outColor = vec4(c, 1.0);
}`;

const COMP_FS = HEAD + `
uniform sampler2D u_scene;
uniform sampler2D u_b0;
uniform sampler2D u_b1;
uniform sampler2D u_b2;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 off = (uv - 0.5) * u_aberration;
  vec3 s = vec3(texture(u_scene, uv + off).r, texture(u_scene, uv).g, texture(u_scene, uv - off).b);

  vec3 b = texture(u_b0, uv).rgb * mix(0.55, 0.2, u_bloomSpread)
         + texture(u_b1, uv).rgb * mix(0.3, 0.4, u_bloomSpread)
         + texture(u_b2, uv).rgb * mix(0.12, 0.5, u_bloomSpread);
  b *= mix(vec3(1.0), u_bloomTint, u_bloomTintAmt);
  b = clamp(b * u_bloom, 0.0, 1.0);
  vec3 c = s + b - s * b;

  vec2 q = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  c *= 1.0 - u_vignette * smoothstep(0.35, 1.05, length(q));

  float n = fract(sin(dot(gl_FragCoord.xy + fract(u_time) * 91.7, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  float alpha = 1.0;
  if (u_transparent == 1) {
    c *= 1.0 + n * u_grain * 2.0;
    c = clamp(c, 0.0, 1.0);
    alpha = max(c.r, max(c.g, c.b));
  } else {
    c = clamp(c + n * u_grain, 0.0, 1.0);
  }
  outColor = vec4(c, alpha);
}`;

/* ------------------------------------------------------------------ *
 * WebGL
 * ------------------------------------------------------------------ */
const gl = canvas.getContext('webgl2', {
  antialias: false, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true,
});

if (!gl) {
  $('nogl').hidden = false;
  canvas.hidden = true;
  return;
}

function compile(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    console.error(log);
    throw new Error('Erro de shader: ' + log);
  }
  return sh;
}

function makeProgram(fs) {
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const cache = new Map();
  return {
    prog,
    loc(name) {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(prog, name));
      return cache.get(name);
    },
  };
}

const hexRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

const anim = { time: 0, flow: [0, 0], z: 0, fold: 0, hue: 0, raw: 0 };

function setSharedUniforms(P, w, h) {
  gl.useProgram(P.prog);
  gl.uniform2f(P.loc('u_res'), w, h);
  gl.uniform1f(P.loc('u_time'), anim.raw);
  gl.uniform2f(P.loc('u_flowOff'), anim.flow[0], anim.flow[1]);
  gl.uniform1f(P.loc('u_zT'), anim.z);
  gl.uniform1f(P.loc('u_foldT'), anim.fold);
  gl.uniform1f(P.loc('u_hueT'), anim.hue);
  gl.uniform1i(P.loc('u_palMode'), state.palette === 0 ? 0 : 1);
  for (const c of Object.values(CONTROLS)) {
    if (c.u === false) continue;
    const l = P.loc('u_' + c.k);
    if (l === null) continue;
    const v = state[c.k];
    if (c.type === 'range') gl.uniform1f(l, v);
    else if (c.type === 'color') gl.uniform3fv(l, hexRGB(v));
    else gl.uniform1i(l, v === true ? 1 : v === false ? 0 : v);
  }
}

const scene = makeProgram(SCENE_FS);
const blur = makeProgram(BLUR_FS);
const comp = makeProgram(COMP_FS);
gl.bindVertexArray(gl.createVertexArray());

function makeTarget(w, h) {
  w = Math.max(2, w | 0); h = Math.max(2, h | 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fb, w, h };
}

function freeTarget(t) {
  if (!t) return;
  gl.deleteTexture(t.tex);
  gl.deleteFramebuffer(t.fb);
}

let targets = null;
function allocTargets(w, h) {
  if (targets) {
    freeTarget(targets.scene);
    targets.levels.forEach(l => { freeTarget(l.a); freeTarget(l.b); });
  }
  targets = {
    w, h,
    scene: makeTarget(w, h),
    levels: [4, 8, 16].map(d => ({ a: makeTarget(w / d, h / d), b: makeTarget(w / d, h / d) })),
  };
}

function bindTex(unit, tex) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
}

function drawTo(fb, w, h) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.viewport(0, 0, w, h);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function render() {
  const w = canvas.width, h = canvas.height;
  if (!targets || targets.w !== w || targets.h !== h) allocTargets(w, h);

  // 1) folha
  setSharedUniforms(scene, w, h);
  drawTo(targets.scene.fb, w, h);

  // 2) bloom: três níveis de desfoque separável
  let src = targets.scene;
  targets.levels.forEach((lv, i) => {
    const { a, b } = lv;
    setSharedUniforms(blur, a.w, a.h);
    gl.uniform1i(blur.loc('u_src'), 0);
    gl.uniform1i(blur.loc('u_first'), i === 0 ? 1 : 0);
    bindTex(0, src.tex);
    gl.uniform2f(blur.loc('u_dir'), state.bloomRadius / a.w, 0);
    drawTo(a.fb, a.w, a.h);
    gl.uniform1i(blur.loc('u_first'), 0);
    bindTex(0, a.tex);
    gl.uniform2f(blur.loc('u_dir'), 0, state.bloomRadius / a.h);
    drawTo(b.fb, b.w, b.h);
    src = b;
  });

  // 3) composição final
  setSharedUniforms(comp, w, h);
  ['u_scene', 'u_b0', 'u_b1', 'u_b2'].forEach((n, i) => gl.uniform1i(comp.loc(n), i));
  bindTex(0, targets.scene.tex);
  targets.levels.forEach((lv, i) => bindTex(i + 1, lv.b.tex));
  gl.clearColor(0, 0, 0, 0);
  drawTo(null, w, h);
}

/* ------------------------------------------------------------------ *
 * Tamanho do canvas
 * ------------------------------------------------------------------ */
const ASPECTS = [0, 16 / 9, 4 / 3, 1, 4 / 5, 9 / 16, 21 / 9];
let exporting = false;

function availableRect() {
  const W = window.innerWidth, H = window.innerHeight;
  if (!document.body.classList.contains('panel-open')) return { w: W, h: H };
  const p = $('panel').getBoundingClientRect();
  if (window.innerWidth <= 720) return { w: W, h: Math.max(120, H - p.height) };
  return { w: Math.max(120, W - p.width), h: H };
}

function resize() {
  if (exporting) return;
  const ar = ASPECTS[state.aspect];
  let cw, ch;
  if (!ar) {
    cw = window.innerWidth; ch = window.innerHeight;
  } else {
    const a = availableRect();
    const m = 0.94;
    cw = a.w * m; ch = cw / ar;
    if (ch > a.h * m) { ch = a.h * m; cw = ch * ar; }
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2) * state.quality;
  const maxDim = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));
  let pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
  const k = Math.min(1, maxDim / Math.max(pw, ph));
  pw = Math.max(2, Math.round(pw * k)); ph = Math.max(2, Math.round(ph * k));
  canvas.style.width = cw + 'px';
  canvas.style.height = ch + 'px';
  if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
}

/* ------------------------------------------------------------------ *
 * Animação
 * ------------------------------------------------------------------ */
let paused = false;
let last = performance.now();

function advance(dt) {
  const s = dt * state.speed;
  const a = state.flowAngle * Math.PI / 180;
  anim.flow[0] += Math.cos(a) * s * state.flow;
  anim.flow[1] += Math.sin(a) * s * state.flow;
  anim.z += s * state.evolve;
  anim.fold += s * state.foldSpeed;
  anim.hue += s * state.hueDrift;
  anim.raw += dt;
}

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!paused) advance(dt);
  render();
  requestAnimationFrame(frame);
}

function setPaused(p) {
  paused = p;
  $('btnPause').textContent = p ? 'Retomar' : 'Pausa';
}

/* ------------------------------------------------------------------ *
 * Exportação
 * ------------------------------------------------------------------ */
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function exportPng() {
  const longEdge = [0, 1920, 2560, 3840, 5120][state.exportSize];
  const prev = { w: canvas.width, h: canvas.height };
  exporting = true;
  try {
    if (longEdge) {
      const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const k = Math.min(longEdge, max) / Math.max(prev.w, prev.h);
      canvas.width = Math.round(prev.w * k);
      canvas.height = Math.round(prev.h * k);
    }
    render();
    canvas.toBlob(blob => {
      if (blob) download(blob, `prism-${canvas.width}x${canvas.height}.png`);
      say(blob ? `PNG exportado (${canvas.width}×${canvas.height})` : 'Falha ao exportar');
      exporting = false;
      resize();
    }, 'image/png');
  } catch (err) {
    exporting = false;
    resize();
    say('Falha ao exportar: ' + err.message);
  }
}

let recorder = null;
function toggleRecord() {
  const btn = $('btnRec');
  if (recorder) { recorder.stop(); return; }
  if (!window.MediaRecorder || !canvas.captureStream) { say('Este navegador não grava vídeo do canvas.'); return; }
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  const mimeType = types.find(t => MediaRecorder.isTypeSupported(t));
  const chunks = [];
  recorder = new MediaRecorder(canvas.captureStream(60), { mimeType, videoBitsPerSecond: 14e6 });
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  recorder.onstop = () => {
    const type = recorder.mimeType || 'video/webm';
    download(new Blob(chunks, { type }), 'prism.' + (type.includes('mp4') ? 'mp4' : 'webm'));
    recorder = null;
    btn.classList.remove('on');
    btn.textContent = 'Gravar vídeo';
    say('Vídeo guardado');
  };
  recorder.start();
  btn.classList.add('on');
  btn.textContent = 'Parar gravação';
}

async function copySettings() {
  const json = JSON.stringify(state);
  try { await navigator.clipboard.writeText(json); say('Definições copiadas'); }
  catch (e) { window.prompt('Copia as definições:', json); }
}

async function pasteSettings() {
  let text = '';
  try { text = await navigator.clipboard.readText(); } catch (e) { /* cai para prompt */ }
  if (!text) text = window.prompt('Cola aqui as definições (JSON):') || '';
  if (!text) return;
  try {
    const obj = JSON.parse(text);
    applyAll({ ...DEFAULTS, ...obj });
    say('Definições aplicadas');
  } catch (e) { say('JSON inválido'); }
}

/* ------------------------------------------------------------------ *
 * Arranque
 * ------------------------------------------------------------------ */
buildUI();

const presetSel = $('presetSel');
presetSel.add(new Option('— escolher —', ''));
Object.keys(PRESETS).forEach(n => presetSel.add(new Option(n, n)));
presetSel.addEventListener('change', () => {
  if (!presetSel.value) return;
  applyAll({ ...DEFAULTS, ...PRESETS[presetSel.value], aspect: state.aspect, quality: state.quality, exportSize: state.exportSize });
  say('Preset: ' + presetSel.value);
});

$('btnRandom').addEventListener('click', () => { randomize('all'); presetSel.value = ''; });
$('btnRandPal').addEventListener('click', () => randomPalette());
$('btnReset').addEventListener('click', () => { applyAll(DEFAULTS); presetSel.value = ''; say('Valores repostos'); });
$('btnPause').addEventListener('click', () => setPaused(!paused));
$('btnPng').addEventListener('click', exportPng);
$('btnRec').addEventListener('click', toggleRecord);
$('btnCopy').addEventListener('click', copySettings);
$('btnPaste').addEventListener('click', pasteSettings);
$('btnFs').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else (document.documentElement.requestFullscreen || (() => {})).call(document.documentElement);
});

function setPanel(open) {
  document.body.classList.toggle('panel-open', open);
  setTimeout(resize, 280);
}
$('btnHide').addEventListener('click', () => setPanel(false));
$('reveal').addEventListener('click', () => setPanel(true));

window.addEventListener('keydown', e => {
  if (e.target.matches('input[type=number], select')) return;
  if (e.code === 'Space') { e.preventDefault(); setPaused(!paused); }
  else if (e.key === 'h' || e.key === 'H') setPanel(!document.body.classList.contains('panel-open'));
  else if (e.key === 'r' || e.key === 'R') randomize('all');
  else if (e.key === 'f' || e.key === 'F') $('btnFs').click();
});

window.addEventListener('resize', resize);

const saved = store.get();
// em ecrãs pequenos de alta densidade, o render completo é pesado: começa com menos pixels
const mobileStart = !saved && window.innerWidth <= 720 ? { quality: 0.7 } : {};
applyAll({ ...DEFAULTS, ...(saved || {}), ...mobileStart });
resize();
requestAnimationFrame(t => { last = t; frame(t); });

// gancho para testes automáticos
window.__prism = { state, setValue, applyAll, PRESETS, randomize, render, setPaused, advance };
})();
