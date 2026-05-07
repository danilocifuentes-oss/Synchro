import React from "react";
import * as Icons from "@/app/components/icons-react";
import "../../../app/globals.css";

export default {
  title: "Assets/Icons Gallery",
  parameters: { layout: "padded" },
};

export const AllIcons = () => {
  const entries = Object.entries(Icons) as [string, React.ComponentType<Record<string, unknown>>][];
  return (
    <div style={{ background: "#050505", padding: 20, minHeight: "100vh", color: "#e6e6e6" }}>
      <h2 style={{ fontFamily: "Space Grotesk, Inter", marginBottom: 12 }}>Icon set ({entries.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 12 }}>
        {entries.map(([name, Comp]) => (
          <div key={name} style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, display: "grid", placeItems: "center", color: "var(--terminal)" }}>
                <Comp className="icon" />
              </div>
              <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

