import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { getTasks } from '../components/tasksAPI'
import { LoadingRingSVG } from '../commen/LoadingSVG'
import AddTaskModal from '../features/tasks/AddTaskModal'

const TaskSec = () => {

    const {data : tasks, isLoading, error} = useQuery({
        queryKey : ["tasks"],
        queryFn : getTasks,
    })

    const toDo = tasks?.filter((todo)=> todo.status === "Need To Do") || []
    const progress = tasks?.filter((todo)=> todo.status === "In Progress") || []
    const completed = tasks?.filter((todo)=> todo.status === "Completed") || []

  return (
    <>
        <section className='w-[89vw] md:w-[96vw] md:h-[45vh] border border-gray-300 bg-white rounded-2xl mt-2  mx-2 mb-2 md:mb-0'>
            <nav className='w-full flex justify-between items-center p-4 border-b border-gray-400'>
                <h1 className='text-2xl font-bold'>Tasks</h1>
                <div className='flex gap-4 justify-center items-center'>
                    <button className='bg-indigo-600 text-md md:text-lg text-white font-bold px-2 py-2 rounded-md'  onClick={() =>
                   document.getElementById("add_task_modal").showModal()
                 }>
                        Add Tasks
                    </button>
                    <Link to="/task" className="">
                        <BsArrowsFullscreen size={25} />
                    </Link>
                </div>
            </nav>
            {
                isLoading
                ? (
                    <div className='flex w-full h-[70%] justify-center items-center'>
                        <LoadingRingSVG />
                    </div>
                )
                : (
                    <main className='p-3 flex flex-col md:flex-row justify-center items-center gap-3'>
                        <div className='w-full md:w-[35%] min-h-[20vh] md:min-h-[30vh] border border-gray-400 rounded-md '>
                            <h1 className='text-2xl font-bold border-b border-gray-300 p-2'>Need to Do</h1>
                            <div className='p-2'>
                             {toDo?.slice(0,3).map((t)=>(
                                <li key={t._id} className='font-bold text-xl text-red-400'>{t.title}</li>
                             ))}
                            </div>
                        </div>
                        <div className='w-full md:w-[35%] min-h-[20vh] md:min-h-[30vh] border border-gray-400 rounded-md '>
                            <h1 className='text-2xl  font-bold border-b border-gray-300 p-2'>In Progress</h1>
                            <div className='p-2 gap-4'>
                             {progress?.slice(0,3).map((t)=>(
                                <li key={t._id} className='font-bold text-xl text-blue-500'>{t.title}</li>
                             ))}
                            </div>
                        </div>
                        <div className='w-full md:w-[35%] min-h-[20vh] md:min-h-[30vh] border border-gray-400 rounded-md '>
                            <h1 className='text-2xl font-bold border-b border-gray-300 p-2'>Completed</h1>
                            <div className='p-2'>
                             {completed?.slice(0,3).map((t)=>(
                                <li key={t._id} className='font-bold text-xl text-green-500'>{t.title}</li>
                             ))}
                            </div>
                        </div>
                    </main>
                )
            }
           <AddTaskModal />
        </section>
        
    </>
  )
}

export default TaskSec
