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
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Allow only your Vite app
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

app.listen(port, () => {
    // Connect to database
    connectDB();
    // Initialize scheduled tasks
    initCronJobs();
    console.log(`Asset mgmt app listening on port ${port}`);
});