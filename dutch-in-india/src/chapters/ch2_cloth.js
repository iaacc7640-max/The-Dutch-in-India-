// CH2 · "1605: The Cloth Coast" (0:57-1:40): Masulipatnam, Pulicat fort and coins, the handlooms, why India, THE TRADE LOOP.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS } = A, G = SC.GROUND;

const COAST = [[86.6, 20.3], [85.0, 19.3], [83.3, 17.7], [82.3, 16.6], [81.2, 16.0], [80.3, 15.0], [80.2, 13.2], [79.9, 11.8], [79.85, 10.3]];
const vCoast = A.view(81.5, 15.2, 62), vMasu = A.view(81.0, 15.6, 95), vPuli = A.view(80.4, 13.9, 120);

/** crimson dotted target line along the Coromandel coast, drawn on with p */
function coastLine(v, p) { const pts = COAST.map((ll) => A.px(v, [ll[0] + 0.35, ll[1]])); ctx.save(); ctx.setLineDash([4, 16]); K.dashedRoute(pts, p); ctx.restore(); }
function coinStack(x, y, n, lt, t0) {
  for (let i = 0; i < n; i++) { const tt = t0 + i * 0.22; if (lt < tt) break; const k = eo(seg(lt, tt, tt + 0.25)); A.icon('copper', x + (i % 2) * 4, lerp(y - 520, y - 18 - i * 16, k), 1.1); }
}

