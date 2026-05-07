import React from "react";
import "../../../app/globals.css";

const SIGILS = Array.from({ length: 16 }).map((_, i) => `sigil-${String(i + 1).padStart(2, "0")}`);

export default {
  title: "Assets/Avatars Gallery",
  parameters: { layout: "padded" },
};

export const SVGandRaster = () => {
  return (
    <div style={{ background: "#050505", padding: 20, minHeight: "100vh", color: "#e6e6e6" }}>
      <h2 style={{ fontFamily: "Space Grotesk, Inter", marginBottom: 12 }}>Avatar sigils ({SIGILS.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
        {SIGILS.map((id) => {
          const rasterBase = `/avatars/raster/${id}`;
          const raster128 = `${rasterBase}_128.webp`;
          const raster64 = `${rasterBase}_64.webp`;
          const raster40 = `${rasterBase}_40.webp`;
          return (
            <div key={id} style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <img src={`/avatars/${id}.svg`} alt={id} style={{ width: 40, height: 40 }} />
                </div>

                <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", flex: 1 }}>
                  <div>{id}</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <picture>
                      <source srcSet={raster128} type="image/webp" />
                      <img src={`/avatars/raster/${id}_128.png`} alt={`${id} 128`} width="48" height="48" />
                    </picture>
                    <picture>
                      <source srcSet={raster64} type="image/webp" />
                      <img src={`/avatars/raster/${id}_64.png`} alt={`${id} 64`} width="40" height="40" />
                    </picture>
                    <picture>
                      <source srcSet={raster40} type="image/webp" />
                      <img src={`/avatars/raster/${id}_40.png`} alt={`${id} 40`} width="32" height="32" />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

