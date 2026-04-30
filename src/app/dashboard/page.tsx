"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

import NguonTien from "./nguontien";
import NganSach from "./ngansach";
import KhoanNo from "./khoanno";
import GiaoDich from "./giaodich";

type TabState = "main" | "nguontien" | "ngansach" | "khoanno" | "giaodich";

export default function DashboardPage() {
  const router = useRouter();
  
  // SỬA ĐỔI 1: Đặt giá trị mặc định là "giaodich" để tự động mở form khi vào trang
  const [activeTab, setActiveTab] = useState<TabState>("giaodich");

  const [popup, setPopup] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const showGameFiAlert = (featureName: string) => {
    setPopup({ show: true, message: `Tính năng [${featureName}] đang được thợ rèn nâng cấp.` });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center font-sans text-slate-200">
      <div className="w-full max-w-md bg-slate-900 relative flex flex-col shadow-2xl h-screen overflow-hidden">
        
        {/* === PHẦN NỘI DUNG CHÍNH (CÓ THỂ CUỘN) === */}
        <div className="flex-1 overflow-y-auto pb-28 relative">
          
          {/* NẾU ĐANG Ở TRANG CHỦ (MAIN) */}
          {activeTab === "main" && (
            <div className="animate-in fade-in duration-500">
              <div className="p-6 pb-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-3xl shadow-lg border-b border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400 font-medium tracking-wide">Tổng số dư hệ thống</span>
                  <button 
                    onClick={handleLogout} 
                    className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 active:scale-90 transition-all duration-200"
                  >
                    Thoát
                  </button>
                </div>
                <div className="text-4xl font-black text-emerald-400 tracking-wider flex items-end gap-1">
                  0.00 <span className="text-2xl mb-1 text-emerald-500/70">đ</span>
                </div>
              </div>

              <div className="p-8 flex flex-col items-center justify-center opacity-40 mt-10">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center mb-3">
                  <span className="text-2xl text-slate-500">?</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Khu vực hiển thị tổng quan</p>
              </div>
            </div>
          )}

          {/* RENDER CÁC COMPONENT CHỨC NĂNG */}
          {activeTab === "nguontien" && <NguonTien />}
          {activeTab === "ngansach" && <NganSach />}
          {activeTab === "khoanno" && <KhoanNo />}
          {/* Nút hủy bên trong GiaoDich sẽ đưa về màn hình main */}
          {activeTab === "giaodich" && <GiaoDich />}
        </div>

        {/* === THANH ĐIỀU HƯỚNG BÊN DƯỚI === */}
        <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-emerald-500/20 px-2 py-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.6)] z-40 rounded-t-3xl">
          
          {/* Nhóm Trái (Tổng quan + Nguồn) */}
          <div className="flex flex-1 justify-evenly items-center">
            {/* Nút Tổng Quan */}
            <button 
              onClick={() => setActiveTab("main")} 
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'main' ? 'opacity-100 bg-slate-800/80' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'main' ? 'bg-slate-700 shadow-inner' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">👁️</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'main' ? 'text-slate-300' : 'text-slate-400'}`}>Tổng quan</span>
            </button>
            
            {/* Nút Nguồn Tiền */}
            <button 
              onClick={() => setActiveTab("nguontien")} 
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'nguontien' ? 'opacity-100 bg-blue-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'nguontien' ? 'bg-blue-500/20 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">🏦</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'nguontien' ? 'text-blue-400' : 'text-slate-400'}`}>Nguồn</span>
            </button>
          </div>

          {/* SỬA ĐỔI 2: Nút Trung Tâm (Kích hoạt Giao Dịch) */}
          <div className="relative -top-8 flex-shrink-0 px-2">
            <button 
              onClick={() => setActiveTab("giaodich")} 
              className={`group w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-900 active:scale-90 transition-all duration-300 ${
                activeTab === 'giaodich' 
                  ? 'bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)]' 
                  : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]'
              }`}
            >
              <span className={`text-4xl font-black leading-none pb-1 transition-transform duration-300 ease-bounce ${activeTab === 'giaodich' ? 'text-slate-800 rotate-45' : 'text-slate-900 group-hover:rotate-90'}`}>
                {activeTab === 'giaodich' ? '×' : '＋'}
              </span>
            </button>
          </div>

          {/* Nhóm Phải (Ngân sách + Nợ) */}
          <div className="flex flex-1 justify-evenly items-center">
            {/* Nút Ngân Sách */}
            <button 
              onClick={() => setActiveTab("ngansach")} 
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'ngansach' ? 'opacity-100 bg-amber-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'ngansach' ? 'bg-amber-500/20 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">📋</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'ngansach' ? 'text-amber-400' : 'text-slate-400'}`}>Ng.Sách</span>
            </button>
            
            {/* Nút Khoản Nợ */}
            <button 
              onClick={() => setActiveTab("khoanno")} 
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'khoanno' ? 'opacity-100 bg-red-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'khoanno' ? 'bg-red-500/20 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">📉</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'khoanno' ? 'text-red-400' : 'text-slate-400'}`}>Nợ</span>
            </button>
          </div>

        </div>

        {/* COMPONENT: GameFi Pop-up */}
        {popup.show && (
          <div className="absolute inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xs bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-slate-800 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-lg font-black text-emerald-400 mb-2 uppercase tracking-wide">Trạm Chế Tạo</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">{popup.message}</p>
              <button 
                onClick={() => setPopup({ show: false, message: "" })} 
                className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500 hover:bg-emerald-500/20 font-bold py-3 rounded-xl active:scale-95 transition-all tracking-widest uppercase"
              >
                Đã Rõ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}