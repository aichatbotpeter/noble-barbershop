"""
Javított összefűzés.

Az előző változatnál látszott egy sötét vízszintes vonal a kép közepén:
a képernyőmentés LEGALSÓ sora a nézet pereme, ami sötét — és ez pont a két
sáv találkozásához került. Most mindkét sávból elhagyjuk az utolsó sort.

A képek a mentés során 1920 -> 1568 pixelre kicsinyítődtek, ettől lágyak;
ezt egy finom élesítés kompenzálja.
"""

import glob
import os
import sys

from PIL import Image, ImageFilter

SHOTS = r"C:\Users\petos\AppData\Local\Temp\claude-chrome-screenshots-51ccqy"
IMG_W = 941
BAND = 705
EDGE = 1  # a nézet pereme — ennyi sort dobunk mindkét sáv aljáról


def build(out_dir: str, first_index: int, dims: list[tuple[int, int]]):
    os.makedirs(out_dir, exist_ok=True)
    files = sorted(
        glob.glob(os.path.join(SHOTS, "screenshot-*.jpg")),
        key=lambda p: int(p.rsplit("-", 1)[1].split(".")[0]),
    )
    sel = [f for f in files if int(f.rsplit("-", 1)[1].split(".")[0]) >= first_index]
    sel = sel[: len(dims) * 2]

    for i, (w0, h0) in enumerate(dims):
        top = Image.open(sel[i * 2]).convert("RGB")
        bot = Image.open(sel[i * 2 + 1]).convert("RGB")
        total_h = round(IMG_W * h0 / w0)

        if total_h <= BAND:
            out = top.crop((0, 0, IMG_W, total_h))
        else:
            a = top.crop((0, 0, IMG_W, BAND - EDGE))
            b = bot.crop((0, 0, IMG_W, BAND - EDGE))
            out = Image.new("RGB", (IMG_W, a.height + b.height))
            out.paste(a, (0, 0))
            out.paste(b, (0, a.height))

        # A lekicsinyites miatti lagysag ellensulyozasa
        out = out.filter(ImageFilter.UnsharpMask(radius=1.1, percent=85, threshold=2))
        out.save(f"{out_dir}/foto_{i + 1:02d}.jpg", quality=93, optimize=True,
                 progressive=True, subsampling=0)
        print(f"  foto_{i + 1:02d}: {out.size}")


if __name__ == "__main__":
    print("1. galeria (szalon):")
    build("_assets_raw/pictime", 17, [(1067, 1600)] * 8 + [(1600, 1067)] * 2 + [(1067, 1600)])
    print("2. galeria (David + vendegek):")
    build("_assets_raw/pictime2", 39, [(1067, 1600)] * 4 + [(1600, 1067)] + [(1067, 1600)] * 3)
