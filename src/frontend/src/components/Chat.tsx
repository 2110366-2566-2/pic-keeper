import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const Chat = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <>Fuck you</>;
  }
  // Initialize WebSocket connection
  const authToken = session?.user.session_token;
  const ws = new WebSocket(`ws://localhost:8080/chat/v1/ws/${authToken}`);
  console.log("here");
  // Event handler for when the WebSocket connection is established
  ws.onopen = () => {
    console.log("Connected to server");
  };

  // Event handler for incoming messages
  ws.onmessage = (event) => {
    console.log(`Received message from server: ${event.data}`);
    // Handle incoming messages from the server
  };

  // Event handler for WebSocket connection closure
  ws.onclose = () => {
    console.log("Disconnected from server");
    // Handle WebSocket connection closure
  };

  return (
    <>
      Test
      <div>Chat</div>
    </>
  );
};

export default Chat;
