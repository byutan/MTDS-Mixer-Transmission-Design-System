import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
}

export function Navbar({ isLoggedIn = false, username = "Người dùng" }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/LOGO.png" alt="MTDS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 leading-none mb-1">MTDS</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Mixer Transmission Design System</div>
          </div>
        </Link>

        {/* Navigation Links - Constant for everyone */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">Trang chủ</Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">Dự án</Link>
          <Link to="/design" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">Thiết kế</Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">Thư viện</Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">Hướng dẫn</Link>
        </nav>

        {/* Right Section - Dynamic based on Login state */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-slate-100 pl-4 pr-1 py-1 rounded-full border border-slate-200 shadow-sm">
              <span className="text-sm text-slate-700 font-bold hidden sm:inline leading-none">{username}</span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm ring-2 ring-white">
                {username.substring(0, 2).toUpperCase()}
              </div>
            </div>
          ) : (

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold text-slate-700">Đăng nhập</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-100">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
