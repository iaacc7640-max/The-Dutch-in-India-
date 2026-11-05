# Draft plan: one row per CUT -> writes ../script.json (voice/timing input) and plan.md (the plan screen).
# Row: (chapter, spoken text with phonetic spellings, caption chunks with correct spellings, shot, gap-after or None)
import json, re, pathlib
HERE = pathlib.Path(__file__).parent
CH = [("CH0", None, "Cold open"), ("CH1", "1596", "A Company That Could Go to War"), ("CH2", "1605", "The Cloth Coast"),
      ("CH3", "1623", "Trouble at Amboyna"), ("CH4", "1663", "Taking Portugal's Forts"), ("CH5", "1678", "The Garden of Malabar"),
      ("CH6", "1741", "The Battle of Colachel"), ("CH7", "1759", "Last Stand in Bengal"), ("CH8", "1825", "Exit, Quietly")]
CARD = 1.6
R = [
# ── CH0 cold open (tension) ──
(0, "In seventeen forty-one, on a beach in southern India,", "In *1741, | on a beach | in southern *India,", "Dusk beach, far stockade on the left; a white flag rises over it (no people)."),
(0, "a Dutch commander surrendered to an Indian king.", "a Dutch *commander | surrendered | to an Indian *king.", "Two-shot: De Lannoy (Dutch coat) hands his sword to Marthanda Varma (gold crown, conch emblem)."),
(0, "Then he did something stranger:", "Then he did | something *stranger:", "Push in on De Lannoy; a '?' slip pins on."),
(0, "he joined that king's army,", "he *joined | that king's *army,", "Same officer, coat now Travancore green; he lifts a sword in salute."),
(0, "and served it for the rest of his life.", "and served it | for the rest | of his *life.", "Slip ticks 1741 to 1777 over Udayagiri fort silhouette (gold ribbon '36 YEARS')."),
(0, "To see how he got there, we have to go back to Amsterdam,", "To see how | he got *there, | back to *Amsterdam,", "Page turns: Amsterdam canal, gabled houses, lateral pan left to right."),
(0, "and to a very new idea:", "and to a very | new *idea:", "A blank parchment share certificate floats down onto the canal page."),
(0, "a company that could go to war.", "a *company | that could | go to *war.", "Title: gold ribbon '1596 to 1825', torn slip 'TRADERS, NOT RULERS', VOC seal stamps.", CARD),
# ── CH1 ──
(1, "In fifteen ninety-six, Cornelis de Howtman's ships reached Java,", "In *1596, | Cornelis de *Houtman's | ships reached *Java,", "WIDE realMap: route draws Amsterdam to Cape to Java; Houtman figure (wide hat, ruff) inset left."),
(1, "and the Dutch had found their own way to the spice islands.", "and the Dutch | found their *own way | to the Spice Islands.", "Ship arrives at the BANTAM pin; Moluccas glow at the far right."),
(1, "Back home, they were fighting Spain for independence,", "Back home, | they were fighting Spain | for *independence,", "Netherlands cut-out (tricolour) facing Spain (gold on crimson) across the map."),
(1, "and Spain now ruled Portugal too,", "and Spain now | ruled *Portugal too,", "Spanish crown drops onto the Portuguese crown (royal-blue cross)."),
(1, "so hurting the Portuguese in Asia", "so hurting | the *Portuguese | in Asia", "Orange paper fist knocks a coin off the stacked crowns."),
(1, "was business and revenge at the same time.", "was *business | and *revenge | at the same time.", "Ledger with two columns PROFIT / REVENGE, both ticked by a quill."),
(1, "In sixteen-oh-two, the Dutch government", "In *1602, | the Dutch *government", "Gold ribbon 1602 over the Amsterdam hall facade."),
(1, "merged its rival trading firms into one:", "merged its rival | trading *firms | into one:", "Six small company flags slide together across the wide frame."),
(1, "the Dutch East India Company.", "the Dutch East | India *Company.", "They fuse into the gold VOC monogram seal (wax-seal thud)."),
(1, "Ordinary citizens could buy shares in it.", "Ordinary *citizens | could buy *shares | in it.", "A queue of citizens; certificates with the VOC seal pass hand to hand."),
(1, "And it could do what few companies ever had:", "And it could do | what few companies | *ever had:", "VOC director (black coat, white ruff, ledger) opens the ledger."),
(1, "build forts, sign treaties, mint coins, and wage war.", "build *forts, | sign *treaties, | mint *coins, | and wage *war.", "Four icons pop one per word: fort, treaty, coin, cannon.", CARD),
# ── CH2 ──
(2, "Their first factory in India", "Their first *factory | in India", "realMap wide on India; the Coromandel (east) coast highlights."),
(2, "opened at Mussoo-lee-putnam, on the Koro-man-del coast, in sixteen-oh-five.", "opened at *Masulipatnam, | on the Coromandel coast, | in *1605.", "Pin + slip MASULIPATNAM; factory cut-out pops up."),
(2, "Soon came Poo-lee-kat, north of Madras,", "Soon came *Pulicat, | north of *Madras,", "Pins slide south: PULICAT above MADRAS."),
(2, "where they built a fort and minted their own copper coins.", "where they built a *fort | and minted their | own copper *coins.", "Pulicat fort; copper coins drop into a stack (coin clinks)."),
(2, "At Poo-lee-kat alone, there may have been", "At *Pulicat alone, | there may have been", "Coromandel weaver at a handloom (handloom clack)."),
(2, "over a thousand handlooms working for them.", "over a *thousand | handlooms | working for them.", "Handlooms multiply in rows across the wide frame; slip '1,000+?'."),
(2, "But why India, if the Dutch wanted spices?", "But why *India, | if the Dutch | wanted *spices?", "Question slip between a cloth bale (left) and a nutmeg (right)."),
(2, "Because the people of the Spice Islands wanted Indian cloth.", "Because the people | of the Spice Islands | wanted Indian *cloth.", "Map pans right to the Moluccas; cloth bolts land on the islands."),
(2, "So the Dutch ran a loop:", "So the Dutch | ran a *loop:", "THE TRADE LOOP frame: India left, Spice Islands right, Amsterdam top."),
(2, "buy cotton cloth in India,", "buy cotton *cloth | in India,", "Leg 1 draws India to Spice Islands with a cloth icon."),
(2, "trade it for nutmeg, cloves and pepper in Indonesia,", "trade it for *nutmeg, | cloves and *pepper | in Indonesia,", "Leg 2 draws Spice Islands to Amsterdam, nutmeg/clove/pepper icons."),
(2, "and sell those in Europe.", "and sell those | in *Europe.", "Leg 3 closes the triangle with coins; loop starts turning."),
(2, "Along the way they carried indigo, silk from Bengal,", "Along the way | they carried *indigo, | silk from *Bengal,", "Loop speeds up; indigo vat and silk icons join as named."),
(2, "saltpetre from Bihar for gunpowder,", "*saltpetre | from Bihar | for *gunpowder,", "Saltpetre sacks join the loop."),
(2, "and opium and rice from the Ganga valley.", "and *opium | and rice | from the Ganga *valley.", "Opium and rice icons join; loop at full speed.", CARD),
# ── CH3 ──
(3, "The English wanted the same spices,", "The *English wanted | the same *spices,", "Two-shot: Dutch and English ships side by side on paper waves."),
(3, "and the rivalry turned ugly.", "and the rivalry | turned *ugly.", "Sails nudge; the two ships bump (no fighting)."),
(3, "In sixteen twenty-three, on the island of Am-boy-na,", "In *1623, | on the island | of *Amboyna,", "Night: Amboyna fort silhouette under the navy wash; pin AMBOYNA."),
(3, "the Dutch accused English traders of plotting to seize their fort.", "the Dutch *accused | English traders | of *plotting | to seize their fort.", "Letter with a broken seal; slip 'PLOT?'."),
(3, "After confessions taken under torture,", "After *confessions | taken under *torture,", "A closed door at night; one candle on a table."),
(3, "they executed ten Englishmen,", "they executed | *ten Englishmen,", "Ledger page of names under the navy wash; ten lines ink in."),
(3, "nine Japanese soldiers and one Portuguese man.", "*nine Japanese soldiers | and *one Portuguese man.", "Japanese soldier standing guard (far, dim); names reach twenty; the candle goes out."),
(3, "It ended any hope of the two companies working together.", "It ended any *hope | of the two companies | working *together.", "A paper handshake tears in two."),
(3, "The Dutch kept the Spice Islands,", "The Dutch kept | the Spice *Islands,", "Map: Dutch flags fill the Moluccas."),
(3, "and the English turned more and more to India.", "and the English | turned more and more | to *India.", "An English ship turns left toward India across the wide map.", CARD),
# ── CH4 ──
(4, "Meanwhile the Dutch went after their old enemy.", "Meanwhile the Dutch | went after | their old *enemy.", "Map: Portuguese flags (white, royal-blue cross) on Indian coastal forts."),
(4, "As historians R. C. Mozoom-dar and his co-authors put it,", "As historians | R.C. *Majumdar | and his co-authors | put it,", "An open history book page with an attribution slip (no quote marks on screen)."),
(4, "the Dutch had two aims in the East:", "the Dutch had | *two aims | in the East:", "Two blank target slips pin onto the map."),
(4, "revenge on Spain and Portugal,", "*revenge on | Spain and Portugal,", "First slip fills: REVENGE."),
(4, "and a monopoly of the spice trade.", "and a *monopoly | of the spice trade.", "Second slip fills: MONOPOLY."),
(4, "In sixteen fifty-eight they took Naaga-putti-num from the Portuguese,", "In *1658 | they took *Nagapattinam | from the Portuguese,", "Pin NAGAPATTINAM; its flag swaps Portuguese to Dutch."),
(4, "far down the Koro-man-del coast.", "far *down | the Coromandel coast.", "Camera pans down the coast from Pulicat/Madras to Nagapattinam."),
(4, "In sixteen sixty-three they took Cochin,", "In *1663 | they took *Cochin,", "Cochin harbour; the fort flag swaps to the Dutch tricolour."),
(4, "and with it the last Portuguese forts on the Mala-bar coast.", "and with it | the last Portuguese *forts | on the Malabar coast.", "Map: each Malabar fort flips in a ripple along the coast."),
(4, "For a while, Kerala's pepper trade ran through Dutch hands.", "For a while, | Kerala's *pepper trade | ran through Dutch *hands.", "Pepper sacks stamped VOC roll onto a ship.", CARD),
# ── CH5 ──
(5, "Not everything they did was about money.", "Not everything | they did | was about *money.", "Coins slide off; a green leaf drifts in."),
(5, "Cochin's Dutch governor, Hendrik van Ray-duh,", "Cochin's Dutch *governor, | Hendrik van *Rheede,", "Van Rheede (long wig, governor's sash) in a Cochin garden, lateral pan."),
(5, "set out to record the useful plants of Kerala.", "set out to *record | the useful *plants | of Kerala.", "A quill sketches a leaf on parchment."),
(5, "His key expert was Itty Ah-choo-dun, a local Eezha-va physician,", "His key *expert | was Itty *Achudan, | a local Ezhava physician,", "Itty Achudan (white mundu) reads a palm-leaf manuscript; herbs sketch in ink beside him."),
(5, "checked by three Kon-kunee Brahmin scholars.", "checked by *three | Konkani Brahmin *scholars.", "Three scholars nod over a page."),
(5, "The result, the Hortus Mala-barry-kus,", "The result, | the *Hortus Malabaricus,", "A bound volume lands, title on a slip."),
(5, "came out in twelve volumes, starting in sixteen seventy-eight,", "came out in | *twelve volumes, | starting in *1678,", "Twelve volumes stack up; gold ribbon 1678."),
(5, "with almost eight hundred engravings.", "with almost | *800 engravings.", "Plates fan out across the wide frame."),
(5, "It is one of the earliest great books on tropical plants,", "It is one | of the *earliest | great books | on tropical *plants,", "An engraving page fills the frame; a coconut palm draws line by line."),
(5, "and it was built on Indian knowledge.", "and it was built | on Indian *knowledge.", "Slip 'INDIAN KNOWLEDGE' pins on the plate.", CARD),
# ── CH6 ──
(6, "Now, back to that beach.", "Now, back | to that *beach.", "The dusk beach from the cold open returns."),
(6, "By the seventeen-thirties, King Maar-taanda Varma of Travan-kor", "By the *1730s, | King Marthanda *Varma | of Travancore", "Marthanda Varma (gold crown, conch emblem on forest green) standing."),
(6, "was taking over the pepper coast,", "was taking over | the *pepper coast,", "Map: Travancore's forest-green fill creeps along the south-west coast."),
(6, "and the Dutch sent troops to stop him.", "and the Dutch | sent *troops | to stop him.", "VOC ships arrive off the coast (pan right to left)."),
(6, "In August seventeen forty-one, at Ko-la-chel,", "In August *1741, | at *Colachel,", "Colachel beach and the Dutch stockade, wide."),
(6, "the story goes that a Travan-kor cannonball", "the *story goes that | a Travancore *cannonball", "One crimson dashed arc crosses the sky toward the far stockade (distant muffled cannon)."),
(6, "set off a Dutch gunpowder barrel,", "set off a Dutch | gunpowder *barrel,", "Far flash and a smoke column from the stockade (soft far boom; no people)."),
(6, "their rice supply went up with it,", "their *rice supply | went up with it,", "Rice sacks scorched at the edges."),
(6, "and the Dutch surrendered.", "and the Dutch *surrendered.", "White flag rises over the stockade."),
(6, "Local fishermen are said to have helped too,", "Local *fishermen | are said to have | *helped too,", "Night: small fishing boats glide under the navy wash."),
(6, "sinking Dutch boats at night.", "sinking Dutch *boats | at night.", "Empty Dutch boats tip and slip under paper waves."),
(6, "Their commander, Yoo-stah-kee-us De Lan-wah, was taken prisoner,", "Their commander, | Eustachius *De Lannoy, | was taken *prisoner,", "The cold-open two-shot again: the sword handover, now explained."),
(6, "and then recruited.", "and then *recruited.", "His coat swaps from Dutch blue to Travancore green."),
(6, "He trained Travan-kor's army in European drill", "He trained | Travancore's *army | in European drill", "De Lannoy drills ranks of Travancore soldiers (lateral pan)."),
(6, "and rose to command it.", "and rose | to *command it.", "Slip 'VALIYA KAPPITHAN: THE GREAT CAPTAIN' pins on."),
(6, "Twelve years later, the Dutch signed a treaty", "*Twelve years later, | the Dutch signed | a treaty", "Treaty scroll unrolls; gold ribbon 1753."),
(6, "promising not to stand in Travan-kor's way.", "promising *not | to stand in | Travancore's way.", "Two wax seals stamp on (VOC gold, Travancore conch).", CARD),
# ── CH7 ──
(7, "In Bengal, the Dutch made one last move.", "In *Bengal, | the Dutch made | one last *move.", "Map: Bengal; pins CHINSURA on the Hooghly above Calcutta, PLASSEY."),
(7, "After Plassey, Nawab Meer Jaa-far", "After *Plassey, | Nawab Mir *Jafar", "Mir Jafar (Nawab turban, deep green and gold) on a cushion throne."),
(7, "secretly invited them in to balance the British,", "*secretly invited them in | to balance the *British,", "He slips a sealed letter to a Dutch envoy."),
(7, "and in seventeen fifty-nine a Dutch fleet sailed up the Hoog-lee", "and in *1759 | a Dutch fleet | sailed up the *Hooghly", "Wide river pan: Dutch ships sail in from Batavia, right to left."),
(7, "carrying more than fifteen hundred soldiers.", "carrying more than | *1,500 soldiers.", "Slip '1,500+ (European and Malay)' over the masts."),
(7, "The British, under Colonel Francis Forde, struck first,", "The British, | under Colonel Francis *Forde, | struck *first,", "Forde (red coat) on the bank; redcoat silhouettes in a line."),
(7, "on the river and then on land near Chin-soo-ra.", "on the *river | and then on land | near *Chinsurah.", "Dutch masts lower one by one on the river."),
(7, "Only sixteen of those European soldiers reached the Dutch fort.", "Only *sixteen | of those European soldiers | reached the Dutch *fort.", "Counter slip counts down to '16 EUROPEANS' at the fort gate."),
(7, "Soon after, the British removed Meer Jaa-far", "Soon after, | the British *removed | Mir Jafar", "The throne cushion: Mir Jafar's turban lifts away."),
(7, "and placed his son-in-law, Meer Kaa-sim, on the throne.", "and placed | his son-in-law, | Mir *Kasim, | on the throne.", "A second turban settles on the cushion."),
(7, "Their grip on Bengal grew even tighter.", "Their *grip | on Bengal | grew even *tighter.", "Map: British crimson tint spreads over Bengal.", CARD),
# ── CH8 ──
(8, "After that, the Dutch faded.", "After that, | the Dutch *faded.", "Wide map, India left, Indonesia right; Dutch pins in India dim."),
(8, "Their real profits were in Indonesia,", "Their real *profits | were in *Indonesia,", "The Indonesian side glows gold."),
(8, "and in seventeen ninety-five British forces", "and in *1795 | British forces", "India pins flip to British one by one (crimson cross on white)."),
(8, "took most of their posts in India.", "took most | of their *posts | in India.", "Last flips: Cochin, Chinsura; ribbon 1795."),
(8, "The company itself was wound up in seventeen ninety-nine.", "The company itself | was *wound up | in 1799.", "The gold VOC seal cracks in two."),
(8, "Under a treaty with Britain in eighteen twenty-four,", "Under a *treaty | with Britain | in 1824,", "Treaty scroll, two seals; ribbon 1824."),
(8, "the Dutch gave up what was left,", "the Dutch gave up | what was *left,", "Remaining pins flip; the trade loop starts to un-draw."),
(8, "and handed it over in eighteen twenty-five.", "and handed it over | in *1825.", "Trade loop finishes un-drawing; era bar lands on 1825."),
(8, "They came to India for trade, not empire,", "They came to India | for *trade, | not empire,", "A VOC ship turns to leave (keep bottom-right clear from here)."),
(8, "and they left the same way.", "and they left | the same *way.", "The ship sails off right."),
(8, "The one Dutch commander who stayed behind", "The one Dutch *commander | who stayed behind", "Dusk beach: De Lannoy in Travancore green watches the ship go."),
(8, "did it as a soldier of an Indian king.", "did it as a *soldier | of an Indian *king.", "End card: title slip + ribbon top-left; bottom-right 420x260 empty."),
]
from edits import E
R2 = []
for r in R:
    if r[1] in E:
        for e in E[r[1]]:
            shot = e[2] or r[3]; row = (r[0], e[0], e[1], shot)
            g = e[3] if len(e) > 3 else (r[4] if len(r) > 4 and len(E[r[1]]) == 1 else None)
            R2.append(row + ((CARD if g == "CARD" else g,) if g else ()))
    else: R2.append(r)
