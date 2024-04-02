import { Review } from "@/types/review"

const ReviewCard = ({info} : {info: Review}) => {
    return (
        <div className="w-full h-full rounded-md">
            <div className="flex flex-col">
                {info.customer.name}
            </div>
        </div>
    )
}

export default ReviewCard