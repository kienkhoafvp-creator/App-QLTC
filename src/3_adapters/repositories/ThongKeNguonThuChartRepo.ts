import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ThongKeNguonThuChartRepo {
  async layDuLieuBieuDo() {
    const { data, error } = await supabase
      .from('view_chart_nguon_thu_tuan')
      .select('*');

    if (error) throw new Error("Lỗi tải dữ liệu biểu đồ từ View: " + error.message);
    return data || [];
  }

  async layDanhSachNguonHienTai() {
    const { data, error } = await supabase
      .from('nguon_tien')
      .select('id, ten_nguon')
      .order('thu_tu', { ascending: true });

    if (error) throw new Error("Lỗi tải danh sách nguồn: " + error.message);
    return data || [];
  }
}