import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import Sidebar from "@/components/sidebar";
import { CreateTaskFormDialog } from "@/components/create-task-button";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/query-client-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Fullstack Task Manager Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased flex relative",
            fontSans.variable
          )}
        >
          <NextTopLoader />

          <ThemeProvider
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <QueryProvider>
              <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-40 right-0 top-0 -z-10  h-[310px] w-[310px] rounded-full bg-primary/30 blur-[100px]"></div>
              </div>
              <Toaster />
              <Sidebar />
              {children}
              <div className="absolute bottom-16 right-16">
                <CreateTaskFormDialog />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
