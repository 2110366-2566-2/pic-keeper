import Chat from "@/components/Chat";

const Home = ({ params }: { params: { roomId: string } }) => {
  if (!params.roomId) {
    return <div>No room id specified</div>;
  }

  return (
    <>
      <Chat roomId={params.roomId} />
    </>
  );
};

export default Home;
