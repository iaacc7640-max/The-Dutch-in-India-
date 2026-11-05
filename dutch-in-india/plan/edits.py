# Round-2 edits to the draft rows: trim to the 4:50-5:10 target and keep every cut <= 3.5 s. Applied by draft.py.
# key = the row's current spoken text; value = list of replacement rows (text, caps, shot[, gap]) — 2 rows = a split.
E = {
 "To see how he got there, we have to go back to Amsterdam,": [("To see how he got there, we go back to Amsterdam,", "To see *how | he got *there, | we go back to *Amsterdam,", None)],
 "In fifteen ninety-six, Cornelis de Howtman's ships reached Java,": [
   ("In fifteen ninety-six,", "In *1596,", "Gold ribbon 1596 drops onto a WIDE realMap of Europe to Indonesia."),
   ("Cornelis de Howtman's ships reached Java,", "Cornelis de *Houtman's | ships reached *Java,", "Route draws Amsterdam to Cape to Java; Houtman figure (wide hat, ruff) inset left.")],
 "and the Dutch had found their own way to the spice islands.": [("and the Dutch had their own route to the spices.", "and the Dutch had | their *own route | to the spices.", None)],
 "Back home, they were fighting for independence from Spain,": [("Back home, they were fighting Spain for independence,", "Back home, | they were fighting Spain | for *independence,", None)],
 "was business and revenge at the same time.": [("was business and revenge at once.", "was *business | and *revenge | at once.", None)],
 "Ordinary citizens could buy shares in it.": [("Ordinary citizens could buy shares.", "Ordinary *citizens | could buy *shares.", None)],
 "And it could do things few companies had ever done:": [("And it could do what few companies ever had:", "And it could do | what few companies | *ever had:", None)],
 "build forts, sign treaties, mint coins, and wage war.": [
   ("build forts, sign treaties,", "build *forts, | sign *treaties,", "Icons pop one per word: a fort, then a treaty scroll."),
   ("mint coins, and wage war.", "mint *coins, | and wage *war.", "Then a coin and a cannon; the four icons line up.", "CARD")],
 "Their first factory in India": [("Their first factory, on the Koro-man-del coast,", "Their first *factory, | on the Coromandel coast,", "realMap wide on India; the Coromandel (east) coast highlights.")],
 "opened at Mussoo-lee-putnam, on the Koro-man-del coast, in sixteen-oh-five.": [("opened at Mussoo-lee-putnam in sixteen-oh-five.", "opened at *Masulipatnam | in 1605.", None)],
 "At Poo-lee-kat alone, there may have been": [("Poo-lee-kat alone may have had", "*Pulicat alone | may have had", None)],
 "Because the people of the Spice Islands wanted Indian cloth.": [("Because the Spice Islands wanted Indian cloth.", "Because the *Spice Islands | wanted Indian *cloth.", None)],
 "So the Dutch ran a loop:": [("So they ran a loop:", "So they ran | a *loop:", None)],
 "the Dutch accused English traders of plotting to seize their fort.": [
   ("the Dutch accused English traders", "the Dutch *accused | English traders", "Letter with a broken seal under the navy wash."),
   ("of plotting to seize their fort.", "of *plotting | to seize their fort.", "Slip 'PLOT?' pins on the letter.")],
 "nine Japanese soldiers and one Portuguese man.": [
   ("nine Japanese soldiers", "*nine Japanese soldiers", "Japanese soldier standing guard (far, dim); more names ink in."),
   ("and one Portuguese man.", "and *one Portuguese man.", "Names reach twenty; the candle goes out.")],
 "and the English put more and more of their effort into India.": [("and the English turned more and more to India.", "and the English | turned more and more | to *India.", None)],
 "Meanwhile the Dutch went after their old enemy.": [("Meanwhile, they went after their old enemy.", "Meanwhile, | they went after | their old *enemy.", None)],
 "As historians R. C. Mozoom-dar and his co-authors put it,": [("As R. C. Mo-joom-daar and his co-authors put it,", "As R.C. *Majumdar | and his co-authors | put it,", None)],
 "In sixteen fifty-eight they took Naaga-putti-num from the Portuguese,": [
   ("In sixteen fifty-eight", "In *1658", "Gold ribbon 1658 over the south-east coast."),
   ("they took Naaga-putti-num from the Portuguese,", "they took *Nagapattinam | from the Portuguese,", "Pin NAGAPATTINAM; its flag swaps Portuguese to Dutch.")],
 "and with it the last Portuguese forts on the Mala-bar coast.": [("and with it, Portugal's last forts on the Mala-bar coast.", "and with it, | Portugal's last *forts | on the Malabar coast.", None)],
 "His key expert was Itty Ah-choo-dun, a local Eezha-va physician,": [
   ("His key expert was Itty Ah-choo-dun,", "His key *expert | was Itty *Achudan,", "Itty Achudan (white mundu) reads a palm-leaf manuscript."),
   ("a local Eezha-va physician,", "a local Ezhava *physician,", "Herbs sketch themselves in ink beside him.")],
 "came out in twelve volumes, starting in sixteen seventy-eight,": [("came out in twelve volumes from sixteen seventy-eight,", "came out in | *twelve volumes | from 1678,", None)],
 "It is one of the earliest great books on tropical plants,": [("It is one of the earliest great books on tropical plants,", "It is one | of the *earliest | great books | on tropical plants,", None)],
 "and it was built on Indian knowledge.": [("built on Indian knowledge.", "built on Indian *knowledge.", None, "CARD")],
 "By the seventeen-thirties, King Maar-taanda Varma of Travan-kor": [
   ("By the seventeen-thirties,", "By the *1730s,", "Map: the south-west coast, Travancore pin."),
   ("King Maar-thaanda Varma of Travan-kor", "King Marthanda *Varma | of Travancore", "Marthanda Varma (gold crown, conch emblem on forest green) standing.")],
 "and the Dutch surrendered.": [("and soon the Dutch surrendered.", "and soon the Dutch | *surrendered.", None)],
 "Their commander, Yoo-stah-kee-us De Lan-wah, was taken prisoner,": [
   ("Their commander, Yoo-stah-kee-us De Lan-wah,", "Their commander, | Eustachius *De Lannoy,", "The cold-open two-shot again: the sword handover, now explained."),
   ("was taken prisoner, and then recruited.", "was taken *prisoner, | and then *recruited.", "His coat swaps from Dutch blue to Travancore green.")],
 "and then recruited.": [],
 "and in seventeen fifty-nine a Dutch fleet sailed up the Hoog-lee": [
   ("and in seventeen fifty-nine", "and in *1759", "Gold ribbon 1759; river mouth from above."),
   ("a Dutch fleet sailed up the Hoog-lee", "a Dutch fleet | sailed up the *Hooghly", "Wide river pan: Dutch ships sail in from Batavia, right to left.")],
 "Only sixteen of those European soldiers reached the Dutch fort.": [("Only sixteen European soldiers reached the Dutch fort.", "Only *sixteen | European soldiers | reached the Dutch fort.", None)],
 "Soon after, the British removed Meer Jaa-far": [("Soon after, the British replaced Meer Jaa-far", "Soon after, | the British *replaced | Mir Jafar", None)],
 "and placed his son-in-law, Meer Kaa-sim, on the throne.": [("with his son-in-law, Meer Kaa-sim,", "with his son-in-law, | Mir *Kasim,", "A second turban settles on the cushion.")],
 "Their grip on Bengal grew even tighter.": [("and tightened their grip on Bengal.", "and tightened | their *grip | on Bengal.", None, "CARD")],
 "The company itself was wound up in seventeen ninety-nine.": [
   ("The company itself", "The *company itself", "The gold VOC seal fills the frame."),
   ("was wound up in seventeen ninety-nine.", "was *wound up | in 1799.", "The seal cracks in two.")],
 "Under a treaty with Britain in eighteen twenty-four,": [("By a treaty with Britain in eighteen twenty-four,", "By a *treaty | with Britain | in 1824,", None)],
 "the Dutch gave up what was left,": [("they gave up the rest,", "they gave up | the *rest,", None)],
 "and handed it over in eighteen twenty-five.": [("handing it over in eighteen twenty-five.", "handing it over | in *1825.", None)],

 "and to a very new idea:": [("and a very new idea:", "and a very | new *idea:", None)],
 "where they built a fort and minted their own copper coins.": [("where they built a fort and minted copper coins.", "where they built a *fort | and minted copper *coins.", None)],
 "buy cotton cloth in India,": [],
 "For a while, Kerala's pepper trade ran through Dutch hands.": [("For a while, Kerala's pepper ran through Dutch hands.", "For a while, | Kerala's *pepper | ran through Dutch hands.", None, "CARD")],
}
E["So the Dutch ran a loop:"] = [("So they ran a loop: buy cotton cloth in India,", "So they ran a *loop: | buy cotton *cloth | in India,", "THE TRADE LOOP frame (India left, Spice Islands right, Amsterdam top); leg 1 draws India to Spice Islands with a cloth icon.")]
E["and with it the last Portuguese forts on the Mala-bar coast."] = [("and with it, Portugal's last Mala-bar forts.", "and with it, | Portugal's last | Malabar *forts.", None)]
E["Only sixteen of those European soldiers reached the Dutch fort."] = [("Only sixteen Europeans got through to the fort.", "Only *sixteen Europeans | got through | to the fort.", None)]
E["The company itself was wound up in seventeen ninety-nine."] = [("The company was wound up in seventeen ninety-nine.", "The company | was *wound up | in 1799.", "The gold VOC seal fills the frame, then cracks in two.")]
E["the Dutch gave up what was left,"] = [("they gave up the rest, handing it over in eighteen twenty-five.", "they gave up | the *rest, | handing it over | in 1825.", "2 shots: remaining pins flip; then on 'handing' the trade loop un-draws and the era bar lands on 1825.")]
E["and handed it over in eighteen twenty-five."] = []
E["Soon after, the British removed Meer Jaa-far"] = [("Then the British replaced Meer Jaa-far", "Then the British | *replaced | Mir Jafar", None)]
E["and served it for the rest of his life."] = [("and served it for the rest of his life.", "and *served it | for the rest of his *life.", None)]
E["Along the way they carried indigo, silk from Bengal,"] = [("Along the way they carried indigo, silk from Bengal,", "Along the *way | they carried *indigo, | silk from *Bengal,", None)]
