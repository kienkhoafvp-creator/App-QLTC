import { ThongKeRepo } from "@/3_adapters/repositories/ThongKeRepo";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class GetThongKeSoDuUseCase {
  private repo: ThongKeRepo;

  constructor() {
    this.repo = new ThongKeRepo();
  }

  async execute() {
    // 1. Lấy ID người dùng hiện tại
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error("Không thể xác thực người dùng để lấy thống kê.");
    }
    const userId = authData.user.id;

    // 2. Kéo song song cả 2 luồng dữ liệu cho nhanh
    const [viTien, cacQuy] = await Promise.all([
      this.repo.laySoDuViTien(userId),
      this.repo.laySoDuCacQuy(userId)
    ]);

    // 3. Trả về format chuẩn cho Giao diện
    return {
      viTien: viTien,
      duPhong: cacQuy.duPhong,
      dauTu: cacQuy.dauTu
    };
  }
}