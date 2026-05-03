import { KiemToanRepo } from "@/3_adapters/repositories/KiemToanRepo";

export class UndoKiemToanUseCase {
  private repo: KiemToanRepo;

  constructor() {
    this.repo = new KiemToanRepo();
  }

  async execute() {
    // 1. Tìm bản ghi (kỳ kiểm toán) vừa chốt gần nhất
    const lastRecord = await this.repo.layKiemToanGanNhat();
    
    if (!lastRecord) {
      throw new Error("Hệ thống trống: Không tìm thấy đợt kiểm toán nào gần đây để hủy!");
    }

    // 2. KÍCH HOẠT HỦY BẢNG CHỐT TRÊN DATABASE
    // Truyền thẳng ID của đợt kiểm toán xuống để xóa chính xác các dòng thuộc về kỳ này
    await this.repo.goiHamUndoChotSo(lastRecord.id);

    // 3. Xóa biên bản kiểm toán và thu hồi dòng tiền (xóa phiếu thu/chi điều chỉnh)
    await this.repo.xoaKiemToan(
      lastRecord.id,
      lastRecord.id_phieu_chi_dieu_chinh,
      lastRecord.id_phieu_thu_dieu_chinh
    );
  }
}