import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'
import { Navbar } from '../common/navbar'
import { useDesign } from '@/features/design/context/DesignContext'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const steps = [
  { number: 1, title: 'Khởi tạo', label: 'Khởi tạo', path: 'step-1' },
  { number: 2, title: 'Động cơ', label: 'Động cơ', path: 'step-2' },
  { number: 3, title: 'Bộ truyền đai', label: 'Bộ truyền đai', path: 'step-3' },
  { number: 4, title: 'Hộp giảm tốc', label: 'Hộp giảm tốc', path: 'step-4' },
  { number: 5, title: 'Thiết kế trục', label: 'Thiết kế trục', path: 'step-5' },
  { number: 6, title: 'Ổ lăn', label: 'Ổ lăn', path: 'step-6' },
]

export default function DesignProject() {
  const { user, formData, step2Data, setStep2Data, loadSampleData, saveProject } = useDesign();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Xác định step hiện tại dựa vào URL
  const currentPath = location.pathname.split('/').pop();
  const currentStepObj = steps.find(s => s.path === currentPath) || steps[0];
  const currentStep = currentStepObj.number;

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(steps[currentStep - 2].path);
      window.scrollTo(0, 0);
    }
  }

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveProject(currentStep);
    setIsSaving(false);
  };

  const handleNext = async () => {
    // Tự động lưu khi nhấn tiếp tục
    handleSave();

    if (currentStep === 1) {
      setIsLoading(true);
      try {
        const payload = {
          duLieuDauVao: {
            thungTron: {
              congSuat: parseFloat(formData.power),
              soVongQuay: parseFloat(formData.speed),
              thoiGianPhucVu: parseFloat(formData.lifespan)
            },
            heThongTruyenDong: {
              hopGiamToc: { loai: "con", capChinhXac: 8, cheKin: true, tySoTruyenSoBo: 3.15 },
              boTruyenDai: { loai: "V", hieuSuat: 0.95, tySoTruyenSoBo: 3.6 },
              oLan: { hieuSuat: 0.99 },
              noiTrucVongDanHoi: { hieuSuat: 1, tySoTruyenSoBo: 1 }
            }
          }
        };

        const resEff = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-hieu-suat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const dataEff = await resEff.json();

        const resRatio = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-ty-so-truyen-chung-so-bo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const dataRatio = await resRatio.json();

        if (dataEff.success && dataRatio.success) {
            const hieuSuat = dataEff.data.hieuSuatHeThong || 0.85; 
            const n_out = parseFloat(formData.speed) || 0;
            const P_out = parseFloat(formData.power) || 0;
            
            const P_yc = (P_out / hieuSuat).toFixed(3);
            const u_total_sb = parseFloat(dataRatio.data.tySoTruyenChungSoBo) || 1;
            const n_sb = (n_out * u_total_sb).toFixed(0);

            setStep2Data((prev) => ({
                ...prev,
                systemEfficiency: hieuSuat.toFixed(3),
                requiredPower: P_yc,
                totalRatio: dataRatio.data.tySoTruyenChungSoBo,
                beltRatio: dataRatio.data.tySoTruyenDai,
                gearboxRatio: dataRatio.data.tySoTruyenHGT,
                u1: "2.0", 
                u2: (parseFloat(dataRatio.data.tySoTruyenHGT) / 2).toFixed(2),
                preliminarySpeed: n_sb,
            }));
            navigate('step-2');
        }
      } catch (error) {
        console.error("Lỗi khi tính toán sơ bộ:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      if (step2Data.motor === 'Chưa chọn động cơ') {
        alert("Vui lòng chọn mã động cơ!");
        return;
      }
      navigate('step-3');
    } else if (currentStep < 6) {
      navigate(steps[currentStep].path);
    }
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar isLoggedIn={!!user} username={user?.fullname || "Nguyễn Văn Học"} />

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <h2 className="font-bold text-gray-900 mb-8 text-xs tracking-wider">QUY TRÌNH THIẾT KẾ</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className="flex items-center gap-3 w-full p-0 transition text-left cursor-default">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition flex-shrink-0 ${
                      step.number < currentStep ? 'bg-blue-600 text-white' : currentStep === step.number ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2' : 'border-2 border-gray-300 text-gray-700'
                    }`}>
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : (currentStep === step.number ? '●' : step.number)}
                  </div>
                  <span className={`text-sm ${currentStep === step.number ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center pl-5 py-2">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="p-8 pb-32">
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  Bước {currentStep}: {steps[currentStep - 1].title}
                </h1>
                <p className="text-gray-600 text-base">
                  {currentStep === 1 && 'Nhập thông tin cơ bản cho dự án thiết kế cơ khí của bạn'}
                  {currentStep === 2 && 'Tính toán các thông số động học và lựa chọn động cơ phù hợp'}
                  {currentStep === 3 && 'Thiết kế chi tiết bộ truyền ngoài (đai thang) và kiểm nghiệm'}
                  {currentStep === 4 && 'Thiết kế chi tiết các bộ truyền bánh răng trong hộp giảm tốc'}
                  {currentStep > 4 && 'Thông số cho bước này sẽ sớm được cập nhật.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} className="border-slate-200 text-slate-600 px-6 py-2 h-auto text-base font-bold transition-all">
                    Quay lại
                  </Button>
                )}
                
                <Button onClick={handleNext} disabled={isLoading || isSaving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-2 h-auto text-base font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70">
                  {isLoading ? 'Đang tính toán...' : (currentStep === 6 ? 'Hoàn thành' : 'Tiếp tục')} 
                  {!isLoading && <ChevronRight className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
