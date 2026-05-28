import { PhieuThuRepo } from "@/3_adapters/repositories/PhieuThuRepo";
import { PhieuThu } from "@/1_domain/models/PhieuThu";

export class CreatePhieuThuUseCase {
  private repo: PhieuThuRepo;

  constructor() {
    this.repo = new PhieuThuRepo();
  }

  async execute(raw_data: { so_tien: number; ly_do_thu: string; nguoi_thu: string; thoi_gian: string; id_nguon_thu: string; hang_muc?: string; chi_tiet_bo_sung?: string; photos?: string[] }) {
    if (raw_data.so_tien <= 0) {
      throw new Error("Số tiền thu phải lớn hơn 0");
    }
    if (!raw_data.id_nguon_thu || raw_data.id_nguon_thu.trim() === "") {
      throw new Error("Bắt buộc phải chọn Nguồn thu");
    }

    const cleanData: PhieuThu = {
      so_tien: raw_data.so_tien,
      ly_do_thu: raw_data.ly_do_thu.trim(),
      nguoi_thu: raw_data.nguoi_thu.trim(),
      thoi_gian: raw_data.thoi_gian || new Date().toISOString(),
      id_nguon_thu: raw_data.id_nguon_thu
    };

    return await this.repo.taoPhieuThu(cleanData);
  }
}