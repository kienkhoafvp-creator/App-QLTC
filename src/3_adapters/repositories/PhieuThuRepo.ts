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
}