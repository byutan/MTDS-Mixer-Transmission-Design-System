import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'
import Step1Init from './steps/step1-init'
import Step2Motor from './steps/step2-motor'
import Step3Belt from './steps/step3-belt'
import { Navbar } from '../common/navbar'

import demoData from './demo-data/step2-demo.json'

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

  const [isLoading, setIsLoading] = useState(false)
  
  // Khởi tạo state trống để người dùng nhập tay là chính
  const [formData, setFormData] = useState({
    projectName: '',
    major: '',
    studentId: '',
    studentName: '',
    instructor: '',
    createdDate: new Date().toISOString().split('T')[0],
    power: '',
    speed: '',
    lifespan: '',
    type: 'Quay 1 chiều',
    loadCharacter: 'Tải va đập nhẹ',
    workMode: '2 ca',
    workDaysYear: '360',
    workHoursDay: '8',
    loadMode: 'Thay đổi theo bậc',
  })

  const [step2Data, setStep2Data] = useState({
    systemEfficiency: '0',
    motorEfficiency: '---',
    requiredPower: '0',
    preliminarySpeed: '0',
    totalRatio: '---',
    beltRatio: '---',
    gearboxRatio: '---',
    u1: '---',
    u2: '---',
    cosPhi: '---',
    tMaxTdm: '---',
    tKdTdm: '---',
    motor: 'Chưa chọn động cơ',
  })

  const [tableData, setTableData] = useState<any[]>([]);

  // Hàm điền dữ liệu mẫu (Dành cho lúc không nhập)
  const loadSampleData = () => {
    setFormData({
      ...formData,
      projectName: 'Hệ thống dẫn động thùng trộn',
      major: 'Cơ Kỹ Thuật',
      studentId: '2013257',
      studentName: 'Nguyễn Văn Học',
      instructor: 'TS. Nguyễn Duy Khương',
      power: demoData.duLieuDauVao.thungTron.congSuat.toString(),
      speed: demoData.duLieuDauVao.thungTron.soVongQuay.toString(),
      lifespan: demoData.duLieuDauVao.thungTron.thoiGianPhucVu.toString(),
    });
    
    setStep2Data(prev => ({
        ...prev,
        beltRatio: demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai.tySoTruyenSoBo.toString(),
        gearboxRatio: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc.tySoTruyenSoBo.toString(),
        u1: '2', // Giá trị mặc định thấp để bắt đầu
        motor: 'Chưa chọn động cơ', // Bắt buộc phải chọn lại
        totalRatio: '---',
        u2: '---',
        motorEfficiency: '---',
        cosPhi: '---'
    }));
    
    alert("Đã điền dữ liệu mẫu từ demo-data/step2-demo.json");
  }

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

  const handleNext = async () => {
    if (currentStep === 1) {
      setIsLoading(true);
      try {
        // Chuẩn bị payload lấy từ file demo-data/step2-demo.json thay vì hardcode
        const payload = {
          duLieuDauVao: {
            thungTron: {
              congSuat: parseFloat(formData.power),
              soVongQuay: parseFloat(formData.speed),
              thoiGianPhucVu: parseFloat(formData.lifespan)
            },
            heThongTruyenDong: {
              hopGiamToc: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
              boTruyenDai: demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
              oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
              noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi
            }
          }
        };

        // 1. Tính hiệu suất
        const resEff = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-hieu-suat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const dataEff = await resEff.json();

        // 2. Tính tỉ số truyền sơ bộ
        const resRatio = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-ty-so-truyen-chung-so-bo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const dataRatio = await resRatio.json();

        if (dataEff.success && dataRatio.success) {
            const hieuSuat = dataEff.data.hieuSuatHeThong;
            const P_yc = (parseFloat(formData.power) / hieuSuat).toFixed(3);
            
            // Tính n_sb = n_out * u_sb_total
            const n_out = parseFloat(formData.speed) || 0;
            const u_total_sb = parseFloat(dataRatio.data.tySoTruyenChungSoBo) || 1;
            const n_sb = (n_out * u_total_sb).toFixed(0);

            setStep2Data(prev => ({
                ...prev,
                systemEfficiency: hieuSuat.toString(),
                requiredPower: P_yc,
                totalRatio: dataRatio.data.tySoTruyenChungSoBo,
                beltRatio: dataRatio.data.tySoTruyenDai,
                gearboxRatio: dataRatio.data.tySoTruyenHGT,
                preliminarySpeed: n_sb,
            }));
            setCurrentStep(2);
        }
      } catch (error) {
        console.error("Lỗi khi tính toán sơ bộ:", error);
        alert("Không thể kết nối với server để tính toán. Vui lòng kiểm tra backend.");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      if (step2Data.motor === 'Chưa chọn động cơ') {
        alert("Vui lòng chọn một mã động cơ để hệ thống có đủ dữ liệu tính toán cho Bước 3!");
        return;
      }
      // Chuyển sang bước 3: Bộ truyền đai
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else if (currentStep < 5) {
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
                  {currentStep === 3 && 'Thiết kế chi tiết bộ truyền ngoài (đai thang) và kiểm nghiệm'}
                  {currentStep > 3 && 'Thông số cho bước này sẽ sớm được cập nhật.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep === 1 && (
                    <Button 
                      variant="ghost" 
                      onClick={loadSampleData} 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold px-4"
                    >
                      Dùng dữ liệu mẫu
                    </Button>
                )}
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
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-2 h-auto text-base font-bold shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? 'Đang tính toán...' : 'Tiếp tục'} {!isLoading && <ChevronRight className="w-5 h-5" />}
                </Button>

              </div>
            </div>


            {/* Steps Rendering */}
            <div className="max-w-6xl mx-auto">
                {currentStep === 1 && <Step1Init formData={formData} handleInputChange={handleInputChange} />}
                {currentStep === 2 && (
                    <Step2Motor 
                        step2Data={step2Data} 
                        setStep2Data={setStep2Data} 
                        formData={formData}
                        tableData={tableData}
                        setTableData={setTableData}
                    />
                )}
                
                {currentStep === 3 && (
                    <Step3Belt 
                        formData={formData}
                        step2Data={step2Data}
                    />
                )}
                
                {currentStep > 3 && (
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
