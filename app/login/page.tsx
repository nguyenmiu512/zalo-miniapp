"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 600));

    if (username === "pila" && password === "pila@123") {
      login();
      router.replace("/scanner");
    } else {
      setLoading(false);
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Status bar */}
      <div className="h-11" />

      {/* Logo area */}
      <div className="flex flex-col items-center pt-12 pb-10 px-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 8h8a6 6 0 010 12H8V8z" fill="white" opacity="0.9"/>
            <rect x="8" y="22" width="4" height="4" rx="1" fill="white"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PILA</h1>
        <p className="text-sm text-gray-500 mt-1">Truy xuất nguồn gốc sản phẩm</p>
      </div>

      {/* Form card */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Đăng nhập</h2>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-[13px] text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Username */}
        <div className="mb-3">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={16} />
            </div>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tên đăng nhập"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={16} />
            </div>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Nhập mật khẩu"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Đang đăng nhập...
            </>
          ) : "Đăng nhập"}
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-6 px-6">
        Chỉ dành cho nhân viên PILA Corporation
      </p>
    </div>
  );
}
