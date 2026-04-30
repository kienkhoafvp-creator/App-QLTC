"use client";

import { useState } from "react";
import { RutTienDuPhongUseCase } from "@/2_use_cases/transactions/RutTienDuPhongUseCase";

interface RutDuPhongProps {
  quyDuPhong: number;
  onComplete: (message: string, isError?: boolean) => void;
}

export default function RutDuPhong({ quyDuPhong, onComplete }: RutDuPhongProps) {
  const [transferAmount, setTransferAmount] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [nguoiThucHien, setNguoiThucHien] = useState("");
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
      
      if (rawAmount > quyDuPhong) {
        onComplete("⚠️ Quỹ Dự Phòng không đủ để rút số lượng này!", true);
        setIsTransferring(false);
        return;
      }

      const useCase = new RutTienDuPhongUseCase();
      await useCase.execute(rawAmount, lyDo, nguoiThucHien);
      
      onComplete("🎉 Đã xuất Quỹ thành công, tiền đã cộng trực tiếp vào Ví!", false);
      
      // Reset form
      setTransferAmount(""); 
      setLyDo("");
      setNguoiThucHien("");
    } catch (error: any) {
      onComplete(`Lỗi: ${error.message}`, true);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-amber-500/30 text-center shadow-md">
        <h1 className="text-amber-400 font-black uppercase tracking-widest">Rút Quỹ Dự Phòng</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Số Tiền Rút (Tối đa: <span className="text-amber-400">{handleFormatInput(quyDuPhong.toString())}</span>) <span className="text-amber-500">*</span>
              </label>
              <input 
                type="text" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(handleFormatInput(e.target.value))}
                placeholder="Nhập số lượng..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-lg font-black text-amber-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:scale-[1.02] transition-all text-right cursor-text" 
                required 
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lý Do Rút Quỹ <span className="text-amber-500">*</span></label>
              <input 
                type="text" 
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="Ví dụ: Rút mua sắm khẩn cấp..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all cursor-text" 
                required
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người Rút <span className="text-amber-500">*</span></label>
              <input 
                type="text" 
                value={nguoiThucHien}
                onChange={(e) => setNguoiThucHien(e.target.value)}
                placeholder="Tên nhân sự hoặc chính bạn..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all cursor-text" 
                required
                disabled={isTransferring}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isTransferring}
                className={`w-full text-slate-900 font-black py-4 rounded-xl transition-all uppercase tracking-widest ${isTransferring ? 'bg-amber-800 text-amber-400' : 'bg-amber-500 hover:bg-amber-400 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`}
              >
                {isTransferring ? "Đang Xử Lý..." : "💰 Rút Quỹ Về Ví Tiền"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}