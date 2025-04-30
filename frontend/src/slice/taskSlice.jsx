import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  taskId: null,
  tasks : [],
  viewModalOpen: false,
  updateModelOpen : false
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    openViewModal: (state, action) => {
      state.viewModalOpen = true;
      state.taskId = action.payload; 
    },
    closeViewModal: (state) => {
      state.viewModalOpen = false;
      state.taskId = null;
    },
    setTask : (state,action) =>{
      state.tasks = action.payload
    },
    openUpdateModal: (state, action) => {
      state.updateModelOpen = true;
      state.taskId = action.payload; 
    },
    closeUpdateModal: (state) => {
      state.updateModelOpen = false;
      state.taskId = null;
    },
  },
});

export const {setTask, openViewModal, closeViewModal,openUpdateModal,closeUpdateModal } = taskSlice.actions;

export default taskSlice.reducer;
