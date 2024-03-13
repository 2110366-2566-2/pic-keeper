"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Message {
  data: string;
  id: string;
  room: string;
  sender: string;
  ts: string;
  type: string;
}

interface ChatProps {
  roomId: string;
}

const Chat = ({ roomId }: ChatProps) => {
  const [sendingMessage, setSendingMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();

  const handleSendingMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSendingMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection is not established.");
      return;
    }

    const messageData = {
      data: sendingMessage,
      type: "message",
      sender: session?.user.data.id,
      room: roomId,
    };

    ws.send(JSON.stringify(messageData));

    if (!session?.user.data.id) {
      throw Error("No session user");
    }

    const newMessage: Message = {
      data: sendingMessage,
      id: Math.random().toString(),
      room: roomId,
      sender: session?.user.data.id,
      ts: new Date().toISOString(),
      type: "message",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setSendingMessage("");

    setSendingMessage("");
  };

  const onMessage = (event: MessageEvent) => {
    const receivedMessage: Message = JSON.parse(event.data);
    console.log(receivedMessage);
    console.log(messages.slice(-1));
    if (receivedMessage.type == "message") {
      if (
        messages.slice(-1)[0] &&
        messages.slice(-1)[0]?.id == receivedMessage.id
      ) {
        return;
      }
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  };

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (!session) {
        console.error("User session not found.");
        return;
      }

      const authToken = session?.user.session_token;
      const newWs = new WebSocket(
        `ws://localhost:8080/chat/v1/ws/${authToken}`
      );
      console.log("WebSocket initialized");

      newWs.onopen = () => {
        console.log("Connected to server");
        setWs(newWs);
      };

      newWs.onclose = () => {
        console.log("Disconnected from server");
        setWs(null);
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newWs.onmessage = onMessage;
    };

    initializeWebSocket();

    return () => {
      if (ws) {
        console.log("delete socket");
        ws.close();
        setWs(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={Math.floor(Math.random() * 1000)}
            className={`flex justify-${
              message.sender === session?.user.data.id ? "end" : "start"
            }`}
          >
            <div
              className={`p-2 m-1 rounded-lg ${
                message.sender === session?.user.data.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {message.data}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          value={sendingMessage}
          onChange={handleSendingMessageChange}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
