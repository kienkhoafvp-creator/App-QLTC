import { PhieuChiRepo } from "@/3_adapters/repositories/PhieuChiRepo";

export class GetLichSuChiUseCase {
  private repo: PhieuChiRepo;

  constructor() {
    this.repo = new PhieuChiRepo();
  }

  async execute(limit: number | null, loaiChiFilter: string = "", chiTietFilter: string = "") {
    return await this.repo.layLichSuChi(limit, loaiChiFilter, chiTietFilter);
  }
}