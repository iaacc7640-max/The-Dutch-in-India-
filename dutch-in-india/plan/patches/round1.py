# Review round 1 (user feedback, 2026-11-05): idea animation, title->company card, stand-offs, Spain/Portugal throne,
# Asia stand-off, coin minting, real-Amsterdam trade loop, India goods pins, Amboyna (symbolic), Cochin fort on land.
import pathlib, re
R = pathlib.Path(__file__).resolve().parents[2]
def between(f, a, b, new):
    p = R / f; s = p.read_text(); i = s.index(a); j = s.index(b, i); p.write_text(s[:i] + new + s[j:])
def rep(f, a, b):
    p = R / f; s = p.read_text(); assert a in s, (f, a[:70]); p.write_text(s.replace(a, b, 1))

# ── atlas: soldiers for the stand-offs, a Portuguese trader; an army row helper; a throne ──
rep('src/core/atlas.js', "  // extras\n", """  // extras
  dutchSoldier: { name: 'Dutch soldier', coat: F.blue, legs: P.ink, trim: F.orange, sash: F.orange, hat: 'brim', prop: 'spear' },
  spanishSoldier: { name: 'Spanish soldier', coat: P.wine, legs: P.ink, trim: P.gold, hat: 'cap', prop: 'spear' },
  ptSoldier: { name: 'Portuguese soldier', coat: P.royal, legs: P.ink, trim: F.white, hat: 'cap', prop: 'spear' },
  portuguese: { name: 'Portuguese man', coat: P.royal, legs: P.ink, trim: P.ink, collar: 1, hat: 'brim' },
""")
rep('src/core/atlas.js', "// ═════════════════════════ PROPS ═════════════════════════", """/** a block of soldiers (stand-off, never fighting): n figures in 2 ranks at (x, y), facing dir, with a flag */
export function army(x, y, n, who, dir, s, flagKind, t = 0) {
  for (let r = 1; r >= 0; r--) for (let i = 0; i < Math.ceil(n / 2); i++) person({ x: x - dir * i * 46 * s / 0.5 + r * 22 * dir, y: y - r * 18, h: 150 * s / 0.5, who, dir, arm: 4 });
  flag(x - dir * (Math.ceil(n / 2) * 46 * s / 0.5 + 20), y, 0.7 * s / 0.5, flagKind, t, 200 * s / 0.5);
}
/** a carved throne (cut paper) standing on (x, y) */
export function throne(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-150, -520, 300, 520, 20), P.wine); cut(P_rr(-190, -220, 380, 70, 14), '#5E2430'); cut(P_rr(-170, -150, 40, 150, 8), P.wine); cut(P_rr(130, -150, 40, 150, 8), P.wine); cut(P_poly([[-150, -520], [0, -620], [150, -520]]), P.wine); ctx.restore(); }

// ═════════════════════════ PROPS ═════════════════════════""")

# ── CH0: idea spark; the title becomes the "A Company That Could Go to War" card ──
between('src/chapters/ch0_intro.js', "  // 6 ·", "  // 7 ·", """  // 6 · "and a very new idea:" : a paper spark bursts over the canal, then becomes a share certificate
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

""")
between('src/chapters/ch0_intro.js', "  // 7 ·", "\n}\n", """  // 7 · "a company that could go to war." : the CH1 card itself ("1596: A Company That Could Go to War") turns in on
  //     these words; the card shot in the pause after continues it. "Traders, Not Rulers" now only closes the film.
  { const st = at(7);
    add({ id: 'C0_card', at: st, cam: [W / 2, H / 2], zoom: 0.02, era: false, note: 'card turns in: 1596, A Company That Could Go to War', draw(lt, d, t) {
      SC.amsterdam(t, { x: 220, y: 0, zoom: 1.03 }); A.chapterCard(lt, 1596, 'A Company That Could Go to War');
    } });
    cue(st, 'rustle'); cue(st + 0.75, 'thud', { gain: 0.7 }); }""")
