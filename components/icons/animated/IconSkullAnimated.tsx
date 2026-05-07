"use client";

import React from "react";
import MotionIconWrapper from "./MotionIconWrapper";
import IconSkull from "../IconSkull";

export default function IconSkullAnimated(props: { className?: string }) {
  return (
    <MotionIconWrapper className={props.className}>
      <IconSkull className={props.className} />
    </MotionIconWrapper>
  );
}

