import { Router } from 'express'
import TodoControllers from '../controllers/Todo.controllers'

const router = Router()

router.get('/todos', TodoControllers.getTodoList)
router.post('/todos', TodoControllers.createTodo)
router.get('/user/todos', TodoControllers.getTodosByUser)

export default router
