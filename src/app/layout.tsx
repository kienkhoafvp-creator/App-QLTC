import type { Metadata, Viewport } from 'next';
import './globals.css';
import UpdatePrompt from '@/4_infrastructure/ui/components/gamefi-popups/UpdatePrompt'; // Thêm dòng này

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Thói quen - QLTC',
  description: 'App quản lý tài chính cá nhân kích thích Dopamine',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Thói quen - QLTC',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {/* Khung mobile dọc bóp hẹp 2 bên (Quy tắc 5) */}
        <main className="max-w-md mx-auto min-h-screen bg-slate-900 shadow-2xl overflow-x-hidden relative">
          {children}
        </main>
        
        {/* Pop-up cập nhật PWA nằm chờ sẵn */}
        <UpdatePrompt />
      </body>
    </html>
  );
}