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
import { signOut, useSession } from "next-auth/react";

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

let singletonWebSocket: WebSocket | null = null;

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { data: session, update } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [attemptedReconnect, setAttemptedReconnect] = useState(false);

  useEffect(() => {
    if (!session || !session.user.session_token) {
      console.error("User session not found.");
      return;
    }

    const connectWebSocket = async (token: string) => {
      if (singletonWebSocket?.readyState === WebSocket.OPEN) return;

      if (
        !singletonWebSocket ||
        singletonWebSocket.readyState > WebSocket.OPEN
      ) {
        singletonWebSocket = new WebSocket(
          `ws://localhost:8080/chat/v1/ws/${token}`
        );
      }

      singletonWebSocket.onopen = () => console.log("Connected to server");

      singletonWebSocket.onclose = async () => {
        console.log("Disconnected from server");
        if (!attemptedReconnect) {
          console.log("Attempting to reconnect once...");
          try {
            const refreshTokenResponse = await authService.refreshToken(token);
            const refreshedToken = refreshTokenResponse.refreshed_session_token;
            console.log(
              "Token refreshed, trying to reconnect with new token..."
            );
            const updatedSession = {
              ...session,
              user: {
                ...session.user,
                session_token: refreshedToken,
              },
            };
            await update(updatedSession);
            setAttemptedReconnect(true); // Mark that a reconnect attempt is being made
            connectWebSocket(refreshedToken);
          } catch (error) {
            console.error("Failed to refresh token or reconnect:", error);
          }
        } else {
          console.log("Reconnect attempt already made, not trying again.");
        }
      };

      singletonWebSocket.onerror = (error) =>
        console.error("WebSocket error:", error);

      singletonWebSocket.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };
    };

    // Initial connection
    if (session?.user?.session_token) {
      connectWebSocket(session.user.session_token);
    }

    return () => {
      singletonWebSocket?.close();
      singletonWebSocket = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const sendMessage = useCallback((messageData: SendMessage) => {
    if (singletonWebSocket?.readyState === WebSocket.OPEN) {
      singletonWebSocket.send(JSON.stringify(messageData));
    } else {
      console.error("WebSocket connection is not established.");
    }
  }, []);

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
