export interface ITodo {
  _id?: string
  title: string
  description: string
  completed: boolean
  userId?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent';  // Độ ưu tiên
  category?: string;               // Danh mục (work, personal, shopping...)
  tags?: string[];                 // Các tag liên quan
  dueDate?: Date | string;         // Ngày hết hạn
  createdAt?: Date | string;       // Ngày tạo
  updatedAt?: Date | string;       // Ngày cập nhật cuối
  completedAt?: Date | string;     // Ngày hoàn thành
}