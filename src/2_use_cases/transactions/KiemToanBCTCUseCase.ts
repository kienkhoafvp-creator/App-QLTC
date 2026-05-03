import { KiemToanRepo } from "@/3_adapters/repositories/KiemToanRepo";

export class KiemToanBCTCUseCase {
  private repo: KiemToanRepo;

  constructor() {
    this.repo = new KiemToanRepo();
  }

  // Thuật toán tự động tính ra tuần hiện tại trong năm
  private getWeekNumber(d: Date): [number, number] {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return [date.getUTCFullYear(), weekNo];
  }

  async execute(payload: { tongHeThong: number, tongThucTe: number, chenhLech: number, chiTiet: any[] }) {
    const [nam, tuan_thu] = this.getWeekNumber(new Date());

    // Ép kiểu mảng tài khoản thành chuẩn JSONB của Database
    const chi_tiet_phan_bo = payload.chiTiet.map(acc => ({
      tai_khoan: acc.name.trim(),
      so_tien: parseFloat(acc.amount.replace(/,/g, "")) || 0
    }));

    const dbData = {
      nam,
      tuan_thu,
      tong_tien_he_thong: payload.tongHeThong,
      tong_tien_thuc_te: payload.tongThucTe,
      chenh_lech: payload.chenhLech,
      chi_tiet_phan_bo
    };

    await this.repo.luuKiemToan(dbData);
  }
}