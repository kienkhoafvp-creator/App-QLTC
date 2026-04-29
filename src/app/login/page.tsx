// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ZoomInput from "@/4_infrastructure/ui/components/inputs/ZoomInput";
import AlertPopup from "@/4_infrastructure/ui/components/gamefi-popups/AlertPopup";
import { AuthRepo } from "@/3_adapters/repositories/AuthRepo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Quản lý Pop-up (Quy tắc 6)
  const [popup, setPopup] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AuthRepo.login(identifier, password);
      setPopup({ isOpen: true, type: "success", message: "Đăng nhập thành công! Đang chuyển hướng..." });
      setTimeout(() => router.push("/dashboard"), 1500); // Chuyển về app chính
    } catch (error: any) {
      // Báo lỗi chính xác (Quy tắc 3)
      setPopup({ isOpen: true, type: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
          ĐĂNG NHẬP
        </h1>
        <p className="text-slate-400 text-xs font-medium">Bắt đầu hành trình tài chính của bạn</p>
      </div>

      <form onSubmit={handleLogin}>
        <ZoomInput
          label="Tài khoản / SĐT / Email"
          tooltipInfo="Nhập 1 trong 3"
          type="text"
          placeholder="Nhập định danh..."
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        
        <ZoomInput
          label="Mật khẩu"
          tooltipInfo="Cấp độ bảo mật cao"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={isLoading}
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_rgba(30,58,138,1)] active:shadow-none active:translate-y-[4px] transition-all"
        >
          {isLoading ? "ĐANG XÁC THỰC..." : "VÀO GAME"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-400 font-bold hover:underline">
          Tạo nhân vật mới
        </Link>
      </div>

      <AlertPopup 
        isOpen={popup.isOpen} 
        type={popup.type} 
        message={popup.message} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />
    </>
  );
}