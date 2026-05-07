import React from "react";
import SoloCampaignApp from "@/app/(solo)/SoloCampaignApp";

export default {
  title: "Cronista/Pages/SoloCampaign",
  component: SoloCampaignApp,
};

export const Default = () => (
  <div style={{ minHeight: 900, background: "#050505" }}>
    <SoloCampaignApp />
  </div>
);

