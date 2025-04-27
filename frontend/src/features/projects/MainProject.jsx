import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { deleteProjectById, getAllProjects } from '../../components/projectAPI'
import { LoadingRingSVG } from '../../commen/LoadingSVG'
import { Link } from 'react-router-dom'
import { BsFullscreenExit } from 'react-icons/bs'
import { FaRegEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import AddProjectModal from './AddProjectModal'
import { useDispatch } from 'react-redux'
import UpdateProjectModel from './UpdateProjectModel'
import { openUpdateModal, setProjects } from '../../slice/projectSlice'

const MainProjectPage = () => {

  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const {data : allProjects , isLoading , error} = useQuery({
    queryKey : ['projects'],
    queryFn : getAllProjects,
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const {mutate : deleteProj} = useMutation({
    mutationFn : (id)=> deleteProjectById(id),
    onSuccess : (_, id)=>{
      queryClient.invalidateQueries(['projects'])

      queryClient.setQueryData(["projects"], (oldPro) => {
        if(!oldPro) return [] 
				return oldPro.filter(pro => pro._id !== id );
    })
    
  }
  })


  const handleDelete = (id)=>{
    const isConfirm = window.confirm("Are you sure you want to delete?")
    if(isConfirm){
      deleteProj(id)
    }
}
  
  useEffect(()=>{
    dispatch(setProjects(allProjects))
  },[allProjects,dispatch])


  return (
    <>
      <main className='className=" h-screen overflow-hidden bg-base-200 px-3 py-1'>
        <h1 className="w-full h-[15%] flex justify-center items-center text-lg md:text-4xl font-bold py-5">
          Project Management Dashboard
        </h1>
    
        <section className='w-full h-full  bg-base-100 border border-gray-400 rounded-2xl overflow-hidden'>

            <nav className="h-[10%] flex justify-between items-center px-3 py-3 border-b-[0.2px] border-gray-400 sticky top-0 left-0 bg-white z-20">
                  <h1 className="text-lg md:text-3xl font-bold">Projects</h1>
            
                  <div className="flex justify-between items-center gap-4">
                      <button
                        className="btn bg-green-600 text-white font-bold text-sm lg:text-xl px-2 py-4 lg:px-3 lg:py-6"
                        onClick={() =>
                          document.getElementById("add_project_modal").showModal()
                        }
                      >
                        Add Project
                      </button>
            
                      <Link to="/" className="">
                        <BsFullscreenExit size={25} />
                      </Link>
                  </div>
            </nav>

            <main className='w-full h-[72%] flex flex-wrap justify-center items-center  md:items-start gap-2 my-4 overflow-auto'>
            {
              isLoading 
              ? <LoadingRingSVG />
              : (
                allProjects?.map((pro)=>(
                  <div key={pro._id} className='flex flex-col  md:w-[45vw] max-h-[55%] overflow-auto border border-gray-300 rounded-2xl p-2 relative'>
                      <div className='flex flex-col justify-center items-center'>
                          <img className='w-15 h-15 rounded-2xl' src={pro.logo} alt={`${pro.logo} logo`} />
                          <h1 className='text-2xl font-bold pb-3'>{pro.title}</h1>
                      </div>

                      <div className='absolute top-3 right-2 flex  gap-2'>
                          <FaRegEdit
                                   onClick={()=> dispatch(openUpdateModal(pro._id))}
                                   size={25} 
                                   className='text-green-600' />
                          <BsTrash onClick={()=>handleDelete(pro._id)} size={25} className='text-red-600' />
                      </div>

                      <div className=''>
                        <table className='table w-full flex flex-wrap'>
                          <tbody>
                            <tr>
                              <th className='text-xl'>Description</th>
                              <td className='text-lg flex flex-wrap'>{pro.description}</td>
                            </tr>
                            <tr>
                              <th className='text-xl'>StartDate</th>
                              <td className='text-lg'>{formatDate(pro.startDate)}</td>
                            </tr>
                            <tr>
                              <th className='text-xl'>EndDate</th>
                              <td className='text-lg'>{formatDate(pro.endDate)}</td>
                            </tr>
                            <tr>
                              <th className='text-xl'>Assigned <br />Employees</th>
                              <td>
                                <div className='flex flex-wrap py-1'>
                                  {
                                      pro.assignedEmps?.map((emp) => 
                                      (
                                          <div key={emp._id} className='flex justify-start items-center border rounded-2xl border-gray-300 px-2 py-1 m-1'>
                                            <img className='w-10 h-10 rounded-full' src={emp.profileImg} alt={`${emp.name} profile image`} />

                                            <div>
                                                <h2 className='text-xl' >{emp.name}</h2>
                                                <p className='text-md'>{emp.position}</p>
                                            </div>
                                            
                                          </div>
                                        )
                                      )
                                  }
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                  </div>
                ))
              )
            }
          </main> 
          {error && <p>{error?.message}</p>}
        </section>
        <AddProjectModal />
        <UpdateProjectModel />
      </main>
    </>
  ) 
}

export default MainProjectPage
