"use client";

import { useState } from "react";
import { RotateCcw, X, CheckCircle2, FileX, Undo2 } from "lucide-react";
import { useHistory, type HistoryRecord } from "@/components/history-context";
import { useToast } from "@/components/toast-context";

// ── Date helpers ─────────────────────────────────────────────────────────────
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
function dateLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, today)) return "Hôm nay";
  if (isSameDay(d, yesterday)) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function timeStr(d: Date) {
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
function groupRecords(records: HistoryRecord[]) {
  const map = new Map<string, HistoryRecord[]>();
  [...records].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).forEach(r => {
    const label = dateLabel(r.timestamp);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(r);
  });
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

// ── Simulate re-record outcome per product name ───────────────────────────────
function simulateOutcome(name: string): "success" | "error" {
  if (name.includes("Muối")) return "error";
  return "success";
}

// ── Item card ─────────────────────────────────────────────────────────────────
function RecordItem({ record, onClick }: { record: HistoryRecord; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
    >
      <div className={`w-10 h-10 rounded-xl ${record.imageBg} flex items-center justify-center text-xl shrink-0`}>
        {record.image}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[13px] font-semibold text-gray-900 truncate">{record.name}</p>
          {record.label && (
            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {record.label}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{record.sku}</p>
      </div>
      <span className="text-[11px] text-gray-400 shrink-0">{timeStr(record.timestamp)}</span>
    </button>
  );
}

// ── Detail bottom sheet ───────────────────────────────────────────────────────
function DetailSheet({
  record,
  onClose,
  onReRecord,
  onRevoke,
}: {
  record: HistoryRecord | null;
  onClose: () => void;
  onReRecord: (record: HistoryRecord) => void;
  onRevoke: (record: HistoryRecord) => void;
}) {
  const visible = record !== null;
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}>
        {record && (
          <>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Chi tiết sản phẩm</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-2xl ${record.imageBg} flex items-center justify-center text-3xl shrink-0`}>
                  {record.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 leading-snug">{record.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">{record.sku}</p>
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Doanh nghiệp</span>
                  <span className="text-[12px] text-gray-800 font-medium text-right max-w-[60%] leading-snug">{record.business}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Thời gian</span>
                  <span className="text-[12px] text-gray-800 font-medium">{dateLabel(record.timestamp)} · {timeStr(record.timestamp)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Trạng thái</span>
                  <div className="flex items-center gap-1.5">
                    {record.label && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">{record.label}</span>
                    )}
                    {record.status === "success"
                      ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Thành công</span>
                      : <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Nháp</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-safe-5 pt-1">
              {record.status === "draft" ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { onReRecord(record); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                  >
                    <RotateCcw size={15} />
                    Xác nhận lại
                  </button>
                  <button
                    onClick={() => { onRevoke(record); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 h-10 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
                  >
                    <Undo2 size={15} />
                    Thu hồi
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  Đã ghi nhận thành công
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const { records, syncRecord, syncMultiple, removeRecord, removeAll } = useHistory();
  const { addToast } = useToast();

  const [tab, setTab] = useState<"success" | "draft">("success");
  const [selected, setSelected] = useState<HistoryRecord | null>(null);

  const successList = records.filter(r => r.status === "success");
  const draftList   = records.filter(r => r.status === "draft");
  const current     = tab === "success" ? successList : draftList;
  const groups      = groupRecords(current);

  // Re-record single item
  const handleReRecord = (record: HistoryRecord) => {
    const outcome = simulateOutcome(record.name);
    if (outcome === "success") {
      syncRecord(record.id);
      addToast(`Xác nhận lại thành công: ${record.name}`, "success");
    } else {
      addToast(`Xác nhận lại thất bại: ${record.name}`, "error");
    }
  };

  // Revoke single draft
  const handleRevoke = (record: HistoryRecord) => {
    removeRecord(record.id);
    addToast(`Đã thu hồi: ${record.name}`, "success");
  };

  // Revoke all drafts
  const handleRevokeAll = () => {
    const ids = draftList.map(r => r.id);
    removeAll(ids);
    addToast(`Đã thu hồi ${ids.length} bản ghi`, "success");
  };

  // Re-record all drafts
  const handleReRecordAll = () => {
    const drafts = records.filter(r => r.status === "draft");
    const successIds = drafts.filter(r => simulateOutcome(r.name) === "success").map(r => r.id);
    const failCount  = drafts.length - successIds.length;

    if (successIds.length > 0) syncMultiple(successIds);
    if (successIds.length > 0) addToast(`Xác nhận thành công ${successIds.length} bản ghi`, "success");
    if (failCount > 0)         addToast(`${failCount} bản ghi xác nhận thất bại`, "error");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* Status bar */}
      <div className="h-11 bg-white shrink-0" />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shrink-0">
        <div className="px-4 pb-3 pt-1">
          <h1 className="text-base font-semibold text-gray-900">Lịch sử</h1>
        </div>
      </div>

      {/* Segment control */}
      <div className="mx-4 my-3 shrink-0">
        <div className="relative flex bg-gray-100 rounded-xl p-1">
          <div
            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
            style={{
              width: "calc(50% - 6px)",
              transform: tab === "success" ? "translateX(0)" : "translateX(calc(100% + 8px))",
              transition: "transform 280ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
          />
          {([
            { id: "success", label: `Thành công (${successList.length})` },
            { id: "draft",   label: `Nháp (${draftList.length})` },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "relative z-10 flex-1 py-1.5 text-sm rounded-lg transition-colors duration-200",
                tab === t.id ? "font-semibold text-gray-900" : "font-medium text-gray-500",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className={`flex-1 overflow-y-auto ${tab === "draft" && draftList.length > 0 ? "pb-40" : "pb-20"}`}>
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <FileX size={40} strokeWidth={1.5} />
            <p className="text-sm font-medium">Chưa có dữ liệu</p>
          </div>
        ) : (
          groups.map(({ label, items }) => (
            <div key={label}>
              <p className="px-4 pt-4 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {items.map(r => (
                  <RecordItem key={r.id} record={r} onClick={() => setSelected(r)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom actions — Nháp tab only */}
      {tab === "draft" && draftList.length > 0 && (
        <div className="fixed bottom-[57px] left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-3 shadow-lg">
          <div className="flex gap-3">
            <button
              onClick={handleReRecordAll}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw size={16} />
              Xác nhận lại
            </button>
            <button
              onClick={handleRevokeAll}
              className="flex-1 flex items-center justify-center gap-2 h-12 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors "
            >
              <Undo2 size={16} />
              Thu hồi
            </button>
          </div>
        </div>
      )}

      {/* Detail sheet */}
      <DetailSheet
        record={selected}
        onClose={() => setSelected(null)}
        onReRecord={handleReRecord}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
