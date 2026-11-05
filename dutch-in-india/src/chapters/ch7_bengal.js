// CH7 · "1759: Last Stand in Bengal" (4:01-4:35): Mir Jafar's letter, the fleet up the Hooghly, Forde, the masts, 16 Europeans.
// VIOLENCE RULE: no fighting shown; the defeat is told with masts lowering and a counter.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;

const HOOGHLY = [[88.25, 24.2], [88.37, 23.7], [88.41, 23.2], [88.39, 22.9], [88.34, 22.57], [88.2, 22.3], [88.1, 22.0], [88.05, 21.6]];
const vBengal = A.view(88.3, 22.9, 260);
export function river(v, w = 12) { ctx.save(); ctx.strokeStyle = P.sea; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); HOOGHLY.forEach((ll, i) => { const [x, y] = A.px(v, ll); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.strokeStyle = P.edge; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
function palace(t) { K.hall(); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = F.bengal; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
function cushion(x, y) { K.cut(K.P_rr(x - 200, y - 90, 400, 90, 30), P.wine); K.cut(K.P_rr(x - 220, y - 20, 440, 40, 12), P.gold); }
/** a standalone turban (for the throne-cushion swap); band = trim colour */
function turban(x, y, s, band = P.gold) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 86, 56, 0, 0, TAU); }, F.white); ctx.strokeStyle = band; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 2, 84, 30, -0.2, 0.2, Math.PI - 0.2); ctx.stroke(); circle(0, -26, 11, band === P.gold ? F.bengal : P.wine); ctx.restore(); }
function riverScene(t, cam, o = {}) { SC.sky(cam, o.night || 0, 92); A.layer(cam, 0.4, () => { K.cut(K.P_rr(-400, 520, W + 800, 80, 0), '#8C9A62', { shadow: 0.4, edge: 4 }); for (let i = 0; i < 12; i++) SC.palm(-200 + i * 200, 560, 0.4, t + i, '#6E7B4C'); });
  A.layer(cam, 0.7, () => { A.waves(t, 600, 2, 60, 8, (i) => { if (i === 0 && o.ships) o.ships(); }); }); if (o.bank) A.layer(cam, 1, o.bank); A.layer(cam, 1.2, () => K.cut(K.P_rr(-400, 845, W + 800, 400, 0), '#8C9A62', { shadow: 0.6, edge: 5 })); }

