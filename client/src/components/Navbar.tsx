import { Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar({user, isLogin}: {user?: string, isLogin: boolean}) {
  const navigate = useNavigate()
  return (
    <nav className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span onClick={() => navigate('/')} className="text-xl font-bold text-white cursor-pointer">SecureAuth</span>
          </div>
          <div className="flex gap-4">
            {user && isLogin ? (
              <>
                <span className="text-white">Xin chào, {user}</span>
                <button onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                  window.location.reload();
                }} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition">
                  Đăng xuất
                </button>
              </>
            ) : 
            <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition">
              Đăng nhập
            </button>}
          </div>
        </div>
    </nav>
  )
}