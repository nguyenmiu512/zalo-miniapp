"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface HistoryRecord {
  id: number;
  name: string;
  sku: string;
  image: string;
  imageBg: string;
  business: string;
  timestamp: Date;
  status: "success" | "draft";
}

let _id = 200;
function mid() { return ++_id; }
function ago(ms: number) { return new Date(Date.now() - ms); }
const H = 3600 * 1000;
const M = 60 * 1000;

const MOCK: HistoryRecord[] = [
  { id: mid(), name: "Gạo ST25 Hữu Cơ Sóc Trăng",    sku: "ST25-HCO-5KG-0045",   image: "🌾", imageBg: "bg-amber-50",   business: "Công ty TNHH Nông sản Sóc Trăng",    timestamp: ago(30*M),    status: "success" },
  { id: mid(), name: "Cà Phê Robusta Đắk Lắk",         sku: "CF-ROB-250G-0012",    image: "☕", imageBg: "bg-orange-50",  business: "HTX Cà Phê Buôn Ma Thuột",            timestamp: ago(2*H),     status: "success" },
  { id: mid(), name: "Tiêu Đen Phú Quốc",              sku: "PQ-BLK-100G-0088",    image: "🌶️", imageBg: "bg-red-50",     business: "Cơ sở Tiêu Phú Quốc Xanh",           timestamp: ago(26*H),    status: "success" },
  { id: mid(), name: "Mật Ong Rừng Tây Nguyên",        sku: "HNY-WLD-500ML-0023",  image: "🍯", imageBg: "bg-yellow-50",  business: "Công ty TNHH Mật Ong Cao Nguyên",     timestamp: ago(29*H),    status: "success" },
  { id: mid(), name: "Nước Mắm Phú Quốc",              sku: "NM-PQ-750ML-0056",    image: "🐟", imageBg: "bg-blue-50",    business: "Công ty CP Nước Mắm Phú Quốc",        timestamp: ago(50*H),    status: "success" },
  { id: mid(), name: "Dừa Tươi Bến Tre",               sku: "BT-COC-001-0034",     image: "🥥", imageBg: "bg-green-50",   business: "HTX Dừa Bến Tre",                     timestamp: ago(45*M),    status: "draft" },
  { id: mid(), name: "Muối Hồng Himalaya",              sku: "HIM-SALT-250G-0009",  image: "🧂", imageBg: "bg-pink-50",    business: "Công ty TNHH Muối Himalaya VN",       timestamp: ago(90*M),    status: "draft" },
  { id: mid(), name: "Trà Shan Tuyết Hà Giang",         sku: "HG-TEA-100G-0067",    image: "🍃", imageBg: "bg-emerald-50", business: "HTX Trà Cổ Thụ Hà Giang",             timestamp: ago(26*H),    status: "draft" },
];

interface HistoryContextType {
  records: HistoryRecord[];
  addSuccess: (data: Omit<HistoryRecord, "id" | "timestamp" | "status">) => void;
  addDraft: (data: Omit<HistoryRecord, "id" | "timestamp" | "status">) => void;
  syncRecord: (id: number) => void;
  syncAll: () => void;
  syncMultiple: (ids: number[]) => void;
}

const Ctx = createContext<HistoryContextType | null>(null);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<HistoryRecord[]>(MOCK);

  const addSuccess = useCallback((data: Omit<HistoryRecord, "id" | "timestamp" | "status">) => {
    setRecords(prev => [{ ...data, id: mid(), timestamp: new Date(), status: "success" }, ...prev]);
  }, []);

  const addDraft = useCallback((data: Omit<HistoryRecord, "id" | "timestamp" | "status">) => {
    setRecords(prev => [{ ...data, id: mid(), timestamp: new Date(), status: "draft" }, ...prev]);
  }, []);

  const syncRecord = useCallback((id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "success", timestamp: new Date() } : r));
  }, []);

  const syncAll = useCallback(() => {
    setRecords(prev => prev.map(r => r.status === "draft" ? { ...r, status: "success", timestamp: new Date() } : r));
  }, []);

  const syncMultiple = useCallback((ids: number[]) => {
    setRecords(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: "success", timestamp: new Date() } : r));
  }, []);

  return <Ctx.Provider value={{ records, addSuccess, addDraft, syncRecord, syncAll, syncMultiple }}>{children}</Ctx.Provider>;
}

export function useHistory() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
