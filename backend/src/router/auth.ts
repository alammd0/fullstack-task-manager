
import { Router } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const router = Router();

router.post("/register", async (req, res) => {
    try{

        const { name , email, role, password } = req.body ; 

        if(!name || !email || !password){
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

        // create new User 
        const newUser =  await prisma.user.create({
            data : {
                name : name,
                email : email,
                role : role ,
                password : hashedPassword
            }
        });

        return res.status(201).json({
            message : "User registered successfully",
            user : {
                id : newUser.id,
                name : name,
                email : newUser.email,
            }
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}); 

router.post("/login", async (req, res) => {
    try{

        const { email, password } = req.body ; 

        if(!email || !password){
            return res.status(400).json({
                message: "Please provide email and password"
            })
        };

        // check user exit or not
        const findUser =  await prisma.user.findFirst({
            where : {
                email : email
            }
        }); 

        if(!findUser){
            return res.status(404).json({
                message : "User not found"
            })
        }; 

        // check password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, findUser.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                message : "Invalid password"
            })
        };

        // generate token 
        const payload = {
            id : findUser.id,
            email : findUser.email,
            role : findUser.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn : "7d"
        }); 

        return res.status(200).json({
            message : "Login successful",
            data : {
                token : token,
                user :{
                    id : findUser.id,
                    name : findUser.name,
                    role : findUser.role
                }
            }
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

export const authRouter = router;