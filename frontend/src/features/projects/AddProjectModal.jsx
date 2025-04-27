import React, { useState } from "react";
import { LoadingSpinSVG } from "../../commen/LoadingSVG";
import { useSelector } from "react-redux";
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation , useQueryClient} from '@tanstack/react-query'
import ProjectValidater from "../../validators/ProjectValidate";
import { createProject } from "../../components/projectAPI";

const AddProjectModal = () => {
  
  const [img,setImg] = useState()
  const queryClient = useQueryClient()
  const [selectedEmps,setSelectedEmps] = useState([])
  const {emps} = useSelector((state)=>state.employee)

  const {register,
         formState : {errors,isValid},
         setValue,
         handleSubmit,
         reset} = useForm({
                resolver : yupResolver(ProjectValidater),
                mode : 'onChange'
              })
  
   const {mutate : projectData,isPending} = useMutation({
    mutationFn : createProject,
    onSuccess : ()=>{
      queryClient.invalidateQueries(["projects"])
      reset()
      setImg(undefined);        
      setSelectedEmps([]); 
      document.getElementById("add_project_modal").close();
    }
   })

   const onSubmit = (data)=>{
    if(!data) return ;
      projectData({
        ...data,
        logo : img,
        assignedEmps: selectedEmps,
      })
   }

   const handleImgChange =(e)=>{
    const file = e.target.files[0]
    if(file){
      const reader = new FileReader()
      reader.onload = ()=>{
        const uri = reader.result
        setImg(uri);
        setValue('logo',uri,{shouldValidate : true})
      }
      reader.readAsDataURL(file)
    }
   }
        
  const toggleOption = (id)=>{
    let updatedSelectedEmps;
    if (selectedEmps.includes(id)) {
      updatedSelectedEmps = selectedEmps.filter(empId => empId !== id);
    } else {
      updatedSelectedEmps = [...selectedEmps, id];
    }
    setSelectedEmps(updatedSelectedEmps);
    setValue('assignedEmps', updatedSelectedEmps, { shouldValidate: true });
  }

  return (
    <dialog id="add_project_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Project</h3>
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
            <button
              type="button"
              className="btn"
              onClick={() =>
                document.getElementById("add_project_modal").close()
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddProjectModal;
