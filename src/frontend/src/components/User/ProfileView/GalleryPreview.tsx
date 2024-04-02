import { Gallery } from "@/types/gallery";
import { GalleryCard } from "@/components/Gallery";

const GalleryPreview = ({ listOfGalleries }: { listOfGalleries : Gallery[] }) => {
  return (
    <div className="w-full sm:w-9/12 shadow-md rounded-md">
      <div className="text-amber-500 font-semibold text-xl p-4">Galleries</div>
      <div className="grid grid-cols-auto-fill-300 2xl:grid-cols-auto-fill-400 gap-4 p-4">
        {listOfGalleries &&
          listOfGalleries.map((Gallery, index) => (
            <GalleryCard key={index} galleryId={Gallery.id} />
          ))}
      </div>
    </div>
  );
};

export default GalleryPreview;
