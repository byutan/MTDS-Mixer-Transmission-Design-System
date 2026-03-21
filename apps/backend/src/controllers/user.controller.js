import { User } from '../models/user.model.js';
import { query } from '../config/database.js'; 
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    // 1. Khởi tạo User mới 
    const newUser = new User(req.body);

    try {
        // 2. Kiểm tra xem Email hoặc Student ID (MSSV) đã tồn tại trong DB chưa
        const userExist = await query(
            'SELECT * FROM users WHERE email = $1 OR student_id = $2', 
            [newUser.email, newUser.studentId]
        );
        
        if (userExist.rows.length > 0) {
            return res.status(400).json({ 
                message: "Email hoặc Mã sinh viên này đã được đăng ký!" 
            });
        }

        // 3. Mã hóa mật khẩu trước khi lưu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

        // 4. Lưu vào Database
        const sql = `
            INSERT INTO users (id, fullname, student_id, email, password, phone) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, fullname, student_id, email
        `;
        const values = [
            newUser.id, 
            newUser.fullname, 
            newUser.studentId, 
            newUser.email, 
            hashedPassword, 
            newUser.phone
        ];
        
        const result = await query(sql, values);
        
        // 5. Phản hồi kết quả cho Frontend
        res.status(201).json({ 
            message: "Đăng ký tài khoản thành công!", 
            user: result.rows[0] 
        });

    } catch (error) {
        console.error("Lỗi tại Auth Controller:", error);
        res.status(500).json({ 
            error: "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau." 
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm user trong DB bằng email
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Email không tồn tại trong hệ thống!" });
        }

        // 2. Dùng bcrypt để so sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác!" });
        }

        // 3. Nếu đúng, trả về thông tin user (không trả về password)
        res.status(200).json({ 
            message: "Đăng nhập thành công!", 
            user: { 
                id: user.id, 
                fullname: user.fullname, 
                studentId: user.student_id 
            } 
        });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại sau." });
    }
};