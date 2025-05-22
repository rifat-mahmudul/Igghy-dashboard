import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/provider/AppProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Logistics Hub Management",
  description: "Dashboard for managing logistics hubs and transporters",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto bg-gray-50 p-4">
              <AppProvider children={children} />
            </main>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
