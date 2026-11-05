"""data/chapters.json from script.json chapter fields + data/lines.json (start/end per chapter; card = pause before it)."""
import json, sys
from pathlib import Path
P = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
S = json.loads((P / 'script.json').read_text()); L = json.loads((P / 'data/lines.json').read_text())
ch = []
for i, ln in enumerate(S['lines']):
    if not ch or ch[-1]['id'] != ln['chapter']:
        meta = next(x for x in S['chapters'] if x['id'] == ln['chapter']); prev = L['lines'][i - 1]['end'] if i else 0
        ch.append({'id': ln['chapter'], 'year': meta['year'], 'title': meta['title'], 'first': i, 'card': round(prev + 0.05, 3) if meta['year'] else None, 'start': round(prev + 0.05 if i else 0, 3)})
    ch[-1]['last'] = i
for k, c in enumerate(ch): c['end'] = round(ch[k + 1]['start'] if k + 1 < len(ch) else L['duration'], 3)
(P / 'data/chapters.json').write_text(json.dumps({'duration': L['duration'], 'chapters': ch}, indent=1))
for c in ch: print(c['id'], c['start'], c['end'])
