import { Review } from "@/types/review"

const ReviewCard = ({info} : {info: Review}) => {
    return (
        <div className="w-full h-full rounded-md">
            <div className="flex flex-row">
                <h1 className="">
                    {info.customer.name}
                </h1>
                <div className="">
                    {info.rating}
                </div>
            </div>
            <article className="text-wrap">
                {info.review_text}
            </article>
        </div>
    )
}

export default ReviewCard