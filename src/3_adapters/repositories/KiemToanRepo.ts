import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class KiemToanRepo {
  async luuKiemToan(data: any) {
    let idPhieuChi = null;
    let idPhieuThu = null;

    if (data.chenh_lech <= 0) {
      const { data: pc, error: errPc } = await supabase
        .from('phieu_chi')
        .insert([{
          so_tien: Math.abs(data.chenh_lech),
          ly_do_chi: data.chenh_lech === 0 ? "Khớp sổ - Cân bằng" : "Khớp sổ - Điều chỉnh hao hụt",
          nguoi_chi: "Hệ Thống"
        }])
        .select('id').single();
        
      if (errPc) throw new Error("Lỗi sinh Phiếu chi điều chỉnh: " + errPc.message);
      idPhieuChi = pc.id;
    } else {
      const { data: pt, error: errPt } = await supabase
        .from('phieu_thu')
        .insert([{
          so_tien: data.chenh_lech,
          ly_do_thu: "Khớp sổ - Điều chỉnh dôi dư",
          nguoi_thu: "Hệ Thống"
        }])
        .select('id').single();
        
      if (errPt) throw new Error("Lỗi sinh Phiếu thu điều chỉnh: " + errPt.message);
      idPhieuThu = pt.id;
    }

    const { error: errKt } = await supabase
      .from('kiem_toan_tc_tuan')
      .insert([{
        tuan_thu: data.tuan_thu,
        nam: data.nam,
        tong_tien_he_thong: data.tong_tien_he_thong,
        tong_tien_thuc_te: data.tong_tien_thuc_te,
        chenh_lech: data.chenh_lech,
        chi_tiet_phan_bo: data.chi_tiet_phan_bo,
        id_phieu_chi_dieu_chinh: idPhieuChi,
        id_phieu_thu_dieu_chinh: idPhieuThu
      }]);

    if (errKt) throw new Error("Lỗi lưu biên bản Kiểm toán: " + errKt.message);
    return true;
  }

  // HÀM MỚI 1: Tìm đợt kiểm toán gần nhất để Undo
  async layKiemToanGanNhat() {
    const { data, error } = await supabase
      .from('kiem_toan_tc_tuan')
      .select('*')
      .order('ngay_kiem_toan', { ascending: false })
      .limit(1)
      .single();
      
    // Bỏ qua lỗi nếu bảng chưa có dữ liệu nào (PGRST116)
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  // HÀM MỚI 2: Kích hoạt Sợi Dây Xích (Xóa Phiếu trước, Xóa Biên bản sau)
  async xoaKiemToan(idKiemToan: string, idPhieuChi: string | null, idPhieuThu: string | null) {
    if (idPhieuChi) {
      const { error } = await supabase.from('phieu_chi').delete().eq('id', idPhieuChi);
      if (error) throw new Error("Lỗi xóa phiếu chi: " + error.message);
    }
    
    if (idPhieuThu) {
      const { error } = await supabase.from('phieu_thu').delete().eq('id', idPhieuThu);
      if (error) throw new Error("Lỗi xóa phiếu thu: " + error.message);
    }
    
    const { error: errKt } = await supabase.from('kiem_toan_tc_tuan').delete().eq('id', idKiemToan);
    if (errKt) throw new Error("Lỗi xóa biên bản kiểm toán: " + errKt.message);
  }
}