/**
 * components/StatsCard.jsx
 * -----------------------------------------------------------------------
 * KPI tile used at the top of the Dashboard (Total Reports, Critical
 * Cases, Active Emergencies, Resolved Cases).
 */

export default function StatsCard({ icon: Icon, label, value, accent = 'mist', trend }) {
  const accentClasses = {
    signal: 'text-signal bg-signal/10 border-signal/20',
    amber: 'text-amber bg-amber/10 border-amber/20',
    sage: 'text-sage bg-sage/10 border-sage/20',
    cobalt: 'text-cobalt bg-cobalt/10 border-cobalt/20',
    mist: 'text-mist-200 bg-ink-700 border-ink-600',
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-mist-400">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${accentClasses[accent]}`}>
          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-mist-100">{value}</span>
        {trend && <span className="text-xs text-mist-400">{trend}</span>}
      </div>
    </div>
  )
}
