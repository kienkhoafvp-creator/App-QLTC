"use client";

import { useState, useEffect } from "react";
import { CreateKhoanNoUseCase } from "@/2_use_cases/transactions/CreateKhoanNoUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";
import { NguonTien } from "@/1_domain/models/NguonTien";

export default function KhoanNo() {
  const handleFormatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [tenKhoanNo, setTenKhoanNo] = useState("");
  const [tongGocVay, setTongGocVay] = useState(""); 
  const [tongTienPhaiTra, setTongTienPhaiTra] = useState(""); // Đổi tên biến
  const [idNguonGanNo, setIdNguonGanNo] = useState("NO_TIEU_DUNG"); 

  const [isLoading, setIsLoading] = useState(false);
  const [nguonTienList, setNguonTienList] = useState<NguonTien[]>([]);

  useEffect(() => {
    const fetchNguonTien = async () => {
      try {
        const useCase = new GetNguonTienUseCase();
        const data = await useCase.execute();
        setNguonTienList(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nguồn tiền:", error);
      }
    };
    fetchNguonTien();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawGocVay = tongGocVay.replace(/,/g, "");
      const rawTienPhaiTra = tongTienPhaiTra.replace(/,/g, "");

      const parsedGoc = parseFloat(rawGocVay);
      // Xử lý thông minh: Nếu để trống Tổng tiền phải trả, tự động gán bằng Tiền gốc
      const parsedTra = rawTienPhaiTra ? parseFloat(rawTienPhaiTra) : parsedGoc;

      const rawData = {
        ten_khoan_no: tenKhoanNo,
        tong_goc_vay: parsedGoc,
        tong_tien_phai_tra: parsedTra,
        id_nguon_gan_no: idNguonGanNo
      };

      const useCase = new CreateKhoanNoUseCase();
      await useCase.execute(rawData);

      alert("🎉 TING! Đã khai báo thành công Khoản Nợ mới!");
      
      setTenKhoanNo("");
      setTongGocVay("");
      setTongTienPhaiTra("");
      setIdNguonGanNo("NO_TIEU_DUNG");

    } catch (error: any) {
      alert(`⚠️ Lò rèn gặp sự cố: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-red-500/30 text-center shadow-md">
        <h1 className="text-red-400 font-black uppercase tracking-widest">Khai Báo Nợ</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên Khoản Nợ <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={tenKhoanNo}
                onChange={(e) => setTenKhoanNo(e.target.value)}
                placeholder="VD: Vay mua xe..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:scale-[1.02] transition-all" 
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Gốc Vay (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={tongGocVay}
                onChange={(e) => setTongGocVay(handleFormatCurrency(e.target.value))} 
                placeholder="0" 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white font-mono focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:scale-[1.02] transition-all text-right cursor-text" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Tiền Phải Trả (VNĐ)</label>
              <input 
                type="text" 
                value={tongTienPhaiTra}
                onChange={(e) => setTongTienPhaiTra(handleFormatCurrency(e.target.value))} 
                placeholder="0 (Nếu vay không lãi thì để trống)" 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white font-mono focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:scale-[1.02] transition-all text-right cursor-text" 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nguồn đầu tư</label>
              <select 
                value={idNguonGanNo}
                onChange={(e) => setIdNguonGanNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:scale-[1.02] transition-all cursor-pointer"
                disabled={isLoading}
              >
                <option value="NO_TIEU_DUNG">💳 Nợ tiêu dùng</option>
                {nguonTienList.map((nguon) => (
                  <option key={nguon.id} value={nguon.id}>
                    🏦 {nguon.ten_nguon}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-black py-3.5 rounded-xl transition-all uppercase tracking-widest ${isLoading ? 'bg-red-800 text-slate-400' : 'bg-red-600 hover:bg-red-500 active:scale-95'}`}
              >
                {isLoading ? "Đang Khai Báo..." : "Khai Báo Nợ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}