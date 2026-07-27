import { ImageResponse } from "next/og";
import { site, fullAddress } from "@/lib/site";

// Statikus exportnál (output: "export") ezt ki kell mondani, különben a
// build nem tudja, hogy a képet build-időben kell legenerálni.
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NOBLE | Barbershop — Férfi fodrászat Kecskeméten";

/** Megosztási kép (Facebook, Messenger, WhatsApp, Google). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0b",
          color: "#f2efe9",
        }}
      >
        <div
          style={{
            fontSize: 118,
            letterSpacing: 26,
            paddingLeft: 26, // a betűköz miatti optikai eltolás kiegyenlítése
          }}
        >
          NOBLE
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26 }}>
          <div style={{ width: 90, height: 1, background: "#a88858" }} />
          <div style={{ fontSize: 24, letterSpacing: 7, color: "#c8a472" }}>
            MALE HAIRDRESSING &amp; BARBERING
          </div>
          <div style={{ width: 90, height: 1, background: "#a88858" }} />
        </div>

        <div style={{ fontSize: 27, letterSpacing: 3, color: "#f2efe9", marginTop: 62 }}>
          {fullAddress}
        </div>
        <div style={{ fontSize: 24, letterSpacing: 3, color: "#8d8d8d", marginTop: 14 }}>
          {site.contact.phone}
        </div>
      </div>
    ),
    size,
  );
}
