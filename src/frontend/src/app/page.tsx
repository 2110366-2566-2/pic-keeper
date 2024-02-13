"use client";
import NavBar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <main>
      <NavBar />
    </main>
  );
}
