import EmpModel from "../Models/EmpModel.js"
import { EmpYupSchema } from "../validator/YupValidater.js"
import cloudinary from 'cloudinary'

export const getAllEmps = async(req,res)=>{
    try {
        const employee = await EmpModel.find().sort({createdAt : -1})
        if(!employee){
            return res.status(404).json({error : "Employee Not Found"})
        }
        return res.status(200).json(employee)

    } catch (error) {
        console.log(`Error from getAllEmps : ${error.message}`)
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const addEmp = async(req,res)=>{
    try {
        let {name, position, email, profileImg} = req.body

        let profileCloudinaryId ;
        if(profileImg){
            const updatedProfileImg = await cloudinary.uploader.upload(profileImg,{folder : "emp-images"})

           profileImg = updatedProfileImg.secure_url
           profileCloudinaryId = updatedProfileImg.public_id
        }
        
        const checkEmail = await EmpModel.findOne({email : email})

        if(checkEmail){
            return res.status(401).json({error : "Email Already Used"})
        }

        await EmpYupSchema.validate({name, position, email, profileImg, profileCloudinaryId})

        await EmpModel.create({name,position,email,profileImg,profileCloudinaryId})

        res.status(201).json({message : "Employee Created Successfully"})

    } catch (error) {
        console.log(`Error from addEmps : ${error.message}`)
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const viewEmp = async(req,res)=>{
    try {
        const {id} = req.params
        const employee = await EmpModel.findById(id).populate({
            path : "projects",
            select : "name"
        })

        if(!employee){
            return res.status(404).json({error : "Employee Not Found"})
        }

        res.status(200).json(employee)

    } catch (error) {
        console.log(`Error from viewEmp : ${error.message}`)
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const editEmp = async(req,res)=>{
    try {
        const {id} = req.params
        let {name, position, email, profileImg} = req.body
        const emp = await EmpModel.findById({_id : id})

        if(!emp){
            res.status(404).json({error : "Employee Not Found"})
        }

        let profileCloudinaryId ;
        if(profileImg){
            if(emp.profileCloudinaryId){
                await cloudinary.uploader.destroy(emp.profileCloudinaryId)
            }

            const updatedProfileImg = await cloudinary.uploader.upload(profileImg,{folder : "emp-images"})

            profileImg = updatedProfileImg.secure_url
            profileCloudinaryId = updatedProfileImg.public_id
        }

        await EmpYupSchema.validate({name, position, email, profileImg , profileCloudinaryId})

        const checkEmail = await EmpModel.findOne({email})

        if(checkEmail && checkEmail._id.toString() !== id){
            return res.status(401).json({error : "Email Already Used"})
        }

        const updatedEmp = {name, position, email, profileImg, profileCloudinaryId}


        const employee = await EmpModel.findByIdAndUpdate({_id : id},updatedEmp, {new : true})

        if(!employee){
            return res.status(404).json({error : "Employee Not Found"})
        }

        res.status(200).json({message : "Employee Updated Successfully"})

    } catch (error) {
        console.log(`Error from addEmps : ${error.message}`)
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const deleteEmp = async(req,res)=>{
    try {
        const {id} = req.params
        
        const findEmp = await EmpModel.findById(id)
        if(!findEmp){
            res.status(404).json({error : "Employee Not Found"})
        }

        if(findEmp.profileImg && findEmp.profileCloudinaryId){
            await cloudinary.uploader.destroy(findEmp.profileCloudinaryId)
        }

        const deletedEmp = await EmpModel.findByIdAndDelete({_id : id})

        res.status(200).json({id : deletedEmp._id ,message : "Employee Deleted Successfully",})

    } catch (error) {
        console.log(`Error from deleteEmps : ${error.message}`)
        res.status(500).json({ error: "Internal Server Error" });
    }
}