import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

import { AuthTokenError } from "./errors/AuthTokenError";

import { singOut } from '../contexts/AuthContext';

export function setupApiClient(ctx = undefined){
    let cookies = parseCookies(ctx)
    
    const api = axios.create({
        baseURL: 'http://chefconnect-backend.vercel.app',
        headers: {
            Authorization: `Bearer ${cookies['@auth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError)=> {
        if(error.response.status === 401){
            if(typeof window !== undefined){
                singOut()
            }else{
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error)
    })
    
    return api
}