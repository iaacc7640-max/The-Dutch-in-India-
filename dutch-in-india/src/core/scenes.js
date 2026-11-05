// Shared set pieces (recurring places), built from LAYERS that move on their own with a parallax camera.
// cam = { x, y, zoom }: sky depth 0.1, far sea 0.3, near sea 0.6, land 0.8, figures 1, foreground 1.25.
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './lib.js';
import { P, cut, P_rr, P_poly, P_circ, parchment } from './kit.js';
import * as A from './atlas.js';
const { F } = A;

export const GROUND = 840;   // figures stand here: everything moving stays above the caption zone (860+)

/** sky: parchment + warm sky band; night 0..1 shifts sun to dusk then night */
export function sky(cam, night = 0, seed = 1) {
  A.layer(cam, 0.1, () => {
    parchment(seed); const g = ctx.createLinearGradient(0, 0, 0, 700);
    g.addColorStop(0, night > 0.3 ? '#B9A0A0' : P.sky); g.addColorStop(1, night > 0.3 ? '#EDBE86' : '#EFE2BD');
    ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, 1100); ctx.restore();
    const sy = lerp(220, 520, clamp(night * 1.4)); cut(P_circ(1420, sy, 70), night > 0.3 ? '#E9A35A' : '#EFC66A', { shadow: 0.3, edge: 5 });
    for (let i = 0; i < 4; i++) { const x = ((rnd(i + seed) * W + 0) % (W + 400)) - 200, y = 140 + rnd(i + 9) * 220; cut(() => { ctx.beginPath(); for (const [dx, r] of [[-60, 34], [0, 46], [60, 32]]) { ctx.moveTo(x + dx + r, y); ctx.arc(x + dx, y, r, 0, TAU); } }, P.edge, { shadow: 0.3, edge: 3 }); }
  });
}
/** a palm tree (cut paper) */
export function palm(x, y, s = 1, t = 0, c = P.forest) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-30, -200, 20, -380); ctx.lineTo(40, -376); ctx.quadraticCurveTo(-4, -200, 14, 0); ctx.closePath(); }, '#8C6B4E', { shadow: 0.5, edge: 3 });
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(t * 1.3 + i) * 0.04; ctx.save(); ctx.translate(30, -378); ctx.rotate(a);
    cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(90, -40, 190, 30); ctx.quadraticCurveTo(90, -6, 0, 10); ctx.closePath(); }, c, { shadow: 0.4, edge: 3 }); ctx.restore(); }
  ctx.restore();
}
/** a wooden stockade (palisade) with a small watch tower; (x, y) = ground centre */
export function stockade(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(150, -300, 90, 300, 4), '#7A5636'); cut(P_poly([[130, -300], [195, -360], [260, -300]]), '#5E3B28');
  for (let i = -8; i <= 8; i++) cut(P_poly([[i * 30 - 14, 0], [i * 30 - 14, -170 - (i % 2) * 14], [i * 30, -196 - (i % 2) * 14], [i * 30 + 14, -170 - (i % 2) * 14], [i * 30 + 14, 0]]), i % 2 ? '#8C6B4E' : '#7A5636', { shadow: 0.4, edge: 3 });
  if (o.flag > 0) A.flag(195, -360 + 0, 1.25, o.flagKind || 'white', o.t || 0, 60 + 150 * eo(clamp(o.flag)));
  if (o.vocFlag) A.flag(-200, -196, 0.7, 'voc', o.t || 0, 110);
  ctx.restore();
}
/** the Colachel beach (cold open + CH6): sky, sea layers, sand, far stockade at the left, palms; night 0 / 0.5 / 1.
 *  o = { flag 0..1, smoke 0..1, flash 0..1, ship: x | null, shipSails, figures: fn(cam), stockadeX } */
