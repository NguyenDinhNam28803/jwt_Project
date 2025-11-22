import { Router } from 'express'
import TodoControllers from '../controllers/Todo.controllers'

const router = Router()

router.get('/todos', TodoControllers.getTodoList)
router.post('/todos', TodoControllers.createTodo)
router.get('/user/todos', TodoControllers.getTodosByUser)
router.put('/todos/:id', TodoControllers.updateTodo)
router.delete('/todos/:id', TodoControllers.deleteTodo)

export default router
