// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  
  // State quản lý GameFi Pop-up (Thay thế alert)
  const [popup, setPopup] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Hàm gọi Pop-up thay cho alert()
  const showGameFiAlert = (featureName: string) => {
    setPopup({
      show: true,
      message: `Tính năng [${featureName}] đang được thợ rèn nâng cấp. Vui lòng quay lại sau!`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center font-sans text-slate-200">
      {/* Khung chính bóp hẹp chuẩn Mobile */}
      <div className="w-full max-w-md bg-slate-900 relative flex flex-col shadow-2xl overflow-hidden pb-24">
        
        {/* TOP SECTION: Số dư tổng */}
        <div className="p-6 pb-2 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-400 font-medium">Tổng số dư</span>
            <button onClick={handleLogout} className="text-xs text-red-400 border border-red-500/30 px-2 py-1 rounded bg-red-500/10">
              Thoát
            </button>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-wider">
            0.00 <span className="text-xl">đ</span>
          </div>
        </div>

        {/* MIDDLE SECTION: Các Card báo cáo */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          
          {/* Card: Ví của tôi */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-300">Ví của tôi</h2>
              <button onClick={() => showGameFiAlert('Xem tất cả ví')} className="text-xs text-emerald-400">Xem tất cả</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center border-2 border-slate-800">
                  <span className="text-xs font-bold text-white">TM</span>
                </div>
                <span className="text-sm font-medium">Tiền mặt</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">0.00 đ</span>
            </div>
          </div>

          {/* Card: Báo cáo tháng này */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-300">Báo cáo tháng này</h2>
              <button onClick={() => showGameFiAlert('Xem chi tiết báo cáo')} className="text-xs text-emerald-400">Xem báo cáo</button>
            </div>
            
            <div className="flex w-full mb-4 text-center border-b border-slate-700">
              <div className="flex-1 pb-2 border-b-2 border-red-500">
                <div className="text-xs text-slate-400 mb-1">Tổng đã chi</div>
                <div className="text-sm font-bold text-red-500">0.00</div>
              </div>
              <div className="flex-1 pb-2 border-b-2 border-transparent">
                <div className="text-xs text-slate-400 mb-1">Tổng thu</div>
                <div className="text-sm font-bold text-blue-400">0.00</div>
              </div>
            </div>

            <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30">
              <span className="text-sm text-slate-500">Nhập giao dịch để xem báo cáo</span>
            </div>
          </div>

        </div>

        {/* BOTTOM NAVIGATION: 7 Nút theo yêu cầu (Lưu ý: Thiết kế này gây chật chội) */}
        <div className="absolute bottom-0 w-full bg-slate-900 border-t border-emerald-500/30 px-1 py-2 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
          
          {/* Nhóm 3 nút bên trái */}
          <div className="flex flex-1 justify-around">
            <button onClick={() => showGameFiAlert('BCTC Tổng quan')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">📊</div>
              <span className="text-[9px] font-medium text-slate-400">BCTC</span>
            </button>
            <button onClick={() => showGameFiAlert('Nguồn tiền')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">🏦</div>
              <span className="text-[9px] font-medium text-slate-400">Nguồn</span>
            </button>
            <button onClick={() => showGameFiAlert('Ví tiền')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">👛</div>
              <span className="text-[9px] font-medium text-slate-400">Ví</span>
            </button>
          </div>

          {/* Nút Cộng (Giữa) - Nổi bật */}
          <div className="relative -top-6 mx-1 flex-shrink-0">
            <button 
              onClick={() => showGameFiAlert('Thêm Giao Dịch Mới')}
              className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
            >
              <span className="text-3xl text-slate-900 font-black leading-none pb-1">+</span>
            </button>
          </div>

          {/* Nhóm 3 nút bên phải */}
          <div className="flex flex-1 justify-around">
            <button onClick={() => showGameFiAlert('Ngân sách')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">📋</div>
              <span className="text-[9px] font-medium text-slate-400">Ng.Sách</span>
            </button>
            <button onClick={() => showGameFiAlert('Tài sản')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">💎</div>
              <span className="text-[9px] font-medium text-slate-400">Tài sản</span>
            </button>
            <button onClick={() => showGameFiAlert('Nợ')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">📉</div>
              <span className="text-[9px] font-medium text-slate-400">Nợ</span>
            </button>
          </div>
        </div>

        {/* COMPONENT: GameFi Pop-up (Thay thế alert mặc định) */}
        {popup.show && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-slate-800 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🛠️</span>
              </div>
              <h3 className="text-lg font-black text-emerald-400 mb-2 uppercase">Hệ thống báo cáo</h3>
              <p className="text-sm text-slate-300 mb-6">{popup.message}</p>
              <button 
                onClick={() => setPopup({ show: false, message: "" })}
                className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500 hover:bg-emerald-500/20 font-bold py-2 rounded-xl transition-all active:scale-95"
              >
                ĐÃ RÕ
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}