import TaskModel from "../Models/TaskModel.js"
import { TaskSchema } from "../validator/YupValidater.js"
import cloudinary from "cloudinary"

export const allTasks = async (req,res)=>{
    try {
        const {project} = req.query
        let FilteredProject = {} 
        if(project){
            FilteredProject.project = project
        }

        const task = await TaskModel.find(FilteredProject)
                                    .populate({
                                        path : "assignedEmps",
                                        select : ["name","position"]
                                    })
                                    .populate({
                                        path : "project",
                                        select : "title"
                                    })
                                    .sort({createdAt : -1})
        if(!task){
            return res.status(404).json({error : "Task Not Found"})
        }
        return res.status(200).json(task)

    } catch (error) {
        console.log(`Error from allTasks : ${error.message}`)
        return res.status(500).json({error : "Internal Server Error"})
    }
}


export const CreateTask = async (req,res)=>{
    try {
        const {title, description, assignedEmps,project, deadline, refImg, status} = req.body

        let refImgArray = []
        if(Array.isArray(refImg)){
            for(let img of refImg){
                const uploadedImg = await cloudinary.uploader.upload(img,{folder : "task-images"})
                refImgArray.push({
                    url : uploadedImg.secure_url,
                    public_id : uploadedImg.public_id
                })
            }
        }

        await TaskSchema.validate({title, description, assignedEmps,project, deadline, refImg : refImgArray, status})

        await TaskModel.create({title, description, assignedEmps,project, deadline, refImg : refImgArray, status})

        return res.status(200).json({message : "Task Created Successfully"})

    } catch (error) {
        console.log(`Error from CreateTask : ${error.message}`)
        return res.status(500).json({error : "Internal Server Error"})
    }
}


export const viewTask = async (req,res)=>{
    try {  
        const {id} = req.params
        const task = await TaskModel.findById(id)
                                    .populate({
                                        path : "assignedEmps",
                                        select : ["name","position"]
                                    })
                                    .populate({
                                        path : "project",
                                        select : "title"
                                    })

        if(!task){
            return res.status(404).json({error : "Task Not Found"})
        }
        
        return res.status(200).json(task)

    } catch (error) {
        console.log(`Error from viewTask : ${error.message}`)
        return res.status(500).json({error : "Internal Server Error"})
    }
}


export const editTask = async (req,res)=>{
    try {
        const {id} = req.params
        const {title, description, assignedEmps,project, deadline, refImg, status} = req.body

        const findTask = await TaskModel.findById(id);

        if (!findTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        let newRegImgs = []

        const takeNotDelImg = refImg?.filter(img => img?.public_id) || []

        const findDelImg = findTask.refImg.filter((oldImg)=>{
           return !takeNotDelImg.some(img => img.public_id === oldImg.public_id)
        })

        for(let img of findDelImg){
            await cloudinary.uploader.destroy(img.public_id)
        }

        newRegImgs = [...takeNotDelImg]

        for(let img of refImg){
            if(!img.public_id){
                try {
                    const uploaded = await cloudinary.uploader.upload(img, { folder: "task-images" });
                    newRegImgs.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
                } catch (uploadErr) {
                    console.error(`Cloudinary upload failed for ${img}:`, uploadErr.message);
                }
            }
        }
        

        await TaskSchema.validate({
            title, description, assignedEmps, project, deadline,
            refImg: newRegImgs, status
          });

        const updatedTask = {title, description, assignedEmps,project, deadline, refImg : newRegImgs , status}

        const updated = await TaskModel.findByIdAndUpdate(id, updatedTask, { new: true });

        return res.status(200).json({ message: "Task updated successfully", updatedTask: updated });

    } catch (error) {
        console.error(`Error from editTask : ${error.message}`)
        return res.status(500).json({error : error})
    }
}


export const deleteTask = async (req,res)=>{
    try {
        const {id} = req.params
        const findTask = await TaskModel.findById(id)
        if(!findTask){
            return res.status(404).json({error : "Task Not Found"})
        }

        for(let img of findTask.refImg || []){
            if(img.public_id){
                await cloudinary.uploader.destroy(img.public_id)
            }
        }

        await TaskModel.findByIdAndDelete(id)
        
        res.status(200).json({message : "Task Deleted Successfully"})

    } catch (error) {
        console.log(`Error from deleteTask : ${error.message}`)
        return res.status(500).json({error : "Internal Server Error"})
    }
}