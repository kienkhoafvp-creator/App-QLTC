import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { KhoanNo } from "@/1_domain/models/KhoanNo";

export class KhoanNoRepo {
  async taoKhoanNo(data: KhoanNo): Promise<KhoanNo> {
    const { data: result, error } = await supabase
      .from('khoan_no')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as KhoanNo;
  }
}