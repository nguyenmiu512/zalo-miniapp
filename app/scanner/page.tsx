"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QrViewfinder } from "@/components/qr-viewfinder";
import { useToast } from "@/components/toast-context";
import { useHistory } from "@/components/history-context";
import { Flashlight, ImageIcon, ChevronDown, Check, Link2, ScanLine, MoreHorizontal, X } from "lucide-react";
import { useAuth } from "@/components/auth-context";

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
  {
    id: "linked",
    label: "Quét QR liên kết",
    desc: "Quét QR gốc → popup yêu cầu quét nguyên liệu",
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
  const [showLinkedPopup, setShowLinkedPopup] = useState(false);
  const [linkedOutcome, setLinkedOutcome] = useState<"success" | "fail">("success");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { logout } = useAuth();
  const selected = USE_CASES.find((c) => c.id === useCase)!

  const handleClose = () => {
    logout();
    router.replace("/login");
  };;

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

  // Step 1 for linked: show popup after QR 1 success
  const handleLinkedStep1 = (outcome: "success" | "fail") => {
    setLinkedOutcome(outcome);
    setShowLinkedPopup(true);
  };

  // Step 2 for linked: triggered by "Quét tiếp" in popup
  const handleLinkedStep2 = () => {
    setShowLinkedPopup(false);
    if (linkedOutcome === "success") {
      addToast(`Ghi thông tin sản phẩm ${MOCK_PRODUCT.name} thành công`);
      addSuccess(MOCK_PRODUCT);
    } else {
      addToast(`Quét thất bại: không nhận dạng được mã QR`, "error");
      addDraft(MOCK_PRODUCT);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Status bar */}
      <div className="h-11 bg-white" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        {/* Logo left */}
        <img src="/logo.svg" alt="PILA" className="h-7 w-auto object-contain" />

        {/* More + Close in pill border */}
        <div className="flex items-center border border-gray-200 rounded-[1000px] divide-x divide-gray-200">
          <button
            className="px-3 py-1.5 hover:bg-gray-50 rounded-l-[1000px] transition-colors text-gray-500"
            aria-label="Thêm"
          >
            <MoreHorizontal size={18} />
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1.5 hover:bg-gray-50 rounded-r-[1000px] transition-colors text-gray-500"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-3 pb-24 flex flex-col gap-4">

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

        {/* Simulate buttons */}
        {useCase === "linked" ? (
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => handleLinkedStep1("success")}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-transform"
            >
              Mô phỏng quét thành công →
            </button>
            <button
              onClick={() => handleLinkedStep1("fail")}
              className="flex w-full items-center justify-center rounded-xl border border-red-200 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 active:scale-95 transition-transform"
            >
              Mô phỏng quét thất bại lần 2 →
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <button
              onClick={handleSimulate}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-transform"
            >
              Mô phỏng quét thành công →
            </button>
          </div>
        )}
      </div>

      {/* Linked QR popup */}
      {showLinkedPopup && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowLinkedPopup(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Icon header */}
              <div className="flex flex-col items-center pt-6 pb-4 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                  <Link2 size={26} className="text-blue-600" />
                </div>
                <h2 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">
                  Cần quét thêm mã nguyên liệu
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Cần quét thêm mã của từng nguyên liệu để đảm bảo thông tin chính xác và đầy đủ.
                </p>
              </div>

              {/* Actions */}
              <div className="px-5 pb-6 pt-2">
                <button
                  onClick={handleLinkedStep2}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  <ScanLine size={16} />
                  Quét tiếp
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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
