import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Thói quen - QLTC',
  description: 'App quản lý tài chính cá nhân kích thích Dopamine',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Thói quen - QLTC', // Dòng này ép iOS nhận đúng tên App khi tải về
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

// ... Các dòng code export default function RootLayout bên dưới giữ nguyên

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
