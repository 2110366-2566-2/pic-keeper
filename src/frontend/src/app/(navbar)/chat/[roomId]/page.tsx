import ChatSystem from "@/components/Chat/ChatSystem";

const Home = ({ params }: { params: { roomId: string } }) => {
  return <ChatSystem roomId={params.roomId} />;
};

export default Home;
