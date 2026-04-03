"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export interface ToastItem {
  id: number;
  message: string;
  type?: "success" | "error";
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
  duration?: number;
}

export function SuccessToast({ toasts, onDismiss, duration = 5000 }: ToastStackProps) {
  if (toasts.length === 0) return null;

  const visible = toasts.slice(-3);
  const total = toasts.length;

  return (
    <>
      {visible.map((toast, vi) => {
        const depth = visible.length - 1 - vi;
        const isTop = depth === 0;
        const isError = toast.type === "error";
        const accent = isError ? "bg-red-500" : "bg-green-500";
        const accentHover = isError ? "hover:bg-red-400 active:bg-red-600" : "hover:bg-green-400 active:bg-green-600";
        const bar = isError ? "bg-red-400" : "bg-green-400";
        const Icon = isError ? XCircle : CheckCircle2;

        return (
          <div
            key={toast.id}
            className="fixed left-1/2 w-[calc(100%-32px)] max-w-[358px]"
            style={{
              top: `${56 + depth * 10}px`,
              transform: "translateX(-50%)",
              zIndex: 50 + (visible.length - depth),
            }}
          >
            <div
              style={{
                transform: `scale(${1 - depth * 0.04})`,
                transformOrigin: "top center",
                opacity: isTop ? 1 : depth === 1 ? 0.82 : 0.6,
                transition: "transform 300ms ease-out, opacity 300ms ease-out",
              }}
            >
              <div className={`flex items-center gap-3 text-white rounded-2xl px-4 py-3.5 shadow-2xl ${isTop ? "bg-gray-900" : "bg-gray-700"}`}>
                <div className="relative shrink-0">
                  <div className={`${accent} rounded-full p-1`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  {isTop && total > 1 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 leading-none">
                      {total}
                    </span>
                  )}
                </div>

                <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>

                {isTop && (
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className={`shrink-0 ml-2 px-3 py-1.5 rounded-lg ${accent} ${accentHover} text-white text-xs font-semibold transition-colors whitespace-nowrap`}
                  >
                    OK
                  </button>
                )}
              </div>

              {isTop && (
                <div className="mx-2 h-0.5 bg-gray-700 rounded-full overflow-hidden mt-1">
                  <div
                    key={toast.id}
                    className={`h-full ${bar} rounded-full origin-left`}
                    style={{ animation: `shrink ${duration}ms linear forwards` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
