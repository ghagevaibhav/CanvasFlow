"use client";

import { useEffect } from 'react';

export function CustomCursor() {
  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer control (mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (isFinePointer) {
        // Apply the styles directly to document body for pseudo-elements
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        
        // Update cursor position with delay for outer element (shadow effect)
        setTimeout(() => {
          document.documentElement.style.setProperty('--cursor-outer-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--cursor-outer-y', `${e.clientY}px`);
        }, 80);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // This component doesn't render anything visible
}

export default CustomCursor;
