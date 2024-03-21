import { useState, useEffect } from "react";
import { Gallery } from "@/types/gallery";
import { SearchFilter } from "@/types/gallery";
import Navbar from "@/components/shared/Navbar/Navbar";
import customerGalleriesService from "@/services/customerGalleries";
import { GalleryCard, GalleryFilter, SearchBar } from "@/components/Gallery";

const LandingPage = () => {
  const [searchGallery, setSearchGallery] = useState("Search Gallery");
  const [selectedOption, setSelectedOption] = useState("By photographer");
  const [searchPlace, setSearchPlace] = useState("Set Location");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedOptionSideBar, setSelectedOptionSideBar] =
    useState("Recommended");
  const [selectedGender, setSelectedGender] = useState("All");

  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({});

  useEffect(() => {
    const fetchAllGalleries = async () => {
      const response = await customerGalleriesService.search(searchFilter);
      if (response.data) setListOfGalleries(response.data);
    };

    fetchAllGalleries();
  }, [searchFilter]);

  return (
    <main>
      <div className="fixed flex flex-col">
        <div className="top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="top-0 left-0 right-0 z-40">
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
      <div className="flex flex-row">
        <div className="w-1/5 mt-32">
          <GalleryFilter
            selectedOption={selectedOptionSideBar}
            setSelectedOption={setSelectedOptionSideBar}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
          />
        </div>
        <div className="grid grid-cols-auto-fill-400 gap-4 pt-48 w-4/5">
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
    </main>
  );
};

export default LandingPage;
