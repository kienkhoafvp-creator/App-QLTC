import { KhoanNoRepo } from "@/3_adapters/repositories/KhoanNoRepo";
import { KhoanNo } from "@/1_domain/models/KhoanNo";

export class CreateKhoanNoUseCase {
  private repo: KhoanNoRepo;

  constructor() {
    this.repo = new KhoanNoRepo();
  }

  async execute(raw_data: { ten_khoan_no: string; tong_goc_vay: number; tien_tra_dinh_ky: number; lai_suat_percent: number; id_nguon_gan_no: string }) {
    if (!raw_data.ten_khoan_no || raw_data.ten_khoan_no.trim() === "") {
      throw new Error("Tên khoản nợ không được để trống!");
    }
    if (raw_data.tong_goc_vay <= 0) {
      throw new Error("Tổng gốc vay phải lớn hơn 0!");
    }

    // Xử lý logic: Nếu chọn "Nợ tiêu dùng", giá trị gửi xuống DB sẽ là null
    const finalNguonGanNo = raw_data.id_nguon_gan_no === "NO_TIEU_DUNG" ? null : raw_data.id_nguon_gan_no;

    const cleanData: KhoanNo = {
      ten_khoan_no: raw_data.ten_khoan_no.trim(),
      tong_goc_vay: raw_data.tong_goc_vay,
      tien_tra_dinh_ky: raw_data.tien_tra_dinh_ky,
      lai_suat_percent: raw_data.lai_suat_percent,
      id_nguon_gan_no: finalNguonGanNo
    };

    return await this.repo.taoKhoanNo(cleanData);
  }
}