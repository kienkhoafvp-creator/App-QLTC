import { PhieuThuRepo } from "@/3_adapters/repositories/PhieuThuRepo";

export class GetLichSuThuUseCase {
  private repo: PhieuThuRepo;

  constructor() {
    this.repo = new PhieuThuRepo();
  }

  async execute(limit: number | null, idNguonThu: string) {
    return await this.repo.layLichSuThu(limit, idNguonThu);
  }
}