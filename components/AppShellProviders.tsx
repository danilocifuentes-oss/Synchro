"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "@/context/SettingsContext";
import { CharacterProvider } from "@/context/CharacterContext";
import SettingsWidget from "@/components/SettingsWidget";
import AriaLiveLog from "@/components/AriaLiveLog";
import GlobalKeyboardShortcuts from "@/components/GlobalKeyboardShortcuts";

export default function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <CharacterProvider>
          <AriaLiveLog />
          <GlobalKeyboardShortcuts />
          <div className="scanline-overlay" />
          {children}
          <SettingsWidget />
        </CharacterProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

