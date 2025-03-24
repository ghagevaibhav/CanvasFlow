import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = await import("@repo/backend-common/index");
import prisma  from "@repo/db/index";

// singleton websocket manager
class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer;
  private userMap: Map<string, { ws: WebSocket; rooms: Set<number> }>;

  private constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.userMap = new Map();
    this.initializeWebSocket();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private checkUser(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === "string" || !decoded?.id) {
        return null;
      }
      return decoded.id;
    } catch (e) {
      console.error("JWT verification failed:", e);
      return null;
    }
  }

  private async handleJoinRoom(ws: WebSocket, userId: string, roomId: number) {
    try {
      if(!roomId || (roomId === null))
          return;
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        ws.send(JSON.stringify({ error: "Room not found" }));
        return;
      }

      const userState = this.userMap.get(userId);
      if (userState) {
        userState.rooms.add(roomId);
      }

      ws.send(JSON.stringify({ type: "join_success", roomId }));
    } catch (err) { 
      console.error("Join room error:", err);
      ws.send(JSON.stringify({ error: "Failed to join room" }));
    }
  }

  private handleLeaveRoom(userId: string, roomId: number) {
    const userState = this.userMap.get(userId);
    if (userState) {
      userState.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  private async handleChat(
    ws: WebSocket,
    userId: string,
    roomId: number,
    message: string
  ) {
    const userState = this.userMap.get(userId);

    if (!userState) {
      ws.send(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    if (!userState.rooms.has(roomId)) {
      ws.send(JSON.stringify({ error: "Not a member of this room" }));
      return;
    }

    try {
      // store message in db
      await prisma.chat.create({
        data: {
          message,
          roomId,
          userId,
        },
      });

      // broadcast to room members
      const chatMessage = JSON.stringify({
        type: "chat",
        message,
        room: roomId,
        userId,
      });

      this.userMap.forEach((state, uid) => {
        if (state.rooms.has(roomId)) {
          state.ws.send(chatMessage);
        }
      });
    } catch (err) {
      console.error("Chat handling error:", err);
      ws.send(JSON.stringify({ error: "Failed to send message" }));
    }
  }

  private initializeWebSocket() {
    this.wss.on("connection", (ws: WebSocket, req: Request) => {
      console.log("New connection established");

      const url = req.url;
      const queryParam = new URLSearchParams(url.split("?")[1]);
      const token = queryParam.get("token") || "";
      const userId = this.checkUser(token);

      if (!userId) {
        ws.send(JSON.stringify({ error: "Unauthorized" }));
        ws.close();
        return;
      }

      // init user state
      this.userMap.set(userId, { ws, rooms: new Set() });

      ws.on("message", async (data: string) => {
        try {
          const parsedData = JSON.parse(data);
          const roomId = parseInt(parsedData.roomId);

          switch (parsedData.type) {
            case "join_room":
              await this.handleJoinRoom(ws, userId, roomId);
              break;

            case "leave_room":
              const left = this.handleLeaveRoom(userId, roomId);
              if (left) {
                ws.send(JSON.stringify({ type: "leave_success", roomId }));
              }
              break;

            case "chat":
              await this.handleChat(ws, userId, roomId, parsedData.message);
              break;

            default:
              ws.send(JSON.stringify({ error: "Invalid message type" }));
          }
        } catch (err) {
          console.error("Message handling error:", err);
          ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
      });

      ws.on("close", () => {
        this.userMap.delete(userId);
      });
    });
  }
}

// init the websocket manager
const wsManager = WebSocketManager.getInstance();
