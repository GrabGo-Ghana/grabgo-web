import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://grabgogh.app"),
  title: "GrabGo Ghana | Fast Food Delivery for Customers, Vendors & Riders",
  description:
    "GrabGo is a Ghanaian delivery platform helping customers order food, vendors manage deliveries, and riders earn through fast local delivery.",
  keywords: [
    "GrabGo",
    "GrabGo Ghana",
    "GrabGo GH",
    "food delivery in Ghana",
    "Ghana delivery app",
    "vendor delivery platform Ghana",
    "rider delivery jobs Ghana",
  ],
  alternates: {
    canonical: "https://grabgogh.app",
  },
  openGraph: {
    title: "GrabGo Ghana | Fast Food Delivery",
    description:
      "Order food, manage vendor deliveries, and support local riders with GrabGo, a Ghanaian delivery platform.",
    url: "https://grabgogh.app",
    siteName: "GrabGo Ghana",
    type: "website",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrabGo Ghana | Fast Food Delivery",
    description:
      "A Ghanaian delivery platform for customers, vendors, and riders.",
  },
  icons: {
    icon: "/media/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}