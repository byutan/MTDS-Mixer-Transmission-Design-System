import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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

const signupSchema = z.object({
  fullname: z.string().min(1, "Full name is required").max(100),
  studentId: z.string()
    .length(7, "Student ID must be exactly 7 digits")
    .regex(/^\d+$/, "Numbers only"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password requires at least one uppercase letter")
    .regex(/[a-z]/, "Password requires at least one lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password requires at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverMsg, setServerMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      studentId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setServerMsg(null)
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: values.fullname,
          studentId: values.studentId, // MSSV đóng vai trò khóa chính
          email: values.email,
          password: values.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setServerMsg({ type: 'success', text: "Registration successful" })
        setTimeout(() => onSwitchToLogin(), 2000)
      } else {
        setServerMsg({ type: 'error', text: data.message || "Registration failed" })
      }
    } catch (error) {
      setServerMsg({ type: 'error', text: "Server error. Please try again later." })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
        <p className="text-gray-600">Bắt đầu thiết kế cơ khí chuyên nghiệp</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl><Input placeholder="Nguyễn Văn A" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã số sinh viên</FormLabel>
                <FormControl><Input placeholder="1234567" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="example@email.com" {...field} className="rounded-lg" /></FormControl>
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
                  <FormControl><Input type={showPassword ? "text" : "password"} {...field} className="rounded-lg pr-10" /></FormControl>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <div className="relative">
                  <FormControl><Input type={showConfirmPassword ? "text" : "password"} {...field} className="rounded-lg pr-10" /></FormControl>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* HIỂN THỊ THÔNG BÁO TỪ SERVER */}
          {serverMsg && (
            <div className={`flex items-center gap-2 p-3 text-sm rounded-lg border ${
              serverMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {serverMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{serverMsg.text}</span>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium">
            Tạo tài khoản
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">
          Đăng nhập
        </button>
      </div>
    </div>
  )
}