R = R2

SMALL = set("a an the and of in on to at it its by for from with his their they he that was were who what as or but so then there".split())
def fix_caps(caps):
    """every caption: 2-5 words and exactly one crimson word. Merge a starless or 1-word chunk into a neighbour
    when the result stays <= 5 words with <= 1 star; otherwise star its longest content word."""
    ch = [c.strip().split() for c in caps.split('|') if c.strip()]
    stars = lambda c: sum(w.startswith('*') for w in c)
    changed = True
    while changed:
        changed = False
        for i, c in enumerate(ch):
            if stars(c) == 1 and len(c) >= 2: continue
            for j in ([i + 1, i - 1] if i + 1 < len(ch) else [i - 1]):
                if 0 <= j < len(ch) and len(c) + len(ch[j]) <= 5 and stars(c) + stars(ch[j]) <= 1:
                    a, b = sorted([i, j]); ch[a] = ch[a] + ch[b]; del ch[b]; changed = True; break
            if changed: break
    for c in ch:
        if stars(c) == 0:
            k = max(range(len(c)), key=lambda q: (c[q].strip('.,:;?!').lower() not in SMALL, len(c[q].strip('.,:;?!'))))
            c[k] = '*' + c[k]
    return ' | '.join(' '.join(c) for c in ch)

