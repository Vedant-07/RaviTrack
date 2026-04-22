// Entry point
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('RaviTrack Backend is running bhaiyo !');
});

app.listen(port, () => {
    console.log(`Asset mgmt app listening on port ${port}`);
});