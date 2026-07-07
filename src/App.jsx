/**
 * App.jsx
 * -----------------------------------------------------------------------
 * Root application component. Sets up React Router and renders the
 * shared Navbar across all pages.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Report from './pages/Report'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const auth = useAuth()

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar auth={auth} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login auth={auth} />} />
          </Routes>
        </main>
        <footer className="border-t border-ink-600 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-mist-400">
            DisasterAI — Smart Disaster Response & Emergency Management System
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
