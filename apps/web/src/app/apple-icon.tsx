import { ImageResponse } from "next/og";

/** iOS home-screen icon — the medicom cross on the brand brown tile. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8A5A2E",
          borderRadius: 40,
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24" fill="#ffffff">
          <rect x="9.4" y="2.6" width="5.2" height="18.8" rx="2.4" />
          <rect x="2.6" y="9.4" width="18.8" height="5.2" rx="2.4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
