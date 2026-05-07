import { ThongKeNguonThuChartRepo } from "@/3_adapters/repositories/ThongKeNguonThuChartRepo";

export class GetChartNguonThuUseCase {
  private repo: ThongKeNguonThuChartRepo;

  constructor() {
    this.repo = new ThongKeNguonThuChartRepo();
  }

  // THÊM: Tham số groupBy để phân loại Tuần / Tháng / Năm
  async execute(groupBy: 'tuan' | 'thang' | 'nam' = 'tuan') {
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
      
      let key = "";
      let xAxisLabel = "";

      // PHÂN LOẠI NHÓM THỜI GIAN
      if (groupBy === 'tuan') {
        key = row.id_kiem_toan;
        xAxisLabel = `Tuần ${row.tuan}/${shortYear}`;
      } else if (groupBy === 'thang') {
        key = `${row.nam}-${month}`;
        xAxisLabel = `Tháng ${month}/${shortYear}`;
      } else if (groupBy === 'nam') {
        key = `${row.nam}`;
        xAxisLabel = `Năm ${row.nam}`;
      }

      if (!chartDataMap.has(key)) {
        chartDataMap.set(key, {
          name: xAxisLabel,
          sortTime: date.getTime()
        });
      }

      // SỬA LỖI: Khi gom theo Tháng/Năm, phải CỘNG DỒN số tiền của các tuần lại với nhau
      const record = chartDataMap.get(key);
      const currentLoiNhuan = record[row.ten_nguon] || 0;
      record[row.ten_nguon] = currentLoiNhuan + Number(row.loi_nhuan);
    });

    // Ép mảng và sắp xếp theo thời gian
    const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.sortTime - b.sortTime);

    // Điền khuyết (Fill Zero)
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