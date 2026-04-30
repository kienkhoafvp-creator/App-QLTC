import { DieuChuyenRepo } from "@/3_adapters/repositories/DieuChuyenRepo";

export class GiaoDichDauTuUseCase {
  private repo: DieuChuyenRepo;

  constructor() {
    this.repo = new DieuChuyenRepo();
  }

  async execute(soTien: number, lyDo: string, nguoiThucHien: string, idNguonThu: string) {
    if (soTien <= 0) throw new Error("Số tiền giải ngân đầu tư phải lớn hơn 0.");
    if (!lyDo.trim()) throw new Error("Hãy nhập lý do/dự án đầu tư.");
    if (!nguoiThucHien.trim()) throw new Error("Hãy nhập tên người thực hiện.");
    if (!idNguonThu) throw new Error("Bắt buộc phải chọn Nguồn Thu mục tiêu để đầu tư.");

    await this.repo.thucHienDauTu(soTien, lyDo.trim(), nguoiThucHien.trim(), idNguonThu);
  }
}