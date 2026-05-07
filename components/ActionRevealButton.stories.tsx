import React from "react";
import ActionRevealButton from "@/components/ActionRevealButton";

export default {
  title: "Cronista/ActionRevealButton",
  component: ActionRevealButton,
};

export const Default = () => (
  <div style={{ padding: 20, background: "#050505" }}>
    <ActionRevealButton onPress={() => console.log("press")} onHold={() => console.log("hold")} holdMs={700} className="bg-[var(--neon)] text-black">
      Examinar
    </ActionRevealButton>
  </div>
);

