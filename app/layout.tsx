import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-context";
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
      <body className={`${inter.variable} font-sans bg-gray-100 h-full`}>
        <AuthProvider>
          <div className="w-full min-w-[320px] max-w-[640px] mx-auto bg-white h-full relative overflow-x-hidden md:shadow-xl">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
