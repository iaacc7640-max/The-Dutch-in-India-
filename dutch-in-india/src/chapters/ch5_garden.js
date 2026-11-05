// CH5 · "1678: The Garden of Malabar" (2:43-3:15): van Rheede, Itty Achudan, the Konkani scholars, the Hortus Malabaricus.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { F } = A, G = SC.GROUND;

/** an ink line drawn on with p (0..1) through pts */
function ink(pts, p, w = 5, c = P.ink) { const n = Math.max(2, Math.floor(pts.length * clamp(p))); if (p <= 0) return; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.stroke(); }
const curve = (x0, y0, x1, y1, bend, n = 30) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [lerp(x0, x1, u) + Math.sin(u * Math.PI) * bend, lerp(y0, y1, u)]; });
/** an ink leaf (outline + midrib + veins), drawn on with p */
export function inkLeaf(x, y, s, p, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const L = Array.from({ length: 41 }, (_, i) => { const u = i / 40, a = u * TAU; return [Math.sin(a) * 90 * Math.sin(u * Math.PI) ** 0.6 * (u < 0.5 ? 1 : 1), -Math.cos(a) * 200]; });
  ink(L, seg(p, 0, 0.6), 5); ink(curve(0, 200, 0, -200, 0), seg(p, 0.4, 0.8), 4); for (let k = 0; k < 6; k++) { const yy = 140 - k * 60, sd = k % 2 ? 1 : -1; ink(curve(0, yy, sd * 70, yy - 50, 0, 8), seg(p, 0.6 + k * 0.06, 0.7 + k * 0.06), 3); } ctx.restore(); }
/** an ink coconut palm in the Hortus-plate manner, drawn on line by line */
export function inkPalm(x, y, s, p) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ink(curve(0, 0, 40, -480, -40), seg(p, 0, 0.3), 9); for (let r = 0; r < 12; r++) ink(curve(-6 + r * 4, -r * 40, 14 + r * 4, -r * 40 - 4, 0, 4), seg(p, 0.15 + r * 0.01, 0.3), 3);
  for (let f = 0; f < 9; f++) { const a = -Math.PI + f * Math.PI / 8, pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([40 + Math.cos(a) * 260 * u, -480 + Math.sin(a) * 120 * u + u * u * 160]); } ink(pts, seg(p, 0.3 + f * 0.05, 0.5 + f * 0.05), 5);
    for (let q = 2; q < 20; q += 2) { const [px, py] = pts[q]; ink([[px, py], [px + 14, py + 40]], seg(p, 0.55 + f * 0.04, 0.7 + f * 0.04), 2); } }
  for (const [cx, cy] of [[20, -455], [60, -450], [40, -430]]) { if (p > 0.85) { ctx.beginPath(); ctx.arc(cx, cy, 22, 0, TAU); ctx.lineWidth = 4; ctx.strokeStyle = P.ink; ctx.stroke(); } }
  ctx.restore(); }
function plate(x, y, s, rot = 0, fill = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); K.cut(K.P_rr(-260, -340, 520, 680, 4), '#EFE3C6'); ctx.strokeStyle = P.sepia; ctx.lineWidth = 4; ctx.strokeRect(-230, -310, 460, 620); if (fill) inkPalm(-20, 250, 0.9, fill); ctx.restore(); }
function volume(x, y, s, i) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-160, -40, 320, 80, 6), ['#7A2E3A', '#5E3B28', '#4F6D4A'][i % 3]); ctx.fillStyle = P.gold; ctx.fillRect(-150, -6, 300, 12); ctx.restore(); }
function garden(t, cam) { SC.sky(cam, 0, 60); A.layer(cam, 0.4, () => { for (let i = 0; i < 10; i++) SC.palm(-100 + i * 230, 720, 0.55 + rnd(i) * 0.2, t + i, '#6E7B4C'); }); A.layer(cam, 0.8, () => { K.cut(K.P_rr(-400, 700, W + 800, 200, 0), '#B9C28E', { shadow: 0.4, edge: 5 }); for (let i = 0; i < 14; i++) { const x = -200 + i * 170, h = 80 + rnd(i + 4) * 60; K.cut(() => { ctx.beginPath(); ctx.ellipse(x, 790 - h / 2, 70, h / 2, 0, 0, TAU); }, i % 2 ? P.forest : '#6E7B4C', { shadow: 0.4, edge: 3 }); } }); A.layer(cam, 1.2, () => K.cut(K.P_rr(-400, 845, W + 800, 400, 0), '#8C9A62', { shadow: 0.5, edge: 5 })); }

