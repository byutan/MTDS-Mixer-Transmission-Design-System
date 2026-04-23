import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import demoData from '../../../../../../demodata.json';

export interface FormData {
  projectName: string;
  major: string;
  studentId: string;
  studentName: string;
  instructor: string;
  createdDate: string;
  power: string;
  speed: string;
  lifespan: string;
  type: string;
  loadCharacter: string;
  workMode: string;
  workDaysYear: string;
  workHoursDay: string;
  loadMode: string;
}

export interface Step2Data {
  systemEfficiency: string;
  motorEfficiency: string;
  requiredPower: string;
  preliminarySpeed: string;
  totalRatio: string;
  beltRatio: string;
  gearboxRatio: string;
  u1: string;
  u2: string;
  cosPhi: string;
  tMaxTdm: string;
  tKdTdm: string;
  motor: string;
}

interface DesignContextType {
  user: any;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateFormData: (field: keyof FormData, value: string) => void;
  step2Data: Step2Data;
  setStep2Data: React.Dispatch<React.SetStateAction<Step2Data>>;
  tableData: any[];
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  loadSampleData: () => void;
  clearProjectData: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  
  // Khôi phục dữ liệu từ localStorage nếu có
  const getInitialFormData = (): FormData => {
    const saved = localStorage.getItem('mtds_project_form');
    return saved ? JSON.parse(saved) : {
      projectName: '',
      major: '',
      studentId: '',
      studentName: '',
      instructor: '',
      createdDate: new Date().toISOString().split('T')[0],
      power: '',
      speed: '',
      lifespan: '',
      type: 'Quay 1 chiều',
      loadCharacter: 'Tải va đập nhẹ',
      workMode: '2 ca',
      workDaysYear: '360',
      workHoursDay: '8',
      loadMode: 'Thay đổi theo bậc',
    };
  };

  const getInitialStep2Data = (): Step2Data => {
    const saved = localStorage.getItem('mtds_project_step2');
    return saved ? JSON.parse(saved) : {
      systemEfficiency: '0',
      motorEfficiency: '---',
      requiredPower: '0',
      preliminarySpeed: '0',
      totalRatio: '---',
      beltRatio: '---',
      gearboxRatio: '---',
      u1: '---',
      u2: '---',
      cosPhi: '---',
      tMaxTdm: '---',
      tKdTdm: '---',
      motor: 'Chưa chọn động cơ',
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [step2Data, setStep2Data] = useState<Step2Data>(getInitialStep2Data);
  const [tableData, setTableData] = useState<any[]>(() => {
    const saved = localStorage.getItem('mtds_project_table');
    return saved ? JSON.parse(saved) : [];
  });

  // Tự động lưu khi có thay đổi
  useEffect(() => {
    localStorage.setItem('mtds_project_form', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('mtds_project_step2', JSON.stringify(step2Data));
  }, [step2Data]);

  useEffect(() => {
    localStorage.setItem('mtds_project_table', JSON.stringify(tableData));
  }, [tableData]);

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadSampleData = () => {
    setFormData({
      ...formData,
      projectName: 'Hệ thống dẫn động thùng trộn',
      major: 'Cơ Kỹ Thuật',
      studentId: '2013253',
      studentName: 'Nguyễn Văn Học',
      instructor: 'TS. Nguyễn Duy Khương',
      power: demoData.duLieuDauVao.thungTron.congSuat.toString(),
      speed: demoData.duLieuDauVao.thungTron.soVongQuay.toString(),
      lifespan: demoData.duLieuDauVao.thungTron.thoiGianPhucVu.toString(),
    });
  };

  const clearProjectData = () => {
    localStorage.removeItem('mtds_project_form');
    localStorage.removeItem('mtds_project_step2');
    localStorage.removeItem('mtds_project_table');
    window.location.reload();
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DesignContext.Provider value={{
      user, formData, setFormData, updateFormData, 
      step2Data, setStep2Data, 
      tableData, setTableData,
      loadSampleData, clearProjectData
    }}>
      {children}
    </DesignContext.Provider>
  );
};

const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) throw new Error('useDesign must be used within DesignProvider');
  return context;
};

export { DesignProvider, useDesign };
