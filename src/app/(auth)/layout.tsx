// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Cấu hình Metadata cơ bản
export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý GameFi",
  description: "Trạm điều khiển dòng tiền chuyên nghiệp",
};

// Cấu hình chặn zoom trên Mobile (Quy tắc UI/UX bóp hẹp màn hình)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning ở html và body giúp bỏ qua lỗi do Extension trình duyệt gây ra
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-200 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}