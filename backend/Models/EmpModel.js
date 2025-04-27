import mongoose from "mongoose";

const EmpSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    position : {
        type : String,
    },
    email : {
        type : String,
        unique : true
    },
    profileImg : {
        type : String,
    },
    profileCloudinaryId : {
        type : String,
    },
    projects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "project"
    }]

},{timestamps : true});


const EmpModel = mongoose.model('EmpData',EmpSchema);
export default EmpModel;