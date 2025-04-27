import ProjectModel from "../Models/ProjectModel.js"
import { ProjectSchema } from "../validator/YupValidater.js"
import cloudinary from 'cloudinary'

export const getAllProject = async(req,res)=>{
    try {
        const allProject = await ProjectModel.find().populate({
            path : "assignedEmps",
            select : ["-email","-profileCloudinaryId","-createdAt","-updatedAt"]
        }).sort({createdAt : -1})

        if (!allProject || allProject.length === 0) {
            return res.status(404).json({ error: "Project Not Found" });
        }
        
        return res.status(200).json(allProject)

    } catch (error) {
        console.log(`Error from getAllProject: ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }

}



export const createProject = async(req,res)=>{
    try {
        let {title,description,logo,startDate,endDate,assignedEmps} = req.body

        const existProject = await ProjectModel.findOne({title})
        if(existProject){
            return res.status(401).json({error : "Project Already Exisiting"})

        }else{

            let logoCloudinaryId ;
            if(logo){
                const uploadedLogo = await cloudinary.uploader.upload(logo,{folder : "project-images"})
                logo = uploadedLogo.secure_url
                logoCloudinaryId = uploadedLogo.public_id
            }
    
            await ProjectSchema.validate({title,description,logo,logoCloudinaryId,startDate,endDate,assignedEmps})
    
            await ProjectModel.create({title,description,logo,logoCloudinaryId,startDate,endDate,assignedEmps})
    
            res.status(200).json({message : "Project Created Successfully"})    
        }

 
    } catch (error) {
        console.log(`Error from createProject: ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}


export const viewProject = async(req,res)=>{
    try {

        const {id} = req.params
        const project = await ProjectModel.findById(id).populate({
            path : "assignedEmps",
            select : ["-email","-profileCloudinaryId","-createdAt","-updatedAt"]
        })

        if(!project){
            res.status(404).json({error : "Project Not Found"})
        }

       return res.status(200).json(project)

    } catch (error) {
        console.log(`Error from viewProject: ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}


export const updateProject = async(req,res)=>{
    try {
        const {id} = req.params
        let {title,description,logo,startDate,endDate,assignedEmps} = req.body
        const project = await ProjectModel.findById(id)

        let logoCloudinaryId = project.logoCloudinaryId;
        let logoUrl = project.logo;

        if (logo) {
        if (logoCloudinaryId) {
            await cloudinary.uploader.destroy(logoCloudinaryId);
        }
        const newLogo = await cloudinary.uploader.upload(logo, { folder: "project-images" });
        logoUrl = newLogo.secure_url;
        logoCloudinaryId = newLogo.public_id;
        }

        await ProjectSchema.validate({title,description,logo :logoUrl,logoCloudinaryId,startDate,endDate,assignedEmps})

        const updatedProject = {title,description,logo :logoUrl,logoCloudinaryId,startDate,endDate,assignedEmps}
        
        await ProjectModel.findByIdAndUpdate(id,updatedProject,{new:true,runValidators: true,})

        return res.status(200).json({message : "Project Updated Successfully"})

    } catch (error) {
        console.log(`Error from updateProject: ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



export const deleteProject = async(req,res)=>{
    try {
        const {id} = req.params
        const FindProject = await ProjectModel.findById(id)

        if(FindProject){
            if(FindProject.logo && FindProject.logoCloudinaryId){
                await cloudinary.uploader.destroy(FindProject.logoCloudinaryId)
            }
        }else{
            res.status(404).json({error : "Project Not Found"})
        }

        await ProjectModel.findByIdAndDelete(id)
        
        return res.status(200).json({message : "Project Deleted Successfully"})
        
    } catch (error) {
        console.log(`Error from deleteProject: ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



