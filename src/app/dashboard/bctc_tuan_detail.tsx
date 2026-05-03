"use client";

import { useState, useEffect } from "react";
import { GetBCTCTuanUseCase } from "@/2_use_cases/transactions/GetBCTCTuanUseCase";

interface BCTCTuanDetailProps {
  tuan: number;
  nam: number;
  onBack: () => void;
}

export default function BCTCTuanDetail({ tuan, nam, onBack }: BCTCTuanDetailProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedTaiSan, setExpandedTaiSan] = useState<number[]>([]);
  
  // STATE LƯU DỮ LIỆU THẬT
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleTaiSan = (index: number) => {
    setExpandedTaiSan(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // KÉO DỮ LIỆU TỪ SUPABASE KHI MỞ COMPONENT
  useEffect(() => {
    const fetchBCTC = async () => {
      setIsLoading(true);
      try {
        const useCase = new GetBCTCTuanUseCase();
        const result = await useCase.execute(tuan, nam);
        setData(result);
      } catch (error) {
        console.error("Lỗi khi tải BCTC Tuần:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBCTC();
  }, [tuan, nam]);

  const formatVND = (val: number) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  const formatShort = (val: number) => {
    if (!val || val === 0) return "0";
    const absVal = Math.abs(val);
    
    if (absVal >= 1e9) return Number((absVal / 1e9).toFixed(2)).toString().replace('.', ',') + 'tỉ';
    if (absVal >= 1e6) return Number((absVal / 1e6).toFixed(2)).toString().replace('.', ',') + 'tr';
    if (absVal >= 1e3) return Number((absVal / 1e3).toFixed(0)).toString() + 'k';
    return absVal.toString();
  };

  // NẾU ĐANG TẢI, HIỂN THỊ MÀN HÌNH CHỜ TRỐNG TRẢI
  if (isLoading || !data) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950 absolute inset-0 z-50 animate-in slide-in-from-right-4 duration-300">
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-md">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full border border-slate-700 text-slate-300 hover:text-white active:scale-90 transition-all">←</button>
          <div className="text-center">
            <h2 className="text-cyan-400 font-black uppercase tracking-widest text-sm">BÁO CÁO TÀI CHÍNH</h2>
            <p className="text-[10px] text-slate-400">Tuần {tuan} / {nam}</p>
          </div>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Đang rà soát sổ sách...</span>
        </div>
      </div>
    );
  }

  // TÍNH TOÁN TOÁN HỌC TỪ DỮ LIỆU THẬT ĐÃ KÉO VỀ
  const maxScale = Math.max(data.thuNhapRong, data.chiSinhTon + data.apLucNoKD) || 1;
  const pctThuNhap = (data.thuNhapRong / maxScale) * 100;
  const pctSinhTon = (data.chiSinhTon / maxScale) * 100;
  const pctNoKD = (data.apLucNoKD / maxScale) * 100;
  const pctSongSot = data.mucDoSongSot > 0 ? (data.mucDoSongSot / maxScale) * 100 : 0;
  const tongPhanTramThucTe = pctSinhTon + pctNoKD + pctSongSot;

  let trangThaiText = "";
  let trangThaiStyle = "";

  if (data.mucDoSongSot > 1000000) {
    trangThaiText = "Có dư";
    trangThaiStyle = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  } else if (data.mucDoSongSot >= 0) {
    trangThaiText = "Vừa đủ";
    trangThaiStyle = "text-amber-400 bg-amber-500/10 border-amber-500/30";
  } else {
    trangThaiText = "Bị thiếu";
    trangThaiStyle = "text-red-400 bg-red-500/10 border-red-500/30";
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 absolute inset-0 z-50 animate-in slide-in-from-right-4 duration-300">
      
      {/* HEADER */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-md">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full border border-slate-700 text-slate-300 hover:text-white active:scale-90 transition-all">
          ←
        </button>
        <div className="text-center">
          <h2 className="text-cyan-400 font-black uppercase tracking-widest text-sm">BÁO CÁO TÀI CHÍNH</h2>
          <p className="text-[10px] text-slate-400">Tuần {tuan} / {nam}</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-28">
        
        {/* === KHU VỰC 1: BIỂU ĐỒ TRỰC QUAN === */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/80 shadow-lg mt-2 transition-all duration-300">
          <div className="relative w-full pt-5 pb-2">
            <div className="absolute top-0 left-0 h-full border-[1.5px] border-cyan-500/30 rounded-xl bg-cyan-950/20 z-0 transition-all" style={{ width: `${pctThuNhap}%` }}></div>

            <div className="absolute -top-3.5 left-3 bg-slate-900 px-2 h-7 flex items-center gap-1 z-20">
              <span className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest">Thu Nhập</span>
              <span className="text-[12px] font-black text-cyan-400">{formatShort(data.thuNhapRong)}</span>
            </div>

            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 px-2 h-7 flex items-center z-20">
              <span className={`text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full ${trangThaiStyle}`}>
                {trangThaiText}
              </span>
            </div>

            <div className="absolute -top-3.5 right-3 bg-slate-900 px-1 h-7 flex items-center z-20">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] font-bold tracking-widest px-2 py-1 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-all uppercase flex items-center gap-1 active:scale-95"
              >
                Chi tiết {showDetails ? '▲' : '▼'}
              </button>
            </div>

            {data.mucDoSongSot < 0 && (
              <div className="absolute top-0 right-0 h-full bg-red-500/10 border-r border-red-500/50 border-dashed z-0 flex items-end justify-end pb-1 pr-1" style={{ left: `${pctThuNhap}%` }}>
                <span className="text-[9px] font-black text-red-400 uppercase bg-slate-900/80 px-1 rounded">Lạm Chi {formatShort(Math.abs(data.mucDoSongSot))}</span>
              </div>
            )}

            <div className="relative z-10 flex h-10 rounded-lg overflow-hidden border border-slate-800 mt-2 mx-1 transition-all shadow-sm" style={{ width: `calc(${tongPhanTramThucTe}% - 8px)` }}>
              {data.chiSinhTon > 0 && (
                <div className="bg-slate-600 h-full flex items-center justify-center border-r border-slate-700/50 px-1.5 transition-all overflow-hidden" style={{ width: `${(pctSinhTon / tongPhanTramThucTe) * 100}%` }}>
                  <div className="flex items-baseline gap-1 max-w-full truncate">
                    <span className="text-[9px] font-medium text-slate-300 uppercase tracking-tighter truncate">Sinh Tồn:</span>
                    <span className="text-[13px] font-black text-white drop-shadow-md">{formatShort(data.chiSinhTon)}</span>
                  </div>
                </div>
              )}
              {data.apLucNoKD > 0 && (
                <div className="bg-orange-600/90 h-full flex items-center justify-center border-r border-orange-700/50 px-1.5 transition-all overflow-hidden" style={{ width: `${(pctNoKD / tongPhanTramThucTe) * 100}%` }}>
                  <div className="flex items-baseline gap-1 max-w-full truncate">
                    <span className="text-[9px] font-medium text-orange-200 uppercase tracking-tighter truncate">Nợ KD:</span>
                    <span className="text-[13px] font-black text-white drop-shadow-md">{formatShort(data.apLucNoKD)}</span>
                  </div>
                </div>
              )}
              {data.mucDoSongSot > 0 && (
                <div className="bg-emerald-600/90 h-full flex items-center justify-center px-1.5 transition-all overflow-hidden" style={{ width: `${(pctSongSot / tongPhanTramThucTe) * 100}%` }}>
                  <div className="flex items-baseline gap-1 max-w-full truncate">
                    <span className="text-[9px] font-medium text-emerald-200 uppercase tracking-tighter truncate">Bỏ Túi:</span>
                    <span className="text-[13px] font-black text-white drop-shadow-md">+{formatShort(data.mucDoSongSot)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showDetails && (
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 text-xs font-mono tracking-tight mt-6 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex justify-between items-center text-cyan-400 mb-1">
                <span className="uppercase font-sans font-bold text-[10px]">Thu Nhập Ròng:</span>
                <span className="font-black">{formatVND(data.thuNhapRong)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-700/50">
                <span className="uppercase font-sans font-bold text-[10px]">Chi Sinh Tồn:</span>
                <span>- {formatVND(data.chiSinhTon)}</span>
              </div>
              <div className="flex justify-between items-center text-blue-400 py-2">
                <span className="uppercase font-sans font-bold text-[10px]">Dòng Tiền Gộp:</span>
                <span className="font-black">= {formatVND(data.dongTienGop)}</span>
              </div>
              <div className="flex justify-between items-center text-orange-400 pb-2 border-b-2 border-dashed border-slate-700/50">
                <span className="uppercase font-sans font-bold text-[10px]">Nợ Kinh Doanh:</span>
                <span>- {formatVND(data.apLucNoKD)}</span>
              </div>
              <div className={`flex justify-between items-center pt-2 ${data.mucDoSongSot > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className="font-black uppercase text-[11px] font-sans tracking-widest">Tiền Bỏ Túi:</span>
                <span className="font-black text-base">
                  {data.mucDoSongSot > 0 ? '+' : ''}{formatVND(data.mucDoSongSot)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* === KHU VỰC 2: BÁO CÁO TÀI SẢN / ĐẦU TƯ === */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/80 shadow-lg">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-4">
            ── Trạng Thái Đầu Tư (Tài Sản) ──
          </h3>
          
          <div className="space-y-4">
            {data.taiSan.length === 0 && (
              <p className="text-center text-[10px] text-slate-500 italic py-2">Chưa có dữ liệu Tài sản đầu tư</p>
            )}

            {data.taiSan.map((item: any, index: number) => {
              const tongDaThu = item.loiNhuanLuyKe + item.loiNhuanTuan;
              const isProfitable = tongDaThu >= item.tongDauTu;
              const isExpanded = expandedTaiSan.includes(index);

              // TRẠNG THÁI 1: ĐANG HỒI VỐN
              if (!isProfitable) {
                const pctLuyKe = (item.loiNhuanLuyKe / item.tongDauTu) * 100;
                const pctTuan = (item.loiNhuanTuan / item.tongDauTu) * 100;
                const phanTramTong = ((tongDaThu / item.tongDauTu) * 100).toFixed(0);

                return (
                  <div key={index} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-slate-200 max-w-[50%] truncate">{item.ten}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider">
                          Đang hồi vốn
                        </span>
                        <button 
                          onClick={() => toggleTaiSan(index)}
                          className="w-6 h-5 flex justify-center items-center rounded bg-slate-800 border border-slate-600 text-[8px] text-slate-300 hover:text-white active:scale-95"
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full flex h-5 rounded-md overflow-hidden bg-slate-950 border border-slate-700/50 mb-1">
                      <div style={{ width: `${pctLuyKe}%` }} className="bg-cyan-700 h-full"></div>
                      {item.loiNhuanTuan > 0 && (
                        <div style={{ width: `${pctTuan}%` }} className="bg-cyan-400 h-full border-l border-cyan-800/50 flex items-center justify-center overflow-hidden">
                          <span className="text-[8px] font-black text-slate-900 px-0.5">+{formatShort(item.loiNhuanTuan)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-1 px-0.5">
                      <span className="text-[9px] font-medium text-slate-400">Vốn: {formatShort(item.tongDauTu)}</span>
                      <span className="text-[9px] font-medium text-cyan-400">Đã thu: {formatShort(tongDaThu)} ({phanTramTong}%)</span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50 animate-in slide-in-from-top-2 fade-in duration-200">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-2 text-center">Lịch sử thu lợi nhuận</p>
                        <div className="space-y-1.5">
                          {item.lichSu.length === 0 ? (
                            <p className="text-center text-[9px] text-slate-600">Chưa có giao dịch sinh lời.</p>
                          ) : (
                            item.lichSu.map((ls: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-950/40 px-2 py-1.5 rounded border border-slate-800/50">
                                <span className="text-[10px] text-slate-400 font-mono">Tuần {ls.tuan} - {ls.nam}</span>
                                <span className="text-[10px] font-black text-cyan-400">
                                  {ls.tien > 0 ? '+' : ''}{formatVND(ls.tien)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // TRẠNG THÁI 2: ĐÃ SINH LỜI RÒNG (ROI)
              if (isProfitable) {
                const roi = (tongDaThu / item.tongDauTu);
                const pctVon = (item.tongDauTu / tongDaThu) * 100;
                const pctLaiRong = ((tongDaThu - item.tongDauTu) / tongDaThu) * 100;
                
                return (
                  <div key={index} className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 relative overflow-hidden transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
                    
                    <div className="flex justify-between items-center mb-3 relative z-10">
                      <span className="text-[11px] font-bold text-slate-200 max-w-[50%] truncate">{item.ten}</span>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 shadow-sm whitespace-nowrap">
                          ROI x{roi.toFixed(1)}
                        </span>
                        <button 
                          onClick={() => toggleTaiSan(index)}
                          className="w-6 h-5 flex justify-center items-center rounded bg-emerald-900/50 border border-emerald-500/30 text-[8px] text-emerald-300 hover:text-white active:scale-95"
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative w-full h-6 bg-slate-900 rounded-md border border-slate-700/50 mb-1 overflow-hidden flex shadow-inner">
                      <div style={{ width: `${pctVon}%` }} className="bg-slate-700 h-full flex items-center justify-center border-r-2 border-emerald-400/50 relative">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Vốn</span>
                      </div>
                      <div style={{ width: `${pctLaiRong}%` }} className="bg-emerald-500 h-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)' }}></div>
                        <span className="text-[8px] font-black text-emerald-950 uppercase tracking-widest relative z-10">Lãi Ròng</span>
                      </div>
                    </div>

                    <div className="flex justify-between mt-1 px-0.5">
                      <span className="text-[9px] font-medium text-slate-400">Vốn: {formatShort(item.tongDauTu)}</span>
                      <span className="text-[9px] font-black text-emerald-400">Lãi ròng: +{formatShort(tongDaThu - item.tongDauTu)}</span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-emerald-800/30 animate-in slide-in-from-top-2 fade-in duration-200">
                        <p className="text-[8px] text-emerald-500/80 uppercase tracking-widest mb-2 text-center">Lịch sử thu lợi nhuận</p>
                        <div className="space-y-1.5">
                          {item.lichSu.length === 0 ? (
                            <p className="text-center text-[9px] text-emerald-700">Chưa có giao dịch sinh lời.</p>
                          ) : (
                            item.lichSu.map((ls: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-emerald-950/40 px-2 py-1.5 rounded border border-emerald-800/30">
                                <span className="text-[10px] text-emerald-200/60 font-mono">Tuần {ls.tuan} - {ls.nam}</span>
                                <span className="text-[10px] font-black text-emerald-400">
                                  {ls.tien > 0 ? '+' : ''}{formatVND(ls.tien)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>

      </div>
    </div>
  );
}