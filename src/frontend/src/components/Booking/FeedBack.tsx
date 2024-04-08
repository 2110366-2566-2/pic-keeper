"use client";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ReviewInput, Review } from "@/types/review";
import customerReviewService from "@/services/customerReviews";
import { useErrorModal } from "@/hooks/useErrorModal";
import { useEffect } from "react";
import { photographerReviewService } from "@/services";

export default function FeedBack(props: {
  togglePage: Function;
  isOwner: boolean;
  isOpen: boolean;
  feedBackContent: string | null;
  booking_id: string;
  closeModal: Function;
  refreshTrigger: Function;
}) {
  const showError = useErrorModal();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [refreshFeedback,setRefreshFeedBack] = useState<boolean>(true);

  const customerReview = async () => {
    let result: Review[] | null;
    try {
      result = (await customerReviewService.myReviews()).data;
      if (!result) {
        result = [];
        setReviewId(null);
        setRating(0);
        setReview("");
      }
      for (let i = 0; i < result.length; i++) {
        if (result[i].booking.id === props.booking_id) {
          setReviewId(result[i].id);
          setRating(result[i].rating);
          setReview(result[i].review_text);
        }
      }
    } catch (error) {
      showError(error, "Fetch review failed.");
    }
  };

  const photographerReview = async () => {
    let result: Review[] | null;
    try {
      result = (await photographerReviewService.listReceivedReviews()).data;
      if (!result) {
        result = [];
        setReviewId(null);
        setRating(0);
        setReview("");
      }
      for (let i = 0; i < result.length; i++) {
        if (result[i].booking.id === props.booking_id) {
          setReviewId(result[i].id);
          setRating(result[i].rating);
          setReview(result[i].review_text);
        }
      }
    } catch (error) {
      showError(error, "Fetch review failed.");
    }
  };

  useEffect(() => {
    if(refreshFeedback){
      if (props.isOwner) {
        photographerReview();
      } else {
        customerReview();
      }
      setRefreshFeedBack(false);
    }
  }, [refreshFeedback]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStarHover = (index: number) => {
    setRating(index + 1);
  };

  const onSubmit = async () => {
    const instance: ReviewInput = {
      booking_id: props.booking_id,
      rating: rating,
      review_text: review,
    };
    try {
      if (reviewId) {
        const result = await customerReviewService.updateReview(
          instance,
          reviewId
        );
      } else {
        const result = await customerReviewService.createReview(instance);
      }
    } catch (error) {
      showError(error, "Cannot submit review.");
    }
  };

  const onDelete = async () => {
    try {
      if (reviewId) {
        const result = await customerReviewService.deleteReview(reviewId);
      } 
    } catch (error) {
      showError(error, "Cannot delete review.");
    }
  };

  return (
    <Transition show={props.isOpen} as={Fragment}>
      <Transition.Child
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="px-4 h-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-300"
      >
        <div>
          {props.isOwner && (
            <svg
              width="50"
              height="63"
              viewBox="0 0 50 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              onClick={() => {
                props.togglePage("INFO");
              }}
              className="modal"
            >
              <rect width="50" height="63" fill="url(#pattern0)" />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_1118_25817"
                    transform="matrix(0.01 0 0 0.00793651 0 0.103175)"
                  />
                </pattern>
                <image
                  id="image0_1118_25817"
                  width="100"
                  height="100"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACAklEQVR4nO3cvaoTURSG4SD+3INWgqB26lTaDOv7ZkJU/GlyISKIXRrBQrDUTjk3oRegnd6Loh5QQSPRRiR4MilmL/a8D6x+DS8hmcywZzMAAAAAAAAAAAAAAACgKm3bnpP0VNJrSQeSrpfeabIi4rakQ9vrf+b5arU6Vnq/SbF9R9K3LTF+T9d1D0vvOBk+IsZmJH1cLpcnS+9aPe8Q469PycXS+1ZtSAz/CXK69M7VGhpD0rvSO1dL0t2BMQ4lXSm9d5Ui4oakr0NiRIRK710lYiRCjESIkQgxEum67iZf4EkQIxFiJEKMRIiRCDESIUYixEiEGIkQI9nzDNvfd/0L3fZPSfcjoqlt5vP5haLP+veIMYX5LOlx0zQnRo0REdeGPOmb2kg6GDWIpLelL9r55/IoMRaLxSlJPxJc8Dr53COIJxhkQ9KbBBe8zjx9318aLYjtq3yp+39BXs7Gxs9ebwvxyfajtm2Pjx5kzyjV3hhGxPnR7z+24eWFhIiSEFESIkpCREmIKAkRJSGiJESUhIiSEFESIkpCREmIKAkRpZKDAyKiKb131YYerWH7femdq7fHeSdnSu9cPQ+IsnmPtvS+k+DdonxI8ex6KnxEFEkPSu84OZJuSfqyJcYzDsEspO/7s7af2H5l+0VEzEvtAgAAAAAAAAAAAAAAAMzS+gVr9HaNLXbsfQAAAABJRU5ErkJggg=="
                />
              </defs>
            </svg>
          )}
        </div>

        <div className="text-2xl font-semibold mt-4">
          {props.isOwner ? "Rating" : "Rate this package"}
        </div>

        {props.isOwner ? (
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                fill={index < rating ? "#9edf26" : "#b3adad"}
                width="64px"
                height="64px"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>star</title>{" "}
                  <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z"></path>{" "}
                </g>
              </svg>
            ))}
          </div>
        ) : (
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                fill={index < rating ? "#9edf26" : "#b3adad"}
                width="64px"
                height="64px"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleStarHover(index)}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>star</title>{" "}
                  <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z"></path>{" "}
                </g>
              </svg>
            ))}
          </div>
        )}

        <div className="text-2xl font-semibold mt-8">
          {props.isOwner ? "Review" : "How was your overall experience?"}
        </div>
        <div className="h-[200px] max-h-full ">
          {props.isOwner ? (
            <textarea
              readOnly
              value={review}
              name=""
              id="message"
              rows={8}
              className="w-full border-solid border-2 border-stone-300 rounded-md px-2"
            ></textarea>
          ) : (
            <textarea
              name=""
              id="message"
              rows={6}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
              }}
              className="w-full border-solid border-2 border-stone-300 rounded-md px-2"
            ></textarea>
          )}

          {!props.isOwner && (
            <>
              <div className="flex justify-center gap-x-8 ">
                <button
                  className="modal mt-4 px-4 py-2 rounded font-semibold text-lg text-stone-500"
                  onClick={() => {
                    props.togglePage("INFO");
                    setRefreshFeedBack(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="mt-4 px-4 py-2 bg-orange-400 text-white rounded font-semibold text-lg"
                  onClick={async () => {
                    props.togglePage("LOADING");
                    await onSubmit();
                    props.togglePage("COMPLETE");
                    props.refreshTrigger(true);
                    setTimeout(() => {
                      props.closeModal();
                    }, 1000);
                  }}
                >
                  Submit
                </button>
              </div>
              <div
                onClick={async () => {
                  props.togglePage("LOADING");
                  await onDelete();
                  setRefreshFeedBack(true);
                  props.togglePage("INFO");
                }}
                className="mt-4 text-center text-base font-semibold text-red-600"
              >
                Delete your existing review
              </div>
            </>
          )}
          <div className="h-4"></div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
