import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/LOGO.png" alt="MTDS Logo" className="w-full h-full object-contain" />
          </div>


          <div>
            <div className="font-bold text-sm text-slate-900">MTDS</div>
            <div className="text-xs text-slate-500">Hệ thống thiết kế truyền động</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Trang chủ</a>
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Dự án</a>
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Thiết kế</a>
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Thư viện</a>
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Hướng dẫn</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">Đăng nhập</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Đăng ký</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
