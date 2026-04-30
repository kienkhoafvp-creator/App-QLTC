"use client";

import { useState, useEffect } from "react";
import { GiaoDichDauTuUseCase } from "@/2_use_cases/transactions/GiaoDichDauTuUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";

interface GiaoDichDauTuProps {
  quyDauTu: number;
  onComplete: (message: string, isError?: boolean) => void;
}

export default function GiaoDichDauTu({ quyDauTu, onComplete }: GiaoDichDauTuProps) {
  const [transferAmount, setTransferAmount] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [nguoiThucHien, setNguoiThucHien] = useState("");
  
  const [idNguonThu, setIdNguonThu] = useState("");
  const [nguonTienList, setNguonTienList] = useState<any[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    const fetchNguonTien = async () => {
      try {
        const ntUseCase = new GetNguonTienUseCase();
        const ntData = await ntUseCase.execute();
        setNguonTienList(ntData);
        if (ntData.length > 0) setIdNguonThu(ntData[0].id!);
      } catch (error) {
        console.error("Lỗi tải nguồn tiền:", error);
      }
    };
    fetchNguonTien();
  }, []);

  const handleFormatInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    try {
      const rawAmount = parseFloat(transferAmount.replace(/,/g, ""));
      
      if (rawAmount > quyDauTu) {
        onComplete("⚠️ Quỹ Đầu Tư không đủ vốn để giải ngân!", true);
        setIsTransferring(false);
        return;
      }

      const useCase = new GiaoDichDauTuUseCase();
      await useCase.execute(rawAmount, lyDo, nguoiThucHien, idNguonThu);
      
      onComplete("🚀 Đã giải ngân Đầu Tư vào Nguồn Thu thành công!", false);
      
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
      <div className="p-4 bg-slate-800 border-b border-blue-500/30 text-center shadow-md">
        <h1 className="text-blue-400 font-black uppercase tracking-widest">Trung Tâm Đầu Tư</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Vốn Giải Ngân (Tối đa: <span className="text-blue-400">{handleFormatInput(quyDauTu.toString())}</span>) <span className="text-blue-500">*</span>
              </label>
              <input 
                type="text" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(handleFormatInput(e.target.value))}
                placeholder="Nhập số vốn..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-lg font-black text-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:scale-[1.02] transition-all text-right cursor-text" 
                required 
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lý Do / Hạng Mục Đầu Tư <span className="text-blue-500">*</span></label>
              <input 
                type="text" 
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="Ví dụ: Chạy Ads, Mua nguyên liệu..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-text" 
                required
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người Thực Hiện <span className="text-blue-500">*</span></label>
              <input 
                type="text" 
                value={nguoiThucHien}
                onChange={(e) => setNguoiThucHien(e.target.value)}
                placeholder="Nhân sự phụ trách..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-text" 
                required
                disabled={isTransferring}
              />
            </div>

            <div className="space-y-2 pb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đầu Tư Vào Nguồn Thu <span className="text-blue-500">*</span></label>
              <select 
                value={idNguonThu}
                onChange={(e) => setIdNguonThu(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                required
                disabled={isTransferring || nguonTienList.length === 0} 
              >
                {nguonTienList.map((nguon) => (
                  <option key={nguon.id} value={nguon.id}>
                    🎯 Nguồn: {nguon.ten_nguon}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isTransferring}
                className={`w-full text-slate-900 font-black py-4 rounded-xl transition-all uppercase tracking-widest ${isTransferring ? 'bg-blue-800 text-blue-400' : 'bg-blue-500 hover:bg-blue-400 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
              >
                {isTransferring ? "Đang Xử Lý..." : "🚀 Xác Nhận Đầu Tư"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}