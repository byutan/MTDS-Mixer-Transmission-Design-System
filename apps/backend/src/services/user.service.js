import { query } from '../config/database.js';

export const UserService = {
  
  findUserByIdentifier: async (identifier) => {
    const sql = 'SELECT * FROM users WHERE email = $1 OR student_id = $2';
    const result = await query(sql, [identifier, identifier]);
    return result.rows[0];
  },

  createUser: async (user) => {
    const sql = `
      INSERT INTO users (student_id, fullname, email, password, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING student_id, fullname, email`;
    const values = [user.studentId, user.fullname, user.email, user.password, user.phone];
    const result = await query(sql, values);
    return result.rows[0];
  }
};