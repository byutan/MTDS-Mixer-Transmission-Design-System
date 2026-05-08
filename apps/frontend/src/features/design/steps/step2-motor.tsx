import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import demoData from '../../../../../../demodata.json'
import { useDesign } from '@/features/design/context/DesignContext'
import { Gauge, ShieldCheck, Activity } from 'lucide-react'

export default function Step2Motor() {
  const { step2Data, setStep2Data, formData, tableData, setTableData } = useDesign();
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendedMotors, setRecommendedMotors] = useState<any[]>([]);

  const safeParse = (val: any) => {
    if (typeof val === 'string' && (val === '---' || val === '')) return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Hàm gọi backend để lấy gợi ý động cơ
  const fetchMotorRecommendations = async (p_ct: string, n_sb: string) => {
    if (safeParse(p_ct) <= 0 || safeParse(n_sb) <= 0) return;
    
    try {
      const res = await fetch('http://localhost:3001/api/thung-tron/chon-dong-co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          p_ct: safeParse(p_ct), 
          n_sb: safeParse(n_sb) 
        })
      });
      const data = await res.json();
      if (data.success) {
        setRecommendedMotors(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý động cơ:", error);
    }
  };

  useEffect(() => {
    fetchMotorRecommendations(step2Data.requiredPower, step2Data.preliminarySpeed);
  }, [step2Data.requiredPower, step2Data.preliminarySpeed]);

  // Tính toán sai số tỉ số truyền
  const u_real = (parseFloat(step2Data.beltRatio) * parseFloat(step2Data.u1) * parseFloat(step2Data.u2)).toFixed(3);
  const delta_u = Math.abs((parseFloat(step2Data.totalRatio) - parseFloat(u_real)) / parseFloat(step2Data.totalRatio) * 100);
  const isErrorOk = delta_u <= 5;

  const updateTechnicalTable = async (currentStep2: any) => {
    const motorMatch = currentStep2.motor.match(/\((.*?) kW/);
    if (!motorMatch) return;

    setIsCalculating(true);
    try {
      const payload = {
        duLieuDauVao: {
          thungTron: {
            congSuat: safeParse(formData.power),
            soVongQuay: safeParse(formData.speed)
          },
          heThongTruyenDong: {
            dongCo: {
              congSuat: safeParse(motorMatch[1]),
              vanTocQuay: safeParse(currentStep2.motor.match(/, (.*?) v\/ph/)?.[1])
            },
            hopGiamToc: {
              ...demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
              tySoTruyenSoBo: safeParse(currentStep2.gearboxRatio)
            },
            boTruyenDai: {
              ...demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
              tySoTruyenSoBo: safeParse(currentStep2.beltRatio)
            },
            oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
            noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi,
            phanPhoiTySoTruyen: {
              heSoThietKe: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc.heSoThietKe?.psi_bd2 || 0.9,
              tySoTruyenBanhRang: [
                { loai: "BanhRangCon", tySoTruyen: safeParse(currentStep2.u1) },
                { loai: "BanhRangTru", tySoTruyen: safeParse(currentStep2.u2) }
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
      console.error("Lỗi cập nhật bảng đặc tính:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    updateTechnicalTable(step2Data);
  }, [step2Data.motor, step2Data.u1, step2Data.u2]);

  const handleBeltRatioChange = (val: string) => {
    if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
    const ud = parseFloat(val) || 0;
    const ut = parseFloat(step2Data.totalRatio) || 0;
    const uh = ud > 0 ? (ut / ud).toFixed(2) : '0';
    const u1 = parseFloat(step2Data.u1) || 1;
    const u2 = u1 > 0 ? (parseFloat(uh) / u1).toFixed(2) : '0';

    setStep2Data({ ...step2Data, beltRatio: val, gearboxRatio: uh, u2: u2 });
  };

  const handleU1Change = (val: string) => {
    if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
    const u1 = parseFloat(val) || 0;
    const uh = parseFloat(step2Data.gearboxRatio) || 0;
    const u2 = u1 > 0 ? (uh / u1).toFixed(2) : '0';
    setStep2Data({ ...step2Data, u1: val, u2: u2 });
  };

  const handleMotorChange = (val: string) => {
    const motorSpeedMatch = val.match(/, (.*?) v\/ph/);
    const n_dc = motorSpeedMatch ? parseFloat(motorSpeedMatch[1]) : 0;
    const n_out = parseFloat(formData.speed) || 1;
    const u_total_new = n_dc > 0 ? (n_dc / n_out).toFixed(2) : "0";
    const ud = parseFloat(step2Data.beltRatio) || 1;
    const u_h_new = ud > 0 ? (parseFloat(u_total_new) / ud).toFixed(2) : "0";
    const u_1 = parseFloat(step2Data.u1) || 1;
    const u_2_new = u_1 > 0 ? (parseFloat(u_h_new) / u_1).toFixed(2) : "0";

    const selectedMotorData = recommendedMotors.find(m => 
      `${m.motor_code} (${m.power_kw} kW, ${m.speed_rpm} v/ph)` === val
    );

    setStep2Data({
      ...step2Data,
      motor: val,
      totalRatio: u_total_new,
      gearboxRatio: u_h_new,
      u2: u_2_new,
      motorEfficiency: selectedMotorData?.efficiency_eta?.toString() || '---',
      cosPhi: selectedMotorData?.cos_phi?.toString() || '---',
      tMaxTdm: selectedMotorData?.t_max_tdn?.toString() || '---',
      tKdTdm: selectedMotorData?.t_k_tdn?.toString() || '---'
    });
  };

  const hasMotor = step2Data.motor && step2Data.motor.includes('kW');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 font-sans pb-20">
      
      {/* Cột trái: Kết quả & Tỉ số truyền */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Khối 1: Kết quả tính toán cơ bản */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">1. Kết quả tính toán</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Hiệu suất hệ thống (ηΣ)</span>
              <span className="text-lg font-bold text-gray-900">{step2Data.systemEfficiency}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Công suất cần thiết (Pct)</span>
              <span className="text-lg font-bold text-gray-900">{step2Data.requiredPower} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Số vòng quay sơ bộ (nsb)</span>
              <span className="text-lg font-bold text-gray-900">
                {step2Data.preliminarySpeed !== '0' ? step2Data.preliminarySpeed : '---'} v/ph
              </span>
            </div>
          </div>
        </div>

        {/* Khối 3: Phân phối tỉ số truyền */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">3. Phân phối tỉ số truyền</h3>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <Label className="text-[10px] font-bold text-slate-500 block mb-1">Tỉ số truyền chung (uc)</Label>
              <div className={`text-2xl font-bold ${hasMotor ? 'text-gray-900' : 'text-slate-300 italic text-base'}`}>
                {hasMotor ? step2Data.totalRatio : 'Chờ chọn động cơ...'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2">Tỉ số truyền đai (uđ)</Label>
                <Input
                  value={step2Data.beltRatio}
                  onChange={(e) => handleBeltRatioChange(e.target.value)}
                  disabled={!hasMotor}
                  className="h-10 bg-white border-slate-200 text-gray-700 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2">Tỉ số truyền nhanh (u1)</Label>
                  <Input
                    value={step2Data.u1}
                    onChange={(e) => handleU1Change(e.target.value)}
                    disabled={!hasMotor}
                    className="h-10 bg-white border-slate-200 text-gray-700 font-bold"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2">Tỉ số truyền chậm (u2)</Label>
                  <Input
                    value={hasMotor ? step2Data.u2 : '---'}
                    readOnly
                    className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2">Tỉ số truyền hộp giảm tốc (uh)</Label>
                <Input
                  value={hasMotor ? step2Data.gearboxRatio : '---'}
                  readOnly
                  className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className={`mt-4 p-4 rounded-xl border border-dashed transition-all ${isErrorOk ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className={`w-4 h-4 ${isErrorOk ? 'text-emerald-500' : 'text-red-500'}`} />
                  Sai số tỷ số truyền (Δu)
                </span>
                <span className={`text-sm font-bold ${hasMotor ? (isErrorOk ? 'text-emerald-600' : 'text-red-600') : 'text-slate-300'}`}>
                  {hasMotor ? `${delta_u.toFixed(2)} %` : '---'}
                </span>
              </div>
              <p className={`text-[10px] italic ${hasMotor ? (isErrorOk ? 'text-emerald-500' : 'text-red-500') : 'text-slate-400'}`}>
                {hasMotor ? (isErrorOk ? '✓ Thỏa mãn điều kiện Δu < 5%' : '⚠ Vượt quá sai số cho phép (> 5%)') : '* Đang chờ dữ liệu động cơ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Động cơ & Bảng đặc tính */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Khối 2: Lựa chọn động cơ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">2. Lựa chọn động cơ</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 block mb-2">Mã hiệu động cơ (P, n)</Label>
              <Select value={step2Data.motor} onValueChange={handleMotorChange}>
                <SelectTrigger className="border border-slate-200 rounded-md text-sm px-3 py-2 !h-11 flex items-center bg-white text-gray-700 w-full max-w-md shadow-sm">
                  <SelectValue placeholder="Chọn động cơ từ danh sách..." />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-2xl">
                  {recommendedMotors.length > 0 ? (
                    recommendedMotors.map((m) => {
                      const value = `${m.motor_code} (${m.power_kw} kW, ${m.speed_rpm} v/ph)`;
                      return (
                        <SelectItem key={m.motor_code} value={value} className="py-2.5">
                          {value}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="p-4 text-xs text-slate-400 italic">Không có động cơ phù hợp với nsb...</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">cos φ</span>
                <span className="text-lg font-bold text-gray-900">{step2Data.cosPhi}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Hiệu suất (η)</span>
                <span className="text-lg font-bold text-gray-900">{step2Data.motorEfficiency}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Tmax/Tdm</span>
                <span className="text-lg font-bold text-gray-900">{step2Data.tMaxTdm}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Tkd/Tdm</span>
                <span className="text-lg font-bold text-gray-900">{step2Data.tKdTdm}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 4: Bảng đặc tính kỹ thuật */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">4. Bảng đặc tính kỹ thuật</h3>
          </div>

          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="text-left py-3.5 px-4 font-bold text-slate-900">Thông số</th>
                  <th className="text-center py-3.5 px-4 font-bold text-slate-900">Động cơ</th>
                  <th className="text-center py-3.5 px-4 font-bold text-slate-900">Trục I</th>
                  <th className="text-center py-3.5 px-4 font-bold text-slate-900">Trục II</th>
                  <th className="text-center py-3.5 px-4 font-bold text-slate-900">Trục III</th>
                  <th className="text-center py-3.5 px-4 font-bold text-slate-900">T.công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.length > 0 ? (
                  <>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 text-slate-700 font-bold">Công suất (P) [kW]</td>
                      {tableData.map((col, idx) => (
                        <td key={idx} className="text-center py-4 px-4 text-gray-900 font-bold">{col.congSuat}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 text-slate-700 font-bold">Số vòng quay (n) [v/ph]</td>
                      {tableData.map((col, idx) => (
                        <td key={idx} className="text-center py-4 px-4 text-gray-900 font-bold">{col.soVongQuay}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 text-slate-700 font-bold">Momen xoắn (T) [N.mm]</td>
                      {tableData.map((col, idx) => (
                        <td key={idx} className="text-center py-4 px-4 text-gray-900 font-bold">{Math.round(col.momentXoan)}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50 font-bold border-t border-slate-200">
                      <td className="py-4 px-4 text-blue-600 font-bold italic text-xs">Tỉ số truyền (u)</td>
                      {tableData.map((col, idx) => (
                        <td key={idx} className="text-center py-4 px-4 text-blue-600 font-bold">{col.tySoTruyen}</td>
                      ))}
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 italic">Đang tải dữ liệu tính toán...</td>
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
