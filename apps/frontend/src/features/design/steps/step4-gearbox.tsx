import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Gauge } from 'lucide-react'
import demoData from '../../../../../../demodata.json'
import { useDesign } from '@/features/design/context/DesignContext'

export default function Step4Gearbox() {
  const { formData, step2Data } = useDesign();
  const [activeTab, setActiveTab] = useState<"bevel" | "spur">("bevel"); 
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
                congSuat: parseFloat(step2Data.motor.match(/\((.*?) kW/)?.[1] || "0"),
                vanTocQuay: parseFloat(step2Data.motor.match(/, (.*?) v\/ph/)?.[1] || "0")
              },
              phanPhoiTySoTruyen: {
                heSoThietKe: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc.heSoThietKe?.psi_bd2 || 0.9,
                tySoTruyenBanhRang: [
                    { loai: "BanhRangCon", tySoTruyen: parseFloat(step2Data.u1) },
                    { loai: "BanhRangTru", tySoTruyen: parseFloat(step2Data.u2) }
                ]
              }
            }
          }
        };

        const [resBevel, resSpur] = await Promise.all([
          fetch('http://localhost:3001/api/banh-rang-con/tinh-toan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }),
          fetch('http://localhost:3001/api/he-thong-truyen-dong/tinh-thong-so-bo-truyen-banh-rang-tru', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        ]);

        const dataBevel = await resBevel.json();
        const dataSpur = await resSpur.json();

        if (dataBevel.success) setBevelResult(dataBevel.data);
        if (dataSpur.success) setSpurResult(dataSpur.data);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Bước 4:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [formData, step2Data]);

  // Hàm helper để trích xuất số liệu từ chuỗi backend (ví dụ: "dae1 = 123.15, dae2 = 235.5" -> ["123.15", "235.5"])
  const parseVal = (str: string) => {
    if (!str) return ["---", "---"];
    const matches = str.match(/[\d.]+/g);
    return matches && matches.length >= 2 ? matches : ["---", "---"];
  };

  const getVal = (type: 'bevel' | 'spur', path: string, part: 1 | 2 = 1) => {
    if (isLoading) return "Đang tính...";
    const res = type === 'bevel' ? bevelResult : spurResult;
    if (!res) return "---";
    
    if (type === 'bevel') {
        const dls = res.du_lieu_so;
        const bshh = res.bang_thong_so_hinh_hoc;
        switch(path) {
            case 'm': return dls?.mte ? `${dls.mte} mm` : "---";
            case 'z': return part === 1 ? (dls?.z1 || "---") : (dls?.z2 || "---");
            case 'u': return dls?.z2 && dls?.z1 ? (dls.z2 / dls.z1).toFixed(3) : "---";
            case 'de': return part === 1 ? (dls?.de1 ? `${dls.de1} mm` : "---") : (dls?.de2 ? `${dls.de2} mm` : "---");
            case 'b': return dls?.b ? `${dls.b} mm` : "---";
            case 'delta': return part === 1 ? (dls?.delta1 ? `${dls.delta1}°` : "---") : (dls?.delta2 ? `${dls.delta2}°` : "---");
            case 'ft': return res.bang_luc_tac_dung?.Ft1 ? `${res.bang_luc_tac_dung.Ft1} N` : "---";
            case 'fr': return res.bang_luc_tac_dung?.Fr1 ? `${res.bang_luc_tac_dung.Fr1} N` : "---";
            case 'fa': return res.bang_luc_tac_dung?.Fa1 ? `${res.bang_luc_tac_dung.Fa1} N` : "---";
            case 're': return bshh?.chieu_rong_con_ngoai ? `${bshh.chieu_rong_con_ngoai} mm` : "---";
            case 'he': return bshh?.chieu_cao_rang_ngoai ? `${bshh.chieu_cao_rang_ngoai} mm` : "---";
            case 'dae': {
                const vals = parseVal(bshh?.duong_kinh_dinh_rang_ngoai);
                return `${vals[part-1]} mm`;
            }
            case 'delta_a': {
                const vals = parseVal(bshh?.goc_con_dinh);
                return `${vals[part-1]}°`;
            }
            default: return "---";
        }
    } else {
        const tskk = res.thongSoKichThuoc;
        const tsbr = res.thongSoBanhRang;
        const ktsz = res.kiemTraSaiSo;
        switch(path) {
            case 'm': return tskk?.moDun_m ? `${tskk.moDun_m} mm` : "---";
            case 'z': return part === 1 ? (tsbr?.soRang_z1 || "---") : (tsbr?.soRang_z2 || "---");
            case 'u': return ktsz?.tySoTruyenThucTe || "---";
            case 'd': return part === 1 ? (tsbr?.duongKinhChia_d1 ? `${tsbr.duongKinhChia_d1} mm` : "---") : (tsbr?.duongKinhChia_d2 ? `${tsbr.duongKinhChia_d2} mm` : "---");
            case 'b': return tskk?.chieuRongVanhRang_bw ? `${tskk.chieuRongVanhRang_bw} mm` : "---";
            case 'ft': return res.bangLucTacDung?.Ft1 ? `${res.bangLucTacDung.Ft1} N` : "---";
            case 'fr': return res.bangLucTacDung?.Fr1 ? `${res.bangLucTacDung.Fr1} N` : "---";
            case 'fa': return res.bangLucTacDung?.Fa1 ? `${res.bangLucTacDung.Fa1} N` : "---";
            case 'aw': return tskk?.khoangCachTruc_aw ? `${tskk.khoangCachTruc_aw} mm` : "---";
            case 'sigmaH': return res.ungSuatTiepXucChoPhep ? `${res.ungSuatTiepXucChoPhep} MPa` : "---";
            case 'errorU': return ktsz?.saiSoU !== undefined ? `${ktsz.saiSoU} %` : "---";
            case 'dw': return part === 1 ? (tsbr?.duongKinhVongLan_dw1 ? `${tsbr.duongKinhVongLan_dw1} mm` : "---") : (tsbr?.duongKinhVongLan_dw2 ? `${tsbr.duongKinhVongLan_dw2} mm` : "---");
            case 'da': return part === 1 ? (tsbr?.duongKinhDinhRang_da1 ? `${tsbr.duongKinhDinhRang_da1} mm` : "---") : (tsbr?.duongKinhDinhRang_da2 ? `${tsbr.duongKinhDinhRang_da2} mm` : "---");
            default: return "---";
        }
    }
  };

  const isSpurPassed = spurResult?.kiemTraSaiSo?.saiSoU <= 4;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      
      {/* Tab Selector */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full max-w-md border border-slate-200">
          <button onClick={() => setActiveTab('bevel')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'bevel' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Bánh răng côn
          </button>
          <button onClick={() => setActiveTab('spur')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'spur' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Bánh răng trụ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cột 1: Thông số bộ truyền */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Thông số bộ truyền {activeTab === 'bevel' ? 'côn' : 'trụ'}</h3>
              <p className="text-sm text-gray-600 font-sans">Dữ liệu thiết kế chi tiết</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Vật liệu</Label>
                <Input value="Thép 45 (Tôi cải thiện)" readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">
                  {activeTab === 'bevel' ? 'Module vòng chia ngoài (mte)' : 'Module (m)'}
                </Label>
                <Input value={getVal(activeTab, 'm')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số răng bánh nhỏ (z1)</Label>
                  <Input value={getVal(activeTab, 'z', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Số răng bánh lớn (z2)</Label>
                  <Input value={getVal(activeTab, 'z', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Tỉ số truyền (u)</Label>
                <Input value={getVal(activeTab, 'u')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>

              {activeTab === 'spur' && (
                <div>
                   <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Khoảng cách trục (aw)</Label>
                   <Input value={getVal('spur', 'aw')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
              )}
              {activeTab === 'bevel' && (
                <div>
                   <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chiều dài côn ngoài (Re)</Label>
                   <Input value={getVal('bevel', 're')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
              )}
            </div>
          </div>

          {activeTab === 'spur' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 font-sans">Kiểm nghiệm thiết kế</h3>
              </div>
              
              <div className="space-y-4">
                  <div className={`flex justify-between items-center p-5 rounded-2xl border ${isSpurPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div>
                      <p className={`text-[10px] font-bold tracking-wider mb-1 ${isSpurPassed ? 'text-emerald-600' : 'text-red-600'}`}>Sai số tỷ số truyền (Δu)</p>
                      <span className={`text-lg font-black ${isSpurPassed ? 'text-emerald-800' : 'text-red-800'}`}>{getVal('spur', 'errorU')}</span>
                    </div>
                    <span className={`text-xs px-4 py-1.5 rounded-full font-black shadow-sm ${isSpurPassed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                      {isSpurPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <div>
                      <p className="text-[10px] text-blue-600 font-bold tracking-wider mb-1">Ứng suất tiếp xúc cho phép ([σ]H)</p>
                      <span className="text-lg font-black text-blue-800">{getVal('spur', 'sigmaH')}</span>
                    </div>
                    <Gauge className="w-6 h-6 text-blue-400" />
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Cột 2: Thông số hình học & Lực */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Thông số hình học</h3>
              <p className="text-sm text-gray-600 font-sans">Kích thước chi tiết bánh răng</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">
                     {activeTab === 'bevel' ? 'Đường kính chia ngoài (de1)' : 'Đường kính chia (d1)'}
                  </Label>
                  <Input value={getVal(activeTab, activeTab === 'bevel' ? 'de' : 'd', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">
                     {activeTab === 'bevel' ? 'Đường kính chia ngoài (de2)' : 'Đường kính chia (d2)'}
                  </Label>
                  <Input value={getVal(activeTab, activeTab === 'bevel' ? 'de' : 'd', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Bề rộng vành răng (b)</Label>
                <Input value={getVal(activeTab, 'b')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>

              {activeTab === 'spur' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính vòng lăn (dw1)</Label>
                      <Input value={getVal('spur', 'dw', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính vòng lăn (dw2)</Label>
                      <Input value={getVal('spur', 'dw', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính đỉnh răng (da1)</Label>
                      <Input value={getVal('spur', 'da', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính đỉnh răng (da2)</Label>
                      <Input value={getVal('spur', 'da', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'bevel' && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Chiều cao răng ngoài (he)</Label>
                    <Input value={getVal('bevel', 'he')} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính đỉnh răng ngoài (dae1)</Label>
                      <Input value={getVal('bevel', 'dae', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Đường kính đỉnh răng ngoài (dae2)</Label>
                      <Input value={getVal('bevel', 'dae', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Góc chia mặt côn (δ1)</Label>
                      <Input value={getVal('bevel', 'delta', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Góc chia mặt côn (δ2)</Label>
                      <Input value={getVal('bevel', 'delta', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Góc côn đỉnh (δa1)</Label>
                      <Input value={getVal('bevel', 'delta_a', 1)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 block mb-2 font-sans">Góc côn đỉnh (δa2)</Label>
                      <Input value={getVal('bevel', 'delta_a', 2)} readOnly className="h-10 bg-slate-50 border-slate-200 text-gray-700 font-bold" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Lực tác dụng 3D</h3>
              <p className="text-sm text-gray-600 font-sans">Thành phần lực phân tích</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 font-sans">Lực vòng (Ft)</span>
                <span className="text-sm font-black text-gray-700">{getVal(activeTab, 'ft')}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 font-sans">Lực hướng tâm (Fr)</span>
                <span className="text-sm font-black text-gray-700">{getVal(activeTab, 'fr')}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 font-sans">Lực dọc trục (Fa)</span>
                <span className="text-sm font-black text-gray-700">{getVal(activeTab, 'fa')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
