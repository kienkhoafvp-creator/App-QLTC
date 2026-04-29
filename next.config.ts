import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Tắt PWA lúc đang code (development) để không bị lỗi lưu cache cũ
  disable: process.env.NODE_ENV === "development", 
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tắt luồng worker chạy ngầm để khắc phục triệt để lỗi tràn RAM "WorkerError" trên Vercel
    webpackBuildWorker: false,
  },
};

export default withSerwist(nextConfig);