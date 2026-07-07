/**
 * hooks/useAuth.js
 * -----------------------------------------------------------------------
 * Simple authentication hook backed by localStorage + JWT. Provides
 * login/logout helpers and the current user object.
 */

import { useState, useEffect, useCallback } from 'react'
import { login as loginApi, fetchCurrentUser } from '../services/api'

const TOKEN_KEY = 'disasterai_token'
const USER_KEY = 'disasterai_user'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginApi(email, password)
      localStorage.setItem(TOKEN_KEY, data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch (err) {
      const message = err?.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const isAuthenticated = !!user

  return { user, isAuthenticated, loading, error, login, logout }
}
