export interface KhoanNo {
  id?: string;
  ten_khoan_no: string;
  tong_goc_vay: number;
  tien_tra_dinh_ky: number;
  lai_suat_percent: number;
  id_nguon_gan_no: string | null; // Cho phép null nếu là Nợ tiêu dùng
  user_id?: string;
}