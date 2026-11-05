// CH8 · "1825: Exit, Quietly" (4:35-5:10): posts flip to Britain, the seal cracks (1799), the 1824 treaty, the trade loop
// un-draws, the ship leaves, De Lannoy watches from the beach. Last 20 s: the bottom-right 420x260 stays empty.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;

const POSTS = [['surat', 'SURAT'], ['chinsura', 'CHINSURA'], ['masulipatnam', ''], ['pulicat', ''], ['nagapattinam', ''], ['cochin', '']];
const v = VIEWS.wide;
function postsMap(T0, t, flipStart, step, o = {}) { A.realMap(v, { seed: 100 }); A.onLand(v, () => A.tint(v, [118, -3], 9, P.gold, o.gold ?? 0));
  POSTS.forEach(([k, label], i) => { const f = flipStart == null ? 0 : seg(T0, flipStart + i * step, flipStart + i * step + 0.35); const [x, y] = A.px(v, PL[k]); ctx.save(); ctx.globalAlpha = o.dim ?? 1; ctx.translate(x, y); ctx.scale(Math.max(0.05, Math.abs(Math.cos(f * Math.PI))), 1); A.flag(0, 0, 0.5, f < 0.5 ? 'voc' : 'en', t + i, 90); ctx.restore(); if (label && o.labels) K.slip(label, x + (k === 'surat' ? -110 : 120), y - 20, 1, 0, 30); }); }

