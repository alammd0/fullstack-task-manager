
import axios from "axios";
import { BACKEND_URL } from "../utils/BackendURL";
import type { LoginUser, SignUser } from "../types";

export const login = async ( user : LoginUser) => {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, user);
    return response.data;
   
}

export const register = async (user : SignUser)  => {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, user);
    return response.data;

}