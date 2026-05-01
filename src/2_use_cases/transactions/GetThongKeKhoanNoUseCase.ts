import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class GetThongKeKhoanNoUseCase {
  async execute() {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    const { data, error } = await supabase
      .from('sum_thong_ke_khoan_no')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('thu_tu', { ascending: true }); // Đổi từ ngay_tao sang thu_tu

    if (error) throw new Error(error.message);
    return data || [];
  }
}