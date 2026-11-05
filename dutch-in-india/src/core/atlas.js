// Paper Atlas 16:9 extensions for "Traders, Not Rulers": real maps, era bar, chapter card, trade loop, flags,
// the recurring cast, and props. Same look as kit.js: every shape is cut paper (light edge + soft shadow).
// Deterministic: everything is a function of the arguments (time t, progress p) and seeded rnd().
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './lib.js';
import { P, cut, P_rr, P_poly, P_circ, parchment, dashedRoute, slip, ribbon, label } from './kit.js';

export const SERIF = 'Caladea';
// palette additions: only the fixed flag colours the brief asks for
export const F = { orange: '#D9822B', white: '#F4ECD8', blue: '#2F4E7A', navy: '#2F3550', bengal: '#2E5A3C', smoke: '#8F8578', red: P.crimson };
export const SAFE = { x0: 96, x1: 1824, y0: 54, y1: 1026, capTop: 860, capBot: 1010 };

// ═════════════════════════ NIGHT ═════════════════════════
/** the navy wash over whatever was drawn: night 0 = day, 0.5 = dusk, 1 = night */
export function nightWash(night) {
  if (night <= 0) return;
  ctx.save(); ctx.globalAlpha = 0.78 * clamp(night); ctx.fillStyle = F.navy; ctx.fillRect(-300, -300, W + 600, H + 600);
  if (night > 0.35 && night < 0.75) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(200,120,70,0)'); g.addColorStop(0.7, 'rgba(200,120,70,0.25)'); g.addColorStop(1, 'rgba(200,120,70,0)'); ctx.globalAlpha = 1 - Math.abs(night - 0.55) * 4; ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
  ctx.restore();
}
export function stars(n, seed, night, ymax = 520) { if (night < 0.6) return; ctx.save(); ctx.globalAlpha = clamp((night - 0.6) * 2.5); for (let i = 0; i < n; i++) circle(rnd(i + seed) * W, rnd(i + 40 + seed) * ymax, 2.5 + rnd(i) * 2.5, P.parch); ctx.restore(); }

// ═════════════════════════ CAMERA / LAYERS ═════════════════════════
/** parallax layer: depth 0 = fixed (sky), 1 = moves fully with the camera. cam = { x, y, zoom } (x, y = pan offsets in px) */
export function layer(cam, depth, fn) {
  ctx.save(); const cx = cam.x || 0, cy = cam.y || 0, z = 1 + ((cam.zoom ?? 1) - 1) * depth;
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 - cx * depth, -H / 2 - cy * depth); fn(); ctx.restore();
}
export const camAt = (lt, d, a, b) => { const k = eio(clamp(lt / d)); return { x: lerp(a.x || 0, b.x || 0, k), y: lerp(a.y || 0, b.y || 0, k), zoom: lerp(a.zoom || 1, b.zoom || 1, k) }; };

