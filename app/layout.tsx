import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kittipong Thongnate | AI & Software Portfolio",
  description:
    "A clean hackathon-focused portfolio for Kittipong Thongnate, high school AI and software builder from Thailand."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
