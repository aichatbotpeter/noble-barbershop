"""
Kockák pontozása, hogy ne szemre kelljen kitalálni, melyik használható.

Amit mérünk:
  eles     — Laplace-variancia: mennyire éles / mennyire bemozdult
  vilagos  — átlagos világosság (a túl sötét / kiégett kockák kiesnek)
  kontraszt— szórás
  szin     — átlagos telítettség (a film fekete-fehér szakasza így kiszűrhető)
"""

import glob
import json

import numpy as np
from PIL import Image

rows = []
for path in sorted(glob.glob("_assets_raw/dense/d_*.jpg")):
    im = Image.open(path).convert("RGB")
    small = im.resize((640, 360))
    arr = np.asarray(small, dtype=np.float32)

    gray = arr @ np.array([0.299, 0.587, 0.114], dtype=np.float32)

    # Laplace-kernel konvolúció, egyszerű eltolásokkal
    lap = (
        -4 * gray[1:-1, 1:-1]
        + gray[:-2, 1:-1]
        + gray[2:, 1:-1]
        + gray[1:-1, :-2]
        + gray[1:-1, 2:]
    )
    sharp = float(lap.var())

    mx = arr.max(axis=2)
    mn = arr.min(axis=2)
    sat = float(np.mean((mx - mn) / (mx + 1e-6)))

    idx = int(path.split("_")[-1].split(".")[0])
    rows.append(
        {
            "file": path,
            "t": round((idx - 1) / 5, 1),  # fps=5
            "eles": round(sharp, 1),
            "vilagos": round(float(gray.mean()), 1),
            "kontraszt": round(float(gray.std()), 1),
            "szin": round(sat, 3),
        }
    )

json.dump(rows, open("_assets_raw/scores.json", "w"), indent=1)

# Használható = éles, nem sötét, nem kiégett, és színes (nem a B&W szakasz)
ok = [
    r
    for r in rows
    if r["eles"] > 120 and 55 < r["vilagos"] < 200 and r["kontraszt"] > 28 and r["szin"] > 0.10
]
ok.sort(key=lambda r: -r["eles"])

print(f"osszes kocka: {len(rows)}  |  hasznalhato: {len(ok)}")
print("\n-- a 30 legelesebb --")
for r in ok[:30]:
    print(f"  {r['t']:5.1f}s  eles={r['eles']:7.1f}  vil={r['vilagos']:5.1f}  kontr={r['kontraszt']:5.1f}  szin={r['szin']:.2f}")
