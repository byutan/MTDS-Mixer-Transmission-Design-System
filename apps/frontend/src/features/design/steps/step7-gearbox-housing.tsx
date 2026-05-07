import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Cog } from "lucide-react";

// --- MOCK DATA (Trích xuất từ vohopgiamtoc.txt) ---
const HOUSING_DATA = {
  material: "Gang xám GX15-12",
  thickness: { delta: "10 mm", delta1: "9 mm", e: "10 mm", h: "50 mm" },
  bolts: { d1: "20 mm", d2: "16 mm", d3: "14 mm", d4: "12 mm", d5: "10 mm" },
  bearingSeats: [
    { label: "Trục I", d2: "120 mm", d3: "150 mm" },
    { label: "Trục II", d2: "100 mm", d3: "125 mm" },
    { label: "Trục III", d2: "160 mm", d3: "190 mm" }
  ],
  flanges: { s3: "24 mm", s4: "22 mm", k3: "45 mm" },
  base: { s1: "28 mm", k1: "60 mm", q: "80 mm", z: "6 bu lông" },
  clearances: { delta: "10 mm", delta1: "40 mm", delta2: "10 mm" }
};

export default function Step7GearboxHousing() {
  const data = HOUSING_DATA;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Block 1: Thành hộp & Gân tăng cứng */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Thành hộp & Gân tăng cứng</h3>
              <p className="text-xs text-slate-500 mt-1">Độ dày và kích thước cấu tạo vỏ</p>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Chiều dày thân (δ)</Label>
                <Input readOnly value={data.thickness.delta} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Chiều dày nắp (δ1)</Label>
                <Input readOnly value={data.thickness.delta1} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Dày gân tăng cứng (e)</Label>
                <Input readOnly value={data.thickness.e} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Chiều cao gân (h)</Label>
                <Input readOnly value={data.thickness.h} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
            </div>

            <div className="pt-2">
               <div className="bg-blue-50/50 text-blue-700 p-4 rounded-xl border border-blue-100 flex items-center gap-3 text-[13px] font-medium">
                  <Cog className="w-4 h-4" />
                  Vật liệu đúc: {data.material}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Block 2: Hệ thống Bulông & Vít */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Hệ thống Bulông & Vít</h3>
              <p className="text-xs text-slate-500 mt-1">Đường kính các loại bulông liên kết</p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Bulông nền (d1)</Label>
                <Input readOnly value={data.bolts.d1} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Bulông cạnh ổ (d2)</Label>
                <Input readOnly value={data.bolts.d2} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Vít ghép mặt bích (d3)</Label>
                <Input readOnly value={data.bolts.d3} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Vít nắp ổ (d4)</Label>
                <Input readOnly value={data.bolts.d4} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-[12px] font-semibold text-slate-600 ml-1">Vít nắp cửa thăm (d5)</Label>
                <Input readOnly value={data.bolts.d5} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block 3: Kích thước gối trục */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Kích thước gối trục</h3>
              <p className="text-xs text-slate-500 mt-1">Đường kính ngoài và tâm lỗ vít</p>
            </div>

            <div className="space-y-4">
              {data.bearingSeats.map((seat, index) => (
                <div key={index} className="grid grid-cols-3 gap-3 items-end p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[13px] font-bold text-slate-700 pb-2">{seat.label}</div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400 uppercase font-bold">D2</Label>
                    <div className="text-sm font-bold text-gray-700">{seat.d2}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400 uppercase font-bold">D3</Label>
                    <div className="text-sm font-bold text-gray-700">{seat.d3}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Block 4: Mặt bích, Đế & Khe hở */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 space-y-7 px-7">
            <div className="pl-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Mặt bích, Đế & Khe hở</h3>
              <p className="text-xs text-slate-500 mt-1">Thông số ghép nối và khoảng cách an toàn</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div className="space-y-4">
                 <Label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Mặt bích & Đế</Label>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Dày đế (S1):</span>
                      <span className="font-bold text-slate-700">{data.base.s1}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Dày bích thân (S3):</span>
                      <span className="font-bold text-slate-700">{data.flanges.s3}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Số bulông nền:</span>
                      <span className="font-bold text-gray-700">{data.base.z}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Khe hở an toàn</Label>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-slate-100 pb-1">
                      <span className="text-slate-500">B.Răng - Thành (Δ):</span>
                      <span className="font-bold text-slate-700">{data.clearances.delta}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-100 pb-1">
                      <span className="text-slate-500">B.Răng - Đáy (Δ1):</span>
                      <span className="font-bold text-slate-700">{data.clearances.delta1}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Giữa các B.Răng:</span>
                      <span className="font-bold text-slate-700">{data.clearances.delta2}</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-2">
               <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center justify-center gap-3 text-[13px] font-bold shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Kết cấu vỏ hộp thỏa mãn điều kiện bền & cứng
               </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
