import e from "express";
import * as HeThongTruyenDongServices from "../services/HeThongTruyenDong.services.js";
export const tinhHieuSuat = (req, res) => {
    try {
        const { duLieuDauVao } = req.body
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = HeThongTruyenDongServices.tinhHieuSuatHeThong(duLieuDauVao)
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

export const tinhTySoTruyenChungSoBo = (req, res) => {
    try {
        const { duLieuDauVao } = req.body
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = HeThongTruyenDongServices.tinhTySoTruyenChungSoBo(duLieuDauVao)
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

export const tinhTySoTruyenChungThucTe = (req, res) => {
    try {
        const { duLieuDauVao } = req.body
        if (!duLieuDauVao || typeof duLieuDauVao !== "object" || Array.isArray(duLieuDauVao)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = HeThongTruyenDongServices.tinhTySoTruyenChungThucTe(duLieuDauVao)
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