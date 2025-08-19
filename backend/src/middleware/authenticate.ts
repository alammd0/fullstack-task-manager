
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.authorization ; 

    if(!token){
        return res.status(401).json({
            message : "Unauthorized User",
            error : "Please login to access this route"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if(!decoded){
            return res.status(401).json({
                message : "Unauthorized User",
                error : "Please login to access this route"
            })
        }

        (req as any).user = decoded ;
        next();
    }
    catch(error){
        return res.status(401).json({
            message : "Unauthorized User",
            error : "Please login to access this route"
        })
    }
}


export const isAdmin = (req : Request, res : Response, next : NextFunction) => {
    try{
        if((req as any).user.role !== "Admin"){
            return res.status(401).json({
                message : "this route is only for admin"
            })
        }
    }
    catch(error){
        return res.status(401).json({
            message : "Unauthorized User"
        })
    }
}