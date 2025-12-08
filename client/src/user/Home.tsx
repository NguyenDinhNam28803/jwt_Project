import { useState, useEffect } from 'react'
import { Lock, Shield, Zap, ArrowRight, Check, Trash2, Plus, Edit2, X, Sparkles } from 'lucide-react'
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
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      const todosWithDefaults = data.map(todo => ({
        ...todo,
        completed: todo.completed ?? false
      }))
      setTodos(todosWithDefaults)
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
        completed: !(todo.completed ?? false)
      })
      setTodos(todos.map(t => t._id === updated._id ? { ...updated, completed: updated.completed ?? false } : t))
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

  const handleEditTodo = (todo: ITodo) => {
    setEditingTodo({ ...todo })
    setIsModalOpen(true)
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo || !editingTodo.title.trim()) {
      setError('Tiêu đề không được để trống')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const updated = await TodoService.updateTodo(token, editingTodo._id || '', editingTodo)
      if (updated) {
        setTodos(todos.map(t => t._id === editingTodo._id ? { ...updated, completed: updated.completed ?? false } : t))
      }
      setIsModalOpen(false)
      setEditingTodo(null)
      showAlert('Thành công', 'Công việc đã được cập nhật.', 'success')
      setError('')
    } catch (err) {
      setError('Không thể cập nhật công việc')
      showAlert('Lỗi', 'Không thể cập nhật công việc. Vui lòng thử lại.', 'error')
      console.error(err)
    }
  }

  // Logged in view with todos
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
        {/* Navigation with glassmorphism */}
        <nav className="backdrop-blur-xl bg-slate-900/60 border-b border-slate-700/30 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-400" />
                <Sparkles className="w-3 h-3 text-blue-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Công việc của tôi
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 font-semibold backdrop-blur-sm"
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Add Todo Form with enhanced design */}
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Thêm công việc mới</h2>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-red-300 text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tiêu đề công việc..."
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Mô tả chi tiết (tùy chọn)..."
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm resize-none"
                  />
                </div>
                <button
                  onClick={handleAddTodo}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Plus className="w-5 h-5" /> Thêm công việc
                </button>
              </div>
            </div>
          </div>

          {/* Todos List with modern cards */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Danh sách công việc</h2>
              <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
                {todos.length} việc
              </div>
            </div>

            {loading ? (
              <div className="text-center text-slate-400 py-12">Đang tải...</div>
            ) : todos.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg">Không có công việc nào</p>
                <p className="text-slate-500 text-sm mt-2">Hãy tạo một công việc mới để bắt đầu!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/30 transition-all duration-300 shadow-lg">
                      <button
                        onClick={() => handleToggleTodo(todo)}
                        className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${(todo.completed ?? false)
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500 shadow-lg shadow-green-500/30'
                          : 'border-slate-600 hover:border-blue-500 hover:bg-blue-500/10'
                          }`}
                      >
                        {(todo?.completed ?? false) && <Check className="w-4 h-4 text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-lg transition-all duration-300 ${(todo.completed ?? false) ? 'text-slate-500 line-through' : 'text-white'
                            }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`text-sm mt-2 leading-relaxed ${(todo.completed ?? false) ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                            {todo.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => handleEditTodo(todo)}
                          className="p-2.5 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all duration-300 border border-transparent hover:border-blue-500/30"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => todo._id && handleDeleteTodo(todo._id)}
                          className="p-2.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && editingTodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-30 blur-xl"></div>
              <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Sửa công việc</h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={editingTodo.title}
                      onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300"
                      placeholder="Tiêu đề công việc..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={editingTodo.description}
                      onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                      rows={4}
                      className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300 resize-none"
                      placeholder="Mô tả chi tiết..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all duration-300 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdateTodo}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Not logged in view (public landing page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      {/* Hero Section */}
      <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-4">
              ✨ Quản lý thông minh
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Quản lý công việc <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">an toàn</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Ứng dụng quản lý danh sách việc cần làm với xác thực JWT an toàn. Dữ liệu của bạn luôn được bảo vệ.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Bắt đầu ngay <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-semibold hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <div className="flex-1 h-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full w-5/6"></div>
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full w-2/3"></div>
              </div>
              <div className="pt-6 flex gap-2">
                <div className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl w-24 opacity-60"></div>
                <div className="h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900/50 backdrop-blur-xl border-y border-slate-700/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-slate-400">Mọi thứ bạn cần để quản lý công việc hiệu quả</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Bảo mật hàng đầu', desc: 'Tất cả dữ liệu được mã hóa và bảo vệ bằng JWT authentication.', color: 'from-blue-500 to-cyan-500' },
              { icon: Shield, title: 'Quản lý dễ dàng', desc: 'Giao diện trực quan, dễ sử dụng để tạo và quản lý công việc.', color: 'from-purple-500 to-pink-500' },
              { icon: Zap, title: 'Nhanh & đáng tin', desc: 'Hiệu suất cao, phản hồi tức thời, luôn sẵn sàng phục vụ.', color: 'from-orange-500 to-red-500' }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-300`}></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-300">
                  <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Sẵn sàng để bắt đầu?</h2>
          <p className="text-xl text-slate-300">
            Tạo tài khoản miễn phí ngay hôm nay và quản lý công việc của bạn.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30">
            Đăng ký miễn phí <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-slate-700/30 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 SecureAuth Todo. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}