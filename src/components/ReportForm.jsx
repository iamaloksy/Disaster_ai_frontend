/**
 * components/ReportForm.jsx
 * -----------------------------------------------------------------------
 * Citizen-facing emergency report submission form. Captures the
 * description, location, and an optional photo, then submits to
 * POST /report and displays the AI's classification + guidance result.
 */

import { useState, useRef } from 'react'
import { Upload, MapPin, Loader2, Send, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { submitReport } from '../services/api'

const SEVERITY_STYLES = {
  Critical: 'text-signal border-signal/30 bg-signal/10',
  High: 'text-amber border-amber/30 bg-amber/10',
  Medium: 'text-cobalt border-cobalt/30 bg-cobalt/10',
  Low: 'text-sage border-sage/30 bg-sage/10',
}

export default function ReportForm() {
  const [form, setForm] = useState({
    reportText: '',
    location: '',
    reporterName: '',
    reporterContact: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setForm((f) => ({ ...f, location: f.location || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }))
      },
      () => { /* silently ignore - user can type location manually */ }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.reportText.trim().length < 3 || !form.location.trim()) {
      setError('Please describe the emergency and provide a location.')
      return
    }
    setSubmitting(true)
    setError(null)
    setResult(null)
    try {
      const data = await submitReport({
        reportText: form.reportText,
        location: form.location,
        lat: coords.lat,
        lng: coords.lng,
        reporterName: form.reporterName || undefined,
        reporterContact: form.reporterContact || undefined,
        image,
      })
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong submitting your report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({ reportText: '', location: '', reporterName: '', reporterContact: '' })
    clearImage()
    setCoords({ lat: null, lng: null })
    setResult(null)
    setError(null)
  }

  if (result) {
    const severityStyle = SEVERITY_STYLES[result.severity] || SEVERITY_STYLES.Low
    return (
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-sage" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-mist-100">Report submitted</h3>
            <p className="text-sm text-mist-400">Report ID: {result.id.slice(0, 8)}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-ink-900 border border-ink-600 rounded-lg p-4">
            <div className="text-xs text-mist-400 mb-1">Disaster Type</div>
            <div className="font-semibold text-mist-100">{result.disaster_type}</div>
            <div className="text-xs text-mist-400 mt-1">{Math.round(result.disaster_confidence * 100)}% confidence</div>
          </div>
          <div className={`rounded-lg p-4 border ${severityStyle}`}>
            <div className="text-xs opacity-80 mb-1">Severity</div>
            <div className="font-semibold">{result.severity}</div>
          </div>
          <div className="bg-ink-900 border border-ink-600 rounded-lg p-4">
            <div className="text-xs text-mist-400 mb-1">Priority</div>
            <div className="font-semibold text-mist-100">{result.priority}</div>
          </div>
        </div>

        {result.ai_guidance && (
          <div className="bg-ink-900 border border-ink-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <span className="text-sm font-semibold text-mist-100">AI Safety Guidance</span>
            </div>
            <p className="text-sm text-mist-300 whitespace-pre-line leading-relaxed">{result.ai_guidance}</p>
          </div>
        )}

        <button onClick={resetForm} className="btn-secondary w-full">
          Submit another report
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      {error && (
        <div className="bg-signal/10 border border-signal/30 rounded-lg px-4 py-3 text-sm text-signal flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="label-field" htmlFor="reportText">Describe the emergency *</label>
        <textarea
          id="reportText"
          name="reportText"
          value={form.reportText}
          onChange={handleChange}
          rows={4}
          placeholder="e.g. There is a fire in the building, people are trapped on the third floor"
          className="input-field resize-none"
          required
        />
      </div>

      <div>
        <label className="label-field" htmlFor="location">Location *</label>
        <div className="flex gap-2">
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Street address, area, or city"
            className="input-field"
            required
          />
          <button type="button" onClick={useMyLocation} className="btn-secondary !px-3 shrink-0" title="Use my current location">
            <MapPin className="w-4 h-4" />
          </button>
        </div>
        {coords.lat && (
          <p className="text-xs text-sage mt-1.5">GPS location captured ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-field" htmlFor="reporterName">Your name (optional)</label>
          <input id="reporterName" name="reporterName" value={form.reporterName} onChange={handleChange} placeholder="Full name" className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="reporterContact">Contact number (optional)</label>
          <input id="reporterContact" name="reporterContact" value={form.reporterContact} onChange={handleChange} placeholder="Phone number" className="input-field" />
        </div>
      </div>

      <div>
        <label className="label-field">Upload photo (optional)</label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-40 rounded-lg border border-ink-600 object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-signal flex items-center justify-center"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-ink-600 rounded-lg py-8 flex flex-col items-center gap-2 text-mist-400 hover:border-mist-500 hover:text-mist-300 transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm">Click to upload an image of the incident</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} className="hidden" />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing & submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Emergency Report
          </>
        )}
      </button>
    </form>
  )
}
