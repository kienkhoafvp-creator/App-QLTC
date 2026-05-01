import { NganSachRepo } from "@/3_adapters/repositories/NganSachRepo";
import { NganSach } from "@/1_domain/models/NganSach";

export class CreateNganSachUseCase {
  private repo: NganSachRepo;

  constructor() {
    this.repo = new NganSachRepo();
  }

  // Đã bổ sung tham số thuTu vào đây
  async execute(raw_data: { ten_ngan_sach: string; dinh_muc: number; thoi_gian_bat_dau: string; thoi_gian_ket_thuc: string }, thuTu: number) {
    // 1. Rà soát lỗi đầu vào
    if (!raw_data.ten_ngan_sach || raw_data.ten_ngan_sach.trim() === "") {
      throw new Error("Tên ngân sách không được để trống!");
    }
    if (raw_data.dinh_muc <= 0) {
      throw new Error("Định mức ngân sách phải lớn hơn 0!");
    }
    if (!raw_data.thoi_gian_bat_dau || !raw_data.thoi_gian_ket_thuc) {
      throw new Error("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!");
    }

    // 2. Rà soát lỗi logic ngày tháng
    const startDate = new Date(raw_data.thoi_gian_bat_dau);
    const endDate = new Date(raw_data.thoi_gian_ket_thuc);
    if (endDate <= startDate) {
      throw new Error("Thời gian kết thúc phải diễn ra sau Thời gian bắt đầu!");
    }

    // 3. Đóng gói và đẩy xuống Repo (kèm thu_tu)
    const cleanData: NganSach = {
      ten_ngan_sach: raw_data.ten_ngan_sach.trim(),
      dinh_muc: raw_data.dinh_muc,
      thoi_gian_bat_dau: raw_data.thoi_gian_bat_dau,
      thoi_gian_ket_thuc: raw_data.thoi_gian_ket_thuc,
      thu_tu: thuTu // Truyền thứ tự vào Model
    };

    return await this.repo.taoNganSach(cleanData);
  }
}