import * as hopGiamTocService from "../services/HopGiamToc.services.js";
export const tinhHieuSuat = (req, res) => {
    try {
        const { danhSachBanhRang } = req.body
        if(!danhSachBanhRang || !Array.isArray(danhSachBanhRang)) {
            return res.status(400).json({ message: "Component detail list type error."})
        } 
        const result = hopGiamTocService.tinhHieuSuatHGT(danhSachBanhRang)
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