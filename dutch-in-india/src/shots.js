// TRADERS, NOT RULERS: the shot list, one file per chapter in src/chapters/. This file wires them together, adds the
// chapter cards (from script.json chapters + the voice timing) and the era-bar overlay.
import { ctx, W, H, clamp, lerp, seg, eio } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import * as A from './core/atlas.js';
import ch0 from './chapters/ch0_intro.js';
import ch1 from './chapters/ch1_company.js';
import ch2 from './chapters/ch2_cloth.js';
import ch3 from './chapters/ch3_amboyna.js';
import ch4 from './chapters/ch4_forts.js';
import ch5 from './chapters/ch5_garden.js';
import ch6 from './chapters/ch6_colachel.js';
import ch7 from './chapters/ch7_bengal.js';
import ch8 from './chapters/ch8_exit.js';

// era-bar tick per chapter (index into A.ERAS); CH0 opens on 1741
export const ERA_OF = { CH0: 6, CH1: 0, CH2: 2, CH3: 3, CH4: 4, CH5: 5, CH6: 6, CH7: 7, CH8: 8 };

export function buildShots(script) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const chapters = [];
  script.lines.forEach((ln, i) => { if (!chapters.length || chapters[chapters.length - 1].id !== ln.chapter) chapters.push({ id: ln.chapter, first: i, last: i }); chapters[chapters.length - 1].last = i; });
  chapters.forEach((c) => { const meta = script.chapters.find((m) => m.id === c.id); Object.assign(c, meta); });
  const lines = (id) => { const c = chapters.find((x) => x.id === id); return Array.from({ length: c.last - c.first + 1 }, (_, k) => c.first + k); };
  const H_ = { add, cue, at, L, Le, Wd, T, lines, script, chapters };
  for (const build of [ch0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8]) build(H_);
  // chapter cards: in the pause before each chapter's first line
  chapters.forEach((c) => {
    if (!c.year) return; const st = Le(c.first - 1) + 0.05;
    add({ id: 'CARD_' + c.id, at: st, card: true, zoom: 0.02, cam: [W / 2, H / 2], note: `chapter card ${c.year}: ${c.title}`, draw(lt, d, t) { A.chapterCard(lt, c.year, c.title); } });
    cue(st, 'rustle'); cue(st + 0.75, 'thud', { gain: 0.6 });
  });
  // every shot knows its chapter (for the era bar)
  S.sort((a, b) => a.at - b.at);
  S.forEach((s) => { if (!s.chapter) { const c = chapters.filter((x) => L(x.first) - 0.2 <= s.at + 1e-3).pop() || chapters[0]; s.chapter = c.id; } });
  return { shots: S, cues: CUES };
}

/** drawn by main.js on top of every shot (outside the camera): the era bar, unless the shot hides it */
export function overlay(sh, lt, d, t) {
  if (sh.card || sh.era === false) return;
  const n = A.ERAS.length - 1; let act = ERA_OF[sh.chapter] ?? -1, p = act / n;
  if (Array.isArray(sh.era)) { const [a, b, t0 = 0, t1 = d] = sh.era; const k = eio(seg(lt, t0, t1)); p = lerp(a, b, k) / n; act = k < 0.5 ? a : b; }
  else if (typeof sh.era === 'number') { act = sh.era; p = act / n; }
  A.eraBar(act, p, clamp(lt / 0.3));
}
