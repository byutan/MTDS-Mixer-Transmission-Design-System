export class User {
  #fullname
  #studentId
  #email
  #password
  /**
    * @param {{ 
    * fullname?: string,   
    * studentId?: string,  
    * email?: string,      
    * password?: string    
    * }} params
    */
  constructor({ fullname, studentId, email, password} = {}) {
    this.#studentId = studentId
    this.#fullname = fullname
    this.#email = email
    this.#password = password
  }
  getFullname() {
    return this.#fullname;
  }
  getStudentid() {
    return this.#studentId;
  }
  getEmail() {
    return this.#email;
  }
  getPassword() {
    return this.#password;
  }
}