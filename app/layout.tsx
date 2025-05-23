import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import AppProvider from "@/provider/AppProvider";
import LayoutProvider from "@/provider/LayoutProvider";

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
        <AppProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </AppProvider>
      </body>
    </html>
  );
}
