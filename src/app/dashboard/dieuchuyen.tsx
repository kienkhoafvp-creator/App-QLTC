"use client";

import { useState } from "react";
import { DieuChuyenTienUseCase } from "@/2_use_cases/transactions/DieuChuyenTienUseCase";

interface DieuChuyenProps {
  viTien: number;
  onComplete: (message: string, isError?: boolean) => void;
}

export default function DieuChuyen({ viTien, onComplete }: DieuChuyenProps) {
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTarget, setTransferTarget] = useState("DU_PHONG");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleFormatInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    try {
      const rawAmount = parseFloat(transferAmount.replace(/,/g, ""));
      
      if (rawAmount > viTien) {
        onComplete("⚠️ Số lượng tài nguyên trong Ví không đủ để điều chuyển!", true);
        setIsTransferring(false);
        return;
      }

      const useCase = new DieuChuyenTienUseCase();
      await useCase.execute(rawAmount, transferTarget);
      
      onComplete("🎉 Dịch chuyển tài nguyên thành công!", false);
      setTransferAmount(""); // Reset lại form sau khi chuyển thành công
    } catch (error: any) {
      onComplete(`Lỗi: ${error.message}`, true);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-emerald-500/30 text-center shadow-md">
        <h1 className="text-emerald-400 font-black uppercase tracking-widest">Trạm Điều Chuyển</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleTransferSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Từ: Ví Tiền (Tối đa: <span className="text-emerald-400">{handleFormatInput(viTien.toString())}</span>) <span className="text-emerald-500">*</span>
              </label>
              <input 
                type="text" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(handleFormatInput(e.target.value))}
                placeholder="Nhập số lượng..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl font-black text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:scale-[1.02] transition-all text-right" 
                required 
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đến Quỹ <span className="text-emerald-500">*</span></label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTransferTarget("DU_PHONG")}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${transferTarget === 'DU_PHONG' ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}
                >
                  🛡️ DỰ PHÒNG
                </button>
                <button
                  type="button"
                  onClick={() => setTransferTarget("DAU_TU")}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${transferTarget === 'DAU_TU' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}
                >
                  🚀 ĐẦU TƯ
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isTransferring}
                className={`w-full text-slate-900 font-black py-4 rounded-xl transition-all uppercase tracking-widest ${isTransferring ? 'bg-emerald-800 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
              >
                {isTransferring ? "Đang Khởi Chạy..." : "Xác Nhận Chuyển"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}