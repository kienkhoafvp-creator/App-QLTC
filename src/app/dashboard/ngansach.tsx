"use client";

import { useState } from "react";
import { CreateNganSachUseCase } from "@/2_use_cases/transactions/CreateNganSachUseCase";

export default function NganSach() {
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today.getTime() - offset)).toISOString().split('T')[0];
    return localISOTime;
  };

  // Hàm xử lý định dạng tiền tệ (Thêm dấu phẩy)
  const handleFormatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [tenNganSach, setTenNganSach] = useState("");
  const [dinhMuc, setDinhMuc] = useState(""); // Giữ dưới dạng chuỗi
  const [thoiGianBatDau, setThoiGianBatDau] = useState(getTodayDateString());
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Làm sạch chuỗi: Loại bỏ dấu phẩy trước khi đẩy xuống Tầng 2
      const rawDinhMuc = dinhMuc.replace(/,/g, "");

      const rawData = {
        ten_ngan_sach: tenNganSach,
        dinh_muc: parseFloat(rawDinhMuc), // Parse chuỗi đã làm sạch thành số
        thoi_gian_bat_dau: thoiGianBatDau,
        thoi_gian_ket_thuc: thoiGianKetThuc
      };

      const useCase = new CreateNganSachUseCase();
      await useCase.execute(rawData);

      alert("🎉 TING! Đã thiết lập thành công Ngân Sách chu kỳ mới!");
      
      setTenNganSach("");
      setDinhMuc("");
      setThoiGianBatDau(getTodayDateString());
      setThoiGianKetThuc("");

    } catch (error: any) {
      alert(`⚠️ Lò rèn gặp sự cố: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-amber-500/30 text-center shadow-md">
        <h1 className="text-amber-400 font-black uppercase tracking-widest">Thiết Lập Ngân Sách</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên Ngân Sách <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={tenNganSach}
                onChange={(e) => setTenNganSach(e.target.value)}
                placeholder="VD: Quỹ Vận hành Tháng 5..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:scale-[1.02] transition-all cursor-text" 
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Định Mức (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="text" // Chuyển sang text
                value={dinhMuc}
                onChange={(e) => setDinhMuc(handleFormatCurrency(e.target.value))} // Áp dụng Formatter
                placeholder="0" 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:scale-[1.02] transition-all cursor-text text-right" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3">
              <div className="space-y-2 flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Từ Ngày <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={thoiGianBatDau}
                  onChange={(e) => setThoiGianBatDau(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  onFocus={(e) => e.currentTarget.showPicker()}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:scale-[1.02] transition-all cursor-pointer" 
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đến Ngày <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={thoiGianKetThuc}
                  min={thoiGianBatDau} 
                  onChange={(e) => setThoiGianKetThuc(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  onFocus={(e) => e.currentTarget.showPicker()}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:scale-[1.02] transition-all cursor-pointer" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-slate-900 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest ${isLoading ? 'bg-amber-700/50 text-slate-400' : 'bg-amber-500 hover:bg-amber-400 active:scale-95'}`}
              >
                {isLoading ? "Đang Thiết Lập..." : "Tạo ngân sách"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}