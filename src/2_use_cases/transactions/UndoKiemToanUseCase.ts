import { KiemToanRepo } from "@/3_adapters/repositories/KiemToanRepo";

export class UndoKiemToanUseCase {
  private repo: KiemToanRepo;

  constructor() {
    this.repo = new KiemToanRepo();
  }

  async execute() {
    // 1. Tìm bản ghi vừa chốt
    const lastRecord = await this.repo.layKiemToanGanNhat();
    
    if (!lastRecord) {
      throw new Error("Hệ thống trống: Không tìm thấy đợt kiểm toán nào gần đây để hủy!");
    }

    // 2. Kích hoạt hủy diệt
    await this.repo.xoaKiemToan(
      lastRecord.id,
      lastRecord.id_phieu_chi_dieu_chinh,
      lastRecord.id_phieu_thu_dieu_chinh
    );
  }
}