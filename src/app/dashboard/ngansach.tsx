"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { CreateNganSachUseCase } from "@/2_use_cases/transactions/CreateNganSachUseCase";
import { GetThongKeNganSachUseCase } from "@/2_use_cases/transactions/GetThongKeNganSachUseCase";
import { GetChiTietNganSachUseCase } from "@/2_use_cases/transactions/GetChiTietNganSachUseCase";
import { UpdateDinhMucNganSachUseCase } from "@/2_use_cases/transactions/UpdateDinhMucNganSachUseCase";

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

  // Form States
  const [tenNganSach, setTenNganSach] = useState("");
  const [dinhMuc, setDinhMuc] = useState(""); 
  const [thoiGianBatDau, setThoiGianBatDau] = useState(getTodayDateString());
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
  const [thuTuInput, setThuTuInput] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  
  // List & Detail States
  const [danhSachNganSach, setDanhSachNganSach] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chiTietGiaoDich, setChiTietGiaoDich] = useState<Record<string, any[]>>({});
  const [isLoadingChiTiet, setIsLoadingChiTiet] = useState(false);

  // Quick Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [popup, setPopup] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const fetchThongKeNganSach = useCallback(async () => {
    try {
      const useCase = new GetThongKeNganSachUseCase();
      const data = await useCase.execute();
      setDanhSachNganSach(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  }, []);

  useEffect(() => {
    fetchThongKeNganSach();
  }, [fetchThongKeNganSach]);

  useEffect(() => {
    setThuTuInput(danhSachNganSach.length + 1);
  }, [danhSachNganSach]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawDinhMuc = dinhMuc.replace(/,/g, "");
      const finalThuTu = thuTuInput !== "" ? Number(thuTuInput) - 1 : danhSachNganSach.length;
      const rawData = {
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

  // --- Logic Chỉnh sửa nhanh ---
  const handleStartEdit = (e: React.MouseEvent, ns: any) => {
    e.stopPropagation(); // Không cho thẻ xổ xuống khi bấm vào nút sửa
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
    if (editingId) return; // Không cho xổ khi đang trong chế độ sửa
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
    if (direction === 'down' && index === danhSachNganSach.length - 1) return;
    const _danhSach = [...danhSachNganSach];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = _danhSach[index];
    _danhSach[index] = _danhSach[targetIndex];
    _danhSach[targetIndex] = temp;
    setDanhSachNganSach(_danhSach);
    try {
      const updates = _danhSach.map((item, idx) => ({ id: item.ngan_sach_id, thu_tu: idx }));
      await supabase.rpc('cap_nhat_thu_tu_ngan_sach', { p_data: updates });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
      <div className="p-3 bg-slate-800 border-b border-amber-500/30 text-center shadow-md flex-shrink-0">
        <h1 className="text-amber-400 font-black uppercase tracking-widest text-sm">Xưởng Ngân Sách</h1>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto pb-24 flex-1">
        
        {/* KHUNG TẠO MỚI */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 shadow-sm">
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex gap-2 items-center">
              <input type="number" value={thuTuInput} onChange={(e) => setThuTuInput(e.target.value ? Number(e.target.value) : "")} className="w-12 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-center font-black text-slate-400 focus:border-amber-500 transition-all" required min="1" disabled={isLoading} />
              <input type="text" value={tenNganSach} onChange={(e) => setTenNganSach(e.target.value)} placeholder="Tên ngân sách mới..." className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 transition-all" required disabled={isLoading} />
            </div>
            <input type="text" value={dinhMuc} onChange={(e) => setDinhMuc(handleFormatCurrency(e.target.value))} placeholder="Định mức (VNĐ)" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-amber-300 font-black text-right" required disabled={isLoading} />
            <div className="flex gap-2">
              <input type="date" value={thoiGianBatDau} onChange={(e) => setThoiGianBatDau(e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-slate-300" required />
              <input type="date" value={thoiGianKetThuc} min={thoiGianBatDau} onChange={(e) => setThoiGianKetThuc(e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-amber-400 font-bold" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-slate-900 font-black py-2.5 rounded-lg uppercase text-xs tracking-widest active:scale-95 transition-all">{isLoading ? "..." : "＋ Bơm Ngân Sách"}</button>
          </form>
        </div>

        {/* DANH SÁCH */}
        <div className="space-y-2">
          {danhSachNganSach.map((ns, index) => {
            const isExpanded = expandedId === ns.ngan_sach_id;
            const isEditing = editingId === ns.ngan_sach_id;
            const chiTiet = chiTietGiaoDich[ns.ngan_sach_id];

            return (
              <div key={ns.ngan_sach_id} className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-stretch w-full">
                  <div className="flex flex-col items-center justify-center bg-slate-800 border-r border-slate-700/50 w-10 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }} disabled={index === 0} className="flex-1 w-full text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all">▲</button>
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }} disabled={index === danhSachNganSach.length - 1} className="flex-1 w-full text-slate-500 hover:text-orange-400 disabled:opacity-20 transition-all">▼</button>
                  </div>

                  <div onClick={() => handleToggleExpand(ns.ngan_sach_id)} className="flex-1 flex flex-col p-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-600 w-3">{index + 1}.</span>
                        <span className="font-black text-amber-400 text-sm uppercase truncate">{ns.ten_ngan_sach}</span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Hạn: {handleFormatDate(ns.thoi_gian_ket_thuc)}</span>
                    </div>

                    <div className="flex justify-between items-end mt-1.5 pl-5">
                      {/* --- Vùng Sửa Định Mức --- */}
                      <div className="flex flex-col group" onClick={(e) => handleStartEdit(e, ns)}>
                        <span className="text-[9px] text-slate-500 font-bold uppercase group-hover:text-amber-500 transition-colors">Định mức ✎</span>
                        {isEditing ? (
                          <input 
                            autoFocus
                            type="text"
                            value={handleFormatCurrency(editValue)}
                            onChange={(e) => setEditValue(e.target.value.replace(/,/g, ""))}
                            onBlur={() => handleUpdateDinhMuc(ns.ngan_sach_id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateDinhMuc(ns.ngan_sach_id)}
                            className="bg-slate-800 border border-amber-500 rounded px-1 text-xs text-amber-300 font-black w-24 outline-none animate-pulse"
                          />
                        ) : (
                          <span className="text-xs font-medium text-slate-300">{handleFormatCurrency(ns.dinh_muc)}</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Còn lại</span>
                        <span className={`text-base font-black leading-none ${ns.so_du_con_lai < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{handleFormatCurrency(ns.so_du_con_lai)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Vùng Xổ Chi Tiết --- */}
                {isExpanded && (
                  <div className="p-2 border-t border-slate-800 bg-slate-950/80 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase mb-2 text-center tracking-widest border-b border-orange-500/20 pb-1">Lịch sử xuất quỹ</h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {isLoadingChiTiet ? (
                        <p className="text-[10px] text-slate-500 text-center py-2 italic">Đang tải chi tiết...</p>
                      ) : chiTiet?.length === 0 ? (
                        <p className="text-[10px] text-slate-500 text-center py-2 italic">Chưa có giao dịch.</p>
                      ) : (
                        chiTiet?.map(c => (
                          <div key={c.id} className="flex justify-between items-center bg-slate-800/80 px-2 py-1.5 rounded border border-slate-700/50 text-[10px]">
                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                              <span className="font-bold text-slate-300 truncate max-w-[80px]">{c.ly_do_chi}</span>
                              <span className="text-[8px] font-medium text-amber-500/70 truncate shrink-0">👤 {c.nguoi_chi}</span>
                            </div>
                            <span className="text-orange-400 font-black shrink-0">-{handleFormatCurrency(c.so_tien)}</span>
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