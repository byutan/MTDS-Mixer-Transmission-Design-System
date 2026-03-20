import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Mechanical Design Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden rounded-r-3xl">
        {/* Blurred Mechanical Background */}
        <div className="absolute inset-0">
          <img
            src="/mechanical-gears.png"
            alt="Mechanical Design"
            className="object-cover opacity-40 w-full h-full rotate-270 scale-150"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-blue-800/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-6 font-sans tracking-tight">
            THIẾT KẾ CƠ KHÍ
          </h1>
          <p className="text-lg text-gray-100 leading-relaxed mb-4">
            Tự động hóa 100% quy trình tính toán hộp giảm tốc và xuất bản vẽ CAD
          </p>
          <p className="text-base text-gray-200">
            Dành riêng cho sinh viên và kỹ sư Cơ kỹ thuật.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            // Login Form
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
                <p className="text-gray-600">Đăng nhập để tiếp tục thiết kế của bạn</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@example.com"
                    className="border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="border-gray-300 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium">
                  Đăng nhập
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Tạo tài khoản
                </button>
              </div>
            </div>
          ) : (
            // Signup Form
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
                <p className="text-gray-600">Bắt đầu thiết kế cơ khí chuyên nghiệp</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-gray-700">Họ và tên</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Nguyễn Văn Học"
                    className="border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-id" className="text-gray-700">Mã số sinh viên</Label>
                  <Input
                    id="student-id"
                    type="text"
                    placeholder="2013257"
                    className="border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    className="border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="border-gray-300 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="border-gray-300 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium">
                  Tạo tài khoản
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


