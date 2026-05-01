import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { PhieuThu } from "@/1_domain/models/PhieuThu";

export class PhieuThuRepo {
  async taoPhieuThu(data: PhieuThu): Promise<PhieuThu> {
    const { data: result, error } = await supabase
      .from('phieu_thu')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as PhieuThu;
  }

  async layLichSuThu(limit: number | null, idNguonThu: string): Promise<PhieuThu[]> {
    let query = supabase
      .from('phieu_thu')
      .select('*')
      .order('thoi_gian', { ascending: false }); 

    if (idNguonThu && idNguonThu !== "") {
      query = query.eq('id_nguon_thu', idNguonThu);
    }

    if (limit !== null) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Lỗi tải lịch sử thu: ${error.message}`);
    return data as PhieuThu[];
  }

  // BỔ SUNG LỆNH XÓA PHIẾU THU
  async xoaPhieuThu(id: string): Promise<void> {
    const { error } = await supabase
      .from('phieu_thu')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Lỗi xóa phiếu thu: ${error.message}`);
  }
}