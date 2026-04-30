"use client";

import { useState, useEffect } from "react";
import { CreatePhieuThuUseCase } from "@/2_use_cases/transactions/CreatePhieuThuUseCase";
import { CreatePhieuChiUseCase } from "@/2_use_cases/transactions/CreatePhieuChiUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";
import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";
import { KhoanNoRepo } from "@/3_adapters/repositories/KhoanNoRepo";

export default function GiaoDich() {
  const [activeTab, setActiveTab] = useState<"thu" | "chi">("chi");
  const [isLoading, setIsLoading] = useState(false);

  const [soTien, setSoTien] = useState(""); 
  const [lyDo, setLyDo] = useState("");
  const [nguoiThucHien, setNguoiThucHien] = useState("");
  const [thoiGian, setThoiGian] = useState("");

  const [nguonTienId, setNguonTienId] = useState(""); 
  const [loaiMangChi, setLoaiMangChi] = useState(""); 
  const [mangChiId, setMangChiId] = useState(""); 

  const [nguonTienList, setNguonTienList] = useState<any[]>([]);
  const [nganSachList, setNganSachList] = useState<any[]>([]);
  const [khoanNoList, setKhoanNoList] = useState<any[]>([]);

  useEffect(() => {
    const initTime = () => {
      const offset = new Date().getTimezoneOffset() * 60000;
      setThoiGian((new Date(Date.now() - offset)).toISOString().slice(0, 16));
    };
    initTime();

    const fetchData = async () => {
      try {
        const ntUseCase = new GetNguonTienUseCase();
        const ntData = await ntUseCase.execute();
        const finalNtData = [...ntData, { id: "00000000-0000-0000-0000-000000000000", ten_nguon: "Nguồn khác" }];
        setNguonTienList(finalNtData);
        if (finalNtData.length > 0) setNguonTienId(finalNtData[0].id!);

        const nsRepo = new NganSachRepo();
        setNganSachList(await nsRepo.layDanhSachNganSach());

        const knRepo = new KhoanNoRepo();
        setKhoanNoList(await knRepo.layDanhSachKhoanNo());
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleFormatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const resetForm = () => {
    setSoTien(""); setLyDo(""); setNguoiThucHien(""); 
    setLoaiMangChi(""); setMangChiId(""); 
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawNumber = parseFloat(soTien.replace(/,/g, ""));

      if (activeTab === "thu") {
        const useCase = new CreatePhieuThuUseCase();
        await useCase.execute({
          so_tien: rawNumber,
          ly_do_thu: lyDo,
          nguoi_thu: nguoiThucHien,
          thoi_gian: thoiGian ? new Date(thoiGian).toISOString() : new Date().toISOString(),
          id_nguon_thu: nguonTienId
        });
        alert("Ghi nhận Phiếu Thu thành công.");
      } else {
        const useCase = new CreatePhieuChiUseCase();
        await useCase.execute({
          so_tien: rawNumber,
          ly_do_chi: lyDo,
          nguoi_chi: nguoiThucHien,
          thoi_gian: thoiGian ? new Date(thoiGian).toISOString() : new Date().toISOString(),
          mang_chi_id: mangChiId
        });
        alert("Ghi nhận Phiếu Chi thành công.");
      }
      resetForm();
    } catch (error: any) {
      alert(`Lỗi hệ thống: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-800 border-b border-emerald-500/30 text-center shadow-md flex-shrink-0">
        <h1 className="text-emerald-400 font-black uppercase tracking-widest">Khu Vực Giao Dịch</h1>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-5 pb-8">
        <div className="flex bg-slate-800 rounded-xl p-1 shadow-inner border border-slate-700">
          <button 
            onClick={() => { setActiveTab("chi"); resetForm(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'chi' ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Phiếu Chi
          </button>
          <button 
            onClick={() => { setActiveTab("thu"); resetForm(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'thu' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Phiếu Thu
          </button>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'thu' ? 'text-emerald-500' : 'text-orange-500'}`}>Số Tiền (VNĐ) *</label>
              <input 
                type="text" 
                value={soTien}
                onChange={(e) => setSoTien(handleFormatCurrency(e.target.value))}
                placeholder="0" 
                className={`w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl font-black focus:outline-none focus:ring-2 transition-all text-right cursor-text ${activeTab === 'thu' ? 'text-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/50' : 'text-orange-400 focus:border-orange-500 focus:ring-orange-500/50'}`} 
                required 
                disabled={isLoading}
              />
            </div>

            {activeTab === "chi" && (
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Chi cho mảng *</label>
                  <select 
                    value={loaiMangChi}
                    onChange={(e) => {
                      setLoaiMangChi(e.target.value);
                      setMangChiId(""); 
                    }}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                    disabled={isLoading}
                    required
                  >
                    <option value="">-- Chọn mảng chi --</option>
                    <option value="KINH_DOANH">💼 Chi kinh doanh</option>
                    <option value="NGAN_SACH">📋 Chi ngân sách</option>
                    <option value="NO">📉 Chi trả nợ</option>
                  </select>
                </div>

                {loaiMangChi !== "" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Chi tiết *</label>
                    <select 
                      value={mangChiId}
                      onChange={(e) => setMangChiId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                      disabled={isLoading}
                      required
                    >
                      <option value="">-- Chọn chi tiết --</option>
                      
                      {loaiMangChi === "KINH_DOANH" && nguonTienList
                        .filter(nguon => nguon.id !== "00000000-0000-0000-0000-000000000000") // Lọc bỏ ID giả
                        .map(nguon => (
                        <option key={`NGUON_${nguon.id}`} value={`NGUON_${nguon.id}`}>💰 {nguon.ten_nguon}</option>
                      ))}

                      {loaiMangChi === "NGAN_SACH" && nganSachList.map(ns => (
                        <option key={`NS_${ns.id}`} value={`NS_${ns.id}`}>📋 {ns.ten_ngan_sach}</option>
                      ))}

                      {loaiMangChi === "NO" && khoanNoList.map(kn => (
                        <option key={`NO_${kn.id}`} value={`NO_${kn.id}`}>📉 Trả nợ: {kn.ten_khoan_no}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {activeTab === "thu" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thu tiền vào nguồn *</label>
                <select 
                  value={nguonTienId}
                  onChange={(e) => setNguonTienId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                  required
                  disabled={isLoading} 
                >
                  {nguonTienList.map((nguon) => (
                    <option key={nguon.id} value={nguon.id}>
                      {nguon.ten_nguon === "Nguồn khác" ? "📁 " : "🏦 "}
                      {nguon.ten_nguon}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lý Do {activeTab === 'thu' ? 'Thu' : 'Chi'}</label>
              <input 
                type="text" 
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder={`Nhập nội dung ${activeTab === 'thu' ? 'thu' : 'chi'}...`} 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none transition-all cursor-text" 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người Thực Hiện</label>
              <input 
                type="text" 
                value={nguoiThucHien}
                onChange={(e) => setNguoiThucHien(e.target.value)}
                placeholder="Tên nhân sự..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none transition-all cursor-text" 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời Gian</label>
              <input 
                type="datetime-local" 
                value={thoiGian}
                onChange={(e) => setThoiGian(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker()}
                onFocus={(e) => e.currentTarget.showPicker()}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 text-sm text-white focus:outline-none transition-all cursor-pointer" 
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-slate-900 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest ${
                  isLoading ? 'bg-slate-700 text-slate-400' : 
                  activeTab === 'thu' ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95' : 'bg-orange-500 hover:bg-orange-400 active:scale-95'
                }`}
              >
                {isLoading ? "Đang Xử Lý..." : `Ghi Nhận ${activeTab === 'thu' ? 'Thu' : 'Chi'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}