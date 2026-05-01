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

  // HÀM MỚI: Khóa ngân sách cũ lại để đưa vào lịch sử
  async dongNganSach(id: string): Promise<void> {
    const { error } = await supabase
      .from('ngan_sach')
      .update({ trang_thai_xac_thuc: true })
      .eq('id', id);

    if (error) throw new Error(`Lỗi đóng ngân sách: ${error.message}`);
  }

  async layDanhSachNganSach() {
    const { data, error } = await supabase
      .from('ngan_sach')
      .select('*')
      .order('thu_tu', { ascending: true }); 
    if (error) throw new Error(error.message);
    return data;
  }
}