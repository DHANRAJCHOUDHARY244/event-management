import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import { useAuth } from './state/AuthContext.jsx'
import { useEffect, useState } from 'react'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function RoleRoute({ children, roles = [] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return roles.includes(user.role) ? children : <Navigate to="/" replace />
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <header className="border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <nav className="max-w-5xl mx-auto p-4 flex gap-4 items-center justify-between">
          <Link to="/" className="font-bold text-xl hover:text-blue-500 transition-colors">EventHub</Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(d => !d)}
              className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <span className="text-sm font-medium">Hello, {user.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-6">
        <Routes>
          <Route path="/" element={
            <div className="py-8 text-center text-lg font-semibold">Welcome to EventHub. 🎉</div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<RoleRoute roles={['admin']}><Admin /></RoleRoute>} />
          <Route path="*" element={<div className="py-8 text-center text-red-500 font-semibold">404: Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}
