"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

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
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex justify-${
              message.sender === session?.user.data.id ? "end" : "start"
            }`}
          >
            <div
              className={`p-3 m-1 rounded-lg shadow ${
                message.sender === session?.user.data.id
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {message.data}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-4 flex items-center">
        <input
          type="text"
          className="flex-grow border-2 border-gray-200 rounded-lg p-2 mr-2 focus:outline-none focus:border-blue-500 transition-all"
          value={sendingMessage}
          onChange={handleSendingMessageChange}
          placeholder="Type your message..."
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
          onClick={handleSendMessage}
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default Chat;
