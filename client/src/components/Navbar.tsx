import { Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">SecureAuth</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition">
              Đăng nhập
            </button>
          </div>
        </div>
    </nav>
  )
}