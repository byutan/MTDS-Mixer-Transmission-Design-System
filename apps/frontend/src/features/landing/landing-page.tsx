import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Clock, Target, Database, ArrowRight } from 'lucide-react'
import { Navbar } from '../common/navbar'

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar isLoggedIn={!!user} username={user?.fullname} />




      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-4">
                <span className="text-xl  font-bold text-blue-600">MTDS</span>
                <br />
                <span className="text-xl  font-bold text-blue-600">Mixer Transmission Design System</span>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2 leading-tight">
                  Thiết kế hệ thống dẫn động thùng trộn
                </h1>
              </div>

              <p className="text-lg text-slate-600 mt-4 mb-8">
                Hỗ trợ người dùng tính toán, thiết kế chỉ tiêu máy, dự xuất linh kiện tiêu chuẩn và kích thước về (CAD Script) nhanh chóng, chính xác.
              </p>

              <div className="flex gap-8 mb-8">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900">7</div>
                  <div className="text-sm text-slate-600">Bước thiết kế</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Tự động hóa</div>
                </div>
              </div>

              <Link to={user ? "/design" : "/signup"}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                  {user ? "Tiếp tục thiết kế" : "Bắt đầu thiết kế"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

            </div>

            {/* Right - Interactive Product Images Gallery */}
            <div className="relative h-[450px] lg:h-[550px] flex items-center justify-center w-full max-w-2xl mx-auto">
              {[
                { src: "/gear-reducer.jpg", alt: "Gear Reducer" },
                { src: "/nmx-8-12-b.webp", alt: "NMX 8-12-B Gearbox" },
                { src: "/transmission-diagram.webp", alt: "Transmission Diagram" }
              ].map((img, index) => {
                // Tính toán vị trí hiển thị (0: Trái, 1: Giữa, 2: Phải) dựa trên vòng quay
                // Công thức: (index - activeIndex + 3) % 3
                const displayPosition = (index - activeIndex + 3) % 3;
                
                let positionClasses = "";
                if (displayPosition === 1) {
                  // Đang ở chính giữa
                  positionClasses = "z-30 scale-110 shadow-2xl translate-x-0 opacity-100";
                } else if (displayPosition === 0) {
                  // Ở bên trái (phía sau)
                  positionClasses = "z-10 scale-90 shadow-lg -translate-x-[50%] opacity-50 hover:opacity-100 group";
                } else {
                  // Ở bên phải (phía sau)
                  positionClasses = "z-10 scale-90 shadow-lg translate-x-[50%] opacity-50 hover:opacity-100 group";
                }


                return (
                  <div
                    key={index}
                    className={`absolute w-1/2 h-4/5 bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center p-6 ${positionClasses}`}
                  >
                    {/* Clickable regions for side images */}
                    {displayPosition === 0 && (
                      <div 
                        onClick={() => setActiveIndex((prev) => (prev - 1 + 3) % 3)}
                        className="absolute inset-y-0 left-0 w-1/2 z-40 cursor-pointer group/click"
                      >
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/click:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    {displayPosition === 2 && (
                      <div 
                        onClick={() => setActiveIndex((prev) => (prev + 1 + 3) % 3)}
                        className="absolute inset-y-0 right-0 w-1/2 z-40 cursor-pointer group/click"
                      >
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/click:opacity-100 transition-opacity" />
                      </div>
                    )}


                    <div className="absolute inset-0 bg-slate-50 opacity-0 transition-opacity pointer-events-none" />
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />
                  </div>
                );

              })}
            </div>



          </div>
        </div>
      </section>

      {/* Design Process Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Quy trình thiết kế hoàn toàn tự động
            </h2>
            <p className="text-lg text-slate-600">
              7 bước tính toán thông minh giúp bạn tối ưu hóa thiết kế trong thời gian ngắn nhất
            </p>
          </div>

          <div className="space-y-6 lg:space-y-6">
            {/* Row 1: Steps 1, 2 & 3 (Centered and same size as row 2) */}
            <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
              {[
                { step: 1, title: 'Khởi tạo', desc: 'Dễ dàng tạo và quản lý thông số đầu vào' },
                { step: 2, title: 'Động cơ', desc: 'Phân phối tỷ số truyền và chọn động cơ tối ưu' },
                { step: 3, title: 'Bộ truyền đai', desc: 'Thiết kế bộ truyền đai' },
              ].map((item) => (
                <div key={item.step} className="bg-blue-50 rounded-xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition-shadow w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <div className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 inline-block text-base mb-6 shadow-md">
                    Bước {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Row 2: Steps 4, 5, 6 & 7 */}
            <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
              {[
                { step: 4, title: 'Hộp giảm tốc', desc: 'Thiết kế, tính toán kết cấu' },
                { step: 5, title: 'Trục', desc: 'Thiết kế, tính toán kết cấu' },
                { step: 6, title: 'Ổ lăn', desc: 'Lựa chọn và kiểm nghiệm ổ lăn' },
                { step: 7, title: 'Vỏ hộp giảm tốc', desc: 'Thiết kế, tính toán kết cấu' }
              ].map((item) => (
                <div key={item.step} className="bg-blue-50 rounded-xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition-shadow w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <div className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 inline-block text-base mb-6 shadow-md">
                    Bước {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Why MTDS Section */}
      <section className="py-16 lg:py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Tại sao nên chọn MTDS?
            </h2>
            <p className="text-lg text-slate-600">
              Giải pháp toàn diện cho sinh viên và kỹ sư cơ kỹ thuật
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">80%</h3>
              <p className="font-semibold text-slate-900 mb-2">Tiết kiệm thời gian</p>
              <p className="text-slate-600 text-sm">Tra bảng thủ công & tính toán</p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="font-semibold text-slate-900 mb-2">Độ chính xác</p>
              <p className="text-slate-600 text-sm">Loại bỏ sai số do tính toán</p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Database</h3>
              <p className="font-semibold text-slate-900 mb-2">Tích hợp chuẩn</p>
              <p className="text-slate-600 text-sm">Động cơ, tinh sàng lên để lựa chọn</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-blue-50 rounded-2xl border border-blue-200 p-12 text-center shadow-sm">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Sẵn sàng thiết kế?
          </h2>
          <p className="text-2xl text-slate-600 mb-8">
            Tham gia cùng hàng trăm sinh viên và kỹ sư cơ kỹ để tối ưu hóa quy trình thiết kế của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="outline" size="lg">Đăng nhập</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Đăng ký</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                  <img src="/LOGO.png" alt="MTDS Logo" className="w-full h-full object-contain" />
                </div>

                <div>
                  <div className="font-bold text-sm">MTDS</div>
                  <div className="text-xs text-blue-100">Mixer Transmission Design System</div>
                </div>
              </div>
              <p className="text-sm text-blue-100">
                Phần mềm thiết kế hệ thống truyền động dành cho sinh viên và kỹ sư
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Dự án</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li><a href="#" className="hover:text-white">Dự án mẫu</a></li>
                <li><a href="#" className="hover:text-white">Bộ truyền Dẫn</a></li>
                <li><a href="#" className="hover:text-white">Hộp giảm tốc</a></li>
                <li><a href="#" className="hover:text-white">Ổ lăn</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Thiết kế</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li><a href="#" className="hover:text-white">Bộ truyền Đai</a></li>
                <li><a href="#" className="hover:text-white">Hộp giảm tốc</a></li>
                <li><a href="#" className="hover:text-white">Trục</a></li>
                <li><a href="#" className="hover:text-white">Ổ lăn</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li><a href="#" className="hover:text-white">Danh sách liên lạc</a></li>
                <li><a href="#" className="hover:text-white">Q&A</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100">
              <p>© 2025 MTDS - Mixer Transmission Design System</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Term</a>
                <a href="#" className="hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
