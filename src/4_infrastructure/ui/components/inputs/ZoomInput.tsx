// src/4_infrastructure/ui/components/inputs/ZoomInput.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface ZoomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltipInfo: string;
}

export default function ZoomInput({ label, tooltipInfo, ...props }: ZoomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative flex flex-col mb-4"
      animate={{ scale: isFocused ? 1.05 : 1, zIndex: isFocused ? 10 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <label className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 ml-1">
        {label}
      </label>
      <input
        {...props}
        // THÊM DÒNG DƯỚI ĐÂY ĐỂ FIX LỖI 100%
        suppressHydrationWarning 
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        className="w-full bg-slate-800/80 border-2 border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-sm outline-none shadow-inner transition-colors placeholder:text-slate-500"
      />
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-10 right-0 bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.8)] border border-blue-400"
          >
            <Info className="w-3 h-3" />
            {tooltipInfo}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-blue-600 rotate-45 border-r border-b border-blue-400"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}