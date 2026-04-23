import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import demoData from '@/data/demodata.json'
import { useDesign } from '@/features/design/context/DesignContext'

export default function Step4Gearbox() {
  const { formData, step2Data } = useDesign();
  const [activeTab, setActiveTab] = useState("bevel"); // bevel: bánh răng côn, spur: bánh răng trụ
  const [isLoading, setIsLoading] = useState(true);
  const [bevelResult, setBevelResult] = useState<any>(null);
  const [spurResult, setSpurResult] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
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
              hopGiamToc: {
                ...demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
                tySoTruyenSoBo: parseFloat(step2Data.gearboxRatio)
              },
              boTruyenDai: {
                ...demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
                tySoTruyenSoBo: parseFloat(step2Data.beltRatio)
              },
              oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
              noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi,
              dongCo: {
                congSuat: parseFloat(step2Data.motor.match(/\((.*?) kW/)?.[1] || "7.5"),
                vanTocQuay: parseFloat(step2Data.motor.match(/, (.*?) v\/ph/)?.[1] || "2922")
              },
              phanPhoiTySoTruyen: {
                tySoTruyenBanhRang: [
                    { loai: "BanhRangCon", tySoTruyen: parseFloat(step2Data.u1) },
                    { loai: "BanhRangTru", tySoTruyen: parseFloat(step2Data.u2) }
                ]
              }
            }
          }
        };

        // API Bánh răng côn
        const resBevel = await fetch('http://localhost:3001/api/banh-rang-con/tinh-toan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const dataBevel = await resBevel.json();
        if (dataBevel.success) setBevelResult(dataBevel.data);

        // API Bánh răng trụ
        const resSpur = await fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-thong-so-bo-truyen-banh-rang-tru', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const dataSpur = await resSpur.json();
        if (dataSpur.success) setSpurResult(dataSpur.data);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Bước 4:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [formData, step2Data]);

  // Helper để lấy giá trị hiển thị
  const getVal = (type: 'bevel' | 'spur', path: string) => {
    if (isLoading) return "Đang tính...";
    const res = type === 'bevel' ? bevelResult : spurResult;
    if (!res) return "---";
    
    // Logic map dữ liệu đơn giản
    if (type === 'bevel') {
        const dls = res.du_lieu_so;
        if (path === 'm') return dls?.mte || "---";
        if (path === 'z1') return dls?.z1 || "---";
        if (path === 'z2') return dls?.z2 || "---";
        if (path === 'u') return step2Data.u1;
        if (path === 'd1') return dls?.de1 ? `${dls.de1} mm` : "---";
        if (path === 'd2') return dls?.de2 ? `${dls.de2} mm` : "---";
        if (path === 'b') return dls?.b ? `${dls.b} mm` : "---";
        if (path === 'delta1') return dls?.delta1 ? `${dls.delta1}°` : "---";
        if (path === 'delta2') return dls?.delta2 ? `${dls.delta2}°` : "---";
        if (path === 'ft') return res.bang_luc_tac_dung?.Ft1;
        if (path === 'fr') return res.bang_luc_tac_dung?.Fr1;
        if (path === 'fa') return res.bang_luc_tac_dung?.Fa1;
    } else {
        if (path === 'm') return res.thongSoKichThuoc?.moDun_m;
        if (path === 'z1') return res.thongSoBanhRang?.soRang_z1;
        if (path === 'z2') return res.thongSoBanhRang?.soRang_z2;
        if (path === 'u') return res.kiemTraSaiSo?.tySoTruyenThucTe;
        if (path === 'd1') return res.thongSoBanhRang?.duongKinhChia_d1 ? `${res.thongSoBanhRang.duongKinhChia_d1} mm` : "---";
        if (path === 'd2') return res.thongSoBanhRang?.duongKinhChia_d2 ? `${res.thongSoBanhRang.duongKinhChia_d2} mm` : "---";
        if (path === 'b') return res.thongSoKichThuoc?.chieuRongVanhRang_bw ? `${res.thongSoKichThuoc.chieuRongVanhRang_bw} mm` : "---";
        if (path === 'ft') return res.bangLucTacDung?.Ft1;
        if (path === 'fr') return res.bangLucTacDung?.Fr1;
        if (path === 'fa') return res.bangLucTacDung?.Fa1;
    }
    return "---";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Tab Switcher - KIỂU NÚT GẠT NGUYÊN BẢN CỦA BẠN */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200 p-1 rounded-lg flex items-center w-full max-w-md shadow-inner">
            <button 
                onClick={() => setActiveTab('bevel')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${activeTab === 'bevel' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Bánh răng côn
            </button>
            <button 
                onClick={() => setActiveTab('spur')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${activeTab === 'spur' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Bánh răng trụ
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cột trái: Thông số chính */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Thông số bánh răng {activeTab === 'bevel' ? 'côn' : 'trụ'}</h3>
              <p className="text-xs text-gray-500 italic">Thông số thiết kế chuyên sâu</p>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Vật liệu</Label>
                <Select defaultValue={activeTab === 'bevel' ? "Thép C40XH" : "Thép 45"}>
                  <SelectTrigger className="w-full h-11 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Thép C40XH">Thép C40XH</SelectItem>
                    <SelectItem value="Thép 45">Thép 45</SelectItem>
                    <SelectItem value="Thép 40Cr">Thép 40Cr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">
                  {activeTab === 'bevel' ? 'Module vòng chia ngoài (m_te)' : 'Module (m)'}
                </Label>
                <Input value={getVal(activeTab as any, 'm')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">
                   Module {activeTab === 'bevel' ? 'vòng chia ngoài' : ''} tiêu chuẩn
                </Label>
                <Select defaultValue={activeTab === 'bevel' ? "3" : "2"}>
                  <SelectTrigger className="w-full h-11 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="2">2.0</SelectItem>
                    <SelectItem value="2.5">2.5</SelectItem>
                    <SelectItem value="3">3.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-600 block mb-2">Số răng z1</Label>
                  <Input value={getVal(activeTab as any, 'z1')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600 block mb-2">Số răng z2</Label>
                  <Input value={getVal(activeTab as any, 'z2')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Tỉ số truyền (u)</Label>
                <Input value={getVal(activeTab as any, 'u')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông số hình học & Lực */}
        <div className="space-y-6">
          {/* Card 1: Thông số hình học */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Thông số</h3>
              <p className="text-xs text-gray-500 italic">Thông số cơ bản của bánh răng</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Đường kính chia bánh nhỏ ({activeTab === 'bevel' ? 'de1' : 'd1'})</Label>
                <Input value={getVal(activeTab as any, 'd1')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Đường kính chia bánh lớn ({activeTab === 'bevel' ? 'de2' : 'd2'})</Label>
                <Input value={getVal(activeTab as any, 'd2')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Bề rộng vành răng (b)</Label>
                <Input value={getVal(activeTab as any, 'b')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              
              {activeTab === 'bevel' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 block mb-2">Góc côn bánh nhỏ (δ1)</Label>
                    <Input value={getVal('bevel', 'delta1')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 block mb-2">Góc côn bánh lớn (δ2)</Label>
                    <Input value={getVal('bevel', 'delta2')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Lực tác dụng 3D */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Lực tác dụng 3D</h3>
              <p className="text-xs text-gray-500 italic">Các thành phần lực tác dụng</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Lực vòng Ft</Label>
                <Input value={getVal(activeTab as any, 'ft')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Lực hướng tâm Fr</Label>
                <Input value={getVal(activeTab as any, 'fr')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Lực dọc trục Fa</Label>
                <Input value={getVal(activeTab as any, 'fa')} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
