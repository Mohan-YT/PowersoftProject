import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ProjectValidater from '../../validators/ProjectValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateProjectById } from '../../components/projectAPI';
import { closeUpdateModal } from '../../slice/projectSlice';
import { getAllEmps } from '../../components/employeeAPI';
import { LoadingSpinSVG } from '../../commen/LoadingSVG';

const UpdateProjectModel = () => {
  
  const [img,setImg] = useState(null)
  const [selectedEmps, setSelectedEmps] = useState([]);
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  const{
      register,
      formState : {errors,isValid},
      setValue,
      handleSubmit,
      reset   } = useForm({
                          resolver : yupResolver(ProjectValidater),
                          mode : 'onChange'
                        })

  const {projects,proId,updateModal} = useSelector(state => state.project)
  const { data: emps } = useQuery(
    {
      queryKey :["employees"],
      queryFn : getAllEmps

    });
    
  const FindCurrentProjectData =  projects?.find(emp => emp._id === proId);
                      
    
  useEffect(() => {
    if (FindCurrentProjectData) {
      setValue('title', FindCurrentProjectData.title);
      setValue('description', FindCurrentProjectData.description);
      setValue('startDate', FindCurrentProjectData.startDate);
      setValue('endDate', FindCurrentProjectData.endDate);
      const assignedIds = FindCurrentProjectData.assignedEmps?.map(emp => emp._id) || [];
      setSelectedEmps(assignedIds);
      setValue('assignedEmps', assignedIds);
      setImg(FindCurrentProjectData.logo || null);
    }
  }, [FindCurrentProjectData, setValue]);

 
  const {mutate : updatedProject,isPending} = useMutation({
    mutationFn : (data)=>{
      if (!proId) {
        console.error("Employee ID is missing");
        return;
      }
      return updateProjectById({id : proId,newUpdatedProject : data});
    },
    onSuccess : ()=>{
      queryClient.invalidateQueries(["projects"])
      reset()
      dispatch(closeUpdateModal())
      document.getElementById("update_project_modal").close();
      
    }
  })

                        
  const onSubmit = (data) => {
    updatedProject({
        ...data,
        logo : img 
    })
  }


  const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
        const uri = reader.result;
				setImg(uri);
        setValue('logo',uri,{shouldValidate : true})
        
			};
			reader.readAsDataURL(file);
		}
	};

  const toggleOption = (id) => {
    let updatedSelectedEmps;
    if (selectedEmps.includes(id)) {
      updatedSelectedEmps = selectedEmps.filter(empId => empId !== id);
    } else {
      updatedSelectedEmps = [...selectedEmps, id];
    }
    setSelectedEmps(updatedSelectedEmps);
    setValue('assignedEmps', updatedSelectedEmps, { shouldValidate: true });
  };


  return (
   <dialog id="update_project_modal" open={updateModal} className="modal">
         <div className="modal-box">
           <h3 className="font-bold text-lg mb-4">Update Project</h3>
           <form method="dialog">
              <button 
                 onClick={()=>dispatch(closeUpdateModal())}
                 className="btn btn-sm btn-circle btn-ghost text-2xl absolute right-2 top-2">
                  ✕
              </button>
            </form>

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
               type="date"
               id="startDate"
               {...register('startDate')}
               className="input input-bordered w-full text-left "
               onChange={(e) => setValue('startDate', e.target.value, { shouldValidate: true })}
             />
             {errors?.startDate && <p>{errors.startDate.message}</p>}
   
             <input
               name="endDate"
               type="date"
               id="endDate"
               className="input input-bordered w-full text-left  "
               {...register("endDate")}
               onChange={(e) => setValue('endDate', e.target.value, { shouldValidate: true })}
             />
             {errors?.endDate && <p>{errors.endDate.message}</p>}
   
             <div className="flex flex-col gap-2 h-20 overflow-auto">
               {emps?.map((emp) => (
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
   
             {errors?.assignedEmps && <p className="text-red-500">{errors.assignedEmps.message}</p>}
   
             {img && (
               <div className="w-full flex justify-center">
                 <img src={img} alt="Profile Preview" className="w-30 h-30 mt-2" />
               </div>
             )}
             <input
               name="logo"
               type="file"
               accept="image/*"
               className="file-input file-input-bordered w-full"
               onChange={handleImgChange}
             />
             {errors?.logo && <p>{errors.logo.message}</p>}
   
             <div className="modal-action">
               <button
                 disabled={!isValid}
                 type="submit"
                 className="btn bg-blue-600 text-white font-bold"
               >
                 {isPending ? <LoadingSpinSVG /> : "Save"}
               </button>
             </div>
           </form>
         </div>
       </dialog>
  )
}

export default UpdateProjectModel
