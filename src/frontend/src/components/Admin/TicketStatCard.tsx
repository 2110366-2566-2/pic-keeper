interface Props {
    title: string;
    count: number;
    color: string;
}

const TicketStat = (data : Props) => {
    console.log(data)
    return (
        <div className="rounded-md shadow-md ">
            <div className="flex items-center p-4">
                <div className="p-3 rounded-full bg-orange-600 bg-opacity-75"></div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                        {data.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800">{data.count}</p>
                </div>
            </div>
        </div>
    )
}

export default TicketStat;