# GHOST-WRITER / AI CODING AGENT PROMPT
**Role:** Expert Flutter Developer
**Task:** Build the UI for the Transaction Screen (Màn hình Thu/Chi) for a personal finance app (QLTC).
**Tech Stack:** Flutter, Clean Architecture.

## 1. MỤC TIÊU & YÊU CẦU CHUNG
- Code layout UI chính xác theo cấu trúc bên dưới.
- Tách file component rõ ràng (Atomic Design).
- Giữ nguyên Bottom Navigation Bar (5 tabs).
- Hỗ trợ cả Dark/Light theme dựa trên Theme Tokens cung cấp.

## 2. CẤU TRÚC MÀN HÌNH (ASCII LAYOUT)
```text
┌─────────────────────────────┐
│  [Ví 1]  [Ví 2]  [Ví 3]     │  ← WalletHeaderBar (Scroll ngang, chọn ví)
├─────────────────────────────┤
│  [ Phiếu Chi ] [ Phiếu Thu ]│  ← TransactionTabSwitch
├─────────────────────────────┤
│  Số tiền (VNĐ)              │
│  ┌───────────────────────┐  │
│  │         0             │  │  ← AmountInput (Format VNĐ realtime)
│  └───────────────────────┘  │
│                             │
│  Category                   │
│  ← [🍔Ăn] [🚗Di] [🏠Nhà] →  │  ← CategorySnapList (scroll_snap_list)
│                             │
│  Ngày        Ghi chú        │
│  [20/05/26]  [...........]  │  ← DatePicker & NoteInput
│                             │
│  ┌───────────────────────┐  │
│  │     GHI NHẬN CHI      │  │  ← SubmitButton
│  └───────────────────────┘  │
│                             │
│  [ 1 2 3 ]                  │
│  [ 4 5 6 ]                  │  ← Custom Numpad (Momo Style)
│  [ 7 8 9 ]                  │
│  [ , 0 ⌫ ]                  │
├─────────────────────────────┤
│ BCTC Nguồn  [+]  Ng.Sách Nợ │  ← Bottom Navigation (Cố định)
└─────────────────────────────┘
```

## 3. CHI TIẾT CÁC COMPONENT CẦN CODE
1. **WalletHeaderBar**: Header kiêm chức năng chọn ví (Wallet). Danh sách cuộn ngang, hiển thị số dư, highlight ví đang được chọn.
2. **TransactionTabSwitch**: Nút chuyển đổi Phiếu Chi / Phiếu Thu. Đổi màu state (Chi = Cam, Thu = Xanh).
3. **AmountInput & Custom Numpad**: 
   - Ẩn bàn phím hệ thống.
   - Sử dụng Custom Numpad (kiểu app Momo) gắn dưới màn hình hoặc bottom sheet.
   - Update text input realtime format: `1.000.000 đ`.
4. **CategorySnapList**: Sử dụng thư viện `scroll_snap_list` ngang, chứa Icon + Tên hạng mục. Highlight hạng mục ở giữa.
5. **DatePicker & NoteInput**: 
   - Date: Mặc định hôm nay, không cho phép chọn ngày tương lai.
   - Note: Text field nhập ghi chú (tuỳ chọn).
6. **SubmitButton**:
   - Nút gọi hành động (CTA).
   - Màu sắc phụ thuộc Tab: Cam (Chi), Xanh (Thu).
   - Validation: Disabled nếu `Amount == 0` hoặc chưa chọn Category/Ví.

## 4. THEME TOKENS CẦN IMPLEMENT
Tạo `AppTheme` và `ThemeProvider` (lưu SharedPreferences) để toggle màu sắc theo bảng sau:

| Token | Dark Mode | Light Mode |
| :--- | :--- | :--- |
| **background** | `#0D1117` | `#F5F5F5` |
| **surface** | `#1C2333` | `#FFFFFF` |
| **primary_expense** | `#FF6B35` | `#FF6B35` |
| **primary_income** | `#00C896` | `#00A87A` |
| **text_primary** | `#FFFFFF` | `#1A1A1A` |
| **text_secondary**| `#8B9BB4` | `#666666` |
| **border** | `#2A3550` | `#E0E0E0` |

## 5. THỨ TỰ THỰC THI (EXECUTION PLAN)
- **Step 1:** Setup `AppTheme` với các Color Tokens.
- **Step 2:** Build `Custom Numpad` và `AmountInput`.
- **Step 3:** Build `scroll_snap_list` cho `CategorySnapList` và header `WalletHeaderBar`.
- **Step 4:** Lắp ráp `TransactionTabSwitch`, `SubmitButton` (kèm Validation).
- **Step 5:** Hoàn thiện `TransactionScreen` tổng thể kèm Bottom Nav.

