"""
A két sávban kimentett fotók összefűzése — pontos geometriával.

A kimentő nézet ismert paraméterei:
  - a lap belső szélessége 1920 CSS px, a képernyőkép 1568 px -> 0.81667 arány
  - a kép szélessége a nézetben 60% = 1152 CSS px -> 941 képpont
  - a látható sáv magassága 705 képpont (a nézet a teljes ablakot fedi)

Ebből minden méret kiszámolható, nem kell képi kereséssel bajlódni.
"""

import glob
import os

from PIL import Image

SHOTS = r"C:\Users\petos\AppData\Local\Temp\claude-chrome-screenshots-51ccqy"
OUT = "_assets_raw/pictime"
os.makedirs(OUT, exist_ok=True)

SCALE = 1568 / 1920
IMG_W = round(0.6 * 1920 * SCALE)  # 941
BAND = 705  # a nezet lathato magassaga keppontban

# A galeria kepeinek eredeti meretei, sorrendben
DIMS = [
    (1067, 1600), (1067, 1600), (1067, 1600), (1067, 1600),
    (1067, 1600), (1067, 1600), (1067, 1600), (1067, 1600),
    (1600, 1067), (1600, 1067), (1067, 1600),
]

files = sorted(
    glob.glob(os.path.join(SHOTS, "screenshot-*.jpg")),
    key=lambda p: int(p.rsplit("-", 1)[1].split(".")[0]),
)
sel = [f for f in files if int(f.rsplit("-", 1)[1].split(".")[0]) >= 17][:22]

for i, (w0, h0) in enumerate(DIMS):
    top = Image.open(sel[i * 2]).convert("RGB")
    bot = Image.open(sel[i * 2 + 1]).convert("RGB")

    total_h = round(IMG_W * h0 / w0)

    if total_h <= BAND:
        # Elfer egy savban: eleg a felso kep
        out = top.crop((0, 0, IMG_W, total_h))
    else:
        a = top.crop((0, 0, IMG_W, BAND))
        b = bot.crop((0, 0, IMG_W, BAND))
        out = Image.new("RGB", (IMG_W, BAND * 2))
        out.paste(a, (0, 0))
        out.paste(b, (0, BAND))

    out.save(f"{OUT}/foto_{i + 1:02d}.jpg", quality=93, optimize=True,
             progressive=True, subsampling=0)
    print(f"foto_{i + 1:02d}: {out.size}  (eredeti {w0}x{h0})")
