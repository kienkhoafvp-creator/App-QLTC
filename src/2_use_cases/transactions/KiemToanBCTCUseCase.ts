import { KiemToanRepo } from "@/3_adapters/repositories/KiemToanRepo";

export class KiemToanBCTCUseCase {
  private repo: KiemToanRepo;

  constructor() {
    this.repo = new KiemToanRepo();
  }

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

    // 1. Lấy thời gian của lần khớp sổ NGAY TRƯỚC ĐÓ để làm mốc bắt đầu
    const lastRecord = await this.repo.layKiemToanGanNhat();
    const thoiGianBatDau = lastRecord ? lastRecord.ngay_kiem_toan : null;

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

    // 2. Lưu biên bản mới -> Lấy được ID và Thời gian kết thúc (thời điểm vừa bấm nút)
    const newKiemToan = await this.repo.luuKiemToan(dbData);

    // 3. Kích hoạt Hàm chốt sổ lấy đúng khoang thời gian
    await this.repo.goiHamChotSo(
      newKiemToan.id, 
      thoiGianBatDau, 
      newKiemToan.ngay_kiem_toan, 
      tuan_thu, 
      nam
    );
  }
}