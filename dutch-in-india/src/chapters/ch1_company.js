// CH1 · "1596: A Company That Could Go to War" (0:20-0:57): Houtman reaches Java, the war with Spain, the VOC and its powers.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, line } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as SC from '../core/scenes.js';
import { certificate } from './ch0_intro.js';
const { P } = K, { PL, VIEWS, F } = A, G = SC.GROUND;

const ROUTE = [PL.amsterdam, [-12, 44], [-20, 15], [-8, -5], [8, -25], PL.cape, [40, -38], [75, -30], [100, -12], PL.bantam];
const vEurope = A.view(2, 47, 46), vJava = A.view(112, -3, 50);

/** a crown: kind 'pt' (gold, royal-blue cross jewel) or 'es' (gold, crimson jewel) */
function crown(x, y, s, kind) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.cut(K.P_poly([[-140, 0], [-160, -170], [-80, -90], [0, -200], [80, -90], [160, -170], [140, 0]]), P.gold);
  K.cut(K.P_rr(-150, -20, 300, 50, 10), '#A87A22', { shadow: 0.3, edge: 4 });
  if (kind === 'pt') { ctx.fillStyle = P.royal; ctx.fillRect(-14, -120, 28, 90); ctx.fillRect(-45, -90, 90, 28); } else { K.cut(K.P_circ(0, -80, 30), P.crimson, { shadow: 0, edge: 3 }); }
  ctx.restore();
}
function fist(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  K.cut(K.P_rr(-260, -50, 200, 100, 20), F.orange); K.cut(K.P_rr(-80, -80, 160, 160, 40), F.orange);
  ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 5; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(40, i * 42 - 18); ctx.lineTo(80, i * 42 - 18); ctx.stroke(); }
  ctx.restore();
}
function cannon(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-110, -40, 220, 60, 28), P.ink); K.cut(K.P_circ(-40, 30, 40), '#7A5636'); K.cut(K.P_circ(-40, 30, 12), P.ink, { shadow: 0, edge: 2 }); ctx.restore(); }
function ledgerPage(x, y, s, cols, ticks) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-420, -260, 840, 520, 8), '#F3E9D2');
  ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -230); ctx.lineTo(0, 230); ctx.stroke();
  cols.forEach((c, i) => { ctx.font = '700 56px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c, (i - 0.5) * 420, -180); for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo((i - 0.5) * 420 - 150, -90 + r * 70); ctx.lineTo((i - 0.5) * 420 + 150, -90 + r * 70); ctx.stroke(); } });
  ticks.forEach((k, i) => { if (k <= 0) return; ctx.save(); ctx.translate((i - 0.5) * 420, 120); ctx.strokeStyle = P.crimson; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-60 + 40 * clamp(k * 2), 40 * clamp(k * 2)); if (k > 0.5) ctx.lineTo(-20 + 100 * clamp(k * 2 - 1), 40 - 120 * clamp(k * 2 - 1)); ctx.stroke(); ctx.restore(); });
  ctx.restore();
}
const PENNANTS = [P.sepia, P.wine, P.royal, P.forest, P.stoneDark, '#7A4B33'];
function pennant(x, y, s, c, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-4, -200, 8, 200, 3), P.ink, { shadow: 0.3, edge: 2 }); K.cut(() => { ctx.beginPath(); ctx.moveTo(4, -196); ctx.lineTo(130, -160 + Math.sin(t * 5) * 6); ctx.lineTo(4, -124); ctx.closePath(); }, c, { shadow: 0.4, edge: 3 }); ctx.restore(); }

