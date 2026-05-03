import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class BCTCRepo {
  async fetchBCTCData(tuan: number, nam: number) {
    // Gọi song song 3 bảng/view bằng Promise.all để tối đa tốc độ
    const [bctcRes, taiSanRes, lichSuRes] = await Promise.all([
      // 1. Lấy BCTC từ BẢNG CHỐT
      supabase.from('chot_bctc_tuan').select('*').eq('tuan', tuan).eq('nam', nam).maybeSingle(),
      
      // 2. Lấy danh sách tài sản và vốn từ VIEW ĐỘNG (Giữ nguyên)
      supabase.from('view_tai_san_tong_quat').select('*'),
      
      // 3. Lấy lịch sử lợi nhuận từ BẢNG CHỐT (Chỉ lấy những nguồn là Tài sản)
      supabase.from('chot_nguon_thu_tuan').select('*').eq('is_tai_san', true)
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