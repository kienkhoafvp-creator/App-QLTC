import { supabase } from "@/4_infrastructure/database/supabaseClient";
import { KhoanNo } from "@/1_domain/models/KhoanNo";

export class KhoanNoRepo {
  async taoKhoanNo(data: KhoanNo): Promise<KhoanNo> {
    const { data: result, error } = await supabase
      .from('khoan_no')
      .insert([{
        ten_khoan_no: data.ten_khoan_no,
        tong_goc_vay: data.tong_goc_vay,
        tong_tien_phai_tra: data.tong_tien_phai_tra,
        id_nguon_gan_no: data.id_nguon_gan_no,
        thu_tu: data.thu_tu // Đẩy thứ tự lên database
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as KhoanNo;
  }

  // HÀM MỚI 1: Đếm số lượng phiếu chi gắn với khoản nợ
  async demSoPhieuChi(idKhoanNo: string): Promise<number> {
    const { count, error } = await supabase
      .from('phieu_chi')
      .select('*', { count: 'exact', head: true })
      .eq('id_khoan_no', idKhoanNo);

    if (error) throw new Error(`Lỗi kiểm tra giao dịch: ${error.message}`);
    return count || 0;
  }

  // HÀM MỚI 2: Xóa cứng khoản nợ
  async xoaKhoanNo(idKhoanNo: string): Promise<void> {
    const { error } = await supabase
      .from('khoan_no')
      .delete()
      .eq('id', idKhoanNo);

    if (error) throw new Error(`Lỗi khi xóa khoản nợ: ${error.message}`);
  }
  // HÀM ĐƯỢC PHỤC HỒI: Dùng cho trang Giao Dịch (giaodich.tsx)
  async layDanhSachKhoanNo() {
    const { data, error } = await supabase
      .from('khoan_no')
      .select('*')
      .order('thu_tu', { ascending: true }); // Vẫn giữ sắp xếp theo thứ tự cho đồng bộ
      
    if (error) throw new Error(error.message);
    return data;
  }
}