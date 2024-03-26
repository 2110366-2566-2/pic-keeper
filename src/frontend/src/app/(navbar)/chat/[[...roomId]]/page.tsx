import ChatSystem from "@/components/ChatSystem";

const Home = ({ params }: { params: { roomId: string } }) => {
  if (!params.roomId) {
    return <div>No room id specified</div>;
  }

  return <ChatSystem roomId={params.roomId} />;
};

export default Home;
