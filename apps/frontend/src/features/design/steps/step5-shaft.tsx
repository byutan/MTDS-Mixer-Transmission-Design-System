import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDesign } from '@/features/design/context/DesignContext'

export default function Step5Shaft() {
  const { formData, step2Data } = useDesign();
  const [activeTab, setActiveTab] = useState("shaft1"); // shaft1, shaft2, shaft3

  const shafts = [
    { id: 'shaft1', label: 'Trục I' },
    { id: 'shaft2', label: 'Trục II' },
    { id: 'shaft3', label: 'Trục III' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200 p-1 rounded-lg flex items-center w-full max-w-md shadow-inner">
          {shafts.map((shaft) => (
            <button 
              key={shaft.id}
              onClick={() => setActiveTab(shaft.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${activeTab === shaft.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {shaft.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <span className="text-4xl font-black text-slate-200">5</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Chi tiết Trục</h3>
        <p className="text-slate-500 font-medium italic">Vui lòng chờ thông số tính toán từ Backend...</p>
      </div>
    </div>
  )
}
