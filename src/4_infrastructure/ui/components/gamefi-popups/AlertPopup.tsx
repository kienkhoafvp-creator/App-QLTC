// src/4_infrastructure/ui/components/gamefi-popups/AlertPopup.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AlertPopupProps {
  isOpen: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function AlertPopup({ isOpen, type, message, onClose }: AlertPopupProps) {
  const isError = type === "error";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateX: -45 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className={`w-full max-w-[320px] rounded-2xl border-2 p-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
              isError ? "bg-slate-900 border-red-500 shadow-red-500/30" : "bg-slate-900 border-green-500 shadow-green-500/30"
            }`}
          >
            <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${isError ? "text-red-400" : "text-green-400"}`}>
              {isError ? "THẤT BẠI!" : "THÀNH CÔNG!"}
            </h3>
            <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed">
              {message}
            </p>
            <button
              onClick={onClose}
              className={`w-full font-bold py-3 px-6 rounded-xl transition-all active:scale-95 text-white ${
                isError 
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_4px_0_rgba(159,18,57,1)]" 
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-[0_4px_0_rgba(6,95,70,1)]"
              }`}
            >
              TIẾP TỤC
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}