"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { KiemToanBCTCUseCase } from "@/2_use_cases/transactions/KiemToanBCTCUseCase";
import { UndoKiemToanUseCase } from "@/2_use_cases/transactions/UndoKiemToanUseCase";
import LichSuKiemToan from "./lichsukiemtoan";

interface BCTCProps {
  viTien: number;
  quyDuPhong: number; 
  quyDauTu: number;   
  onComplete: (message: string, isError?: boolean) => void;
}

interface AccountRow {
  id: string;
  name: string;
  amount: string;
}

export default function BaoCaoTaiChinh({ viTien, quyDuPhong, quyDauTu, onComplete }: BCTCProps) {
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // FIX: Thêm key để kích hoạt load lại component lịch sử
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormatCurrency = (value: string | number) => {
    if (!value) return "0";
    const strVal = value.toString().replace(/\D/g, "");
    return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const loadPreviousAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('kiem_toan_tc_tuan')
          .select('chi_tiet_phan_bo')
          .order('ngay_kiem_toan', { ascending: false })
          .limit(1)
          .single();

        if (data && data.chi_tiet_phan_bo && data.chi_tiet_phan_bo.length > 0) {
          const loadedAccounts = data.chi_tiet_phan_bo.map((acc: any, index: number) => ({
            id: Date.now().toString() + index,
            name: acc.tai_khoan,
            amount: "" 
          }));
          setAccounts(loadedAccounts);
        } else {
          setAccounts([{ id: Date.now().toString(), name: "Tiền mặt", amount: "" }]);
        }
      } catch (error) {
        setAccounts([{ id: Date.now().toString(), name: "Tiền mặt", amount: "" }]);
      }
    };
    loadPreviousAccounts();
  }, [refreshKey]); // Load lại khung tài khoản khi có refresh

  const handleAddAccount = () => {
    setAccounts([...accounts, { id: Date.now().toString(), name: "", amount: "" }]);
  };

  const handleUpdateAccount = (id: string, field: 'name' | 'amount', value: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, [field]: field === 'amount' ? handleFormatCurrency(value) : value };
      }
      return acc;
    }));
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const tongHeThong = viTien + quyDuPhong + quyDauTu;

  const tongThucTe = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + (Number(acc.amount.replace(/,/g, "")) || 0), 0);
  }, [accounts]);

  const doLech = tongThucTe - tongHeThong;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const hasEmptyName = accounts.some(acc => !acc.name.trim());
    if (hasEmptyName) {
      onComplete("⚠️ Vui lòng nhập đầy đủ tên các tài khoản!", true);
      setIsSubmitting(false);
      return;
    }

    try {
      const useCase = new KiemToanBCTCUseCase();
      await useCase.execute({
        tongHeThong,
        tongThucTe,
        chenhLech: doLech,
        chiTiet: accounts
      });
      
      // FIX: Tăng key để danh sách lịch sử bên dưới tự động fetch lại
      setRefreshKey(prev => prev + 1);
      
      onComplete("🎉 Đã lưu Báo Cáo Kiểm Toán! Số dư đã cân bằng.", false);
    } catch (error: any) {
      onComplete(`⚠️ Lỗi: ${error.message}`, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = async () => {
    if (!window.confirm("⚠️ QUAY XE: Bạn có chắc chắn muốn HỦY đợt Khớp sổ gần nhất? Tiền điều chỉnh sẽ bị thu hồi và xóa sạch dấu vết.")) return;

    setIsUndoing(true);
    try {
      const useCase = new UndoKiemToanUseCase();
      await useCase.execute();
      
      // FIX: Tăng key để cập nhật lại danh sách sau khi Undo
      setRefreshKey(prev => prev + 1);
      
      onComplete("⏪ Đã QUAY XE thành công! Số dư và sổ sách đã hoàn nguyên.", false);
    } catch (error: any) {
      onComplete(`⚠️ Lỗi Undo: ${error.message}`, true);
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 space-y-4 overflow-y-auto pb-28">
        
        {/* === KHỐI KIỂM TOÁN === */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700/80 transition-colors flex justify-between items-center"
          >
            <div className="flex flex-col items-start min-w-0 pr-2">
              <h2 className="text-cyan-400 font-black uppercase tracking-widest text-sm flex items-center gap-2 flex-wrap">
                ⚖️ KIỂM TOÁN <span className="text-slate-500">-</span> <span className="text-white">{handleFormatCurrency(tongHeThong)}đ</span>
              </h2>
            </div>
            <div className={`w-8 h-8 shrink-0 rounded-full bg-slate-900 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <span className="text-cyan-500 text-xs">▼</span>
            </div>
          </button>

          {isExpanded && (
            <div className="p-4 border-t border-slate-700 animate-in slide-in-from-top-2 duration-200 bg-slate-800/30">
              <form id="kiemtoan-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Tiền Thực Tế</h3>
                  <button type="button" onClick={handleAddAccount} className="text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 font-bold px-2 py-1 rounded transition-colors shadow-sm">
                    ＋ Thêm tài khoản
                  </button>
                </div>

                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="flex gap-2 items-center group">
                      <input 
                        type="text" 
                        value={acc.name} 
                        onChange={(e) => handleUpdateAccount(acc.id, 'name', e.target.value)} 
                        placeholder="Tên TK (VD: VCB)" 
                        className="flex-1 min-w-0 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-xs text-white focus:border-cyan-500 transition-all" 
                        required
                        disabled={isSubmitting || isUndoing}
                      />
                      <input 
                        type="text" 
                        value={acc.amount} 
                        onChange={(e) => handleUpdateAccount(acc.id, 'amount', e.target.value)} 
                        placeholder="0" 
                        className="flex-1 min-w-0 bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-sm text-cyan-300 font-black focus:border-cyan-500 transition-all text-right" 
                        required
                        disabled={isSubmitting || isUndoing}
                      />
                      <button type="button" onClick={() => handleRemoveAccount(acc.id)} disabled={isSubmitting || isUndoing} className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 active:scale-90 transition-all shrink-0">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </form>

              <div className="mt-5 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-inner space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tổng Thực Tế:</span>
                  <span className="text-lg font-black text-cyan-400">{handleFormatCurrency(tongThucTe)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Độ Lệch:</span>
                  <span className={`text-lg font-black ${doLech === 0 ? 'text-emerald-400' : doLech > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {doLech > 0 ? '+' : ''}{handleFormatCurrency(doLech)}
                  </span>
                </div>
                <div className="pt-2">
                  {doLech !== 0 && (
                    <p className="text-[10px] text-center text-slate-500 italic mb-3">
                      {doLech > 0 ? 'Hệ thống sẽ tự động tạo Phiếu Thu điều chỉnh (Tiền dôi dư)' : 'Hệ thống sẽ tự động tạo Phiếu Chi điều chỉnh (Hao hụt)'}
                    </p>
                  )}
                  <button 
                    type="submit" 
                    form="kiemtoan-form"
                    disabled={isSubmitting || isUndoing}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-lg uppercase tracking-widest active:scale-95 transition-all shadow-md text-xs"
                  >
                    {isSubmitting ? "Đang Khớp Sổ..." : "✔ XÁC NHẬN KHỚP SỔ"}
                  </button>
                  <button 
                    type="button"
                    onClick={handleUndo}
                    disabled={isSubmitting || isUndoing}
                    className="w-full mt-3 bg-transparent border border-slate-600 hover:border-red-500 hover:text-red-400 text-slate-500 font-bold py-2 rounded-lg text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                  >
                    {isUndoing ? "Đang Hủy..." : "⏪ HỦY KHỚP SỔ GẦN NHẤT"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KHU VỰC HIỂN THỊ LỊCH SỬ KIỂM TOÁN */}
        <div className="pt-6 pb-2">
          {/* FIX: Truyền key để React biết cần re-mount component này khi dữ liệu thay đổi */}
          <LichSuKiemToan 
            key={refreshKey} 
            onOpenBCTC={(tuan, nam) => {
              console.log(`Chuyển hướng mở Báo cáo tài chính Tuần ${tuan} Năm ${nam}`);
              onComplete(`Đang mở BCTC Tuần ${tuan} - ${nam}... (Tính năng đang xây dựng)`, false);
            }} 
          />
        </div>

      </div>
    </div>
  );
}