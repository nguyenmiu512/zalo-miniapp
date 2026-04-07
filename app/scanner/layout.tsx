"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ToastProvider, useToast } from "@/components/toast-context";
import { HistoryProvider } from "@/components/history-context";
import { SuccessToast } from "@/components/success-toast";
import { useAuth } from "@/components/auth-context";
import { QrCode, Clock } from "lucide-react";

function ToastRenderer() {
  const { toasts, dismissToast } = useToast();
  return <SuccessToast toasts={toasts} onDismiss={dismissToast} duration={5000} />;
}

function BottomNav() {
  const pathname = usePathname();
  const isHistory = pathname.startsWith("/scanner/history");

  const tabs = [
    { href: "/scanner", icon: QrCode, label: "Quét QR", active: !isHistory },
    { href: "/scanner/history", icon: Clock, label: "Lịch sử", active: isHistory },
  ] as const;

  return (
    <div
      className="shrink-0 bg-white flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {tabs.map(({ href, icon: Icon, label, active }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center gap-1 pt-2 pb-3 border-t-2 transition-colors ${
            active
              ? "text-blue-600 border-blue-600"
              : "text-gray-400 border-gray-100 hover:text-gray-600"
          }`}
        >
          <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { authenticated } = useAuth();

  useEffect(() => {
    if (!authenticated) router.replace("/login");
  }, [authenticated, router]);

  if (!authenticated) return null;

  return (
    <HistoryProvider>
      <ToastProvider>
        <ToastRenderer />
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            {children}
          </div>
          <BottomNav />
        </div>
      </ToastProvider>
    </HistoryProvider>
  );
}
