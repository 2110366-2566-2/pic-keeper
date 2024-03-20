import MyGallery from "@/components/Gallery/MyGallery";

const Home = ({ params }: { params: { galleryId: string } }) => {
  if (!params.galleryId) {
    return <div>No room id specified</div>;
  }

  return <MyGallery galleryId={params.galleryId} />;
};

export default Home;
