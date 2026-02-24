import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AbsoluteCinema — Your Ultimate Movie Guide",
  description:
    "Discover movies, read reviews, watch trailers, and build your personal watchlist. AbsoluteCinema is your comprehensive guide to the world of cinema.",
  keywords: ["movies", "cinema", "reviews", "trailers", "watchlist", "ratings", "IMDB", "AbsoluteCinema"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ab-primary text-ab-text min-h-screen font-sans antialiased">
        <ToastProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