rep('src/shots.js', "    if (!c.year) return; const st = Le(c.first - 1) + 0.05;\n    add({ id: 'CARD_' + c.id, at: st, card: true, zoom: 0.02, cam: [W / 2, H / 2], note: `chapter card ${c.year}: ${c.title}`, draw(lt, d, t) { A.chapterCard(lt, c.year, c.title); } });\n    cue(st, 'rustle'); cue(st + 0.75, 'thud', { gain: 0.6 });",
    "    if (!c.year) return; const st = Le(c.first - 1) + 0.05, cont = c.id === 'CH1' ? st - at(c.first - 1) : 0;   // CH1's card already turned in on line 7\n    add({ id: 'CARD_' + c.id, at: st, card: true, zoom: 0.02, cam: [W / 2, H / 2], note: `chapter card ${c.year}: ${c.title}`, draw(lt, d, t) { A.chapterCard(lt + cont, c.year, c.title); } });\n    if (!cont) { cue(st, 'rustle'); cue(st + 0.75, 'thud', { gain: 0.6 }); }")

# ── CH1: stand-off in Europe; Spain takes Portugal's throne; stand-off in Asia ──
between('src/chapters/ch1_company.js', "  // 11 ·", "  // 15 ·", """  // 11 · "Back home, they were fighting Spain for independence," : Europe map; Dutch and Spanish armies face off (no clash)
  { const st = at(11), sp = Wd('spain', 11) - st;
    add({ id: 'C1_spain', at: st, zoom: 0.04, note: 'Europe: Dutch and Spanish armies face off (stand-off)', draw(lt, d, t) {
      const v = vEurope; A.realMap(v, { seed: 11 }); const [nx, ny] = A.px(v, [5.3, 52.2]), [sx, sy] = A.px(v, [-3.7, 40.4]);
      const k1 = eo(seg(lt, 0.1, 1.2)), k2 = eo(seg(lt, sp, sp + 1.0));
      A.army(lerp(nx + 120, nx + 220, k1), lerp(ny + 60, ny + 200, k1), 8, 'dutchSoldier', 1, 0.5, 'voc', t);
      A.army(lerp(sx + 60, sx + 260, k2), lerp(sy + 40, sy - 60, k2), 8, 'spanishSoldier', -1, 0.5, 'spain', t + 1);
      if (lt > sp + 0.8) A.tornSlip('INDEPENDENCE?', 1450, 300, eob(seg(lt, sp + 0.8, sp + 1.1)), 52);
    } });
    cue(st + 0.1, 'tock', { gain: 0.4 }); cue(st + sp, 'tock', { gain: 0.4 }); cue(st + sp + 0.4, 'tock', { gain: 0.4 }); }
  // 12 · "and Spain now ruled Portugal too," : Portugal's throne; the Spanish crown takes the seat; flags both sides
  { const st = at(12), po = Wd('portugal', 12) - st;
    add({ id: 'C1_crowns', at: st, zoom: 0.05, note: "Spain takes Portugal's throne; Spanish and Portuguese flags", draw(lt, d, t) {
      K.hall(); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      A.throne(W / 2, 800, 1.0); A.flag(560, 800, 1.3, 'pt', t, 360); A.flag(1360, 800, 1.3 * eob(seg(lt, po - 0.3, po + 0.1)), 'spain', t + 1, 360);
      const k = eo(seg(lt, po - 0.5, po + 0.2)); crown(W / 2 + k * 260, 560 - k * 40, 0.75 * (1 - k * 0.3), 'pt'); crown(W / 2, lerp(120, 540, k), 0.85 * clamp(k * 4), 'es');
      A.tornSlip('PORTUGAL', 560, 230, 1, 40); A.tornSlip('SPAIN', 1360, 230, eob(seg(lt, po - 0.3, po)), 40);
    } });
    cue(st + po + 0.2, 'thud', { gain: 0.7 }); }
  // 13-14 · "so hurting the Portuguese in Asia was business and revenge at once." : Asia map; Dutch and Portuguese armies
  //          face off; then PROFIT and REVENGE slips pin over them
  { const s0 = at(13), s1 = at(14), b = Wd('business', 14), r = Wd('revenge', 14), vAsia = A.view(92, 8, 22);
    const asia = (T0, t) => { A.realMap(vAsia, { seed: 13 }); const [ix, iy] = A.px(vAsia, [76.3, 10]), [jx, jy] = A.px(vAsia, [106, -6]);
      const k1 = eo(seg(T0, s0 + 0.1, s0 + 1.0)), k2 = eo(seg(T0, Wd('portuguese', 13), Wd('portuguese', 13) + 0.9));
      A.army(lerp(jx - 40, jx - 230, k1), lerp(jy - 10, jy - 120, k1), 8, 'dutchSoldier', -1, 0.45, 'voc', t);
      A.army(lerp(ix + 40, ix + 230, k2), lerp(iy + 20, iy + 40, k2), 8, 'ptSoldier', 1, 0.45, 'pt', t + 1);
      A.tornSlip('ASIA', 1500, 250, eob(seg(T0, s0 + 0.2, s0 + 0.5)), 52); };
    add({ id: 'C1_asia', at: s0, zoom: 0.03, note: 'Asia map: Dutch and Portuguese armies face off (stand-off)', draw(lt, d, t) { asia(s0 + lt, t); } });
    add({ id: 'C1_motives', at: s1, cam: [960, 520], zoom: 0.06, note: 'same map: PROFIT and REVENGE slips pin on', draw(lt, d, t) { const T0 = s1 + lt; asia(T0, t);
      A.tornSlip('PROFIT', 760, 300, eob(seg(T0, b, b + 0.3)), 64, P.crimson, -0.04); A.tornSlip('REVENGE', 1180, 300, eob(seg(T0, r, r + 0.3)), 64, P.crimson, 0.04); } });
    cue(s0 + 0.1, 'tock', { gain: 0.4 }); cue(Wd('portuguese', 13), 'tock', { gain: 0.4 }); cue(b, 'pop'); cue(r, 'pop'); }
""")

