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
export const tinhBang_4_5_truc_I = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBang_4_5_trucI(duLieuDauVao);
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
export const tinhBang_4_5_truc_II = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBang_4_5_trucII(duLieuDauVao);
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
export const tinhBang_4_5_truc_III = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhBang_4_5_trucIII(duLieuDauVao);
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

export const kiemnghiemHesoAnToa_trucI = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.kiemnghiemHesoAnToa_trucI(duLieuDauVao);
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

export const kiemnghiemHesoAnToa_trucII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.kiemnghiemHesoAnToa_trucII(duLieuDauVao);
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

export const kiemnghiemHesoAnToa_trucIII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.kiemnghiemHesoAnToa_trucIII(duLieuDauVao);
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
export const Kiemnghiemdobenquatai_trucI = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.Kiemnghiemdobenquatai_truc_I(duLieuDauVao);
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

export const Kiemnghiemdobenquatai_trucII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.Kiemnghiemdobenquatai_truc_II(duLieuDauVao);
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

export const Kiemnghiemdobenquatai_trucIII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.Kiemnghiemdobenquatai_truc_III(duLieuDauVao);
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


