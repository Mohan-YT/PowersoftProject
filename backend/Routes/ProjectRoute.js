import express from 'express'
import { createProject, deleteProject, getAllProject, updateProject, viewProject } from '../controllers/ProjectController.js'

const router = express.Router()

router.get('/',getAllProject)

router.post('/create',createProject)
router.get('/:id',viewProject)
router.patch('/edit/:id',updateProject)
router.delete('/delete/:id',deleteProject)

export default router;