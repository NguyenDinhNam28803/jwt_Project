import { Request, Response } from 'express'
import TodoServices from '~/services/Todo.services'

export const getTodoList = async (req: Request, res: Response) => {
  try {
    const todos = await TodoServices.getTodoList()
    res.status(200).json({
      success: true,
      todos
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Get Todo List error:', message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, completed } = req.body
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID missing'
      })
    }
    const todoData = {
      title,
      description,
      completed: completed || false,
      userId
    }
    const todo = await TodoServices.createTodo(todoData)
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Create Todo error:', message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const getTodosByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID missing'
      })
    }
    const todos = await TodoServices.getTodosByUserId(String(userId))
    res.status(200).json({
      success: true,
      todos
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Get Todos By User error:', message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id
    const updates = req.body
    if (!todoId) {
      return res.status(400).json({
        success: false,
        message: 'Bad Request - Todo ID missing'
      })
    }
    const updatedTodo = await TodoServices.updateTodo(todoId, updates)
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      todo: updatedTodo
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Update Todo error:', message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id
    if (!todoId) {
      return res.status(400).json({
        success: false,
        message: 'Bad Request - Todo ID missing'
      })
    }
    await TodoServices.deleteTodo(todoId)
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Delete Todo error:', message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export default {
  getTodoList,
  createTodo,
  getTodosByUser,
  updateTodo,
  deleteTodo
}
