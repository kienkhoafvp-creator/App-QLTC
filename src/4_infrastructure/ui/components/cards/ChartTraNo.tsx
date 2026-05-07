"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";
import { GetChartTraNoUseCase } from "@/2_use_cases/statistics/GetChartTraNoUseCase";
import { motion } from "framer-motion";

const CHART_COLORS = ["#8b5cf6", "#ec4899", "#ef4444", "#0ea5e9", "#10b981", "#f59e0b", "#84cc16"];

interface ChartProps {
  onClose: () => void;
}

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value, sourceName } = props;
  if (!value || Number(value) === 0) return null;

  const numVal = Number(value);
  const isPositive = numVal > 0;

  const inMillions = Math.abs(numVal) / 1000000;
  let displayAmount = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(inMillions);
  if (isPositive) displayAmount = '+' + displayAmount;

  const shortName = sourceName.trim().split(/\s+/).slice(0, 2).join(" ");
  const labelWidth = 54;
  const labelHeight = 16;
  
  let nameBoxY;
  let amountY;

  if (isPositive) {
    nameBoxY = y + height - labelHeight - 2;
    amountY = y - 8; 
  } else {
    nameBoxY = y + 2;
    amountY = y + height + 14; 
  }

  return (
    <g>
      <rect x={x + width / 2 - labelWidth / 2} y={nameBoxY} width={labelWidth} height={labelHeight} fill="#ffffff" rx={4} ry={4} />
      <text x={x + width / 2} y={nameBoxY + 11} fill="#000000" textAnchor="middle" fontSize={9} fontWeight="900">{shortName}</text>
      <text x={x + width / 2} y={amountY} fill={isPositive ? "#a78bfa" : "#ef4444"} textAnchor="middle" fontSize={11} fontWeight="black" className="drop-shadow-md">{displayAmount}</text>
    </g>
  );
};

export default function ChartTraNo({ onClose }: ChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [danhSachNguon, setDanhSachNguon] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLimit, setTimeLimit] = useState<number | "ALL">(10);
  const [groupBy, setGroupBy] = useState<'tuan' | 'thang' | 'nam'>('tuan');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const useCase = new GetChartTraNoUseCase();
        const result = await useCase.execute(groupBy);
        setData(result.chartData);
        setDanhSachNguon(result.danhSachHienThi);
        if (selectedSources.length === 0) {
          setSelectedSources(result.danhSachHienThi.slice(0, 3).map((s: any) => s.ten));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [groupBy]);

  const handleToggleSource = (name: string) => {
    setSelectedSources(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const filteredData = timeLimit === "ALL" ? data : data.slice(-timeLimit);
  const minChartWidth = Math.max(100, filteredData.length * 85);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[calc(100dvh-1rem)] sm:h-[600px] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <h2 className="text-purple-400 font-black uppercase tracking-widest text-xs sm:text-sm">Tiến Độ Trả Nợ Tuần</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 border border-slate-700">✕</button>
        </div>

        <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden min-h-0">
          <div className="mb-3 shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800 shrink-0">
                {(['tuan', 'thang', 'nam'] as const).map(t => (
                  <button key={t} onClick={() => setGroupBy(t)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === t ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t === 'tuan' ? 'Tuần' : t === 'thang' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 text-xs">
                <span className="font-bold text-slate-500 uppercase">Phạm vi:</span>
                <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === "ALL" ? "ALL" : Number(e.target.value))} className="bg-transparent text-purple-400 font-black focus:outline-none">
                  <option value={5} className="bg-slate-900">5 kỳ</option>
                  <option value={10} className="bg-slate-900">10 kỳ</option>
                  <option value="ALL" className="bg-slate-900">Tất cả</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
              {danhSachNguon.map((item, index) => (
                <button key={item.id} onClick={() => handleToggleSource(item.ten)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedSources.includes(item.ten) ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500 border-slate-800'}`} style={{ borderColor: selectedSources.includes(item.ten) ? CHART_COLORS[index % CHART_COLORS.length] : undefined }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: selectedSources.includes(item.ten) ? CHART_COLORS[index % CHART_COLORS.length] : '#334155' }}></span>
                  {item.ten}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 overflow-x-auto custom-scrollbar">
            {isLoading ? <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">Trích xuất tiến độ...</div> : (
              <div style={{ minWidth: `${minChartWidth}px`, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 30, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickMargin={10} axisLine={false} tick={false} />
                    <Tooltip cursor={{ fill: '#ffffff', opacity: 0.05 }} contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '8px' }} />
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                    {selectedSources.map((name, i) => (
                      <Bar key={name} dataKey={name} fill={CHART_COLORS[i % CHART_COLORS.length]} maxBarSize={48} radius={[4, 4, 4, 4]} isAnimationActive={false}>
                        <LabelList content={(p: any) => <CustomBarLabel {...p} sourceName={name} />} />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}