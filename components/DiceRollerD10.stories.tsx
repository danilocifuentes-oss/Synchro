import React from "react";
import DiceRollerD10 from "@/components/DiceRollerD10";

export default {
  title: "Cronista/DiceRollerD10",
  component: DiceRollerD10,
};

export const Default = () => (
  <div style={{ padding: 20, background: "#050505" }}>
    <DiceRollerD10 onResult={(v) => console.log(`Resultado ${v}`)} />
  </div>
);