export function beach(t, cam, night = 0.5, o = {}) {
  sky(cam, night, 3); A.stars(40, 5, night);
  A.layer(cam, 0.3, () => { cut(() => { ctx.beginPath(); ctx.moveTo(-400, 600); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, 560 + Math.sin(x * 0.006 + t * 0.6) * 6); ctx.lineTo(W + 400, H); ctx.lineTo(-400, H); ctx.closePath(); }, P.seaDark, { shadow: 0.3, edge: 4 });
    if (o.ship != null) A.indiaman(o.ship, 600 + Math.sin(t * 1.4) * 4, 0.32, Math.sin(t * 1.2) * 0.02, t, { dir: o.shipDir || 1, sails: o.shipSails ?? 1 }); });
  A.layer(cam, 0.55, () => { for (let i = 0; i < 2; i++) { const y = 640 + i * 50; cut(() => { ctx.beginPath(); ctx.moveTo(-400, H); ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 1.4 + i * 2) * 10); ctx.lineTo(W + 400, H); ctx.closePath(); }, i ? P.sea : P.seaDark, { shadow: 0.5, edge: 5 }); } });
  A.layer(cam, 0.8, () => {
    cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 200); ctx.lineTo(-400, 760); for (let x = -400; x <= W + 400; x += 60) ctx.lineTo(x, 760 + Math.sin(x * 0.004) * 20 + (x < 700 ? -30 : 0) * (1 - clamp((x - 400) / 300))); ctx.lineTo(W + 400, H + 200); ctx.closePath(); }, '#E3CF9E', { shadow: 0.6, edge: 6 });
    const sx = o.stockadeX ?? 330; stockade(sx, 770, 0.8, { flag: o.flag || 0, t, vocFlag: o.vocFlag });
    if (o.flash > 0) { ctx.save(); ctx.globalAlpha = clamp(o.flash) * 0.9; const g = ctx.createRadialGradient(sx, 640, 0, sx, 640, 260); g.addColorStop(0, '#F2C14E'); g.addColorStop(0.5, 'rgba(224,120,46,0.6)'); g.addColorStop(1, 'rgba(224,120,46,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 300, 360, 600, 500); ctx.restore(); }
    A.smokeColumn(sx - 20, 640, 0.9, o.smoke || 0, t);
    palm(1650, 790, 0.9, t); palm(1780, 800, 0.75, t + 2); palm(80, 800, 0.7, t + 1);
  });
  if (o.figures) A.layer(cam, 1, () => o.figures());
  A.layer(cam, 1.2, () => { cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 200); ctx.lineTo(-400, 845); for (let x = -400; x <= W + 400; x += 50) ctx.lineTo(x, 845 + Math.sin(x * 0.02) * 6); ctx.lineTo(W + 400, H + 200); ctx.closePath(); }, '#CDB582', { shadow: 0.6, edge: 5 }); });
  A.nightWash(night > 0.7 ? night : night * 0.45);
}
/** Amsterdam canal: stepped-gable houses (two depths), canal water, a boat; cam.x pans the street */
export function amsterdam(t, cam, o = {}) {
  sky(cam, 0, 8);
  const row = (n, y, w, hgt, seed, depth) => A.layer(cam, depth, () => { for (let i = 0; i < n; i++) { const x = -200 + i * w, h = hgt + rnd(i + seed) * 120, col = ['#A8503E', '#8C6B4E', '#B9A98C', '#7A4B33', '#9C6B48'][(i + seed) % 5]; gable(x, y, w - 14, h, col, seed + i); } });
  row(12, 640, 190, 300, 3, 0.45); row(10, 700, 240, 360, 7, 0.8);
  A.layer(cam, 0.9, () => { cut(P_rr(-400, 700, W + 800, 160, 0), P.seaDark, { shadow: 0.4, edge: 5 }); ctx.strokeStyle = 'rgba(233,220,188,0.5)'; ctx.lineWidth = 5; for (let i = 0; i < 14; i++) { const x = ((i * 190 + t * 40) % (W + 400)) - 200, y = 730 + (i % 3) * 36; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 70, y); ctx.stroke(); }
    if (o.boat !== false) { const bx = 300 + t * 60; cut(P_poly([[bx - 120, 740], [bx + 120, 740], [bx + 90, 780], [bx - 90, 780]]), P.sepia); } });
  A.layer(cam, 1.2, () => cut(P_rr(-400, 845, W + 800, 400, 0), P.stoneDark, { shadow: 0.6, edge: 5 }));
}
function gable(x, y, w, h, col, seed) {
  const steps = 3, sw = w / (steps * 2 + 1);
  cut(() => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); for (let k = 0; k < steps; k++) { ctx.lineTo(x + sw * k, y - h - sw * k * 1.2); ctx.lineTo(x + sw * (k + 1), y - h - sw * k * 1.2); } ctx.lineTo(x + sw * steps, y - h - sw * steps * 1.2); ctx.lineTo(x + w - sw * steps, y - h - sw * steps * 1.2);
    for (let k = steps - 1; k >= 0; k--) { ctx.lineTo(x + w - sw * (k + 1), y - h - sw * k * 1.2); ctx.lineTo(x + w - sw * k, y - h - sw * k * 1.2); } ctx.lineTo(x + w, y - h); ctx.lineTo(x + w, y); ctx.closePath(); }, col, { shadow: 0.6, edge: 4 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { rr(x + w * (0.22 + c * 0.38), y - h + 30 + r * (h / 3.4), w * 0.2, h / 6, 3); ctx.fillStyle = '#3E2C1E'; ctx.fill(); }
}
/** the Coromandel coast village street at day: palms, a thatched weaving shed; children of CH2 */
export function coromandel(t, cam, night = 0) {
  sky(cam, night, 12);
  A.layer(cam, 0.35, () => { for (let i = 0; i < 9; i++) palm(-100 + i * 260, 700, 0.6 + rnd(i) * 0.25, t + i, '#6E7B4C'); });
  A.layer(cam, 0.8, () => cut(P_rr(-400, 690, W + 800, 200, 0), '#E3CF9E', { shadow: 0.5, edge: 5 }));
  A.layer(cam, 1.2, () => cut(P_rr(-400, 845, W + 800, 400, 0), '#CDB582', { shadow: 0.6, edge: 5 }));
  A.nightWash(night);
}
/** a thatched shed roof over (x, y) width w */
export function shed(x, y, w, h = 300) {
  for (const k of [-1, 1]) cut(P_rr(x + k * (w / 2 - 20) - 10, y - h, 20, h, 4), '#7A5636', { shadow: 0.4, edge: 3 });
  cut(P_poly([[x - w / 2 - 60, y - h + 10], [x, y - h - 120], [x + w / 2 + 60, y - h + 10]]), '#B9A07A');
  ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 14, y - h + 6); ctx.lineTo(x + i * w / 30, y - h - 100); ctx.stroke(); }
}
