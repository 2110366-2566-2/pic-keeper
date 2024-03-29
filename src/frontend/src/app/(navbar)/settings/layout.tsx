// src/app/user/layout.tsx
import React from "react";
import SideNavbar from "@/components/Settings/MyGalleries/SideNavbar";
import NavBar from "@/components/shared/Navbar/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <SideNavbar />
      <div className="flex flex-col flex-1 ">
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
