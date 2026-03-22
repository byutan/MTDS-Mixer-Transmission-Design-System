import { UserService } from '../services/User.services.js';
import bcrypt from 'bcrypt';
export const register = async (req, res) => {
    try {
        const { fullname, studentId, email, password } = req.body;


        const existingUser = await UserService.findUserByIdentifier(email) ||
            await UserService.findUserByIdentifier(studentId);

        if (existingUser) {
            return res.status(400).json({ message: "Email or Student ID already exists." });
        }
        const savedUser = await UserService.createUser({ 
            fullname, 
            studentId, 
            email, 
            password
        });

        return res.status(200).json({
            message: "Registered successfully.",
            user: savedUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
}

    export const login = async (req, res) => {
        try {
            const { identifier, password } = req.body;

            const user = await UserService.findUserByIdentifier(identifier);
            if (!user) {
                return res.status(400).json({ message: "User is not registered." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password is incorrect." });
            }

            return res.status(200).json({
                message: "Login successful.",
                user: {
                    studentId: user.student_id,
                    fullname: user.fullname
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    };