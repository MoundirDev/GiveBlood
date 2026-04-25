import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router as authRoutes } from "./routes/auth.js";
import { router as homeRoutes } from "./routes/home.js";
import { connectDB } from "./config/db.js";


dotenv.config();
const app = express();

app.use(cors({
  origin: `http://localhost:3000`,   //! only this domain name is allowed to read responses
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/home', homeRoutes);


connectDB()
    .then( () => {
        app.listen(process.env.PORT);     //! backend port: 5000
        console.log("Server is running on localhost:5000");
    })