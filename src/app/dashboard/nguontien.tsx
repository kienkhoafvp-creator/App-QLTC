"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { CreateNguonTienUseCase } from "@/2_use_cases/transactions/CreateNguonTienUseCase";
import { GetThongKeNguonTienUseCase } from "@/2_use_cases/transactions/GetThongKeNguonTienUseCase";
import { GetChiTietNguonTienUseCase } from "@/2_use_cases/transactions/GetChiTietNguonTienUseCase";
import { DeleteNguonTienUseCase } from "@/2_use_cases/transactions/DeleteNguonTienUseCase"; // Import UseCase Xóa

export default function NguonTien() {
  const [tenNguon, setTenNguon] = useState("");
  const [thuTuInput, setThuTuInput] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [danhSachNguon, setDanhSachNguon] = useState<any[]>([]);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chiTietGiaoDich, setChiTietGiaoDich] = useState<Record<string, { thu: any[], chi: any[] }>>({});
  const [isLoadingChiTiet, setIsLoadingChiTiet] = useState(false);

  // State Modal Xóa
  const [xoaModalData, setXoaModalData] = useState<{ id: string, ten: string } | null>(null);
  const [popup, setPopup] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleFormatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFormatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const fetchThongKeNguon = useCallback(async () => {
    try {
      const useCase = new GetThongKeNguonTienUseCase();
      const data = await useCase.execute();
      setDanhSachNguon(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê nguồn:", error);
    }
  }, []);

  useEffect(() => {
    fetchThongKeNguon();
  }, [fetchThongKeNguon]);

  useEffect(() => {
    setThuTuInput(danhSachNguon.length + 1);
  }, [danhSachNguon]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const useCase = new CreateNguonTienUseCase();
      const finalThuTu = thuTuInput !== "" ? Number(thuTuInput) - 1 : danhSachNguon.length;
      
      await useCase.execute(tenNguon, finalThuTu);
      
      setTenNguon(""); 
      fetchThongKeNguon();
    } catch (error: any) {
      setPopup({ show: true, message: `⚠️ Lò rèn gặp sự cố: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = async (idNguon: string) => {
    if (expandedId === idNguon) {
      setExpandedId(null);
      return;
    }
    setExpandedId(idNguon);

    if (!chiTietGiaoDich[idNguon]) {
      setIsLoadingChiTiet(true);
      try {
        const useCase = new GetChiTietNguonTienUseCase();
        const data = await useCase.execute(idNguon);
        setChiTietGiaoDich(prev => ({ ...prev, [idNguon]: data }));
      } catch (error: any) {
        setPopup({ show: true, message: `Lỗi tải chi tiết: ${error.message}` });
      } finally {
        setIsLoadingChiTiet(false);
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === danhSachNguon.length - 1) return;

    const _danhSach = [...danhSachNguon];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const temp = _danhSach[index];
    _danhSach[index] = _danhSach[targetIndex];
    _danhSach[targetIndex] = temp;

    setDanhSachNguon(_danhSach);

    try {
      const updates = _danhSach.map((item, idx) => ({
        id: item.nguon_tien_id,
        thu_tu: idx
      }));
      await supabase.rpc('cap_nhat_thu_tu_nguon', { p_data: updates });
    } catch (error) {
      console.error("Lỗi đồng bộ thứ tự:", error);
    }
  };

  // Logic gọi UseCase Xóa
  const submitXoa = async () => {
    if (!xoaModalData) return;
    setIsLoading(true);
    try {
      const useCase = new DeleteNguonTienUseCase();
      await useCase.execute(xoaModalData.id);

      setPopup({ show: true, message: "🔥 Đã thiêu rụi Nguồn Tiền thành công!" });
      setXoaModalData(null);
      fetchThongKeNguon(); 
    } catch (error: any) {
      setXoaModalData(null); 
      setPopup({ show: true, message: `⚠️ Cảnh Báo: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
      <div className="p-3 bg-slate-800 border-b border-blue-500/30 text-center shadow-md flex-shrink-0">
        <h1 className="text-blue-400 font-black uppercase tracking-widest text-sm">Xưởng Nguồn Tiền</h1>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto pb-24 flex-1">
        
        {/* KHUNG TẠO NGUỒN MỚI */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 shadow-sm">
          <form onSubmit={handleSave} className="flex gap-2 items-center">
            <input 
              type="number" value={thuTuInput} onChange={(e) => setThuTuInput(e.target.value ? Number(e.target.value) : "")}
              placeholder="STT" 
              className="w-14 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-center font-black text-slate-400 focus:outline-none focus:border-blue-500 transition-all placeholder:font-normal" 
              required min="1" disabled={isLoading}
            />
            <input 
              type="text" value={tenNguon} onChange={(e) => setTenNguon(e.target.value)}
              placeholder="Nhập tên Nguồn mới..." 
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" 
              required disabled={isLoading}
            />
            <button 
              type="submit" disabled={isLoading}
              className={`w-12 h-[42px] flex-shrink-0 text-white font-black rounded-lg transition-all ${isLoading ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-[0_0_10px_rgba(37,99,235,0.4)]'}`}
            >
              {isLoading ? "..." : "＋"}
            </button>
          </form>
        </div>

        {/* DANH SÁCH NGUỒN TIỀN */}
        <div className="space-y-3">
          {danhSachNguon.length === 0 ? (
             <div className="text-center py-6 opacity-50 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
               <p className="text-xs font-medium">Chưa có nguồn tiền nào.</p>
             </div>
          ) : (
            <div className="space-y-2">
              {danhSachNguon.map((nguon, index) => {
                const isExpanded = expandedId === nguon.nguon_tien_id;
                const chiTiet = chiTietGiaoDich[nguon.nguon_tien_id];

                return (
                  <div key={nguon.nguon_tien_id} className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-sm transition-all overflow-hidden flex flex-col">
                    
                    <div className="flex items-stretch w-full">
                      
                      {/* KHỐI ĐIỀU HƯỚNG */}
                      <div className="flex flex-col items-center justify-center bg-slate-800 border-r border-slate-700/50 w-10 shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }} 
                          disabled={index === 0}
                          className="flex-1 w-full flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-20 transition-all text-xs"
                        >▲</button>
                        <div className="w-6 h-[1px] bg-slate-700"></div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }} 
                          disabled={index === danhSachNguon.length - 1}
                          className="flex-1 w-full flex items-center justify-center text-slate-500 hover:text-orange-400 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-20 transition-all text-xs"
                        >▼</button>
                      </div>

                      {/* NỘI DUNG CHÍNH */}
                      <div 
                        onClick={() => handleToggleExpand(nguon.nguon_tien_id)}
                        className="flex-1 flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800/50 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs font-black text-slate-600 w-4 shrink-0">{index + 1}.</span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-black text-blue-400 text-sm uppercase tracking-tight truncate">{nguon.ten_nguon}</span>
                            <span className="text-[10px] font-bold text-slate-500">{handleFormatDate(nguon.thoi_gian_bat_dau)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex flex-col items-end">
                            <span className={`text-base font-black tracking-tight ${nguon.sum_loi_nhuan_gop >= 0 ? 'text-blue-300' : 'text-red-400'}`}>
                              {nguon.sum_loi_nhuan_gop > 0 ? '+' : ''}{handleFormatCurrency(nguon.sum_loi_nhuan_gop)}
                            </span>
                          </div>
                          
                          {/* NÚT THÙNG RÁC */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setXoaModalData({ id: nguon.nguon_tien_id, ten: nguon.ten_nguon }); }}
                            className="shrink-0 text-slate-500 hover:text-red-500 active:scale-90 transition-all text-xs flex items-center justify-center w-6 h-8 border-l border-slate-700/50 pl-2"
                            title="Xóa nguồn tiền"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* VÙNG CHI TIẾT SỔ XUỐNG */}
                    {isExpanded && (
                      <div className="p-3 border-t border-slate-800 bg-slate-950/50 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-2 border-b border-emerald-500/20 pb-1 text-center">Thu Vào</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {isLoadingChiTiet && !chiTiet ? (
                                <p className="text-[10px] text-slate-500 text-center py-2">Đang tải...</p>
                              ) : chiTiet?.thu.length === 0 ? (
                                <p className="text-[10px] text-slate-500 text-center py-2 italic">Trống</p>
                              ) : (
                                chiTiet?.thu.map(t => (
                                  <div key={t.id} className="bg-slate-800 p-2 rounded-md border border-slate-700 shadow-sm">
                                    <div className="text-emerald-400 font-black text-xs">+{handleFormatCurrency(t.so_tien)}</div>
                                    <div className="text-[10px] text-slate-300 truncate mt-0.5">{t.ly_do_thu}</div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black text-orange-500 uppercase mb-2 border-b border-orange-500/20 pb-1 text-center">Chi Ra</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {isLoadingChiTiet && !chiTiet ? (
                                <p className="text-[10px] text-slate-500 text-center py-2">Đang tải...</p>
                              ) : chiTiet?.chi.length === 0 ? (
                                <p className="text-[10px] text-slate-500 text-center py-2 italic">Trống</p>
                              ) : (
                                chiTiet?.chi.map(c => (
                                  <div key={c.id} className="bg-slate-800 p-2 rounded-md border border-slate-700 shadow-sm">
                                    <div className="text-orange-400 font-black text-xs">-{handleFormatCurrency(c.so_tien)}</div>
                                    <div className="text-[10px] text-slate-300 truncate mt-0.5">{c.ly_do_chi}</div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* POPUP XÓA NGUỒN TIỀN */}
      {xoaModalData && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/50 rounded-2xl p-5 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <h3 className="text-lg font-black text-red-400 mb-1 uppercase tracking-widest text-center">Hủy Bỏ Giao Ước</h3>
            <p className="text-[10px] text-slate-400 text-center mb-5 uppercase tracking-wide">Hành động này không thể hoàn tác</p>

            <div className="text-center mb-6">
              <p className="text-sm text-slate-300">Bạn có chắc chắn muốn thiêu rụi Nguồn Tiền:</p>
              <p className="text-lg font-black text-white mt-1 border border-red-900/50 bg-red-950/30 rounded-lg p-2 mx-4">"{xoaModalData.ten}"?</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setXoaModalData(null)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs uppercase hover:bg-slate-700 transition-all">Quay Lại</button>
              <button type="button" onClick={submitXoa} disabled={isLoading} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">{isLoading ? "Đang xử lý..." : "Xóa Bỏ"}</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP TRẠM THÔNG BÁO */}
      {popup.show && (
        <div className="absolute inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border-2 border-blue-500/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <div className="w-12 h-12 bg-slate-800 border border-blue-500/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🛠️</span>
            </div>
            <h3 className="text-base font-black text-blue-400 mb-2 uppercase tracking-wide">Trạm Thông Báo</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">{popup.message}</p>
            <button 
              onClick={() => setPopup({ show: false, message: "" })} 
              className="w-full bg-blue-500/10 text-blue-400 border border-blue-500 hover:bg-blue-500/20 font-bold py-2 rounded-xl active:scale-95 transition-all text-xs tracking-widest uppercase"
            >
              Đã Rõ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}