import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title : {
        type : String
    },
    description : {
        type : String
    },
    assignedEmps : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "EmpData",
            default : []
        }
    ],
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "project"
    },
    deadline : {
        type : Date
    },
    refImg : [
        {
            url : {type :String},
            public_id : {type :String}
        }
    ],
    status: {
        type: String,
        enum: ["Need To Do", "In Progress", "Completed",],
        default: "Need to Do",
      },
},{timestamps : true})

const TaskModel = mongoose.model('Task',TaskSchema)
export default TaskModel;