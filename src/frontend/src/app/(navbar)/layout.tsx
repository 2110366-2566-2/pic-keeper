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
    <div className="w-screen h-screen">
      <div className="z-50">
        <NavBar />
      </div>
      <main className="z-0">{children}</main>
    </div>
  );
}
