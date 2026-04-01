"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleOneTapLogin, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { getUser, saveUser, isAllowedDomain, ALLOWED_DOMAIN, AuthUser } from "@/lib/auth";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface GoogleJWT {
  email: string;
  name: string;
  picture: string;
  exp: number;
  hd?: string; // hosted domain (GSuite)
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already logged in → skip to scanner
  useEffect(() => {
    if (getUser()) router.replace("/scanner");
  }, [router]);

  const handleSuccess = (response: CredentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const decoded = jwtDecode<GoogleJWT>(response.credential!);
      if (!isAllowedDomain(decoded.email)) {
        setError(`Tài khoản "${decoded.email}" không thuộc tổ chức PILA Corporation (@${ALLOWED_DOMAIN}).`);
        setLoading(false);
        return;
      }
      const user: AuthUser = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: response.credential!,
        exp: decoded.exp,
      };
      saveUser(user);
      router.replace("/scanner");
    } catch {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // ── One Tap: auto-detect active Chrome/Google session ──
  // If user is already signed into Chrome with @pila.com.vn → shows 1-click popup
  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: () => {},
    hosted_domain: ALLOWED_DOMAIN, // Only show for @pila.com.vn accounts
    cancel_on_tap_outside: false,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Status bar */}
      <div className="h-11" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">

        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-6">
          <ShieldCheck size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">Truy xuất nguồn gốc</h1>
        <p className="text-sm text-gray-500 text-center mt-2 mb-2">PILA Corporation</p>
        <div className="flex items-center gap-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-xs text-gray-400">Chỉ dành cho thành viên nội bộ</p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-1">Đăng nhập bằng Google</p>
          <p className="text-xs text-gray-400 text-center mb-5">
            Sử dụng tài khoản{" "}
            <span className="font-medium text-blue-600">@{ALLOWED_DOMAIN}</span>
          </p>

          {/* Button */}
          <div className="flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Đang xác thực...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError("Đăng nhập thất bại. Vui lòng thử lại.")}
                theme="outline"
                shape="rectangular"
                text="signin_with"
                hosted_domain={ALLOWED_DOMAIN}
                width={280}
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 leading-snug">{error}</p>
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 w-full">
          <p className="text-[11px] text-blue-600 text-center leading-relaxed">
            💡 Nếu Chrome đang đăng nhập tài khoản PILA, một popup sẽ tự xuất hiện để đăng nhập nhanh.
          </p>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed px-2">
          Hệ thống chỉ chấp nhận tài khoản Google Workspace thuộc tổ chức PILA Corporation.
        </p>
      </div>
    </div>
  );
}
