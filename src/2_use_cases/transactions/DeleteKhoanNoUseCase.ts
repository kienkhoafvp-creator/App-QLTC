import { KhoanNoRepo } from "@/3_adapters/repositories/KhoanNoRepo";

export class DeleteKhoanNoUseCase {
  private repo: KhoanNoRepo;

  constructor() {
    this.repo = new KhoanNoRepo();
  }

  async execute(idKhoanNo: string) {
    if (!idKhoanNo) throw new Error("ID Khoản nợ không hợp lệ.");

    // 1. Kiểm tra rào chắn: Đã có giao dịch trả nợ nào chưa?
    const soGiaoDich = await this.repo.demSoPhieuChi(idKhoanNo);
    
    if (soGiaoDich > 0) {
      // Chặn đứng nếu phát hiện có dữ liệu bám vào
      throw new Error("Khoản nợ này đã có lịch sử trả nợ. Bạn phải xóa các phiếu chi liên quan trước khi xóa nợ gốc!");
    }

    // 2. Nếu an toàn (0 giao dịch), tiến hành thiêu rụi
    await this.repo.xoaKhoanNo(idKhoanNo);
  }
}