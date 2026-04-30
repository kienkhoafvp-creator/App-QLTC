import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class ChiTietNguonTienRepo {
  async layChiTietGiaoDich(idNguonThu: string): Promise<{ thu: any[], chi: any[] }> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực.");

    // Kéo 30 phiếu thu gần nhất
    const { data: dataThu, error: errorThu } = await supabase
      .from('phieu_thu')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('id_nguon_thu', idNguonThu)
      .order('thoi_gian', { ascending: false })
      .limit(30);

    if (errorThu) throw new Error(`Lỗi tải phiếu thu: ${errorThu.message}`);

    // Kéo 30 phiếu chi gần nhất
    const { data: dataChi, error: errorChi } = await supabase
      .from('phieu_chi')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('id_nguon_thu', idNguonThu)
      .order('thoi_gian', { ascending: false })
      .limit(30);

    if (errorChi) throw new Error(`Lỗi tải phiếu chi: ${errorChi.message}`);

    return { 
      thu: dataThu || [], 
      chi: dataChi || [] 
    };
  }
}