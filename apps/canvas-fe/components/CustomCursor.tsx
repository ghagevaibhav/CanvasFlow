"use client";

import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (isFinePointer) {
        document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);

        setTimeout(() => {
          document.documentElement.style.setProperty("--cursor-outer-x", `${e.clientX}px`);
          document.documentElement.style.setProperty("--cursor-outer-y", `${e.clientY}px`);
        }, 80);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null; // No visible output
}

export default CustomCursor;