# ── CH2: coin minting; trade loop on a map with the real Amsterdam; India goods pins ──
rep('src/chapters/ch2_cloth.js', "      A.layer(cam, 1, () => { K.cut(K.P_rr(1260, 640, 320, 170, 10), '#7A5636'); coinStack(1420, 645, 8, lt, c); });",
    "      A.layer(cam, 1, () => mint(1400, 800, lt, c, t));")
rep('src/chapters/ch2_cloth.js', "for (let i = 0; i < 8; i++) cue(st + c + i * 0.22 + 0.22, 'clink', { gain: 0.6 }); }",
    "for (let i = 0; i < 4; i++) { cue(st + c + i * 0.45 + 0.18, 'thud', { gain: 0.45 }); cue(st + c + i * 0.45 + 0.3, 'clink', { gain: 0.6 }); } }")
rep('src/chapters/ch2_cloth.js', "/** a small factory building", """/** the Pulicat mint: an anvil with a die; a paper hammer strikes on a beat and each strike pops out a stamped copper coin */
function mint(x, y, lt, c, t) {
  K.cut(K.P_rr(x - 120, y - 150, 240, 150, 10), '#5E4A3A'); K.cut(K.P_poly([[x - 170, y - 150], [x + 170, y - 150], [x + 130, y - 200], [x - 150, y - 200]]), '#4A3A2E');
  const n = lt < c ? 0 : Math.floor((lt - c) / 0.45) + 1, ph = lt < c ? 0 : ((lt - c) % 0.45) / 0.45, hit = lt >= c && ph < 0.3;
  if (lt > c) A.icon('copper', x, y - 214, 1.0);
  ctx.save(); ctx.translate(x + 160, y - 420); ctx.rotate(hit ? lerp(0.9, 0, eo(ph / 0.3)) : lerp(0, 0.9, eio((ph - 0.3) / 0.7))); K.cut(K.P_rr(-12, 0, 24, 230, 6), '#7A5636'); K.cut(K.P_rr(-150, 190, 160, 70, 10), P.stoneDark); ctx.restore();
  for (let i = 0; i < Math.min(n, 6); i++) { const tt = c + i * 0.45 + 0.15, k = eo(seg(lt, tt, tt + 0.35)); if (lt < tt) continue; A.icon('copper', lerp(x, x - 300 - (i % 3) * 30, k), lerp(y - 214, y - 30 - i * 14, k), 1.0); }
  A.tornSlip('COPPER COINS', x - 250, y - 470, eob(seg(lt, c, c + 0.3)), 40);
}
/** a small factory building""")
between('src/chapters/ch2_cloth.js', "  // 30-35 ·", "\n}\n", """  // 30-32 · THE TRADE LOOP on a map that shows Amsterdam where it really is: India -> Spice Islands -> Amsterdam -> India
  const v = A.view(66, 22, 11), NA = () => A.px(v, [81.8, 15.5]), NB = () => A.px(v, [128.5, -3]), NC = A.px(v, PL.amsterdam);
  const t30 = at(30), t32 = at(32);
  const legP = (t) => (t < t30 ? 0 : t < at(31) ? 0.15 + 0.85 * eio(seg(t, Wd('buy', 30), at(31) - 0.1)) : t < t32 ? 1 + eio(seg(t, Wd('trade', 31), at(32) - 0.1)) : 2 + eio(seg(t, Wd('sell', 32), Wd('europe', 32) + 0.4)));
  const phase = (t) => 0.32 * Math.max(0, t - (Wd('europe', 32) + 0.4));
  const loopShot = (i, id, note, camA, camB, extra) => add({ id, at: at(i), zoom: 0.02, note, draw(lt, d, t) {
    const T0 = at(i) + lt; const cam = A.camAt(lt, d, camA, camB);
    A.layer(cam, 1, () => {
      A.realMap(v, { seed: 30 }); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      A.onLand(v, () => { A.tint(v, [129, -3], 4, P.gold, 0.35); });
      A.pin(v, [81.8, 15.5], 'COROMANDEL', 1, { dx: -160, dy: 40 }); A.pin(v, [128.5, -3], 'SPICE ISLANDS', 1, { dx: 0, dy: -70 }); A.pin(v, PL.amsterdam, 'AMSTERDAM', 1, { dx: 190, dy: 10 });
      A.tradeLoop(NA(), NB(), NC, legP(T0), phase(T0), [], { bend: -90, iconScale: 1.0 });
      if (extra) extra(lt, d, t, T0);
    });
  } });
  loopShot(30, 'C2_loop1', 'TRADE LOOP: leg 1 India to Spice Islands, cloth', { x: 120, y: 60, zoom: 1.25 }, { x: 160, y: 80, zoom: 1.2 });
  loopShot(31, 'C2_loop2', 'TRADE LOOP: leg 2 Spice Islands to Amsterdam, spices', { x: 60, y: 0, zoom: 1.05 }, { x: 0, y: 0, zoom: 1.0 }, (lt) => {
    const n = Wd('nutmeg', 31) - at(31), c = Wd('cloves', 31) - at(31), p = Wd('pepper', 31) - at(31);
    [['nutmeg', n], ['clove', c], ['pepper', p]].forEach(([k, tt], j) => A.icon(k, 1500 + j * 110, 640, eob(seg(lt, tt, tt + 0.3)) * 1.1));
  });
  loopShot(32, 'C2_loop3', 'TRADE LOOP closes: coins back to India; loop turns', { x: -40, y: -20, zoom: 1.05 }, { x: 0, y: 0, zoom: 1.0 });
  cue(t30, 'whoosh', { gain: 0.4 }); cue(Wd('buy', 30), 'quill', { dur: 1.6 }); cue(Wd('trade', 31), 'quill', { dur: 1.6 }); cue(Wd('sell', 32), 'quill', { dur: 1.0 }); cue(Wd('europe', 32) + 0.4, 'clink', { gain: 0.6 });

  // 33-35 · the goods, pinned where the voice names them on a map of India, each riding to the Coromandel coast
  const vI = A.view(82, 20, 34), PORT = [81.13, 16.17];
  const GOODS = [['indigo', 'INDIGO · YAMUNA VALLEY', [78.0, 27.2], Wd('indigo', 33), { dx: -230, dy: -10 }], ['silk', 'SILK · BENGAL', [88.8, 23.6], Wd('silk', 33), { dx: 200, dy: 0 }],
    ['saltpetre', 'SALTPETRE · BIHAR', [85.3, 25.6], Wd('saltpetre', 34), { dx: 120, dy: -70 }], ['opium', 'OPIUM · GANGA VALLEY', [82.9, 25.2], Wd('opium', 35), { dx: -60, dy: 70 }], ['rice', 'RICE', [83.6, 24.9], Wd('rice', 35), { dx: 170, dy: 60 }]];
  const goodsShot = (i, id, note, camA, camB) => add({ id, at: at(i), zoom: 0.02, note, draw(lt, d, t) { const T0 = at(i) + lt, cam = A.camAt(lt, d, camA, camB);
    A.layer(cam, 1, () => { A.realMap(vI, { seed: 33 }); A.pin(vI, PORT, 'TO THE SPICE ISLANDS', 1, { dx: 270, dy: 40 });
      GOODS.forEach(([k, label, ll, tw, o]) => { if (T0 < tw - 0.05) return; const s = eob(seg(T0, tw - 0.05, tw + 0.25)); A.pin(vI, ll, label, s, o); const a = A.px(vI, ll), b = A.px(vI, PORT);
        ctx.save(); ctx.setLineDash([4, 14]); K.dashedRoute([a, [(a[0] + b[0]) / 2 + 40, (a[1] + b[1]) / 2], b], seg(T0, tw + 0.2, tw + 1.2)); ctx.restore();
        const u = ((T0 - tw) * 0.45) % 1; if (T0 > tw + 1.2) A.icon(k, lerp(a[0], b[0], u), lerp(a[1], b[1], u), 0.8); else A.icon(k, a[0] + 70, a[1] - 10, s * 0.9); }); });
  } });
  goodsShot(33, 'C2_goods1', 'India map: INDIGO (Yamuna valley), SILK (Bengal) pinned as named', { x: -40, y: 0, zoom: 1.05 }, { x: 0, y: -20, zoom: 1.1 });
  goodsShot(34, 'C2_goods2', 'India map: SALTPETRE (Bihar) pinned', { x: 60, y: -40, zoom: 1.2 }, { x: 80, y: -60, zoom: 1.25 });
  goodsShot(35, 'C2_goods3', 'India map: OPIUM and RICE (Ganga valley) pinned', { x: 20, y: -40, zoom: 1.15 }, { x: 0, y: 0, zoom: 1.0 });
  for (const [, , , tw] of GOODS) cue(tw, 'pop', { gain: 0.5 });""")

