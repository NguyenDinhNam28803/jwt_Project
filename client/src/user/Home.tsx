import { useState, useEffect } from 'react'
import { Lock, Shield, Zap, ArrowRight, Check, Trash2, Plus } from 'lucide-react'
import type { ITodo } from '../../types/Todo'
import TodoService from '../../services/todo.services'
import { useNavigate } from 'react-router-dom'
import { showAlert } from '../utils/swal'

export default function Home() {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')?.toString()
    if (token) {
      setIsLoggedIn(true)
      fetchTodos(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchTodos = async (token: string) => {
    try {
      setLoading(true)
      const data = await TodoService.getTodosByUser(token)
      setTodos(data)
      setError('')
    } catch (err) {
      setError('Không thể tải danh sách công việc')
      showAlert('Lỗi', 'Không thể tải danh sách công việc. Vui lòng thử lại.', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) {
      setError('Tiêu đề không được để trống')
      showAlert('Lỗi', 'Tiêu đề không được để trống', 'error')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const todo = await TodoService.createTodo(token, {
        title: newTodo.title,
        description: newTodo.description,
        completed: false
      })
      setTodos([todo, ...todos])
      setNewTodo({ title: '', description: '' })
      showAlert('Thành công', 'Công việc mới đã được tạo.', 'success')
      setError('')
    } catch (err) {
      setError('Không thể tạo công việc')
      showAlert('Lỗi', 'Không thể tạo công việc mới. Vui lòng thử lại.', 'error')
      console.error(err)
    }
  }

  const handleToggleTodo = async (todo: ITodo) => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !todo._id) return

      const updated = await TodoService.updateTodo(token, todo._id, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => t._id === updated._id ? updated : t))
      showAlert('Thành công', 'Công việc đã được cập nhật.', 'success')
    } catch (err) {
      setError('Không thể cập nhật công việc')
      showAlert('Lỗi', 'Không thể cập nhật công việc. Vui lòng thử lại.', 'error')
      console.error(err)
    }
  }

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await TodoService.deleteTodo(token, todoId)
      setTodos(todos.filter(t => t._id !== todoId))
      showAlert('Thành công', 'Công việc đã được xóa.', 'success')
    } catch (err) {
      setError('Không thể xóa công việc')
      showAlert('Lỗi', 'Không thể xóa công việc. Vui lòng thử lại.', 'error')
      console.error(err)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.reload()
    showAlert('Đăng xuất', 'Bạn đã đăng xuất thành công.', 'success')
    setTodos([])
  }

  // Logged in view with todos
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation */}
        <nav className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Công việc của tôi</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 transition font-semibold"
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Add Todo Form */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Thêm công việc mới</h2>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tiêu đề công việc..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
              <textarea
                placeholder="Mô tả (tùy chọn)..."
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                onClick={handleAddTodo}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Thêm công việc
              </button>
            </div>
          </div>

          {/* Todos List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Danh sách công việc ({todos.length})</h2>
            {loading ? (
              <div className="text-center text-slate-400 py-12">Đang tải...</div>
            ) : todos.length === 0 ? (
              <div className="text-center text-slate-400 py-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl">
                Không có công việc nào. Hãy tạo một công việc mới!
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 flex items-start gap-4 hover:border-blue-500/30 transition group"
                  >
                    <button
                      onClick={() => handleToggleTodo(todo)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-500 hover:border-green-500'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold transition ${
                          todo.completed ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${
                          todo.completed ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => todo._id && handleDeleteTodo(todo._id)}
                      className="flex-shrink-0 p-2 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Not logged in view (public landing page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Hero Section */}
      <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Quản lý công việc <span className="text-blue-500">an toàn</span>
            </h1>
            <p className="text-xl text-slate-300">
              Ứng dụng quản lý danh sách việc cần làm với xác thực JWT an toàn. Dữ liệu của bạn luôn được bảo vệ.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                Bắt đầu ngay <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 rounded-lg border-2 border-slate-500 text-white font-semibold hover:bg-slate-800 transition">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="flex-1 h-2 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </div>
              <div className="pt-6 flex gap-2">
                <div className="h-10 bg-slate-700 rounded w-24"></div>
                <div className="h-10 bg-slate-700 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 backdrop-blur border-y border-slate-700/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-slate-400">Mọi thứ bạn cần để quản lý công việc hiệu quả</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl p-8 hover:border-blue-500/50 transition group">
              <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Bảo mật hàng đầu</h3>
              <p className="text-slate-400">
                Tất cả dữ liệu được mã hóa và bảo vệ bằng JWT authentication.
              </p>
            </div>

            <div className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl p-8 hover:border-blue-500/50 transition group">
              <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quản lý dễ dàng</h3>
              <p className="text-slate-400">
                Giao diện trực quan, dễ sử dụng để tạo và quản lý công việc.
              </p>
            </div>

            <div className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl p-8 hover:border-blue-500/50 transition group">
              <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nhanh & đáng tin</h3>
              <p className="text-slate-400">
                Hiệu suất cao, phản hồi tức thời, luôn sẵn sàng phục vụ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">Sẵn sàng để bắt đầu?</h2>
          <p className="text-xl text-blue-100">
            Tạo tài khoản miễn phí ngay hôm nay và quản lý công việc của bạn.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
          >
            Đăng ký miễn phí <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur border-t border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 SecureAuth Todo. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}