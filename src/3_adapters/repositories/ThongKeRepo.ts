import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ThongKeRepo {
  
  // Kéo dữ liệu từ VIEW tính tổng Thu - Chi
  async laySoDuViTien(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('sum_thong_ke_vi_tien')
      .select('sum_so_du_vi')
      .eq('user_id', userId)
      .single();

    // Nếu người dùng mới chưa có phiếu thu chi nào, VIEW có thể không trả về dòng nào,
    // hoặc Supabase báo lỗi PGRST116 (No rows found). Lúc này ta trả về 0.
    if (error || !data) return 0;
    
    return data.sum_so_du_vi;
  }

  // Kéo dữ liệu từ bảng vật lý lưu 2 Quỹ
  async laySoDuCacQuy(userId: string) {
    const { data, error } = await supabase
      .from('sum_quy_tich_luy')
      .select('sum_quy_du_phong, sum_quy_dau_tu')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return {
        duPhong: 0,
        dauTu: 0
      };
    }

    return {
      duPhong: data.sum_quy_du_phong,
      dauTu: data.sum_quy_dau_tu
    };
  }
}