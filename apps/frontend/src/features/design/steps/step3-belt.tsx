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
      // Chỉ gọi API khi đã có dữ liệu động cơ
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
          <h3 className="text-xl font-bold text-gray-900 font-sans">Thông số bánh đai</h3>
          <p className="text-sm text-gray-600 font-sans">Kích thước và loại đai</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Loại tiết diện đai</Label>
            <Input value={`Đai loại ${results?.tietDienDai || '---'}`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính bánh dẫn (d1)</Label>
            <Input value={`${results?.duongKinhBanhDan || '---'} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính bánh bị dẫn lý thuyết (d2_lt)</Label>
            <Input value={`${(parseFloat(results?.duongKinhBanhBiDan || "0") / (parseFloat(step2Data.beltRatio) || 1)).toFixed(2)} mm`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính bánh bị dẫn (d2)</Label>
            <Input value={results?.duongKinhBanhBiDan ? `${results.duongKinhBanhBiDan} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div className="pt-2">
            <Badge className="w-full h-9 bg-green-50 text-green-700 border border-green-200 flex items-center gap-2 justify-start px-3 shadow-none hover:bg-green-50">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] font-bold">
                Tỉ số truyền thực tế: {results?.duongKinhBanhDan ? (results?.duongKinhBanhBiDan / results?.duongKinhBanhDan).toFixed(2) : '---'}
              </span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Cột 2: Khoảng cách & Chiều dài */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-sans">Khoảng cách & Chiều dài</h3>
          <p className="text-sm text-gray-600 font-sans">Thông số khoảng cách trục</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Khoảng cách trục thực tế (a)</Label>
            <Input value={results?.khoangCachTruc ? `${results.khoangCachTruc} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chiều dài đai thiết kế (L)</Label>
            <Input value={results?.chieuDaiDai ? `${(results.chieuDaiDai * 1000).toFixed(0)} mm` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Góc ôm bánh nhỏ (α1)</Label>
            <Input value={`${results?.gocOmDai || '---'}°`} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số vòng chạy / giây</Label>
            <Input value={results?.soVongChayTrong1Giay || '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

      {/* Cột 3: Thông số chịu lực */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-sans">Thông số chịu lực</h3>
          <p className="text-sm text-gray-600 font-sans">Số dây đai và lực tác dụng</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số dây đai tính toán</Label>
            <Input value={results?.soDayDai !== undefined ? `${results?.soDayDai} sợi` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số dây đai thiết kế (z)</Label>
            <Input value={results?.soDayDai !== undefined ? results?.soDayDai : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Lực tác dụng lên trục (F_r)</Label>
            <Input value={results?.lucTacDungLenTruc !== undefined ? `${results?.lucTacDungLenTruc} N` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Ứng suất cho phép</Label>
            <Input value={results?.ungSuatLonNhat !== undefined ? `${results?.ungSuatLonNhat} MPa` : '---'} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
          </div>
        </div>
      </div>

    </div>
  )
}
