import SearchBar from "@/components/SearchBar"
import GalleryComponent from "./Gallery"
import Navbar from "@/components/Navbar"
import SideBarLandingPage from "./SideBarLandingPage"

const LandingPage = () => { 
    return (
        <main>
            <div className="fixed top-0 left-0 right-0">
                <Navbar/>
                <SearchBar/>
                <div className="w-1/5 static">
                    <SideBarLandingPage/>
                </div>
            </div>
            <div>
                
            </div>
        </main>
    )
}

export default LandingPage