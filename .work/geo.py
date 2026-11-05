# Natural Earth 1:50m land (public domain) -> simplified rings for the Paper Atlas realMap, clipped to Europe..Moluccas.
import json, math, sys
src = json.load(open('ne_50m_land.geojson'))
LON0, LON1, LAT0, LAT1 = -25, 150, -45, 62
def dp(pts, tol):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        p = pts[i]; dx, dy = b[0] - a[0], b[1] - a[1]
        d = abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / (math.hypot(dx, dy) or 1e-9)
        if d > dmax: dmax, idx = d, i
    if dmax > tol: return dp(pts[:idx + 1], tol)[:-1] + dp(pts[idx:], tol)
    return [a, b]
def area(r): return abs(sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))) / 2
out = []
for f in src['features']:
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys:
        ring = poly[0]
        if not any(LON0 <= x <= LON1 and LAT0 <= y <= LAT1 for x, y in ring): continue
        a = area(ring); east = sum(x for x, _ in ring) / len(ring) > 95
        if a < (0.05 if east else 0.6): continue          # keep small Indonesian / Moluccan islands
        tol = 0.05 if a < 3 else 0.12
        r = ring[:-1] if ring[0] == ring[-1] else ring
        k = max(range(len(r)), key=lambda i: (r[i][0] - r[0][0]) ** 2 + (r[i][1] - r[0][1]) ** 2)   # closed ring: split at the far point
        s = dp(r[:k + 1], tol)[:-1] + dp(r[k:] + [r[0]], tol)[:-1]
        if len(s) >= 4: out.append([[round(x, 2), round(y, 2)] for x, y in s])
json.dump({"source": "Natural Earth 1:50m land (public domain), simplified (Douglas-Peucker 0.05-0.12 deg), clipped to lon -25..150, lat -45..62", "rings": out}, open(sys.argv[1], 'w'), separators=(',', ':'))
print(len(out), 'rings', sum(len(r) for r in out), 'points')
