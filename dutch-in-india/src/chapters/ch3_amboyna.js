// CH3 · "1623: Trouble at Amboyna" (1:40-2:11). VIOLENCE RULE: nothing is shown but a night fort, a closed door,
// a ledger of names under the navy wash and a candle going out. The Japanese soldier is only seen standing guard.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;

function seaDay(t, cam) { SC.sky(cam, 0, 36); A.layer(cam, 0.5, () => A.waves(t, 560, 2, 60, 10)); }
function nightRoom(t) { K.parchment(41); ctx.fillStyle = '#6E5A40'; ctx.fillRect(-300, 700, W + 600, 500); A.nightWash(0.95); }
/** the ledger of names: n of 20 lines inked (abstract ink strokes, no real names invented) */
function names(x, y, s, n) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-380, -300, 760, 600, 8), '#E9DCBC');
  ctx.font = '700 40px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText('AMBOYNA · 1623', 0, -246);
  for (let i = 0; i < 20; i++) { const k = clamp(n - i); if (k <= 0) break; const col = Math.floor(i / 10), row = i % 10, lx = -330 + col * 360, ly = -190 + row * 46, len = (180 + rnd(i + 3) * 110) * k;
    ctx.strokeStyle = 'rgba(62,44,30,0.85)'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, ly); for (let u = 0; u <= len; u += 12) ctx.lineTo(lx + u, ly + Math.sin(u * 0.15 + i) * 4); ctx.stroke(); }
  ctx.restore();
}
function hand(x, y, s, sleeve, dir) { ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); K.cut(K.P_rr(-300, -50, 220, 100, 16), sleeve); K.cut(K.P_rr(-100, -46, 140, 92, 40), P.skin); ctx.restore(); }

