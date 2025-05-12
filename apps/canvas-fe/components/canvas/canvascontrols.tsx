"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/components/ThemeProvider";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pen,
  ArrowRight,
  Square,
  Circle,
  Plus,
  Eraser,
  RotateCcw,
  RotateCw,
  Download,
  Trash2,
  MousePointer,
} from "lucide-react";

interface CanvasControlsProps {
  tool: "brush" | "rectangle" | "circle" | "eraser" | "move" | "line";
  setTool: (
    tool: "brush" | "rectangle" | "circle" | "eraser" | "move" | "line"
  ) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload?: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CanvasControls = ({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  canUndo,
  canRedo,
}: CanvasControlsProps) => {
  const { theme } = useTheme();
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Basic color palette
  const colors = [
    theme === "dark" ? "#FFFFFF" : "#000000", // White/Black
    "#FF3B30", // Red
    "#5AC8FA", // Blue
    "#4CD964", // Green
    "#FF9500", // Orange
    "#5856D6", // Purple
  ];

  // Close slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSizeSlider &&
        sliderRef.current &&
        buttonRef.current &&
        !sliderRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowSizeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSizeSlider]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass p-3 rounded-md shadow-md flex flex-col gap-3 justify-center items-center">
        {/* Selection Tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "move" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("move")}
              className="h-8 w-8 rounded-md"
            >
              <MousePointer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Select & Move</TooltipContent>
        </Tooltip>

        {/* Drawing Tools */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "brush" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("brush")}
              className="h-8 w-8 rounded-md"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Pen</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "line" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("line")}
              className="h-8 w-8 rounded-md"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Line</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "rectangle" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("rectangle")}
              className="h-8 w-8 rounded-md"
            >
              <Square className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Rectangle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "circle" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("circle")}
              className="h-8 w-8 rounded-md"
            >
              <Circle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Circle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              onClick={() => setShowSizeSlider(!showSizeSlider)}
              className="h-8 w-8 rounded-md relative"
            >
              <Plus className="h-4 w-4" />
              {showSizeSlider && (
                <div
                  ref={sliderRef}
                  className="absolute left-full ml-3 bg-background border rounded-md p-3 shadow-md w-36 z-20"
                >
                  <Slider
                    value={[size]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setSize(value[0])}
                    className="w-28"
                  />
                  <div className="text-xs text-center mt-1">{size}px</div>
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Brush Size</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === "eraser" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTool("eraser")}
              className="h-8 w-8 rounded-md"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Eraser</TooltipContent>
        </Tooltip>

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md flex items-center justify-center"
            >
              <div
                className="h-5 w-5 rounded-full border border-muted-foreground"
                style={{ backgroundColor: color }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-auto p-2">
            <div className="flex flex-wrap gap-1 justify-center">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`h-6 w-6 rounded-full ${
                    color === c ? "ring-1 ring-primary ring-offset-1" : ""
                  } transition-transform hover:scale-110`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 cursor-pointer appearance-none bg-transparent"
              />
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-px w-6 bg-border mx-1"></div>

        {/* Actions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 rounded-md"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 rounded-md"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Redo</TooltipContent>
        </Tooltip>

        {onDownload && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                className="h-8 w-8 rounded-md"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Download</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-8 w-8 rounded-md"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Clear Canvas</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default CanvasControls;
