import crypto from "crypto";

export class User {
  constructor({ fullname, studentId, email, password, phone = null, id = null }) {
    this.id = id || User.generateUserID(); 
    this.fullname = fullname;
    this.studentId = studentId; 
    this.email = email;
    this.password = password;
    this.phone = phone;
  }

  static generateUserID() {
    const seed = `${Date.now()}-${Math.random()}`;
    const hash = crypto.createHash("sha1").update(seed).digest("hex");
    const num = parseInt(hash.slice(0, 8), 16) % 100000000;
    return num.toString().padStart(8, "0");
  }
}