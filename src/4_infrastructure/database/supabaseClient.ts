// src/4_infrastructure/database/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// DÒNG NÀY ĐỂ BẮT TẬN TAY HUNG THỦ:
if (typeof window !== 'undefined') {
  console.log("🔥 URL THỰC TẾ TRÊN TRÌNH DUYỆT:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);