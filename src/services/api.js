/**
 * services/api.js
 * -----------------------------------------------------------------------
 * Centralised Axios instance and API call helpers for the DisasterAI
 * backend. In development the Vite dev-server proxy forwards /api to
 * the FastAPI backend at http://localhost:8000. In production, set
 * VITE_BACKEND_URL to the backend origin so the frontend can talk to
 * a separately deployed API and fetch uploaded images from the same
 * origin.
 */

import axios from 'axios'

const backendOrigin = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || ''
const apiBaseURL = backendOrigin ? `${backendOrigin}/api` : '/api'

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
})

export const getBackendUrl = (path) => {
  if (!backendOrigin) return path
  return `${backendOrigin}${path.startsWith('/') ? path : `/${path}`}`
}

// Attach JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('disasterai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ----------------------------------------------------------------------
// Disaster text classification
// ----------------------------------------------------------------------
export const predictDisasterType = async (text) => {
  const { data } = await api.post('/predict-disaster', { text })
  return data
}

// ----------------------------------------------------------------------
// Severity prediction
// ----------------------------------------------------------------------
export const predictSeverity = async (payload) => {
  const { data } = await api.post('/predict-severity', payload)
  return data
}

// ----------------------------------------------------------------------
// Image classification
// ----------------------------------------------------------------------
export const predictImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await api.post('/predict-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// ----------------------------------------------------------------------
// Generative AI guidance
// ----------------------------------------------------------------------
export const generateGuidance = async (disasterType, severity, context) => {
  const { data } = await api.post('/generate-guidance', {
    disaster_type: disasterType,
    severity,
    context,
  })
  return data
}

// ----------------------------------------------------------------------
// Reports
// ----------------------------------------------------------------------
export const submitReport = async ({ reportText, location, lat, lng, reporterName, reporterContact, image }) => {
  const formData = new FormData()
  formData.append('report_text', reportText)
  formData.append('location', location)
  if (lat !== undefined && lat !== null) formData.append('lat', lat)
  if (lng !== undefined && lng !== null) formData.append('lng', lng)
  if (reporterName) formData.append('reporter_name', reporterName)
  if (reporterContact) formData.append('reporter_contact', reporterContact)
  if (image) formData.append('image', image)

  const { data } = await api.post('/report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const fetchReports = async (filters = {}) => {
  const { data } = await api.get('/reports', { params: filters })
  return data
}

export const fetchReport = async (id) => {
  const { data } = await api.get(`/reports/${id}`)
  return data
}

export const updateReportStatus = async (id, status) => {
  const { data } = await api.patch(`/reports/${id}/status`, { status })
  return data
}

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard-stats')
  return data
}

// ----------------------------------------------------------------------
// Auth
// ----------------------------------------------------------------------
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

export default api
