import { useEffect, useState } from "react";
import { GalleryCard } from ".";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Gallery } from "@/types/gallery";
import photographerGalleriesService from "@/services/photographerGalleries";
import { useSession } from "next-auth/react";
import { PhotographerStatus } from "@/types/user";

const MyGallery = () => {
  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const showError = useErrorModal();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAllGalleries = async () => {
      try {
        const response = await photographerGalleriesService.getAllMyGalleries();
        if (response.data) {
          setListOfGalleries(response.data);
        }
      } catch (error) {
        showError(error);
      }
    };

    if (
      session?.user.data?.verification_status === PhotographerStatus.Verified
    ) {
      fetchAllGalleries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-auto-fill-300 2xl:grid-cols-auto-fill-400 gap-4 p-4">
      {listOfGalleries &&
        listOfGalleries.map((Gallery, index) => (
          <GalleryCard
            key={index}
            galleryId={Gallery.id}
            photographerId={Gallery.photographer_id}
            price={Gallery.price}
          />
        ))}
    </div>
  );
};

export default MyGallery;
