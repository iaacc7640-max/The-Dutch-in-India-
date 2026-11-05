// CH4 · "1663: Taking Portugal's Forts" (2:11-2:43): the two aims (Majumdar et al.), Nagapattinam 1658, Cochin 1663, pepper.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;

export const MALABAR = [[75.37, 11.87, 'CANNANORE'], [76.2, 10.22, 'CRANGANORE'], [76.26, 9.96, 'COCHIN'], [76.6, 8.89, 'QUILON']];
const vSouth = A.view(78.2, 11.6, 70);
/** a flag on the map that swaps from kind a to kind b at k (0..1: squash-flip) */
export function swapFlag(v, ll, k, a = 'pt', b = 'voc', t = 0, s = 0.7) { const [x, y] = A.px(v, ll); const sq = Math.abs(Math.cos(clamp(k) * Math.PI)); ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.05, sq), 1); A.flag(0, 0, s, k < 0.5 ? a : b, t, 110); ctx.restore(); }

export default function ch4({ add, cue, at, Wd }) {
  // 48 · Portuguese flags on the coast forts of the south
  { const st = at(48);
    add({ id: 'C4_pt', at: st, zoom: 0.03, note: 'map: Portuguese flags on south Indian forts', draw(lt, d, t) { const v = A.vlerp(VIEWS.india, vSouth, eio(clamp(lt / d))); A.realMap(v, { seed: 48 });
      [PL.nagapattinam, ...MALABAR].forEach((ll, i) => { const [x, y] = A.px(v, ll); A.flag(x, y, eob(seg(lt, 0.6 + i * 0.15, 0.9 + i * 0.15)) * 0.7, 'pt', t + i, 110); }); A.tornSlip('PORTUGUESE FORTS', 1450, 300, eob(seg(lt, 1.4, 1.7)), 44); } });
    for (let i = 0; i < 5; i++) cue(st + 0.6 + i * 0.15, 'pop', { gain: 0.4 }); }
  // 49 · "As R.C. Majumdar and his co-authors put it," : an open history book with an attribution slip
  { const st = at(49);
    add({ id: 'C4_book', at: st, cam: [W / 2, 480], zoom: 0.06, note: 'open history book, attribution slip', draw(lt, d, t) { K.parchment(49);
      for (const s of [-1, 1]) { K.cut(K.P_poly([[W / 2, 220], [W / 2 + s * 560, 250], [W / 2 + s * 560, 740], [W / 2, 720]]), '#F3E9D2'); ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + s * 70, 320 + i * 48); ctx.lineTo(W / 2 + s * (480 - (i % 3) * 60), 330 + i * 48); ctx.stroke(); } }
      A.tornSlip('MAJUMDAR, RAYCHAUDHURI & DATTA', W / 2, 190, eob(seg(lt, 0.3, 0.6)), 44); A.tornSlip('An Advanced History of India', W / 2, 790, eob(seg(lt, 0.8, 1.1)), 36); } });
    cue(st, 'rustle'); }
  // 50-52 · the two aims: two target slips, then REVENGE, then MONOPOLY
  { const s0 = at(50), s1 = at(51), s2 = at(52), rv = Wd('revenge', 51), mo = Wd('monopoly', 52);
    const aims = (T0, t) => { A.realMap(vSouth, { seed: 50 }); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      [[600, 'REVENGE', rv, 'on Spain & Portugal'], [1320, 'MONOPOLY', mo, 'of the spice trade']].forEach(([x, word, tw, sub], i) => { const k = eob(seg(T0, s0 + 0.1 + i * 0.25, s0 + 0.4 + i * 0.25)); if (k <= 0) return;
        ctx.save(); ctx.translate(x, 450); ctx.scale(k, k); K.cut(K.P_circ(0, 0, 210), '#F3E9D2'); ctx.strokeStyle = P.crimson; ctx.lineWidth = 10; for (const r of [190, 130]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); } ctx.restore();
        if (T0 > tw) { A.tornSlip(word, x, 450, eob(seg(T0, tw, tw + 0.3)), 64, P.crimson); A.tornSlip(sub, x, 600, eob(seg(T0, tw + 0.2, tw + 0.5)), 34); } }); };
    add({ id: 'C4_aims', at: s0, zoom: 0.04, era: 4, note: 'two blank target slips', draw(lt, d, t) { aims(s0 + lt, t); } });
    add({ id: 'C4_revenge', at: s1, cam: [600, 450], zoom: 0.08, note: 'REVENGE fills', draw(lt, d, t) { aims(s1 + lt, t); } });
    add({ id: 'C4_monopoly', at: s2, cam: [1320, 450], zoom: 0.08, note: 'MONOPOLY fills', draw(lt, d, t) { aims(s2 + lt, t); } });
    cue(s0 + 0.1, 'pop', { gain: 0.5 }); cue(s0 + 0.35, 'pop', { gain: 0.5 }); cue(rv, 'thud', { gain: 0.6 }); cue(mo, 'thud', { gain: 0.6 }); }
  // 53-55 · 1658 Nagapattinam: ribbon, flag swap, then the pan down the coast from Madras
  { const s0 = at(53), s1 = at(54), s2 = at(55), tk = Wd('took', 54);
    const vN = A.view(79.8, 11.4, 120);
    add({ id: 'C4_1658', at: s0, zoom: 0.04, note: 'ribbon 1658 over the south-east coast', draw(lt, d, t) { A.realMap(vN, { seed: 53 }); swapFlag(vN, PL.nagapattinam, 0, 'pt', 'voc', t, 0.9); K.ribbon('1658', 1400, 300, eob(seg(lt, 0, 0.35)), 84); } });
    add({ id: 'C4_naga', at: s1, cam: [900, 520], zoom: 0.06, note: 'NAGAPATTINAM flag swaps Portuguese to Dutch', draw(lt, d, t) { A.realMap(vN, { seed: 53 }); swapFlag(vN, PL.nagapattinam, seg(s1 + lt, tk, tk + 0.5), 'pt', 'voc', t, 0.9); A.pin(vN, PL.nagapattinam, 'NAGAPATTINAM', 1, { dx: 220, dy: 40 }); } });
    add({ id: 'C4_far', at: s2, zoom: 0.02, note: 'pan down the coast from Madras to Nagapattinam', draw(lt, d, t) { const k = eio(clamp(lt / d)); const v = A.vlerp(A.view(80.2, 13.0, 110), A.view(80.0, 11.2, 110), k); A.realMap(v, { seed: 55 });
      A.pin(v, PL.madras, 'MADRAS', 1, { dx: 150, dy: 0 }); A.pin(v, PL.pulicat, 'PULICAT', 1, { dx: 150, dy: -20 }); swapFlag(v, PL.nagapattinam, 1, 'pt', 'voc', t, 0.9); A.pin(v, PL.nagapattinam, 'NAGAPATTINAM', 1, { dx: 220, dy: 40 });
      const a = A.px(v, PL.madras), b = A.px(v, PL.nagapattinam); ctx.save(); ctx.setLineDash([10, 14]); K.dashedRoute([[a[0] + 30, a[1]], [b[0] + 60, (a[1] + b[1]) / 2], [b[0] + 30, b[1]]], seg(lt, 0.2, d)); ctx.restore(); A.tornSlip('FAR SOUTH OF MADRAS', 560, 300, eob(seg(lt, 0.8, 1.1)), 44); } });
    cue(s0, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(tk, 'whoosh', { gain: 0.5 }); cue(s2, 'slide', { dur: 1.8, gain: 0.4 }); }
  // 56 · "In 1663 they took Cochin," : Cochin harbour; the fort flag swaps
  { const st = at(56), co = Wd('cochin', 56) - st;
    add({ id: 'C4_cochin', at: st, zoom: 0.04, note: 'Cochin: the fort on the shore by the sea; its flag swaps to the tricolour', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: -50 }, { x: 50 }); SC.sky(cam, 0, 56);
      A.layer(cam, 0.4, () => A.waves(t, 600, 2, 60, 8));
      A.layer(cam, 0.85, () => { K.cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 200); ctx.lineTo(-400, 690); ctx.lineTo(1150, 700); ctx.quadraticCurveTo(1300, 720, 1380, 860); ctx.lineTo(1380, H + 200); ctx.closePath(); }, '#E3CF9E', { shadow: 0.6, edge: 6 });
        for (let i = 0; i < 4; i++) SC.palm(120 + i * 150, 700, 0.55, t + i);
        const sw = seg(lt, co, co + 0.5); ctx.save(); ctx.translate(820, 720); A.fort(0, 0, 0.95, null, t); ctx.translate(0, -177); ctx.scale(Math.max(0.05, Math.abs(Math.cos(sw * Math.PI))), 1); A.flag(0, 0, 0.9, sw < 0.5 ? 'pt' : 'voc', t, 150); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(1300, 0, 1000, H); ctx.clip(); A.waves(t, 740, 2, 50, 10); ctx.restore(); A.indiaman(1600, 700, 0.35, Math.sin(t * 1.3) * 0.02, t); });
      K.ribbon('1663', 1500, 230, eob(seg(lt, 0.1, 0.45)), 80); A.tornSlip('COCHIN', 820, 230, eob(seg(lt, co, co + 0.3)), 52); } });
    cue(st + 0.1, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + co, 'whoosh', { gain: 0.5 }); cue(st, 'waves', { dur: 2.6, gain: 0.5 }); }
  // 57 · "and with it, Portugal's last Malabar forts." : each Malabar fort flips in a ripple
  { const st = at(57), mb = Wd('mala', 57) - st;
    add({ id: 'C4_ripple', at: st, zoom: 0.03, note: 'Malabar forts flip in a ripple', draw(lt, d, t) { const v = A.view(76.6, 10.2, 120); A.realMap(v, { seed: 57 });
      MALABAR.forEach(([lo, la, name], i) => { swapFlag(v, [lo, la], seg(lt, mb - 0.4 + i * 0.3, mb + i * 0.3), 'pt', 'voc', t + i, 0.75); if (name === 'COCHIN') { const [x, y] = A.px(v, [lo, la]); K.slip(name, x - 180, y - 10, 1, 0, 34); } });
      A.tornSlip('MALABAR COAST', 1300, 320, eob(seg(lt, 0.3, 0.6)), 52); } });
    for (let i = 0; i < 4; i++) cue(st + mb - 0.2 + i * 0.3, 'whoosh', { gain: 0.35 }); }
  // 58 · "For a while, Kerala's pepper ran through Dutch hands." : VOC pepper sacks roll onto a ship
  { const st = at(58);
    add({ id: 'C4_pepper', at: st, zoom: 0.04, note: 'pepper sacks stamped VOC roll onto a ship', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: 40 }, { x: -40 }); SC.sky(cam, 0, 58); A.layer(cam, 0.6, () => { A.waves(t, 620, 1, 60, 8); A.indiaman(1300, 700, 0.6, Math.sin(t * 1.3) * 0.02, t); A.waves(t, 720, 1, 60, 10); });
      A.layer(cam, 0.95, () => { K.cut(K.P_rr(-300, 740, 1180, 100, 0), P.sepia); for (let i = 0; i < 6; i++) { const k = seg(lt, 0.2 + i * 0.35, 0.9 + i * 0.35), x = lerp(150 + i * 40, 1060, k), y = 690 - (k > 0.85 ? (k - 0.85) * 200 : 0); if (k >= 1) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * 6); A.icon('pepper', 0, 0, 1.3); ctx.restore(); } }); A.tornSlip('KERALA PEPPER', 420, 300, eob(seg(lt, 0.2, 0.5)), 48); } });
    for (let i = 0; i < 6; i++) cue(st + 0.9 + i * 0.35, 'thud', { gain: 0.3 }); }
}
function goldStamp(x, y, s) { A.goldSeal(x, y, s * 0.8); }
