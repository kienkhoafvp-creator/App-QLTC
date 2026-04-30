"use client";

import { useState, useEffect } from "react";
import { CreatePhieuThuUseCase } from "@/2_use_cases/transactions/CreatePhieuThuUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";
import { NguonTien } from "@/1_domain/models/NguonTien";

// Đã loại bỏ onBack vì chúng ta dùng thanh menu bên dưới để điều hướng
export default function GiaoDich() {
  const [activeTab, setActiveTab] = useState<"thu" | "chi">("thu");
  
  // States cho Phiếu Thu
  const [soTien, setSoTien] = useState("");
  const [nguonThuId, setNguonThuId] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [nguoiThu, setNguoiThu] = useState("");
  const [thoiGian, setThoiGian] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [nguonTienList, setNguonTienList] = useState<NguonTien[]>([]);

  useEffect(() => {
    const fetchNguonTien = async () => {
      try {
        const useCase = new GetNguonTienUseCase();
        const data = await useCase.execute();
        setNguonTienList(data);
        if (data.length > 0) setNguonThuId(data[0].id!);
      } catch (error) {
        console.error("Lỗi tải nguồn tiền:", error);
      }
    };
    fetchNguonTien();
  }, []);

  const handleSaveThu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawData = {
        so_tien: parseFloat(soTien),
        ly_do_thu: lyDo,
        nguoi_thu: nguoiThu,
        thoi_gian: new Date(thoiGian).toISOString(),
        id_nguon_thu: nguonThuId
      };

      const useCase = new CreatePhieuThuUseCase();
      await useCase.execute(rawData);

      alert("🎉 TING! Đã ghi nhận Phiếu Thu thành công!");
      setSoTien("");
      setLyDo("");
      setNguoiThu("");
      
    } catch (error: any) {
      alert(`⚠️ Lò rèn gặp sự cố: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Đã thay đổi class ở đây để đồng bộ với các trang khác (bỏ absolute inset-0)
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* HEADER ĐỒNG BỘ */}
      <div className="p-4 bg-slate-800 border-b border-emerald-500/30 text-center shadow-md flex-shrink-0">
        <h1 className="text-emerald-400 font-black uppercase tracking-widest">Khu Vực Giao Dịch</h1>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-5">
        
        {/* TAB CHUYỂN ĐỔI THU / CHI */}
        <div className="flex bg-slate-800 rounded-xl p-1 shadow-inner border border-slate-700">
          <button 
            onClick={() => {
              setActiveTab("chi");
              alert("Tính năng Phiếu Chi đang được thợ rèn nâng cấp.");
              setActiveTab("thu");
            }}
            className="flex-1 py-2 text-sm font-bold rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
          >
            Phiếu Chi
          </button>
          <button 
            onClick={() => setActiveTab("thu")}
            className="flex-1 py-2 text-sm font-bold rounded-lg bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
          >
            Phiếu Thu
          </button>
        </div>

        {/* FORM PHIẾU THU */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)] pb-8">
          <form onSubmit={handleSaveThu} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số Tiền (VNĐ) <span className="text-emerald-500">*</span></label>
              <input 
                type="number" 
                value={soTien}
                onChange={(e) => setSoTien(e.target.value)}
                placeholder="0" 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl font-black text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all text-right cursor-text" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nguồn Thu Tiền <span className="text-emerald-500">*</span></label>
              <select 
                value={nguonThuId}
                onChange={(e) => setNguonThuId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                required
                disabled={isLoading}
              >
                {nguonTienList.map((nguon) => (
                  <option key={nguon.id} value={nguon.id}>🏦 {nguon.ten_nguon}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lý Do Thu</label>
              <input 
                type="text" 
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="Nhập nội dung thu..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-text" 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người Thu Tiền</label>
              <input 
                type="text" 
                value={nguoiThu}
                onChange={(e) => setNguoiThu(e.target.value)}
                placeholder="Tên người nhận tiền..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-text" 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời Gian Thu</label>
              <input 
                type="datetime-local" 
                value={thoiGian}
                onChange={(e) => setThoiGian(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker()}
                onFocus={(e) => e.currentTarget.showPicker()}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer" 
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-slate-900 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest ${isLoading ? 'bg-emerald-700/50 text-slate-400' : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95'}`}
              >
                {isLoading ? "Đang Xử Lý..." : "Ghi Nhận Thu"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}