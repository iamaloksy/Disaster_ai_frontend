/**
 * components/Navbar.jsx
 * -----------------------------------------------------------------------
 * Top navigation bar. Shows the DisasterAI mark, primary nav links,
 * a live-status pill, and login/account state.
 */

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShieldAlert, Menu, X, LogOut, User } from 'lucide-react'

export default function Navbar({ auth }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/report', label: 'Report Emergency' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-600 bg-ink-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <ShieldAlert className="w-7 h-7 text-signal" strokeWidth={2.2} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-signal animate-pulse-slow" />
            </div>
            <span className="font-display font-bold text-lg text-mist-100 tracking-tight">
              Disaster<span className="text-signal">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ink-700 text-mist-100'
                      : 'text-mist-300 hover:text-mist-100 hover:bg-ink-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
                  <User className="w-4 h-4 text-mist-400" />
                  <span className="text-sm text-mist-200">{auth.user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary !px-3 !py-2" aria-label="Log out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Authority Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 text-mist-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-ink-700 text-mist-100' : 'text-mist-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {auth.isAuthenticated ? (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-signal"
              >
                Log out ({auth.user.name})
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-signal">
                Authority Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
