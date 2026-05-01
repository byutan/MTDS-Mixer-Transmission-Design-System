export const BANG_10_7 = [
    {
        sigmaBMin: 500,
        sigmaBMax: 700,
        W_g: 0.05,
        W_t: 0,
    },
    {
        sigmaBMin: 700,
        sigmaBMax: 1000,
        W_g: 0.1,
        W_t: 0.05,
    },
    {
        sigmaBMin: 1000,
        sigmaBMax: 1200,
        W_g: 0.2,
        W_t: 0.1,
    },
    {
        sigmaBMin: 1200,
        sigmaBMax: 1400,
        W_g: 0.25,
        W_t: 0.15,
    },
];

export const traHeSoAnhHuongUngSuatTrungBinh = (sigmaB) => {
    if (typeof sigmaB !== "number" || sigmaB <= 0) {
        throw new Error("sigmaB phai la so duong.");
    }

    const ketQua =
        BANG_10_7.find((dong) => sigmaB >= dong.sigmaBMin && sigmaB <= dong.sigmaBMax) ??
        BANG_10_7[BANG_10_7.length - 1];

    return {
        W_g: ketQua.W_g,
        W_t: ketQua.W_t,
    };
};
