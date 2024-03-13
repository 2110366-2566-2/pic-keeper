"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useWebSocket } from "@/context/WebSocketContext";
import { Message } from "@/types";

interface ChatProps {
  roomId: string;
}

const Chat = ({ roomId }: ChatProps) => {
  const { sendMessage, messages } = useWebSocket();
  const [sendingMessage, setSendingMessage] = useState("");
  const { data: session } = useSession();
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  useEffect(() => {
    setOptimisticMessages(messages);
  }, [messages]);

  const handleSendMessage = () => {
    if (!session?.user?.data?.id) {
      console.error("No session user");
      return;
    }

    const messageData = {
      data: sendingMessage,
      type: "message",
      sender: session.user.data.id,
      room: roomId,
    };

    const mockUpMessageData = {
      data: sendingMessage,
      type: "message",
      sender: session.user.data.id,
      room: roomId,
      ts: new Date().toISOString(), // Optimistic timestamp
      id: "temp-" + Math.random().toString(36).substring(2, 15), // Temporary unique ID for optimistic update
    };

    setOptimisticMessages((prevMessages) => [
      ...prevMessages,
      mockUpMessageData,
    ]);

    sendMessage(messageData);
    setSendingMessage("");
  };

  const handleSendingMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSendingMessage(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-grow p-4 overflow-y-auto">
        {optimisticMessages.map(
          (message, index) =>
            message.type === "message" && (
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
                      ? "bg-slate-800 text-white"
                      : "bg-slate-200"
                  }`}
                >
                  {message.data}
                </div>
              </motion.div>
            )
        )}
      </div>
      <div className="p-4 flex items-center">
        <input
          type="text"
          className="flex-grow border-2 border-gray-200 rounded-lg p-2 mr-2 focus:outline-none focus:border-slate-500 transition-all"
          value={sendingMessage}
          onChange={handleSendingMessageChange}
          placeholder="Type your message..."
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-slate-500 text-white rounded-lg shadow hover:bg-slate-600 transition-all"
          onClick={handleSendMessage}
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default Chat;
