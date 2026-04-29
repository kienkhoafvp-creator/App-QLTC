// src/4_infrastructure/ui/components/gamefi-popups/UpdatePrompt.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, RefreshCw } from "lucide-react";

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const [worker, setWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Hàm kiểm tra Service Worker mới
    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        setWorker(registration.waiting);
        setShow(true);
      } else if (registration.installing) {
        registration.installing.addEventListener("statechange", () => {
          if (registration.waiting) {
            setWorker(registration.waiting);
            setShow(true);
          }
        });
      }
    };

    // Lắng nghe ngay khi web vừa tải xong
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setWorker(registration.waiting);
        setShow(true);
      }
      registration.addEventListener("updatefound", () => {
        onSWUpdate(registration);
      });
    });

    // Lắng nghe sự kiện "Đã cài code mới xong" -> Tiến hành F5 lại app
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (worker) {
      // Bắn lệnh cho hệ thống ngầm tiến hành cập nhật
      worker.postMessage({ type: "SKIP_WAITING" });
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-full max-w-sm bg-slate-900 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Hiệu ứng ánh sáng nền */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-400/50">
                <Rocket className="w-8 h-8 text-blue-400 animate-bounce" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                Bản Cập Nhật Mới!
              </h2>
              <p className="text-slate-300 text-sm mb-6">
                Hệ thống vừa tải xong dữ liệu mới. Hãy cập nhật để trải nghiệm tính năng mượt mà hơn nhé.
              </p>

              <button
                onClick={handleUpdate}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-[0_4px_0_rgba(29,78,216,1)] hover:shadow-[0_2px_0_rgba(29,78,216,1)] hover:translate-y-[2px]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>CẬP NHẬT NGAY</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}