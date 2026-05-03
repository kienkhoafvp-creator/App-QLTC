"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { GetChartNguonThuUseCase } from "@/2_use_cases/statistics/GetChartNguonThuUseCase";
import { motion } from "framer-motion";

const CHART_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#84cc16"];

interface ChartProps {
  onClose: () => void;
}

export default function ChartNguonThu({ onClose }: ChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [danhSachNguon, setDanhSachNguon] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [timeLimit, setTimeLimit] = useState<number | "ALL">(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const useCase = new GetChartNguonThuUseCase();
        const result = await useCase.execute();
        
        setData(result.chartData);
        setDanhSachNguon(result.danhSachNguon);
        
        if (result.danhSachNguon.length > 0) {
          setSelectedSources(result.danhSachNguon.slice(0, 3).map((s: any) => s.ten_nguon));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleSource = (sourceName: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(name => name !== sourceName) 
        : [...prev, sourceName]
    );
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return "0";
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const filteredData = timeLimit === "ALL" 
    ? data 
    : data.slice(-timeLimit);

  const minChartWidth = Math.max(100, filteredData.length * 80);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      /* Giảm padding trên mobile để nhường diện tích cho app */
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4"
    >
      {/* Sửa h-[85vh] thành max-h-[calc(100dvh-1rem)] để tương thích tuyệt đối với Mobile Safari/Chrome */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[calc(100dvh-1rem)] sm:h-[600px] overflow-hidden">
        
        {/* HEADER POPUP */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <h2 className="text-cyan-400 font-black uppercase tracking-widest text-xs sm:text-sm">Thống Kê Nguồn Thu</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-slate-700 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-bold animate-pulse">
            Đang trích xuất dữ liệu...
          </div>
        ) : (
          /* Thêm min-h-0 vào đây để khóa lỗi vỡ layout của Flexbox */
          <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden min-h-0">
            
            {/* VÙNG ĐIỀU KHIỂN: Sắp xếp lại để trên Mobile không bị cướp đất */}
            <div className="mb-3 shrink-0 flex flex-col gap-3">
              
              {/* BỘ LỌC THỜI GIAN ĐƯA LÊN TRÊN */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Hiển thị:</span>
                <select 
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                  className="bg-transparent text-cyan-400 text-xs font-black focus:outline-none cursor-pointer text-right"
                >
                  <option value={5} className="bg-slate-900 text-white">5 Tuần gần nhất</option>
                  <option value={10} className="bg-slate-900 text-white">10 Tuần gần nhất</option>
                  <option value={15} className="bg-slate-900 text-white">15 Tuần gần nhất</option>
                  <option value="ALL" className="bg-slate-900 text-white">Tất cả lịch sử</option>
                </select>
              </div>

              {/* DANH SÁCH NÚT: Giới hạn chiều cao max-h và cho cuộn trên mobile để cứu không gian cho biểu đồ */}
              <div className="flex flex-wrap gap-2 max-h-[100px] sm:max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                {danhSachNguon.map((nguon, index) => {
                  const isSelected = selectedSources.includes(nguon.ten_nguon);
                  const color = CHART_COLORS[index % CHART_COLORS.length];
                  
                  return (
                    <button
                      key={nguon.id}
                      onClick={() => handleToggleSource(nguon.ten_nguon)}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all border ${
                        isSelected 
                          ? 'bg-slate-800 text-white shadow-inner' 
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ borderColor: isSelected ? color : undefined }}
                    >
                      <span 
                        className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2" 
                        style={{ backgroundColor: isSelected ? color : '#334155' }}
                      ></span>
                      {nguon.ten_nguon}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* CHART PANEL */}
            <div className="flex-1 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-1 sm:p-2 overflow-y-hidden overflow-x-auto custom-scrollbar min-h-0">
              {selectedSources.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs sm:text-sm font-bold uppercase text-center p-4">
                  Chưa chọn nguồn thu nào
                </div>
              ) : filteredData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs sm:text-sm font-bold uppercase text-center p-4">
                  Chưa có lịch sử khớp sổ
                </div>
              ) : (
                <div style={{ minWidth: `${minChartWidth}px`, height: '100%' }} className="min-w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickMargin={8}
                        axisLine={{ stroke: '#334155' }}
                      />
                      
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(value)}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      
                      <Tooltip 
                        cursor={{ fill: '#0f172a', opacity: 0.5 }}
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', padding: '8px' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
                        formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                      />
                      
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
                      <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                      
                      {selectedSources.map((sourceName) => {
                        const colorIndex = danhSachNguon.findIndex(n => n.ten_nguon === sourceName);
                        return (
                          <Bar 
                            key={sourceName} 
                            dataKey={sourceName} 
                            fill={CHART_COLORS[colorIndex % CHART_COLORS.length]} 
                            maxBarSize={35}
                            radius={[4, 4, 4, 4]} 
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}