export default function ch1({ add, cue, at, Wd }) {
  // 8 · "In 1596," : world map, gold ribbon drops
  { const st = at(8);
    add({ id: 'C1_1596', at: st, zoom: 0.03, note: 'world map, ribbon 1596', draw(lt, d, t) { A.realMap(VIEWS.world, { seed: 8 }); K.ribbon('1596', W / 2, 260, eob(seg(lt, 0.05, 0.45)), 96); } });
    cue(st + 0.05, 'sparkle', { dur: 0.6, gain: 0.5 }); }
  // 9 · "Cornelis de Houtman's ships reached Java," : the route draws; Houtman inset
  { const st = at(9);
    add({ id: 'C1_route', at: st, zoom: 0.03, note: 'route Amsterdam > Cape > Java draws; Houtman inset', draw(lt, d, t) {
      const v = VIEWS.world; A.realMap(v, { seed: 8 }); A.pin(v, PL.amsterdam, 'AMSTERDAM', 1, { dy: -50 });
      const hd = A.route(v, ROUTE, eio(seg(lt, 0.1, d + 0.3)), 0); A.indiaman(hd[0], hd[1] - 6, 0.12, 0, t);
      A.person({ x: 230, y: 840, h: 360, who: 'houtman', dir: 1, arm: 30 }); A.tornSlip('CORNELIS DE HOUTMAN', 300, 160, eob(seg(lt, 0.3, 0.6)), 36);
    } });
    cue(st + 0.1, 'quill', { dur: 2.4 }); }
  // 10 · "and the Dutch had their own route to the spices." : zoom on Java; ship at BANTAM; the Moluccas glow
  { const st = at(10), sp = Wd('spices', 10) - st;
    add({ id: 'C1_bantam', at: st, zoom: 0.03, note: 'ship at BANTAM, Moluccas glow', draw(lt, d, t) {
      const v = A.vlerp(VIEWS.world, vJava, eio(clamp(lt / (d * 0.7)))); A.realMap(v, { seed: 10 });
      A.onLand(v, () => A.tint(v, [128.5, -2], 4, P.gold, 0.6 * seg(lt, sp, sp + 0.5)));
      const [x, y] = A.px(v, PL.bantam); A.indiaman(x - 40, y + 30, lerp(0.12, 0.3, eio(clamp(lt / (d * 0.7)))), 0, t);
      A.pin(v, PL.bantam, 'BANTAM', eob(seg(lt, 0.8, 1.1)), { dx: 120, dy: 60 });
      A.pin(v, PL.amboyna, 'SPICE ISLANDS', eob(seg(lt, sp, sp + 0.3)), { dy: -60 });
    } });
    cue(st + 0.8, 'pop', { gain: 0.5 }); cue(st + sp, 'sparkle', { dur: 0.8, gain: 0.5 }); }
  // 11 · "Back home, they were fighting Spain for independence," : Europe; Dutch flag faces the Spanish flag
  { const st = at(11), sp = Wd('spain', 11) - st;
    add({ id: 'C1_spain', at: st, zoom: 0.04, note: 'Europe: Dutch tricolour faces Spain', draw(lt, d, t) {
      const v = vEurope; A.realMap(v, { seed: 11 });
      const [nx, ny] = A.px(v, [5.3, 52.2]), [sx, sy] = A.px(v, [-3.7, 40.4]);
      A.flag(nx, ny + 20, eob(seg(lt, 0.1, 0.4)) * 1.0, 'voc', t, 120); A.flag(sx, sy + 20, eob(seg(lt, sp, sp + 0.3)) * 1.0, 'spain', t, 120);
      if (lt > sp + 0.3) { ctx.save(); ctx.setLineDash([16, 14]); line([[nx - 20, ny + 60], [sx + 60, sy - 160]], P.crimson, 7); ctx.restore(); }
      A.tornSlip('INDEPENDENCE?', 1500, 470, eob(seg(lt, sp + 0.4, sp + 0.7)), 52);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + sp, 'pop'); }
  // 12 · "and Spain now ruled Portugal too," : the Spanish crown drops onto the Portuguese crown
  { const st = at(12), po = Wd('portugal', 12) - st;
    add({ id: 'C1_crowns', at: st, zoom: 0.05, note: 'Spanish crown drops onto the Portuguese crown', draw(lt, d, t) {
      K.parchment(12); crown(W / 2, 720, 1.4, 'pt'); A.tornSlip('PORTUGAL', W / 2, 800, 1, 40);
      const k = eo(seg(lt, po - 0.5, po + 0.1)); crown(W / 2, lerp(150, 470, k), 1.2 * clamp(k * 4), 'es'); if (k > 0.9) A.tornSlip('SPAIN', W / 2, 520, 1, 40);
    } });
    cue(st + po + 0.1, 'thud', { gain: 0.7 }); }
  // 13 · "so hurting the Portuguese in Asia" : an orange paper fist knocks a coin off the stacked crowns
  { const st = at(13), hit = Wd('portuguese', 13) - st;
    add({ id: 'C1_fist', at: st, zoom: 0.06, note: 'orange fist knocks a coin off the crowns', draw(lt, d, t) {
      K.parchment(13); crown(W / 2, 720, 1.4, 'pt'); crown(W / 2, 470, 1.2, 'es');
      const fk = eob(seg(lt, hit - 0.3, hit)); fist(lerp(-200, 560, fk), 560, 1.1);
      const ck = seg(lt, hit, hit + 0.9); const cx = lerp(1060, 1600, ck), cy = 560 - Math.sin(ck * Math.PI) * 300 + ck * 120; A.icon('coins', ck > 0 ? cx : 1060, ck > 0 ? cy : 560, 1.4);
      if (lt > hit) A.tornSlip('ASIA', 1600, 230, eob(seg(lt, hit + 0.2, hit + 0.5)), 48);
    } });
    cue(st + hit, 'slam', { gain: 0.5 }); cue(st + hit + 0.6, 'clink'); }
  // 14 · "was business and revenge at once." : ledger PROFIT / REVENGE, both ticked
  { const st = at(14), b = Wd('business', 14) - st, r = Wd('revenge', 14) - st;
    add({ id: 'C1_ledger', at: st, zoom: 0.05, note: 'ledger PROFIT / REVENGE, both ticked', draw(lt, d, t) { K.parchment(14); ledgerPage(W / 2, 470, 1.1, ['PROFIT', 'REVENGE'], [seg(lt, b, b + 0.4), seg(lt, r, r + 0.4)]); } });
    cue(st + b, 'quill', { dur: 0.4 }); cue(st + r, 'quill', { dur: 0.4 }); }
  // 15 · "In 1602, the Dutch government" : Amsterdam, gold ribbon 1602; the era bar steps to 1602
  { const st = at(15);
    add({ id: 'C1_1602', at: st, zoom: 0.04, era: [0, 1, 0.1, 0.9], note: 'Amsterdam, ribbon 1602, States-General slip', draw(lt, d, t) {
      SC.amsterdam(t, A.camAt(lt, d, { x: 300 }, { x: 420, zoom: 1.04 })); K.ribbon('1602', W / 2, 250, eob(seg(lt, 0.1, 0.5)), 96);
      A.tornSlip('THE STATES-GENERAL', W / 2, 420, eob(seg(lt, 0.8, 1.1)), 44);
    } });
    cue(st + 0.1, 'sparkle', { dur: 0.6, gain: 0.5 }); }
  // 16 · "merged its rival trading firms into one:" : six company pennants slide together
  { const st = at(16), m = Wd('merged', 16) - st;
    add({ id: 'C1_merge', at: st, zoom: 0.03, era: 1, note: 'six company pennants slide together', draw(lt, d, t) {
      K.parchment(16); const k = eio(seg(lt, m + 0.2, d + 0.2));
      PENNANTS.forEach((c, i) => pennant(lerp(200 + i * 300, 880 + i * 40, k), 720, 1.4, c, t + i));
    } });
    cue(st + m + 0.2, 'slide', { dur: 1.6, gain: 0.5 }); }
  // 17 · "the Dutch East India Company." : the pennants fuse into the gold VOC seal
  { const st = at(17), c = Wd('company', 17) - st;
    add({ id: 'C1_voc', at: st, zoom: 0.05, era: 1, note: 'pennants fuse into the VOC seal', draw(lt, d, t) {
      K.parchment(17); const k = seg(lt, 0, c);
      if (k < 1) PENNANTS.forEach((col, i) => { ctx.save(); ctx.globalAlpha = 1 - k; pennant(lerp(880 + i * 40, W / 2, k), 720, 1.4 * (1 - k * 0.6), col, t + i); ctx.restore(); });
      A.goldSeal(W / 2, 470, lt > c ? lerp(1.9, 1.6, eo(seg(lt, c, c + 0.15))) : 0); A.tornSlip('THE VOC', W / 2, 760, eob(seg(lt, c + 0.2, c + 0.5)), 52);
    } });
    cue(st + c, 'thud', { gain: 0.8 }); }
  // 18 · "Ordinary citizens could buy shares." : a queue of citizens, share certificates pass along
  { const st = at(18), sh = Wd('shares', 18) - st;
    add({ id: 'C1_shares', at: st, zoom: 0.03, era: 1, note: 'queue of citizens with share certificates', draw(lt, d, t) {
      const cam = A.camAt(lt, d, { x: -60 }, { x: 60 }); SC.amsterdam(t, { x: 600, zoom: 1 });
      ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      A.layer(cam, 1, () => { for (let i = 0; i < 6; i++) A.person({ x: 260 + i * 260, y: G, h: 420, who: i % 2 ? 'citizen' : 'envoy', dir: -1, arm: lt > sh + i * 0.12 ? 60 : 10, prop: lt > sh + i * 0.12 ? 'certificate' : null }); });
      certificate(1700, 330, 0.5, false);
    } });
    cue(st + sh, 'rustle', { gain: 0.6 }); }
  // 19 · "And it could do what few companies ever had:" : the VOC director opens his ledger
  { const st = at(19);
    add({ id: 'C1_director', at: st, cam: [700, 520], zoom: 0.07, era: 1, note: 'VOC director opens the ledger', draw(lt, d, t) {
      K.parchment(19); K.hall(); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      A.person({ x: 640, y: G, h: 600, who: 'director', dir: 1, arm: lerp(20, 60, eo(seg(lt, 0.2, 0.8))) });
      A.goldSeal(1350, 360, 0.9);
    } });
    cue(st + 0.2, 'rustle', { gain: 0.5 }); }
  // 20-21 · "build forts, sign treaties, mint coins, and wage war." : four icons pop one per word
  const POW = [['forts', 20, (x, y, t) => A.fort(x, y + 150, 0.62, 'voc', t), 'FORTS'], ['treaties', 20, (x, y) => A.scroll(x, y, 0.62, 1, [{ kind: 'voc', s: 1 }]), 'TREATIES'], ['coins', 21, (x, y) => A.icon('coins', x, y, 3.6), 'COINS'], ['war', 21, (x, y) => cannon(x, y + 40, 2.0), 'WAR']];
  [20, 21].forEach((li) => { const st = at(li);
    add({ id: 'C1_powers' + li, at: st, zoom: li === 20 ? 0.04 : 0.06, era: 1, note: li === 20 ? 'icons pop: fort, treaty' : 'icons pop: coin, cannon; all four line up', draw(lt, d, t) {
      K.parchment(20 + li); const T0 = st + lt;
      POW.forEach(([w, l, fn, lab], i) => { const tw = Wd(w, l); if (T0 < tw) return; const k = eob(seg(T0, tw, tw + 0.3)), x = 300 + i * 440, y = 450; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(x, y, t); ctx.restore(); A.tornSlip(lab, x, 760, k, 44); });
    } });
    POW.filter((p) => p[1] === li).forEach(([w]) => cue(Wd(w, li), w === 'war' ? 'cannon' : 'pop', { gain: w === 'war' ? 0.5 : 0.7 })); });
}
