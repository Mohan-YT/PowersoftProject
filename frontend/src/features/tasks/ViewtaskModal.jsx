
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import { LoadingRingSVG } from "../../commen/LoadingSVG";
import { viewTaskById } from "../../components/tasksAPI";

const ViewtaskModal = () => {
    const {taskId,viewModalOpen} = useSelector(state => state.task)
    const {data : task,isLoading,error} = useQuery({
        queryKey: ["view-task", taskId], // 🔹 unique query key
        queryFn: () => viewTaskById(taskId),
        enabled: !!taskId && viewModalOpen,
    })
   

  return (
    <>
    {   
        isLoading 
        ? (
            <div>
                <LoadingRingSVG />
            </div>
        ) 
        : (
            task &&(
            <dialog id="view_task" open={viewModalOpen} className="modal">
                <div className="modal-box flex flex-col gap-2">
                    <h1 className="w-full text-center text-3xl font-extrabold">{task?.title}</h1>
                    <p className="text-md text-gray-600 flex flex-wrap">
                        <strong>Description :</strong> {task?.description}
                    </p>

                    <p className="text-red-500 text-lg">
                        <strong className="text-gray-600">DeadLine :</strong>{task?.deadline}
                    </p>

                    <p>
                       <strong>Project :</strong> {task?.project?.title || "No Project"}
                    </p>

                    <div>
                        <strong>Assigned Employees :</strong>
                        {task?.assignedEmps?.length > 0 ? (
                        task.assignedEmps.map((t, index) => (
                            <li key={index}>{t.name}</li>
                        ))
                        ) : (
                            <p>No Employees Assigned</p>
                        )}
                    </div>
                   
                    <div >
                        <strong>Reference :</strong>
                        {task?.refImg?.length > 0 && (
                            <div className="flex flex-wrap">
                                 {task.refImg.map((i, index) => (
                                i && <img key={index} src={i.url} className="w-15 h-15" alt="reference Image" />
                                 ))}
                            </div>    
                        )}
                    </div>

                    <div className="flex">
                        <strong>Status :</strong>
                        {task?.status && task?.status === "Need To Do"
                         ? <p className="text-red-500">{task.status}</p>
                         :  task?.status === "In Progress" 
                         ? <p className="text-blue-700">{task.status}</p>
                         : <p className="text-green-700">{task.status}</p>
                         }
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            )
        )
    }
     {error && <p>{error.message}</p>}
    </>
  );
};

export default ViewtaskModal;
