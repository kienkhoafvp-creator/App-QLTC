import { PhieuThuRepo } from "@/3_adapters/repositories/PhieuThuRepo";

export class DeletePhieuThuUseCase {
  private repo = new PhieuThuRepo();
  async execute(id: string) {
    if (!id) throw new Error("ID không hợp lệ.");
    await this.repo.xoaPhieuThu(id);
  }
}