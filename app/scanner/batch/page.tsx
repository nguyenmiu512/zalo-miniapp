"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Trash2, PlusCircle,
  CheckCircle2, AlertCircle, X,
  Package, Hash, MapPin, Scale, Calendar, QrCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";

type Status = "valid" | "error";

type Product = {
  id: number;
  emoji: string;
  bg: string;
  name: string;
  sku: string;
  qrCode: string;
  origin: string;
  weight: string;
  harvest: string;
  status: Status;
};

const initialProducts: Product[] = [
  {
    id: 1,
    emoji: "🥬",
    bg: "bg-green-50",
    name: "Bắp cải tươi Đà Lạt",
    sku: "BC-DL-1KG-0023",
    qrCode: "8938505120341",
    origin: "Đà Lạt, Lâm Đồng",
    weight: "1 kg / túi",
    harvest: "29/03/2026",
    status: "valid",
  },
  {
    id: 2,
    emoji: "🫛",
    bg: "bg-purple-50",
    name: "Su hào tím sạch VietGAP",
    sku: "SH-TIM-500G-0078",
    qrCode: "8938505120489",
    origin: "Mộc Châu, Sơn La",
    weight: "500 g / củ",
    harvest: "28/03/2026",
    status: "valid",
  },
  {
    id: 3,
    emoji: "🍅",
    bg: "bg-red-50",
    name: "Cà chua bi cherry hữu cơ",
    sku: "CC-BI-250G-0112",
    qrCode: "8938505120562",
    origin: "Đơn Dương, Lâm Đồng",
    weight: "250 g / hộp",
    harvest: "30/03/2026",
    status: "error",
  },
];

const statusConfig: Record<Status, { label: string; variant: "success" | "error"; icon: typeof CheckCircle2 }> = {
  valid: { label: "Hợp lệ", variant: "success", icon: CheckCircle2 },
  error: { label: "Lỗi QR", variant: "error", icon: AlertCircle },
};

const detailFields = (p: Product) => [
  { icon: Package,  label: "Tên sản phẩm",     value: p.name,     color: "text-blue-500"   },
  { icon: Hash,     label: "Mã SKU",            value: p.sku,      color: "text-purple-500" },
  { icon: MapPin,   label: "Xuất xứ",           value: p.origin,   color: "text-red-400"    },
  { icon: Scale,    label: "Khối lượng",        value: p.weight,   color: "text-orange-500" },
  { icon: Calendar, label: "Ngày thu hoạch",    value: p.harvest,  color: "text-green-500"  },
  { icon: QrCode,   label: "Mã QR",             value: p.qrCode,   color: "text-gray-500"   },
];

function ProductDetailSheet({
  product,
  onClose,
  onDelete,
}: {
  product: Product | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  if (!product) return null;
  const cfg = statusConfig[product.status];
  const StatusIcon = cfg.icon;
  const isError = product.status === "error";
  return (
    <>
      {/* Sheet header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <div className={`w-10 h-10 rounded-xl ${product.bg} flex items-center justify-center text-2xl shrink-0`}>
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{product.name}</p>
          <Badge variant={cfg.variant} className="flex items-center gap-1 text-[10px] mt-1 w-fit">
            <StatusIcon size={10} />
            {cfg.label}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Detail fields */}
      <div className="px-4 py-2 divide-y divide-gray-50">
        {detailFields(product).map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="flex items-center gap-3 py-3">
              <Icon size={16} className={`shrink-0 ${f.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                  {f.label}
                </p>
                <p className="text-[13px] text-gray-800 font-medium truncate">{f.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sheet actions */}
      <div className="px-4 pt-2 pb-safe-4 flex gap-3">
        {isError ? (
          <>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl text-sm border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 size={15} className="mr-1.5" />
              Xoá sản phẩm lỗi
            </Button>
            <Button
              className="flex-1 h-11 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
              disabled
            >
              Không hợp lệ
            </Button>
          </>
        ) : (
          <Button
            className="w-full h-11 rounded-xl text-sm bg-blue-600 hover:bg-blue-700"
            onClick={onClose}
          >
            Đóng
          </Button>
        )}
      </div>
    </>
  );
}

export default function BatchPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selected, setSelected] = useState<Product | null>(null);

  const validCount = products.filter((p) => p.status === "valid").length;
  const errorCount = products.filter((p) => p.status === "error").length;

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  };

  return (
    <AuthGuard>
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Status bar */}
      <div className="h-11 bg-white" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/scanner?tab=double" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={22} className="text-gray-700" />
          </Link>
          <h1 className="text-base font-semibold text-gray-900">Danh sách sản phẩm</h1>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold">
          {products.length} sản phẩm
        </Badge>
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 px-4 py-3 bg-white border-b border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-1.5">
          <CheckCircle2 size={13} />
          <span className="font-medium">{validCount} hợp lệ</span>
        </div>
        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">
            <AlertCircle size={13} />
            <span className="font-medium">{errorCount} lỗi</span>
          </div>
        )}
      </div>

      {/* Scrollable product list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36 space-y-3">
        {products.map((product, index) => {
          const cfg = statusConfig[product.status];
          const StatusIcon = cfg.icon;
          const isError = product.status === "error";
          return (
            <Card
              key={product.id}
              className={`shadow-sm overflow-hidden transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                isError ? "border-red-200" : "border-gray-100"
              }`}
              onClick={() => setSelected(product)}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Index */}
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-500">{index + 1}</span>
                </div>

                {/* Product image */}
                <div className={`w-14 h-14 rounded-xl ${product.bg} flex items-center justify-center shrink-0 text-3xl`}>
                  {product.emoji}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{product.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">{product.sku}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                    <span className="text-[11px] text-gray-500">📍 {product.origin}</span>
                    <span className="text-[11px] text-gray-500">⚖️ {product.weight}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">QR: {product.qrCode}</p>
                </div>

                {/* Status + chevron */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={cfg.variant} className="flex items-center gap-1 text-[10px]">
                    <StatusIcon size={10} />
                    {cfg.label}
                  </Badge>
                  <ChevronRight size={15} className="text-gray-300 mt-1" />
                </div>
              </div>
            </Card>
          );
        })}

        {/* Add more */}
        <Link href="/scanner?tab=double">
          <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors mt-1">
            <PlusCircle size={18} />
            <span className="text-sm font-medium">Quét thêm sản phẩm</span>
          </div>
        </Link>
      </div>

      {/* Sticky confirm */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 px-4 pt-4 pb-safe-4 shadow-lg">
        {errorCount > 0 && (
          <p className="text-[11px] text-red-500 text-center mb-2 flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            Xoá {errorCount} sản phẩm lỗi để tiếp tục xác nhận
          </p>
        )}
        <Button
          onClick={() => router.push("/scanner?toast=1")}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700"
          disabled={errorCount > 0}
        >
          Xác nhận
        </Button>
      </div>

      {/* ── Detail bottom sheet backdrop ── */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setSelected(null)}
      />

      {/* ── Detail bottom sheet panel ── */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out",
          selected ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <ProductDetailSheet
          product={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      </div>
    </div>
    </AuthGuard>
  );
}
