// Entry point
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import companyRoutes from './routes/companyRoutes';
import assetRoutes from './routes/assetRoutes';
import serviceLogRoutes from './routes/serviceLogRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { initCronJobs } from './utils/cronJobs';
import { seedAdmin } from './utils/seeder';
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_API_URL, // Allow only  Vite app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies/headers if needed
}));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/assets', assetRoutes);
app.use('/service-logs', serviceLogRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('RaviTrack Backend is running !!');
});

app.listen(port, async () => {
    // Connect to database
    await connectDB();
    // Seed default admin
    await seedAdmin();
    // Initialize scheduled tasks
    initCronJobs();
    console.log(`Asset mgmt app listening on port ${port}`);
});