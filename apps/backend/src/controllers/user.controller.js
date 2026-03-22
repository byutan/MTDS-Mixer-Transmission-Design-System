import { User } from '../models/user.model.js';
import { UserService } from '../services/user.service.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const { fullname, studentId, email, password, phone } = req.body;

    
    const existingUser = await UserService.findUserByIdentifier(email) || 
                         await UserService.findUserByIdentifier(studentId);

    if (existingUser) {
      return res.status(400).json({ message: "Email or Student ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, studentId, email, password: hashedPassword, phone });
    
    const savedUser = await UserService.createUser(newUser);

    return res.status(201).json({ 
      message: "Registered successfully", 
      user: savedUser 
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    const user = await UserService.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ 
      message: "Login successful", 
      user: { 
        studentId: user.student_id, 
        fullname: user.fullname 
      } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};