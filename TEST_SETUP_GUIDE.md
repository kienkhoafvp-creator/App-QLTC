# Hướng dẫn Thiết lập Tài khoản Thử nghiệm (Test Account)

Tôi đã tạo tệp `test-account.json` chứa thông tin tài khoản mẫu. Để sử dụng tài khoản này trong ứng dụng, bạn cần thực hiện các bước sau:

## 1. Tạo tài khoản trên Supabase
Vì lý do bảo mật và cấu hình hệ thống, bạn cần đăng ký tài khoản này thông qua giao diện ứng dụng hoặc Supabase Console:
- **Email:** `tester@qltc.com`
- **Password:** `Password123!`
- **Họ tên:** `Chiến Binh Thử Nghiệm`
- **Username:** `tester_hero`
- **SĐT:** `0987654321`

## 2. Nạp dữ liệu mẫu (Seeding Data)
Sau khi đăng ký thành công, bạn hãy đăng nhập. Để có dữ liệu biểu đồ và thống kê ngay lập tức, bạn có thể chạy đoạn Script SQL sau trong **Supabase SQL Editor**:

```sql
-- Thay thế 'YOUR_USER_ID' bằng ID của user vừa tạo (lấy từ bảng auth.users)
DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID'; -- <--- THAY ID VÀO ĐÂY
BEGIN
    -- 1. Tạo Nguồn Tiền
    INSERT INTO nguon_tien (user_id, ten_nguon, loai, so_du) VALUES
    (v_user_id, 'Ví Tiền Mặt', 'TIEN_MAT', 5000000),
    (v_user_id, 'Ngân Hàng Techcombank', 'NGAN_HANG', 20000000);

    -- 2. Tạo Ngân Sách
    INSERT INTO ngan_sach (user_id, ten_ngan_sach, dinh_muc) VALUES
    (v_user_id, 'Ăn Uống', 3000000),
    (v_user_id, 'Di Chuyển', 1000000);

    -- 3. Tạo Khoản Nợ
    INSERT INTO khoan_no (user_id, ten_khoan_no, tong_no, da_tra) VALUES
    (v_user_id, 'Vay Mua Xe', 50000000, 10000000);

    -- 4. Tạo một vài giao dịch mẫu
    INSERT INTO phieu_thu (user_id, so_tien, ly_do_thu, thoi_gian) VALUES
    (v_user_id, 15000000, 'Lương tháng 5', NOW());

    INSERT INTO phieu_chi (user_id, so_tien, ly_do_chi, thoi_gian) VALUES
    (v_user_id, 500000, 'Ăn tối nhà hàng', NOW());
END $$;
```

## 3. Kiểm tra
- Đăng nhập bằng Email hoặc Username (`tester_hero`).
- Truy cập Dashboard để xem các chỉ số **Inflow**, **Outflow**, và **Survival Runway** đã được tính toán tự động.

---
*Ghi chú: Tệp `test-account.json` chỉ dùng để tham khảo thông tin, không ảnh hưởng trực tiếp đến logic code của ứng dụng.*
