import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './user/LoginSignup';
import Home from './user/Home';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import type { UserInfo } from '../types/LoginSignup';
import AuthServices from '../services/auth.services';
import { showAlert } from './utils/swal';
import ProfilePage from './user/Profile';

const authServices = new AuthServices();

function App() {
  const token = localStorage.getItem('token')?.toString()
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const response = await authServices.getUserInfo(token);
          if (response.user) {
            setUser(response.user);
            setIsLogin(true);
          } else {
            console.error('Failed to fetch user info:', response.status);
            showAlert('error', 'Failed to fetch user info');
            setIsLogin(false);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          showAlert('error', 'Error fetching user info');
          setIsLogin(false);
        }
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar user={user?.firstName} isLogin={isLogin}/>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
            <Home />
          </div>
        } />
        <Route path="/login" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <AuthForm />
          </div>
        } />
        <Route path="/profile" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <ProfilePage userInfo={user!} />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
