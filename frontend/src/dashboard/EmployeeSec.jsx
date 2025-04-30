import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoChevronDownSharp } from "react-icons/io5";
import AddEmployeeModal from "../features/employees/AddEmployeeModal";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { deleteEmpById,getAllEmps } from "../components/employeeAPI";
import {LoadingRingSVG} from "../commen/LoadingSVG";

import {useDispatch} from 'react-redux'
import { openUpdateModal, openViewModal, setEmps } from "../slice/employeeSlice";
import UpdateEmployeeModal from "../features/employees/UpdateEmployeeModal";
import ViewEmployeeModel from "../features/employees/ViewEmployeeModel";


const EmployeeSec = () => {

  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const {data : employees, isLoading, error} = useQuery({  
    queryKey: ['employees'],
    queryFn: getAllEmps,
  })

 
  const {mutate : deleteEmp} = useMutation({
    mutationFn : (id)=> deleteEmpById(id),
    onSuccess : (_, id)=>{
      queryClient.invalidateQueries(['employees'])

      queryClient.setQueryData(["employees"], (oldEmp) => {
        if(!oldEmp) return [] 
				return oldEmp.filter(emp => emp._id !== id );
    })
    
  }
  })

  const handleDelete = (id)=>{
      const isConfirm = window.confirm("Are you sure you want to delete?")
      if(isConfirm){
        deleteEmp(id)
      }
  }

  useEffect(()=>{
    dispatch(setEmps(employees))
  },[employees,dispatch])


  return (
  
     <>
    
            <section className="p-1 h-[50vh]  md:p-1 md:w-[48vw] md:h-[40vh] bg-base-100 border border-gray-300 rounded-xl overflow-hidden  my-1 mx-3 md:m-2 mb-3">
              <nav className=" flex justify-between items-center px-2 py-3 border-b-[0.2px] border-gray-400">
                <h1 className="text-xl lg:text-4xl font-bold">Employees</h1>
    
                <div className="flex justify-between items-center gap-2 md:gap-4">
                  <button
                    className="btn bg-blue-600 text-white font-bold text-sm lg:text-xl px-2 py-4 lg:px-3 lg:py-6"
                    onClick={() =>
                      document.getElementById("add_employee_modal").showModal()
                    }
                  >
                    Add Employee
                  </button>
    
                  <Link to="/employee" className="">
                    <BsArrowsFullscreen size={25} />
                  </Link>
                </div>
              </nav>
    
              <main className="h-[80%]">
                <div className="w-full h-[100%] overflow-y-auto" >
                  <table className=" table relative flex justify-center items-center">

                    <thead className="h-[7%] md:h-[15%]  sticky top-0 left-0 bg-white z-20">
                      <tr>
                        <th className="ps-19">Name</th>
                        <th className="flex justify-end pe-8"><IoChevronDownSharp /></th>
                      </tr>
                    </thead>
    
                    <tbody className="h-[85%] w-full">
                      {isLoading ? (
                        <tr>
                          <td>
                            <div className="w-80 h-30 flex justify-center items-center">
                                <LoadingRingSVG />
                            </div>
                            
                          </td>
                        </tr>
                      ) : (
                        employees?.slice(0,2).map((emp) => (
                          <tr key={emp._id} className="w-full">
                             <td>
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    <div className="mask mask-squircle h-13 w-13">
                                      <img

                                        src={emp.profileImg}
                                        alt={`${emp.name} profileImage`}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                      <div className="font-bold text-md md:text-xl">{emp.name}</div>
                                      <div className=" text-sm md:text-lg">{emp.position}</div>
                                  </div>
                                </div>
                              </td>
            
                              <td className="flex justify-end pe-6">
                                <ul className="menu menu-horizontal px-1">
                                  <li>
                                    <details>
                                      <summary className=""></summary>
                                      <ul className="bg-white-100 rounded-t-none p-2 w-20 fixed right-8 top-[-5px] z-20">
                                        <li onClick={()=> dispatch(openViewModal(emp._id))}>
                                          <Link>View</Link>
                                        </li>
                                        <li onClick={()=> dispatch(openUpdateModal(emp._id))}>
                                          <Link >Edit</Link>
                                        </li>
                                        <li>
                                          <Link onClick={()=>handleDelete(emp._id)}>Delete</Link>
                                        </li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {error && <div>{error.error}</div>}
                </div>
              </main>
              {/* Models */}
              <AddEmployeeModal />
              <ViewEmployeeModel />
              <UpdateEmployeeModal />
            </section>
        </>
  );
};

export default EmployeeSec;
