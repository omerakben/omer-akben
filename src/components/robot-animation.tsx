"use client";

import React, { useEffect } from "react";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

interface RobotAnimationProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function RobotAnimation({
  src = "/assets/robot.lottie",
  loop = true,
  autoplay = true,
  className,
}: RobotAnimationProps) {
  useEffect(() => {
    // Configure the library to use local WASM file
    setWasmUrl("/assets/dotlottie-player.wasm");
  }, []);

  return (
    <div className={className}>
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
}
