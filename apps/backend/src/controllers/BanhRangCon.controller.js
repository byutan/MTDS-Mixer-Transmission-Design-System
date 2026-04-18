import * as BanhRangConServices from "../services/BanhRangCon.services.js";

export const tinhToanHinhHoc = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        
        // Bắt lỗi y hệt HeThongTruyenDong.controller.js
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error." });
        } 

        const result = BanhRangConServices.tinhToanHinhHoc(duLieuDauVao);
        
        return res.status(200).json({
            success: true,
            message: "Computed successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAll = async (req, res) => {
    res.status(200).json({ message: "Chức năng lấy danh sách sẽ hoàn thiện sau." });
};