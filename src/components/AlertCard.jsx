/**
 * components/AlertCard.jsx
 * -----------------------------------------------------------------------
 * Displays a single disaster report as a compact alert card - used in
 * the Dashboard's "Recent Incidents" list.
 */

import { Flame, Waves, Mountain, Wind, TriangleAlert, MapPin, Clock } from 'lucide-react'

const DISASTER_ICONS = {
  Fire: Flame,
  Flood: Waves,
  Earthquake: TriangleAlert,
  Cyclone: Wind,
  Landslide: Mountain,
  Normal: TriangleAlert,
  Unknown: TriangleAlert,
}

const SEVERITY_STYLES = {
  Critical: 'bg-signal/15 text-signal border-signal/30',
  High: 'bg-amber/15 text-amber border-amber/30',
  Medium: 'bg-cobalt/15 text-cobalt border-cobalt/30',
  Low: 'bg-sage/15 text-sage border-sage/30',
}

const STATUS_STYLES = {
  Pending: 'bg-signal/15 text-signal',
  'In Progress': 'bg-amber/15 text-amber',
  Resolved: 'bg-sage/15 text-sage',
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AlertCard({ report, onClick }) {
  const Icon = DISASTER_ICONS[report.disaster_type] || TriangleAlert
  const severityStyle = SEVERITY_STYLES[report.severity] || SEVERITY_STYLES.Low
  const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.Pending

  return (
    <button
      onClick={onClick}
      className="w-full text-left card p-4 hover:border-ink-500 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${severityStyle}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-mist-100 text-sm">{report.disaster_type}</span>
            <span className={`badge ${statusStyle}`}>{report.status}</span>
          </div>
          <p className="text-sm text-mist-300 line-clamp-2 mb-2">{report.report_text}</p>
          <div className="flex items-center gap-3 text-xs text-mist-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {report.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo(report.created_at)}
            </span>
            <span className={`badge ${severityStyle} !px-2 !py-0.5`}>{report.priority}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
