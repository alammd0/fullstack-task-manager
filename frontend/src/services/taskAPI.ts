import axios from "axios";
import { BACKEND_URL } from "../utils/BackendURL";
import type { Task, Filter, UpdateTask } from "../types";

export const createTask =  async ({task, token} : {task : Task, token : string}) => {

    console.log(task);

    const response = await axios.post(`${BACKEND_URL}/task/create-task`, task, {
        headers : {
            "Content-Type" : "multipart/form-data",
            "Authorization" : `${token}`
        }
    });

    return response.data;
}

export const getTasks = async (token : string) => {
    const response = await axios.get(`${BACKEND_URL}/task/tasks`, {
        headers : {
            "Authorization" : `${token}`
        }
    });

    return response.data;
}

export const getFilteredTasks = async ({token , filter} : {token : string, filter : Filter}) => {
    const response = await axios.get(`${BACKEND_URL}/task/tasks/filter`, {
        params : filter,
        headers : {
            "Authorization" : `${token}`
        }
    });

    return response.data;
}

export const getTaskById = async ({token, id} : {token : string, id : number}) => {
    const response = await axios.get(`${BACKEND_URL}/task/tasks/${id}`, {
        headers : {
            "Authorization" : `${token}`
        }
    });

    return response.data;
}

export const deleteTask = async ({token, id} : {token : string, id : number}) => {
    const response = await axios.delete(`${BACKEND_URL}/task/tasks/${id}`, {
        headers : {
            "Authorization" : `${token}`
        }
    });

    return response.data;
}


export const updateTask = async ({token, id,  updateTask} : {token : string, updateTask : UpdateTask, id : number}) => {
    const response = await axios.put(`${BACKEND_URL}/task/tasks/${id}`, updateTask, {
        headers : {
            "Content-Type" : "multipart/form-data",
            "Authorization" : `${token}`
        }
    });

    return response.data;
}

export const markTaskAsCompleted = async ({token, id} : {token : string, id : number}) => {
    const response = await axios.put(`${BACKEND_URL}/task/tasks/${id}/completed`, {}, {
        headers : {
            "Authorization" : `${token}`
        }
    });

    return response.data;
}
