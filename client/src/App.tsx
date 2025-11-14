import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './user/LoginSignup';
import Home from './user/Home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <Home />
          </div>
        } />
        <Route path="/login" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <AuthForm />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
