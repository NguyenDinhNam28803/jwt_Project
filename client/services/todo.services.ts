import type { ITodo } from '../types/Todo'

const baseURL = 'https://jwt-project-wpry.onrender.com'

class TodoService {

  async getTodosByUser(token: string): Promise<ITodo[]> {
    try {
      if (!token) throw new Error('No token provided');
      const response = await fetch(`${baseURL}/api/user/todos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        const text = await response.text()
        console.error(`Server error (${response.status}):`, text)
        throw new Error(`Failed to fetch todos: ${response.status}`)
      }
      const data = await response.json()
      return data.todos || []
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
  }

  async createTodo(token: string, todo: Omit<ITodo, '_id'>): Promise<ITodo> {
    try {
      const response = await fetch(`${baseURL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(todo)
      })
      if (!response.ok) {
        const text = await response.text()
        console.error(`Server error (${response.status}):`, text)
        throw new Error(`Failed to create todo: ${response.status}`)
      }
      const data = await response.json()
      return data.todo
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  }

  async updateTodo(token: string, todoId: string, updates: Partial<ITodo>): Promise<ITodo> {
    try {
      const response = await fetch(`${baseURL}/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      if (!response.ok) {
        const text = await response.text()
        console.error(`Server error (${response.status}):`, text)
        throw new Error(`Failed to update todo: ${response.status}`)
      }
      const data = await response.json()
      return data.todo
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  async deleteTodo(token: string, todoId: string): Promise<void> {
    try {
      const response = await fetch(`${baseURL}/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        const text = await response.text()
        console.error(`Server error (${response.status}):`, text)
        throw new Error(`Failed to delete todo: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }
}

export default new TodoService()
