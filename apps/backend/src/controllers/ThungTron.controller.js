import * as ThungTronServices from "../services/ThungTron.services.js";
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