import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Client Calculator",
  description: "A tool for calculating client project costs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
