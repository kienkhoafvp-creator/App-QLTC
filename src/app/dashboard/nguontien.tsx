"use client";

import { useState } from "react";
import { CreateNguonTienUseCase } from "@/2_use_cases/transactions/CreateNguonTienUseCase";

export default function NguonTien() {
  const [tenNguon, setTenNguon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const useCase = new CreateNguonTienUseCase();
      await useCase.execute(tenNguon);
      
      alert("🎉 TING! Đã rèn thành công Nguồn Tiền mới!");
      setTenNguon(""); 

    } catch (error: any) {
      alert(`⚠️ Lò rèn gặp sự cố: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-blue-500/30 text-center shadow-md">
        <h1 className="text-blue-400 font-black uppercase tracking-widest">Xưởng Nguồn Tiền</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên Nguồn Tiền <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={tenNguon}
                onChange={(e) => setTenNguon(e.target.value)}
                placeholder="VD: Tiền mặt, Techcombank..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:scale-[1.02] transition-all" 
                required 
                disabled={isLoading}
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-black py-3.5 rounded-xl transition-all uppercase tracking-widest ${isLoading ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'}`}
              >
                {isLoading ? "Đang Rèn..." : "Xác Nhận Rèn"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}