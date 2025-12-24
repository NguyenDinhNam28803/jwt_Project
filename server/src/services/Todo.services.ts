import Todo, { ITodo } from '~/models/Todo'

const getTodoList = async () => {
  const todos = await Todo.find()
  return todos
}

const createTodo = async (todoData: ITodo) => {
  const todo = await Todo.create(todoData)
  return todo
}

const getTodosByUserId = async (userId: string) => {
  const todos = await Todo.find({ userId })
  return todos
}

const updateTodo = async (todoId: string, updates: Partial<ITodo>) => {
  const todo = await Todo.findByIdAndUpdate(todoId, updates, { new: true })
  return todo
}

const deleteTodo = async (todoId: string) => {
  await Todo.findByIdAndDelete(todoId)
}

const getTodoById = async (todoId: string) => {
  return await Todo.findById(todoId)
}

export default {
  getTodoList,
  createTodo,
  getTodosByUserId,
  updateTodo,
  deleteTodo,
  getTodoById
}
