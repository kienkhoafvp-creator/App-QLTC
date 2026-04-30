import { ThongKeNguonTienRepo } from "@/3_adapters/repositories/ThongKeNguonTienRepo";

export class GetThongKeNguonTienUseCase {
  private repo: ThongKeNguonTienRepo;

  constructor() {
    this.repo = new ThongKeNguonTienRepo();
  }

  async execute() {
    return await this.repo.layDanhSachThongKe();
  }
}