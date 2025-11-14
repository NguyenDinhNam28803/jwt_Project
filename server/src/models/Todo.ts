import { Schema, model, Types } from 'mongoose'

export interface ITodo {
  title: string
  description: string
  completed: boolean
  userId: Types.ObjectId
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

const Todo = model<ITodo>('Todo', todoSchema)

export default Todo
