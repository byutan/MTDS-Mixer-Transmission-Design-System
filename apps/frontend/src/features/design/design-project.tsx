import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'
import { Navbar } from '../common/navbar'
import { useDesign } from '@/features/design/context/DesignContext'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"

const steps = [
  { number: 1, title: 'Khởi tạo', label: 'Khởi tạo', path: 'step-1' },
  { number: 2, title: 'Động cơ', label: 'Động cơ', path: 'step-2' },
  { number: 3, title: 'Bộ truyền đai', label: 'Bộ truyền đai', path: 'step-3' },
  { number: 4, title: 'Hộp giảm tốc', label: 'Hộp giảm tốc', path: 'step-4' },
  { number: 5, title: 'Trục', label: 'Trục', path: 'step-5' },
  { number: 6, title: 'Ổ lăn', label: 'Ổ lăn', path: 'step-6' },
  { number: 7, title: 'Vỏ hộp giảm tốc', label: 'Vỏ hộp giảm tốc', path: 'step-7' },
];

export default function DesignProject() {
  const { user, formData, step2Data, setStep2Data, saveProject, step5Errors } = useDesign();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Xác định step hiện tại dựa vào URL
  const currentPath = location.pathname.split('/').pop();
  const currentStepObj = steps.find(s => s.path === currentPath) || steps[0];
  const currentStep = currentStepObj.number;

  const handleBack = async () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      // Cập nhật trạng thái bước trong DB khi quay lại
      await saveProject(prevStep);
      navigate(steps[prevStep - 1].path);
      window.scrollTo(0, 0);
    }
  }

  const handleNext = async () => {
    const nextStep = currentStep < 7 ? currentStep + 1 : 7;
    
    // Nếu ở bước 1, thực hiện tính toán trước khi lưu và chuyển bước
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
            const u_total_sb = dataRatio.data.tySoTruyenChungSoBo;
            const n_sb = (n_out * parseFloat(u_total_sb)).toFixed(0);

            const hasSelectedMotor = step2Data.motor && step2Data.motor !== 'Chưa chọn động cơ';
            const newStep2Data = {
                ...step2Data,
                systemEfficiency: hieuSuat.toFixed(3),
                requiredPower: P_yc,
                totalRatio: hasSelectedMotor ? step2Data.totalRatio : u_total_sb,
                preliminarySpeed: hasSelectedMotor ? step2Data.preliminarySpeed : n_sb,
                beltRatio: (hasSelectedMotor && step2Data.beltRatio !== '---') ? step2Data.beltRatio : dataRatio.data.tySoTruyenDai,
                gearboxRatio: (hasSelectedMotor && step2Data.gearboxRatio !== '---') ? step2Data.gearboxRatio : dataRatio.data.tySoTruyenHGT,
                u1: (hasSelectedMotor && step2Data.u1 !== '---') ? step2Data.u1 : "2.0",
                u2: (hasSelectedMotor && step2Data.u2 !== '---') ? step2Data.u2 : (parseFloat(dataRatio.data.tySoTruyenHGT) / 2).toFixed(2),
            };

            setStep2Data(newStep2Data);
            
            // Lưu trạng thái đã sang Bước 2 với dữ liệu mới nhất
            await saveProject(2, { step2Data: newStep2Data });
            navigate('step-2');
        }
      } catch (error) {
        console.error("Lỗi khi tính toán sơ bộ:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      if (step2Data.motor === 'Chưa chọn động cơ' || !step2Data.motor) {
        toast({
          title: "Thiếu dữ liệu",
          description: "Vui lòng chọn mã động cơ để tiếp tục!",
          variant: "destructive",
        });
        return;
      }
      // Lưu trạng thái đã sang Bước 3
      await saveProject(3);
      navigate('step-3');
    } else if (currentStep === 5) {
      if (step5Errors.I || step5Errors.II || step5Errors.III) {
        toast({
          title: "Lỗi thiết kế",
          description: "Thông số chiều dài trục đang báo lỗi (vượt tiêu chuẩn). Vui lòng kiểm tra và sửa lại các ô báo đỏ ở Trục I, II, hoặc III.",
          variant: "destructive",
        });
        return;
      }
      await saveProject(6);
      navigate('step-6');
    } else if (currentStep < 7) {
      // Lưu bước tiếp theo trước khi chuyển
      await saveProject(nextStep);
      navigate(steps[currentStep].path);
    } else {
      // Lưu bước cuối cùng và quay lại danh sách dự án
      await saveProject(7);
      toast({
        title: "Hoàn thành!",
        description: "Chúc mừng! Bạn đã hoàn thành thiết kế hệ thống dẫn động.",
      });
      navigate('/projects');
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
                  <div className="w-10 flex justify-center py-1">
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
                  {currentStep === 5 && 'Thiết kế các đoạn trục, khoảng cách gối đỡ và kiểm nghiệm mỏi'}
                  {currentStep === 6 && 'Lựa chọn loại ổ lăn phù hợp và kiểm nghiệm khả năng tải'}
                  {currentStep === 7 && 'Thiết kế kết cấu vỏ hộp, gân tăng cứng và hệ thống bu lông'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} className="border-slate-200 text-slate-600 px-6 py-2 h-auto text-base font-bold transition-all">
                    Quay lại
                  </Button>
                )}
                
                <Button onClick={handleNext} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-2 h-auto text-base font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70">
                  {isLoading ? 'Đang tính toán...' : (currentStep === 7 ? 'Hoàn thành' : 'Tiếp tục')} 
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
