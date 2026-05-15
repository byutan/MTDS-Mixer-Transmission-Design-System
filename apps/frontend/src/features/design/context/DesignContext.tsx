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
  motorPower: string;
  motorSpeed: string;
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
  saveProject: (currentStep: number, overrides?: { formData?: any, step2Data?: any }) => Promise<void>;
  step5Errors: { I: boolean, II: boolean, III: boolean };
  setStep5Errors: React.Dispatch<React.SetStateAction<{ I: boolean, II: boolean, III: boolean }>>;
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
      systemEfficiency: '0.000',
      motorEfficiency: '0.000',
      requiredPower: '0.000',
      preliminarySpeed: '0.000',
      totalRatio: '0.000',
      beltRatio: '0.000',
      gearboxRatio: '0.000',
      u1: '0.000',
      u2: '0.000',
      cosPhi: '0.000',
      tMaxTdm: '0.000',
      tKdTdm: '0.000',
      motor: '',
      motorPower: '0.000',
      motorSpeed: '0.000',
    };
  };

  const getInitialStep5Data = (): Step5Data => {
    const saved = localStorage.getItem('mtds_project_step5');
    return saved ? JSON.parse(saved) : {
      trucI: { d1: '', lmrc: '', lmdt: '', l11: '' },
      trucII: { d2: '', lmrc: '', lmrt: '' },
      trucIII: { d3: '', lmrt: '', lmkn: '' }
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [step2Data, setStep2Data] = useState<Step2Data>({ ...getInitialStep2Data(), motorEfficiency: '---' });
  const [step5Data, setStep5Data] = useState<Step5Data>(getInitialStep5Data);
  const [step5Errors, setStep5Errors] = useState<{ I: boolean, II: boolean, III: boolean }>({ I: false, II: false, III: false });
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

  useEffect(() => {
    if (!projectId || !user) return;

    const fetchProjectData = async () => {
      try {
        const p_dc = parseFloat(step2Data.motorPower) || 0;
        const n_dc = parseFloat(step2Data.motorSpeed) || 0;

        if (p_dc <= 0 || n_dc <= 0) {
          // setLoading(false);
        }

        const res = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        const result = await res.json();
        if (result.success) {
          const p = result.data;
          // Cập nhật Step 1
          setFormData({
            projectName: p.project_name || '',
            major: p.major || '',
            studentId: p.student_id || user.student_id,
            studentName: user.fullname || '',
            instructor: p.instructor || '',
            createdDate: p.created_date ? p.created_date.split('T')[0] : new Date().toISOString().split('T')[0],
            power: p.power_kw?.toString() || '',
            speed: p.speed_rpm?.toString() || '',
            lifespan: p.lifespan_hours?.toString() || '',
            type: p.rotation_type || 'Quay 1 chiều',
            loadCharacter: p.load_character || 'Tải va đập nhẹ',
            workMode: p.work_mode || '2 ca',
            workDaysYear: p.work_days_per_year?.toString() || '360',
            workHoursDay: p.work_hours_per_day?.toString() || '8',
            loadMode: p.load_mode || 'Thay đổi theo bậc'
          });

          // Cập nhật Step 2
          setStep2Data({
            systemEfficiency: p.efficiency_sigma?.toString() || '0.000',
            motorEfficiency: '0.000', 
            requiredPower: p.required_power_pk?.toString() || '0.000',
            preliminarySpeed: p.preliminary_speed_nsb?.toString() || '0.000',
            totalRatio: p.total_ratio_ut?.toString() || '0.000',
            beltRatio: p.belt_ratio_ud?.toString() || '0.000',
            gearboxRatio: p.gearbox_ratio_uh?.toString() || '0.000',
            u1: p.u1?.toString() || '0.000',
            u2: p.u2?.toString() || '0.000',
            cosPhi: p.motor_cos_phi?.toString() || '0.000',
            tMaxTdm: p.motor_t_max_tdm?.toString() || '0.000',
            tKdTdm: p.motor_t_kd_tdm?.toString() || '0.000',
            motor: p.motor_code || '',
            motorPower: p.motor_power_actual?.toString() || '0.000',
            motorSpeed: p.motor_speed_actual?.toString() || '0.000'
          });

          // Cập nhật Step 5
          setStep5Data({
            trucI: {
              d1: (p.shaft_i_d1 || '').toString(),
              lmrc: (p.shaft_i_lmrc || '').toString(),
              lmdt: (p.shaft_i_lmdt || '').toString(),
              l11: (p.shaft_i_l11 || '').toString()
            },
            trucII: {
              d2: (p.shaft_ii_d2 || '').toString(),
              lmrc: (p.shaft_ii_lmrc || '').toString(),
              lmrt: (p.shaft_ii_lmrt || '').toString()
            },
            trucIII: {
              d3: (p.shaft_iii_d3 || '').toString(),
              lmrt: (p.shaft_iii_lmrt || '').toString(),
              lmkn: (p.shaft_iii_lmkn || '').toString()
            }
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dự án:", error);
      }
    };

    fetchProjectData();
  }, [projectId, user?.student_id]);

  const saveProject = async (currentStep: number, overrides?: { formData?: any, step2Data?: any }) => {
    // Không lưu nếu thiếu thông tin tối thiểu hoặc chưa đăng nhập
    if (!user) {
      console.warn("Save skipped: User not logged in");
      return;
    }
    
    // Ưu tiên lấy dữ liệu từ overrides nếu có (để tránh race condition khi state chưa kịp update)
    const activeFormData = overrides?.formData || formData;
    const activeStep2Data = overrides?.step2Data || step2Data;

    if (!activeFormData.projectName || !activeFormData.power) {
      console.warn("Save skipped: Project Name or Power is missing");
      return;
    }

    const cleanMotorCode = activeStep2Data.motor || null;

    // Chuyển đổi an toàn, tránh NaN
    const payload = {
      student_id: user.student_id,
      project_name: activeFormData.projectName,
      major: activeFormData.major || 'Cơ Kỹ Thuật',
      instructor: activeFormData.instructor || '',
      power_kw: parseFloat(activeFormData.power) || 0,
      speed_rpm: parseFloat(activeFormData.speed) || 0,
      lifespan_hours: parseInt(activeFormData.lifespan) || 0,
      rotation_type: activeFormData.type,
      load_character: activeFormData.loadCharacter,
      work_mode: activeFormData.workMode,
      work_days_per_year: parseInt(activeFormData.workDaysYear) || 360,
      work_hours_per_day: parseInt(activeFormData.workHoursDay) || 8,
      load_mode: activeFormData.loadMode,
      current_step: currentStep,
      // Step 2 data
      efficiency_sigma: parseFloat(activeStep2Data.systemEfficiency) || 0,
      required_power_pk: parseFloat(activeStep2Data.requiredPower) || 0,
      preliminary_speed_nsb: parseFloat(activeStep2Data.preliminarySpeed) || 0,
      total_ratio_ut: parseFloat(activeStep2Data.totalRatio) || 0,
      belt_ratio_ud: parseFloat(activeStep2Data.beltRatio) || 0,
      gearbox_ratio_uh: parseFloat(activeStep2Data.gearboxRatio) || 0,
      u1: parseFloat(activeStep2Data.u1) || 0,
      u2: parseFloat(activeStep2Data.u2) || 0,
      motor_code: cleanMotorCode,
      motor_cos_phi: parseFloat(activeStep2Data.cosPhi) || 0,
      motor_t_max_tdm: parseFloat(activeStep2Data.tMaxTdm) || 0,
      motor_t_kd_tdm: parseFloat(activeStep2Data.tKdTdm) || 0,
      motor_power_actual: parseFloat(activeStep2Data.motorPower) || 0,
      motor_speed_actual: parseFloat(activeStep2Data.motorSpeed) || 0,
      // Step 5 data
      shaft_i_d1: parseFloat(step5Data.trucI.d1) || 0,
      shaft_i_lmrc: parseFloat(step5Data.trucI.lmrc) || 0,
      shaft_i_lmdt: parseFloat(step5Data.trucI.lmdt) || 0,
      shaft_i_l11: parseFloat(step5Data.trucI.l11) || 0,
      shaft_ii_d2: parseFloat(step5Data.trucII.d2) || 0,
      shaft_ii_lmrc: parseFloat(step5Data.trucII.lmrc) || 0,
      shaft_ii_lmrt: parseFloat(step5Data.trucII.lmrt) || 0,
      shaft_iii_d3: parseFloat(step5Data.trucIII.d3) || 0,
      shaft_iii_lmrt: parseFloat(step5Data.trucIII.lmrt) || 0,
      shaft_iii_lmkn: parseFloat(step5Data.trucIII.lmkn) || 0
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
    localStorage.removeItem('mtds_project_step5');
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
      loadSampleData, clearProjectData, saveProject,
      step5Errors, setStep5Errors
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
