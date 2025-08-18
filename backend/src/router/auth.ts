
import { Router } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";


const router = Router();

router.post("/register", async (req, res) => {
    try{

        const { email, password } = req.body ; 

        if(!email || !password){
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        // find User with email 
        const existingUser = await prisma.user.findFirst({
            where : {
                email : email
            }
        }); 

        if(existingUser) {
            return res.status(409).json({
                message : "Email already exists"
            })
        };

        // if User doesn't exits, then hased password and create new User
        const hashedPassword = await bcrypt.hash(password, 10);

        // create token using JWT  
        

    }
    catch(error){

    }
})