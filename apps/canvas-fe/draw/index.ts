import { BACKEND_URL } from "@/config/config";
import axios from "axios";

/**
 * Represents different types of shapes that can be drawn on the canvas
 */
type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

/**
 * Singleton class to manage drawing functionality on the canvas
 */
class DrawSingleton {
  private static instance: DrawSingleton;
  private existingShapes: Shape[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private socket: WebSocket | null = null;

  private constructor() {}

  /**
   * Gets the singleton instance of DrawSingleton
   */
  public static getInstance() {
    if (!DrawSingleton.instance) {
      DrawSingleton.instance = new DrawSingleton();
    }
    return DrawSingleton.instance;
  }

  /**
   * Initializes the drawing functionality on the canvas
   * @param canvas - The HTML canvas element
   * @param roomId - The ID of the room for collaboration
   * @param socket - WebSocket connection for real-time updates
   */
  public async initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
  ) {
    this.socket = socket;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.existingShapes = await this.getExistingShapes(roomId);
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) return;

    // Set up WebSocket message handler
    this.socket.onmessage = (event) => {
      console.log("ws msg:", event.data);
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedData = JSON.parse(message.message);
        console.log("parsed msg:", parsedData);
        if (parsedData.shape) {
          this.existingShapes.push(parsedData.shape);
          this.clearCanvas(canvas);
        }
      }
    };

    this.clearCanvas(canvas);

    // Set up mouse event listeners
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this, roomId));
    canvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this, canvas)
    );

    // Return cleanup function
    return () => {
      if (this.socket) {
        this.socket.close();
      }
      canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
      canvas.removeEventListener(
        "mouseup",
        this.handleMouseUp.bind(this, roomId)
      );
      canvas.removeEventListener(
        "mousemove",
        this.handleMouseMove.bind(this, canvas)
      );
    };
  }

  /**
   * Clears the canvas and redraws all existing shapes
   * @param canvas - The HTML canvas element to clear
   */
  private clearCanvas(canvas: HTMLCanvasElement) {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.existingShapes.forEach((shape) => {
      if (this.ctx) {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        if (shape.type === "rect") {
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
          this.ctx.beginPath();
          this.ctx.arc(
            shape.centerX,
            shape.centerY,
            shape.radius,
            0,
            2 * Math.PI
          );
          this.ctx.stroke();
        } else if (shape.type === "line") {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
        }
      }
    });
  }

  /**
   * Fetches existing shapes from the server for the given room
   * @param roomId - The ID of the room to fetch shapes from
   */
  private async getExistingShapes(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/room/chats/${roomId}`);
    const messages = response.data.messages;
    const shapes = messages
      .map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
      })
      .filter(Boolean);
    return shapes;
  }

  /**
   * Handles mouse down event to start drawing
   * @param e - Mouse event
   */
  private handleMouseDown(e: MouseEvent) {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  /**
   * Handles mouse up event to finish drawing and send shape to server
   * @param roomId - The ID of the room
   * @param e - Mouse event
   */
  private handleMouseUp(roomId: string, e: MouseEvent) {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const shape: Shape = {
      type: "rect",
      x: this.startX,
      y: this.startY,
      width,
      height,
    };
    this.existingShapes.push(shape);
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    }
    this.clearCanvas(document.querySelector("canvas") as HTMLCanvasElement);
  }

  /**
   * Handles mouse move event to draw shape preview
   * @param canvas - The HTML canvas element
   * @param e - Mouse event
   */
  private handleMouseMove(canvas: HTMLCanvasElement, e: MouseEvent) {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas(canvas);
      if (this.ctx) {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      }
    }
  }
}

/**
 * Initializes drawing functionality on the canvas
 * @param canvas - The HTML canvas element
 * @param roomId - The ID of the room for collaboration
 * @param socket - WebSocket connection for real-time updates
 */
export default function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const drawSingleton = DrawSingleton.getInstance();
  return drawSingleton.initDraw(canvas, roomId, socket);
}
