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
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const { student_id } = req.params;
        
        // Lấy dữ liệu 12 tháng gần nhất (bao gồm cả năm cũ nếu cần)
        const sql = `
            SELECT 
                TO_CHAR(login_at, 'MM/YYYY') AS month_year,
                EXTRACT(MONTH FROM login_at) AS month,
                EXTRACT(YEAR FROM login_at) AS year,
                COUNT(*) AS login_count
            FROM user_activities
            WHERE student_id = $1 
              AND login_at >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY year, month, month_year
            ORDER BY year ASC, month ASC`;
        
        const result = await UserService.query(sql, [student_id]);
        
        // Tạo mảng 12 tháng gần nhất tính từ tháng hiện tại
        const stats = [];
        const now = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            const monthYearKey = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            
            // Tìm dữ liệu trong DB
            const dbRow = result.rows.find(row => row.month_year === monthYearKey);
            
            stats.push({
                name: monthLabel,
                visits: dbRow ? parseInt(dbRow.login_count) : 0
            });
        }

        return res.status(200).json(stats);
    } catch (error) {
        console.error("API Stats Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

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

        // Ghi nhật ký đăng nhập vào bảng user_activities
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        try {
            const activitySql = `
                INSERT INTO user_activities (student_id, ip_address, user_agent) 
                VALUES ($1, $2, $3)`;
            await UserService.query(activitySql, [user.student_id, ipAddress, userAgent]);
        } catch (activityError) {
            console.error("Lỗi khi ghi nhật ký hoạt động:", activityError);
        }

        // Loại bỏ mật khẩu trước khi trả về
        const { password: _, ...userData } = user;
        
        return res.status(200).json({
            message: "Login successful.",
            user: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};