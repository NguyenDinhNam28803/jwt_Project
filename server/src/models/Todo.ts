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
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },

  completed: {
    type: Boolean,
    default: false,
    index: true // Index for filtering
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for user queries
  },

  // Priority & Organization
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    lowercase: true
  },

  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'general'
  },

  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (tags: string[]) {
        return tags.length <= 10 // Max 10 tags
      },
      message: 'Cannot have more than 10 tags'
    }
  },

  // Date fields
  dueDate: {
    type: Date,
    default: null,
    index: true // Index for due date queries
  },

  completedAt: {
    type: Date,
    default: null
  },
})

const Todo = model<ITodo>('Todo', todoSchema)

export default Todo
