import * as OLanServices from "../services/OLan.services.js";

export const tinhToanOLanTheoTruc = async (req, res) => {
    try {
        const idTruc = req.params.id;
        const { duLieuDauVao } = req.body;

        if (!duLieuDauVao || typeof duLieuDauVao !== "object") {
            return res.status(400).json({ message: "Invalid input data type." }); 
        } 

        let result;
        
        if (idTruc === '1') {
            result = await OLanServices.tinhToanOLanTrucI(duLieuDauVao);
        } else if (idTruc === '2') {
            result = await OLanServices.tinhToanOLanTrucII(duLieuDauVao);
        } else if (idTruc === '3') {
            result = await OLanServices.tinhToanOLanTrucIII(duLieuDauVao);
        } else {
            return res.status(404).json({ message: "Shaft ID not found. Use 1, 2, or 3." });
        }

        return res.status(200).json({
            success: true,
            message: `Computed successfully.`,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};