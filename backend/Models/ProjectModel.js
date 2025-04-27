import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    logo : {
        type : String,
    },
    logoCloudinaryId : {
        tupe : String,
    },
    startDate : {
        type : Date,
    },
    endDate : {
        type : Date
    },
    assignedEmps : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "EmpData",
        default : [],
        }
    ]
},{timestamps : true})

const ProjectModel = mongoose.model('project',ProjectSchema)

export default ProjectModel