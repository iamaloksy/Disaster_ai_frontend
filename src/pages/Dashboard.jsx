/**
 * pages/Dashboard.jsx
 * -----------------------------------------------------------------------
 * Authority dashboard. Shows KPI tiles, disaster-type / severity
 * charts, a live incident map, and a filterable, status-updatable
 * list of recent reports.
 */

import { useState, useEffect, useCallback } from 'react'
import { FileText, AlertOctagon, Siren, CheckCircle2, RefreshCw, X } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import PredictionChart from '../components/PredictionChart'
import AlertCard from '../components/AlertCard'
import DisasterMap from '../components/DisasterMap'
import { fetchDashboardStats, fetchReports, updateReportStatus, getBackendUrl } from '../services/api'

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState({ disaster_type: '', severity: '', status: '' })
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [statsData, reportsData] = await Promise.all([
        fetchDashboardStats(),
        fetchReports(Object.fromEntries(Object.entries(filter).filter(([, v]) => v))),
      ])
      setStats(statsData)
      setReports(reportsData)
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (id, status) => {
    setUpdating(true)
    try {
      await updateReportStatus(id, status)
      await load()
      setSelected((s) => (s ? { ...s, status } : s))
    } catch (err) {
      console.error('Failed to update status', err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-mist-100 mb-1">
            Emergency Operations Dashboard
          </h1>
          <p className="text-sm text-mist-400">Live overview of all incoming disaster reports</p>
        </div>
        <button onClick={load} className="btn-secondary !px-4" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI tiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={FileText} label="Total Reports" value={stats?.total_reports ?? '—'} accent="mist" />
        <StatsCard icon={AlertOctagon} label="Critical Cases" value={stats?.critical_cases ?? '—'} accent="signal" />
        <StatsCard icon={Siren} label="Active Emergencies" value={stats?.active_emergencies ?? '—'} accent="amber" />
        <StatsCard icon={CheckCircle2} label="Resolved Cases" value={stats?.resolved_cases ?? '—'} accent="sage" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <PredictionChart type="bar" data={stats?.by_disaster_type} title="Reports by Disaster Type" />
        <PredictionChart type="pie" data={stats?.by_severity} title="Reports by Severity" />
      </div>

      {/* Map */}
      <div className="card p-5 mb-8">
        <h3 className="text-sm font-semibold text-mist-200 mb-4">Live Incident Map</h3>
        <DisasterMap reports={reports} />
      </div>

      {/* Filters + incident list */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-mist-200">Recent Incidents</h3>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filter.disaster_type}
              onChange={(e) => setFilter((f) => ({ ...f, disaster_type: e.target.value }))}
              className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-1.5 text-sm text-mist-200"
            >
              <option value="">All Types</option>
              {['Fire', 'Flood', 'Earthquake', 'Cyclone', 'Landslide', 'Normal'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filter.severity}
              onChange={(e) => setFilter((f) => ({ ...f, severity: e.target.value }))}
              className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-1.5 text-sm text-mist-200"
            >
              <option value="">All Severities</option>
              {['Critical', 'High', 'Medium', 'Low'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
              className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-1.5 text-sm text-mist-200"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-mist-400 text-sm">Loading incidents...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-mist-400 text-sm">
            No incidents match these filters yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {reports.map((report) => (
              <AlertCard key={report.id} report={report} onClick={() => setSelected(report)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-mist-100">{selected.disaster_type} Report</h3>
              <button onClick={() => setSelected(null)} className="text-mist-400 hover:text-mist-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <div className="text-xs text-mist-400 mb-1">Description</div>
                <p className="text-sm text-mist-200">{selected.report_text}</p>
              </div>
              <div>
                <div className="text-xs text-mist-400 mb-1">Location</div>
                <p className="text-sm text-mist-200">{selected.location}</p>
              </div>
              {selected.image_path && (
                <img src={getBackendUrl(`/uploads/${selected.image_path.split('/').pop()}`)} alt="Report" className="rounded-lg border border-ink-600 max-h-48 object-cover" />
              )}
              {selected.ai_guidance && (
                <div className="bg-ink-900 border border-ink-600 rounded-lg p-3">
                  <div className="text-xs text-mist-400 mb-1">AI Guidance</div>
                  <p className="text-xs text-mist-300 whitespace-pre-line">{selected.ai_guidance}</p>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-mist-400 mb-2">Update status</div>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => handleStatusChange(selected.id, status)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      selected.status === status
                        ? 'bg-signal text-white border-signal'
                        : 'bg-ink-900 text-mist-300 border-ink-600 hover:border-mist-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
