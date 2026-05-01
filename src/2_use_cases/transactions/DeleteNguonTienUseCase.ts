import { NguonTienRepo } from "@/3_adapters/repositories/NguonTienRepo";

export class DeleteNguonTienUseCase {
  private repo: NguonTienRepo;

  constructor() {
    this.repo = new NguonTienRepo();
  }

  async execute(idNguon: string) {
    if (!idNguon) throw new Error("ID Nguồn tiền không hợp lệ.");

    // 1. Kiểm tra rào chắn an toàn
    const soGiaoDich = await this.repo.demSoGiaoDich(idNguon);
    
    if (soGiaoDich > 0) {
      throw new Error("Nguồn tiền này đã có chứa dữ liệu luân chuyển (Thu/Chi/Nợ/Đầu tư). Bắt buộc phải làm sạch các giao dịch liên quan trước khi xóa Nguồn Tiền!");
    }

    // 2. Nếu sạch (0 giao dịch), tiến hành xóa
    await this.repo.xoaNguonTien(idNguon);
  }
}