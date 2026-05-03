"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

interface ChiTietPhanBo {
  tai_khoan: string;
  so_tien: number;
}

interface KiemToanRecord {
  id: string;
  tuan_thu: number;
  nam: number;
  ngay_kiem_toan: string;
  tong_tien_thuc_te: number;
  chenh_lech: number;
  chi_tiet_phan_bo: ChiTietPhanBo[];
}

interface LichSuProps {
  onOpenBCTC: (tuan: number, nam: number) => void;
}

const PAGE_SIZE = 52; // Định mức 1 năm dữ liệu mỗi lần tải

export default function LichSuKiemToan({ onOpenBCTC }: LichSuProps) {
  const [lichSu, setLichSu] = useState<KiemToanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const handleFormatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} - ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Hàm tải dữ liệu có hỗ trợ phân trang (Range)
  const fetchLichSu = useCallback(async (currentPage: number, isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMore(true);
    else setIsLoading(true);

    try {
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('kiem_toan_tc_tuan')
        .select('*')
        .order('ngay_kiem_toan', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (isLoadMore) {
          setLichSu(prev => [...prev, ...data]);
        } else {
          setLichSu(data);
        }

        // Nếu số lượng trả về ít hơn giới hạn, nghĩa là đã hết dữ liệu
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchLichSu(0);
  }, [fetchLichSu]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLichSu(nextPage, true);
  };

  if (isLoading) return <div className="text-center text-[10px] text-slate-500 py-4 italic tracking-widest uppercase">Đang truy xuất kho...</div>;

  return (
    <div className="space-y-3 pb-6">
      <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] text-center mb-1">
        ─── Lưu Trữ Kiểm Toán ───
      </h3>
      
      {lichSu.map((record) => {
        const isExpanded = expandedId === record.id;
        
        return (
          <div key={record.id} className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
            
            {/* HEADER */}
            <div className="px-2 py-2 flex justify-between items-center border-b border-slate-700/30 bg-slate-800/40">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onOpenBCTC(record.tuan_thu, record.nam)}
                  className="text-cyan-400 text-[9px] font-black px-1.5 py-0.5 rounded hover:bg-cyan-500/10 transition-all flex items-center gap-1 border border-cyan-500/30"
                >
                  📊 BCTC
                </button>
                <span className="text-cyan-300 font-black text-[13px] uppercase tracking-tight">
                  Tuần {record.tuan_thu} <span className="text-slate-500 font-normal">/</span> {record.nam}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-200 italic">
                  {formatDate(record.ngay_kiem_toan)}
                </span>
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded transition-all flex items-center gap-1 uppercase ${
                    isExpanded ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  Chi tiết {isExpanded ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="p-1.5">
              <div className="px-3 py-2.5 flex justify-between items-center bg-black/40 rounded-lg border border-slate-700/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Thực tế:</span>
                  <span className="text-[14px] font-black text-white">
                    {handleFormatCurrency(record.tong_tien_thuc_te)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Lệch:</span>
                  <span className={`text-[14px] font-black ${record.chenh_lech === 0 ? 'text-emerald-400' : record.chenh_lech > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {record.chenh_lech > 0 ? '+' : ''}{handleFormatCurrency(record.chenh_lech)}
                  </span>
                </div>
              </div>
            </div>

            {/* CHI TIẾT SỔ XUỐNG */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-slate-800/50 bg-black/10 animate-in fade-in duration-200">
                <div className="space-y-1">
                  {record.chi_tiet_phan_bo.map((acc, index) => (
                    <div key={index} className="flex justify-between items-center text-[10px] py-1 border-b border-slate-800/30 last:border-0">
                      <span className="text-slate-400 font-medium">{acc.tai_khoan}</span>
                      <span className="text-cyan-500/90 font-bold">{handleFormatCurrency(acc.so_tien)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* NÚT XEM THÊM */}
      {hasMore && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
          >
            {isFetchingMore ? "Đang tải thêm..." : "⏬ Xem thêm 52 tuần cũ hơn"}
          </button>
        </div>
      )}

      {!hasMore && lichSu.length > 0 && (
        <p className="text-center text-[8px] text-slate-600 uppercase tracking-widest pt-4">
          ─── Bạn đã xem hết lịch sử kiểm toán ───
        </p>
      )}
    </div>
  );
}