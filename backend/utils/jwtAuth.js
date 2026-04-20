import jwt from "jsonwebtoken";

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