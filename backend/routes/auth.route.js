import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = express.Router();

//cookie options -> to secure the cookie
const cookieOptions = {
    httpOnly: true, //prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", //only sends cookies over https in production
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    sameSite: "strict", //prevents CSRF attacks
}

//function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,  {
        expiresIn: "30d",
    })
}


//register route
router.post("/register", async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    //check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]); //pool.query is a function to query the database. It returns a rows object with the results of the query. If the user exists, the rows object will have a length greater than 0.
    if(userExists.rows.length > 0){
        return res.status(400).json({
            message: "User already exists",
        })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the number of salt rounds. Its await because bcrypt.hash is an asynchronous function.

    //create user
    const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
    if(!newUser.rows[0]){
        return res.status(400).json({
            message: "Failed to create user",
        })
    }

    //generate token for the new user
    const token = generateToken(newUser.rows[0].id);
    res.cookie("token", token, cookieOptions); //stores the token in the browser's cookie storage. "token" is the name of the cookie. token is the actual token generated for the new user and the value of the cookie. 

    return res.status(201).json({
        message: "User created successfully",
        user: newUser.rows[0],
    })

})