export default function ch3({ add, cue, at, Wd }) {
  // 36-37 · two ships side by side, then their sails nudge (no fighting)
  { const st = at(36);
    add({ id: 'C3_ships', at: st, zoom: 0.03, note: 'Dutch and English ships side by side', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: -40 }, { x: 40 }); seaDay(t, cam); A.layer(cam, 0.8, () => { A.indiaman(640, 700 + Math.sin(t * 1.5) * 6, 0.62, Math.sin(t * 1.2) * 0.02, t); A.indiaman(1280, 700 + Math.sin(t * 1.5 + 1) * 6, 0.62, Math.sin(t * 1.2 + 1) * 0.02, t, { flag: 'en', dir: -1 }); A.waves(t, 720, 2, 70, 12); }); } });
    cue(st, 'waves', { dur: 3.6, gain: 0.6 }); }
  { const st = at(37), ug = Wd('ugly', 37) - st;
    add({ id: 'C3_nudge', at: st, cam: [W / 2, 500], zoom: 0.08, note: 'the two ships bump', draw(lt, d, t) { const k = eo(seg(lt, 0, ug)); const cam = { x: 0, y: 0, zoom: 1.08 }; seaDay(t, cam); A.layer(cam, 0.8, () => { A.indiaman(lerp(640, 800, k), 700, 0.62, -0.04 * Math.sin(seg(lt, ug - 0.1, ug + 0.4) * Math.PI), t); A.indiaman(lerp(1280, 1120, k), 700, 0.62, 0.04 * Math.sin(seg(lt, ug - 0.1, ug + 0.4) * Math.PI), t, { flag: 'en', dir: -1 }); A.waves(t, 720, 2, 70, 12); }); } });
    cue(st + ug, 'thud', { gain: 0.6 }); }
  // 38 · "In 1623, on the island of Amboyna," : map pin, then the fort at night
  { const st = at(38), is = Wd('island', 38) - 0.05;
    add({ id: 'C3_pin', at: st, zoom: 0.03, note: 'map: AMBOYNA pin, dusk', draw(lt, d, t) { const v = A.vlerp(VIEWS.wide, VIEWS.moluccas, eio(clamp(lt / d))); A.realMap(v, { seed: 38 }); A.pin(v, PL.amboyna, 'AMBOYNA', eob(seg(lt, 0.3, 0.6)), { dy: -80 }); A.nightWash(0.4 * lt / d); } });
    add({ id: 'C3_fort', at: is, cam: [W / 2, 520], zoom: 0.06, note: 'Amboyna fort silhouette at night', draw(lt, d, t) { SC.sky({ x: 0, y: 0, zoom: 1 }, 1, 38); A.stars(50, 7, 1); A.waves(t, 700, 2, 60, 8); A.fort(W / 2, 760, 1.2, 'voc', t, { wall: '#5A5048', dark: '#4A4038' }); A.nightWash(0.6); } });
    cue(st + 0.3, 'pop', { gain: 0.5 }); }
  // 39-40 · a letter with a broken seal; "PLOT?"
  { const st = at(39), st2 = at(40), pl = Wd('plotting', 40) - st2;
    const letter = (lt, k) => { nightRoom(0); A.candle(1520, 760, 0.9, 1, lt); ctx.save(); ctx.translate(W / 2, 470); ctx.rotate(-0.04); K.cut(K.P_rr(-340, -240, 680, 480, 6), '#E9DCBC'); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 5; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-270, -160 + i * 50); ctx.lineTo(240 - (i % 3) * 50, -160 + i * 50); ctx.stroke(); }
      for (const s of [-1, 1]) { ctx.save(); ctx.translate(s * 18 * k, 180 + 6 * k); ctx.rotate(s * 0.2 * k); ctx.beginPath(); ctx.rect(s > 0 ? 0 : -80, -80, 80, 160); ctx.clip(); K.cut(K.P_circ(0, 0, 60), P.crimson, { shadow: 0.5, edge: 0 }); ctx.restore(); } ctx.restore(); };
    add({ id: 'C3_letter', at: st, zoom: 0.05, note: 'letter with a broken seal, candlelight', draw(lt, d, t) { letter(t, eo(seg(lt, 0.4, 0.8))); } });
    add({ id: 'C3_plot', at: st2, zoom: 0.07, note: "slip 'PLOT?' on the letter", draw(lt, d, t) { letter(t, 1); A.tornSlip('PLOT?', 1260, 300, eob(seg(lt, pl, pl + 0.3)), 80, P.crimson, 0.05); } });
    cue(st + 0.4, 'slam', { gain: 0.3 }); cue(st2 + pl, 'pop'); }
  // 41 · "After confessions taken under torture," : two prisoners sit with bound hands; an official writes CONFESSION and
  //       they sign. (Symbolic, chosen in review: no torture shown.)
  { const st = at(41);
    add({ id: 'C3_confess', at: st, cam: [W / 2, 500], zoom: 0.06, note: 'prisoners with bound hands sign a CONFESSION (symbolic, no harm shown)', draw(lt, d, t) {
      nightRoom(t); A.candle(1650, 800, 0.8, 1, t);
      for (const [x, who] of [[440, 'factor'], [700, 'samurai']]) { A.person({ x, y: 840, h: 430, who, dir: 1, arm: 30, prop: null }); ctx.strokeStyle = '#C9A86A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(x + 40, 840 - 430 * 0.62, 38, 14, 0.3, 0, TAU); ctx.stroke(); }
      K.cut(K.P_rr(980, 640, 520, 200, 8), '#7A5636'); A.person({ x: 1420, y: 840, h: 460, who: 'envoy', dir: -1, arm: 60 });
      ctx.save(); ctx.translate(1150, 600); ctx.rotate(-0.04); K.cut(K.P_rr(-160, -120, 320, 220, 4), '#E9DCBC'); ctx.font = '700 36px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText('CONFESSION', 0, -70);
      ctx.strokeStyle = 'rgba(62,44,30,0.7)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { const k = seg(lt, 0.3 + i * 0.4, 0.7 + i * 0.4); ctx.beginPath(); ctx.moveTo(-120, -20 + i * 36); ctx.lineTo(-120 + 240 * k, -20 + i * 36); ctx.stroke(); } ctx.restore();
      A.nightWash(0.35); A.tornSlip('CONFESSIONS UNDER TORTURE', W / 2, 220, eob(seg(lt, 0.3, 0.6)), 44);
    } });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'quill', { dur: 1.3 }); }
  // 42-44 · three groups appear with their counts as named; each fades to an ink silhouette; the candle goes out
  { const s1 = at(42), s2 = at(43), s3 = at(44), e = at(45);
    const G3 = [['factor', 10, '10 ENGLISH', Wd('ten', 42), 360], ['samurai', 9, '9 JAPANESE', Wd('nine', 43), 980], ['portuguese', 1, '1 PORTUGUESE', Wd('one', 44), 1560]];
    const groups = (T0, t) => { nightRoom(t);
      G3.forEach(([who, n, label, tw0, cx], g) => { const tw = g === 0 ? Math.min(tw0, s1 + 0.15) : tw0; if (T0 < tw - 0.1) return; const fade = seg(T0, (G3[g + 1] ? G3[g + 1][3] : Wd('man', 44) + 0.2) - 0.3, (G3[g + 1] ? G3[g + 1][3] : Wd('man', 44) + 0.2) + 0.4);
        for (let i = 0; i < n; i++) { const k = eob(seg(T0, tw + i * 0.05, tw + 0.25 + i * 0.05)); if (k <= 0) continue; const col = i % 5, row = Math.floor(i / 5), x = cx + (col - (Math.min(n, 5) - 1) / 2) * 70 + row * 30, y = 700 + row * 90;
          ctx.save(); ctx.globalAlpha = 1 - 0.75 * fade; ctx.translate(x, y); ctx.scale(k, k); A.person({ x: 0, y: 0, h: 190, who, dir: 1, arm: 4, prop: null }); ctx.restore(); }
        A.tornSlip(label, cx, 340, eob(seg(T0, tw0, tw0 + 0.3)), 52, fade > 0.5 ? P.ink : P.crimson); });
      const out = Wd('man', 44) + 0.3; A.candle(1780, 830, 0.6, T0 < out ? 1 : 0, t); if (T0 > out) A.nightWash(0.3 * seg(T0, out, out + 0.6)); };
    add({ id: 'C3_english', at: s1, zoom: 0.04, note: '10 ENGLISH appear, then fade to silhouettes', draw(lt, d, t) { groups(s1 + lt, t); } });
    add({ id: 'C3_japanese', at: s2, cam: [980, 600], zoom: 0.06, note: '9 JAPANESE appear', draw(lt, d, t) { groups(s2 + lt, t); } });
    add({ id: 'C3_portuguese', at: s3, cam: [1300, 600], zoom: 0.06, note: '1 PORTUGUESE; all fade; the candle goes out', draw(lt, d, t) { groups(s3 + lt, t); } });
    cue(Wd('ten', 42), 'pop', { gain: 0.4 }); cue(Wd('nine', 43), 'pop', { gain: 0.4 }); cue(Wd('one', 44), 'pop', { gain: 0.4 }); cue(Wd('man', 44) + 0.3, 'inhale', { dur: 0.5, gain: 0.4 }); }
  // 45 · "It ended any hope of the two companies working together." : a paper handshake tears in two
  { const st = at(45), tr = Wd('hope', 45) - st;
    add({ id: 'C3_tear', at: st, zoom: 0.05, note: 'paper handshake tears in two', draw(lt, d, t) { K.parchment(45); const k = eo(seg(lt, tr, tr + 0.8));
      for (const s of [-1, 1]) { ctx.save(); ctx.translate(s * 60 * k, 30 * k); ctx.rotate(s * 0.12 * k); ctx.beginPath(); if (s < 0) { ctx.moveTo(-300, -300); ctx.lineTo(W / 2 + 10, -300); for (let y = -300; y < H + 300; y += 40) ctx.lineTo(W / 2 + (rnd(y) - 0.5) * 30, y); ctx.lineTo(-300, H + 300); } else { ctx.moveTo(W + 300, -300); ctx.lineTo(W / 2 + 10, -300); for (let y = -300; y < H + 300; y += 40) ctx.lineTo(W / 2 + (rnd(y) - 0.5) * 30, y); ctx.lineTo(W + 300, H + 300); } ctx.closePath(); ctx.clip();
        K.cut(K.P_rr(460, 260, 1000, 420, 10), '#F3E9D2'); hand(W / 2 - 10, 470, 1.4, F.orange, 1); hand(W / 2 + 10, 470, 1.4, P.crimson, -1); ctx.restore(); }
      A.tornSlip('VOC', 640, 220, 1, 44); A.tornSlip('ENGLISH CO.', 1280, 220, 1, 44); } });
    const s2 = Wd('companies', 45) - 0.05;
    add({ id: 'C3_tear2', at: s2, cam: [W / 2, 470], zoom: 0.1, note: 'the torn halves drift apart', draw(lt, d, t) { K.parchment(45); const k = eo(seg(lt, 0, d)); for (const sg of [-1, 1]) { ctx.save(); ctx.translate(W / 2 + sg * lerp(260, 380, k), 470 + lerp(40, 80, k)); ctx.rotate(sg * lerp(0.15, 0.25, k)); K.cut(K.P_rr(-300, -200, 600, 400, 8), '#F3E9D2'); hand(-sg * 230, 0, 1.3, sg < 0 ? F.orange : P.crimson, -sg); ctx.restore(); } } });
    cue(st + tr, 'rustle', { dur: 0.8 }); }
  // 46 · "The Dutch kept the Spice Islands," : Dutch flags fill the Moluccas
  { const st = at(46);
    add({ id: 'C3_flags', at: st, zoom: 0.03, note: 'Dutch flags fill the Moluccas', draw(lt, d, t) { const v = VIEWS.moluccas; A.realMap(v, { seed: 46 }); [[127.6, 0.9], [128.2, -3.6], [129.9, -4.5], [126.3, -3.3], [124.6, 1.2], [130.5, -3.2], [127.4, -0.5]].forEach((ll, i) => { const [x, y] = A.px(v, ll); A.flag(x, y, eob(seg(lt, 0.2 + i * 0.15, 0.5 + i * 0.15)) * 0.7, 'voc', t + i, 120); }); } });
    for (let i = 0; i < 7; i++) cue(st + 0.2 + i * 0.15, 'pop', { gain: 0.4 }); }
  // 47 · "and the English turned more and more to India." : an English ship turns left toward India
  { const st = at(47);
    add({ id: 'C3_turn', at: st, zoom: 0.02, note: 'English ship turns left toward India', draw(lt, d, t) { const v = VIEWS.wide; A.realMap(v, { seed: 47 }); A.onLand(v, () => A.tint(v, [128.5, -2], 4, F.orange, 0.35)); const k = eio(clamp(lt / (d + 1)));
      const pts = [[1420, 640], [1250, 700], [1000, 640], [760, 560]]; const hd = K.dashedRoute(pts, k); A.indiaman(hd[0], hd[1] - 10, 0.16, 0, t, { flag: 'en', dir: -1 }); A.pin(v, PL.surat, 'INDIA', eob(seg(lt, 1.2, 1.5)), { dy: -60 }); } });
    cue(st, 'slide', { dur: 2, gain: 0.4 }); }
}
