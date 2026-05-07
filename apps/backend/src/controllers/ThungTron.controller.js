import * as ThungTronServices from "../services/ThungTron.services.js";
import { pool } from '../config/database.js';
export const tinhCongSuatCanThiet = (req, res) => {
    try {
        const { duLieuDauVao } = req.body
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = ThungTronServices.tinhCongSuatCanThiet(duLieuDauVao)
        return res.status(200).json({
            success: true,
            message: "Computed successfully.",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const tinhVongQuayCanThiet = (req, res) => {
    try {
        const { duLieuDauVao } = req.body
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = ThungTronServices.tinhVongQuaySoBo(duLieuDauVao)
        return res.status(200).json({
            success: true,
            message: "Computed successfully.",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const chonDongCo = async (req, res) => {
    try {
        const { p_ct, n_sb } = req.body;
        if (!p_ct || !n_sb) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp công suất cần thiết (p_ct) và vòng quay sơ bộ (n_sb)." 
            });
        }
        const queryText = `
            SELECT 
                motor_code, power_kw, speed_rpm, cos_phi, efficiency_eta, t_max_tdn, t_k_tdn
            FROM catalog_motors
            WHERE power_kw >= $1
            ORDER BY 
                power_kw ASC, 
                ABS(speed_rpm - $2) ASC
            LIMIT 3;
        `;
        const { rows } = await pool.query(queryText, [p_ct, n_sb]);
        return res.status(200).json({
            success: true,
            message: "Queried successfully.",
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}