import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Step4GearboxProps {
  formData: any;
  step2Data: any;
}

export default function Step4Gearbox({ formData, step2Data }: Step4GearboxProps) {
  const [activeTab, setActiveTab] = useState("bevel"); // bevel: bánh răng côn, spur: bánh răng trụ

  // Dữ liệu hardcode mẫu - sẵn sàng để mapping API sau này
  const gearData = {
    bevel: {
      material: 'Thép C40XH',
      m_te_calc: '2.87',
      m_te_std: '3',
      z1: '27',
      z2: '85',
      u: '3.15',
      de1: '81 mm',
      de2: '255 mm',
      b: '38 mm',
      delta1: '17.62°',
      delta2: '72.38°',
      ft: '2414.4 N',
      fr: '837.5 N',
      fa: '266.0 N'
    },
    spur: {
      material: 'Thép 45',
      m_calc: '2.0',
      m_std: '2.0',
      z1: '20',
      z2: '80',
      u: '4.0',
      d1: '40 mm',
      d2: '160 mm',
      b: '45 mm',
      ft: '1500 N',
      fr: '500 N',
      fa: '0 N'
    }
  };

  const currentGear = activeTab === 'bevel' ? gearData.bevel : gearData.spur;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Tab Switcher - Kiểu nút gạt */}
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
        
        {/* Cột trái: Thông số chính theo từng loại */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Thông số bánh răng {activeTab === 'bevel' ? 'côn' : 'trụ'}</h3>
              <p className="text-xs text-gray-500 italic">Thông số thiết kế chuyên sâu</p>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Vật liệu</Label>
                <Select defaultValue={currentGear.material}>
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
                <Input value={activeTab === 'bevel' ? currentGear.m_te_calc : currentGear.m_calc} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">
                   Module {activeTab === 'bevel' ? 'vòng chia ngoài' : ''} tiêu chuẩn
                </Label>
                <Select defaultValue={activeTab === 'bevel' ? currentGear.m_te_std : currentGear.m_std}>
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
                  <Input defaultValue={currentGear.z1} className="h-11 border-slate-200 font-bold" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600 block mb-2">Số răng z2</Label>
                  <Input defaultValue={currentGear.z2} className="h-11 border-slate-200 font-bold" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Tỉ số truyền (u)</Label>
                <Input value={currentGear.u} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
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
                <Input value={activeTab === 'bevel' ? currentGear.de1 : currentGear.d1} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Đường kính chia bánh lớn ({activeTab === 'bevel' ? 'de2' : 'd2'})</Label>
                <Input value={activeTab === 'bevel' ? currentGear.de2 : currentGear.d2} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Bề rộng vành răng (b)</Label>
                <Input value={currentGear.b} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div>
              
              {activeTab === 'bevel' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 block mb-2">Góc côn bánh nhỏ (δ1)</Label>
                    <Input value={currentGear.delta1} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 block mb-2">Góc côn bánh lớn (δ2)</Label>
                    <Input value={currentGear.delta2} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold" />
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
                <Input value={currentGear.ft} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Lực hướng tâm Fr</Label>
                <Input value={currentGear.fr} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-600 block mb-2">Lực dọc trục Fa</Label>
                <Input value={currentGear.fa} readOnly className="h-11 bg-slate-50 border-slate-200 font-bold text-blue-600" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
