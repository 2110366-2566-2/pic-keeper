import Image from "next/image";

interface Props {
  src?: string;
  size: number;
}

const ProfileImage = ({ src, size }: Props) => {
  const containerClasses = `w-${size} h-${size} relative rounded-full`;
  return (
    <div className={containerClasses}>
      <Image
        src={src || "/images/user-circle.svg"}
        alt=""
        className="rounded-full object-cover"
        fill={true}
      />
    </div>
  );
};

export default ProfileImage;
