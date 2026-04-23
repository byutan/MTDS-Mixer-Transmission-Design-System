import * as TrucServices from "../services/Truc.services.js";

export const tinhBangDuongKinhTruc_I = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBangDuongKinh_trucI(duLieuDauVao);
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
export const tinhBangDuongKinh_trucII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBangDuongKinh_trucII(duLieuDauVao);
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
export const tinhBangDuongKinh_trucIII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBangDuongKinh_trucIII(duLieuDauVao);
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
