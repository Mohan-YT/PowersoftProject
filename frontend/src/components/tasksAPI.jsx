import axios from "axios"
import BACKEND_URL from "../commen/backendUrl"

export const getTasks = async (projectId)=>{
    try {

        const responce = await axios.get(`${BACKEND_URL}/tasks`,{params : {project : projectId}})
        if(!responce) return {error : 'No Tasks Found'}
        
        return responce.data

    } catch (error) {
        console.log(`Error from getTasks : ${error.message}`)
    }
}

export const createTask = async (newTask)=>{
    try {
        const responce = await axios.post(`${BACKEND_URL}/tasks/create`,newTask)
        if(!responce) return {error : "Task Create Faild"}

        return responce.data
        
    } catch (error) {
        console.log(`Error from createTask : ${error.message}`)
    }
}

export const viewTaskById = async (id)=>{
    try {
        const responce = await axios.get(`${BACKEND_URL}/tasks/${id}`)
        if(!responce) return {  error :'Task Not Found' }
        return responce.data

    } catch (error) {
        console.log(`Error from viewTaskById : ${error.message}`)
    }
}


export const editTaskById = async ({id,updatedTask})=>{
    try {
        const responce = await axios.patch(`${BACKEND_URL}/tasks/edit/${id}`,updatedTask)
        if(!responce) return {error : "Task Update Faild"}

        return responce.data

    } catch (error) {
        console.log(`Error from editTaskById : ${error.message}`)
    }
}

export const deleteTaskById = async (id)=>{
    try {
        const responce = await axios.delete(`${BACKEND_URL}/tasks/delete/${id}`)
        if(!responce) return {error : "Task Delete Faild"}

        return responce.data

    } catch (error) {
        console.log(`Error from deleteTaskById : ${error.message}`)
    }
}