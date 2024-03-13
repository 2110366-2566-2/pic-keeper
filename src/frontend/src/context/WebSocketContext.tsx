"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Message, SendMessage } from "@/types";

interface IWebSocketContext {
  sendMessage: (messageData: SendMessage) => void;
  messages: Message[];
}

const defaultContextValue: IWebSocketContext = {
  sendMessage: (messageData) => {
    console.warn("WebSocket context not initialized.");
  },
  messages: [],
};

const WebSocketContext = createContext(defaultContextValue);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode; // Or specific expected components/elements
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!session || !session.user.session_token) {
      console.error("User session not found.");
      return;
    }

    const authToken = session.user.session_token;
    const newWs = new WebSocket(`ws://localhost:8080/chat/v1/ws/${authToken}`);

    newWs.onopen = () => console.log("Connected to server");
    newWs.onclose = () => console.log("Disconnected from server");
    newWs.onerror = (error) => console.error("WebSocket error:", error);

    newWs.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    setWs(newWs);

    return () => {
      if (newWs) newWs.close();
    };
  }, [session]);

  const sendMessage = (messageData: SendMessage) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(messageData));
    } else {
      console.error("WebSocket connection is not established.");
    }
  };

  const value = useMemo(
    () => ({
      sendMessage,
      messages,
    }),
    [messages, ws]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
