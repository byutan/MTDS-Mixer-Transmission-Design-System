import dbPool from '../database.js'; // Đừng quên dòng này nhé
import crypto from "crypto";

class User {
  // Hàm nội bộ tạo ID ngẫu nhiên
  static #generateUserID() {
    const seed = `${Date.now()}-${Math.random()}`;
    const hash = crypto.createHash("sha1").update(seed).digest("hex");
    const num = parseInt(hash.slice(0, 8), 16) % 100000000;
    return num.toString().padStart(8, "0");
  }

  static async findByEmail(email) {
    try {
      const [rows] = await dbPool.execute(
        'SELECT * FROM User WHERE Email = ?', 
        [email]
      );
      return rows?.[0] || null;
    } catch (error) {
      console.error("Lỗi findByEmail:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await dbPool.execute(
        'SELECT * FROM User WHERE UserID = ?', 
        [id]
      );
      return rows?.[0] || null;
    } catch (error) {
      console.error("Lỗi findById:", error);
      throw error;
    }
  }

  static async create({ name, email, password }) {
    try {
      const ID = this.#generateUserID();
      await dbPool.execute(
        'INSERT INTO User (UserID, FullName, Email, Password) VALUES (?, ?, ?, ?)',
        [ID, name, email, password]
      );
      return ID;
    } catch (error) {
      console.error("Lỗi create User:", error);
      throw error;
    }
  }

  static async update({ id, email, full_name, phone }) {
    try {
      const [result] = await dbPool.execute(
        `UPDATE User SET Email = ?, FullName = ?, Phone = ? WHERE UserID = ?`,
        [
          email ?? "",
          full_name ?? "-",
          phone ?? null, 
          id
        ]
      );
      return result;
    } catch (error) {
      console.error("Lỗi update User:", error);
      throw error;
    }
  }
}

export default User;