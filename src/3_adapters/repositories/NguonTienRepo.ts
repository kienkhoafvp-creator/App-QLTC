import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { NguonTien } from "@/1_domain/models/NguonTien";

export class NguonTienRepo {
  async taoNguonTien(tenNguon: string): Promise<NguonTien> {
    const { data, error } = await supabase
      .from('nguon_tien')
      .insert([{ ten_nguon: tenNguon }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message); // Quăng lỗi nếu RLS chặn hoặc rớt mạng
    }
    
    return data as NguonTien;
  }
  async layDanhSachNguonTien(): Promise<NguonTien[]> {
    const { data, error } = await supabase
      .from('nguon_tien')
      .select('*')
      .order('ngay_tao', { ascending: false });

    if (error) throw new Error(error.message);
    return data as NguonTien[];
  }
}