// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  // --- BẮT ĐẦU KHỐI DEBUG ---
  console.log("\n=== 🔴 DEBUG PROXY START ===");
  console.log("1. Cố gắng truy cập URL:", url.pathname);
  console.log("2. Trạng thái người dùng:", user ? `Đã đăng nhập (ID: ${user.id})` : "KHÔNG TÌM THẤY USER");
  console.log("3. Các Cookie hiện có trong Request:", request.cookies.getAll().map(c => c.name).join(", "));
  console.log("=== 🔴 DEBUG PROXY END ===\n");
  // --- KẾT THÚC KHỐI DEBUG ---

  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
  const isDashboardRoute = url.pathname.startsWith('/dashboard');

  if (url.pathname === '/') {
    url.pathname = user ? '/dashboard' : '/login';
    return NextResponse.redirect(url);
  }

  if (!user && isDashboardRoute) {
    console.log("🚨 ĐUỔI RA: Chưa đăng nhập mà đòi vào Dashboard!");
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    console.log("✅ BẺ LÁI: Đã đăng nhập, tự động đẩy vào Dashboard.");
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};