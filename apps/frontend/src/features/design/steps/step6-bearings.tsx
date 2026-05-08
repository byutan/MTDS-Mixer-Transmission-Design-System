import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useDesign } from "@/features/design/context/DesignContext";
import demoData from "../../../../../../demodata.json";

export default function Step6Bearings() {
  const { formData, step2Data, step5Data } = useDesign();
  const [activeTab, setActiveTab] = useState<"1" | "2" | "3">("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bearingData, setBearingData] = useState<any>(null);

  const safeParse = (val: any) => {
    if (typeof val === 'string' && (val === '---' || val === '')) return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const fetchBearingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const motorPower = parseFloat(step2Data.motorPower) || 0;
      const motorSpeed = parseFloat(step2Data.motorSpeed) || 0;

      const payload = {
        duLieuDauVao: {
          thungTron: {
            congSuat: safeParse(formData.power),
            soVongQuay: safeParse(formData.speed),
            thoiGianPhucVu: safeParse(formData.lifespan)
          },
          heThongTruyenDong: {
            dongCo: { congSuat: motorPower, vanTocQuay: motorSpeed },
            hopGiamToc: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
            boTruyenDai: {
              ...demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
              tySoTruyenSoBo: safeParse(step2Data.beltRatio)
            },
            oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
            noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi,
            phanPhoiTySoTruyen: {
              heSoThietKe: demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc.heSoThietKe?.psi_bd2 || 0.9,
              tySoTruyenBanhRang: [
                { loai: "BanhRangCon", tySoTruyen: safeParse(step2Data.u1) },
                { loai: "BanhRangTru", tySoTruyen: safeParse(step2Data.u2) }
              ]
            },
            truc: {
              nhanhieuthep: demoData.duLieuDauVao.heThongTruyenDong.truc.nhanhieuthep,
              nhietluyen: demoData.duLieuDauVao.heThongTruyenDong.truc.nhietluyen,
              Thongtintruc: {
                trucI: { 
                  d1: safeParse(step5Data.trucI.d1), 
                  lmrc: safeParse(step5Data.trucI.lmrc), 
                  lmdt: safeParse(step5Data.trucI.lmdt),
                  l11: safeParse(step5Data.trucI.l11),
                  "Bánh đai thang lớn": safeParse(step5Data.trucI.d1),
                  "A": safeParse(step5Data.trucI.d1),
                  "B": safeParse(step5Data.trucI.d1),
                  "Bánh răng côn nhỏ": safeParse(step5Data.trucI.d1)
                },
                trucII: { 
                  d2: safeParse(step5Data.trucII.d2), 
                  lmrc: safeParse(step5Data.trucII.lmrc), 
                  lmrt: safeParse(step5Data.trucII.lmrt),
                  "C": safeParse(step5Data.trucII.d2),
                  "Bánh răng trụ nhỏ": safeParse(step5Data.trucII.d2),
                  "Bánh răng côn lớn": safeParse(step5Data.trucII.d2),
                  "D": safeParse(step5Data.trucII.d2)
                },
                trucIII: { 
                  d3: safeParse(step5Data.trucIII.d3), 
                  lmrt: safeParse(step5Data.trucIII.lmrt), 
                  lmkn: safeParse(step5Data.trucIII.lmkn),
                  "E": safeParse(step5Data.trucIII.d3),
                  "Bánh răng trụ lớn": safeParse(step5Data.trucIII.d3),
                  "F": safeParse(step5Data.trucIII.d3),
                  "Khớp nối": safeParse(step5Data.trucIII.d3)
                }
              }
            }
          }
        }
      };

      const res = await fetch(`http://localhost:3001/api/o-lan/tinh-toan-truc/${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setBearingData(data.data);
      } else {
        setError(data.message || "Không tìm thấy ổ lăn phù hợp cho thiết kế hiện tại.");
      }
    } catch (err) {
      setError("Lỗi kết nối Backend.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, formData, step2Data, step5Data]);

  useEffect(() => {
    fetchBearingData();
  }, [fetchBearingData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full max-w-md border border-slate-200">
          {["1", "2", "3"].map((id) => (
            <button 
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Ổ Lăn {id === "1" ? "I" : id === "2" ? "II" : "III"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-medium italic text-sm">Đang tính toán chọn ổ lăn từ thư viện...</p>
        </div>
      ) : error ? (
        <Card className="border-amber-100 bg-amber-50/50 p-12 text-center flex flex-col items-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <div className="space-y-1">
             <h3 className="font-bold text-amber-900">Thiết kế trục chưa phù hợp</h3>
             <p className="text-sm text-amber-700 max-w-md">{error}</p>
          </div>
          <button onClick={fetchBearingData} className="flex items-center gap-2 px-6 py-2 bg-white border border-amber-200 rounded-lg text-amber-700 text-sm font-bold hover:bg-amber-100 transition-all">
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </Card>
      ) : bearingData ? (() => {
        const mainPosKey = activeTab === "1" ? "vi_tri_A" : activeTab === "2" ? "vi_tri_C" : "vi_tri_E";
        
        const mainPos = bearingData[mainPosKey];
        if (!mainPos) return <div className="py-20 text-center text-slate-400 italic">Dữ liệu ổ lăn không đầy đủ...</div>;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Bearing Specification */}
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
              <CardContent className="pt-4 space-y-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight font-sans">Thông số ổ lăn chọn ({mainPosKey.replace('vi_tri_', '')})</h3>
                  <p className="text-sm text-gray-600 mt-1 font-sans">Loại ổ: {mainPos.bang_chon_o?.loai_o}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Ký hiệu ổ lăn</Label>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-black text-2xl text-center shadow-inner">
                      {mainPos.bang_chon_o?.ky_hieu || "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Đường kính (d)</Label>
                      <Input readOnly value={`${mainPos.bang_chon_o?.d || 0} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Đường kính (D)</Label>
                      <Input readOnly value={`${mainPos.bang_chon_o?.D || 0} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Khả năng tải động cơ bản (C)</Label>
                    <Input readOnly value={`${mainPos.bang_chon_o?.C_kN || 0} kN`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Khả năng tải tĩnh cơ bản (C0)</Label>
                    <Input readOnly value={`${mainPos.bang_chon_o?.C0_kN || 0} kN`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Column 2: Calculation Details */}
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
              <CardContent className="pt-4 space-y-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight font-sans">Chi tiết tính toán</h3>
                  <p className="text-sm text-gray-600 mt-1 font-sans">Lực tác dụng và hệ số quy đổi</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans text-[11px]">Lực hướng tâm (Fr)</Label>
                      <Input readOnly value={`${Number(mainPos.chi_tiet_tinh_toan?.Fr_N || 0).toLocaleString()} N`} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans text-[11px]">Lực dọc trục (Fa)</Label>
                      <Input readOnly value={`${Number(mainPos.chi_tiet_tinh_toan?.Fa_N || 0).toLocaleString()} N`} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 mb-1 font-sans">Fa/VFr</Label>
                      <Input readOnly value={mainPos.chi_tiet_tinh_toan?.ti_so_Fa_VFr} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 mb-1 font-sans">Hệ số (e)</Label>
                      <Input readOnly value={mainPos.chi_tiet_tinh_toan?.he_so_e} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 mb-1 font-sans">Hệ số (X)</Label>
                      <Input readOnly value={mainPos.chi_tiet_tinh_toan?.he_so_X} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Tải trọng động quy ước (Q)</Label>
                    <Input readOnly value={`${Number(mainPos.chi_tiet_tinh_toan?.tai_trong_dong_quy_uoc_Q_N || 0).toLocaleString()} N`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans text-[11px]">Tuổi thọ triệu vòng (L)</Label>
                      <Input readOnly value={`${Number(mainPos.chi_tiet_tinh_toan?.tuoi_tho_trieu_vong_quay_L || 0).toFixed(2)} triệu vòng`} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans text-[11px]">Thời gian phục vụ (Lh)</Label>
                      <Input readOnly value={`${Number(formData.lifespan || 0).toLocaleString()} giờ`} className="bg-slate-50 border-slate-200 h-9 text-gray-700 font-bold text-xs" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Column 3: Verification */}
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
              <CardContent className="pt-4 space-y-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight font-sans">Kiểm nghiệm khả năng tải</h3>
                  <p className="text-sm text-gray-600 mt-1 font-sans">So sánh Cd và C cơ bản</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans text-xs">Khả năng tải động tính toán (Cd)</Label>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl relative overflow-hidden group">
                       <div className="text-emerald-700 font-black text-3xl text-center relative z-10">
                         {(mainPos.ket_qua_kiem_nghiem?.Cd_kN || 0).toFixed(3)} kN
                       </div>
                       <div className="text-[10px] text-emerald-600 text-center font-bold mt-2 uppercase tracking-widest relative z-10 border-t border-emerald-100 pt-2">
                          Cd ({(mainPos.ket_qua_kiem_nghiem?.Cd_kN || 0).toFixed(2)} kN) ≤ C ({mainPos.bang_chon_o?.C_kN || 0} kN)
                       </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    {mainPos.ket_qua_kiem_nghiem?.ket_luan === "Passed" ? (
                      <div className="bg-emerald-600 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-sm font-black shadow-lg shadow-emerald-100">
                        <CheckCircle2 className="w-8 h-8" />
                        <span>ĐẠT ĐIỀU KIỆN BỀN</span>
                      </div>
                    ) : (
                      <div className="bg-red-600 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-sm font-black shadow-lg shadow-red-100">
                        <AlertCircle className="w-8 h-8" />
                        <span>KHÔNG ĐẠT ĐIỀU KIỆN</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })() : (
        <div className="py-20 text-center text-slate-400 italic">Chọn trục để xem thông tin tính toán ổ lăn...</div>
      )}
    </div>
  );
}
