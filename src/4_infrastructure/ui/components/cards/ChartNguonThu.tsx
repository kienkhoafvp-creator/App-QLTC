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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const useCase = new GetChartNguonThuUseCase();
        const result = await useCase.execute();
        
        setData(result.chartData);
        setDanhSachNguon(result.danhSachNguon);
        
        // Mặc định chọn 3 nguồn đầu tiên
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* HEADER POPUP */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-cyan-400 font-black uppercase tracking-widest text-sm">Thống Kê Lợi Nhuận Nguồn Thu</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-slate-700 transition-all"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-bold animate-pulse">
            Đang trích xuất dữ liệu...
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* FILTER PANEL */}
            <div className="mb-4 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {danhSachNguon.map((nguon, index) => {
                  const isSelected = selectedSources.includes(nguon.ten_nguon);
                  const color = CHART_COLORS[index % CHART_COLORS.length];
                  
                  return (
                    <button
                      key={nguon.id}
                      onClick={() => handleToggleSource(nguon.ten_nguon)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected 
                          ? 'bg-slate-800 text-white shadow-inner' 
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ borderColor: isSelected ? color : undefined }}
                    >
                      <span 
                        className="inline-block w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: isSelected ? color : '#334155' }}
                      ></span>
                      {nguon.ten_nguon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHART PANEL */}
            <div className="flex-1 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 relative">
              {selectedSources.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-bold uppercase">
                  Chưa chọn nguồn thu nào
                </div>
              ) : data.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-bold uppercase">
                  Chưa có lịch sử khớp sổ
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickMargin={10}
                      axisLine={{ stroke: '#334155' }}
                    />
                    
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                      axisLine={false}
                      tickLine={false}
                    />
                    
                    <Tooltip 
                      cursor={{ fill: '#0f172a', opacity: 0.5 }}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                    />
                    
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                    
                    {selectedSources.map((sourceName, index) => {
                      // Tìm đúng màu dựa theo vị trí trong danh sách gốc
                      const colorIndex = danhSachNguon.findIndex(n => n.ten_nguon === sourceName);
                      return (
                        <Bar 
                          key={sourceName} 
                          dataKey={sourceName} 
                          fill={CHART_COLORS[colorIndex % CHART_COLORS.length]} 
                          maxBarSize={40}
                          radius={[4, 4, 4, 4]} 
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}