"use client";

import Chat from "./Chat";
import { GalleryCard, PackageInfo } from "../Gallery";
import { useEffect, useState } from "react";
import roomService from "@/services/room";
import { Room } from "@/types/room";
import { useErrorModal } from "@/hooks/useErrorModal";
import ProfileImage from "../shared/ProfileImage";
import { generateProfilePictureUrl } from "@/utils/s3";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Booking } from "@/types/booking";
import { useSession } from "next-auth/react";
import { capitalizeFirstLetter } from "@/utils/string";
import BookingBtn from "./BookingBtn";

interface Props {
  roomId?: string;
}

const ChatSystem = ({ roomId }: Props) => {
  const [currRoom, setCurrRoom] = useState<Room>();
  const [rooms, setRooms] = useState<Room[]>();
  const [booking, setBooking] = useState<Booking>();
  const showError = useErrorModal();
  const router = useRouter();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (roomId) {
        try {
          const response = await roomService.getRoomInfo(roomId);
          if (response.data) {
            setCurrRoom(response.data);
          }
        } catch (error) {
          showError(error);
        }
      }
    };

    const fetchBookingInfo = async () => {
      if (roomId) {
        try {
          const response = await roomService.GetBookingFromRoom(roomId);
          if (response.data) {
            setBooking(response.data);
          }
        } catch (error) {
          // Don't need to show error
          console.log(error);
        }
      }
    };
    fetchRoomInfo();
    fetchBookingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    const fetchRoomsInfo = async () => {
      try {
        const response = await roomService.getAllRooms();
        if (response.data) {
          setRooms(response.data);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchRoomsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-7 h-[90vh] gap-4 p-4">
      {/* chat list */}
      <div className="col-span-2 rounded-xl shadow-lg flex flex-col h-[90vh] bg-white overflow-y-scroll">
        <div className="text-3xl font-semibold pt-8 pl-8 pb-4">Messages</div>
        <form className="w-[85%]">
          <input
            id="email"
            type="text"
            placeholder="Search for chat"
            className="form-input text-black text-lg my-2 mx-[7%]"
          />
        </form>
        {/* message list */}
        {rooms &&
          rooms.map((room, index) => (
            <div
              className=" mt-5 flex flex-col cursor-pointer"
              key={room.id}
              onClick={() => {
                router.push(`/chat/${room.id}`);
              }}
            >
              {/* msg#1 */}
              <div className="flex flex-row my-3 items-center o">
                <div className="w-16 h-16">
                  <ProfileImage
                    src={generateProfilePictureUrl(
                      room.other_users[0].profile_picture_key
                    )}
                    size={16}
                  />
                </div>
                <div className="w-[65%] flex flex-col justify-left mx-12 my-2">
                  <div className="font-semibold text-xl">
                    {room.other_users[0].firstname}{" "}
                    {room.other_users[0].lastname}
                  </div>
                  <div>{room.gallery.name}</div>
                  {/* <div className="text-gray-400">Lastest Message</div> */}
                </div>
                <div className="w-[20%] flex flex-col items-center my-4">
                  {/* <div className="text-gray-400">17:00</div>
                  <div className="w-5 h-5 rounded-full bg-amber-500 mt-2"></div> */}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* chat box */}
      {roomId ? (
        <>
          <div className="col-span-3 h-full">
            <div className=" bg-white rounded-xl shadow-lg flex items-center justify-center text-lg overflow-y-scroll h-[90vh]">
              <Chat roomId={roomId} />
            </div>
          </div>
          {currRoom && (
            <div className="col-span-2 flex flex-col justify-between gap-4">
              <div className="">
                <GalleryCard galleryId={currRoom?.gallery.id} />
              </div>
              {/* gallery details */}
              <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col justify-between gap-4 p-4">
                <div className="space-y-4">
                  <div className="text-2xl font-semibold">
                    Current Package{" "}
                    {booking ? (
                      <span className="text-lg font-normal text-standard">
                        ({capitalizeFirstLetter(booking.status)})
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="border-t-2 border-gray-300 max-h-64 overflow-y-scroll">
                    <PackageInfo gallery={currRoom.gallery} booking={booking} />
                  </div>
                </div>
                <BookingBtn
                  room={currRoom}
                  booking={booking}
                  setBooking={setBooking}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="col-span-5 flex flex-col gap-5 items-center justify-center">
          <Image src={"/images/chat.svg"} alt="Chat" width={400} height={400} />
          <h4 className="text-standard text-xl text-gray-900">
            No chat specify
          </h4>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
