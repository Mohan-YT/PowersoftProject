import express from "express"
import { allTasks, CreateTask, deleteTask, editTask, viewTask } from "../controllers/TaskController.js"

const router = express.Router()

router.get('/',allTasks)

router.post('/create',CreateTask)
router.get('/:id',viewTask)
router.patch('/edit/:id',editTask)
router.delete('/delete/:id',deleteTask)


export default router