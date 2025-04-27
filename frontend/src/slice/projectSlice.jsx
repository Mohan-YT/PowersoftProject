import { createSlice } from '@reduxjs/toolkit'

const projectSlice = createSlice({
    name : "project",
    initialState : {
        projects : [],
        proId : null,
        updateModal : false
    },
    reducers : {
        setProjects : (state,action)=>{
            state.projects = action.payload
        },
        openUpdateModal :(state,action)=>{
            state.proId = action.payload,
            state.updateModal = true
        },
        closeUpdateModal : (state)=>{
            state.proId = null,
            state.updateModal = false
        }
    }
})


export const { setProjects,openUpdateModal,closeUpdateModal} = projectSlice.actions;
export default projectSlice.reducer
