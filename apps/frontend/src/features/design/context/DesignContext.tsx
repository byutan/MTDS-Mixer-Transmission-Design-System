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

export interface Step5Data {
  trucI: { d1: string; lmrc: string; lmdt: string; l11: string };
  trucII: { d2: string; lmrc: string; lmrt: string };
  trucIII: { d3: string; lmrt: string; lmkn: string };
}

interface DesignContextType {
  user: any;
  projectId: number | null;
  setProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateFormData: (field: keyof FormData, value: string) => void;
  step2Data: Step2Data;
  setStep2Data: React.Dispatch<React.SetStateAction<Step2Data>>;
  step5Data: Step5Data;
  setStep5Data: React.Dispatch<React.SetStateAction<Step5Data>>;
  tableData: any[];
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  loadSampleData: () => void;
  clearProjectData: (shouldReload?: boolean) => void;
  saveProject: (currentStep: number) => Promise<void>;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [projectId, setProjectId] = useState<number | null>(() => {
    const saved = localStorage.getItem('mtds_project_id');
    return saved ? parseInt(saved) : null;
  });

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

  const getInitialStep5Data = (): Step5Data => {
    const saved = localStorage.getItem('mtds_project_step5');
    return saved ? JSON.parse(saved) : {
      trucI: { d1: '30', lmrc: '42', lmdt: '45', l11: '90' },
      trucII: { d2: '40', lmrc: '50', lmrt: '60' },
      trucIII: { d3: '50', lmrt: '65', lmkn: '80' }
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [step2Data, setStep2Data] = useState<Step2Data>({ ...getInitialStep2Data(), motorEfficiency: '---' });
  const [step5Data, setStep5Data] = useState<Step5Data>(getInitialStep5Data);
  const [tableData, setTableData] = useState<any[]>(() => {
    const saved = localStorage.getItem('mtds_project_table');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mtds_project_form', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('mtds_project_step2', JSON.stringify(step2Data));
  }, [step2Data]);

  useEffect(() => {
    localStorage.setItem('mtds_project_step5', JSON.stringify(step5Data));
  }, [step5Data]);

  useEffect(() => {
    localStorage.setItem('mtds_project_table', JSON.stringify(tableData));
  }, [tableData]);

  useEffect(() => {
    if (projectId) localStorage.setItem('mtds_project_id', projectId.toString());
    else localStorage.removeItem('mtds_project_id');
  }, [projectId]);

  useEffect(() => {
    const savedUser = localStorage.getItem('mtds_user');
    if (savedUser) {
      const decoded = JSON.parse(savedUser);
      setUser(decoded);
      // Đồng bộ MSSV vào form nếu chưa có
      if (!formData.studentId) {
        setFormData(prev => ({ ...prev, studentId: decoded.student_id, studentName: decoded.fullname }));
      }
    }
  }, []);

  const saveProject = async (currentStep: number) => {
    // Không lưu nếu thiếu thông tin tối thiểu hoặc chưa đăng nhập
    if (!user) {
      console.warn("Save skipped: User not logged in");
      return;
    }
    
    if (!formData.projectName || !formData.power) {
      console.warn("Save skipped: Project Name or Power is missing");
      return;
    }

    // Chuyển đổi an toàn, tránh NaN
    const payload = {
      student_id: user.student_id,
      project_name: formData.projectName,
      major: formData.major || 'Cơ Kỹ Thuật',
      instructor: formData.instructor || '',
      power_kw: parseFloat(formData.power) || 0,
      speed_rpm: parseFloat(formData.speed) || 0,
      lifespan_hours: parseInt(formData.lifespan) || 0,
      rotation_type: formData.type,
      load_character: formData.loadCharacter,
      work_mode: formData.workMode,
      work_days_per_year: parseInt(formData.workDaysYear) || 360,
      work_hours_per_day: parseInt(formData.workHoursDay) || 8,
      load_mode: formData.loadMode,
      current_step: currentStep,
      // Step 2 data - Chuyển sang số và tránh NaN
      efficiency_sigma: parseFloat(step2Data.systemEfficiency) || 0,
      required_power_pk: parseFloat(step2Data.requiredPower) || 0,
      preliminary_speed_nsb: parseFloat(step2Data.preliminarySpeed) || 0,
      total_ratio_ut: parseFloat(step2Data.totalRatio) || 0,
      belt_ratio_ud: parseFloat(step2Data.beltRatio) || 0,
      gearbox_ratio_uh: parseFloat(step2Data.gearboxRatio) || 0,
      u1: parseFloat(step2Data.u1) || 0,
      u2: parseFloat(step2Data.u2) || 0,
      motor_code: step2Data.motor,
      motor_cos_phi: parseFloat(step2Data.cosPhi) || 0,
      motor_t_max_tdm: parseFloat(step2Data.tMaxTdm) || 0,
      motor_t_kd_tdm: parseFloat(step2Data.tKdTdm) || 0
    };

    console.log("Saving project payload:", payload);

    try {
      let url = 'http://localhost:3001/api/projects';
      let method = 'POST';

      if (projectId) {
        url = `http://localhost:3001/api/projects/${projectId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      console.log("Save result:", result);
      
      if (result.success && !projectId) {
        setProjectId(result.data.project_id);
      }
    } catch (error) {
      console.error("Save failed due to network error:", error);
    }
  };

  const loadSampleData = () => {
    setFormData({
      ...formData,
      projectName: 'Hệ thống dẫn động thùng trộn',
      major: 'Cơ Kỹ Thuật',
      studentId: user?.student_id || '2013257',
      studentName: user?.fullname || 'Nguyễn Văn Học',
      instructor: 'TS. Nguyễn Duy Khương',
      power: demoData.duLieuDauVao.thungTron.congSuat.toString(),
      speed: demoData.duLieuDauVao.thungTron.soVongQuay.toString(),
      lifespan: demoData.duLieuDauVao.thungTron.thoiGianPhucVu.toString(),
      workDaysYear: '300',
      workHoursDay: '8',
      type: 'Quay 1 chiều',
      loadCharacter: 'Tải va đập nhẹ',
      workMode: '2 ca',
      loadMode: 'Thay đổi theo bậc'
    });
  };

  const clearProjectData = (shouldReload = true) => {
    localStorage.removeItem('mtds_project_form');
    localStorage.removeItem('mtds_project_step2');
    localStorage.removeItem('mtds_project_table');
    localStorage.removeItem('mtds_project_id');
    
    setProjectId(null);
    setFormData(getInitialFormData());
    setStep2Data(getInitialStep2Data());
    setStep5Data(getInitialStep5Data());
    setTableData([]);
    
    if (shouldReload) {
      window.location.reload();
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DesignContext.Provider value={{
      user, projectId, setProjectId, formData, setFormData, updateFormData, 
      step2Data, setStep2Data, 
      step5Data, setStep5Data,
      tableData, setTableData,
      loadSampleData, clearProjectData, saveProject
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
