import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { PhieuChi } from "@/1_domain/models/PhieuChi";

export class PhieuChiRepo {
  async taoPhieuChi(data: PhieuChi): Promise<PhieuChi> {
    const { data: result, error } = await supabase
      .from('phieu_chi')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as PhieuChi;
  }

  async layLichSuChi(limit: number | null, loaiChiFilter: string, chiTietFilter: string): Promise<PhieuChi[]> {
    let query = supabase
      .from('phieu_chi')
      .select('*')
      .order('thoi_gian', { ascending: false }); 

    if (limit !== null) {
      query = query.limit(limit);
    }

    if (loaiChiFilter === "KINH_DOANH") {
      if (chiTietFilter) query = query.eq('id_nguon_thu', chiTietFilter);
      else query = query.not('id_nguon_thu', 'is', null);
    } else if (loaiChiFilter === "NGAN_SACH") {
      if (chiTietFilter) query = query.eq('id_ngan_sach', chiTietFilter);
      else query = query.not('id_ngan_sach', 'is', null);
    } else if (loaiChiFilter === "NO") {
      if (chiTietFilter) query = query.eq('id_khoan_no', chiTietFilter);
      else query = query.not('id_khoan_no', 'is', null);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Lỗi tải lịch sử chi: ${error.message}`);
    return data as PhieuChi[];
  }

  // BỔ SUNG LỆNH XÓA PHIẾU CHI
  async xoaPhieuChi(id: string): Promise<void> {
    const { error } = await supabase
      .from('phieu_chi')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Lỗi xóa phiếu chi: ${error.message}`);
  }
}