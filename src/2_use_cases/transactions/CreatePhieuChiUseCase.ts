import { PhieuChiRepo } from "@/3_adapters/repositories/PhieuChiRepo";
import { PhieuChi } from "@/1_domain/models/PhieuChi";

export class CreatePhieuChiUseCase {
  private repo: PhieuChiRepo;

  constructor() {
    this.repo = new PhieuChiRepo();
  }

  async execute(raw_data: { so_tien: number; ly_do_chi: string; nguoi_chi: string; thoi_gian: string; mang_chi_id: string }) {
    if (raw_data.so_tien <= 0) throw new Error("Số tiền chi phải lớn hơn 0");
    if (!raw_data.mang_chi_id) throw new Error("Bắt buộc phải chọn chi tiết khoản chi.");

    let id_nguon_thu = null;
    let id_ngan_sach = null;
    let id_khoan_no = null;
    let final_ly_do = raw_data.ly_do_chi.trim();

    // Thuật toán định tuyến dựa trên tiền tố từ giao diện
    if (raw_data.mang_chi_id.startsWith("NS_")) {
      id_ngan_sach = raw_data.mang_chi_id.replace("NS_", "");
    } else if (raw_data.mang_chi_id.startsWith("NO_")) {
      // Gộp chung, chỉ dùng một tiền tố NO_ duy nhất
      id_khoan_no = raw_data.mang_chi_id.replace("NO_", "");
    } else if (raw_data.mang_chi_id.startsWith("NGUON_")) {
      id_nguon_thu = raw_data.mang_chi_id.replace("NGUON_", "");
    }

    const cleanData: PhieuChi = {
      so_tien: raw_data.so_tien,
      ly_do_chi: final_ly_do,
      nguoi_chi: raw_data.nguoi_chi.trim(),
      thoi_gian: raw_data.thoi_gian || new Date().toISOString(),
      id_nguon_thu,
      id_ngan_sach,
      id_khoan_no
    };

    return await this.repo.taoPhieuChi(cleanData);
  }
}