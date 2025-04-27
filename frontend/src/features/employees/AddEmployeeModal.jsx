import React, { useState } from "react";
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation , useQueryClient} from '@tanstack/react-query'
import ValidaterYup from "../../validators/EmpValidate";
import { createEmp } from "../../components/employeeAPI";
import { LoadingSpinSVG } from "../../commen/LoadingSVG";


const AddEmployeeModal = () => {

  const [img,setImg] = useState(null)

  const{
      register,
      formState : {errors,isValid},
      setValue,
      handleSubmit,
      reset   } = useForm({
                          resolver : yupResolver(ValidaterYup),
                          mode : 'onChange'
                        })

    
  const queryClient = useQueryClient()

  const {mutate : addEmp,isPending} = useMutation({
    mutationFn : createEmp,
    onSuccess : ()=>{
      queryClient.invalidateQueries(["employees"])
      reset()
      document.getElementById("add_employee_modal").close();
    }
  })

                        
  const onSubmit = (data) => {
    addEmp({
      name: data.name,
      position: data.position,
      email: data.email,
      profileImg: img  
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
    <dialog id="add_employee_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Employee</h3>
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
                <img src={img} alt="Profile Preview" className="w-30 h-30 mt-2" />
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
             {isPending ? <LoadingSpinSVG /> : "Save"}
            </button>
            <button
              type="button"
              className="btn" 
              onClick={() =>
                document.getElementById("add_employee_modal").close()
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

export default AddEmployeeModal;
