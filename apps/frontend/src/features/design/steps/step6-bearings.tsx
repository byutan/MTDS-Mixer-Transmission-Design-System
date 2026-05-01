import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

// --- KHU VỰC MOCK DATA (Trích xuất từ o_lan_1.txt) ---
const BEARING_MOCK_DATA = {
  shaft1: {
    selection: { type: "Ổ đũa côn 7507", d: "35 mm", D: "72 mm", T: "24.25 mm", C: "50.2 kN", C0: "40.3 kN" },
    loads: { fr_a: "4,631.93 N", fa_a: "266.01 N", fr_b: "2,748.03 N", fa_b: "0 N", life_h: "12,000 h", life_mil: "2,104 triệu vòng" },
    verification: { q1: "4.63 kN", q2: "2.75 kN", cd_a: "45.99 kN", cd_b: "27.29 kN", status: "Thỏa mãn điều kiện tải động" }
  },
  shaft2: {
    selection: { type: "Ổ đũa côn 7509", d: "45 mm", D: "85 mm", T: "24.75 mm", C: "62.5 kN", C0: "52.1 kN" },
    loads: { fr_a: "6,240.50 N", fa_a: "850.00 N", fr_b: "4,120.30 N", fa_b: "0 N", life_h: "12,000 h", life_mil: "2,104 triệu vòng" },
    verification: { q1: "6.85 kN", q2: "4.12 kN", cd_a: "58.40 kN", cd_b: "35.10 kN", status: "Thỏa mãn điều kiện tải động" }
  },
  shaft3: {
    selection: { type: "Ổ đũa côn 7512", d: "60 mm", D: "110 mm", T: "29.75 mm", C: "98.2 kN", C0: "85.4 kN" },
    loads: { fr_a: "12,450.20 N", fa_a: "1,200.00 N", fr_b: "8,950.40 N", fa_b: "0 N", life_h: "12,000 h", life_mil: "2,104 triệu vòng" },
    verification: { q1: "13.20 kN", q2: "8.95 kN", cd_a: "89.50 kN", cd_b: "62.40 kN", status: "Thỏa mãn điều kiện tải động" }
  }
};

export default function Step6Bearings() {
  const [activeTab, setActiveTab] = useState<keyof typeof BEARING_MOCK_DATA>("shaft1");
  const data = BEARING_MOCK_DATA[activeTab];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Tab Switcher - Thiết kế tinh tế, tối giản */}
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
              {id === "shaft1" ? "Ổ Trục I" : id === "shaft2" ? "Ổ Trục II" : "Ổ Trục III"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1: Thông số chọn ổ */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Thông số chọn ổ</h3>
              <p className="text-xs text-slate-500 mt-1">Loại ổ và kích thước cơ bản</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Ký hiệu ổ lăn</Label>
                <Input readOnly value={data.selection.type} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Đường kính ngoài (D)</Label>
                <Input readOnly value={data.selection.D} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Khả năng tải động (C)</Label>
                <Input readOnly value={data.selection.C} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Khả năng tải tĩnh (C0)</Label>
                <Input readOnly value={data.selection.C0} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột 2: Tải trọng & Tuổi thọ */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Tải trọng & Tuổi thọ</h3>
              <p className="text-xs text-slate-500 mt-1">Phản lực và thời gian làm việc</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Lực hướng tâm FrA</Label>
                <Input readOnly value={data.loads.fr_a} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Lực hướng tâm FrB</Label>
                <Input readOnly value={data.loads.fr_b} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Tuổi thọ yêu cầu (Lh)</Label>
                <Input readOnly value={data.loads.life_h} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Tuổi thọ (triệu vòng L)</Label>
                <Input readOnly value={data.loads.life_mil} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột 3: Kiểm nghiệm khả năng tải */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Kiểm nghiệm khả năng tải</h3>
              <p className="text-xs text-slate-500 mt-1">So sánh Cd với C cơ bản</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Tải trọng quy ước (Q1)</Label>
                <Input readOnly value={data.verification.q1} className="bg-slate-50/50 border-slate-200 h-10 text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Tải động tính toán (Cd_A)</Label>
                <Input readOnly value={data.verification.cd_a} className="bg-slate-50/50 border-slate-200 h-10 text-blue-600 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Tải động tính toán (Cd_B)</Label>
                <Input readOnly value={data.verification.cd_b} className="bg-slate-50/50 border-slate-200 h-10 text-blue-600 font-bold" />
              </div>
            </div>

            <div className="pt-2">
               <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center justify-center gap-3 text-[13px] font-bold shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  {data.verification.status}
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
