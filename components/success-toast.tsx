"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessToastProps {
  message: string;
  duration?: number; // ms
  onDismiss: () => void;
}

export function SuccessToast({ message, duration = 5000, onDismiss }: SuccessToastProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Start leave animation before fully dismissing
    const leaveTimer = setTimeout(() => setLeaving(true), duration - 400);

    // Call onDismiss after full duration
    const dismissTimer = setTimeout(() => onDismiss(), duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(onDismiss, 350);
  };

  return (
    <div
      className={[
        "fixed top-14 left-1/2 z-50 w-[calc(100%-32px)] max-w-[358px]",
        "-translate-x-1/2 transition-all duration-350 ease-out",
        visible && !leaving
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 bg-gray-900 text-white rounded-2xl px-4 py-3.5 shadow-2xl">
        <div className="shrink-0 bg-green-500 rounded-full p-1">
          <CheckCircle2 size={14} className="text-white" />
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="shrink-0 text-gray-400 hover:text-white transition-colors p-0.5"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-2 h-0.5 bg-gray-700 rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-green-400 rounded-full origin-left"
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

    </div>
  );
}
