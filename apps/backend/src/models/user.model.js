export class User {
  constructor({ fullname, studentId, email, password, phone = null }) {
    this.studentId = studentId
    this.fullname = fullname
    this.email = email
    this.password = password
    this.phone = phone
  }
}