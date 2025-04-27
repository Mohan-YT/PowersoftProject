import * as Yup from 'yup'

const ValidaterYup = Yup.object().shape({
    name : Yup
            .string()
            .required('name Is Required'),
    position : Yup 
                .string()
                .required('Postion Is Required'),
    email : Yup
               .string()
               .required('Email Is Required'),
    profileImg: Yup
                .string()
                .required('Profile Image is required')
})

export default ValidaterYup