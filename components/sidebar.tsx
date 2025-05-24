"use client";

import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Truck, MapPin, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const session = useSession();

  const userRole = session?.data?.user?.role;
  const router = useRouter();

  console.log(userRole);

  const hubManagerItems = [
    {
      name: "Shipper",
      href: "/shipper",
      iconImg: "shipper.png",
    },
    {
      name: "Transporter",
      href: "/transporter",
      iconImg: "shipper.png",
    },
    {
      name: "Receiver",
      href: "/receiver",
      iconImg: "shipper.png",
    },
  ];

  const adminItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Hub Manager List",
      href: "/hub-manager-list",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Transporter",
      href: "/transporter-list",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Hub List",
      href: "/hub-list",
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-[141px] bg-[#e6f5f0] flex flex-col h-screen sticky top-0 z-[60]">
      <div className="p-3 flex justify-center mb-2">
        <Image src="/logo.png" alt="Logo" width={52} height={40} />
      </div>
      <div className="flex-1 flex flex-col items-center py-4 gap-2 w-[125px] mx-auto">
        {userRole === "hubManager" &&
          hubManagerItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`w-full rounded-md flex flex-col items-center justify-center py-3 ${
                isActive(item.href)
                  ? "bg-[#009a64] text-white font-medium"
                  : "text-black bg-[#d9f0e8] hover:bg-[#009a64] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8">
                <Image
                  src={item.iconImg || "/default-icon.png"}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <span className="mt-1 text-center text-[10px]">{item.name}</span>
            </Link>
          ))}

        {userRole === "admin" &&
          adminItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`w-full rounded-md flex flex-col items-center justify-center py-3 ${
                isActive(item.href)
                  ? "bg-[#009a64] text-white font-medium"
                  : "text-black bg-[#d9f0e8] hover:bg-[#009a64] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8">
                {item.icon || (
                  <Image src={item.icon} alt="icon" width={40} height={40} />
                )}
              </div>
              <span className="mt-1 text-center text-[10px]">{item.name}</span>
            </Link>
          ))}
      </div>
      <div className="flex flex-col items-center p-3">
        <button
          onClick={() => {
            // Handle logout logic here
            signOut();
            router.push("/login");
          }}
          className="w-full flex flex-col items-center justify-center py-3 text-gray-700 bg-[#d9f0e8]"
        >
          <div className="flex items-center justify-center h-8 w-8">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="mt-1 text-center text-[10px]">Logout</span>
        </button>
      </div>
    </div>
  );
}
