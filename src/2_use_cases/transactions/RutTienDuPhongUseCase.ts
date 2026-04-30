import { DieuChuyenRepo } from "@/3_adapters/repositories/DieuChuyenRepo";

export class RutTienDuPhongUseCase {
  private repo: DieuChuyenRepo;

  constructor() {
    this.repo = new DieuChuyenRepo();
  }

  async execute(soTien: number, lyDo: string, nguoiRut: string) {
    if (soTien <= 0) throw new Error("Số tiền rút phải lớn hơn 0.");
    if (!lyDo.trim()) throw new Error("Hãy nhập lý do rút tiền để đối soát sau này.");
    if (!nguoiRut.trim()) throw new Error("Hãy nhập tên người rút.");

    await this.repo.thucHienRutDuPhong(soTien, lyDo.trim(), nguoiRut.trim());
  }
}