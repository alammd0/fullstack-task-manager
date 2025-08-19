
export type User = {
    email : string;
    password : string;
    role : string; 
}


export type FilterInput = {
    status : string;
    priority : string;
    dueDate : string;
}