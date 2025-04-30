import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { deleteProjectById, getAllProjects } from '../components/projectAPI'
import { LoadingRingSVG } from '../commen/LoadingSVG'
import { IoChevronForwardOutline } from "react-icons/io5";
import AddProjectModal from '../features/projects/AddProjectModal'
import { useDispatch } from 'react-redux'
import { openUpdateModal } from '../slice/projectSlice'
import UpdateProjectModel from '../features/projects/UpdateProjectModel'


const ProjectSec = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const {data : allProjects, isLoading, error} = useQuery({
    queryKey : ['projects'],
    queryFn : getAllProjects
  })

  
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  

  return (
    <>
         <section className="p-1 h-[50vh]  md:p-1 md:w-[48vw] md:h-[40vh] bg-base-100 border border-gray-300 rounded-xl overflow-hidden  my-1 mx-3 md:m-2 mb-3">
              <nav className="flex justify-between items-center px-3 py-3 border-b-[0.2px] border-gray-400">
                <h1 className="text-xl lg:text-4xl font-bold">Projects</h1>
    
                <div className="flex justify-between items-center gap-4">
                  <button
                    className="btn bg-green-600 text-white font-bold text-sm lg:text-xl px-2 py-4 lg:px-3 lg:py-6"
                    onClick={() =>
                      document.getElementById("add_project_modal").showModal()
                    }
                  >
                    Add Project
                  </button>
    
                  <Link to="/project" className="">
                    <BsArrowsFullscreen size={25} />
                  </Link>
                </div>
              </nav>

              <main className='h-[80%]  overflow-y-auto'>
                <div>
                 {isLoading 
                 ? (
                  <div className='w-full h-40 flex items-center justify-center'>
                     <LoadingRingSVG />
                    </div>
                   
                    )
                  : (
                    allProjects?.slice(0,2).map((pro)=>(
                      <div key={pro._id} className='border-1 border-gray-200 px-1 py-0 md:py-2 rounded-2xl mx-1 my-3'>
                          <div className='flex justify-between items-center'>
                            <div className='flex justify-center items-center'>
                                <img className='w-13 h-13 rounded-2xl' src={pro.logo} alt={`${pro.title} logo`} />
                                <div className='p-1 flex flex-col justify-center items-start'>
                                    <h1 className='font-bold text-xl'>{pro.title}</h1>
                                    <p className='text-gray-500 text-sm flex justify-center items-center'>
                                        <span className='text-green-700 text-[16px]'>{formatDate(pro.startDate)}</span>
                                        <span className='mx-2 text-2xl'>-</span>
                                        <span className='text-red-700 text-[16px]'>{formatDate(pro.endDate)}</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                              <div className="dropdown dropdown-hover ">
                                  <div tabIndex={0} role="button" className=" m-1 p-2 relative">
                                      <IoChevronForwardOutline size={15} />
                                  </div>
                                    <ul tabIndex={0} className="dropdown-content menu fixed right-8 top-5 z-20 bg-base-100 rounded-box  p-2 shadow-sm">
                                      <li onClick={()=> dispatch(openUpdateModal(pro._id))}>
                                        <Link>Edit</Link>
                                      </li>
                                      <li onClick={()=>handleDelete(pro._id)}>
                                        <Link>Delete</Link>
                                      </li>
                                      
                                    </ul>
                              </div>
                            </div>
                          </div>
                      </div>

                    ))
                  )
                }
                </div>
              </main>
          {error && <p>{error.error}</p>}
        <AddProjectModal />
        <UpdateProjectModel />
        </section>
    </>
  )
}

export default ProjectSec