# ── CH3: symbolic confessions; three groups with their counts (no violence) ──
between('src/chapters/ch3_amboyna.js', "  // 41 ·", "  // 45 ·", """  // 41 · "After confessions taken under torture," : two prisoners sit with bound hands; an official writes CONFESSION and
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
      G3.forEach(([who, n, label, tw, cx], g) => { if (T0 < tw - 0.1) return; const fade = seg(T0, (G3[g + 1] ? G3[g + 1][3] : Wd('man', 44) + 0.2) - 0.3, (G3[g + 1] ? G3[g + 1][3] : Wd('man', 44) + 0.2) + 0.4);
        for (let i = 0; i < n; i++) { const k = eob(seg(T0, tw + i * 0.05, tw + 0.25 + i * 0.05)); if (k <= 0) continue; const col = i % 5, row = Math.floor(i / 5), x = cx + (col - (Math.min(n, 5) - 1) / 2) * 70 + row * 30, y = 700 + row * 90;
          ctx.save(); ctx.globalAlpha = 1 - 0.75 * fade; ctx.translate(x, y); ctx.scale(k, k); A.person({ x: 0, y: 0, h: 190, who, dir: 1, arm: 4, prop: null }); ctx.restore(); }
        A.tornSlip(label, cx, 340, eob(seg(T0, tw, tw + 0.3)), 52, fade > 0.5 ? P.ink : P.crimson); });
      const out = Wd('man', 44) + 0.3; A.candle(W / 2, 200 + 0, 0.5, T0 < out ? 1 : 0, t); if (T0 > out) A.nightWash(0.3 * seg(T0, out, out + 0.6)); };
    add({ id: 'C3_english', at: s1, zoom: 0.04, note: '10 ENGLISH appear, then fade to silhouettes', draw(lt, d, t) { groups(s1 + lt, t); } });
    add({ id: 'C3_japanese', at: s2, cam: [980, 600], zoom: 0.06, note: '9 JAPANESE appear', draw(lt, d, t) { groups(s2 + lt, t); } });
    add({ id: 'C3_portuguese', at: s3, cam: [1300, 600], zoom: 0.06, note: '1 PORTUGUESE; all fade; the candle goes out', draw(lt, d, t) { groups(s3 + lt, t); } });
    cue(Wd('ten', 42), 'pop', { gain: 0.4 }); cue(Wd('nine', 43), 'pop', { gain: 0.4 }); cue(Wd('one', 44), 'pop', { gain: 0.4 }); cue(Wd('man', 44) + 0.3, 'inhale', { dur: 0.5, gain: 0.4 }); }
""")

