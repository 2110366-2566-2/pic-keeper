import Image from "next/image";

interface Props {
  src: string;
  size: number;
}

const ProfileImage = ({ src, size }: Props) => {
  const containerClasses = `w-8 h-8 w-${size} h-${size} relative rounded-full`;
  return (
    <div className={containerClasses}>
      <Image
        src={src}
        alt=""
        className="rounded-full object-cover"
        fill={true}
      />
    </div>
  );
};

export default ProfileImage;
