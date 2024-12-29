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
  description: "Ebook generator that actually works.",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getCachedSession();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
