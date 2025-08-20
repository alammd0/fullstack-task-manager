import { Router } from "express";
import prisma from "../db";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = Router();

// Get All Users
router.get("/users", authenticate, isAdmin, async (req, res) => {
    try {  

        const users = await prisma.user.findMany({
            include : {
                tasks : true,
                assignedTasks : true
            }
        })

        return res.status(200).json({
            message : "Users fetched successfully",
            users : users
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

// delete User 
// router.delete("/users/:id", authenticate, isAdmin, async (req, res) => {
//     try{
//         const { id } = req.params ;

//         if (!id) {
//             return res.status(400).json({
//                 message : "Please provide user id"
//             })
//         };

//         await prisma.user.delete({
//             where : {
//                 id : Number(id)
//             }
//         });

//         return res.status(200).json({
//             message : "User deleted successfully",
//         })
//     }
//     catch(error){
//         return res.status(500).json({
//             message : "Internal server error"
//         })
//     }
// })

export const adminRouter = router;