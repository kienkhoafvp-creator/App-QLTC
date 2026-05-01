import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";

export class DeleteNganSachUseCase {
  private repo: NganSachRepo;

  constructor() {
    this.repo = new NganSachRepo();
  }

  async execute(idNganSach: string) {
    if (!idNganSach) throw new Error("ID Ngân sách không hợp lệ.");

    // 1. Kiểm tra rào chắn: Đã có xuất quỹ nào chưa?
    const soGiaoDich = await this.repo.demSoPhieuChi(idNganSach);
    
    if (soGiaoDich > 0) {
      throw new Error("Ngân sách này đã có lịch sử xuất quỹ. Bạn phải xóa các phiếu chi liên quan trước khi xóa ngân sách!");
    }

    // 2. Nếu an toàn (0 giao dịch), tiến hành xóa
    await this.repo.xoaNganSach(idNganSach);
  }
}