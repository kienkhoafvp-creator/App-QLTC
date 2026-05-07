import { ThongKeTraNoRepo } from "@/3_adapters/repositories/ThongKeTraNoRepo";

export class GetChartTraNoUseCase {
  private repo = new ThongKeTraNoRepo();

  async execute(groupBy: 'tuan' | 'thang' | 'nam' = 'tuan') {
    // 1. Kéo dữ liệu thô và danh mục gốc cùng lúc
    const [rawData, danhSachGoc] = await Promise.all([
      this.repo.layDuLieuBieuDo(),   // Dữ liệu từ bảng chot_tra_no_tuan
      this.repo.layDanhSachKhoanNo() // Dữ liệu từ bảng danh mục khoan_no
    ]);

    // 2. Tạo Map ánh xạ ID -> Tên chuẩn để chống lỗi Join từ Database
    // Tránh trường hợp Repo join hụt dẫn đến mất tên
    const nameMap = new Map<string, string>();
    danhSachGoc.forEach(item => {
      nameMap.set(item.id, item.ten_khoan_no);
    });

    const chartDataMap = new Map<string, any>();
    const tenCacKhoanNoChuan = danhSachGoc.map(n => n.ten_khoan_no);

    // 3. Xử lý gom nhóm dữ liệu
    rawData.forEach(row => {
      const date = new Date(row.ngay_chot);
      const shortYear = row.nam.toString().slice(-2);
      
      let key = ""; 
      let label = "";

      // Xác định Key gom nhóm và Nhãn hiển thị trên trục X
      if (groupBy === 'tuan') {
        // Gom theo phiên chốt (id_kiem_toan) để các khoản trả cùng tuần nằm chung 1 cột
        key = row.id_kiem_toan || `tuan-${row.tuan}-${row.nam}`;
        label = `T${row.tuan}/${shortYear}`;
      } else if (groupBy === 'thang') {
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        key = `thang-${row.nam}-${m}`;
        label = `Thg ${m}/${shortYear}`;
      } else {
        key = `nam-${row.nam}`;
        label = `Năm ${row.nam}`;
      }

      if (!chartDataMap.has(key)) {
        chartDataMap.set(key, { 
          name: label, 
          sortTime: date.getTime() 
        });
      }

      const record = chartDataMap.get(key);
      
      // Lấy tên chuẩn từ Map dựa trên id_khoan_no của dòng dữ liệu
      const tenChuan = nameMap.get(row.id_khoan_no);
      
      if (tenChuan) {
        // CỘNG DỒN số tiền đã trả (Rất quan trọng khi gom Tháng/Năm)
        const currentVal = record[tenChuan] || 0;
        record[tenChuan] = currentVal + Number(row.so_tien_da_tra_trong_tuan);
      }
    });

    // 4. Chuyển Map thành mảng và sắp xếp theo thời gian chốt
    const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.sortTime - b.sortTime);

    // 5. Fill Zero: Điền giá trị 0 cho những khoản nợ không phát sinh trả trong kỳ đó
    // Đảm bảo Recharts luôn có đủ key để vẽ, tránh lỗi mất Bar
    chartData.forEach(record => {
      tenCacKhoanNoChuan.forEach(ten => {
        if (record[ten] === undefined) {
          record[ten] = 0;
        }
      });
    });

    return { 
      chartData, 
      danhSachHienThi: danhSachGoc.map(n => ({ id: n.id, ten: n.ten_khoan_no })) 
    };
  }
}