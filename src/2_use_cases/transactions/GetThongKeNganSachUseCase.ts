import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class GetThongKeNganSachUseCase {
  async execute() {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    const { data, error } = await supabase
      .from('sum_thong_ke_ngan_sach')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('thu_tu', { ascending: true }); // Sắp xếp theo STT

    if (error) throw new Error(error.message);
    return data || [];
  }
}