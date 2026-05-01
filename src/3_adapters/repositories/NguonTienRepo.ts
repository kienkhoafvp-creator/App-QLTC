import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { NguonTien } from "@/1_domain/models/NguonTien";

export class NguonTienRepo {
  // Đã bổ sung tham số thu_tu để lưu đồng bộ với UI
  async taoNguonTien(tenNguon: string, thuTu?: number): Promise<NguonTien> {
    const { data, error } = await supabase
      .from('nguon_tien')
      .insert([{ ten_nguon: tenNguon, thu_tu: thuTu || 0 }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message); 
    }
    
    return data as NguonTien;
  }

  async layDanhSachNguonTien(): Promise<NguonTien[]> {
    const { data, error } = await supabase
      .from('nguon_tien')
      .select('*')
      .order('thu_tu', { ascending: true }); // Sửa lại order theo thu_tu

    if (error) throw new Error(error.message);
    return data as NguonTien[];
  }

  // HÀM MỚI 1: Quét tổng lực đếm giao dịch ở 4 bảng liên quan
  async demSoGiaoDich(idNguon: string): Promise<number> {
    const { count: cThu } = await supabase.from('phieu_thu').select('*', { count: 'exact', head: true }).eq('id_nguon_thu', idNguon);
    const { count: cChi } = await supabase.from('phieu_chi').select('*', { count: 'exact', head: true }).eq('id_nguon_thu', idNguon);
    const { count: cNo } = await supabase.from('khoan_no').select('*', { count: 'exact', head: true }).eq('id_nguon_gan_no', idNguon);
    const { count: cDT } = await supabase.from('giao_dich_dau_tu').select('*', { count: 'exact', head: true }).eq('id_nguon_thu', idNguon);

    return (cThu || 0) + (cChi || 0) + (cNo || 0) + (cDT || 0);
  }

  // HÀM MỚI 2: Xóa cứng nguồn tiền
  async xoaNguonTien(idNguon: string): Promise<void> {
    const { error } = await supabase
      .from('nguon_tien')
      .delete()
      .eq('id', idNguon);

    if (error) throw new Error(`Lỗi khi xóa nguồn tiền: ${error.message}`);
  }
}