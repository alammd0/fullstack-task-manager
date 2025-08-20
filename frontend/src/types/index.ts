

export type SignUser = {
    name : string;
    email : string;
    password : string;
    role? : "User" | "Admin";
}


export type LoginUser = {
    email : string;
    password : string;
}

export type Task = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";         
  assignedTo?: number | null;                                                        
  dueDate: string;                             
  documents?: File[];
}

export type UpdateTask = {
  title? : string;
  description? : string;
  priority? : "Low" | "Medium" | "High";         
  assignedTo?: number | null;                                                        
  dueDate? : string;                             
  documents?: File[];
}

export type Filter = {
    status?: "Open" | "InProgress" | "Completed";
    priority?: "Low" | "Medium" | "High";
    dueDate?: string;
}


export type TaskResponse = {
    "id": number,
    "title": string,
    "description": string,
    "status": "Open" | "InProgress" | "Completed",
    "priority": "Low" | "Medium" | "High",
    "assignedTo": number | null,
    "userid": number,
    "dueDate": string,
    "createdAt": string,
    "documents": string[]
}