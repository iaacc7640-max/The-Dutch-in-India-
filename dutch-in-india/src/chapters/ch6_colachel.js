// CH6 · "1741: The Battle of Colachel" (3:15-4:01). VIOLENCE RULE: one far cannonball arc, a far flash and smoke column
// from the stockade (no people), scorched rice sacks, a white flag, empty boats tipping at night. Nobody is harmed on screen.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;
const vSW = A.view(77.0, 9.6, 140);

function travFill(v, k) { A.onLand(v, () => { const pts = [[77.3, 8.1], [77.0, 8.5], [76.7, 8.9], [76.5, 9.3], [76.3, 9.7], [76.2, 10.1]]; pts.forEach((ll, i) => { const q = clamp(k * pts.length - i); if (q > 0) A.tint(v, ll, 0.55 * q, P.forest, 0.75); }); }); }
function boat(x, y, s, tip = 0, t = 0) { ctx.save(); ctx.translate(x, y + tip * 60); ctx.rotate(tip * 0.9); ctx.scale(s, s); K.cut(K.P_poly([[-120, -20], [120, -20], [90, 30], [-90, 30]]), '#7A5636'); K.cut(K.P_rr(-4, -150, 8, 130, 3), P.ink, { shadow: 0.3, edge: 2 }); K.cut(K.P_poly([[4, -146], [90, -40], [4, -40]]), F.white, { shadow: 0.3, edge: 2 }); ctx.restore(); }

