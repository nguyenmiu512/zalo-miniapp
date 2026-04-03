"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/components/toast-context";
import { HistoryProvider } from "@/components/history-context";
import { SuccessToast } from "@/components/success-toast";
import { useAuth } from "@/components/auth-context";

function ToastRenderer() {
  const { toasts, dismissToast } = useToast();
  return <SuccessToast toasts={toasts} onDismiss={dismissToast} duration={5000} />;
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
        {children}
      </ToastProvider>
    </HistoryProvider>
  );
}
