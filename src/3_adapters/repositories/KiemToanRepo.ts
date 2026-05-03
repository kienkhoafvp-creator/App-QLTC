import { supabase } from "@/4_infrastructure/database/supabaseClient";

export class KiemToanRepo {
  async luuKiemToan(data: any) {
    let idPhieuChi = null;
    let idPhieuThu = null;

    if (data.chenh_lech < 0) {
      const { data: pc, error: errPc } = await supabase
        .from('phieu_chi')
        .insert([{
          so_tien: Math.abs(data.chenh_lech),
          ly_do_chi: "Khớp sổ - Điều chỉnh hao hụt",
          nguoi_chi: "Hệ Thống"
        }])
        .select('id').single();
        
      if (errPc) throw new Error("Lỗi sinh Phiếu chi: " + errPc.message);
      idPhieuChi = pc.id;
    } else if (data.chenh_lech > 0) {
      const { data: pt, error: errPt } = await supabase
        .from('phieu_thu')
        .insert([{
          so_tien: data.chenh_lech,
          ly_do_thu: "Khớp sổ - Điều chỉnh dôi dư",
          nguoi_thu: "Hệ Thống"
        }])
        .select('id').single();
        
      if (errPt) throw new Error("Lỗi sinh Phiếu thu: " + errPt.message);
      idPhieuThu = pt.id;
    }

    // SỬA: Trả về data (id và ngay_kiem_toan) để UseCase lấy truyền cho Hàm chốt sổ
    const { data: ktData, error: errKt } = await supabase
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
      }])
      .select('id, ngay_kiem_toan').single();

    if (errKt) throw new Error("Lỗi lưu biên bản Kiểm toán: " + errKt.message);
    return ktData; 
  }

  async layKiemToanGanNhat() {
    const { data, error } = await supabase
      .from('kiem_toan_tc_tuan')
      .select('*')
      .order('ngay_kiem_toan', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

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

  // SỬA: Truyền đủ tham số Kỳ Khớp Sổ
  async goiHamChotSo(idKiemToan: string, thoiGianBatDau: string | null, thoiGianKetThuc: string, tuan: number, nam: number) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Lỗi bảo mật.");

    const { error } = await supabase.rpc('func_khop_so_ky', {
      p_user_id: userData.user.id,
      p_id_kiem_toan: idKiemToan,
      p_thoi_gian_bat_dau: thoiGianBatDau,
      p_thoi_gian_ket_thuc: thoiGianKetThuc,
      p_tuan: tuan,
      p_nam: nam
    });
    
    if (error) throw new Error("Lỗi lưu vết BCTC: " + error.message);
  }

  // SỬA: Undo chỉ cần ID kiểm toán
  async goiHamUndoChotSo(idKiemToan: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Lỗi bảo mật.");

    const { error } = await supabase.rpc('func_undo_khop_so_ky', {
      p_user_id: userData.user.id,
      p_id_kiem_toan: idKiemToan
    });
    
    if (error) throw new Error("Lỗi Undo Bảng Chốt: " + error.message);
  }
}