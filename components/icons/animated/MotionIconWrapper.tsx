"use client";

import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";

export default function MotionIconWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;

  const hover = effectiveReduced ? {} : { scale: 1.04, transition: { duration: 0.18 } };
  const pulse = effectiveReduced ? {} : { scale: [1, 1.03, 1], transition: { duration: 2.6, repeat: Infinity } };

  return (
    <motion.span whileHover={hover} animate={pulse} className={className}>
      {children}
    </motion.span>
  );
}

