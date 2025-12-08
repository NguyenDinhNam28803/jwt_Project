import { Schema, model, Types } from 'mongoose'

export interface ITodo {
  title: string
  description: string
  completed: boolean
  userId: Types.ObjectId
  priority?: 'low' | 'medium' | 'high' | 'urgent' // Độ ưu tiên
  category?: string // Danh mục (work, personal, shopping...)
  tags?: string[] // Các tag liên quan
  dueDate?: Date | string // Ngày hết hạn
  createdAt?: Date | string // Ngày tạo
  updatedAt?: Date | string // Ngày cập nhật cuối
  completedAt?: Date | string // Ngày hoàn thành
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

const Todo = model<ITodo>('Todo', todoSchema)

export default Todo
