import express from "express";
import { scheduleAppointment } from "../controllers/home.js";
import { isAuth } from "../utils/jwtAuth.js";

export const router = express.Router();

router.post('/schedule-appointment', isAuth, scheduleAppointment);
