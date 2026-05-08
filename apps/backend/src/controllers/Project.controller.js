import { query } from '../config/database.js';

export const getAllProjects = async (req, res) => {
  const { student_id, search, sort } = req.query;
  
  try {
    let sql = `SELECT * FROM projects WHERE student_id = $1`;
    const params = [student_id];

    if (search) {
      sql += ` AND project_name ILIKE $2`;
      params.push(`%${search}%`);
    }

    if (sort === 'oldest') {
      sql += ` ORDER BY created_at ASC`;
    } else {
      sql += ` ORDER BY created_at DESC`;
    }

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req, res) => {
  const { student_id, project_name, major, instructor, current_step, ...specs } = req.body;
  console.log("Backend receiving CREATE request for student:", student_id);
  
  try {
    const sql = `
      INSERT INTO projects (
        student_id, project_name, major, instructor, current_step,
        power_kw, speed_rpm, lifespan_hours, rotation_type, 
        load_character, work_mode, work_days_per_year, work_hours_per_day, load_mode,
        efficiency_sigma, required_power_pk, preliminary_speed_nsb, total_ratio_ut,
        belt_ratio_ud, gearbox_ratio_uh, u1, u2, motor_code,
        motor_cos_phi, motor_t_max_tdm, motor_t_kd_tdm,
        motor_power_actual, motor_speed_actual,
        shaft_i_d1, shaft_i_lmrc, shaft_i_lmdt, shaft_i_l11,
        shaft_ii_d2, shaft_ii_lmrc, shaft_ii_lmrt,
        shaft_iii_d3, shaft_iii_lmrt, shaft_iii_lmkn
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
      RETURNING *
    `;
    
    const params = [
      student_id, project_name, major, instructor, current_step || 1,
      specs.power_kw, specs.speed_rpm, specs.lifespan_hours, specs.rotation_type,
      specs.load_character, specs.work_mode, specs.work_days_per_year, specs.work_hours_per_day, specs.load_mode,
      specs.efficiency_sigma, specs.required_power_pk, specs.preliminary_speed_nsb, specs.total_ratio_ut,
      specs.belt_ratio_ud, specs.gearbox_ratio_uh, specs.u1, specs.u2, specs.motor_code,
      specs.motor_cos_phi, specs.motor_t_max_tdm, specs.motor_t_kd_tdm,
      specs.motor_power_actual, specs.motor_speed_actual,
      specs.shaft_i_d1 || 30, specs.shaft_i_lmrc || 42, specs.shaft_i_lmdt || 45, specs.shaft_i_l11 || 90,
      specs.shaft_ii_d2 || 40, specs.shaft_ii_lmrc || 50, specs.shaft_ii_lmrt || 60,
      specs.shaft_iii_d3 || 50, specs.shaft_iii_lmrt || 65, specs.shaft_iii_lmkn || 80
    ];

    const result = await query(sql, params);
    console.log("Project created successfully:", result.rows[0].project_id);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("DATABASE ERROR in createProject:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const {current_step, ...updateData} = req.body;
    console.log("Backend receiving UPDATE request for project ID:", id);
    
    try {
        const sql = `
            UPDATE projects SET 
                project_name = $1,
                current_step = $2,
                power_kw = $3,
                speed_rpm = $4,
                lifespan_hours = $5,
                rotation_type = $6,
                load_character = $7,
                work_mode = $8,
                work_days_per_year = $9,
                work_hours_per_day = $10,
                load_mode = $11,
                efficiency_sigma = $12,
                required_power_pk = $13,
                preliminary_speed_nsb = $14,
                total_ratio_ut = $15,
                belt_ratio_ud = $16,
                gearbox_ratio_uh = $17,
                u1 = $18,
                u2 = $19,
                motor_code = $20,
                motor_cos_phi = $21,
                motor_t_max_tdm = $22,
                motor_t_kd_tdm = $23,
                motor_power_actual = $24,
                motor_speed_actual = $25,
                shaft_i_d1 = $26, shaft_i_lmrc = $27, shaft_i_lmdt = $28, shaft_i_l11 = $29,
                shaft_ii_d2 = $30, shaft_ii_lmrc = $31, shaft_ii_lmrt = $32,
                shaft_iii_d3 = $33, shaft_iii_lmrt = $34, shaft_iii_lmkn = $35
            WHERE project_id = $36
            RETURNING *
        `;
        
        const params = [
            updateData.project_name,
            current_step || 1,
            updateData.power_kw,
            updateData.speed_rpm,
            updateData.lifespan_hours,
            updateData.rotation_type,
            updateData.load_character,
            updateData.work_mode,
            updateData.work_days_per_year,
            updateData.work_hours_per_day,
            updateData.load_mode,
            updateData.efficiency_sigma,
            updateData.required_power_pk,
            updateData.preliminary_speed_nsb,
            updateData.total_ratio_ut,
            updateData.belt_ratio_ud,
            updateData.gearbox_ratio_uh,
            updateData.u1,
            updateData.u2,
            updateData.motor_code,
            updateData.motor_cos_phi,
            updateData.motor_t_max_tdm,
            updateData.motor_t_kd_tdm,
            updateData.motor_power_actual,
            updateData.motor_speed_actual,
            updateData.shaft_i_d1, updateData.shaft_i_lmrc, updateData.shaft_i_lmdt, updateData.shaft_i_l11,
            updateData.shaft_ii_d2, updateData.shaft_ii_lmrc, updateData.shaft_ii_lmrt,
            updateData.shaft_iii_d3, updateData.shaft_iii_lmrt, updateData.shaft_iii_lmkn,
            id
        ];

        const result = await query(sql, params);
        console.log("Project updated successfully");
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("DATABASE ERROR in updateProject:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM projects WHERE project_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM projects WHERE project_id = $1', [id]);
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
