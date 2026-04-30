import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { NganSach } from "@/1_domain/models/NganSach";

export class NganSachRepo {
  async taoNganSach(data: NganSach): Promise<NganSach> {
    const { data: result, error } = await supabase
      .from('ngan_sach')
      .insert([{ 
        ten_ngan_sach: data.ten_ngan_sach,
        dinh_muc: data.dinh_muc,
        thoi_gian_bat_dau: data.thoi_gian_bat_dau,
        thoi_gian_ket_thuc: data.thoi_gian_ket_thuc
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    
    return result as NganSach;
  }
}