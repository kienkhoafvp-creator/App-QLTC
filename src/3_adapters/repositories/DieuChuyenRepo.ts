import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class DieuChuyenRepo {
  async thucHienDieuChuyen(soTien: number, denQuy: string): Promise<void> {
    const { error } = await supabase.rpc('dieu_chuyen_tien', {
      p_so_tien: soTien,
      p_den_quy: denQuy
    });
    if (error) throw new Error(`Giao dịch thất bại: ${error.message}`);
  }

  async thucHienRutDuPhong(soTien: number, lyDo: string, nguoiRut: string): Promise<void> {
    const { error } = await supabase.rpc('rut_tien_du_phong', {
      p_so_tien: soTien,
      p_ly_do: lyDo,
      p_nguoi_rut: nguoiRut
    });
    if (error) throw new Error(`Rút tiền thất bại: ${error.message}`);
  }

  // HÀM MỚI BỔ SUNG: Chức năng Đầu Tư
  async thucHienDauTu(soTien: number, lyDo: string, nguoiThucHien: string, idNguonThu: string): Promise<void> {
    const { error } = await supabase.rpc('rut_quy_dau_tu', {
      p_so_tien: soTien,
      p_ly_do: lyDo,
      p_nguoi_thuc_hien: nguoiThucHien,
      p_id_nguon_thu: idNguonThu
    });
    if (error) throw new Error(`Giải ngân đầu tư thất bại: ${error.message}`);
  }
}