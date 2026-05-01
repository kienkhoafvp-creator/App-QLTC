"use client";

import { useState, useEffect, useCallback } from "react";
import { GetLichSuThuUseCase } from "@/2_use_cases/transactions/GetLichSuThuUseCase";
import { GetLichSuChiUseCase } from "@/2_use_cases/transactions/GetLichSuChiUseCase";
import { DeletePhieuThuUseCase } from "@/2_use_cases/transactions/DeletePhieuThuUseCase";
import { DeletePhieuChiUseCase } from "@/2_use_cases/transactions/DeletePhieuChiUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";
import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";
import { KhoanNoRepo } from "@/3_adapters/repositories/KhoanNoRepo";

import { PhieuThu } from "@/1_domain/models/PhieuThu";
import { PhieuChi } from "@/1_domain/models/PhieuChi";

export default function LichSuThuChi() {
  const [activeTab, setActiveTab] = useState<"thu" | "chi">("thu");
  const [isLoading, setIsLoading] = useState(false);

  // State Modal Xóa
  const [xoaModalData, setXoaModalData] = useState<{ id: string, loai: "thu" | "chi", thongTin: string } | null>(null);

  // Bộ lọc chung
  const [limit, setLimit] = useState<number | null>(30);
  
  // Bộ lọc Thu
  const [nguonFilter, setNguonFilter] = useState<string>("");

  // Bộ lọc Chi (2 cấp)
  const [loaiChiFilter, setLoaiChiFilter] = useState<string>(""); 
  const [chiTietFilter, setChiTietFilter] = useState<string>(""); 

  // Dữ liệu Giao dịch
  const [lichSuThu, setLichSuThu] = useState<PhieuThu[]>([]);
  const [lichSuChi, setLichSuChi] = useState<PhieuChi[]>([]);

  // Dữ liệu Danh mục để map Tên
  const [nguonTienList, setNguonTienList] = useState<any[]>([]);
  const [nganSachList, setNganSachList] = useState<any[]>([]);
  const [khoanNoList, setKhoanNoList] = useState<any[]>([]);

  useEffect(() => {
    const fetchDanhMuc = async () => {
      try {
        const ntUseCase = new GetNguonTienUseCase();
        setNguonTienList(await ntUseCase.execute());

        const nsRepo = new NganSachRepo();
        setNganSachList(await nsRepo.layDanhSachNganSach());

        const knRepo = new KhoanNoRepo();
        setKhoanNoList(await knRepo.layDanhSachKhoanNo());
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchDanhMuc();
  }, []);

  const fetchLichSuThu = useCallback(async () => {
    setIsLoading(true);
    try {
      const useCase = new GetLichSuThuUseCase();
      const data = await useCase.execute(limit, nguonFilter);
      setLichSuThu(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử thu:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, nguonFilter]);

  const fetchLichSuChi = useCallback(async () => {
    setIsLoading(true);
    try {
      const useCase = new GetLichSuChiUseCase();
      const data = await useCase.execute(limit, loaiChiFilter, chiTietFilter);
      setLichSuChi(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử chi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, loaiChiFilter, chiTietFilter]);

  useEffect(() => {
    if (activeTab === "thu") fetchLichSuThu();
    else fetchLichSuChi();
  }, [activeTab, fetchLichSuThu, fetchLichSuChi]);

  // Hành động Xóa Giao Dịch
  const submitXoaGiaoDich = async () => {
    if (!xoaModalData) return;
    setIsLoading(true);
    try {
      if (xoaModalData.loai === "thu") {
        const useCase = new DeletePhieuThuUseCase();
        await useCase.execute(xoaModalData.id);
        fetchLichSuThu();
      } else {
        const useCase = new DeletePhieuChiUseCase();
        await useCase.execute(xoaModalData.id);
        fetchLichSuChi();
      }
      setXoaModalData(null);
    } catch (error: any) {
      alert(`Lỗi khi xóa: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Format Helpers
  const handleFormatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFormatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { 
      hour: '2-digit', minute: '2-digit', 
      day: '2-digit', month: '2-digit', year: '2-digit' 
    });
  };

  // Hàm Dịch Tên
  const getTenNguon = (idNguon: string | null | undefined) => {
    if (!idNguon) return null;
    const nguon = nguonTienList.find(n => n.id === idNguon); 
    if(nguon) return nguon.ten_nguon;
    const nguon2 = nguonTienList.find(n => n.nguon_tien_id === idNguon);
    return nguon2 ? nguon2.ten_nguon : "Nguồn khác";
  };

  const getTenNganSach = (idNganSach: string | null | undefined) => {
    if (!idNganSach) return null;
    const ns = nganSachList.find(n => n.id === idNganSach);
    if(ns) return ns.ten_ngan_sach;
    const ns2 = nganSachList.find(n => n.ngan_sach_id === idNganSach);
    return ns2 ? ns2.ten_ngan_sach : "Không rõ";
  };

  const getTenKhoanNo = (idKhoanNo: string | null | undefined) => {
    if (!idKhoanNo) return null;
    const foundKn = khoanNoList.find(k => k.id === idKhoanNo);
    if(foundKn) return foundKn.ten_khoan_no;
    const foundKn2 = khoanNoList.find(k => k.khoan_no_id === idKhoanNo);
    return foundKn2 ? foundKn2.ten_khoan_no : "Không rõ";
  };

  // Phóng to badge hiển thị chi để cân xứng
  const renderBadgeChi = (chi: PhieuChi) => {
    if (chi.id_nguon_thu) {
      return (
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 truncate max-w-[140px]">
          💼 KD: {getTenNguon(chi.id_nguon_thu)}
        </span>
      );
    }
    if (chi.id_ngan_sach) {
      return (
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 truncate max-w-[140px]">
          📋 NS: {getTenNganSach(chi.id_ngan_sach)}
        </span>
      );
    }
    if (chi.id_khoan_no) {
      return (
        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 truncate max-w-[140px]">
          📉 Nợ: {getTenKhoanNo(chi.id_khoan_no)}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* HEADER */}
      <div className="p-4 bg-slate-800 border-b border-indigo-500/30 text-center shadow-md flex-shrink-0">
        <h1 className="text-indigo-400 font-black uppercase tracking-widest text-sm">Lịch Sử Giao Dịch</h1>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-4 pb-24 relative">
        
        {/* THANH TAB */}
        <div className="flex bg-slate-800 rounded-xl p-1 shadow-inner border border-slate-700">
          <button 
            onClick={() => setActiveTab("thu")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'thu' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Lịch Sử Thu
          </button>
          <button 
            onClick={() => setActiveTab("chi")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'chi' ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Lịch Sử Chi
          </button>
        </div>

        {/* BỘ LỌC */}
        <div className="flex gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "thu" ? (
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Lọc theo Nguồn</label>
              <select 
                value={nguonFilter} 
                onChange={(e) => setNguonFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <option value="">Lọc theo: Mới nhất</option>
                {nguonTienList.map((n) => (
                  <option key={n.id || n.nguon_tien_id} value={n.id || n.nguon_tien_id}>🏦 {n.ten_nguon}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
             <div className="flex-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Mảng Chi</label>
               <select 
                value={loaiChiFilter}
                onChange={(e) => {
                  setLoaiChiFilter(e.target.value);
                  setChiTietFilter(""); 
                }}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer" 
                disabled={isLoading}
               >
                 <option value="">Tất cả mảng</option>
                 <option value="KINH_DOANH">💼 Kinh Doanh</option>
                 <option value="NGAN_SACH">📋 Ngân Sách</option>
                 <option value="NO">📉 Trả Nợ</option>
               </select>
             </div>

             {loaiChiFilter !== "" && (
               <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-200">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Chi Tiết</label>
                 <select 
                  value={chiTietFilter}
                  onChange={(e) => setChiTietFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer" 
                  disabled={isLoading}
                 >
                   <option value="">Tất cả chi tiết</option>
                   
                   {loaiChiFilter === "KINH_DOANH" && nguonTienList
                     .filter(nguon => (nguon.id || nguon.nguon_tien_id) !== "00000000-0000-0000-0000-000000000000") 
                     .map(nguon => (
                     <option key={nguon.id || nguon.nguon_tien_id} value={nguon.id || nguon.nguon_tien_id}>
                       💰 {nguon.ten_nguon}
                     </option>
                   ))}

                   {loaiChiFilter === "NGAN_SACH" && nganSachList.map(ns => (
                     <option key={ns.id || ns.ngan_sach_id} value={ns.id || ns.ngan_sach_id}>
                       📋 {ns.ten_ngan_sach}
                     </option>
                   ))}

                   {loaiChiFilter === "NO" && khoanNoList.map(kn => (
                     <option key={kn.id || kn.khoan_no_id} value={kn.id || kn.khoan_no_id}>
                       📉 {kn.ten_khoan_no}
                     </option>
                   ))}
                 </select>
               </div>
             )}
            </>
          )}

          <div className="w-[85px] shrink-0">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block text-center">Hiển thị</label>
            <select 
              value={limit === null ? "ALL" : limit.toString()} 
              onChange={(e) => setLimit(e.target.value === "ALL" ? null : Number(e.target.value))}
              className={`w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-white focus:outline-none transition-all text-center font-bold cursor-pointer ${activeTab === 'thu' ? 'focus:border-emerald-500' : 'focus:border-orange-500'}`}
              disabled={isLoading}
            >
              <option value="30">30 dòng</option>
              <option value="100">100 dòng</option>
              <option value="ALL">Tất cả</option>
            </select>
          </div>
        </div>

        {/* LOADING OVERLAY */}
        {isLoading && !xoaModalData && (
          <div className="absolute inset-0 z-10 bg-slate-950/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl top-36">
            <span className={`font-bold text-xs animate-pulse ${activeTab === 'thu' ? 'text-emerald-500' : 'text-orange-500'}`}>Đang rà soát sổ sách...</span>
          </div>
        )}

        {/* NỘI DUNG LỊCH SỬ THU */}
        {activeTab === "thu" && (
          <div className="space-y-2 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            {lichSuThu.length === 0 && !isLoading ? (
              <div className="text-center py-10 opacity-50 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <p className="text-xs font-medium text-slate-400">Chưa ghi nhận khoản thu nào.</p>
              </div>
            ) : (
              lichSuThu.map((thu, index) => (
                <div key={thu.id || index} className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-emerald-500/50 transition-colors">
                  
                  {/* HÀNG 1: Số tiền - Nguồn - Thời gian - Nút xóa */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-black text-emerald-400 text-lg shrink-0">+{handleFormatCurrency(thu.so_tien)}</span>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate">
                        🏦 {getTenNguon(thu.id_nguon_thu)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-400">
                        {handleFormatDateTime(thu.thoi_gian)}
                      </span>
                      <button 
                        onClick={() => setXoaModalData({ id: thu.id!, loai: "thu", thongTin: `+${handleFormatCurrency(thu.so_tien)} VNĐ` })}
                        className="text-slate-500 hover:text-red-500 active:scale-90 transition-all text-lg flex items-center justify-center pl-2 border-l border-slate-700/50"
                        title="Xóa giao dịch này"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* HÀNG 2: Người thực hiện - Lý do */}
                  <div className="flex items-start gap-2 pt-2">
                    <span className="text-sm font-bold text-slate-300 shrink-0">
                      👤 {thu.nguoi_thu || "Ẩn danh"}
                    </span>
                    <span className="text-sm text-slate-400 truncate">
                      - {thu.ly_do_thu || <span className="italic opacity-50">Không ghi lý do</span>}
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* NỘI DUNG LỊCH SỬ CHI */}
        {activeTab === "chi" && (
          <div className="space-y-2 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            {lichSuChi.length === 0 && !isLoading ? (
              <div className="text-center py-10 opacity-50 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <p className="text-xs font-medium text-slate-400">Không tìm thấy khoản chi nào khớp bộ lọc.</p>
              </div>
            ) : (
              lichSuChi.map((chi, index) => (
                <div key={chi.id || index} className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-orange-500/50 transition-colors">
                  
                  {/* HÀNG 1: Số tiền - Nguồn - Thời gian - Nút xóa */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-black text-orange-400 text-lg shrink-0">-{handleFormatCurrency(chi.so_tien)}</span>
                      {renderBadgeChi(chi)}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-400">
                        {handleFormatDateTime(chi.thoi_gian)}
                      </span>
                      <button 
                        onClick={() => setXoaModalData({ id: chi.id!, loai: "chi", thongTin: `-${handleFormatCurrency(chi.so_tien)} VNĐ` })}
                        className="text-slate-500 hover:text-red-500 active:scale-90 transition-all text-lg flex items-center justify-center pl-2 border-l border-slate-700/50"
                        title="Xóa giao dịch này"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* HÀNG 2: Người thực hiện - Lý do */}
                  <div className="flex items-start gap-2 pt-2">
                    <span className="text-sm font-bold text-slate-300 shrink-0">
                      👤 {chi.nguoi_chi || "Ẩn danh"}
                    </span>
                    <span className="text-sm text-slate-400 truncate">
                      - {chi.ly_do_chi || <span className="italic opacity-50">Không ghi lý do</span>}
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* POPUP XÁC NHẬN XÓA (MODAL CẢNH BÁO GAMEFI) */}
      {xoaModalData && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/50 rounded-2xl p-5 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <h3 className="text-lg font-black text-red-400 mb-1 uppercase tracking-widest text-center">Xóa Giao Dịch</h3>
            <p className="text-[10px] text-slate-400 text-center mb-5 uppercase tracking-wide">Hành động này không thể hoàn tác</p>

            <div className="text-center mb-6">
              <p className="text-sm text-slate-300">Bạn có chắc chắn muốn hủy phiếu {xoaModalData.loai === 'thu' ? 'thu' : 'chi'} trị giá:</p>
              <p className={`text-xl font-black mt-2 border rounded-lg p-3 mx-4 ${xoaModalData.loai === 'thu' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' : 'text-orange-400 border-orange-900/50 bg-orange-950/30'}`}>
                {xoaModalData.thongTin}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setXoaModalData(null)} 
                className="flex-1 bg-slate-800 text-slate-400 font-bold py-3 rounded-xl text-xs uppercase hover:bg-slate-700 transition-all"
                disabled={isLoading}
              >
                Quay Lại
              </button>
              <button 
                type="button" 
                onClick={submitXoaGiaoDich} 
                disabled={isLoading} 
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                {isLoading ? "Đang xử lý..." : "Xóa Bỏ"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}