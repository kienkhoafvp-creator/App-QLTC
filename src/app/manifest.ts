// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thói quen - QLTC',
    short_name: 'Thói quen - QLTC',
    description: 'Quản lý tài chính cá nhân với trải nghiệm GameFi',
    start_url: '/',
    display: 'standalone', // Bắt buộc: Ẩn thanh URL của trình duyệt
    background_color: '#0f172a',
    theme_color: '#3b82f6',
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