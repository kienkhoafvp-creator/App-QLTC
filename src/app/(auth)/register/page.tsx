// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ZoomInput from "@/4_infrastructure/ui/components/inputs/ZoomInput";
import AlertPopup from "@/4_infrastructure/ui/components/gamefi-popups/AlertPopup";
import { AuthRepo } from "@/3_adapters/repositories/AuthRepo";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: "", username: "", phone: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({ isOpen: false, type: "success", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AuthRepo.register(formData.email, formData.password, formData.fullName, formData.username, formData.phone);
      setPopup({ 
        isOpen: true, 
        type: "success", 
        message: "Tạo tài khoản thành công! Vui lòng kiểm tra Email để nhận mã xác thực kích hoạt nhân vật." 
      });
      // Đợi người dùng tắt pop-up tự động chuyển về login
    } catch (error: any) {
      setPopup({ isOpen: true, type: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
          TẠO NHÂN VẬT
        </h1>
      </div>

      <form onSubmit={handleRegister}>
        <ZoomInput label="Họ và Tên" tooltipInfo="Tên thật của bạn" name="fullName" type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} required />
        <ZoomInput label="Tên Tài Khoản" tooltipInfo="Định danh duy nhất" name="username" type="text" placeholder="nguyenvana123" value={formData.username} onChange={handleChange} required />
        <ZoomInput label="Số Điện Thoại" tooltipInfo="Hỗ trợ đăng nhập" name="phone" type="tel" placeholder="0901234567" value={formData.phone} onChange={handleChange} required />
        <ZoomInput label="Email" tooltipInfo="Dùng để xác thực" name="email" type="email" placeholder="email@gmail.com" value={formData.email} onChange={handleChange} required />
        <ZoomInput label="Mật Khẩu" tooltipInfo="Tối thiểu 6 ký tự" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6}/>

        <button
          disabled={isLoading} type="submit"
          className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_rgba(6,95,70,1)] active:shadow-none active:translate-y-[4px] transition-all"
        >
          {isLoading ? "ĐANG TẠO..." : "ĐĂNG KÝ"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Đã có nhân vật? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Vào game ngay</Link>
      </div>

      <AlertPopup 
        isOpen={popup.isOpen} type={popup.type} message={popup.message} 
        onClose={() => {
          setPopup({ ...popup, isOpen: false });
          if (popup.type === "success") router.push("/login");
        }} 
      />
    </>
  );
}