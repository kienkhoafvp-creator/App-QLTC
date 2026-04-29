// src/app/dashboard/page.tsx
"use client";

import { AuthRepo } from "@/3_adapters/repositories/AuthRepo";
import { useRouter } from "next/navigation";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4">
      {/* Khung Card bóp hẹp 2 bên */}
      <div className="w-full max-w-sm mt-10 bg-slate-900 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-3xl p-6 text-center">
        <h1 className="text-2xl font-black text-emerald-400 mb-2 uppercase">
          TỔNG QUAN TÀI CHÍNH
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Chào mừng bạn đã bước vào thế giới quản lý tài chính GameFi. Các tính năng đang được mở khóa...
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-slate-800 text-red-400 border border-red-500/50 hover:bg-slate-700 font-bold py-3 rounded-xl transition-all active:scale-95"
        >
          ĐĂNG XUẤT
        </button>
      </div>
    </div>
  );
}