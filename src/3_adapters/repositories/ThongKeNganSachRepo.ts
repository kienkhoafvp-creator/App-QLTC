import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ThongKeNganSachRepo {
  async layDuLieuBieuDo() {
    const { data, error } = await supabase
      .from('chot_ngan_sach_tuan')
      .select(`
        *,
        ngan_sach ( ten_ngan_sach )
      `)
      .order('ngay_chot', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(item => {
      // FIX: Xử lý trường hợp ngan_sach trả về mảng hoặc đối tượng
      const nganSachObj = Array.isArray(item.ngan_sach) ? item.ngan_sach[0] : item.ngan_sach;
      
      return {
        ...item,
        ten_hien_thi: nganSachObj?.ten_ngan_sach || "Không tên"
      };
    });
  }

  async layDanhSachNganSach() {
    // Chỉ lấy những ngân sách đang hoạt động để làm danh mục cột
    const { data } = await supabase
      .from('ngan_sach')
      .select('id, ten_ngan_sach')
      .eq('trang_thai_xac_thuc', false); // Chỉ lấy ngân sách chưa bị xóa/xác thực
    return data || [];
  }
}