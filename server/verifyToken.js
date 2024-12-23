import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.tokenUser;
    console.log("tokenUser",token)
    
    if (!token) return next(createError(401,"You are not authenticated"));
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next (createError(403,"Token is not valid"));
        
        req.user = user;
        console.log(req.user,"token wala user")
        next();
    });
};