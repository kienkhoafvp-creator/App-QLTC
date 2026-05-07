"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";
import { GetChartNguonThuUseCase } from "@/2_use_cases/statistics/GetChartNguonThuUseCase";
import { motion } from "framer-motion";

const CHART_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#84cc16"];

interface ChartProps {
  onClose: () => void;
}

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value, sourceName } = props;
  if (value === undefined || value === null) return null;

  const numVal = Number(value);
  if (numVal === 0) return null; 

  const isPositive = numVal > 0;

  const inMillions = Math.abs(numVal) / 1000000;
  let displayAmount = new Intl.NumberFormat('vi-VN', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  }).format(inMillions);
  
  displayAmount = (isPositive ? '+' : '-') + displayAmount;

  const shortName = sourceName.trim().split(/\s+/).slice(0, 2).join(" ");

  const labelWidth = 54;
  const labelHeight = 16;
  
  let nameBoxY;
  let amountY;

  if (isPositive) {
    nameBoxY = y + height - labelHeight - 2;
    amountY = Math.min(y - 8, nameBoxY - 12); 
  } else {
    nameBoxY = y + 2;
    amountY = Math.max(y + height + 14, nameBoxY + labelHeight + 12); 
  }

  return (
    <g>
      <rect x={x + width / 2 - labelWidth / 2} y={nameBoxY} width={labelWidth} height={labelHeight} fill="#ffffff" rx={4} ry={4} />
      <text x={x + width / 2} y={nameBoxY + 11} fill="#000000" textAnchor="middle" fontSize={9} fontWeight="900">{shortName}</text>
      <text x={x + width / 2} y={amountY} fill={isPositive ? "#4ade80" : "#ef4444"} textAnchor="middle" fontSize={11} fontWeight="black" className="drop-shadow-md">{displayAmount}</text>
    </g>
  );
};

export default function ChartNguonThu({ onClose }: ChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [danhSachNguon, setDanhSachNguon] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [timeLimit, setTimeLimit] = useState<number | "ALL">(10);
  const [groupBy, setGroupBy] = useState<'tuan' | 'thang' | 'nam'>('tuan'); // STATE MỚI

  // Cập nhật useEffect: Sẽ chạy lại mỗi khi thay đổi groupBy
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const useCase = new GetChartNguonThuUseCase();
        const result = await useCase.execute(groupBy);
        setData(result.chartData);
        setDanhSachNguon(result.danhSachNguon);
        
        // Chỉ auto-select nếu trước đó chưa chọn gì
        if (result.danhSachNguon.length > 0 && selectedSources.length === 0) {
          setSelectedSources(result.danhSachNguon.slice(0, 3).map((s: any) => s.ten_nguon));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [groupBy]); // Theo dõi sự thay đổi của groupBy

  const handleToggleSource = (sourceName: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceName) ? prev.filter(n => n !== sourceName) : [...prev, sourceName]
    );
  };

  const formatCurrencyFull = (val: number) => {
    if (val === 0) return "0";
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const filteredData = timeLimit === "ALL" ? data : data.slice(-timeLimit);
  const minChartWidth = Math.max(100, filteredData.length * 85);

  const getTypeLabel = () => {
    if (groupBy === 'tuan') return 'Tuần';
    if (groupBy === 'thang') return 'Tháng';
    return 'Năm';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2"
    >
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[calc(100dvh-1rem)] sm:h-[600px] overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <h2 className="text-cyan-400 font-black uppercase tracking-widest text-xs sm:text-sm">Phân Tích Nguồn Thu</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 border border-slate-700">✕</button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-bold animate-pulse">Trích xuất dữ liệu...</div>
        ) : (
          <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden min-h-0">
            
            <div className="mb-3 shrink-0 space-y-3">
              
              {/* KHỐI ĐIỀU KHIỂN GROUP BY & THỜI GIAN */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* 3 Nút Tuần - Tháng - Năm */}
                <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button onClick={() => setGroupBy('tuan')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'tuan' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Tuần</button>
                  <button onClick={() => setGroupBy('thang')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'thang' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Tháng</button>
                  <button onClick={() => setGroupBy('nam')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'nam' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Năm</button>
                </div>

                {/* Dropdown Thời gian */}
                <div className="flex items-center justify-between bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Phạm vi:</span>
                  <select 
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                    className="bg-transparent text-cyan-400 text-xs font-black focus:outline-none"
                  >
                    <option value={5} className="bg-slate-900">5 {getTypeLabel()} gần nhất</option>
                    <option value={10} className="bg-slate-900">10 {getTypeLabel()} gần nhất</option>
                    <option value="ALL" className="bg-slate-900">Tất cả</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                {danhSachNguon.map((nguon, index) => {
                  const isSelected = selectedSources.includes(nguon.ten_nguon);
                  const color = CHART_COLORS[index % CHART_COLORS.length];
                  return (
                    <button
                      key={nguon.id}
                      onClick={() => handleToggleSource(nguon.ten_nguon)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                        isSelected ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                      style={{ borderColor: isSelected ? color : undefined }}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: isSelected ? color : '#334155' }}></span>
                      {nguon.ten_nguon}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 overflow-x-auto overflow-y-hidden custom-scrollbar">
              <div style={{ minWidth: `${minChartWidth}px`, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 40, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickMargin={10} axisLine={false} tick={false} />
                    <YAxis hide domain={['auto', 'auto']} />
                    
                    <Tooltip 
                      cursor={{ fill: '#ffffff', opacity: 0.05 }}
                      contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '8px' }}
                      formatter={(val: any) => [formatCurrencyFull(Number(val)), '']}
                    />
                    
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                    
                    {selectedSources.map((sourceName) => {
                      const colorIndex = danhSachNguon.findIndex(n => n.ten_nguon === sourceName);
                      return (
                        <Bar 
                          key={sourceName} 
                          dataKey={sourceName} 
                          fill={CHART_COLORS[colorIndex % CHART_COLORS.length]} 
                          maxBarSize={48}
                          radius={[4, 4, 4, 4]}
                          isAnimationActive={false}
                        >
                          <LabelList 
                            content={(props: any) => <CustomBarLabel {...props} sourceName={sourceName} />} 
                          />
                        </Bar>
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}