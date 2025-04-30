import {configureStore} from '@reduxjs/toolkit'
import employeeSlice from '../slice/employeeSlice'
import projectSlice from '../slice/projectSlice'
import taskSlice from '../slice/taskSlice'


const store = configureStore({
    reducer : {
        employee : employeeSlice ,
        project : projectSlice ,
        task : taskSlice
    }
})  

export default store