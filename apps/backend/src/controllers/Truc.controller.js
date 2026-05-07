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
        const result = TrucServices.kiemnghiem_HesoAnToa_trucI(duLieuDauVao);
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
        const result = TrucServices.kiemnghiem_HesoAnToa_trucII(duLieuDauVao);
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
        const result = TrucServices.kiemnghiem_HesoAnToa_trucIII(duLieuDauVao);
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

//=====================================================================
// TÍNH TOÁN D1, LMRC, LMDT VỚI LỰA CHỌN CỦA USER
//=====================================================================

export const tinhDieuKienD1_trucI = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhDieuKienD1_trucI(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed d1 conditions for Trục I successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const tinhDieuKienD1_trucII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhDieuKienD1_trucII(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed d1 conditions for Trục II successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const tinhDieuKienD1_trucIII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinhDieuKienD1_trucIII(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed d1 conditions for Trục III successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const tinh_hetruc_trucI = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinh_he_Truc_I(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục I successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const tinh_hetruc_trucII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinh_he_Truc_II(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục II successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const tinh_hetruc_trucIII = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.tinh_he_Truc_III(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục III successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const gioi_han_lmrc_lmdt_truc_I = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.show_gioi_han_lmrc_lmdt_truc_I(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục I successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const gioi_han_l11_I = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.show_gioi_han_l11_I(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục I successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const gioi_han_lmrc_lmrt_II = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.show_gioi_han_lmrc_lmrt_II(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục II successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const gioi_han_lmrt_lmkn_III = (req, res) => {
    try {
        const { duLieuDauVao } = req.body;
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "duLieuDauVao must be an object." });
        }
        const result = TrucServices.show_gioi_han_lmrt_lmkn_III(duLieuDauVao);
        return res.status(200).json({
            success: true,
            message: "Computed he truc for Trục III successfully.",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

