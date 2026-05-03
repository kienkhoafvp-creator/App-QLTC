import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class BCTCRepo {
  async fetchBCTCData(tuan: number, nam: number) {
    // Gọi song song 3 View bằng Promise.all để tối đa tốc độ
    const [bctcRes, taiSanRes, lichSuRes] = await Promise.all([
      // Lấy đúng 1 dòng BCTC của tuần đang xét (dùng maybeSingle để không lỗi nếu tuần đó chưa có dữ liệu)
      supabase.from('view_bctc_tuan').select('*').eq('tuan', tuan).eq('nam', nam).maybeSingle(),
      // Lấy danh sách tài sản và vốn
      supabase.from('view_tai_san_tong_quat').select('*'),
      // Lấy lịch sử lợi nhuận theo từng tuần của tất cả tài sản
      supabase.from('view_tai_san_tuan').select('*')
    ]);

    if (bctcRes.error) throw bctcRes.error;
    if (taiSanRes.error) throw taiSanRes.error;
    if (lichSuRes.error) throw lichSuRes.error;

    return {
      bctc: bctcRes.data, // Là 1 Object hoặc null
      taiSanList: taiSanRes.data || [],
      lichSuList: lichSuRes.data || []
    };
  }
}