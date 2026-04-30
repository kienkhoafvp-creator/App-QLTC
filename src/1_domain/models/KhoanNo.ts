export interface KhoanNo {
  id?: string;
  ten_khoan_no: string;
  tong_goc_vay: number;
  tong_tien_phai_tra: number; // Đã cập nhật theo cấu trúc mới
  id_nguon_gan_no: string;
  ngay_tao?: string;
  user_id?: string;
}