import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrabGo | Food, Groceries & Essentials Delivered Fast",
  description:
    "Order food, groceries, and essentials from top local vendors with real-time delivery tracking. Join as a vendor or rider on GrabGo.",
};

//

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
