import React from "react";
import NexoPreviewPage from "@/app/nexo-preview/page";

export default {
  title: "Cronista/Pages/NexoPage",
  component: NexoPreviewPage,
};

export const Default = () => (
  <div style={{ minHeight: 800, background: "#050505" }}>
    <NexoPreviewPage />
  </div>
);

