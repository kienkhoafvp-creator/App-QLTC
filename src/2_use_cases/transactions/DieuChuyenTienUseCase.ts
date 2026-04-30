import { DieuChuyenRepo } from "@/3_adapters/repositories/DieuChuyenRepo";

export class DieuChuyenTienUseCase {
  private repo: DieuChuyenRepo;

  constructor() {
    this.repo = new DieuChuyenRepo();
  }

  async execute(soTien: number, denQuy: string) {
    if (soTien <= 0) throw new Error("Số tiền điều chuyển phải lớn hơn 0.");
    if (denQuy !== "DU_PHONG" && denQuy !== "DAU_TU") throw new Error("Mục tiêu điều chuyển không hợp lệ.");
    
    await this.repo.thucHienDieuChuyen(soTien, denQuy);
  }
}