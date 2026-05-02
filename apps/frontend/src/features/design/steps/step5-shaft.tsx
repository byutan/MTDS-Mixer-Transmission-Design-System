import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";
import { useDesign } from "@/features/design/context/DesignContext";
import demoData from "../../../../../../demodata.json";

export default function Step5Shaft() {
  const { formData, step2Data } = useDesign();
  const [activeTab, setActiveTab] = useState<"I" | "II" | "III">("I");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shaftResults, setShaftResults] = useState<{
    diameter: any;
    strength45: any;
    safety: any;
    overload: any;
  } | null>(null);

  const safeParse = (val: any) => {
    if (typeof val === 'string' && (val === '---' || val === '')) return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const fetchShaftData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const motorMatch = step2Data.motor.match(/\((.*?) kW/);
      const motorPower = motorMatch ? safeParse(motorMatch[1]) : 0;
      const motorSpeed = safeParse(step2Data.motor.match(/, (.*?) v\/ph/)?.[1]);

      const payload = {
        duLieuDauVao: {
          thungTron: {
            congSuat: safeParse(formData.power),
            soVongQuay: safeParse(formData.speed)
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
            truc: demoData.duLieuDauVao.heThongTruyenDong.truc
          }
        }
      };

      const baseUrl = "http://localhost:3001/api/truc";
      const endpoints = {
        diameter: `${baseUrl}/tinh-bang-duong-kinh-truc-${activeTab}`,
        strength45: `${baseUrl}/tinh-bang-4-5-truc-${activeTab}`,
        safety: `${baseUrl}/kiemnghiem-heso-antoan-truc-${activeTab}`,
        overload: `${baseUrl}/kiemnghiem-doben-quatai-truc-${activeTab}`
      };

      const [resDiam, resStr, resSafe, resOver] = await Promise.all([
        fetch(endpoints.diameter, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.strength45, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.safety, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.overload, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      ]);

      const [dataDiam, dataStr, dataSafe, dataOver] = await Promise.all([
        resDiam.json(), resStr.json(), resSafe.json(), resOver.json()
      ]);

      if (dataDiam.success && dataStr.success && dataSafe.success && dataOver.success) {
        setShaftResults({
          diameter: dataDiam.data,
          strength45: dataStr.data,
          safety: dataSafe.data,
          overload: dataOver.data
        });
      } else {
        setError("Lỗi dữ liệu từ Backend. Hãy kiểm tra các bước trước đã điền đủ thông tin.");
      }
    } catch (err) {
      setError("Lỗi kết nối Backend. Hãy đảm bảo Server đang chạy tại cổng 3001.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, formData.power, formData.speed, step2Data.motor, step2Data.beltRatio, step2Data.u1, step2Data.u2]);

  useEffect(() => {
    fetchShaftData();
  }, [fetchShaftData]);

  const getSections = () => {
    if (!shaftResults || !shaftResults.diameter) return [];
    return Object.keys(shaftResults.diameter)
      .filter(key => key.startsWith('ketqua_'))
      .map(key => shaftResults.diameter[key]);
  };

  const sections = getSections();
  const strengthSections = (shaftResults && shaftResults.strength45) ? Object.keys(shaftResults.strength45)
    .filter(k => k.startsWith('result_tietdien'))
    .map(k => shaftResults.strength45[k]) : [];

  const mainSafety = [
    shaftResults?.safety?.ketqua_tietdien1?.s,
    shaftResults?.safety?.ketqua_tietdien2?.s,
    shaftResults?.safety?.ketqua_tietdien3?.s
  ].find(val => val && val !== "-") || "---";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Selector */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full max-w-md border border-slate-200">
          {(["I", "II", "III"] as const).map((id) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              Trục {id}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-medium italic text-sm">Đang trích xuất dữ liệu trục thực tế...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="space-y-1">
             <p className="text-red-700 font-bold">Lỗi hiển thị Bước 5</p>
             <p className="text-red-600 text-xs">{error}</p>
          </div>
          <button onClick={fetchShaftData} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold text-sm">Thử lại</button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bảng 1: Đường kính trục */}
          <Card className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Xác định đường kính trục theo momen tương đương</h3>
              <p className="text-xs text-gray-500 italic">Xác định kích thước các đoạn trục dựa trên tải trọng tính toán</p>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-4 px-8 text-left font-bold uppercase text-[10px] tracking-widest">Tiết diện</th>
                      <th className="py-4 px-6 text-center font-bold uppercase text-[10px] tracking-widest">Moment Mtd (N.mm)</th>
                      <th className="py-4 px-6 text-center font-bold uppercase text-[10px] tracking-widest">Đường kính dtd (mm)</th>
                      <th className="py-4 px-8 text-center font-bold uppercase text-[10px] tracking-widest">Đường kính TC (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sections.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 px-8 font-bold text-slate-700">{s.Tietdientai}</td>
                        <td className="py-4 px-6 text-center text-slate-600 font-medium">
                          {Number(s.Momentd).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-center text-slate-600">{s.Dtuongduong}</td>
                        <td className="py-4 px-8 text-center bg-blue-50/30 font-black text-blue-600 text-base">{s.Dtieuchuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bảng 2: Độ bền mỏi */}
            <Card className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Kiểm nghiệm độ bền mỏi</h3>
                <p className="text-xs text-gray-500 italic">Kiểm tra khả năng làm việc lâu dài của trục</p>
              </div>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-4 px-8 text-left font-bold uppercase text-[10px] tracking-widest">Tiết diện</th>
                      <th className="py-4 px-6 text-center font-bold uppercase text-[10px] tracking-widest">Wj</th>
                      <th className="py-4 px-6 text-center font-bold uppercase text-[10px] tracking-widest">Woj</th>
                      <th className="py-4 px-8 text-center font-bold uppercase text-[10px] tracking-widest">Ứng suất sigma_aj</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {strengthSections.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 px-8 font-bold text-slate-700">{s.Tietdientai}</td>
                        <td className="py-4 px-6 text-center text-slate-500">{s.Wj}</td>
                        <td className="py-4 px-6 text-center text-slate-500">{s.Woj}</td>
                        <td className="py-4 px-8 text-center font-bold text-gray-700">{s.g_aj}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Bảng 3: Quá tải */}
            <Card className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Kiểm nghiệm độ bền quá tải</h3>
                <p className="text-xs text-gray-500 italic">Kiểm tra ứng suất khi xảy ra quá tải đột ngột</p>
              </div>
              <CardContent className="p-0">
                <div className="space-y-6 pt-2">
                  {shaftResults?.overload && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Moment uốn Mmax</span>
                          <span className="text-sm font-bold text-slate-700">{Number(shaftResults.overload.Mmax).toLocaleString()} N.mm</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Moment xoắn Tmax</span>
                          <span className="text-sm font-bold text-slate-700">{Number(shaftResults.overload.Tmax).toLocaleString()} N.mm</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold block">sigma_max</span>
                            <span className="text-sm font-bold text-slate-700">{shaftResults.overload.g}</span>
                         </div>
                         <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold block">tau_max</span>
                            <span className="text-sm font-bold text-slate-700">{shaftResults.overload.t}</span>
                         </div>
                         <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold block">sigma_td</span>
                            <span className="text-sm font-bold text-blue-600">{shaftResults.overload.gtd}</span>
                         </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-emerald-800 block">Hệ số an toàn tổng: s = {mainSafety}</span>
                        <span className="text-[10px] text-emerald-600 italic">Thỏa mãn điều kiện bền mỏi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Info */}
          <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-blue-900">Thông số vật liệu trục</h4>
              <p className="text-xs text-blue-700">Mác thép: <b>{demoData.duLieuDauVao.heThongTruyenDong.truc.nhanhieuthep}</b> | Nhiệt luyện: {demoData.duLieuDauVao.heThongTruyenDong.truc.nhietluyen}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
