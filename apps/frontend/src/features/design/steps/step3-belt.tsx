import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useDesign } from '@/features/design/context/DesignContext'

export default function Step3Belt() {
  const { formData, step2Data } = useDesign();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy n_dc từ step2Data.motor (Ví dụ: "4A112M2Y6 (7.5 kW, 2922 v/ph)" -> 2922)
        const motorLabel = step2Data.motor || "";
        const n_dc_val = parseFloat(motorLabel.match(/,\s*(\d+)\s*v\/ph/)?.[1] || "0");

        const payload = {
          duLieuDauVao: {
            thungTron: {
              congSuat: parseFloat(formData.power),
              soVongQuay: parseFloat(formData.speed),
              thoiGianPhucVu: parseFloat(formData.lifespan)
            },
            heThongTruyenDong: {
              dongCo: {
                congSuat: parseFloat(motorLabel.match(/\((.*?)\s*kW/)?.[1] || "0"),
                vanTocQuay: n_dc_val,
                soCaLamViec: formData.workMode === '2 ca' ? 2 : 3,
                taiTrong: formData.loadCharacter === 'Tải va đập nhẹ' ? 'nhe' : 'manh'
              },
              boTruyenDai: {
                tySoTruyenSoBo: parseFloat(step2Data.beltRatio) || 1
              }
            }
          }
        };

        const res = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-thong-so-bo-truyen-dai-thang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.message || "Lỗi tính toán từ Backend");
        }
      } catch (err) {
        setError("Không thể kết nối tới server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData, step2Data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tính toán thông số đai từ hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-700 font-bold mb-2">Lỗi kỹ thuật</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">

      {/* Cột 1: Thông số bánh đai */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Thông số bánh đai</h3>
          <p className="text-xs text-gray-500 italic">Kích thước và loại đai</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Loại tiết diện đai</Label>
            <Input value={`Đai loại ${results?.tietDienDai || '---'}`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Đường kính bánh dẫn (d1)</Label>
            <Input value={`${results?.duongKinhBanhDan || '---'} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Đường kính bánh bị dẫn lý thuyết (d2_lt)</Label>
            <Input value={`${(parseFloat(results?.duongKinhBanhBiDan || "0") / (parseFloat(step2Data.beltRatio) || 1)).toFixed(2)} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Đường kính bánh bị dẫn (d2)</Label>
            <Input value={`${results?.duongKinhBanhBiDan || '---'} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div className="pt-2">
            <Badge className="w-full h-9 bg-green-50 text-green-700 border border-green-200 flex items-center gap-2 justify-start px-3 shadow-none hover:bg-green-50">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] font-bold">Tỉ số truyền thực tế: {(results?.duongKinhBanhBiDan / results?.duongKinhBanhDan).toFixed(2)}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Cột 2: Khoảng cách & Chiều dài */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Khoảng cách & Chiều dài</h3>
          <p className="text-xs text-gray-500 italic">Thông số khoảng cách trục</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Khoảng cách trục thực tế (a)</Label>
            <div className="relative">
              <Input value={results?.khoangCachTruc || '---'} readOnly className="h-10 pr-12 font-bold bg-slate-50" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">mm</span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Chiều dài đai thiết kế (L)</Label>
            <Input value={`${(results?.chieuDaiDai * 1000).toFixed(0)} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Góc ôm bánh nhỏ (α1)</Label>
            <Input value={`${results?.gocOmDai || '---'}°`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Số vòng chạy / giây</Label>
            <Input value={results?.soVongChayTrong1Giay || '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

      {/* Cột 3: Thông số chịu lực */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Thông số chịu lực</h3>
          <p className="text-xs text-gray-500 italic">Số dây đai và lực tác dụng</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Số dây đai tính toán</Label>
            <Input value={`${results?.soDayDai} sợi`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Số dây đai thiết kế (z)</Label>
            <Input value={results?.soDayDai} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Lực tác dụng lên trục (F_r)</Label>
            <Input value={`${results?.lucTacDungLenTruc} N`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600 block mb-1.5">Ứng suất cho phép</Label>
            <Input value={`${results?.ungSuatLonNhat} MPa`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

    </div>
  )
}
