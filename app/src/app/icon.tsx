import { ImageResponse } from "next/og";

// Statikus exportnál (output: "export") ezt ki kell mondani, különben a
// build nem tudja, hogy a képet build-időben kell legenerálni.
export const dynamic = "force-static";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: az „N" monogram arany hajszálkerettel, a logó fekete alapján. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0b",
          color: "#f2efe9",
          fontSize: 38,
          letterSpacing: 1,
          border: "2px solid #a88858",
        }}
      >
        N
      </div>
    ),
    size,
  );
}
