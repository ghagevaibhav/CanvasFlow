import { BACKEND_URL } from "@/config/config";
import axios from "axios";

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

class DrawSingleton {
  private static instance: DrawSingleton;
  private existingShapes: Shape[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private socket: WebSocket | null = null;

  private constructor() {}

  public static getInstance() {
    if (!DrawSingleton.instance) {
      DrawSingleton.instance = new DrawSingleton();
    }
    return DrawSingleton.instance;
  }

  public async initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
  ) {
    this.socket = socket; // store socket
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.existingShapes = await this.getExistingShapes(roomId);
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) return;

    // handle ws messages
    this.socket.onmessage = (event) => {
      console.log("ws msg:", event.data); // log msg
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedData = JSON.parse(message.message);
        console.log("parsed msg:", parsedData); // log parsed msg
        if (parsedData.shape) {
          this.existingShapes.push(parsedData.shape);
          this.clearCanvas(canvas); // redraw canvas
        }
      }
    };

    this.clearCanvas(canvas); // initial draw

    // add event listeners
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this, roomId));
    canvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this, canvas)
    );

    // cleanup listeners and close ws
    return () => {
      if (this.socket) {
        this.socket.close(); // close ws
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

  private handleMouseDown(e: MouseEvent) {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

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
    this.clearCanvas(document.querySelector("canvas") as HTMLCanvasElement); // clear and redraw
  }

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

export default function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const drawSingleton = DrawSingleton.getInstance();
  return drawSingleton.initDraw(canvas, roomId, socket);
}
