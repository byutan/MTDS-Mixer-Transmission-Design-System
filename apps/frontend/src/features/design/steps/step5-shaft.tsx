import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Loader2, Info, Ruler, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDesign } from "@/features/design/context/DesignContext";
import demoData from "../../../../../../demodata.json";

export default function Step5Shaft() {
  const { formData, step2Data, step5Data, setStep5Data } = useDesign();
  const [activeTab, setActiveTab] = useState<"I" | "II" | "III">("I");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [designSuggestions, setDesignSuggestions] = useState<{
    d_list: number[];
    limits: any;
    l11_limit?: { min: number, max: number } | null;
  } | null>(null);

  const [shaftResults, setShaftResults] = useState<{
    diameter: any;
    strength45: any;
    safety: any;
    overload: any;
    reactions?: any;
  } | null>(null);

  const lastDRef = useRef<string | null>(null);

  const safeParse = (val: any) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'string') {
        const cleanVal = val.replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleanVal);
        return isNaN(parsed) ? 0 : parsed;
    }
    return typeof val === 'number' ? val : 0;
  };

  const getPayload = useCallback(() => {
    const motorPower = safeParse(step2Data.motorPower);
    const motorSpeed = safeParse(step2Data.motorSpeed);

    return {
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
  }, [formData, step2Data, step5Data]);

  const fetchDesignConstraints = useCallback(async () => {
    try {
      const payload = getPayload();
      const baseUrl = "http://localhost:3001/api/truc";
      
      const resD = await fetch(`${baseUrl}/tinh-dieu-kien-d${activeTab === "I" ? "1" : activeTab === "II" ? "2" : "3"}-truc-${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const dataD = await resD.json();

      const currentD = activeTab === "I" ? step5Data.trucI.d1 : activeTab === "II" ? (step5Data.trucII as any).d2 : (step5Data.trucIII as any).d3;
      let dataLimits = { success: false, data: null };
      let dataL11 = { success: false, data: null };

      if (safeParse(currentD) > 0) {
        const resLimits = await fetch(`${baseUrl}/show-gh-truc-${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        dataLimits = await resLimits.json();

        if (activeTab === "I") {
          const resL11 = await fetch(`${baseUrl}/show-gh-l11-truc-I`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          dataL11 = await resL11.json();
        }
      }

      if (dataD.success) {
        setDesignSuggestions({
          d_list: dataD.data.d1_danhSach || [],
          limits: dataLimits.success ? dataLimits.data : null,
          l11_limit: dataL11.success ? dataL11.data : null
        });
        
        if (currentD !== lastDRef.current && dataLimits.success) {
          const limits = dataLimits.data;
          const l11_limit = dataL11.data;
          const trucKey = activeTab === "I" ? "trucI" : activeTab === "II" ? "trucII" : "trucIII";
          
          let updates: any = {};
          if (activeTab === "I") {
             updates = {
                lmrc: Math.round((limits.gh_lmrc.min + limits.gh_lmrc.max) / 2).toString(),
                lmdt: Math.round((limits.gh_lmdt.min + limits.gh_lmdt.max) / 2).toString(),
                l11: l11_limit ? Math.round((l11_limit.min + l11_limit.max) / 2).toString() : step5Data.trucI.l11
             };
          } else if (activeTab === "II") {
             updates = {
                lmrc: Math.round((limits.gh_lmrc.min + limits.gh_lmrc.max) / 2).toString(),
                lmrt: Math.round((limits.gh_lmrt.min + limits.gh_lmrt.max) / 2).toString()
             };
          } else {
             updates = {
                lmrt: Math.round((limits.gh_lmrt.min + limits.gh_lmrt.max) / 2).toString(),
                lmkn: Math.round((limits.gh_lmkn.min + limits.gh_lmkn.max) / 2).toString()
             };
          }
          
          setStep5Data({
            ...step5Data,
            [trucKey]: { ...step5Data[trucKey], ...updates }
          });
          lastDRef.current = currentD;
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy gợi ý thiết kế:", err);
    }
  }, [activeTab, getPayload, step5Data]);

  const fetchShaftResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = getPayload();
      const baseUrl = "http://localhost:3001/api/truc";
      
      const endpoints = {
        diameter: `${baseUrl}/tinh-bang-duong-kinh-truc-${activeTab}`,
        strength45: `${baseUrl}/tinh-bang-4-5-truc-${activeTab}`,
        safety: `${baseUrl}/kiemnghiem-heso-antoan-truc-${activeTab}`,
        overload: `${baseUrl}/kiemnghiem-doben-quatai-truc-${activeTab}`,
        reactions: `${baseUrl}/tinh-he-truc-${activeTab}`
      };

      const [resDiam, resStr, resSafe, resOver, resReact] = await Promise.all([
        fetch(endpoints.diameter, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.strength45, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.safety, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.overload, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(endpoints.reactions, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      ]);

      const [dataDiam, dataStr, dataSafe, dataOver, dataReact] = await Promise.all([
        resDiam.json(), resStr.json(), resSafe.json(), resOver.json(), resReact.json()
      ]);

      if (dataDiam.success) {
        setShaftResults({
          diameter: dataDiam.data,
          strength45: dataStr.success ? dataStr.data : null,
          safety: dataSafe.success ? dataSafe.data : null,
          overload: dataOver.success ? dataOver.data : null,
          reactions: dataReact.success ? dataReact.data : null
        });
      } else {
        setError(dataDiam.message || "Dữ liệu thiết kế hiện tại không thỏa mãn điều kiện tính toán.");
      }
    } catch (err) {
      setError("Lỗi kết nối Backend.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, getPayload]);

  useEffect(() => {
    fetchDesignConstraints();
    fetchShaftResults();
  }, [activeTab, step5Data.trucI.d1, (step5Data.trucII as any).d2, (step5Data.trucIII as any).d3, fetchDesignConstraints, fetchShaftResults]);

  const handleInputChange = (field: string, value: string) => {
    // Chỉ lấy phần số
    const cleanValue = value.replace(/[^\d.]/g, '');
    if (cleanValue !== "" && !/^\d*\.?\d*$/.test(cleanValue)) return;
    
    const trucKey = activeTab === "I" ? "trucI" : activeTab === "II" ? "trucII" : "trucIII";
    setStep5Data({
      ...step5Data,
      [trucKey]: { ...step5Data[trucKey], [field]: cleanValue }
    });
  };

  const getDiameterSections = () => {
    if (!shaftResults || !shaftResults.diameter) return [];
    return Object.keys(shaftResults.diameter)
      .filter(key => key.startsWith('ketqua_'))
      .map(key => shaftResults.diameter[key]);
  };

  const diameterSections = getDiameterSections();

  const safetyValues = shaftResults?.safety ? Object.keys(shaftResults.safety)
    .filter(k => k.startsWith('ketqua_tietdien'))
    .map(k => shaftResults.safety[k].s)
    .filter(s => typeof s === 'number') : [];
  
  const minSafety = safetyValues.length > 0 ? Math.min(...safetyValues) : 0;
  const isSafetyPassed = minSafety >= 1.5; 

  const renderDesignInputs = () => {
    const data = activeTab === "I" ? step5Data.trucI : activeTab === "II" ? step5Data.trucII : step5Data.trucIII;
    const labels = activeTab === "I" 
      ? { d: "Đường kính (d1)", l1: "Chiều dài (lmrc)", l2: "Chiều dài (lmdt)", extra: "Chiều dài (l11)" }
      : activeTab === "II"
      ? { d: "Đường kính (d2)", l1: "Chiều dài (lmrc)", l2: "Chiều dài (lmrt)" }
      : { d: "Đường kính (d3)", l1: "Chiều dài (lmrt)", l2: "Chiều dài (lmkn)" };

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-sans">Cấu hình thiết kế Trục {activeTab}</h3>
          <p className="text-sm text-gray-600 font-sans tracking-tight">
            Vật liệu: {demoData.duLieuDauVao.heThongTruyenDong.truc.nhanhieuthep} ({demoData.duLieuDauVao.heThongTruyenDong.truc.nhietluyen})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">{labels.d}</Label>
            <Select value={activeTab === "I" ? data.d1 : activeTab === "II" ? (data as any).d2 : (data as any).d3} onValueChange={(val) => handleInputChange(activeTab === "I" ? "d1" : activeTab === "II" ? "d2" : "d3", val)}>
              <SelectTrigger className="w-full border border-slate-200 rounded-md text-sm px-3 py-2 !h-11 flex items-center bg-white hover:bg-slate-50 font-sans">
                <SelectValue placeholder="Chọn d..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {designSuggestions?.d_list.map(d => (
                  <SelectItem key={d} value={d.toString()}>{d} mm</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-blue-500 font-medium italic flex items-center gap-1">
              <Info className="w-3 h-3" /> * Theo điều kiện Momen xoắn
            </p>
          </div>

          {[
            { id: activeTab === "III" ? "lmrt" : "lmrc", label: labels.l1, limit: activeTab === "III" ? designSuggestions?.limits?.gh_lmrt : designSuggestions?.limits?.gh_lmrc },
            { id: activeTab === "I" ? "lmdt" : activeTab === "II" ? "lmrt" : "lmkn", label: labels.l2, limit: activeTab === "I" ? designSuggestions?.limits?.gh_lmdt : activeTab === "II" ? designSuggestions?.limits?.gh_lmrt : designSuggestions?.limits?.gh_lmkn },
            ...(activeTab === "I" ? [{ id: "l11", label: labels.extra, limit: designSuggestions?.l11_limit }] : [])
          ].map((field) => {
            const rawValue = (data as any)[field.id];
            const displayValue = rawValue ? `${rawValue} mm` : "";
            
            return (
              <div key={field.id} className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">{field.label}</Label>
                <Input 
                  value={displayValue} 
                  onChange={(e) => handleInputChange(field.id, e.target.value)} 
                  className={`border rounded-md text-sm h-11 w-full font-bold transition-all font-sans ${
                    field.limit && (safeParse(rawValue) < field.limit.min || safeParse(rawValue) > field.limit.max) 
                    ? "bg-red-50 border-red-500 text-red-600 focus:ring-red-200" : "bg-white border-slate-200 focus:ring-blue-500"
                  }`} 
                />
                <p className={`text-[10px] italic font-medium ${field.limit && (safeParse(rawValue) < field.limit.min || safeParse(rawValue) > field.limit.max) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                  Gợi ý: [{field.limit?.min?.toFixed(1) || "---"} - {field.limit?.max?.toFixed(1) || "---"}]
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Tab Selector */}
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

      {renderDesignInputs()}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-medium italic text-sm font-sans">Đang tính toán kiểm nghiệm trục...</p>
        </div>
      ) : error ? (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <div className="space-y-1">
             <p className="text-amber-700 font-bold font-sans tracking-tight">Yêu cầu điều chỉnh thiết kế</p>
             <p className="text-amber-600 text-xs font-sans">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 font-sans">Phản lực liên kết</h3>
                   <p className="text-sm text-gray-600 font-sans">Giá trị phản lực tại các gối đỡ ổ lăn</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {shaftResults?.reactions ? Object.entries(shaftResults.reactions).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-500">Phản lực ({key})</span>
                        <span className="text-sm font-black text-blue-600">{(Number(val) || 0).toLocaleString()} N</span>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 text-slate-400 italic text-xs">Không có dữ liệu phản lực</div>
                    )}
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 font-sans">Kiểm nghiệm tổng thể</h3>
                   <p className="text-sm text-gray-600 font-sans">Đánh giá khả năng chịu tải và độ bền</p>
                </div>
                
                <div className="space-y-4">
                    <div className={`flex justify-between items-center p-5 rounded-2xl border ${isSafetyPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                       <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isSafetyPassed ? 'text-emerald-600' : 'text-red-600'}`}>Hệ số an toàn mỏi (s)</p>
                          <span className={`text-lg font-black ${isSafetyPassed ? 'text-emerald-800' : 'text-red-800'}`}>s = {minSafety > 0 ? minSafety.toFixed(2) : "---"}</span>
                       </div>
                       <span className={`text-xs px-4 py-1.5 rounded-full font-black shadow-sm ${isSafetyPassed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                          {isSafetyPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                       </span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-blue-50 rounded-2xl border border-blue-100">
                       <div>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Kiểm nghiệm quá tải (Σ_MAX)</p>
                          <span className="text-lg font-black text-blue-800">{shaftResults?.overload?.gtd || "---"} MPa</span>
                       </div>
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 font-sans">Bảng 4.5: Tính toán Momen và Đường kính tương đương</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b">
                    <th className="py-4 px-4 text-left font-bold uppercase text-[10px] tracking-wider pl-8">Tiết diện</th>
                    <th className="py-4 px-4 text-center font-bold uppercase text-[10px] tracking-wider">Momen xoắn (T)</th>
                    <th className="py-4 px-4 text-center font-bold uppercase text-[10px] tracking-wider">Momen tương đương (Mtd)</th>
                    <th className="py-4 px-4 text-center font-bold uppercase text-[10px] tracking-wider">Đường kính (dtd)</th>
                    <th className="py-4 px-4 text-center font-bold uppercase text-[10px] tracking-wider text-blue-600 pr-8">Chọn d (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {diameterSections.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-700 pl-8">{s.Tietdientai}</td>
                      <td className="py-4 px-4 text-center text-slate-600 font-medium">
                        {Number(s.Momenxoan || 0).toLocaleString()} N.mm
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600 font-bold">
                        {Number(s.Momentd || 0).toLocaleString()} N.mm
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600">{s.Dtuongduong} mm</td>
                      <td className="py-4 px-4 text-center bg-blue-50/30 font-black text-blue-600 pr-8">{s.Dtieuchuan} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
