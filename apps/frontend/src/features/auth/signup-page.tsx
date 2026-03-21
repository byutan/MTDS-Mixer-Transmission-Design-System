import { useState } from 'react'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Mechanical Design Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden rounded-r-[50px]">
        <div className="absolute inset-0">
          <img
            src="/mechanical-gears.png"
            alt="Mechanical Design"
            className="object-contain opacity-25 w-full h-full rotate-270 scale-[1.5]"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-blue-800/40"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-center translate-y-20">

          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            THIẾT KẾ CƠ KHÍ
          </h1>
          <div className="w-60 h-1 bg-white mb-8"></div>

          <p className="text-lg text-gray-100 leading-relaxed mb-4">
            Tự động hóa 100% quy trình tính toán hộp giảm tốc và xuất bản vẽ CAD
          </p>
          <p className="text-lg text-gray-200">
            Dành riêng cho sinh viên và kỹ sư Cơ kỹ thuật.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
