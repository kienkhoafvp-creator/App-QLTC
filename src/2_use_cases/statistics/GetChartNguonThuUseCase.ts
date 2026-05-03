import { ThongKeNguonThuChartRepo } from "@/3_adapters/repositories/ThongKeNguonThuChartRepo";

export class GetChartNguonThuUseCase {
  private repo: ThongKeNguonThuChartRepo;

  constructor() {
    this.repo = new ThongKeNguonThuChartRepo();
  }

  async execute() {
    const [rawData, danhSachNguon] = await Promise.all([
      this.repo.layDuLieuBieuDo(),
      this.repo.layDanhSachNguonHienTai()
    ]);

    const chartDataMap = new Map<string, any>();
    const tenCacNguonHienTai = danhSachNguon.map(n => n.ten_nguon);

    rawData.forEach(row => {
      if (!row.id_kiem_toan) return;

      const date = new Date(row.ngay_chot);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const shortYear = row.nam.toString().slice(-2);
      
      // Trục hoành: Tuần 42/26
      const xAxisLabel = `Tuần ${row.tuan}/${shortYear}`;

      if (!chartDataMap.has(row.id_kiem_toan)) {
        chartDataMap.set(row.id_kiem_toan, {
          name: xAxisLabel,
          sortTime: date.getTime()
        });
      }

      // Xoay ngang: Ép lợi nhuận vào tên cột tương ứng
      const record = chartDataMap.get(row.id_kiem_toan);
      record[row.ten_nguon] = Number(row.loi_nhuan);
    });

    // Ép mảng và sắp xếp theo thời gian chốt
    const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.sortTime - b.sortTime);

    // Điền khuyết (Fill Zero) cho các nguồn bị vắng mặt trong tuần
    chartData.forEach(record => {
      tenCacNguonHienTai.forEach(name => {
        if (record[name] === undefined) {
          record[name] = 0;
        }
      });
    });

    return { chartData, danhSachNguon };
  }
}