"use client";

import React from "react";
import MotionIconWrapper from "./MotionIconWrapper";
import IconBook from "../IconBook";

export default function IconBookAnimated(props: { className?: string }) {
  return (
    <MotionIconWrapper className={props.className}>
      <IconBook className={props.className} />
    </MotionIconWrapper>
  );
}

