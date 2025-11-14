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

export default {
  getTodoList,
  createTodo,
  getTodosByUserId
}
