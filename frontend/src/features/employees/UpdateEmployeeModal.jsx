import React, { useEffect, useState } from "react";
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation , useQueryClient} from '@tanstack/react-query'
import ValidaterYup from "../../validators/EmpValidate";
import {  updateEmpById } from "../../components/employeeAPI";
import { LoadingSpinSVG } from "../../commen/LoadingSVG";
import { useDispatch, useSelector } from "react-redux";
import { closeUpdateModal } from "../../slice/employeeSlice";


const UpdateEmployeeModal = () => {

  const [img,setImg] = useState(null)
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  const{
      register,
      formState : {errors,isValid},
      setValue,
      handleSubmit,
      reset   } = useForm({
                          resolver : yupResolver(ValidaterYup),
                          mode : 'onChange'
                        })

  const {emps,empId,updateModal} = useSelector(state => state.employee)

  const FindCurrentEmpData =  emps?.find(emp => emp._id === empId);
                      
    
  useEffect(()=>{
      if(FindCurrentEmpData){
        setValue("name",FindCurrentEmpData.name)
        setValue("position",FindCurrentEmpData.position)
        setValue("email",FindCurrentEmpData.email)
        setImg(FindCurrentEmpData.profileImg)
      }
  },[FindCurrentEmpData,setValue])
    
 
  const {mutate : updatedEmp,isPending} = useMutation({
    mutationFn : (data)=>{
      if (!empId) {
        console.error("Employee ID is missing");
        return;
      }
      return updateEmpById({id : empId,employeeNewData : data});
    },
    onSuccess : ()=>{
      queryClient.invalidateQueries(["employees"])
      reset()
      document.getElementById("update_employee_modal").close();
      
    }
  })

                        
  const onSubmit = (data) => {
    updatedEmp({
        ...data,
        profileImg : img 
    })
  }


  const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
        const uri = reader.result;
				setImg(uri);
        setValue('profileImg',uri,{shouldValidate : true})
        
			};
			reader.readAsDataURL(file);
		}
    
	};
  

  return (
    <dialog id="update_employee_modal" open={updateModal} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Employee</h3>
         <form method="dialog">
             <button 
                 onClick={()=>dispatch(closeUpdateModal())}
                 className="btn btn-sm btn-circle btn-ghost text-2xl absolute right-2 top-2">
                  ✕
            </button>
        </form>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            {...register('name')}
          />
          {errors?.name && <p>{errors.name.message}</p>}

          <input
            name="position"
            type="text"
            placeholder="Position"
            className="input input-bordered w-full"
            {...register('position')}
          />
          {errors?.position && <p>{errors.position.message}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            {...register('email')}
          />
          {errors?.email && <p>{errors.email.message}</p>}

          {img && (
            <div className="w-full flex justify-center">
                <img src={img} alt="Profile Preview" className="w-30 h-25 mt-2" />
            </div>
          )}
          <input
            name="image"  
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImgChange}
          />
          {errors?.profileImg && <p>{errors.profileImg.message}</p>}

          <div className="modal-action">
            <button disabled={!isValid} type="submit" className="btn bg-blue-600 text-white font-bold">
             {isPending ? <LoadingSpinSVG /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateEmployeeModal;