export default function ch8({ add, cue, at, Wd }) {
  const s100 = at(100), s101 = at(101), s102 = at(102), s103 = at(103), flip0 = Wd('british', 102) + 0.1;
  add({ id: 'C8_fade', at: s100, zoom: 0.02, note: 'wide map; Dutch flags in India dim', draw(lt, d, t) { postsMap(s100 + lt, t, null, 0, { dim: lerp(1, 0.55, seg(lt, 0.3, d)) }); A.tornSlip('THE DUTCH FADE', 960, 230, eob(seg(lt, 0.2, 0.5)), 48); } });
  add({ id: 'C8_indonesia', at: s101, cam: [1400, 600], zoom: 0.06, note: 'the Indonesian side glows gold', draw(lt, d, t) { postsMap(s101 + lt, t, null, 0, { dim: 0.55, gold: 0.5 * seg(lt, 0, 1.2) }); A.tornSlip('THE REAL PROFITS', 1400, 300, eob(seg(lt, 0.4, 0.7)), 48); } });
  add({ id: 'C8_flip', at: s102, zoom: 0.03, note: 'India flags flip to British one by one', draw(lt, d, t) { postsMap(s102 + lt, t, flip0, 0.32, { gold: 0.5, labels: true }); K.ribbon('1795', 1400, 250, eob(seg(lt, 0.1, 0.45)), 80); } });
  add({ id: 'C8_posts', at: s103, cam: [700, 520], zoom: 0.07, note: 'last flips; ribbon 1795', draw(lt, d, t) { postsMap(s103 + lt, t, flip0, 0.32, { gold: 0.5, labels: true }); K.ribbon('1795', 1400, 250, 1, 80); } });
  cue(s102 + 0.1, 'sparkle', { dur: 0.6, gain: 0.4 }); POSTS.forEach((_, i) => cue(flip0 + i * 0.32, 'whoosh', { gain: 0.3 }));
  // 104 · "The company was wound up in 1799." : the VOC seal fills the frame, then cracks
  { const st = at(104), wd = Wd('wound', 104) - st;
    add({ id: 'C8_crack', at: st, zoom: 0.05, note: 'the VOC seal fills the frame, then cracks in two (1799)', draw(lt, d, t) { K.parchment(104); A.goldSeal(W / 2, 470, 2.6, 'VOC', eo(seg(lt, wd, wd + 0.8))); K.ribbon('1799', 1450, 690, eob(seg(lt, Wd('seventeen', 104) - st, Wd('seventeen', 104) - st + 0.4)), 72); } });
    cue(st + wd, 'slam', { gain: 0.6 }); }
  // 105 · "By a treaty with Britain in 1824," : a treaty scroll with two seals
  { const st = at(105), tr = Wd('treaty', 105) - st;
    add({ id: 'C8_1824', at: st, zoom: 0.04, note: 'treaty scroll, two seals; ribbon 1824', draw(lt, d, t) { K.parchment(105); A.scroll(860, 470, 0.85, eio(seg(lt, tr - 0.2, tr + 0.6)), [{ kind: 'voc', s: eob(seg(lt, 1.2, 1.4)) }, { kind: 'en', letter: 'GB', s: eob(seg(lt, 1.5, 1.7)) }], '1824'); K.ribbon('1824', 1450, 300, eob(seg(lt, Wd('eighteen', 105) - st, Wd('eighteen', 105) - st + 0.4)), 80); A.tornSlip('ANGLO-DUTCH TREATY', 1450, 470, eob(seg(lt, 0.8, 1.1)), 40); } });
    cue(st + tr, 'rustle'); cue(st + 1.2, 'thud', { gain: 0.5 }); cue(st + 1.5, 'thud', { gain: 0.5 }); }
  // 106 · two shots: the remaining flags go; then on "handing" the trade loop un-draws and the era bar lands on 1825
  { const st = at(106), hd = Wd('handing', 106) - 0.05, e = at(107);
    const NA = () => A.px(v, [81.8, 15.5]), NB = () => A.px(v, [128.5, -3]), NC = [960, 215];
    add({ id: 'C8_rest', at: st, zoom: 0.03, note: 'the last flags go', draw(lt, d, t) { A.realMap(v, { seed: 106 }); A.onLand(v, () => A.tint(v, [118, -3], 9, P.gold, 0.5)); POSTS.forEach(([k], i) => { const [x, y] = A.px(v, PL[k]); ctx.save(); ctx.globalAlpha = 1 - seg(lt, 0.2 + i * 0.1, 0.6 + i * 0.1); A.flag(x, y, 0.5, 'en', t + i, 90); ctx.restore(); }); A.tornSlip('THE REST HANDED OVER', 960, 230, eob(seg(lt, 0.2, 0.5)), 44); } });
    add({ id: 'C8_undraw', at: hd, zoom: 0.03, note: 'the trade loop un-draws; era bar lands on 1825', draw(lt, d, t) { A.realMap(v, { seed: 106 }); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); A.tradeLoop(NA(), NB(), NC, 3 * (1 - eio(seg(lt, 0.1, d))), (hd + lt) * 0.3, [], { bend: -120, iconScale: 1.1 }); K.ribbon('1825', 760, 470, eob(seg(lt, Wd('eighteen', 106) - hd, Wd('eighteen', 106) - hd + 0.4)), 90); } });
    cue(hd, 'quill', { dur: 1.6 }); cue(Wd('eighteen', 106), 'sparkle', { dur: 0.6, gain: 0.5 }); }
  // 107-108 · "They came to India for trade, not empire, and they left the same way." : the VOC ship turns and sails off right
  { const s0 = at(107), s1 = at(108);
    const sea = (T0, t) => { const k = seg(T0, s0, s1 + 1.6); SC.sky({ x: 0, y: 0, zoom: 1 }, 0.4, 107); A.waves(t, 600, 1, 60, 8); A.indiaman(lerp(700, 1500, eio(k)), 650, lerp(0.55, 0.3, k), Math.sin(t * 1.3) * 0.02, t, { dir: 1 }); A.waves(t, 680, 2, 60, 10); };
    add({ id: 'C8_trade', at: s0, zoom: 0.03, note: 'a VOC ship turns to leave; TRADE, NOT EMPIRE', draw(lt, d, t) { sea(s0 + lt, t); A.tornSlip('TRADE', 520, 260, eob(seg(lt, Wd('trade', 107) - s0, Wd('trade', 107) - s0 + 0.3)), 56, P.crimson); A.tornSlip('NOT EMPIRE', 520, 390, eob(seg(lt, Wd('empire', 107) - s0, Wd('empire', 107) - s0 + 0.3)), 44); } });
    add({ id: 'C8_leave', at: s1, cam: [1000, 500], zoom: 0.05, note: 'the ship sails off right', draw(lt, d, t) { sea(s1 + lt, t); } });
    cue(s0, 'waves', { dur: 4, gain: 0.5 }); }
  // 109 · De Lannoy in Travancore green watches the ship go from the dusk beach
  { const st = at(109);
    add({ id: 'C8_watch', at: st, zoom: 0.03, note: 'dusk beach: De Lannoy in Travancore green watches the ship go', draw(lt, d, t) { SC.beach(t, A.camAt(lt, d, { x: 60 }, { x: 0, zoom: 1.03 }), 0.55, { ship: lerp(1250, 1400, lt / d), shipSails: 1, figures: () => A.person({ x: 620, y: G, h: 520, who: 'delannoyT', dir: 1, arm: 10 }) }); } });
    cue(st, 'waves', { dur: 3, gain: 0.5 }); }
  // 110 · end card: title slip + ribbon top-left; bottom-right 420x260 left empty for the end screen
  { const st = at(110);
    add({ id: 'C8_end', at: st, zoom: 0.02, era: false, hold: true, note: 'end card: title + ribbon top-left; bottom-right empty', draw(lt, d, t) { SC.beach(t, { x: 0, y: 0, zoom: 1.03 }, 0.65, { ship: 1420 }); ctx.save(); ctx.globalAlpha = 0.55 * seg(lt, 0, 0.6); ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      K.ribbon('1596 – 1825', 560, 220, eob(seg(lt, 0.2, 0.5)), 72); A.tornSlip('TRADERS, NOT RULERS', 560, 380, eob(seg(lt, 0.4, 0.7)), 72); A.tornSlip('The Dutch in India', 560, 510, eob(seg(lt, 0.6, 0.9)), 44); A.goldSeal(1050, 380, eob(seg(lt, 0.8, 1.0)) * 0.6); } });
    cue(st + 0.8, 'thud', { gain: 0.6 }); }
}