// ═════════════════════════ REAL MAPS ═════════════════════════
let GEO = null;
export async function loadGeo() { GEO = await (await fetch('data/geo.json', { cache: 'no-store' })).json(); return GEO; }
// places (lon, lat), approximate town positions, good to a few km at this scale
export const PL = {
  amsterdam: [4.9, 52.37], lisbon: [-9.14, 38.72], cape: [18.42, -33.92], bantam: [106.15, -6.03], batavia: [106.82, -6.13],
  masulipatnam: [81.13, 16.17], pulicat: [80.32, 13.42], madras: [80.27, 13.08], nagapattinam: [79.84, 10.77], cochin: [76.26, 9.96],
  colachel: [77.26, 8.17], travancore: [76.95, 8.5], surat: [72.83, 21.17], chinsura: [88.4, 22.9], hooghly: [88.39, 22.91],
  calcutta: [88.36, 22.57], plassey: [88.25, 23.8], amboyna: [128.18, -3.7], banda: [129.9, -4.53], moluccas: [127.8, 0.8],
  bengal: [88.8, 23.6], bihar: [85.3, 25.6], ganga: [82.9, 25.4], malabar: [75.8, 11.0], coromandel: [80.4, 14.5], java: [110.4, -7.4],
};
/** a map view: lon/lat centre and px per degree. Equirectangular, which is fine this close to the equator. */
export const view = (lon, lat, s) => ({ lon, lat, s });
export const VIEWS = {
  world: view(62, 10, 9.2),            // Amsterdam (top-left) .. Cape .. Java/Moluccas (right)
  wide: view(102, 9, 15.5),            // India left, Indonesia right, one shot
  india: view(80, 17, 34),             // the whole subcontinent
  south: view(78.5, 11.5, 62),         // Coromandel + Malabar + Travancore
  bengal: view(87.5, 23.4, 120),       // Hooghly
  moluccas: view(127.5, -1.8, 78),
};
export const vlerp = (a, b, k) => ({ lon: lerp(a.lon, b.lon, k), lat: lerp(a.lat, b.lat, k), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)) });
export const px = (v, ll) => [W / 2 + (ll[0] - v.lon) * v.s, H / 2 - 40 - (ll[1] - v.lat) * v.s];
function landPath(v) { ctx.beginPath(); for (const r of GEO.rings) { r.forEach((p, i) => { const [x, y] = px(v, p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); } }
/** the real map page: parchment, sea, graticule, cut-paper land. o = { seed, night, sea } */
export function realMap(v, o = {}) {
  parchment(o.seed || 3);
  ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  ctx.strokeStyle = 'rgba(62,44,30,0.16)'; ctx.lineWidth = 2;
  const step = v.s > 60 ? 2 : v.s > 25 ? 5 : 10;
  for (let lon = Math.floor((v.lon - W / v.s) / step) * step; lon < v.lon + W / v.s; lon += step) { const [x] = px(v, [lon, 0]); ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x, H + 300); ctx.stroke(); }
  for (let lat = Math.floor((v.lat - H / v.s) / step) * step; lat < v.lat + H / v.s; lat += step) { const [, y] = px(v, [0, lat]); ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  cut(() => landPath(v), P.land, { shadow: 0.8, edge: 5 });
  ctx.save(); landPath(v); ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
/** run fn clipped to the land of view v (for tints: Travancore green, British crimson, Indonesian gold) */
export function onLand(v, fn) { ctx.save(); landPath(v); ctx.clip(); fn(); ctx.restore(); }
/** a soft tint blob of colour c at lon/lat with radius r degrees, alpha a */
export function tint(v, ll, rDeg, c, a = 0.55, sx = 1, sy = 1) { const [x, y] = px(v, ll); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rDeg * v.s * sx, rDeg * v.s * sy, 0, 0, TAU); ctx.fill(); ctx.restore(); }
/** a map pin with a slip label. dy = label offset (labels always end up above y 840). sc = pop scale */
export function pin(v, ll, text, sc = 1, o = {}) {
  if (sc <= 0) return; const [x, y] = px(v, ll);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); circle(0, 0, 13, P.ink); circle(0, 0, 6, o.dot || P.parch); ctx.restore();
  if (text) { const dx = o.dx || 0; let ly = y + (o.dy ?? -62); ly = Math.min(ly, 800); slip(text, x + dx, ly, sc * (o.s || 0.62), o.rot ?? -0.02, 46); }
}
/** a crimson dashed route through lon/lat points (with optional bend), p 0..1; returns the head [x, y, ang] */
export function route(v, lls, p, bend = 0) {
  const pts = []; for (let i = 0; i < lls.length - 1; i++) { const a = px(v, lls[i]), b = px(v, lls[i + 1]); for (let k = 0; k < 16; k++) { const u = k / 16, n = Math.sin(u * Math.PI) * bend; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; pts.push([lerp(a[0], b[0], u) - dy / l * n, lerp(a[1], b[1], u) + dx / l * n]); } }
  pts.push(px(v, lls[lls.length - 1])); return dashedRoute(pts, p);
}

// ═════════════════════════ ERA BAR ═════════════════════════
export const ERAS = [1596, 1602, 1605, 1623, 1663, 1678, 1741, 1759, 1825];
/** thin timeline at y 70. active = index (or -1); p = marker position 0..1 along the bar; a = alpha */
export function eraBar(active, p = null, a = 1) {
  if (a <= 0) return; const x0 = 560, x1 = 1360, y = 70; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(233,220,188,0.82)'; ctx.beginPath(); ctx.roundRect(x0 - 50, y - 22, x1 - x0 + 100, 62, 10); ctx.fill();
  line([[x0, y], [x1, y]], P.ink, 3);
  ERAS.forEach((yr, i) => { const tx = x0 + (x1 - x0) * i / (ERAS.length - 1), on = i === active; circle(tx, y, on ? 9 : 5, on ? P.crimson : P.ink);
    ctx.font = `700 ${on ? 22 : 17}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = on ? P.crimson : P.ink; ctx.fillText(String(yr), tx, y + 24); });
  if (p != null) { const mx = x0 + (x1 - x0) * clamp(p); ctx.fillStyle = P.crimson; ctx.beginPath(); ctx.moveTo(mx, y - 8); ctx.lineTo(mx - 9, y - 22); ctx.lineTo(mx + 9, y - 22); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

// ═════════════════════════ CHAPTER CARD ═════════════════════════
/** ~1.6 s: parchment page turns in, gold year ribbon, hook title on a torn slip, wax seal stamps on at the right */
export function chapterCard(lt, year, title) {
  const turn = eio(seg(lt, 0, 0.35));
  ctx.save(); const ex = lerp(W + 200, 0, turn);
  ctx.beginPath(); ctx.moveTo(ex, -50); ctx.lineTo(W + 300, -50); ctx.lineTo(W + 300, H + 50); ctx.lineTo(ex - 120 * (1 - turn), H + 50); ctx.closePath(); ctx.clip();
  parchment(17); ctx.restore();
  if (turn < 1) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#5A4632'; ctx.fillRect(ex - 30, -50, 30, H + 100); ctx.restore(); }
  if (lt < 0.25) return;
  ribbon(String(year), W / 2, 400, eob(seg(lt, 0.25, 0.6)), 120);
  tornSlip(title, W / 2, 600, eob(seg(lt, 0.45, 0.8)), 64);
  goldSeal(1520, 600, lt > 0.75 ? lerp(1.6, 1, eo(seg(lt, 0.75, 0.9))) * clamp((lt - 0.75) * 12) : 0, 'VOC', 0);
}
/** a wide torn paper slip (captions look) with a line of text */
export function tornSlip(text, x, y, sc = 1, size = 64, color = P.ink, rot = -0.01) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.font = `700 ${size}px ${SERIF}`;
  const hw = ctx.measureText(text).width / 2 + 60, hh = size * 0.85;
  cut(() => { ctx.beginPath(); ctx.moveTo(-hw, -hh); for (let x = -hw; x <= hw; x += 22) ctx.lineTo(x, -hh + (rnd(x + 3) - 0.5) * 10); for (let x = hw; x >= -hw; x -= 22) ctx.lineTo(x, hh + (rnd(x + 9) - 0.5) * 10); ctx.closePath(); }, '#F3E9D2', { shadow: 0.8, edge: 0 });
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 5); ctx.restore();
}

// ═════════════════════════ SEALS & FLAGS ═════════════════════════
/** gold wax seal. letters 'VOC' draws the VOC monogram (V with O and C on its arms) */
export function goldSeal(x, y, s = 1, letters = 'VOC', crack = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const half = (side) => { ctx.save(); if (crack > 0) { ctx.translate(side * crack * 60, crack * 30); ctx.rotate(side * crack * 0.25); ctx.beginPath(); ctx.moveTo(0, -120); for (let k = 0; k <= 8; k++) ctx.lineTo((k % 2 ? 14 : -10) * 1, -120 + k * 30); ctx.lineTo(side * 200, 120); ctx.lineTo(side * 200, -120); ctx.closePath(); ctx.clip(); }
    cut(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = 90 + Math.sin(a * 9) * 7; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); }, P.gold, { shadow: 0.7, edge: 0 });
    ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.strokeStyle = '#8E6820'; ctx.lineWidth = 6; ctx.stroke();
    if (letters === 'VOC') vocMark(0, 4, 1, '#6E4E14'); else { ctx.font = `700 70px ${SERIF}`; ctx.fillStyle = '#6E4E14'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letters, 0, 6); }
    ctx.restore(); };
  if (crack > 0) { half(-1); half(1); } else half(0);
  ctx.restore();
}
/** the VOC monogram: a big V, O on the left arm, C on the right arm, drawn as ink strokes */
export function vocMark(x, y, s, c = P.ink) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = c; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-36, -34); ctx.lineTo(0, 36); ctx.lineTo(36, -34); ctx.stroke();
  ctx.beginPath(); ctx.arc(-22, -6, 13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(22, -6, 13, 0.6, TAU - 0.6); ctx.stroke(); ctx.restore();
}
/** a waving flag on a pole: kind 'voc' | 'pt' | 'en' | 'trav' | 'bengal' | 'spain' | 'white'. (x, y) = pole foot */
export function flag(x, y, s, kind, t = 0, pole = 150) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-4, -pole, 8, pole, 3), P.ink, { shadow: 0.4, edge: 2 });
  const fw = 110, fh = 72, top = -pole + 4, wv = (u) => Math.sin(u * 5 + t * 5) * 6 * u;
  const cloth = () => { ctx.beginPath(); ctx.moveTo(4, top); for (let u = 0; u <= 1.001; u += 0.1) ctx.lineTo(4 + u * fw, top + wv(u)); for (let u = 1; u >= -0.001; u -= 0.1) ctx.lineTo(4 + u * fw, top + fh + wv(u)); ctx.closePath(); };
  const base = { voc: F.white, pt: F.white, en: F.white, trav: P.forest, bengal: F.bengal, spain: P.crimson, white: F.white }[kind];
  cut(cloth, base, { shadow: 0.5, edge: 3 });
  ctx.save(); cloth(); ctx.clip();
  if (kind === 'voc') { ctx.fillStyle = F.orange; ctx.fillRect(0, top - 20, fw + 20, fh / 3 + 20); ctx.fillStyle = F.blue; ctx.fillRect(0, top + fh * 2 / 3, fw + 20, fh / 3 + 20); vocMark(4 + fw / 2, top + fh / 2 + wv(0.5), 0.33, P.ink); }
  if (kind === 'pt') { ctx.fillStyle = P.royal; ctx.fillRect(4 + fw / 2 - 7, top - 20, 14, fh + 40); ctx.fillRect(0, top + fh / 2 - 7 + wv(0.5), fw + 20, 14); }
  if (kind === 'en') { ctx.fillStyle = P.crimson; ctx.fillRect(4 + fw * 0.42 - 8, top - 20, 16, fh + 40); ctx.fillRect(0, top + fh / 2 - 8 + wv(0.45), fw + 20, 16); }
  if (kind === 'trav') conch(4 + fw / 2, top + fh / 2 + wv(0.5), 0.3, F.white);
  if (kind === 'bengal') { const cx = 4 + fw / 2, cy = top + fh / 2 + wv(0.5); ctx.fillStyle = P.gold; ctx.beginPath(); ctx.moveTo(cx, cy - 22); ctx.lineTo(cx + 26, cy); ctx.lineTo(cx, cy + 22); ctx.lineTo(cx - 26, cy); ctx.closePath(); ctx.fill(); ctx.fillRect(0, top + fh - 10 + wv(0.5), fw + 20, 10); }
  if (kind === 'spain') { ctx.fillStyle = P.gold; ctx.fillRect(0, top + fh * 0.28 + wv(0.5), fw + 20, fh * 0.44); }
  ctx.restore(); ctx.restore();
}
/** the Travancore conch-shell emblem */
export function conch(x, y, s, c = P.parch) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c;
  ctx.beginPath(); ctx.moveTo(-10, -60); ctx.bezierCurveTo(40, -50, 55, 10, 20, 50); ctx.lineTo(0, 64); ctx.lineTo(-12, 46); ctx.bezierCurveTo(-48, 20, -46, -30, -10, -60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(62,44,30,0.6)'; ctx.lineWidth = 5; for (const k of [-20, 0, 20]) { ctx.beginPath(); ctx.arc(-4, k, 18, -0.3, Math.PI * 0.7); ctx.stroke(); }
  ctx.restore();
}

// ═════════════════════════ CAST ═════════════════════════
// Costume-driven paper figures (no faces: caricature by costume and props). person({ x, y, h, dir, who, arm, walk, prop })
export const CAST = {
  houtman:   { name: 'Cornelis de Houtman', coat: P.sepia, legs: P.ink, trim: P.ink, ruff: 1, hat: 'brim', hair: '#5A4030' },
  director:  { name: 'VOC director', coat: '#2A211B', legs: P.ink, trim: '#2A211B', ruff: 1, hat: 'tall', prop: 'ledger', robe: 0 },
  weaver:    { name: 'Coromandel weaver', coat: F.white, legs: F.white, trim: P.gold, robe: 'mundu', hat: 'none', hair: P.ink, bare: 1, prop: 'shuttle' },
  factor:    { name: 'English factor', coat: P.crimson, legs: P.ink, trim: P.ink, collar: 1, hat: 'brim', hair: '#5A4030' },
  samurai:   { name: 'Japanese soldier', coat: P.royal, legs: P.ink, trim: P.ink, robe: 'hakama', hat: 'jingasa', prop: 'spear' },
  rheede:    { name: 'Hendrik van Rheede', coat: '#2A211B', legs: P.ink, trim: P.gold, collar: 1, wig: 1, sash: F.orange, hat: 'none' },
  achudan:   { name: 'Itty Achudan', coat: F.white, legs: F.white, trim: P.gold, robe: 'mundu', shawl: F.white, bare: 1, hat: 'none', hair: P.ink, prop: 'palmleaf' },
  scholar:   { name: 'Konkani scholar', coat: F.white, legs: F.white, trim: P.forest, robe: 'mundu', shawl: '#C9A86A', bare: 1, hat: 'none', hair: P.ink, prop: 'book' },
  varma:     { name: 'Marthanda Varma', coat: P.forest, legs: P.forest, trim: P.gold, robe: 'long', hat: 'crown', emblem: 'conch', sash: P.gold },
  delannoy:  { name: 'Eustachius De Lannoy', coat: F.blue, legs: P.ink, trim: F.orange, sash: F.orange, hat: 'tricorn', hair: '#5A4030' },
  delannoyT: { name: 'De Lannoy (Travancore)', coat: P.forest, legs: P.ink, trim: P.gold, sash: P.gold, hat: 'tricorn', hair: '#5A4030', emblem: 'conch' },
  jafar:     { name: 'Mir Jafar', coat: F.bengal, legs: F.bengal, trim: P.gold, robe: 'long', hat: 'turban', sash: P.gold },
  forde:     { name: 'Col. Francis Forde', coat: P.crimson, legs: '#F1E6CC', trim: F.white, belts: 1, hat: 'tricorn', hair: '#E9DCBC' },
  // extras
  dutchSoldier: { name: 'Dutch soldier', coat: F.blue, legs: P.ink, trim: F.orange, sash: F.orange, hat: 'brim', prop: 'spear' },
  spanishSoldier: { name: 'Spanish soldier', coat: P.wine, legs: P.ink, trim: P.gold, hat: 'cap', prop: 'spear' },
  ptSoldier: { name: 'Portuguese soldier', coat: F.white, legs: P.ink, trim: P.royal, sash: P.royal, hat: 'cap', prop: 'spear' },
  portuguese: { name: 'Portuguese man', coat: P.royal, legs: P.ink, trim: P.ink, collar: 1, hat: 'brim' },
  citizen:   { name: 'citizen', coat: P.wine, legs: P.ink, trim: P.ink, collar: 1, hat: 'tall' },
  envoy:     { name: 'Dutch envoy', coat: '#2A211B', legs: P.ink, trim: F.orange, collar: 1, hat: 'brim' },
  travSoldier: { name: 'Travancore soldier', coat: P.forest, legs: F.white, trim: P.gold, hat: 'cap', prop: 'musket' },
  redcoat:   { name: 'redcoat', coat: P.crimson, legs: '#F1E6CC', trim: F.white, belts: 1, hat: 'tricorn', prop: 'musket' },
};
const rad = (d) => d * Math.PI / 180;
export function person(o) {
  const c = typeof o.who === 'string' ? CAST[o.who] : o.who; const h = o.h || 640, d = o.dir || 1, s = h / 640, wk = o.walk != null ? Math.sin(o.walk) : 0;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * d, s);
  const robe = c.robe; const skin = P.skin;
  // legs / lower garment
  if (robe === 'long') cut(P_poly([[-72, -470], [72, -470], [118, 0], [-118, 0]]), c.coat);
  else if (robe === 'mundu') { for (const k of [-1, 1]) cut(P_rr(k * 22 - 13, -60, 26, 60, 6), skin, { shadow: 0.4, edge: 3 }); cut(P_poly([[-66, -250], [66, -250], [78, -40], [-78, -40]]), c.legs); ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, -250); ctx.lineTo(18, -40); ctx.stroke(); rr(-78, -58, 156, 10, 3); ctx.fillStyle = c.trim; ctx.fill(); }
  else if (robe === 'hakama') cut(P_poly([[-60, -250], [60, -250], [96, 0], [8, 0], [0, -120], [-8, 0], [-96, 0]]), P.ink);
  else for (const k of [-1, 1]) cut(P_poly([[k * 22 - 18, -250], [k * 22 + 18, -250], [k * 22 + 16 + k * wk * 30, 0], [k * 22 - 16 + k * wk * 30, 0]]), c.legs, { shadow: 0.6, edge: 4 });
  // back arm
  const armC = c.bare ? skin : c.coat;
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(-30, -440); ctx.rotate(rad(10 - wk * 18 + (o.back || 0))); ctx.roundRect(-20, 0, 40, 210, 20); ctx.restore(); }, armC, { shadow: 0.5, edge: 4 });
  // body
  if (robe !== 'long') cut(P_rr(-75, -470, 150, 240, 40), c.bare ? skin : c.coat);
  if (c.shawl) cut(P_poly([[-78, -470], [-20, -470], [70, -260], [20, -250]]), c.shawl, { shadow: 0.4, edge: 4 });
  if (!c.bare && robe !== 'long') { rr(-75, -258, 150, 20, 6); ctx.fillStyle = c.trim; ctx.fill(); }
  if (robe === 'long') { rr(-60, -470, 14, 460, 6); ctx.fillStyle = c.trim; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; }
  if (c.sash) { ctx.save(); ctx.beginPath(); ctx.roundRect(-75, -470, 150, 250, 40); ctx.clip(); ctx.strokeStyle = c.sash; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-70, -470); ctx.lineTo(80, -250); ctx.stroke(); ctx.restore(); }
  if (c.belts) { ctx.strokeStyle = c.trim; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-60, -460); ctx.lineTo(60, -270); ctx.moveTo(60, -460); ctx.lineTo(-60, -270); ctx.stroke(); }
  if (c.emblem === 'conch') conch(-30, -360, 0.42, P.gold);
  // collar / ruff
  if (c.ruff) cut(() => { ctx.beginPath(); ctx.ellipse(0, -478, 86, 28, 0, 0, TAU); }, F.white, { shadow: 0.4, edge: 3 });
  if (c.ruff) { ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 22, -500); ctx.lineTo(i * 24, -456); ctx.stroke(); } }
  if (c.collar) cut(P_poly([[-50, -478], [50, -478], [30, -430], [0, -450], [-30, -430]]), F.white, { shadow: 0.3, edge: 3 });
  // head + hair
  if (c.wig) cut(() => { ctx.beginPath(); ctx.ellipse(0, -520, 100, 120, 0, 0, TAU); }, '#6B4A2E', { shadow: 0.5, edge: 4 });
  cut(P_circ(0, -540, 66), skin);
  if (c.wig) { cut(() => { ctx.beginPath(); ctx.arc(0, -560, 72, Math.PI * 1.05, TAU * 0.99); ctx.closePath(); }, '#6B4A2E', { shadow: 0, edge: 3 }); }
  else if (c.hair && c.hat === 'none') cut(() => { ctx.beginPath(); ctx.arc(0, -548, 68, Math.PI * 1.08, TAU * 0.96); ctx.closePath(); }, c.hair, { shadow: 0, edge: 3 });
  hat(c.hat, c);
  // front arm (raise with o.arm) + prop
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(30, -440); ctx.rotate(rad(-(o.arm || 0) - 10 + wk * 18)); ctx.roundRect(-20, 0, 40, 210, 20); ctx.restore(); }, armC, { shadow: 0.5, edge: 4 });
  const prop = o.prop === undefined ? c.prop : o.prop;
  if (prop) { ctx.save(); ctx.translate(30, -440); ctx.rotate(rad(-(o.arm || 0) - 10 + wk * 18)); ctx.translate(0, 205); ctx.rotate(rad((o.arm || 0) + 10)); handProp(prop, o.t || 0); ctx.restore(); }
  cut(P_circ(30 + Math.sin(rad((o.arm || 0) + 10 - wk * 18)) * 205, -440 + Math.cos(rad((o.arm || 0) + 10 - wk * 18)) * 205, 22), skin, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
function hat(k, c) {
  if (k === 'brim') { cut(() => { ctx.beginPath(); ctx.ellipse(0, -588, 118, 22, 0, 0, TAU); }, P.ink, { shadow: 0.5, edge: 4 }); cut(P_rr(-56, -660, 112, 76, 14), P.ink, { shadow: 0, edge: 4 }); }
  if (k === 'tall') { cut(P_rr(-50, -690, 100, 104, 8), P.ink, { shadow: 0.5, edge: 4 }); cut(P_rr(-86, -598, 172, 18, 9), P.ink, { shadow: 0, edge: 4 }); }
  if (k === 'tricorn') cut(P_poly([[-104, -584], [-60, -640], [0, -626], [60, -640], [104, -584], [0, -600]]), P.ink, { shadow: 0.5, edge: 4 });
  if (k === 'crown') cut(P_poly([[-60, -585], [-70, -665], [-35, -620], [0, -680], [35, -620], [70, -665], [60, -585]]), P.gold, { shadow: 0.5, edge: 4 });
  if (k === 'turban') { cut(() => { ctx.beginPath(); ctx.ellipse(0, -600, 86, 56, 0, 0, TAU); }, F.white, { shadow: 0.5, edge: 4 }); ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, -598, 84, 30, -0.2, 0.2, Math.PI - 0.2); ctx.stroke(); cut(P_poly([[0, -670], [14, -700], [6, -650]]), P.gold, { shadow: 0.3, edge: 2 }); circle(0, -626, 11, F.bengal); }
  if (k === 'jingasa') cut(P_poly([[-120, -578], [0, -640], [120, -578]]), '#4A3A2E', { shadow: 0.5, edge: 4 });
  if (k === 'cap') cut(() => { ctx.beginPath(); ctx.arc(0, -572, 70, Math.PI, TAU); ctx.closePath(); }, c.trim, { shadow: 0.4, edge: 4 });
}
/** props held at the hand (origin = palm, pointing down the arm) */
function handProp(k, t) {
  if (k === 'ledger') { cut(P_rr(-70, -10, 140, 100, 6), P.wine); rr(-60, 0, 120, 80, 4); ctx.fillStyle = F.white; ctx.fill(); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-50, 16 + i * 16); ctx.lineTo(50, 16 + i * 16); ctx.stroke(); } }
  if (k === 'palmleaf') { cut(P_rr(-110, 0, 220, 34, 14), '#C9A86A'); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-90, 9 + i * 8); ctx.lineTo(90, 9 + i * 8); ctx.stroke(); } }
  if (k === 'book') { cut(P_rr(-60, -5, 120, 86, 6), P.forest); rr(-52, 4, 104, 70, 3); ctx.fillStyle = F.white; ctx.fill(); }
  if (k === 'spear') { cut(P_rr(-5, -420, 10, 640, 4), '#6B4A2E', { shadow: 0.4, edge: 2 }); cut(P_poly([[0, -470], [14, -420], [-14, -420]]), P.stone, { shadow: 0.3, edge: 2 }); }
  if (k === 'musket') { cut(P_rr(-6, -360, 12, 520, 4), '#6B4A2E', { shadow: 0.4, edge: 2 }); cut(P_rr(-4, -400, 8, 80, 2), P.ink, { shadow: 0, edge: 2 }); }
  if (k === 'sword') { cut(P_rr(-5, -10, 10, 300, 3), P.stone, { shadow: 0.3, edge: 2 }); cut(P_rr(-30, -14, 60, 12, 4), P.gold, { shadow: 0, edge: 2 }); }
  if (k === 'swordOffer') { ctx.save(); ctx.rotate(-Math.PI / 2); cut(P_rr(-5, -10, 10, 300, 3), P.stone, { shadow: 0.3, edge: 2 }); cut(P_rr(-30, -14, 60, 12, 4), P.gold, { shadow: 0, edge: 2 }); ctx.restore(); }
  if (k === 'letter') { cut(P_rr(-50, 0, 100, 66, 4), F.white); circle(0, 33, 14, P.crimson); }
  if (k === 'shuttle') cut(() => { ctx.beginPath(); ctx.ellipse(0, 20, 50, 12, 0, 0, TAU); }, '#8C6B4E', { shadow: 0.3, edge: 2 });
  if (k === 'certificate') { cut(P_rr(-60, 0, 120, 80, 3), F.white); goldSeal(36, 56, 0.16); }
}

/** a block of soldiers (stand-off, never fighting): n figures in 2 ranks at (x, y), facing dir, with a flag */
export function army(x, y, n, who, dir, s, flagKind, t = 0) {
  for (let r = 1; r >= 0; r--) for (let i = 0; i < Math.ceil(n / 2); i++) person({ x: x - dir * i * 46 * s / 0.5 + r * 22 * dir, y: y - r * 18, h: 150 * s / 0.5, who, dir, arm: 4 });
  flag(x - dir * (Math.ceil(n / 2) * 46 * s / 0.5 + 20), y, 0.7 * s / 0.5, flagKind, t, 200 * s / 0.5);
}
/** a carved throne (cut paper) standing on (x, y) */
export function throne(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-150, -520, 300, 520, 20), P.wine); cut(P_rr(-190, -220, 380, 70, 14), '#5E2430'); cut(P_rr(-170, -150, 40, 150, 8), P.wine); cut(P_rr(130, -150, 40, 150, 8), P.wine); cut(P_poly([[-150, -520], [0, -620], [150, -520]]), P.wine); ctx.restore(); }

// ═════════════════════════ PROPS ═════════════════════════
/** VOC East Indiaman: three masts, tricolour at the stern, crimson-free. sails 0..1 (1 = set, 0 = lowered). */
export function indiaman(x, y, s = 1, rot = 0, t = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (o.dir || 1), s);
  const sails = o.sails ?? 1;
  cut(P_poly([[-300, -70], [250, -70], [330, -110], [270, 40], [-240, 40], [-320, -20]]), P.sepia);
  cut(P_poly([[-320, -20], [-300, -120], [-200, -120], [-210, -70]]), '#7A5636', { shadow: 0.4, edge: 4 });
  rr(-240, -40, 480, 10, 3); ctx.fillStyle = P.gold; ctx.fill();
  for (const i of [-1, 0, 1]) circle(i * 120, -20, 9, P.ink);
  for (const [mx, mh] of [[-150, 380], [20, 470], [170, 360]]) {
    cut(P_rr(mx - 7, -70 - mh, 14, mh, 4), P.ink, { shadow: 0.4, edge: 3 });
    const sh = mh * 0.75 * sails; if (sh > 6) { cut(P_poly([[mx - 95, -70 - mh + 30], [mx + 95, -70 - mh + 30], [mx + 80 + Math.sin(t * 2) * 6, -70 - mh + 30 + sh * 0.5], [mx - 80 + Math.sin(t * 2) * 6, -70 - mh + 30 + sh * 0.5]]), F.white, { shadow: 0.4, edge: 3 });
      cut(P_poly([[mx - 110, -70 - mh + 40 + sh * 0.5], [mx + 110, -70 - mh + 40 + sh * 0.5], [mx + 96 + Math.sin(t * 2 + 1) * 6, -70 - mh + 40 + sh], [mx - 96 + Math.sin(t * 2 + 1) * 6, -70 - mh + 40 + sh]]), F.white, { shadow: 0.4, edge: 3 }); }
  }
  if (o.flag !== false) flag(-290, -120, 0.9, o.flag || 'voc', t, 120);
  ctx.restore();
}
/** layered paper sea: rows of waves from y0 down; fn(i) is called after row i so things can sit between rows */
export function waves(t, y0, rows = 4, gap = 70, amp = 14, fn) {
  for (let i = 0; i < rows; i++) { const y = y0 + i * gap; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.008 + t * 1.3 + i * 1.7) * amp); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.6, edge: 5 }); if (fn) fn(i); }
}
// trade goods icons, centred at (x, y), scale s
export function icon(k, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (k === 'cloth') { cut(P_rr(-46, -30, 92, 60, 10), F.white); ctx.strokeStyle = P.crimson; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-46, -10); ctx.lineTo(46, -10); ctx.moveTo(-46, 10); ctx.lineTo(46, 10); ctx.stroke(); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 30); ctx.stroke(); }
  if (k === 'nutmeg') { cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 30, 36, 0, 0, TAU); }, '#8A5A36'); ctx.strokeStyle = P.crimson; ctx.lineWidth = 4; for (const a of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.moveTo(0, -36); ctx.quadraticCurveTo(a * 50, 0, 0, 36); ctx.stroke(); } }
  if (k === 'clove') { for (const a of [-0.5, 0, 0.5]) { ctx.save(); ctx.rotate(a); cut(P_rr(-5, -10, 10, 50, 4), '#5E3B28', { shadow: 0.3, edge: 2 }); cut(P_circ(0, -16, 12), '#7A4B33', { shadow: 0, edge: 2 }); ctx.restore(); } }
  if (k === 'pepper' || k === 'rice' || k === 'saltpetre' || k === 'opium') { const col = { pepper: '#B9A07A', rice: F.white, saltpetre: '#D8D0BE', opium: '#A8906A' }[k]; cut(P_poly([[-36, -34], [36, -34], [44, 36], [-44, 36]]), col); cut(P_rr(-18, -46, 36, 16, 6), col, { shadow: 0, edge: 3 }); ctx.font = `700 15px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText({ pepper: 'PEPPER', rice: 'RICE', saltpetre: 'SALTPETRE', opium: 'OPIUM' }[k], 0, 6); }
  if (k === 'coins') for (let i = 0; i < 3; i++) cut(() => { ctx.beginPath(); ctx.ellipse(-14 + i * 14, 14 - i * 12, 28, 12, 0, 0, TAU); }, P.gold, { shadow: 0.4, edge: 3 });
  if (k === 'copper') for (let i = 0; i < 3; i++) cut(() => { ctx.beginPath(); ctx.ellipse(-14 + i * 14, 14 - i * 12, 28, 12, 0, 0, TAU); }, '#B06A3E', { shadow: 0.4, edge: 3 });
  if (k === 'indigo') { cut(P_poly([[-40, -20], [40, -20], [34, 36], [-34, 36]]), '#7A5636'); ell(0, -20, 40, 10, P.royal); }
  if (k === 'silk') { cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 40, 26, -0.3, 0, TAU); }, '#C9A86A'); ctx.strokeStyle = '#8E6820'; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 40 - Math.abs(i) * 6, 6 + Math.abs(i) * 4, -0.3, 0, Math.PI); ctx.stroke(); } }
  ctx.restore();
}
/** THE TRADE LOOP: A = Coromandel (cloth), B = Spice Islands (spices), C = Amsterdam (coins). p 0..3 draws the legs;
 *  phase moves the icons along (pass t * speed); goods = extra icons riding the loop. Returns the node points. */
