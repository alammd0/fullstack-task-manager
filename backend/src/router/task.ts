
import { Router } from "express";  
import multer from "multer"
import prisma from "../db";
import { authenticate } from "../middleware/authenticate";
const router = Router();

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
router.post("/tasks", authenticate, upload.array("documents", 3), async (req, res) => {
    try{
        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        if(!title || !description || !status || !priority || !dueDate || !assignedTo){
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

        // find file path
        let files: string[] = [];
        if(Array.isArray(req.files)){
             files = req.files ? req.files.map( (f : Express.Multer.File) => f.path) : [];
        }

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

        // create new Task 
        const newTask = await prisma.task.create({
            data: {
                title: title,
                description: description,
                status: status,
                priority: priority,
                dueDate: new Date(dueDate),
                assignedTo: assignedTo,
                documents: files
            }
        });

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

        let files: string[] = [];
        if(Array.isArray(req.files)){
             files = req.files ? req.files.map( (f : Express.Multer.File) => f.path) : [];
        }

        // // find task if available
        // let updatedTask: { [key: string]: any } = {};
        // if(title) {
        //     updatedTask.title = title;
        // }

        // if(description) {
        //     updatedTask.description = description;
        // }

        // if(status) {
        //     updatedTask.status = status;
        // }

        // if(priority) {
        //     updatedTask.priority = priority;
        // }

        // if(dueDate) {
        //     updatedTask.dueDate = dueDate;
        // }

        // if(assignedTo) {
        //     updatedTask.assignedTo = assignedTo;
        // }

        // if(files) {
        //     updatedTask.documents = files;
        // }

        const updatedTask : any = {
            ...(title && { title : title }),
            ...(description && { description : description }),
            ...(status && { status : status }),
            ...(priority && { priority : priority }),
            ...(dueDate && { dueDate : new Date(dueDate)}),
            ...(assignedTo && { assignedTo : assignedTo }),
            ...(files.length > 0 && { documents : files })
        }
        
        // find and update Task
        await prisma.task.update({
            where : {
                id : Number(id)
            }, 
            data : updatedTask
        })
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
router.get("/tasks", authenticate, async (req, res) => {
    try {
        const { status, priority, dueDate } = req.query;

        let matchFilter: { [key: string]: any } = {};

        if(status){
            matchFilter.status = status;
        }

        if(priority){
            matchFilter.priority = priority;
        }

        if(dueDate){
            matchFilter.dueDate = dueDate;
        };

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

// update Task
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