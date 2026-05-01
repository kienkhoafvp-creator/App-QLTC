import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { KhoanNo } from "@/1_domain/models/KhoanNo";

export class KhoanNoRepo {
  async taoKhoanNo(data: KhoanNo): Promise<KhoanNo> {
    const { data: result, error } = await supabase
      .from('khoan_no')
      .insert([{
        ten_khoan_no: data.ten_khoan_no,
        tong_goc_vay: data.tong_goc_vay,
        tong_tien_phai_tra: data.tong_tien_phai_tra,
        id_nguon_gan_no: data.id_nguon_gan_no,
        thu_tu: data.thu_tu // Đẩy thứ tự lên database
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as KhoanNo;
  }

  // Khuyến nghị: Hàm này đang thừa, nên cân nhắc xóa bỏ
  async layDanhSachKhoanNo() {
    const { data, error } = await supabase
      .from('khoan_no')
      .select('*')
      .order('thu_tu', { ascending: true }); // Sắp xếp theo thứ tự
    if (error) throw new Error(error.message);
    return data;
  }
}