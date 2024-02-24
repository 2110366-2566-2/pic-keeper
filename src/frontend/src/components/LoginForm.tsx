"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import { signIn } from "next-auth/react";
import authService from "@/services/auth";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [loginError, setLoginError] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    if (success) {
      router.push("/");
    }
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoginError(false); // Reset login error state

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (res?.error) {
      setModalMessage("Incorrect username or password.");
      setSuccess(false);
      setLoginError(true); // Set login error state
      setIsModalOpen(true);
    } else {
      router.push("/");
    }
  };

  const handleForgotPasswordClick = (event: React.MouseEvent) => {
    event.preventDefault();
    // Here you can set the message for the forgot password modal
    setModalMessage(
      "Sadly, we have not implemented a system for this function yet. We would gladly advise you to create a new account. 😅"
    );
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await authService.googleLogin();
      if (response.status == "success") {
        router.push(response.url);
      }
    } catch (error) {
      console.log("error ja");
    }
  };

  return (
    <>
      <div className="w-screen h-screen">
        <div className="grid grid-cols-3 h-full items-center dark:bg-gray-900">
          <div className="flex px-5 h-full bg-white col-span-3 lg:col-span-2 dark:bg-gray-900">
            <div className="flex flex-col gap-5 w-full max-w-lg m-auto self-stretch">
              <div>
                <Image
                  src={"/images/logo.svg"}
                  alt="picKeeper"
                  width={150}
                  height={10}
                />
                <h2 className="text-title mt-2 text-gray-900 dark:text-white">
                  Login to your Account
                </h2>
              </div>
              <div className="w-full flex flex-col items-stretch gap-4">
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
              </div>
              <p className="text-standard text-center m-1">
                or continue with email
              </p>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-2 gap-5 w-full"
              >
                {loginError && (
                  <div className="col-span-2 text-red-500 text-sm my-2">
                    Incorrect username or password.
                  </div>
                )}
                <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                  <input
                    id="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-input ${
                      loginError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${
                      loginError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <a
                    href="#"
                    onClick={handleForgotPasswordClick}
                    className="text-orange-400 text-sm font-semibold hover:text-orange-500 mt-2"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-2 col-span-2"
                >
                  Login
                </button>
              </form>
              <a
                className="text-standard text-center hover:text-amber-500"
                href="/auth/register"
              >
                Don&apos;t have an account?{" "}
              </a>
            </div>
          </div>
          <div className="relative h-full w-full flex flex-col items-center justify-center invisible lg:visible bg-amber-400"></div>
          <Image
            className="absolute invisible lg:visible "
            style={{ right: "calc(20vw + 10px)" }}
            src={"/images/register.svg"}
            alt="register"
            width={300}
            height={800}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={success ? "Login Successful" : "Login Error!"}
      >
        <p className="text-standard text-gray-500">{modalMessage}</p>
        <button
          onClick={closeModal}
          className={`btn ${success ? "btn-success" : "btn-danger"} mt-4 px-4`}
        >
          {success ? "Continue" : "Close"}
        </button>
      </Modal>
      <Modal
        isOpen={isForgotPasswordModalOpen}
        closeModal={closeForgotPasswordModal}
        title="Oops!"
      >
        <p className="text-standard text-gray-500">{modalMessage}</p>
        <button
          onClick={closeForgotPasswordModal}
          className="btn btn-primary mt-4 px-4"
        >
          Got it, thanks!
        </button>
      </Modal>
    </>
  );
};

export default LoginForm;
