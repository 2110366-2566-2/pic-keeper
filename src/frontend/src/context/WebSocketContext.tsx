"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

import authService from "@/services/auth";
import { Message, SendMessage } from "@/types/room";

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
  const [attemptedReconnect, setAttemptedReconnect] = useState(false);

  useEffect(() => {
    if (!session || !session.user.session_token) {
      console.error("User session not found.");
      return;
    }

    const connectWebSocket = async (token: string) => {
      if (ws?.readyState === WebSocket.OPEN) return;

      const newWs = new WebSocket(`ws://localhost:8080/chat/v1/ws/${token}`);

      newWs.onopen = () => console.log("Connected to server");

      newWs.onclose = async () => {
        console.log("Disconnected from server");
        if (!attemptedReconnect) {
          console.log("Attempting to reconnect once...");
          try {
            const refreshTokenResponse = await authService.refreshToken(token);
            const refreshedToken = refreshTokenResponse.refreshed_session_token;
            console.log(
              "Token refreshed, trying to reconnect with new token..."
            );
            setAttemptedReconnect(true); // Mark that a reconnect attempt is being made
            connectWebSocket(refreshedToken);
          } catch (error) {
            console.error("Failed to refresh token or reconnect:", error);
          }
        } else {
          console.log("Reconnect attempt already made, not trying again.");
        }
      };

      newWs.onerror = (error) => console.error("WebSocket error:", error);

      newWs.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };

      setWs(newWs);
    };

    // Initial connection
    if (session?.user?.session_token) {
      connectWebSocket(session.user.session_token);
    }

    return () => {
      ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const sendMessage = useCallback(
    (messageData: SendMessage) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(messageData));
      } else {
        console.error("WebSocket connection is not established.");
      }
    },
    [ws]
  );

  const value = useMemo(
    () => ({
      sendMessage,
      messages,
    }),
    [sendMessage, messages]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
