# -*- coding: utf-8 -*-
"""
Referencia-fotók előkészítése a weboldalra.

Használat (a repó gyökeréből):

    py app/scripts/prep-reference-photos.py <forras-mappa> [kezdo-sorszam]

A forrásmappa minden képét feldolgozza, és a `public/images/referenciak/`
mappába írja `NN-fotó.jpg` néven. A kezdő sorszám alapértéke 1 — ha meglévő
sorozathoz teszel hozzá, add meg a következő szabad számot (pl. 9).

Utána a fájlokat KÉZZEL vedd fel `src/lib/references.ts`-be, beszédes
`alt` szöveggel — a rács csak azokat mutatja, amik ott szerepelnek.

Miért kell egyáltalán feldolgozni (mindegyik lépés egy konkrét hibát előz meg):
  1. Display P3 -> sRGB. Az iPhone P3-ban ment; ha a profilt csak eldobnánk,
     a böngésző sRGB-ként értelmezné a P3 számokat -> túltelített bőrtónus.
  2. 3:4 vágás, felfelé húzva. A References.tsx rácsa 3:4 — ami nem ilyen,
     azt a CSS vágná le, kiszámíthatatlanul (akár a fej tetejét).
  3. Lanczos kicsinyítés 1400 px-re. A rácsban egy kép ~292 CSS px, retinán
     ~584 — az 1400 ezt bőven fedi, a 12 MP-es eredeti viszont fölösleges
     terhelés a szerver képoptimalizálójának.
  4. Unsharp mask. Minden kicsinyítés lágyít; ez adja vissza a fade éleit.
  5. EXIF-mentés kihagyása. Az iPhone GPS-koordinátát is tesz a fájlba.
"""
import io
import os
import sys

from PIL import Image, ImageCms, ImageFilter

DST = os.path.join(os.path.dirname(__file__), "..", "public", "images", "referenciak")

TARGET_W = 1400
ASPECT = 3 / 4  # szélesség / magasság
EXTS = {".jpg", ".jpeg", ".png", ".webp"}

srgb = ImageCms.createProfile("sRGB")


def to_srgb(im: Image.Image) -> Image.Image:
    icc = im.info.get("icc_profile")
    if not icc:
        return im.convert("RGB")
    src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
    return ImageCms.profileToProfile(im, src, srgb, outputMode="RGB")


def crop_34(im: Image.Image) -> Image.Image:
    """3:4-re vág. Ha magasságból kell elvenni, a felső 20% / alsó 80%
    arányban vágunk: a fej marad, a kápa alja megy el."""
    w, h = im.size
    if abs(w / h - ASPECT) < 0.002:
        return im
    if w / h > ASPECT:  # túl széles -> oldalt, középre
        new_w = round(h * ASPECT)
        x = (w - new_w) // 2
        return im.crop((x, 0, x + new_w, h))
    new_h = round(w / ASPECT)  # túl magas -> fentről/lentről
    top = round((h - new_h) * 0.2)
    return im.crop((0, top, w, top + new_h))


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 1

    src_dir = argv[1]
    start = int(argv[2]) if len(argv) > 2 else 1

    files = sorted(
        f for f in os.listdir(src_dir) if os.path.splitext(f)[1].lower() in EXTS
    )
    if not files:
        print(f"Nincs kep ebben a mappaban: {src_dir}")
        return 1

    os.makedirs(DST, exist_ok=True)
    for i, name in enumerate(files, start=start):
        im = to_srgb(Image.open(os.path.join(src_dir, name)))
        im = crop_34(im)
        im = im.resize((TARGET_W, round(TARGET_W / ASPECT)), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=55, threshold=3))
        out = os.path.join(DST, f"{i:02d}-foto.jpg")
        im.save(out, "JPEG", quality=86, optimize=True, progressive=True, subsampling=1)
        print(f"{name:24s} -> {os.path.basename(out):20s} {os.path.getsize(out)//1024} kB")

    print("\nKesz. Most vedd fel a fajlokat a src/lib/references.ts-be, alt szoveggel.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
