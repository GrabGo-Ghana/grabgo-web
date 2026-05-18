import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrabGo | Food delivery in Ghana.",
  description: "Hot meals from Accra's best restaurants, delivered fast. Download GrabGo today.",
  icons: {
    icon: "media/logo.svg",
  }
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