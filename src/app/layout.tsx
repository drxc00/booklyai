import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/react-query-client";
import AuthProvider from "@/lib/session-provider";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import getCachedSession from "@/lib/session-cache";
import { Session } from "next-auth";

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
  description: "Turn your ideas into polished ebooks in minutes. Let AI handle the writing, so you can focus on sharing your ideas with the world.",
  abstract: "Turn your ideas into polished ebooks in minutes. Let AI handle the writing, so you can focus on sharing your ideas with the world.",
  keywords: ["booklyai", "ebook", "ai", "writing", "aiebooks", "aiebook", "bookly", "gpt-4o"],
  robots: "follow, index",
  category: "AI",
  openGraph: {
    title: "booklyai",
    description: "Turn your ideas into polished ebooks in minutes. Let AI handle the writing, so you can focus on sharing your ideas with the world.",
    images: [
      {
        url: process.env.NEXT_PUBLIC_URL + "/api/og",
        width: 800,
        height: 600,
        alt: "booklyai",
        type: "image/png",
      },
    ],
    siteName: "booklyai",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_URL,
    determiner: "",

  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getCachedSession();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth transparent-scrollbar">
      <link
        rel="icon"
        href="/icon.png"
        type="image/png"
        sizes="32x32"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <ReactQueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            <main className="min-h-screen">
              <NavBar session={session as Session} />
              {children}
              <Footer />
            </main>
            <Toaster />
          </AuthProvider>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
