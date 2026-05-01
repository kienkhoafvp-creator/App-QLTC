import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class GetChiTietKhoanNoUseCase {
  async execute(idKhoanNo: string) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    const { data, error } = await supabase
      .from('phieu_chi')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('id_khoan_no', idKhoanNo)
      .order('thoi_gian', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
}