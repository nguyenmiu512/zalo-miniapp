import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Truy xuất nguồn gốc",
  description: "Zalo Mini App - Quét QR truy xuất nguồn gốc sản phẩm",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans bg-gray-100 min-h-screen`}>
        <div className="w-full max-w-[390px] mx-auto bg-white min-h-screen relative overflow-x-hidden md:shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
