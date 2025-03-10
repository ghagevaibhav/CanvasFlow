import initDraw from "@/Draw";
import { useEffect, useRef } from "react";

export default function Canvas({ roomId, socket }: { 
        roomId: string,
        socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initDraw(canvas, roomId, socket);
  }, [roomId, socket]); 

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 bg-black"
      width="100%"
      height="100%" 
    />
  );
}
