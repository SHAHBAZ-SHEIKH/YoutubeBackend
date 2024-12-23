import mongoose from "mongoose";
import User from "../modals/Users.js";
import bcrypt from "bcryptjs"
import { createError } from "../error.js";
import jwt from "jsonwebtoken"
import "dotenv/config"

export const signup = async (req, res,next) => {


    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(200).send("user has been created");

    } catch (error) {

        next(error)
    }
}


export const signin = async (req, res,next) => {


    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) return next(createError(404, "user not found"))
        const isCorrect = bcrypt.compareSync(req.body.password, user.password)
    if (!isCorrect) return next(createError(400, "wrong credentials"))

        const token = jwt.sign({ id: user._id },process.env.JWT, {expiresIn:"24h"})
        console.log("tokenUser",token)
        const { password, ...others } = user._doc
        res.cookie("tokenUser", token, {
            httpOnly: true,
            secure: false, // Disable for local dev (use only HTTP)
            sameSite: "Strict"
        })
        res.status(200).json(others)
        return
    } catch (error) {

        next(error)
    }
}


export const googleAuth = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true
            })
            res.status(200).json(user._doc)
            return
        }
        else{
            const newUser = new User({ ...req.body, fromGoogle: true });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT)
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true
            })
            res.status(200).json(savedUser._doc)
            return
        }
    } catch (error) {
        next(error)
        
    }
        
}