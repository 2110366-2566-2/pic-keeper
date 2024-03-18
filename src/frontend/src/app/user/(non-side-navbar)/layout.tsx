// src/app/user/layout.tsx
import React from "react";
import NavBar from "@/components/shared/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen">
      <div className="fixed top-0 left-0 z-50">
        <NavBar />
      </div>
      <div className="flex h-full mt-16 z-40">
        <div className="flex flex-col flex-1">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </div>
  );
}
