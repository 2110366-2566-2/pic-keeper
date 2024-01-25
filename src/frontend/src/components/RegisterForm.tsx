"use client";

import userService from "@/services/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";

const RegisterForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
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
      const user = await userService.create({
        email,
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
          <div className=" flex px-5 h-full bg-white col-span-3 lg:col-span-2 dark:bg-gray-900 ">
            <div className="flex flex-col gap-5 w-full max-w-lg m-auto self-stretch">
              <div>
                <h2 className="text-2xl font-bold leading-9  text-gray-900 dark:text-white">
                  New Here? Register now!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already has an account?{" "}
                  <a
                    href="/auth/signin"
                    className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500"
                  >
                    Login
                  </a>
                </p>
              </div>
              <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5 ">
                <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-5 py-2 border-gray-300 border-[1px] rounded-2xl"
                  ></input>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="password" className="dark:text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`px-5 py-2 border-${
                      passwordError ? "red-500" : "gray-300"
                    } border-[1px] rounded-2xl`}
                  ></input>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="password2" className="dark:text-white">
                    Confirm your password
                  </label>
                  <input
                    id="password2"
                    type="password"
                    placeholder="Type password again"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className={`px-5 py-2 border-${
                      passwordError ? "red-500" : "gray-300"
                    } border-[1px] rounded-2xl`}
                  ></input>
                  {passwordError && (
                    <p className="text-red-500">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-yellow-500 py-2 mt-2 text-white"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
          <div className="relative h-full w-full flex flex-col items-center justify-center invisible lg:visible">
            <Image
              className="object-cover overflow-hidden"
              src={"/images/signup.png"}
              alt="camping"
              fill={true}
            ></Image>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={success ? "Register succesful" : "Register Error!"}
      >
        <p className="text-sm text-gray-500">{modalMessage}</p>
        <button
          onClick={closeModal}
          className={
            success
              ? "mt-4 py-2 px-4 text-white rounded-md bg-green-400 hover:bg-green-500"
              : "mt-4 py-2 px-4 text-white rounded-md bg-red-400"
          }
        >
          {success ? "Continue" : "Close"}
        </button>
      </Modal>
    </>
  );
};

export default RegisterForm;
