import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'
import { useDesign, FormData } from '@/features/design/context/DesignContext'

export default function Step1Init() {
  const { formData, updateFormData } = useDesign();
  
  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData(field, value);
  }
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Card 1: Thông tin */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-2 font-sans">Thông tin</h3>
        <p className="text-sm text-gray-600 mb-8 font-sans">Thông tin đồ án</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tên dự án</Label>
            <Input
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className="border border-slate-200 rounded-md text-sm h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Lớp / Ngành</Label>
            <Input
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className="border border-slate-200 rounded-md text-sm h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Họ và tên sinh viên</Label>
            <Input
              value={formData.studentName}
              onChange={(e) => handleInputChange('studentName', e.target.value)}
              className="border border-slate-200 rounded-md text-sm h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Mã số sinh viên</Label>
            <Input
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className="border border-slate-200 rounded-md text-sm h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Giảng viên hướng dẫn</Label>
            <Input
              value={formData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
              className="border border-slate-200 rounded-md text-sm h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Ngày khởi tạo</Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.createdDate}
                onChange={(e) => handleInputChange('createdDate', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11 pl-10"
              />
              <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Thông số kỹ thuật */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-2 font-sans">Thông số kỹ thuật</h3>
        <p className="text-sm text-gray-600 mb-8 font-sans">Các thông số đầu vào từ đề bài</p>

        <div className="space-y-8">
          {/* Row 1: Number Inputs with helper text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Công suất (kW)</Label>
              <Input
                value={formData.power}
                onChange={(e) => handleInputChange('power', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11 w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Vòng quay (v/ph)</Label>
              <Input
                value={formData.speed}
                onChange={(e) => handleInputChange('speed', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11 w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tuổi thọ (giờ)</Label>
              <Input
                value={formData.lifespan}
                onChange={(e) => handleInputChange('lifespan', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11 w-full"
              />
            </div>
          </div>

          {/* Row 2: Dropdown Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chiều quay</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="w-full border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Quay 1 chiều">Quay 1 chiều</SelectItem>
                  <SelectItem value="Quay 2 chiều">Quay 2 chiều</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tính chất tải trọng</Label>
              <Select value={formData.loadCharacter} onValueChange={(value) => handleInputChange('loadCharacter', value)}>
                <SelectTrigger className="w-full border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Tải va đập nhẹ">Tải va đập nhẹ</SelectItem>
                  <SelectItem value="Tải vừa">Tải vừa</SelectItem>
                  <SelectItem value="Tải nặng">Tải nặng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chế độ làm việc</Label>
              <Select value={formData.workMode} onValueChange={(value) => handleInputChange('workMode', value)}>
                <SelectTrigger className="w-full border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="1 ca">1 ca</SelectItem>
                  <SelectItem value="2 ca">2 ca</SelectItem>
                  <SelectItem value="3 ca">3 ca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Mixed inputs and dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số ngày làm việc/năm</Label>
              <Input
                value={formData.workDaysYear}
                onChange={(e) => handleInputChange('workDaysYear', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số giờ mỗi ca</Label>
              <Input
                value={formData.workHoursDay}
                onChange={(e) => handleInputChange('workHoursDay', e.target.value)}
                className="border border-slate-200 rounded-md text-sm h-11"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chế độ tải</Label>
              <Select value={formData.loadMode} onValueChange={(value) => handleInputChange('loadMode', value)}>
                <SelectTrigger className="w-full border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Thay đổi theo bậc">Thay đổi theo bậc</SelectItem>
                  <SelectItem value="Thay đổi liên tục">Thay đổi liên tục</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
