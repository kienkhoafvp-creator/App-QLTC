import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class CreateNguonTienUseCase {
  async execute(tenNguon: string, thuTu: number) {
    if (!tenNguon.trim()) throw new Error("Tên nguồn tiền không được để trống.");

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Chưa xác thực người dùng.");

    // Ghi thẳng xuống Database kèm theo số thứ tự
    const { error } = await supabase
      .from('nguon_tien')
      .insert({ 
        ten_nguon: tenNguon.trim(),
        thu_tu: thuTu,
        user_id: authData.user.id 
      });

    if (error) throw new Error(`Lỗi khởi tạo nguồn tiền: ${error.message}`);
  }
}