export function tradeLoop(A, B, C, p, phase = 0, goods = [], o = {}) {
  const legs = [[A, B, 'cloth'], [B, C, 'nutmeg'], [C, A, 'coins']], bend = o.bend ?? 90;
  const curve = (a, b, u) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); const cx = mx + dy / l * bend, cy = my - dx / l * bend; const v = 1 - u; return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]]; };
  legs.forEach(([a, b], i) => { const q = clamp(p - i); if (q <= 0) return; const pts = []; for (let k = 0; k <= 24; k++) pts.push(curve(a, b, k / 24 * q)); ctx.save(); ctx.globalAlpha = o.alpha ?? 1; dashedRoute(pts, 1); ctx.restore();
    if (q >= 1) { const [hx, hy] = curve(a, b, 0.97), [px2, py2] = curve(a, b, 0.9); const an = Math.atan2(hy - py2, hx - px2); ctx.save(); ctx.translate(hx, hy); ctx.rotate(an); ctx.fillStyle = P.crimson; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-18, -14); ctx.lineTo(-18, 14); ctx.closePath(); ctx.fill(); ctx.restore(); } });
  // each leg carries its own goods: India's goods ride to the islands, spices ride to Amsterdam, coins ride back
  const per = [['cloth', ...goods.map((g) => (typeof g === 'string' ? g : g.k))], ['nutmeg', 'clove', 'pepper'], ['coins', 'coins']];
  if (p >= 3) per.forEach((ks, i) => ks.forEach((k, j) => { const u = ((phase + j / ks.length) % 1 + 1) % 1, [x, y] = curve(legs[i][0], legs[i][1], 0.08 + u * 0.84); icon(k, x, y, 0.8 * (o.iconScale || 1)); }));
  else legs.forEach(([a, b, k], i) => { const q = clamp(p - i); if (q > 0 && q < 1) { const [x, y] = curve(a, b, q); icon(k, x, y, 0.8 * (o.iconScale || 1)); } });
  return { A, B, C };
}
/** handloom with cloth on the beam; t animates the beater; s scale; (x, y) = floor centre */
export function handloom(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) cut(P_rr(k * 150 - 10, -260, 20, 260, 4), '#7A5636', { shadow: 0.5, edge: 3 });
  cut(P_rr(-170, -270, 340, 22, 5), '#7A5636'); cut(P_rr(-150, -120, 300, 90, 4), F.white, { shadow: 0.4, edge: 3 });
  ctx.strokeStyle = 'rgba(62,44,30,0.3)'; ctx.lineWidth = 2; for (let i = -140; i <= 140; i += 14) { ctx.beginPath(); ctx.moveTo(i, -250); ctx.lineTo(i, -120); ctx.stroke(); }
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-150, -90); ctx.lineTo(150, -90); ctx.stroke();
  const b = -180 + Math.abs(Math.sin(t * 4)) * 50; cut(P_rr(-160, b, 320, 16, 4), '#5E3B28', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** a cut-paper star fort (Pulicat / Amboyna / Cochin): x, y = ground centre */
export function fort(x, y, s = 1, flagKind = 'voc', t = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const wall = o.wall || P.stone, dark = o.dark || P.stoneDark;
  cut(P_poly([[-300, 0], [-300, -150], [-360, -190], [-260, -210], [-240, -160], [240, -160], [260, -210], [360, -190], [300, -150], [300, 0]]), wall);
  for (let i = -5; i <= 5; i++) cut(P_rr(i * 50 - 16, -186, 32, 30, 2), wall, { shadow: 0, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-50, -70); ctx.arc(0, -70, 50, Math.PI, TAU); ctx.lineTo(50, 0); ctx.closePath(); }, o.door || '#3E2C1E', { shadow: 0, edge: 3 });
  if (flagKind) flag(0, -186, 0.9, flagKind, t, 150);
  ctx.restore();
}
/** treaty scroll with n seals; open 0..1 */
export function scroll(x, y, s = 1, open = 1, seals = [], text = '') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const w = 520 * clamp(open) + 40;
  cut(P_rr(-w / 2, -260, w, 520, 6), F.white);
  for (const k of [-1, 1]) cut(P_rr(k * w / 2 - 22, -280, 44, 560, 20), '#D6C39B', { shadow: 0.5, edge: 4 });
  if (open > 0.8) { ctx.save(); ctx.globalAlpha = seg(open, 0.8, 1); ctx.strokeStyle = 'rgba(62,44,30,0.45)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-200, -190 + i * 42); ctx.lineTo(200 - (i % 3) * 40, -190 + i * 42); ctx.stroke(); } if (text) { ctx.font = `700 54px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText(text, 0, -214); } ctx.restore(); }
  seals.forEach((sl, i) => { if (sl.s > 0) { const sx = (i - (seals.length - 1) / 2) * 200; if (sl.kind === 'voc') goldSeal(sx, 190, sl.s * 0.8); else if (sl.kind === 'trav') { cut(P_circ(sx, 190, 72 * sl.s), P.forest, { shadow: 0.6, edge: 0 }); conch(sx, 190, 0.6 * sl.s, P.gold); } else { cut(P_circ(sx, 190, 72 * sl.s), P.crimson, { shadow: 0.6, edge: 0 }); ctx.font = `700 ${60 * sl.s}px ${SERIF}`; ctx.fillStyle = '#7E2420'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(sl.letter || 'E', sx, 196); } } });
  ctx.restore();
}
/** a candle; lit 0..1 (flame size); after it goes out a thin smoke curl */
export function candle(x, y, s = 1, lit = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (lit > 0) { const g = ctx.createRadialGradient(0, -170, 0, 0, -170, 260); g.addColorStop(0, `rgba(242,193,78,${0.45 * lit})`); g.addColorStop(1, 'rgba(242,193,78,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -450, 600, 600); }
  cut(P_rr(-22, -140, 44, 140, 6), F.white); cut(P_rr(-60, -8, 120, 16, 6), '#7A5636');
  if (lit > 0) { ctx.save(); ctx.translate(0, -150); ctx.scale(lit, lit * (1 + 0.08 * Math.sin(t * 11))); cut(() => { ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(22, -14, 0, 4); ctx.quadraticCurveTo(-22, -14, 0, -60); }, '#F2C14E', { shadow: 0, edge: 2 }); ctx.restore(); }
  else { ctx.strokeStyle = 'rgba(200,190,170,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -150); for (let k = 1; k < 8; k++) ctx.lineTo(Math.sin(k + t * 2) * 12, -150 - k * 18); ctx.stroke(); }
  ctx.restore();
}
/** smoke column (far, soft) at x, ground y; grow 0..1 */
export function smokeColumn(x, y, s, grow, t) {
  if (grow <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 7; i++) { const k = clamp(grow * 7 - i); if (k <= 0) continue; const yy = -i * 70 - k * 20, r = 40 + i * 14 + Math.sin(t + i) * 4; ctx.save(); ctx.globalAlpha = 0.85 - i * 0.07; cut(P_circ(Math.sin(i * 1.3 + t * 0.6) * 18, yy, r * k), F.smoke, { shadow: 0.3, edge: 3 }); ctx.restore(); }
  ctx.restore();
}
