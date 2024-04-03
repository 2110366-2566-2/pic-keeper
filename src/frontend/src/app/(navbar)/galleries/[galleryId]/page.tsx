import GalleryInfo from "@/components/Gallery/GalleryInfo";

const Home = ({ params }: { params: { galleryId: string } }) => {

  if (!params.galleryId) {
    return <div>No room id specified</div>;
  }
  return (
    <div className="max-w-6xl h-[95vh] m-auto flex items-center justify-center">
      <GalleryInfo galleryId={params.galleryId} />
    </div>
  );
};

export default Home;
function showError(error: unknown) {
  throw new Error("Function not implemented.");
}

