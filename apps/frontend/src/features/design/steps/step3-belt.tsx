import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useDesign } from '@/features/design/context/DesignContext'

export default function Step3Belt() {
  const { formData, step2Data } = useDesign();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const motorLabel = step2Data.motor || "";
      const n_dc_match = motorLabel.match(/,\s*(\d+)\s*v\/ph/);
      const p_dc_match = motorLabel.match(/\((.*?)\s*kW/);

      if (!n_dc_match || !p_dc_match) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const payload = {
          duLieuDauVao: {
            thungTron: {
              congSuat: parseFloat(formData.power) || 0,
              soVongQuay: parseFloat(formData.speed) || 0,
              thoiGianPhucVu: parseFloat(formData.lifespan) || 0
            },
            heThongTruyenDong: {
              dongCo: {
                congSuat: parseFloat(p_dc_match[1]) || 0,
                vanTocQuay: parseFloat(n_dc_match[1]) || 0,
                soCaLamViec: parseInt(formData.workMode) || 3,
                taiTrong: formData.loadCharacter === 'Tải va đập nhẹ' ? 'nhe' : 
                          formData.loadCharacter === 'Tải nặng' ? 'manh' : 'tinh'
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
        <p className="text-gray-500 font-medium font-sans">Đang tính toán thông số đai từ hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-700 font-bold mb-2 font-sans">Lỗi kỹ thuật</p>
        <p className="text-red-500 text-sm font-sans">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700 font-sans">

      {/* Cột 1: Thông số bánh đai */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Thông số bánh đai</h3>
          <p className="text-sm text-gray-600">Kích thước và loại đai</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Loại tiết diện đai</Label>
            <Input value={`Đai loại ${results?.tietDienDai || '---'}`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Đường kính bánh dẫn (d1)</Label>
            <Input value={results?.duongKinhBanhDan ? `${results.duongKinhBanhDan} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Đường kính bánh bị dẫn (d2)</Label>
            <Input value={results?.duongKinhBanhBiDan ? `${results.duongKinhBanhBiDan} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div className="pt-2">
            <div className="w-full h-10 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-2 px-3">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">
                Tỉ số truyền thực tế (u): {results?.duongKinhBanhDan ? (results?.duongKinhBanhBiDan / results?.duongKinhBanhDan).toFixed(2) : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột 2: Khoảng cách & Chiều dài */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Khoảng cách & Chiều dài</h3>
          <p className="text-sm text-gray-600">Thông số lắp đặt</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Khoảng cách trục thực tế (a)</Label>
            <Input value={results?.khoangCachTruc ? `${results.khoangCachTruc} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Chiều dài đai thiết kế (L)</Label>
            <Input value={results?.chieuDaiDai ? `${(results.chieuDaiDai * 1000).toFixed(0)} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Góc ôm bánh nhỏ (α1)</Label>
            <Input value={results?.gocOmDai ? `${results.gocOmDai}°` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Số vòng chạy trong 1 giây (i)</Label>
            <Input value={results?.soVongChayTrong1Giay ? `${results.soVongChayTrong1Giay} s⁻¹` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

      {/* Cột 3: Thông số chịu lực */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Thông số chịu lực</h3>
          <p className="text-sm text-gray-600">Số dây và lực tác dụng</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Số dây đai thiết kế (z)</Label>
            <Input value={results?.soDayDai || '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Lực căng đai ban đầu (F0)</Label>
            <Input value={results?.lucCangDaiBanDau ? `${results.lucCangDaiBanDau} N` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Lực tác dụng lên trục (Fr)</Label>
            <Input value={results?.lucTacDungLenTruc ? `${results.lucTacDungLenTruc} N` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2">Ứng suất lớn nhất (σmax)</Label>
            <Input value={results?.ungSuatLonNhat ? `${results.ungSuatLonNhat} MPa` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

    </div>
  )
}
