"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";
import CategorySnapList, { Category } from "@/app/dashboard/components/giaodich/CategorySnapList";
import { CreateNguonTienUseCase } from "@/2_use_cases/transactions/CreateNguonTienUseCase";
import { CreatePhieuThuUseCase } from "@/2_use_cases/transactions/CreatePhieuThuUseCase";
import { CreatePhieuChiUseCase } from "@/2_use_cases/transactions/CreatePhieuChiUseCase";
import { GetThongKeNguonTienUseCase } from "@/2_use_cases/transactions/GetThongKeNguonTienUseCase";
import { GetThongKeNganSachUseCase } from "@/2_use_cases/transactions/GetThongKeNganSachUseCase";
import { GetThongKeKhoanNoUseCase } from "@/2_use_cases/transactions/GetThongKeKhoanNoUseCase";

// Nhận "chìa khóa" mở Tab từ cha
export default function GiaoDich({ onOpenLichSu }: { onOpenLichSu?: () => void }) {
  const [activeTab, setActiveTab] = useState<"thu" | "chi">("chi");
  const [isLoading, setIsLoading] = useState(false);

  const [soTien, setSoTien] = useState(""); 
  const [lyDo, setLyDo] = useState("");
  const [nguoiThucHien, setNguoiThucHien] = useState("");
  const [thoiGian, setThoiGian] = useState("");

  const [nguonTienId, setNguonTienId] = useState(""); 
  const [loaiMangChi, setLoaiMangChi] = useState(""); 
  const [mangChiId, setMangChiId] = useState(""); 

  interface NguonTien { nguon_tien_id: string; ten_nguon: string; sum_loi_nhuan_gop?: number }
  interface NganSach { ngan_sach_id: string; ten_ngan_sach: string; so_du_con_lai?: number }
  interface KhoanNo { khoan_no_id: string; ten_khoan_no: string; so_tien_con_lai?: number }

  const [nguonTienList, setNguonTienList] = useState<NguonTien[]>([]);
  const [nganSachList, setNganSachList] = useState<NganSach[]>([]);
  const [khoanNoList, setKhoanNoList] = useState<KhoanNo[]>([]);
  const [hangMuc, setHangMuc] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [extraCategoriesChi, setExtraCategoriesChi] = useState<Category[]>([]);
  const [extraCategoriesThu, setExtraCategoriesThu] = useState<Category[]>([]);
  const [showAddMangForm, setShowAddMangForm] = useState(false);
  const [showAddChiTietForm, setShowAddChiTietForm] = useState(false);
  const [addNameInput, setAddNameInput] = useState("");
  const [addTargetType, setAddTargetType] = useState<"KINH_DOANH" | "NGAN_SACH" | "NO">("NGAN_SACH");
  const [photos, setPhotos] = useState<File[]>([]);
  const [chiTietBoSung, setChiTietBoSung] = useState("");

  // Refs for click-outside auto-hide of add-forms
  const addMangRef = useRef<HTMLDivElement | null>(null);
  const addMangToggleRef = useRef<HTMLButtonElement | null>(null);
  const addChiRef = useRef<HTMLDivElement | null>(null);
  const addChiToggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;

      if (showAddMangForm) {
        const insideForm = addMangRef.current && target && addMangRef.current.contains(target);
        const insideToggle = addMangToggleRef.current && target && addMangToggleRef.current.contains(target);
        if (!insideForm && !insideToggle) setShowAddMangForm(false);
      }

      if (showAddChiTietForm) {
        const insideForm = addChiRef.current && target && addChiRef.current.contains(target);
        const insideToggle = addChiToggleRef.current && target && addChiToggleRef.current.contains(target);
        if (!insideForm && !insideToggle) setShowAddChiTietForm(false);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showAddMangForm, showAddChiTietForm]);

  useEffect(() => {
    const initTime = () => {
      const offset = new Date().getTimezoneOffset() * 60000;
      setThoiGian((new Date(Date.now() - offset)).toISOString().slice(0, 16));
    };
    initTime();

    const fetchData = async () => {
      try {
        const ntUseCase = new GetThongKeNguonTienUseCase();
        const ntData = await ntUseCase.execute();
        const finalNtData = [...ntData, { nguon_tien_id: "00000000-0000-0000-0000-000000000000", ten_nguon: "Nguồn khác", sum_loi_nhuan_gop: 0 }];
        setNguonTienList(finalNtData);
        if (finalNtData.length > 0) setNguonTienId(finalNtData[0].nguon_tien_id);

        const nsUseCase = new GetThongKeNganSachUseCase();
        setNganSachList(await nsUseCase.execute());

        const knUseCase = new GetThongKeKhoanNoUseCase();
        setKhoanNoList(await knUseCase.execute());
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
    setHangMuc(""); setPhotos([]); setChiTietBoSung("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawNumber = parseFloat(soTien.replace(/,/g, ""));

      // Nếu có ảnh đính kèm, upload lên Supabase Storage và lấy URL
      const photoUrls: string[] = [];
      if (photos && photos.length > 0) {
        const bucket = "receipts";
        for (const file of photos) {
          const ext = file.name.split('.').pop();
          const filename = `receipts/${Date.now()}_${Math.random().toString(36).slice(2,9)}.${ext}`;
          try {
            const { error: uploadError } = await supabase.storage.from(bucket).upload(filename, file, { cacheControl: '3600', upsert: false });
            if (uploadError) {
              console.error('Upload error', uploadError);
              continue;
            }
            const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
            if (data && data.publicUrl) photoUrls.push(data.publicUrl);
          } catch (err) {
            console.error('Upload failed', err);
          }
        }
      }

      if (activeTab === "thu") {
        const useCase = new CreatePhieuThuUseCase();
        await useCase.execute({
          so_tien: rawNumber,
          ly_do_thu: lyDo,
          nguoi_thu: nguoiThucHien,
          thoi_gian: thoiGian ? new Date(thoiGian).toISOString() : new Date().toISOString(),
          id_nguon_thu: nguonTienId,
          hang_muc: hangMuc,
          chi_tiet_bo_sung: chiTietBoSung,
          photos: photoUrls
        });
        alert("Ghi nhận Phiếu Thu thành công.");
      } else {
        const useCase = new CreatePhieuChiUseCase();
        await useCase.execute({
          so_tien: rawNumber,
          ly_do_chi: lyDo,
          nguoi_chi: nguoiThucHien,
          thoi_gian: thoiGian ? new Date(thoiGian).toISOString() : new Date().toISOString(),
          mang_chi_id: mangChiId,
          hang_muc: hangMuc,
          chi_tiet_bo_sung: chiTietBoSung,
          photos: photoUrls
        });
        alert("Ghi nhận Phiếu Chi thành công.");
      }
      resetForm();
    } catch (error: unknown) {
      let message = 'Không xác định';
      if (error instanceof Error) message = error.message;
      else if (typeof error === 'string') message = error;
      alert(`Lỗi hệ thống: ${message}`);
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
                className={`w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-2xl font-black text-right focus:outline-none transition-all ${activeTab === 'thu' ? 'text-emerald-400 focus:border-emerald-500' : 'text-orange-400 focus:border-orange-500'}`}
                required
                disabled={isLoading}
              />
            </div>

            {/* HẠNG MỤC (snap list with groups + add) */}
            <div className="space-y-2">
              <CategorySnapList
                mode={activeTab === 'chi' ? 'chi' : 'thu'}
                selectedId={selectedCategoryId}
                extraCategories={activeTab === 'chi' ? extraCategoriesChi : extraCategoriesThu}
                onSelect={(cat) => {
                  setSelectedCategoryId(cat.id);
                  setHangMuc(cat.name);
                }}
                onAddCategory={(cat) => {
                  if (activeTab === 'chi') {
                    setExtraCategoriesChi((p) => [cat, ...p]);
                  } else {
                    setExtraCategoriesThu((p) => [cat, ...p]);
                  }
                  setSelectedCategoryId(cat.id);
                  setHangMuc(cat.name);
                }}
              />
            </div>

            {/* BLOCK CHI MẢNG */}
            {activeTab === "chi" && (
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Chi cho mảng *</label>
                  <div className="relative">
                    <select 
                      value={loaiMangChi}
                      onChange={(e) => {
                        setLoaiMangChi(e.target.value);
                        setMangChiId(""); 
                      }}
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                      disabled={isLoading}
                      required
                    >
                      <option value="">-- Chọn mảng chi --</option>
                      <option value="KINH_DOANH">💼 Chi kinh doanh</option>
                      <option value="NGAN_SACH">📋 Chi ngân sách</option>
                      <option value="NO">📉 Chi trả nợ</option>
                    </select>

                    <button
                      ref={addMangToggleRef}
                      type="button"
                      onClick={() => { setShowAddMangForm((s) => !s); setAddTargetType('NGAN_SACH'); setAddNameInput(''); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-lg hover:bg-slate-600"
                      aria-label="Thêm mục mảng"
                    >
                      +
                    </button>
                  </div>

                  {showAddMangForm && (
                    <div ref={addMangRef} className="mt-2 grid grid-cols-[min-content_1fr_min-content] gap-3 items-center">
                      <select value={addTargetType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddTargetType(e.target.value as "KINH_DOANH" | "NGAN_SACH" | "NO")} className="bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white">
                        <option value="NGAN_SACH">Ngân sách</option>
                        <option value="KINH_DOANH">Kinh doanh</option>
                        <option value="NO">Nợ</option>
                      </select>

                      <input type="text" value={addNameInput} onChange={(e) => setAddNameInput(e.target.value)} placeholder="Tên mới" className="max-w-[260px] w-full bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white" />

                      <div className="flex items-center gap-2">
                          <button type="button" onClick={async () => {
                            const name = addNameInput.trim(); if (!name) return;
                            // If adding a KINH_DOANH source, persist to backend via use-case
                            if (addTargetType === 'KINH_DOANH') {
                              setIsLoading(true);
                              try {
                                const createUC = new CreateNguonTienUseCase();
                                await createUC.execute(name, nguonTienList.length + 1);
                                // refresh list
                                const ntUseCase = new GetThongKeNguonTienUseCase();
                                const updated = await ntUseCase.execute();
                                setNguonTienList(updated);
                                const found = updated.find(u => u.ten_nguon === name);
                                if (found) setMangChiId(`NGUON_${found.nguon_tien_id}`);
                              } catch (err) {
                                console.error('Lỗi tạo nguồn tiền:', err);
                                alert('Lỗi khi tạo nguồn tiền. Vui lòng thử lại.');
                              } finally {
                                setIsLoading(false);
                              }
                            } else if (addTargetType === 'NGAN_SACH') {
                              const newId = `CUSTOM_${Date.now()}`;
                              const newItem = { ten_ngan_sach: name, ngan_sach_id: newId, so_du_con_lai: 0 };
                              setNganSachList(prev => [newItem, ...prev]);
                              setMangChiId(`NS_${newId}`);
                            } else {
                              const newId = `CUSTOM_${Date.now()}`;
                              const newItem = { khoan_no_id: newId, ten_khoan_no: name, so_tien_con_lai: 0 };
                              setKhoanNoList(prev => [newItem, ...prev]);
                              setMangChiId(`NO_${newId}`);
                            }
                            setAddNameInput(''); setShowAddMangForm(false);
                          }} className="w-12 h-8 rounded-full bg-emerald-600 text-white text-xs shadow-sm">Thêm</button>
                      </div>
                    </div>
                  )}
                </div>

                {loaiMangChi !== "" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Chi tiết *</label>
                    <div className="relative">
                      <select 
                        value={mangChiId}
                        onChange={(e) => setMangChiId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3.5 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                        disabled={isLoading}
                        required
                      >
                      <option value="">-- Chọn chi tiết --</option>
                      
                      {loaiMangChi === "KINH_DOANH" && nguonTienList
                        .filter(nguon => nguon.nguon_tien_id !== "00000000-0000-0000-0000-000000000000") 
                        .map(nguon => (
                        <option key={`NGUON_${nguon.nguon_tien_id}`} value={`NGUON_${nguon.nguon_tien_id}`}>
                          💰 {nguon.ten_nguon} ({formatLabelCurrency(nguon.sum_loi_nhuan_gop ?? 0)}đ)
                        </option>
                      ))}

                      {loaiMangChi === "NGAN_SACH" && nganSachList.map(ns => (
                        <option key={`NS_${ns.ngan_sach_id}`} value={`NS_${ns.ngan_sach_id}`}>
                          📋 {ns.ten_ngan_sach} ({formatLabelCurrency(ns.so_du_con_lai ?? 0)}đ)
                        </option>
                      ))}

                      {loaiMangChi === "NO" && khoanNoList.map(kn => (
                        <option key={`NO_${kn.khoan_no_id}`} value={`NO_${kn.khoan_no_id}`}>
                          📉 {kn.ten_khoan_no} ({formatLabelCurrency(kn.so_tien_con_lai ?? 0)}đ)
                        </option>
                      ))}
                      </select>

                      <button ref={addChiToggleRef} type="button" onClick={() => { setShowAddChiTietForm((s) => !s); setAddNameInput(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-lg hover:bg-slate-600">+</button>
                    </div>

                    {showAddChiTietForm && (
                      <div ref={addChiRef} className="mt-2 grid grid-cols-[1fr_min-content] gap-2 items-center w-full">
                        <input type="text" value={addNameInput} onChange={(e) => setAddNameInput(e.target.value)} placeholder={loaiMangChi === 'KINH_DOANH' ? 'Tên nguồn' : loaiMangChi === 'NGAN_SACH' ? 'Tên ngân sách' : 'Tên khoản nợ'} className="w-full bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white" />
                        <button type="button" onClick={async () => {
                          const name = addNameInput.trim(); if (!name) return;
                          if (loaiMangChi === 'KINH_DOANH') {
                            setIsLoading(true);
                            try {
                              const createUC = new CreateNguonTienUseCase();
                              await createUC.execute(name, nguonTienList.length + 1);
                              const ntUseCase = new GetThongKeNguonTienUseCase();
                              const updated = await ntUseCase.execute();
                              setNguonTienList(updated);
                              const found = updated.find(u => u.ten_nguon === name);
                              if (found) setMangChiId(`NGUON_${found.nguon_tien_id}`);
                            } catch (err) {
                              console.error('Lỗi tạo nguồn tiền:', err);
                              alert('Lỗi khi tạo nguồn tiền. Vui lòng thử lại.');
                            } finally {
                              setIsLoading(false);
                            }
                          } else if (loaiMangChi === 'NGAN_SACH') {
                            const newId = `CUSTOM_${Date.now()}`;
                            const newItem = { ten_ngan_sach: name, ngan_sach_id: newId, so_du_con_lai: 0 };
                            setNganSachList(prev => [newItem, ...prev]);
                            setMangChiId(`NS_${newId}`);
                          } else {
                            const newId = `CUSTOM_${Date.now()}`;
                            const newItem = { khoan_no_id: newId, ten_khoan_no: name, so_tien_con_lai: 0 };
                            setKhoanNoList(prev => [newItem, ...prev]);
                            setMangChiId(`NO_${newId}`);
                          }
                          setAddNameInput(''); setShowAddChiTietForm(false);
                        }} className="w-12 h-8 rounded-full bg-emerald-600 text-white text-xs shadow-sm">Thêm</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* BLOCK THU NGUỒN */}
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

            {/* ==== BÀN CỜ GRID: KHÓA CHẶT VỊ TRÍ CỦA 4 KHỐI ==== */}
            <div className="grid grid-cols-[1.3fr_1fr] gap-x-2 gap-y-4 pt-1">
              
              {/* CỘT 1 - HÀNG 1: LÝ DO */}
              <div className="space-y-1 min-w-0 col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate block ml-1">Lý Do {activeTab === 'thu' ? 'Thu' : 'Chi'}</label>
                <input 
                  type="text" 
                  value={lyDo}
                  onChange={(e) => setLyDo(e.target.value)}
                  placeholder="Nhập nội dung..." 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-sm text-white focus:outline-none transition-all cursor-text placeholder:text-slate-600" 
                  disabled={isLoading}
                />
              </div>
              

              {/* CỘT 1 - HÀNG 2: THỜI GIAN */}
              <div className="space-y-1 min-w-0">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate block ml-1">Thời Gian</label>
                <input 
                  type="datetime-local" 
                  value={thoiGian}
                  onChange={(e) => setThoiGian(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  onFocus={(e) => e.currentTarget.showPicker()}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-[11px] text-xs sm:text-sm text-white focus:outline-none transition-all cursor-pointer" 
                  disabled={isLoading}
                />
              </div>

              {/* CỘT 2 - HÀNG 2: NÚT LỊCH SỬ */}
              <div className="min-w-0 flex flex-col justify-end">
                <button 
                  type="button"
                  onClick={() => {
                    if (onOpenLichSu) onOpenLichSu(); 
                  }}
                  className="w-full h-[42px] bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30 text-indigo-400 font-black rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 uppercase text-[10px] sm:text-xs tracking-widest"
                >
                  🕒 Lịch Sử
                </button>
              </div>

            </div>

            <div className="pt-3">
              {/* Chi tiết bổ sung & ảnh */}
              <div className="space-y-2 mb-3">
                {/* Duplicate Time + History removed (kept the main Time control above) */}

                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Chi tiết / Ảnh (tùy chọn)</label>
                <textarea
                  value={chiTietBoSung}
                  onChange={(e) => setChiTietBoSung(e.target.value)}
                  placeholder="Ghi chú thêm hoặc mô tả chi tiết..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-2xl p-4 text-sm text-white focus:outline-none h-12"
                  disabled={isLoading}
                />

                <div className="flex items-center gap-3">
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      setPhotos(Array.from(files));
                    }}
                    className="text-sm text-slate-400"
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-2">
                    {photos.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(p)} alt={`photo-${idx}`} className="w-10 h-10 object-cover rounded-md" />
                        <span className="text-sm text-slate-300">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* keypad removed per user request */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-slate-900 font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xl ${
                  isLoading ? 'bg-slate-700 text-slate-400' : activeTab === 'thu' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_10px_30px_rgba(0,200,150,0.18)]' : 'bg-orange-500 hover:bg-orange-400 shadow-[0_10px_30px_rgba(255,107,53,0.18)]'
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