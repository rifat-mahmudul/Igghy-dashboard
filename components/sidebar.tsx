"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Truck, MapPin, LogOut } from "lucide-react"
import Image from "next/image"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
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
  ]

  return (
    <div className="w-[68px] bg-mint-50 flex flex-col border-r">
      <div className="p-3 flex justify-center border-b">
        <Image src="/green-leaf-logo.png" alt="Logo" width={40} height={40} />
      </div>
      <div className="flex-1 flex flex-col items-center py-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`w-full flex flex-col items-center justify-center py-3 text-xs ${
              isActive(item.href) ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <div className="flex items-center justify-center h-8 w-8">{item.icon}</div>
            <span className="mt-1 text-center text-[10px]">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="p-3 flex flex-col items-center border-t">
        <Link
          href="/logout"
          className="w-full flex flex-col items-center justify-center py-3 text-xs text-gray-700 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-center h-8 w-8">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="mt-1 text-center text-[10px]">Logout</span>
        </Link>
      </div>
    </div>
  )
}
