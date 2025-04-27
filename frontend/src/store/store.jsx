import {configureStore} from '@reduxjs/toolkit'
import employeeSlice from '../slice/employeeSlice'
import projectSlice from '../slice/projectSlice'


const store = configureStore({
    reducer : {
        employee : employeeSlice ,
        project : projectSlice  
    }
})  

export default store