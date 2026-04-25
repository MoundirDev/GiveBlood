import express from "express";
import { createEvent, scheduleAppointment, searchDonors } from "../controllers/home.js";
import { isAuth } from "../utils/jwtAuth.js";

export const router = express.Router();

router.post('/schedule-appointment', isAuth, scheduleAppointment);

router.post('/search-donors', isAuth, searchDonors);

router.post('/create-event', isAuth, createEvent)