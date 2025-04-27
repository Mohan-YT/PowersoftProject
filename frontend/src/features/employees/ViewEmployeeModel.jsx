import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmpById, getEmpById } from "../../components/employeeAPI";
import { closeViewModal, openUpdateModal } from "../../slice/employeeSlice";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

const ViewEmployeeModel = () => {
  const { empId, viewModal } = useSelector((state) => state.employee);
  const queryClient = useQueryClient()

  const dispatch = useDispatch()



  const {data: empData,isLoading,error,} = useQuery(
        {
            queryKey: ["employee", empId],
            queryFn: ()=> getEmpById(empId),
            enabled: !!empId,
        }
  );


  const {mutate : deleteEmpt} = useMutation({
    mutationFn : (id)=> deleteEmpById(id),
    onSuccess : (_,id)=>{
      queryClient.invalidateQueries(["employees"])
      queryClient.setQueryData(["employees"], (oldEmp) => {
        if(!oldEmp) return [] 
				return oldEmp.filter(emp => emp._id !== id );
    })
    
    }

})
const handleDelete = ()=>{
  if(!empId){
    console.log('not get emp Id')
    return ;
  }
  const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
                    
      if (isConfirmed) {
        deleteEmpt(empId);
        console.log(empId)
        dispatch(closeViewModal())
      }
}
        


  return (
    <>
      <dialog id="view_emp" open={viewModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button 
                onClick={()=>dispatch(closeViewModal())}
                className="btn btn-sm btn-circle btn-ghost text-2xl absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : empData ? (
              <div className="flex flex-col justify-center items-center">
                <img
                  src={empData.profileImg}
                  alt={`${empData.name} profile`}
                  className="w-25 h-25 object-cover rounded-4xl"
                />
                <h2 className="font-bold text-4xl pb-6"> {empData.name}</h2>
                <div className="flex flex-col justify-star text-2xl gap-2">
                    <p><strong>Position: </strong>{empData.position}</p>
                    <p><strong>Email:</strong> {empData.email}</p>
                    <p>
                      <strong>Projects:</strong>
                      {empData.projects?.length > 0 ? (
                        empData.projects.map((pro) => (
                          <span key={pro._id}>{pro.name}, </span>
                        ))
                      ) : (
                        <span>No Project Assigned</span>
                      )}
                    </p>
                </div>

                <div className="w-full pt-5 pe-4 flex justify-end gap-4">
                  <button 
                      onClick={()=> {
                        dispatch(closeViewModal())
                        dispatch(openUpdateModal(empData._id))
                      }}
                      className=" w-12 h-12 flex justify-center items-center bg-gray-100 text-xl font-bold rounded-xl">
                      <FiEdit size={30} />
                  </button>
                  <button 
                        onClick={handleDelete}
                        className="w-12 h-12 flex justify-center items-center bg-gray-100 text-xl font-bold rounded-xl">
                      <FaRegTrashAlt size={30} />
                  </button>
                </div>
                
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ViewEmployeeModel;
