"use client";

import { useState, useEffect } from "react";
import { CreatePhieuThuUseCase } from "@/2_use_cases/transactions/CreatePhieuThuUseCase";
import { CreatePhieuChiUseCase } from "@/2_use_cases/transactions/CreatePhieuChiUseCase";
// Thay thế hoàn toàn bằng các UseCase Thống Kê
import { GetThongKeNguonTienUseCase } from "@/2_use_cases/transactions/GetThongKeNguonTienUseCase";
import { GetThongKeNganSachUseCase } from "@/2_use_cases/transactions/GetThongKeNganSachUseCase";
import { GetThongKeKhoanNoUseCase } from "@/2_use_cases/transactions/GetThongKeKhoanNoUseCase";

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
        // Tải Nguồn Tiền từ View Thống Kê
        const ntUseCase = new GetThongKeNguonTienUseCase();
        const ntData = await ntUseCase.execute();
        const finalNtData = [...ntData, { nguon_tien_id: "00000000-0000-0000-0000-000000000000", ten_nguon: "Nguồn khác", sum_loi_nhuan_gop: 0 }];
        setNguonTienList(finalNtData);
        if (finalNtData.length > 0) setNguonTienId(finalNtData[0].nguon_tien_id);

        // Tải Ngân Sách từ View Thống Kê
        const nsUseCase = new GetThongKeNganSachUseCase();
        setNganSachList(await nsUseCase.execute());

        // Tải Khoản Nợ từ View Thống Kê
        const knUseCase = new GetThongKeKhoanNoUseCase();
        setKhoanNoList(await knUseCase.execute());
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Format dùng cho ô input (loại bỏ chữ cái và dấu âm để nhập liệu dễ dàng)
  const handleFormatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format dùng cho nhãn hiển thị (Giữ lại dấu âm cho lợi nhuận, số dư)
  const formatLabelCurrency = (val: number | string) => {
    if (val === null || val === undefined) return "0";
    const num = Number(val);
    const sign = num < 0 ? "-" : "";
    const absStr = Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${sign}${absStr}`;
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
          id_nguon_thu: nguonTienId // Ánh xạ đúng ID từ dropdown
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
                      
                      {/* Nâng cấp hiển thị Lợi nhuận của Kinh Doanh */}
                      {loaiMangChi === "KINH_DOANH" && nguonTienList
                        .filter(nguon => nguon.nguon_tien_id !== "00000000-0000-0000-0000-000000000000") 
                        .map(nguon => (
                        <option key={`NGUON_${nguon.nguon_tien_id}`} value={`NGUON_${nguon.nguon_tien_id}`}>
                          💰 {nguon.ten_nguon} ({formatLabelCurrency(nguon.sum_loi_nhuan_gop)}đ)
                        </option>
                      ))}

                      {/* Nâng cấp hiển thị Số dư còn lại của Ngân sách */}
                      {loaiMangChi === "NGAN_SACH" && nganSachList.map(ns => (
                        <option key={`NS_${ns.ngan_sach_id}`} value={`NS_${ns.ngan_sach_id}`}>
                          📋 {ns.ten_ngan_sach} ({formatLabelCurrency(ns.so_du_con_lai)}đ)
                        </option>
                      ))}

                      {/* Nâng cấp hiển thị Số nợ còn lại của Khoản nợ */}
                      {loaiMangChi === "NO" && khoanNoList.map(kn => (
                        <option key={`NO_${kn.khoan_no_id}`} value={`NO_${kn.khoan_no_id}`}>
                          📉 {kn.ten_khoan_no} ({formatLabelCurrency(kn.so_tien_con_lai)}đ)
                        </option>
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
                    <option key={nguon.nguon_tien_id} value={nguon.nguon_tien_id}>
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