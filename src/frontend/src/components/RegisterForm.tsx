"use client";

import userService from "@/services/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import authService from "@/services/auth";

const RegisterForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    if (success) {
      router.push("/auth/signin");
    }
  };

  const [passwordError, setPasswordError] = useState("");

  const validatePasswords = () => {
    if (password !== password2) {
      setPasswordError("Passwords do not match!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    try {
      const user = await authService.registerCustomer({
        email,
        name,
        password,
      });
      setModalMessage(`${user.name} created successfully!`);
      setSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage = "An error occurred while creating the user.";
      setModalMessage(errorMessage);
      setSuccess(false);
      setIsModalOpen(true);
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
                  New Here? Register now!
                </h2>
              </div>
              <div className="w-full flex flex-col items-stretch gap-4">
                <button className="text-center form-input form-input-normal text-gray-500">
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
              <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                  <input
                    id="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input form-input-normal"
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input form-input-normal"
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
                      passwordError ? "form-input-error" : ""
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <input
                    id="password2"
                    type="password"
                    placeholder="Confirm your password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className={`form-input ${
                      passwordError ? "form-input-error" : ""
                    }`}
                  />
                  {passwordError && (
                    <p className="text-red-500">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-2 col-span-2"
                >
                  Sign up
                </button>
              </form>
              <a
                className="text-standard text-center hover:text-amber-500"
                href="/auth/signin"
              >
                Already have an account?{" "}
              </a>
            </div>
          </div>
          <div className="relative h-full w-full flex flex-col items-center justify-center invisible lg:visible bg-amber-400"></div>
          <Image
            className="absolute top-[30vh] invisible lg:visible "
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
        title={success ? "Register Successful" : "Register Error!"}
      >
        <p className="text-standard text-gray-500">{modalMessage}</p>
        <button
          onClick={closeModal}
          className={`btn ${success ? "btn-success" : "btn-danger"} mt-4 px-4`}
        >
          {success ? "Continue" : "Close"}
        </button>
      </Modal>
    </>
  );
};

export default RegisterForm;
