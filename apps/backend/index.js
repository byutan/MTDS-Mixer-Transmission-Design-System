import express from 'express';
import dotenv from 'dotenv';
import hopGiamTocRoutes from "./src/routes/HopGiamToc.routes.js"
import HeThongTruyenDongRoutes from "./src/routes/HeThongTruyenDong.routes.js"
import ThungTronRoutes from "./src/routes/ThungTron.routes.js"
import { connectDB } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/hop-giam-toc', hopGiamTocRoutes);
app.use('/api/he-thong-truyen-dong', HeThongTruyenDongRoutes);
app.use('/api/thung-tron', ThungTronRoutes);

app.listen(PORT, () => {
  console.log(`Running server at port ${PORT}`);
});