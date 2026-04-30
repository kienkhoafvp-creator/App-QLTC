// src/4_infrastructure/database/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

// Sử dụng createBrowserClient thay cho createClient
// Hàm này tự động cấu hình lưu thẻ xác thực (session) vào Cookies thay vì LocalStorage
// Nhờ đó, Proxy (Middleware) trên Server có thể đọc được và cho phép đi vào Dashboard
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);