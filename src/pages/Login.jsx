/**
 * pages/Login.jsx
 * -----------------------------------------------------------------------
 * Authority/admin login page. Uses the useAuth hook to authenticate
 * against POST /auth/login.
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldAlert, Loader2, AlertTriangle } from 'lucide-react'

export default function Login({ auth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await auth.login(email, password)
      navigate('/dashboard')
    } catch {
      // error already captured in auth.error
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-signal/10 border border-signal/20 items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7 text-signal" />
          </div>
          <h1 className="font-display font-bold text-2xl text-mist-100 mb-1">Authority Login</h1>
          <p className="text-sm text-mist-400">Access the disaster response dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          {auth.error && (
            <div className="bg-signal/10 border border-signal/30 rounded-lg px-4 py-3 text-sm text-signal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {auth.error}
            </div>
          )}

          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@disasterai.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={auth.loading} className="btn-primary w-full !py-3">
            {auth.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
          </button>

          <p className="text-xs text-mist-400 text-center">
            Default demo credentials: <span className="font-mono text-mist-300">admin@disasterai.com</span> / <span className="font-mono text-mist-300">Admin@123</span>
          </p>
        </form>

        <p className="text-center text-sm text-mist-400 mt-6">
          Just need to report an emergency?{' '}
          <Link to="/report" className="text-signal hover:underline">No login required →</Link>
        </p>
      </div>
    </div>
  )
}
