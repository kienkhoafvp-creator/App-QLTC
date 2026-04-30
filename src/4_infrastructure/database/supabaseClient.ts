import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,       // BẮT BUỘC: Lưu thông tin vào trình duyệt
      autoRefreshToken: true,    // BẮT BUỘC: Tự động đổi vé mới khi vé cũ hết hạn
      detectSessionInUrl: true,
      storageKey: 'finance-app-v1' // Đặt tên cho "két sắt" trên trình duyệt của bạn
    }
  }
)