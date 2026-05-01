export interface NganSach {
  id?: string;
  ten_ngan_sach: string;
  dinh_muc: number;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  thu_tu?: number; // Đã bổ sung trường quản lý thứ tự hiển thị
  user_id?: string;
  ngay_tao?: string;
}