import { BACKEND_URL } from "@/Config/config";
import axios from "axios";

type Shape =
    | { type: "rect"; x: number; y: number; width: number; height: number; }
    | { type: "circle"; centerX: number; centerY: number; radius: number; }
    | { type: "line"; startX: number; startY: number; endX: number; endY: number; };

class DrawSingleton {
    private static instance: DrawSingleton;
    private existingShapes: Shape[] = [];
    private ctx: CanvasRenderingContext2D | null = null;
    private clicked = false;
    private startX = 0;
    private startY = 0;

    private constructor() {}

    public static getInstance() {
        if (!DrawSingleton.instance) {
            DrawSingleton.instance = new DrawSingleton();
        }
        return DrawSingleton.instance;
    }

    public async initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.existingShapes = await this.getExistingShapes(roomId);
        this.ctx = canvas.getContext("2d");
        if (!this.ctx) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedData = JSON.parse(message.message);
                if (parsedData.shape) {
                    this.existingShapes.push(parsedData.shape);
                    this.clearCanvas(canvas);
                }
            }
        };

        this.clearCanvas(canvas);
        
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this, socket, roomId));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this, canvas));
        
        return () => {
            canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
            canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this, socket, roomId));
            canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this, canvas));
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
                }
                //add logic for other shapes
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

    private handleMouseUp(socket: WebSocket, roomId: string, e: MouseEvent) {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const shape: Shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        this.existingShapes.push(shape);
        socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape }), roomId }));
        this.clearCanvas(document.querySelector('canvas') as HTMLCanvasElement); // Clear and redraw after sending
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

export default function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const drawSingleton = DrawSingleton.getInstance();
    return drawSingleton.initDraw(canvas, roomId, socket);
}
