"use client";

import React from "react";
import MotionIconWrapper from "./MotionIconWrapper";
import IconTerminal from "../IconTerminal";

export default function IconTerminalAnimated(props: { className?: string }) {
  return (
    <MotionIconWrapper className={props.className}>
      <IconTerminal className={props.className} />
    </MotionIconWrapper>
  );
}

