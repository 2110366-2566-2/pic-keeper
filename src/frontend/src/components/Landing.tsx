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

const LandingPage = () => {
  const [searchGallery, setSearchGallery] = useState("Search Gallery");
  const [selectedOption, setSelectedOption] = useState("By photographer");
  const [searchPlace, setSearchPlace] = useState("Set Location");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedOptionSideBar, setSelectedOptionSideBar] = useState("Recommended");
  const [selectedGender, setSelectedGender] = useState<Gender | undefined>();

  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({});

  const { data: session } = useSession();

  useEffect(() => {
    const fetchAllGalleries = async () => {
      const response = await customerGalleriesService.search(searchFilter);
      if (response.data) setListOfGalleries(response.data);
    };

    fetchAllGalleries();
  }, [searchFilter]);

  return (
    <main>
      <div className="flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="fixed top-16 left-0 right-0 z-40 bg-white">
          <SearchBar
            searchGallery={searchGallery}
            setSearchGallery={setSearchGallery}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            searchPlace={searchPlace}
            setSearchPlace={setSearchPlace}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
          />
        </div>
      </div>
      <div className="flex flex-row mt-36">
        <div className="fixed w-1/5 z-30">
          <GalleryFilter
            selectedOption={selectedOptionSideBar}
            setSelectedOption={setSelectedOptionSideBar}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
          />
        </div>
        <div className="grid grid-cols-auto-fill-400 gap-4 w-4/5 ml-72 p-1">
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
      {
        session?.user.data?.verification_status === 'VERIFIED' && (
          <Link href="/galleries/create-gallery">
            <IoIosAddCircle
              className="absolute bottom-10 right-10 text-yellow-500"
              size={65}
            />
          </Link>
        )}  
    </main>
  );
};

export default LandingPage;
