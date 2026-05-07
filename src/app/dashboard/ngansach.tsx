"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { CreateNganSachUseCase } from "@/2_use_cases/transactions/CreateNganSachUseCase";
import { GetThongKeNganSachUseCase } from "@/2_use_cases/transactions/GetThongKeNganSachUseCase";
import { GetChiTietNganSachUseCase } from "@/2_use_cases/transactions/GetChiTietNganSachUseCase";
import { UpdateDinhMucNganSachUseCase } from "@/2_use_cases/transactions/UpdateDinhMucNganSachUseCase";
import { ResetNganSachUseCase } from "@/2_use_cases/transactions/ResetNganSachUseCase";
import { DeleteNganSachUseCase } from "@/2_use_cases/transactions/DeleteNganSachUseCase";

// Thêm thư viện hiệu ứng và Component Biểu đồ
import { AnimatePresence } from "framer-motion";
import ChartNganSach from "@/4_infrastructure/ui/components/cards/ChartNganSach";

export default function NganSach() {
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return (new Date(today.getTime() - offset)).toISOString().split('T')[0];
  };

  const handleFormatCurrency = (value: string | number) => {
    if (value === undefined || value === null) return "0";
    const strVal = value.toString().replace(/\D/g, "");
    return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFormatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const kiemTraHetHan = (ngayKetThuc: string) => {
    if (!ngayKetThuc) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(ngayKetThuc);
    end.setHours(0, 0, 0, 0);
    return today >= end;
  };

  const [tenNganSach, setTenNganSach] = useState("");
  const [dinhMuc, setDinhMuc] = useState(""); 
  const [thoiGianBatDau, setThoiGianBatDau] = useState(getTodayDateString());
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
  const [thuTuInput, setThuTuInput] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [danhSachNganSachToanBo, setDanhSachNganSachToanBo] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chiTietGiaoDich, setChiTietGiaoDich] = useState<Record<string, any[]>>({});
  const [isLoadingChiTiet, setIsLoadingChiTiet] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [resetModalData, setResetModalData] = useState<any | null>(null);
  const [xoaModalData, setXoaModalData] = useState<{ id: string, ten: string } | null>(null);
  const [popup, setPopup] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  // State quản lý hiển thị Biểu đồ
  const [showChart, setShowChart] = useState(false);

  const fetchThongKeNganSach = useCallback(async () => {
    try {
      const useCase = new GetThongKeNganSachUseCase();
      const data = await useCase.execute();
      setDanhSachNganSachToanBo(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  }, []);

  useEffect(() => {
    fetchThongKeNganSach();
  }, [fetchThongKeNganSach]);

  const danhSachNganSachActive = useMemo(() => {
    return danhSachNganSachToanBo.filter(ns => ns.trang_thai_xac_thuc !== true);
  }, [danhSachNganSachToanBo]);

  useEffect(() => {
    setThuTuInput(danhSachNganSachActive.length + 1);
  }, [danhSachNganSachActive]);

  const nganSachThang = useMemo(() => {
    let tongNganSachNgay = 0;
    danhSachNganSachActive.forEach(ns => {
      if (ns.thoi_gian_bat_dau && ns.thoi_gian_ket_thuc && ns.dinh_muc) {
        const start = new Date(ns.thoi_gian_bat_dau);
        const end = new Date(ns.thoi_gian_ket_thuc);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 0) {
          tongNganSachNgay += Number(ns.dinh_muc) / diffDays;
        }
      }
    });
    return Math.round(tongNganSachNgay * 30);
  }, [danhSachNganSachActive]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawDinhMuc = dinhMuc.replace(/,/g, "");
      const finalThuTu = thuTuInput !== "" ? Number(thuTuInput) - 1 : danhSachNganSachActive.length;
      const rawData = {
        ten_nguon_chi: tenNganSach,
        ten_ngan_sach: tenNganSach,
        dinh_muc: parseFloat(rawDinhMuc), 
        thoi_gian_bat_dau: thoiGianBatDau,
        thoi_gian_ket_thuc: thoiGianKetThuc
      };
      const useCase = new CreateNganSachUseCase();
      await useCase.execute(rawData, finalThuTu);
      setPopup({ show: true, message: "🎉 Đã rèn thành công Ngân Sách mới!" });
      setTenNganSach(""); setDinhMuc(""); setThoiGianKetThuc("");
      fetchThongKeNganSach();
    } catch (error: any) {
      setPopup({ show: true, message: `⚠️ Lỗi: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (e: React.MouseEvent, ns: any) => {
    e.stopPropagation(); 
    setEditingId(ns.ngan_sach_id);
    setEditValue(ns.dinh_muc.toString());
  };

  const handleUpdateDinhMuc = async (id: string) => {
    if (!editingId) return;
    try {
      const cleanVal = editValue.replace(/,/g, "");
      const useCase = new UpdateDinhMucNganSachUseCase();
      await useCase.execute(id, parseFloat(cleanVal));
      setEditingId(null);
      fetchThongKeNganSach();
    } catch (error: any) {
      setPopup({ show: true, message: error.message });
    }
  };

  const handleToggleExpand = async (idNganSach: string) => {
    if (editingId) return; 
    if (expandedId === idNganSach) { setExpandedId(null); return; }
    setExpandedId(idNganSach);

    if (!chiTietGiaoDich[idNganSach]) {
      setIsLoadingChiTiet(true);
      try {
        const useCase = new GetChiTietNganSachUseCase();
        const data = await useCase.execute(idNganSach);
        setChiTietGiaoDich(prev => ({ ...prev, [idNganSach]: data }));
      } finally { setIsLoadingChiTiet(false); }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === danhSachNganSachActive.length - 1) return;
    
    const _danhSach = [...danhSachNganSachActive];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const itemA = _danhSach[index];
    const itemB = _danhSach[targetIndex];

    _danhSach[index] = itemB;
    _danhSach[targetIndex] = itemA;
    
    setDanhSachNganSachToanBo(prevList => {
      const newList = [...prevList];
      const idxA = newList.findIndex(item => item.ngan_sach_id === itemA.ngan_sach_id);
      const idxB = newList.findIndex(item => item.ngan_sach_id === itemB.ngan_sach_id);
      
      if(idxA !== -1 && idxB !== -1) {
        newList[idxA] = itemB;
        newList[idxB] = itemA;
      }
      return newList;
    });

    try {
      const updates = _danhSach.map((item, idx) => ({ id: item.ngan_sach_id, thu_tu: idx }));
      await supabase.rpc('cap_nhat_thu_tu_ngan_sach', { p_data: updates });
    } catch (error) { 
      console.error(error); 
      fetchThongKeNganSach();
    }
  };

  const handleMocReset = (e: React.MouseEvent, ns: any) => {
    e.stopPropagation();
    if (kiemTraHetHan(ns.thoi_gian_ket_thuc)) {
      setResetModalData({
        idCu: ns.ngan_sach_id,
        ten_ngan_sach: ns.ten_ngan_sach,
        dinh_muc: ns.dinh_muc.toString(),
        thoi_gian_bat_dau: getTodayDateString(),
        thoi_gian_ket_thuc: "",
        thu_tu: ns.thu_tu 
      });
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalData) return;
    setIsLoading(true);
    try {
      const useCase = new ResetNganSachUseCase();
      const rawDinhMuc = resetModalData.dinh_muc.replace(/,/g, "");
      
      await useCase.execute(
        resetModalData.idCu,
        {
          ten_ngan_sach: resetModalData.ten_ngan_sach,
          dinh_muc: parseFloat(rawDinhMuc),
          thoi_gian_bat_dau: resetModalData.thoi_gian_bat_dau,
          thoi_gian_ket_thuc: resetModalData.thoi_gian_ket_thuc
        },
        resetModalData.thu_tu
      );

      setPopup({ show: true, message: "⚡ Đã tái sinh Ngân Sách thành công!" });
      setResetModalData(null);
      fetchThongKeNganSach();
    } catch (error: any) {
      setPopup({ show: true, message: `⚠️ Lỗi: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const submitXoa = async () => {
    if (!xoaModalData) return;
    setIsLoading(true);
    try {
      const useCase = new DeleteNganSachUseCase();
      await useCase.execute(xoaModalData.id);

      setPopup({ show: true, message: "🔥 Đã thiêu rụi Ngân Sách thành công!" });
      setXoaModalData(null);
      fetchThongKeNganSach(); 
    } catch (error: any) {
      setXoaModalData(null); 
      setPopup({ show: true, message: `⚠️ Cảnh Báo: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* HEADER CẬP NHẬT: THÊM NÚT BIỂU ĐỒ */}
      <div className="relative p-3 bg-slate-800 border-b border-amber-500/30 shadow-md flex-shrink-0 flex items-center justify-center">
        <h1 className="text-amber-400 font-black uppercase tracking-widest text-sm whitespace-nowrap">
          Ngân Sách Tháng ({handleFormatCurrency(nganSachThang)})
        </h1>

        <button 
          onClick={() => setShowChart(true)}
          className="absolute right-3 bg-slate-900 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-inner"
        >
          <span className="text-sm leading-none">📊</span>
          <span className="hidden sm:inline tracking-widest">BIỂU ĐỒ</span>
        </button>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto pb-24 flex-1">
        {/* KHUNG TẠO MỚI */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 shadow-sm">
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex gap-2 items-center">
              <input type="number" value={thuTuInput} onChange={(e) => setThuTuInput(e.target.value ? Number(e.target.value) : "")} className="w-12 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-center font-black text-slate-400 focus:border-amber-500 transition-all focus:scale-105" required min="1" disabled={isLoading} />
              <input type="text" value={tenNganSach} onChange={(e) => setTenNganSach(e.target.value)} placeholder="Tên ngân sách mới..." className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 transition-all focus:scale-105 origin-left" required disabled={isLoading} />
            </div>
            <input type="text" value={dinhMuc} onChange={(e) => setDinhMuc(handleFormatCurrency(e.target.value))} placeholder="Định mức (VNĐ)" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-amber-300 font-black text-right focus:border-amber-500 transition-all focus:scale-105" required disabled={isLoading} />
            <div className="flex gap-2">
              <input type="date" value={thoiGianBatDau} onChange={(e) => setThoiGianBatDau(e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-slate-300 focus:scale-105 transition-transform" required />
              <input type="date" value={thoiGianKetThuc} min={thoiGianBatDau} onChange={(e) => setThoiGianKetThuc(e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-amber-400 font-bold focus:scale-105 transition-transform" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-slate-900 font-black py-2.5 rounded-lg uppercase text-xs tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">{isLoading ? "..." : "＋ Bơm Ngân Sách"}</button>
          </form>
        </div>

        {/* DANH SÁCH */}
        <div className="space-y-2">
          {danhSachNganSachActive.map((ns, index) => {
            const isExpanded = expandedId === ns.ngan_sach_id;
            const isEditing = editingId === ns.ngan_sach_id;
            const chiTiet = chiTietGiaoDich[ns.ngan_sach_id];
            const isExpired = kiemTraHetHan(ns.thoi_gian_ket_thuc);

            return (
              <div key={ns.ngan_sach_id} className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="flex items-stretch w-full">
                  <div className="flex flex-col items-center justify-center bg-slate-800 border-r border-slate-700/50 w-10 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }} disabled={index === 0} className="flex-1 w-full text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all text-xs">▲</button>
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }} disabled={index === danhSachNganSachActive.length - 1} className="flex-1 w-full text-slate-500 hover:text-orange-400 disabled:opacity-20 transition-all text-xs">▼</button>
                  </div>

                  <div onClick={() => handleToggleExpand(ns.ngan_sach_id)} className="flex-1 flex flex-col p-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div 
                        className={`flex items-center gap-2 ${isExpired ? "cursor-pointer group" : ""}`}
                        onClick={(e) => isExpired && handleMocReset(e, ns)}
                      >
                        <span className="text-xs font-black text-slate-600 w-3">{index + 1}.</span>
                        {isExpired ? (
                          <span className="font-black text-red-400 text-sm uppercase truncate group-hover:text-red-300 animate-pulse transition-colors" title="Bấm để thiết lập lại chu kỳ mới">
                            ⚠️ {ns.ten_ngan_sach}
                          </span>
                        ) : (
                          <span className="font-black text-amber-400 text-sm uppercase truncate">{ns.ten_ngan_sach}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${isExpired ? 'text-red-400 bg-red-950/30 border-red-900/50' : 'text-amber-500 bg-slate-800 border-slate-700'}`}>
                          Hạn: {handleFormatDate(ns.thoi_gian_ket_thuc)}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setXoaModalData({ id: ns.ngan_sach_id, ten: ns.ten_ngan_sach }); }}
                          className="shrink-0 text-slate-500 hover:text-red-500 active:scale-90 transition-all text-xs"
                          title="Xóa ngân sách"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pl-5">
                      <div className="flex items-center gap-1.5 group" onClick={(e) => handleStartEdit(e, ns)}>
                        <span className="text-xs text-slate-500 group-hover:text-amber-500 transition-colors">✎</span>
                        <span className="text-xs text-slate-300 font-black uppercase">Định mức:</span>
                        {isEditing ? (
                          <input 
                            autoFocus
                            type="text"
                            value={handleFormatCurrency(editValue)}
                            onChange={(e) => setEditValue(e.target.value.replace(/,/g, ""))}
                            onBlur={() => handleUpdateDinhMuc(ns.ngan_sach_id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateDinhMuc(ns.ngan_sach_id)}
                            className="bg-slate-800 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-amber-300 font-black w-24 outline-none animate-pulse"
                          />
                        ) : (
                          <span className="text-xs font-black text-slate-200">{handleFormatCurrency(ns.dinh_muc)}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-300 font-black uppercase">Còn lại:</span>
                        <span className={`text-sm font-black leading-none ${ns.so_du_con_lai < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {handleFormatCurrency(ns.so_du_con_lai)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-2 border-t border-slate-800 bg-slate-950/80 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase mb-2 text-center tracking-widest border-b border-orange-500/20 pb-1">Lịch sử xuất quỹ</h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {isLoadingChiTiet ? (
                        <p className="text-xs text-slate-500 text-center py-2 italic">Đang tải chi tiết...</p>
                      ) : chiTiet?.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2 italic">Chưa có giao dịch.</p>
                      ) : (
                        chiTiet?.map(c => (
                          <div key={c.id} className="flex justify-between items-start bg-slate-800/80 px-2 py-2 rounded border border-slate-700/50 text-sm gap-3">
                            <span className="font-medium text-amber-500/80 shrink-0 whitespace-nowrap pt-0.5 w-14">👤 {c.nguoi_chi}</span>
                            <span className="font-bold text-slate-300 flex-1 whitespace-normal break-words leading-tight pt-0.5">{c.ly_do_chi}</span>
                            <span className="text-orange-400 font-black shrink-0 pt-0.5">-{handleFormatCurrency(c.so_tien)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HIỂN THỊ POPUP BIỂU ĐỒ */}
      <AnimatePresence>
        {showChart && <ChartNganSach onClose={() => setShowChart(false)} />}
      </AnimatePresence>

      {/* POPUP RESET NGÂN SÁCH */}
      {resetModalData && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            <h3 className="text-lg font-black text-cyan-400 mb-1 uppercase tracking-widest text-center">Tái Sinh Ngân Sách</h3>
            <p className="text-[10px] text-slate-400 text-center mb-5 uppercase tracking-wide">Chu kỳ mới - Dữ liệu cũ được lưu lịch sử</p>
            <form onSubmit={submitReset} className="space-y-4">
              <div>
                <label className="text-[10px] text-cyan-500 font-bold uppercase ml-1">Tên Ngân Sách (Đã Khóa)</label>
                <input type="text" value={resetModalData.ten_ngan_sach} disabled className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-500 font-bold mt-1 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] text-cyan-500 font-bold uppercase ml-1">Định Mức Mới (VNĐ)</label>
                <input type="text" value={handleFormatCurrency(resetModalData.dinh_muc)} onChange={(e) => setResetModalData({...resetModalData, dinh_muc: e.target.value})} className="w-full bg-slate-900 border border-cyan-700 rounded-lg p-2.5 text-lg text-cyan-300 font-black text-right focus:border-cyan-400 transition-all mt-1" required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-cyan-500 font-bold uppercase ml-1">Bắt Đầu</label>
                  <input type="date" value={resetModalData.thoi_gian_bat_dau} onChange={(e) => setResetModalData({...resetModalData, thoi_gian_bat_dau: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-slate-300 mt-1" required />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-cyan-500 font-bold uppercase ml-1">Kết Thúc</label>
                  <input type="date" value={resetModalData.thoi_gian_ket_thuc} min={resetModalData.thoi_gian_bat_dau} onChange={(e) => setResetModalData({...resetModalData, thoi_gian_ket_thuc: e.target.value})} className="w-full bg-slate-900 border border-cyan-600 rounded-lg p-2 text-xs text-cyan-400 font-bold mt-1 shadow-[0_0_10px_rgba(6,182,212,0.1)]" required />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setResetModalData(null)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs uppercase hover:bg-slate-700 transition-all">Hủy</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">{isLoading ? "Đang chạy..." : "Xác Nhận"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP XÓA NGÂN SÁCH */}
      {xoaModalData && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/50 rounded-2xl p-5 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <h3 className="text-lg font-black text-red-400 mb-1 uppercase tracking-widest text-center">Hủy Bỏ Giao Ước</h3>
            <p className="text-[10px] text-slate-400 text-center mb-5 uppercase tracking-wide">Hành động này không thể hoàn tác</p>
            <div className="text-center mb-6">
              <p className="text-sm text-slate-300">Bạn có chắc chắn muốn thiêu rụi ngân sách:</p>
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
          <div className="w-full max-w-xs bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <div className="w-12 h-12 bg-slate-800 border border-amber-500/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🛠️</span>
            </div>
            <h3 className="text-base font-black text-amber-400 mb-2 uppercase tracking-wide">Trạm Thông Báo</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">{popup.message}</p>
            <button onClick={() => setPopup({ show: false, message: "" })} className="w-full bg-amber-500 text-slate-900 font-bold py-2 rounded-xl text-xs uppercase active:scale-95 transition-all">Đã Rõ</button>
          </div>
        </div>
      )}
    </div>
  );
}