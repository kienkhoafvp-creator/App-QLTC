// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Thư viện tạo hiệu ứng gaming
import { Wallet, ShieldCheck, Zap } from "lucide-react";
import ZoomInput from "@/4_infrastructure/ui/components/inputs/ZoomInput";
import AlertPopup from "@/4_infrastructure/ui/components/gamefi-popups/AlertPopup";
import { AuthRepo } from "@/3_adapters/repositories/AuthRepo";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
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
      setPopup({ 
        isOpen: true, 
        type: "success", 
        message: "HỆ THỐNG ĐÃ KẾT NỐI! Đang nạp dữ liệu tài chính..." 
      });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      // Quy tắc 3: Báo lỗi chính xác
      setPopup({ isOpen: true, type: "error", message: `TRUY CẬP BỊ TỪ CHỐI: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      {/* Khung Card chính - Bóp hẹp 2 bên theo Quy tắc 5 */}
      <div className="w-full max-w-[360px] bg-slate-900/80 border-2 border-blue-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md">
        
        {/* Header mang phong cách Trạm điều khiển */}
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-3 border border-blue-500/20">
            <Wallet className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase">
            Trạm Điều Khiển <span className="text-blue-400">Vốn</span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[2px] mt-1">
            Xác thực danh tính để quản lý dòng tiền
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <ZoomInput
              label="ĐỊNH DANH CHIẾN BINH"
              tooltipInfo="Sử dụng Email hoặc SĐT đã đăng ký"
              type="text"
              placeholder="Nhập tài khoản..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <ZoomInput
              label="MÃ KHÓA BẢO MẬT"
              tooltipInfo="Mật khẩu mã hóa 256-bit"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Nút bấm Gaming với hiệu ứng nhấn (Dopamine) */}
          <button
            disabled={isLoading}
            type="submit"
            className="group relative w-full mt-4 overflow-hidden rounded-xl bg-blue-600 px-6 py-3 font-black text-white transition-all hover:bg-blue-500 active:scale-95 shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px]"
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-sm tracking-widest">KÍCH HOẠT HỆ THỐNG</span>
                </>
              )}
            </div>
            {/* Hiệu ứng quét sáng ngang nút bấm */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-500 font-medium">
            CHƯA CÓ QUYỀN TRUY CẬP?
          </p>
          <Link 
            href="/register" 
            className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center justify-center gap-1 mt-1 transition-colors"
          >
            <ShieldCheck className="w-3 h-3" />
            TẠO NHÂN VẬT MỚI
          </Link>
        </div>
      </div>

      {/* Pop-up thay thế Alert mặc định theo Quy tắc 6 */}
      <AlertPopup 
        isOpen={popup.isOpen} 
        type={popup.type} 
        message={popup.message} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />
    </motion.div>
  );
}