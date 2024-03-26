import Image from "next/image";

const Loading = () => {
  return (
    <div className="m-auto h-full  flex flex-col gap-4 items-center justify-center">
      <Image
        src="/images/loading.svg"
        alt="loading"
        className="animate-pulse"
        width={400}
        height={400}
      ></Image>
      <h2 className="text-title">Loading...</h2>
    </div>
  );
};

export default Loading;
