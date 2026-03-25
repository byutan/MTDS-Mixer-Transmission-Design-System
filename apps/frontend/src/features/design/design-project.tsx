import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'
import Step1Init from './steps/step1-init'
import Step2Motor from './steps/step2-motor'
import { Navbar } from '../common/navbar'

const steps = [
  { number: 1, title: 'Khởi tạo', label: 'Khởi tạo' },
  { number: 2, title: 'Động cơ', label: 'Động cơ' },
  { number: 3, title: 'Bộ truyền đai', label: 'Bộ truyền đai' },
  { number: 4, title: 'Hộp giảm tốc', label: 'Hộp giảm tốc' },
  { number: 5, title: 'Trục & Ổ lăn', label: 'Trục & Ổ lăn' },
]

export default function DesignProject() {
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const [formData, setFormData] = useState({
    projectName: 'Hệ thống dẫn động thùng trộn',
    major: 'Cơ Kỹ Thuật',
    studentId: '2013257',
    studentName: 'Nguyễn Văn Học',
    instructor: 'TS. Nguyễn Duy Khương',
    createdDate: '2026-03-05',
    power: '5.5',
    speed: '70',
    lifespan: '15000',
    type: 'Quay 1 chiều',
    loadCharacter: 'Tải va đập nhẹ',
    workMode: '2 ca',
    workDaysYear: '360',
    workHoursDay: '10',
    loadMode: 'Thay đổi theo bậc',
  })

  const [step2Data, setStep2Data] = useState({
    efficiency: '0.875',
    requiredPower: '6.285',
    preliminarySpeed: '2922',
    totalRatio: '41.74',
    beltRatio: '3.6',
    gearboxRatio: '11.5',
    u1: '3.8',
    u2: '3.03',
    cosPhi: '0.88',
    tMaxTdm: '2.2',
    tKdTdm: '2.0',
    motor: '4A112M2Y6 (7.5 kW, 2922 v/ph)',
  })



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Reused Navbar */}
      <Navbar isLoggedIn={!!user} username={user?.fullname || "Nguyễn Văn Học"} />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-20 h-[calc(100vh-80px)]">
          <h2 className="font-bold text-gray-900 mb-8 text-xs tracking-wider">QUY TRÌNH THIẾT KẾ</h2>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.number}>
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className="flex items-center gap-3 w-full p-0 transition text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition flex-shrink-0 ${
                      step.number < currentStep
                        ? 'bg-blue-600 text-white'
                        : currentStep === step.number
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                        : 'border-2 border-gray-300 text-gray-700'
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : (currentStep === step.number ? '●' : step.number)}
                  </div>
                  <span className={`text-sm ${currentStep === step.number ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex justify-center pl-5 py-2">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-8 bg-slate-50 min-h-[calc(100vh-80px)]">
            {/* Header Content */}
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-sans tracking-tight">
                  Bước {currentStep}: {steps[currentStep - 1].title}
                </h1>
                <p className="text-gray-600 text-base font-sans leading-relaxed">
                  {currentStep === 1 && 'Nhập thông tin cơ bản cho dự án thiết kế cơ khí của bạn'}
                  {currentStep === 2 && 'Tính toán các thông số động học và lựa chọn động cơ phù hợp'}
                  {currentStep > 2 && 'Thông số cho bước này sẽ sớm được cập nhật.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handleBack} 
                    className="border-slate-200 text-slate-600 hover:bg-slate-100 px-6 py-2 h-auto text-base font-bold transition-all"
                  >
                    Quay lại
                  </Button>
                )}
                <Button 
                  onClick={handleNext} 
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-2 h-auto text-base font-bold shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                >
                  Tiếp tục <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>


            {/* Steps Rendering */}
            <div className="max-w-6xl mx-auto">
                {currentStep === 1 && <Step1Init formData={formData} handleInputChange={handleInputChange} />}
                {currentStep === 2 && <Step2Motor step2Data={step2Data} setStep2Data={setStep2Data} />}
                
                {currentStep > 2 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Đang xử lý dữ liệu</h3>
                        <p className="text-gray-500 text-center max-w-sm font-sans">
                            Module <b>{steps[currentStep-1].title}</b> hiện đang trong quá trình phát triển và sẽ sớm được cập nhật trong phiên bản tiếp theo.
                        </p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
