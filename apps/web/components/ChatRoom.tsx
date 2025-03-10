import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string) {
  console.log(`Fetching chats for roomId: ${roomId}`);
  const response = await axios.get(`${BACKEND_URL}/room/chats/${roomId}`);
  return response.data.messages;
}                                   


export default async function ChatRoom ({ id }: { id: string }) {
  const messages = await getChats(id);

  return <ChatRoomClient messages={messages} id={id} />;
};
