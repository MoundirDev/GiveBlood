import dotenv from "dotenv";
import express from "express";

import { router as authRoutes } from "./routes/auth.js";
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


connectDB()
    .then( () => {
        app.listen(process.env.PORT);     //! backend port: 5000
        console.log("Server is running on localhost:8080");
    })