lines = []
for r in R:
    ch, text, caps, shot = r[:4]; ln = {"chapter": CH[ch][0], "text": text, "caps": fix_caps(caps), "shot": shot}
    if len(r) > 4: ln["gap"] = r[4]
    lines.append(ln)
words = sum(len(l["text"].split()) for l in lines)
src = [
 "Rajiv Ahir, A Brief History of Modern India, ch. 3 'Advent of the Europeans in India', The Dutch (pp. 39-41): Houtman at Sumatra and Bantam 1596; 1602 amalgamation and powers (war, treaties, territory, fortresses); Masulipatnam 1605; Pulicat 1609; Nagapatam 1658, Cochin 1663; goods (indigo, silk, saltpetre from Bihar, opium and rice from the Ganga valley); Amboyna 1623. Book errors NOT used: Nagapatam 'near Madras', Dutch 'retired from India' in 1667, 1759 as 'retaliation' for 1672-74",
 "R.C. Majumdar, H.C. Raychaudhuri, K. Datta, An Advanced History of India (as quoted in Ahir): Dutch aims = revenge on Spain/Portugal + spice monopoly",
 "Wikipedia, Dutch East India Company (founded 20 March 1602; nationalised 1796, dissolved 31 December 1799); First Dutch Expedition (Houtman at Banten, June 1596)",
 "Wikipedia, Dutch Coromandel (Masulipatnam 1605; Pulicat/Fort Geldria mint from 1615, 'Kas' copper coins; 'likely over 1,000 handlooms' at Pulicat; Nagapattinam 1658)",
 "Wikipedia, Dutch India / Dutch Malabar (Cochin taken 1663; British occupation 1795; Anglo-Dutch Treaty 1824; transfers 1825)",
 "Wikipedia, Amboyna massacre (9 March 1623: ten English, nine Japanese, one Portuguese executed after confessions under torture)",
 "Wikipedia, Hortus Malabaricus (12 volumes from 1678, 794 engravings; Itty Achudan, Ezhava; three Konkani Brahmin physicians Ranga Bhat, Vinayaka Pandit, Appu Bhat)",
 "Wikipedia, Battle of Colachel (10 August 1741; ~24 officers incl. De Lannoy captured); Eustachius De Lannoy (served Travancore 1741-1777, 'Valiya Kappithan'; gunpowder/rice episode described as tradition); Treaty of Mavelikkara 1753",
 "Wikipedia, Battle of Chinsurah (24-25 November 1759; invited by Mir Jafar; fleet from Batavia with 1,500+ European and Malay troops; 'only sixteen Europeans successfully reached Chinsurah'); Mir Jafar replaced by Mir Kasim",
 "Wikipedia, Dutch Bengal (occupied by British forces 1795)",
]
script = {"title": "Traders, Not Rulers: The Dutch in India", "voice": "bm_george", "speed": 1.0, "lead": 0.5, "outro": 2.0, "gap": 0.25,
          "music": "chapters", "chapters": [{"id": c, "year": y, "title": t} for c, y, t in CH], "sources": src, "lines": lines}
(HERE.parent / "script.json").write_text(json.dumps(script, indent=1, ensure_ascii=False))
# plan screen
md = [f"# {script['title']} — plan\n", f"{len(lines)} cuts · {words} spoken words · bm_george x1.0 (measured 161 wpm) · ~{words/161*60 + 0.25*60 + CARD*8 + 3.5:.0f} s estimated\n",
      "Caption chunks: `|` = next caption, `*` = the crimson word. Phonetic spellings are in the spoken text only.\n"]
cur = None
for i, l in enumerate(lines):
    c = next(x for x in CH if x[0] == l["chapter"])
    if c[0] != cur:
        cur = c[0]; md.append(f"\n## {c[0]} · " + (f"card **{c[1]}: {c[2]}**" if c[1] else c[2] + " (no card)") + "\n")
        md.append("| # | narration (spoken) | captions | shot |\n|---|---|---|---|")
    md.append(f"| {i} | {l['text']} | `{l['caps']}` | {l['shot']} |")
(HERE / "plan.md").write_text("\n".join(md) + "\n")
print(len(lines), "cuts,", words, "words")
