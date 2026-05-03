import { BCTCRepo } from "@/3_adapters/repositories/BCTCRepo";

export class GetBCTCTuanUseCase {
  private repo: BCTCRepo;

  constructor() {
    this.repo = new BCTCRepo();
  }

  async execute(tuan: number, nam: number) {
    const data = await this.repo.fetchBCTCData(tuan, nam);

    // ==========================================
    // 1. GÁN SỐ LIỆU DÒNG TIỀN TỪ BẢNG CHỐT
    // ==========================================
    const bctc = {
      thuNhapRong: Number(data.bctc?.thu_nhap_rong || 0),
      chiSinhTon: Number(data.bctc?.chi_sinh_ton || 0),
      dongTienGop: Number(data.bctc?.dong_tien_gop || 0),
      apLucNoKD: Number(data.bctc?.ap_luc_no_kd || 0),
      mucDoSongSot: Number(data.bctc?.muc_do_song_sot || 0),
      taiSan: [] as any[]
    };

    // ==========================================
    // 2. RÁP DỮ LIỆU TÀI SẢN VÀ LỊCH SỬ TỪ BẢNG CHỐT
    // ==========================================
    data.taiSanList.forEach(ts => {
      let loiNhuanLuyKe = 0;
      let loiNhuanTuan = 0;
      const lichSuHopLe: any[] = [];

      data.lichSuList.forEach(ls => {
        if (ls.id_nguon_thu !== ts.id_nguon_thu) return;
        
        // CẮT BỎ TƯƠNG LAI: Chỉ lấy lịch sử tính đến tuần đang tra cứu
        if (ls.nam > nam || (ls.nam === nam && ls.tuan > tuan)) return;

        // Cập nhật: Đọc từ cột loi_nhuan của bảng chot_nguon_thu_tuan
        const tien = Number(ls.loi_nhuan || 0);

        if (ls.nam === nam && ls.tuan === tuan) {
          loiNhuanTuan = tien; 
        } else {
          loiNhuanLuyKe += tien; 
        }

        lichSuHopLe.push({
          tuan: ls.tuan,
          nam: ls.nam,
          tien: tien
        });
      });

      // Sắp xếp lịch sử: Tuần mới nhất đẩy lên đầu
      lichSuHopLe.sort((a, b) => {
        if (a.nam !== b.nam) return b.nam - a.nam;
        return b.tuan - a.tuan;
      });

      bctc.taiSan.push({
        ten: ts.ten_tai_san,
        tongDauTu: Number(ts.tong_dau_tu) || 1, 
        loiNhuanLuyKe,
        loiNhuanTuan,
        lichSu: lichSuHopLe
      });
    });

    return bctc;
  }
}