import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { useDesign } from "@/features/design/context/DesignContext";
import demoData from "../../../../../../demodata.json";

export default function Step7GearboxHousing() {
  const { formData, step2Data } = useDesign();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchHousingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          duLieuDauVao: {
            thungTron: {
              congSuat: parseFloat(formData.power) || 0,
              soVongQuay: parseFloat(formData.speed) || 0,
              thoiGianPhucVu: parseFloat(formData.lifespan) || 20000
            },
            heThongTruyenDong: {
              oLan: demoData.duLieuDauVao.heThongTruyenDong.oLan,
              noiTrucVongDanHoi: demoData.duLieuDauVao.heThongTruyenDong.noiTrucVongDanHoi,
              dongCo: {
                congSuat: parseFloat(step2Data.motor.match(/\((.*?) kW/)?.[1] || "0"),
                vanTocQuay: parseFloat(step2Data.motor.match(/, (.*?) v\/ph/)?.[1] || "0")
              },
              hopGiamToc: {
                ...demoData.duLieuDauVao.heThongTruyenDong.hopGiamToc,
                tySoTruyenSoBo: parseFloat(step2Data.gearboxRatio) || 1
              },
              boTruyenDai: {
                ...demoData.duLieuDauVao.heThongTruyenDong.boTruyenDai,
                tySoTruyenSoBo: parseFloat(step2Data.beltRatio) || 1
              }
            }
          }
        };

        const res = await fetch('http://localhost:3001/api/he-thong-truyen-dong/thiet-ke-vo-hop-giam-toc', {
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

    fetchHousingData();
  }, [formData, step2Data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium font-sans">Đang tính toán kết cấu vỏ hộp...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-700 font-bold mb-2 font-sans">Lỗi tính toán</p>
        <p className="text-red-500 text-sm font-sans">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Block 1: Thành hộp & Gân tăng cứng */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
          <CardContent className="pt-4 space-y-6">
            <div className="pl-1">
              <h3 className="text-xl font-bold text-gray-900 leading-tight font-sans">Thành hộp & Gân tăng cứng</h3>
              <p className="text-sm text-gray-600 mt-1 font-sans">Độ dày cấu tạo vỏ (tính theo a_w = {results?.chieuDay?.khoangCachTruc_a} mm)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều dày thân hộp (δ)</Label>
                <Input readOnly value={`${results?.chieuDay?.thanHop} mm`} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều dày nắp hộp (δ1)</Label>
                <Input readOnly value={`${results?.chieuDay?.napHop} mm`} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều dày gân tăng cứng (e)</Label>
                <Input readOnly value={`${results?.ganTangCung?.chieuDay_e} mm`} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều cao gân (h)</Label>
                <Input readOnly value={`<= ${results?.ganTangCung?.chieuCao_h} mm`} className="bg-slate-50 border-slate-200 text-gray-700 font-bold" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block 2: Hệ thống Bulông & Vít */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
          <CardContent className="pt-4 space-y-6">
            <div className="pl-1">
              <h3 className="text-xl font-bold text-gray-900 leading-tight font-sans">Hệ thống Bulông & Vít</h3>
              <p className="text-sm text-gray-600 mt-1 font-sans">Đường kính bu lông và vít liên kết (chọn tiêu chuẩn)</p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bu lông nền (d1)</Label>
                <Input readOnly value={`${results?.duongKinh?.boltNen} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bu lông cạnh ổ (d2)</Label>
                <Input readOnly value={`M${results?.duongKinh?.boltCanh} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Vít bích thân và nắp (d3)</Label>
                <Input readOnly value={`M${results?.duongKinh?.boltGhepMatBichVaThan} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Vít ghép nắp ổ (d4)</Label>
                <Input readOnly value={`M${results?.duongKinh?.vitGhepNapO} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Vít nắp cửa thăm (d5)</Label>
                <Input readOnly value={`M${results?.duongKinh?.vitGhepNapCuaTham} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block 3: Mặt bích, Đế & Khe hở */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white lg:col-span-2">
          <CardContent className="pt-4 space-y-6">
            <div className="pl-1">
              <h3 className="text-xl font-bold text-gray-900 leading-tight font-sans">Thông số lắp ghép & Khe hở</h3>
              <p className="text-sm text-gray-600 mt-1 font-sans">Kích thước cấu tạo và khoảng cách an toàn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cột 1: Mặt bích & Đế */}
              <div className="space-y-4">
                 <Label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Mặt bích & Đế</Label>
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều dày đế hộp (S1)</Label>
                      <Input readOnly value={`${Number(results?.matDeHop?.chieuDay_S1 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bề rộng mặt đế (K1)</Label>
                      <Input readOnly value={`${Number(results?.matDeHop?.beRong_K1 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Chiều dày bích thân (S3)</Label>
                      <Input readOnly value={`${Number(results?.matBichGhepNapVaThan?.chieuDayBichThan_S3 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bề rộng mặt bích (K3)</Label>
                      <Input readOnly value={`${Number(results?.matBichGhepNapVaThan?.beRongBich_K3 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                 </div>
              </div>

              {/* Cột 2: Thông số lắp ghép */}
              <div className="space-y-4">
                 <Label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Thông số cấu tạo</Label>
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bề rộng (q)</Label>
                      <Input readOnly value={`${Number(results?.matDeHop?.beRong_q || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Tâm lỗ bu lông (E2)</Label>
                      <Input readOnly value={`${Number(results?.kichThuocGoiTruc?.thongSoChung?.tamLoBolts_E2 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Khoảng cách (R2)</Label>
                      <Input readOnly value={`${Number(results?.kichThuocGoiTruc?.thongSoChung?.tamLoBolts_R2 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bề rộng gối trục (K2)</Label>
                      <Input readOnly value={`${Number(results?.kichThuocGoiTruc?.thongSoChung?.beRongMatLapGhep_K2 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Tâm bu lông đến mép (k)</Label>
                      <Input readOnly value={`${results?.kichThuocGoiTruc?.thongSoChung?.khoangCachTuTamDenMep_k} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                 </div>
              </div>

              {/* Cột 3: Khe hở an toàn */}
              <div className="space-y-4">
                 <Label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Khe hở an toàn</Label>
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Bánh răng - Thành hộp (Δ)</Label>
                      <Input readOnly value={`${Number(results?.kheHoAnToan?.banhRangVaThanhHop_Delta || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Đỉnh răng - Đáy hộp (Δ1)</Label>
                      <Input readOnly value={`${Number(results?.kheHoAnToan?.dinhBanhRangVaDayHop_Delta1 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 block mb-1 font-sans">Giữa các chi tiết quay (Δ2)</Label>
                      <Input readOnly value={`${Number(results?.kheHoAnToan?.cacChiTietQuay_Delta2 || 0).toFixed(1)} mm`} className="bg-slate-50 border-slate-200 h-10 text-gray-700 font-bold" />
                    </div>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
