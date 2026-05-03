import { KhoanNoRepo } from "@/3_adapters/repositories/KhoanNoRepo";

export class CreateKhoanNoUseCase {
  private repo: KhoanNoRepo;

  constructor() {
    this.repo = new KhoanNoRepo();
  }

  // ĐÃ SỬA LỖI: Thêm "| null" vào kiểu dữ liệu của id_nguon_gan_no
  async execute(raw_data: { ten_khoan_no: string; tong_goc_vay: number; tong_tien_phai_tra: number; id_nguon_gan_no: string | null }, thuTu: number) {
    if (raw_data.tong_goc_vay <= 0) throw new Error("Tổng gốc vay phải lớn hơn 0");
    if (raw_data.tong_tien_phai_tra < raw_data.tong_goc_vay) throw new Error("Lỗi: Tổng tiền phải trả không được nhỏ hơn Gốc vay ban đầu.");

    const cleanData = {
      ten_khoan_no: raw_data.ten_khoan_no.trim(),
      tong_goc_vay: raw_data.tong_goc_vay,
      tong_tien_phai_tra: raw_data.tong_tien_phai_tra,
      id_nguon_gan_no: raw_data.id_nguon_gan_no,
      thu_tu: thuTu // Truyền thứ tự sang Repo
    };

    return await this.repo.taoKhoanNo(cleanData);
  }
}