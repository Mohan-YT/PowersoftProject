import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { LoadingSpinSVG } from '../../commen/LoadingSVG';
import TaskValidater from '../../validators/TaskValidate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllProjects } from '../../components/projectAPI';
import { createTask } from '../../components/tasksAPI';
import { FaCircleXmark } from "react-icons/fa6";


const AddTaskModal = () => {
  const [selectedProjectId,setSelectedProjectId] = useState()
  const [selectedEmps,setSelectedEmps] = useState([])
  const [img,setImg] = useState([])
  const queryClient = useQueryClient()

  const {register,handleSubmit,formState: {errors,isValid},reset,setValue,trigger,watch} = useForm({
    resolver : yupResolver(TaskValidater),
    mode : 'onChange',
  })
  // const allFields = watch();
  // console.log("All Form Fields:", allFields);


  const {data : allProjects} = useQuery({
    queryKey : ["projects"],
    queryFn : getAllProjects
  })

  const selectedProject = allProjects?.find((pro) => String(pro._id) === String(selectedProjectId));
  const getAssigedEmps = selectedProject?.assignedEmps || []
  console.log(getAssigedEmps)

  const {mutate : addTask,isPending} = useMutation({
    mutationFn : createTask,
    onSuccess : ()=>{
      queryClient.invalidateQueries(['tasks']),
      reset(),
      setSelectedProjectId(undefined)
      setSelectedEmps([])
      setImg([])
      document.getElementById("add_task_modal").close()
    }
  })

  const onSubmit = (data)=>{
    addTask({
      ...data,
      refImg : img,
      assignedEmps : selectedEmps
    })

  }

  const handleImgChange =(e)=>{
    const files = Array.from(e.target.files);
    const images = [];
  
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        images.push(reader.result);
        if(images.length === files.length){
          setImg(img => [...img, ...images]);
          setValue('refImg', images, {shouldValidate: true});
          trigger('refImg')
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const handleImg = (index)=>{
    if(img.length > 0){
      setImg(img.filter((_, i) => i !== index));
    }
  }

 
  const toggleOption =(id)=>{
    let updatedEmps;
    if(selectedEmps.includes(id)){
      updatedEmps = selectedEmps.filter((empId)=> empId !== id)
    }else{
      updatedEmps = [...selectedEmps,id]
    }
    setSelectedEmps(updatedEmps)
    setValue('assignedEmps', updatedEmps, { shouldValidate: true });
  }

  return (
    <dialog id="add_task_modal" className="modal">
         <div className="modal-box">
           <h3 className="font-bold text-lg mb-4">Add New Task</h3>
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <input
               name="title"
               type="text"
               placeholder="Title"
               className="input input-bordered w-full"
               {...register("title")}
             />
             {errors?.title && <p>{errors.title.message}</p>}


   
             <input
               name="description"
               type="text"
               placeholder="Description"
               className="input input-bordered w-full"
               {...register("description")}
             />
             {errors?.description && <p>{errors.description.message}</p>}

   

             <input
               name="deadline"
               type="date"
               id="deadline"
               className="input input-bordered w-full text-left  "
               {...register("deadline")}
               onChange={(e) => setValue('deadline', e.target.value, { shouldValidate: true })}
             />
             {errors?.deadline && <p>{errors.deadline.message}</p>}



             <select className='input input-bordered w-full'
             {...register("project")} onChange={(e) => {
                setSelectedProjectId(String(e.target.value));
                console.log(selectedProjectId)
                setValue('project', e.target.value);
              }}>
             <option value="">Select a Project</option>
                {allProjects?.map((pro)=>(
                  <option key={pro._id} value={pro._id} >{pro.title}</option>
                ))}
             </select>
             {errors?.project && <p>{errors.project.message}</p>}



              {
                selectedProjectId && 
                <div className="flex flex-col gap-2 max-h-20 overflow-auto">
                {getAssigedEmps?.map((emp) => (
                  <label
                    key={emp._id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                      selectedEmps.includes(emp._id) ? "bg-blue-500 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => {
                      toggleOption(emp._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmps.includes(emp._id)}
                      readOnly
                      className="checkbox checkbox-primary"
                    />
                    {emp.name}
                  </label>
                ))}
              </div>
              }
   
             {errors?.assignedEmps && <p className="text-red-500">{errors.assignedEmps.message}</p>}



               {img && ( 
                <div className='flex gap-2 '>
                  {img?.slice(0,5).map((i,index)=>(
                    <div key={index} className='relative w-20 h-20 border border-gray-400 p-2 rounded-md flex justify-center items-center'>
                        <img src={i} alt='task reference image' />
                        <FaCircleXmark size={23} onClick={()=>handleImg(index)} className='object-cover absolute top-1 right-1 bg-white text-black font-extrabold rounded-full' />
                    </div>
                  ))}
                </div>
               ) }

             <input
               name="refImg"
               type="file"
               multiple
               accept="image/*"
               className="file-input file-input-bordered w-full"
               onChange={handleImgChange}
             />
             {errors?.logo && <p>{errors.logo.message}</p>}



              <select name="" id="" className='input file-input-bordered w-full' {...register('status')}>
              <option value="">Select Status</option>
                <option value="Need To Do">Need To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors?.status && <p>{errors.status.message}</p>}


   
             <div className="modal-action">
               <button
                 disabled={!isValid}
                 type="submit"
                 className="btn bg-blue-600 text-white font-bold"
               >
                 {isPending ? <LoadingSpinSVG /> : "Save"}
               </button>
               <button
                 type="button"
                 className="btn"
                 onClick={() =>
                   document.getElementById("add_task_modal").close()
                 }
               >
                 Cancel
               </button>
             </div>
           </form>
         </div>
    </dialog>
  )
}

export default AddTaskModal
