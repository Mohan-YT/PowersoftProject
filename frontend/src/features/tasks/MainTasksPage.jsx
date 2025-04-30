import React, { useEffect, useState } from 'react'
import { BsFullscreenExit } from 'react-icons/bs'
import { IoChevronDownSharp } from 'react-icons/io5'
import { LoadingRingSVG } from '../../commen/LoadingSVG'
import AddTaskModal from './AddTaskModal'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTaskById, getTasks } from '../../components/tasksAPI'
import { FiMenu } from "react-icons/fi";
import ViewtaskModal from './ViewtaskModal'
import {useDispatch} from 'react-redux'
import { openUpdateModal, openViewModal, setTask } from '../../slice/taskSlice'
import { getAllProjects } from '../../components/projectAPI'
import UpdateTaskModal from './UpdateTaskModal'

const MainTasksPage = () => {
  const [projectId,setProjectId] = useState(null)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const {data : allTasks,isLoading,error} = useQuery({
    queryKey : ["tasks"],
    queryFn : getTasks
  })


  const {data : projects} = useQuery({
    queryKey : ['projects'],
    queryFn : getAllProjects
  })

  const filteredTasks = projectId
  ? allTasks?.filter((t) => String(t?.project?._id) === projectId)
  : allTasks

  const {mutate} = useMutation({
    mutationFn :(id)=>deleteTaskById(id),
    onSuccess : (_,id)=>{
      queryClient.invalidateQueries(["tasks"])
      queryClient.setQueriesData(['tasks'],(old)=>{
        if(!old) return []
       return  old.filter((t)=>t._id !== id)
      })
    }
  })
  const handleDelete = (id)=>{
    const isConfirm = window.confirm("Are you sure you want to delete?")
      if(isConfirm){
        mutate(id)
      }
  }

  useEffect(()=>{
    dispatch(setTask(allTasks))
  },[allTasks,dispatch])


  // console.log(filteredTasks)
// console.log('allTasks : ',allTasks)
  return (
    <>
    <main className="w-full h-screen overflow-hidden bg-base-200 px-2 py-1">
      <h1 className="w-full h-[15%] flex justify-center items-center text-lg md:text-4xl font-bold py-5">
        Project Management Dashboard
      </h1>


      <section className="w-full h-[85%]  bg-base-100 border border-gray-300 rounded-xl overflow-hidden ">
        <nav className="h-[10%] flex justify-between items-center px-3 py-3 border-b-[0.2px] border-gray-400 sticky top-0 left-0 bg-white z-20">
          <h1 className="text-lg md:text-3xl  font-bold">Tasks</h1>

         

          <div className="flex justify-between items-center gap-4">
            <div className='input border-blue-800 ps-0 hidden md:flex'>
              <h1 className='text-xl bg-blue-600 w-full h-full font-bold flex justify-center items-center px-3 py-2 text-white'>Filter</h1>
              <select name="" id="" className='border-0 outline-0 text-xl' onChange={(e)=>setProjectId(e.target.value)}>
                <option value="">All Projects</option>
                {
                  projects?.map((p)=>(
                    <option  key={p._id} value={p._id}>{p.title}</option>
                  ))
                }
              </select>
            </div>
            
            <button
              className="btn bg-blue-600 text-white font-bold text-sm lg:text-xl px-2 py-4 md:px-3 md:py-6"
              onClick={() =>
                document.getElementById("add_task_modal").showModal()
              }
            >
              Add Tasks
            </button>

            <Link to="/" className="">
              <BsFullscreenExit size={25} />
            </Link>
          </div>
        </nav>
        <main className="w-full py-3">
          <div className="">
            <table className="table w-full">
              <thead className="bg-gray-50 z-30 h-15 sticky top-0 left-0">
                <tr className=''>
                  <th className="text-center p-4 border border-gray-400 rounded-2xl ">Title</th>
                  <th className="hidden md:table-cell text-center p-4 border border-gray-400 rounded-2xl">Project</th>
                  <th className="hidden md:table-cell text-center p-4 border border-gray-400 rounded-2xl">Assigned Employees</th>
                  <th className="text-center p-4 border border-gray-400 rounded-2xl">Status</th>
                  <th className="text-center p-4 border border-gray-400 rounded-2xl">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <LoadingRingSVG />
                      </td>
                    </tr>
                  ) : (
                    filteredTasks?.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="text-center p-4 border border-gray-300 rounded-2xl">{task.title}</td>
                        <td className="hidden md:table-cell text-center p-4 border border-gray-300 rounded-2xl">{task.project?.title || 'No Project'}</td>
                        <td className="hidden md:table-cell text-center p-4 border border-gray-300 rounded-2xl">
                          {task.assignedEmps.length > 0 ? (
                            task.assignedEmps.map((emp, index) => (
                              <span key={index} className="border border-gray-300 px-3 py-1 rounded-xl m-1 text-md">
                                {emp.name}
                              </span>
                            ))
                          ) : (
                            <span>No Employees</span>
                          )}
                        </td>
                        <td className={`text-center p-4 border border-gray-300 rounded-2xl ${task.status === "Need To Do" ? "text-red-500" : task.status === "In Progress" ? "text-blue-600" : "text-green-600"}`}>{task.status}</td>
                        <td className="text-center p-4 border border-gray-300 rounded-2xl">

                          <div className="dropdown dropdown-hover">
                              <div tabIndex={0} role="button" className=" m-1"><FiMenu size={24} /></div>
                              <ul tabIndex={0} className="absolute right-9 top-3 w-20 z-20 dropdown-content menu bg-base-100 rounded-box  p-2 shadow-sm">
                                <li>
                                  <h3 
                                  onClick={() => {
                                    dispatch(openViewModal(task._id))
                                    }
                                  }
                                  >
                                    View
                                  </h3>
                                  <h3 onClick={()=>dispatch(openUpdateModal(task._id))}>Edit</h3>
                                  <h3 onClick={()=>handleDelete(task._id)}>Delete</h3>
                                </li>
                              </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

            </table>
          </div>
          {error && <p>{error.message}</p>}
        </main>

      <AddTaskModal />
      <ViewtaskModal />
      <UpdateTaskModal />
      </section>
    </main>
  </>
  )
}

export default MainTasksPage
