import Chat from "./Chat/Chat";
import { FaUserCircle } from "react-icons/fa";
import { GalleryCard } from "./Gallery";

const ChatSystem = () => {
  return (
    <div className="h-screen w-screen m-auto flex justify-center bg-stone-100">
      <div className="flex flex-row w-full mx-5 mb-20">
        {/* chat list */}
        <div className="w-[30%] grid place-items-center">
          <div className="w-[95%] h-[95%] bg-white rounded-xl shadow-lg flex flex-col">
            <div className="text-3xl font-semibold pt-8 pl-8 pb-4">
              Messages
            </div>
            <form className="w-[85%]">
              <input
                id="email"
                type="text"
                placeholder="Search for chat"
                className="form-input text-black text-lg my-2 mx-[7%]"
              />
            </form>
            {/* message list */}
            <div className="w-[85%] mx-[7%] mt-5 flex flex-col">
              {/* msg#1 */}
              <div className="flex flex-row my-3">
                <div className="w-[15%] text-8xl mr-2">
                  <FaUserCircle />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">Photographer A</div>
                  <div>Gallery 1</div>
                  <div className="text-gray-400">Lastest Message</div>
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  <div className="text-gray-400">17:00</div>
                  <div className="w-5 h-5 rounded-full bg-amber-500 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* chat box */}
        <div className="w-[45%] grid place-items-center">
          <div className="w-[95%] h-[95%] bg-white rounded-xl shadow-lg flex items-center justify-center text-lg">
            <Chat roomId={"6a758de4-b696-48da-9c3b-44ee353840b5"} />
          </div>
        </div>

        {/* gallery */}
        <div className="w-[25%] grid place-items-center">
          <div className="w-[95%] h-[95%] flex flex-col">
            {/* gallery picture */}
            <div className="h-[40%] mb-4">
              {/* <GalleryCard
                GalleryName={"Gallery 2"}
                Images={[
                  "/images/image3.jpg",
                  "/images/image2.jpg",
                  "/images/image1.jpg",
                ]}
                Photographer={"Photographer B"}
                Price={1290}
              /> */}
            </div>

            {/* gallery details */}
            <div className="h-[60%] mt-4">
              <div className="w-[100%] h-[100%] bg-white rounded-xl shadow-lg flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold pt-8 pl-8 pb-4">
                    Current Package
                  </div>
                  <div className="w-[90%] h-1 mx-[5%] bg-stone-200"></div>
                  <div className="text-2xl font-semibold pt-4 px-8 pb-8 flex flex-row justify-between">
                    <div>Gallery 2</div>
                    <div className="text-amber-500">1290 THB</div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">
                      Specified Date and Time
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">
                      Specified Event Length
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">
                      Specified Location
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                    <div className="text-lg font-semibold px-1 py-1">
                      Specified Delivery Time
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10 pt-6">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">
                      10 Printed Images
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">
                      RAW File
                    </div>
                  </div>
                  <div className="flex flex-row items-center pl-10">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <div className="text-lg font-semibold text-gray-400 px-1 py-1">
                      1 Video
                    </div>
                  </div>
                </div>

                <div className="w-[90%] h-[10%] bg-amber-500 m-[5%] rounded-md font-semibold text-xl text-white grid place-items-center">
                  Book
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
