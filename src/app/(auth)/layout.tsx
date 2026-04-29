// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-950 px-4">
      {/* Khung Card bóp hẹp 2 bên */}
      <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
        {/* Vệt sáng trang trí */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-blue-500 blur-sm"></div>
        {children}
      </div>
    </div>
  );
}