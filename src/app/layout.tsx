import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/react-query-client";
import Dot from "@/components/dot-background";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "booklyai",
  description: "Ebook generator that actually works.",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <ReactQueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 w-full h-full`}
        >
          <Dot className="h-screen">
            {children}
            <Toaster />
          </Dot>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