export default function ch5({ add, cue, at, Wd }) {
  // 59 · "Not everything they did was about money." : coins slide away, a green leaf drifts in
  { const st = at(59), mo = Wd('money', 59) - st;
    add({ id: 'C5_money', at: st, zoom: 0.05, note: 'coins slide off; a green leaf drifts in', draw(lt, d, t) { K.parchment(59); const k = eio(seg(lt, mo - 0.3, d)); for (let i = 0; i < 5; i++) A.icon('coins', lerp(700 + i * 120, -300 + i * 60, k), 460 + (i % 2) * 60, 2.2);
      const lk = eo(seg(lt, mo - 0.2, d)); ctx.save(); ctx.translate(lerp(1500, 1150, lk) + Math.sin(lt * 2) * 40, lerp(80, 470, lk)); ctx.rotate(Math.sin(lt * 1.7) * 0.4); K.cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 70, 170, 0, 0, TAU); }, P.forest); ctx.restore(); } });
    cue(st + mo - 0.3, 'slide', { dur: 1.2, gain: 0.4 }); }
  // 60 · van Rheede in a Cochin garden, lateral pan
  { const st = at(60), rh = Wd('hendrik', 60) - st;
    add({ id: 'C5_rheede', at: st, zoom: 0.04, note: 'van Rheede in a Cochin garden, lateral pan', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: -120 }, { x: 60 }); garden(t, cam); A.layer(cam, 1, () => A.person({ x: 900, y: G, h: 560, who: 'rheede', dir: 1, arm: 20 })); A.tornSlip('HENDRIK VAN RHEEDE', 1400, 260, eob(seg(lt, rh, rh + 0.3)), 48); A.tornSlip('GOVERNOR OF COCHIN', 1400, 370, eob(seg(lt, 0.3, 0.6)), 34); } });
    cue(st + rh, 'pop', { gain: 0.5 }); }
  // 61 · "set out to record the useful plants of Kerala." : a quill sketches a leaf
  { const st = at(61);
    add({ id: 'C5_quill', at: st, zoom: 0.05, note: 'a quill sketches a leaf on parchment', draw(lt, d, t) { K.parchment(61); K.cut(K.P_rr(560, 160, 800, 640, 6), '#F3E9D2'); const p = seg(lt, 0.2, d); inkLeaf(960, 480, 1.25, p, 0.15);
      const qx = 960 + Math.sin(p * 20) * 80, qy = 480 - 200 + p * 400; ctx.save(); ctx.translate(qx + 50, qy - 30); ctx.rotate(0.9); ctx.scale(0.7, 0.7); K.cut(K.P_poly([[0, 0], [24, -200], [0, -260], [-24, -200]]), F.white, { shadow: 0.5, edge: 3 }); ctx.restore(); } });
    cue(st + 0.2, 'quill', { dur: 2.4 }); }
  // 62-63 · Itty Achudan reads from a palm-leaf manuscript; herbs sketch themselves in ink beside him
  { const s0 = at(62), s1 = at(63);
    const scene = (lt, d, t, herbs) => { const cam = A.camAt(lt, d, { x: 30 }, { x: -30 }); garden(t, cam); A.layer(cam, 1, () => { A.person({ x: 720, y: G, h: 560, who: 'achudan', dir: 1, arm: 48 }); if (herbs > 0) { ctx.save(); K.cut(K.P_rr(1160, 180, 560, 600, 6), '#F3E9D2'); ctx.restore(); inkLeaf(1330, 480, 0.8, herbs, -0.3); inkLeaf(1560, 470, 0.7, herbs - 0.2, 0.4); } }); };
    add({ id: 'C5_achudan', at: s0, cam: [800, 480], zoom: 0.07, note: 'Itty Achudan reads a palm-leaf manuscript', draw(lt, d, t) { scene(lt, d, t, 0); A.tornSlip('ITTY ACHUDAN', 1350, 300, eob(seg(lt, Wd('itty', 62) - s0, Wd('itty', 62) - s0 + 0.3)), 52); } });
    add({ id: 'C5_herbs', at: s1, zoom: 0.04, note: 'herbs sketch in ink beside him', draw(lt, d, t) { scene(lt, d, t, seg(lt, 0, d + 0.3)); A.tornSlip('EZHAVA PHYSICIAN', 330, 300, eob(seg(lt, 0, 0.3)), 44); } });
    cue(Wd('itty', 62), 'pop', { gain: 0.5 }); cue(s1, 'quill', { dur: 1.5 }); }
  // 64 · three Konkani Brahmin scholars nod over a page
  { const st = at(64), th = Wd('three', 64) - st;
    add({ id: 'C5_scholars', at: st, zoom: 0.05, note: 'three scholars nod over a page', draw(lt, d, t) { K.hall(); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      K.cut(K.P_rr(820, 560, 280, 280, 8), '#7A5636'); K.cut(K.P_poly([[780, 560], [1140, 560], [1100, 500], [820, 500]]), '#F3E9D2');
      [[560, 1], [1360, -1], [1660, -1]].forEach(([x, dir], i) => { const nod = Math.max(0, Math.sin((lt - th - i * 0.2) * 6)) * 0.08 * (lt > th ? 1 : 0); ctx.save(); ctx.translate(x, G); ctx.rotate(nod * dir); ctx.translate(-x, -G); A.person({ x, y: G, h: 500, who: 'scholar', dir, arm: 40 }); ctx.restore(); });
      A.tornSlip('THREE KONKANI SCHOLARS', W / 2, 220, eob(seg(lt, th, th + 0.3)), 48); } });
    cue(st + th, 'pop', { gain: 0.5 }); }
  // 65 · "The result, the Hortus Malabaricus," : a bound volume lands
  { const st = at(65), ho = Wd('hortus', 65) - st;
    add({ id: 'C5_book', at: st, zoom: 0.05, note: 'a bound volume lands, title slip', draw(lt, d, t) { K.parchment(65); const k = eob(seg(lt, 0.1, 0.5)); ctx.save(); ctx.translate(W / 2, lerp(300, 470, k)); ctx.rotate(lerp(-0.2, -0.03, k)); K.cut(K.P_rr(-230, -300, 460, 600, 10), '#7A2E3A'); ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.strokeRect(-200, -270, 400, 540); inkPalm(-10, 200, 0.55, 1); ctx.restore(); A.tornSlip('HORTUS MALABARICUS', W / 2, 800, eob(seg(lt, ho, ho + 0.3)), 56); } });
    cue(st + 0.5, 'thud', { gain: 0.6 }); }
  // 66 · twelve volumes stack up; gold ribbon 1678
  { const st = at(66), tw = Wd('twelve', 66) - st, yr = Wd('sixteen', 66) - st;
    add({ id: 'C5_volumes', at: st, zoom: 0.04, note: 'twelve volumes stack up; ribbon 1678', draw(lt, d, t) { K.parchment(66); for (let i = 0; i < 12; i++) { const tt = tw + i * 0.07, k = eo(seg(lt, tt, tt + 0.2)); if (lt < tt) continue; ctx.save(); ctx.globalAlpha = clamp(k * 3); volume(W / 2 - 300, lerp(220, 800 - i * 52, k), 1.0, i); ctx.restore(); }
      A.tornSlip('12 VOLUMES', 1350, 640, eob(seg(lt, tw + 0.8, tw + 1.1)), 48); K.ribbon('1678', 1350, 450, eob(seg(lt, yr, yr + 0.4)), 110); } });
    for (let i = 0; i < 12; i++) cue(st + tw + i * 0.07 + 0.2, 'tock', { gain: 0.35 }); cue(st + yr, 'sparkle', { dur: 0.6, gain: 0.5 }); }
  // 67 · "with almost 800 engravings." : plates fan out across the wide frame
  { const st = at(67);
    add({ id: 'C5_plates', at: st, zoom: 0.04, note: 'plates fan out across the frame', draw(lt, d, t) { K.parchment(67); for (let i = 0; i < 7; i++) { const k = eob(seg(lt, i * 0.1, 0.4 + i * 0.1)); plate(lerp(W / 2, 260 + i * 233, k), 470, 0.62, lerp(0, (i - 3) * 0.06, k), 1); } A.tornSlip('~800 ENGRAVINGS', W / 2, 130 + 70, eob(seg(lt, 0.8, 1.1)), 48); } });
    cue(st, 'rustle', { dur: 0.8 }); }
  // 68 · an engraving page fills the frame; a coconut palm draws line by line
  { const st = at(68);
    add({ id: 'C5_palm', at: st, cam: [W / 2, 470], zoom: 0.05, note: 'engraving page: coconut palm drawn line by line', draw(lt, d, t) { K.parchment(68); K.cut(K.P_rr(360, 130, 1200, 700, 4), '#EFE3C6'); ctx.strokeStyle = P.sepia; ctx.lineWidth = 5; ctx.strokeRect(390, 160, 1140, 640); inkPalm(940, 790, 1.15, seg(lt, 0.1, d + 0.2)); } });
    cue(st + 0.1, 'quill', { dur: 3 }); }
  // 69 · "built on Indian knowledge." : slip pins on the finished plate
  { const st = at(69), kn = Wd('knowledge', 69) - st;
    add({ id: 'C5_knowledge', at: st, cam: [W / 2, 470], zoom: 0.03, note: "slip 'INDIAN KNOWLEDGE' on the plate", draw(lt, d, t) { K.parchment(68); K.cut(K.P_rr(360, 130, 1200, 700, 4), '#EFE3C6'); ctx.strokeStyle = P.sepia; ctx.lineWidth = 5; ctx.strokeRect(390, 160, 1140, 640); inkPalm(940, 790, 1.15, 1); A.tornSlip('INDIAN KNOWLEDGE', 1280, 300, eob(seg(lt, kn - 0.3, kn)), 64, P.crimson, 0.05); } });
    cue(st + kn - 0.3, 'pop'); }
}
