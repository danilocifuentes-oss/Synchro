import React from "react";
import CharacterStatusPanel from "@/components/CharacterStatusPanel";

export default {
  title: "Cronista/CharacterStatusPanel",
  component: CharacterStatusPanel,
};

export const Expanded = () => (
  <div style={{ padding: 20, background: "#050505" }}>
    <CharacterStatusPanel compact={false} integridad={{ current: 2, max: 5 }} voluntad={{ current: 3, max: 5 }} ansia={2} />
  </div>
);

export const Compact = () => (
  <div style={{ padding: 20, background: "#050505" }}>
    <CharacterStatusPanel compact={true} integridad={{ current: 2, max: 5 }} voluntad={{ current: 3, max: 5 }} ansia={2} />
  </div>
);

