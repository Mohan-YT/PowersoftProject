import * as yup from 'yup'

export const EmpYupSchema = yup.object().shape({
    name: yup
            .string()
            .required('name is required'),

    position: yup
                .string()
                .required('position is required'),
    email: yup
            .string()
            .email('enter a valid email')
            .required('position is required'),
    profileImg: yup
                .string()
                .url('enter currect url')
                .required('profile image is required'),
    profileCloudinaryId : yup.string().required('Cloudinary Id required')
})



export const ProjectSchema = yup.object().shape({
        title : yup.string().required('Title Is Required'),
        description : yup.string().required('Description Is Required'),
        logo : yup.string().url('enter currect url').required('Logo Is Required'),
        logoCloudinaryId : yup.string().required('cloudinary id required'),
        startDate : yup.date().required('StartDate Is Required'),

        endDate : yup
                     .date()
                     .min(yup.ref('startDate'))
                     .required('EndDate Is Required'),

        assignedEmps : yup
                        .array()
                        .of(yup.string())
                        .min(1, 'At least one employee must be assigned')
                        .test('unique','Please Avoid Duplicate Employee',(value)=>{
                                return Array.isArray(value) && new Set(value).size === value.length
                        })
                        .required('At least one employee must be assigned')

})  



export const TaskSchema = yup.object().shape({
        title : yup.string().required('Title Is Required') ,
        description : yup.string().required("Description Is Required"),
        assignedEmps : yup
                        .array()
                        .of(yup.string())
                        .min(1, 'At least one employee must be assigned')
                        .test('unique','Please Avoid Duplicate Employee',(value)=>{
                                return Array.isArray(value) && new Set(value).size === value.length
                        })
                        .required("At least one employee must be assigned"),
         
        project : yup.string().required("Project is Required"),
        deadline : yup.date().required("End Date Is Required"),
        refImg : yup
                   .array()
                   .of(yup.object().shape({
                                        url: yup.string().required("Image URL is required"),
                                        public_id: yup.string().required("Image public_id is required"),
                                         })
                    )
                   .required('Reference Image Is Required'),

        status : yup.string().required("Status Is Required")
})
