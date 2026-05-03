export interface KhoanNo {
  id?: string;
  khoan_no_id?: string; // Dùng khi load từ View thống kê
  ten_khoan_no: string;
  tong_goc_vay: number;
  tong_tien_phai_tra: number;
  
  // ĐÃ FIX LỖI ÉP KIỂU: UUID bản chất là string, và cho phép null đối với nợ tiêu dùng
  id_nguon_gan_no?: string | null; 
  
  ngay_tao?: string;
  user_id?: string;
  thu_tu?: number;
  
  // Dữ liệu từ View trả về phục vụ cho giao diện
  sum_da_tra?: number;
  so_tien_con_lai?: number;
}