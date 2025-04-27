import axios from 'axios'
import BACKEND_URL from '../commen/backendUrl'

export const getAllEmps = async ()=>{
    try {
        const responce = await axios.get(`${BACKEND_URL}/employees`)

        if(!responce){
            throw new Error('No Employee Details')
        }
        return responce.data

    } catch (error) {
        throw new Error('getAllEmps Faild!',error.message)
    }
  
}

export const getEmpById = async (id)=>{
    try {
        const responce = await axios.get(`${BACKEND_URL}/employees/${id}`)
        if(!responce){
            throw new Error('No Employee Found')
        }
        return responce.data
        
    } catch (error) {
        throw new Error('getEmpById Faild!',error.message)
    }
    
}

export const createEmp = async (employeeData)=>{
    try {
        const responce = await axios.post(`${BACKEND_URL}/employees/create`,employeeData,{
            headers : {"Content-Type" : "application/json"}
        })
        if(!responce){
            throw new Error('Error From Create Employee')
        }
        return responce.data

    } catch (error) {
        throw new Error('createEmp Faild!',error.message)
    }
   
}

export const updateEmpById = async ({id,employeeNewData})=>{
    try {
        const responce = await axios.patch(`${BACKEND_URL}/employees/edit/${id}`,employeeNewData,{
            headers : {"Content-Type" : "application/json"}
        })
        if(!responce){
            throw new Error('Error From Update Employee')
        }
        return responce.data

    } catch (error) {
        throw new Error('updateEmpById Faild!',error.message)
    }
    
}

export const deleteEmpById = async (id)=>{
    try {
         await axios.delete(`${BACKEND_URL}/employees/delete/${id}`)
         if(!responce){
            throw new Error('Error From Delete Employee')
        }
         return id
    } catch (error) {
        throw new Error('deleteEmpById Faild!',error.message)
    }
}