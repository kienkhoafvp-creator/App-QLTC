import { PhieuChiRepo } from "@/3_adapters/repositories/PhieuChiRepo";

export class DeletePhieuChiUseCase {
  private repo = new PhieuChiRepo();
  async execute(id: string) {
    if (!id) throw new Error("ID không hợp lệ.");
    await this.repo.xoaPhieuChi(id);
  }
}