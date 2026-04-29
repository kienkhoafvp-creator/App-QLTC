// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finance GameFi App',
    short_name: 'FinanceApp',
    description: 'Quản lý tài chính cá nhân với trải nghiệm GameFi',
    start_url: '/',
    display: 'standalone', // Bắt buộc: Ẩn thanh URL của trình duyệt, trông giống app thật 100%
    background_color: '#0f172a', // Màu nền lúc app đang load (Phong cách nền tối)
    theme_color: '#3b82f6', // Màu của thanh trạng thái pin/sóng trên điện thoại
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}