"use client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <div>{children}</div>
    </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppProvider;
