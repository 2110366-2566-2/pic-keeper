import { useState, useEffect } from "react";
import { Gallery } from "@/types/gallery";
import { SearchFilter } from "@/types/gallery";
import Navbar from "@/components/shared/Navbar/Navbar";
import customerGalleriesService from "@/services/customerGalleries";
import { GalleryCard, GalleryFilter, SearchBar } from "@/components/Gallery";
import { Gender } from "@/types/user";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useErrorModal } from "@/hooks/useErrorModal";

export enum searchOption {
  PHOTOGRAPHER_NAME = "By photographer",
  GALLERY_NAME = "By gallery",
}

export enum sortOption {
  RECOMMENDED = "Recommended",
  RATING = "Rating",
  PRICE = "Price",
}

const LandingPage = () => {
  const [selectedOptionSideBar, setSelectedOptionSideBar] = useState(
    sortOption.RECOMMENDED
  );
  const [selectedGender, setSelectedGender] = useState<Gender | undefined>();

  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({});

  const showError = useErrorModal();

  const { data: session } = useSession();

  useEffect(() => {
    const fetchAllGalleries = async () => {
      try {
        const response = await customerGalleriesService.search(searchFilter);
        if (response.data) {
          setListOfGalleries(response.data);
        } else {
          setListOfGalleries([]);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchAllGalleries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  return (
    <main className="relative">
      <div className="flex flex-col">
        <div className="z-50">
          <Navbar />
        </div>
        <div className="z-40 bg-white">
          <SearchBar setSearchFilter={setSearchFilter} />
        </div>
      </div>
      <div className="flex flex-row">
        <GalleryFilter
          selectedOption={selectedOptionSideBar}
          setSelectedOption={setSelectedOptionSideBar}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
        />
        <div className="grid grid-cols-auto-fill-300 2xl:grid-cols-auto-fill-400  justify-center items-center gap-4 w-full p-4">
          {listOfGalleries &&
            listOfGalleries.map((gallery, index) => (
              <GalleryCard
                key={index}
                galleryId={gallery.id}
                photographerId={gallery.photographer_id}
                price={gallery.price}
              />
            ))}
        </div>
      </div>
      {session?.user.data?.verification_status === "VERIFIED" && (
        <Link href="/galleries/create-gallery">
          <IoIosAddCircle
            className="sticky ml-auto bottom-5 right-5 z-50 bg-white rounded-full text-yellow-500 transition-transform duration-500 ease-in-out transform hover:scale-105"
            size={65}
          />
        </Link>
      )}
    </main>
  );
};

export default LandingPage;
