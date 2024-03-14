// src/app/user/layout.tsx
import React from "react";
import NavBar from "@/components/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="w-screen h-screen">
    <>
      <NavBar />
      {/* <div className="flex h-full"> */}
        {/* <div className="flex flex-col flex-1"> */}
        <div className="justify-center">

          <main  >{children}</main>

        </div>
        {/* </div> */}
      {/* </div> */}

    </>
  );
}
