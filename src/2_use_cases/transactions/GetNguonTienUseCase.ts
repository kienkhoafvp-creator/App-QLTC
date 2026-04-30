import { NguonTienRepo } from "@/3_adapters/repositories/NguonTienRepo";

export class GetNguonTienUseCase {
  async execute() {
    const repo = new NguonTienRepo();
    return await repo.layDanhSachNguonTien();
  }
}