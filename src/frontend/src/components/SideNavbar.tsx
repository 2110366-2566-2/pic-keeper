// src/frontend/src/components/SideNavbar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SideNavbar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Edit profile", href: "/user/edit-profile" },
    { name: "Account management", href: "/user/account-management" },
    { name: "My galleries", href: "/user/my-galleries" },
    { name: "History", href: "/user/history" },
    // Add more navigation items if needed
  ];

  const isActive = (href: string) => pathName === href;

  return (
    <aside className="w-128" aria-label="Sidebar">
      <div className="overflow-y-auto py-14 px-10">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
                className={`flex items-center p-2 text-base font-normal rounded-lg transition duration-150 ease-in-out ${
                  isActive(item.href)
                    ? "text-yellow-500 text-title"
                    : "text-title"
                }`}
                style={{ fontSize: "16px" }} // Inline style for font-size
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideNavbar;
