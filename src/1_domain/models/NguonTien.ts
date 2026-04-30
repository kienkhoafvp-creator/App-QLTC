export interface NguonTien {
  id?: string; 
  ten_nguon: string;
  user_id?: string; // Cột mới thêm để phục vụ RLS
  ngay_tao?: string;
}