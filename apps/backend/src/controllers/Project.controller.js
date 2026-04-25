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
        load_character, work_mode, work_days_per_year, work_hours_per_day, load_mode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const params = [
      student_id, project_name, major, instructor, current_step || 1,
      specs.power_kw, specs.speed_rpm, specs.lifespan_hours, specs.rotation_type,
      specs.load_character, specs.work_mode, specs.work_days_per_year, specs.work_hours_per_day, specs.load_mode
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
                efficiency_sigma = $3,
                required_power_pk = $4,
                preliminary_speed_nsb = $5,
                total_ratio_ut = $6,
                belt_ratio_ud = $7,
                gearbox_ratio_uh = $8,
                u1 = $9,
                u2 = $10,
                motor_code = $11,
                motor_cos_phi = $12,
                motor_t_max_tdm = $13,
                motor_t_kd_tdm = $14
            WHERE project_id = $15
            RETURNING *
        `;
        
        const params = [
            updateData.project_name,
            current_step || 1,
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

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM projects WHERE project_id = $1', [id]);
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
