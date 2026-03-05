import crypto from "crypto";

class User {
 
  #id;
  #password;

  constructor({ name, email, password, phone = null }) {
    this.#id = this.#generateUserID();
    this.name = name;
    this.email = email;
    this.#password = password; 
    this.phone = phone;
    this.createdAt = new Date();
  }

  
  #generateUserID() {
    const seed = `${Date.now()}-${Math.random()}`;
    const hash = crypto.createHash("sha1").update(seed).digest("hex");
    const num = parseInt(hash.slice(0, 8), 16) % 100000000;
    return num.toString().padStart(8, "0");
  }

  
  get id() {
    return this.#id;
  }

  // Methods: Các hành động của đối tượng
  
  // Kiểm tra mật khẩu
  comparePassword(inputPassword) {
    return this.#password === inputPassword;
  }

  // Cập nhật thông tin cơ bản
  updateProfile({ name, email, phone }) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (phone) this.phone = phone;
    console.log(`User ${this.#id} đã được cập nhật thông tin.`);
  }

  // Chuyển đối tượng sang dạng JSON an toàn 
  toJSON() {
    return {
      id: this.#id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt
    };
  }
}

export default User;