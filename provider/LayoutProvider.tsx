"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Toaster } from "sonner";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();

  // List of auth routes where we don't want to show the layout
  const authRoutes = [
    "/login",
    "/forget-password",
    "/enter-otp",
    "/verify-email",
    "/reset-password",
  ];

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    // For auth routes, render only the children without layout
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toaster />
      </div>
    );
  }

  // For regular routes, render the full layout
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="fixed inset-x-0 top-0 z-50">
          <Header />
        </div>
        <main className="flex-1 h-screen overflow-auto bg-gray-50 p-4 pt-16">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}
