import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class GetChiTietNganSachUseCase {
  async execute(idNganSach: string) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    // Chỉ kéo 30 phiếu chi gần nhất để tránh lag máy
    const { data, error } = await supabase
      .from('phieu_chi')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('id_ngan_sach', idNganSach)
      .order('thoi_gian', { ascending: false })
      .limit(30);

    if (error) throw new Error(error.message);
    return data || [];
  }
}