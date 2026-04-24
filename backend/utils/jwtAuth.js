import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function createJWT(user, role){

    const payload = {
        userId: user._id,
        username: user.username,
        role
    }
    const config = { expiresIn: '24h' }

    const token = jwt.sign(payload, JWT_SECRET, config);
    return token
}
//! protect authenticated routes middleware
export async function isAuth(req, res, next) {
    try {
        const decoded = jsonwebtoken.verify(req.cookies.giveblood_token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not Authorized" });
    }
}