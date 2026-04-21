import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, ChevronDown, User, Settings } from 'lucide-react'

interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
}

export function Navbar({ isLoggedIn = false, username = "Người dùng" }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('mtds_user')
    // Reset state and redirect
    setIsDropdownOpen(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
            <img src="/LOGO.png" alt="MTDS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 leading-none mb-1">MTDS</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Mixer Transmission Design System</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors relative group">
            Trang chủ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors relative group">
            Dự án
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/design" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors relative group">
            Thiết kế
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors relative group">
            Thư viện
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="#" className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors relative group">
            Hướng dẫn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 pl-4 pr-1 py-1 rounded-full border border-slate-200 shadow-sm hover:bg-slate-200 hover:border-slate-300 transition-all active:scale-95"
              >
                <span className="text-sm text-slate-700 font-bold hidden sm:inline leading-none">{username}</span>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm ring-2 ring-white">
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tài khoản</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{username}</p>
                    </div>
                    
                    <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <User className="w-4 h-4" /> Hồ sơ cá nhân
                    </Link>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Settings className="w-4 h-4" /> Cài đặt
                    </button>
                    
                    <div className="h-px bg-slate-50 my-1 mx-2"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold text-slate-700 hover:bg-slate-50">Đăng nhập</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
