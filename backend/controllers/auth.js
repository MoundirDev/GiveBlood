import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../models/User.js";
import { createJWT } from "../utils/jwtAuth.js";
import { Hospital } from "../models/Hospital.js";

//! this route passed all the tests
export async function register(req, res, next) {

    const username = req.body.username?.trim();
    const fullname = req.body.fullname?.trim(); 
    const email = validator.normalizeEmail(req.body.email || "");
    const password = req.body.password;
    const bloodType = req.body.bloodType;
    const city = req.body.city?.trim();

    const errors = [];

    //! input validation : 
    if (!username || !email || !password) {
        errors.push({message: "All fields are required."});
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

    try{
        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if(existingUser){
            if(existingUser.username == username) errors.push({message: "Username already in use."});
            if(existingUser.email == email) errors.push({message: "Email address already exists"});
            return res.status(409).json({ errors })
        }
    
        // ! saving user to db: 
        let user = new User({
            username,
            fullname,
            email,
            password,
            bloodType,
            city
        })
        await user.save();
    
        //! log the user in using cookie: 
        const token = createJWT(user, "donor");
        
        res.cookie("giveblood_token", token, {
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
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Server Side Error"});
    }
}

//! this route passed all the tests
export async function login(req, res, next){
    

    const email = validator.normalizeEmail(req.body?.email || "");
    const password = req.body.password;

    //! validate user input
    if (!email || !password) {
        return res.status(400).json({ message: "Email/username and password required."});
    }    

    try{
        //! find user and compare passwords
        let user = await User.findOne({ email });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials."});
        }
    
        //! send json web token using cookie
        const token = createJWT(user, "donor");
    
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
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Server Side Error"});
    }
}

//! this route passed all the tests
export async function logout(req, res, next) {

    try{
        res.clearCookie("giveblood_token", {
            httpOnly: true,
            sameSite: "strict",
        });
    
        return res.status(200).json({ message: "Logged out successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Server Side Error"});
    }
}

//! to test this route we need hospitalRegister route(not found in design)
export async function hospitalLogin(req, res, next){
    
    const email = validator.normalizeEmail(req.body?.email || "");
    const password = req.body.password;

    if(!email || ! password){
        return res.status(400).json({ message: "All fields are required."});
    }

    try{
        //! find hospital and compare passwords
        let hospital = await Hospital.findOne({email});
    
        if (!hospital || !(await bcrypt.compare(password, hospital.password))) {
            return res.status(401).json({ message: "Invalid credentials."});
        }
    
        //! send json web token using cookie
        const token = createJWT(hospital, "hospital");
    
        res.cookie("giveblood_token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000   // valide for 24h
        });
        hospital = hospital.toObject();
        delete hospital.password;
    
        return res.status(200).json({
            hospital,
            message: "Logged in successfully."
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Server Side Error"});
    }
}

//! this route page was not found in the design too
export async function hospitalRegister(req, res, next){
    const name = req.body.name?.trim();
    const email = validator.normalizeEmail(req.body.email || "");
    const password = req.body.password;
    const address = req.body.address?.trim();

    const errors = [];

    //! input validation : 
    if (!email || !password || !name || !address) {
        errors.push({message: "All fields are required."});
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

    try{
        const existingHospital = await Hospital.findOne({email});
        if(existingHospital){
            if(existingHospital) errors.push({message: "Email address already exists"});
            return res.status(409).json({ errors })
        }
        
        // ! saving hospital to db: 
        let hospital = new Hospital({
            name,
            email,
            password,
            address
        })
        await hospital.save();
    
        //! log the hospital in using cookie: 
        const token = createJWT(hospital, "hospital");
        
        res.cookie("giveblood_token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000   // valide for 24h
        });
        hospital = hospital.toObject();
        delete hospital.password;   
    
        return res.status(201).json({
            hospital,
            message: "Account created successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Server Side Error"});
    }
}
