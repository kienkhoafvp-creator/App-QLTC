import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class DieuChuyenRepo {
  async thucHienDieuChuyen(soTien: number, denQuy: string): Promise<void> {
    const { error } = await supabase.rpc('dieu_chuyen_tien', {
      p_so_tien: soTien,
      p_den_quy: denQuy
    });

    if (error) {
      throw new Error(`Giao dịch thất bại: ${error.message}`);
    }
  }
}