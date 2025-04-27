import axios from 'axios'
import BACKEND_URL from '../commen/backendUrl'


export const getAllProjects = async ()=>{
    try {
        const responce = await axios.get(`${BACKEND_URL}/projects`)

        if(!responce){
            throw new Error('No Project Details')
        }
        return responce.data
        
    } catch (error) {
        throw new Error(`getAllProjects: ${error.message}`)
    }
}


export const getProjectById = async (id)=>{
    try {
        const responce = await axios.get(`${BACKEND_URL}/projects/${id}`)

        if(!responce){
            throw new Error('Project Not Found')
        }
        
        return responce.data

    } catch (error) {
        throw new Error(`getProjectById: ${error.message}`)
    }
}


export const createProject = async (project)=>{
    try {
        const responce = await axios.post(`${BACKEND_URL}/projects/create`,project)

        if(!responce){
            throw new Error('Project Creation Error')
        }

        return responce.data

    } catch (error) {
        throw new Error(`createProject: ${error.message}`)
    }
}


export const updateProjectById = async ({id,newUpdatedProject})=>{
    try {
        const responce = await axios.patch(`${BACKEND_URL}/projects/edit/${id}`,newUpdatedProject)
        if(!responce){
            throw new Error('Error From Project Updation')
        }

        return responce.data
        
    } catch (error) {
        throw new Error(`updateProjectById: ${error.message}`)
    }
}


export const deleteProjectById = async (id)=>{
    try {
        const responce = await axios.delete(`${BACKEND_URL}/projects/delete/${id}`)
        if(!responce){
            throw new Error('Error From Project Delete')
        }

        return responce.data
    } catch (error) {
        throw new Error(`deleteProjectById: ${error.message}`)
    }
}