import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

// --- KHU VỰC MOCK DATA (Dễ dàng xóa khi có API) ---
const SHAFT_MOCK_DATA = {
  shaft1: {
    material: { name: "Thép C45", hb: "220", sigma_b: "750 MPa", sigma_ch: "450 MPa" },
    loads: { t: "83,852 N.mm", fr_belt: "965 N", ft_gear: "2,414 N", fr_gear: "837 N", fa_gear: "266 N" },
    preliminary: { d_approx: "27.57 mm", d_chosen: "35 mm", l1: "70 mm", l2: "95 mm", l3: "155 mm" },
    strength: { m_td_max: "190,468 N.mm", sigma_td: "47.54 MPa", s_safety: "4.58", status: "Thỏa mãn điều kiện bền" },
    standard: { d_std: "35 mm", key_b: "8 mm", key_h: "7 mm", key_lt: "45 mm" }
  },
  shaft2: {
    material: { name: "Thép C45", hb: "220", sigma_b: "750 MPa", sigma_ch: "450 MPa" },
    loads: { t: "258,410 N.mm", fr_belt: "0 N", ft_gear: "5,640 N", fr_gear: "2,050 N", fa_gear: "850 N" },
    preliminary: { d_approx: "38.2 mm", d_chosen: "45 mm", l1: "85 mm", l2: "110 mm", l3: "165 mm" },
    strength: { m_td_max: "420,500 N.mm", sigma_td: "52.1 MPa", s_safety: "3.8", status: "Thỏa mãn điều kiện bền" },
    standard: { d_std: "45 mm", key_b: "12 mm", key_h: "8 mm", key_lt: "55 mm" }
  },
  shaft3: {
    material: { name: "Thép C45", hb: "220", sigma_b: "750 MPa", sigma_ch: "450 MPa" },
    loads: { t: "785,200 N.mm", fr_belt: "0 N", ft_gear: "12,400 N", fr_gear: "4,500 N", fa_gear: "1,200 N" },
    preliminary: { d_approx: "55.4 mm", d_chosen: "60 mm", l1: "100 mm", l2: "140 mm", l3: "190 mm" },
    strength: { m_td_max: "950,800 N.mm", sigma_td: "58.4 MPa", s_safety: "3.2", status: "Thỏa mãn điều kiện bền" },
    standard: { d_std: "60 mm", key_b: "18 mm", key_h: "11 mm", key_lt: "70 mm" }
  }
};

export default function Step5Shaft() {
  const [activeTab, setActiveTab] = useState<keyof typeof SHAFT_MOCK_DATA>("shaft1");
  const data = SHAFT_MOCK_DATA[activeTab];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full max-w-md border border-slate-200">
          {["shaft1", "shaft2", "shaft3"].map((id) => (
            <button 
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {id === "shaft1" ? "Trục I" : id === "shaft2" ? "Trục II" : "Trục III"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1: Thông số cơ bản & Vật liệu */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Thông số tải trọng</h3>
              <p className="text-xs text-slate-500 mt-1">Vật liệu và các lực tác dụng</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Vật liệu trục</Label>
                <Input readOnly value={data.material.name} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Moment xoắn truyền (T)</Label>
                <Input readOnly value={data.loads.t} className="bg-slate-50/50 border-slate-200 text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Lực vòng (Ft)</Label>
                <Input readOnly value={data.loads.ft_gear} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Lực hướng tâm (Fr)</Label>
                <Input readOnly value={data.loads.fr_gear} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
            </div>

            <div className="pt-2">
               <div className="bg-blue-50/50 text-blue-700 p-4 rounded-xl border border-blue-100 flex items-center gap-3 text-[13px] font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  Độ rắn vật liệu: {data.material.hb} HB
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột 2: Thiết kế & Kích thước gối đỡ */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Kết cấu hình học</h3>
              <p className="text-xs text-slate-500 mt-1">Khoảng cách trục và gối đỡ</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Đường kính sơ bộ (d_sb)</Label>
                <Input readOnly value={data.preliminary.d_chosen} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Khoảng cách gối đỡ (l1)</Label>
                <Input readOnly value={data.preliminary.l1} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Khoảng cách gối đỡ (l2)</Label>
                <Input readOnly value={data.preliminary.l2} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Khoảng cách gối đỡ (l3)</Label>
                <Input readOnly value={data.preliminary.l3} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột 3: Kiểm nghiệm & Then */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Kiểm nghiệm & Then</h3>
              <p className="text-xs text-slate-500 mt-1">Độ bền mỏi và lắp ghép then</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Moment tương đương Max</Label>
                <Input readOnly value={data.strength.m_td_max} className="bg-slate-50/50 border-slate-200 text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Hệ số an toàn mỏi (s)</Label>
                <Input readOnly value={data.strength.s_safety} className="bg-slate-50/50 border-slate-200 text-blue-600 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Chiều dài then (lt)</Label>
                <Input readOnly value={data.standard.key_lt} className="bg-slate-50/50 border-slate-200 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Đường kính trục tiêu chuẩn</Label>
                <Input readOnly value={data.standard.d_std} className="bg-blue-50/30 border-blue-100 text-blue-700 font-black text-lg shadow-sm" />
              </div>
            </div>

            <div className="pt-2">
               <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center justify-center gap-3 text-[13px] font-bold shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  {data.strength.status}
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
