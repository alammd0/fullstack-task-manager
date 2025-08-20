import { Router } from "express";  
import multer from "multer"
import prisma from "../db";
import { authenticate } from "../middleware/authenticate";
import { uploadOnCloudinary } from "../utils/cloudinary";
const router = Router();

type taskStatus = "Open" | "InProgress" | "Completed";

// here setup multer files 
const storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, "uploads/"),
    filename : (req, file, cb) => cb(null, Date.now()+ "-" + file.originalname)
});

const fileFilter = (req : any, file : Express.Multer.File, cb : any) => {
    if(file.mimetype === "application/pdf"){
        cb(null, true);
    } else {
        cb(new Error("Only pdf files are allowed"), false);
    }
}

const upload = multer({ storage : storage, fileFilter : fileFilter, limits : {files : 3}});

// create Task
router.post("/create-task", authenticate, upload.array("documents", 3), async (req, res) => {
    try{
        let { title, description, priority, dueDate, assignedTo } = req.body;

        if(!title || !description || !priority || !dueDate){
            return res.status(400).json({
                message : "Please provide all required fields"
            })
        };

        // find user 
        const { id } = (req as any).user;

        if(!id){
            return res.status(401).json({
                message : "Please login to access this route"
            })
        }

        // find login user 
        const findUser = await prisma.user.findFirst({
            where : {
                id : Number(id)
            },
            select : {
                id : true
            }
        }); 

        if (!findUser) { 
            return res.status(404).json({
                message : "User not found"
            })
        }

        let files: Express.Multer.File[] = [];
        if (Array.isArray(req.files)) {
            files = req.files as Express.Multer.File[];
        }

        const fileUrls = await uploadOnCloudinary(files);

        let status: taskStatus = "Open";
        if(assignedTo) status = "InProgress";

        // find assigned user
        let assignedUser = null; 
        if(assignedTo){
            assignedUser = await prisma.user.findFirst({
                where : {
                    id : Number(assignedTo)
                }
            });

            if(!assignedUser){
                return res.status(404).json({
                    return : "User not found"
                })
            }
        }; 


        const newTask = await prisma.task.create({
            data: {
                title,
                description : description,
                status: status,
                priority,
                userid : Number(findUser.id),
                dueDate: new Date(dueDate),
                assignedTo : assignedTo ? Number(assignedTo) : null,
                documents : fileUrls.length > 0 ? fileUrls : undefined
            }
        });

        if(!newTask){
            return res.status(404).json({
                message : "Task not found"
            })
        }
        

        return res.status(201).json({
            message: "Task created successfully",
            tasks: newTask
        })

    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

// Mark Task as completed if 80% documents are read
router.put("/tasks/:id/completed", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        if (!id) {
            return res.status(400).json({ message: "Please provide task id" });
        }

        // find task
        const task = await prisma.task.findUnique({
            where: { id: Number(id) }
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.status !== "InProgress" && task.status !== "Completed") {
            return res.status(400).json({ message: "Task is not in progress" });
        }

        if (!task.documents || (task.documents as string[]).length === 0) {
            return res.status(400).json({ message: "No documents found for this task" });
        }

        const totalDocs = (task.documents as string[]).length;

        // how many docs this user has read
        const readCount = await prisma.documentRead.count({
            where: { taskId: task.id, userId }
        });

        // calculate percentage
        const percentageRead = (readCount / totalDocs) * 100;

        if (percentageRead < 80) {
            return res.status(400).json({
                message: `You have only read ${percentageRead.toFixed(0)}% of documents. At least 80% required to complete.`
            });
        }

        // if already completed, block duplicate update
        if (task.status === "Completed") {
            return res.status(400).json({ message: "Task is already completed" });
        }

        // mark as completed
        await prisma.task.update({
            where: { id: task.id },
            data: { status: "Completed" }
        });

        return res.status(200).json({
            message: `Task marked as completed (You read ${percentageRead.toFixed(0)}% of documents)`
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// update Task
router.put("/tasks/:id", authenticate, upload.array("documents", 3), async (req, res) => {
    try {
        const { id } = req.params ;
        

        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        if(!id){
            return res.status(400).json({
                message : "Please provide task id"
            })
        }

        let files: Express.Multer.File[] = [];
        if (Array.isArray(req.files)) {
            files = req.files as Express.Multer.File[];
        }

        const fileUrls = await uploadOnCloudinary(files);

        const task = await prisma.task.findFirst({
            where : {
                id : Number(id)
            }
        });

        if(!task){
            return res.status(404).json({
                message : "Task not found"
            })
        }

        type TaskStatus = "Pending" | "InProgress" | "Completed"; 

        const updatedTask : any = {
            ...(title && { title : title }),
            ...(description && { description : description }),
            ...(status && { status : status as TaskStatus ?? task.status }),
            ...(priority && { priority : priority ? priority : task.priority }),
            ...(dueDate && { dueDate : new Date(dueDate)}),
            ...(assignedTo && { assignedTo : assignedTo ? Number(assignedTo) : null }),
            ...(fileUrls.length > 0 ? { documents : fileUrls } : {documents : task.documents})
        }
        
        // find and update Task
        await prisma.task.update({
            where : {
                id : Number(task.id)
            } ,
            data : updatedTask
        });

        return res.status(200).json({
            message : "Task updated successfully",
            task : updatedTask
        });

    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

// get all Tasks
router.get("/tasks", authenticate, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();

        if(!tasks){
            return res.status(404).json({
                message : "No tasks found"
            })
        }; 

        return res.status(200).json({
            message : "Tasks fetched successfully",
            tasks : tasks
        })
    }
    catch(error) {
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

// get task (will filters) 
router.get("/tasks/filter", authenticate, async (req, res) => {
    try {
        const { status, priority, dueDate } = req.query;

        let matchFilter: any = {};

        if(status){
            matchFilter.status = String(status);
        }

        if(priority){
            matchFilter.priority = String(priority);
        }

        if (dueDate && typeof dueDate === "string") {
            matchFilter.dueDate = new Date(dueDate);
        }

        const tasks = await prisma.task.findMany({
            where : matchFilter
        }); 

        if(!tasks){
            return res.status(404).json({
                message : "No tasks found"
            })
        }; 


        return res.status(200).json({
            message : "Tasks fetched successfully",
            tasks : tasks
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

// Single Task
router.get("/tasks/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                message : "Please provide task id"
            })
        }

        const task = await prisma.task.findFirst({
            where : {
                id : Number(id)
            }
        });

        if(!task){
            return res.status(404).json({
                message : "Task not found"
            })
        };

        return res.status(200).json({
            message : "Task fetched successfully",
            task : task
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})


// delete Task
router.delete("/tasks/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                message : "Please provide task id"
            })
        }

        await prisma.task.delete({
            where : {
                id : Number(id)
            }
        });

        return res.status(200).json({
            message : "Task deleted successfully"
        })
    } 
    catch(error){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})


export const taskRouter = router;