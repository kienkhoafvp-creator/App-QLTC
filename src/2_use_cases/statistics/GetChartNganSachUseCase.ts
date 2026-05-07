import { ThongKeNganSachRepo } from "@/3_adapters/repositories/ThongKeNganSachRepo";

export class GetChartNganSachUseCase {
  private repo = new ThongKeNganSachRepo();

  async execute(groupBy: 'tuan' | 'thang' | 'nam' = 'tuan') {
    const [rawData, danhSachGoc] = await Promise.all([
      this.repo.layDuLieuBieuDo(),
      this.repo.layDanhSachNganSach()
    ]);

    // BƯỚC QUAN TRỌNG: Tạo bản đồ ID -> Tên
    const nameMap = new Map<string, string>();
    danhSachGoc.forEach(n => nameMap.set(n.id, n.ten_ngan_sach));

    const chartDataMap = new Map<string, any>();
    const tenCacCotChuan = danhSachGoc.map(n => n.ten_ngan_sach);

    rawData.forEach(row => {
      const date = new Date(row.ngay_chot);
      const shortYear = row.nam.toString().slice(-2);
      let key = ""; 
      let label = "";

      if (groupBy === 'tuan') {
        key = row.id_kiem_toan || `tuan-${row.tuan}-${row.nam}`;
        label = `T${row.tuan}/${shortYear}`;
      } else if (groupBy === 'thang') {
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        key = `${row.nam}-${m}`;
        label = `Thg ${m}/${shortYear}`;
      } else {
        key = `${row.nam}`;
        label = `Năm ${row.nam}`;
      }

      if (!chartDataMap.has(key)) {
        chartDataMap.set(key, { 
          name: label, 
          sortTime: date.getTime()
        });
      }

      const record = chartDataMap.get(key);
      
      // LẤY TÊN CHUẨN TỪ ID: Dùng id_ngan_sach để tìm ten_ngan_sach
      const tenNganSach = nameMap.get(row.id_ngan_sach) || "Nguồn_Khác";
      
      // Cộng dồn số tiền
      const currentVal = record[tenNganSach] || 0;
      record[tenNganSach] = currentVal + Number(row.tong_tieu_dung);
    });

    const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.sortTime - b.sortTime);

    // Điền số 0 cho những ngân sách không tiêu dùng trong kỳ
    chartData.forEach(record => {
      tenCacCotChuan.forEach(ten => {
        if (record[ten] === undefined) record[ten] = 0;
      });
    });

    return { 
      chartData, 
      danhSachHienThi: danhSachGoc.map(n => ({ id: n.id, ten: n.ten_ngan_sach })) 
    };
  }
}