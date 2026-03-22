import { query } from '../config/database.js';
import { User } from '../models/User.js'
import bcrypt from 'bcrypt';
export const UserService = {
  
  findUserByIdentifier: async (identifier) => {
    const sql = 'SELECT * FROM users WHERE email = $1 OR student_id = $2';
    const result = await query(sql, [identifier, identifier]);
    return result.rows[0];
  },

  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      fullname: userData.fullname,
      studentId: userData.studentId,
      email: userData.email,
      password: hashedPassword
    });
    const sql = `
      INSERT INTO users (student_id, fullname, email, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING student_id, fullname, email`;
    const values = [newUser.getStudentid(), newUser.getFullname(), newUser.getEmail(), newUser.getPassword()];
    const result = await query(sql, values);
    return result.rows[0];
  }
};