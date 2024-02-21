import React from 'react';
import Image from "next/image";
// import GalleryItem from './GalleryItem';
import { IoIosArrowBack, IoIosArrowForward, IoIosAdd } from "react-icons/io";
import { HiOutlinePlusSm } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";

const CreateGallery = () => {
  return (
    <div className={`mx-auto mt-20 rounded-lg shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]`} style={{ maxWidth: '70vw', height: '72vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div className='left-section'>
        <div className="top-left-section flex items-center ml-12">
          {/* <IoIosArrowBack className="text-black mr-5" style={{ fontSize: '3rem' }} /> */}
          <button className="text-black mr-5" style={{ fontSize: '3rem'}}>
            <IoIosArrowBack />
          </button>
          
          <div className="flex flex-col items-center justify-center rounded-lg" style={{ width: '25vw', height: '30vh', backgroundColor: '#FBFAFA' }}>
            <Image src={"/images/UploadToCloud.png"}
                    alt="picKeeper"
                    width={100}
                    height={100}
                    />
            {/* <input type="file" id="fileInput" className="hidden" /> */}
            <button className="mt-8 text-white rounded px-6 py-1" style={{ backgroundColor: '#E19007'}}>Browse</button>
            <div className="mt-4">
              <span className="text-gray-500">Max file size : 20 MB</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-500">Supported file types : JPG, PNG</span>
            </div>
          </div>
          
          <button className="text-black ml-5" style={{ fontSize: '3rem'}}>
            <IoIosArrowForward/>
          </button>
        </div>
        <div className="down-left-section items-start mt-20 ml-10">
          <div className="flex items-center justify-center rounded-2xl hover:border-yellow-500 hover:border-4 hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]" style={{ width: '7vw', height: '18vh', backgroundColor: '#FBFAFA', position: 'relative' }}>
            <HiOutlinePlusSm className="text-gray-500" style={{ fontSize: '5rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
          </div>
          {/* <GalleryItem /> */}
        </div>

      </div>
      <div className="right-section mr-16">
        {/* <div className="top-right-section flex flex-col mr-24 text-gray-500" > */}
        <div className="top-right-section flex flex-col text-gray-500 overflow-y-auto" style={{height: "30vw", paddingRight: "3rem"}}>
          <div className="mb-4">
            <div className="flex flex-col">
              <span className="mr-2">Gallery name</span>
              <input type="text" className="mt-2 p-1 border border-gray-500 rounded w-1/2" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col">
              <span className="mr-2">Description</span>
              {/* <input type="text" className="p-1 border border-gray-500 rounded max-w-xl" /> */}
              <textarea rows={5} className="mt-2 p-1 border border-gray-500 rounded max-w-xl" />
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <div className="flex flex-col">
              <span className="mr-2">Hours</span>
              <div className="items-center">
                <input type="text" className="mt-2 p-1 border border-gray-500 rounded w-20" />
                <span className='ml-3 mr-5'>Hrs</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mr-2">Location</label>
              <div className="relative w-4/5">
                <input type="text" className="mt-2 p-1 border border-gray-500 rounded w-full" />
                {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"> */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <GrLocation />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
                <span className="mr-2">Delivery time</span>
              <div>
                <input type="text" className="mt-2 p-1 border border-gray-500 rounded w-20" />
                <span className="ml-3 mr-5">Days</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col">
              <span className="mr-2">What includes in this package</span>
              <input type="text" className="mt-2 p-1 border border-gray-500 rounded" />
            </div>

            <div className="flex items-center">
              <button className="text-yellow-600 flex items-center">
                <IoIosAdd style={{ fontSize: '2rem' }}/>
                Click to add
              </button>
            </div>

          </div>

          <div className="mb-4 flex items-center">
            <div className="flex flex-col ">
              <span className="mr-2">Price</span>
              <div className="items-center">
                <input type="text" className="mt-2 p-1 border border-gray-500 rounded w-20" />
                <span className="mx-3">THB</span>
              </div>
            </div>
          </div>

        </div>
        <div className='down-right-section mr-12'>
          <div className="mb-4 flex justify-end">
            <div>
              <button className="text-white rounded px-4 py-1 mr-4" style={{ backgroundColor: '#D4D4D4' , minWidth: '5rem' }}>Cancel</button>
              <button className="text-white rounded px-4 py-1" style={{ backgroundColor: '#E19007' , minWidth: '5rem' }}>Save</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateGallery;