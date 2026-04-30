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
}