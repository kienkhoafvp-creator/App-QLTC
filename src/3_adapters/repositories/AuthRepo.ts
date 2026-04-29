// src/3_adapters/repositories/AuthRepo.ts
import { supabase } from '../../4_infrastructure/database/supabaseClient';

export const AuthRepo = {
  // Đăng ký
  async register(email: string, password: string, fullName: string, username: string, phone: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username, phone }, // Đẩy data thô vào Metadata
      },
    });
    if (error) throw new Error(error.message);
    return data;
  },

  // Đăng nhập đa năng (Email / Username / SĐT)
  async login(identifier: string, password: string) {
    // 1. Gọi DB để lấy Email chuẩn (Dựa vào hàm SQL ta vừa tạo)
    const { data: emailData, error: rpcError } = await supabase.rpc('get_email_by_identifier', { identifier });
    
    if (rpcError || !emailData) {
      throw new Error("Không tìm thấy tài khoản với thông tin này!");
    }

    // 2. Tiến hành đăng nhập bằng Email lấy được
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailData,
      password,
    });
    
    if (error) throw new Error("Mật khẩu không chính xác!");
    return data;
  },
};