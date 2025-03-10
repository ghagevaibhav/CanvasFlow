import { useEffect, useState } from "react";
import { WEBSOCKET_URL, TOKEN } from "../app/config";

export const useSocket = () => {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}?token=${TOKEN}`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    loading,
    socket,
  };
};
