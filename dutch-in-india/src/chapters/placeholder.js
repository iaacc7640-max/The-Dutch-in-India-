// Stand-in shots for chapters not built yet: one map frame per cut with the planned shot written on a slip,
// so the whole film boots, checks and times correctly while chapters are built one at a time.
import { ctx, W, H, clamp, seg, eob } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';

export function placeholder(H_, id) {
  const { add, cue, at, lines, script } = H_;
  lines(id).forEach((i, k) => {
    const st = at(i), note = script.lines[i].shot;
    add({ id: `${id}_${String(i).padStart(3, '0')}`, at: st, chapter: id, note: 'PLACEHOLDER ' + note, zoom: 0.03, draw(lt, d, t) {
      A.realMap(A.VIEWS.wide, { seed: i });
      A.tornSlip('[draft] ' + (note.length > 60 ? note.slice(0, 58) + '…' : note), W / 2, 460, eob(seg(lt, 0, 0.25)), 34);
    } });
    if (k) cue(st, 'whoosh', { gain: 0.5 });
  });
}
