-- FULL DATABASE SCHEMA FOR APP-QLTC
-- Run this in Supabase SQL Editor

-- 1. Bảng Nguồn Tiền (Ví/Ngân hàng/Quỹ)
CREATE TABLE IF NOT EXISTS public.nguon_tien (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ten_nguon TEXT NOT NULL,
    loai TEXT CHECK (loai IN ('TIEN_MAT', 'NGAN_HANG', 'DU_PHONG', 'DAU_TU')),
    so_du BIGINT DEFAULT 0,
    thu_tu INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cập nhật ràng buộc loại nguồn tiền nếu bảng đã tồn tại từ trước
ALTER TABLE public.nguon_tien DROP CONSTRAINT IF EXISTS nguon_tien_loai_check;
ALTER TABLE public.nguon_tien ADD CONSTRAINT nguon_tien_loai_check CHECK (loai IN ('TIEN_MAT', 'NGAN_HANG', 'DU_PHONG', 'DAU_TU'));

-- 2. Bảng Ngân Sách
CREATE TABLE IF NOT EXISTS public.ngan_sach (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ten_ngan_sach TEXT NOT NULL,
    dinh_muc BIGINT DEFAULT 0,
    thu_tu INTEGER DEFAULT 0,
    trang_thai_xac_thuc BOOLEAN DEFAULT FALSE,
    thoi_gian_bat_dau DATE,
    thoi_gian_ket_thuc DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cập nhật cột thời gian cho bảng ngân sách nếu bảng đã tồn tại từ trước
ALTER TABLE public.ngan_sach ADD COLUMN IF NOT EXISTS thoi_gian_bat_dau DATE;
ALTER TABLE public.ngan_sach ADD COLUMN IF NOT EXISTS thoi_gian_ket_thuc DATE;

-- 3. Bảng Khoản Nợ
CREATE TABLE IF NOT EXISTS public.khoan_no (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ten_khoan_no TEXT NOT NULL,
    tong_goc_vay BIGINT DEFAULT 0,
    tong_tien_phai_tra BIGINT DEFAULT 0,
    id_nguon_gan_no UUID REFERENCES public.nguon_tien(id) ON DELETE SET NULL,
    thu_tu INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cập nhật các cột số tiền nợ nếu bảng đã tồn tại từ trước
ALTER TABLE public.khoan_no ADD COLUMN IF NOT EXISTS tong_goc_vay BIGINT DEFAULT 0;
ALTER TABLE public.khoan_no ADD COLUMN IF NOT EXISTS tong_tien_phai_tra BIGINT DEFAULT 0;

-- 4. Bảng Phiếu Thu
CREATE TABLE IF NOT EXISTS public.phieu_thu (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    so_tien BIGINT NOT NULL,
    ly_do_thu TEXT,
    nguoi_thu TEXT,
    thoi_gian TIMESTAMPTZ DEFAULT NOW(),
    id_nguon_thu UUID REFERENCES public.nguon_tien(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Phiếu Chi
CREATE TABLE IF NOT EXISTS public.phieu_chi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    so_tien BIGINT NOT NULL,
    ly_do_chi TEXT,
    nguoi_chi TEXT,
    thoi_gian TIMESTAMPTZ DEFAULT NOW(),
    id_nguon_thu UUID REFERENCES public.nguon_tien(id) ON DELETE CASCADE,
    id_ngan_sach UUID REFERENCES public.ngan_sach(id) ON DELETE SET NULL,
    id_khoan_no UUID REFERENCES public.khoan_no(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng Kiểm Toán Tuần
CREATE TABLE IF NOT EXISTS public.kiem_toan_tc_tuan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tuan_thu INTEGER NOT NULL,
    nam INTEGER NOT NULL,
    tong_tien_he_thong BIGINT DEFAULT 0,
    tong_tien_thuc_te BIGINT DEFAULT 0,
    chenh_lech BIGINT DEFAULT 0,
    chi_tiet_phan_bo JSONB,
    id_phieu_chi_dieu_chinh UUID REFERENCES public.phieu_chi(id) ON DELETE SET NULL,
    id_phieu_thu_dieu_chinh UUID REFERENCES public.phieu_thu(id) ON DELETE SET NULL,
    ngay_kiem_toan TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bảng Chốt Trả Nợ Tuần
CREATE TABLE IF NOT EXISTS public.chot_tra_no_tuan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    id_khoan_no UUID REFERENCES public.khoan_no(id) ON DELETE CASCADE,
    id_kiem_toan UUID REFERENCES public.kiem_toan_tc_tuan(id) ON DELETE CASCADE,
    so_tien_tra BIGINT DEFAULT 0,
    ngay_chot TIMESTAMPTZ DEFAULT NOW(),
    tuan INTEGER NOT NULL,
    nam INTEGER NOT NULL
);

-- 8. Bảng Chốt Ngân Sách Tuần
CREATE TABLE IF NOT EXISTS public.chot_ngan_sach_tuan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    id_ngan_sach UUID REFERENCES public.ngan_sach(id) ON DELETE CASCADE,
    id_kiem_toan UUID REFERENCES public.kiem_toan_tc_tuan(id) ON DELETE CASCADE,
    so_tien_chi BIGINT DEFAULT 0,
    ngay_chot TIMESTAMPTZ DEFAULT NOW(),
    tuan INTEGER NOT NULL,
    nam INTEGER NOT NULL
);

-- 9. Bảng Giao Dịch Đầu Tư
CREATE TABLE IF NOT EXISTS public.giao_dich_dau_tu (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    so_tien BIGINT NOT NULL,
    ly_do TEXT,
    nguoi_thuc_hien TEXT,
    id_nguon_thu UUID REFERENCES public.nguon_tien(id) ON DELETE CASCADE,
    thoi_gian TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Bảng Chốt BCTC Tuần
CREATE TABLE IF NOT EXISTS public.chot_bctc_tuan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tuan INTEGER NOT NULL,
    nam INTEGER NOT NULL,
    thu_nhap_rong BIGINT DEFAULT 0,
    chi_sinh_ton BIGINT DEFAULT 0,
    dong_tien_gop BIGINT DEFAULT 0,
    ap_luc_no_kd BIGINT DEFAULT 0,
    muc_do_song_sot BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, tuan, nam)
);

-- 11. Bảng Chốt Nguồn Thu Tuần
CREATE TABLE IF NOT EXISTS public.chot_nguon_thu_tuan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    id_nguon_thu UUID REFERENCES public.nguon_tien(id) ON DELETE CASCADE,
    tuan INTEGER NOT NULL,
    nam INTEGER NOT NULL,
    loi_nhuan BIGINT DEFAULT 0,
    is_tai_san BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, id_nguon_thu, tuan, nam)
);


-- ==========================================
-- VIEWS CHO THỐNG KÊ & BÁO CÁO
-- ==========================================

-- Xóa các views cũ trước để tránh lỗi đổi tên cột trong PostgreSQL
DROP VIEW IF EXISTS public.view_chart_nguon_thu_tuan CASCADE;
DROP VIEW IF EXISTS public.view_tai_san_tong_quat CASCADE;
DROP VIEW IF EXISTS public.sum_thong_ke_khoan_no CASCADE;
DROP VIEW IF EXISTS public.sum_thong_ke_ngan_sach CASCADE;
DROP VIEW IF EXISTS public.sum_quy_tich_luy CASCADE;
DROP VIEW IF EXISTS public.sum_thong_ke_vi_tien CASCADE;
DROP VIEW IF EXISTS public.sum_thong_ke_nguon_tien CASCADE;

-- View thống kê nguồn tiền chi tiết (được tính toán động)
CREATE OR REPLACE VIEW public.sum_thong_ke_nguon_tien AS
SELECT 
    nt.id AS nguon_tien_id,
    nt.user_id,
    nt.ten_nguon,
    nt.loai,
    nt.thu_tu,
    nt.created_at AS thoi_gian_bat_dau,
    (
        nt.so_du 
        + COALESCE((SELECT SUM(pt.so_tien) FROM public.phieu_thu pt WHERE pt.id_nguon_thu = nt.id), 0)
        - COALESCE((SELECT SUM(pc.so_tien) FROM public.phieu_chi pc WHERE pc.id_nguon_thu = nt.id), 0)
    ) AS sum_loi_nhuan_gop
FROM public.nguon_tien nt;

-- View tính tổng ví tiền (Sum của Ví Tiền Mặt + Ngân Hàng)
CREATE OR REPLACE VIEW public.sum_thong_ke_vi_tien AS
SELECT 
    user_id, 
    SUM(sum_loi_nhuan_gop) AS sum_so_du_vi
FROM public.sum_thong_ke_nguon_tien
WHERE loai IN ('TIEN_MAT', 'NGAN_HANG')
GROUP BY user_id;

-- View tính các quỹ tích lũy (Quỹ Dự Phòng & Quỹ Đầu Tư)
CREATE OR REPLACE VIEW public.sum_quy_tich_luy AS
SELECT 
    user_id,
    COALESCE(SUM(CASE WHEN loai = 'DU_PHONG' THEN so_du ELSE 0 END), 0) AS sum_quy_du_phong,
    COALESCE(SUM(CASE WHEN loai = 'DAU_TU' THEN so_du ELSE 0 END), 0) AS sum_quy_dau_tu
FROM public.nguon_tien
GROUP BY user_id;

-- View thống kê ngân sách
CREATE OR REPLACE VIEW public.sum_thong_ke_ngan_sach AS
SELECT 
    ns.id AS ngan_sach_id,
    ns.user_id,
    ns.ten_ngan_sach,
    ns.dinh_muc,
    ns.thu_tu,
    ns.trang_thai_xac_thuc,
    ns.thoi_gian_bat_dau,
    ns.thoi_gian_ket_thuc,
    ns.created_at AS ngay_tao,
    (ns.dinh_muc - COALESCE(SUM(pc.so_tien), 0)) AS so_du_con_lai
FROM public.ngan_sach ns
LEFT JOIN public.phieu_chi pc ON pc.id_ngan_sach = ns.id
GROUP BY ns.id, ns.user_id, ns.ten_ngan_sach, ns.dinh_muc, ns.thu_tu, ns.trang_thai_xac_thuc, ns.thoi_gian_bat_dau, ns.thoi_gian_ket_thuc, ns.created_at;

-- View thống kê khoản nợ
CREATE OR REPLACE VIEW public.sum_thong_ke_khoan_no AS
SELECT 
    kn.id AS khoan_no_id,
    kn.user_id,
    kn.ten_khoan_no,
    kn.tong_goc_vay,
    kn.tong_tien_phai_tra,
    kn.id_nguon_gan_no,
    kn.thu_tu,
    kn.created_at AS ngay_tao,
    COALESCE(SUM(pc.so_tien), 0) AS sum_da_tra,
    (kn.tong_tien_phai_tra - COALESCE(SUM(pc.so_tien), 0)) AS so_tien_con_lai
FROM public.khoan_no kn
LEFT JOIN public.phieu_chi pc ON pc.id_khoan_no = kn.id
GROUP BY kn.id, kn.user_id, kn.ten_khoan_no, kn.tong_goc_vay, kn.tong_tien_phai_tra, kn.id_nguon_gan_no, kn.thu_tu, kn.created_at;

-- View tài sản tổng quát
CREATE OR REPLACE VIEW public.view_tai_san_tong_quat AS
SELECT 
    gd.id_nguon_thu,
    nt.ten_nguon AS ten_tai_san,
    SUM(gd.so_tien) AS tong_dau_tu
FROM public.giao_dich_dau_tu gd
JOIN public.nguon_tien nt ON nt.id = gd.id_nguon_thu
GROUP BY gd.id_nguon_thu, nt.ten_nguon;

-- View biểu đồ lịch sử nguồn thu/lợi nhuận theo tuần
CREATE OR REPLACE VIEW public.view_chart_nguon_thu_tuan AS
SELECT 
    cnt.user_id,
    kt.id AS id_kiem_toan,
    cnt.tuan,
    cnt.nam,
    kt.ngay_kiem_toan AS ngay_chot,
    nt.ten_nguon,
    cnt.loi_nhuan
FROM public.chot_nguon_thu_tuan cnt
JOIN public.nguon_tien nt ON nt.id = cnt.id_nguon_thu
LEFT JOIN public.kiem_toan_tc_tuan kt ON kt.user_id = cnt.user_id AND kt.tuan_thu = cnt.tuan AND kt.nam = cnt.nam;


-- ==========================================
-- RPC FUNCTIONS
-- ==========================================

-- 1. Hàm cập nhật thứ tự nguồn tiền
CREATE OR REPLACE FUNCTION public.cap_nhat_thu_tu_nguon(p_data JSONB)
RETURNS VOID AS $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN SELECT * FROM jsonb_to_recordset(p_data) AS x(id UUID, thu_tu INT)
    LOOP
        UPDATE public.nguon_tien 
        SET thu_tu = item.thu_tu 
        WHERE id = item.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Hàm cập nhật thứ tự ngân sách
CREATE OR REPLACE FUNCTION public.cap_nhat_thu_tu_ngan_sach(p_data JSONB)
RETURNS VOID AS $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN SELECT * FROM jsonb_to_recordset(p_data) AS x(id UUID, thu_tu INT)
    LOOP
        UPDATE public.ngan_sach 
        SET thu_tu = item.thu_tu 
        WHERE id = item.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Hàm cập nhật thứ tự khoản nợ
CREATE OR REPLACE FUNCTION public.cap_nhat_thu_tu_khoan_no(p_data JSONB)
RETURNS VOID AS $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN SELECT * FROM jsonb_to_recordset(p_data) AS x(id UUID, thu_tu INT)
    LOOP
        UPDATE public.khoan_no 
        SET thu_tu = item.thu_tu 
        WHERE id = item.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Hàm điều chuyển tiền sang các Quỹ (Dự phòng / Đầu tư)
CREATE OR REPLACE FUNCTION public.dieu_chuyen_tien(p_so_tien BIGINT, p_den_quy TEXT)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_nguon_id UUID;
    v_quy_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Chưa xác thực người dùng.';
    END IF;

    -- Tìm nguồn tiền (Ví/Ngân hàng) có đủ tiền để trừ
    SELECT nt.id INTO v_nguon_id
    FROM public.nguon_tien nt
    WHERE nt.user_id = v_user_id 
      AND nt.loai IN ('TIEN_MAT', 'NGAN_HANG')
      AND (
          nt.so_du 
          + COALESCE((SELECT SUM(pt.so_tien) FROM public.phieu_thu pt WHERE pt.id_nguon_thu = nt.id), 0)
          - COALESCE((SELECT SUM(pc.so_tien) FROM public.phieu_chi pc WHERE pc.id_nguon_thu = nt.id), 0)
      ) >= p_so_tien
    LIMIT 1;

    -- Nếu không tìm thấy nguồn nào có đủ số dư thực tế, lấy nguồn có số dư lớn nhất
    IF v_nguon_id IS NULL THEN
        SELECT nt.id INTO v_nguon_id
        FROM public.nguon_tien nt
        WHERE nt.user_id = v_user_id 
          AND nt.loai IN ('TIEN_MAT', 'NGAN_HANG')
        ORDER BY (
            nt.so_du 
            + COALESCE((SELECT SUM(pt.so_tien) FROM public.phieu_thu pt WHERE pt.id_nguon_thu = nt.id), 0)
            - COALESCE((SELECT SUM(pc.so_tien) FROM public.phieu_chi pc WHERE pc.id_nguon_thu = nt.id), 0)
        ) DESC
        LIMIT 1;
    END IF;

    IF v_nguon_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy nguồn tiền nào hợp lệ.';
    END IF;

    -- Kiểm tra xem quỹ đích đã tồn tại chưa, nếu chưa thì tạo mới
    SELECT id INTO v_quy_id
    FROM public.nguon_tien
    WHERE user_id = v_user_id AND loai = p_den_quy;

    IF v_quy_id IS NULL THEN
        INSERT INTO public.nguon_tien (user_id, ten_nguon, loai, so_du)
        VALUES (
            v_user_id, 
            CASE WHEN p_den_quy = 'DU_PHONG' THEN 'Quỹ Dự Phòng' ELSE 'Quỹ Đầu Tư' END, 
            p_den_quy, 
            0
        )
        RETURNING id INTO v_quy_id;
    END IF;

    -- Thực hiện chuyển tiền bằng cách tạo:
    -- 1. Một phiếu chi từ nguồn tiền nguồn
    INSERT INTO public.phieu_chi (user_id, so_tien, ly_do_chi, nguoi_chi, id_nguon_thu)
    VALUES (
        v_user_id, 
        p_so_tien, 
        'Điều chuyển tiền sang ' || CASE WHEN p_den_quy = 'DU_PHONG' THEN 'Quỹ Dự Phòng' ELSE 'Quỹ Đầu Tư' END, 
        'Hệ thống', 
        v_nguon_id
    );

    -- 2. Tăng số dư trực tiếp của quỹ đích
    UPDATE public.nguon_tien
    SET so_du = so_du + p_so_tien
    WHERE id = v_quy_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Hàm rút tiền từ Quỹ Dự Phòng
CREATE OR REPLACE FUNCTION public.rut_tien_du_phong(p_so_tien BIGINT, p_ly_do TEXT, p_nguoi_rut TEXT)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_nguon_id UUID;
    v_quy_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Chưa xác thực người dùng.';
    END IF;

    -- Tìm Quỹ Dự Phòng
    SELECT id INTO v_quy_id
    FROM public.nguon_tien
    WHERE user_id = v_user_id AND loai = 'DU_PHONG'
    LIMIT 1;

    IF v_quy_id IS NULL OR (SELECT so_du FROM public.nguon_tien WHERE id = v_quy_id) < p_so_tien THEN
        RAISE EXCEPTION 'Quỹ dự phòng không đủ số dư để rút.';
    END IF;

    -- Tìm nguồn nhận (Ví/Ngân hàng) đầu tiên để nhận tiền
    SELECT id INTO v_nguon_id
    FROM public.nguon_tien
    WHERE user_id = v_user_id AND loai IN ('TIEN_MAT', 'NGAN_HANG')
    ORDER BY thu_tu ASC
    LIMIT 1;

    IF v_nguon_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy nguồn tiền nhận hợp lệ.';
    END IF;

    -- Trừ số dư Quỹ Dự Phòng
    UPDATE public.nguon_tien
    SET so_du = so_du - p_so_tien
    WHERE id = v_quy_id;

    -- Tạo một phiếu thu vào nguồn tiền nhận
    INSERT INTO public.phieu_thu (user_id, so_tien, ly_do_thu, nguoi_thu, id_nguon_thu)
    VALUES (
        v_user_id, 
        p_so_tien, 
        'Rút từ Quỹ Dự Phòng: ' || p_ly_do, 
        p_nguoi_rut, 
        v_nguon_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Hàm giải ngân từ Quỹ Đầu Tư
CREATE OR REPLACE FUNCTION public.rut_quy_dau_tu(p_so_tien BIGINT, p_ly_do TEXT, p_nguoi_thuc_hien TEXT, p_id_nguon_thu UUID)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_quy_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Chưa xác thực người dùng.';
    END IF;

    -- Tìm Quỹ Đầu Tư
    SELECT id INTO v_quy_id
    FROM public.nguon_tien
    WHERE user_id = v_user_id AND loai = 'DAU_TU'
    LIMIT 1;

    IF v_quy_id IS NULL OR (SELECT so_du FROM public.nguon_tien WHERE id = v_quy_id) < p_so_tien THEN
        RAISE EXCEPTION 'Quỹ đầu tư không đủ số dư để giải ngân.';
    END IF;

    -- Trừ số dư Quỹ Đầu Tư
    UPDATE public.nguon_tien
    SET so_du = so_du - p_so_tien
    WHERE id = v_quy_id;

    -- Tạo một giao dịch đầu tư vào tài sản nhận
    INSERT INTO public.giao_dich_dau_tu (user_id, so_tien, ly_do, nguoi_thuc_hien, id_nguon_thu)
    VALUES (
        v_user_id, 
        p_so_tien, 
        p_ly_do, 
        p_nguoi_thuc_hien, 
        p_id_nguon_thu
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Hàm chốt sổ kỳ khớp số
CREATE OR REPLACE FUNCTION public.func_khop_so_ky(
    p_user_id UUID,
    p_id_kiem_toan UUID,
    p_thoi_gian_bat_dau TIMESTAMPTZ,
    p_thoi_gian_ket_thuc TIMESTAMPTZ,
    p_tuan INTEGER,
    p_nam INTEGER
) RETURNS VOID AS $$
DECLARE
    v_thu_nhap_rong BIGINT := 0;
    v_chi_sinh_ton BIGINT := 0;
    v_ap_luc_no_kd BIGINT := 0;
    v_dong_tien_gop BIGINT := 0;
    v_muc_do_song_sot BIGINT := 0;
BEGIN
    -- 1. Tính toán các chỉ số BCTC cho tuần này
    SELECT COALESCE(SUM(so_tien), 0) INTO v_thu_nhap_rong
    FROM public.phieu_thu
    WHERE user_id = p_user_id
      AND (p_thoi_gian_bat_dau IS NULL OR thoi_gian > p_thoi_gian_bat_dau)
      AND thoi_gian <= p_thoi_gian_ket_thuc;

    SELECT COALESCE(SUM(so_tien), 0) INTO v_chi_sinh_ton
    FROM public.phieu_chi
    WHERE user_id = p_user_id
      AND id_ngan_sach IS NOT NULL
      AND (p_thoi_gian_bat_dau IS NULL OR thoi_gian > p_thoi_gian_bat_dau)
      AND thoi_gian <= p_thoi_gian_ket_thuc;

    SELECT COALESCE(SUM(so_tien), 0) INTO v_ap_luc_no_kd
    FROM public.phieu_chi
    WHERE user_id = p_user_id
      AND id_khoan_no IS NOT NULL
      AND (p_thoi_gian_bat_dau IS NULL OR thoi_gian > p_thoi_gian_bat_dau)
      AND thoi_gian <= p_thoi_gian_ket_thuc;

    v_dong_tien_gop := v_thu_nhap_rong - v_chi_sinh_ton;
    v_muc_do_song_sot := v_dong_tien_gop - v_ap_luc_no_kd;

    -- 2. Chèn vào bảng chot_bctc_tuan
    INSERT INTO public.chot_bctc_tuan (user_id, tuan, nam, thu_nhap_rong, chi_sinh_ton, dong_tien_gop, ap_luc_no_kd, muc_do_song_sot)
    VALUES (p_user_id, p_tuan, p_nam, v_thu_nhap_rong, v_chi_sinh_ton, v_dong_tien_gop, v_ap_luc_no_kd, v_muc_do_song_sot)
    ON CONFLICT (user_id, tuan, nam) 
    DO UPDATE SET 
        thu_nhap_rong = EXCLUDED.thu_nhap_rong,
        chi_sinh_ton = EXCLUDED.chi_sinh_ton,
        dong_tien_gop = EXCLUDED.dong_tien_gop,
        ap_luc_no_kd = EXCLUDED.ap_luc_no_kd,
        muc_do_song_sot = EXCLUDED.muc_do_song_sot;

    -- 3. Chèn chốt ngân sách tuần
    INSERT INTO public.chot_ngan_sach_tuan (user_id, id_ngan_sach, id_kiem_toan, so_tien_chi, tuan, nam)
    SELECT 
        p_user_id,
        ns.id AS id_ngan_sach,
        p_id_kiem_toan,
        COALESCE(SUM(pc.so_tien), 0) AS so_tien_chi,
        p_tuan,
        p_nam
    FROM public.ngan_sach ns
    LEFT JOIN public.phieu_chi pc ON pc.id_ngan_sach = ns.id 
      AND (p_thoi_gian_bat_dau IS NULL OR pc.thoi_gian > p_thoi_gian_bat_dau)
      AND pc.thoi_gian <= p_thoi_gian_ket_thuc
    WHERE ns.user_id = p_user_id
    GROUP BY ns.id;

    -- 4. Chèn chốt trả nợ tuần
    INSERT INTO public.chot_tra_no_tuan (user_id, id_khoan_no, id_kiem_toan, so_tien_tra, tuan, nam)
    SELECT 
        p_user_id,
        kn.id AS id_khoan_no,
        p_id_kiem_toan,
        COALESCE(SUM(pc.so_tien), 0) AS so_tien_tra,
        p_tuan,
        p_nam
    FROM public.khoan_no kn
    LEFT JOIN public.phieu_chi pc ON pc.id_khoan_no = kn.id
      AND (p_thoi_gian_bat_dau IS NULL OR pc.thoi_gian > p_thoi_gian_bat_dau)
      AND pc.thoi_gian <= p_thoi_gian_ket_thuc
    WHERE kn.user_id = p_user_id
    GROUP BY kn.id;

    -- 5. Chèn chốt nguồn thu tuần (bao gồm cả tài sản đầu tư)
    INSERT INTO public.chot_nguon_thu_tuan (user_id, id_nguon_thu, tuan, nam, loi_nhuan, is_tai_san)
    SELECT 
        p_user_id,
        nt.id AS id_nguon_thu,
        p_tuan,
        p_nam,
        (
            COALESCE((SELECT SUM(pt.so_tien) FROM public.phieu_thu pt WHERE pt.id_nguon_thu = nt.id AND (p_thoi_gian_bat_dau IS NULL OR pt.thoi_gian > p_thoi_gian_bat_dau) AND pt.thoi_gian <= p_thoi_gian_ket_thuc), 0)
            - COALESCE((SELECT SUM(pc.so_tien) FROM public.phieu_chi pc WHERE pc.id_nguon_thu = nt.id AND (p_thoi_gian_bat_dau IS NULL OR pc.thoi_gian > p_thoi_gian_bat_dau) AND pc.thoi_gian <= p_thoi_gian_ket_thuc), 0)
        ) AS loi_nhuan,
        EXISTS (SELECT 1 FROM public.giao_dich_dau_tu gd WHERE gd.id_nguon_thu = nt.id) AS is_tai_san
    FROM public.nguon_tien nt
    WHERE nt.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Hàm hoàn tác chốt sổ kỳ khớp số
CREATE OR REPLACE FUNCTION public.func_undo_khop_so_ky(
    p_user_id UUID,
    p_id_kiem_toan UUID
) RETURNS VOID AS $$
DECLARE
    v_tuan INT;
    v_nam INT;
BEGIN
    -- Tìm tuần/năm từ bảng kiểm toán
    SELECT tuan_thu, nam INTO v_tuan, v_nam
    FROM public.kiem_toan_tc_tuan
    WHERE id = p_id_kiem_toan AND user_id = p_user_id;

    IF v_tuan IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy thông tin phiên kiểm toán.';
    END IF;

    -- Xóa chốt ngân sách tuần
    DELETE FROM public.chot_ngan_sach_tuan
    WHERE id_kiem_toan = p_id_kiem_toan AND user_id = p_user_id;

    -- Xóa chốt trả nợ tuần
    DELETE FROM public.chot_tra_no_tuan
    WHERE id_kiem_toan = p_id_kiem_toan AND user_id = p_user_id;

    -- Xóa chốt nguồn thu tuần
    DELETE FROM public.chot_nguon_thu_tuan
    WHERE tuan = v_tuan AND nam = v_nam AND user_id = p_user_id;

    -- Xóa chốt BCTC tuần
    DELETE FROM public.chot_bctc_tuan
    WHERE tuan = v_tuan AND nam = v_nam AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Hàm lấy email bằng identifier (đăng nhập đa năng)
CREATE OR REPLACE FUNCTION public.get_email_by_identifier(identifier TEXT)
RETURNS TEXT AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email
    FROM auth.users
    WHERE email = identifier
       OR raw_user_meta_data->>'username' = identifier
       OR raw_user_meta_data->>'phone' = identifier
    LIMIT 1;
    RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger tự động gán nguồn tiền mặc định cho phiếu chi (khi chi ngân sách hoặc chi trả nợ)
CREATE OR REPLACE FUNCTION public.trg_assign_default_nguon_thu()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_nguon_thu IS NULL THEN
        -- Tìm nguồn tiền đầu tiên của user có loai là TIEN_MAT hoặc NGAN_HANG
        SELECT id INTO NEW.id_nguon_thu
        FROM public.nguon_tien
        WHERE user_id = NEW.user_id AND loai IN ('TIEN_MAT', 'NGAN_HANG')
        ORDER BY thu_tu ASC, created_at ASC
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER assign_default_nguon_thu
BEFORE INSERT ON public.phieu_chi
FOR EACH ROW
EXECUTE FUNCTION public.trg_assign_default_nguon_thu();

-- 11. Trigger tự động gán nguồn tiền mặc định cho phiếu thu (khi khớp sổ điều chỉnh dôi dư)
CREATE OR REPLACE FUNCTION public.trg_assign_default_nguon_thu_phieu_thu()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_nguon_thu IS NULL THEN
        -- Tìm nguồn tiền đầu tiên của user có loai là TIEN_MAT hoặc NGAN_HANG
        SELECT id INTO NEW.id_nguon_thu
        FROM public.nguon_tien
        WHERE user_id = NEW.user_id AND loai IN ('TIEN_MAT', 'NGAN_HANG')
        ORDER BY thu_tu ASC, created_at ASC
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER assign_default_nguon_thu_phieu_thu
BEFORE INSERT ON public.phieu_thu
FOR EACH ROW
EXECUTE FUNCTION public.trg_assign_default_nguon_thu_phieu_thu();


-- Cập nhật giá trị mặc định cho cột user_id là auth.uid() ở các bảng để chạy RLS an toàn
ALTER TABLE public.nguon_tien ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.ngan_sach ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.khoan_no ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.phieu_thu ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.phieu_chi ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.kiem_toan_tc_tuan ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.chot_tra_no_tuan ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.chot_ngan_sach_tuan ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.giao_dich_dau_tu ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.chot_bctc_tuan ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.chot_nguon_thu_tuan ALTER COLUMN user_id SET DEFAULT auth.uid();


-- ==========================================
-- CẤU HÌNH BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ==========================================

ALTER TABLE public.nguon_tien ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngan_sach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khoan_no ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phieu_thu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phieu_chi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiem_toan_tc_tuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chot_tra_no_tuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chot_ngan_sach_tuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giao_dich_dau_tu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chot_bctc_tuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chot_nguon_thu_tuan ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách bảo mật cho từng bảng (xóa trước nếu đã tồn tại để tránh lỗi)
DROP POLICY IF EXISTS "Allow users to manage their own nguon_tien" ON public.nguon_tien;
CREATE POLICY "Allow users to manage their own nguon_tien" ON public.nguon_tien FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own ngan_sach" ON public.ngan_sach;
CREATE POLICY "Allow users to manage their own ngan_sach" ON public.ngan_sach FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own khoan_no" ON public.khoan_no;
CREATE POLICY "Allow users to manage their own khoan_no" ON public.khoan_no FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own phieu_thu" ON public.phieu_thu;
CREATE POLICY "Allow users to manage their own phieu_thu" ON public.phieu_thu FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own phieu_chi" ON public.phieu_chi;
CREATE POLICY "Allow users to manage their own phieu_chi" ON public.phieu_chi FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own kiem_toan" ON public.kiem_toan_tc_tuan;
CREATE POLICY "Allow users to manage their own kiem_toan" ON public.kiem_toan_tc_tuan FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own chot_tra_no" ON public.chot_tra_no_tuan;
CREATE POLICY "Allow users to manage their own chot_tra_no" ON public.chot_tra_no_tuan FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own chot_ngan_sach" ON public.chot_ngan_sach_tuan;
CREATE POLICY "Allow users to manage their own chot_ngan_sach" ON public.chot_ngan_sach_tuan FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own giao_dich_dau_tu" ON public.giao_dich_dau_tu;
CREATE POLICY "Allow users to manage their own giao_dich_dau_tu" ON public.giao_dich_dau_tu FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own chot_bctc" ON public.chot_bctc_tuan;
CREATE POLICY "Allow users to manage their own chot_bctc" ON public.chot_bctc_tuan FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage their own chot_nguon_thu" ON public.chot_nguon_thu_tuan;
CREATE POLICY "Allow users to manage their own chot_nguon_thu" ON public.chot_nguon_thu_tuan FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

