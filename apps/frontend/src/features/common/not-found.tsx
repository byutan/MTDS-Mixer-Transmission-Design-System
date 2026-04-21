import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <img 
          src="/mechanical-gears.png" 
          alt="Gears" 
          className="w-full h-full object-contain rotate-12 scale-150"
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8 flex justify-center">
          <div className="w-28 h-28 bg-yellow-50 rounded-full flex items-center justify-center border-2 border-yellow-100 animate-pulse">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
        </div>


        <h1 className="text-9xl font-black text-blue-900 mb-2 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Ôi! Có gì đó không ổn...
        </h2>
        
        <p className="text-lg text-slate-600 max-w-md mx-auto mb-10 leading-relaxed font-medium">
          Trang bạn đang tìm kiếm hiện tại không có trong hệ thống thiết kế truyền động MTDS. Có thể đường dẫn đã bị lỗi hoặc trang đã bị xóa.
        </p>

        <Link to="/">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold gap-3 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <Home className="w-6 h-6" />
            Về lại trang chủ ngay
          </Button>
        </Link>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-8 text-slate-400 text-sm font-medium">
        MTDS - Mixer Transmission Design System
      </div>
    </div>
  )
}
