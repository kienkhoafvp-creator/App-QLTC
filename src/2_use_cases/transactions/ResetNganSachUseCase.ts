import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";
import { CreateNganSachUseCase } from "./CreateNganSachUseCase";

export class ResetNganSachUseCase {
  private repo: NganSachRepo;
  private createUseCase: CreateNganSachUseCase;

  constructor() {
    this.repo = new NganSachRepo();
    this.createUseCase = new CreateNganSachUseCase();
  }

  // Thuật toán: Nhận ID cũ để đóng, nhận Dữ liệu mới và Thứ tự cũ để tạo mới cùng vị trí
  async execute(idCu: string, dataMoi: { ten_ngan_sach: string; dinh_muc: number; thoi_gian_bat_dau: string; thoi_gian_ket_thuc: string }, thuTuCu: number) {
    if (!idCu) throw new Error("Không tìm thấy ID ngân sách cũ!");

    // 1. Đóng ngân sách cũ (Chuyển trang_thai_xac_thuc thành true)
    await this.repo.dongNganSach(idCu);

    // 2. Tái sử dụng CreateUseCase để tạo mới, kế thừa lại đúng thuTuCu
    return await this.createUseCase.execute(dataMoi, thuTuCu);
  }
}