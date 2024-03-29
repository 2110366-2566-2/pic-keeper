// src/app/user/layout.tsx
import React from "react";
import { NavBar } from "@/components/shared";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen bg-zinc-50 fixed ">
      <div className="z-10 relative modal"> <NavBar /></div>
      <div className="flex h-full">
        <div className="flex flex-col flex-1">
          <main className="flex-grow relative">{children}</main>
        </div>
      </div>
    </div>
  );
}
