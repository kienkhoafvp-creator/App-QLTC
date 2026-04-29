// next.config.mjs
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Tắt PWA lúc đang code (development) để bạn không bị lỗi lưu cache cũ, chỉ bật khi đẩy lên Vercel Live
  disable: process.env.NODE_ENV === "development", 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withSerwist(nextConfig);