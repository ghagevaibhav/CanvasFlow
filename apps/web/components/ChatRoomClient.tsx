"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [, setChats] = useState(messages);
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats) => [
            ...prevChats,
            { message: parsedData.message },
          ]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {messages.map((m, index) => (
        <div key={index}>{m.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              message: currentMessage,
              roomId: id,
            })
          );
          setCurrentMessage("");
        }}
      >Send Message</button>
    </div>
  );
};
