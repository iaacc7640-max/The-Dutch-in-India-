// CH0 · cold open (0:00-0:20): the beach in 1741, the surrender, the recruit, then back to Amsterdam and the title.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, G = SC.GROUND;

/** page turn: the new page sweeps in from the right over the old one in `dur` s */
export function pageTurn(lt, dur, oldFn, newFn) {
  const k = eio(clamp(lt / dur)); if (k < 1) oldFn();
  ctx.save(); const ex = lerp(W + 200, -200, k); ctx.beginPath(); ctx.moveTo(ex, -100); ctx.lineTo(W + 400, -100); ctx.lineTo(W + 400, H + 100); ctx.lineTo(ex - 140 * (1 - k), H + 100); ctx.closePath(); ctx.clip(); newFn(); ctx.restore();
  if (k < 1) { ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = '#5A4632'; ctx.fillRect(ex - 34, -100, 34, H + 200); ctx.restore(); }
}

export default function ch0({ add, cue, at, Wd }) {
  // 0 · "In 1741, on a beach in southern India," : dusk beach, the white flag rises over the far stockade
  { const st = at(0), up = Wd('beach', 0) - st;
    const s2 = Wd('on', 0) - 0.05;
    add({ id: 'C0_beach', at: st, cam: [W / 2, H / 2], zoom: 0.03, note: 'dusk beach, wide, waves', draw(lt, d, t) {
      SC.beach(t, A.camAt(lt, d, { x: 140 }, { x: 60, zoom: 1.02 }), 0.55, { flag: 0 });
    } });
    add({ id: 'C0_beach2', at: s2, cam: [400, 560], zoom: 0.06, note: 'closer on the far stockade: the white flag rises', draw(lt, d, t) {
      SC.beach(t, A.camAt(lt, d, { x: -300, y: -40, zoom: 1.2 }, { x: -340, y: -50, zoom: 1.26 }), 0.55, { flag: seg(lt, up - (s2 - st) - 0.2, up - (s2 - st) + 1.6) });
    } });
    cue(0.1, 'waves', { dur: 4.2, gain: 0.8 }); cue(st + up + 0.2, 'slide', { dur: 1.4, gain: 0.5 }); }

  // 1 · "a Dutch commander surrendered to an Indian king." : two-shot, the sword handed over on "surrendered"
  { const st = at(1), sw = Wd('surrendered', 1) - st;
    add({ id: 'C0_twoshot', at: st, cam: [W / 2, 560], zoom: 0.05, note: 'two-shot: De Lannoy hands his sword to Marthanda Varma', draw(lt, d, t) {
      const k = eo(seg(lt, sw - 0.2, sw + 0.5));
      SC.beach(t, { x: -40, y: 0, zoom: 1.04 }, 0.5, { flag: 1, figures: () => {
        A.person({ x: 780, y: G, h: 520, who: 'delannoy', dir: 1, arm: lerp(12, 72, k), prop: 'swordOffer' });
        A.person({ x: 1160, y: G, h: 560, who: 'varma', dir: -1, arm: lerp(8, 40, seg(lt, sw + 0.3, sw + 0.9)) });
      } });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + sw + 0.3, 'thud', { gain: 0.45 }); }

  // 2 · "Then he did something stranger:" : push in on De Lannoy, a '?' slip pins on
  { const st = at(2), q = Wd('stranger', 2) - st;
    add({ id: 'C0_stranger', at: st, cam: [800, 520], zoom: 0.14, note: "push in on De Lannoy, '?' slip", draw(lt, d, t) {
      SC.beach(t, { x: -60, y: -10, zoom: 1.08 }, 0.5, { flag: 1, figures: () => A.person({ x: 820, y: G, h: 560, who: 'delannoy', dir: 1, arm: 10 }) });
      K.slip('?', 1010, 300, eob(seg(lt, q, q + 0.3)), 0.06, 90);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + q, 'pop', { gain: 0.6 }); }

  // 3 · "he joined that king's army," : the coat turns Travancore green, sword raised in salute, two soldiers behind
  { const st = at(3), j = Wd('joined', 3) - st;
    add({ id: 'C0_joined', at: st, cam: [W / 2, 520], zoom: 0.05, note: 'De Lannoy now in Travancore green, salutes; soldiers behind', draw(lt, d, t) {
      const swap = lt > j + 0.1;
      SC.beach(t, { x: 30, zoom: 1.05 }, 0.45, { flag: 1, figures: () => {
        for (const [x, s] of [[1150, 0.86], [1330, 0.82], [1500, 0.78]]) A.person({ x, y: G - 10, h: 470 * s / 0.86, who: 'travSoldier', dir: -1, arm: 4 });
        A.person({ x: 820, y: G, h: 560, who: swap ? 'delannoyT' : 'delannoy', dir: 1, arm: swap ? lerp(20, 150, eob(seg(lt, j + 0.1, j + 0.6))) : 12, prop: swap ? 'sword' : null });
        if (lt > j && lt < j + 0.25) { ctx.save(); ctx.globalAlpha = 0.6 * (1 - (lt - j) / 0.25); ctx.fillStyle = P.edge; ctx.beginPath(); ctx.ellipse(820, G - 300, 160, 320, 0, 0, 7); ctx.fill(); ctx.restore(); }
      } });
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + j + 0.1, 'pop', { gain: 0.6 }); }

  // 4 · "and served it for the rest of his life." : Udayagiri fort at dusk, years tick 1741 -> 1777
  { const st = at(4), lf = Wd('life', 4) - st;
    add({ id: 'C0_years', at: st, cam: [W / 2, 500], zoom: 0.06, note: 'Udayagiri fort silhouette, years tick 1741 to 1777', draw(lt, d, t) {
      SC.sky({ x: 0, y: 0, zoom: 1 }, 0.6, 21); A.stars(30, 3, 0.7);
      A.layer({ x: lerp(0, -60, lt / d), y: 0, zoom: 1 }, 0.5, () => { for (let i = 0; i < 5; i++) K.cut(K.P_poly([[-200 + i * 520, 720], [60 + i * 520, 470 + (i % 2) * 70], [320 + i * 520, 720]]), '#6E7B4C', { shadow: 0.4, edge: 4 }); });
      A.layer({ x: lerp(0, -100, lt / d), y: 0, zoom: 1 }, 0.9, () => { A.fort(960, 800, 0.9, 'trav', t, { wall: P.stoneDark, dark: '#7E6F57' }); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#6E5A40', { shadow: 0.5, edge: 5 }); });
      A.nightWash(0.55);
      const yr = Math.round(lerp(1741, 1777, eio(seg(lt, 0.1, Math.min(d - 0.2, lf + 0.2)))));
      K.ribbon(String(yr), W / 2, 230, eob(seg(lt, 0, 0.3)), 90);
      A.tornSlip('36 YEARS', W / 2, 400, eob(seg(lt, lf, lf + 0.3)), 52);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.1, 'tock', { gain: 0.5 }); cue(st + lf, 'pop', { gain: 0.6 }); }

  // 5 · "To see how he got there, we go back to Amsterdam," : page turn to the canal, lateral pan; era bar slides back to 1596
  { const st = at(5), back = Wd('back', 5) - st;
    add({ id: 'C0_amsterdam', at: st, cam: [W / 2, H / 2], zoom: 0.03, era: [6, 0, 0.3, 2.2], note: 'page turns to Amsterdam canal, lateral pan', draw(lt, d, t) {
      pageTurn(lt - 0.1, 0.55, () => SC.beach(t, { x: 30, zoom: 1.05 }, 0.45, { flag: 1 }), () => SC.amsterdam(t, A.camAt(lt, d + 1.4, { x: -80 }, { x: 220, zoom: 1.03 })));
      if (lt > back) A.tornSlip('AMSTERDAM', W / 2, 200, eob(seg(lt, back + 0.3, back + 0.6)), 54);
    } });
    cue(st + 0.1, 'rustle'); }

  // 6 · "and a very new idea:" : a paper spark bursts over the canal, then becomes a share certificate
  { const st = at(6), dur0 = at(7) - at(5);
    add({ id: 'C0_idea', at: st, cam: [W / 2, H / 2], zoom: 0.04, era: 0, note: 'a new idea: paper spark bursts, turns into a share certificate', draw(lt, d, t) {
      const lt5 = lt + (st - at(5)); SC.amsterdam(t, A.camAt(lt5, dur0 + 1.4, { x: -80 }, { x: 220, zoom: 1.03 }));
      ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.ink; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      const burst = eob(seg(lt, 0, 0.45)), morph = eio(seg(lt, d * 0.55, d)); ctx.save(); ctx.translate(W / 2, 450);
      ctx.save(); ctx.globalAlpha = 1 - morph; ctx.rotate(lt * 0.4); for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); K.cut(K.P_poly([[0, -60 * burst], [22, -260 * burst], [-22, -260 * burst]]), i % 2 ? P.edge : '#F2C14E', { shadow: 0.3, edge: 2 }); } ctx.restore();
      ctx.save(); ctx.globalAlpha = 1 - morph; K.cut(K.P_circ(0, 0, 90 * burst), '#F2C14E'); ctx.restore();
      if (morph > 0) { ctx.save(); ctx.scale(morph, morph); ctx.rotate(-0.03); certificate(0, 0, 1.0, false); ctx.restore(); }
      ctx.restore(); A.tornSlip('A NEW IDEA', W / 2, 160 + 60, eob(seg(lt, 0.2, 0.5)) * (1 - morph * 0.999), 60);
    } });
    cue(st, 'sparkle', { dur: 0.8, gain: 0.6 }); cue(st + 0.9, 'rustle', { gain: 0.5 }); }

  // 7 · "a company that could go to war." : the CH1 card itself ("1596: A Company That Could Go to War") turns in on
  //     these words; the card shot in the pause after continues it. "Traders, Not Rulers" now only closes the film.
  { const st = at(7);
    add({ id: 'C0_card', at: st, cam: [W / 2, H / 2], zoom: 0.02, era: false, note: 'card turns in: 1596, A Company That Could Go to War', draw(lt, d, t) {
      SC.amsterdam(t, { x: 220, y: 0, zoom: 1.03 }); A.chapterCard(lt, 1596, 'A Company That Could Go to War');
    } });
    cue(st, 'rustle'); cue(st + 0.75, 'thud', { gain: 0.7 }); }
}

/** a share certificate on parchment: ruled lines, a name line, the VOC seal (sealed = gold seal shown) */
export function certificate(x, y, s = 1, blank = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.cut(K.P_rr(-260, -170, 520, 340, 6), '#F3E9D2');
  ctx.strokeStyle = P.sepia; ctx.lineWidth = 4; ctx.strokeRect(-236, -146, 472, 292);
  ctx.font = '700 40px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SHARE', 0, -100);
  ctx.strokeStyle = 'rgba(62,44,30,0.45)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-190, -40 + i * 40); ctx.lineTo(190 - (i % 2) * 70, -40 + i * 40); ctx.stroke(); }
  if (!blank) A.goldSeal(170, 100, 0.5);
  ctx.restore();
}
