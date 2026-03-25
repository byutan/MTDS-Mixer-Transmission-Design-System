import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Step2MotorProps {
  step2Data: any;
  setStep2Data: (data: any) => void;
}

export default function Step2Motor({ step2Data, setStep2Data }: Step2MotorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Left Column */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card 1: Kết quả tính toán */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Kết quả tính toán</h3>
          <p className="text-sm text-gray-600 mb-8 font-sans">Các thông số được tính tự động</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-700 font-sans">Hiệu suất (η)</span>
              <span className="text-sm font-bold text-blue-600 font-sans">{step2Data.efficiency}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-700 font-sans">Công suất yêu cầu (Pk)</span>
              <span className="text-sm font-bold text-blue-600 font-sans">{step2Data.requiredPower} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-sans">Vòng quay sơ bộ (nsb)</span>
              <span className="text-sm font-bold text-blue-600 font-sans">{step2Data.preliminarySpeed} v/ph</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tỉ số truyền */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Tỉ số truyền</h3>
          <p className="text-sm text-gray-600 mb-8 font-sans">Thiết lập các tỉ số truyền</p>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tỉ số truyền tổng (u_t)</Label>
              <Input
                value={step2Data.totalRatio}
                disabled
                className="bg-slate-50 border border-slate-200 rounded-md text-sm text-gray-500 h-11"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tỉ số truyền đai thang (u_d)</Label>
              <Input
                value={step2Data.beltRatio}
                onChange={(e) => setStep2Data({...step2Data, beltRatio: e.target.value})}
                className="border border-slate-200 rounded-md text-sm h-11"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tỉ số truyền hộp giảm tốc (u_h)</Label>
              <Input
                value={step2Data.gearboxRatio}
                disabled
                className="bg-slate-50 border border-slate-200 rounded-md text-sm text-gray-500 h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-7 space-y-6">
        {/* Card 3: Lựa chọn động cơ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Lựa chọn động cơ</h3>
          <p className="text-sm text-gray-600 mb-8 font-sans">Chọn động cơ phù hợp từ danh mục</p>
          
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Mã hiệu động cơ</Label>
            <Select value={step2Data.motor} onValueChange={(val) => setStep2Data({...step2Data, motor: val})}>
              <SelectTrigger className="border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                <SelectItem value="4A112M2Y6 (7.5 kW, 2922 v/ph)">4A112M2Y6 (7.5 kW, 2922 v/ph)</SelectItem>
                <SelectItem value="4A132M2Y6 (11 kW, 2920 v/ph)">4A132M2Y6 (11 kW, 2920 v/ph)</SelectItem>
                <SelectItem value="4A160M2Y6 (15 kW, 2930 v/ph)">4A160M2Y6 (15 kW, 2930 v/ph)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Card 4: Bảng đặc tính truyền truyền động */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Bảng đặc tính truyền động</h3>
          <p className="text-sm text-gray-600 mb-8 font-sans">Thông số kỹ thuật qua từng cấp truyền</p>
          
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Thông số</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Đ.cơ</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Trục I</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Trục II</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Trục III</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">T.công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 italic">
                <tr>
                  <td className="py-4 px-4 text-gray-700 font-semibold bg-slate-50/50">Pk (kW)</td>
                  <td className="text-center py-4 px-4 text-gray-600">7.50</td>
                  <td className="text-center py-4 px-4 text-gray-600">7.13</td>
                  <td className="text-center py-4 px-4 text-gray-600">6.57</td>
                  <td className="text-center py-4 px-4 text-gray-600">6.57</td>
                  <td className="text-center py-4 px-4 text-gray-600">6.57</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700 font-semibold bg-slate-50/50">n (v/ph)</td>
                  <td className="text-center py-4 px-4 text-gray-600">2922</td>
                  <td className="text-center py-4 px-4 text-gray-600">812</td>
                  <td className="text-center py-4 px-4 text-gray-600">258</td>
                  <td className="text-center py-4 px-4 text-gray-600">70</td>
                  <td className="text-center py-4 px-4 text-gray-600">70</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700 font-semibold bg-slate-50/50">M (N.mm)</td>
                  <td className="text-center py-4 px-4 text-gray-600 text-xs">24.5k</td>
                  <td className="text-center py-4 px-4 text-gray-600 text-xs">83.5k</td>
                  <td className="text-center py-4 px-4 text-gray-600 text-xs">251k</td>
                  <td className="text-center py-4 px-4 text-gray-600 text-xs">895k</td>
                  <td className="text-center py-4 px-4 text-gray-600 text-xs">895k</td>
                </tr>
                <tr className="bg-slate-50/20">
                  <td className="py-4 px-4 text-gray-900 font-bold bg-slate-100/50">u</td>
                  <td className="text-center py-4 px-4 text-gray-900 font-bold">-</td>
                  <td className="text-center py-4 px-4 text-gray-900 font-bold">3.6</td>
                  <td className="text-center py-4 px-4 text-gray-900 font-bold">3.14</td>
                  <td className="text-center py-4 px-4 text-gray-900 font-bold">3.69</td>
                  <td className="text-center py-4 px-4 text-gray-900 font-bold">1.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
