import express from "express";
import { register, login, logout, hospitalLogin, hospitalRegister, changePassword } from "../controllers/auth.js";
import { isAuth } from "../utils/jwtAuth.js";

export const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/hospital-login', hospitalLogin);

router.post('/hospital-register', hospitalRegister);

router.patch('/change-password', isAuth, changePassword);