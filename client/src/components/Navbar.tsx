import { Shield, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar({user, isLogin}: {user?: string, isLogin: boolean}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = (path: string) => {
    window.location.href = path
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  }

  return (
    <nav className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition">
              SecureAuth
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user && isLogin ? (
              <>
                {/* User Profile Button */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user[0].toUpperCase() ?? <User className="w-4 h-4" />}
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition">
                    {user}
                  </span>
                </button>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-500/30"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-4 space-y-3">
            {user && isLogin ? (
              <>
                {/* User Info */}
                <div 
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user}</p>
                    <p className="text-slate-400 text-sm">Xem hồ sơ</p>
                  </div>
                </div>

                {/* Logout */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 transition font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }} 
                className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
              >
                Đăng nhập
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}