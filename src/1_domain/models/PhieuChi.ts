export interface PhieuChi {
  id?: string;
  so_tien: number;
  ly_do_chi?: string;
  nguoi_chi?: string;
  thoi_gian?: string;
  id_nguon_thu?: string | null; // Khóa ngoại 1: Chi kinh doanh
  id_ngan_sach?: string | null; // Khóa ngoại 2: Chi ngân sách
  id_khoan_no?: string | null;  // Khóa ngoại 3: Chi trả nợ
  user_id?: string;
}