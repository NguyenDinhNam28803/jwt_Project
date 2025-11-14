import { useState } from 'react';
import { User, Mail, Lock, UserCircle } from 'lucide-react';
import AuthServices from '../../services/auth.services';
import type { LoginProps } from '../../types/LoginSignup';
import type { SignupProps } from '../../types/LoginSignup';
import { showAlert } from '../utils/swal';

const authservices = new AuthServices();

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginData, setLoginData] = useState<LoginProps>({ username: '', password: '' });
  const [signupData, setSignupData] = useState<SignupProps>({ username: '', password: '', confirmPassword: '', email: '', firstName: '', lastName: '' });

  const HandleNewUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, username: e.target.value });
  }

  const HandleNewEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, email: e.target.value });
  }

  const HandleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, password: e.target.value });
  }

  const HandleConfirmNewPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, confirmPassword: e.target.value });
  }

  const HandleNewFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, firstName: e.target.value });
  }

  const HandleNewLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, lastName: e.target.value });
  }

  const HandleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authservices.signup(signupData);
      if (response.success == true) {
        showAlert(`Welcome new customer`,'Signup successful', 'success');
        await authservices.login({ username: signupData.username, password: signupData.password });
        console.log(response);
      }
      else {
        showAlert('Signup failed !', response.message, 'error');
      }
    } catch (error) {
      showAlert('Signup failed !',`Signup failed: ${error}`, 'error');
    }
  }

  const HandleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, password: e.target.value });
  }

  const HandleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, username: e.target.value });
  } 

  const Login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authservices.login(loginData);
      if (response.token) {
        showAlert('Welcome back !','Login successful', 'success');
        localStorage.setItem('token', response.token);
        window.location.href = '/';
        console.log(response);
      } 
      else {
        showAlert('Login failed !','Invalid username or password', 'error');
      }
    } catch (error) {
      showAlert('Login failed !',`Login failed: ${error}`, 'error');
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="p-8">
          {mode === 'login' ? (
            <form className="space-y-5" onSubmit={Login}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email hoặc Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={HandleChangeUserName}
                    placeholder="Nhập email hoặc username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={HandleChangePass}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                Đăng nhập
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={HandleSignup}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={signupData.lastName}
                      onChange={HandleNewLastName}
                      placeholder="Họ"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    value={signupData.firstName}
                    onChange={HandleNewFirstName}
                    placeholder="Tên"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={signupData.username}
                    onChange={HandleNewUserName}
                    placeholder="Chọn username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={HandleNewEmail}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={HandleNewPassword}
                    placeholder="Tạo mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={HandleConfirmNewPass}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                Đăng ký
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>

              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
