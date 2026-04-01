"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  Package, Hash, Calendar, Clock, MapPin,
  Store, ShoppingBag, Sprout, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";

const staticInfo = [
  { icon: Package,  label: "Tên sản phẩm",         value: "Gạo ST25 Hữu Cơ Sóc Trăng",                  color: "text-blue-600"   },
  { icon: Hash,     label: "Mã sản phẩm / SKU",     value: "ST25-HCO-5KG-0045",                           color: "text-purple-600" },
  { icon: Calendar, label: "Ngày sản xuất",          value: "15/01/2026",                                  color: "text-green-600"  },
  { icon: Clock,    label: "Hạn sử dụng",            value: "15/01/2027",                                  color: "text-orange-600" },
  { icon: MapPin,   label: "Xuất xứ / Nhà sản xuất", value: "Công ty TNHH Nông sản Sóc Trăng, Việt Nam", color: "text-red-500"    },
];

const traceSteps = [
  {
    id: "farm",
    icon: Sprout,
    label: "Nông trại",
    value: "Nông trại Hữu Cơ Sóc Trăng · Ấp 4, Mỹ Xuyên",
    color: "text-lime-600",
    pill: "bg-lime-50 text-lime-700",
    desc: "Ấp 4, Mỹ Xuyên, Sóc Trăng",
  },
  {
    id: "retailer",
    icon: ShoppingBag,
    label: "Tiểu thương",
    value: "Chợ Bình Điền · Quận 8, TP.HCM",
    color: "text-violet-600",
    pill: "bg-violet-50 text-violet-700",
    desc: "Chợ Bình Điền, Quận 8, TP.HCM",
  },
  {
    id: "trader",
    icon: Store,
    label: "Thương lái",
    value: "Nguyễn Văn A · TP. Hồ Chí Minh",
    color: "text-amber-600",
    pill: "bg-amber-50 text-amber-700",
    desc: "TP. Hồ Chí Minh",
  },
];

export default function ResultPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("farm");
  const [showSheet, setShowSheet] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const step = traceSteps.find((s) => s.id === selectedId)!;
  const StepIcon = step.icon;

  const handleSelect = (id: string) => {
    if (id !== selectedId) {
      setSelectedId(id);
      setAnimKey((k) => k + 1);
    }
    setShowSheet(false);
  };

  return (
    <AuthGuard>
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ── Top bar (status bar + header merged) ── */}
      <div className="bg-white border-b border-gray-100 shrink-0">
        {/* Status bar spacer */}
        <div className="h-11" />
        {/* Nav header */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <Link
            href="/scanner"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </Link>
          <h1 className="text-base font-semibold text-gray-900">Thông tin sản phẩm</h1>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4 pb-4 gap-3" style={{ paddingBottom: "140px" }}>

        {/* QR scanned banner */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 shrink-0">
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-700 leading-none">Quét thành công</p>
            <p className="text-[11px] text-green-600 font-mono mt-0.5">QR: 8936001680427</p>
          </div>
          <Badge variant="success">Hợp lệ</Badge>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden shrink-0">

          {/* Static fields */}
          {staticInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50"
              >
                <Icon size={16} className={`shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-[13px] text-gray-800 font-medium leading-snug truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Traceability step row — tappable */}
          <button
            onClick={() => setShowSheet(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-blue-50/60 active:bg-blue-50 transition-colors text-left"
          >
            <StepIcon size={16} className={`shrink-0 ${step.color}`} />
            <span className="flex-1 min-w-0" key={animKey} style={{ animation: "fadeSlideIn 220ms ease-out" }}>
              <span className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none">
                  Truy xuất
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-px rounded-full ${step.pill}`}>
                  {step.label}
                </span>
              </span>
              <span className="block text-[13px] text-gray-800 font-medium leading-snug truncate">
                {step.value}
              </span>
            </span>
            <ChevronRight size={15} className="text-gray-400 shrink-0" />
          </button>
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-none mb-1">Lô sản xuất</p>
            <p className="text-[13px] font-semibold text-gray-700">LOT-2026-001</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-none mb-1">Trạng thái</p>
            <p className="text-[13px] font-semibold text-green-600">Đang lưu kho</p>
          </div>
        </div>

      </div>

      {/* ── Fixed bottom actions ── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-4 shadow-lg"
        style={{ paddingBottom: "44px" }}
      >
        <Button
          onClick={() => router.push("/scanner?toast=1")}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Xác nhận
        </Button>
        <Link
          href="/scanner"
          className="flex justify-center mt-2 text-xs text-gray-400 hover:text-gray-600"
        >
          Quét sản phẩm khác
        </Link>
      </div>

      {/* ── Bottom sheet backdrop ── */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          showSheet ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setShowSheet(false)}
      />

      {/* ── Bottom sheet panel ── */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50 w-full",
          "bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out",
          showSheet ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Chọn bước truy xuất</h2>
          <button
            onClick={() => setShowSheet(false)}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="px-4 py-3 space-y-2 pb-safe-5">
          {traceSteps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 text-left",
                  isActive
                    ? "border-blue-300 bg-blue-50/60"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100 active:bg-gray-200",
                ].join(" ")}
              >
                <Icon size={20} className={`shrink-0 ${s.color}`} />
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                    {s.label}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">{s.desc}</span>
                </span>
                {isActive && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
    </AuthGuard>
  );
}
