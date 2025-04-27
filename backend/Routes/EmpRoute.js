import express from "express"
import { addEmp, deleteEmp, editEmp, getAllEmps, viewEmp } from "../controllers/EmpController.js"

const router = express.Router()

router.get('/',getAllEmps)

router.post('/create',addEmp)
router.get('/:id',viewEmp)
router.patch('/edit/:id',editEmp)
router.delete('/delete/:id',deleteEmp)

export default router