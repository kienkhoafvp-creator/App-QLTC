import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { NganSach } from "@/1_domain/models/NganSach";

export class NganSachRepo {
  async taoNganSach(data: NganSach): Promise<NganSach> {
    const { data: result, error } = await supabase
      .from('ngan_sach')
      .insert([{ 
        ten_ngan_sach: data.ten_ngan_sach,
        dinh_muc: data.dinh_muc,
        thoi_gian_bat_dau: data.thoi_gian_bat_dau,
        thoi_gian_ket_thuc: data.thoi_gian_ket_thuc,
        thu_tu: data.thu_tu
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as NganSach;
  }

  async capNhatDinhMuc(id: string, dinhMucMoi: number): Promise<void> {
    const { error } = await supabase
      .from('ngan_sach')
      .update({ dinh_muc: dinhMucMoi })
      .eq('id', id);

    if (error) throw new Error(`Lỗi cập nhật định mức: ${error.message}`);
  }

  async dongNganSach(id: string): Promise<void> {
    const { error } = await supabase
      .from('ngan_sach')
      .update({ trang_thai_xac_thuc: true })
      .eq('id', id);

    if (error) throw new Error(`Lỗi đóng ngân sách: ${error.message}`);
  }

  // HÀM MỚI 1: Đếm số lượng phiếu chi gắn với ngân sách
  async demSoPhieuChi(idNganSach: string): Promise<number> {
    const { count, error } = await supabase
      .from('phieu_chi')
      .select('*', { count: 'exact', head: true })
      .eq('id_ngan_sach', idNganSach);

    if (error) throw new Error(`Lỗi kiểm tra giao dịch: ${error.message}`);
    return count || 0;
  }

  // HÀM MỚI 2: Xóa cứng ngân sách
  async xoaNganSach(idNganSach: string): Promise<void> {
    const { error } = await supabase
      .from('ngan_sach')
      .delete()
      .eq('id', idNganSach);

    if (error) throw new Error(`Lỗi khi xóa ngân sách: ${error.message}`);
  }

  // Khuyến nghị: Hàm này đang thừa (do đã dùng View ở UseCase), có thể xóa bỏ
  async layDanhSachNganSach() {
    const { data, error } = await supabase
      .from('ngan_sach')
      .select('*')
      .order('thu_tu', { ascending: true }); 
    if (error) throw new Error(error.message);
    return data;
  }
}