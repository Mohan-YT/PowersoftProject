import * as yup from 'yup'

const ProjectValidater = yup.object().shape({
        title : yup.string().required('Title Is Required'),
        description : yup.string().required('Description Is Required'),
        logo : yup.string().required('Logo Is Required'),

        startDate : yup.date().typeError('Pick the Start Date').required('StartDate Is Required'),

        endDate : yup
                     .date()
                     .min(yup.ref('startDate'))
                     .typeError('Pick the End Date')
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

export default ProjectValidater