export default function ch7({ add, cue, at, Wd }) {
  // 88 · map of Bengal: the Hooghly; CHINSURA above CALCUTTA; PLASSEY
  { const st = at(88);
    add({ id: 'C7_map', at: st, zoom: 0.03, note: 'map: Bengal, Hooghly; CHINSURA above CALCUTTA, PLASSEY', draw(lt, d, t) { const v = A.vlerp(VIEWS.india, vBengal, eio(clamp(lt / (d * 0.8)))); A.realMap(v, { seed: 88 }); river(v, v.s / 20);
      if (v.s > 150) { A.pin(v, PL.chinsura, 'CHINSURA (DUTCH)', eob(seg(lt, 1.4, 1.7)), { dx: 240, dy: 0 }); A.pin(v, PL.calcutta, 'CALCUTTA', eob(seg(lt, 1.6, 1.9)), { dx: -190, dy: 30 }); A.pin(v, PL.plassey, 'PLASSEY', eob(seg(lt, 1.8, 2.1)), { dx: -170, dy: 0 }); } } });
    cue(st + 1.4, 'pop', { gain: 0.5 }); cue(st + 1.6, 'pop', { gain: 0.4 }); }
  // 89-90 · Mir Jafar on a cushion throne; he slips a sealed letter to a Dutch envoy
  { const s0 = at(89), s1 = at(90), sc = Wd('secretly', 90) - s1;
    add({ id: 'C7_jafar', at: s0, cam: [W / 2, 520], zoom: 0.06, note: 'Mir Jafar on a cushion throne', draw(lt, d, t) { palace(t); cushion(W / 2, G); A.person({ x: W / 2, y: G - 60, h: 560, who: 'jafar', dir: 1, arm: 20 }); A.tornSlip('NAWAB MIR JAFAR', 480, 260, eob(seg(lt, 0.4, 0.7)), 46); A.tornSlip('AFTER PLASSEY (1757)', 1440, 260, eob(seg(lt, 0, 0.3)), 36); } });
    add({ id: 'C7_letter', at: s1, cam: [1000, 520], zoom: 0.07, note: 'he slips a sealed letter to a Dutch envoy', draw(lt, d, t) { palace(t); const k = eo(seg(lt, sc, sc + 0.8)); A.person({ x: 700, y: G, h: 560, who: 'jafar', dir: 1, arm: lerp(20, 75, k), prop: 'letter' }); A.person({ x: 1300, y: G, h: 540, who: 'envoy', dir: -1, arm: lerp(10, 60, seg(lt, sc + 0.5, sc + 1.1)) }); A.tornSlip('SECRET', 1000, 250, eob(seg(lt, sc + 0.3, sc + 0.6)), 52, P.crimson, -0.05); } });
    cue(s1 + sc, 'rustle', { gain: 0.5 }); }
  // 91 · 1759: the river mouth from above
  { const st = at(91);
    add({ id: 'C7_1759', at: st, zoom: 0.03, note: 'ribbon 1759; river mouth from above', draw(lt, d, t) { const v = A.view(88.2, 22.3, 260); A.realMap(v, { seed: 91 }); river(v, 13); K.ribbon('1759', 1400, 300, eob(seg(lt, 0, 0.35)), 90); A.tornSlip('HOOGHLY RIVER', 600, 300, eob(seg(lt, 0.3, 0.6)), 44); } });
    cue(st, 'sparkle', { dur: 0.6, gain: 0.5 }); }
  // 92-93 · the Dutch fleet sails up the Hooghly from Batavia, right to left; "1,500+"
  { const s0 = at(92), s1 = at(93), e = at(94);
    const fleet = (T0, t, sails = () => 1) => () => { for (let i = 0; i < 5; i++) { const x = lerp(2200 + i * 330, 600 + i * 330, eo(seg(T0, s0, e))); A.indiaman(x, 640 + (i % 2) * 14, 0.34, Math.sin(t * 1.3 + i) * 0.02, t + i, { dir: -1, sails: sails(i) }); } };
    add({ id: 'C7_fleet', at: s0, zoom: 0.03, note: 'wide river pan: Dutch ships sail in from Batavia, right to left', draw(lt, d, t) { riverScene(t, A.camAt(lt, d, { x: 60 }, { x: -60 }), { ships: fleet(s0 + lt, t) }); A.tornSlip('FROM BATAVIA', 1450, 230, eob(seg(lt, 0.2, 0.5)), 44); } });
    add({ id: 'C7_troops', at: s1, cam: [1000, 480], zoom: 0.06, note: "slip '1,500+ European and Malay troops' over the masts", draw(lt, d, t) { riverScene(t, { x: -60, y: 0, zoom: 1 }, { ships: fleet(s1 + lt, t) }); A.tornSlip('1,500+ SOLDIERS', W / 2, 220, eob(seg(lt, Wd('fifteen', 93) - s1, Wd('fifteen', 93) - s1 + 0.3)), 64); A.tornSlip('EUROPEAN AND MALAY', W / 2, 340, eob(seg(lt, 0.9, 1.2)), 36); } });
    cue(s0, 'waves', { dur: 4.5, gain: 0.5 });
    // 94 · Forde in his red coat on the bank; redcoat line (standing, no fighting)
    { const st = at(94), fo = Wd('forde', 94) - st;
      add({ id: 'C7_forde', at: st, zoom: 0.04, note: 'Forde (red coat) on the bank; redcoats in a line', draw(lt, d, t) { riverScene(t, A.camAt(lt, d, { x: -40 }, { x: 40 }), { ships: fleet(st + lt, t), bank: () => { K.cut(K.P_rr(-400, 760, W + 800, 100, 0), '#9C8C70', { shadow: 0.4, edge: 4 }); for (let i = 0; i < 7; i++) A.person({ x: 760 + i * 150, y: 800, h: 330, who: 'redcoat', dir: 1, arm: 4 }); A.person({ x: 420, y: 820, h: 460, who: 'forde', dir: 1, arm: 50 }); A.flag(250, 820, 1.0, 'en', t, 260); } }); A.tornSlip('COL. FRANCIS FORDE', 520, 230, eob(seg(lt, fo, fo + 0.3)), 44); } });
      cue(st + 1.5, 'cannon', { gain: 0.35 }); }
    // 95 · "on the river and then on land near Chinsurah." : the Dutch masts lower one by one
    { const st = at(95);
      add({ id: 'C7_masts', at: st, cam: [1100, 520], zoom: 0.06, note: 'Dutch masts lower one by one on the river', draw(lt, d, t) { const T0 = st + lt; riverScene(t, { x: 0, y: 0, zoom: 1 }, { night: 0.3, ships: fleet(T0, t, (i) => 1 - eio(seg(lt, 0.2 + i * 0.4, 0.7 + i * 0.4))) }); A.tornSlip('NEAR CHINSURAH', 560, 230, eob(seg(lt, Wd('chin', 95) - st, Wd('chin', 95) - st + 0.3)), 44); } });
      for (let i = 0; i < 5; i++) cue(st + 0.2 + i * 0.4, 'slide', { dur: 0.5, gain: 0.3 }); } }
  // 96 · "Only sixteen Europeans got through to the fort." : the counter at the fort gate
  { const st = at(96), si = Wd('sixteen', 96) - st;
    add({ id: 'C7_sixteen', at: st, zoom: 0.05, note: "counter slip to '16 EUROPEANS' at the fort gate", draw(lt, d, t) { SC.sky({ x: 0, y: 0, zoom: 1 }, 0.4, 96); K.cut(K.P_rr(-300, 780, W + 600, 400, 0), '#9C8C70', { shadow: 0.4, edge: 4 }); A.fort(W / 2, 800, 1.0, 'voc', t); A.nightWash(0.3);
      const n = Math.round(lerp(1500, 16, eio(seg(lt, 0.1, si + 0.2)))); A.tornSlip(n <= 16 ? '16 EUROPEANS' : String(n), W / 2, 250, 1, 80, n <= 16 ? P.crimson : P.ink); A.tornSlip('REACHED CHINSURAH FORT', W / 2, 400, eob(seg(lt, si + 0.3, si + 0.6)), 38); } });
    cue(st + 0.1, 'tock', { gain: 0.4 }); cue(st + si + 0.2, 'thud', { gain: 0.7 }); }
  // 97-98 · the throne cushion: Mir Jafar's turban lifts away; a second turban settles (Mir Kasim)
  { const s0 = at(97), s1 = at(98), rp = Wd('replaced', 97) - s0;
    add({ id: 'C7_lift', at: s0, cam: [W / 2, 560], zoom: 0.08, note: "the throne cushion: Mir Jafar's turban lifts away", draw(lt, d, t) { palace(t); cushion(W / 2, G); const k = eio(seg(lt, rp, d)); ctx.save(); ctx.globalAlpha = 1 - k; turban(W / 2, lerp(G - 150, 200, k), 1.3); ctx.restore(); A.tornSlip('MIR JAFAR', 420, 300, 1 - k, 44); } });
    add({ id: 'C7_kasim', at: s1, cam: [W / 2, 560], zoom: 0.08, note: 'a second turban settles: Mir Kasim', draw(lt, d, t) { palace(t); cushion(W / 2, G); const k = eob(seg(lt, 0.1, 0.8)); turban(W / 2, lerp(200, G - 150, k), 1.3, P.forest); A.tornSlip('MIR KASIM', 1500, 300, eob(seg(lt, Wd('meer', 98) - s1, Wd('meer', 98) - s1 + 0.3)), 44); A.tornSlip("HIS SON-IN-LAW", 1500, 410, eob(seg(lt, 0.2, 0.5)), 32); } });
    cue(s0 + rp, 'slide', { dur: 1.2, gain: 0.4 }); cue(s1 + 0.8, 'thud', { gain: 0.5 }); }
  // 99 · British crimson tint spreads over Bengal
  { const st = at(99);
    add({ id: 'C7_tint', at: st, zoom: 0.03, note: 'map: British crimson tint spreads over Bengal', draw(lt, d, t) { const v = A.view(87.5, 23.6, 90); A.realMap(v, { seed: 99 }); A.onLand(v, () => A.tint(v, [88.3, 23.4], 3.2 * eio(seg(lt, 0.1, d)), P.crimson, 0.45)); river(v, 7); A.pin(v, PL.calcutta, 'CALCUTTA', 1, { dx: -170, dy: 30 }); A.flag(...A.px(v, [88.0, 24.0]), 0.8, 'en', t, 120); } });
    cue(st, 'slide', { dur: 1.8, gain: 0.4 }); }
}
