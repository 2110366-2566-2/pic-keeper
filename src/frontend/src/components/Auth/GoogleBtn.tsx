import { useModal } from "@/context/ModalContext";
import authService from "@/services/auth";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GoogleBtn = () => {
  const router = useRouter();
  const { openModal } = useModal();

  const handleGoogleLogin = async () => {
    try {
      const response = await authService.googleLogin();
      if (response.status == "success") {
        router.push(response.url);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        openModal(error.message, "Error");
      } else {
        openModal("An unexpected error occurred", "Error");
      }
    }
  };
  return (
    <button
      className="text-center form-input form-input-normal text-gray-500"
      onClick={handleGoogleLogin}
    >
      <Image
        src={"/images/google-logo.svg"}
        alt="google"
        className="absolute"
        width={25}
        height={25}
      />
      Continue with Google
    </button>
  );
};

export default GoogleBtn;