export default function ch6({ add, cue, at, Wd }) {
  // 70 · "Now, back to that beach." : the dusk beach returns
  { const st = at(70);
    add({ id: 'C6_beach', at: st, zoom: 0.04, note: 'the dusk beach from the cold open returns', draw(lt, d, t) { SC.beach(t, A.camAt(lt, d, { x: 140 }, { x: 80, zoom: 1.03 }), 0.5, { flag: 0, vocFlag: true }); } });
    cue(st, 'waves', { dur: 2, gain: 0.6 }); }
  // 71-73 · Travancore: the map, the king, the green fill creeping along the pepper coast
  { const s0 = at(71), s1 = at(72), s2 = at(73);
    add({ id: 'C6_map', at: s0, zoom: 0.03, note: 'map: south-west coast, TRAVANCORE pin', draw(lt, d, t) { const v = A.vlerp(VIEWS.south, vSW, eio(clamp(lt / d))); A.realMap(v, { seed: 71 }); A.pin(v, PL.travancore, 'TRAVANCORE', eob(seg(lt, 0.3, 0.6)), { dx: -190, dy: 0 }); K.ribbon('1730s', 1450, 280, eob(seg(lt, 0, 0.3)), 72); } });
    add({ id: 'C6_varma', at: s1, cam: [W / 2, 480], zoom: 0.07, note: 'Marthanda Varma standing, conch flag', draw(lt, d, t) { K.parchment(72); SC.sky({ x: 0, y: 0, zoom: 1 }, 0, 72); K.cut(K.P_rr(-300, 760, W + 600, 400, 0), '#B9C28E', { shadow: 0.4, edge: 5 }); A.flag(1250, G - 10, 1.4, 'trav', t, 330); A.person({ x: 860, y: G, h: 600, who: 'varma', dir: 1, arm: 30 }); A.tornSlip('MARTHANDA VARMA', 420, 260, eob(seg(lt, 0.2, 0.5)), 48); } });
    add({ id: 'C6_fill', at: s2, zoom: 0.03, note: "Travancore's green fill creeps along the coast", draw(lt, d, t) { A.realMap(vSW, { seed: 73 }); travFill(vSW, seg(lt, 0, d)); A.pin(vSW, PL.travancore, 'TRAVANCORE', 1, { dx: -190, dy: 0 }); A.tornSlip('THE PEPPER COAST', 1300, 300, eob(seg(lt, 0.4, 0.7)), 48); } });
    cue(s0 + 0.3, 'pop', { gain: 0.5 }); cue(s2, 'slide', { dur: 2, gain: 0.4 }); }
  // 74 · "and the Dutch sent troops to stop him." : VOC ships arrive, right to left
  { const st = at(74);
    add({ id: 'C6_ships', at: st, zoom: 0.03, note: 'VOC ships arrive off the coast, right to left', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: 0 }, { x: -40 }); SC.sky(cam, 0.2, 74); A.layer(cam, 0.6, () => { A.waves(t, 600, 1, 60, 8); for (let i = 0; i < 3; i++) A.indiaman(lerp(2100 + i * 380, 900 + i * 380, eo(clamp(lt / (d + 0.4)))), 680 + i * 12, 0.42, Math.sin(t * 1.3 + i) * 0.02, t + i); A.waves(t, 700, 2, 60, 10); }); } });
    cue(st, 'waves', { dur: 2.2, gain: 0.6 }); }
  // 75 · "In August 1741, at Colachel," : the beach and the Dutch stockade, wide
  { const st = at(75), co = Wd('ko', 75) - st;
    add({ id: 'C6_colachel', at: st, zoom: 0.04, note: 'Colachel beach and the Dutch stockade, wide', draw(lt, d, t) { SC.beach(t, A.camAt(lt, d, { x: -200, y: -20, zoom: 1.1 }, { x: -260, y: -30, zoom: 1.16 }), 0.15, { vocFlag: true, ship: 1300, shipDir: -1 }); K.ribbon('AUG 1741', 1400, 250, eob(seg(lt, 0.1, 0.45)), 72); A.tornSlip('COLACHEL', 1400, 410, eob(seg(lt, co, co + 0.3)), 52); } });
    cue(st + 0.1, 'sparkle', { dur: 0.6, gain: 0.4 }); }
  // 76-79 · the cannonball arc, the far flash + smoke, scorched rice, the white flag (no people anywhere)
  { const s0 = at(76), s1 = at(77), s2 = at(78), s3 = at(79), cb = Wd('cannonball', 76), bar = Wd('barrel', 77), sur = Wd('surrendered', 79);
    const cam0 = { x: -260, y: -30, zoom: 1.16 };
    const arc = (T0) => { const k = seg(T0, cb - 0.2, bar - 0.1); if (k <= 0 || k >= 1) return; const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30 * k; pts.push([lerp(1700, 330, u), lerp(560, 600, u) - Math.sin(u * Math.PI) * 360]); } K.dashedRoute(pts, 1); const h = pts[pts.length - 1]; circle(h[0], h[1], 14, P.ink); };
    const scene = (T0, t, o) => SC.beach(t, cam0, 0.2, { vocFlag: true, flash: Math.max(0, 1 - Math.abs(T0 - bar) * 2.5) * (T0 > bar - 0.1 ? 1 : 0), smoke: seg(T0, bar, bar + 2.2), flag: o.flag || 0, figures: () => A.layer({ x: 0, y: 0, zoom: 1 }, 0, () => arc(T0)) });
    add({ id: 'C6_ball', at: s0, zoom: 0.03, note: 'one crimson dashed cannonball arc toward the far stockade', draw(lt, d, t) { scene(s0 + lt, t, {}); A.tornSlip('THE STORY GOES…', 640, 190, eob(seg(lt, 0.1, 0.4)), 40); } });
    add({ id: 'C6_flash', at: s1, cam: [400, 520], zoom: 0.06, note: 'far flash and smoke column (no people)', draw(lt, d, t) { scene(s1 + lt, t, {}); } });
    add({ id: 'C6_rice', at: s2, zoom: 0.06, note: 'rice sacks scorched at the edges', draw(lt, d, t) { K.parchment(78); ctx.fillStyle = '#6E5A40'; ctx.fillRect(-300, 760, W + 600, 400); for (let i = 0; i < 5; i++) { const x = 560 + i * 200, y = 700 - (i % 2) * 30; A.icon('rice', x, y, 2.4); const k = seg(lt, 0.2 + i * 0.1, 0.9 + i * 0.1); ctx.save(); ctx.globalAlpha = 0.65 * k; ctx.fillStyle = '#3E2C1E'; ctx.beginPath(); ctx.ellipse(x + 40, y + 40, 70 * k, 50 * k, 0.4, 0, TAU); ctx.fill(); ctx.restore(); } A.smokeColumn(1500, 700, 0.6, 0.8, t); A.tornSlip('THE RICE SUPPLY', W / 2, 300, eob(seg(lt, 0.1, 0.4)), 52); } });
    add({ id: 'C6_white', at: s3, cam: [400, 520], zoom: 0.07, note: 'white flag rises over the stockade', draw(lt, d, t) { SC.beach(t, cam0, 0.25, { vocFlag: false, smoke: 0.9, flag: seg(s3 + lt, sur - 0.3, sur + 1.0) }); } });
    cue(cb - 0.2, 'cannon', { gain: 0.6 }); cue(bar, 'boom', { gain: 0.7 }); cue(s2 + 0.2, 'sizzle', { dur: 1.2, gain: 0.4 }); cue(sur - 0.3, 'slide', { dur: 1.2, gain: 0.4 }); }
  // 80-81 · fishermen are said to have helped: boats glide at night; empty Dutch boats tip (no people)
  { const s0 = at(80), s1 = at(81), sk = Wd('sinking', 81);
    const night = (T0, t, tipK) => { SC.sky({ x: 0, y: 0, zoom: 1 }, 1, 80); A.stars(60, 9, 1); A.waves(t, 600, 1, 60, 8);
      for (let i = 0; i < 3; i++) boat(lerp(200 + i * 220, 520 + i * 220, seg(T0, s0, s1 + 1)), 660, 0.7, 0, t);
      for (let i = 0; i < 3; i++) { const k = eio(seg(T0, sk + i * 0.25, sk + 0.6 + i * 0.25)); boat(1250 + i * 200, 650, 0.85, k * tipK, t); }
      A.waves(t, 690, 2, 60, 12); A.nightWash(0.85); };
    add({ id: 'C6_fishers', at: s0, zoom: 0.04, note: 'night: small fishing boats glide under the navy wash', draw(lt, d, t) { night(s0 + lt, t, 0); A.tornSlip('FISHERMEN, IT IS SAID', 600, 280, eob(seg(lt, 0.3, 0.6)), 44); } });
    add({ id: 'C6_tip', at: s1, cam: [1450, 560], zoom: 0.08, note: 'empty Dutch boats tip under the waves', draw(lt, d, t) { night(s1 + lt, t, 1); } });
    cue(s0, 'waves', { dur: 4, gain: 0.5 }); for (let i = 0; i < 3; i++) cue(sk + i * 0.25 + 0.3, 'plop', { gain: 0.4 }); }
  // 82-83 · De Lannoy: the two-shot again, then the coat swaps to Travancore green
  { const s0 = at(82), s1 = at(83), rc = Wd('recruited', 83) - s1;
    add({ id: 'C6_twoshot', at: s0, cam: [W / 2, 560], zoom: 0.05, note: 'the cold-open two-shot again: the sword handover', draw(lt, d, t) { SC.beach(t, { x: -40, y: 0, zoom: 1.04 }, 0.5, { flag: 1, figures: () => { A.person({ x: 780, y: G, h: 520, who: 'delannoy', dir: 1, arm: 72, prop: 'swordOffer' }); A.person({ x: 1160, y: G, h: 560, who: 'varma', dir: -1, arm: 40 }); } }); A.tornSlip('EUSTACHIUS DE LANNOY', 600, 230, eob(seg(lt, 0.4, 0.7)), 44); } });
    add({ id: 'C6_recruit', at: s1, cam: [820, 520], zoom: 0.08, note: 'his coat swaps from Dutch blue to Travancore green', draw(lt, d, t) { const sw = lt > rc + 0.1; SC.beach(t, { x: -40, y: 0, zoom: 1.04 }, 0.45, { flag: 1, figures: () => { A.person({ x: 820, y: G, h: 560, who: sw ? 'delannoyT' : 'delannoy', dir: 1, arm: 10 }); if (lt > rc && lt < rc + 0.25) { ctx.save(); ctx.globalAlpha = 0.6 * (1 - (lt - rc) / 0.25); ctx.fillStyle = P.edge; ctx.beginPath(); ctx.ellipse(820, G - 300, 160, 320, 0, 0, 7); ctx.fill(); ctx.restore(); } } }); A.tornSlip(sw ? 'RECRUITED' : 'PRISONER', 1250, 300, 1, 56); } });
    cue(s1 + rc + 0.1, 'pop', { gain: 0.6 }); }
  // 84-85 · drilling ranks; "the Great Captain"
  { const s0 = at(84), s1 = at(85);
    const drill = (lt, d, t, cam) => { SC.beach(t, cam, 0.15, { flag: 0, figures: () => { for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) A.person({ x: 760 + i * 170 + r * 60, y: G - 40 + r * 40, h: 400, who: 'travSoldier', dir: -1, arm: Math.sin(t * 3 + i) > 0 ? 4 : 30 }); A.person({ x: 470, y: G, h: 520, who: 'delannoyT', dir: 1, arm: 90 + Math.sin(t * 3) * 20, prop: 'sword' }); } }); };
    add({ id: 'C6_drill', at: s0, zoom: 0.03, note: 'De Lannoy drills ranks of Travancore soldiers (lateral pan)', draw(lt, d, t) { drill(lt, d, t, A.camAt(lt, d, { x: 80 }, { x: -60 })); A.tornSlip('EUROPEAN DRILL', 1400, 230, eob(seg(lt, 0.4, 0.7)), 44); } });
    add({ id: 'C6_captain', at: s1, cam: [470, 500], zoom: 0.1, note: "slip 'VALIYA KAPPITHAN: THE GREAT CAPTAIN'", draw(lt, d, t) { drill(lt, d, t, { x: -60, y: 0, zoom: 1 }); A.tornSlip('VALIYA KAPPITHAN', 1150, 230, eob(seg(lt, 0.1, 0.4)), 56, P.ink); A.tornSlip('"THE GREAT CAPTAIN"', 1150, 360, eob(seg(lt, 0.4, 0.7)), 40); } });
    for (let i = 0; i < 6; i++) cue(s0 + 0.3 + i * 0.5, 'tock', { gain: 0.3 }); cue(s1 + 0.1, 'pop'); }
  // 86-87 · the 1753 treaty: the scroll unrolls, two seals stamp on
  { const s0 = at(86), s1 = at(87), sl = Wd('stand', 87);
    const tr = (T0, t) => { K.parchment(86); const o = eio(seg(T0, s0 + 0.2, s0 + 1.2)); A.scroll(W / 2, 470, 0.9, o, [{ kind: 'voc', s: eob(seg(T0, sl - 0.5, sl - 0.3)) }, { kind: 'trav', s: eob(seg(T0, sl, sl + 0.2)) }], '1753'); A.tornSlip('TREATY OF MAVELIKKARA', W / 2, 790, o, 40); };
    add({ id: 'C6_treaty', at: s0, zoom: 0.04, era: [6, 6], note: 'treaty scroll unrolls; ribbon 1753', draw(lt, d, t) { tr(s0 + lt, t); K.ribbon('1753', 1500, 300, eob(seg(lt, 0.4, 0.8)), 80); } });
    add({ id: 'C6_seals', at: s1, cam: [W / 2, 620], zoom: 0.08, note: 'two wax seals stamp on (VOC gold, Travancore conch)', draw(lt, d, t) { tr(s1 + lt, t); K.ribbon('1753', 1500, 300, 1, 80); } });
    cue(s0 + 0.2, 'rustle'); cue(sl - 0.4, 'thud', { gain: 0.6 }); cue(sl + 0.1, 'thud', { gain: 0.7 }); }
}
