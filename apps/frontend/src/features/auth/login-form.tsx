import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password requires at least one uppercase letter")
    .regex(/[a-z]/, "Password requires at least one lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password requires at least one special character"),
})

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverMsg, setServerMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setServerMsg(null)
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: values.email, 
          password: values.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setServerMsg({ type: 'success', text: "Login successful. Redirecting..." })
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('mtds_user', JSON.stringify(data.user))
        
        // Chuyển hướng về trang chủ sau 1s để kịp thấy thông báo thành công
        setTimeout(() => {
          navigate('/')
          window.location.reload() // Reload để navbar cập nhật trạng thái mới
        }, 1000)
      } else {
        setServerMsg({ type: 'error', text: data.message || "Invalid email or password" })
      }
    } catch (error) {
      setServerMsg({ type: 'error', text: "Internal Server Error. Please try again." })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
        <p className="text-gray-600">Đăng nhập để tiếp tục thiết kế của bạn</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="rounded-lg pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* HIỂN THỊ THÔNG BÁO TỪ SERVER */}
          {serverMsg && (
            <div className={`flex items-center gap-2 p-3 text-sm rounded-lg border ${
              serverMsg.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {serverMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{serverMsg.text}</span>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium">
            Đăng nhập
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <button onClick={onSwitchToSignup} className="text-blue-600 hover:text-blue-700 font-medium">
          Tạo tài khoản
        </button>
      </div>
    </div>
  )
}