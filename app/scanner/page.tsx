"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QrViewfinder } from "@/components/qr-viewfinder";
import { useToast } from "@/components/toast-context";
import { useHistory } from "@/components/history-context";
import { Flashlight, ImageIcon, ChevronDown, Check, Clock } from "lucide-react";

const USE_CASES = [
  {
    id: "quick",
    label: "Quét và ghi nhận nhanh",
    desc: "Scan xong → toast thành công ngay",
  },
  {
    id: "confirm",
    label: "Quét và xác nhận thông tin",
    desc: "Scan xong → màn hình xác nhận → toast",
  },
  {
    id: "fail",
    label: "Quét thất bại",
    desc: "Scan xong → toast lỗi + lưu vào Nháp",
  },
];

// Mock product for simulation
const MOCK_PRODUCT = {
  name: "Gạo ST25 Hữu Cơ Sóc Trăng",
  sku: "ST25-HCO-5KG-0045",
  image: "🌾",
  imageBg: "bg-amber-50",
  business: "Công ty TNHH Nông sản Sóc Trăng",
};

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { addSuccess, addDraft } = useHistory();
  const [useCase, setUseCase] = useState("quick");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = USE_CASES.find((c) => c.id === useCase)!;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handle return from result page
  useEffect(() => {
    if (searchParams.get("toast") === "1") {
      const name = searchParams.get("name") ?? "";
      addToast(`Ghi thông tin sản phẩm ${name} thành công`);
      router.replace("/scanner", { scroll: false });
    }
  }, [searchParams, router, addToast]);

  const handleSimulate = () => {
    if (useCase === "quick") {
      addToast(`Ghi thông tin sản phẩm ${MOCK_PRODUCT.name} thành công`);
      addSuccess(MOCK_PRODUCT);
    } else if (useCase === "fail") {
      addToast(`Quét thất bại: không nhận dạng được mã QR`, "error");
      addDraft(MOCK_PRODUCT);
    } else {
      router.push("/scanner/result");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Status bar */}
      <div className="h-11 bg-white" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">Quét mã QR</h1>
        <Link
          href="/scanner/history"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Clock size={13} className="text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">Lịch sử</span>
        </Link>
      </div>

      <div className="px-4 pt-3 pb-safe-5 flex flex-col gap-4">

        {/* Use case dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="w-full flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 text-left shadow-sm active:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                Chế độ quét
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">{selected.label}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 shrink-0 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-20">
              {USE_CASES.map((uc, i) => (
                <button
                  key={uc.id}
                  onClick={() => { setUseCase(uc.id); setShowDropdown(false); }}
                  className={[
                    "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
                    i < USE_CASES.length - 1 ? "border-b border-gray-50" : "",
                    uc.id === useCase ? "bg-blue-50" : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${uc.id === useCase ? "text-blue-700" : "text-gray-900"}`}>
                      {uc.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{uc.desc}</p>
                  </div>
                  {uc.id === useCase && <Check size={15} className="text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Camera viewfinder */}
        <div className="w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center py-10">
          <QrViewfinder />
        </div>

        {/* Flash / Library */}
        <div className="flex justify-between items-start px-1">
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

        {/* Simulate button */}
        <div className="mt-2">
          <button
            onClick={handleSimulate}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Mô phỏng quét thành công →
          </button>
        </div>
      </div>
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
