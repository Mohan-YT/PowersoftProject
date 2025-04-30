import * as yup from 'yup'

const TaskValidater = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  deadline: yup.date().required("Deadline is required"),
  project: yup.string().required("Project is required"),
  assignedEmps: yup.array().of(yup.string()).min(1, "Assign at least one employee"),
  refImg: yup.array().min(1, "Select at least one reference Image"),
  status: yup.string().required("Status is required"),
})

export default TaskValidater
