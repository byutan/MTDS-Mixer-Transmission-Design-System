import { useState, useEffect } from 'react'
import { Navbar } from '../common/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, IdCard, Calendar, ShieldCheck, MapPin, BarChart3, Briefcase, Plus, Settings } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loginData, setLoginData] = useState<any[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        const sid = userData.student_id || userData.studentId;
        console.log("Đang lấy thống kê cho MSSV:", sid);

        if (sid) {
            // Gọi API lấy dữ liệu thực tế
            fetch(`http://localhost:3001/api/auth/stats/${sid}`)
                .then(res => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then(data => {
                    console.log("Dữ liệu thống kê nhận được:", data);
                    if (Array.isArray(data) && data.length > 0) {
                        setLoginData(data);
                    }
                })
                .catch(err => {
                    console.error("Lỗi lấy thống kê:", err);
                    // Nếu lỗi, để lại dữ liệu trống hoặc mặc định 0
                });
        }
    }
  }, []);

  if (!user) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-slate-500 font-bold">Vui lòng đăng nhập để xem hồ sơ...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-relaxed">
      <Navbar isLoggedIn={true} username={user.fullname || "Người dùng"} />
      
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Thẻ 1: Thông tin Hồ sơ toàn diện */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
            <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[32px] flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-8 ring-blue-50">
                    {user.fullname ? user.fullname.substring(0, 2).toUpperCase() : "US"}
                </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{user.fullname}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-500">
                        <Mail className="w-5 h-5 opacity-70" />
                        <span className="text-sm font-semibold">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                        <IdCard className="w-5 h-5 opacity-70" />
                        <span className="text-sm font-semibold italic">MSSV: {user.student_id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                        <Calendar className="w-5 h-5 opacity-70" />
                        <span className="text-sm font-semibold">Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
            
            <div className="hidden lg:block">
               <button className="p-4 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-colors">
                  <Settings className="w-6 h-6" />
               </button>
            </div>
        </div>

        {/* Thẻ 2: Tần suất đăng nhập */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tần suất đăng nhập</h3>
                    <p className="text-sm text-slate-400 font-medium italic">Thống kê hoạt động hàng năm của bạn</p>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <BarChart3 className="w-8 h-8" />
                </div>
            </div>

            <div className="h-[350px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc', radius: 10 }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="visits" radius={[6, 6, 6, 6]} barSize={22}>
                            {loginData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 11 ? '#2563eb' : '#f1f5f9'} className="transition-all hover:opacity-80" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>
    </div>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
