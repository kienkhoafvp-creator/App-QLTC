import { ChiTietNguonTienRepo } from "@/3_adapters/repositories/ChiTietNguonTienRepo";

export class GetChiTietNguonTienUseCase {
  private repo: ChiTietNguonTienRepo;

  constructor() {
    this.repo = new ChiTietNguonTienRepo();
  }

  async execute(idNguonThu: string) {
    if (!idNguonThu) throw new Error("Thiếu mã nguồn tiền.");
    return await this.repo.layChiTietGiaoDich(idNguonThu);
  }
}