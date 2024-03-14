"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import GalleryComponent from "./GalleryComponent";
import { FaUserCircle } from "react-icons/fa";

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
    <div className="h-screen w-screen m-auto flex justify-center bg-stone-100">
      <div className="flex flex-row w-full mx-5 mb-20">

        {/* chat list */}
        <div className="w-[30%] grid place-items-center">
          <div className="w-[95%] h-[95%] bg-white rounded-xl shadow-lg flex flex-col">
            <div className="text-3xl font-semibold pt-8 pl-8 pb-4">Messages</div>
            <form className="w-[85%]">
              <input
                id="email"
                type="text"
                placeholder="Search for chat"
                className="form-input text-black text-lg my-2 mx-[7%]"
              />
            </form>
            {/* message list */}
            <div className="w-[85%] mx-[7%] mt-5 flex flex-col">
              {/* msg#1 */}
              <div className="flex flex-row my-3">
                <div className="w-[15%] text-8xl mr-2">
                  <FaUserCircle />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">Photographer A</div>
                  <div >Gallery 1</div>
                  <div className="text-gray-400">Lastest Message</div>
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  <div className="text-gray-400">17:00</div>
                  <div className="w-5 h-5 rounded-full bg-amber-500 mt-2"></div>
                </div>
              </div>
              {/* msg#2 */}
              <div className="flex flex-row my-3 bg-gray-100 rounded-lg">
                <div className="w-[15%] text-8xl mr-2">
                  <FaUserCircle />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">Photographer B</div>
                  <div >Gallery 2</div>
                  <div className="text-gray-400">Lastest Message</div>
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  <div className="text-gray-400">15:30</div>
                </div>
              </div>
              {/* msg#3 */}
              <div className="flex flex-row my-3">
                <div className="w-[15%] text-8xl mr-2">
                  <FaUserCircle />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">Photographer C</div>
                  <div >Gallery 3</div>
                  <div className="text-gray-400">Lastest Message</div>
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  <div className="text-gray-400">13:45</div>
                </div>
              </div>
              {/* msg#4 */}
              <div className="flex flex-row my-3">
                <div className="w-[15%] text-8xl mr-2">
                  <FaUserCircle />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">Photographer D</div>
                  <div >Gallery 4</div>
                  <div className="text-gray-400">Lastest Message</div>
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  <div className="text-gray-400">12:15</div>
                  <div className="w-5 h-5 rounded-full bg-amber-500 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* chat box */}
        <div className="w-[45%] grid place-items-center">
          <div className="w-[95%] h-[95%] bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl">
            <div className="flex flex-col h-screen bg-gray-50">
              <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex justify-${message.sender === session?.user.data.id ? "end" : "start"
                      }`}
                  >
                    <div
                      className={`p-3 m-1 rounded-lg shadow ${message.sender === session?.user.data.id
                        ? "bg-slate-800 text-white"
                        : "bg-slate-200"
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
          </div>
        </div>

        {/* gallery details */}
        <div className="w-[25%] grid place-items-center">
          <div className="w-[95%] h-[95%] flex flex-col">

            {/* gallery picture */}
            <div className="h-[40%] mb-4">
              <GalleryComponent
                GalleryName={"Gallery 1"}
                Images={["/images/image3.jpg", "/images/image2.jpg", "/images/image1.jpg"]}
                Photographer={"Lisan Al Gaib"}
                Price={1290} />
            </div>

            {/* gallery details */}
            <div className="h-[60%] mt-4">
              <div className="w-[100%] h-[100%] bg-white rounded-xl shadow-lg flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold pt-8 pl-8 pb-4">Current Package</div>
                  <div className="w-[90%] h-1 mx-[5%] bg-stone-200"></div>
                  <div className="text-2xl font-semibold pt-4 px-8 pb-8 flex flex-row justify-between">
                    <div>Gallery 1</div>
                    <div className="text-amber-500">1290 THB</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">Specified Date and Time</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">Specified Event Length</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">Specified Location</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">Specified Delivery Time</div>
                  </div>
                  <div className="flex flex-row items-center pl-10 pt-6">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">10 Printed Images</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">RAW File</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">1 Video</div>
                  </div>
                </div>

                <div className="w-[90%] h-[10%] bg-amber-500 m-[5%] rounded-md font-semibold text-xl text-white grid place-items-center">Book</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
