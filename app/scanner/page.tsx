"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { QrViewfinder } from "@/components/qr-viewfinder";
import { SuccessToast } from "@/components/success-toast";
import { Flashlight, ImageIcon } from "lucide-react";

const TAB_ROUTES: Record<string, string> = {
  single: "/scanner/result",
  double: "/scanner/batch",
};

// Inner component that reads searchParams — must be wrapped in Suspense
function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  useEffect(() => {
    if (searchParams.get("toast") === "1") {
      setShowToast(true);
      router.replace("/scanner", { scroll: false });
    }
    if (searchParams.get("tab") === "double") {
      setActiveTab("double");
      router.replace("/scanner", { scroll: false });
    }
  }, [searchParams, router]);

  const handleDismiss = useCallback(() => setShowToast(false), []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Toast notification */}
      {showToast && (
        <SuccessToast
          message="Ghi nhận thông tin thành công"
          duration={5000}
          onDismiss={handleDismiss}
        />
      )}

      {/* Status bar area */}
      <div className="h-11 bg-white" />

      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">Quét mã QR</h1>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#374151" strokeWidth="1.5"/>
            <path d="M10 9v5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="6.5" r="0.75" fill="#374151"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        className="flex flex-col flex-1"
        onValueChange={setActiveTab}
      >
        {/* Animated segment control */}
        <div className="mx-4 my-3">
          <div className="relative flex bg-gray-100 rounded-xl p-1">
            {/* Sliding pill */}
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
              style={{
                width: "calc(50% - 6px)",
                transform: activeTab === "single" ? "translateX(0)" : "translateX(calc(100% + 8px))",
                transition: "transform 280ms cubic-bezier(0.34, 1.2, 0.64, 1)",
              }}
            />
            {/* Tab buttons */}
            {[
              { value: "single", label: "Quét đơn" },
              { value: "double", label: "Quét đôi" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={[
                  "relative z-10 flex-1 py-1.5 text-sm rounded-lg transition-colors duration-200",
                  activeTab === tab.value
                    ? "font-semibold text-gray-900"
                    : "font-medium text-gray-500",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Shared camera frame — outside TabsContent, never re-mounts ── */}
        <div className="px-6 pt-2">
          <div className="w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center py-10">
            <QrViewfinder />
          </div>

          {/* Controls row — on white background */}
          <div className="flex justify-between items-start mt-5 px-1">
            <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform shrink-0">
              <div className="bg-amber-50 rounded-full p-2.5 text-amber-500">
                <Flashlight size={20} />
              </div>
              <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">Đèn flash</span>
            </button>

            <p className="text-sm text-gray-500 text-center leading-relaxed flex-1 px-4 pt-1">
              Dùng camera để quét QR cho mỗi kiện hàng
            </p>

            <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform shrink-0">
              <div className="bg-blue-50 rounded-full p-2.5 text-blue-500">
                <ImageIcon size={20} />
              </div>
              <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">Thư viện</span>
            </button>
          </div>

          {/* ── Shared button — outside TabsContent, href updates with active tab ── */}
          <div className="mt-8 pb-safe-5">
            <Link
              href={TAB_ROUTES[activeTab]}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-transform"
            >
              Mô phỏng quét thành công →
            </Link>
          </div>
        </div>

        {/* Empty TabsContent to satisfy Radix UI (keeps tab switching working) */}
        <TabsContent value="single" />
        <TabsContent value="double" />
      </Tabs>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ScannerContent />
    </Suspense>
  );
}
