import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ThongKeNguonTienRepo {
  async layDanhSachThongKe(): Promise<any[]> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    const { data, error } = await supabase
      .from('sum_thong_ke_nguon_tien')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('thu_tu', { ascending: true });

    if (error) throw new Error(`Lỗi tải thống kê nguồn: ${error.message}`);
    return data || [];
  }
}