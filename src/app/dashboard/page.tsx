"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

// Import các chức năng
import NguonTien from "./nguontien";
import NganSach from "./ngansach";
import KhoanNo from "./khoanno";
import GiaoDich from "./giaodich";
import DieuChuyen from "./dieuchuyen"; // Component dạng Tab mới

import { GetThongKeSoDuUseCase } from "@/2_use_cases/transactions/GetThongKeSoDuUseCase";

// Thêm "dieuchuyen" vào TabState
type TabState = "main" | "nguontien" | "ngansach" | "khoanno" | "giaodich" | "dieuchuyen";

export default function DashboardPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabState>("giaodich");

  const [popup, setPopup] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const [viTien, setViTien] = useState<number>(0);
  const [quyDuPhong, setQuyDuPhong] = useState<number>(0);
  const [quyDauTu, setQuyDauTu] = useState<number>(0);

  const fetchThongKe = useCallback(async () => {
    try {
      const useCase = new GetThongKeSoDuUseCase();
      const data = await useCase.execute();
      setViTien(data.viTien);
      setQuyDuPhong(data.duPhong);
      setQuyDauTu(data.dauTu);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu ví:", error);
    }
  }, []);

  useEffect(() => {
    fetchThongKe();
  }, [activeTab, fetchThongKe]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleFormatShortCurrency = (val: number) => {
    if (val === 0) return "0";
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    let res = absVal.toString();
    
    if (absVal >= 1e9) {
      res = +(absVal / 1e9).toFixed(absVal >= 1e10 ? 0 : 1) + "tỉ";
    } else if (absVal >= 1e6) {
      res = +(absVal / 1e6).toFixed(absVal >= 1e7 ? 0 : 1) + "tr";
    } else if (absVal >= 1e3) {
      res = +(absVal / 1e3).toFixed(absVal >= 1e4 ? 0 : 1) + "k";
    }
    
    return isNeg ? "-" + res : res;
  };

  const showGameFiAlert = (featureName: string) => {
    setPopup({ show: true, message: `Tính năng [${featureName}] đang được thợ rèn nâng cấp.` });
  };

  // Hàm hứng kết quả từ Component Điều Chuyển
  const handleTransferComplete = (message: string, isError: boolean = false) => {
    setPopup({ show: true, message });
    if (!isError) {
      fetchThongKe();
      setActiveTab("main"); // Sau khi chuyển xong đẩy về màn Tổng quan cho đẹp
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center font-sans text-slate-200">
      <div className="w-full max-w-md bg-slate-900 relative flex flex-col shadow-2xl h-screen overflow-hidden">
        
        {/* === 1. HEADER CỐ ĐỊNH === */}
        <div className="flex-shrink-0 bg-slate-900 rounded-b-2xl shadow-lg border-b border-slate-700/80 p-2 z-20 relative flex justify-between items-center gap-1.5">
          <button 
            onClick={() => showGameFiAlert("Đổi Mật Khẩu")} 
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <span className="text-lg">🔐</span>
          </button>

          <div className="flex-1 flex justify-between items-center gap-1.5">
            {/* Nút bật Tab Điều chuyển */}
            <button 
              onClick={() => setActiveTab("dieuchuyen")}
              className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 to-transparent border rounded-xl py-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:bg-emerald-500/20 active:scale-95 transition-all ${activeTab === 'dieuchuyen' ? 'border-emerald-400 bg-emerald-500/20' : 'border-emerald-500/40'}`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[12px]">💰</span>
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-tighter truncate">Ví Tiền</span>
              </div>
              <span className="text-base font-black text-emerald-300 text-center leading-none tracking-tight">
                {handleFormatShortCurrency(viTien)}
              </span>
            </button>

            <button 
              onClick={() => showGameFiAlert("Nạp/Rút Dự Phòng")}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/40 rounded-xl py-1.5 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[12px]">🛡️</span>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-tighter truncate">Dự Phòng</span>
              </div>
              <span className="text-base font-black text-amber-300 text-center leading-none tracking-tight">
                {handleFormatShortCurrency(quyDuPhong)}
              </span>
            </button>

            <button 
              onClick={() => showGameFiAlert("Giao Dịch Đầu Tư")}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/40 rounded-xl py-1.5 shadow-[0_0_12px_rgba(59,130,246,0.15)] hover:bg-blue-500/20 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[12px]">🚀</span>
                <span className="text-[11px] text-blue-400 font-bold uppercase tracking-tighter truncate">Đầu Tư</span>
              </div>
              <span className="text-base font-black text-blue-300 text-center leading-none tracking-tight">
                {handleFormatShortCurrency(quyDauTu)}
              </span>
            </button>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-red-500/40 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
          >
            <span className="text-lg">🚪</span>
          </button>
        </div>

        {/* === 2. PHẦN NỘI DUNG CHÍNH === */}
        <div className="flex-1 overflow-y-auto pb-28 relative">
          {activeTab === "main" && (
            <div className="p-8 flex flex-col items-center justify-center opacity-40 mt-10 animate-in fade-in">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center mb-3">
                <span className="text-2xl text-slate-500">📈</span>
              </div>
              <p className="text-sm text-slate-500 font-medium text-center">
                Biểu đồ phân tích dòng tiền sẽ xuất hiện tại đây
              </p>
            </div>
          )}
          
          {activeTab === "dieuchuyen" && <DieuChuyen viTien={viTien} onComplete={handleTransferComplete} />}
          {activeTab === "nguontien" && <NguonTien />}
          {activeTab === "ngansach" && <NganSach />}
          {activeTab === "khoanno" && <KhoanNo />}
          {activeTab === "giaodich" && <GiaoDich />}
        </div>

        {/* === 3. THANH ĐIỀU HƯỚNG BÊN DƯỚI === */}
        <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-emerald-500/20 px-2 py-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.6)] z-40 rounded-t-3xl">
          <div className="flex flex-1 justify-evenly items-center">
            <button onClick={() => setActiveTab("main")} className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'main' ? 'opacity-100 bg-slate-800/80' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'main' ? 'bg-slate-700 shadow-inner' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">👁️</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'main' ? 'text-slate-300' : 'text-slate-400'}`}>Tổng quan</span>
            </button>
            <button onClick={() => setActiveTab("nguontien")} className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'nguontien' ? 'opacity-100 bg-blue-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'nguontien' ? 'bg-blue-500/20 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">🏦</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'nguontien' ? 'text-blue-400' : 'text-slate-400'}`}>Nguồn</span>
            </button>
          </div>
          <div className="relative -top-8 flex-shrink-0 px-2">
            <button onClick={() => setActiveTab("giaodich")} className={`group w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-900 active:scale-90 transition-all duration-300 ${activeTab === 'giaodich' ? 'bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)]' : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]'}`}>
              <span className={`text-4xl font-black leading-none pb-1 transition-transform duration-300 ease-bounce ${activeTab === 'giaodich' ? 'text-slate-800 rotate-45' : 'text-slate-900 group-hover:rotate-90'}`}>
                {activeTab === 'giaodich' ? '×' : '＋'}
              </span>
            </button>
          </div>
          <div className="flex flex-1 justify-evenly items-center">
            <button onClick={() => setActiveTab("ngansach")} className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'ngansach' ? 'opacity-100 bg-amber-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'ngansach' ? 'bg-amber-500/20 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">📋</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'ngansach' ? 'text-amber-400' : 'text-slate-400'}`}>Ng.Sách</span>
            </button>
            <button onClick={() => setActiveTab("khoanno")} className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl active:scale-90 transition-all duration-300 ease-in-out ${activeTab === 'khoanno' ? 'opacity-100 bg-red-500/10' : 'opacity-60 hover:opacity-100 hover:bg-slate-800/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'khoanno' ? 'bg-red-500/20 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800 shadow-inner group-hover:bg-slate-700'}`}>
                <span className="text-sm">📉</span>
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'khoanno' ? 'text-red-400' : 'text-slate-400'}`}>Nợ</span>
            </button>
          </div>
        </div>

        {/* POPUP THÔNG BÁO CHUNG */}
        {popup.show && (
          <div className="absolute inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xs bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-slate-800 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-lg font-black text-emerald-400 mb-2 uppercase tracking-wide">Trạm Thông Báo</h3>
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