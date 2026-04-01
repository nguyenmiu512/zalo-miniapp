"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, removeUser, AuthUser } from "@/lib/auth";
import { LogOut, ShieldCheck } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
    } else {
      setUser(u);
      setChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    removeUser();
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* User badge fixed top-right */}
      {user && (
        <div className="fixed top-3 right-3 z-[100] flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full pl-1 pr-3 py-1 shadow-sm">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheck size={12} className="text-blue-600" />
            </div>
          )}
          <span className="text-[11px] font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
            <LogOut size={12} />
          </button>
        </div>
      )}
    </>
  );
}
