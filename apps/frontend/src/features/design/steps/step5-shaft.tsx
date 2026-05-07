import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Loader2, Info, Settings2, Ruler, RefreshCw } from "lucide-react";
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

  const safeParse = (val: any) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'string' && (val.trim() === '---' || val.trim() === '')) return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getPayload = useCallback(() => {
    const motorMatch = step2Data.motor.match(/\((.*?) kW/);
    const motorPower = motorMatch ? safeParse(motorMatch[1]) : 0;
    const motorSpeed = safeParse(step2Data.motor.match(/, (.*?) v\/ph/)?.[1]);

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
            nhanhieuthep: "45",
            nhietluyen: "Tôi cải thiện",
            Thongtintruc: {
              trucI: { 
                d1: safeParse(step5Data.trucI.d1), 
                lmrc: safeParse(step5Data.trucI.lmrc), 
                lmdt: safeParse(step5Data.trucI.lmdt),
                l11: safeParse(step5Data.trucI.l11),
                // Map descriptive names for backend
                "Bánh đai thang lớn": safeParse(step5Data.trucI.d1),
                "A": safeParse(step5Data.trucI.d1) + 5,
                "B": safeParse(step5Data.trucI.d1) + 5,
                "Bánh răng côn nhỏ": safeParse(step5Data.trucI.d1) + 10
              },
              trucII: { 
                d2: safeParse(step5Data.trucII.d2), 
                lmrc: safeParse(step5Data.trucII.lmrc), 
                lmrt: safeParse(step5Data.trucII.lmrt),
                // Map descriptive names for backend
                "C": safeParse(step5Data.trucII.d2),
                "Bánh răng trụ nhỏ": safeParse(step5Data.trucII.d2) + 5,
                "Bánh răng côn lớn": safeParse(step5Data.trucII.d2) + 10,
                "D": safeParse(step5Data.trucII.d2)
              },
              trucIII: { 
                d3: safeParse(step5Data.trucIII.d3), 
                lmrt: safeParse(step5Data.trucIII.lmrt), 
                lmkn: safeParse(step5Data.trucIII.lmkn),
                // Map descriptive names for backend
                "E": safeParse(step5Data.trucIII.d3),
                "Bánh răng trụ lớn": safeParse(step5Data.trucIII.d3) + 5,
                "F": safeParse(step5Data.trucIII.d3) + 5,
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
      }
    } catch (err) {
      console.error("Lỗi khi lấy gợi ý thiết kế:", err);
    }
  }, [activeTab, getPayload, step5Data.trucI.d1, (step5Data.trucII as any).d2, (step5Data.trucIII as any).d3]);

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

      if (dataDiam.success && dataStr.success && dataSafe.success && dataOver.success) {
        setShaftResults({
          diameter: dataDiam.data,
          strength45: dataStr.data,
          safety: dataSafe.data,
          overload: dataOver.data,
          reactions: dataReact.success ? dataReact.data : null
        });
      } else {
        const failedResponse = [dataDiam, dataStr, dataSafe, dataOver].find(d => !d.success);
        const msg = failedResponse?.message || "Dữ liệu thiết kế hiện tại không thỏa mãn điều kiện tính toán.";
        setError(msg);
      }
    } catch (err) {
      setError("Lỗi kết nối Backend. Vui lòng kiểm tra Server.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, getPayload]);

  // Tải gợi ý và kết quả tính toán
  const d1_v = step5Data.trucI.d1;
  const d2_v = (step5Data.trucII as any).d2;
  const d3_v = (step5Data.trucIII as any).d3;

  useEffect(() => {
    fetchDesignConstraints();
    fetchShaftResults();
  }, [activeTab, d1_v, d2_v, d3_v, fetchDesignConstraints, fetchShaftResults]);

  // Đã gỡ bỏ cơ chế tự động sửa lỗi (Auto-fill) để tránh gây khó chịu khi nhập liệu
  // Chỉ giữ lại cảnh báo bằng màu sắc (Red) trong phần render
  // useEffect(() => { ... }) đã được xóa

  const handleInputChange = (field: string, value: string) => {
    // 1. Chỉ cho phép nhập số
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    // 2. Chặn nhập quá Max (Strict Real-time)
    const numValue = safeParse(value);
    let limit = null;
    
    if (field === "lmrc") limit = designSuggestions?.limits?.gh_lmrc;
    else if (field === "lmdt") limit = designSuggestions?.limits?.gh_lmdt;
    else if (field === "lmrt") limit = designSuggestions?.limits?.gh_lmrt;
    else if (field === "lmkn") limit = designSuggestions?.limits?.gh_lmkn;
    else if (field === "l11") limit = designSuggestions?.l11_limit;

    // Đã gỡ bỏ chặn nhập quá Max - Chỉ hiển thị cảnh báo đỏ ở giao diện
    // if (limit && numValue > limit.max) return;

    const trucKey = activeTab === "I" ? "trucI" : activeTab === "II" ? "trucII" : "trucIII";
    setStep5Data({
      ...step5Data,
      [trucKey]: {
        ...step5Data[trucKey],
        [field]: value
      }
    });
  };

  const handleBlur = (field: string, value: string) => {
    const numValue = safeParse(value);
    let limit = null;
    
    if (field === "lmrc") limit = designSuggestions?.limits?.gh_lmrc;
    else if (field === "lmdt") limit = designSuggestions?.limits?.gh_lmdt;
    else if (field === "lmrt") limit = designSuggestions?.limits?.gh_lmrt;
    else if (field === "lmkn") limit = designSuggestions?.limits?.gh_lmkn;
    else if (field === "l11") limit = designSuggestions?.l11_limit;

    // Đã gỡ bỏ tự động sửa về Min khi Blur - Cho phép người dùng nhập tự do
    /*
    if (limit && numValue < limit.min) {
      handleInputChange(field, limit.min.toString());
    }
    */
  };

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

  const renderDesignInputs = () => {
    const data = activeTab === "I" ? step5Data.trucI : activeTab === "II" ? step5Data.trucII : step5Data.trucIII;
    const labels = activeTab === "I" 
      ? { d: "d1 (mm)", l1: "lmrc (mm)", l2: "lmdt (mm)", extra: "l11 (mm)" }
      : activeTab === "II"
      ? { d: "d2 (mm)", l1: "lmrc (mm)", l2: "lmrt (mm)" }
      : { d: "d3 (mm)", l1: "lmrt (mm)", l2: "lmkn (mm)" };

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cấu hình thiết kế Trục {activeTab}</h3>
            <p className="text-xs text-gray-500 italic">Xác định kích thước chiều dài và đường kính các đoạn trục</p>
          </div>
          <button 
            onClick={fetchDesignConstraints} 
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Tải gợi ý
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-600 block">{labels.d}</Label>
            <Select 
              value={activeTab === "I" ? data.d1 : activeTab === "II" ? (data as any).d2 : (data as any).d3}
              onValueChange={(val) => handleInputChange(activeTab === "I" ? "d1" : activeTab === "II" ? "d2" : "d3", val)}
            >
              <SelectTrigger className="w-full h-11 bg-white border-slate-200 font-bold text-gray-700">
                <SelectValue placeholder="Chọn đường kính..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {!designSuggestions ? (
                  <SelectItem value="loading" disabled>Đang tải gợi ý...</SelectItem>
                ) : designSuggestions.d_list.length === 0 ? (
                  <SelectItem value="none" disabled>Không có d phù hợp (&gt;100mm)</SelectItem>
                ) : (
                  designSuggestions.d_list.map(d => (
                    <SelectItem key={d} value={d.toString()}>{d} mm</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-blue-500 font-medium italic flex items-center gap-1">
              <Info className="w-3 h-3" /> * Đường kính tiêu chuẩn gợi ý
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-600 block">{labels.l1}</Label>
            <Input 
              value={activeTab === "III" ? (data as any).lmrt : data.lmrc} 
              onChange={(e) => handleInputChange(activeTab === "III" ? "lmrt" : "lmrc", e.target.value)}
              onBlur={(e) => handleBlur(activeTab === "III" ? "lmrt" : "lmrc", e.target.value)}
              className={`h-11 font-bold text-gray-700 ${
                activeTab === "III" 
                  ? (designSuggestions?.limits?.gh_lmrt && (safeParse((data as any).lmrt) < designSuggestions.limits.gh_lmrt.min || safeParse((data as any).lmrt) > designSuggestions.limits.gh_lmrt.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200")
                  : (designSuggestions?.limits?.gh_lmrc && (safeParse(data.lmrc) < designSuggestions.limits.gh_lmrc.min || safeParse(data.lmrc) > designSuggestions.limits.gh_lmrc.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200")
              }`}
            />
            {activeTab === "III" ? (
              <p className={`text-[10px] italic font-medium ${safeParse((data as any).lmrt) < (designSuggestions?.limits?.gh_lmrt?.min || 0) || safeParse((data as any).lmrt) > (designSuggestions?.limits?.gh_lmrt?.max || 999) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.limits?.gh_lmrt?.min?.toFixed(1) || "---"} - {designSuggestions?.limits?.gh_lmrt?.max?.toFixed(1) || "---"}]
              </p>
            ) : (
              <p className={`text-[10px] italic font-medium ${safeParse(data.lmrc) < (designSuggestions?.limits?.gh_lmrc?.min || 0) || safeParse(data.lmrc) > (designSuggestions?.limits?.gh_lmrc?.max || 999) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.limits?.gh_lmrc?.min?.toFixed(1) || "---"} - {designSuggestions?.limits?.gh_lmrc?.max?.toFixed(1) || "---"}]
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-600 block">{labels.l2}</Label>
            <Input 
              value={activeTab === "I" ? data.lmdt : activeTab === "II" ? (data as any).lmrt : (data as any).lmkn} 
              onChange={(e) => handleInputChange(activeTab === "I" ? "lmdt" : activeTab === "II" ? "lmrt" : "lmkn", e.target.value)}
              onBlur={(e) => handleBlur(activeTab === "I" ? "lmdt" : activeTab === "II" ? "lmrt" : "lmkn", e.target.value)}
              className={`h-11 font-bold text-gray-700 ${
                activeTab === "I"
                  ? (designSuggestions?.limits?.gh_lmdt && (safeParse(data.lmdt) < designSuggestions.limits.gh_lmdt.min || safeParse(data.lmdt) > designSuggestions.limits.gh_lmdt.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200")
                  : activeTab === "II"
                  ? (designSuggestions?.limits?.gh_lmrt && (safeParse((data as any).lmrt) < designSuggestions.limits.gh_lmrt.min || safeParse((data as any).lmrt) > designSuggestions.limits.gh_lmrt.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200")
                  : (designSuggestions?.limits?.gh_lmkn && (safeParse((data as any).lmkn) < designSuggestions.limits.gh_lmkn.min || safeParse((data as any).lmkn) > designSuggestions.limits.gh_lmkn.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200")
              }`}
            />
            {activeTab === "I" ? (
              <p className={`text-[10px] italic font-medium ${safeParse(data.lmdt) < (designSuggestions?.limits?.gh_lmdt?.min || 0) || safeParse(data.lmdt) > (designSuggestions?.limits?.gh_lmdt?.max || 999) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.limits?.gh_lmdt?.min?.toFixed(1) || "---"} - {designSuggestions?.limits?.gh_lmdt?.max?.toFixed(1) || "---"}]
              </p>
            ) : activeTab === "II" ? (
              <p className={`text-[10px] italic font-medium ${safeParse((data as any).lmrt) < (designSuggestions?.limits?.gh_lmrt?.min || 0) || safeParse((data as any).lmrt) > (designSuggestions?.limits?.gh_lmrt?.max || 999) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.limits?.gh_lmrt?.min?.toFixed(1) || "---"} - {designSuggestions?.limits?.gh_lmrt?.max?.toFixed(1) || "---"}]
              </p>
            ) : (
              <p className={`text-[10px] italic font-medium ${safeParse((data as any).lmkn) < (designSuggestions?.limits?.gh_lmkn?.min || 0) || safeParse((data as any).lmkn) > (designSuggestions?.limits?.gh_lmkn?.max || 999) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.limits?.gh_lmkn?.min?.toFixed(1) || "---"} - {designSuggestions?.limits?.gh_lmkn?.max || "---"}]
              </p>
            )}
          </div>

          {activeTab === "I" && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-600 block">{labels.extra}</Label>
              <Input 
                value={(data as any).l11} 
                onChange={(e) => handleInputChange("l11", e.target.value)}
                onBlur={(e) => handleBlur("l11", e.target.value)}
                className={`h-11 font-bold text-gray-700 ${
                  designSuggestions?.l11_limit && (safeParse((data as any).l11) < designSuggestions.l11_limit.min || safeParse((data as any).l11) > designSuggestions.l11_limit.max) ? "bg-red-50 border-red-500 ring-2 ring-red-100 text-red-600" : "bg-slate-50 border-slate-200"
                }`}
              />
              <p className={`text-[10px] italic font-medium ${designSuggestions?.l11_limit && (safeParse((data as any).l11) < designSuggestions.l11_limit.min || safeParse((data as any).l11) > designSuggestions.l11_limit.max) ? "text-red-500 font-bold" : "text-slate-400"}`}>
                Gợi ý: [{designSuggestions?.l11_limit?.min || "75"} - {designSuggestions?.l11_limit?.max || "90"}]
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
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
          <p className="text-slate-500 font-medium italic text-sm">Đang tính toán kiểm nghiệm trục...</p>
        </div>
      ) : error ? (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <div className="space-y-1">
             <p className="text-amber-700 font-bold">Yêu cầu điều chỉnh thiết kế</p>
             <p className="text-amber-600 text-xs">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Phản lực liên kết</h3>
                   <p className="text-xs text-gray-500 italic">Giá trị phản lực tại các gối đỡ ổ lăn</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {shaftResults?.reactions ? Object.entries(shaftResults.reactions).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-500">{key}</span>
                        <span className="text-sm font-black text-blue-600">{(Number(val) || 0).toLocaleString()} N</span>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 text-slate-400 italic text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <Ruler className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        Chọn d và cấu hình chiều dài để xem phản lực
                      </div>
                    )}
                </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-2">
                   <h3 className="text-xl font-bold text-gray-900">Kiểm nghiệm tổng thể</h3>
                </div>
                <p className="text-xs text-gray-500 italic">Đánh giá khả năng chịu tải và độ bền</p>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                       <div>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Hệ số an toàn</p>
                          <span className="text-lg font-black text-emerald-800">s = {mainSafety}</span>
                       </div>
                       <span className="text-xs px-4 py-1.5 bg-emerald-600 text-white rounded-full font-black shadow-sm">ĐẠT</span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-blue-50 rounded-2xl border border-blue-100">
                       <div>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Kiểm nghiệm quá tải</p>
                          <span className="text-lg font-black text-blue-800">{shaftResults?.overload?.gtd || "---"} MPa</span>
                       </div>
                       <div className="text-right text-[10px] text-blue-500 font-bold italic">σ_td</div>
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Đường kính trục chính thức</h3>
              <p className="text-xs text-gray-500 italic">Dựa trên lựa chọn thiết kế của người dùng và momen tương đương</p>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
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
          </div>
        </div>
      )}
    </div>
  );
}
