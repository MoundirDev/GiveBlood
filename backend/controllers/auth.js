import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../models/User.js";
import { createJWT } from "../utils/jwtAuth.js";


export async function register(req, res, next) {

    const username = req.body.username?.trim();
    const email = validator.normalizeEmail(req.body.email || "");
    const password = req.body.password;
    const errors = [];

    //! input validation : 
    if (!username || !email || !password) {
        errors.push({message: "All fields are required."});
    }
    if (username && !validator.isLength(username, { min: 5, max: 20 })) {
        errors.push({message: "Username must be 5-20 characters long."});
    }
    if (username && !validator.isAlphanumeric(username, "en-US", { ignore: "_.- " })) {
        errors.push({message: "Username contains invalid characters."});
    }
    if (email && !validator.isEmail(email)) {
        errors.push({message: "Invalid email address."});
    }
    if (password && !validator.isLength(password, { min: 8, max: 30 })) {
        errors.push({message: "Password must be 8-30 characters long."});
    }
    if (password && !validator.isStrongPassword(password, {
        minNumbers: 1,
        minSymbols: 0,
        minLowercase: 1,
        minUppercase: 0
    })) {
        errors.push({message: "Password must include at least one number."});
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    const existingUser = await User.findOne({ $or: [{username}, {email}] });
    if(existingUser){
        if(existingUser.username == username) errors.push({message: "Username already in use."});
        if(existingUser.email == email) errors.push({message: "Email address already exists"});
        return res.status(409).json({ errors })
    }

    //! password hashing: 
    const hashedPassword = await bcrypt.hash(password, 12);

    // ! saving user to db: 
    const user = new User({
        username,
        email,
        password: hashedPassword
    })
    await user.save();

    //! log the user in using cookie: 
    const token = createJWT(user);
    
    res.cookie("giveblood-token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000   // valide for 24h
    });
    user = user.toObject();
    delete user.password;   

    return res.status(201).json({
        user,
        message: "Account created successfully"
    });
}


export async function login(req, res, next){
    

    const email = validator.normalizeEmail(req.body?.email || "");
    const username = req.body.username?.trim();
    const password = req.body.password;

    //! validate user input
    if ((!email && !username) || !password) {
        return res.status(400).json({ message: "Email/username and password required."});
    }    

    //! find user and compare passwords
    let user = await User.findOne({$or: [{email}, {username}]});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials."});
    }

    //! send json web token using cookie
    const token = createJWT(user);

    res.cookie("giveblood_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000   // valide for 24h
    });
    user = user.toObject();
    delete user.password;

    return res.status(200).json({
        user,
        message: "Logged in successfully."
    })
}


export async function logout(req, res, next) {

    res.clearCookie("giveblood_token", {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully"});
}
