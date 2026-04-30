import { NguonTienRepo } from "@/3_adapters/repositories/NguonTienRepo";

export class CreateNguonTienUseCase {
  private repo: NguonTienRepo;

  constructor() {
    this.repo = new NguonTienRepo();
  }

  async execute(tenNguon: string) {
    if (!tenNguon || tenNguon.trim() === "") {
      throw new Error("Tên nguồn tiền không được để rỗng!");
    }
    
    return await this.repo.taoNguonTien(tenNguon.trim());
  }
}