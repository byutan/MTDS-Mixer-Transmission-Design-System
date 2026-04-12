import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import demoData from '../../../../../../demodata.json'

interface Step2MotorProps {
  step2Data: any;
  setStep2Data: (data: any) => void;
  formData: any;
  tableData: any[];
  setTableData: (data: any[]) => void;
}

export default function Step2Motor({ step2Data, setStep2Data, formData, tableData, setTableData }: Step2MotorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Tính toán sai số tỉ số truyền
  const u_real = (parseFloat(step2Data.beltRatio) * parseFloat(step2Data.u1) * parseFloat(step2Data.u2)).toFixed(3);
  const delta_u = Math.abs((parseFloat(step2Data.totalRatio) - parseFloat(u_real)) / parseFloat(step2Data.totalRatio) * 100);
  const isErrorOk = delta_u <= 5;

  // Hàm gọi backend để cập nhật bảng đặc tính kỹ thuật
  const updateTechnicalTable = async (currentStep2: any) => {
    setIsCalculating(true);
    try {
        const payload = {
            duLieuDauVao: {
                thungTron: {
                    congSuat: parseFloat(formData.power),
                    soVongQuay: parseFloat(formData.speed)
                },
                heThongTruyenDong: {
                    dongCo: {
                        congSuat: parseFloat(currentStep2.motor.match(/\((.*?) kW/)?.[1] || "7.5"),
                        vanTocQuay: parseFloat(currentStep2.motor.match(/, (.*?) v\/ph/)?.[1] || "2922")
                    },
                    hopGiamToc: {
                        ...demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
                        tySoTruyenSoBo: parseFloat(currentStep2.gearboxRatio)
                    },
                    boTruyenDai: { 
                        ...demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
                        tySoTruyenSoBo: parseFloat(currentStep2.beltRatio) 
                    },
                    oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
                    noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi,
                    phanPhoiTySoTruyen: {
                        tySoTruyenBanhRang: [
                            { loai: "BanhRangCon", tySoTruyen: parseFloat(currentStep2.u1) },
                            { loai: "BanhRangTru", tySoTruyen: parseFloat(currentStep2.u2) }
                        ]
                    }
                }
            }
        };

        const res = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-bang-dac-tinh-ky-thuat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            setTableData(data.data);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật bảng đặc tính:", error);
    } finally {
        setIsCalculating(false);
    }
  };

  useEffect(() => {
    updateTechnicalTable(step2Data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step2Data.motor, step2Data.u1, step2Data.u2]);

  // Hàm xử lý khi thay đổi u_d (Tỉ số truyền đai)
  const handleBeltRatioChange = (val: string) => {
    const ud = parseFloat(val) || 0;
    const ut = parseFloat(step2Data.totalRatio) || 41.74;
    
    // Tính u_h = u_t / u_d
    const uh = ud > 0 ? (ut / ud).toFixed(2) : '0';
    
    // Tính lại u_2 dựa trên u_h mới và u_1 hiện tại
    const u1 = parseFloat(step2Data.u1) || 1;
    const u2 = u1 > 0 ? (parseFloat(uh) / u1).toFixed(2) : '0';

    setStep2Data({
      ...step2Data,
      beltRatio: val,
      gearboxRatio: uh,
      u2: u2
    });
  };

  // Hàm xử lý khi thay đổi u_1 (Cấp nhanh côn)
  const handleU1Change = (val: string) => {
    const u1 = parseFloat(val) || 0;
    const uh = parseFloat(step2Data.gearboxRatio) || 0;
    
    // Tính u_2 = u_h / u_1
    const u2 = u1 > 0 ? (uh / u1).toFixed(2) : '0';

    setStep2Data({
      ...step2Data,
      u1: val,
      u2: u2
    });
  };

  // Hàm xử lý khi chọn động cơ mới
  const handleMotorChange = (val: string) => {
    // 1. Trích xuất tốc độ động cơ từ chuỗi (ví dụ: "2922 v/ph")
    const motorSpeedMatch = val.match(/, (.*?) v\/ph/);
    const n_dc = motorSpeedMatch ? parseFloat(motorSpeedMatch[1]) : 0;
    const n_out = parseFloat(formData.speed) || 1;

    // 2. Tính tỉ số truyền tổng mới dựa trên n_dc thực tế
    const u_total_new = n_dc > 0 ? (n_dc / n_out).toFixed(2) : "0";

    // 3. Tính lại u_h và u_2 dựa trên u_total mới để giữ nguyên phân phối
    const ud = parseFloat(step2Data.beltRatio) || 1;
    const u_h_new = ud > 0 ? (parseFloat(u_total_new) / ud).toFixed(2) : "0";
    const u_1 = parseFloat(step2Data.u1) || 1;
    const u_2_new = u_1 > 0 ? (parseFloat(u_h_new) / u_1).toFixed(2) : "0";

    // 4. Lấy thông số kỹ thuật đặc trưng của mã động cơ (Giả lập tra cứu Catalogue)
    // Trong thực tế, đây nên là một API gọi xuống Database động cơ
    let motorStats = { eff: '---', cos: '---', tMax: '---', tKd: '---' };
    if (val.includes('7.5 kW')) {
        motorStats = { eff: '0.87', cos: '0.88', tMax: '2.2', tKd: '2.0' };
    } else if (val.includes('11 kW')) {
        motorStats = { eff: '0.88', cos: '0.89', tMax: '2.2', tKd: '2.0' };
    } else if (val.includes('15 kW')) {
        motorStats = { eff: '0.885', cos: '0.89', tMax: '2.3', tKd: '2.1' };
    }

    setStep2Data({
        ...step2Data,
        motor: val,
        totalRatio: u_total_new,
        gearboxRatio: u_h_new,
        u2: u_2_new,
        motorEfficiency: motorStats.eff,
        cosPhi: motorStats.cos,
        tMaxTdm: motorStats.tMax,
        tKdTdm: motorStats.tKd
    });
  };

  // Kiểm tra xem đã chọn động cơ thật sự chưa (đặc điểm là phải có 'kW' trong mã hiệu)
  const hasMotor = step2Data.motor && step2Data.motor.includes('kW');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Left Column - Calculations & Ratios */}
      <div className="lg:col-span-5 space-y-8">
        {/* Card 1: Kết quả tính toán */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-sans">1. Kết quả tính toán</h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-gray-600 font-medium font-sans italic">Hiệu suất hệ thống (η_sigma)</span>
              <span className="text-lg font-black text-blue-600 font-sans">{step2Data.systemEfficiency}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-gray-600 font-medium font-sans italic">Công suất yêu cầu (Pk)</span>
              <span className="text-lg font-black text-blue-600 font-sans">{step2Data.requiredPower} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium font-sans italic">Vòng quay sơ bộ (nsb)</span>
              <span className="text-lg font-black text-blue-600 font-sans">
                {step2Data.preliminarySpeed !== '0' ? step2Data.preliminarySpeed : '---'} v/ph
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Tỉ số truyền */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans">2. Phân phối tỉ số truyền</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <Label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Tỉ số truyền tổng (u_t)</Label>
              <div className={`text-2xl font-black ${hasMotor ? 'text-slate-900' : 'text-slate-300 italic text-lg'}`}>
                {hasMotor ? step2Data.totalRatio : 'Chờ chọn động cơ...'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-sm font-bold text-slate-700 block mb-2">u_đ (Bộ truyền đai)</Label>
                <Input
                  value={step2Data.beltRatio}
                  onChange={(e) => handleBeltRatioChange(e.target.value)}
                  disabled={!hasMotor}
                  className="border border-slate-200 rounded-md text-sm h-11 font-bold text-blue-600 disabled:opacity-30"
                  placeholder="Nhập u_đ..."
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-700 block mb-2">u_1 (Cấp nhanh côn)</Label>
                <Input
                  value={step2Data.u1}
                  onChange={(e) => handleU1Change(e.target.value)}
                  disabled={!hasMotor}
                  className="border border-slate-200 rounded-md text-sm h-11 font-bold text-blue-600 disabled:opacity-30"
                  placeholder="Nhập u_1..."
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-700 block mb-2">u_2 (Cấp chậm trụ)</Label>
                <Input
                  value={hasMotor ? step2Data.u2 : '---'}
                  disabled
                  className="bg-slate-50 border border-slate-200 rounded-md text-sm h-11 font-bold text-gray-500"
                  placeholder="Tự động tính..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <Label className="text-sm font-bold text-slate-700 block mb-2">u_h (Hộp giảm tốc)</Label>
               <Input
                 value={hasMotor ? step2Data.gearboxRatio : '---'}
                 disabled
                 className="bg-slate-50 border border-slate-200 rounded-md text-sm text-gray-500 h-11"
               />
               <p className="text-[10px] text-slate-400 mt-2 font-sans italic">
                 {hasMotor ? `* u_h = u_1 × u_2 = ${step2Data.gearboxRatio}` : '* Cần chọn động cơ để tính u_h'}
               </p>
            </div>

            <div className={`mt-6 p-4 rounded-xl border-2 border-dashed transition-all ${
              isErrorOk ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Sai số tỉ số truyền (Δu)</span>
                <span className={`text-sm font-black ${hasMotor ? (isErrorOk ? 'text-green-600' : 'text-red-600') : 'text-slate-300'}`}>
                  {hasMotor ? `${delta_u.toFixed(2)}%` : '---'}
                </span>
              </div>
              <p className={`text-[10px] mt-1 italic ${hasMotor ? (isErrorOk ? 'text-green-500' : 'text-red-500') : 'text-slate-400'}`}>
                {hasMotor 
                  ? (isErrorOk ? '✓ Thỏa mãn điều kiện sai số < 5%' : '⚠ Vượt quá sai số cho phép (> 5%)')
                  : '* Chỉ tính sau khi chọn động cơ'
                }
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Right Column - Motor & Specs */}
      <div className="lg:col-span-7 space-y-8">
        {/* Card 3: Lựa chọn động cơ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans">2. Lựa chọn động cơ</h3>
          
          <div className="space-y-8">
            <div>
              <Label className="text-sm font-bold text-slate-700 block mb-2">Mã hiệu động cơ</Label>
              <Select value={step2Data.motor} onValueChange={handleMotorChange}>
                <SelectTrigger className="border border-slate-200 rounded-md text-sm px-3 py-2 h-11 flex items-center bg-white shadow-sm font-semibold max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white shadow-2xl">
                  <SelectItem value="4A112M2Y6 (7.5 kW, 2922 v/ph)">4A112M2Y6 (7.5 kW, 2922 v/ph)</SelectItem>
                  <SelectItem value="4A132M2Y6 (11 kW, 2920 v/ph)">4A132M2Y6 (11 kW, 2920 v/ph)</SelectItem>
                  <SelectItem value="4A160M2Y6 (15 kW, 2930 v/ph)">4A160M2Y6 (15 kW, 2930 v/ph)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Thông số kỹ thuật động cơ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                 <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">cos φ</span>
                 <span className="text-xl font-black text-slate-900">{step2Data.cosPhi}</span>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">Hiệu suất (η)</span>
                 <span className="text-xl font-black text-slate-900">{step2Data.motorEfficiency}</span>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">T_max/T_dm</span>
                 <span className="text-xl font-black text-slate-900">{step2Data.tMaxTdm}</span>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">T_kd/T_dm</span>
                 <span className="text-xl font-black text-slate-900">{step2Data.tKdTdm}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Bảng đặc tính truyền động */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-hidden">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans tracking-tight">4. Bảng đặc tính truyền động</h3>
          
          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Thông số</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Đ.cơ</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Trục I</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Trục II</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Trục III</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 uppercase text-[10px] tracking-widest">T.công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.length > 0 ? (
                    <>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 text-slate-700 font-bold bg-slate-50/30">Pk (kW)</td>
                            {tableData.map((col, idx) => (
                                <td key={idx} className={`text-center py-4 px-4 ${idx === 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                    {col.congSuat}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 text-slate-700 font-bold bg-slate-50/30">n (v/ph)</td>
                            {tableData.map((col, idx) => (
                                <td key={idx} className={`text-center py-4 px-4 ${idx === 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                    {col.soVongQuay}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 text-slate-700 font-bold bg-slate-50/30">M (N.mm)</td>
                            {tableData.map((col, idx) => (
                                <td key={idx} className="text-center py-4 px-4 text-slate-600 text-xs italic">
                                    {(col.momentXoan / 1000).toFixed(1)}k
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-blue-50/30 font-bold">
                            <td className="py-4 px-4 text-blue-900 font-black bg-blue-100/50 uppercase text-[10px]">u</td>
                            {tableData.map((col, idx) => (
                                <td key={idx} className={`text-center py-4 px-4 ${idx === 0 ? 'text-slate-400' : 'text-blue-700 font-black'}`}>
                                    {col.tySoTruyen === "-" ? "-" : col.tySoTruyen}
                                </td>
                            ))}
                        </tr>
                    </>
                ) : (
                    <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">Đang tải dữ liệu tính toán...</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