export default function ch2({ add, cue, at, Wd, L, Le }) {
  // 22 · "Their first factory, on the Coromandel coast," : map zooms to India, the east coast marked
  { const st = at(22);
    add({ id: 'C2_coast', at: st, zoom: 0.02, note: 'map India, Coromandel coast marked', draw(lt, d, t) {
      const v = A.vlerp(VIEWS.india, vCoast, eio(clamp(lt / d))); A.realMap(v, { seed: 22 }); coastLine(v, seg(lt, 0.6, 2.4));
      K.slip('COROMANDEL COAST', A.px(v, [84.5, 15.6])[0] + 120, A.px(v, [84.5, 15.6])[1], eob(seg(lt, 1.4, 1.7)), 0.03, 40);
    } });
    cue(st + 0.6, 'quill', { dur: 1.6 }); cue(st + 1.4, 'pop', { gain: 0.5 }); }

  // 23 · "opened at Masulipatnam in 1605." : pin, factory cut-out with the VOC flag, gold ribbon 1605
  { const st = at(23), m = Wd('opened', 23) - st + 0.25, y = Wd('sixteen', 23) - st;
    add({ id: 'C2_masuli', at: st, zoom: 0.04, note: 'pin MASULIPATNAM, factory pops, ribbon 1605', draw(lt, d, t) {
      const v = A.vlerp(vCoast, vMasu, eio(clamp(lt / d))); A.realMap(v, { seed: 22 }); coastLine(v, 1);
      const [x, yy] = A.px(v, PL.masulipatnam);
      if (lt > m) { const k = eob(seg(lt, m + 0.1, m + 0.45)); ctx.save(); ctx.translate(x - 90, yy + 10); ctx.scale(k * 0.55, k * 0.55); factory(0, 0, t); ctx.restore(); }
      A.pin(v, PL.masulipatnam, 'MASULIPATNAM', eob(seg(lt, m, m + 0.3)), { dx: 170, dy: -20 });
      K.ribbon('1605', 1500, 650, eob(seg(lt, y, y + 0.4)), 80);
    } });
    cue(st + m, 'pop'); cue(st + m + 0.15, 'thud', { gain: 0.4 }); cue(st + y, 'sparkle', { dur: 0.6, gain: 0.5 }); }

  // 24 · "Soon came Pulicat, north of Madras," : view slides south; PULICAT then MADRAS
  { const st = at(24), p1 = Wd('poo', 24) - st, p2 = Wd('madras', 24) - st;
    add({ id: 'C2_pulicat_map', at: st, zoom: 0.03, note: 'view slides south: PULICAT above MADRAS', draw(lt, d, t) {
      const v = A.vlerp(vMasu, vPuli, eio(clamp(lt / (d * 0.8)))); A.realMap(v, { seed: 22 }); coastLine(v, 1);
      A.pin(v, PL.masulipatnam, 'MASULIPATNAM', 1, { dx: 170, dy: -20 });
      A.pin(v, PL.pulicat, 'PULICAT', eob(seg(lt, p1, p1 + 0.3)), { dx: 150, dy: -30 });
      A.pin(v, PL.madras, 'MADRAS', eob(seg(lt, p2, p2 + 0.3)), { dx: 140, dy: 40 });
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.4 }); cue(st + p1, 'pop'); cue(st + p2, 'pop', { gain: 0.6 }); }

  // 25 · "where they built a fort and minted copper coins." : Pulicat fort; coins drop into a stack
  { const st = at(25), f = Wd('fort', 25) - st, c = Wd('minted', 25) - st;
    add({ id: 'C2_fort', at: st, zoom: 0.05, note: 'Pulicat fort rises; copper coins drop into a stack', draw(lt, d, t) {
      const cam = A.camAt(lt, d, { x: -40 }, { x: 40, zoom: 1.04 });
      SC.coromandel(t, cam);
      A.layer(cam, 0.85, () => { const k = eob(seg(lt, f - 0.5, f + 0.1)); ctx.save(); ctx.translate(760, 800); ctx.scale(lerp(0.6, 1, k), k); A.fort(0, 0, 1.0, 'voc', t); ctx.restore(); });
      A.layer(cam, 1, () => { K.cut(K.P_rr(1260, 640, 320, 170, 10), '#7A5636'); coinStack(1420, 645, 8, lt, c); });
      A.tornSlip('PULICAT', 760, 250, eob(seg(lt, 0, 0.3)), 52);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + f, 'thud', { gain: 0.5 }); for (let i = 0; i < 8; i++) cue(st + c + i * 0.22 + 0.22, 'clink', { gain: 0.6 }); }

  // 26 · "Pulicat alone may have had" : a Coromandel weaver at a handloom under a thatched shed
  { const st = at(26);
    add({ id: 'C2_weaver', at: st, cam: [1000, 520], zoom: 0.08, note: 'weaver at a handloom (clack)', draw(lt, d, t) {
      const cam = A.camAt(lt, d, { x: 30 }, { x: -30 });
      SC.coromandel(t, cam);
      A.layer(cam, 1, () => { SC.shed(1000, G, 760, 420); A.handloom(1060, G, 1.15, t); A.person({ x: 760, y: G, h: 470, who: 'weaver', dir: 1, arm: 55 + Math.sin(t * 4) * 12 });
        for (let i = 0; i < 3; i++) A.icon('cloth', 1440 + i * 18, G - 30 - i * 40, 1.1); });
    } });
    cue(st, 'whoosh', { gain: 0.4 }); for (let k = 0; k < 6; k++) cue(st + 0.2 + k * 0.39, 'clack', { gain: 0.5 }); }

  // 27 · "over a thousand handlooms working for them." : the looms multiply across the wide frame; slip "1,000+?"
  { const st = at(27), th = Wd('thousand', 27) - st;
    add({ id: 'C2_looms', at: st, zoom: 0.05, note: 'handlooms multiply in rows; slip 1,000+?', draw(lt, d, t) {
      SC.coromandel(t, { x: 0, y: 0, zoom: 1 });
      const rows = [[430, 0.36], [610, 0.48], [810, 0.62]];
      rows.forEach(([y, s], r) => { const n = Math.floor(W / (420 * s)) + 2; for (let i = 0; i < n; i++) { const tt = 0.1 + (r * n + i) * 0.035; if (lt < tt) continue; const k = eob(seg(lt, tt, tt + 0.25)); ctx.save(); ctx.translate(40 + i * 420 * s + (r % 2) * 100 * s, y); ctx.scale(k, k); A.handloom(0, 0, s, t + i); ctx.restore(); } });
      A.tornSlip('1,000+ ?', W / 2, 200, eob(seg(lt, th, th + 0.3)), 70);
    } });
    for (let k = 0; k < 10; k++) cue(st + 0.1 + k * 0.12, 'clack', { gain: 0.35 }); cue(st + th, 'pop'); }

  // 28 · "But why India, if the Dutch wanted spices?" : question slip between a cloth bale and a nutmeg
  { const st = at(28), sp = Wd('spices', 28) - st;
    add({ id: 'C2_why', at: st, zoom: 0.05, note: 'WHY INDIA? slip between cloth (left) and nutmeg (right)', draw(lt, d, t) {
      K.parchment(28);
      ctx.save(); ctx.translate(560, 520); ctx.rotate(-0.06); A.icon('cloth', 0, 0, eob(seg(lt, 0.1, 0.4)) * 3.2); ctx.restore();
      ctx.save(); ctx.translate(1360, 520); ctx.rotate(0.08); A.icon('nutmeg', 0, 0, eob(seg(lt, sp, sp + 0.35)) * 3.2); ctx.restore();
      A.tornSlip('WHY INDIA?', W / 2, 250, eob(seg(lt, 0.2, 0.5)), 76);
      K.slip('?', W / 2, 560, eob(seg(lt, sp + 0.3, sp + 0.6)), 0.04, 110);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.2, 'pop', { gain: 0.5 }); cue(st + sp, 'pop'); }

  // 29 · "Because the Spice Islands wanted Indian cloth." : map pans right to the Moluccas; cloth bolts land on the islands
  { const st = at(29), cl = Wd('cloth', 29) - st;
    add({ id: 'C2_moluccas', at: st, zoom: 0.03, note: 'map pans to the Moluccas; cloth bolts land', draw(lt, d, t) {
      const v = A.vlerp(A.view(105, 5, 24), A.view(124, -1, 48), eio(clamp(lt / d))); A.realMap(v, { seed: 29 });
      A.pin(v, PL.amboyna, 'SPICE ISLANDS', eob(seg(lt, 1.0, 1.3)), { dx: 40, dy: -90 });
          } });
    const s2 = Wd('wanted', 29) - 0.05;
    add({ id: 'C2_moluccas2', at: s2, zoom: 0.04, note: 'close on the Spice Islands: cloth bolts land', draw(lt, d, t) {
      const v = VIEWS.moluccas; A.realMap(v, { seed: 29 }); const L0 = lt + (s2 - st);
      A.pin(v, PL.amboyna, 'SPICE ISLANDS', 1, { dx: -60, dy: -110 });
      for (let i = 0; i < 5; i++) { const tt = cl + i * 0.14, k = eo(seg(L0, tt, tt + 0.35)); if (L0 < tt) continue; const ll = [[127.6, 0.9], [128.2, -3.6], [129.9, -4.5], [126.3, -3.3], [124.6, 1.2]][i]; const [x, y] = A.px(v, ll); A.icon('cloth', x, lerp(y - 380, y - 24, k), 1.2); }
    } });
    cue(st, 'slide', { dur: 1.5, gain: 0.4 }); cue(st + 1.0, 'pop', { gain: 0.5 }); for (let i = 0; i < 5; i++) cue(st + cl + i * 0.14 + 0.35, 'plop', { gain: 0.4 }); }

  // 30-35 · THE TRADE LOOP on the wide map: India left, Spice Islands right, Amsterdam top
  const v = VIEWS.wide, NA = () => A.px(v, [81.8, 15.5]), NB = () => A.px(v, [128.5, -3]), NC = [960, 215];
  const t30 = at(30), t32 = at(32), t33 = at(33);
  const legP = (t) => (t < t30 ? 0 : t < at(31) ? 0.15 + 0.85 * eio(seg(t, Wd('buy', 30), at(31) - 0.1)) : t < t32 ? 1 + eio(seg(t, Wd('trade', 31), at(32) - 0.1)) : 2 + eio(seg(t, Wd('sell', 32), Wd('europe', 32) + 0.4)));
  const phase = (t) => 0.32 * Math.max(0, t - (Wd('europe', 32) + 0.4)) + 0.3 * Math.max(0, t - Wd('indigo', 33)) + 0.35 * Math.max(0, t - Wd('opium', 35));
  const GOODS = [['indigo', Wd('indigo', 33)], ['silk', Wd('silk', 33)], ['saltpetre', Wd('saltpetre', 34)], ['opium', Wd('opium', 35)], ['rice', Wd('rice', 35)]];
  const loopShot = (i, id, note, camA, camB, extra, st0) => add({ id, at: st0 ?? at(i), zoom: 0.02, note, draw(lt, d, t) {
    const T0 = (st0 ?? at(i)) + lt; const cam = A.camAt(lt, d, camA, camB);
    A.layer(cam, 1, () => {
      A.realMap(v, { seed: 30 }); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      A.onLand(v, () => { A.tint(v, [129, -3], 4, P.gold, 0.35); });
      A.pin(v, [81.8, 15.5], 'COROMANDEL', 1, { dx: -150, dy: 20 }); A.pin(v, [128.5, -3], 'SPICE ISLANDS', 1, { dx: 0, dy: 70 });
      K.slip('TO AMSTERDAM', NC[0], NC[1] - 50, 1, -0.02, 34);
      const goods = GOODS.filter(([, tt]) => T0 > tt).map(([k]) => ({ k, s: 0.75 }));
      A.tradeLoop(NA(), NB(), NC, legP(T0), phase(T0), goods, { bend: -120, iconScale: 1.15 });
      if (extra) extra(lt, d, t, T0);
    });
  } });
  loopShot(30, 'C2_loop1', 'TRADE LOOP: leg 1 India to Spice Islands, cloth', { x: -120, zoom: 1.1 }, { x: 0, zoom: 1.05 });
  loopShot(31, 'C2_loop2', 'TRADE LOOP: leg 2 to Amsterdam, spices', { x: 80, y: -20, zoom: 1.08 }, { x: 0, y: -40, zoom: 1.06 }, (lt) => {
    const n = Wd('nutmeg', 31) - at(31), c = Wd('cloves', 31) - at(31), p = Wd('pepper', 31) - at(31);
    [['nutmeg', n], ['clove', c], ['pepper', p]].forEach(([k, tt], j) => A.icon(k, 1380 + j * 120, 640, eob(seg(lt, tt, tt + 0.3)) * 1.2));
  });
  loopShot(32, 'C2_loop3', 'TRADE LOOP closes with coins; loop turns', { x: -40, y: -30, zoom: 1.05 }, { x: 0, y: 0, zoom: 1.0 });
  loopShot(33, 'C2_loop4', 'TRADE LOOP speeds up: indigo, silk', { x: 0, zoom: 1.0 }, { x: -60, zoom: 1.04 }, (lt, d, t, T0) => A.tornSlip('INDIGO · SILK (BENGAL)', 520, 760, eob(seg(T0, Wd('indigo', 33), Wd('indigo', 33) + 0.3)), 40));
  loopShot(33, 'C2_loop4b', 'TRADE LOOP: silk from Bengal', { x: -60, y: -30, zoom: 1.1 }, { x: -20, y: -10, zoom: 1.06 }, (lt, d, t, T0) => A.tornSlip('INDIGO · SILK (BENGAL)', 520, 760, 1, 40), Wd('silk', 33) - 0.05);
  loopShot(34, 'C2_loop5', 'TRADE LOOP: saltpetre from Bihar', { x: -60, y: 0, zoom: 1.04 }, { x: -100, y: -20, zoom: 1.08 }, (lt, d, t, T0) => A.tornSlip('SALTPETRE (BIHAR)', 520, 760, eob(seg(T0, Wd('saltpetre', 34), Wd('saltpetre', 34) + 0.3)), 40));
  loopShot(35, 'C2_loop6', 'TRADE LOOP at full speed: opium, rice', { x: -100, y: -20, zoom: 1.08 }, { x: 0, y: 0, zoom: 1.0 }, (lt, d, t, T0) => A.tornSlip('OPIUM · RICE (GANGA VALLEY)', 560, 760, eob(seg(T0, Wd('opium', 35), Wd('opium', 35) + 0.3)), 40));
  cue(t30, 'whoosh', { gain: 0.4 }); cue(Wd('buy', 30), 'quill', { dur: 1.6 }); cue(Wd('trade', 31), 'quill', { dur: 1.6 }); cue(Wd('sell', 32), 'quill', { dur: 1.0 }); cue(Wd('europe', 32) + 0.4, 'clink', { gain: 0.6 });
  for (const [, tt] of GOODS) cue(tt, 'pop', { gain: 0.5 });
}

/** a small factory building with the VOC flag (cut paper), ground centre (0, 0) */
function factory(x, y, t) {
  K.cut(K.P_rr(x - 120, y - 150, 240, 150, 4), '#B9A98C'); K.cut(K.P_poly([[x - 140, y - 146], [x, y - 230], [x + 140, y - 146]]), '#7A4B33');
  for (const dx of [-60, 60]) { ctx.fillStyle = P.ink; ctx.fillRect(x + dx - 18, y - 110, 36, 46); }
  A.flag(x + 110, y - 190, 0.7, 'voc', t, 110);
}
