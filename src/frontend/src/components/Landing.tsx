import { useState, useEffect } from "react";
import { Gallery } from "@/types/gallery";
import { SearchFilter } from "@/types/gallery";
import { NewGallery } from "@/types/gallery";
import SearchBar from "@/components/SearchBar";
import GalleryComponent from "./Gallery";
import Navbar from "@/components/shared/Navbar";
import SideBarLandingPage from "./SideBarLandingPage";
import photographerGalleryService from "@/services/photographerGalleries";
import customerGalleriesService from "@/services/customerGalleries";

// FOR MOCKING DATA

const LandingPage = () => {
  const [searchGallery, setSearchGallery] = useState("Search Gallery");
  const [selectedOption, setSelectedOption] = useState("By photographer");
  const [searchPlace, setSearchPlace] = useState("Set Location");
  const [selectDate, setSelectDate] = useState("Select Date");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [selectedOptionSideBar, setSelectedOptionSideBar] = useState("Recommended");
  const [selectedGender, setSelectedGender] = useState("All");

  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({});

  useEffect(() => {
    const fetchAllGalleries = async () => {
      const response = await customerGalleriesService.search(searchFilter);
      if (response.data) setListOfGalleries(response.data);
      console.log(response);
    };

    fetchAllGalleries();
  }, [searchFilter]);

  useEffect(() => {
    const createGallery = async () => {
      const newGallery: NewGallery = {
        name: "Gallery01",
        location: "Location01",
        price: 100,
      };
      try {
        const response = await photographerGalleryService.createGallery(
          newGallery
        );
        console.log("Gallery created successfully", response);
      } catch (error) {
        console.error("Error creating gallery", error);
      }
    };
    createGallery();
  }, []);

  return (
    <main>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="fixed top-0 left-0 right-0 mt-16 z-40">
        <SearchBar
          searchGallery={searchGallery}
          setSearchGallery={setSearchGallery}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          searchPlace={searchPlace}
          setSearchPlace={setSearchPlace}
          selectDate={selectDate}
          setSelectDate={setSelectDate}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
        />
      </div>
      <div className="fixed w-1/5 mt-32">
        <SideBarLandingPage
          selectedOption={selectedOptionSideBar}
          setSelectedOption={setSelectedOptionSideBar}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
        />
      </div>
      <div className="mx-5 z-20 w-4/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listOfGalleries &&
            listOfGalleries.map((Gallery, index) => (
              <GalleryComponent
                key={index}
                galleryId={Gallery.id}
                photographerId={Gallery.photographer_id}
                price={Gallery.price}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
