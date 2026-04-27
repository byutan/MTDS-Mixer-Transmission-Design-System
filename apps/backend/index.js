import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import hopGiamTocRoutes from "./src/routes/HopGiamToc.routes.js"
import HeThongTruyenDongRoutes from "./src/routes/HeThongTruyenDong.routes.js"
import ThungTronRoutes from "./src/routes/ThungTron.routes.js"
import BanhRangConRoutes from './src/routes/BanhRangCon.route.js';
import TrucRoutes from "./src/routes/Truc.routes.js"
import authRoutes from "./src/routes/auth.routes.js"
import { connectDB } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/hop-giam-toc', hopGiamTocRoutes);
app.use('/api/he-thong-truyen-dong', HeThongTruyenDongRoutes);
app.use('/api/truc', TrucRoutes);
app.use('/api/thung-tron', ThungTronRoutes);
app.use('/api/banh-rang-con', BanhRangConRoutes);;

app.listen(PORT, () => {
  console.log(`Running server at port ${PORT}`);
});