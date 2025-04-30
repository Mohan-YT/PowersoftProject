import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {useDispatch} from 'react-redux'
import React, { useEffect } from "react";
import { BsFullscreenExit } from "react-icons/bs";
import { IoChevronDownSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { deleteEmpById, getAllEmps } from "../../components/employeeAPI";
import AddEmployeeModal from "./AddEmployeeModal";
import {LoadingRingSVG} from "../../commen/LoadingSVG";
import { openUpdateModal, openViewModal, setEmps } from "../../slice/employeeSlice";
import ViewEmployeeModel from "./ViewEmployeeModel";
import UpdateEmployeeModal from "./UpdateEmployeeModal";

const MainEmployePage = () => {

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
      <main className="w-full h-screen overflow-hidden bg-base-200 px-2 py-1">
        <h1 className="w-full h-[15%] flex justify-center items-center text-lg md:text-4xl font-bold py-5">
          Project Management Dashboard
        </h1>


        <section className="w-full h-[85%]  bg-base-100 border border-gray-300 rounded-xl overflow-hidden ">
          <nav className="h-[12%] flex justify-between items-center px-3 py-3 border-b-[0.2px] border-gray-400 sticky top-0 left-0 bg-white z-20">
            <h1 className="text-lg md:text-3xl font-bold">Employees</h1>

            <div className="flex justify-between items-center gap-4">
              <button
                className="btn bg-blue-600 text-white font-bold text-md md:text-xl px-2 py-4 md:px-3 md:py-6"
                onClick={() =>
                  document.getElementById("add_employee_modal").showModal()
                }
              >
                Add Employee
              </button>

              <Link to="/" className="">
                <BsFullscreenExit size={25} />
              </Link>
            </div>
          </nav>

          <main className="h-[100%]">
            <div className="h-full w-full overflow-x-hidden overflow-y-auto" >
              <table className="table">
                <thead className=" h-[18%] sticky top-0 left-0 bg-white border-b-2 border-gray-200 z-20">
                  <tr>
                    <th className="ps-10 text-sm md:ps-19  md:text-xl">Name</th>
                    <th className="text-center text-sm md:text-xl">Position</th>
                    <th className="md:block text-center text-xl hidden ">Email</th>
                    <th className="ps-3 md:ps-10">
                      <IoChevronDownSharp />
                    </th>
                  </tr>
                </thead>

                <tbody className="h-[85%] w-[100%] overflow-x-hidden">
                  {isLoading ? (
                    <tr>
                      <td colSpan={2}>
                         <LoadingRingSVG />
                      </td>
                    </tr>
                  ) : (
                    employees?.map((emp) => (
                      <tr key={emp._id} className="w-full">
                        <td className="ps-1 md:ps-4">
                          <div className="flex items-center gap-1 md:gap-3">
                              <div className="mask mask-squircle h-8 w-9 md:h-15 md:w-15 ">
                                <img
                                  className=" object-cover"
                                  src={emp.profileImg}
                                  alt={`${emp.name} profileImage`}
                                />
                              </div>
                              <div className="font-bold text-sm  md:text-xl">
                                {emp.name}
                                <p className=" md:hidden font-normal text-xs">{emp.email}</p>
                              </div>
                          </div>
                        </td>
                        <td className="text-center">
                               <div className="text-sm md:text-xl text-gray-600">{emp.position}</div>
                        </td>
                        <td className="text-center hidden md:inline">
                               <div className="flex justify-center items-center text-xl text-gray-600">{emp.email}</div>
                        </td>

                        <td className="ps-0 md:ps-7">
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
      </main>
    </>
  );
};

export default MainEmployePage;
