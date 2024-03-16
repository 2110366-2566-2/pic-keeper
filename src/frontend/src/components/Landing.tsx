import SearchBar from "@/components/SearchBar";
import GalleryComponent from "./Gallery";
import Navbar from "@/components/Navbar";
import SideBarLandingPage from "./SideBarLandingPage";
import { useState, useEffect } from "react";
import photographerGalleryService from "@/services/photographerGalleries";
import { Gallery , SearchFilter} from "@/types";
import customerGalleriesService from "@/services/customerGalleries";

const LandingPage = () => {
  const [searchGallery, setSearchGallery] = useState("Search Gallery");
  const [selectedOption, setSelectedOption] = useState("By photographer");
  const [searchPlace, setSearchPlace] = useState("Set Location");
  const [selectDate, setSelectDate] = useState("Select Date");
  const [priceRange, setPriceRange] = useState("Set Price Range");
  const [selectedOptionSideBar, setSelectedOptionSideBar] = useState("Recommended");
  const [selectedGender, setSelectedGender] = useState("All");

  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);

  const [searchFiter, setSearchFilter] = useState<SearchFilter>({});

  useEffect(() => {
    const fetchAllGalleries = async () => {
      const response = await customerGalleriesService.search(searchFiter)
      setListOfGalleries(response);
    };

    fetchAllGalleries();
  }, []);

  return (
    <main>
      <div className="fixed top-0 left-0 right-0">
        <Navbar />
        <SearchBar
          searchGallery={searchGallery}
          setSearchgallery={setSearchGallery}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          searchPlace={searchPlace}
          setSearchPlace={setSearchPlace}
          selectDate={selectDate}
          setSelectDate={setSelectDate}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <div className="w-1/5 static">
          <SideBarLandingPage
            selectedOption={selectedOptionSideBar}
            setSelectedOption={setSelectedOptionSideBar}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
          />
        </div>
        <div className="mx-5 z-20 w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listOfGalleries.map((Gallery, index) => (
              <GalleryComponent key={index} GalleryName={Gallery.id} Photographer={Gallery.photographer_id} Price={Gallery.price}/>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </main>
  );
};

export default LandingPage;
