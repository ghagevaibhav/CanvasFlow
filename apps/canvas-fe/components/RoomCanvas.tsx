"use client";

import { TOKEN, WEBSOCKET_URL } from "@/config/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  // first create socket connection and show a loader 
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}?token=${TOKEN}`);

    ws.onopen = () => {
      // Send room ID to server on connection
      setSocket(ws);
      setIsConnecting(false);
      ws.send(JSON.stringify({ type: 'join_room', roomId: roomId }));
    }

    ws.onerror = () => {
      console.error("WebSocket connection failed");
      setIsConnecting(false);
    }

    ws.onclose = () => {
      setSocket(null);
      setIsConnecting(false);
    }

    return () => {
      ws.close();
    }
  }, [roomId]) // add roomId as dependency

  if (isConnecting) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  }

  if (!socket) {
    return <div className="flex items-center justify-center h-screen">
      Connection failed. Please refresh the page.
    </div>
  }

  return <Canvas roomId={roomId} socket={socket}/>
}
