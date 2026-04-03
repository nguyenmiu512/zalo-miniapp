"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Hash, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/components/history-context";

const product = {
  image: "🌾",
  imageBg: "bg-amber-50",
  name: "Gạo ST25 Hữu Cơ Sóc Trăng",
  sku: "ST25-HCO-5KG-0045",
  recordedAt: "01/04/2026",
  business: "Công ty TNHH Nông sản Sóc Trăng",
};

export default function ResultPage() {
  const router = useRouter();
  const { addSuccess } = useHistory();

  const handleConfirm = () => {
    addSuccess({
      name: product.name,
      sku: product.sku,
      image: product.image,
      imageBg: product.imageBg,
      business: product.business,
    });
    router.push(`/scanner?toast=1&name=${encodeURIComponent(product.name)}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 shrink-0">
        <div className="h-11" />
        <div className="flex items-center gap-2 px-3 pb-3">
          <Link href="/scanner" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={22} className="text-gray-700" />
          </Link>
          <h1 className="text-base font-semibold text-gray-900">Thông tin sản phẩm</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4 gap-3" style={{ paddingBottom: "140px" }}>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden shrink-0">

          {/* Product image + name header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
            <div className={`w-14 h-14 rounded-xl ${product.imageBg} flex items-center justify-center text-3xl shrink-0`}>
              {product.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-1">
                Tên sản phẩm
              </p>
              <p className="text-[14px] text-gray-900 font-semibold leading-snug">
                {product.name}
              </p>
            </div>
          </div>

          {/* Mã sản phẩm */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50">
            <Hash size={16} className="shrink-0 text-purple-500" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                Mã sản phẩm
              </p>
              <p className="text-[13px] text-gray-800 font-medium font-mono">{product.sku}</p>
            </div>
          </div>

          {/* Ngày ghi nhận */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50">
            <Calendar size={16} className="shrink-0 text-green-500" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                Ngày ghi nhận
              </p>
              <p className="text-[13px] text-gray-800 font-medium">{product.recordedAt}</p>
            </div>
          </div>

          {/* Doanh nghiệp */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            <Building2 size={16} className="shrink-0 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                Doanh nghiệp
              </p>
              <p className="text-[13px] text-gray-800 font-medium leading-snug">{product.business}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed bottom actions */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-4 shadow-lg"
        style={{ paddingBottom: "44px" }}
      >
        <Button
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Xác nhận
        </Button>
        <Link href="/scanner" className="flex justify-center mt-2 text-xs text-gray-400 hover:text-gray-600">
          Quét sản phẩm khác
        </Link>
      </div>

    </div>
  );
}
