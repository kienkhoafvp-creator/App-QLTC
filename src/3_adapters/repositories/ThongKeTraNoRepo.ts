import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ThongKeTraNoRepo {
  async layDuLieuBieuDo() {
    // Join với bảng khoan_no để lấy tên khoản nợ
    const { data, error } = await supabase
      .from('chot_tra_no_tuan')
      .select(`
        *,
        khoan_no ( ten_khoan_no )
      `)
      .order('ngay_chot', { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      ...item,
      ten_hien_thi: item.khoan_no?.ten_khoan_no || "N/A"
    }));
  }

  async layDanhSachKhoanNo() {
    const { data } = await supabase.from('khoan_no').select('id, ten_khoan_no');
    return data || [];
  }
}