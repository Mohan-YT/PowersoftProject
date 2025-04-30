import React, { useEffect, useMemo, useState } from "react";
import {useSelector} from 'react-redux'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { editTaskById } from "../../components/tasksAPI";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TaskValidater from "../../validators/TaskValidate";
import { getAllProjects } from "../../components/projectAPI";
import { FaCircleXmark } from "react-icons/fa6";
import { LoadingRingSVG, LoadingSpinSVG } from "../../commen/LoadingSVG";

const UpdateTaskModal = () => {
  const queryClient = useQueryClient()
  const [selectedProjectId,setSelectedProjectId] = useState()
  const [img,setImg] = useState([])
  const [assEmps,setAssEmps] = useState([])
  const {tasks,taskId,updateModelOpen} = useSelector(state => state.task)

  if(!tasks){
    console.log('task not found')
  }

  const {register,setValue,formState : {isValid,errors},reset,handleSubmit} = useForm({
    resolver : yupResolver(TaskValidater),
    mode : 'onChange'
  })

  const currentTask = useMemo(() => {
    return tasks?.find((t) => t._id === taskId);
  }, [taskId, tasks]);
  
  // console.log("Updating task with ID: ", taskId);

  useEffect(() => {
    if (currentTask) {
      setValue("title", currentTask.title);
      setValue("description", currentTask.description);
      setValue("deadline", currentTask.deadline?.slice(0, 10));
      setValue("project", currentTask.project?._id);
      setValue("status", currentTask.status);
      setAssEmps(currentTask.assignedEmps?._id || []);
      setValue("assignedEmps", currentTask.assignedEmps._id || []);
     
      const referenceImg = currentTask.refImg.map((i)=>i.url) || []
      setValue("refImg", referenceImg || [], { shouldValidate: true });
      setImg(referenceImg || []);
      // console.log("setValue refimg",referenceImg)
    }
  }, [currentTask, setValue]);

  const {data : allProjects,isLoading} = useQuery({
    queryKey : ['projects'],
    queryFn : getAllProjects
  })

  useEffect(() => {
    if (currentTask?.project?._id) {
      setSelectedProjectId(currentTask.project._id);
    }
  }, [currentTask]);
  
  // const filterProjects = allProjects.filter((p)=> p._id !== currentTask.project._id) || []

  const selectedProject = allProjects?.find(p => p._id === selectedProjectId);
  const getAssignedEmps = selectedProject?.assignedEmps || [];


  const {mutate : editTask,isPending} = useMutation({
    mutationFn: (data) => {
      if (!taskId) {
        console.error("taskId is missing");
        return;
      }
      return editTaskById({ id: taskId, updatedTask: data });
    },
      onSuccess : ()=>{
        queryClient.invalidateQueries(['tasks']),
        reset()
        document.getElementById("update_task_modal").close()
      }
  })

  const onSubmit = (data) => {
    const safeData = {
      ...data,
      assignedEmps: assEmps || [],
      refImg: img || [],
    };
  
    // console.log("Final submitted data:", safeData);
    editTask(safeData);
  };

  
  const handleImgChange = (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...img, reader.result];
      setImg(updated);
      setValue("refImg", updated, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  });
  };

  

  const handleImg = (index) => {
    const updatedImg = img.filter((_, i) => i !== index);
    setImg(updatedImg);
    setValue("refImg", updatedImg, { shouldValidate: true }); 
    console.log("updatedImage",updatedImg)
  };

 
  const toggleOption = (id) => {
    console.log("ass id ", id)
    let updatedEmps;
    if (assEmps.includes(id)) {
      updatedEmps = assEmps.filter((empId) => empId !== id);
    } else {
      updatedEmps = [...assEmps, id];
    }
    setAssEmps(updatedEmps);
    console.log("updatedEmps",updatedEmps)
    setValue("assignedEmps", updatedEmps, { shouldValidate: true });
  };

  useEffect(() => {
    if (!updateModelOpen) {
      setSelectedProjectId(null)
    }
  }, [updateModelOpen])
  

  return (
    <dialog id="update_task_modal" open={updateModelOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Update Task</h3>
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
            onChange={(e) =>
              setValue("deadline", e.target.value, { shouldValidate: true })
            }
          />
          {errors?.deadline && <p>{errors.deadline.message}</p>}

            <select
                className="input input-bordered w-full"
                {...register("project")}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedProjectId(value);
                  setValue("project", value);
                }}
            >
            <option value=''> select a project</option>

            { isLoading 
            ? <option>Loading...</option>
            : (
              allProjects?.map((pro) => (
                <option
                className={`${pro._id === currentTask?.project?._id ? "bg-blue-600 text-white" : ""}`}
                   key={pro._id}
                   value={pro._id}
                >
                   {pro.title}
               </option>
   
               ))
            )
            
           }
          </select>
          {errors?.project && <p>{errors.project.message}</p>}

          {selectedProjectId && getAssignedEmps && (
            <div className="flex flex-col gap-2 max-h-20 overflow-auto">
              {getAssignedEmps?.map((emp) => (
                <label
                  key={emp._id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    assEmps.includes(emp._id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => {
                    toggleOption(emp._id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={assEmps.includes(emp._id)}
                    readOnly
                    className="checkbox checkbox-primary"
                  />
                  {emp.name}
                </label>
              ))}
            </div>
          )}

          {errors?.assignedEmps && (
            <p className="text-red-500">{errors.assignedEmps.message}</p>
          )}

          {img && (
            <div className="flex gap-2 ">
              {img?.slice(0, 5).map((i, index) => (
                <div
                  key={index}
                  className="relative w-25 h-25 border border-gray-400 p-2 rounded-md flex justify-center items-center"
                >
                  <img src={i} className="w-20 h-20" alt="task reference image" />
                  <FaCircleXmark
                    size={23}
                    onClick={() => handleImg(index)}
                    className="object-cover absolute top-1 right-1 bg-white text-black font-extrabold rounded-full"
                  />
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImgChange}
          />

          {errors?.refImg && <p>{errors.refImg.message}</p>}

          <select
            name=""
            id=""
            className="input file-input-bordered w-full"
            {...register("status")}
          >
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
              onClick={() =>{ reset(), document.getElementById("update_task_modal").close()}}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateTaskModal;
