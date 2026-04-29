// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // 1. Tạo một vỏ bọc response để có thể chỉnh sửa Cookie nếu cần
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Khởi tạo Supabase Client chuyên dụng cho Server (đọc thẻ từ Cookie)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Kiểm tra xem người dùng có đang đăng nhập không
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Lấy đường dẫn người dùng đang muốn vào
  const url = request.nextUrl.clone();
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
  const isDashboardRoute = url.pathname.startsWith('/dashboard');

  // --- LUẬT BẺ LÁI (ROUTING RULES) ---
  
  // Trường hợp A: Vào trang chủ (/) -> Có user thì vào dashboard, chưa có thì ra login
  if (url.pathname === '/') {
    url.pathname = user ? '/dashboard' : '/login';
    return NextResponse.redirect(url);
  }

  // Trường hợp B: Chưa đăng nhập mà đòi vào Dashboard -> Đuổi ra Login
  if (!user && isDashboardRoute) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Trường hợp C: Đã đăng nhập rồi mà còn mò vào trang Login/Register -> Đẩy vào Dashboard
  if (user && isAuthRoute) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Hợp lệ thì cho qua
  return supabaseResponse;
}

// Cấu hình để Lính gác KHÔNG chặn các file ảnh, icon, file tĩnh (CSS/JS)
// Bản phân công công việc mới cho Lính gác
export const config = {
  matcher: [
    /* * Lính gác CHỈ được phép thức dậy và kiểm tra vé khi khách bước vào đúng 4 cái cửa này.
     * Mọi đường link khác, mọi file ảnh, file hệ thống... lính gác sẽ mặc kệ 100%!
     */
    '/',                   // Cửa số 1: Trang chủ ngoài cùng
    '/login',              // Cửa số 2: Trang đăng nhập
    '/register',           // Cửa số 3: Trang đăng ký (cũng thuộc khu vực Auth)
    '/dashboard/:path*',   // Cửa số 4: Khu vực VIP Dashboard (và tất cả các trang con bên trong nó)
  ],
};