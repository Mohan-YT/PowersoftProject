import { createSlice } from '@reduxjs/toolkit'

const employeeSlice = createSlice({
    name : "employee",
    initialState : {
        emps : [],
        empId : null,
        viewModal : false,
        updateModal : false
    },
    reducers : {
        setEmps : (state,action)=>{
            state.emps = action.payload
        },
        openViewModal :(state,action)=>{
            state.empId = action.payload,
            state.viewModal = true
        },
        closeViewModal : (state)=>{
            state.empId = null,
            state.viewModal = false
        },
        openUpdateModal :(state,action)=>{
            state.empId = action.payload,
            state.updateModal = true
        },
        closeUpdateModal : (state)=>{
            state.empId = null,
            state.updateModal = false
        }
    }
})


export const {setEmps, openViewModal,closeViewModal , openUpdateModal,closeUpdateModal} = employeeSlice.actions;
export default employeeSlice.reducer
