// Entry point
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import companyRoutes from './routes/companyRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/companies', companyRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('RaviTrack Backend is running !!');
});

app.listen(port, () => {
    // Connect to database
    connectDB();
    console.log(`Asset mgmt app listening on port ${port}`);
});