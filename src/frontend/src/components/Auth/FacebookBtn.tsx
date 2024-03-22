import Image from "next/image";

const FacebookBtn = () => {
  return (
    <button className="text-center form-input form-input-normal text-gray-500">
      <Image
        src={"/images/facebook-logo.svg"}
        alt="google"
        className="absolute"
        width={25}
        height={25}
      />
      Continue with Facebook
    </button>
  );
};

export default FacebookBtn;
