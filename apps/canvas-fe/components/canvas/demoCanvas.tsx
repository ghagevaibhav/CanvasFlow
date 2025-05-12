"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

import { toast } from "sonner";
import {
  drawLine,
  drawRectangle,
  drawCircle,
  redrawCanvas,
  saveCanvasState,
  loadCanvasState,
  getThemeColor,
  type DrawingElement,
  type Point,
} from "@/lib/canvas";
import { useTheme } from "@/components/ThemeProvider";
import CustomCheckbox from "./customCheckbox";
import CanvasControls from "./canvascontrols";

const DemoCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<
    "brush" | "rectangle" | "circle" | "eraser" | "move" | "line"
  >("brush");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [history, setHistory] = useState<DrawingElement[][]>([]);
  const [redoHistory, setRedoHistory] = useState<DrawingElement[][]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null
  );
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(
    null
  );
  const [action, setAction] = useState<
    "none" | "moving" | "rotating" | "resizing"
  >("none");
  const [rotationStart, setRotationStart] = useState<Point | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const { theme } = useTheme();

  // Get theme-appropriate background and default colors
  const getThemeColors = useCallback(() => {
    return {
      background: theme === "dark" ? "#1a1a1a" : "#FFFFFF",
      defaultColor: theme === "dark" ? "#FFFFFF" : "#000000",
    };
  }, [theme]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getThemeColors();

    // Set default styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colors.defaultColor;
    ctx.lineWidth = size;

    // Store context reference
    ctxRef.current = ctx;

    // Clear canvas with appropriate background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Try to load saved state
    const savedState = loadCanvasState();
    if (savedState && savedState.elements.length > 0) {
      const themeAdjustedElements = savedState.elements.map((el) => ({
        ...el,
        color: el.themeColor
          ? getThemeColor(el.color, theme, el.themeColor)
          : el.color,
      }));

      setElements(themeAdjustedElements);
      redrawCanvas(ctx, themeAdjustedElements);
    }

    // Update color based on current theme
    setColor(colors.defaultColor);

    // Handle resize
    const handleResize = () => {
      if (!ctx) return;

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Save current drawing
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);

      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Restore drawing
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);

      // Reset context settings
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, getThemeColors, size, color]);

  // Update color based on theme changes
  useEffect(() => {
    const colors = getThemeColors();

    // Update current color if it's the default color from the other theme
    if (
      (theme === "dark" && color === "#000000") ||
      (theme === "light" && color === "#FFFFFF")
    ) {
      setColor(colors.defaultColor);
    }

    // Redraw with theme-appropriate colors
    if (ctxRef.current && canvasRef.current) {
      // Clear canvas with appropriate background
      ctxRef.current.fillStyle = colors.background;
      ctxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (elements.length > 0) {
        // Redraw elements with adjusted colors
        const themeAdjustedElements = elements.map((el) => ({
          ...el,
          color: el.themeColor
            ? getThemeColor(el.color, theme, el.themeColor)
            : el.color,
        }));

        redrawCanvas(ctxRef.current, themeAdjustedElements);
        setElements(themeAdjustedElements);
      }

      // Redraw selection handles if needed
      if (selectedElement) {
        const adjustedSelected = {
          ...selectedElement,
          color: selectedElement.themeColor
            ? getThemeColor(
                selectedElement.color,
                theme,
                selectedElement.themeColor
              )
            : selectedElement.color,
        };
        drawSelectionHandles(ctxRef.current, adjustedSelected);
      }
    }
  }, [theme, getThemeColors, color, elements, selectedElement]);

  // Update context when tool settings change
  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.lineWidth = size;
    ctxRef.current.strokeStyle = color;
  }, [size, color]);

  // Function to check if a point is inside a shape
  const isPointInElement = useCallback(
    (point: Point, element: DrawingElement): boolean => {
      if (element.type === "rectangle" && element.points.length >= 2) {
        const [start, end] = element.points;
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        return (
          point.x >= minX &&
          point.x <= maxX &&
          point.y >= minY &&
          point.y <= maxY
        );
      } else if (element.type === "circle" && element.points.length >= 2) {
        const [start, end] = element.points;
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        const distance = Math.sqrt(
          Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
        );

        return distance <= radius;
      } else if (element.type === "line" && element.points.length >= 2) {
        const [start, end] = element.points;
        const A = point.x - start.x;
        const B = point.y - start.y;
        const C = end.x - start.x;
        const D = end.y - start.y;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
          xx = start.x;
          yy = start.y;
        } else if (param > 1) {
          xx = end.x;
          yy = end.y;
        } else {
          xx = start.x + param * C;
          yy = start.y + param * D;
        }

        const distance = Math.sqrt(
          Math.pow(point.x - xx, 2) + Math.pow(point.y - yy, 2)
        );

        return distance < 10; // 10px tolerance for line selection
      }

      return false;
    },
    []
  );

  // Function to find a shape at given coordinates
  const getElementAtPosition = useCallback(
    (point: Point): DrawingElement | null => {
      // Check shapes in reverse order (top to bottom)
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(point, elements[i])) {
          return elements[i];
        }
      }
      return null;
    },
    [elements, isPointInElement]
  );

  // Check if point is on a resize handle
  const getResizeHandleAtPosition = useCallback(
    (point: Point, element: DrawingElement): string | null => {
      if (element.type !== "rectangle" && element.type !== "circle")
        return null;

      const handleSize = 8;
      const [start, end] = element.points;

      if (element.type === "rectangle") {
        // Calculate actual corners
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        // Top-left
        if (
          Math.abs(point.x - minX) < handleSize &&
          Math.abs(point.y - minY) < handleSize
        ) {
          return "tl";
        }
        // Top-right
        if (
          Math.abs(point.x - maxX) < handleSize &&
          Math.abs(point.y - minY) < handleSize
        ) {
          return "tr";
        }
        // Bottom-left
        if (
          Math.abs(point.x - minX) < handleSize &&
          Math.abs(point.y - maxY) < handleSize
        ) {
          return "bl";
        }
        // Bottom-right
        if (
          Math.abs(point.x - maxX) < handleSize &&
          Math.abs(point.y - maxY) < handleSize
        ) {
          return "br";
        }
      } else if (element.type === "circle") {
        // Resize handle at the edge of the circle
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        const distance = Math.sqrt(
          Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
        );

        if (Math.abs(distance - radius) < handleSize) {
          return "edge";
        }
      }

      return null;
    },
    []
  );

  // Check if point is on a rotation handle
  const isPointOnRotationHandle = useCallback(
    (point: Point, element: DrawingElement): boolean => {
      if (element.type !== "rectangle" && element.type !== "circle")
        return false;

      const handleSize = 8;
      const [start, end] = element.points;

      if (element.type === "rectangle") {
        // Calculate actual corners
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);

        // Rotation handle above the center top
        const centerX = (minX + maxX) / 2;
        const topY = minY;

        return (
          Math.abs(point.x - centerX) < handleSize &&
          Math.abs(point.y - (topY - 20)) < handleSize
        );
      } else if (element.type === "circle") {
        // Rotation handle above the circle
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        return (
          Math.abs(point.x - start.x) < handleSize &&
          Math.abs(point.y - (start.y - radius - 20)) < handleSize
        );
      }

      return false;
    },
    []
  );

  // Start drawing
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current || !ctxRef.current) return;

    e.preventDefault();

    const { offsetX, offsetY } = getPointerPosition(e);
    setStartPoint({ x: offsetX, y: offsetY });

    // For move tool, check if we're selecting an element
    if (tool === "move") {
      const element = getElementAtPosition({ x: offsetX, y: offsetY });

      if (element) {
        setSelectedElement(element);

        // Check if clicking on a resize handle
        const handle = getResizeHandleAtPosition(
          { x: offsetX, y: offsetY },
          element
        );
        if (handle) {
          setAction("resizing");
          setResizeHandle(handle);
        }
        // Check if clicking on rotation handle
        else if (isPointOnRotationHandle({ x: offsetX, y: offsetY }, element)) {
          setAction("rotating");
          setRotationStart({ x: offsetX, y: offsetY });
        }
        // Otherwise, we're moving the element
        else {
          setAction("moving");
        }
      } else {
        // Clicking on empty space
        setSelectedElement(null);
        setAction("none");
      }
    }
    // For drawing tools
    else {
      setAction("none");
      setSelectedElement(null);

      if (tool === "brush") {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setCurrentElement({
          type: "path",
          points: [{ x: offsetX, y: offsetY }],
          color: color,
          size: size,
          themeColor: theme as "light" | "dark",
        });
      } else if (tool === "eraser") {
        const colors = getThemeColors();
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setCurrentElement({
          type: "path",
          points: [{ x: offsetX, y: offsetY }],
          color: colors.background, // Use current background color
          size: size * 2, // Make eraser slightly larger
          themeColor: theme as "light" | "dark",
        });
      } else if (tool === "rectangle" || tool === "circle" || tool === "line") {
        setCurrentElement({
          type: tool,
          points: [
            { x: offsetX, y: offsetY },
            { x: offsetX, y: offsetY },
          ],
          color: color,
          size: size,
          themeColor: theme as "light" | "dark",
        });
      }
    }

    setIsDrawing(true);
  };

  // Continue drawing
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !canvasRef.current || !ctxRef.current) return;

    e.preventDefault();

    const { offsetX, offsetY } = getPointerPosition(e);

    // If we're in move mode and have a selected element
    if (tool === "move" && selectedElement) {
      const canvas = canvasRef.current;
      const colors = getThemeColors();

      // Make a copy of the elements array without the selected element
      const elementsCopy = elements.filter((el) => el !== selectedElement);

      // Clone the selected element for manipulation
      const updatedElement = { ...selectedElement };

      if (action === "moving" && startPoint) {
        // Calculate how much the mouse has moved
        const dx = offsetX - startPoint.x;
        const dy = offsetY - startPoint.y;

        // Update the element's points
        updatedElement.points = selectedElement.points.map((point) => ({
          x: point.x + dx,
          y: point.y + dy,
        }));

        // Update the start point for the next movement
        setStartPoint({ x: offsetX, y: offsetY });
      } else if (action === "resizing" && resizeHandle) {
        const [start, end] = selectedElement.points;

        if (selectedElement.type === "rectangle") {
          let newPoints = [...selectedElement.points];

          switch (resizeHandle) {
            case "tl": // Top-left
              newPoints = [{ x: offsetX, y: offsetY }, end];
              break;
            case "tr": // Top-right
              newPoints = [
                { x: start.x, y: offsetY },
                { x: offsetX, y: end.y },
              ];
              break;
            case "bl": // Bottom-left
              newPoints = [
                { x: offsetX, y: start.y },
                { x: end.x, y: offsetY },
              ];
              break;
            case "br": // Bottom-right
              newPoints = [start, { x: offsetX, y: offsetY }];
              break;
          }

          updatedElement.points = newPoints;
        } else if (
          selectedElement.type === "circle" &&
          resizeHandle === "edge"
        ) {
          // For circle, update the radius point
          const dx = offsetX - start.x;
          const dy = offsetY - start.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Update radius point based on the mouse position
          updatedElement.points = [
            start,
            {
              x: start.x + distance,
              y: start.y,
            },
          ];
        }
      } else if (action === "rotating" && rotationStart) {
        // For now, rotation is not fully implemented
        // We would need to add a rotation property to DrawingElement interface
      }

      // Clear canvas and redraw all elements including the updated one
      ctxRef.current.fillStyle = colors.background;
      ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);

      redrawCanvas(ctxRef.current, [...elementsCopy, updatedElement]);

      // Draw selection handles
      drawSelectionHandles(ctxRef.current, updatedElement);

      // Update selected element reference temporarily
      setSelectedElement(updatedElement);
    }
    // For drawing tools
    else if (currentElement) {
      if (tool === "brush" || tool === "eraser") {
        // For brush and eraser, add point and draw
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();

        setCurrentElement({
          ...currentElement,
          points: [...currentElement.points, { x: offsetX, y: offsetY }],
        });
      } else if (tool === "rectangle" || tool === "circle" || tool === "line") {
        // For shapes, update endpoint and redraw
        const canvas = canvasRef.current;
        const colors = getThemeColors();

        // Clear canvas and redraw existing elements
        ctxRef.current.fillStyle = colors.background;
        ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
        redrawCanvas(ctxRef.current, elements);

        // Update current element
        const updatedElement = {
          ...currentElement,
          points: [currentElement.points[0], { x: offsetX, y: offsetY }],
        };

        // Draw the current shape
        if (tool === "rectangle") {
          drawRectangle(
            ctxRef.current,
            updatedElement.points,
            updatedElement.color,
            updatedElement.size
          );
        } else if (tool === "circle") {
          drawCircle(
            ctxRef.current,
            updatedElement.points,
            updatedElement.color,
            updatedElement.size
          );
        } else if (tool === "line") {
          drawLine(
            ctxRef.current,
            updatedElement.points,
            updatedElement.color,
            updatedElement.size
          );
        }

        setCurrentElement(updatedElement);
      }
    }
  };

  // Draw selection handles around a selected element
  const drawSelectionHandles = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    const handleSize = 8;

    if (element.type === "rectangle") {
      const [start, end] = element.points;
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      // Draw selection rectangle
      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
      ctx.setLineDash([]);

      // Draw resize handles
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 1;

      // Top-left
      ctx.beginPath();
      ctx.rect(
        minX - handleSize / 2,
        minY - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.rect(
        maxX - handleSize / 2,
        minY - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.rect(
        minX - handleSize / 2,
        maxY - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.rect(
        maxX - handleSize / 2,
        maxY - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();

      // Draw rotation handle
      const centerX = (minX + maxX) / 2;
      ctx.beginPath();
      ctx.arc(centerX, minY - 20, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw line from top center to rotation handle
      ctx.beginPath();
      ctx.moveTo(centerX, minY);
      ctx.lineTo(centerX, minY - 20);
      ctx.stroke();
    } else if (element.type === "circle") {
      const [center, radiusPoint] = element.points;
      const radius = Math.sqrt(
        Math.pow(radiusPoint.x - center.x, 2) +
          Math.pow(radiusPoint.y - center.y, 2)
      );

      // Draw selection circle
      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw resize handle at right edge
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(center.x + radius, center.y, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw rotation handle
      ctx.beginPath();
      ctx.arc(center.x, center.y - radius - 20, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw line from top to rotation handle
      ctx.beginPath();
      ctx.moveTo(center.x, center.y - radius);
      ctx.lineTo(center.x, center.y - radius - 20);
      ctx.stroke();
    } else if (element.type === "line") {
      const [start, end] = element.points;

      // Draw selection indicators at the endpoints
      ctx.strokeStyle = "#4a90e2";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 1;

      // Start point
      ctx.beginPath();
      ctx.arc(start.x, start.y, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // End point
      ctx.beginPath();
      ctx.arc(end.x, end.y, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw dashed line over the selected line
      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current || !ctxRef.current) return;

    // If we were in move mode
    if (tool === "move" && selectedElement && action !== "none") {
      // Get the final updated element
      const finalElement = { ...selectedElement };

      // Remove the selected element from elements array
      const elementsWithoutSelected = elements.filter(
        (el) => el !== selectedElement
      );

      // Add the updated element back to the elements array
      const newElements = [...elementsWithoutSelected, finalElement];
      setElements(newElements);

      // Clear redo history since we've made a new change
      setRedoHistory([]);

      // Add to history for undo
      setHistory((prev) => [...prev, elements]);

      // Save canvas state
      saveCanvasState({
        elements: newElements,
        currentElement: null,
      });

      // Reset action
      setAction("none");

      // Keep the element selected
      setSelectedElement(finalElement);
    }
    // If we were drawing
    else if (currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);

      // Clear redo history since we've made a new change
      setRedoHistory([]);

      // Add to history for undo
      setHistory((prev) => [...prev, elements]);

      // Save canvas state
      saveCanvasState({
        elements: newElements,
        currentElement: null,
      });
    }

    setIsDrawing(false);
    setCurrentElement(null);
    setStartPoint(null);
    setResizeHandle(null);
    setRotationStart(null);
  };

  // Helper function to get pointer position
  const getPointerPosition = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    let offsetX, offsetY;

    if ("touches" in e) {
      // Touch event
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }

    return { offsetX, offsetY };
  };

  // Undo
  const handleUndo = () => {
    if (!canvasRef.current || !ctxRef.current) return;

    if (history.length > 0) {
      const previousElements = history[history.length - 1];

      // Add current state to redo history
      setRedoHistory((prev) => [...prev, elements]);

      // Update elements to previous state
      setElements(previousElements);

      // Remove the last item from history
      setHistory((prev) => prev.slice(0, -1));

      // Clear canvas and redraw
      const canvas = canvasRef.current;
      const colors = getThemeColors();

      ctxRef.current.fillStyle = colors.background;
      ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
      redrawCanvas(ctxRef.current, previousElements);

      // Save state
      saveCanvasState({
        elements: previousElements,
        currentElement: null,
      });

      // Clear selection since we've undone changes
      setSelectedElement(null);
    } else {
      toast.info("Nothing to undo");
    }
  };

  // Redo
  const handleRedo = () => {
    if (!canvasRef.current || !ctxRef.current) return;

    if (redoHistory.length > 0) {
      const nextElements = redoHistory[redoHistory.length - 1];

      // Add current state to normal history
      setHistory((prev) => [...prev, elements]);

      // Update elements to next state
      setElements(nextElements);

      // Remove the last item from redo history
      setRedoHistory((prev) => prev.slice(0, -1));

      // Clear canvas and redraw
      const canvas = canvasRef.current;
      const colors = getThemeColors();

      ctxRef.current.fillStyle = colors.background;
      ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
      redrawCanvas(ctxRef.current, nextElements);

      // Save state
      saveCanvasState({
        elements: nextElements,
        currentElement: null,
      });

      // Clear selection since we've redone changes
      setSelectedElement(null);
    } else {
      toast.info("Nothing to redo");
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;

    // Add current state to history before clearing
    setHistory((prev) => [...prev, elements]);

    // Clear redo history
    setRedoHistory([]);

    const canvas = canvasRef.current;
    const colors = getThemeColors();

    ctxRef.current.fillStyle = colors.background;
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);

    setElements([]);

    // Save empty state
    saveCanvasState({
      elements: [],
      currentElement: null,
    });

    // Clear selection
    setSelectedElement(null);

    toast.success("Canvas cleared");
  };

  // Export canvas as image
  const downloadCanvas = () => {
    if (!canvasRef.current) return;

    // Temporarily hide selection handles
    if (selectedElement && ctxRef.current) {
      const canvas = canvasRef.current;
      const colors = getThemeColors();

      ctxRef.current.fillStyle = colors.background;
      ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
      redrawCanvas(ctxRef.current, elements);
    }

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Redraw selection handles
    if (selectedElement && ctxRef.current) {
      drawSelectionHandles(ctxRef.current, selectedElement);
    }

    toast.success("Image downloaded");
  };

  // Handle canvas click to deselect when clicking empty space
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "move" && !isDrawing) {
      const { offsetX, offsetY } = getPointerPosition(e);
      const clickedElement = getElementAtPosition({ x: offsetX, y: offsetY });

      if (!clickedElement && selectedElement) {
        setSelectedElement(null);

        // Redraw without selection handles
        if (ctxRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          const colors = getThemeColors();

          ctxRef.current.fillStyle = colors.background;
          ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
          redrawCanvas(ctxRef.current, elements);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {[0, 1, 2, 3].map((value) => (
          <div key={value} className="flex items-center gap-2">
            <CustomCheckbox
              checked={value !== 0}
              value={value.toString()}
              onChange={() => {}}
            />
            <span className="text-sm">{value}</span>
          </div>
        ))}
      </div>

      <CanvasControls
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={clearCanvas}
        onDownload={downloadCanvas}
        canUndo={history.length > 0}
        canRedo={redoHistory.length > 0}
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full bg-background"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default DemoCanvas;
