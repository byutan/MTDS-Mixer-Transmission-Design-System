import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, FolderOpen, MoreVertical, Trash2, ArrowUpDown, Loader2 } from 'lucide-react'
import { Navbar } from '../common/navbar'
import { useNavigate } from 'react-router-dom'
import { useDesign } from '../design/context/DesignContext'

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { setFormData, setStep2Data, setProjectId, clearProjectData } = useDesign();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchProjects(userData.student_id);
    } else {
      navigate('/login');
    }
  }, []);

  const fetchProjects = async (studentId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/projects?student_id=${studentId}`);
      const result = await res.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setProjects(projects.filter(p => p.project_id !== projectId));
      }
    } catch (error) {
      alert("Không thể xóa dự án. Vui lòng thử lại.");
    }
  };

  const handleOpenProject = (project: any) => {
    // Quan trọng: Nạp ID dự án để lưu đè thay vì tạo mới
    setProjectId(project.project_id);

    // Nạp dữ liệu vào Context
    setFormData({
      projectName: project.project_name || '',
      major: project.major || '',
      studentId: project.student_id || '',
      studentName: user?.fullname || '',
      instructor: project.instructor || '',
      createdDate: new Date(project.created_date).toISOString().split('T')[0],
      power: project.power_kw?.toString() || '',
      speed: project.speed_rpm?.toString() || '',
      lifespan: project.lifespan_hours?.toString() || '',
      type: project.rotation_type || 'Quay 1 chiều',
      loadCharacter: project.load_character || 'Tải va đập nhẹ',
      workMode: project.work_mode || '2 ca',
      workDaysYear: project.work_days_per_year?.toString() || '360',
      workHoursDay: project.work_hours_per_day?.toString() || '8',
      loadMode: project.load_mode || 'Thay đổi theo bậc',
    });

    setStep2Data({
      systemEfficiency: project.efficiency_sigma?.toString() || '0.000',
      motorEfficiency: '0.000',
      requiredPower: project.required_power_pk?.toString() || '0.000',
      preliminarySpeed: project.preliminary_speed_nsb?.toString() || '0.000',
      totalRatio: project.total_ratio_ut?.toString() || '0.000',
      beltRatio: project.belt_ratio_ud?.toString() || '0.000',
      gearboxRatio: project.gearbox_ratio_uh?.toString() || '0.000',
      u1: project.u1?.toString() || '0.000',
      u2: project.u2?.toString() || '0.000',
      cosPhi: project.motor_cos_phi?.toString() || '0.000',
      tMaxTdm: project.motor_t_max_tdm?.toString() || '0.000',
      tKdTdm: project.motor_t_kd_tdm?.toString() || '0.000',
      motor: project.motor_code || '',
      motorPower: project.motor_power_actual?.toString() || '0.000',
      motorSpeed: project.motor_speed_actual?.toString() || '0.000'
    });

    // Điều hướng đến bước đang làm dở
    const step = project.current_step || 1;
    navigate(`/design/step-${step}`);
  };

  const filteredProjects = projects
    .filter(p => p.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'completed') return p.current_step === 7;
      return p.current_step < 7;
    })
    .sort((a, b) => {
      if (sortBy === 'nameAsc') return a.project_name.localeCompare(b.project_name);
      if (sortBy === 'nameDesc') return b.project_name.localeCompare(a.project_name);
      if (sortBy === 'newest') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar isLoggedIn={!!user} username={user?.fullname} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dự án của tôi</h1>
            <p className="text-slate-500 font-medium italic">Chào mừng trở lại, {user?.fullname || 'Người dùng'}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Tìm kiếm dự án..." 
                  className="pl-10 h-11 bg-white border-slate-200 focus:ring-blue-500 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-11 bg-white rounded-xl">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="inprogress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                </SelectContent>
             </Select>

             <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] h-11 bg-white rounded-xl">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="newest">Mới nhất (Cập nhật)</SelectItem>
                    <SelectItem value="oldest">Cũ nhất (Cập nhật)</SelectItem>
                    <SelectItem value="nameAsc">Tên A - Z</SelectItem>
                    <SelectItem value="nameDesc">Tên Z - A</SelectItem>
                </SelectContent>
             </Select>

             <Button 
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-200" 
                onClick={() => {
                  clearProjectData(false);
                  navigate('/design/step-1');
                }}
             >
               Tạo mới
             </Button>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold animate-pulse">Đang tải danh sách dự án...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <Card key={p.project_id} className="group hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 cursor-pointer border-2 border-transparent bg-white rounded-2xl overflow-hidden shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={p.current_step === 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600 font-bold'}>
                      {p.current_step === 7 ? 'Đã hoàn thành' : `Bước ${p.current_step || 1}/7`}
                    </Badge>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {p.project_name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3 pb-6">
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ngày tạo: <span className="text-slate-700">{new Date(p.created_at).toLocaleDateString('vi-VN')}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cập nhật: <span className="text-slate-700">{new Date(p.updated_at).toLocaleDateString('vi-VN')}</span></span>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                         <span>Tiến độ thực hiện</span>
                         <span>{Math.round(((p.current_step || 1) / 7) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <div 
                           className={`h-full transition-all duration-1000 ${p.current_step === 7 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                           style={{ width: `${((p.current_step || 1) / 7) * 100}%` }}
                         ></div>
                      </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-slate-50/50 p-4 border-t flex gap-2">
                   <Button 
                    variant="outline" 
                    className="flex-1 bg-white border-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(p.project_id)}
                   >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                   </Button>
                   <Button 
                    className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-100"
                    onClick={() => handleOpenProject(p)}
                   >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Mở dự án
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
           <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <FolderOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-1">Không tìm thấy dự án nào</h3>
              <p className="text-slate-500">Hãy bắt đầu tạo đồ án đầu tiên của bạn!</p>
              <Button className="mt-6 bg-blue-600 font-bold" onClick={() => navigate('/design/step-1')}>Tạo đồ án mới</Button>
           </div>
        )}
      </div>
    </div>
  )
}
