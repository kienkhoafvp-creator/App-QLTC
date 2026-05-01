import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";

export class UpdateDinhMucNganSachUseCase {
  private repo: NganSachRepo;

  constructor() {
    this.repo = new NganSachRepo();
  }

  async execute(id: string, dinhMucMoi: number) {
    if (!id) throw new Error("Thiếu mã ngân sách.");
    if (dinhMucMoi < 0) throw new Error("Định mức không được âm.");

    // Gọi hàm cập nhật trực tiếp vào cột định mức
    return await this.repo.capNhatDinhMuc(id, dinhMucMoi);
  }
}