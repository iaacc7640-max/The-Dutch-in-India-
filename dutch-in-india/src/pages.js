// Review pages drawn with the kit (index.html?page=cast | kit | maps). Captured with:
//   QS='&page=cast' node tools/capture.mjs frames review/cast "0"
import { ctx, W, H } from './core/lib.js';
import * as K from './core/kit.js';
import * as A from './core/atlas.js';
const { P } = K;

function head(title, sub, y = 110) {
  K.parchment(21);
  ctx.font = '700 56px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(title, 96, y);
  ctx.font = '700 26px Caladea'; ctx.fillStyle = P.sepia; ctx.fillText(sub, 96, y + 40);
}
const tag = (t, x, y) => { ctx.font = '700 24px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); };

export const PAGES = {
  cast() {
    head('Traders, Not Rulers: the cast', 'Original Paper Atlas figures. No faces: each is told apart by costume, colour and prop.');
    const row1 = [['houtman', 'Cornelis de Houtman'], ['director', 'VOC director'], ['weaver', 'Coromandel weaver'], ['factor', 'English factor'], ['samurai', 'Japanese soldier (guard)'], ['rheede', 'Hendrik van Rheede'], ['achudan', 'Itty Achudan']];
    const row2 = [['scholar', 'Konkani scholar'], ['varma', 'Marthanda Varma'], ['delannoy', 'De Lannoy (Dutch)'], ['delannoyT', 'De Lannoy (Travancore)'], ['jafar', 'Mir Jafar'], ['forde', 'Col. Francis Forde'], ['travSoldier', 'Travancore soldier']];
    const xs = (i) => 190 + i * 257;
    row1.forEach(([k, n], i) => { A.person({ x: xs(i), y: 545, h: 330, who: k, arm: k === 'achudan' || k === 'director' ? 50 : 8 }); tag(n, xs(i), 575); });
    row2.forEach(([k, n], i) => { A.person({ x: xs(i), y: 960, h: 330, who: k, arm: k === 'scholar' ? 50 : 8 }); tag(n, xs(i), 990); });
  },
  kit() {
    head('Traders, Not Rulers: kit', 'Flags, seals, era bar (top), props and the trade loop, all cut paper.', 180);
    ['voc', 'pt', 'en', 'trav', 'bengal', 'spain', 'white'].forEach((f, i) => { A.flag(150 + i * 150, 430, 1.1, f, 0.5); tag(['VOC', 'PORTUGAL', 'ENGLAND', 'TRAVANCORE', 'BENGAL', 'SPAIN', 'TRUCE'][i], 200 + i * 150, 455); });
    A.goldSeal(1260, 330, 0.9); tag('VOC SEAL', 1260, 440); A.goldSeal(1480, 330, 0.8, 'VOC', 0.6); tag('SEAL CRACKS (1799)', 1490, 440);
    A.eraBar(3, 0.375);
    A.indiaman(300, 760, 0.55, 0, 0.5); tag('EAST INDIAMAN', 300, 800);
    A.handloom(640, 760, 0.6, 0.3); tag('HANDLOOM', 640, 800);
    A.fort(950, 760, 0.45, 'voc', 0.5); tag('FORT', 950, 800);
    A.scroll(1200, 660, 0.36, 1, [{ kind: 'voc', s: 1 }, { kind: 'trav', s: 1 }], '1753'); tag('TREATY', 1200, 800);
    A.candle(1380, 760, 0.8, 1, 0.3); tag('CANDLE', 1380, 800);
    ['cloth', 'nutmeg', 'clove', 'pepper', 'coins', 'copper', 'indigo', 'silk', 'saltpetre', 'opium', 'rice'].forEach((k, i) => A.icon(k, 1500 + (i % 4) * 95, 560 + Math.floor(i / 4) * 100, 0.8));
    A.tradeLoop([220, 980], [700, 960], [460, 880], 3, 0.7, ['indigo'], { bend: 30, iconScale: 0.5 });
    tag('TRADE LOOP (mini)', 460, 1030);
    A.tornSlip('A Company That Could Go to War', 1250, 960, 0.6, 64);
  },
  card() { K.parchment(5); A.chapterCard(+(new URLSearchParams(location.search).get('ct') || 1.2), 1741, 'The Battle of Colachel'); },
  thumb() {   // YouTube thumbnail: wide map + VOC ship + 1741 ribbon + Marthanda Varma
    const v = A.view(96, 8, 17); A.realMap(v, { seed: 7 }); ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = P.parch; ctx.fillRect(0, 0, W, H); ctx.restore();
    A.route(v, [[128.5, -3], [100, -4], [80.3, 8], [77.26, 8.17]], 1, 0);
    A.indiaman(1180, 700, 0.6, -0.04, 0.4);
    A.person({ x: 460, y: 1010, h: 780, who: 'varma', dir: 1, arm: 35 });
    K.ribbon('1741', 1330, 175, 1, 115);
    A.tornSlip('TRADERS, NOT RULERS', 1300, 900, 1, 92);
  },
  maps() {
    const v = A.VIEWS.wide; A.realMap(v);
    for (const [k, t, o] of [['amsterdam', 'AMSTERDAM'], ['bantam', 'BANTAM'], ['masulipatnam', 'MASULIPATNAM', { dx: 80 }], ['pulicat', 'PULICAT', { dx: 70, dy: -40 }], ['nagapattinam', 'NAGAPATTINAM', { dx: 90, dy: 10 }], ['cochin', 'COCHIN', { dx: -70, dy: 0 }], ['colachel', 'COLACHEL', { dx: -40, dy: 40 }], ['surat', 'SURAT', { dx: -50 }], ['chinsura', 'CHINSURA', { dy: -50 }], ['batavia', 'BATAVIA', { dy: 50 }], ['amboyna', 'AMBOYNA']]) A.pin(v, A.PL[k], t, 1, o || {});
  },
  world() { const v = A.VIEWS.world; A.realMap(v); A.route(v, [A.PL.amsterdam, [-15, 30], [-10, 0], A.PL.cape, [60, -30], [95, -10], A.PL.bantam], 1, 0); for (const k of ['amsterdam', 'cape', 'bantam', 'amboyna']) A.pin(v, A.PL[k], k.toUpperCase(), 1); },
};
