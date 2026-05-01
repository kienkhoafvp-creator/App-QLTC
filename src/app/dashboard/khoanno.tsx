"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { CreateKhoanNoUseCase } from "@/2_use_cases/transactions/CreateKhoanNoUseCase";
import { GetNguonTienUseCase } from "@/2_use_cases/transactions/GetNguonTienUseCase";
import { GetThongKeKhoanNoUseCase } from "@/2_use_cases/transactions/GetThongKeKhoanNoUseCase";
import { GetChiTietKhoanNoUseCase } from "@/2_use_cases/transactions/GetChiTietKhoanNoUseCase";
import { DeleteKhoanNoUseCase } from "@/2_use_cases/transactions/DeleteKhoanNoUseCase"; 
import { NguonTien } from "@/1_domain/models/NguonTien";

export default function KhoanNo() {
  const handleFormatCurrency = (value: string | number) => {
    if (value === undefined || value === null) return "0";
    const strVal = value.toString().replace(/\D/g, "");
    return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm mới: Chẻ đôi ngày tháng để xếp 2 dòng
  const parseDateSplit = (dateString: string) => {
    if (!dateString) return { dm: "", y: "" };
    const date = new Date(dateString);
    const dm = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    const y = date.getFullYear().toString();
    return { dm, y };
  };

  const [tenKhoanNo, setTenKhoanNo] = useState("");
  const [tongGocVay, setTongGocVay] = useState(""); 
  const [tongTienPhaiTra, setTongTienPhaiTra] = useState(""); 
  const [idNguonGanNo, setIdNguonGanNo] = useState("NO_TIEU_DUNG"); 
  const [thuTuInput, setThuTuInput] = useState<number | "">(""); 

  const [isLoading, setIsLoading] = useState(false);
  const [nguonTienList, setNguonTienList] = useState<NguonTien[]>([]);

  const [danhSachKhoanNo, setDanhSachKhoanNo] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chiTietGiaoDich, setChiTietGiaoDich] = useState<Record<string, any[]>>({});
  const [isLoadingChiTiet, setIsLoadingChiTiet] = useState(false);

  const [popup, setPopup] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [xoaModalData, setXoaModalData] = useState<{ id: string, ten: string } | null>(null);

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

  const fetchDanhSachNo = useCallback(async () => {
    try {
      const useCase = new GetThongKeKhoanNoUseCase();
      const data = await useCase.execute();
      setDanhSachKhoanNo(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nợ:", error);
    }
  }, []);

  useEffect(() => {
    fetchDanhSachNo();
  }, [fetchDanhSachNo]);

  useEffect(() => {
    setThuTuInput(danhSachKhoanNo.length + 1);
  }, [danhSachKhoanNo]);

  const tongNoHienTai = useMemo(() => {
    return danhSachKhoanNo.reduce((sum, item) => sum + Number(item.so_tien_con_lai), 0);
  }, [danhSachKhoanNo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawGocVay = tongGocVay.replace(/,/g, "");
      const rawTienPhaiTra = tongTienPhaiTra.replace(/,/g, "");

      const parsedGoc = parseFloat(rawGocVay);
      const parsedTra = rawTienPhaiTra ? parseFloat(rawTienPhaiTra) : parsedGoc;
      const finalThuTu = thuTuInput !== "" ? Number(thuTuInput) - 1 : danhSachKhoanNo.length;

      const rawData = {
        ten_khoan_no: tenKhoanNo,
        tong_goc_vay: parsedGoc,
        tong_tien_phai_tra: parsedTra,
        id_nguon_gan_no: idNguonGanNo
      };

      const useCase = new CreateKhoanNoUseCase();
      await useCase.execute(rawData, finalThuTu); 

      setPopup({ show: true, message: "🎉 TING! Đã khai báo thành công Khoản Nợ mới!" });
      
      setTenKhoanNo("");
      setTongGocVay("");
      setTongTienPhaiTra("");
      setIdNguonGanNo("NO_TIEU_DUNG");

      fetchDanhSachNo(); 

    } catch (error: any) {
      setPopup({ show: true, message: `⚠️ Lò rèn gặp sự cố: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = async (idKhoanNo: string) => {
    if (expandedId === idKhoanNo) { setExpandedId(null); return; }
    setExpandedId(idKhoanNo);

    if (!chiTietGiaoDich[idKhoanNo]) {
      setIsLoadingChiTiet(true);
      try {
        const useCase = new GetChiTietKhoanNoUseCase();
        const data = await useCase.execute(idKhoanNo);
        setChiTietGiaoDich(prev => ({ ...prev, [idKhoanNo]: data }));
      } finally { setIsLoadingChiTiet(false); }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === danhSachKhoanNo.length - 1) return;
    const _danhSach = [...danhSachKhoanNo];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = _danhSach[index];
    _danhSach[index] = _danhSach[targetIndex];
    _danhSach[targetIndex] = temp;
    
    setDanhSachKhoanNo(_danhSach);

    try {
      const updates = _danhSach.map((item, idx) => ({ id: item.khoan_no_id, thu_tu: idx }));
      await supabase.rpc('cap_nhat_thu_tu_khoan_no', { p_data: updates });
    } catch (error) { console.error("Lỗi cập nhật thứ tự:", error); }
  };

  const submitXoa = async () => {
    if (!xoaModalData) return;
    setIsLoading(true);
    try {
      const useCase = new DeleteKhoanNoUseCase();
      await useCase.execute(xoaModalData.id);

      setPopup({ show: true, message: "🔥 Đã thiêu rụi khoản nợ thành công!" });
      setXoaModalData(null);
      fetchDanhSachNo(); 
    } catch (error: any) {
      setXoaModalData(null); 
      setPopup({ show: true, message: `⚠️ Cảnh Báo: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* HEADER */}
      <div className="p-3 bg-slate-800 border-b border-red-500/30 text-center shadow-md flex-shrink-0 flex items-center justify-center">
        <h1 className="text-red-400 font-black uppercase tracking-widest text-sm whitespace-nowrap">
          Tổng Nợ ({handleFormatCurrency(tongNoHienTai)}đ)
        </h1>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto pb-24 flex-1">
        
        {/* KHUNG TẠO MỚI */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm">
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tên Khoản Nợ <span className="text-red-500">*</span></label>
              <div className="flex gap-2 items-center">
                <input type="number" value={thuTuInput} onChange={(e) => setThuTuInput(e.target.value ? Number(e.target.value) : "")} className="w-12 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-xs text-center font-black text-slate-400 focus:border-red-500 transition-all focus:scale-105" required min="1" disabled={isLoading} />
                <input 
                  type="text" value={tenKhoanNo} onChange={(e) => setTenKhoanNo(e.target.value)}
                  placeholder="VD: Vay mua xe..." 
                  className="flex-1 w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:border-red-500 focus:scale-[1.02] transition-all origin-left" 
                  required disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tổng Gốc <span className="text-red-500">*</span></label>
                <input 
                  type="text" value={tongGocVay} onChange={(e) => setTongGocVay(handleFormatCurrency(e.target.value))} 
                  placeholder="0" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white font-black focus:border-red-500 focus:scale-[1.02] transition-all text-right" 
                  required disabled={isLoading}
                />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phải Trả</label>
                <input 
                  type="text" value={tongTienPhaiTra} onChange={(e) => setTongTienPhaiTra(handleFormatCurrency(e.target.value))} 
                  placeholder="0 (Nếu = gốc)" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-red-400 font-black focus:border-red-500 focus:scale-[1.02] transition-all text-right" 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nguồn đầu tư</label>
              <select 
                value={idNguonGanNo} onChange={(e) => setIdNguonGanNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:border-red-500 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <option value="NO_TIEU_DUNG">💳 Nợ tiêu dùng</option>
                {nguonTienList.map((nguon) => (
                  <option key={nguon.id} value={nguon.id}>🏦 {nguon.ten_nguon}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-lg uppercase text-xs tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] mt-2">
              {isLoading ? "Đang Khai Báo..." : "＋ Khai Báo Nợ"}
            </button>
          </form>
        </div>

        {/* DANH SÁCH CÁC KHOẢN NỢ */}
        <div className="space-y-2">
          {danhSachKhoanNo.map((kn, index) => {
            const isExpanded = expandedId === kn.khoan_no_id;
            const chiTiet = chiTietGiaoDich[kn.khoan_no_id];
            
            // Xử lý tách ngày tháng
            const { dm, y } = parseDateSplit(kn.ngay_tao);

            return (
              <div key={kn.khoan_no_id} className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden flex flex-col shadow-sm">
                
                <div className="flex items-stretch w-full">
                  {/* Cột 1: Mũi tên (32px) */}
                  <div className="flex flex-col items-center justify-center bg-slate-800 border-r border-slate-700/50 w-8 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }} disabled={index === 0} className="flex-1 w-full text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all text-xs">▲</button>
                    <button onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }} disabled={index === danhSachKhoanNo.length - 1} className="flex-1 w-full text-slate-500 hover:text-orange-400 disabled:opacity-20 transition-all text-xs">▼</button>
                  </div>

                  {/* THÔNG TIN CHÍNH */}
                  <div className="p-2 hover:bg-slate-800/50 transition-colors flex items-center gap-1.5 w-full cursor-pointer overflow-hidden" onClick={() => handleToggleExpand(kn.khoan_no_id)}>
                    
                    {/* Cột 2: Tên (Bị ép nhỏ lại do các cột kia rộng ra, cho phép rớt 2 dòng) */}
                    <div className="flex items-start gap-1 flex-1 min-w-0 pr-1">
                      <span className="text-[10px] font-black text-slate-600 shrink-0 mt-[1px]">{index + 1}.</span>
                      <span className="font-black text-red-400 text-[10px] uppercase line-clamp-2 leading-tight break-words" title={kn.ten_khoan_no}>
                        {kn.ten_khoan_no}
                      </span>
                    </div>
                    
                    {/* Cột 3: Phải trả (Mở rộng thành 68px để chứa số trăm triệu) */}
                    <div className="flex flex-col items-end shrink-0 w-[68px]">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Phải Trả</span>
                      <span className="text-[10px] font-medium text-slate-300 leading-none w-full text-right truncate">{handleFormatCurrency(kn.tong_tien_phai_tra)}</span>
                    </div>

                    {/* Cột 4: Còn lại (Mở rộng thành 75px để ưu tiên số quan trọng nhất) */}
                    <div className="flex flex-col items-end shrink-0 w-[75px] pl-1.5 border-l border-slate-700/50">
                      <span className="text-[8px] text-red-500 font-bold uppercase tracking-tighter">Còn</span>
                      <span className="text-[11px] font-black text-red-400 leading-none w-full text-right truncate">{handleFormatCurrency(kn.so_tien_con_lai)}</span>
                    </div>

                    {/* Cột 5: Ngày (Xếp chồng) + Thùng rác (Tổng ~55px) */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 w-[55px]">
                      <div className="flex flex-col items-center justify-center bg-slate-800 px-1 py-0.5 rounded border border-slate-700">
                        <span className="text-[9px] font-bold text-slate-300 leading-none">{dm}</span>
                        <span className="text-[7px] font-black text-amber-500 leading-none mt-[2px] tracking-wider">{y}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setXoaModalData({ id: kn.khoan_no_id, ten: kn.ten_khoan_no }); }}
                        className="shrink-0 text-slate-500 hover:text-red-500 active:scale-90 transition-all text-xs flex items-center justify-center w-4"
                        title="Xóa khoản nợ"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                </div>

                {/* XỔ XUỐNG: LỊCH SỬ TRẢ NỢ */}
                {isExpanded && (
                  <div className="p-2 border-t border-slate-800 bg-slate-950/80 animate-in slide-in-from-top-2 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-2 text-center tracking-widest border-b border-emerald-500/20 pb-1">Lịch sử trả nợ</h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {isLoadingChiTiet ? (
                        <p className="text-xs text-slate-500 text-center py-2 italic">Đang tải chi tiết...</p>
                      ) : chiTiet?.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2 italic">Chưa có giao dịch trả nợ.</p>
                      ) : (
                        chiTiet?.map(c => (
                          <div key={c.id} className="flex justify-between items-start bg-slate-800/80 px-2 py-2 rounded border border-slate-700/50 text-sm gap-3">
                            <span className="font-medium text-emerald-500/80 shrink-0 whitespace-nowrap pt-0.5 w-14">👤 {c.nguoi_chi}</span>
                            <span className="font-bold text-slate-300 flex-1 whitespace-normal break-words leading-tight pt-0.5">{c.ly_do_chi}</span>
                            <span className="text-emerald-400 font-black shrink-0 pt-0.5">+{handleFormatCurrency(c.so_tien)}</span>
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

      {/* POPUP XÓA KHOẢN NỢ */}
      {xoaModalData && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/50 rounded-2xl p-5 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <h3 className="text-lg font-black text-red-400 mb-1 uppercase tracking-widest text-center">Hủy Bỏ Giao Ước</h3>
            <p className="text-[10px] text-slate-400 text-center mb-5 uppercase tracking-wide">Hành động này không thể hoàn tác</p>

            <div className="text-center mb-6">
              <p className="text-sm text-slate-300">Bạn có chắc chắn muốn thiêu rụi khoản nợ:</p>
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
          <div className="w-full max-w-xs bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            <div className="w-12 h-12 bg-slate-800 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🛠️</span>
            </div>
            <h3 className="text-base font-black text-red-400 mb-2 uppercase tracking-wide">Trạm Thông Báo</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">{popup.message}</p>
            <button onClick={() => setPopup({ show: false, message: "" })} className="w-full bg-red-600 text-white font-bold py-2 rounded-xl text-xs uppercase active:scale-95 transition-all">Đã Rõ</button>
          </div>
        </div>
      )}
    </div>
  );
}