import express from 'express';
import morgan from 'morgan';
import session from "express-session";
import passport from 'passport';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import './config/passport.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import adRoutes from './routes/adRoutes.js';
import wallAdRoutes from './routes/wallAdRoutes.js';
import autowalaRoutes from './routes/autowalaRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import helmetwalaRoutes from './routes/helmetwalaRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());  
app.use(passport.session());


app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/walls', wallAdRoutes);
app.use('/api/autowala', autowalaRoutes);
app.use('/api/helmetwala', helmetwalaRoutes);
app.use('/api/payment', paymentRoutes); 
app.use("/api/admin", adminRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
  res.send({ message: 'API is running...' });
});

app.use(notFound);
app.use(errorHandler);

export default app;