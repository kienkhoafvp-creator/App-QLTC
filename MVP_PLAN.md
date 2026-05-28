# Kế hoạch Triển khai Nghiệp vụ MVP - App QLTC

Dựa trên tài liệu yêu cầu nghiệp vụ và trạng thái hiện tại của codebase, đây là lộ trình triển khai giai đoạn MVP (Minimum Viable Product).

## 1. Mục tiêu Giai đoạn MVP
Xây dựng một ứng dụng quản lý dòng tiền cơ bản, đảm bảo tính chính xác của số dư (Kiểm toán) và mang lại trải nghiệm nhập liệu nhanh nhất.

## 2. Các Nghiệp vụ Trọng tâm
### A. Quản lý Nguồn tiền (Wallets)
- **Danh sách nguồn:** Tiền mặt, các tài khoản ngân hàng.
- **Số dư thời gian thực:** Hiển thị tổng tài sản và chi tiết từng nguồn.
- **Phân loại nguồn:** Tích hợp bộ 3 hũ chính: **Ví Tiền mặt**, **Quỹ Dự Phòng**, **Quỹ Đầu Tư**.

### B. Quản lý Giao dịch (Transactions)
- **Phiếu Thu/Chi:** Nhập liệu cơ bản (Số tiền, Hạng mục, Ghi chú).
- **Chuyển khoản (Transfer):** Nghiệp vụ "đổi tiền từ túi này sang túi kia".
- **Lịch sử giao dịch:** Xem lại danh sách biến động tiền tệ.

### C. Nghiệp vụ Đối soát (Reconciliation) - Tính năng "Vàng"
- **Nhập số thực tế:** Người dùng nhập số tiền thực có trong ví/thẻ.
- **Tính toán chênh lệch:** Hệ thống so sánh với số dư sổ sách.
- **Tạo phiếu điều chỉnh:** Tự động tạo Phiếu Thu/Chi "Điều chỉnh" để khớp số liệu nếu có sai lệch.

### D. Báo cáo & Nhắc nhở
- **Báo cáo tuần:** Tổng hợp thu/chi và biến động tài sản theo chu kỳ 1 tuần.
- **Thông báo nhắc nhở:** Tối đa 2 lần thông báo khi đến ngày đối soát/chốt sổ.

## 3. Lộ trình Triển khai Chi tiết

### Bước 1: Hoàn thiện Tầng Dữ liệu (Supabase)
- [ ] Kiểm tra và bổ sung bảng `nguon_tien`, `phieu_thu`, `phieu_chi`, `kiem_toan_tc_tuan`.
- [ ] Triển khai Database RPC `func_khop_so_ky` để thực hiện chốt sổ và khóa dữ liệu kỳ cũ.
- [ ] Triển khai Database RPC `dieu_chuyen_tien` để xử lý nghiệp vụ chuyển khoản an toàn (Atomicity).

### Bước 2: Xây dựng Logic Nghiệp vụ (Use Cases)
- [ ] `AddTransactionUseCase`: Xử lý thêm thu/chi và cập nhật số dư nguồn.
- [ ] `ReconcileUseCase`: Xử lý logic đối soát, tính chênh lệch và sinh phiếu điều chỉnh.
- [ ] `GetWeeklyReportUseCase`: Tính toán số liệu cho biểu đồ báo cáo tuần.

### Bước 3: Phát triển Giao diện Mobile-first
- [ ] **Trang Chủ (Dashboard):** Hiển thị bộ 3 chỉ số (Ví - Dự phòng - Đầu tư).
- [ ] **Form Nhập liệu Nhanh:** Tối ưu hóa UI để hoàn thành giao dịch trong 2-3 chạm.
- [ ] **Giao diện Đối soát:** Quy trình nhập số thực tế -> Xem kết quả chênh lệch -> Xác nhận khớp sổ.

### Bước 4: Tích hợp Hệ thống Thông báo
- [ ] Sử dụng Service Worker để gửi Push Notification nhắc nhở đối soát hàng tuần.
- [ ] Thiết lập logic kiểm tra: Nếu đã đối soát thì không nhắc lại.

## 4. Tiêu chí Nghiệm thu MVP
1. Người dùng đăng nhập thành công và thấy số dư các ví.
2. Thực hiện được 1 giao dịch Chi và thấy số dư giảm ngay lập tức.
3. Thực hiện Chuyển khoản từ Ngân hàng sang Tiền mặt thành công.
4. Thực hiện Đối soát cuối tuần: Số dư app khớp hoàn toàn với số tiền thực tế sau khi điều chỉnh.
5. Xem được biểu đồ thu/chi của tuần hiện tại.

---
**Ghi chú:** Các tính năng AI (Autofill, NLP) và Gamification sẽ được dời sang giai đoạn LV2 và LV3.