# ── CH4: Cochin fort on land, by the sea ──
p = R / 'src/chapters/ch4_forts.js'; s = p.read_text()
i = s.index("    add({ id: 'C4_cochin'"); j = s.index("    cue(st + 0.1, 'sparkle'", i)
s = s[:i] + """    add({ id: 'C4_cochin', at: st, zoom: 0.04, note: 'Cochin: the fort on the shore by the sea; its flag swaps to the tricolour', draw(lt, d, t) { const cam = A.camAt(lt, d, { x: -50 }, { x: 50 }); SC.sky(cam, 0, 56);
      A.layer(cam, 0.4, () => A.waves(t, 600, 2, 60, 8));
      A.layer(cam, 0.85, () => { K.cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 200); ctx.lineTo(-400, 690); ctx.lineTo(1150, 700); ctx.quadraticCurveTo(1300, 720, 1380, 860); ctx.lineTo(1380, H + 200); ctx.closePath(); }, '#E3CF9E', { shadow: 0.6, edge: 6 });
        for (let i = 0; i < 4; i++) SC.palm(120 + i * 150, 700, 0.55, t + i);
        const sw = seg(lt, co, co + 0.5); ctx.save(); ctx.translate(820, 720); A.fort(0, 0, 0.95, null, t); ctx.translate(0, -177); ctx.scale(Math.max(0.05, Math.abs(Math.cos(sw * Math.PI))), 1); A.flag(0, 0, 0.9, sw < 0.5 ? 'pt' : 'voc', t, 150); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(1300, 0, 1000, H); ctx.clip(); A.waves(t, 740, 2, 50, 10); ctx.restore(); A.indiaman(1600, 700, 0.35, Math.sin(t * 1.3) * 0.02, t); });
      K.ribbon('1663', 1500, 230, eob(seg(lt, 0.1, 0.45)), 80); A.tornSlip('COCHIN', 820, 230, eob(seg(lt, co, co + 0.3)), 52); } });
""" + s[j:]
p.write_text(s)

# ── CH8: the trade loop un-draws on the map with the real Amsterdam ──
rep('src/chapters/ch8_exit.js', "const NA = () => A.px(v, [81.8, 15.5]), NB = () => A.px(v, [128.5, -3]), NC = [960, 215];",
    "const vL = A.view(66, 22, 11), NA = () => A.px(vL, [81.8, 15.5]), NB = () => A.px(vL, [128.5, -3]), NC = A.px(vL, PL.amsterdam);")
rep('src/chapters/ch8_exit.js', "draw(lt, d, t) { A.realMap(v, { seed: 106 }); ctx.save(); ctx.globalAlpha = 0.3;", "draw(lt, d, t) { A.realMap(vL, { seed: 106 }); A.pin(vL, PL.amsterdam, 'AMSTERDAM', 1, { dx: 190, dy: 10 }); ctx.save(); ctx.globalAlpha = 0.3;")
rep('src/chapters/ch8_exit.js', "{ bend: -120, iconScale: 1.1 }); K.ribbon('1825', 760, 470,", "{ bend: -90, iconScale: 1.0 }); K.ribbon('1825', 960, 470,")
print('patched')
